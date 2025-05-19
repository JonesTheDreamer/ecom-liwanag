import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StoreNavbar from "./StoreNavbar";
import { useCheckout } from "../CheckoutContext";

export default function EmployeeBoard() {
  const redirect = useNavigate();
  const checkoutMethods = useCheckout();
  const [checkouts, setCheckouts] = useState([]);
  const [stats, setStats] = useState({
    totalSold: 0,
    totalRevenue: 0,
    bestSelling: null,
  });

  const processStatistics = (data) => {
    let totalSold = 0;
    let totalRevenue = 0;
    const productSales = {};

    data.forEach((checkout) => {
      totalRevenue += checkout.total_amount;
      checkout.checkout_products.forEach((cp) => {
        totalSold += cp.quantity;

        const productId = cp.product.id;
        if (!productSales[productId]) {
          productSales[productId] = {
            ...cp.product,
            quantity: 0,
          };
        }

        productSales[productId].quantity += cp.quantity;
      });
    });

    const bestSelling = Object.values(productSales).sort(
      (a, b) => b.quantity - a.quantity
    )[0];

    setStats({ totalSold, totalRevenue, bestSelling });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (
      !sessionStorage.getItem("token") ||
      JSON.parse(sessionStorage.getItem("user")).role !== "employee"
    ) {
      redirect("/");
    }
  }, []);

  useEffect(() => {
    const fetchCheckouts = async () => {
      const fetch = await checkoutMethods.getCheckouts();
      setCheckouts(fetch.checkouts);
      processStatistics(fetch.checkouts);
    };
    fetchCheckouts();
  }, []);
  return (
    <>
      <StoreNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Employee Dashboard
        </h1>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-lg text-gray-600">Total Products Sold</h2>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalSold}
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h2 className="text-lg text-gray-600">Total Revenue</h2>
            <p className="text-3xl font-bold text-blue-600">
              ₱{stats.totalRevenue}
            </p>
          </div>
          {stats.bestSelling && (
            <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center">
              <img
                src={stats.bestSelling.image_url}
                alt={stats.bestSelling.name}
                className="w-32 h-32 object-cover rounded-lg mb-2"
              />
              <h2 className="text-lg font-semibold text-blue-600">
                Best Seller
              </h2>
              <p className="text-gray-700">{stats.bestSelling.name}</p>
              <p className="text-sm text-gray-500">
                Sold: {stats.bestSelling.quantity}
              </p>
            </div>
          )}
        </div>

        {/* Recent Checkouts */}
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Recent Checkouts
        </h2>
        <div className="space-y-4">
          {checkouts.slice(-3).map((checkout) => (
            <div
              key={checkout.id}
              className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center"
            >
              <div>
                <p className="text-gray-700 font-semibold">
                  Checkout ID: {checkout.id}
                </p>
                <p className="text-gray-600">
                  Total:{" "}
                  <span className="text-blue-600 font-bold">
                    ₱{checkout.total_amount}
                  </span>
                </p>
                <p className="text-gray-600">User ID: {checkout.user_id}</p>
                <p className="text-gray-600">Name: {checkout.user.name}</p>
                <p className="text-sm text-gray-500">
                  Date: {formatDate(checkout.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
