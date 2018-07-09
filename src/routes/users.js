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
router.get('/', mid.check,  function(req,res, next){
	console.log('Check ')
	//  Find the user that that is logged in
	res.status(201);
	res.json({user:req.verifiedUser})

})

//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
// Take information from a form and post to data base, make suer user doesn't exist etc...
// post to data base 
router.post('/', function(req,res, next){
	console.log(req.body)
	// Test for user that already exisits with email and if the search returns a user 
	if(!req.body.fullName || !req.body.emailAddress || !req.body.password){
		let err = new Error('There is some missing information')
		err.status = 400;
		next(err)
	}else{
		console.log(req.body)
			User.findOne({emailAddress:req.body.emailAddress}, function(error, user){
				console.log(user)
					if(user){
						var err = new Error('There is already a user with that email')
						err.status = 400;
						next(err)
					}else if(!user){
						 //Grab informaton from the filled out forms and create a new user when the route is run
						User.create(req.body, function(error, user){
							// check to see if it has all of the information
							if(error){
								let err = new Error('there was an error with creating the user');
								err.status =  400;
								next(err)
							}else{//  set the status to 201 for the response and the location header to '/' and return no content
								console.log(user)
								res.location('/')
								res.status(201);
								res.json()		
							}
						})
					}
			});
	}
});

module.exports = router;

