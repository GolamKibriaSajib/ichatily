module.exports = function (irc, req, res) {


  //     var client = new irc.Client('irc.freenode.net', req.body.name);
  // console.log(client);
   options = {};
			  options = Object.assign(options, {
           port: 8000,
				debug: true, showErrors: true,
        username:'pongo',
        password:'p8wmjgda'
			});

		var 	client = new irc.Client("irc.freenode.net",'pongo', options);
  var msg, data;
  client.once("registered", function () {
    console.log("jj");
      if (req.body.verify == null) {
        	var 	client = new irc.Client("irc.freenode.net",req.body.name, options);
          msg = 'register ' + req.body.password + ' ' + req.body.email + ' ';
          console.log(msg)
          client.say('NickServ', msg);
          console.log("redirect");
          res.redirect("./confirm.html");
      }
      if (req.body.verify && req.body.password) {

          var password = req.body.password;
          client.say('NickServ','identify ' +req.body.name+" "+password);
          data = req.body.verify;
          client.say("NickServ", data)

          res.send("you are registered");


      }


  })

  
  client.on("error", OnError);

  function OnError(message) {
   
    console.log("IRC Error:", message);
  }



}