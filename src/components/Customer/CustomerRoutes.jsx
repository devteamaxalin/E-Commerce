import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "./CustomerDashboard";

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
    </Routes>
  );
}