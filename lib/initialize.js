
var System = require("pid-system");
var path = require("path");
var dbPath = path.join(__dirname, "db/db");
var PouchDB = require("pouchdb");
PouchDB.plugin(require('pouch-datalog'));
PouchDB.plugin(require('pouchdb-full-sync'));
PouchDB.plugin(require('pouchdb-upsert'));
PouchDB.plugin(require('geopouch'))
PouchDB.plugin(require('transform-pouch'));
PouchDB.plugin(require('pouchdb-erase'));

var pathConfig =  {
    GET_DOCUMENT_HANDLER_PATH : path.join(__dirname, "db/handlers/get-document"),
    PUT_DOCUMENT_HANDLER_PATH : path.join(__dirname, "db/handlers/insert-document"),
    UPSERT_DOCUMENT_HANDLER_PATH : path.join(__dirname, "db/handlers/upsert-document"),
    DELETE_DOCUMENT_HANDLER_PATH: path.join(__dirname, "db/handlers/delete-document"),
    PUT_IF_NOT_EXISTS_HANDLER_PATH: path.join(__dirname, "db/handlers/put-if-not-exists"),
    SAVE_ATTACHMENT_HANDLER_PATH : path.join(__dirname, "db/handlers/save-attachment"),
    GET_ATTACHMENT_HANDLER_PATH : path.join(__dirname, "db/handlers/get-attachment"),
    REMOVE_ATTACHMENT_HANDLER_PATH : path.join(__dirname, "db/handlers/remove-attachment"),
    ALL_DOCS_HANDLER_PATH: path.join(__dirname, "db/handlers/all-docs"),
    BULK_DOCS_HANDLER_PATH: path.join(__dirname, "db/handlers/bulk-docs"),
    REPLICATE_TO_HANDLER_PATH: path.join(__dirname, "db/handlers/replicate-to"),
    FULLY_REPLICATE_TO_HANDLER_PATH: path.join(__dirname, "db/handlers/fully-replicate-to"),
    REPLICATE_FROM_HANDLER_PATH: path.join(__dirname, "db/handlers/replicate-from"),
    FULLY_REPLICATE_FROM_HANDLER_PATH: path.join(__dirname, "db/handlers/fully-replicate-from"),
    TRANSFORM_HANDLER_PATH: path.join(__dirname,  "db/handlers/transform"),
    SYNC_HANDLER_PATH:  path.join(__dirname, "db/handlers/sync"),
    FULLY_SYNC_HANDLER_PATH:  path.join(__dirname, "db/handlers/fully-sync"),
    DATAQUERY_QUERY_PATH: path.join(__dirname, "db/query/dataquery"),
    PERSIST_QUERY_PATH: path.join(__dirname, "db/query/persist-query"),
    QUERY_PATH: path.join(__dirname, "db/query/query"),
    SPATIAL_QUERY:path.join(__dirname, "db/query/spatial"),
    CHANGES_QUERY_PATH:path.join(__dirname, "db/query/changes"),
    CHANGES_HANDLER_PATH:path.join(__dirname, "db/handlers/changes"),
    ERASE_HANDLER_PATH: path.join(__dirname, "db/handlers/erase")
}

var sysConfig = System.getConfig();
if(!(sysConfig && sysConfig.pouchModules)){
  var newConfig = sysConfig || {};
  newConfig.pouchModules = pathConfig;
  System.setConfig(newConfig);
}

async function main(){
  var message = await System.receive(this);
  var [dbStructureOptions, dbRunOptions, returnPid] = message;

  var db = new PouchDB(dbStructureOptions.name, dbRunOptions);
  var syncHandler = null;
  var syncedTo = null;
  if(dbStructureOptions.type === "synced" || dbStructureOptions.type === "fully-synced"){
    var dbRemote = new PouchDB(dbStructureOptions.sync.remote.url, dbStructureOptions.sync.remote.options);
    if(dbStructureOptions.type === "fully-synced"){
      syncHandler = db.fullySync(dbRemote, dbStructureOptions.sync.options);
    } else {
      syncHandler = db.sync(dbRemote, dbStructureOptions.sync.options);
    }

    syncedTo = dbStructureOptions.sync.remote.url
  }

  var dbPid = await System.spawn(dbPath, "main", {syncHandler:syncHandler, db:db, syncedTo:syncedTo});

  System.send(returnPid, ["OK", dbPid, syncHandler]);
}

module.exports.main = main;
