import { useState } from "react";
export default function ScheduleFormModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <h2 className="text-lg font-semibold mb-4">Please Fill Your Details</h2>
        <button
          className="absolute top-3 right-3 text-white bg-blue-900 rounded-full p-1"
          onClick={onClose}
        >
          ✕
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <input
            type="date"
            name="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.date}
            onChange={handleChange}
            required
          />
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
