const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
require("dotenv").config();

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

module.exports = router;
