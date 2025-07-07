import { useEffect, useState, useCallback } from "react";
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 1000,
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "1.5rem",
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
  },
  inputContainer: {
    marginBottom: "1rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#1D3A76",
    marginBottom: "0.25rem",
    display: "block",
  },
  input: {
    padding: "0.5rem",
    border: "1px solid #D1D5DB",
    borderRadius: "0.5rem",
    width: "100%",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  errorText: {
    color: "#DC2626",
    fontSize: "0.75rem",
    marginTop: "0.25rem",
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
  updateBtnDisabled: {
    backgroundColor: "#6B7280",
    cursor: "not-allowed",
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
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    city: "",
  });
  const { pathname } = useLocation();
  const validateForm = useCallback(() => {
    const newErrors = { name: "", email: "", city: "" };
    let isValid = true;
    if (!user.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!user.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
    if (!user.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  }, [user]);
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const data = localStorage.getItem("user");
        if (!data) {
          setShowModal(false);
          return;
        }
        const userDetails = JSON.parse(data);
        const isLoggedIn = !!userDetails?.id;
        const isIncomplete =
          !userDetails?.name?.trim() ||
          !userDetails?.email?.trim() ||
          !userDetails?.city?.trim();
        if (isLoggedIn && isIncomplete) {
          setUser({
            user_id: userDetails.user_id || "",
            name: userDetails.name || "",
            email: userDetails.email || "",
            mobile: userDetails.mobile || "",
            password: "",
            city: userDetails.city || "",
            address: userDetails.address || "",
          });
          setShowModal(true);
        } else {
          setShowModal(false);
        }
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        setShowModal(false);
      }
    };
    checkProfile();
  }, [pathname]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update user");
      }
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
      setErrors({ name: "", email: "", city: "" });
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(
        error.message || "Something went wrong while updating profile."
      );
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
              This action is required. Please add your name, email, and city to
              complete your profile and access all features.
            </p>
            <form onSubmit={handleSubmit} style={modalStyles.form}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div style={modalStyles.inputContainer}>
                  <label style={modalStyles.label} htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={user.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    style={{
                      ...modalStyles.input,
                      ...(errors.name ? modalStyles.inputError : {}),
                    }}
                    aria-label="Full Name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <span style={modalStyles.errorText} id="name-error">
                      {errors.name}
                    </span>
                  )}
                </div>
                <div style={modalStyles.inputContainer}>
                  <label style={modalStyles.label} htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Email"
                    style={{
                      ...modalStyles.input,
                      ...(errors.email ? modalStyles.inputError : {}),
                    }}
                    aria-label="Email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <span style={modalStyles.errorText} id="email-error">
                      {errors.email}
                    </span>
                  )}
                </div>
                <div style={modalStyles.inputContainer}>
                  <label style={modalStyles.label} htmlFor="mobile">
                    Mobile
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    id="mobile"
                    value={user.mobile}
                    onChange={handleChange}
                    placeholder="Mobile"
                    style={modalStyles.input}
                    aria-label="Mobile"
                  />
                </div>
                <div style={modalStyles.inputContainer}>
                  <label style={modalStyles.label} htmlFor="city">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={user.city}
                    onChange={handleChange}
                    placeholder="City"
                    style={{
                      ...modalStyles.input,
                      ...(errors.city ? modalStyles.inputError : {}),
                    }}
                    aria-label="City"
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? "city-error" : undefined}
                  />
                  {errors.city && (
                    <span style={modalStyles.errorText} id="city-error">
                      {errors.city}
                    </span>
                  )}
                </div>
              </div>
              <div style={modalStyles.buttonContainer}>
                <button
                  type="submit"
                  style={{
                    ...modalStyles.updateBtn,
                    ...(loading ? modalStyles.updateBtnDisabled : {}),
                  }}
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
