const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const { Account, User } = require("../db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// validations
const transferSchema = zod.object({
  to: zod.string(),
  amount: zod.number(),
});

// routes
router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });

    return res.json({
      balance: account.balance,
    });
  } catch (error) {
    return res.status(403).json({
      message: "something went wrong",
    });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  // const { success } = transferSchema.safeParse(req.body);
  // if (!success) {
  //   return res.status(403).json({
  //     message: "something went wrong",
  //   });
  // }
  
  const {to, amount} = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderAccount = await Account.findOne({ userId: req.userId }).session(
      session
    );
    if (!senderAccount) {
      throw new Error("Sender account not found");
    }

    if (senderAccount.balance < amount) {
      throw new Error("Insufficient balance");
    }

    const recipientAccount = await Account.findOne({ userId: to }).session(
      session
    );
    if (!recipientAccount) {
      throw new Error("Recipient account not found");
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    await session.endSession();
    return res.json({
      message: "Transfer successful",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // console.error("Transaction failed:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
