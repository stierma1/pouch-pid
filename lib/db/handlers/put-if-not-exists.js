
var System = require("pid-system");

module.exports.main = async function main(){
  var [db, id, doc, returnPid] = await System.receive(this);

  var nDoc = {};
  for(var i in doc){
    nDoc[i] = doc[i];
  }

  nDoc._id = id;
  var error = null;
  var result = await db.putIfNotExists(nDoc).catch(function(err){
    error = err;
  });

  if(result){
    System.send(returnPid, ["OK", result]);
  } else if(error){
    System.send(returnPid, ["ERR", error.name, error.message]);
  }
}
