const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Todo = require("../models/Todo");
const mongoose = require("mongoose");

// GET
router.get("/", auth, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id });
  res.json(todos);
});

// POST
router.post("/", auth, async (req, res) => {
  if (!req.body.text?.trim()) {
    return res.status(400).json({ message: "Todo text required" });
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
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Todo ID" });
    }

    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Todo not found or not allowed" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
