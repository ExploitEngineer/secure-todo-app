import express from "express";
import db from "../models/index.js";
import verifyUser from "../middleware/verifyUser.js";

const { User } = db;

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

router.get("/me", verifyUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["username", "email"],
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/users/:id", async (req, res) => {
  const {
    params: { id },
  } = req;
  parseInt(id);

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) res.status(404).send({ message: "no user found!" });

    res.json(user);
  } catch (err) {
    console.error("no users found");
  }
});

export default router;
