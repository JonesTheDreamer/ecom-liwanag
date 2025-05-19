import React, { useEffect, useState } from "react";
import { useProduct } from "../ProductContext";
import { useParams, useNavigate } from "react-router-dom";
import StoreNavbar from "./StoreNavbar";

const EditProduct = () => {
  const { id } = useParams();
  const redirect = useNavigate();
  const productMethods = useProduct();
  const [product, setProduct] = useState();
  const [ready, setReady] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: null,
  });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productMethods.getAProduct(id);
        setFormData({
          name: res.product.name,
          description: res.product.description,
          price: res.product.price,
          stock: res.product.stock,
        });
        setProduct(res.product);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setReady(true);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      for (const key in formData) {
        console.log(key);
        console.log(formData[key]);
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      data.append("_method", "PUT");

      const res = await productMethods.updateProduct(id, data);
      if (res.status === 200) {
        console.log(res.data.product);

        alert("Product updated successfully.");
        redirect("/manageProducts");
      } else {
        setFeedback("Failed to update the product.");
      }
    } catch (error) {
      setFeedback("Failed to update the product.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await productMethods.deleteProduct(id);
      if (res.status === 200) {
        redirect("/manageProducts");
      } else if (res.status === 400) {
        setFeedback(
          "Cannot delete product. It has already been used in a checkout."
        );
      } else {
        setFeedback("Failed to delete the product.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setFeedback(
          "Cannot delete product. It has already been used in a checkout."
        );
      } else {
        setFeedback("Failed to delete the product.");
      }
    }
  };

  if (!ready) {
    return (
      <div className="grid w-full h-full place-items-center">Loading...</div>
    );
  }

  return (
    <>
      <StoreNavbar />
      <div className="flex flex-col items-center p-8 text-blue-800">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 flex gap-8">
          <div className="w-1/3 flex flex-col items-center">
            <img
              src={
                formData.image
                  ? URL.createObjectURL(formData.image)
                  : product.image_url
              }
              alt="Product"
              className="rounded-lg object-cover w-full h-64 mb-4"
            />
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          <div className="w-2/3">
            <div className="mb-4">
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>

            {feedback && (
              <p className="mt-4 text-sm text-red-600">{feedback}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
