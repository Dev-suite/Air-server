const Subscriber = require("./subscribers_model");

// Subscribe
const subscribeToNewsLetter = async (req, res) => {
  try {
    const { email } = req.body;
    const alreadySubscribed = await Subscriber.findOne({
      email: email.trim().toLowerCase(),
    });
    if (alreadySubscribed)
      return res.status(403).json({
        status: false,
        message: "You have already subscribed",
        data: null,
      });
    await Subscriber.create({ email, subscribeAt: new Date() });
    res
      .status(200)
      .json({ status: true, message: "Subscribed successfully", data: null });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `Something went wrong ${err}`,
      data: null,
    });
  }
};

module.exports = { subscribeToNewsLetter };
