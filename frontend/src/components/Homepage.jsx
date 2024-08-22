import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation

const Homepage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Data Visualization
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <Link
          to="/new-customers"
          className="block p-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <h2 className="text-2xl font-semibold mb-2">New Customers</h2>
          <p>View data on new customers added over time.</p>
        </Link>

        <Link
          to="/repeat-customers"
          className="block p-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          <h2 className="text-2xl font-semibold mb-2">Repeat Customers</h2>
          <p>Analyze the number of repeat customers over time.</p>
        </Link>

        <Link
          to="/sales"
          className="block p-6 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition"
        >
          <h2 className="text-2xl font-semibold mb-2">Total Sales</h2>
          <p>Visualize the total sales data.</p>
        </Link>

        <Link
          to="/sales-growth"
          className="block p-6 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
        >
          <h2 className="text-2xl font-semibold mb-2">Sales Growth</h2>
          <p>Track the growth rate of sales over time.</p>
        </Link>

        <Link
          to="/geo"
          className="block p-6 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
        >
          <h2 className="text-2xl font-semibold mb-2">
            Geographical Distribution
          </h2>
          <p>Analyze the geographical distribution of customers.</p>
        </Link>

        <Link
          to="/cohort"
          className="block p-6 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition"
        >
          <h2 className="text-2xl font-semibold mb-2">
            Customer Lifetime Value
          </h2>
          <p>View customer lifetime value by cohorts.</p>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
