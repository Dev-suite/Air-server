const User = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkUser, authUser } = require("./user.helper");

// Authentication
async function activeController(_user) {
  try {
    _user.loginActivities.isLogin = true;
    _user.loginActivities.time = {
      from: new Date().toUTCString(),
    };
    await _user.save();
  } catch (err) {
    console.log(err);
  }
}

// Sign up
const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      businessName,
      phoneNumber,
      accountType,
    } = req.body;

    const _account = await checkUser(email, phoneNumber);
    if (_account)
      return res
        .status(401)
        .send({ status: false, data: null, message: "Account already exits" });
    const isBusinessNameExist = await User.findOne({
      businessName: businessName,
    });
    if (isBusinessNameExist)
      return res.status(401).send({
        status: false,
        message: "Business Name already used, choice another one.",
        data: null,
      });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const _user = await User.create({
      email,
      password: hashedPassword,
      businessName,
      firstName,
      lastName,
      accountType,
      phoneNumber,
    });
    await activeController(_user);
    res.status(200).json({
      status: true,
      message: "Account created successfully.",
      user: authUser(_user),
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        status: false,
        message: "Something went wrong" + err,
        data: null,
      });
  }
};
// Sign In
const signIn = async (req, res) => {
  try {
    const { email, password, phoneNumber } = req.body;

    const _user = await checkUser(email, phoneNumber);
    if (!_user)
      return res
        .status(401)
        .send({ status: false, data: null, message: "Account doesn't exits" });

    const isPasswordCorrect = await bcrypt.compare(password, _user.password);
    if (!isPasswordCorrect)
      return res.status(401).send({ message: "Password is incorrect" });
    await activeController(_user);
    res
      .status(200)
      .json({
        status: true,
        message: "Account login successfully.",
        user: authUser(_user),
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: false,
        data: null,
        message: "Something went wrong " + err,
      });
  }
};

// User management
// Log Out
const signOut = (req, res) => {};

// Delete account

// Revoking access
const revokeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Token is required for access" });
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role != "admin")
      return res.status(403).json({ message: "Unauthorized: access denied." });
    const _user = await User.findByIdAndUpdate({ _id: id });
    if (!_user) return res.status(404).json({ message: "User not found" });
    _user.accountBlocked = !_user.accountBlocked;
    await _user.save();
    res.status(201).json({
      message: `${_user.email} has been revoked successfully.`,
      status: _user.accountBlocked,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page);
    const limit = req.query.limit != undefined ? req.query.limit : 10;
    const skipIndex = (page - 1) * limit;
    const totalUsers = await User.find();
    const users = await User.find()
      .select("-password")
      .sort()
      .limit(limit)
      .skip(skipIndex)
      .exec();
    res.status(200).json({
      status: true,
      message: "Users fetched........",
      data: { page: page, total: totalUsers.length, users: users },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `Something went wrong ${err}`,
      data: null,
    });
  }
};

// Users analytics
const usersAnalytics = async (req, res) => {
  try {
    let data = {
      residentReward: 0,
      landlordBanking: 0,
      homeLoans: 0,
      openSafari: 0,
      travelReward: 0,
      hospitalityAccount: 0,
      totalUser: 0,
    };
    const users = await User.find().select("-password");
    for (const user of users) {
      if (user.accountType.toLowerCase() === "opensafari") {
        data.openSafari++;
      } else if (user.accountType.toLowerCase() === "travelreward") {
        data.travelReward++;
      } else if (user.accountType.toLowerCase() === "residentreward") {
        data.residentReward++;
      } else if (user.accountType.toLowerCase() === "landlordbanking") {
        data.landlordBanking++;
      } else if (user.accountType.toLowerCase() === "homeloans") {
        data.homeLoans++;
      } else if (user.accountType.toLowerCase() === "hospitalityaccount") {
        data.hospitalityAccount++;
      }
    }
    data.totalUser = users.length;
    res.status(200).json({
      status: true,
      message: "Analytics data retrieved successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `Something went wrong ${err}`,
      data: null,
    });
  }
};

module.exports = { signUp, signOut, signIn, getAllUsers, usersAnalytics };
