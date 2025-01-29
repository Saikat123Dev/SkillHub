"use client"; // This line marks the component as a client component
import { useEffect, useState } from "react";
import { Education } from "./components/education/page";
import Experience from "./components/experience/page";
import AboutSection from "./components/homepage/about";
import HeroSection from "./components/homepage/hero-section";
import Skills from "./components/homepage/skills";




const HomePage = ({ params }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = params; // Extract userId from the URL params
  // Fetch the user profile data from the backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return; // If userId is not available, exit early
      console.log("user id is ", userId);
      setLoading(true);
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        console.log("data", data);
        setUserProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return (
    <div className="flex flex-col  ">
      
      <div className="flex-grow">
        <HeroSection details={userProfile} profileUserId={userId} />
        <AboutSection details={userProfile} />
        <Education details={userProfile} />
        <Skills userId={userId} />
        <Experience userId={userId} />
        <div>
        
      </div>
       
      
      </div>
     
     
    </div>
  );
};

export default HomePage;
