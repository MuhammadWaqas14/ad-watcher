const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportsModel = {
  post: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: String,
    required: true,
  },
};

const ReportSchema = new Schema(reportsModel);
module.exports = mongoose.model("reports", ReportSchema);
