import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import config from "../../config";
import { toast } from "react-toastify";
export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    password: "",
    address: "",
  });
  const [data, setData] = useState("");
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const [profileImage, setProfileImage] = useState(
    "https://placehold.co/200x200?text=Upload Image"
  );
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) {
      toast.info("Please Login to Contact!");
      return;
    }
    const { userDetails } = JSON.parse(data);
    setData(userDetails);
    setUser({
      name: userDetails.name || "",
      email: userDetails.email || "",
      mobile: userDetails.mobile || "",
      city: "",
      password: "",
      address: "",
    });
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: data.user_id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      password: user.password,
      address: user.address,
    };
    try {
      const res = await fetch(`${config.awsApiUrl}/user/updateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Failed to update user");
      }
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
          <img
            src={profileImage}
            alt="User Profile"
            className="w-40 h-40 rounded-full shadow-md object-cover"
          />
          <label className="realtive top-8 right-8 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100">
            <button className="w-20 p-1 bg-blue-900 text-white rounded-lg">
              Edit
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <h2 className="mt-4 text-xl font-semibold">
            {user.name || "User Name"}
          </h2>
          <p className="text-gray-500">{user.email || "user@example.com"}</p>
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
