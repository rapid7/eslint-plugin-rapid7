const test = require('ava');
const {RuleTester} = require('eslint');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
});

const ruleName = 'named-import-newline';
const ruleFile = require('lib/rules/named-import-newline');

test('if the rule will validate the basic usage', t => {
  try {
    ruleTester.run(ruleName, ruleFile, {
      valid: [
        {
          code: `
  import {
    foo,
    bar,
    baz
  } from "package";`,
        },
      ],
      invalid: [
        {
          code: 'import {foo, bar, baz} from "package";',
          errors: [
            {
              message: 'Imported properties must go on a new line.',
            },
            {
              message: 'Imported properties must go on a new line.',
            },
          ],
          output: 'import {foo,\nbar,\nbaz} from "package";',
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error.message);
  }
});

test('if the rule will validate the usage with aliasing', t => {
  try {
    ruleTester.run(ruleName, ruleFile, {
      valid: [
        {
          code: `
  import {
    foo,
    bar as quz,
    baz
  } from "package";`,
        },
      ],
      invalid: [
        {
          code: 'import {foo, bar as quz, baz} from "package";',
          errors: [
            {
              message: 'Imported properties must go on a new line.',
            },
            {
              message: 'Imported properties must go on a new line.',
            },
          ],
          output: 'import {foo,\nbar as quz,\nbaz} from "package";',
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error.message);
  }
});

test('if the rule will validate the usage where multiple properties are allow per line', t => {
  try {
    ruleTester.run(ruleName, ruleFile, {
      valid: [
        {
          code: `
  import {
    foo, bar, baz
  } from "package";`,
          options: [
            {
              allowMultipleImportsPerLine: true,
            },
          ],
        },
      ],
      invalid: [
        {
          code: 'import {foo, bar, baz} from "package";',
          errors: [
            {
              message: 'Imported properties must go on a new line.',
            },
            {
              message: 'Imported properties must go on a new line.',
            },
          ],
          output: 'import {foo,\nbar,\nbaz} from "package";',
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error.message);
  }
});
