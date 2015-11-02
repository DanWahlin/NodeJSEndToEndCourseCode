"use strict";

var productRepository       = require("../../lib/productRepository");

module.exports = function (router) {

    router.get("/", function (req, res, next) {

        var searchText = req.query.searchtext;

        productRepository.search(searchText, function(err, results) {

            res.render("search", {
                results: results
            });

        });

    });

};