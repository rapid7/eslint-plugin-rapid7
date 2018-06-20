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
    const allowSameLine = context.options[0] && Boolean(context.options[0].allowMultipleImportsPerLine);
    const applyToDestructuring = context.options[0] && Boolean(context.options[0].applyToDestructuring);

    const sourceCode = context.getSourceCode();

    return {
      // import {y} from 'x'
      ImportDeclaration(node) {
        const errorMessage = allowSameLine
          ? "Imported properties must go on a new line if they aren't all on the same line."
          : 'Imported properties must go on a new line.';

        if (allowSameLine) {
          if (node.specifiers.length > 1) {
            const firstTokenOfFirstProperty = sourceCode.getFirstToken(node.specifiers[0]);
            const lastTokenOfLastProperty = sourceCode.getLastToken(node.specifiers[node.specifiers.length - 1]);

            if (firstTokenOfFirstProperty.loc.end.line === lastTokenOfLastProperty.loc.start.line) {
              // All keys and values are on the same line
              return;
            }
          }
        }

        for (let i = 1; i < node.specifiers.length; i++) {
          const lastTokenOfPreviousProperty = sourceCode.getLastToken(node.specifiers[i - 1]);
          const firstTokenOfCurrentProperty = sourceCode.getFirstToken(node.specifiers[i]);

          if (lastTokenOfPreviousProperty.loc.end.line === firstTokenOfCurrentProperty.loc.start.line) {
            context.report({
              fix(fixer) {
                const comma = sourceCode.getTokenBefore(firstTokenOfCurrentProperty);
                const rangeAfterComma = [comma.range[1], firstTokenOfCurrentProperty.range[0]];

                // Don't perform a fix if there are any comments between the comma and the next property.
                if (sourceCode.text.slice(rangeAfterComma[0], rangeAfterComma[1]).trim()) {
                  return null;
                }

                return fixer.replaceTextRange(rangeAfterComma, '\n');
              },
              loc: firstTokenOfCurrentProperty.loc.start,
              message: errorMessage,
              node,
            });
          }
        }
      },
    };
  },
};
