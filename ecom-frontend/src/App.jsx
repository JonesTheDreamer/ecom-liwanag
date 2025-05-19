import { useState } from "react";
import { ProductProvider } from "./ProductContext";
import { CartProvider } from "./CartContext";
import { CheckoutProvider } from "./CheckoutContext";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/login";
import { UserProvider } from "./UserContext";
import EmployeeBoard from "./pages/EmployeeBoard";
import Store from "./pages/Store";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import ManageProducts from "./pages/ManageProducts";
import AllCheckouts from "./pages/AllCheckouts";
import EditProduct from "./pages/EditProduct";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <CheckoutProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/employeeboard" element={<EmployeeBoard />} />
                <Route path="/store" element={<Store />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/manageProducts" element={<ManageProducts />} />
                <Route path="/manageProducts/:id" element={<EditProduct />} />
                <Route path="/addProduct" element={<AddProduct />} />
                <Route path="/allCheckouts" element={<AllCheckouts />} />
              </Routes>
            </BrowserRouter>
          </CheckoutProvider>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;
