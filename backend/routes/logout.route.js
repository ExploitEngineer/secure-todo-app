const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.cookie("token", "");
  res.status(200).send({
    message: "Logged out successfully",
  });
});

module.exports = router;
