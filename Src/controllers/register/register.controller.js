"use strict";

var User            = require("../../models/user"),
    userRepository  = require("../../lib/userRepository"),
    helpers         = require('../../lib/helpers');

module.exports = function (router) {

    router.get("/", function (req, res) {
        res.render("register", {
            user: { subscribeToNewsletter: true }
        });
    });

    router.post("/", function (req, res) {
        
        //Make sure a bot isn't hitting us
        if (helpers.isBot(req)) {
            console.log('Bot detected in register.controller.js POST');
            res.redirect('/');
            return;
        }

        var newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            //ALWAYS lower case email since MongoDB is case sensitive with queries!!
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            subscribeToNewsletter: (req.body.subscribeToNewsletter) ? true : false,
            roles: ["user"]
        });

        var password2 = req.body.password2;

        userRepository.insertUser(req, newUser, password2, function (err, insertResponse) {

            if (!err && insertResponse.valid && insertResponse.user) {
                req.login(insertResponse.user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect('/');
                });
            }
            else {

                res.render('register', {
                    messages: req.flash("userErrors"),
                    user: newUser
                });

            }

        });

    });

};