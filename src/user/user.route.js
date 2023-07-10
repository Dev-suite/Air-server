const router = require("express").Router();
const { signUp, signIn } = require("./user.controller");


router.post('/sign-up', signUp);
router.post('/sign-in', signIn);

module.exports = router;