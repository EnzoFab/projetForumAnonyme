var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var index = require('./routes/index');
var topic = require('./routes/topic');
var category = require('./routes/category');
var user = require('./routes/user');


var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);


var slashes = require("connect-slashes");
app.use(slashes(false)); // remove the trailing slashe which leads to different behaviour




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){ // pass to socket to router middleware
    res.socket = io;
    next();
});



app.use('/', index); // va chercher le fichier index.hs
app.use('/topic', topic); // va chercher le fichier topic.js
app.use('/category',category);
app.use('/user', user);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Make io accessible to our router
app.use(function(req,res,next){
    req.socket = io;
    next();
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('statusError');
});


//module.exports = app; before
module.exports = {app: app, server: server};