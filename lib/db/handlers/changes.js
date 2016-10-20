
var System = require("pid-system");

module.exports.main = async function main(){
  var [db, options, returnPid] = await System.receive(this);

  var changesHandler = db.changes(options);

  System.send(returnPid, ["OK", changesHandler]);
}
