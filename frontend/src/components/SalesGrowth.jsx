import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register required components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale
);

const SalesGrowth = () => {
  const [salesData, setSalesData] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState("weekly");

  useEffect(() => {
    fetchSalesData(selectedInterval);
  }, [selectedInterval]);

  const fetchSalesData = async (interval) => {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/sales-growth?interval=${interval}`
      );
      const data = await response.json();

      // Convert growthRate to numeric values
      const processedData = data.map((item) => ({
        interval: item.interval,
        growthRate: parseFloat(item.growthRate.replace("%", "")), // Remove '%' and convert to number
      }));

      setSalesData(processedData);
      console.log("Sales data fetched:", processedData);
    } catch (err) {
      console.error("Error fetching sales data:", err);
    }
  };

  // Process data for chart
  const labels = salesData.map((item) => item.interval);
  const data = salesData.map((item) => item.growthRate);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Sales Growth Rate Over Time",
        data,
        borderColor: "rgba(54, 162, 235, 1)", 
        backgroundColor: "rgba(54, 162, 235, 0.2)", 
        borderWidth: 2,
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(54, 162, 235, 1)",
        },
      },
      tooltip: {
        backgroundColor: "rgba(54, 162, 235, 0.8)", 
        titleColor: "#fff",
        bodyColor: "#fff",
      },

    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "rgba(54, 162, 235, 1)", 
        },
        ticks: {
          color: "rgba(54, 162, 235, 0.7)", 
        },
      },
      y: {
        title: {
          display: true,
          text: "Growth Rate (%)",
          color: "rgba(54, 162, 235, 1)",
        },
        ticks: {
          color: "rgba(54, 162, 235, 0.7)",
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Sales Growth Rate Over Time
        </h1>
        <div className="flex justify-center mb-4">
          <select
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value)}
            className="p-2 border rounded-md shadow-md"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-inner">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default SalesGrowth;
