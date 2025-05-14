const Dashboard = require("../models/Dashboard");
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
      subCategory: req.body.subCategory,
      brand: req.body.brand,
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

exports.updateProduct = async (req,res) =>{
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          title: req.body.title,
          price: req.body.price,
          quantity: req.body.quantity,
          description: req.body.description,
          category: req.body.category, 
          subCategory: req.body.subCategory, 
          brand: req.body.brand, 
        }
      },
      { new: true }  
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

exports.deleteProduct = async (req,res) =>{
  try {
    const productId = req.params.id;
    const deleteProduct = await Product.findByIdAndDelete(productId);
    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({message: "Product deleted successfully!"})
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}

exports.uploadDashboard = async (req,res) =>{
  try { 
    const newDashboard = new Dashboard({
      category: 'dashboard', 
      image: req.body.image, 
    }); 
    const savedDashboard = await newDashboard.save();
    return res
      .status(200)
      .json({ message: 'Dashboard saved successfully', dashboard: savedDashboard });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

exports.fetchProducts = async (req,res) =>{
  try {
    const product = await Product.find();
    return res
    .status(200)
    .json({ message: 'Products fetched successfully', product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

exports.fetchDashboard = async (req,res) =>{
  try {
    const dashboard = await Dashboard.find();
    return res
    .status(200)
    .json({ message: 'Dashboards fetched successfully', dashboard });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}