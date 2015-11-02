'use strict';

var passport = require('passport'),
    helpers  = require('../../lib/helpers');

module.exports = function (router) {

    router.get('/', function (req, res) {

        var referrer = req.header('REFERER');
        //Don't add a redirect back to register or login screen after logging in
        if (referrer) req.session.goingTo = referrer;

        res.render('login', {
            messages: req.flash('userErrors'),
            email: req.query.email
        });
    });

    /**
     * Receive the login credentials and authenticate.
     * Successful authentications will go to / or if the user was trying to access a secured resource, the URL
     * that was originally requested.
     *
     * Failed authentications will go back to the login page with a helpful error message to be displayed.
     */
    router.post('/', function (req, res, next) {

        //Make sure a bot isn't hitting us
        if (helpers.isBot(req)) {
            console.log('Bot detected in login.controller.js POST');
            res.redirect('/');
            return;
        }

        var email = (req.body.email) ? req.body.email : '';

        if (email === '' || req.body.password === '') {
            res.render('login', {
                email: email,
                messages: ['Please enter your email address and password']
            });
        }
        else {

            //If they get an error logging in make sure that they aren't redirected to login page
            //once they login successfully!
            if (req.session.goingTo && req.session.goingTo.indexOf('login') > -1) {
                req.session.goingTo = null;
            }

            //Add Passport Authentication Code Here




        }

    });

};
