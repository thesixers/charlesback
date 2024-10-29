import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const orderSchema = new mongoose.Schema({
  time: { type: String, required: true},
  pickupLocation: { type: String },
  services: { type: Array },
  providerID: { type: String },
  seekerID: { type: String },
  price: {type: Number},
  status:{ type: String,  default: 'pending'},
  createdAt: { type: Date, default: Date.now },
});



const Order = mongoose.model('LoundryOrder', orderSchema);
export default Order;
