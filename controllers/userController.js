const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


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
      {userId:user._id,email:user.email,},
      process.env.JWT_SECRET,
      {expiresIn:'1h'}
    )
    return res.status(200).json({message:"Login Successful",token,user:{ id: user._id, name: user.name, email: user.email }});
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
};
