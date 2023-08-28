const express = require("express");
const path = require('path');
const multer  = require('multer')

const router = express.Router();
const partnerController = require('../Controller/PartneRController')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/partners')
  },
  filename: function (req, file, cb) {
    const newFileName = Date.now() + '-' + file.originalname
    cb(null, newFileName)
  }
})
const upload = multer({ storage: storage })

router.get('/assets/partners/:filename',(req,res)=>{
  const {filename} = req.params
  const filePath = path.join(__dirname, '..', 'assets','partners', filename);
  res.sendFile(filePath)
})

router.put("/updatePhoto/:id", upload.single("image"), partnerController.updatePhoto)

router.put("/update/:id", upload.single("image"), partnerController.update);

router.get("/partner/:id", partnerController.getParterById);
module.exports = router;


