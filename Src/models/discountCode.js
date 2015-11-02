'use strict';

var mongoose    = require('mongoose'),
    Schema          = mongoose.Schema,
    ObjectId        = Schema.ObjectId;

var discountCodeSchema = Schema({
    productId           : { type: ObjectId, turnOn: false, ref: 'product' },
    code                : { type: String },
    percentage          : { type: Number }, //Applies to all prices for product
    rentPrice           : { type: Number },
    buyPrice            : { type: Number },
    premiumPrice        : { type: Number },
    udemyPrice          : { type: Number },
    licencePrice        : { type: Number },
    expirationDate      : { type: Date, default: null },
    allowedUses         : { type: Number, default: null },
    numberOfUses        : { type: Number, default: 0 },
    isActive            : { type: Boolean, default: true },
    date                : { type: Date, default: Date.now }
});

var DiscountCodeModel = mongoose.model('discountCode', discountCodeSchema, 'discountCodes');


module.exports = DiscountCodeModel;
