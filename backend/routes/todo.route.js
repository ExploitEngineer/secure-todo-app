import express from "express";
import db from "../models/index.js";
import verifyUser from "../middleware/verifyUser.js";

const { User, Todo } = db;

export default function (io) {
  const router = express.Router();

  router.get("/", verifyUser, async (req, res) => {
    const {
      user: { id },
    } = req;

    try {
      const todos = await Todo.findAll({
        where: { userId: id },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).send(todos);
    } catch (err) {
      console.error("Error fetching todos:", err);
      res.status(500).send({ error: "Failed to fetch todos" });
    }
  });

  router.post("/", verifyUser, async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).send({ error: "Missing title" });

    try {
      const newTodo = await Todo.create({
        title,
        checked: false,
        userId: req.user.id,
      });

      const todos = await Todo.findAll({
        where: { userId: req.user.id },
        order: [["createdAt", "DESC"]],
      });

      io.to(`user_${req.user.id}`).emit("todosUpdated", todos);
      res.status(201).send(newTodo);
    } catch (err) {
      console.error("Error creating todo:", err);
      res.status(500).send({ error: "Failed to create todo" });
    }
  });

  router.delete("/:id", verifyUser, async (req, res) => {
    const id = Number(req.params.id);

    try {
      const todo = await Todo.findByPk(id);
      if (!todo) return res.status(404).send({ error: "Todo not found" });

      if (todo.userId !== req.user.id) {
        return res.status(403).send({ error: "Not authorized" });
      }

      await todo.destroy();

      const todos = await Todo.findAll({
        where: { userId: req.user.id },
        order: [["createdAt", "DESC"]],
      });

      io.to(`user_${req.user.id}`).emit("todosUpdated", todos);
      res.status(200).send({ message: "Todo deleted successfully" });
    } catch (err) {
      console.error("Error deleting todo:", err);
      res.status(500).send({ error: "Failed to delete todo" });
    }
  });

  router.patch("/:id", verifyUser, async (req, res) => {
    const id = Number(req.params.id);
    const { title, checked } = req.body;

    try {
      const todo = await Todo.findByPk(id);
      if (!todo) return res.status(404).send({ error: "Todo not found" });

      if (todo.userId !== req.user.id) {
        return res.status(403).send({ error: "Not authorized" });
      }

      if (typeof title === "string") todo.title = title;
      if (typeof checked === "boolean") todo.checked = checked;

      await todo.save();

      const todos = await Todo.findAll({
        where: { userId: req.user.id },
        order: [["createdAt", "DESC"]],
      });

      io.to(`user_${req.user.id}`).emit("todosUpdated", todos);
      res.status(200).send(todo);
    } catch (err) {
      console.error("Error updating todo:", err);
      res.status(500).send({ error: "Failed to update todo" });
    }
  });

  return router;
}
