// @flow strict

import { personalData } from '@/utils/data/personal-data';
import Image from "next/image";
import Education from '../../education/page';
import Experience from '../../experience/page';

function AboutSection() {

  return (
    <div  className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
    <Image
      src="/section.svg"
      alt="Hero"
      width={1572}
      height={795}
      className="absolute top-0 -z-10"
    />
    <div id="about" className="my-12 lg:my-20 relative overflow-hidden "> {/* White background */}
      <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8 max-w-[100vw]">
        <span className="border-2 border-indigo-500 text-black rotate-90 p-2 px-6 text-3xl rounded-lg shadow-lg hover:shadow-xl hover:bg-indigo-500 hover:text-white transition-colors duration-300 ease-in-out">
          About Me
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-[100%]">
        {/* Text Section */}
        <div className="order-2 lg:order-1">
          <p className="font-semibold mb-3 text-indigo-600 text-2xl uppercase tracking-wide">
            Who I am?
          </p>
          <p className="text-gray-700 text-md lg:text-xl leading-relaxed mb-6">
            {personalData.description}
          </p>
        </div>
        
        {/* Image Section */}
        <div className="flex justify-center order-1 lg:order-2">
          <div className="relative">
            <Image
              src={personalData.profile}
              width={280}
              height={280}
              alt="Abu Said"
              className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-105 shadow-md hover:shadow-xl cursor-pointer"
            />
            {/* Optional Decorative Circle */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          </div>
        </div>
      </div>
      
      {/* Education & Experience Sections */}
      <div className="mt-12 lg:mt-20">
        <Education />
      </div>
      <div className="mt-12 lg:mt-16">
        <Experience />
      </div>
    </div>
    </div>
  );
}

export default AboutSection;
