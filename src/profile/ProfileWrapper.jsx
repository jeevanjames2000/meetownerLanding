import React from "react";
import Header from "../components/Header";
import ProfilePage from "../utilities/Profile";
import Footer from "../components/Footer";

const ProfileWrapper = () => {
  return (
    <>
      <Header />
      <ProfilePage />
      <Footer />
    </>
  );
};

export default ProfileWrapper;
