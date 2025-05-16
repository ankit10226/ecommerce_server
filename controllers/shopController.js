const Address = require("../models/Address");
const Product = require("../models/Product");

exports.fetchProducts = async (req,res) =>{
  try {
    const { category, subCategory, brand } = req.query;
    const filter = {}; 
    if (category == 'all') {  
        const categories = ['men','women','kids'];
        filter.category = { $in: categories.map(c => c.toLowerCase()) };
    }else{
        filter.category = category.toLowerCase();
    }

    if (subCategory) {
      const subCategories = Array.isArray(subCategory) ? subCategory : [subCategory];
      filter.subCategory = { $in: subCategories.map(sc => sc.toLowerCase()) };
    }

    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand];
      filter.brand = { $in: brands.map(b => b.toLowerCase()) };
    }

    const products = await Product.find(filter); 

    return res
    .status(200)
    .json({ message: 'Products fetched successfully', product: products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

exports.fetchAddress = async (req,res) =>{
  try {
    const userId = req.params.id;
    const address = await Address.find({userId});
    return res
    .status(200)
    .json({ message: 'Address fetched successfully', address });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


exports.uploadAddress = async (req,res) =>{
  try {   
    const userId = req.body.userId;
    const address = await Address.find({userId});
    if(address.length > 2){
      return res.status(500).json({ message: "Only 3 address per user is allowed." });
    }

    const newAddress = new Address({
      userId: userId,
      address: req.body.address,
      state: req.body.state,
      pincode: req.body.pincode,
      phone: req.body.phone, 
      note: req.body.note,
    }); 
    const savedAddress = await newAddress.save();
    return res
      .status(200)
      .json({ message: 'Address saved successfully', address: savedAddress });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

exports.updateAddress = async (req,res) =>{
  try {
    const addressId = req.params.id;
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        $set: {
          address: req.body.address,
          state: req.body.state,
          pincode: req.body.pincode,
          phone: req.body.phone, 
          note: req.body.note,
        }
      },
      { new: true }  
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

exports.deleteAddress = async (req,res) =>{
  try {
    const addressId = req.params.id;
    const deleteAddress = await Address.findByIdAndDelete(addressId);
    if (!deleteAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    return res.status(200).json({message: "Address deleted successfully!"})
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}