module.exports=function(irc,req,res,app){

    
    var client = new irc.Client('irc.freenode.net', req.body.name);

    var msg, data;
    const extendTimeoutMiddleware = (req, res, next) => {
  const space = ' ';
  let isFinished = false;
  let isDataSent = false;

  // Only extend the timeout for API requests
  if (!req.url.includes('/api')) {
    next();
    return;
  }

  res.once('finish', () => {
    isFinished = true;
  });

  res.once('end', () => {
    isFinished = true;
  });

  res.once('close', () => {
    isFinished = true;
  });

  res.on('data', (data) => {
    // Look for something other than our blank space to indicate that real
    // data is now being sent back to the client.
    if (data !== space) {
      isDataSent = true;
    }
  });

  const waitAndSend = () => {
    setTimeout(() => {
      // If the response hasn't finished and hasn't sent any data back....
      if (!isFinished && !isDataSent) {
        // Need to write the status code/headers if they haven't been sent yet.
        if (!res.headersSent) {
          res.writeHead(202);
        }

        res.write(space);

        // Wait another 15 seconds
        waitAndSend();
      }
    }, 15000);
  };

  waitAndSend();
  next();
};

    client.once("registered", function () {
        if (req.body.verify == null) {
            msg = 'register ' + req.body.password + ' ' + req.body.email + ' ';
                
            client.say('NickServ', msg);
            app.use(extendTimeoutMiddleware);
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
     client.addListener("error", OnError);

    function OnError(message) {
        console.log("IRC Error:", message);
    }



}