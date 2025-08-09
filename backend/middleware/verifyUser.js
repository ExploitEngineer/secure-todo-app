import db from "../models/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const { User } = db;

dotenv.config();

const verifyUser = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies);

    const token = req.cookies.token;
    if (!token) {
      console.log("Token is missing in cookies");
      return res.status(401).json({ error: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log("User not found");
      return res.status(404).send({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("JWT verification error:", err);
    res.status(401).send({ error: "Unauthorized" });
  }
};

export default verifyUser;
