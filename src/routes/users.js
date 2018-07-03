////////////////////////////////////////////////////////

'use strict';
//NPM modules
const express = require('express');
var router = express.Router();
// File Modules
var User  = require('../models/user');
var mid = require('../middleware/auth2');


// Steps set up authentication function to see if there is a user and if user has the matching email address
//send back user 

//  GET /api/users 200 - Returns the currently authenticated user
// First send req.header to basic auth with name and pass and run through check method, if excits thehn find user
// after use has been found verify user password is equal to the other hashed password
//  if everything is working then the user is returned 
// Must Authenticate
router.get('/', [mid.check],  function(req,res, next){
	console.log('Check ')
	//  Find the user that that is logged in
	User.find({}, function(error, user){
		//   if therw was an error and create an error object 
		if(error){
			var err = new Error('There was an error, no user');
			err.status= 400;
			next(err)
		}else{
			// if the user is found and create it 
			// req.verifiedUser
			console.log('The user was found');
			// Send back the verified user
			res.status(201);
			res.json(
				req.verifiedUser
				)
		}
	})
})


//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
// Take information from a form and post to data base, make suer user doesn't exist etc...
// post to data base 
router.post('/', function(req,res, next){
	
//  Grab informaton from the filled out forms and create a new user when the route is run
	User.create(req.body, function(error, user){
		// If there is an error need to create an error object and set status to 400 and return to middleware 
		if(error){
			let err = new Error('there was an error');
			err.status =  400;
			next(err)
		}else if(!req.body.fullName || !req.body.emailAddress || !req.body.password){
			// Validate to make sure the form has full name, email address, and password
			res.send('You are missing some key items')
		}else{
			//  set the status to 201 for the response and the location header to '/'
			console.log(user)
			res.status(201);
			res.location('/')
			res.end()
		}
	})
});

module.exports = router;

