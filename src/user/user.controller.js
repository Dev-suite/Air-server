const User = require('./user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { checkUser, generateToken, authUser } = require('./user.helper');

// Authentication
async function activeController(_user) {
    try {
        _user.loginActivities.isLogin = true;
        _user.loginActivities.time = {
            from: new Date().toUTCString(),
        }
        await _user.save();
    } catch (err) {
        console.log(err);
    }
}



// Sign up
const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, businessName, phoneNumber, accountType } = req.body;

        const _account = await checkUser(email, phoneNumber);
        if (_account) return res.status(401).send({ message: "Account already exits" });
        const isBusinessNameExist = await User.findOne({ businessName: businessName });
        if (isBusinessNameExist) return res.status(401).send({ message: "Business Name already used, choice another one." });

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const _user = await User.create({ email, password: hashedPassword, businessName, firstName, lastName, accountType, phoneNumber });
        await activeController(_user);
        res.status(200).json({ message: "Account created successfully.", user: authUser(_user) })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong", error: err });
    }

}
// Sign In
const signIn = async (req, res) => {
    try {
        const { email, password, phoneNumber } = req.body;

        const _user = await checkUser(email, phoneNumber);
        if (!_user) return res.status(401).send({ message: "Account doesn't exits" });

        const isPasswordCorrect = await bcrypt.compare(password, _user.password);
        if (!isPasswordCorrect) return res.status(401).send({ message: "Password is incorrect" });
        await activeController(_user);
        res.status(200).json({ message: "Account login successfully.", user: authUser(_user) })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err });
    }
}

// User management
// Log Out
const signOut = (req, res) => { }

// Delete account

// Revoking access
const revokeUser = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Token is required for access" });
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role != "admin") return res.status(403).json({ message: "Unauthorized: access denied." });
        const _user = await User.findByIdAndUpdate({ _id: id });
        if (!_user) return res.status(404).json({ message: "User not found" });
        _user.accountBlocked = !_user.accountBlocked;
        await _user.save();
        res.status(201).json({ message: `${_user.email} has been revoked successfully.`, status: _user.accountBlocked });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err });
    }
}

module.exports = { signUp, signOut, signIn };