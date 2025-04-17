import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowUp } from "lucide-react";

const About = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <Header />
      <div className="flex flex-col my-10 w-[70%] mx-auto justify-center gap-4">
        <h1 className="font-bold text-center">About Meet Owner</h1>
        <p className="text-left text-xs">
          Welcome to Meet Owner, where we believe that finding the perfect
          property should be a seamless and empowering experience. Founded with
          a passion for simplifying the real estate journey, Meet Owner is your
          trusted platform for connecting property seekers directly with owners,
          eliminating unnecessary barriers and facilitating transparent
          transactions.
        </p>

        <h2 className="text-left font-bold">Our Vision:</h2>
        <h3 className="text-left font-bold">
          Empowering connection, Simplifying Transactions
        </h3>
        <p className="text-left text-xs">
          At Meet Owner, we envision a real estate landscape where individuals
          and businesses can effortlessly discover, connect, and secure their
          ideal properties. We strive to be the bridge that brings property
          owners and seekers together, fostering direct communication and
          fostering a sense of community.
        </p>

        <h2 className="text-left font-bold">Our Mission:</h2>
        <h3 className="text-left font-bold">
          Transforming Property Search Into A Personalized Experience
        </h3>
        <p className="text-left text-xs">
          Our mission is to redefine the property search process. We are
          committed to providing a user-friendly platform that not only offers
          an extensive range of property listings but also prioritizes the human
          connection in real estate transactions. By putting the power in the
          hands of our users, we aim to make property search, whether for an
          extra home, plot, or commercial space, an enjoyable and empowering
          journey.
        </p>

        <h2 className="text-left font-bold">Why Choose Meet Owner?</h2>
        <ol className="text-left ml-4">
          <li className="text-xs">
            <strong>Transparency:</strong> We prioritize transparency in every
            step of the process. From property details to communication with
            owners, we believe that clarity is key to building trust.
          </li>
          <li className="text-xs">
            <strong>Direct connections:</strong> By facilitating direct
            communication between property seekers and owners, we cut out the
            middleman, ensuring a more efficient and personal experience for
            all.
          </li>
          <li className="text-xs">
            <strong>Comprehensive Listings:</strong> Our platform features a
            diverse range of properties, providing options for every need and
            preference.
          </li>
          <li className="text-xs">
            <strong>User-Centric Approach:</strong> Meet Owner is designed with
            you in mind. Our user-friendly interface and powerful search tools
            make finding the perfect property a breeze.
          </li>
        </ol>

        <h2 className="text-left font-bold">Join Our Community</h2>
        <p className="text-left text-xs">
          Whether you’re looking for a place to call home, a lucrative
          investment, or the perfect location for your business, Meet Owner is
          here to help you. Join our growing community of property enthusiasts
          today!
        </p>
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
