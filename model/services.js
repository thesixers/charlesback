import { Schema, model } from 'mongoose';

const serviceSchema = new Schema({
  name: { type: String, ref: 'User', required: true },
  price: { type: String, required: true },
  providerID: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

const service = model('lundryService', serviceSchema);
export default service;
