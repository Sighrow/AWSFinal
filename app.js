var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var hbs = require('express-handlebars');
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
session.loggedIn = false;
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts/',
helpers:{
  userName: function() {
    return session.userName;
}
}}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extender: false }));
app.use(cookieParser());
app.use(session({secret:"secret", saveUninitialized: false, resave: false, loggedIn: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res){
  res.render('index');
});

app.listen(app.get('port'), function(){
  console.log('Server is running on port ' + app.get('port'));
});

