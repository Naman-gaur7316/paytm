import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Errorbox from "../Errorbox";

const FORMDATA = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
}

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState([]);
  useEffect(() => {
      const token = localStorage.getItem("token") || null;
      if(token) {
        navigate("/dashboard");
      }
    }, [])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleFormSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/v1/user/signup", formData);
      setFormData(FORMDATA);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard")
    } catch (error) {
      // console.log(error)
      if (error.response) {
        setSignupError(error.response.data.errors)
      } else {
        setSignupError(["Something went wrong :("])
      }
      setFormData(FORMDATA);
    }
  };

  console.log(signupError)
  return (
    <div className="bg-black/30 w-full h-screen flex justify-center items-center">
      <div className="bg-white p-5 rounded-md">
        <div className="text-center p-3">
          <h2 className="font-bold text-3xl mb-2">Sign Up</h2>
          <p className="text-gray-600">
            Enter your information to create an account
          </p>
        </div>
        <Errorbox errors={signupError}/>
        <form className="flex flex-col gap-4 my-3" onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="first-name" className="font-semibold">
              First Name
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={handleDataChange}
              className="p-2 border border-gray-300 rounded-md ring:gray-400"
              name="firstName"
              id="first-name"
              placeholder="eg. John"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="last-name" className="font-semibold">
              Last Name
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={handleDataChange}
              className="p-2 border border-gray-300 rounded-md"
              name="lastName"
              id="last-name"
              placeholder="eg. Doe"
            />
          </div>
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
            Sign Up
          </button>
        </form>
        <p className="text-center">
          Aleardy have an account?{" "}
          <Link to="/signin" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
