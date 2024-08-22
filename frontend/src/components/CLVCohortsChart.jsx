import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useNavigate } from "react-router-dom";

// Register required components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const CLVCohortsChart = () => {
  const [cohortsData, setCohortsData] = useState([]);
  const chartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCohortsData();
  }, []);

  const fetchCohortsData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/customers/clv-cohorts"
      );
      const data = await response.json();
      setCohortsData(data);
      console.log("Cohorts data fetched:", data);
    } catch (err) {
      console.error("Error fetching cohorts data:", err);
    }
  };

  const labels = cohortsData.map((item) => item.cohort);
  const data = cohortsData.map((item) => item.totalLifetimeValue);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Customer Lifetime Value by Cohorts",
        data,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Customer Lifetime Value by Cohorts
          </h1>
          {cohortsData.length === 0 ? (
            <p className="text-center text-gray-600">No data to display</p>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-inner">
              <Bar
                data={chartData}
                ref={chartRef}
                options={{ responsive: true }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CLVCohortsChart;
