// external dependencies
var astUtils = require('eslint/lib/ast-utils');
var naturalCompare = require('natural-compare');

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * @function getPropertyName
 *
 * @private
 *
 * @description
 * Gets the property name of the given `Property` node.
 *
 * - If the property's key is an `Identifier` node, this returns the key's name
 *   whether it's a computed property or not.
 * - If the property has a static name, this returns the static name.
 * - Otherwise, this returns null.
 *
 * @param {ASTNode} node - The `Property` node to get.
 * @returns {string|null} The property name or null.
 */
function getPropertyName(node) {
  return astUtils.getStaticPropertyName(node) || node.key.name || null;
}

function getSortingPropertyName(property) {
  if (property.type === 'ExperimentalSpreadProperty') {
    return `...${property.argument.name}`;
  }

  if (property.key.type === 'Literal') {
    return property.key.value;
  }

  if (property.key.type === 'Identifier') {
    return property.key.name;
  }
}

/**
 * @function isSpreadOperator
 *
 * @private
 *
 * @description
 * is the string passed a spread operator
 *
 * @param {string} string the string to test
 * @returns {boolean} is the string a spread operator
 */
function isSpreadOperator(string) {
  return string ? string.slice(0, 3) === '...' : false;
}

/**
 * @constant {Object} SORTERS
 *
 * @description
 * Functions which check that the given 2 names are in specific order.
 *
 * Postfix `I` is meant insensitive.
 * Postfix `N` is meant natual.
 *
 * @private
 */
var SORTERS = {
  asc(a, b) {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }

    return 0;
  },
  ascI(a, b) {
    return SORTERS.asc(typeof a === 'string' ? a.toLowerCase() : a, typeof b === 'string' ? b.toLowerCase() : b);
  },
  ascIN(a, b) {
    return naturalCompare(typeof a === 'string' ? a.toLowerCase() : a, typeof b === 'string' ? b.toLowerCase() : b);
  },
  ascN(a, b) {
    return naturalCompare(a, b);
  },
  desc(a, b) {
    return SORTERS.asc(b, a);
  },
  descI(a, b) {
    return SORTERS.ascI(b, a);
  },
  descIN(a, b) {
    return SORTERS.ascIN(b, a);
  },
  descN(a, b) {
    return SORTERS.ascN(b, a);
  },
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  create(context) {
    // Parse options.
    var order = context.options[0] || 'asc';
    var options = context.options[1];
    var insensitive = (options && options.caseSensitive) === false;
    var natual = Boolean(options && options.natural);
    var sorter = SORTERS[`${order}${(insensitive ? 'I' : '') + (natual ? 'N' : '')}`];
    var sourceCode = context.getSourceCode();

    // The stack to save the previous property's name for each object literals.
    var stack = null;

    return {
      ObjectExpression() {
        stack = {
          prevName: null,
          upper: stack,
        };
      },

      'ObjectExpression:exit': function() {
        stack = stack.upper;
      },

      Property(node) {
        if (node.parent.type === 'ObjectPattern') {
          return;
        }

        var propertyNames = node.parent.properties.map(function(property) {
          return property.key ? property.key.name : `...${property.argument.name}`;
        });
        var thisName = getPropertyName(node);
        var matchingIndex = propertyNames.findIndex(function(name) {
          return name === thisName;
        });
        var prevName = stack.prevName;

        stack.prevName = thisName || prevName;

        var shouldIgnoreOrder = matchingIndex > 0 && isSpreadOperator(propertyNames[matchingIndex - 1]);

        if (!prevName || !thisName) {
          return;
        }

        if (!shouldIgnoreOrder && sorter(prevName, thisName) > 0) {
          context.report({
            data: {
              insensitive: insensitive ? 'insensitive ' : '',
              natual: natual ? 'natural ' : '',
              order,
              prevName,
              thisName,
            },
            fix(fixer) {
              var propertyListIncludesComments = node.parent.properties.some(function(property) {
                return property.leadingComments || property.trailingComments;
              });

              if (propertyListIncludesComments) {
                return null;
              }

              var rangeStart = node.parent.properties[0].range[0];
              var rangeEnd = node.parent.properties[node.parent.properties.length - 1].range[1];

              var newPropertiesText = node.parent.properties
                .map(function(property) {
                  return {
                    columnOffset: property.loc.start.column,
                    name: getSortingPropertyName(property),
                    nodeText: sourceCode.getText().slice(property.range[0], property.range[1]),
                  };
                })
                .reduce(function(groups, property) {
                  var lastGroup = groups[groups.length - 1];

                  if (!lastGroup || isSpreadOperator(property.name) || isSpreadOperator(lastGroup[0].name)) {
                    groups.push([property]);
                  } else {
                    lastGroup.push(property);
                  }

                  return groups;
                }, [])
                .map(function(propertiesGroup) {
                  return propertiesGroup.sort(function(property0, property1) {
                    return sorter(property0.name, property1.name);
                  });
                })
                .reduce(function(flattenedProperties, propertiesGroup) {
                  return flattenedProperties.concat(propertiesGroup), [];
                })
                .map(function(property) {
                  return property.nodeText;
                })
                .join(',\n');

              return fixer.replaceTextRange([rangeStart, rangeEnd], newPropertiesText);
            },
            loc: node.key.loc,
            message:
              "Expected object keys to be in {{natual}}{{insensitive}}{{order}}ending order. '{{thisName}}' should be before '{{prevName}}'.",
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'require object keys to be sorted',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {enum: ['asc', 'desc']},
      {
        additionalProperties: false,
        properties: {
          caseSensitive: {type: 'boolean'},
          natural: {type: 'boolean'},
        },
        type: 'object',
      },
    ],
  },
};
