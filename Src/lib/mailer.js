'option explicit'

//Get an account at https://mandrill.com/signup
//Then update config/config.json with your user name and api key/password

var nodemailer      = require('nodemailer'),
    config          = require('../config/config.json');

var mailer = function() {

    var sendEmail = function(msg, callback) {
        var mailConfig = config.mandrillConfig;

        var opts = {
            host: mailConfig.host,
            port: mailConfig.port,
            auth: {
                user: mailConfig.userName,
                pass: mailConfig.password
            }
        };

        var smtpTransport = nodemailer.createTransport(opts);

        var mailOptions = {
            from: msg.from || mailConfig.adminEmail,
            to: msg.to,
            subject: msg.subject,
            text: msg.text,
            html: msg.html,
            generateTextFromHTML: true
        }

        smtpTransport.sendMail(mailOptions, function(err, response){
            if (err){
                console.log(err);
                callback(err, { status: false, response: response });
                return;
            } else{
                console.log('Message sent: ' + response.message);
                callback(err, { status: true, response: response });
            }
        });


    };

    return {
        sendEmail: sendEmail
    };

}();

module.exports = mailer;

