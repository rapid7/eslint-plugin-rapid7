# Require Screaming Snake Case for Static Properties (static-screaming-snake)

Native classes in javascript often use screaming snake case (SCREAMING_SNAKE_CASE) to define constant values on classes (e.g. Math.PI).

This rule enforces that static properties on classes be defined in screaming snake case.

## Rule Details

This rule looks for any static class properties and ensures that all letters are capitalized.

It has no way of knowing where word separations are without using a dictionary so `MYNAME` is as valid as `MY_NAME`.

This rule enforces properties that are assigned as methods, but not static methods.

This rule only checks the initial class declaration, not modifications to existing classes.
```js
class MyClass {
  // OK
  static something() {}

  // Not Ok
  static something = () => {};
}

```

## Options

### ignore

An array of static properties to ignore. It's set to `[]` by default.
If provided, it must be an `Array<String>`.

## Examples
The following patterns are considered problems:

```js
/*eslint static-screaming-snake: 2*/
class MyClass {
  static favoriteColor; /*error Static class property 'favoriteColor' is not in screaming snake case.*/
  static my_favorite_color = 'black'; /*error Static class property 'my_favorite_color' is not in screaming snake case.*/
  static propTypes = {}; /*error Static class property 'propTypes' is not in screaming snake case.*/
  static checkNumber = () => {}; /*error Static class property 'checkNumber' is not in screaming snake case.*/
}
```

The following patterns are not considered problems:

```js
/*eslint static-screaming-snake: [2, {ignore: ['propTypes']}]*/
class MyClass {
  static FAVORITE_COLOR;
  static FAVORITECOLOR = 'white'; // Valid because rule is blind to words
  static MY_FAVORITE_COLOR = 'black';
  static propTypes = {}; // Valid because propTypes is explicitly ignored
  static checkNumber() {}; // Valid because it is a static method
  favoriteColor = 'black'; // Valid because property is not static
}

MyClass.fave = 'yellow'; // Valid because value is assigned to an existing class
```

## When Not To Use It

If you have established coding standards using a different naming convention, turn this rule off.
