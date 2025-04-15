import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import config from "../../config";

const useWhatsappHook = (selectedPropertyId) => {
  console.log("selectedPropertyId: ", selectedPropertyId);
  const [owner, setOwner] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  console.log("userDetails: ", userDetails);
  const [error, setError] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUserDetails(JSON.parse(data).userDetails);
    } else {
      setError("User not logged in!");
    }
  }, []);

  const getOwnerDetails = async () => {
    try {
      const response = await fetch(
        `https://api.meetowner.in/listings/getsingleproperty?unique_property_id=${selectedPropertyId?.unique_property_id}`
      );
      const data = await response.json();
      const propertydata = data.property_details;
      const sellerdata = propertydata.seller_details;

      if (response.status === 200) {
        setOwner(sellerdata);
      } else {
        setError("Failed to fetch owner details");
      }
    } catch (err) {
      setError("Error fetching owner details");
    }
  };

  const handleAPI = async () => {
    if (!selectedPropertyId || !userDetails) {
      setError("Missing property or user details");
      return;
    }

    await getOwnerDetails();

    if (owner) {
      const payload = {
        name: userDetails?.name,
        mobile: userDetails?.mobile,
        ownerName: userDetails.name,
        ownerMobile: userDetails.mobile,
        property_name: selectedPropertyId?.property_name,
        property_subtype: selectedPropertyId?.property_subtype,
        sub_type: selectedPropertyId?.sub_type,
        google_address: selectedPropertyId?.google_address,
      };

      try {
        const response = await axios.post(
          `${config.awsApiUrl}/auth/v1/sendWhatsappLeads`,
          payload
        );

        console.log("response: ", response);
        if (response.status === 200) {
          toast.success("Visit Scheduled Successfully!");
        }
      } catch (error) {
        console.error("Backend error:", error.response?.data || error.message);
        setError("Error sending WhatsApp message");
      }
    }
  };

  return { owner, handleAPI, error };
};

export default useWhatsappHook;
