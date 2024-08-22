import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register required components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const GeoDist = () => {
  const [geoData, setGeoData] = useState([]);

  useEffect(() => {
    fetchGeoData();
  }, []);

  const fetchGeoData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/customers/geo-distribution"
      );
      const data = await response.json();
      setGeoData(data);
      console.log("Geo data fetched:", data);
    } catch (err) {
      console.error("Error fetching geo data:", err);
    }
  };

  const labels = geoData.map((item) => item.location);
  const data = geoData.map((item) => item.customerCount);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Geographical Distribution of Customers",
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} customers`;
          },
        },
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-6">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg border border-gray-300">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 text-center">
            Geographical Distribution of Customers
          </h1>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-inner">
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default GeoDist;
