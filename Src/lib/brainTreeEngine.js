'use strict';
//Create a Sandbox account here: https://www.braintreepayments.com/get-started
var braintree = require('braintree');

var brainTreeEngine = function () {
    var paymentGateway,

        init = function(conf) {
            paymentGateway = braintree.connect({
                environment: braintree.Environment.Sandbox,
                merchantId: conf.merchantId,
                publicKey: conf.publicKey,
                privateKey: conf.privateKey
            });
        },

        purchase = function(checkoutData, callback) {

            var saleDetails = {
                amount: checkoutData.total,
                creditCard: {
                    number          : checkoutData.creditCardNumber,
                    expirationMonth : checkoutData.expirationMonth,
                    expirationYear  : checkoutData.expirationYear,
                    cvv             : checkoutData.cvvCode
                },
                options: {
                  submitForSettlement: true
                }
            };

            paymentGateway.transaction.sale(saleDetails, function (err, result) {
                if (err) {
                    callback(err, result);
                    return;
                }

                if (result.success) {
                    console.log('Transaction ID: ' + result.transaction.id);
                } else {
                    console.log(result.message);
                }

                callback(err, result);
            });
        };


    return {
        init: init,
        purchase: purchase
    };

}();

module.exports = brainTreeEngine;
