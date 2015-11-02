'use strict';

var helpers                 = require('./helpers'),
    User                    = require('../models/user'),
    Purchase                = require('../models/purchase'),
    DiscountCode            = require('../models/discountCode'),
    productRepository       = require('./productRepository'),
    auth                    = require('../lib/auth');

var userRepository = function() {

    var getUserByEmail = function(email, callback) {
        User.findOne({ 'email' :  email.toLowerCase() }, function(err, user) {
            callback(err, user);
        });
    },

    getUserById = function(id, callback) {
        User.findById(id, function (err, user) {
            return callback(err, user);
        });
    },

    getUserPassword = function(id, callback) {
        User.findById(id, 'password', function (err, user) {
            return callback(err, user);
        });
    },

    updateUser = function(req, user, callback) {
        validateUser(req, user, null, function(err, valid, userToValidate) {
            if (valid) {
                userToValidate.lastUpdatedDate = new Date();
                userToValidate.save(function(err) {
                    return callback(err, userToValidate);
                });
            }
            else {
                return callback(err, userToValidate);
            }
        });
    },

    updateUserProfile = function(req, user, currPassword, newPassword, newPassword2, callback) {
        //Check if they're resetting their password
        if (currPassword !== '' && newPassword !== '' && newPassword2 !== '') {
            //Verify they're using the correct password
            auth.passwordsMatch(currPassword, user.password, function(err, match) {

                if (err) {
                    req.flash('userErrors', 'The current password you entered is incorrect');
                    return callback(err, user);
                  }

                if (match) { //They entered the correct current password so update their existing password with the new one and validate user
                    user.password = newPassword;
                    user.lastUpdatedDate = new Date();

                    validateUser(req, user, newPassword2, function(err, valid, validatedUser) {
                        if (!err && valid) {
                            hashPasswordAndSave(validatedUser, function(err, savedUser) {
                                return callback(err, savedUser);
                            });
                        }
                        else {
                            //req.flash('userErrors', 'Unable to validate user');
                            return callback(err, validatedUser);
                        }
                    });
                }
                else {
                    req.flash('userErrors', 'Incorrect current password entered');
                    return callback(err, user);
                }
            });
        }
        //See if they entered a current password not new password
        else if (currPassword !== '' && newPassword === '' && newPassword2 === '') {
            req.flash('userErrors', 'Please enter the new password that you would like to use');
            return callback(null, user);
        }
        else {
            //Validate user data except for password since they're not changing it
            validateUser(req, user, null, function(err, valid, validatedUser) {
                if (!err && valid) {
                    validatedUser.lastUpdatedDate = helpers.getDateTime();
                    validatedUser.save(function(err) {
                        if (err) {
                            req.flash('userErrors', err.message);
                            return callback(err, validatedUser);
                        }
                        return callback(null, validatedUser);
                    });
                }
                else {
                    //req.flash('userErrors', 'Unable to validate user');
                    return callback(err, validatedUser);
                }
            });
        }
    },

    validateUser = function(req, user, password2, callback) {

        var reEmail = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
        var valid = true;

        getUserByEmail(user.email, function(err, foundUser) {
            // if there are any errors, return the error
            var existingUser = foundUser;
            
            if (err) {
                req.flash('userErrors', err.message);
                valid = false;
            }
            else {
                // check to see if there's already a user with that email
                if (existingUser && existingUser._id.id !== user._id.id) {
                    req.flash('userErrors', 'Sorry, that email address is already taken. Please enter a different email address.');
                    valid = false;
                }
                else {
                    if (user.firstName === '' || user.lastName === '') {
                        req.flash('userErrors', 'Please enter your first and last name');
                        valid = false;
                    }
                    if (!reEmail.test(user.email)) {
                        req.flash('userErrors', 'Please enter a valid email address');
                        valid = false;
                    }

                    //Password2 used when signing up but not when updating user
                    if (password2 != null && password2 != undefined && (password2 === '' || user.password !== password2)) {
                        req.flash('userErrors', 'Your passwords do not match');
                        valid = false;
                    }
                    if (user.password && user.password.length < 8) {
                        req.flash('userErrors', 'Password must be 8 or more characters');
                    }
                    if (user.password === '') {
                        req.flash('userErrors', 'Please enter a password');
                        valid = false;
                    }
                }
            }
            
            callback(err, valid, user);
        });

    },

    hashPasswordAndSave = function(user, callback) {

        //ALWAYS lower case email since MongoDB is case sensitive with queries!!
        if (user.email) user.email = user.email.toLowerCase();

        auth.hashPassword(user.password, function(err, hashedPassword) {
            if (err) return callback(err, user);

            user.password = hashedPassword;
            user.lastUpdatedDate = helpers.getDateTime();

            // save the user
            user.save(function(err) {
                return callback(err, user);
            });

        });

    },

    insertUser = function(req, newUser, password2, callback) {
        validateUser(req, newUser, password2, function(err, valid, user) {
            if (valid) {
                hashPasswordAndSave(user, function(err, hashedUser) {
                    return callback(err, createInsertResponse(valid, hashedUser));
                });
            }
            else {
                return callback(err, createInsertResponse(valid, user));
            }
        });
    },

    getExpirationDate = function(priceType) {

        switch (priceType) {
            case 'rentPrice':
                return helpers.addDays(8);
/*          case 'buyPrice':
                return null;
            case 'premiumPrice':
                return null;
            case 'licensePrice':
                return null;
            case 'udemyPrice':
                return null;*/
            default:
                return null;
        }

    },

    addPurchase = function(req, checkoutData, transactionResult, callback) {
        var cart = req.session.cart;
        var discountCodes = [];

        var items = [];
        for (var i = 0;i < cart.items.length;i++) {
            var cartItem = cart.items[i];
            items.push({
                productId       : cartItem.id,
                sku             : cartItem.sku,
                title           : cartItem.title,
                quantity        : cartItem.quantity,
                price           : cartItem.price,
                originalPrice   : cartItem.originalPrice,
                total           : cartItem.total,
                originalTotal   : cartItem.originalTotal,
                priceType       : cartItem.priceType,
                discountCode    : cartItem.discountCode,
                expirationDate  : getExpirationDate(cartItem.priceType)
            });
            //Track all discount codes so can increment the numberOfUses
            if (cartItem.discountCode) discountCodes.push(cartItem.discountCode);
        }
        //Track discount code so can increment the numberOfUses
        if (cart.discountCode) discountCodes.push(cart.discountCode);

        var purchase = new Purchase({
            transactionId   : transactionResult.transaction.id,
            total           : cart.total,
            items           : items,
            discountCode    : cart.discountCode,
            originalTotal   : cart.originalTotal,
            purchaseDate    : new Date()
        });

        //Insert user purchase
        User.findByIdAndUpdate(
            req.user.id,
            { $push: { 'purchases': purchase.toObject() }, $set: { lastUpdatedDate: helpers.getDateTime() }}, //toObject() required!
            { upsert: true },
            function(err, user) {

                if (err) {
                    return callback(err, purchase);
                }

                //Increment discount code's numberOfUses value for all used discount codes
                if (discountCodes.length) {
                    DiscountCode.update({ code: {$in: discountCodes } },
                        { $inc: { numberOfUses: 1 } },
                        { multi: true },
                        function (err, numberAffected) {
                            console.log('Number of discount codes updated: ' + numberAffected);
                            return callback(err, purchase);
                        });
                }
                else {
                    return callback(null, purchase);
                }
            });

    },

    createInsertResponse = function(valid, user) {
        return {
            valid: valid,
            user: user
        };
    },

    getUserPurchases = function(user, callback) {
        if (user) {
            //Get user products
            User.findById(user.id, 'purchases', function(err, purchases) {
                return callback(err, purchases);
            });
        }
        else {
            return callback(null, null);
        }
    },

    getUserPurchaseByProductId = function(userId, productId, callback) {
        //Get user purchase
        User.findById(userId)
            .where('purchases.items').elemMatch( { productId: productId } )
            .select('purchases')
            .sort( { purchaseDate: 1 }) //Important so we can grab most recent purchase for a given product (since they can rent)
            .exec(function(err, user) {

                if (err) {
                    return callback(err, null);
                }

                if (user && user.purchases) {
                    return callback(err, {
                        purchase: user.purchases[0],
                        product: user.purchases[0].items[0]
                    });
                }
                else {
                    return callback(err, null);
                }

            });
    },

    getProductAndUserProgress = function(userId, productId, callback) {

        //Would like to optimize this and use a full query
        //to grab currentlyViewing & userProgress even when
        //either is potentially null. Currently grabbing both
        //and then filtering since $or didn't seem to work right
        User.findOne( { _id: userId })
        .select('currentlyViewing userProgress')
        .exec(function(err, user)  {

                if (err) {
                    return callback(err, null);
                }

                productRepository.getProduct(productId, function(err, product) {

                    if (err) {
                        return callback(err, null);
                    }

                    var currentlyViewingIndex = helpers.itemExists(user.currentlyViewing, 'productId', productId),
                        userProgressIndex = helpers.itemExists(user.userProgress, 'productId', productId),
                        currentlyViewing,
                        userProgress;

                    if (user) {
                        currentlyViewing = (currentlyViewingIndex > -1) ? user.currentlyViewing[currentlyViewingIndex] : null;
                        userProgress = (userProgressIndex > -1) ? user.userProgress[userProgressIndex] : null;
                    }

                    callback(null, {
                        product: product,
                        userProgress: userProgress,
                        currentlyViewing: currentlyViewing
                    });

                });

            });

    },

    updateUserProgress = function(userId, userProgress, callback) {

        User.findById(userId, 'userProgress currentlyViewing', function(err, user) {

            if (err) {
                return callback(err, null);
            }

            switch (userProgress.action) {
                case 'finished':
                    console.log('finished called: ' + JSON.stringify(userProgress));
                    updateFinishedProgress(user, userProgress, callback);
                    break;
                case 'setmarker':
                    console.log('setmarker called: ' + JSON.stringify(userProgress));
                    updateProgressMarker(user, userProgress, callback);
                    break;
            }

        });
    },

    updateFinishedProgress = function(user, userProgress, callback) {

        var userProgressIndex = helpers.itemExists(user.userProgress, 'productId', userProgress.productId);

        if (userProgressIndex > -1) { //user progress record already exists for productId

            var sectionPos = helpers.itemExists(user.userProgress[userProgressIndex].completedSections, null, userProgress.sectionId);
            if (sectionPos > -1) return callback(null, null); //sectionId is already in the array to do nothing
            user.userProgress[userProgressIndex].completedSections.push(userProgress.sectionId);

            var currentlyViewingIndex = helpers.itemExists(user.currentlyViewing, 'productId', userProgress.productId);
            if (currentlyViewingIndex > -1) {
                //Remove currentlyViewing for product
                user.currentlyViewing.splice(currentlyViewingIndex, 1);
            }

            user.save(function(err) {
                return callback(err, null);
            })

        }
        else { //No user progress exists for productId so create a new userProgress object

            User.update(
                { _id: user._id },
                {
                    $push: {
                        userProgress: {
                            productId: userProgress.productId,
                            completedSections: [ userProgress.sectionId ]
                        }
                    },
                    $set: {
                        lastUpdatedDate: helpers.getDateTime()
                    }
                },
                function (err) {
                    return callback(err, null);
                }
            );
        }

    },

    updateProgressMarker = function(user, userProgress, callback) {

        var currentlyViewing = {
            productId: userProgress.productId,
            moduleId: userProgress.moduleId,
            sectionId: userProgress.sectionId,
            videoUrl: userProgress.videoUrl,
            currentVideoTime: userProgress.currentVideoTime,
            lastViewed: helpers.getDateTime()
        };

        //See if product already exists
        var currentlyViewingIndex = helpers.itemExists(user.currentlyViewing, 'productId', currentlyViewing.productId);

        if (currentlyViewingIndex > -1) {

            User.update(
                {
                    _id: user._id,
                    'currentlyViewing.productId': currentlyViewing.productId
                },
                {
                    $set: {
                        'currentlyViewing.$': currentlyViewing
                    }
                },
                function (err) {
                    return callback(err, null);
                }
            );

        }
        else {

            user.currentlyViewing.push(currentlyViewing);

            user.save(function(err) {
                return callback(err, null);
            });

            /* User.update(
             { _id: user._id },
             { $push: { currentlyViewing: currentlyViewing } },
             function (err) {
             callback(err, null);
             }
             );*/
        }

    };

    return {
        getUserById                 : getUserById,
        getUserPassword             : getUserPassword,
        getUserByEmail              : getUserByEmail,
        updateUser                  : updateUser,
        updateUserProfile           : updateUserProfile,
        hashPasswordAndSave         : hashPasswordAndSave,
        addPurchase                 : addPurchase,
        insertUser                  : insertUser,
        getUserPurchases            : getUserPurchases,
        getUserPurchaseByProductId  : getUserPurchaseByProductId,
        getProductAndUserProgress   : getProductAndUserProgress,
        updateUserProgress          : updateUserProgress
    };

}();

module.exports = userRepository;
