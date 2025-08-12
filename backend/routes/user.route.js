import express from "express";
import db from "../models/index.js";
import verifyUser from "../middleware/verifyUser.js";

const { User, Todo } = db;

export default function (io) {
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
      if (!user) res.status(404).send({ message: "no user found!" });

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

  router.post("/users/:userId/todos", verifyUser, async (req, res) => {
    const targetUserId = Number(req.params.userId);
    if (Number.isNaN(targetUserId))
      return res.status(400).json({ error: "Invalid userId" });

    // permission check: owner or isAdmin
    if (req.user.id !== targetUserId && !req.user.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    try {
      const newTodo = await Todo.create({
        title,
        checked: false,
        userId: targetUserId,
      });

      io.to(`user_${targetUserId}`).emit("todosUpdated", {
        action: "create",
        todo: newTodo,
      });

      res.status(201).json(newTodo);
    } catch (err) {
      console.error("Error creating todo for user:", err);
      res.status(500).json({ error: "Failed to create todo" });
    }
  });

  // --- New: update a todo for a specific user (owner or admin) ---
  router.patch("/users/:userId/todos/:todoId", verifyUser, async (req, res) => {
    const targetUserId = Number(req.params.userId);
    const todoId = Number(req.params.todoId);

    if (Number.isNaN(targetUserId) || Number.isNaN(todoId))
      return res.status(400).json({ error: "Invalid id(s)" });

    if (req.user.id !== targetUserId && !req.user.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { title, checked } = req.body;

    try {
      const todo = await Todo.findOne({
        where: { id: todoId, userId: targetUserId },
      });
      if (!todo) return res.status(404).json({ error: "Todo not found" });

      if (typeof title === "string") todo.title = title;
      if (typeof checked === "boolean") todo.checked = checked;

      await todo.save();

      io.to(`user_${targetUserId}`).emit("todosUpdated", {
        action: "update",
        todo,
      });

      res.status(200).json(todo);
    } catch (err) {
      console.error("Error updating user's todo:", err);
      res.status(500).json({ error: "Failed to update todo" });
    }
  });

  // --- New: delete a todo for a specific user (owner or admin) ---
  router.delete(
    "/users/:userId/todos/:todoId",
    verifyUser,
    async (req, res) => {
      const targetUserId = Number(req.params.userId);
      const todoId = Number(req.params.todoId);

      if (Number.isNaN(targetUserId) || Number.isNaN(todoId))
        return res.status(400).json({ error: "Invalid id(s)" });

      if (req.user.id !== targetUserId && !req.user.isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
      }

      try {
        const todo = await Todo.findOne({
          where: { id: todoId, userId: targetUserId },
        });
        if (!todo) return res.status(404).json({ error: "Todo not found" });

        await todo.destroy();

        io.to(`user_${targetUserId}`).emit("todosUpdated", {
          action: "delete",
          todoId,
        });

        res.status(200).json({ message: "Todo deleted successfully" });
      } catch (err) {
        console.error("Error deleting user's todo:", err);
        res.status(500).json({ error: "Failed to delete todo" });
      }
    },
  );

  return router;
}
