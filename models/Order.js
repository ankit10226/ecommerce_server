const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    totalAmount: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    status: { type: String, default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema); 
module.exports = Order;
