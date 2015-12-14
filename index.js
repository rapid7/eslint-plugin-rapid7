'use strict';

module.exports = {
  rules: {
    'static-screaming-snake': require('./lib/rules/static-screaming-snake'),
    'static-magic-number': require('./lib/rules/static-magic-numbers')
  },
  rulesConfig: {
    "magic-num": [2, {ignore: [0, 1, 2, -1], detectObjects: true, enforceConst: true, allowStatic: true}],
    "static-screaming-snake": [2]
  }
};
