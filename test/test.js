var assert = require('assert');
var testglobals = require('../testglobals.js');

testglobals('module.js', 'module-testable.js', {
  global: '__TEST__'
});

var original = require('./module.js')();
var testable = require('./module-testable.js')();

assert(global.__TEST__);

assert.strictEqual(original.a(), testable.a(), 'equivalence for a()');
assert.strictEqual(testable.a, global.__TEST__.a, 'a() is exposed');
assert.strictEqual(global.__TEST__.x1, 42, 'x1 from a() is exposed');

assert.strictEqual(original.b(), testable.b(), 'equivalence for b()');
assert.strictEqual(testable.b, global.__TEST__.b, 'b() is exposed');
assert.strictEqual(global.__TEST__.x2, 42, 'x2 from b() is exposed');

assert.strictEqual(original.c(), testable.c(), 'equivalence for c()');
assert.strictEqual(testable.c, global.__TEST__.c, 'c() is exposed');
assert.strictEqual(global.__TEST__.x3, 42, 'x3 from c() is exposed');

assert.strictEqual(global.__TEST__.x4, 42, 'x4 from IIFE is exposed');

assert.strictEqual(global.__TEST__.x5, 42, 'x5 from nested IIFEs is exposed');

assert.strictEqual(global.__TEST__.x6, 42, 'x6 from nested IIFE argument is exposed');

assert.strictEqual(testable.obj, global.__TEST__.obj, 'obj is exposed');
assert.strictEqual(original.obj.fn0(), testable.obj.fn0(), 'equivalence for obj.fn0()');
assert.strictEqual(original.obj.fn1, testable.obj.fn1, 'equivalence for obj.fn1');
assert.strictEqual(global.__TEST__.x7, 42, 'x7 from object method is exposed');
assert.strictEqual(global.__TEST__.x8, 42, 'x8 from object IIFE is exposed');
assert.strictEqual(original.obj.fn2(), testable.obj.fn2(), 'equivalence for obj.fn2()');
assert.strictEqual(global.__TEST__.x9, 42, 'x9 from object method is exposed');

assert.strictEqual(global.__TEST__.n, 42, 'n is exposed');
assert.strictEqual(global.__TEST__.m, 23, 'm is exposed');

assert(global.__TEST__.internal, 'internal function from module is exposed');