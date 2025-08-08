import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.cookie("token", "");
  res.status(200).send({
    message: "Logged out successfully",
  });
});

module.exports = router;
