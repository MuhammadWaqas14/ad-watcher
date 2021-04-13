const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = validateReportInput = (data) => {
  let errors = {};

  let { post, reason, user_id } = data;
  // Converting empty fields to empty string as validator function works only with strings
  post = !isEmpty(post) ? post : "";
  user_id = !isEmpty(user_id) ? user_id : "";
  reason = !isEmpty(reason) ? reason : "";

  if (Validator.isEmpty(post)) {
    errors.post = "post id required";
  }
  if (Validator.isEmpty(reason)) {
    errors.reason = "Reason is required";
  }
  if (Validator.isEmpty(user_id)) {
    errors.user_id = "User id required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
