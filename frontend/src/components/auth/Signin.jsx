import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Errorbox from "../Errorbox";

const FORMDATA = {
  username: "",
  password: "",
};

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token") || null;
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        formData
      );
      setFormData(FORMDATA);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      // console.log(error)
      if (error.response) {
        setSignupError(error.response.data.errors);
      } else {
        setSignupError(["Something went wrong :("]);
      }
      setFormData(FORMDATA);
    }
  };
  return (
    <div className="bg-black/30 w-full h-screen flex justify-center items-center">
      <div className="bg-white p-5 rounded-md">
        <div className="text-center p-3">
          <h2 className="font-bold text-3xl mb-2">Sign In</h2>
          <p className="text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>
        <Errorbox errors={signupError} />
        <form className="flex flex-col gap-4 my-3" onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-semibold">
              Email / Username
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={handleDataChange}
              className="p-2 border border-gray-300 rounded-md"
              name="username"
              id="username"
              placeholder="eg. Johndoe@abc.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleDataChange}
                className="p-2 border border-gray-300 rounded-md w-full"
                name="password"
                id="password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-black px-5 py-2 text-white rounded-md"
          >
            Sign In
          </button>
        </form>
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
