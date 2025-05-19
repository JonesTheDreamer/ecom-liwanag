import Navbar from "./Navbar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../ProductContext";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const redirect = useNavigate();
  const productMethods = useProduct();

  useEffect(() => {
    if (
      !sessionStorage.getItem("token") ||
      JSON.parse(sessionStorage.getItem("user")).role !== "customer"
    ) {
      redirect("/");
    } else {
      //   console.log(JSON.parse(sessionStorage.getItem("user")));

      const fetchProducts = async () => {
        try {
          const response = await productMethods.getProducts();
          setProducts(response.products);
          setFiltered(response.products);
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      };
      fetchProducts();
    }
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    const result = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, products]);

  return (
    <div className="bg-blue-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 border border-blue-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              onClick={() => redirect(`/product/${product.id}`)}
              className="bg-white rounded-2xl shadow-md p-4 cursor-pointer transform transition duration-300 hover:scale-105"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-bold text-blue-700">
                {product.name}
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                {product.description}
              </p>
              <p className="text-blue-600 font-semibold text-end">
                ₱{product.price}
              </p>
              <p className="text-sm text-gray-500 text-end">
                Stock left: {product.stock}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
