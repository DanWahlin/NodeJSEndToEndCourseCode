'use strict';

var userRepository  = require('../../../lib/userRepository'),
    auth             = require('../../../lib/auth');

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function(req, res, next) {

        var productId = req.query.productId;
        var userId = req.user._id;

        if (!productId) return res.json(null);

        userRepository.getProductAndUserProgress(userId, productId, function (err, productAndProgress) {

            //if (err) return next(err);

            res.json(productAndProgress);

        });


    });

    router.post('/', auth.isAuthenticated(), function (req, res, next) {

        var userProgress = req.body.userProgress;

        userRepository.updateUserProgress(req.user.id, userProgress, function(err, data) {

            //if (err) return next(err);

            var opStatus = { status: true }
            if (err) {
                opStatus.status = false;
                opStatus.message = err.message;
            }

            res.json(opStatus);

        });

    });

};
