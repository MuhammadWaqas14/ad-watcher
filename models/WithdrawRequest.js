const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const withdrawRequestModel = {
  account: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
};

const WithdrawRequestSchema = new Schema(withdrawRequestModel);
module.exports = mongoose.model("withdrawrequests", WithdrawRequestSchema);
