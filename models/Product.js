const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    category:{
      type:String,
      required:true, 
    },
    title:{
      type:String,
      required:true,
      trim:true
    },
    price:{
      type:Number,
      required:true, 
    },
    quantity:{
      type:Number,
      required:true, 
    },
    description:{
      type:String,
      required:true,
      trim:true
    },
    image:{
      type:String,
      required:true,
      trim:true
    },
  },
  {
    timestamps:true
  }
)

const Product = mongoose.model('Product',productSchema)
module.exports = Product