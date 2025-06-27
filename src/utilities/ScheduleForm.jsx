import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import config from "../../config";
export default function ScheduleFormModal({ isOpen, onClose, onSubmit }) {
  const [userDetails, setUserDetails] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [agreeCall, setAgreeCall] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      toast.error("Please Login to Schedule Visits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const userDetails = JSON.parse(data);
    setUserDetails(userDetails);
    setFormData((prev) => ({
      ...prev,
      name: userDetails.name || "",
      email: userDetails.email || "",
      phone: userDetails.mobile || "",
    }));
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      let updatedUserDetails = { ...storedUser };
      const missingName =
        !updatedUserDetails?.name || updatedUserDetails.name === "N/A";
      const missingEmail =
        !updatedUserDetails?.email || updatedUserDetails.email === "N/A";
      const missingMobile =
        !updatedUserDetails?.mobile || updatedUserDetails.mobile === "N/A";
      if (missingName || missingEmail || missingMobile) {
        const updatePayload = {
          id: updatedUserDetails.user_id,
          name: formData.name,
          email: formData.email,
          mobile: formData.phone,
        };
        const res = await fetch(`${config.awsApiUrl}/user/v1/updateUser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });
        if (!res.ok) throw new Error("Failed to update user");
        const updatedUser = await res.json();
        updatedUserDetails = {
          ...updatedUserDetails,
          name: updatedUser.name || formData.name,
          email: updatedUser.email || formData.email,
          mobile: updatedUser.mobile || formData.phone,
        };
        const newUserData = {
          ...storedUser,
          userDetails: updatedUserDetails,
        };
        localStorage.setItem("user", JSON.stringify(newUserData));
        onClose();
      }
      onSubmit({
        ...formData,
        name: updatedUserDetails.name,
        email: updatedUserDetails.email,
        phone: updatedUserDetails.mobile,
      });
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      toast.error("Something went wrong while saving your details.");
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 top-10 flex items-center justify-center z-100 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <h2 className="text-lg font-semibold mb-1 text-yellow-500">
          Please Fill Your Details
        </h2>
        <button
          className="absolute top-3 right-3 text-blue-900 font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.phone}
            disabled
            onChange={handleChange}
            required
          />
          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeCall}
              onChange={() => setAgreeCall(!agreeCall)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to contact me via mobile or whatsapp
            </label>
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={() => setAgreeToTerms(!agreeToTerms)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="/terms" className="text-blue-600 underline">
                terms and conditions
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
