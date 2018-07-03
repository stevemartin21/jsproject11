'use strict';

///////////////////////////////////////////////////////////////////////////////////////////////////

//Modules 

///////////////////////////////////////////////////////////////////////////////////////////////////
//NPM MOdules
var express = require('express');
var morgan = require('morgan');
const mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');

// File Modules Models
var User = require('./models/user').User;

// File Modules Routes 
var users = require('./routes/users');
var courses = require('./routes/courses');
//////////////////////////////////////////////////////////////////////////////////////////////////
//Connect to database and mongoose 
//////////////////////////////////////////////////////////////////////////////////////////////////

mongoose.connect('mongodb://localhost:27017/course-api');
var db = mongoose.connection;

db.on('error', function(err){
	console.error('There was a connection error', err)
});

db.once('open', function(){
	console.log('Database has been connected')
	console.log('Sweet it is')
})

///////////////////////////////////////////////////////////////////////////////////////////////////////
//Middleware Set Middleware 
//////////////////////////////////////////////////////////////////////////////////////////////////////
// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// parse incoming requests
//allow to parse json eleemnts and get and receive from the url 
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));
////////////////////////////////////////////////////////////////////////////////////////////////////

//  import routes to the app  {user, courses }
app.use('/api/users', users);
app.use('/api/courses', courses);
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Error Handlers 
/////////////////////////////////////////////////////////////////////////////////////////////////////
// catch 404 and forward to globa:l error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
// Send a json response 
app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  res.json({
	  message: err.message,
	  error: err
	});
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
