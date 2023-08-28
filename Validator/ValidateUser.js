const isEmpty = require("./IsEmpty");
const validator = require("validator");

module.exports = function ValidateUser(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.phone = !isEmpty(data.phone) ? data.phone : 0;
  data.cin = !isEmpty(data.cin) ? data.cin : 0;

  if (!data.cin && !validator.isEmpty(data.cin)) {
    errors.cin = "Required CIN number 😔";
  }
  if (!data.phone && !validator.isEmpty(data.phone)) {
    errors.phone = "Required phone number 😔";
  }
 
  if (!validator.isEmail(data.email)) {
    errors.email = "Required format email 😔";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Required email 😔";
  }
 
  if (validator.isEmpty(data.firstName)) {
    errors.firstName = "Required First Name 😔";
  }

  if (validator.isEmpty(data.lastName)) {
    errors.lastName = "Required Last Name 😔";
  }
 
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
