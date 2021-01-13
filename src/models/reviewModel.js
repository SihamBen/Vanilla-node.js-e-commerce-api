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
    
    
    author: {
      type: String
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'User'
  },
    product: {
      type: String
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Product'
  },
  reviewPictures: [
    {type: String},
  ],
  },
 
  {
    timestamps: true
  }
);
module.exports=model("Review", reviewSchema);
