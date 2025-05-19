// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../ProductContext";
import Navbar from "./Navbar";
import { useCart } from "../CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const redirect = useNavigate();
  const productMethods = useProduct();
  const cartMethods = useCart();

  useEffect(() => {
    if (
      !sessionStorage.getItem("token") ||
      JSON.parse(sessionStorage.getItem("user")).role !== "customer"
    ) {
      redirect("/");
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productMethods.getAProduct(id);
        setProduct(response.product);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setError("");
    if (quantity < 1 || quantity > product.stock) {
      return setError("Quantity must be between 1 and available stock.");
    }
    try {
      const add = await cartMethods.createCart({
        product_id: product.id,
        quantity,
      });
      if (add) {
        alert(add.message);
        redirect("/store");
      }
    } catch (err) {
      console.error("Add to cart failed", err);
      setError("Failed to add to cart.");
    }
  };

  if (!product) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="bg-blue-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
        {/* Left Side - Product Details */}
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-bold text-blue-800">{product.name}</h1>
          <p className="text-gray-700 text-lg">{product.description}</p>
          <p className="text-blue-600 text-2xl font-semibold">
            ₱{product.price}
          </p>
          <p className="text-gray-600">Stock available: {product.stock}</p>

          <div className="mt-4">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            onClick={handleAddToCart}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>

        {/* Right Side - Product Image */}
        <div className="flex-1">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
