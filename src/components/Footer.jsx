// App.jsx
import React from 'react';
import { FaGooglePlay, FaApple, FaMapMarkerAlt, FaEnvelope, FaPhone, FaLinkedin, FaFacebook, FaInstagram, FaYoutube, FaArrowRight } from 'react-icons/fa';

const App = () => {
  return (
    <footer className="relative py-10 overflow-x-hidden" style={{ backgroundColor: '#1D3A76' }}>
      {/* Ellipse in the top-right corner */}
      <div className="absolute top-0 right-6 w-32 h-32 bg-white rounded-full -translate-y-1/2 opacity-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-white">
          {/* Grid 1: Title and App Store Links (15%) */}
          <div className="col-span-1 text-left">
            <h3 className="text-lg font-bold mb-4">MEET OWNER</h3>
            <div className="flex flex-col space-y-3">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 w-fit"
              >
                <FaGooglePlay />
                <span>GET IT ON Google Play</span>
              </a>
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 w-fit"
              >
                <FaApple />
                <span>GET IT ON App Store</span>
              </a>
            </div>
          </div>

          {/* Grid 2: About Links (15%) */}
          <div className="col-span-1 text-left">
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">Services</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Careers</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Help</a>
              </li>
            </ul>
          </div>

          {/* Grid 3: Legal Links (15%) */}
          <div className="col-span-1 text-left">
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">Terms and Conditions</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Privacy and Policy</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Refund/Cancellation Policy</a>
              </li>
            </ul>
          </div>

          {/* Grid 4: Timings (15%) */}
          <div className="col-span-1 text-left">
            <h3 className="text-lg font-bold mb-4">Timings</h3>
            <p>10:00 AM TO 06:00 PM</p>
          </div>

          {/* Grid 5: Newsletter and Contact (40%) */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 text-left">
            <h3 className="text-lg font-bold mb-4">Join our Newsletter</h3>
            <p className="mb-4">Be the first to receive the most recent news on our deals.</p>
            <div className="flex items-center mb-6">
              <input
                type="email"
                placeholder="Email address"
                className="w-full p-2 rounded-l-lg text-black focus:outline-none bg-white"
              />
              <button className="bg-white text-blue-900 p-2 rounded-r-lg">
                <FaArrowRight className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-2">
              <p className="flex items-start">
                <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                <span className="break-words">
                  401, 8-3-6-5/1/1/4, Astral Hasini Residency, J.P. Nagar, Yella Reddy Guda, Hyderabad - 500073, Hyderabad, Telangana
                </span>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="mr-2" />
                <a href="mailto:support@meetowner.in" className="hover:underline break-words">support@meetowner.in</a>
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-2" />
                <a href="tel:+919701888071" className="hover:underline">+91 9701888071</a>
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mt-8">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-900 p-2 rounded-full hover:bg-gray-200"
          >
            <FaLinkedin className="h-5 w-5" />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-900 p-2 rounded-full hover:bg-gray-200"
          >
            <FaFacebook className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-900 p-2 rounded-full hover:bg-gray-200"
          >
            <FaInstagram className="h-5 w-5" />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-900 p-2 rounded-full hover:bg-gray-200"
          >
            <FaYoutube className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default App;