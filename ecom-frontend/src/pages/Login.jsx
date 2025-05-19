// src/components/AuthForm.jsx
import React, { useState } from "react";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const userMethods = useUser();
  const redirect = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ name: "", email: "", password: "" });
    setError(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      let response;

      if (isLogin) {
        response = await userMethods.login(payload);
      } else {
        console.log(payload);

        response = await userMethods.register(payload);
      }

      if (response) {
        console.log(response.user);

        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("user", JSON.stringify(response.user));
        if (response.user.role === "employee") {
          redirect("/employeeboard");
        } else {
          redirect("/store");
        }
      }

      if (isLogin && !response) {
        alert("Invalid Credentials");
      }

      // redirect or fetch user data
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    console.log(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <p className="text-center font-bold text-blue-500 font-[Open_Sans]">
          The Apparel
        </p>
        <h2 className="text-2xl font-bold text-blue-600 text-center">
          {isLogin ? "Login to your account" : "Register a new account"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-blue-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-1 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-blue-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={toggleMode}
            className="text-blue-500 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
