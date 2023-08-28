const express = require("express");
const path = require("path");
const multer = require("multer");

const router = express.Router();
const terrainController = require("../Controller/TerrainController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/terrains");
  },
  filename: function (req, file, cb) {
    const newFileName = Date.now() + "-" + file.originalname;
    cb(null, newFileName);
  },
});
const upload = multer({ storage: storage });


router.get('/assets/terrains/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', 'assets', 'terrains', filename);
  
  // Utilisation de res.sendFile pour envoyer le fichier au client
  res.sendFile(filePath);
});

router.post("/add", terrainController.addTerrain);
router.get("/getTerrains/:id", terrainController.getAllTerrain);
router.get("/getTerrain/:id", terrainController.getTerrainById);
router.post("/search", terrainController.searchTerrain);
router.put("/update/:id", terrainController.update); 
router.delete("/delete/:id", terrainController.deleteTerrain); 
router.put("/updatePhoto/:id", terrainController.updatePhoto); 

router.get("/getAllTerrains/", terrainController.getAllTerrains);
module.exports = router;
