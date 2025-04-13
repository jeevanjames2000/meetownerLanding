import React, { useEffect, useState } from "react";
import config from "../../config";
import axios from "axios";
const Favourites = () => {
  const [likedProperties, setLikedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLikedProperties = async () => {
      const data = localStorage.getItem("user");
      if (!data) return;
      const { userDetails } = JSON.parse(data);
      try {
        const response = await axios.get(
          `${config.awsApiUrl}/fav/getAllFavourites?user_id=${userDetails.user_id}`
        );
        const liked = response.data.favourites || [];
        setLikedProperties(liked);
      } catch (error) {
        console.error("Failed to fetch liked properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLikedProperties();
  }, []);
  if (loading) {
    return <div className="text-center py-10">Loading favourites...</div>;
  }
  if (!likedProperties.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No favourites found.
      </div>
    );
  }
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {likedProperties.map((property) => (
        <div
          key={property.property_id}
          className="border rounded-lg shadow-md p-4"
        >
          <img
            src={property.image_url || "/placeholder.jpg"}
            alt={property.property_title}
            className="w-full h-40 object-cover rounded"
          />
          <h3 className="mt-2 font-semibold text-lg">
            {property.property_title}
          </h3>
          <p className="text-sm text-gray-600">{property.location}</p>
          <p className="text-blue-600 font-semibold mt-1">₹ {property.price}</p>
        </div>
      ))}
    </div>
  );
};
export default Favourites;
