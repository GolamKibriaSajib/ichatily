var express = require('express');
var path = require("path");
var mongoose = require('mongoose');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var username;
var password;
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



// app.use(extendTimeoutMiddleware);


var socketIO = require("./simple3")(io, irc);


app.get("/", function (req, res) {
  if (req.session.username) {
    res.render("left.ejs", { username: req.session.username, password: req.session.password, channel: null });
  }
  else {
    res.render("landing.ejs");
  }
})


app.get('/signin', function (req, res, next) {
  // If user is already logged in, then redirect to rooms page

  if (req.session.username) {
    res.render("left.ejs", { username: req.session.username, password: req.session.password });
  }
  else {
    res.render("signin.ejs");
  }

});


app.post("/signin", function (req, res) {
 require("./checkLogin")(irc,req,res);
})
app.get("/signup", function (req, res) {
      res.render("signup.ejs");

});

app.post("/signup", function (req, res) {
  username = req.body.name;
 password = req.body.password;
require("./register")(irc, req, res,username,password);

});

app.post("/verify", function (req, res) {
  require("./register")(irc, req, res,username,password);
});


app.get("/logout", function (req, res) {

  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {

        res.render("signin.ejs");
      }



    })
  }
  else {
    res.render("siginin.ejs");
  }

})

app.get("/:channel", function (req, res) {
  if (req.session.username) {
    res.render("left.ejs", { username: req.session.username, password: req.session.password, channel: req.params.channel });
  }
  else {
    res.render("landing.ejs");
  }
})





server.listen(port);