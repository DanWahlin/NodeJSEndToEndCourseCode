'use strict';

var cartRepository  = require('../../../lib/cartRepository'),
    auth            = require('../../../lib/auth');

module.exports = function (router) {

    router.get('/', function (req, res, next) {

        cartRepository.getCart(req.session, function(err, cart) {

            //if (err) return next(err);

            res.json({
                cart: cart
            });
        });

    });

    router.post('/', function (req, res, next) {

        var cartData = {
            productId: req.body.productId,
            quantity: parseInt(req.body.quantity),
            priceType: req.body.priceType,
            discountCode: req.body.discountCode
        };

        cartRepository.addToCart(req.session, cartData, function(err, cart) {

            if (err) return next(err);

            res.json( { cart: cart } );
        });

    });

    router.put('/', function (req, res, next) {

        var postedCart = req.body.cart;

        cartRepository.updateCart(req.session, postedCart, function(err, cart) {

            if (err) return next(err);

            res.json({
                cart: cart
            });
        });

    });

    router.post('/discountcode', function (req, res, next) {

        var discountCode = req.body.discountCode;

        cartRepository.applyCartDiscountCode(req.session, discountCode, function(err, cartAndMessage) {

            if (err) return next(err);

            res.json(cartAndMessage);

        });

    });

    router.post('/checkout', function (req, res, next) {

        var isAuthenticated = req.isAuthenticated();

        if (!isAuthenticated) {
            req.session.goingTo = '/cart#/checkout';
        }

        cartRepository.getCart(req.session, function(err, cart) {

            if (err) return next(err);

            res.json( {
                cart: cart,
                isAuthenticated: isAuthenticated
            } );
        });

    });

    //Authenticated plus we check if they have a cart or not
    router.post('/completeOrder', auth.isAuthenticated(), function (req, res, next) {

        if (req.session.cart) {

            var checkoutData = req.body.checkoutData,
                cart = req.session.cart;
                checkoutData.total = cart.total;

            cartRepository.completeOrder(req, checkoutData, function(err, result) {

                if (err) return next(err);

                //result has transactionResult and purchase properties

                res.json( {
                    cart: cart,
                    transactionResult: result.transactionResult,
                    purchase: result.purchaseResult
                });

            });

        }
        else {

            res.json({
                cart: null,
                transactionResult: {
                    success: false,
                    message: 'Sorry, unable to find your shopping cart information.'
                }
            });

        }

    });

    router.post('/clear', auth.isAuthenticated(), function(req, res, next) {

        cartRepository.clearCart(req.session, function(err, cart) {

            if (err) return next(err);

            res.json({
                cart: cart
            })
        });

    });


};

