import express from "express";
import db from "../models/index.js";
import verifyUser from "../middleware/verifyUser.js";

const { Todo } = db;

const router = express.Router();

router.get("/", verifyUser, async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { userId: req.user.id },
    });

    res.status(200).send(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).send({ error: "Failed to fetch todos" });
  }
});

router.post("/", verifyUser, async (req, res) => {
  const {
    body: { title },
    user: { id },
  } = req;

  if (!title) {
    console.log("Title is missing in the request body");
    return res.status(400).send({ error: "Title is required" });
  }

  try {
    console.log("Creating todo with title:", title, "and userId:", id);
    const newTodo = await Todo.create({
      title,
      checked: false,
      userId: id,
    });

    res.status(201).send(newTodo);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).send({ error: "Failed to create todo" });
  }
});

router.delete("/:id", verifyUser, async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const deletedTodo = await Todo.destroy({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!deletedTodo) {
      return res.status(404).send({ error: "Todo not found" });
    }

    res.status(200).send({ message: "Todo deleted successfulyy" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).send({
      error: "Faild to delete todo",
    });
  }
});

router.patch("/:id", verifyUser, async (req, res) => {
  const {
    params: { id },
    body: { title },
    user: { id: userId },
  } = req;

  if (!title) {
    return res.status(400).send({ error: "Title is required" });
  }

  try {
    const todo = await Todo.findOne({
      where: { id, userId },
    });

    if (!todo) {
      return res.status(404).send({ error: "Todo not found" });
    }

    todo.title = title;
    await todo.save();

    res.status(200).send(todo);
  } catch (err) {
    console.log("Error updating tools:", err);
    res.status(500).send({ error: "Failed to update todo" });
  }
});

export default router;
