const { Schema,  model } = require("mongoose");
const mongoose=require('mongoose')
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

var reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    image: {
      type: String,
    },
    
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
  }
  },
  {
    timestamps: true
  }
);
const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    category:{type:String,required:true},
    price: {
      type: Currency,
      required: true,
      min: 0
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

module.exports=model("Product", productSchema);
