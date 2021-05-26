const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = validateCreditRequestInput = (data) => {
  let errors = {};

  let { transaction_id, amount, user_id } = data;
  // Converting empty fields to empty string as validator function works only with strings
  transaction_id = !isEmpty(transaction_id) ? transaction_id : "";
  amount = !isEmpty(amount) ? amount : "";
  user_id = !isEmpty(user_id) ? user_id : "";

  if (Validator.isEmpty(transaction_id)) {
    errors.transaction_id = "transaction ID required";
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
