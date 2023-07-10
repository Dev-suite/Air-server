const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        unique: true,
    },
    businessName: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    accountType: {
        type: String,
        require: true,
    },
    accountVerified: {
        type: Boolean,
        default: false
    },
    accountBlocked: {
        type: Boolean,
        default: false
    },
    loginActivities: {
        isLogin: {
            type: Boolean,
            default: false,
        },
        time: {
            from: {
                type: String,
                default: "",
            },
            to: {
                type: String,
                default: "",
            },
        }
    },
    createdAt: {
        type: String,
        default: new Date(),
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;