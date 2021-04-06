const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = validateWalletInput = (data) => {
  let errors = {};

  let { credits, phone, type, total_trans, user_id } = data;
  // Converting empty fields to empty string as validator function works only with strings
  credits = !isEmpty(credits) ? credits : "";
  phone = !isEmpty(phone) ? phone : "";
  type = !isEmpty(type) ? type : "";
  total_trans = !isEmpty(total_trans) ? total_trans : "";
  user_id = !isEmpty(user_id) ? user_id : "";

  if (Validator.isEmpty(credits)) {
    errors.credits = "Credits required";
  }
  if (Validator.isEmpty(phone)) {
    errors.phone = "Phone is required";
  }
  if (Validator.isEmpty(type)) {
    errors.type = "type required";
  }
  if (Validator.isEmpty(total_trans)) {
    errors.total_trans = "total transactions required";
  }
  if (Validator.isEmpty(user_id)) {
    errors.user_id = "User id required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
