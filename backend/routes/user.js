const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const router = express.Router();

const generateRandomAmount = () => {
  return Math.random() * 10000 + 1;
}

// Validation schemas
const signUpSchema = zod.object({
  username: zod
    .string()
    .min(3, "username must be atleast 3 characters long")
    .max(80, "username must not exceed 30 characters")
    .toLowerCase()
    .email("username must be an email"),
  firstName: zod
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters"),
  lastName: zod
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

const signInSchema = zod.object({
  username: zod
    .string()
    .min(3, "username must be atleast 3 characters long")
    .max(80, "username must not exceed 30 characters")
    .toLowerCase()
    .email("username must be an email"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

const updateSchema = zod.object({
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
  firstName: zod
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters")
    .optional(),
  lastName: zod
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters")
    .optional(),
});
// middlewares

const validateSignup = (req, res, next) => {
  try {
    signUpSchema.parse(req.body);
    next();
  } catch (error) {
    errorArr = error.errors.map(element => element.message)
    return res.status(411).json({
      success: false,
      errors: errorArr,
    });
  }
};

const validateSignIn = (req, res, next) => {
  console.log(req.body)
  try {
    signInSchema.parse(req.body);
    next();
  } catch (error) {
    errorArr = error.errors.map(element => element.message)
    return res.status(411).json({
      success: false,
      errors: errorArr,
    });
  }
};

const validateUpdate = (req, res, next) => {
  try {
    updateSchema.parse(req.body);
    next();
  }catch(error) {
    const errors = []
    if(error instanceof zod.ZodError) {
      errors = error.map(element => element.message)
    }
    return res.status(411).json({
      message: errors || "Error while updating information"
    })
  }
}

// routes

router.put("/", authMiddleware, validateUpdate, async(req, res) => {
  // console.log(req.body)
  await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", authMiddleware, async(req, res) => {
  const filter = req.query.filter || "";

  // Note: we can pass projection object as 2nd parameter in find to exclude the keys we don't want in the result
  const users = await User.find({
    $or: [
      {
        firstName: {
          "$regex": filter
        }
      },
      {
        lastName: {
          "$regex": filter
        }
      }
    ]
  }, { username: 0, __v: 0 })

  const filteredUsers = users.filter(user => req.userId !== user._id.toString());
  return res.json({
    "users": filteredUsers
  })
})

router.post("/signup", validateSignup, async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;

  await Account.create({
    userId,
    balance: generateRandomAmount()
  });


  const token = jwt.sign({ userId }, JWT_SECRET);
  return res.status(200).json({
    message: "user created successfully",
    token: token,
  });
});

router.post("/signin", validateSignIn, async (req, res) => {
  const existingUser = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (!existingUser) {
    return res.status(411).json({
      message: "username not found",
    });
  }

  const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);
  return res.status(200).json({ token: token });
});

module.exports = router;
