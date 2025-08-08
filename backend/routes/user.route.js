import express from "express";
import { User } from "../models";

const router = express.Router();

router.get("/users", async (_req, res) => {
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
