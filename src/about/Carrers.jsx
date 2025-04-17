import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import { MdDateRange } from "react-icons/md";
import Header from "../components/Header";
import Footer from "../components/Footer";
import config from "../../config";
const categories = [
  "Development",
  "Design",
  "Marketing",
  "Customer Service",
  "Operations",
  "Finance",
  "Management",
];

export default function Careers() {
  const [selectedCategory, setSelectedCategory] = useState("View all");
  const [careers, setCareers] = useState([]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch(`${config.awsApiUrl}/api/careers`);
        const data = await response.json();
        setCareers(data);
      } catch (err) {
        console.error("Failed to fetch careers:", err);
      }
    };
    fetchCareers();
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6 text-[#0f172a]">
        <span className="text-sm px-3 py-1 bg-[#f1f5f9] text-[#334155] rounded-full inline-block mb-3">
          We're hiring!
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Be part of our mission
        </h1>
        <p className="text-gray-600 mb-6">
          We’re looking for passionate people to join us on our mission. We
          value flat hierarchies, clear communication, and full ownership and
          responsibility.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory("View all")}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === "View all"
                ? "bg-black text-white"
                : "border-black text-black"
            }`}
          >
            View all
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "border-black text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {careers.length > 0 ? (
            careers.map((career, i) => (
              <div key={i} className="border-t pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg text-left font-semibold">
                      {career.job_title || "No job title"}
                    </h3>
                    <p className="text-sm text-left text-gray-600 mt-1">
                      {career.description || "No description available."}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <span className="flex items-center gap-1 text-sm px-3 py-1 border rounded-full">
                        <MapPin size={14} />{" "}
                        {career.preferred_location || "Not specified"}
                      </span>
                      <span className="flex items-center gap-1 text-sm px-3 py-1 border rounded-full">
                        <Clock size={14} /> {career.job_type || "Full-time"}
                      </span>
                      <span className="flex items-center gap-1 text-sm px-3 py-1 border rounded-full">
                        <MdDateRange size={14} />{" "}
                        {career.upload_date
                          ? new Date(career.upload_date).toLocaleDateString()
                          : "Not specified"}
                      </span>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    Apply <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 mt-10">
              <p className="text-lg font-medium">
                Sorry, we're currently not hiring.
              </p>
              <p className="text-sm mt-2">
                You can still send your CV to{" "}
                <a
                  href="mailto:careers@example.com"
                  className="text-blue-600 hover:underline"
                >
                  meetowner.in@gmail.com
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
