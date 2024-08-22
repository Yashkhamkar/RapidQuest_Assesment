const mongoose = require("mongoose");
const ordersCollection = mongoose.connection.collection("shopifyOrders");

const totalSales = async (req, res) => {
  try {
    const interval = req.query.interval || "weekly"; // Default to weekly
    let groupBy;

    switch (interval) {
      case "weekly":
        groupBy = {
          $dateToString: {
            format: "%Y-%U", // %U for week of the year
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
            }, // Year
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

    const salesData = await ordersCollection
      .aggregate([
        {
          $group: {
            _id: groupBy,
            totalSales: {
              $sum: { $toDouble: "$total_price_set.shop_money.amount" },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    res.json(salesData);
  } catch (err) {
    console.error("Error during aggregation:", err);
    res.status(500).json({ error: err.message });
  }
};

const salesGrowthRate = async (req, res) => {
  try {
    const interval = req.query.interval || "weekly"; // Default to weekly
    let groupBy;

    switch (interval) {
      case "weekly":
        groupBy = {
          $dateToString: {
            format: "%Y-%U", // %U for week of the year
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

    const salesData = await ordersCollection
      .aggregate([
        {
          $group: {
            _id: groupBy,
            totalSales: {
              $sum: { $toDouble: "$total_price_set.shop_money.amount" },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    if (salesData.length < 2) {
      return res.status(200).json({
        message: "Not enough data to calculate growth rate.",
        data: [],
      });
    }

    const growthRateData = salesData.map((current, index, array) => {
      if (index === 0) return null;

      const previous = array[index - 1];
      const growthRate =
        ((current.totalSales - previous.totalSales) / previous.totalSales) *
        100;

      return {
        interval: current._id,
        growthRate: growthRate.toFixed(2) + "%",
        totalSales: current.totalSales,
      };
    });

    res.json(growthRateData.filter((data) => data !== null));
  } catch (err) {
    console.error("Error during aggregation:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { totalSales, salesGrowthRate };
