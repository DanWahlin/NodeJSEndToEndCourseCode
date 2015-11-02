"use strict";

var auth            = require("../../lib/auth"),
    User            = require("../../models/user"),
    userRepository  = require("../../lib/userRepository");

module.exports = function (router) {

    router.get("/", auth.isAuthenticated(), function (req, res) {

        var user = req.user;

        userRepository.getUserById(user._id, function(err, user) {

            res.render("profile", {
                user: user
            });

        });

    });

    router.post("/", auth.isAuthenticated(), function (req, res) {

        var user = req.user;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        //ALWAYS lower case email since MongoDB is case sensitive with queries!!
        user.email = req.body.email.toLowerCase();
        user.subscribeToNewsletter = (req.body.subscribeToNewsletter) ? true : false;

        var currPassword = req.body.password,
            newPassword = req.body.newPassword,
            newPassword2 = req.body.newPassword2;

        userRepository.getUserPassword(user._id, function(err, userWithPassword) {

            user.password = userWithPassword.password;
            userRepository.updateUserProfile(req, user, currPassword, newPassword, newPassword2, function (err, user) {
                if (!err) {
                    userRepository.getUserById(user._id, function(err, freshUser) {

                        var userErrors = req.flash("userErrors");
                        res.render("profile", {
                            messages: userErrors,
                            profileUpdated: userErrors.length === 0,
                            user: freshUser
                        });

                    });
                }
                else {
                    res.render("profile", {
                        messages: req.flash("userErrors"),
                        profileUpdated: false
                    });
                }
            });

        });
    });

};
