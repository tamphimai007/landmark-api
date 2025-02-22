const express = require("express");
const router = express.Router();
// controllers
const { createBooking, checkout } = require("../controllers/booking");
const { authCheck } = require("../middlewares/auth");

// @ENDPOINT http://localhost:5000/api/booking
router.post("/booking", authCheck, createBooking);


// @ Payment
// @ENDPOINT http://localhost:5000/api/checkout
router.post("/checkout", authCheck, checkout);

module.exports = router;
