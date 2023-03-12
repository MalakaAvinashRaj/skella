import "./App.css";
import Navbar from "./pages/navbar";
import Home from "./pages/homepage";
import Products from "./pages/products";
import Customers from "./pages/customers";
import { Route, Routes } from "react-router-dom";

export function App() {
  return (
    <>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
