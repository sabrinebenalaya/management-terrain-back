const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  firstName: { required: true, type: String },
  lastName: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  shortcuts: { required: true, type: [String], default: ["apps.calendar"] },
  phone: { required: true, type: Number },
  photoURL: { required: false, type: String },
  status: { required: false, type: Boolean, default: true },
  gender: { required: false, type: String, default: "Male" },
  birthday: { required: false, type: Date },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
  role: { required: true, type: [String], default: "staff" },
  
});

module.exports = mongoose.model("User", userSchema);
