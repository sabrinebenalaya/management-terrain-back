const Terrain = require("../Model/Terrain");
const bcrypt = require("bcryptjs");
const isEmpty = require("../Validator/IsEmpty");
const Reservation = require("../Model/Reservation");
const path = require("path");
const fs = require("fs");

const terrainController = {};

//Add terrain

terrainController.addTerrain = async (req, res) => {
  try {
    if (!req.body || !req.body.partner) {
      return res.status(400).json({
        msg: "Invalid request. Missing 'partner' property.",
      });
    }

    const terrainExist = await Terrain.findOne({
      "address.city": req.body.address.city,
      "address.governorate": req.body.address.governorate,
      "address.country": req.body.address.country,
      "address.postalCode": req.body.address.postalCode,
    });

    if (terrainExist === null) {
      const terrain = new Terrain(req.body);
      await terrain.save();

      res.status(200).json({ terrain });
    } else {
      res
        .status(400)
        .json({ msg: "Terrain already exists, you should add another one 😜" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a terrain
terrainController.update = async (req, res) => {
  const { id } = req.params;
  const terrainToUpdate = req.body;
  if (terrainToUpdate.avatar) {
    const base64Data = terrainToUpdate.avatar.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const imageBuffer = Buffer.from(base64Data, "base64");

    const timestamp = Date.now();
    const imageFileName = `${timestamp}_${terrainToUpdate._id}.png`;
    const imageFolderPath = path.join("assets", "terrains");

    const imagePath = path.join(
      __dirname,
      "..",
      imageFolderPath,
      imageFileName
    );

    if (!fs.existsSync(imageFolderPath)) {
      fs.mkdirSync(imageFolderPath, { recursive: true });
    }

    // Écrivez l'image sur le disque
    fs.writeFileSync(imagePath, imageBuffer);

    // Mettez à jour l'attribut 'avatar' du contact avec le chemin relatif de l'image
    terrainToUpdate.photo = path
      .join(imageFolderPath, imageFileName)
      .replace(/\\/g, "/"); // Remplace les backslashes par des slashes
  }

  try {
    const terrain = await Terrain.findByIdAndUpdate(
      id,
      { $set: { ...terrainToUpdate } },
      {
        new: true,
        runValidators: true,
      }
    );

    terrain
      ? res.status(200).json(terrain)
      : res.status(404).json("User not found ⚠️");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//update phot
terrainController.updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  try {
    const terrainToUpdate = await Terrain.findById(id);
    console.log("terrainToUpdate", terrainToUpdate);
    if (!terrainToUpdate) {
      return res.status(404).json("Terrain not found ⚠️");
    }

    if (image && Array.isArray(image)) {
      const updatedImages = [];

      for (const imageUrl of image) {
        const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, "base64");

         const timestamp = Date.now();
        const imageFileName = `${timestamp}_${id}.png`;
        const imageFolderPath = path.join("assets", "terrains");
        const imagePath = path.join(
          __dirname,
          "..",
          imageFolderPath,
          imageFileName
        );

        if (!fs.existsSync(imageFolderPath)) {
          fs.mkdirSync(imageFolderPath, { recursive: true });
        }

        fs.writeFileSync(imagePath, imageBuffer);

        updatedImages.push(
          path.join(imageFolderPath, imageFileName).replace(/\\/g, "/")
        );
      }

      terrainToUpdate.photo = updatedImages;
    }

    const updatedTerrain = await terrainToUpdate.save();

    res.status(200).json(updatedTerrain);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//Get All terrain
terrainController.getAllTerrains = async (req, res) => {
  try {
    const terrains = await Terrain.find();
    terrains
      ? res.status(200).json(terrains)
      : res.status(404).json("No terrain was found 😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get All terrain by partner
terrainController.getAllTerrain = async (req, res) => {
  try {
    const terrains = await Terrain.find({ partner: req.params.id });
    terrains
      ? res.status(200).json(terrains)
      : res.status(404).json("No terrain was found 😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a terrain
terrainController.deleteTerrain = async (req, res) => {
  try {
    const terrain = await Terrain.findByIdAndDelete(req.params.id);
    const terrains = await Terrain.find();
    terrains
      ? res.status(200).json(terrains)
      : res.status(404).json("Terrain not found 😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get terrain Byid
terrainController.getTerrainById = async (req, res) => {
  try {
    const terrain = await Terrain.findById(req.params.id);
    terrain
      ? res.status(200).json(terrain)
      : res.status(404).json({ message: "Terrain not found 😔" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//serach for terrain
terrainController.searchTerrain = async (req, res) => {
  const { governorate, city, day, timeSlot } = req.body;
  try {
    const query = {};

    if (!isEmpty(governorate)) {
      query["address.governorate"] = { $regex: governorate, $options: "i" };
    }

    if (!isEmpty(city)) {
      query["address.city"] = { $regex: city, $options: "i" };
    }

    const terrains = await Terrain.find(query);

    const terrainIds = terrains.map((terrain) => terrain._id);

    const reservations = await Reservation.find({
      terrain: { $in: terrainIds },
      date: day,
      timeSlot: timeSlot,
      confirmation: true,
    });

    const terrainIdres = reservations.map((reservation) => reservation.terrain);

    const availableTerrains = terrains.filter(
      (objA) => !terrainIdres.some((id) => id.equals(objA._id))
    );

    availableTerrains
      ? res.status(200).json(availableTerrains)
      : res.status(404).json("Terrains not found 😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = terrainController;
