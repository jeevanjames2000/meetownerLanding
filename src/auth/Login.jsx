import axios from "axios";
import React, { useState, useCallback } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setAuthData, setLoggedIn } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { toast } from "react-toastify";
const Login = ({ onClose }) => {
  const [mobile, setMobile] = useState("6302816551");
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState(null);
  console.log("loginData: ", loginData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const OTP_LENGTH = 4;
  const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);
  const checkUserExists = useCallback(async () => {
    try {
      const response = await axios.post(
        "https://api.meetowner.in/auth/loginnew",
        { mobile },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      setError("Failed to check user existence. Please try again.");
      return null;
    }
  }, [mobile]);

  const registerUser = useCallback(
    async (type) => {
      try {
        const response = await axios.post(
          "https://api.meetowner.in/auth/registernew",
          {
            name: "N/A",
            mobile,
            city: 4,
            userType: "user",
          },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.data.status === "success") {
          const userData = await checkUserExists();
          console.log("userData: ", userData);

          setLoginData(userData);
          if (type === 0) {
            sendOTP();
          } else {
            sendWhatsAppMessage();
          }
          return true;
        }
        return false;
      } catch (error) {
        setError("Registration failed. Please try again.");
        return false;
      }
    },
    [mobile, dispatch, onClose]
  );
  const sendWhatsAppMessage = async () => {
    setEnteredOtp("");
    try {
      const res = await axios.post(
        `${config.awsApiUrl}/auth/v1/sendGallaboxOTP`,
        {
          mobile,
        }
      );
      console.log("res.data: ", res);
      setOtp(parseInt(res.data.otp));
      setMessage(`WhatsApp OTP sent successfully to +91 ${mobile}`);
      setOtpSent(true);
      setError("");
    } catch (err) {
      console.log("err: ", err);
      setError("Failed to send OTP via WhatsApp. Please try again!");
      setMessage("");
    }
  };

  const sendOTP = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${config.awsApiUrl}/auth/v1/sendOtp?mobile=${mobile}`
      );
      if (response.data.status === "success") {
        console.log("response.data.otp: ", response.data.otp);
        setOtp(response.data.otp);
        setMessage(`OTP sent successfully to +91${mobile}`);
        setOtpSent(true);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setError("Error sending OTP. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [mobile]);
  const handleLogin = useCallback(
    async (type) => {
      if (!validateMobile(mobile)) {
        setError(
          "Please enter a valid 10-digit mobile number starting with 6-9."
        );
        return;
      }
      setIsLoading(true);
      const userData = await checkUserExists();
      if (userData && userData.status === "success") {
        setLoginData(userData);
        if (type === 1) {
          await sendWhatsAppMessage();
        } else {
          await sendOTP();
        }
      } else {
        await registerUser(type);
      }
      setIsLoading(false);
    },
    [mobile, checkUserExists, sendOTP, registerUser, navigate]
  );

  const verifyOTP = useCallback(() => {
    const trimmedEnteredOtp = enteredOtp.trim();
    if (
      trimmedEnteredOtp.length !== OTP_LENGTH ||
      trimmedEnteredOtp !== String(otp)
    ) {
      setError("Invalid OTP. Please try again.");
      return;
    }
    setIsLoading(true);
    try {
      if (loginData && loginData.status === "success") {
        const { user_details, accessToken } = loginData;
        localStorage.setItem(
          "user",
          JSON.stringify({
            mobile,
            userDetails: user_details,
            token: accessToken,
          })
        );
        dispatch(
          setAuthData({
            userDetails: user_details,
            accessToken: accessToken,
            loggedIn: true,
          })
        );
        dispatch(setLoggedIn(true));
        toast.success("Login successful!");
        setMessage("Login successful!");
        navigate("/");
        setError("");
        onClose();
      } else {
        toast.error("Something went wrong. Please try again.");
        setError("User data not found. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [enteredOtp, otp, mobile, dispatch, onClose, loginData]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-75 z-50">
      <div className="bg-[#1D3F8E] w-[320px] p-6 rounded-md shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl"
          disabled={isLoading}
        >
          ×
        </button>
        <h2 className="text-white text-center text-xl font-semibold mb-5">
          Login
        </h2>
        {message && (
          <p className="text-green-400 text-center mb-3">{message}</p>
        )}
        {error && <p className="text-red-400 text-center mb-3">{error}</p>}
        <input
          type="tel"
          placeholder="Enter Mobile Number"
          value={mobile}
          maxLength={10}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setMobile(value);
            setError("");
          }}
          className="w-full px-4 py-2 mb-1 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none"
          disabled={isLoading || otpSent}
        />
        {otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={enteredOtp}
            maxLength={OTP_LENGTH}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setEnteredOtp(value);
              setError("");
            }}
            className="w-full px-4 py-2 mb-1 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none"
            disabled={isLoading}
          />
        )}
        <p
          className="text-yellow-300 underline cursor-pointer text-left text-xs mb-2"
          onClick={() => {
            setOtpSent(false);
            setEnteredOtp("");
            setMobile("");
            setError("");
            setMessage("");
          }}
        >
          Change mobile number
        </p>

        <button
          onClick={otpSent ? verifyOTP : () => handleLogin(0)}
          className="w-full bg-[#FFD400] text-black font-semibold py-2 rounded-md hover:brightness-105 transition duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : otpSent ? "VERIFY OTP" : "SEND OTP"}
        </button>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-white text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          onClick={() => handleLogin(1)}
          className="w-full bg-green-500 text-white flex items-center justify-center py-2 rounded-md font-semibold hover:bg-green-600 transition duration-200 disabled:opacity-50"
          disabled={isLoading || otpSent}
        >
          <FaWhatsapp className="mr-2" />
          Login with WhatsApp
        </button>
      </div>
    </div>
  );
};
export default Login;
