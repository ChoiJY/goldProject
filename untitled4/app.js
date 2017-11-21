var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
// mongodb
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var job = require('./routes/job');
var skill = require('./routes/skill');
var subject = require('./routes/subject');
var ind = require('./routes/industry_field');
var com = require('./routes/company');
var member = require('./routes/member');
var my = require('./routes/mypage');
var users = require('./module/userSchema');

var app = express();// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use('/', routes);
app.use('/users', users);
app.use('/job', job);
app.use('/skill', skill);
app.use('/subject', subject);
app.use('/industry', ind);
app.use('/company', com);
app.use('/member', member);
app.use('/mypage', my);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// mongodb connect
var db = mongoose.connection;
var userModel;

db.on('error', console.error);

db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mlab server");
    userModel = mongoose.model('students',users.schema);

    // var testSchema = new users({
    //     name : 'Sophomore',
    //     studentID : '2',
    //     password: '2',
    //     grade : 2,
    //     major : 'sw',
    //     semester : 4
    // });
    //
    // testSchema.save(function(err){
    //     // if (err) return console.error(err);
    //     // console.dir(testSchema);
    // });
    // userModel.find(function (err, data) {
    //     // console.log(data);
    // });
});

mongoose.connect('mongodb://root:0000@ds243295.mlab.com:43295/golduser');

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

require('express-dynamic-helpers-patch')(app);

app.dynamicHelpers({
  session: function (req, res) {
    return req.session;
  }
});

module.exports = app;
