const express = require("express");
const router = express.Router();
// controllers
const { createBooking } = require("../controllers/booking");
const { authCheck } = require("../middlewares/auth");

// @ENDPOINT http://localhost:5000/api/booking
router.post("/booking",authCheck, createBooking);

module.exports = router;
