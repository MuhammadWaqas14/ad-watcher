const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditRequestModel = {
  transaction_id: {
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

const CreditRequestSchema = new Schema(creditRequestModel);
module.exports = mongoose.model("creditrequests", CreditRequestSchema);
