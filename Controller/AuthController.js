const Partner = require("../Model/Partner");
const User = require("../Model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ValidateLogin = require("../Validator/ValidateLogin");
const ValidateRegister = require("../Validator/ValidateRegister");

const authController = {};

//Register
authController.regitser = async (req, res) => {
  const partner = req.body;

  try {
    const partnerExist = await Partner.findOne({
      $or: [{ email: partner.email }, { cin: partner.cin }],
    });
    
    if (partnerExist) {
      res.status(400).json({ msg: "User already exist you sould login 😜" });
    } else {
      const user = new Partner(req.body);
      const hashedPaswword = await bcrypt.hash(user.password, 10);
      user.password = hashedPaswword;
      await user.save();

      res.status(200).json({ user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//log in
authController.login = async (req, res) => {
  const partnerInfo = req.body;

  try {
    const partner = await Partner.findOne({ email: partnerInfo.data.email });
    const user = await User.findOne({ email: partnerInfo.data.email });

    if (!partner && !user) {
      return res.status(400).json({ msg: "You must register before 😊" });
    }

    let entity, entityType;

    if (partner) {
      entity = partner;
      entityType = "partner";
    } else {
      entity = user;
      entityType = "user";
    }

    const isPasswordCorrect = await bcrypt.compare(
      partnerInfo.data.password,
      entity.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "Wrong password 🤦" });
    }
 
    const access_token = jwt.sign(
      {
        id: entity._id,
        entityType
      },
      process.env.SECRET_KEY,
      { expiresIn: '1w' } 
    );

    res.status(200).json({ [entityType]: entity, access_token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server failed ✋" });
  }
};

//token verify
authController.signInWithToken = async (req, res) => {
 // console.log("req", req.rawHeaders[13])
 const authorizationHeader = req.headers['authorization'];
 
  try {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header manquant ou invalide' });
    }
   
    const access_token = authorizationHeader.split(' ')[1]; // Extraire le token du header
    if (!access_token) {
      return res.status(400).json({ error: 'Token d\'accès manquant' });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(access_token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    const entityType = decodedToken.entityType;
    if (entityType !== 'user' && entityType !== 'partner') {
      console.log("erreur")
      return res.status(400).json({ error: 'Type d\'entité inconnu dans le token' });
    }

 
    let entity;
    if (entityType === 'user') {
      entity = await User.findById(decodedToken.id );
    } else { 
      entity = await Partner.findById( decodedToken.id);
    }

    if (!entity) {
      return res.status(400).json({ error: 'Entité non trouvée dans la base de données' });
    }

    // Répondre avec les données de l'entité et le type d'entité (optionnel)
    return res.status(200).json({ [entityType]: entity, entityType, access_token });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erreur lors de la vérification du token' });
  }
};

//Log out
authController.logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json("You are now logged out 😔");
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "server failed ⚠️" }] });
  }
};

module.exports = authController;
