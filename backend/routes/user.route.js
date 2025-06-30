const express = require("express");
const { User } = require("../models");

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});

module.exports = router;
