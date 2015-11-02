"use strict";

var Feature = require("../models/feature");

var featureRepository = function() {

    var getFeatures = function(callback) {

        Feature.find({ "isFeatured" : true })
            .sort({ position: "asc" })
            //.select("position title text highlightText backgroundImageUrl productId link linkText customCssClass transparentBackground")
            .populate("productId", "sku")
            .exec(function(err, features) {
                callback(err, features);
            });

    };

    return {
        getFeatures: getFeatures
    };

}();

module.exports = featureRepository;

