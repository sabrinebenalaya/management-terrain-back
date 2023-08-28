const mongoose = require("mongoose");
const partnerSchema = mongoose.Schema({
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  cin: { required: true, type: String },
  phone: { required: true, type: Number },
  shortcuts:   { required: true,  type: [String] , default:['apps.calendar']},
  gender: { required: false, type: String, default: "Male" },
 birthday : { required: false, type: Date },
  address: { 
    city: { type: String, required: false },
    governorate: { type: String, required: false },
    country: { type: String, required: false },
    postalCode: { type: Number, required: false },
  },
        photoURL: { required: false, type: String, default: 'assets/images/avatars/brian-hughes.jpg' },
  status: { required: false, type: Boolean , default: false},
  role: { required: true,  type: [String], default:'admin' },
  socialMedia :  { required: false,  type: [String] },
});


module.exports = mongoose.model("Partner", partnerSchema);
