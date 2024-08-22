const express = require("express");
const {
  totalSales,
  salesGrowthRate,
} = require("../controller/orderController");
const router = express.Router();

router.route("/total-sales").get(totalSales);
router.route("/sales-growth").get(salesGrowthRate);

module.exports = router;
