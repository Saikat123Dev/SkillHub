"use client";

import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { FaTwitterSquare } from "react-icons/fa";
import { RiContactsFill } from "react-icons/ri";
import { SiLeetcode } from "react-icons/si";
import { useState, useEffect } from "react";
import { useCurrentUser } from "../../../../../../../hooks/use-current-user";
import { AllGroups } from "@/actions/group";


function HeroSection({ details, profileUserId }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [purpose, setPurpose] = useState("collaboration");
  const [skills, setSkills] = useState("");
  const [notification, setNotification] = useState(null);
  const session = useCurrentUser();
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState("");
  const [groupname, setGroupname] = useState("");
  useEffect(() => {
    const loadGroups = async () => {
      if (session?.id) {
        const fetchedGroups = await AllGroups(session.id);
        setGroups(fetchedGroups);
      }
    };
    loadGroups();
  }, [session]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const connectRequest = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const senderId = session?.id;
    if (!senderId) {
      setNotification({
        type: "error",
        message: "Error: User is not logged in.",
      });
      return;
    }
    try {
      const response = await fetch("/api/connect/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: profileUserId,
          senderId,
          message,
          purpose,
          skills,
          groupname,
          groupUrl: group ? `http://localhost:3000/group/${group}` : "",
        }),
      });
      if (response.ok) {
        setNotification({
          type: "success",
          message: "Connection request sent successfully!",
        });
        setIsDropdownOpen(false);
      } else {
        const errorData = await response.json();
        setNotification({
          type: "error",
          message: `Failed to send request: ${
            errorData.message || "Unknown error"
          }`,
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error sending connection request.",
      });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const isOwnProfile = profileUserId === session?.id;

  return (
    <section className="relative flex flex-col items-center justify-between py-4 lg:py-12">
      <Image
        src="/hero.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute -top-[98px] -z-10"
      />

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out z-[100] ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8">
        <div className="order-2 lg:order-1 flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10">
          <h1 className="text-3xl font-bold leading-10 text-slate-050 md:font-extrabold lg:text-[2.6rem] lg:leading-[3.5rem]">
            Hello, <br />
            This is{" "}
            <span className="text-black">
  {details && details.username ? details.username : "username"}
</span>
            {` , I'm a Professional `}
            <span className="text-[#16f2b3]">{personalData.designation}</span>.
          </h1>

          <div className="my-12 flex items-center gap-5">
            {details && details.github && (
              <Link
                href={ details.github }
                target="_blank"
                className="transition-all text-black hover:scale-125 duration-300"
              >
                <BsGithub size={35} />
              </Link>
            )}
            {details && details.linkedin &&(
              <Link
                href={details.linkedin}
                target="_blank"
                className="transition-all text-blue-400 hover:scale-125 duration-300"
              >
                <BsLinkedin size={35} />
              </Link>
            )}
            {personalData.leetcode && (
              <Link
                href={personalData.leetcode}
                target="_blank"
                className="transition-all text-yellow-400 hover:scale-125 duration-300"
              >
                <SiLeetcode size={35} />
              </Link>
            )}
            {details && details.twitter && (
              <Link
                href={details.twitter}
                target="_blank"
                className="transition-all text-black hover:scale-125 duration-300"
              >
                <FaTwitterSquare size={35} />
              </Link>
            )}
          </div>

          <div className="flex ml-32 items-center gap-3">
            <div className="relative">
              <div className="inline-flex">
                {isOwnProfile ? (
                  <Link href="/settings">
                    <button className="px-3 text-xs md:px-8 py-3 md:py-4 bg-gradient-to-r to-pink-500 from-violet-600 rounded-full border-none text-center md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out md:font-semibold">
                      EDIT PROFILE
                    </button>
                  </Link>
                ) : (
                  <div className="inline-flex rounded-full bg-gradient-to-r from-violet-600 to-pink-500 p-[1px]">
                    <button
                      onClick={handleDropdownToggle}
                      className="flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 px-3 md:px-8 py-3 md:py-4"
                    >
                      <span className="text-xs md:text-sm font-medium uppercase tracking-wider text-white">
                        CONNECT
                      </span>
                      <RiContactsFill size={16} className="text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* Dropdown Portal */}
              {!isOwnProfile && isDropdownOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto">
                  <div
                    className="fixed inset-0 bg-black bg-opacity-25"
                    onClick={handleDropdownToggle}
                  ></div>
                  <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                      <form
                        id="connectionForm"
                        className="space-y-4"
                        onSubmit={connectRequest}
                      >
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Message
                          </label>
                          <textarea
                            id="message"
                            rows="4"
                            maxLength="300"
                            placeholder="Provide a brief description of the project..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-300 ease-in-out resize-none bg-white text-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Collaboration Purpose
                          </label>
                          <select
                            id="purpose"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-300 ease-in-out bg-white text-gray-900"
                          >
                            <option value="collaboration">
                              Open-Source Project
                            </option>
                            <option value="skill-sharing">
                              Hackathon Team
                            </option>
                            <option value="mentorship">Startup</option>
                            <option value="networking">Research</option>
                            <option value="discussion">Others</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Relevant Skills
                          </label>
                          <input
                            id="skills"
                            type="text"
                            placeholder="JavaScript, React, Node.js, etc."
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-300 ease-in-out bg-white text-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Select Group (Optional)
                          </label>
                          <select
                            id="group"
                            value={group}
                            onChange={(e) => {
                              const selectedGroup = groups.find(
                                (g) => g.id === e.target.value
                              );
                              setGroupname(
                                selectedGroup ? selectedGroup.grpname : ""
                              );
                              setGroup(e.target.value);
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors duration-300 ease-in-out bg-white text-gray-900"
                          >
                            <option value="">No Group</option>
                            {groups.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.grpname}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={handleDropdownToggle}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-300 ease-in-out font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-lg shadow-md hover:from-violet-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-300 ease-in-out font-medium"
                          >
                            Send Request
                          </button>
                        </div>
                      </form>
                    </div>
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
          <div className="overflow-hidden border-t-[2px] border-indigo-900 bg-slate-700 px-4 lg:px-8 py-4 lg:py-8">
            <code className="font-mono text-xs md:text-sm lg:text-base">
              <div className="blink">
                <span className="mr-2 text-pink-500">const</span>
                <span className="mr-2 text-white">coder</span>
                <span className="mr-2 text-pink-500">=</span>
                <span className="text-gray-400">{"{"}</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-white">name:</span>
                <span className="text-gray-400">{""}</span>
                <span className="text-amber-300">Abu Said</span>
                <span className="text-gray-400">{","}</span>
              </div>
              <div className="ml-4 lg:ml-8 mr-2">
                <span className=" text-white">skills:</span>
                <span className="text-gray-400">{"["}</span>
                <span className="text-amber-300">React</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">NextJS</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">Redux</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">Express</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">NestJS</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">MySql</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">MongoDB</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">Docker</span>
                <span className="text-gray-400">{"', '"}</span>
                <span className="text-amber-300">AWS</span>
                <span className="text-gray-400">{"'],"}</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-white">
                  hardWorker:
                </span>
                <span className="text-orange-400">true</span>
                <span className="text-gray-400">,</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-white">
                  quickLearner:
                </span>
                <span className="text-orange-400">true</span>
                <span className="text-gray-400">,</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-white">
                  problemSolver:
                </span>
                <span className="text-orange-400">true</span>
                <span className="text-gray-400">,</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 mr-2 text-green-400">
                  hireable:
                </span>
                <span className="text-orange-400">function</span>
                <span className="text-gray-400">{"() {"}</span>
              </div>
              <div>
                <span className="ml-8 lg:ml-16 mr-2 text-orange-400">
                  return
                </span>
                <span className="text-gray-400">{"("}</span>
              </div>
              <div>
                <span className="ml-12 lg:ml-24 text-cyan-400">this.</span>
                <span className="mr-2 text-white">hardWorker</span>
                <span className="text-amber-300">&amp;&amp;</span>
              </div>
              <div>
                <span className="ml-12 lg:ml-24 text-cyan-400">this.</span>
                <span className="mr-2 text-white">problemSolver</span>
                <span className="text-amber-300">&amp;&amp;</span>
              </div>
              <div>
                <span className="ml-12 lg:ml-24 text-cyan-400">this.</span>
                <span className="mr-2 text-white">skills.length</span>
                <span className="mr-2 text-amber-300">&gt;=</span>
                <span className="text-orange-400">5</span>
              </div>
              <div>
                <span className="ml-8 lg:ml-16 mr-2 text-gray-400">{");"}</span>
              </div>
              <div>
                <span className="ml-4 lg:ml-8 text-gray-400">{"};"}</span>
              </div>
              <div>
                <span className="text-gray-400">{"};"}</span>
              </div>
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
