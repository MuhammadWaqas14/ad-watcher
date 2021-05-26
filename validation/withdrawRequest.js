const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = validateWithdrawRequestInput = (data) => {
  let errors = {};

  let { account, amount, user_id } = data;
  // Converting empty fields to empty string as validator function works only with strings
  account = !isEmpty(account) ? account : "";
  amount = !isEmpty(amount) ? amount : "";
  user_id = !isEmpty(user_id) ? user_id : "";

  if (Validator.isEmpty(account)) {
    errors.account = "Account number required";
  }
  if (Validator.isEmpty(amount)) {
    errors.amount = "Amount is required";
  }
  if (Validator.isEmpty(user_id)) {
    errors.user_id = "User id required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
