
var System = require("pid-system");

module.exports.main = async function main(){
  var [db, docId, attachmentName, returnPid] = await System.receive(this);
  var error = null;
  var doc = await db.removeAttachment(docId,attachmentName).catch(function(err){
    error = err;
  });

  if(result){
    System.send(returnPid, ["OK", doc]);
  } else if(error){
    System.send(returnPid, ["ERR", error.name, error.message]);
  }
}
