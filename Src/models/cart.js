'use strict';

var mongoose        = require('mongoose'),
    Product         = require('./product'),
    Schema          = mongoose.Schema,
    ObjectId        = Schema.ObjectId;

var cartSchema = Schema({
    customerId  : { type: ObjectId, turnOn: false },
    total       : { type: String },
    items       : [ Product.schema ]
});

var CartModel = mongoose.model('cart', cartSchema, 'carts');


module.exports = CartModel;


