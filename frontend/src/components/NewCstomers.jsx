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

const NewCustomers = () => {
  const [newCustomersData, setNewCustomersData] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState("monthly");

  useEffect(() => {
    fetchNewCustomersData(selectedInterval);
  }, [selectedInterval]);

  const fetchNewCustomersData = async (interval) => {
    try {
      const response = await fetch(
        `http://localhost:5000/customers/new-customers?interval=${interval}`
      );
      const data = await response.json();

      setNewCustomersData(data);
      console.log("New customers data fetched:", data);
    } catch (err) {
      console.error("Error fetching new customers data:", err);
    }
  };

  // Process data for chart
  const labels = newCustomersData.map((item) => item._id);
  const data = newCustomersData.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "New Customers Added Over Time",
        data,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.1, // Smooth lines
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
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} new customers`;
          },
        },
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
      title: {
        display: true,
        text: "New Customers Added Over Time",
        padding: {
          top: 10,
          bottom: 20,
        },
        font: {
          size: 18,
          weight: "bold",
        },
        color: "rgba(54, 162, 235, 1)",
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
          autoSkip: true,
          maxTicksLimit: 10, // Limit number of x-axis labels
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of New Customers",
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
          New Customers Added Over Time
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

export default NewCustomers;
