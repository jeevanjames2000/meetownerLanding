import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowUp } from "lucide-react";
import config from "../../config";

const About = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [aboutHtml, setAboutHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${config.awsApiUrl}/api/v1/about`);
        if (!res.ok) throw new Error("Failed to fetch about info");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAboutHtml(data[0].description);
        } else {
          setAboutHtml("");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col my-10 w-[70%] mx-auto justify-center gap-4">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-4">About Us</h2>
            </div>
            <div
              className="prose prose-sm max-w-none text-left"
              dangerouslySetInnerHTML={{ __html: aboutHtml }}
            />
          </>
        )}
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

export default About;
