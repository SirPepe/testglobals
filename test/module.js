// @testglobals: a, b, c, obj, internal
// @testglobals: x1, x2, x3, x4, x5, x6, x7, x8, x9
/*
  something something
  @testglobals: n, m
  something more
*/

module.exports = function(){

function a(){
  var x1 = 42;
  return x1;
}

var b = function(){
  var x2 = 42;
  return x2;
};

var c;
c = function(){
  var x3 = 42;
  return x3;
};

(function(){
  var x4 = 42;
})();

(function(){
  (function(){
    (function(){
      var x5 = 42;
    })();
  })();
})();

(function(){})(function(){
  var x6 = 42;
}());

var obj = {
  fn0: function(){
    var x7 = 42;
    return x7;
  },
  fn1: (function(){
    var x8 = 42;
    return x8;
  })()
};

obj.fn2 = function(){
  var x9 = 42;
  return x9;
};

var n = 42, m = 23;

var module = (function(){
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

return {
  a:a,
  b:b,
  c:c,
  obj: obj
};

};