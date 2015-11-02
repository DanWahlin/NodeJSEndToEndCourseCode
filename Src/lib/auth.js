'use strict';

var User            = require('../models/user'),
    LocalStrategy   = require('passport-local').Strategy,
    bcrypt          = require('bcrypt-nodejs'),
    helpers         = require('./helpers');

var auth = function() {

    var init = function(passport) {
        //Give passport a way to serialize and deserialize a user. In this case, by the user's id.
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            User.findOne({_id: id}, 'firstName lastName email roles subscribeToNewsletter', function (err, user) {
                done(err, user);
            });
        });

        // =========================================================================
        // LOCAL LOGIN =============================================================
        // =========================================================================

        passport.use('local', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists

            User.findOne({email: { $regex: email, $options: 'i' }}, 'firstName lastName email password roles', function(err, user) {
                // if there are any errors, return the error before anything else
                if (err) return done(err);

                // if no user is found, return the message
                if (!user) return done(null, false, req.flash('userErrors', 'No user found.'));

                //Ensure password in DB matches plaintext password
                passwordsMatch(password, user.password, function(err, match) {
                    if (!match) {
                        return done(null, false, req.flash('userErrors', 'Wrong password.'));
                    }
                    else {
                        // all is well, return successful user
                        //req.session.goingTo = null;
                        user.lastLoginDate = helpers.getDateTime();
                        user.save(function(err) {
                            return done(null, user);
                        });
                    }
                });
            });
        }));
    },

    passwordsMatch = function(password, currHashedPassword, callback) {
        bcrypt.compare(password, currHashedPassword, function(err, match) {
            callback(err, match);
        });
    },

    hashPassword = function(password, callback) {

        bcrypt.hash(password, null, null, function(err, hash) {
            callback(err, hash);
        });

    },

    generateTempPassword = function(callback) {
        var buffer = new Buffer(8);
        for (var i = 0; i < buffer.length; i++) {
            buffer[i] = Math.floor(Math.random() * 256);
        }
        var password = buffer.toString('base64');
        hashPassword(password, function(err, hash) {
            console.log('hash: ' + hash);
            callback(err, { password: password, hash: hash });
        });
    },

    /**
    * A helper method to determine if a user has been authenticated, and if they have the right role.
    * If the user is not known, redirect to the login page. If the role doesn't match their given roles,
    * show a 403 page.
    * @param role The role that a user should have to pass authentication.
    */
    isAuthenticated = function (role) {

        return function (req, res, next) {

            if (!req.isAuthenticated()) {

                //If the user is not authorized, save the location that was being accessed so we can redirect afterwards
                req.session.goingTo = req.url;
                res.redirect('/login');
                return;
            }

            //If a role was specified, make sure that the user has it
            if (role && req.user && req.user.roles && req.user.roles.indexOf(role) === -1) {
                res.status(401);
                res.render('errors/401');
                return;
            }

            next();
        };
    },

    //Add the user to the response context so we don't have to manually do it
    injectAuth = function (req, res, next) {
        res.locals.isAuthenticated = req.isAuthenticated();
        if (req.isAuthenticated()) {
            if (req.user) res.locals.user = req.user;
        }
        next();
    };

    return {
        init: init,
        hashPassword: hashPassword,
        passwordsMatch: passwordsMatch,
        generateTempPassword: generateTempPassword,
        isAuthenticated: isAuthenticated,
        injectAuth: injectAuth
    };

}();


module.exports = auth;
