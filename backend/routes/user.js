const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const { JWT_SECRET } = require("../config");
const router = express.Router();

const signUpSchema = zod.object({
  username: zod
    .string()
    .min(3, "username must be atleast 3 characters long")
    .max(30, "username must not exceed 30 characters")
    .toLowerCase()
    .email("username must be an email"),
  firstname: zod
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters"),
  lastname: zod
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

// middleware for signup

const validateSignup = (req, res, next) => {
  try {
    signUpSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      errors: error.errors,
    });
  }
};

router.post("/signup", validateSignup, async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken",
    });
  }

  const user = User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
  });

  const userId = (await user)._id;

  const token = jwt.sign({ userId }, JWT_SECRET);
  return res.status(200).json({
    message: "user created successfully",
    token: token,
  });
});

module.exports = router;
