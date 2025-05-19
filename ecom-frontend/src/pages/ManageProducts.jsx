import React, { useEffect, useState } from "react";
import { useProduct } from "../ProductContext";
import { useCheckout } from "../CheckoutContext";
import { useNavigate } from "react-router-dom";
import StoreNavbar from "./StoreNavbar";

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const redirect = useNavigate();
  const productMethods = useProduct();
  const checkoutMethods = useCheckout();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productMethods.getProducts();
        setProducts(response.products);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();

    const fetchCheckouts = async () => {
      try {
        const fetch = await checkoutMethods.getCheckouts();
        setCheckouts(fetch.checkouts);
      } catch (error) {
        console.error("Error fetching checkouts:", err);
      }
    };
    fetchCheckouts();
  }, []);

  const computeStats = (productId) => {
    let soldQuantity = 0;
    let soldAmount = 0;
    checkouts.forEach((checkout) => {
      checkout.checkout_products.forEach((cp) => {
        if (cp.product.id === productId) {
          soldQuantity += cp.quantity;
          soldAmount += cp.quantity * cp.product.price;
        }
      });
    });
    return { soldQuantity, soldAmount };
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <StoreNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-600">Manage Products</h1>
          <button
            className="border bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-xl cursor-pointer"
            onClick={() => redirect("/addProduct")}
          >
            Add Product
          </button>
        </div>

        <input
          type="text"
          placeholder="Search product by name"
          className="w-full p-2 mb-6 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const { soldQuantity, soldAmount } = computeStats(product.id);

            return (
              <div
                key={product.id}
                onClick={() => redirect(`/manageProducts/${product.id}`)}
                className="bg-white shadow-md rounded-lg p-4 cursor-pointer transform transition-transform duration-200 hover:scale-105"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold text-blue-600 mb-1">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  {product.description}
                </p>
                <p className="text-gray-800 font-semibold">₱{product.price}</p>
                <p className="text-gray-500 text-sm">
                  Stock left: {product.stock}
                </p>
                <p className="text-gray-500 text-sm">Sold: {soldQuantity}</p>
                <p className="text-gray-500 text-sm">Revenue: ₱{soldAmount}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProductView;
