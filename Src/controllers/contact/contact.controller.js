"use strict";

var mailer  = require('../../lib/mailer'),
    config  = require('../../config/config.json'),
    helpers = require('../../lib/helpers');

module.exports = function (router) {
    
    router.get('/', function(req, res, next) {
        
        var subject = req.query.subject;
        
        res.render('contact', {
            contactForm: {
                subject: subject
            }
        });    
    });
    

    router.post('/', function (req, res, next) {
        
        //Make sure a bot isn't hitting us
        if (helpers.isBot(req)) {
            console.log('Bot detected in contact.controller.js POST');
            res.render('contact', { emailSent: true });
            return;
        }

        var contactForm = {
            subject:    req.body.subject,
            from:       req.body.from,
            to:         config.mandrillConfig.adminEmail,
            text:       req.body.text
        };            

        mailer.sendEmail(contactForm, function(err, email) {

            if (!err) {
                res.render('contact', { emailSent: email.status });
            }
            else {
                flashFailureAndRender(req, res, email, contactForm);
            }

        });

    });
    
    function flashFailureAndRender(req, res, email, contactForm) {
        req.flash('contactMessage', 'We\'re sorry, but a problem occurred when trying to send your message. We apologize for the inconvenience but have been notified about the problem and will resolve it as soon as possible.');
        res.render('contact', { emailSent: false, contactForm: contactForm, message: req.flash('contactMessage') });
    }

};