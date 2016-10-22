
var System = require("pid-system");

module.exports.main = async function main(){
  var [db, docId, attachmentName, options, returnPid] = await System.receive(this);

  var error = null;
  var result = await db.getAttachment(docId, attachmentName, options).catch(function(err){
    error = err;
  });

  if(result){
    System.send(returnPid, ["OK", result]);
  } else if(error){
    System.send(returnPid, ["ERR", error.name, error.message]);
  }
}
