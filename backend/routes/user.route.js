import express from "express";
import db from "../models/index.js";
import verifyUser from "../middleware/verifyUser.js";

const { User, Todo } = db;

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
      attributes: ["id", "username", "email", "isAdmin"],
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).send({ message: "no user found!" });

    res.json(user);
  } catch (err) {
    console.error("no users found", err);
    res.status(500).send({ error: "Failed to fetch user" });
  }
});

router.get("/users/:userId/todos", verifyUser, async (req, res) => {
  const userId = Number(req.params.userId);
  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const targetUser = await User.findByPk(userId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    const todos = await Todo.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(todos);
  } catch (err) {
    console.error("Error fetching todos for user:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

export default router;
