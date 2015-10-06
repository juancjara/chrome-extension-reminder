var argsToArray = function(args) {
  return args = Array.prototype.slice.call(args);
};

let utils = {
  partial(fn) {
    var pastArgs = argsToArray(arguments).slice(1);
    return function() {
      var newArgs = argsToArray(arguments);
      return fn.apply(null, pastArgs.concat(newArgs));
    }
  }
};

export default utils;
