const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Todo = require("../models/Todo");

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
  const deleted = await Todo.deleteOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!deleted.deletedCount) {
    return res.status(403).json({ message: "Not allowed" });
  }

  res.json({ message: "Deleted" });
});

module.exports = router;
