import React, { createContext, useContext } from "react";
import axios from "./axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const login = async (user) => {
    const res = await axios.post("user/login", user);
    return res.data;
  };

  const logout = async () => {
    const res = await axios.post(`user/logout`);
    return res.data;
  };

  const register = async (user) => {
    const res = await axios.post("user", user);
    return res.data;
  };

  return (
    <UserContext.Provider
      value={{
        login,
        logout,
        register,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
