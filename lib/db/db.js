var System = require("pid-system");
var path = require("path");

module.exports.main = async function main() {
    var message = await System.receive(this);
    var sysConfig = System.getConfig();
    var db = this.getValue("db");

    var [action] = message;
    switch (action) {
        //Erase is not guarenteed to be enabled
        case "erase":
            var [action, returnPid] = message;
            if (sysConfig.pouchEraseEnabled) {
                System.spawn(sysConfig.pouchModules.ERASE_HANDLER_PATH, "main")
                    .then(function(pid) {
                        System.send(pid, [db, returnPid]);
                    })
            } else {
                System.send(returnPid, ["ERR", "ERASE_NOT_ENABLED", "The erase plugin is not enabled in the System Config"])
            }
            break;
        case "get":
            var [action, id, returnPid] = message;
            System.spawn(sysConfig.pouchModules.GET_DOCUMENT_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, id, returnPid]);
                })
            break;
        case "put":
            var [action, id, doc, returnPid] = message;
            System.spawn(sysConfig.pouchModules.PUT_DOCUMENT_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, id, doc, returnPid]);
                })
            break;
        case "put-if-not-exists":
            var [action, id, doc, returnPid] = message;
            System.spawn(sysConfig.pouchModules.PUT_IF_NOT_EXISTS_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, id, doc, returnPid]);
                })
            break;
        case "upsert":
            var [action, id, diffFunc, returnPid] = message;
            System.spawn(sysConfig.pouchModules.UPSERT_DOCUMENT_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, id, diffFunc, returnPid]);
                })
            break;
        case "save-attachment":
            var [action, docId, attachmentName, dataB64, mimeType, returnPid] = message;
            System.spawn(sysConfig.pouchModules.SAVE_ATTACHMENT_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, docId, attachmentName, dataB64, mimeType, returnPid]);
                })
            break;
        case "get-attachment":
            var [action, docId, attachmentName, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }
            System.spawn(sysConfig.pouchModules.GET_ATTACHMENT_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, docId, attachmentName, options, returnPid]);
                })
            break;
        case "remove-attachment":
            var [action, docId, attachmentName, revId, returnPid] = message;
            System.spawn(sysConfig.pouchModules.REMOVE_ATTACHMENT_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, docId, attachmentName, revId, returnPid]);
                })
            break;
        case "all-docs":
            var [action, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }
            System.spawn(sysConfig.pouchModules.ALL_DOCS_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, options, returnPid]);
                })
            break;
        case "bulk-docs":
            var [action, docs, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }
            System.spawn(sysConfig.pouchModules.BULK_DOCS_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, docs, options, returnPid]);
                })
            break;
        case "remove-document":
            var [action, docId, revId, returnPid] = message;
            if (!returnPid) {
                returnPid = revId;
                revId = undefined;
            }
            System.spawn(sysConfig.pouchModules.DELETE_DOCUMENT_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, docId, revId, returnPid]);
                });
            break;
        case "dataquery":
            var [action, dataQuery, returnPid] = message;
            System.spawn(sysConfig.pouchModules.DATAQUERY_QUERY_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, dataQuery, returnPid]);
                });
            break;
        case "query":
            var [action, query, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }
            System.spawn(sysConfig.pouchModules.QUERY_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, query, options, returnPid]);
                });
            break;

        case "spatial":
            var [action, ddoc, limits, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }
            System.spawn(sysConfig.pouchModules.SPATIAL_QUERY, "main")
                .then(function(pid) {
                    System.send(pid, [db, ddoc, limits, options, returnPid]);
                });
            break;
        case "changes":
            var [action, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }

            options = options || {};
            options.live = false;

            System.spawn(sysConfig.pouchModules.CHANGES_QUERY_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, options, returnPid]);
                });
            break;
        case "changes-handler":
            var [action, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }

            options = options || {};
            options.live = true;

            System.spawn(sysConfig.pouchModules.CHANGES_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, options, returnPid]);
                });
            break;
        case "fully-replicate-to":
            var [action, dbString, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }

            options = options || {};
            options.live = false;

            System.spawn(sysConfig.pouchModules.FULLY_REPLICATE_TO_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                });
            break;
        case "fully-replicate-from":
            var [action, dbString, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }

            options = options || {};
            options.live = false;

            System.spawn(sysConfig.pouchModules.FULLY_REPLICATE_FROM_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                });
            break;
        case "fully-sync":
            var [action, dbString, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }

            options = options || {};
            options.live = false;

            System.spawn(sysConfig.pouchModules.FULLY_SYNC_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                });
            break;

        case "replicate-to":
            var [action, dbString, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }

            options = options || {};
            options.live = false;

            System.spawn(sysConfig.pouchModules.REPLICATE_TO_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                });
            break;
        case "replicate-from":
            var [action, dbString, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }

            options = options || {};
            options.live = false;

            System.spawn(sysConfig.pouchModules.REPLICATE_FROM_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                });
            break;
        case "sync":
            var [action, dbString, options, returnPid] = message;
            if (!returnPid) {
                returnPid = options;
                options = undefined;
            }

            options = options || {};
            options.live = false;

            System.spawn(sysConfig.pouchModules.SYNC_HANDLER_PATH, "main")
                .then(function(pid) {
                    System.send(pid, [db, pullDBifPid(dbString), options, returnPid]);
                });
            break;
        default:
            var [...args] = message;
            System.send(args[args.length - 1], ["ERR", "ACTION_NOT_FOUND", "Action sent to database was not found"])
            break;
    }

    System.recurse(this, main);
}

function pullDBifPid(dbStringOrPid) {
    if (dbStringOrPid instanceof System.Pid) {
        return dbStringOrPid.getValue("db");
    } else {
        return dbStringOrPid;
    }
}
