testglobals
===========

The problem:

```js
this.module = (function(){
  function internal(){ // How to test this internal function?
    return 42;
  }
  function external(){
    var num = internal();
    return num - 23;
  }
  return {
    external: external
  };
})();
```

A possible solution:

```js
this.module = (function(){
  function internal(){
    return 42;
  }
  global.__TEST__.internal = internal; // Adding this manually sucks!
  function external(){
    var num = internal();
    return num - 23;
  }
  return {
    external: external
  };
})();
```

**testglobals** takes a js file, looks for a comment that describes which
identifiers are to be exposed globally for testing and creates a new file with
the identifiers available for testing. Works great for testing simple functions,
might not work as great for more complicated stuff.


How to
------

Add a comment somewhere into your source file that lists the identifiers you
want to test:

```js
// @testglobals: internal, somethingElse
this.module = (function(){
  function internal(){
    return 42;
  }
  function external(){
    var num = internal();
    return num - 23;
  }
  return {
    external: external
  };
})();
```

Use the `testglobals` function with the input file's path, an output path and the
options object:

```
$ node
> var testglobals = require('./testglobals.js');
> testglobals('module.js', 'module-testable.js', { global: '__TEST__'  });
```

And that's it, `module-testable.js` is ready for testing:

```js
Function('return this')().__TEST__ = {};
this.module = function () {
    function internal() {
        return 42;
    }
    __TEST__.internal = internal;
    function external() {
        var num = internal();
        return num - 23;
    }
    return { external: external };
}();
```