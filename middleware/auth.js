const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const userExits = await User.findByPk(payload.userId);

    if (!userExits) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = userExits.id;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
