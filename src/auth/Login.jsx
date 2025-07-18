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
const RESEND_COOLDOWN = 30;
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
  const [resendCooldown, setResendCooldown] = useState(0);
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
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);
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
          setMessage(`OTP sent to ${selectedCode}${mobile}`);
          setOtpSent(true);
          setResendCooldown(RESEND_COOLDOWN);
        } else {
          setError("Failed to decrypt OTP. Try again.");
        }
      } else {
        setError("Failed to send OTP. Try again.");
      }
    } catch {
      setError("Error sending OTP. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [mobile, selectedCode]);
  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0) {
      setError(`Please wait ${resendCooldown}s before resending.`);
      return;
    }
    await sendUnifiedOtp();
  }, [resendCooldown, sendUnifiedOtp]);
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
      setError("Registration failed. Try again.");
      return false;
    }
  }, [mobile, selectedCode, country, checkUserExists, sendUnifiedOtp]);
  const handleLogin = useCallback(async () => {
    if (!validateMobile(mobile, country)) {
      setError(
        country === "India"
          ? "Enter a valid 10-digit mobile number (6-9)."
          : "Enter a valid mobile number."
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
      setError("Invalid OTP. Try again.");
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
        toast.error("Something went wrong. Try again.");
        setError("User data not found. Try again.");
      }
    } catch {
      toast.error("Something went wrong. Try again.");
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  }, [enteredOtp, otp, loginData, dispatch, onClose]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50 transition-opacity duration-500 ">
      <div
        ref={modalRef}
        className="relative w-full max-w-sm p-6 bg-white bg-opacity-5 backdrop-blur-md rounded-xl border border-transparent animate-glow-border shadow-[0_0_15px_rgba(29,58,118,0.5)]"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black text-lg font-light hover:text-[#1D3A76] transition-colors duration-300"
          disabled={isLoading}
        >
          ×
        </button>
        <h2 className="text-black text-center text-2xl font-bold mb-6 tracking-wider animate-pulse-text">
          Login
        </h2>
        {message && (
          <p className="text-green-400 text-center text-sm mb-4 animate-neon-glow">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-400 text-center text-sm mb-4 animate-neon-glow">
            {error}
          </p>
        )}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              maxLength={15}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setMobile(value);
                setError("");
              }}
              onKeyDown={(e) => handleKeyPress(e, "sendOtp")}
              className="w-full px-4 py-2 pl-20 rounded-lg bg-white bg-opacity-10 border border-black border-opacity-20 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D3A76] focus:shadow-[0_0_10px_rgba(29,58,118,0.7)] transition-all duration-300"
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
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-black border-opacity-20 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D3A76] focus:shadow-[0_0_10px_rgba(29,58,118,0.7)] transition-all duration-300"
              disabled={isLoading}
            />
          )}
          {otpSent && (
            <div className="flex justify-between items-center">
              <p
                className="text-[#1D3A76] cursor-pointer text-xs font-semibold hover:text-orange-600 transition-colors duration-300"
                onClick={() => {
                  setOtpSent(false);
                  setEnteredOtp("");
                  setMobile("");
                  setError("");
                  setMessage("");
                  setResendCooldown(0);
                }}
              >
                Switch Number
              </p>
              <button
                onClick={handleResendOtp}
                className="text-[#1D3A76]  text-xs  cursor-pointer font-semibold hover:text-orange-600 transition-colors duration-300 disabled:opacity-50"
                disabled={isLoading || resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Code"}
              </button>
            </div>
          )}
          <div>
            {!otpSent ? (
              <button
                onClick={() => handleLogin()}
                className="w-full bg-[#1D3A76] text-white font-semibold py-2 rounded-lg hover:shadow-[0_0_12px_rgba(29,58,118,0.8)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            ) : (
              <button
                onClick={verifyOTP}
                className="w-full bg-[#1D3A76] text-white font-semibold py-2 rounded-lg hover:shadow-[0_0_12px_rgba(29,58,118,0.8)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5:row w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
