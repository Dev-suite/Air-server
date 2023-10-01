const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  phone: {
    type: Number,
    required: [true, "Phone number is required"],
    min: [8, "Phone number must be greater than 8."],
  },
  subscribedAt: {
    type: Date,
    default: new Date(),
  },
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
