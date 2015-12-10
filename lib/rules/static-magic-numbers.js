/**
 * @fileoverview Rule allowing magic numbers on static variables
 * @author Ben Tesser
 * @copyright 2015 Rapid7. All rights reserved.
 */

'use strict';

/**
 * Rule definition
 * @param {RuleContext} context
 * @returns {{Literal: staticMagicNumbers}}
 */
function moduleExport(context) {
  var config = context.options[0] || {},
      ignore = config.ignore || [],
      detectObjects = !!config.detectObjects,
      enforceConst = !!config.enforceConst,
      allowStatic = !!config.allowStatic,
      detectClassProperties = !!config.detectClassProperties;

  /**
   * Returns whether the node is number literal
   * @param {ASTNode} node - the node literal being evaluated
   * @returns {Boolean} true if the node is a number literal
   */
  function isNumber(node) {
    return typeof node.value === 'number';
  }

  /**
   * Returns whether the number should be ignored
   * @param {Number} num - the number
   * @returns {Boolean} true if the number should be ignored
   */
  function shouldIgnoreNumber(num) {
    return ignore.indexOf(num) !== -1;
  }

  /**
   * Rule
   * @param {ASTNode} node
   */
  function staticMagicNumbers(node) {
    var parent = node.parent,
        value = node.value,
        raw = node.raw,
        okTypes = detectObjects ? [] : ['ObjectExpression', 'Property', 'AssignmentExpression'],
        error;

    if (!isNumber(node)) {
      return;
    }

    if (parent.type === 'UnaryExpression' && parent.operator === '-') {
      node = parent;
      parent = node.parent;
      value = -value;
      raw = '-' + raw;
    }

    if (shouldIgnoreNumber(value)) {
      return;
    }

    // don't warn on parseInt() or Number.parseInt() radix
    if (parent.type === 'CallExpression' && node === parent['arguments'][1] &&
        (parent.callee.name === 'parseInt' ||
        parent.callee.type === 'MemberExpression' &&
        parent.callee.object.name === 'Number' &&
        parent.callee.property.name === 'parseInt')
    ) {
      return;
    }

    if (parent.type === 'VariableDeclarator') {
      if (enforceConst && parent.parent.kind !== 'const') {
        error = 'Number constants must use \'const\': ' + raw;
      }
    } else if (parent.type === 'ClassProperty') {
      if (detectClassProperties) {
        if (allowStatic && !parent.static) {
          error = 'No non-static (instance) number class properties: ' + raw;
        } else if (!allowStatic) {
          error = 'No number class properties: ' + raw;
        }
      }
    } else if (okTypes.indexOf(parent.type) === -1) {
      error = 'No magic number: ' + raw;
    }

    if (error) {
      context.report({
        node: node,
        message: error
      });
    }
  }

  return {
    'Literal': staticMagicNumbers
  };
}

var BOOLEAN = 'boolean',
    OBJECT = 'object',
    ARRAY = 'array',
    NUMBER = 'number';

moduleExport.schema = [
  {
    type: OBJECT,
    properties: {
      detectObjects: {
        type: BOOLEAN
      },
      detectClassProperties: {
        type: BOOLEAN
      },
      enforceConst: {
        type: BOOLEAN
      },
      allowStatic: {
        type: BOOLEAN
      },
      ignore: {
        type: ARRAY,
        items: {
          type: NUMBER
        },
        uniqueItems: true
      }
    },
    additionalProperties: false
  }
];

module.exports = moduleExport;
