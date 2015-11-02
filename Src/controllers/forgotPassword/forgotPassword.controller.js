'option explicit'

var mailer          = require('../../lib/mailer'),
    auth            = require('../../lib/auth'),
    userRepository  = require('../../lib/userRepository');

module.exports = function (router) {

    router.get('/', function (req, res, next) {
        res.render('forgotPassword');
    });

	router.post('/', function(req, res, next) {
        
        //Make sure a bot isn't hitting us
        if (helpers.isBot(req)) {
            console.log('Bot detected in forgotPassword.controller.js POST');
            res.render('forgotPassword', { emailSent: true });
            return;
        }
        
        var email = req.body.email;

        userRepository.getUserByEmail(email, function(err, user) {

            if (err) return next(err);

            if (user) {
                auth.generateTempPassword(function(err, passwordInfo) {

                    if (err) return next(err);

                    var tempPassword = passwordInfo.password;
                    var hash = passwordInfo.hash;
                    user.password = hash;

                    //Update user's password in DB
                    userRepository.updateUser(req, user, function(err, updatedUser) {

                        if (err) return next(err);

                        if (updatedUser) {
                            //Send email
                            var msg = {
                                to: updatedUser.email,
                                subject: 'Your codewithdan.com Password Reset Information',
                                html: 'Hi ' + updatedUser.firstName + ', <br /><br />Here is your temporary password: ' + tempPassword +
                                '<br /><br />Please visit <a href="http://codewithdan.com/login">http://codewithdan.com/login</a>. ' +
                                'After logging in with the password shown above (we recommend copying and pasting the password) please visit your profile to change your password if you would like.' +
                                '<br /><br />Thanks, <br />Code with Dan Team'
                            };
                            mailer.sendEmail(msg, function(err, emailedUser) {
                                if (!err) {
                                    res.render('forgotPassword', { emailSent: true });
                                }
                                else {
                                    flashFailureAndRender(req, res, email);
                                }
                            });
                        }
                        else {
                            flashFailureAndRender(req, res, email);
                        }
                    });
                });


            }
            else {
                req.flash('forgotPasswordMessage', 'Sorry, but that email address was not found.');
                res.render('forgotPassword', { email: email, messages: req.flash('forgotPasswordMessage') });
            }
        });
    });

    function flashFailureAndRender(req, res, email) {
        req.flash('forgotPasswordMessage', 'We are sorry, but we were unable to reset your password. Please <a href="/contact">contact us</a> and we will gladly help you out.');
        res.render('forgotPassword', { email: email, message: req.flash('forgotPasswordMessage') });
    }
};
