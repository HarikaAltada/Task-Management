import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
export default function CodeVerification({ email }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Store OTP in localStorage when OTP is sent
    const sendOtp = async () => {
      try {
        const response = await axios.post("http://localhost:5000/send-otp", { email });
        // Store OTP in localStorage
        localStorage.setItem("otp", response.data.otp);
      } catch (error) {
        console.log("Failed to send OTP.");
      }
    };

    sendOtp();
  }, [email]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Retrieve OTP from localStorage
    const storedOtp = localStorage.getItem("otp");

    if (otp === storedOtp) {
      // OTP matches, navigate to reset password page
      toast.success("OTP verified successfully");
      setLoading(false);
      navigate("/Dashboard");
    } else {
      toast.error("Invalid OTP or OTP expired.");
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-10 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C4D0EB]">
            <FontAwesomeIcon icon={faEnvelope} className="text-[#334977] h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Enter your code</h2>
         
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleVerifyOTP}>
        <input
        type="text"
        value={otp}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#202D48] focus:border-[#202D48]"
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">
              Didn’t receive the email?{" "}
              <button
                type="button"
                className="font-medium text-[#334977] hover:text-[#202D48]"
                
              >
                Click to resend
              </button>
            </p>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg  bg-[#202D48] px-4 py-3 text-white transition focus:outline-none focus:ring-2 focus:ring-[#202D48] focus:ring-offset-2"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
