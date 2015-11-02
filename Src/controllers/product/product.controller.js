'use strict';

var productRepository = require("../../lib/productRepository"),
    userRepository    = require("../../lib/userRepository");

module.exports = function (router) {

    router.get('/:sku', function (req, res, next) {

        var sku = req.params.sku,
            discountCode = req.query.discountCode,
            userId = (req.user) ? req.user._id : null;

        productRepository.getProductBySku(sku, function (err, product) {

            if (err) return next(err);

            if (product) {

                //Get discountCode is one is provided
                //3rd parameter lets us lookup a discountCode based upon the existence of a specific property
                //Useful with Udemy product since there will normally be a discount applied
                var propertyNameToLookup = (product.pricing.udemyPrice && !discountCode) ? "udemyPrice" : null;

                productRepository.getDiscountCodeByProduct(product._id, discountCode, propertyNameToLookup, function(err, code) {

                    if (code) {
                        product = productRepository.applyDiscountCode(product, code);
                    }

                    if (!userId) {
                        res.render('product', {
                            product: product
                        });
                    }
                    else {
                        //Get all of the purchases for this particular user
                        userRepository.getUserPurchaseByProductId(userId, product._id, function (err, userPurchase) {

                            if (err) return next(err);

                            //Handle rental expiration dates
                            var expirationDate = (userPurchase) ? userPurchase.product.expirationDate : null,
                                expired = (expirationDate) ? Date.now() > expirationDate : false;

                            product.userPurchaseInfo = {
                                purchasedAndNotExpired: (userPurchase && !expired) ? true : false,
                                purchased: (userPurchase) ? true  : false,
                                priceType: (userPurchase) ? userPurchase.product.priceType : null,
                                expirationDate: expirationDate,
                                expired: expired
                            }

                            res.render('product', {
                                product: product
                            });

                        });
                    }
                });

            }
            else {

                res.render('product', {
                    product: null,
                    userPurchaseInfo: {
                        purchased: false,
                        priceType:  null,
                        expirationDate: null,
                        expired: false
                    }
                });

            }


        });

    });

};
