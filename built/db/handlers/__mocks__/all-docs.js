"use strict";

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var System = require("pid-system");

module.exports.main = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
  var message, _message, args;

  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return System.receive(this);

        case 2:
          message = _context.sent;
          _message = _toArray(message);
          args = _message;

          System.send(args[args.length - 1], message);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}));