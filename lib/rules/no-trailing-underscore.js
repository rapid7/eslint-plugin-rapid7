//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  create(context) {
    var options = context.options[0] || {};
    var ALLOWED_VARIABLES = options.allow ? options.allow : [];
    var allowAfterThis = typeof options.allowAfterThis !== 'undefined' ? options.allowAfterThis : false;
    var allowAfterSuper = typeof options.allowAfterSuper !== 'undefined' ? options.allowAfterSuper : false;
    var enforceInMethodNames =
      typeof options.enforceInMethodNames !== 'undefined' ? options.enforceInMethodNames : false;
    var enforceInPropertyNames =
      typeof options.enforceInPropertyNames !== 'undefined' ? options.enforceInPropertyNames : false;

    //-------------------------------------------------------------------------
    // Helpers
    //-------------------------------------------------------------------------

    /**
     * Check if identifier is present inside the allowed option
     *
     * @param {string} identifier name of the node
     * @returns {boolean} true if its is present
     * @private
     */
    function isAllowed(identifier) {
      return ALLOWED_VARIABLES.some(function(ident) {
        return ident === identifier;
      });
    }

    /**
     * Check if identifier has a underscore at the end
     *
     * @param {ASTNode} identifier node to evaluate
     * @returns {boolean} true if its is present
     * @private
     */
    function hasTrailingUnderscore(identifier) {
      var len = identifier.length;

      return identifier !== '_' && identifier[len - 1] === '_';
    }

    /**
     * Check if identifier is a special case member expression
     *
     * @param {ASTNode} identifier node to evaluate
     * @returns {boolean} true if its is a special case
     * @private
     */
    function isSpecialCaseIdentifierForMemberExpression(identifier) {
      return identifier === '__proto__';
    }

    /**
     * Check if identifier is a special case variable expression
     *
     * @param {ASTNode} identifier node to evaluate
     * @returns {boolean} true if its is a special case
     * @private
     */
    function isSpecialCaseIdentifierInVariableExpression(identifier) {
      // Checks for the underscore library usage here
      return identifier === '_';
    }

    /**
     * Check if function has a underscore at the end
     *
     * @param {ASTNode} node node to evaluate
     * @returns {void}
     * @private
     */
    function checkForTrailingUnderscoreInFunctionDeclaration(node) {
      if (node.id) {
        var identifier = node.id.name;

        if (typeof identifier !== 'undefined' && hasTrailingUnderscore(identifier) && !isAllowed(identifier)) {
          context.report({
            data: {
              identifier,
            },
            message: "Unexpected trailing '_' in '{{identifier}}'.",
            node,
          });
        }
      }
    }

    /**
     * Check if variable expression has a underscore at the end
     *
     * @param {ASTNode} node node to evaluate
     * @returns {void}
     * @private
     */
    function checkForTrailingUnderscoreInVariableExpression(node) {
      var identifier = node.id.name;

      if (
        typeof identifier !== 'undefined' &&
        hasTrailingUnderscore(identifier) &&
        !isSpecialCaseIdentifierInVariableExpression(identifier) &&
        !isAllowed(identifier)
      ) {
        context.report({
          data: {
            identifier,
          },
          message: "Unexpected trailing '_' in '{{identifier}}'.",
          node,
        });
      }
    }

    /**
     * Check if member expression has a underscore at the end
     *
     * @param {ASTNode} node node to evaluate
     * @returns {void}
     * @private
     */
    function checkForTrailingUnderscoreInMemberExpression(node) {
      var identifier = node.property.name;
      var isMemberOfThis = node.object.type === 'ThisExpression';
      var isMemberOfSuper = node.object.type === 'Super';

      if (
        typeof identifier !== 'undefined' &&
        hasTrailingUnderscore(identifier) &&
        !(isMemberOfThis && allowAfterThis) &&
        !(isMemberOfSuper && allowAfterSuper) &&
        !isSpecialCaseIdentifierForMemberExpression(identifier) &&
        !isAllowed(identifier)
      ) {
        context.report({
          data: {
            identifier,
          },
          message: "Unexpected trailing '_' in '{{identifier}}'.",
          node,
        });
      }
    }

    /**
     * Check if method declaration or method property has a underscore at the end
     * @param {ASTNode} node node to evaluate
     * @returns {void}
     * @private
     */
    function checkForTrailingUnderscoreInMethod(node) {
      var identifier = node.key.name;
      var isMethod = node.type === 'MethodDefinition' || (node.type === 'Property' && node.method);

      if (typeof identifier !== 'undefined' && enforceInMethodNames && isMethod && hasTrailingUnderscore(identifier)) {
        context.report({
          data: {
            identifier,
          },
          message: "Unexpected trailing '_' in '{{identifier}}'.",
          node,
        });
      }
    }

    /**
     * Check if method declaration or method property has a underscore at the end
     * @param {ASTNode} node node to evaluate
     * @returns {void}
     * @private
     */
    function checkForTrailingUnderscoreInProperty(node) {
      var identifier = node.key.name;
      var isProperty = node.type === 'Property';

      if (
        typeof identifier !== 'undefined' &&
        enforceInPropertyNames &&
        isProperty &&
        hasTrailingUnderscore(identifier)
      ) {
        context.report({
          data: {
            identifier,
          },
          message: "Unexpected trailing '_' in '{{identifier}}'.",
          node,
        });
      }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
      FunctionDeclaration: checkForTrailingUnderscoreInFunctionDeclaration,
      MemberExpression: checkForTrailingUnderscoreInMemberExpression,
      MethodDefinition: checkForTrailingUnderscoreInMethod,
      Property: checkForTrailingUnderscoreInProperty,
      VariableDeclarator: checkForTrailingUnderscoreInVariableExpression,
    };
  },
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'disallow trailing underscores in identifiers',
    },

    schema: [
      {
        additionalProperties: false,
        properties: {
          allow: {
            items: {
              type: 'string',
            },
            type: 'array',
          },
          allowAfterSuper: {
            type: 'boolean',
          },
          allowAfterThis: {
            type: 'boolean',
          },
          enforceInMethodNames: {
            type: 'boolean',
          },
          enforceInPropertyNames: {
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
  },
};
