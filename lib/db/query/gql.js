
var System = require("pid-system");

module.exports.main = async function main(){
  var [db, query, options, returnPid] = await System.receive(this);

  var error = null;
  var res = null
  var rej = null;
  var prom = new Promise(function(_res, _rej){
    res = _res;
    rej = _rej;
  });
  
  db.gql(query, options, function(err, val){
    if(err){
      rej(err);
      return;
    }
    res(val);
  })

  var result = await prom.catch(function(err){
    error = err;
  });

  if(!error){
    System.send(returnPid, ["OK", result]);
  } else if(error){
    System.send(returnPid, ["ERR", error.name, error.message]);
  }
}
