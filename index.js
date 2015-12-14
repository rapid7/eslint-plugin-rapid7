'use strict';

module.exports = {
  rules: {
    'static-screaming-snake': require('./lib/rules/static-screaming-snake'),
    'static-magic-numbers': require('./lib/rules/static-magic-numbers')
  },
  rulesConfig: {
    'static-magic-numbers': [0, {ignore: [], detectObjects: false, enforceConst: false, allowStatic: false}],
    'static-screaming-snake': [0]
  }
};
