"use strict";

var productRepository   = require("../lib/productRepository"),
    brainTreeEngine     = require("./brainTreeEngine"),
    userRepository      = require("../lib/userRepository"),
    helpers             = require('./helpers');

var cartRepository = function() {
    
    var carts = [];
    
    var clearCart = function(session, callback) {
        var cart = session.cart = createCart();
        callback(null, cart);
    },

    getCart = function(session, callback) {

        if (session.cart) {
            callback(null, session.cart);
        }
        else {
            callback(null, null);
        }

    },
    
    removeFromCart = function(cart, productId) {

        if (cart && cart.items) {

            for(var i=0,len=cart.items.length;i<len;i++) {
                var product = cart.items[i];
                if (product.id.toString() === productId) { 
                    cart.items.splice(i,1);
                    break;
                }
            }

        }

    },
        
    updateCartTotal = function(cart) {

        cart.total = 0;

        for (var i = 0;i < cart.items.length;i++) {

            var purchaseItem = cart.items[i],
                priceType = purchaseItem.priceType,
                price = purchaseItem.pricing[priceType],
                discountPrice = purchaseItem.pricing["discount" + priceType.charAt(0).toUpperCase() + priceType.slice(1)],
                finalPrice = (discountPrice) ? discountPrice : price;

            purchaseItem.totalBeforeDiscount = price * purchaseItem.quantity;
            purchaseItem.total = finalPrice * purchaseItem.quantity;
            purchaseItem.discountAmount = (discountPrice) ? (price - discountPrice) * purchaseItem.quantity : 0,
            purchaseItem.priceBeforeDiscount = price;
            purchaseItem.price = finalPrice;
            cart.total += purchaseItem.total;

        }

        if (cart.total < 0) cart.total = 0;

        if (cart.total === 0) { //reset things
            cart.discountAmount = 0;
            cart.totalBeforeDiscount = 0;
            cart.discountCode = null;
        }

        if (cart.discountCode) { //Subtract off cart discountCode amount
            processDiscountCode(cart);
        }
        return cart;
    },
      
    addToCart = function(session, cartData, callback) {
        
        if (!cartData.productId || !session) return callback(new Error("Invalid cart data. Cannot update cart"), null);

        var cart = (session.cart) ? session.cart : session.cart = createCart();
        
        productRepository.getProductForCart(cartData.productId, function(err, product) {
            
            if (err) return callback(err, null);

            //Remove any duplicate product from the cart
            removeFromCart(cart, cartData.productId);

            if (cartData.discountCode) {

                //Get the discount code
                //Pass false for 3rd parameter (propertyName) since we'll have a discount code at this point and it's not needed
                productRepository.getDiscountCodeByProduct(cartData.productId, cartData.discountCode, null, function (err, discountCode) {

                    if (err) return callback(err, null);
                    if (discountCode) {
                        product = productRepository.applyDiscountCode(product, discountCode);
                    }

                    addProductToCart(session, product, cartData);
                    callback(null, cart);

                });

            }
            else {
                addProductToCart(session, product, cartData);
                callback(null, cart);
            }
            
        });       

    },

    addProductToCart = function(session, product, cartData) {

        var cart = session.cart;

        var purchaseItem = {
            id                      : product._id,
            sku                     : product.sku,
            title                   : product.title,
            pricing                 : {
                rentPrice           : product.pricing.rentPrice,
                discountRentPrice   : (cartData.discountCode) ? product.pricing.discountRentPrice : 0,

                buyPrice            : product.pricing.buyPrice,
                discountBuyPrice    : (cartData.discountCode) ? product.pricing.discountBuyPrice : 0,

                premiumPrice        : product.pricing.premiumPrice,
                discountPremiumPrice: (cartData.discountCode) ? product.pricing.discountPremiumPrice : 0,

                licensePrice        : product.pricing.licensePrice,
                discountLicensePrice: (cartData.discountCode) ? product.pricing.discountLicensePrice : 0,

                udemyPrice          : product.pricing.udemyPrice,
                discountUdemyPrice  : (cartData.discountCode) ? product.pricing.discountUdemyPrice : 0
            },
            priceType               : cartData.priceType,
            price                   : 0,
            total                   : 0,
            totalBeforeDiscount     : 0,
            quantity                : cartData.quantity,
            discountCode            : cartData.discountCode
        };

        cart.items.push(purchaseItem);

        if (cartData.discountCode) cart.itemHasDiscountCode = true;

        updateCartTotal(cart);

        session.cart = cart;

    },

    //Discount code that applies to entire cart rather than just a single product
    applyCartDiscountCode = function(session, discountCode, callback) {

        var cart = session.cart;

        //Check if we have a cart, a discountCode, and that the discountCode hasn't been used already
        if (session.cart && discountCode && !session.cart.discountCode && !session.cart.itemHasDiscountCode) {

            productRepository.getDiscountCode(discountCode, function (err, code) {

                //Make sure the code doesn't have a productId associated with it
                //Those types of discount codes can't be used here since they only
                //apply to a single product
                if (err || !code || code.productId || !code.percentage || !productRepository.validateDiscountCode(code)) {
                    console.log('Invalid discount code')
                    return callback(err, {
                        cart: cart,
                        discountCodeMessage: "Unable to apply this discount code",
                        discountCodeStatus: false
                    });
                }

                cart.discountCode = discountCode; //Track discountCode used for this cart
                cart.discountPercentage = code.percentage;
                processDiscountCode(cart);
                session.cart = cart;

                callback(null, {
                    cart: cart,
                    discountCodeMessage: code.percentage + "% discount applied!",
                    discountCodeStatus: true
                });

            });
        }
        else {

            var discountCodeMessage = '';

            //No cart or no cart items
            if (!session.cart || !session.cart.items || session.cart.items.length === 0) {
                discountCodeMessage : "No items were found in your cart."
            }

            //Discount code has already been used, can't use more than 1
            if (session.cart.discountCode) {
                discountCodeMessage : "Only 1 discount code can be used per order."
            }

            if (session.cart.itemHasDiscountCode) {
                discountCodeMessage : "This discount code cannot be combined with a product discount."
            }

            callback(null, {
                cart: cart,
                discountCodeMessage: discountCodeMessage,
                discountCodeStatus: false
            });

        }

    },

    processDiscountCode = function(cart) {
        cart.totalBeforeDiscount = cart.total;  //Track original total before discountCode was applied
        cart.total = cart.total - (cart.total * (code.percentage / 100));
        cart.discountAmount = cart.totalBeforeDiscount - cart.total;
    },

    updateCart = function(session, cart, callback) {

        //We can't trust that the cart that was passed in is valid
        //since it was sent via Ajax. We can only count on the 
        //productIds and quantity (productIds will be validated again at final checkout). 
        //Use productIds and quantities to update the session cart which has
        //valid pricing info in it and can't be changed by the client.

        var sessionCart = session.cart;
        sessionCart.total = 0.00; //Reset cart total
        sessionCart.itemHasDiscountCode = false; //Track if any purchase items

        var len = cart.items.length;
        while (len--) { //Going backwards since we may be removing items
            var cartItem = cart.items[len];
            if (cartItem.quantity <= 0) {
                removeFromCart(sessionCart, cartItem.id);
            }
            else {
                //Update individual items in session cart
                for(var i = 0 ;i < sessionCart.items.length;i++) {
                    var sessionCartItem = sessionCart.items[i];

                    //Track if an item has a discount code
                    if (sessionCartItem.discountCode) sessionCart.itemHasDiscountCode = true;

                    if (sessionCartItem.id.toString() === cartItem.id.toString()) { 
                        sessionCartItem.quantity = cartItem.quantity;
                        break;
                    }
                }               
            }            
        }

        updateCartTotal(sessionCart);
        session.cart = sessionCart;
        callback(null, sessionCart);

    },

    completeOrder = function(req, checkoutData, callback) {

        brainTreeEngine.purchase(checkoutData, function(err, transactionResult) {
            if (err || !transactionResult.success) {
                return callback(err, {
                    purchase: null,
                    transactionResult: transactionResult
                });
            }

            //Update user purchases
            userRepository.addPurchase(req, checkoutData, transactionResult, function(err, purchase) {

                callback(err, {
                    transactionResult: transactionResult,
                    purchase: purchase
                });

            });
            
        });

    },
        
    injectCart = function(req, res, next) {
        if (req.session) {
            var cart = req.session.cart;
            res.locals.cartTotal = (cart) ? cart.total : "0.00";
            res.locals.sessionEnabled = true; 
        }
        else {
            res.locals.sessionEnabled = false;   
        }
        next();
    },
        
    createCart = function() {
        return {
            total: 0,
            items: []
        };
    };
    
    return {
        getCart                 : getCart,
        clearCart               : clearCart,
        applyCartDiscountCode   : applyCartDiscountCode,
        addToCart               : addToCart,
        updateCart              : updateCart,
        completeOrder           : completeOrder,
        injectCart              : injectCart
    };
}();

module.exports = cartRepository;
