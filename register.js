module.exports=function(irc,req,res){

    
    var client = new irc.Client('irc.freenode.net', req.body.name);

    var msg, data;
    client.once("registered", function () {
        if (req.body.verify == null) {
            msg = 'register ' + req.body.password + ' ' + req.body.email + ' ';
            client.say('NickServ', msg);
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
     client.addListener("error", OnError);

    function OnError(message) {
        console.log("IRC Error:", message);
    }



}