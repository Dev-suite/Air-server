const router = require("express").Router();

const communityController = require("./communityController");

router.post("/subscribe", communityController.subscribe);

module.exports = router;
