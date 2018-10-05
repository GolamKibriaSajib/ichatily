module.exports = function (irc, req, res,username,password) {
  var options = {};

  options = Object.assign(options, {
    debug: true, showErrors: true,
  });

  var client = new irc.Client("irc.freenode.net", username, options);
  var msg, data;

  client.once("registered", function () {
    if (req.body.verify == null) {
      msg = 'register ' + req.body.password + ' ' + req.body.email + ' ';
      client.say('NickServ', msg);
      console.log("redirect");
      res.render("confirm.ejs",{username:username,mail:req.body.email});
      return client;

    }
    if (req.body.verify) {
      var password = password;
      client.say('NickServ', 'identify ' + username + " " + password);
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