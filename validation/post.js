const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = validatePostInput = (post) => {
  let errors = {};
  let { title, body, filepath, credits } = post;
  // Converting empty fields to empty string as validator function works only with strings
  console.log(post);
  console.log(post.title, post.body, post.filepath, post.credits);
  title = !isEmpty(title) ? title : "";
  body = !isEmpty(body) ? body : "";
  filepath = !isEmpty(filepath) ? filepath : "";
  credits = !isEmpty(credits) ? credits : "";

  if (Validator.isEmpty(title)) {
    errors.title = "Title is required";
  }

  if (Validator.isEmpty(body)) {
    errors.body = "Description is required";
  }
  if (Validator.isEmpty(filepath)) {
    errors.filepath = "filepath is required";
  }
  if (Validator.isEmpty(credits)) {
    errors.credits = "credits are required";
  }

  console.log(errors);
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
