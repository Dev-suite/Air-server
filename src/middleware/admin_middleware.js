const Admin = require("../admin/admin_model");
const JWT = require("jsonwebtoken");

const AuthorizedAdmin = async (req, res, next) => {
  try {
    if (!req.headers.cookie)
      return res
        .status(403)
        .json({ status: false, message: "Cookies are required", data: null });
    const token = req.headers.cookie.split("=")[1];
    if (!token)
      return res.status(401).json({
        status: true,
        message: "Token is required to pass in the header",
        data: null,
      });
    const decodedData = JWT.verify(token, process.env.SECRET_KEY);
    if (!decodedData)
      return res
        .status(401)
        .json({ status: false, message: "Invalid token", data: null });
    const admin = await Admin.findOne({ email: decodedData.email }).select(
      "-password"
    );
    if (!admin)
      return res.status(404).json({
        status: true,
        message: "No admin is found with this email",
        data: null,
      });
    req.data = admin;
    next();
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: `Something went ${err}`, data: null });
  }
};

module.exports = AuthorizedAdmin;
