const User = require('./user.model');
const jwt = require('jsonwebtoken')

// Helper function
async function checkUser(email, phoneNumber) {
    let userExist;
    if (email != null && email.trim() != '') {
        const isEmailExist = await User.findOne({ email: email });
        userExist = isEmailExist;
    } else {
        const isPhoneExist = await User.findOne({ phoneNumber: phoneNumber });
        userExist = isPhoneExist;
    }
    return userExist;
}

// generate token
function generateToken(data) {
    return jwt.sign(data, process.env.SECRET_KEY, {
        expiresIn: '24hrs',
    });
}

// get user
function authUser(_user) {
    return {
        email: _user.email,
        phoneNumber: _user.phoneNumber,
        businessName: _user.businessName,
        firstName: _user.firstName,
        lastName: _user.lastName,
        accountType: _user.accountType,
        accountVerified: _user.accountVerified,
        accountBlocked: _user.accountBlocked,
        loginActivities: _user.loginActivities,
        token: generateToken({ id: _user._id, email: _user.email }),
    }
}

module.exports = { checkUser, generateToken, authUser };