const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// generate token
function generateToken(data) {
  return jwt.sign(data, process.env.SECRET_KEY, {
    expiresIn: "24hrs",
  });
}

// Issue Cookies
const maxAge = 5000 * 60 * 60; // 5 Hours
const issuesCookies = (res, token, expiresIn) => {
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: expiresIn ?? maxAge,
    sameSite: "none",
    secure: true,
  });
};

// get me
const getLoggedInUser = async (req, res) => {
  try {
    res.status(200).json(req.data);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong: " + err.message,
      data: null,
    });
  }
};

// Mailer
const customMailer = async ({ to = "", subject = "", body = "" }) => {
  try {
    var transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,

      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: "coodewithcoode@gmail.com",
      to: to,
      subject: subject,
      text: body,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw error;
      } else {
        response = "Email sent: " + info.response;
      }
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  generateToken,
  issuesCookies,
  getLoggedInUser,
  customMailer,
};
