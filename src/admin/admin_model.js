const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["admin", "super-admin", "viewer"],
    default: "admin",
  },
  otp: {
    type: String,
    default: "",
  },
  otpExpireTime: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
