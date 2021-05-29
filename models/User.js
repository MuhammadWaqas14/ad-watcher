const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = {
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // verified: {
  //   type: String,
  //   default: "0",
  //   required: true,
  // },
};

const UserSchema = new Schema(userModel);
module.exports = mongoose.model("users", UserSchema);
