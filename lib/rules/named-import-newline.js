module.exports = {
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'enforce placing named imports on separate lines',
      recommended: false,
    },

    schema: [
      {
        additionalProperties: false,
        properties: {
          allowMultipleImportsPerLine: {type: 'boolean'},
        },
        type: 'object',
      },
    ],

    fixable: 'whitespace',
  },

  create(context) {
    var allowSameLine = context.options[0] && Boolean(context.options[0].allowMultipleImportsPerLine);
    var sourceCode = context.getSourceCode();

    return {
      // import {y} from 'x'
      ImportDeclaration(node) {
        var errorMessage = allowSameLine
          ? "Imported properties must go on a new line if they aren't all on the same line."
          : 'Imported properties must go on a new line.';

        var specifiers = node.specifiers.filter(function(specifier) {
          return specifier.imported;
        });

        if (allowSameLine) {
          if (node.specifiers.length > 1) {
            var firstTokenOfFirstProperty = sourceCode.getFirstToken(specifiers[0]);
            var lastTokenOfLastProperty = sourceCode.getLastToken(specifiers[specifiers.length - 1]);

            if (firstTokenOfFirstProperty.loc.end.line === lastTokenOfLastProperty.loc.start.line) {
              // All keys and values are on the same line
              return;
            }
          }
        }

        for (var i = 1; i < specifiers.length; i++) {
          var lastTokenOfPreviousProperty = sourceCode.getLastToken(specifiers[i - 1]);
          var firstTokenOfCurrentProperty = sourceCode.getFirstToken(specifiers[i]);

          if (lastTokenOfPreviousProperty.loc.end.line === firstTokenOfCurrentProperty.loc.start.line) {
            context.report({
              fix(fixer) {
                var comma = sourceCode.getTokenBefore(firstTokenOfCurrentProperty);
                var rangeAfterComma = [comma.range[1], firstTokenOfCurrentProperty.range[0]];

                // Don't perform a fix if there are any comments between the comma and the next property.
                if (sourceCode.text.slice(rangeAfterComma[0], rangeAfterComma[1]).trim()) {
                  return null;
                }

                return fixer.replaceTextRange(rangeAfterComma, '\n');
              },
              loc: firstTokenOfCurrentProperty.loc.start,
              message: errorMessage,
              node: node,
            });
          }
        }
      },
    };
  },
};
