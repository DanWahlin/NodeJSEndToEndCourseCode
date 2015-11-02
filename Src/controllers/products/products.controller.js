'use strict';

var productRepository       = require("../../lib/productRepository"),
    productTypeRepository   = require("../../lib/productTypeRepository");

module.exports = function (router) {

    router.get('/', function (req, res) {

        renderProductsGroupedByCategory(null, res);

    });

    router.get('/:productTypeTitle', function (req, res) {

        var productTypeTitle = req.params.productTypeTitle;

        //Get productType object based on the title (we need linkTitle property and _id as well)
        productTypeRepository.getProductTypeByTitle(productTypeTitle, function(err, productType) {

            renderProductsGroupedByCategory(productType, res);

        });
    });

	function renderProductsGroupedByCategory(productType, res) {

        productRepository.getProductsGroupedByCategory(productType, function(err, catsProducts) {
            res.render('products', {
                catsProducts: catsProducts,
                productType: productType
            });
        });

    }

};
