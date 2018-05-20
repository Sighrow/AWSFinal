var express = require('express');
var router = express.Router();
var db = require('../db');
var User = require('../models/User');
var Image = require('../models/Image');
var Follow = require('../models/Follow');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var dynamoose = require('dynamoose');

router.get('/', async function(req, res){
  Image.scan('image_owner').contains(session.userName).exec(function (err, userPictures) {
    if(session.loggedIn === true){
      res.render('index', {title: "Dashboard", loggedIn: session.loggedIn, data: userPictures});
    }
    else{
      res.redirect('/login');
    }
  });
});

router.get('/register', function(req, res){
  if(session.loggedIn !== true){
    res.render('register', {title: "Register", loggedIn: session.loggedIn});
  }
  else{
    res.redirect('/');
  }
  
});

router.post('/register', async function(req, res){
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var confirmpassword = req.body.confirmpassword;

  var user = new User({user_name: req.body.username, user_email: req.body.email});
  let data = await User.get(req.body.username).then(function (userData) {
    return userData;
  });

  if(data === undefined){
    user.save();
    db.sendEmail(req.body.email, req.body.username);
    db.sendText(req.body.phone, req.body.username);
    session.userName = req.body.username;
    session.loggedIn = true;
    res.redirect('/');
  }
  else{
    res.render('register', {title: "Register", loggedIn: session.loggedIn, message: "User already exists"});
  }

});

router.get('/login', function(req, res){
  if(session.loggedIn === true){
    res.redirect('/');
  }
  else{
    res.render('login', {title: "Login", loggedIn: session.loggedIn});
  }
});

router.get('/logout', function(req, res){
  session.userName = null;
  session.loggedIn = false;
  res.redirect('/login');
});

router.post('/login', async function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  var user = new User({user_name: req.body.username});
  let data = await User.get(req.body.username).then(function (userData) {
    return userData;
  });
  
  if(data === undefined){
    session.loggedIn = false;
    res.render('login', {title: "Login", loggedIn: session.loggedIn, message: "Invalid login"});
  }
  else{
    session.userName = req.body.username;
    session.loggedIn = true;
    res.redirect('/');
  }

});

router.get('/profile/:username', async function(req, res){

  if(session.loggedIn === true){
    var username = req.params.username;
    Image.scan('image_owner').contains(username).exec(function (err, userPictures) {
        res.render('profile', {title:  username + "'s Profile", data: userPictures, loggedIn: session.loggedIn});
  });
  }
  else{
    res.redirect('/login');
  } 
});

router.get('/profile', function(req, res){

  if(session.loggedIn === true){
    Image.scan('image_owner').contains(session.userName).exec(function (err, userPictures) {
      res.render('profile', {title:  "Your Profile", data: userPictures, loggedIn: session.loggedIn});
    });
  }
  else{
    res.redirect('/login');
  }

});

router.get('/followers', function(req, res){

  if(session.loggedIn === true){
    Follow.scan('followee_name').contains(session.userName).exec(function (err, userFollowers) {
      res.render('followers', {title:  session.userName + "'s Followers", data: userFollowers, loggedIn: session.loggedIn});
    });
  }
  else{
    res.redirect('/login');
  }

});

router.post('/profile/', async function(req, res){

  var usernameSearched = req.body.search;

  if(session.userName === usernameSearched){
    res.redirect('/profile');
  }
  else{
    let data = await User.get(usernameSearched).then(function (userData) {
      return userData;
    });
  
    if(data === undefined){
      res.redirect('/');
    }
    else{
      res.redirect('/profile/' + usernameSearched);
    }
  }
  
});

module.exports = router;