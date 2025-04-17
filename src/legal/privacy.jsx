import React, { useEffect, useState } from "react";
import config from "../../config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowUp } from "lucide-react";
const PrivacyAndPolicies = () => {
  const [privacy, setPrivacy] = useState({ description: "" });
  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const response = await fetch(`${config.awsApiUrl}/api/privacy`);
        const data = await response.json();
        setPrivacy(data[0] || { description: "" });
      } catch (err) {
        console.error("Failed to fetch privacy:", err);
      }
    };
    fetchPrivacy();
  }, []);
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="text-left flex flex-col justify-center mt-10 w-[70%]"
          dangerouslySetInnerHTML={{ __html: privacy.description }}
        />
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>
      <Footer />
    </>
  );
};
export default PrivacyAndPolicies;
