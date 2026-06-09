import { Routes, Route } from "react-router-dom";
import Storefront from "./Storefront";
import Login from "./Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}