const mongoose = require("mongoose");
const zod = require("zod");

mongoose.connect("mongodb+srv://namantheadmin:namanGaUr@cluster0.fm8s0.mongodb.net/paytm")
// Schemas
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  balance:{
    type: Number,
    required: true
  }
})


// models
const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema)

module.exports = {
	User,
  Account
};
