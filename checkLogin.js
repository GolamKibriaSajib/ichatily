module.exports = function (irc, req, res) {
  var options = {};
var counter=0;
  options = Object.assign(options, {
    debug: true, showErrors: true,
    sasl:true,
    userName:req.body.name,
    password:req.body.password

  });

  var client = new irc.Client("irc.freenode.net", options.userName, options);
  client.on("error", OnError);

  client.once("registered", function () {
      req.session.username = req.body.name;
 req.session.password = req.body.password;
 client.disconnect();
 res.render("left.ejs", { username: req.body.name, password: req.body.password, channel: null });
  })


  function OnError(message) {
 counter++;
 if(counter==1){
      res.render("error.ejs");
 }
    console.log("IRC Error:", message);
  }



}