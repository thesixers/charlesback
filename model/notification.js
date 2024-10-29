import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
  message: { type: String, required: true},
  type: { type: Number, required: true},
  ownerID: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
});

const notification = model('lunadryNotification', notificationSchema);
export default notification;