import React, { createContext, useContext } from "react";
import axios from "./axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const getProducts = async () => {
    const res = await axios.get("product");
    return res.data;
  };

  const getAProduct = async (id) => {
    const res = await axios.get(`product/${id}`);
    return res.data;
  };

  const createProduct = async (formData) => {
    const res = await axios.post("product", formData);
    return res;
  };

  const updateProduct = async (id, formData) => {
    const res = await axios.post(`product/${id}`, formData);
    return res;
  };

  const deleteProduct = async (id) => {
    const res = await axios.delete(`product/${id}`);
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
