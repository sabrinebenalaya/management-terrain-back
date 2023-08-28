const Partner = require("../Model/Partner");
const bcrypt = require("bcryptjs");
const isEmpty = require("../Validator/IsEmpty");

const path = require("path");
const partnerController = {};

//update photo partner
partnerController.updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const imagePath = req.file.path.replace(/\\/g, "/");
    const photoPath = `http://localhost:${process.env.PORT}/partners/${imagePath}`;

    const partner = await Partner.findByIdAndUpdate(id, {
      $set: { photo: photoPath },
    });
    partner
      ? res.status(200).json(partner)
      : res.status(404).json({ message: "Partner not found ⚠️" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get Partner by id
partnerController.getParterById = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findById(id);

    !partner
      ? res.status(404).json("Partner not found ⚠️")
      : res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//UPDATE partner
partnerController.update = async (req, res) => {
  const { id } = req.params;

  const partnerToUpdate = JSON.parse(req.body.editPartner);

  if (req.file) {
    const imagePath = req.file.path.replace(/\\/g, "/");
    const photoPath = `http://localhost:${process.env.PORT}/partners/${imagePath}`;
    partnerToUpdate.photo = photoPath;
  }

  if (!isEmpty(partnerToUpdate.password)) {
    const hashedPaswword = await bcrypt.hash(partnerToUpdate.password, 10);
    partnerToUpdate.password = hashedPaswword;
  }

  try {
    const partner = await Partner.findByIdAndUpdate(
      id,
      { $set: { ...partnerToUpdate } },
      {
        new: true,
        runValidators: true,
      }
    );

    partner
      ? res.status(200).json(partner)
      : res.status(404).json("Partner not found ⚠️");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = partnerController;
