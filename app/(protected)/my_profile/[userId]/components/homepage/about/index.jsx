// @flow strict

import { personalData } from '@/utils/data/personal-data';
import Image from "next/image";
import Education from '../../education/page';
import Experience from '../../experience/page';

function AboutSection() {
  return (
    <div id="about" className="my-12 lg:my-16 relative overflow-hidden"> {/* Added overflow-hidden to prevent side-scrolling */}
      <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8 max-w-[100vw]"> {/* Ensured max-width does not exceed viewport */}
        <span className="border-2 border-indigo-500 text-white rotate-90 p-2 px-6 text-3xl rounded-lg shadow-md hover:shadow-xl hover:bg-indigo-500 transition-colors duration-300 ease-in-out">
          About Me
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-[100%] overflow-hidden"> {/* Constrain grid width */}
        <div className="order-2 lg:order-1">
          <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
            Who I am?
          </p>
          <p className="text-gray-200 text-sm lg:text-lg">
            {personalData.description}
          </p>
        </div>
        <div className="flex justify-center order-1 lg:order-2">
          <Image
            src={personalData.profile}
            width={280}
            height={280}
            alt="Abu Said"
            className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer"
          />
        </div>
      </div>
      <Education />
      <Experience />
    </div>
  );
}

export default AboutSection;
