// @flow strict
"use client";

import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaFacebook, FaTwitterSquare } from "react-icons/fa";
import { RiContactsFill } from "react-icons/ri";
import { SiLeetcode } from "react-icons/si";
import { useState } from "react";
import { useCurrentUser } from "../../../../../../../hooks/use-current-user";


function HeroSection({ profileUserId }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [purpose, setPurpose] = useState("collaboration");
  const [skills, setSkills] = useState("");
  const session = useCurrentUser(); // Get the logged-in user's session

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Connection request sent! with credentials");
  };

  const handlePreview = () => {
    alert(`Message: ${message}\nPurpose: ${purpose}\nSkills: ${skills}`);
  };

  const connectRequest = async () => {
    const senderId = session?.id; // Ensure senderId is defined
    if (!senderId) {
      alert("Error: User is not logged in.");
      return;
    }
    
    try {
      const response = await fetch("/api/connect/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: profileUserId, senderId }),
      });
      
      // Log response for debugging
      console.log("Response:", response);
  
      if (response.ok) {
        alert("Connection request sent successfully!");
      } else {
        const errorData = await response.json(); // Assuming the response is JSON
        console.error("Error Response:", errorData);
        alert(`Failed to send connection request: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert("Error sending connection request.");
    }
  };
  
  const isOwnProfile = profileUserId == session.id
  
  return (
    <section className="relative flex flex-col items-center justify-between py-4 lg:py-12">
      <Image
        src="/hero.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute -top-[98px] -z-10"
      />

      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        <div className="order-2 lg:order-1 flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10">
          <h1 className="text-3xl font-bold leading-10 text-white md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
            Hello, <br />
            This is <span className=" text-pink-500">{personalData.name}</span>
            {` , I'm a Professional `}
            <span className=" text-[#16f2b3]">{personalData.designation}</span>.
          </h1>

          <div className="my-12 flex items-center gap-5">
            <Link
              href="./github"
              target="_blank"
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <BsGithub size={35} />
            </Link>
            <Link
              href="./linkedin"
              target="_blank"
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <BsLinkedin size={35} />
            </Link>
            <Link
              href="./facebook"
              target="_blank"
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <FaFacebook size={35} />
            </Link>
            <Link
              href="./leetcode"
              target="_blank"
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <SiLeetcode size={35} />
            </Link>
            <Link
              href="./twitter"
              target="_blank"
              className="transition-all text-pink-500 hover:scale-125 duration-300"
            >
              <FaTwitterSquare size={35} />
            </Link>
          </div>

          <div className="flex ml-32 items-center gap-3">
            <div className="relative inline-block text-left">
              <div className="flex items-center bg-gradient-to-r to-pink-500 from-violet-600 p-[1px] rounded-full">
                {/* Conditional rendering for Connect or Edit button */}
                {isOwnProfile ? (
                  <Link href="/edit-profile">
                    <button
                      className="px-3 text-xs md:px-8 py-3 md:py-4 bg-gradient-to-r to-pink-500 from-violet-600 rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out md:font-semibold"
                      id="editButton"
                    >
                      EDIT PROFILE
                    </button>
                  </Link>
                ) : (
                  <>
                    <button
                      className="px-3 text-xs md:px-8 py-3 md:py-4 bg-gradient-to-r to-pink-500 from-violet-600 rounded-l-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out md:font-semibold"
                      id="connectButton"
                      onClick={connectRequest}
                    >
                      CONNECT
                    </button>

                    {/* Divider Line */}
                    <div className="w-[1px] h-8 bg-white"></div>

                    {/* Dropdown Icon Button */}
                    <button
                      className="p-3 md:py-4  rounded-r-full border-none text-center  transition-all duration-200 ease-out flex items-center justify-center"
                      onClick={handleDropdownToggle}
                    >
                      <RiContactsFill size={16} className="text-white" />
                    </button>
                  </>
                )}
              </div>

              {!isOwnProfile && isDropdownOpen && (
                <div
                  id="dropdown"
                  className="absolute right-0 z-10 mt-2 w-64 rounded-lg shadow-xl bg-gradient-to-br from-indigo-50 via-white to-indigo-100 ring-1 ring-indigo-200 ring-opacity-50 transition-transform duration-300 transform scale-95 origin-top-right"
                >
                  <div className="py-4 px-5 bg-white bg-opacity-90 rounded-lg">
                    <form
                      id="connectionForm"
                      className="p-4 bg-white bg-opacity-90 rounded-lg shadow-md border border-gray-200"
                      onSubmit={handleFormSubmit}
                    >
                      <textarea
                        id="message"
                        rows="4"
                        maxLength="300"
                        placeholder="Provide a brief description of the project..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      ></textarea>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Collaboration Purpose
                        </label>
                        <select
                          id="purpose"
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="collaboration">Open-Source Project</option>
                          <option value="skill-sharing">Hackathon Team</option>
                          <option value="mentorship">Startup</option>
                          <option value="networking">Research</option>
                          <option value="discussion">Others</option>
                        </select>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Skills or Topics of Mutual Interest (optional)
                        </label>
                        <input
                          type="text"
                          id="skills"
                          placeholder="e.g., JavaScript, UX Design"
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="submit"
                          className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-full px-5 py-2 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                          Send Request
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <Image
            src={personalData.imageUrl}
            alt="profile"
            width={250}
            height={250}
            className="rounded-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
