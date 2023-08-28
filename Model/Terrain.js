const mongoose = require("mongoose");
const terrainSchema = mongoose.Schema({
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
  name: { required: true, type: String },
  surface: { required: false, type: Number },
  price: { required: true, type: Number },
  address: { 
    city: { type: String, required: false },
    governorate: { type: String, required: false },
    country: { type: String, required: false },
    postalCode: { type: Number, required: false },
  },
  description: { required: false, type: String },
  photo: { required: true, type: [String] },

});

module.exports = mongoose.model("Terrain", terrainSchema);
