const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 🟢 ربط MongoDB
mongoose.connect(process.env.MONGO_URI||"mongodb+srv://bassem:4123@bassemgamal.b8rap.mongodb.net/")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 🧩 إنشاء Schema و Model
const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


// GET جميع المهام
app.get("/api/todos",auth, async (req, res) => {
  const todos = await Todo.find({user: req.user.id});
  res.json(todos);
});

// POST إضافة مهمة جديدة
app.post("/api/todos", async (req, res) => {
  const {text} = req.body;
  if (!text || text.trim() === ""){
    return res.status(400).json({
      message: "Task text is required."
    });
  };
  try{
    const newTodo = new Todo({ text: text.trim(), completed: false });
  await newTodo.save();
  res.status(201).json(newTodo);
  }catch(err){
    res.status(500).json({message: "Server error."});
  };
  
});

// PUT تعديل مهمة
app.put("/api/todos/:id", async (req, res) => {
  const {text, completed} = req.body;
if (!text || typeof completed !== "boolean"){
  return res.status(400).json({
    message: "Invalid data."
  });
};

try{
const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { text: text.trim(), completed },
    { new: true }
  );

  if(!updatedTodo){
    return res.status(404).json({
      message: "Todo not found."
    });
  };
  res.json(updatedTodo);
}catch(err){
  res.status(500).json({
    message: "Server error."
  });
};

  
});

// DELETE حذف مهمة
app.delete("/api/todos/:id", async (req, res) => {
  try{
    const deleted =   await Todo.findByIdAndDelete(req.params.id);
    if (!deleted){
      return res.status(404).json({
        message: "Todo not found."
      });
        res.json({ message: "Deleted" });
    };
  }catch(err){
    res.status(500).json({
      message: "Server error."
    });
  };
});

app.get("/api/auth/me", auth, (req, res) => {
  res.json({ok:true});
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
