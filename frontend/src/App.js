import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./components/Homepage";
import TotalSalesChart from "./components/TotalSalesChart";
import CLVCohortsChart from "./components/CLVCohortsChart";
import GeoDist from "./components/GeoDist";
import SalesGrowth from "./components/SalesGrowth";
import NewCustomers from "./components/NewCstomers";
import RepeatCustomers from "./components/RepeatCustomers";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/sales" element={<TotalSalesChart />} />
          <Route path="/sales-growth" element={<SalesGrowth />} />
          <Route path="/cohort" element={<CLVCohortsChart />} />
          <Route path="/new-customers" element={<NewCustomers />} />
          <Route path="/repeat-customers" element={<RepeatCustomers />} />
          <Route path="/geo" element={<GeoDist />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
