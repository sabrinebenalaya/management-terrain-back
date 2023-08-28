const express = require("express");
const path = require('path');
const multer  = require('multer')

const router = express.Router();
const userController = require('../Controller/UserController')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'assets/users')
    },
    filename: function (req, file, cb) {
      const newFileName = Date.now() + '-' + file.originalname
      cb(null, newFileName)
    }
  })
  const upload = multer({ storage: storage })
  
  router.get('/assets/users/:filename',(req,res)=>{
    const {filename} = req.params
    const filePath = path.join(__dirname, '..', 'assets','users', filename);
    res.sendFile(filePath)
  })

router.post("/add", userController.addUser);
router.get("/getUsers/:id", userController.getAllUsers);
router.get("/getuser/:id", userController.getUserById);
router.put("/update/:id", userController.update);
router.delete("/delete/:id", userController.deleteUser); 
 


module.exports = router;


