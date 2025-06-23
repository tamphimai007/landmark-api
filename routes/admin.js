const express = require("express");
const router = express.Router();
// controllers
const {
  listStats,
  listReservations,
  listAllReservations,
  listMyCampings,
} = require("../controllers/admin.js");
const { authCheck } = require("../middlewares/auth");

// @ENDPOINT http://localhost:5000/api/stats
router.get("/stats", authCheck, listStats);
router.get("/reservations", authCheck, listReservations);
router.get("/all-reservations", authCheck, listAllReservations);
router.get("/my-campings", authCheck, listMyCampings);

module.exports = router;
