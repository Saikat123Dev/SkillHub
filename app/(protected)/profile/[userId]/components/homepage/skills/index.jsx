'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Dynamically import Slider with SSR disabled
const Slider = dynamic(() => import("react-slick").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-arrow-next`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <ChevronRight size={30} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-arrow-prev`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <ChevronLeft size={30} />
    </div>
  );
}

const Skills = ({ userId }) => {
  const [primarySkill, setPrimarySkill] = useState("");
  const [secondarySkills, setSecondarySkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const userData = await res.json();
         console.log("User data is ",userData)
        setPrimarySkill(userData.primarySkill);
        setSecondarySkills(userData.secondarySkills.split(","));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user skills:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserSkills();
    }
  }, [userId]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div id="skills" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="border-2 border-indigo-500 text-white p-2 px-6 text-3xl rounded-lg shadow-md hover:shadow-xl hover:bg-indigo-500 transition-colors duration-300 ease-in-out">
            Skills
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      {/* Primary Skill */}
      <div className="w-full my-12 px-12">
        <h1 className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
          Primary SkillSet
        </h1>
        <Slider {...settings}>
          <div className="w-36 min-w-fit h-fit flex flex-col items-center justify-center m-3 sm:m-5 rounded-lg group relative">
            <div className="w-full h-full rounded-lg border border-[#1f223c] bg-[#11152c] shadow-none shadow-gray-50">
              <div className="flex flex-col items-center justify-center gap-3 p-6">
                <div className="h-8 sm:h-10">
                  <Image
                    src={`/images/${primarySkill}.png`} // Assuming the images are named after skills
                    alt={primarySkill}
                    width={40}
                    height={40}
                    className="h-full w-auto rounded-lg"
                  />
                </div>
                <p className="text-white text-sm sm:text-lg">{primarySkill}</p>
              </div>
            </div>
          </div>
        </Slider>
      </div>

      {/* Secondary Skills */}
      <div className="w-full my-12">
        <h1 className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
          Secondary SkillSet
        </h1>
        <Marquee
          gradient={false}
          speed={80}
          pauseOnHover={true}
          pauseOnClick={true}
          delay={0}
          play={true}
          direction="left"
        >
          {secondarySkills.map((skill, id) => (
            <div
              className="w-24 min-w-fit h-fit flex flex-col items-center justify-center m-3 sm:m-5 rounded-lg group relative"
              key={id}
            >
              <div className="h-full w-full rounded-lg border border-[#1f223c] bg-[#11152c] shadow-none shadow-gray-50">
                <div className="flex flex-col items-center justify-center gap-3 p-4">
                  <div className="h-8 sm:h-10">
                    <Image
                      src={`/images/${skill}.png`} // Assuming the images are named after skills
                      alt={skill}
                      width={40}
                      height={40}
                      className="h-full w-auto rounded-lg"
                    />
                  </div>
                  <p className="text-white text-xs sm:text-lg">{skill}</p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Skills;
