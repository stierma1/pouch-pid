
var chai = require("chai");
var expect = chai.expect;
var System = require("pid-system");
var path = require("path");
var testModulePath = path.join(process.cwd(), "./lib/db/db.js");
var mockMessages = path.join(process.cwd(), "tests", "mock-messages", "./lib/db/db.js");
var echoPid = path.join(process.cwd(), "./tests/echo-pid.js");

jest.mock(path.join(process.cwd(), "./lib/db/handlers/erase"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/get-document"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/insert-document"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/put-if-not-exists"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/upsert-document"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/delete-document"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/save-attachment"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/get-attachment"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/remove-attachment"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/all-docs"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/bulk-docs"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/changes"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/fully-replicate-to"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/fully-replicate-from"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/fully-sync"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/replicate-to"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/replicate-from"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/sync"));
jest.mock(path.join(process.cwd(), "./lib/db/handlers/view-cleanup"));

jest.mock(path.join(process.cwd(), "./lib/db/query/dataquery"));
jest.mock(path.join(process.cwd(), "./lib/db/query/query"));
jest.mock(path.join(process.cwd(), "./lib/db/query/changes"));

function mockClosure (cleanUpPids){
  return function (options){
    return System.spawn(testModulePath, "main", options).then(function(pid){
      cleanUpPids.push(pid);
      return pid;
    });
  }
}

function echoPidClosure (cleanUpPids){
  return async function (){
    var pid = await System.spawn(echoPid, "main").then(function(pid){
      cleanUpPids.push(pid);
      return pid;
    })
    var res_
    var prom = new Promise(function(res, rej){
      res_ = res;
    })
    System.send(pid,[res_]);
    return {pid:pid, prom:prom};
  }
}


jest.mock(path.join(process.cwd(), "./lib/db/handlers/get-document"))


describe("#db", async function(){
  var cleanUpPids = [];
  var mock = mockClosure(cleanUpPids);
  var echoPid = echoPidClosure(cleanUpPids);

  beforeEach(function(){
    cleanUpPids.map(function(pid){
      System.exit(pid);
    });
    cleanUpPids = [];
    var config = System.getConfig() || {};
    config.pouchEraseEnabled = true;
    System.setConfig(config);
    require(path.join(process.cwd(), "./lib/initialize.js"))//Need to attach the config
  });

  it("should return error if action does not exist", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["does not exist", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.equal("ERR");
    expect(message[1]).to.equal("ACTION_NOT_FOUND");
  })

  it("should get", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["get", "this is a test", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("this is a test");
    expect(message[2]).to.equal(echo.pid);
  })

  it("should put", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["put", "this is a test", "this is a fake document", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("this is a test");
    expect(message[2]).to.equal("this is a fake document");
    expect(message[3]).to.equal(echo.pid);
  })

  it("should put-if-not-exists", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["put-if-not-exists", "this is a test", "this is a fake document", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("this is a test");
    expect(message[2]).to.equal("this is a fake document");
    expect(message[3]).to.equal(echo.pid);
  })

  it("should upsert", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["upsert", "this is a test", "this is a fake document", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("this is a test");
    expect(message[2]).to.equal("this is a fake document");
    expect(message[3]).to.equal(echo.pid);
  })


  it("erase should error when not enabled", async function(){
    var config = System.getConfig();
    config.pouchEraseEnabled = false;
    System.setConfig(config);
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["erase", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.equal("ERR");
    expect(message[1]).to.equal("ERASE_NOT_ENABLED");
  })

  it("erase should work", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["erase", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal(echo.pid);
  })

  it("view-cleanup should work", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["view-cleanup", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal(echo.pid);
  })

  it("should get all docs", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["all-docs", "options", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("options");
    expect(message[2]).to.equal(echo.pid);
  })

  it("should get all docs - without options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["all-docs", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.be.undefined;
    expect(message[2]).to.equal(echo.pid);
  })

  it("should insert bulk docs", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["bulk-docs", ["doc"], "options", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1][0]).to.equal("doc");
    expect(message[2]).to.equal("options");
    expect(message[3]).to.equal(echo.pid);
  })

  it("should insert bulk docs - without options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["bulk-docs", ["doc"], echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1][0]).to.equal("doc");
    expect(message[2]).to.be.undefined;
    expect(message[3]).to.equal(echo.pid);
  })

  it("should save attachment", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["save-attachment", "this is a test", "attach name", "this is a fake document", "fake/mime", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("this is a test");
    expect(message[2]).to.equal("attach name");
    expect(message[3]).to.equal("this is a fake document");
    expect(message[4]).to.equal("fake/mime");
    expect(message[5]).to.equal(echo.pid);
  })

  it("should get attachment", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["get-attachment", "this is a test", "attach name", "option", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("this is a test");
    expect(message[2]).to.equal("attach name");
    expect(message[3]).to.equal("option");
    expect(message[4]).to.equal(echo.pid);
  })

  it("should get attachment - without options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["get-attachment", "this is a test", "attach name", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("this is a test");
    expect(message[2]).to.equal("attach name");
    expect(message[3]).to.be.undefined;
    expect(message[4]).to.equal(echo.pid);
  })

  it("should remove attachment", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["remove-attachment", "this is a test", "attach name", "rev", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("this is a test");
    expect(message[2]).to.equal("attach name");
    expect(message[3]).to.equal("rev");
    expect(message[4]).to.equal(echo.pid);
  })

  it("should remove document", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["remove-document", "docId", "revId", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("docId");
    expect(message[2]).to.equal("revId");
    expect(message[3]).to.equal(echo.pid);
  })

  it("should remove document - without revId", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["remove-document", "docId", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("docId");
    expect(message[2]).to.be.undefined;
    expect(message[3]).to.equal(echo.pid);
  })

  it("should invoke dataquery", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["dataquery", "query", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("query");
    expect(message[2]).to.equal(echo.pid);
  })

  it("should invoke query", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["query", "query", "options", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("query");
    expect(message[2]).to.equal("options");
    expect(message[3]).to.equal(echo.pid);
  })

  it("should invoke query - without options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["query", "query", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("query");
    expect(message[2]).to.be.undefined;
    expect(message[3]).to.equal(echo.pid);
  })

  it("should call changes handler", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["changes-handler", {}, echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1].live).to.equal(true);
    expect(message[2]).to.equal(echo.pid);
  })

  it("should call changes handler - no options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["changes-handler", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1].live).to.equal(true);
    expect(message[2]).to.equal(echo.pid);
  })

  it("should call changes one-shot", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["changes", {}, echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1].live).to.equal(false);
    expect(message[2]).to.equal(echo.pid);
  })

  it("should call changes one-shot - no options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["changes", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1].live).to.equal(false);
    expect(message[2]).to.equal(echo.pid);
  })

  it("should fully replicate to", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["fully-replicate-to", "db", {}, echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })

  it("should fully replicate to - no options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["fully-replicate-to", "db", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })

  it("should fully replicate from", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["fully-replicate-from", "db", {}, echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })

  it("should fully replicate from - no options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["fully-replicate-from", "db", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })

  it("should fully sync", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["fully-sync", "db", {}, echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })

  it("should fully sync - no options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["fully-sync", "db", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })

  it("should replicate to", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["replicate-to", "db", {}, echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })

  it("should replicate to - no options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["replicate-to", "db", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })

  it("should replicate from", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["replicate-from", "db", {}, echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })

  it("should replicate from - no options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["replicate-from", "db", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })

  it("should sync", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["sync", "db", {}, echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })

  it("should sync - no options", async function(){
    var echo = await echoPid();
    var pid = await mock();
    System.send(pid, ["sync", "db", echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.be.undefined;
    expect(message[1]).to.equal("db");
    expect(message[2].live).to.equal(false);
    expect(message[3]).to.equal(echo.pid);
  })
});
