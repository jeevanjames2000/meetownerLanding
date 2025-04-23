import React, { useEffect, useRef, useState } from "react";
import config from "../../config";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    password: "",
    address: "",
    user_type: "",
    photo: "",
  });
  const [data, setData] = useState("");
  const [profileImage, setProfileImage] = useState(
    "https://placehold.co/200x200?text=Upload Image"
  );
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("user_id", user?.user_id);
    setLoading(true);
    try {
      const response = await axios.post(
        `${config.awsApiUrl}/user/v1/uploadUserImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const photoUrl = response.data.photoUrl || imageUrl;
      setProfileImage(photoUrl);
      const storedData = JSON.parse(localStorage.getItem("user"));
      if (storedData) {
        storedData.userDetails.photo = photoUrl;
        localStorage.setItem("user", JSON.stringify(storedData));
        setData(storedData);
      }
      toast.success("Profile photo updated successfully!");
      fetchProfile(user?.user_id);
    } catch (error) {
      console.error("Photo Upload Error:", error);
      toast.error("Failed to upload photo.");
    } finally {
      setLoading(false);
    }
  };
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  const fetchProfile = async (user_id) => {
    const res = await fetch(
      `${config.awsApiUrl}/user/v1/getProfile?user_id=${user_id}`
    );
    const data = await res.json();
    setUser({
      user_id: data.id || "",
      name: data.name || "",
      email: data.email || "",
      mobile: data.mobile || "",
      photo: data?.photo || "",
      city: data.city || "",
      user_type: data.user_type || "",
      address: data.address || "",
    });
    if (data.photo) {
      setProfileImage(data.photo);
    }
  };
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      toast.info("Please Login to Contact!");
      return;
    }
    const { userDetails } = JSON.parse(data);
    fetchProfile(parseInt(userDetails.user_id));
    setData(userDetails);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: user.user_id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      password: user.password,
      city: user.city,
      address: user.address,
    };
    try {
      const res = await fetch(`${config.awsApiUrl}/user/v1/updateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update user");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Something went wrong while updating profile.");
    }
  };
  return (
    <div className="min-h-120 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center md:w-1/3 relative">
          <div className="relative">
            <img
              src={`${config.awsApiUrl}/${user.photo}`}
              alt="Image"
              crossOrigin="anonymous"
              className="w-40 h-40 rounded-full shadow-md object-contain"
            />
            <button
              onClick={triggerFileSelect}
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700"
              title="Edit Image"
            >
              <Pencil size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
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
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="mobile"
              value={user.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="city"
              value={user.city}
              onChange={handleChange}
              placeholder="City"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea
            name="address"
            value={user.address}
            onChange={handleChange}
            placeholder="Address"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-[#1D3A76] text-white py-3 rounded-lg hover:bg-[#1D3A76] transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
