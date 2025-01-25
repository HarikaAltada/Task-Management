import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { LockClosedIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/send-otp", {
        email,
      });
      toast.success(response.data.message);
      localStorage.setItem("otp", "123456");
      navigate("/code-verfication");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to send OTP. Please try again.");
    }
  };
 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg relative">
      <div className="flex justify-center">
        {" "}
        <div className="flex items-center justify-center w-16 h-16 bg-[#C4D0EB] rounded-full">
          <LockClosedIcon className="w-12 h-12 text-[#334977]" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-900">
        Forgot your password?
      </h2>
      <p className="text-sm text-center text-gray-600">
        Enter your email to reset it!
      </p>
      <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
        <div>
          <label htmlFor="email" className="sr-only">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[ #202D48] focus:border-[#202D48]"
            placeholder="Enter your email"
          />
        </div>
        <div>
        
            <button
              type="submit"
             
              className="w-full px-4 py-2 text-sm font-medium text-white  bg-[#202D48] border border-transparent rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#202D48]"
            >
              Confirm
            </button>
          
        </div>
        <div className="text-sm text-center">
          <a href="/" className="font-medium text-black">
            <span className="text-[#334977] hover:text-[#202D48]">
              ← Return to the login screen
            </span>
          </a>
        </div>
      </form>
    </div>
  </div>
  );
};

export default ForgotPassword;
