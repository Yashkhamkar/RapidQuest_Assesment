const mongoose = require("mongoose");
const customersCollection = mongoose.connection.collection("shopifyCustomers");

const newCustomers = async (req, res) => {
  try {
    const interval = req.query.interval || "monthly";
    let groupBy;

    switch (interval) {
      case "weekly":
        groupBy = {
          $dateToString: {
            format: "%Y-%U", // %U gives the week number (00-53)
            date: { $dateFromString: { dateString: "$created_at" } },
          },
        };
        break;
      case "monthly":
        groupBy = {
          $dateToString: {
            format: "%Y-%m",
            date: { $dateFromString: { dateString: "$created_at" } },
          },
        };
        break;
      case "quarterly":
        groupBy = {
          $concat: [
            {
              $substr: [
                { $year: { $dateFromString: { dateString: "$created_at" } } },
                0,
                4,
              ],
            },
            "-Q",
            {
              $toString: {
                $ceil: {
                  $divide: [
                    {
                      $month: {
                        $dateFromString: { dateString: "$created_at" },
                      },
                    },
                    3,
                  ],
                },
              },
            },
          ],
        };
        break;
      case "yearly":
        groupBy = {
          $dateToString: {
            format: "%Y",
            date: { $dateFromString: { dateString: "$created_at" } },
          },
        };
        break;
      default:
        return res.status(400).json({ error: "Invalid interval specified." });
    }

    const newCustomersData = await customersCollection
      .aggregate([
        {
          $match: { created_at: { $exists: true, $ne: null } },
        },
        {
          $group: {
            _id: groupBy,
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    console.log("Aggregation result:", newCustomersData);
    res.json(newCustomersData);
  } catch (err) {
    console.error("Error during aggregation:", err);
    res.status(500).json({ error: err.message });
  }
};

const repeatCustomers = async (req, res) => {
  try {
    const sampleDoc = await customersCollection.findOne();
    if (!sampleDoc) {
      console.log("No data found in the collection.");
      return res.status(404).json({ error: "No data found." });
    }

    const repeatCustomers = await customersCollection
      .aggregate([
        {
          $match: {
            orders_count: { $gt: 1 },
          },
        },
        {
          $project: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            email: 1,
            orders_count: 1,
            total_spent: 1,
          },
        },
        { $sort: { orders_count: -1 } },
      ])
      .toArray();

    console.log("Aggregation result:", repeatCustomers);
    res.json(repeatCustomers);
  } catch (err) {
    console.error("Error during aggregation:", err);
    res.status(500).json({ error: err.message });
  }
};

const geographicalDistribution = async (req, res) => {
  try {
    const distribution = await customersCollection
      .aggregate([
        {
          $match: {
            "default_address.city": { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: "$default_address.city", // Group by city
            customerCount: { $sum: 1 }, // Count the number of customers in each city
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field
            location: "$_id", // Rename _id to location
            customerCount: 1, // Include customerCount in the output
          },
        },
        { $sort: { customerCount: -1 } }, // Sort by customerCount in descending order
      ])
      .toArray();

    console.log("Geographical distribution result:", distribution);
    res.json(distribution);
  } catch (err) {
    console.error("Error during aggregation:", err);
    res.status(500).json({ error: err.message });
  }
};

const customerLifetimeValueByCohorts = async (req, res) => {
  try {
    const cohorts = await customersCollection
      .aggregate([
        {
          $addFields: {
            firstPurchaseDate: {
              $dateFromString: { dateString: "$created_at" },
            },
          },
        },
        {
          $group: {
            _id: {
              cohort: {
                $dateToString: {
                  format: "%Y-%m",
                  date: "$firstPurchaseDate",
                },
              },
            },
            totalLifetimeValue: {
              $sum: { $toDouble: "$total_spent" },
            },
            customerCount: { $sum: 1 },
          },
        },
        {
          $project: {
            cohort: "$_id.cohort",
            totalLifetimeValue: 1,
            customerCount: 1,
            avgLifetimeValue: {
              $divide: ["$totalLifetimeValue", "$customerCount"],
            },
          },
        },
        { $sort: { cohort: 1 } },
      ])
      .toArray();

    console.log("Customer Lifetime Value by Cohorts result:", cohorts);
    res.json(cohorts);
  } catch (err) {
    console.error("Error during aggregation:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  newCustomers,
  repeatCustomers,
  geographicalDistribution,
  customerLifetimeValueByCohorts,
};
