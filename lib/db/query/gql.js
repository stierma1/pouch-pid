
var System = require("pid-system");

module.exports.main = async function main(){
  var [db, query, options, returnPid] = await System.receive(this);

  var error = null;
  var result = await db.gql(query, options).catch(function(err){
    error = err;
  });

  if(!error){
    System.send(returnPid, ["OK", result]);
  } else if(error){
    System.send(returnPid, ["ERR", error.name, error.message]);
  }
}
