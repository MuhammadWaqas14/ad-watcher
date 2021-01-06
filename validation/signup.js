const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = validateSignUpInput = (data) => {
  let errors = {};

  let { first_name, last_name, user_name, email, phone, password } = data;
  //Converting empty fields to an empty string so that we can use validator function as it works only with strings
  first_name = !isEmpty(first_name) ? first_name : "";
  last_name = !isEmpty(last_name) ? last_name : "";
  user_name = !isEmpty(user_name) ? user_name : "";
  email = !isEmpty(email) ? email : "";
  phone = !isEmpty(phone) ? phone : "";
  password = !isEmpty(password) ? password : "";

  if (Validator.isEmpty(first_name)) {
    errors.first_name = "First name is required";
  }

  if (Validator.isEmpty(last_name)) {
    errors.last_name = "Last Name is required";
  }
  if (Validator.isEmpty(user_name)) {
    errors.user_name = "Username is required";
  }

  if (Validator.isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!Validator.isEmail(email)) {
    errors.email = "Enter a valid email id";
  }
  if (Validator.isEmpty(phone)) {
    errors.phone = "Phone number is required";
  }
  if (Validator.isEmpty(password)) {
    errors.password = "Password is required";
  } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
