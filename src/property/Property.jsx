import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import PropertyHeader from "./PropertyHeader";
import PropertyBody from "./PropertyBody";
import PropertyAds from "./PropertyAds";
import { ToastContainer } from "react-toastify";
import Breadcrumb from "../utilities/BreadCrumb";

const Property = () => {

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PropertyHeader setHeaderHeight={setHeaderHeight} />
      <div
        className="flex flex-col lg:flex-row w-full justify-between h-auto p-3 gap-3"
        style={{ paddingTop: `${headerHeight || 80}px` }}
      >
        <div className="w-full  lg:w-[70%]">
          <Breadcrumb />
          <PropertyBody />
        </div>
        <div className="hidden lg:block w-[30%]">
          <PropertyAds />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Footer />
    </>
  );
};

export default Property;
