const mongoose = require('mongoose')
const validStatus = ['Success', 'Failure','Pending'];

const Payment = new mongoose.Schema({
  subAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subAdminEmail: { type: String },
  merchantTransactionId: { type: String, required: [true] },
  payed_on: { type: Date, default: Date.now },
  amount: { type: String, required: [true,] },
  status: { type: String, enum: validStatus, default: 'Pending' },
});

module.exports = mongoose.model('rewardPayment', Payment)