'use strict';

module.exports = {
  rules: {
    'static-screaming-snake': require('./lib/rules/static-screaming-snake'),
    'static-magic-number': require('./lib/rules/static-magic-numbers')
  },
  rulesConfig: {
    'magic-num': [2, {ignore: [], detectObjects: false, enforceConst: false, allowStatic: false}],
    'static-screaming-snake': [2]
  }
};
