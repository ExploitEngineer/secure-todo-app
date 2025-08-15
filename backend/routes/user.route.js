import express from "express";
import db from "../models/index.js";
import verifyUser from "../middleware/verifyUser.js";

const { User, Todo } = db;

export default function (io) {
  const router = express.Router();

  router.get("/", async (_req, res) => {
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

  router.get("/:id", async (req, res) => {
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

  router.get("/:userId/todos", verifyUser, async (req, res) => {
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

  router.post("/:userId/todos", async (req, res) => {
    const {
      params: { userId },
      body: { title },
    } = req;
    if (!title) return res.status(400).send({ error: "Missing title" });

    try {
      const newTodo = await Todo.create({
        title,
        checked: false,
        userId,
      });

      const todos = await Todo.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

      io.to(`user_${userId}`).emit("todosUpdated", todos);
      res.status(201).send(newTodo);
    } catch (err) {
      console.error("Error creating todo:", err);
      res.status(500).send({ error: "Failed to create todo" });
    }
  });

  router.delete("/:userId/todos/:id", async (req, res) => {
    const { userId } = req.params;
    const id = Number(req.params.id);

    try {
      const todo = await Todo.findByPk(id);
      if (!todo) return res.status(404).send({ error: "Todo not found" });

      await todo.destroy();

      const todos = await Todo.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

      io.to(`user_${userId}`).emit("todosUpdated", todos);
      res.status(200).send({ message: "Todo deleted successfully" });
    } catch (err) {
      console.error("Error deleting todo:", err);
      res.status(500).send({ error: "Failed to delete todo" });
    }
  });

  router.patch("/:userId/todos/:id", async (req, res) => {
    const { userId } = req.params;
    const id = Number(req.params.id);
    const { title, checked } = req.body;

    try {
      const todo = await Todo.findByPk(id);
      if (!todo) return res.status(404).send({ error: "Todo not found" });

      if (typeof title === "string") todo.title = title;
      if (typeof checked === "boolean") todo.checked = checked;

      await todo.save();

      const todos = await Todo.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

      io.to(`user_${userId}`).emit("todosUpdated", todos);
      res.status(200).send(todo);
    } catch (err) {
      console.error("Error updating todo:", err);
      res.status(500).send({ error: "Failed to update todo" });
    }
  });

  return router;
}
