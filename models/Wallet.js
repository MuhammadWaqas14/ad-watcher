const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletModel = {
  credits: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  total_trans: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
};

const WalletSchema = new Schema(walletModel);
module.exports = mongoose.model("wallets", WalletSchema);
