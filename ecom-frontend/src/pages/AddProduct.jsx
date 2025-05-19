import React, { useState } from "react";
import { useProduct } from "../ProductContext";
import StoreNavbar from "./StoreNavbar";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const productMethods = useProduct();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const validateInputs = () => {
    const { name, description, price, stock } = product;
    if (!name.trim() || !description.trim())
      return "Name and Description cannot be empty or whitespace only.";
    if (isNaN(price) || price <= 0)
      return "Price must be a valid number greater than 0.";
    if (isNaN(stock) || stock <= 0)
      return "Stock must be a valid number greater than 0.";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateInputs();
    if (error) {
      setMessage(error);
      setMessageType("error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", Number.parseFloat(product.price));
      formData.append("stock", Number.parseInt(product.stock));
      if (image) formData.append("image", image);

      for (const [key, value] of formData) {
        // Check the type of the value
        console.log(typeof value);

        if (value instanceof File) {
          // If the value is a File, log the filename
          console.log(`${key}: File - ${value.name}`);
        } else {
          // Otherwise, log the key and the value
          console.log(`${key}: ${value}`);
        }
      }

      console.log(typeof formData);

      const res = await productMethods.createProduct(formData);

      if (res.status === 201) {
        setMessage("Product added successfully!");
        setMessageType("success");
        setProduct({ name: "", description: "", price: "", stock: "" });
        setImage(null);
      } else {
        setMessage("Failed to add product.");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Failed to add product.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreNavbar />
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left - Form */}
          <div className="md:w-2/3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 mt-4 rounded"
            >
              Add Product
            </button>
          </div>

          {/* Right - Image Preview */}
          <div className="md:w-1/3 flex flex-col items-center">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Product Preview"
                className="w-full object-cover rounded-md border border-gray-300 mb-4"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-500 mb-4">
                Upload Image
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
