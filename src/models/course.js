'use strict'

/////////////////////////////////////////////////////
// Included Modules
var mongoose = require('mongoose');
// Incuded Files
var User = require('./user');
var Review = require('./review');
//////////////////////////////////////////////////////

// Create Schema 
var Schema = mongoose.Schema;
var courseSchema = new Schema({
	//  reference User Model to incorporate into 
	user: {
		type: Schema.Types.ObjectId,
        ref: 'user'},
    title:{
    	type: String,
    	required: [true, 'You need a title']
    },
    description:{
    	type: String,
    	required:[true, 'You need a description']
    },
    estimatedTime:{
    	type:String
    },
    materialsNeeded:{
    	type:String
    },
    steps: [
    	{
    		stepNumber:{
    			type:Number
    		},
    		title:{
    			type:String,
    			required:[true, 'The title is requried'],
    			description:{
    				type: String,
    				required:[true, 'The Description is required']
    			}
    		}
    	}
    ],
    //  incorporate Reviews Model into schema 
    reviews: [

    	{	
       		type: Schema.Types.ObjectId,
        	ref: 'review'
    		}
    ]
})
//mongoose.Types.ObjectId 
// Create Model 

var Course = mongoose.model('course', courseSchema);

// Export Model

module.exports= Course;