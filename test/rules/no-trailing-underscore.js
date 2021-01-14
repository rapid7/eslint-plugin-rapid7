const test = require('ava');
const {RuleTester} = require('eslint');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
});

const ruleName = 'no-trailing-underscore';
const ruleFile = require('lib/rules/no-trailing-underscore');

test('if the rule will validate the variable usage', t => {
  try {
    ruleTester.run(ruleName, ruleFile, {
      valid: [
        {
          code: 'const foo = "foo";',
        },
      ],
      invalid: [
        {
          code: 'const foo_ = "foo";',
          errors: [
            {
              message: "Unexpected trailing '_' in 'foo_'.",
              type: 'VariableDeclarator',
            },
          ],
        },
      ],
    });
    t.pass();
  } catch (error) {
    t.fail(error.message);
  }
});

test('if the rule will validate the function usage', t => {
  try {
    ruleTester.run(ruleName, ruleFile, {
      valid: [
        {
          code: 'function foo() {}',
        },
      ],
      invalid: [
        {
          code: 'function foo_() {}',
          errors: [
            {
              message: "Unexpected trailing '_' in 'foo_'.",
              type: 'FunctionDeclaration',
            },
          ],
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error.message);
  }
});

test('if the rule will validate the object value property usage', t => {
  try {
    ruleTester.run(ruleName, ruleFile, {
      valid: [
        {
          code: 'object.foo;',
        },
      ],
      invalid: [
        {
          code: 'object.foo_;',
          errors: [
            {
              message: "Unexpected trailing '_' in 'foo_'.",
              type: 'MemberExpression',
            },
          ],
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error.message);
  }
});

test('if the rule will validate the object class method usage', t => {
  try {
    ruleTester.run(ruleName, ruleFile, {
      valid: [
        {
          code: 'class Bar {foo() {}}',
          options: [{enforceInMethodNames: true}],
        },
      ],
      invalid: [
        {
          code: 'class Bar {foo_() {}}',
          options: [{enforceInMethodNames: true}],
          errors: [
            {
              message: "Unexpected trailing '_' in 'foo_'.",
              type: 'MethodDefinition',
            },
          ],
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error.message);
  }
});

test('if the rule will validate the object function property usage', t => {
  try {
    ruleTester.run(ruleName, ruleFile, {
      valid: [
        {
          code: 'const object = {foo() {}};',
          options: [{enforceInPropertyNames: true}],
        },
      ],
      invalid: [
        {
          code: 'const object = {foo_() {}};',
          options: [{enforceInPropertyNames: true}],
          errors: [
            {
              message: "Unexpected trailing '_' in 'foo_'.",
              type: 'Property',
            },
          ],
        },
      ],
    });

    t.pass();
  } catch (error) {
    t.fail(error.message);
  }
});
