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