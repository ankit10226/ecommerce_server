const mongoose = require('mongoose');
const Address = require("../models/Address");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
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

exports.placeOrder = async (req, res) => {
  const { userId, addressId, totalAmount, totalItems, orderDetails } = req.body; 

  if (!userId || !addressId || !totalAmount || !totalItems || !Array.isArray(orderDetails) || orderDetails.length === 0) {
    return res.status(400).json({ message: 'All fields are required with valid data.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = new Order({
      user: userId,
      address: addressId,
      totalAmount,
      totalItems,
      status: 'pending',
    });

    const savedOrder = await order.save({ session });

    for (let detail of orderDetails) {
      const orderDetail = new OrderDetail({
        order: savedOrder._id,
        product: detail.productId,
        quantity: detail.quantity,
        price: detail.price,
      });

      await orderDetail.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: 'Order placed successfully' });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: error.message });
  }
}; 

exports.fetchOrder = async (req, res) => {
  const userId = req.params.id;

  try {
    let orders;
    if (userId === 'all') {
      orders = await Order.find()
        .populate('address')
        .populate('user');
    } else {
      orders = await Order.find({ user: userId })
        .populate('address')
        .populate('user');
    }

    return res.status(200).json({
      message: 'Orders fetched successfully',
      order: orders
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteOrder = async (req,res) =>{
  try {
    const orderId = req.params.id;  
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
 
    await OrderDetail.deleteMany({ order: orderId });
    return res.status(200).json({message: "Order deleted successfully!"})
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}

exports.fetchOrderDetail = async (req, res) => {
  const orderId = req.params.id;

  try {
    const orderDetail = await OrderDetail.find({ order: orderId })
      .populate('product');

    return res.status(200).json({
      message: 'Order details fetched successfully',
      orderDetail
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const newStatus = req.params.value;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = newStatus;
    await order.save();

    return res.status(200).json({ message: 'Order updated successfully' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

