import axios from "axios";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAuthData, setLoggedIn } from "../../store/slices/authSlice";
import config from "../../config";
import { toast } from "react-toastify";
import CountryCodeSelector from "../utilities/CountryCodeSelector";
import CryptoJS from "crypto-js";
const JWT_SECRET = "khsfskhfks983493123!@#JSFKORuiweo232";
const OTP_LENGTH = 4;
function decrypt(encryptedText) {
  try {
    const [ivHex, encryptedHex] = encryptedText.split(":");
    if (!ivHex || !encryptedHex) return null;
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
    const key = CryptoJS.SHA256(JWT_SECRET);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
}
const Login = ({ onClose }) => {
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const [selectedCode, setSelectedCode] = useState("+91");
  const [country, setCountry] = useState("India");
  const validateMobile = (mobile, country) =>
    country === "India"
      ? /^[6-9]\d{9}$/.test(mobile)
      : /^\d+$/.test(mobile) && mobile.length > 0;
  const handleKeyPress = (e, action) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      if (action === "sendOtp" && validateMobile(mobile, country)) {
        handleLogin();
      } else if (action === "verifyOtp" && enteredOtp.length === OTP_LENGTH) {
        verifyOTP();
      }
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  const checkUserExists = useCallback(async () => {
    try {
      const { data } = await axios.post(
        "https://api.meetowner.in/auth/loginnew",
        { mobile },
        { headers: { "Content-Type": "application/json" } }
      );
      return data;
    } catch {
      return null;
    }
  }, [mobile]);
  const sendUnifiedOtp = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const { data } = await axios.post(
        `${config.awsApiUrl}/auth/v1/sendBothOtps`,
        {
          mobile,
          countryCode: selectedCode.replace("+", ""),
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (data.status === "success") {
        const decryptedOtp = decrypt(data.otp);
        if (decryptedOtp) {
          setOtp(decryptedOtp);
          setMessage(`OTP sent successfully to ${selectedCode}${mobile}`);
          setOtpSent(true);
        } else {
          setError("Failed to decrypt OTP. Please try again.");
        }
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Error sending OTP. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [mobile, selectedCode]);
  const registerUser = useCallback(async () => {
    try {
      const { data } = await axios.post(
        "https://api.meetowner.in/auth/v1/registernew",
        {
          name: "",
          mobile,
          city: "",
          userType: "user",
          country: country || "India",
          country_code: selectedCode || "+91",
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (data.status === "success") {
        const userData = await checkUserExists();
        setLoginData(userData);
        await sendUnifiedOtp();
        return true;
      }
      return false;
    } catch {
      setError("Registration failed. Please try again.");
      return false;
    }
  }, [mobile, selectedCode, country, checkUserExists, sendUnifiedOtp]);
  const handleLogin = useCallback(async () => {
    if (!validateMobile(mobile, country)) {
      setError(
        country === "India"
          ? "Please enter a valid 10-digit mobile number starting with 6-9."
          : "Please enter a valid mobile number."
      );
      return;
    }
    setIsLoading(true);
    const userData = await checkUserExists();
    if (userData && userData.status === "success") {
      setLoginData(userData);
      await sendUnifiedOtp();
    } else {
      await registerUser();
    }
    setIsLoading(false);
  }, [mobile, country, checkUserExists, sendUnifiedOtp, registerUser]);
  const verifyOTP = useCallback(() => {
    const trimmedEnteredOtp = enteredOtp.trim();
    if (trimmedEnteredOtp.length !== OTP_LENGTH || trimmedEnteredOtp !== otp) {
      setError("Invalid OTP. Please try again.");
      return;
    }
    setIsLoading(true);
    try {
      if (loginData && loginData.status === "success") {
        const { user_details, accessToken } = loginData;
        localStorage.setItem("user", JSON.stringify({ ...user_details }));
        localStorage.setItem("mobile", JSON.stringify({ mobile }));
        localStorage.setItem("token", JSON.stringify({ accessToken }));
        dispatch(
          setAuthData({
            userDetails: user_details,
            accessToken,
            loggedIn: true,
          })
        );
        dispatch(setLoggedIn(true));
        toast.success("Login successful!");
        setMessage("Login successful!");
        setError("");
        onClose();
      } else {
        toast.error("Something went wrong. Please try again.");
        setError("User data not found. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [enteredOtp, otp, loginData, dispatch, onClose]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-75 z-50">
      <div
        ref={modalRef}
        className="bg-[#FFFF] w-[420px] p-6 rounded-md shadow-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-2xl"
          disabled={isLoading}
        >
          ×
        </button>
        <h2 className="text-black text-center text-2xl font-bold mb-5">
          Login
        </h2>
        {message && (
          <p className="text-green-400 text-center mb-3">{message}</p>
        )}
        {error && <p className="text-red-400 text-center mb-3">{error}</p>}
        <div className="relative mb-1">
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            value={mobile}
            maxLength={15}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setMobile(value);
              setError("");
            }}
            onKeyDown={(e) => handleKeyPress(e, "sendOtp")}
            className="w-full px-4 py-2 rounded-md bg-white border border-black text-black placeholder-gray-400 focus:outline-none pl-20 pr-4"
            disabled={isLoading || otpSent}
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <CountryCodeSelector
              selectedCode={selectedCode}
              onSelect={setSelectedCode}
              setCountry={setCountry}
            />
          </div>
        </div>
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
            onKeyDown={(e) => handleKeyPress(e, "verifyOtp")}
            className="w-full px-4 py-2 mb-1 rounded-md bg-white border border-black placeholder-gray-400 focus:outline-none"
            disabled={isLoading}
          />
        )}
        <p
          className="text-black underline cursor-pointer text-left text-xs mb-4"
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
        <div className="space-y-4">
          {!otpSent && (
            <button
              onClick={() => handleLogin(0)}
              className="w-full bg-[#1D3A76] text-white font-semibold py-2 rounded-md hover:brightness-105 transition duration-200 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "SEND OTP"}
            </button>
          )}
          {otpSent && (
            <button
              onClick={verifyOTP}
              className="w-full bg-[#1D3A76] text-white font-semibold py-2 rounded-md hover:brightness-105 transition duration-200 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "VERIFY OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Login;
