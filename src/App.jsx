import { BrowserRouter } from "react-router-dom";
import CustomerRoutes from "./components/Customer/CustomerRoutes";

function App() {
  return (
    <BrowserRouter>
      <CustomerRoutes />
    </BrowserRouter>
  );
}

export default App;