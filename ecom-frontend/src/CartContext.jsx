import React, { createContext, useContext } from "react";
import axios from "./axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const getCart = async () => {
    const res = await axios.get("cart");
    return res.data;
  };

  const createCart = async (data) => {
    const res = await axios.post("cart", data);
    return res.data;
  };

  const updateCart = async (id, data) => {
    const res = await axios.post(`cart/${id}`, data);
    return res.data;
  };

  const deleteCart = async (id) => {
    const res = await axios.delete(`cart/${id}`);
    return res.data;
  };

  return (
    <CartContext.Provider
      value={{ getCart, createCart, updateCart, deleteCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
