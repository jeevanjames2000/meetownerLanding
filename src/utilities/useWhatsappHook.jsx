import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import config from "../../config";
const useWhatsappHook = (selectedPropertyId) => {
  const [owner, setOwner] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUserDetails(JSON.parse(data).userDetails);
    } else {
      setError("User not logged in!");
    }
  }, []);
  const getOwnerDetails = async (property) => {
    try {
      const response = await fetch(
        `https://api.meetowner.in/listings/v1/getSingleProperty?unique_property_id=${property.unique_property_id}`
      );
      const data = await response.json();
      const propertydata = data.property;
      const sellerdata = propertydata.seller_details;
      if (response.ok) {
        setOwner(sellerdata);
        return sellerdata;
      } else {
        throw new Error("Failed to fetch owner details");
      }
    } catch (err) {
      setError("Error fetching owner details");
      throw err;
    }
  };
  const handleAPI = async (property) => {
    if (!userDetails) {
      setError("User details not available");
      return;
    }
    try {
      const ownerData = await getOwnerDetails(property);
      const payload = {
        name: userDetails?.name,
        mobile: userDetails?.mobile,
        ownerName: ownerData?.name,
        ownerMobile: ownerData?.mobile,
        property_name: property?.property_name,
        sub_type: property?.sub_type,
        google_address: property?.google_address,
      };
      const response = await axios.post(
        `${config.awsApiUrl}/auth/v1/sendWhatsappLeads`,
        payload
      );
      if (response.status === 200) {
        toast.success("Details Submitted Successfully!");
      }
    } catch (error) {
      console.error("Backend error:", error.response?.data || error.message);
      setError("Error sending WhatsApp message");
    }
  };
  return { owner, handleAPI, error };
};
export default useWhatsappHook;
