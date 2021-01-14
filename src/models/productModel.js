const { Schema,  model } = require("mongoose");
const mongoose=require('mongoose')
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;


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
    productPictures: [
     { type: String,
      required: true}
    ],
    
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
  },
  { timestamps: true }
);

module.exports=model("Product", productSchema);
