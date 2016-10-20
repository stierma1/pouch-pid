"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var main = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var message, _message, dbStructureOptions, dbRunOptions, returnPid, db, syncHandler, syncedTo, dbRemote, dbPid;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return System.receive(this);

          case 2:
            message = _context.sent;
            _message = _slicedToArray(message, 3);
            dbStructureOptions = _message[0];
            dbRunOptions = _message[1];
            returnPid = _message[2];
            db = new PouchDB(dbStructureOptions.name, dbRunOptions);
            syncHandler = null;
            syncedTo = null;

            if (dbStructureOptions.type === "synced" || dbStructureOptions.type === "fully-synced") {
              dbRemote = new PouchDB(dbStructureOptions.sync.remote.url, dbStructureOptions.sync.remote.options);

              if (dbStructureOptions.type === "fully-synced") {
                syncHandler = db.fullySync(dbRemote, dbStructureOptions.sync.options);
              } else {
                syncHandler = db.sync(dbRemote, dbStructureOptions.sync.options);
              }

              syncedTo = dbStructureOptions.sync.remote.url;
            }

            _context.next = 13;
            return System.spawn(dbPath, "main", { syncHandler: syncHandler, db: db, syncedTo: syncedTo });

          case 13:
            dbPid = _context.sent;


            System.send(returnPid, ["OK", dbPid, syncHandler]);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var System = require("pid-system");
var path = require("path");
var dbPath = path.join(__dirname, "db/db");
var PouchDB = require("pouchdb");
PouchDB.plugin(require('pouch-datalog'));
PouchDB.plugin(require('pouchdb-full-sync'));
PouchDB.plugin(require('pouchdb-upsert'));
PouchDB.plugin(require('geopouch'));
PouchDB.plugin(require('transform-pouch'));
PouchDB.plugin(require('pouchdb-erase'));

var pathConfig = {
  GET_DOCUMENT_HANDLER_PATH: path.join(__dirname, "db/handlers/get-document"),
  PUT_DOCUMENT_HANDLER_PATH: path.join(__dirname, "db/handlers/insert-document"),
  UPSERT_DOCUMENT_HANDLER_PATH: path.join(__dirname, "db/handlers/upsert-document"),
  DELETE_DOCUMENT_HANDLER_PATH: path.join(__dirname, "db/handlers/delete-document"),
  PUT_IF_NOT_EXISTS_HANDLER_PATH: path.join(__dirname, "db/handlers/put-if-not-exists"),
  SAVE_ATTACHMENT_HANDLER_PATH: path.join(__dirname, "db/handlers/save-attachment"),
  GET_ATTACHMENT_HANDLER_PATH: path.join(__dirname, "db/handlers/get-attachment"),
  REMOVE_ATTACHMENT_HANDLER_PATH: path.join(__dirname, "db/handlers/remove-attachment"),
  ALL_DOCS_HANDLER_PATH: path.join(__dirname, "db/handlers/all-docs"),
  BULK_DOCS_HANDLER_PATH: path.join(__dirname, "db/handlers/bulk-docs"),
  REPLICATE_TO_HANDLER_PATH: path.join(__dirname, "db/handlers/replicate-to"),
  FULLY_REPLICATE_TO_HANDLER_PATH: path.join(__dirname, "db/handlers/fully-replicate-to"),
  REPLICATE_FROM_HANDLER_PATH: path.join(__dirname, "db/handlers/replicate-from"),
  FULLY_REPLICATE_FROM_HANDLER_PATH: path.join(__dirname, "db/handlers/fully-replicate-from"),
  TRANSFORM_HANDLER_PATH: path.join(__dirname, "db/handlers/transform"),
  SYNC_HANDLER_PATH: path.join(__dirname, "db/handlers/sync"),
  FULLY_SYNC_HANDLER_PATH: path.join(__dirname, "db/handlers/fully-sync"),
  DATAQUERY_QUERY_PATH: path.join(__dirname, "db/query/dataquery"),
  PERSIST_QUERY_PATH: path.join(__dirname, "db/query/persist-query"),
  QUERY_PATH: path.join(__dirname, "db/query/query"),
  SPATIAL_QUERY: path.join(__dirname, "db/query/spatial"),
  CHANGES_QUERY_PATH: path.join(__dirname, "db/query/changes"),
  CHANGES_HANDLER_PATH: path.join(__dirname, "db/handlers/changes"),
  ERASE_HANDLER_PATH: path.join(__dirname, "db/handlers/erase")
};

var sysConfig = System.getConfig();
if (!(sysConfig && sysConfig.pouchModules)) {
  var newConfig = sysConfig || {};
  newConfig.pouchModules = pathConfig;
  System.setConfig(newConfig);
}

module.exports.main = main;