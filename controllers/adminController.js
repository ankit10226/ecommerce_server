const Product = require("../models/Product");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
 
    if (req.file && req.file.path) {   
      return res.status(200).json({
        message: "File uploaded successfully",
        url: req.file.path,   
      });
    } else {
      return res.status(500).json({ message: "Failed to upload to Cloudinary" });
    }

  } catch (err) {
    console.error("Error during file upload:", err);
    return res.status(500).json({ message: "Server error during upload" });
  }
};


exports.uploadProduct = async (req,res) =>{
  try { 
    const newProduct = new Product({
      category: req.body.category,
      title: req.body.title, 
      price: req.body.price, 
      quantity: req.body.quantity, 
      description: req.body.description, 
      image: req.body.image, 
    }); 
    const savedProduct = await newProduct.save();
    return res
      .status(200)
      .json({ message: 'Product saved successfully', product: savedProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}