import mongoose from 'mongoose';

const balanceSchema = new mongoose.Schema({
  address: { type: String, required: true },
  balance: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Balance', balanceSchema);