const Admin = require("./admin_model");
const bcrypt = require("bcrypt");
const {
  generateToken,
  issuesCookies,
  customMailer,
} = require("../utils/helper");

// Create Admin
const createAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const adminAlreadyExist = await Admin.findOne({ email });
    if (adminAlreadyExist)
      return res.status(403).json({
        status: false,
        message: "An admin with this email already exist",
        data: null,
      });
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);
    const newAdmin = await Admin.create({ email: email, password: hash, role });
    res.status(201).json({
      status: true,
      message: "Admin created successfully",
      data: { email: newAdmin.email, password, role: newAdmin.role },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `Something went wrong ${err}`,
      data: null,
    });
  }
};

// Login Admin
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({
        status: false,
        message: "No admin exist with this email",
        data: null,
      });
    const isPasswordValid = bcrypt.compareSync(password, admin.password);
    if (!isPasswordValid)
      return res
        .status(403)
        .json({ status: true, message: "Invalid Password", data: null });
    const token = generateToken({ email: admin.email, id: admin._id });
    issuesCookies(res, token);
    res
      .status(200)
      .json({ status: true, message: "Login successful", data: null });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `Something went wrong ${err}`,
      data: null,
    });
  }
};

// Forget Password
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({
        status: false,
        message: "No admin exist with this email",
        data: null,
      });
    const pinCode = Math.floor(1000 + Math.random() * 9000);
    console.log(pinCode);
    admin.otp = pinCode;
    admin.otpExpireTime = Date.now() + 180000;
    await admin.save();
    await customMailer({
      to: email,
      subject: "Reset Password",
      body: `You have requested for a code to change your password, Kindly ignore if you didn't request for it.\n\nYour verification code is ${pinCode}.`,
    });
    res.status(200).json({
      status: true,
      message: "Otp sent to " + email + " successfully.",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `Something went wrong ${err}`,
      data: null,
    });
  }
};

// Verify Email (using otp)
const verifyEmailOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const admin = await Admin.findOne({ otp: otp.trim() });
    if (!admin)
      return res
        .status(404)
        .json({ status: false, message: "Invalid otp", data: null });
    if (admin?.otpExpireTime < Date.now())
      return res
        .status(400)
        .json({ status: false, message: "otp expired", data: null });
    admin.otp = "";
    admin.otpExpireTime = "";
    await admin.save();
    const token = generateToken({ email: admin.email, id: admin._id });
    issuesCookies(res, token, Date.now() + 3600);
    res.status(200).json({ status: true, message: "Otp verify.", data: null });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Something went wrong ${err}`,
      data: null,
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const admin = req.data;
    admin.password = hashedPassword;
    await admin.save();
    issuesCookies(res, "", new Date(0));
    res.status(200).json({
      status: true,
      message: "Password reset successfully",
      data: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: `Something went wrong ${err}`,
      data: null,
    });
  }
};

// logout
const logout = async (req, res) => {
  try {
    issuesCookies(res, "", new Date(0));
    res
      .status(200)
      .json({ success: true, message: "Successfully logout ", data: null });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `Something went wrong ${err}`,
      data: null,
    });
    console.log(err);
  }
};

module.exports = {
  createAdmin,
  login,
  forgetPassword,
  logout,
  verifyEmailOtp,
  resetPassword,
};
