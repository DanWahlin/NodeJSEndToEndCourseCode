"use strict";

var ProductType = require("../models/productType");

var productTypeRepository = function() {

    var productTypes = null;
    
    var getProductTypes = function(callback) {        
        ProductType.find()
                   .sort({ title: "asc"}) 
                   .exec(function(err, pts) {
                        if (err) return callback(err, null);

                        productTypes = pts;
                        callback(err, pts);
                    });
    },

    getProductTypeById = function(id, callback) {

        ProductType.findById(id, function(err, productType) {  
            if (err) {
                callback(err, null);
                return;
            }
            callback(err, productType);
        });

    },

    getProductTypeByTitle = function(title, callback) {

        ProductType.findOne({title: { $regex: title, $options: "i" }}, function(err, productType) {
            if (err) {
                callback(err, null);
                return;
            }

            callback(err, productType);
        });

    },

    injectProductTypes = function(req, res, next) {        
        if (!productTypes) {
            getProductTypes(function(err, productTypes) {
                if (!err) {
                    res.locals.productTypes = productTypes;
                }
                next();
            });
        }
        else {
            res.locals.productTypes = productTypes;
            next();
        }
    };
    
    return {
        getProductTypes: getProductTypes,
        getProductTypeById:  getProductTypeById,
        getProductTypeByTitle: getProductTypeByTitle,
        injectProductTypes: injectProductTypes
    };
}();

module.exports = productTypeRepository;
