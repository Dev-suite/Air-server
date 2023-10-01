const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subscribeAt: {
    type: Date,
    default: new Date(),
  },
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = Subscriber;
