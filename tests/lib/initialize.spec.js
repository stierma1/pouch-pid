
var chai = require("chai");
var expect = chai.expect;
var System = require("pid-system");
var path = require("path");
var testModulePath = path.join(process.cwd(), "./lib/initialize.js");
var mockMessages = path.join(process.cwd(), "tests", "mock-messages", "./lib/initialize.js");
var echoPid = path.join(process.cwd(), "./tests/echo-pid.js");

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

describe("#initialize",  function(){
  var cleanUpPids = [];
  var mock = mockClosure(cleanUpPids);
  var echoPid = echoPidClosure(cleanUpPids);

  beforeEach(function(){
    cleanUpPids.map(function(pid){
      System.exit(pid);
    });
    cleanUpPids = [];
  });

  it("should add a pouchModules key to config", async function(){
    var c = System.getConfig();
    c.pouchEraseEnabled = true;
    System.setConfig(c);
    var pid = await mock();
    expect(System.getConfig()).to.have.property("pouchModules");
  })

  it("should add a pouchModules.ERASE_HANDLER_PATH key to config if eraseEnabled is set", async function(){
    //it was set in previous test
    var pid = await mock();
    expect(System.getConfig().pouchModules).to.have.property("ERASE_HANDLER_PATH");
  })

  it("should return dbPid", async function(){
    var echo = await echoPid();
    var pid = await mock();

    System.send(pid, [{name:"stuff"}, null, echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.equal("OK");
    expect(message[1]).to.not.be.undefined;
    expect(message[2]).to.be.null;
    cleanUpPids.push(message[1]);
    //expect(System.getConfig()).to.have.property("pouchModules");
  })

  it("should return when synced dbPid and syncHandler", async function(){
    var echo = await echoPid();
    var pid = await mock();

    System.send(pid, [{name:"stuff", type:"synced", sync:{remote:{url:"http://www.fake.com"}}}, null, echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.equal("OK");
    expect(message[1]).to.not.be.undefined;
    expect(message[2]).to.not.be.null;
    cleanUpPids.push(message[1]);
    //expect(System.getConfig()).to.have.property("pouchModules");
  })

  it("should return when fully-synced dbPid and syncHandler", async function(){
    var echo = await echoPid();
    var pid = await mock();

    System.send(pid, [{name:"stuff", type:"fully-synced", sync:{remote:{url:"http://www.fake.com"}}}, null, echo.pid]);
    var message = await echo.prom;
    expect(message[0]).to.equal("OK");
    expect(message[1]).to.not.be.undefined;
    expect(message[2]).to.not.be.null;
    cleanUpPids.push(message[1]);
    //expect(System.getConfig()).to.have.property("pouchModules");
  })
});
