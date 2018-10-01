var express = require('express');
var path = require("path");
var mongoose = require('mongoose');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
//...
var irc = require("irc");
var server = require("http").createServer(app);
var io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(session({ secret: 'ssshhhhh' }));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/")));
var port = process.env.PORT || 3000;
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

// app.use(extendTimeoutMiddleware);

var socketIO = require("./simple3")(io, irc);


app.get("/",function(req,res){
  if(req.session.username){
    res.render("left.ejs",{username:req.session.username,password:req.session.password});
  }
  else{
  res.render("landing.ejs");
  }
})


app.get('/signin', function (req, res, next) {
  // If user is already logged in, then redirect to rooms page

  if (req.session.username) {
    res.render("left.ejs", { username: req.session.username, password: req.session.password });
  }
  else {
    res.render("login.ejs");
  }

});


app.post("/login", function (req, res) {
  req.session.username = req.body.username;
  req.session.password = req.body.password;
  res.render("left.ejs", { username: req.body.username, password: req.body.password });
})


app.get("/signup",app.use(extendTimeoutMiddleware),function(req,res){
  res.render("signup.ejs");
})

app.post("/signup", function (req, res) {
  require("./register")(irc,req,res);
  
})

app.post("/verify", function (req, res) {
  require("./register")(irc,req,res);
});

app.get("/:channel/:username/:password", function (req, res) {

  var password = new Buffer(req.params.password, 'base64')
  var decode = password.toString();
  if (req.session.username) {

    res.render("left.ejs", { username: req.params.username, password: decode });
  }
  else {
    res.render("login.ejs");
  }

  //    console.log(req.params.channel)
})

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {

      res.render("login.ejs");
    }


  })
})



server.listen(port);