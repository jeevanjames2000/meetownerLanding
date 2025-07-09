import axios from "axios";
import { useState, useCallback, useRef, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setAuthData, setLoggedIn } from "../../store/slices/authSlice";
import config from "../../config";
import { toast } from "react-toastify";
import CountryCodeSelector from "../utilities/CountryCodeSelector";
import CryptoJS from "crypto-js";
const JWT_SECRET = "khsfskhfks983493123!@#JSFKORuiweo232";
function decrypt(encryptedText) {
  try {
    const [ivHex, encryptedHex] = encryptedText.split(":");
    if (!ivHex || !encryptedHex)
      throw new Error("Invalid encrypted text format");
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
    const key = CryptoJS.SHA256(JWT_SECRET);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
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
  const OTP_LENGTH = 4;
  const validateMobile = (mobile, country) => {
    if (country === "India") {
      return /^[6-9]\d{9}$/.test(mobile);
    }
    return /^\d+$/.test(mobile) && mobile.length > 0;
  };
  const handleKeyPress = (e, action) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      if (action === "sendOtp" && validateMobile(mobile, country)) {
        handleLogin(0);
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  const checkUserExists = useCallback(async () => {
    try {
      const response = await axios.post(
        "https://api.meetowner.in/auth/loginnew",
        { mobile: mobile },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }, [mobile, selectedCode]);
  const sendOTP = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${config.awsApiUrl}/auth/v1/sendOtp?mobile=${mobile}`
      );
      if (response.data.status === "success") {
        const encryptedOtp = response.data.otp;
        const decryptedOtp = decrypt(encryptedOtp);
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
    } catch (error) {
      setError("Error sending OTP. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [mobile, selectedCode, setOtp, setMessage, setOtpSent, setError]);
  const sendWhatsAppMessage = useCallback(async () => {
    setEnteredOtp("");
    try {
      const res = await axios.post(
        `${config.awsApiUrl}/auth/v1/sendGallaboxOTP`,
        {
          mobile: mobile,
          countryCode: selectedCode.replace("+", ""),
        }
      );
      setOtp(res.data.otp.toString());
      setMessage(`WhatsApp OTP sent successfully to ${selectedCode} ${mobile}`);
      setOtpSent(true);
      setError("");
    } catch (err) {
      setError("Failed to send OTP via WhatsApp. Please try again!");
      setMessage("");
    }
  }, [
    mobile,
    selectedCode,
    setOtp,
    setEnteredOtp,
    setMessage,
    setOtpSent,
    setError,
  ]);
  const registerUser = useCallback(
    async (type) => {
      try {
        const response = await axios.post(
          "https://api.meetowner.in/auth/v1/registernew",
          {
            name: "",
            mobile: mobile,
            city: "",
            userType: "user",
            country: country || "India",
            country_code: selectedCode || "+91",
          },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.data.status === "success") {
          const userData = await checkUserExists();
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
    [
      mobile,
      selectedCode,
      country,
      checkUserExists,
      sendOTP,
      sendWhatsAppMessage,
    ]
  );
  const handleLogin = useCallback(
    async (type) => {
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
    [
      mobile,
      selectedCode,
      country,
      checkUserExists,
      sendOTP,
      registerUser,
      sendWhatsAppMessage,
      setIsLoading,
      setError,
      setLoginData,
    ]
  );
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
        localStorage.setItem("mobile", JSON.stringify({ mobile: mobile }));
        localStorage.setItem("token", JSON.stringify({ accessToken }));
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
  }, [
    enteredOtp,
    otp,
    mobile,
    selectedCode,
    country,
    dispatch,
    onClose,
    loginData,
    setIsLoading,
    setError,
    setMessage,
  ]);
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
          {country === "India" && !otpSent && (
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
          {country === "India" && !otpSent && (
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="text-black text-sm mx-2">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          )}
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
    </div>
  );
};
export default Login;
