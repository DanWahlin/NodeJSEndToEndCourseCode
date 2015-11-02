'use strict';

var mongoose    = require('mongoose'),
    Schema          = mongoose.Schema,
    ObjectId        = Schema.Types.ObjectId;

var sectionSchema = Schema({
    sectionId           : { type: String, required: true },
    position            : { type: Number, required: true },
    title               : { type: String, required: true },
    length              : { type: String },
    isFree              : { type: Boolean },
    description         : { type: String },
    videoUrl            : { type: String }
});

var moduleSchema = Schema({
    moduleId            : { type: String, required: true },
    position            : { type: Number, required: true },
    length              : { type: String },
    title               : { type: String, required: true },
    description         : { type: String },
    sections            : [ sectionSchema ]
});

var productSchema = Schema({
    sku                     : { type: String, required: true },
    authors                 : [ String ],
    productTypeId           : { type: ObjectId, turnOn: false, ref: 'productType' },
    categoryId              : { type: ObjectId, turnOn: false, ref: 'category' },
    tags                    : [ String ],
    level                   : [ String ],
    publishDate             : { type: Date },
    title                   : { type: String },
    shortDescription        : { type: String },
    description             : { type: String },
    pricing                 : {
        rentPrice           : { type: Number },
        buyPrice            : { type: Number },
        premiumPrice        : { type: Number },
        licensePrice        : { type: Number },
        udemyPrice          : { type: Number }
    },
    urls                    : {
        materialsUrl        : { type: String },
        imageUrl            : { type: String },
        sampleVideoUrl      : { type: String },
        videosDownloadUrl   : { type: String },
        udemyUrl            : { type: String }
    },
    trainingDetails         : {
        preRequisites       : { type: String },
        youWillLearn        : { type: String },
        audience            : { type: String },
        length              : { type: Number },
        outline             : { type: String }
    },
    modules                 : [ moduleSchema ],
    date                    : { type: Date, default: Date.now },
    lastUpdatedDate         : { type: Date, default: Date.now }
});

var ProductModel = mongoose.model('product', productSchema, 'products');


module.exports = ProductModel;
