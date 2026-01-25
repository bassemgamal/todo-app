const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// تسجيل مستخدم جديد
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({
        message: "Email already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({
      message: "server error.",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, pasword } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields required.",
    })};

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
      const isMatch = await bcrypt.compare(pasword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (err) {
      res.status(500).json({
        message: "Server error.",
      });
    }
  }
);

module.exports = router;