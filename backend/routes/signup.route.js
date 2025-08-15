import bcrypt from "bcrypt";
import express from "express";
import db from "../models/index.js";

const { User } = db;

const router = express.Router();

router.post("/signup", async (req, res) => {
  const {
    body: { username, email, password },
  } = req;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await User.create({ username, email, password: hash });

    res.status(200).send({ message: "User created successfully" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
