'use strict';

var Product                 = require('../models/product'),
    Category                = require('../models/category'),
    DiscountCode            = require('../models/discountCode'),
    productTypesRepository  = require('./productTypeRepository');

var productRepository = function() {

    var getProduct = function(id, callback) {



    },

    getProductBySku = function(sku, callback) {



    },

    getDiscountCodeByProduct = function(productId, discountCode, propertyName, callback) {

        if (!productId && !discountCode && !propertyName) return callback(null,null);

        //Locate discount automatically for product based on a specific property name (such as 'udemyPrice')
        if (propertyName) {

            var whereClause = { productId: productId };
            whereClause[propertyName] = { $exists: true };

            DiscountCode.findOne(whereClause, function(err, code) {

                if (err) return callback(err, null);

                if (validateDiscountCode(code)) return callback(err, code);

                return callback(err, null);

            });

        }
        else if (discountCode) {

            DiscountCode.findOne( { productId: productId, code: discountCode.toLowerCase() }, function(err, code) {

                if (err) return callback(err, null);

                if (validateDiscountCode(code)) return callback(err, code);

                return callback(err, null);

            });

        }
        else {
            return callback(null, null);
        }

    },

    getDiscountCode = function(discountCode, callback) {

        if (!discountCode) return callback(null,null);

        DiscountCode.findOne( { code: discountCode.toLowerCase() }, function(err, code) {

            if (err) return callback(err, null);

            if (validateDiscountCode(code)) return callback(err, code);

            return callback(err, null);

        });

    },

    validateDiscountCode = function(discountCode) {

        var valid = false;

        if (discountCode) {

            valid = true;

            if (discountCode.numberOfUses && discountCode.allowedUses && (discountCode.numberOfUses === discountCode.allowedUses)) {
                valid = false;
            }

            if (discountCode.expirationDate && (Date.now() > discountCode.expirationDate)) {
                valid = false;
            }

            if (!discountCode.isActive) {
                valid = false;
            }

        }

        return valid;
    },

    applyDiscountCode = function(product, discountCode) {

        if (discountCode) {
            var priceTypes = ['rentPrice', 'buyPrice', 'premiumPrice', 'licensePrice', 'udemyPrice'];
            product = (product.toObject) ? product.toObject() : product;
            product.pricing.discountCode = discountCode.code;
            product.pricing.discountPercentage = discountCode.percentage;

            if (discountCode.percentage && discountCode.percentage > 0) {
                //Apply discount % to all prices in product
                for (var i=0;i<priceTypes.length;i++) {
                    var priceType = priceTypes[i];
                    if (product.pricing[priceType]) {
                        var discountKey = 'discount' + priceType.charAt(0).toUpperCase() + priceType.slice(1);
                        product.pricing[discountKey] = parseInt(product.pricing[priceType] - (product.pricing[priceType] * (discountCode.percentage/100)));
                    }
                }
            }
            else {
                //Apply discount prices
                for (var i=0;i<priceTypes.length;i++) {
                    var priceType = priceTypes[i];
                    if (discountCode[priceType]) {
                        var discountKey = 'discount' + priceType.charAt(0).toUpperCase() + priceType.slice(1);
                        product.pricing[discountKey] = discountCode[priceType];
                    }
                }
            }

        }
        return product;

    },

    getProductCategories = function(callback) {



    },

    getProductsGroupedByCategory = function(productType, callback) {

        var aggregate = [];

        //Filter by product type if it was passed
        if (productType) {

            //Very important that it's Types.ObjectId and not Schema.ObjectId
            //if creating mongoose.Types.ObjectId('object id value')!
            //Not used here but noting for future maintenance

            aggregate.push({
                $match: { productTypeId: productType._id }
            });

        }

        groupProductsByCategory(aggregate, callback);

    },

    groupProductsByCategory = function(aggregate, callback) {

        //Get all categories since product only has the _id and not the title of the category
        getProductCategories(function(err, cats) {

            if (err) {
                callback(err, null);
                return;
            }

            //Get all the productTypes since we need the cssIconClass value and
            //will only have access to the
            productTypesRepository.getProductTypes(function(err, productTypes) {

                aggregate.push({
                    $group: {
                        _id: '$categoryId',
                        products: {
                            $push: {
                                id              : '$_id',
                                sku             : '$sku',
                                title           : '$title',
                                authors         : '$authors',
                                publishDate     : '$publishDate',
                                shortDescription: '$shortDescription',
                                productTypeId   : '$productTypeId'
                            }
                        }
                    }
                });

                //Do grouping operation based on aggregate object
                Product.aggregate(aggregate, function(err, catProducts) {

                    if (err) return callback(err, null);

                    if (catProducts && catProducts.length) {

                        //Grab name of category and associate with each group
                        //since we only have the category_id at this point
                        catProducts.forEach(function(catProduct) {

                            //Get category title from _id
                            cats.forEach(function(cat) {
                                if (catProduct._id.toString() === cat._id.toString()) {
                                    catProduct.id       = cat._id.toString();
                                    catProduct.category = cat.title;
                                    catProduct.imageUrl = cat.imageUrl;
                                    catProduct.cssClass = cat.cssClass;
                                }
                            });

                            //Get productType for each product since we need/want the iconCssClass property
                            //of the productType
                            catProduct.products.forEach(function(product) {
                               var matches = productTypes.filter(function(productType) {
                                   return product.productTypeId.toString() == productType._id.toString();
                               });
                               if (matches) {
                                   product.productTypeId = matches[0];
                               }
                            });

                        });

                        catProducts.sort(function(a,b) {
                            var x = a.category.toLowerCase(),
                                y = b.category.toLowerCase();
                            return x < y ? -1 : x > y ? 1 : 0;
                        });

                    }

                    callback(err, catProducts);
                });
            });
        });

    },

    getProductForCart = function(id, callback) {

        Product.findById(id)
               .select('sku title pricing')
               .exec(function(err, product) {
                    callback(err, product);
                });

    },

    getProducts = function(callback) {

        Product.find(function(err, products) {
            callback(err, products);
        });

    },

    search = function(searchText, callback) {
        Product.find(
                    {$or: [
                            { title:                        { $regex: searchText, $options: 'i' } },
                            { shortDescription:             { $regex: searchText, $options: 'i' } },
                            { description:                  { $regex: searchText, $options: 'i' } },
                            { 'trainingDetails.outline':    { $regex: searchText, $options: 'i' } },
                            { authors:                      { $regex: searchText, $options: 'i' } }
                        ]
                    }
                )
               .sort({ title: 'asc' })
               .select('sku title shortDescription productTypeId')
               .populate('productTypeId')
               .exec(function(err, products) {
                    callback(err, products);
                });
    };

    return {
        getProduct                  : getProduct,
        getProductBySku             : getProductBySku,
        getDiscountCodeByProduct    : getDiscountCodeByProduct,
        getDiscountCode             : getDiscountCode,
        applyDiscountCode           : applyDiscountCode,
        getProductCategories        : getProductCategories,
        getProductsGroupedByCategory: getProductsGroupedByCategory,
        getProductForCart           : getProductForCart,
        getProducts                 : getProducts,
        validateDiscountCode        : validateDiscountCode,
        search                      : search
    };

}();

module.exports = productRepository;
