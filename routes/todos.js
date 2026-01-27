const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Todo = require("../models/Todo");
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

// PUT
router.put("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (req.body.text) todo.text = req.body.text;
    if (typeof req.body.completed === "boolean") {
      todo.completed = req.body.completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    console.error("UPDATE TODO ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Todo not found or not allowed",
      });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("DELETE TODO ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
