import React from "react";
import UpcomingProjects from "./Upcoming";
import UpcomingAds from "./UpcomingAds";

export default function UpcomingWrapper() {
  return (
    <div className="max-w-5xl mx-auto mt-10 flex justify-center gap-6">
      <UpcomingProjects />

      <UpcomingAds />
    </div>
  );
}
