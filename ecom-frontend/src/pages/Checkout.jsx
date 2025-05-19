import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useCheckout } from "../CheckoutContext";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const checkoutMethods = useCheckout();
  const [checkouts, setCheckouts] = useState([]);
  const [filteredDate, setFilteredDate] = useState("");
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
    const fetchCheckouts = async () => {
      const fetch = await checkoutMethods.getUserCheckouts();
      setCheckouts(fetch.checkouts);
    };
    fetchCheckouts();
  }, []);

  const uniqueDates = [
    ...new Set(checkouts.map((c) => moment(c.date).format("MMMM D, YYYY"))),
  ];

  const filteredCheckouts = filteredDate
    ? checkouts.filter(
        (c) => moment(c.date).format("MMMM D, YYYY") === filteredDate
      )
    : checkouts;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Your Checkouts</h1>
          <select
            className="border rounded p-2 text-blue-700 border-blue-300"
            onChange={(e) => setFilteredDate(e.target.value)}
            value={filteredDate}
          >
            <option value="">All Dates</option>
            {uniqueDates.map((date, idx) => (
              <option key={idx} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {filteredCheckouts.map((checkout) => (
          <div
            key={checkout.id}
            className="bg-blue-50 border border-blue-200 p-6 mb-6 rounded-xl shadow"
          >
            <h2 className="text-lg font-semibold text-blue-800 mb-4">
              Date: {moment(checkout.date).format("MMMM D, YYYY")} | Total
              Amount: ₱{checkout.total_amount}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {checkout.checkout_products.map((cp) => (
                <div
                  key={cp.id}
                  className="bg-white rounded-lg border shadow p-4"
                >
                  <img
                    src={cp.product.image_url}
                    alt={cp.product.name}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <h3 className="text-blue-700 font-bold text-lg">
                    {cp.product.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {cp.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: ₱{cp.quantity * cp.product.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredCheckouts.length === 0 && (
          <p className="text-center text-gray-500">
            No checkouts found for the selected date.
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
