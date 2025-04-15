import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ScheduleFormModal({ isOpen, onClose, onSubmit }) {
  const [userDetails, setUserDetails] = useState(null);
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
    const { userDetails } = JSON.parse(data);
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
    const missingName = !userDetails?.name || userDetails.name === "N/A";
    const missingEmail = !userDetails?.email || userDetails.email === "N/A";

    if ((missingName && formData.name) || (missingEmail && formData.email)) {
      try {
        const res = await fetch("http://localhost:5000/user/updateUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userDetails.user_id,
            name: formData.name,
            email: formData.email,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to update user");
        }

        const updatedUser = await res.json();

        const existingUserData = JSON.parse(localStorage.getItem("user"));
        const updatedUserData = {
          ...existingUserData,
          userDetails: {
            ...existingUserData.userDetails,
            name: updatedUser.name || formData.name,
            email: updatedUser.email || formData.email,
          },
        };

        localStorage.setItem("user", JSON.stringify(updatedUserData));
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-10 flex items-center justify-center z-50 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <h2 className="text-lg font-semibold mb-1">Please Fill Your Details</h2>
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
            onChange={handleChange}
            required
          />
          <label htmlFor="date" className="block w-full text-left">
            Schedule Date
          </label>
          <input
            type="date"
            name="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <label htmlFor="time" className="block w-full text-left">
            Schedule Time
          </label>
          <input
            type="time"
            name="time"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.time}
            onChange={handleChange}
            required
          />
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
