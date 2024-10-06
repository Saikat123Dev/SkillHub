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
import { useCurrentUser } from "../../../../../../../hooks/use-current-user"
function HeroSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [purpose, setPurpose] = useState("collaboration");
  const [skills, setSkills] = useState("");
  const [receiverId, setReceiverId] = useState("user_id_here"); // Set the receiver ID
   const session = useCurrentUser()
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
   
    const senderId = session.id
    try {
      const response = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: "66ffbe8d8c71a5afa10f17db" , senderId}),
      });

      if (response.ok) {
        alert('Connection request sent successfully!');
      } else {
        alert('Failed to send connection request.');
      }
    } catch (error) {
      alert('Error sending connection request.');
      console.error(error);
    }
  };

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
                {/* CONNECT Button */}
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
              </div>

              {isDropdownOpen && (
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
        <div className="order-1 lg:order-2 from-[#0d1224] border-[#1b2c68a0] relative rounded-lg border bg-gradient-to-r to-[#0a0d37]">
          <div className="flex flex-row">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
            <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
          </div>
          <div className="px-4 lg:px-8 py-5">
            <div className="flex flex-row space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-orange-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-200"></div>
            </div>
          </div>
          <div className="relative flex h-full w-full items-center justify-center pt-2 lg:pt-8">
            <div className="absolute lg:-left-20 hidden lg:block">
              <Image
                src="/hero-profile.svg"
                alt="Profile"
                width={210}
                height={695}
                className="lg:h-96"
              />
            </div>
            <div className="w-full px-6 lg:pr-20 flex flex-col items-center">
              <Image
                src={personalData.profilePic}
                alt="Profile Picture"
                width={280}
                height={280}
                className="relative z-10 mb-6 rounded-full object-cover shadow-lg"
              />
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {personalData.name}
              </h2>
              <p className="mt-2 text-sm text-gray-300 sm:text-base lg:text-lg">
                {personalData.description}
              </p>
              <div className="mt-6 flex space-x-4">
                <Link href="#resume">
                  <button className="px-8 py-2 text-white bg-pink-500 rounded-full">
                    Download Resume
                  </button>
                </Link>
                <Link href="#projects">
                  <button className="px-8 py-2 text-white bg-violet-600 rounded-full">
                    View Projects
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
