"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var System = require("pid-system");

module.exports.main = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var _ref2, _ref3, db, docs, options, returnPid, error, doc;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return System.receive(this);

          case 2:
            _ref2 = _context.sent;
            _ref3 = _slicedToArray(_ref2, 4);
            db = _ref3[0];
            docs = _ref3[1];
            options = _ref3[2];
            returnPid = _ref3[3];
            error = null;
            _context.next = 11;
            return db.bulkDocs(docs, options).catch(function (err) {
              error = err;
            });

          case 11:
            doc = _context.sent;


            if (doc) {
              System.send(returnPid, ["OK", doc]);
            } else if (error) {
              System.send(returnPid, ["ERR", error.name, error.message]);
            }

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function main() {
    return _ref.apply(this, arguments);
  }

  return main;
}();