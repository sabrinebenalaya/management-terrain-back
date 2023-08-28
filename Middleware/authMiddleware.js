
const jwt = require("jsonwebtoken")

const authMiddleware  = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
 
    const verifyToken = jwt.verify(authHeader, process.env.SECRET_KEY);
   
   if (!verifyToken) {
      res.status(400).json({ msg: "you are not authorized ✋" });
    }
    if (verifyToken) {
      next();
    } 
  } catch (error) {
    res.status(500).json({ msg: "error server ⚠️" });
  }
};
module.exports = authMiddleware;