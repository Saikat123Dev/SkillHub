'use client'
import { skillsData } from "@/utils/data/skills";
import { skillsImage } from "@/utils/skill-image";
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

function Skills() {
  const [slickCssLoaded, setSlickCssLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import CSS files
    import("slick-carousel/slick/slick.css");
    import("slick-carousel/slick/slick-theme.css").then(() => setSlickCssLoaded(true));
  }, []);

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
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (!slickCssLoaded) {
    return <p>Loading...</p>; // Or any loading indicator you prefer
  }

  return (
    <div id="skills" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <style jsx global>{`
        .custom-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex !important;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .custom-arrow:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .custom-arrow-prev {
          left: -50px;
        }
        .custom-arrow-next {
          right: -50px;
        }
        .slick-dots li button:before {
          color: #16f2b3 !important;
        }
        .slick-dots li.slick-active button:before {
          color: #16f2b3 !important;
        }
        @media (max-width: 1024px) {
          .custom-arrow-prev {
            left: -30px;
          }
          .custom-arrow-next {
            right: -30px;
          }
        }
        @media (max-width: 640px) {
          .custom-arrow-prev {
            left: -20px;
          }
          .custom-arrow-next {
            right: -20px;
          }
        }
      `}</style>

      {/* Background effect */}
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>

      {/* Horizontal line */}
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      {/* Skills title */}
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="border-2 border-indigo-500 text-white p-2 px-6 text-3xl rounded-lg shadow-md hover:shadow-xl hover:bg-indigo-500 transition-colors duration-300 ease-in-out">
  Skills
</span>


          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      {/* Primary SkillSet */}
      <div className="w-full my-12 px-12">
        <h1 className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
          Primary SkillSet
        </h1>
        <Slider {...settings}>
          {skillsData.map((skill, id) => (
           <div
           className="w-36 min-w-fit h-fit flex flex-col items-center justify-center transition-all duration-500 m-3 sm:m-5 rounded-lg group relative hover:scale-[1.15] cursor-pointer"
           key={id}
         >
              <div className="w-full h-full rounded-lg border border-[#1f223c] bg-[#11152c] shadow-none shadow-gray-50 group-hover:border-violet-500 cursor-pointer transition-all duration-500">
                <div className="flex -translate-y-[1px] justify-center">
                  <div className="w-3/4">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 p-6">
                  <div className="h-8 sm:h-10">
                    <Image
                      src={skillsImage(skill)?.src}
                      alt={skill}
                      width={40}
                      height={40}
                      className="h-full w-auto rounded-lg"
                    />
                  </div>
                  <p className="text-white text-sm sm:text-lg">{skill}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Secondary SkillSet */}
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
          {skillsData.map((skill, id) => (
            <div
              className="w-24 min-w-fit h-fit flex flex-col items-center justify-center transition-all duration-500 m-3 sm:m-5 rounded-lg group relative hover:scale-[1.15] cursor-pointer"
              key={id}
            >
              <div className="h-full w-full rounded-lg border border-[#1f223c] bg-[#11152c] shadow-none shadow-gray-50 group-hover:border-violet-500 transition-all duration-500">
                <div className="flex -translate-y-[1px] justify-center">
                  <div className="w-3/4">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 p-6">
                  <div className="h-8 sm:h-10">
                    <Image
                      src={skillsImage(skill)?.src}
                      alt={skill}
                      width={40}
                      height={40}
                      className="h-full w-auto rounded-lg"
                    />
                  </div>
                  <p className="text-white text-sm sm:text-lg">{skill}</p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export default Skills;