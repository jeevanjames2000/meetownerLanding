import React, { useEffect, useRef, useState } from "react";
import config from "../../config";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";
import axios from "axios";
export default function ProfilePage() {
  const [user, setUser] = useState({
    user_id: "",
    name: "",
    email: "",
    mobile: "",
    city: "",
    password: "",
    address: "",
    user_type: "",
    photo: "",
  });
  const [profileImage, setProfileImage] = useState(
    "https://placehold.co/200x200?text=Upload+Image"
  );
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const fetchProfile = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${config.awsApiUrl}/user/v1/getProfile?user_id=${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      const updatedUser = {
        user_id: data.id || "",
        name: data.name || "",
        email: data.email || "",
        mobile: data.mobile || "",
        photo: data.photo || "",
        city: data.city || "",
        user_type: data.user_type || "",
        address: data.address || "",
        password: "",
      };
      setUser(updatedUser);
      setProfileImage(data.photo || profileImage);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      toast.error("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (!storedData) {
      toast.info("Please login to access your profile.");
      return;
    }
    try {
      const userDetails = JSON.parse(storedData);
      if (userDetails.user_id) {
        fetchProfile(userDetails.user_id);
      } else {
        toast.error("Invalid user data. Please login again.");
      }
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      toast.error("Invalid user data. Please login again.");
    }
  }, []);
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const tempImageUrl = URL.createObjectURL(file);
    setProfileImage(tempImageUrl);
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("user_id", user.user_id);
    try {
      const response = await axios.post(
        `${config.awsApiUrl}/user/v1/uploadUserImage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const photoUrl = response.data.photo;
      if (!photoUrl) throw new Error("No photo URL returned");
      setProfileImage(photoUrl);
      toast.success("Profile photo updated successfully!");
      await fetchProfile(user.id);
    } catch (error) {
      console.error("Image Upload Error:", error);
      toast.error("Failed to upload photo.");
      setProfileImage(user.photo || profileImage);
    } finally {
      setLoading(false);
    }
  };
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name.trim() || !user.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    setLoading(true);
    const payload = {
      id: user.user_id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      password: user.password || undefined,
      city: user.city,
      address: user.address,
    };
    try {
      const res = await fetch(`${config.awsApiUrl}/user/v1/updateUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update user");
      localStorage.setItem("user", JSON.stringify({ ...user, password: "" }));
      toast.success("Profile updated!");
      await fetchProfile(user.user_id);
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Something went wrong while updating profile.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center md:w-1/3 relative">
          <div className="relative">
            <img
              src={
                user.photo ? `${config.awsApiUrl}/${user.photo}` : profileImage
              }
              alt="Profile"
              crossOrigin="anonymous"
              className="w-40 h-40 rounded-full shadow-md object-cover"
            />
            <button
              onClick={triggerFileSelect}
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700"
              title="Edit Profile Image"
              aria-label="Edit Profile Image"
              disabled={loading}
            >
              <Pencil size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              aria-hidden="true"
            />
          </div>
          <h2 className="mt-4 text-xl font-semibold">
            {user.name || "User Name"}
          </h2>
          <p className="text-gray-500">{user.email || "N/A"}</p>
        </div>
        <form onSubmit={handleSubmit} className="md:w-2/3 w-full space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Full Name"
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Email"
              disabled={loading}
            />
            <input
              type="text"
              name="mobile"
              value={user.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Mobile"
              disabled
            />
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Password"
              disabled={loading}
            />
            <input
              type="text"
              name="city"
              value={user.city}
              onChange={handleChange}
              placeholder="City"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="City"
              disabled={loading}
            />
          </div>
          <textarea
            name="address"
            value={user.address}
            onChange={handleChange}
            placeholder="Address"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Address"
            disabled={loading}
          ></textarea>
          <button
            type="submit"
            className="w-full bg-[#1D3A76] text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
            aria-label="Update Profile"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
