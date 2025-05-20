// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../CartContext";
import Navbar from "./Navbar";
import { useCheckout } from "../CheckoutContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [carts, setCarts] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const cartMethods = useCart();
  const checkoutMethods = useCheckout();
  const redirect = useNavigate();

  useEffect(() => {
    if (
      !sessionStorage.getItem("token") ||
      JSON.parse(sessionStorage.getItem("user")).role !== "customer"
    ) {
      redirect("/");
    }
  }, []);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const res = await cartMethods.getCart();
        const data = res.carts;
        console.log(res.carts);
        setCarts(data);
        const initialSelection = {};
        data.forEach((item) => (initialSelection[item.id] = true));
        setSelectedItems(initialSelection);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    };
    fetchCarts();
  }, []);

  const handleQuantityChange = async (id, delta) => {
    const cartItem = carts.find((item) => item.id === id);
    const newQty = cartItem.quantity + delta;
    if (newQty < 1) return;
    if (newQty > cartItem.product.stock) {
      alert("Not enough stock");
      return;
    }
    try {
      await cartMethods.updateCart(id, { _method: "PUT", quantity: newQty });
      setCarts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await cartMethods.deleteCart(id);
      setCarts((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getTotal = () => {
    return carts.reduce((acc, item) => {
      if (selectedItems[item.id]) {
        return acc + item.product.price * item.quantity;
      }
      return acc;
    }, 0);
  };

  const handleCheckout = async () => {
    const selectedProducts = carts
      .filter((item) => selectedItems[item.id])
      .map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));
    if (selectedProducts.length === 0) {
      alert("Select item/s to checkout");
      return;
    }

    try {
      await checkoutMethods.createCheckout({
        date: new Date().toISOString().split("T")[0],
        total_amount: getTotal(),
        products: selectedProducts,
      });
      alert("Checkout successful!");
      redirect("/store");
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed. Please try again.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="bg-blue-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Your Cart</h2>
        <div className="space-y-6">
          {carts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md flex flex-col md:flex-row items-center p-4 gap-4"
            >
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-32 h-32 object-cover rounded-xl"
              />
              <div className="flex-1 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-blue-700">
                    {item.product.name}
                  </h3>
                  <input
                    type="checkbox"
                    checked={selectedItems[item.id] || false}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </div>
                <p className="text-gray-700 text-sm mb-2">
                  {item.product.description}
                </p>
                <p className="text-blue-600 font-semibold">
                  ₱{item.product.price}
                </p>
                <p className="text-sm text-gray-500">
                  Stock left: {item.product.stock}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="px-3 py-1 rounded bg-blue-200 hover:bg-blue-300"
                  >
                    -
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="px-3 py-1 rounded bg-blue-200 hover:bg-blue-300"
                  >
                    +
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Total:{" "}
                  <span className="text-blue-700 font-bold">
                    ₱{item.product.price * item.quantity}
                  </span>
                </p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-2 text-sm text-white hover:underline bg-red-500 p-[.5rem] border rounded-xl hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <p className="text-xl font-semibold text-blue-800">
            Total to checkout: ₱{getTotal()}
          </p>
          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
