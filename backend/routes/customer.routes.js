const express = require("express");
const {
  newCustomers,
  repeatCustomers,
  geographicalDistribution,
  customerLifetimeValueByCohorts,
} = require("../controller/customerController");
const router = express.Router();

router.route("/new-customers").get(newCustomers);
router.route("/repeat-customers").get(repeatCustomers);
router.route("/geo-distribution").get(geographicalDistribution);
router.route("/clv-cohorts").get(customerLifetimeValueByCohorts);
module.exports = router;
