
var chai = require("chai");
chai.expect();
var System = require("pid-system").default;
var path = require("path");
var testModulePath = path.join(process.cwd(), "./lib/db/handlers/delete-document.js");
var mockMessages = path.join(process.cwd(), "tests", "mock-messages", "./lib/db/handlers/delete-document.js");

function mockClosure (cleanUpPids){
  return function (options){
    return System.spawn(testModulePath, "main", options).then(function(pid){
      cleanUpPids.push(pid);
      return pid;
    });
  }
}

describe("#delete-document", async function(){
  var cleanUpPids = [];
  var mock = mockClosure(cleanUpPids);

  before(function(){
    cleanUpPids.map(function(pid){
      System.exit(pid);
    });
    cleanUpPids = [];
  });

});
