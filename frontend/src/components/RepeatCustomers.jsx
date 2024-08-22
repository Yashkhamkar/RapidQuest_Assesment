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

const RepeatCustomers = () => {
  const [repeatCustomerData, setRepeatCustomerData] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState("weekly");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRepeatCustomerData(selectedInterval);
  }, [selectedInterval]);

  const fetchRepeatCustomerData = async (interval) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/customers/repeat-customers?interval=${interval}`
      );
      const data = await response.json();

      setRepeatCustomerData(data);
      console.log("Repeat customers data fetched:", repeatCustomerData.length);
      setIsLoading(false);
      console.log("Repeat customers data fetched:", data);
    } catch (err) {
      console.error("Error fetching repeat customer data:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Process data for chart
  const labels = repeatCustomerData.map((item) => item._id);
  const data = repeatCustomerData.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Number of Repeat Customers",
        data,
        borderColor: "rgba(54, 162, 235, 1)", // Use the same color as NewCustomers
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
            return `${label}: ${value} repeat customers`;
          },
        },
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
      title: {
        display: true,
        text: "Number of Repeat Customers Over Time",
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
          text: "Number of Repeat Customers",
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
          Number of Repeat Customers Over Time
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
        {isLoading ? (
          <p className="text-center text-gray-500">Loading data...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : repeatCustomerData.length === 0 ? (
          <p className="text-center text-gray-500">No data to display</p>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <Line data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RepeatCustomers;
