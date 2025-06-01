const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
require('dotenv').config();


exports.register = async (req, res) => { 
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });
    const savedUser = await newUser.save();
    return res
      .status(200)
      .json({ message: 'User saved successfully', user: savedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({email:req.body.email});
    if(!user){
      return res.status(404).json({message:"User Not Found!"});
    }
    const validUser = await bcrypt.compare(req.body.password,user.password);
    if(!validUser){
      return res.status(400).json({message:"Invalid Password!"});
    }
    
    const token = jwt.sign(
      {userId:user._id,email:user.email,name:user.name,role:user.role},
      process.env.JWT_SECRET,
      {expiresIn:'1h'}
    )
    const isProd = process.env.NODE_ENV === 'PROD';
    return res.status(200).cookie("token", token, { httpOnly: true,secure: isProd,sameSite: isProd ? "None" : "Lax",maxAge: 60 * 60 * 1000 }).json({message:"Login Successful",user:{ userId: user._id, name: user.name, email: user.email, role: user.role }});
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
};

exports.verifyUser = (req, res) => {
  res.status(200).json({ user: req.user });
};

exports.logout = (req,res) =>{
  return res
    .status(200)
    .clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" }) 
    .json({ message: "Logout successful" });
}
