const User = require("../Model/User");
const ValidateUser = require("../Validator/ValidateUser");
const isEmpty = require("../Validator/IsEmpty");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const path = require('path');
const userController = {};

// Create a user
userController.addUser = async (req, res) => {
 
  try {
    if (!req.body || !req.body.partner) {
      return res
        .status(400)
        .json({
          msg: "Invalid request. Missing 'newUser' or 'partner' property.",
        });
    }

    const userExist = await User.findOne({
      partner: req.body.partner,
      email: req.body.email,
    });

    if (userExist === null) {
      const user = new User(req.body);

      const hashedPassword = await bcrypt.hash(String(user.password), 10);

      user.password = hashedPassword;

      await user.save();
      
      res.status(200).json({ user });
   
    } else {
      res
       .status(400)
        .json({ msg: "User already exists, you should login 😜" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users
userController.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ partner: req.params.id });
    users
      ? res.status(200).json(users)
      : res.status(404).json("No user was found 😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific User by ID
userController.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user
      ? res.status(200).json(user)
      : res.status(404).json("User not found😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a User
userController.update = async (req, res) => {
  const { id } = req.params;
  const userToUpdate = req.body;
  if (userToUpdate.avatar) {
    const base64Data = userToUpdate.avatar.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');
  
    // Générez un nom de fichier unique pour l'image (par exemple, en utilisant le timestamp actuel)
    const timestamp = Date.now();
    const imageFileName = `${timestamp}_${userToUpdate._id}.png`; // ou tout autre format souhaité (par exemple, .jpg, .jpeg, etc.)
  
    // Chemin du dossier où stocker les images (relatif à la racine du serveur)
    const imageFolderPath = path.join('assets', 'users'); // Chemin relatif
  
    // Chemin complet de l'image, à partir de la racine du serveur
    const imagePath = path.join(__dirname, '..', imageFolderPath, imageFileName);
  
    // Assurez-vous que le dossier existe
    if (!fs.existsSync(imageFolderPath)) {
      fs.mkdirSync(imageFolderPath, { recursive: true });
    }
  
    // Écrivez l'image sur le disque
    fs.writeFileSync(imagePath, imageBuffer);
  
    // Mettez à jour l'attribut 'avatar' du contact avec le chemin relatif de l'image
    userToUpdate.photoURL = path.join(imageFolderPath, imageFileName).replace(/\\/g, '/'); // Remplace les backslashes par des slashes
  }
  

  if (!isEmpty(userToUpdate.password)) {
    const hashedPaswword = await bcrypt.hash(userToUpdate.password, 10);
    userToUpdate.password = hashedPaswword;
  }
 
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { ...userToUpdate } },
      {
        new: true,
        runValidators: true,
      }
    );
    user.avatar =""
    console.log("photo",user.photoURL)
    user
      ? res.status(200).json(user)
      : res.status(404).json("User not found ⚠️");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a User
userController.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    const users = await User.find();
    user
      ? res.status(200).json(users)
      : res.status(404).json("User not found 😔");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = userController;
