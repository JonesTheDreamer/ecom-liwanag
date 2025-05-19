import React, { createContext, useContext } from "react";
import axios from "./axios";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const getCheckouts = async () => {
    const res = await axios.get("checkout");
    return res.data;
  };

  const getUserCheckouts = async () => {
    const res = await axios.get(`checkout/byUser`);
    return res.data;
  };

  const createCheckout = async (checkoutData) => {
    const res = await axios.post("checkout", checkoutData);
    return res.data;
  };

  return (
    <CheckoutContext.Provider
      value={{
        getCheckouts,
        getUserCheckouts,
        createCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
