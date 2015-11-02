'use strict';

var mongoose    = require('mongoose'),
    Purchase    = require('./purchase'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId;

var userSchema = Schema({
    firstName               : { type : String, required: true },
    lastName                : { type : String, required: true },
    email                   : { type: String, unique: true, required: true },
    password                : { type : String, required: true },
    subscribeToNewsletter   : { type: Boolean },
    date                    : { type: Date, default: Date.now },
    lastUpdatedDate         : { type: Date, default: Date.now },
    lastLoginDate           : { type: Date, default: Date.now },
    purchases               : [ Purchase.schema ],
    userProgress            : [ {
        productId               : { type: ObjectId, turnOn: false, required: true },
        //moduleId                : { type: String, required: true },
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

/*
    userSchema.pre('save', function (next) {
        var user = this;

        //If the password has not been modified in this save operation, leave it alone (So we don't double hash it)
        if (!user.isModified('password')) {
            next();
            return;
        }
    });
*/

var UserModel = mongoose.model('user', userSchema, 'users');


module.exports = UserModel;
