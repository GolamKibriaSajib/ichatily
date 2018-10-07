module.exports = function (irc, req, res, username, password) {
  var options = {};
  var counter = 0;
  options = Object.assign(options, {
    debug: true, showErrors: true
  });

  var client = new irc.Client("irc.freenode.net", username, options);
  var msg, verifymsg;

  client.once("registered", function () {
    if (!req.body.verify) {
      msg = 'register ' + req.body.password + ' ' + req.body.email + ' ';
      client.say('NickServ', msg);
      setTimeout(function () {
        if (counter == 0) {
          res.render("confirm.ejs", { username: req.body.name, mail: req.body.email });
        }
      }, 5000);
    }

    if (req.body.verify) {
      client.say('NickServ', 'identify ' + username + " " + password);
      //  client.say('NickServ', 'identify '+password);
      verifymsg = req.body.verify;
      client.say("NickServ", verifymsg)
      res.render("success.ejs");

    }
  })

  client.addListener("notice", onNotice);
  client.once("error", OnError);

  function OnError(message) {
    console.log("IRC Error:", message);
  }
  function onNotice(from, to, text, message) {
    console.log(message)
    var checkMsg = message.args[1].indexOf(".");
    if (message.nick == 'NickServ') {
      if ((message.args[1].slice(0, checkMsg) == "This nickname is registered")) {
        counter++;

        res.render("errorNicks.ejs", { msg: message.args[1].slice(0, checkMsg) });

      }
    }
  }

}