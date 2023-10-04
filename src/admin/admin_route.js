const router = require("express").Router();
const { getAllUsers, usersAnalytics } = require("../user/user.controller.js");
const {
  createAdmin,
  login,
  logout,
  forgetPassword,
  resetPassword,
  verifyEmailOtp,
} = require("./admin_controller.js");
const AuthorizedAdmin = require("../middleware/admin_middleware.js");
const { getLoggedInUser } = require("../utils/helper.js");

// auth
router.post("/create-admin", AuthorizedAdmin, createAdmin);
// router.post("/create-admin", createAdmin);
router.post("/login", login);
router.get("/get-me", AuthorizedAdmin, getLoggedInUser);
router.post("/logout", AuthorizedAdmin, logout);
router.post("/forget-password", forgetPassword);
router.put("/verify-otp", verifyEmailOtp);
router.put("/reset-password", AuthorizedAdmin, resetPassword);
// User
router.get("/users", AuthorizedAdmin, getAllUsers);
router.get("/users-analytics", AuthorizedAdmin, usersAnalytics);

module.exports = router;
