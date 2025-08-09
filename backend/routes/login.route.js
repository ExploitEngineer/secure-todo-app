import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import dotenv from "dotenv";

const { User } = db;

dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side access to the cookie
      secure: false, // Set to true if using HTTPS
      sameSite: "strict", // Prevent CSRF attacks
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
