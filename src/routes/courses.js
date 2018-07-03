const express = require('express');

var router = express.Router();

var User  = require('../models/user');
var Course  = require('../models/course');
var Review  = require('../models/review');
var mid = require('../middleware/auth2');

// Returns the Course "_id" and "title" properties
// Basically done
router.get('/', function(req, res, next){
	// return the course 
	console.log('Grab courses')
	// Grab all the courses 
	Course.find({}, '_id title')
	// find the courees and send back the id and title properties 
		.exec(function(error, courses){
			//build error object to send back to middleware
			if(error){
				//create error 
				var err = new Error('There was an error');
				err.status = 400;
				next(err)
			}else{
				//test to see if functions
				res.status(200)
				res.json(courses)
			}
		})
})

//  GET /api/course/:courseId 200

// grab a course based on the di 
//Almost done 

router.get('/:courseId', function(req,res, next){
// find the course based on the paramerts pupilated user and review 
	// find the course with the given id and populate the user docuemnt and reviews docuemtn
	console.log( req.params.courseId);
	//console.log('So far get course')
	Course.findById(req.params.courseId)
		.populate('user')
		.populate('reviews')// 
			.exec(function(error, course){
				//console.log('no luck 2')
				//console.log('One more try')
				// Error Hanlding 
				if(error){
					var err = new Error('The course was not found, prob an erro in populate ');
					err.status = 400;
					next(err);
				}else{
					// Set status and return the object in json form 
					res.status(200);
					res.json(course)
				}
			})
})


// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content  ///create a coruse
// Must authenticate
//Creat new course// Almost done

router.post('/', mid.check, function(req, res, next){
	Course.create(req.body,  function(error){
		console.log('so far so good')
		if(error){
			// Set error
			var err = new Error('There was an error, ');
			err.status = 400;
			next(err)
		}else{
			// set status and location
			console.log('A Course was created')
			res.status(201);
			res.location('/')
		}
	})

})


//PUT /api/courses/:courseId 204 - Updates a course and returns no content
/// Must authenticate

router.put('/:courseId', [mid.check], function(req, res, next){
	console.log(req.params.courseId)
	Course.findByIdAndUpdate(req.params.courseId, req.body, function(error){
		if(error){
			var err = new Error('There was an error, check it again')
			err.status = 400
			next(err)
		}
			res.status = 200;
			res.location('/')
		
	})
})


// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
// create a new review 
// Must authenticate
router.post('/:courseId/reviews',[mid.check], function(req, res, next){

	Review.create(req.body,  function(error, review){
		if(error){
			var err = new Error('There was an error')
			err.status = 400;
			next(err)
		}else{
			Course.findById(req.params.courseId, { $push: { reviews: review_Id } }, function(error){
				if(error){
					// Set Errors
					var err = new Error('There was an error')
					err.status(400)
					next(err)
				}else{
					//set back status and return to lcoation
					res.status(200)
					res.location('/')
				}
			})

			// need to push the review to the array 
		}
	})

	// need to add new review to courseId araay
})






module.exports = router;


/*

Use this middleware in the following routes:
POST /api/courses
PUT /api/courses/:courseId
GET /api/users
POST /api/courses/:courseId/reviews


Update any POST and PUT routes to return Mongoose validation errors.
Use the next function in each route to pass any Mongoose validation errors to Express’s global error handler
Send the Mongoose validation error with a400 status code to the user


Set up the following routes (listed in the format HTTP VERB Route HTTP Status Code):
GET /api/courses 200 - Returns the Course "_id" and "title" properties
GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
When returning a single course for the GET /api/courses/:courseId route, use Mongoose population to load the related user and reviews documents.
POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
PUT /api/courses/:courseId 204 - Updates a course and returns no content
POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content














*/