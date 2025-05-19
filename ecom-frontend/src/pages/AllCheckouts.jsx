import React, { useEffect, useState } from "react";
import StoreNavbar from "./StoreNavbar";
import { useCheckout } from "../CheckoutContext";

const AllCheckouts = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [filteredDate, setFilteredDate] = useState("");
  const checkoutMethods = useCheckout();

  useEffect(() => {
    const fetchCheckouts = async () => {
      const fetch = await checkoutMethods.getCheckouts();
      setCheckouts(fetch.checkouts);
    };
    fetchCheckouts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const uniqueDates = [...new Set(checkouts.map((c) => formatDate(c.date)))];

  const filteredCheckouts = filteredDate
    ? checkouts.filter((checkout) => formatDate(checkout.date) === filteredDate)
    : checkouts;

  return (
    <div className="min-h-screen bg-gray-100">
      <StoreNavbar />
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-theme mb-4">All Checkouts</h1>

        <div className="mb-4">
          <label className="mr-2 font-medium text-gray-700">
            Filter by date:
          </label>
          <select
            className="border rounded px-3 py-1"
            value={filteredDate}
            onChange={(e) => setFilteredDate(e.target.value)}
          >
            <option value="">All Dates</option>
            {uniqueDates.map((date, idx) => (
              <option key={idx} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {filteredCheckouts.map((checkout) => (
            <div
              key={checkout.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-theme">
                Checkout Date: {formatDate(checkout.date)}
              </h2>
              <p className="text-sm text-gray-600">
                Customer: {checkout.user?.name || "Unknown"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {checkout.checkout_products.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border p-2 rounded-md"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Total: ₱{item.quantity * item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 font-semibold text-right text-theme text-lg">
                Total Amount: ₱{checkout.total_amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCheckouts;
