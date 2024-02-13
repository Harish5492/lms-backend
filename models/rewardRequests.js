const mongoose = require('mongoose')
const Payment = new mongoose.Schema({
  subAdminID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subAdminEmail: { type: String },
  amount: { type: Number, required: [true,] },
requested_on: { type: Date, default: Date.now },
});

module.exports = mongoose.model('rewardRequests', Payment)