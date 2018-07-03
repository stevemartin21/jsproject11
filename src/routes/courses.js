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
	Course.create(req.body,  function(error, course){
		console.log('so far so good')
		if(error){
			// Set error
			var err = new Error('There was an error, ');
			err.status = 400;
			next(err)
		}else{
			// set status and location
			res.location('/');
			res.status(201);
			res.json(course)
			
			//res.location('/')
		}
	})

})


//PUT /api/courses/:courseId 204 - Updates a course and returns no content
/// Must authenticate

router.put('/:courseId', [mid.check], function(req, res, next){
	console.log(req.params.courseId)
	Course.findByIdAndUpdate(req.params.courseId, { $set: req.body }, function(error, course){
		console.log('You got it')
		if(error){
			var err = new Error('There was an error, check it again')
			err.status = 400
			next(err)
		}
			console.log('its been updated')
			res.location('/:courseid')
			//res.json(course)
			res.status = 200;
			
		
	})
})


// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
// create a new review 
// Must authenticate
// create a review and add it to the review array on the course 
router.post('/:courseId/reviews',[mid.check], function(req, res, next){

	Review.create(req.body,  function(error, review){
		console.log(review._id)
		console.log(req.params.courseId)
		if(error){
			var err = new Error('There was an error in creating the review')
			err.status = 400;
			next(err)
		}else{
			Course.findById(req.params.courseId, { $push: { reviews:  review._id} }, function(error, course){
				console.log(course)
				if(error){
					// Set Errors
					var err = new Error('There was an error adding to array')
					err.status =400
					next(err)
				}else{
					//set back status and return to lcoation
					res.location('/')
					res.status(200)
					
				}
			})

			// need to push the review to the array 
		}
	})

	
})



module.exports = router;


