const { Schema,  model } = require("mongoose");
const mongoose=require('mongoose')


const reviewSchema = new Schema(
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
    image: [
      {type: String},
    ],
    
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
  }
  },
  {
    timestamps: true
  }
);
module.exports=model("Review", reviewSchema);
