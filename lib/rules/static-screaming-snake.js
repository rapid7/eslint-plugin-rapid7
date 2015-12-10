/**
 * @fileoverview Rule requiring that static properties on classes be in screaming snake case
 * @author Ben Tesser
 * @copyright 2015 Rapid7. All rights reserved.
 */

'use strict';

/**
 * @typedef {ESTree.Node} ASTNode
 */
/**
 * @param {RuleContext} context
 * @returns {{ClassProperty: staticScreamingSnake}}
 */
function theExport(context) {
  /**
   * Checks if a string is all uppercase
   * @param {String} name The string to check.
   * @returns {boolean} if the string is uppercase
   * @private
   */
  function isScreamingSnake(name) {
    return name === name.toUpperCase();
  }

  /**
   * Gets the property name from a class property node
   * @param {ASTNode} node The node to get the property name from
   * @returns {String} The property name
   */
  function getPropertyName(node) {
    var tokens = context.getFirstTokens(node, 2);
    return tokens[1] && tokens[1].type === 'Identifier' ? tokens[1].value : tokens[0].value;
  }

  /**
   * Reports an AST node as a rule violation.
   * @param {ASTNode} node The node to report.
   * @private
   */
  function report(node) {
    var name = getPropertyName(node);

    context.report(node, 'Static class property \'{{name}}\' is not in screaming snake case.', {name: name});
  }

  /**
   * The rule to apply
   * @param {ASTNode} node
   */
  function staticScreamingSnake(node) {
    if (node.static && !isScreamingSnake(getPropertyName(node))) {
      report(node);
    }
  }

  return {
    ClassProperty: staticScreamingSnake
  };
}

var OBJECT = 'object';

theExport.schema = [
  {
    type: OBJECT,
    properties: {},
    additionalProperties: false
  }
];

module.exports = theExport;
