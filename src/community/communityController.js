const Community = require("./communityModel");

exports.subscribe = async (req, res) => {
  try {
    await Community.create({ phone: req.body.phone });
    res.status(201).json({
      status: "success",
      message: "You have successfully subscribed.",
    });
  } catch (e) {
    res.status(500).json({ status: "fail", message: `An Error occur: ${e}` });
  }
};
