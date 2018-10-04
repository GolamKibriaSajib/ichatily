module.exports = function (irc, req, res) {
  options = {};
  options = Object.assign(options, {
    debug: true, showErrors: true, 
  });

  var client = new irc.Client("irc.freenode.net", req.body.name, options);
  var msg, data;
  client.once("registered", function () {
    if (req.body.verify == null) { 
      msg = 'register ' + req.body.password + ' ' + req.body.email + ' ';
      client.say('NickServ', msg);
      console.log("redirect");
      res.redirect("./confirm.html");  
    }
    if (req.body.verify && req.body.password) {

      var password = req.body.password;
      client.say('NickServ', 'identify ' + req.body.name + " " + password);
      data = req.body.verify;
      client.say("NickServ", data)

      res.render("success.ejs");


    }


  })


  client.once("error", OnError);

  function OnError(message) {

     msg = 'register ' + req.body.password + ' ' + req.body.email + ' ';
      client.say('NickServ', msg);

    console.log("IRC Error:", message);
  }



}