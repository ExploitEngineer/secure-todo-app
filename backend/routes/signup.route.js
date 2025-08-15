import express from "express";
import bcrypt from "bcrypt";
import db from "../models/index.js";

const { User } = db;

const router = express.Router();

router.post("/signup", async (req, res) => {
  const {
    body: { username, email, password },
  } = req;

  try {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return res.send("error generating salt");
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send("error generating hash");
        await User.create({ username, email, password: hash });
        res.status(200).send({ message: "User created Successfully" });
      });
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
