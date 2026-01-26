const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Todo = require("../models/Todo");
const mongoose = require("mongoose");

router.get("/", auth, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id });
  res.json(todos);
});

router.post("/", auth, async (req, res) => {
  if (!req.body.text?.trim()) {
    return res.status(400).json({ message: "Todo text required." });
  }
  const todo = await Todo.create({
    text: req.body.text,
    userId: req.user.id,
  });

  res.json(todo);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.id;

    const deleted = await Todo.deleteOne({
      _id: todoId,
      userId,
    });
    console.log(_id);
    console.log(userId);
    console.log(deleted);

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "Todo not found or not allowed" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("DELETE TODO ERROR:", err);
    res.status(500).json({ message: "Server error while deleting todo" });
  }
});

module.exports = router;
