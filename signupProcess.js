module.exports = {

  register: function (irc, req, res, cb) {
    var options = {};
    options = Object.assign(options, {
      userName: req.body.name,
      password: req.body.password,
      debug: true, showErrors: true
    });
    var client = new irc.Client("irc.freenode.net", options.userName, options);
    var msg;
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
    client.once("registered", function () {
      msg = 'register ' + req.body.password + ' ' + req.body.email + ' ';
      client.say('NickServ', msg);
      return cb(client);


    })

  },

  verify: function (ircInformation, req, res) {
    var client = ircInformation;
    var msg, verifymsg;
    //  client.say('NickServ', 'identify '+client.opt.password);
    verifymsg = req.body.verify;
    client.once("error", OnError);

    function OnError(message) {
      console.log("IRC Error:", message);
    }

    client.say("NickServ", verifymsg);
    setTimeout(function () {
      client.disconnect();
      res.render("success.ejs");
    }, 6000);

  }
}




