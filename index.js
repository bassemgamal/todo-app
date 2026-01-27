const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8080;

// 🟢 ربط MongoDB
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://bassem:4123@bassemgamal.b8rap.mongodb.net/",
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 🧩 إنشاء Schema و Model
const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.use("/api/todos", require("./routes/todos"));

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// GET جميع المهام

// POST إضافة مهمة جديدة

// PUT تعديل مهمة

// DELETE حذف مهمة

app.get("/api/auth/me", auth, (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
app.use(errorHandler);
