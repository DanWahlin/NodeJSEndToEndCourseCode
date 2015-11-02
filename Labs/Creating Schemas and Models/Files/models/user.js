'use strict';

var mongoose    = require('mongoose'),
    Purchase    = require('./purchase'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId;

var userSchema = Schema({
    //Add Fields Here


    email                   : { type: String, unique: true, required: true },
    password                : { type : String, required: true },
    subscribeToNewsletter   : { type: Boolean },
    date                    : { type: Date, default: Date.now },
    lastUpdatedDate         : { type: Date, default: Date.now },
    lastLoginDate           : { type: Date, default: Date.now },
    purchases               : [ Purchase.schema ],
    userProgress            : [ {
        productId               : { type: ObjectId, turnOn: false, required: true },
        completedSections       : [ { type: String } ]
    } ],
    currentlyViewing        : [ {
        productId               : { type: ObjectId, turnOn: false, required: true, ref: 'product' },
        moduleId                : { type: String, required: true },
        sectionId               : { type: String, required: true },
        currentVideoTime        : { type: Number },
        videoUrl                : { type: String },
        lastViewed              : { type: Date, default: Date.now}
    } ],
    roles                   : [ String ]
});

//Create Model Here and Export




