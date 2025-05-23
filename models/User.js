const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  profilePic: { type: String, default: "" },
  coverPic: { type: String, default: "" },
  isDeleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },  
  otp: { type: String },  
  otpExpires: { type: Date } 
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  next();
});

module.exports = mongoose.model("User", UserSchema);
