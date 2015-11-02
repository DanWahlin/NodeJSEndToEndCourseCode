'use strict';

var cartRepository  = require('../../lib/cartRepository');

module.exports = function (router) {

    router.get('/', function (req, res, next) {

        cartRepository.getCart(req.session, function(err, cart) {

            if (err) return next(err);

            res.render('cart', {
                cart: cart
            });
        });

    });

};

