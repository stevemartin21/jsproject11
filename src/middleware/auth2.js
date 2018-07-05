'use strict';
////////////////////////////////////////////////////////////////////
//Included Modules 
//User Model 
var User = require('../models/user');
// NPM Modules 
var auth = require('basic-auth');
/////////////////////////////////////////////////
//Functions 
////////////////////////////////////////////////////////////////////
//  Need to create function and incorporate basic auth taken from the req
 function check(req, res, next){
	var verify = auth(req);
	console.log(verify.name)
	console.log(verify.pass)
	if(!verify.name || !verify.pass){
		var err = new Error('You must have a username and / or password to continue');
		err.status = 400;
		next(err);
	}
	//Checck to see if there is a email and password taht has come in
	else if(verify){
		// Find the user with the email addres s
		console.log('One')
		User.findOne({emailAddress:verify.name})
			.exec(function(error, user){
				// create error object to pass in 
				//console.log(user.emailAddress)
				//console.log(user.password)
				if(error){
					var err = new Error('There was an error');
					err.status = 400
					next(err);
				}else if(!user){
					var err = new Error('No user was found');
					err.status = 400
					next(err);
				}else{
					console.log('Three')
					// call static metod from User Model 
					User.authenticate(verify.name, verify.pass, function(error, user){

						// validate if there is no user 
						console.log(user);
						if(error){
							// set error code 
							var err = new Error('There was an error on authenticate')
							err.status = 401;
							next(err)
						}else if( !user){
							// Set error code if there is no user 
							var err2 = new Error('No User found or incorrect password');
							err2.status = 401;
							next(err2)
						}else{
							// make user is avaialble for each middlewware
							req.verifiedUser = user; // If the authenticate method returns the user, then set the user document on the request so that each following middleware function has access to it.
							//console.log(verfifiedUser)
							return next()
						}
					})
				}
			})
		}
}

module.exports.check = check;