const router = require("express").Router();

const { subscribeToNewsLetter } = require("./subscribers_controller");

router.post("/", subscribeToNewsLetter);

module.exports = router;
