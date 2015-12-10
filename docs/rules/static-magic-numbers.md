# Static Magic Numbers (static-magic-numbers)

'Magic numbers' are numbers that occur multiple time in code without an explicit meaning.
They should preferably be replaced by named constants or static class properties

```js
var now = Date.now(),
    inOneHour = now + (60 * 60 * 1000);
```

## Rule Details

The `static-magic-numbers` rule aims to make code more readable and refactoring easier by ensuring that special numbers
are declared as constants or static class properties to make their meaning explicit.

This rule differs from the `no-magic-numbers` rule by providing the options `detectClasses` and `allowStatic`.

The following patterns are considered problems:

```js
/*eslint no-magic-numbers: 2*/

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * 0.25); /*error No magic number: 0.25*/
```

```js
/*eslint no-magic-numbers: [2, {enforceConst: true}]*/

var dutyFreePrice = 100, /*error Number constants must use 'const': 0.25*/
    taxPercentage = 0.25,
    finalPrice = dutyFreePrice + (dutyFreePrice * taxPercentage);
```

```js
/*eslint no-magic-numbers: [2, {detectObjects: true}]*/

var person = {
  age: 12 /*error No magic number: 12*/
};
```

```js
/*eslint no-magic-numbers: [2, {detectClassProperties: true}]*/
class TestClass {
  static dutyFreePrice = 4; /*error No number class properties: 4*/
}
```

```js
/*eslint no-magic-numbers: [2, {detectClassProperties: true, allowStatic: true}]*/
class TestClass {
  dutyFreePrice = 4; /*error No non-static (instance) magic number class properties:  4*/
}
```

The following patterns are considered okay:

```js
/*eslint no-magic-numbers: 2*/

var TAX_PERCENTAGE = 0.25;

var dutyFreePrice = 100,
    finalPrice = dutyFreePrice + (dutyFreePrice * TAX_PERCENTAGE);
```

```js
/*eslint no-magic-numbers: [2, {enforceConst: true}]*/

const dutyFreePrice = 100,
    taxPercentage = 0.25;

var finalPrice = dutyFreePrice + (dutyFreePrice * taxPercentage);
```

```js
/*eslint no-magic-numbers: [2, {detectObjects: true}]*/

const AGE = 12;
var person = {
  age: AGE
};
```

```js
/*eslint no-magic-numbers: [2, {detectClassProperties: true}]*/
const DUTY_FREE_PRICE = 4;

class TestClass {
  static dutyFreePrice = DUTY_FREE_PRICE;
}
```

```js
/*eslint no-magic-numbers: [2, {detectClassProperties: true, allowStatic: true}]*/
class TestClass {
  static DUTY_FREE_PRICE = 4;
}
```

```js
/*eslint no-magic-numbers: [2, {ignore: [-1]}]*/
let myArray = [true];
while(myArray.indexOf(true) !== -1) { /*...*/ }
```

## Options

### ignore

An array of numbers to ignore. It's set to `[]` by default.
If provided, it must be an `Array`.

### enforceConst

A boolean to specify if we should check for the const keyword in variable declaration of numbers. `false` by default.

### detectObjects

A boolean to specify if we should detect numbers when setting object properties. `false` by default.

### detectClassProperties

A boolean to specify if we should detect numbers when setting class properties. `false` by default.

### allowStatic

A boolean to specify if we should allow numbers set to static class properties when `detectClassProperties` is `true`. `false` by default.
