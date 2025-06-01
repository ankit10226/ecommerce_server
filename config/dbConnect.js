const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

async function seedAdmin(){
  const adminUsername = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  let admin = await User.findOne({'email':adminUsername});
  
  if(!admin){
    try {
        const hashPassword = await bcrypt.hash(adminPassword, 10);
        const newUser = new User({
          name: 'Admin',
          email: adminUsername,
          password: hashPassword,
          role:'admin'
        });
        const savedUser = await newUser.save();
        console.log('Admin created successfully.');
    } catch (error) {
        console.log(error?.message || 'Something went wrong!');
    }

      
  }
}

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log('Successfully connected to MongoDB Atlas!');
    await seedAdmin();
  } catch (error) {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  }
}

module.exports = dbConnect;
