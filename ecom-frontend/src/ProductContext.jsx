import React, { createContext, useContext } from "react";
import axiosInstance from "./axios";
import axios from "axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const getProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/product");
      return res.data;
    } catch (e) {
      console.log(e.message);
      alert("Something went wrong");
    }
  };

  const getAProduct = async (id) => {
    const res = await axiosInstance.get(`product/${id}`);
    return res.data;
  };

  const createProduct = async (formData) => {
    const res = await axiosInstance.post("product", formData);
    return res;
  };

  const updateProduct = async (id, formData) => {
    const res = await axiosInstance.post(`product/${id}`, formData);
    return res;
  };

  const deleteProduct = async (id) => {
    const res = await axiosInstance.delete(`product/${id}`);
    return res;
  };

  return (
    <ProductContext.Provider
      value={{
        getProducts,
        getAProduct,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
