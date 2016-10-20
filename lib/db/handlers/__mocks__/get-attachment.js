
var System = require("pid-system");

module.exports.main = async function() {
  var message = await System.receive(this);
  var [...args] = message;
  System.send(args[args.length - 1], message);
};
