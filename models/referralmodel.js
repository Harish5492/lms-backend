const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrelOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referrelUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referrelUserCount: { type: Number, default: 0 },
  referrelCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(+new Date() + 60 * 60 * 1000), required: true },
});


const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
