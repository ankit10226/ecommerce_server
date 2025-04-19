const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema(
  {
    category:{
      type:String,
      required:true, 
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

const Dashboard = mongoose.model('Dashboard',dashboardSchema)
module.exports = Dashboard