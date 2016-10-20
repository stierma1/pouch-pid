"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var System = require("pid-system");
var path = require("path");

module.exports.main = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var message, sysConfig, db, _message, action, _message2, returnPid, _message3, id, _message4, doc, _message5, _message6, diffFunc, _message7, docId, attachmentName, dataB64, mimeType, _message8, options, _message9, revId, _message10, _message11, docs, _message12, _message13, dataQuery, _message14, query, _message15, ddoc, limits, _message16, _message17, _message18, dbString, _message19, _message20, _message21, _message22, _message23, _message24, args;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return System.receive(this);

                    case 2:
                        message = _context.sent;
                        sysConfig = System.getConfig();
                        db = this.getValue("db");
                        _message = _slicedToArray(message, 1);
                        action = _message[0];
                        _context.t0 = action;
                        _context.next = _context.t0 === "erase" ? 10 : _context.t0 === "get" ? 15 : _context.t0 === "put" ? 21 : _context.t0 === "put-if-not-exists" ? 28 : _context.t0 === "upsert" ? 35 : _context.t0 === "save-attachment" ? 42 : _context.t0 === "get-attachment" ? 51 : _context.t0 === "remove-attachment" ? 60 : _context.t0 === "all-docs" ? 68 : _context.t0 === "bulk-docs" ? 75 : _context.t0 === "remove-document" ? 83 : _context.t0 === "dataquery" ? 91 : _context.t0 === "query" ? 97 : _context.t0 === "spatial" ? 105 : _context.t0 === "changes" ? 114 : _context.t0 === "changes-handler" ? 123 : _context.t0 === "fully-replicate-to" ? 132 : _context.t0 === "fully-replicate-from" ? 142 : _context.t0 === "fully-sync" ? 152 : _context.t0 === "replicate-to" ? 162 : _context.t0 === "replicate-from" ? 172 : _context.t0 === "sync" ? 182 : 192;
                        break;

                    case 10:
                        _message2 = _slicedToArray(message, 2);
                        action = _message2[0];
                        returnPid = _message2[1];

                        if (sysConfig.pouchEraseEnabled) {
                            System.spawn(sysConfig.pouchModules.ERASE_HANDLER_PATH, "main").then(function (pid) {
                                System.send(pid, [db, returnPid]);
                            });
                        } else {
                            System.send(returnPid, ["ERR", "ERASE_NOT_ENABLED", "The erase plugin is not enabled in the System Config"]);
                        }
                        return _context.abrupt("break", 196);

                    case 15:
                        _message3 = _slicedToArray(message, 3);
                        action = _message3[0];
                        id = _message3[1];
                        returnPid = _message3[2];

                        System.spawn(sysConfig.pouchModules.GET_DOCUMENT_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, id, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 21:
                        _message4 = _slicedToArray(message, 4);
                        action = _message4[0];
                        id = _message4[1];
                        doc = _message4[2];
                        returnPid = _message4[3];

                        System.spawn(sysConfig.pouchModules.PUT_DOCUMENT_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, id, doc, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 28:
                        _message5 = _slicedToArray(message, 4);
                        action = _message5[0];
                        id = _message5[1];
                        doc = _message5[2];
                        returnPid = _message5[3];

                        System.spawn(sysConfig.pouchModules.PUT_IF_NOT_EXISTS_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, id, doc, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 35:
                        _message6 = _slicedToArray(message, 4);
                        action = _message6[0];
                        id = _message6[1];
                        diffFunc = _message6[2];
                        returnPid = _message6[3];

                        System.spawn(sysConfig.pouchModules.UPSERT_DOCUMENT_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, id, diffFunc, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 42:
                        _message7 = _slicedToArray(message, 6);
                        action = _message7[0];
                        docId = _message7[1];
                        attachmentName = _message7[2];
                        dataB64 = _message7[3];
                        mimeType = _message7[4];
                        returnPid = _message7[5];

                        System.spawn(sysConfig.pouchModules.SAVE_ATTACHMENT_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, docId, attachmentName, dataB64, mimeType, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 51:
                        _message8 = _slicedToArray(message, 5);
                        action = _message8[0];
                        docId = _message8[1];
                        attachmentName = _message8[2];
                        options = _message8[3];
                        returnPid = _message8[4];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }
                        System.spawn(sysConfig.pouchModules.GET_ATTACHMENT_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, docId, attachmentName, options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 60:
                        _message9 = _slicedToArray(message, 5);
                        action = _message9[0];
                        docId = _message9[1];
                        attachmentName = _message9[2];
                        revId = _message9[3];
                        returnPid = _message9[4];

                        System.spawn(sysConfig.pouchModules.REMOVE_ATTACHMENT_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, docId, attachmentName, revId, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 68:
                        _message10 = _slicedToArray(message, 3);
                        action = _message10[0];
                        options = _message10[1];
                        returnPid = _message10[2];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }
                        System.spawn(sysConfig.pouchModules.ALL_DOCS_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 75:
                        _message11 = _slicedToArray(message, 4);
                        action = _message11[0];
                        docs = _message11[1];
                        options = _message11[2];
                        returnPid = _message11[3];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }
                        System.spawn(sysConfig.pouchModules.BULK_DOCS_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, docs, options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 83:
                        _message12 = _slicedToArray(message, 4);
                        action = _message12[0];
                        docId = _message12[1];
                        revId = _message12[2];
                        returnPid = _message12[3];

                        if (!returnPid) {
                            returnPid = revId;
                            revId = undefined;
                        }
                        System.spawn(sysConfig.pouchModules.DELETE_DOCUMENT_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, docId, revId, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 91:
                        _message13 = _slicedToArray(message, 3);
                        action = _message13[0];
                        dataQuery = _message13[1];
                        returnPid = _message13[2];

                        System.spawn(sysConfig.pouchModules.DATAQUERY_QUERY_PATH, "main").then(function (pid) {
                            System.send(pid, [db, dataQuery, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 97:
                        _message14 = _slicedToArray(message, 4);
                        action = _message14[0];
                        query = _message14[1];
                        options = _message14[2];
                        returnPid = _message14[3];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }
                        System.spawn(sysConfig.pouchModules.QUERY_PATH, "main").then(function (pid) {
                            System.send(pid, [db, query, options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 105:
                        _message15 = _slicedToArray(message, 5);
                        action = _message15[0];
                        ddoc = _message15[1];
                        limits = _message15[2];
                        options = _message15[3];
                        returnPid = _message15[4];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }
                        System.spawn(sysConfig.pouchModules.SPATIAL_QUERY, "main").then(function (pid) {
                            System.send(pid, [db, ddoc, limits, options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 114:
                        _message16 = _slicedToArray(message, 3);
                        action = _message16[0];
                        options = _message16[1];
                        returnPid = _message16[2];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }

                        options = options || {};
                        options.live = false;

                        System.spawn(sysConfig.pouchModules.CHANGES_QUERY_PATH, "main").then(function (pid) {
                            System.send(pid, [db, options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 123:
                        _message17 = _slicedToArray(message, 3);
                        action = _message17[0];
                        options = _message17[1];
                        returnPid = _message17[2];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }

                        options = options || {};
                        options.live = true;

                        System.spawn(sysConfig.pouchModules.CHANGES_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 132:
                        _message18 = _slicedToArray(message, 4);
                        action = _message18[0];
                        dbString = _message18[1];
                        options = _message18[2];
                        returnPid = _message18[3];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }

                        options = options || {};
                        options.live = false;

                        System.spawn(sysConfig.pouchModules.FULLY_REPLICATE_TO_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 142:
                        _message19 = _slicedToArray(message, 4);
                        action = _message19[0];
                        dbString = _message19[1];
                        options = _message19[2];
                        returnPid = _message19[3];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }

                        options = options || {};
                        options.live = false;

                        System.spawn(sysConfig.pouchModules.FULLY_REPLICATE_FROM_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 152:
                        _message20 = _slicedToArray(message, 4);
                        action = _message20[0];
                        dbString = _message20[1];
                        options = _message20[2];
                        returnPid = _message20[3];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }

                        options = options || {};
                        options.live = false;

                        System.spawn(sysConfig.pouchModules.FULLY_SYNC_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 162:
                        _message21 = _slicedToArray(message, 4);
                        action = _message21[0];
                        dbString = _message21[1];
                        options = _message21[2];
                        returnPid = _message21[3];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }

                        options = options || {};
                        options.live = false;

                        System.spawn(sysConfig.pouchModules.REPLICATE_TO_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 172:
                        _message22 = _slicedToArray(message, 4);
                        action = _message22[0];
                        dbString = _message22[1];
                        options = _message22[2];
                        returnPid = _message22[3];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }

                        options = options || {};
                        options.live = false;

                        System.spawn(sysConfig.pouchModules.REPLICATE_FROM_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 182:
                        _message23 = _slicedToArray(message, 4);
                        action = _message23[0];
                        dbString = _message23[1];
                        options = _message23[2];
                        returnPid = _message23[3];

                        if (!returnPid) {
                            returnPid = options;
                            options = undefined;
                        }

                        options = options || {};
                        options.live = false;

                        System.spawn(sysConfig.pouchModules.SYNC_HANDLER_PATH, "main").then(function (pid) {
                            System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                        });
                        return _context.abrupt("break", 196);

                    case 192:
                        _message24 = _toArray(message);
                        args = _message24;

                        System.send(args[args.length - 1], ["ERR", "ACTION_NOT_FOUND", "Action sent to database was not found"]);
                        return _context.abrupt("break", 196);

                    case 196:

                        System.recurse(this, main);

                    case 197:
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

function pullDBifPid(dbStringOrPid) {
    if (dbStringOrPid instanceof System.Pid) {
        return dbStringOrPid.getValue("db");
    } else {
        return dbStringOrPid;
    }
}