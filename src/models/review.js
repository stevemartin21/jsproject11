'use strict'

/////////////////////////////////////////////////////
// Modules &  Included Files 
var mongoose = require('mongoose');
var user = require('./user');
///////////////////////////////////////////

//Create Schema

var Schema = mongoose.Schema;

var reviewSchema = new Schema({
	// Incorporate User info into ratin
	user: {
		type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postedOn: {
    	type: Date, default: Date.now()
    },
    rating: {
    	type: Number,
    	required:[true, 'The rating is required'],
    	min: 1,
    	max:5
    },
    review:{
    	type:String
    }
})

// Model Create model for the schema

var Review = mongoose.model('review', reviewSchema);

// Export Review

module.exports = Review;