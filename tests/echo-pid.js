var System = require("pid-system");

module.exports.main = async function main(){
  var [res] = await System.receive(this);
  var message = await System.receive(this);
  res(message);
}
