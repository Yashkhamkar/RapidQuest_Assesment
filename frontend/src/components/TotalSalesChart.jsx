import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  PointElement,
  LinearScale,
} from "chart.js";

// Register required components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  PointElement, // Register PointElement
  LinearScale
);

const TotalSalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [interval, setInterval] = useState("weekly"); // Default interval
  const chartRef = useRef(null);

  useEffect(() => {
    fetchSalesData();
  }, [interval]); // Fetch data when interval changes

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chartInstance?.destroy(); // Destroy previous chart instance if it exists
    }
  }, [salesData]); // Destroy chart when salesData changes

  const fetchSalesData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/total-sales?interval=${interval}`
      );
      const data = await response.json();
      setSalesData(data);
      console.log("Sales data fetched:", data);
    } catch (err) {
      console.error("Error fetching sales data:", err);
    }
  };

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  const labels = salesData.map((item) => item._id);
  const data = salesData.map((item) => item.totalSales);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Sales Over Time",
        data,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)", 
        fill: true,
      },
    ],
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-4xl w-full p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Total Sales Over Time
        </h1>
        <div className="mb-6 flex justify-center">
          <select
            onChange={handleIntervalChange}
            value={interval}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-inner">
          <Line data={chartData} ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default TotalSalesChart;
