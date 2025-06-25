import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../../config";
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderColor: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderColor: "#fff",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    zIndex: 1001,
    width: "90%",
    maxWidth: "600px",
    textAlign: "left",
  },
  title: {
    fontSize: "1.125rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  form: {
    width: "100%",
    spaceY: "1rem",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1rem",
  },
  cancelBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#fff",
    border: "1px solid #D1D5DB",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 500,
  },
  updateBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#1D3A76",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 500,
  },
  description: {
    fontSize: "0.9rem",
    color: "#4B5563",
    marginBottom: "1.5rem",
    lineHeight: "1.5",
  },
};
const UserProfileCheckWrapper = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    user_id: "",
    name: "",
    email: "",
    mobile: "",
    password: "",
    city: "",
    address: "",
  });
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === "/profile") {
      setShowModal(false);
      return;
    }
    const data = localStorage.getItem("user");
    if (data) {
      try {
        const userDetails = JSON.parse(data);
        const isIncomplete =
          !userDetails?.name?.trim() || !userDetails?.email?.trim();
        setUser({
          user_id: userDetails.user_id || "",
          name: userDetails.name || "",
          email: userDetails.email || "",
          mobile: userDetails.mobile || "",
          password: "",
          city: userDetails.city || "",
          address: userDetails.address || "",
        });
        setShowModal(isIncomplete);
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        setShowModal(false);
      }
    } else {
      setShowModal(false);
    }
  }, [pathname]);
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        city: user.city,
        address: user.address,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Something went wrong while updating profile.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {showModal && (
        <div style={modalStyles.overlay} role="dialog" aria-modal="true">
          <div
            style={modalStyles.modal}
            tabIndex={-1}
            ref={(node) => node?.focus()}
          >
            <h2 style={modalStyles.title}>Update Your Profile</h2>
            <p style={modalStyles.description}>
              This action is required. Please add your name and email to
              complete your profile and access all features.
            </p>
            <form
              onSubmit={handleSubmit}
              style={modalStyles.form}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-label="Full Name"
                />
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-label="Email"
                />
                <input
                  type="text"
                  name="mobile"
                  value={user.mobile}
                  onChange={handleChange}
                  placeholder="Mobile"
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Mobile"
                />
                <input
                  type="text"
                  name="city"
                  value={user.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="City"
                />
              </div>
              <div style={modalStyles.buttonContainer}>
                <button
                  type="button"
                  style={modalStyles.cancelBtn}
                  onClick={() => setShowModal(false)}
                  aria-label="Cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={modalStyles.updateBtn}
                  disabled={loading}
                  aria-label="Update Profile"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {children}
    </>
  );
};
export default UserProfileCheckWrapper;
