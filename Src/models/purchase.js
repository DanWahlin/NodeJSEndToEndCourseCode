'use strict';

var mongoose    = require('mongoose'),
    Schema          = mongoose.Schema,
    ObjectId        = Schema.ObjectId;

var purchaseSchema = Schema({
    transactionId           : { type: String },
    totalBeforeDiscount     : { type: Number },
    total                   : { type: Number },
    discountAmount          : { type: Number },
    items                   : [ {
        productId           : { type: ObjectId, turnOn: false, ref: 'product' },
        sku                 : { type: String },
        title               : { type: String },
        quantity            : { type: Number },
        priceBeforeDiscount : { type: Number },
        price               : { type: Number },
        totalBeforeDiscount : { type: Number },
        total               : { type: Number },
        priceType           : { type: String },
        discountCode        : { type: String },
        expirationDate      : { type: Date }
    } ],
    discountCode            : { type: ObjectId, turnOn: false, ref: 'discountCode' },
    purchaseDate            : { type: Date, default: Date.now }
});

var PurchaseModel = mongoose.model('purchase', purchaseSchema, 'purchases');

module.exports = PurchaseModel;
