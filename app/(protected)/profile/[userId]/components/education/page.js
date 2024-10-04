// @flow strict
import Image from "next/image";
import AnimationLottie from "../helper/animation-lottie";
import GlowCard from "../helper/glow-card";
import lottieFile from '/public/lottie/study.json';
import '../../css/card.scss';
import '../../css/globals.scss';
import { FaSchool } from 'react-icons/fa';
import { FaUniversity } from 'react-icons/fa';
import { FaGraduationCap } from 'react-icons/fa';



function Education() {
  return (
    <>
  
    <div  className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <Image
        src="/section.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent  w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <div className="flex flex-col items-center">
  {/* Heading with Logo */}
  <div className="flex items-center">
    <FaGraduationCap size={40} className="text-[#c2bdde] mr-3" />
    <span className="border-2 border-indigo-500 text-white p-2 px-6 text-3xl rounded-lg shadow-md hover:shadow-xl hover:bg-indigo-500 transition-colors duration-300 ease-in-out">
  Education
</span>
  </div>
  {/* Dash Underneath */}
  <div className="mt-2 w-16 h-1 bg-[#e5e2f0] rounded-full"></div>
</div>


          <span className="w-24 h-[2px] bg-[#ebe9f5]"></span>
        </div>
      </div>

      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex justify-center items-start">
            <div className="w-3/4 h-3/4">
              <AnimationLottie animationPath={lottieFile} />
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-6">
            
                
            <GlowCard>
  <div className="p-6 relative text-white bg-gradient-to-br from-[#1e1f2b] to-[#282a36] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <Image
      src="/blur-23.svg"
      alt="Hero"
      width={1080}
      height={200}
      className="absolute bottom-0 opacity-80"
    />
    <div className="flex justify-center mb-10 gap-4">
    <div >
        <FaSchool size={40} />
      </div>
      <p className="text-2xl sm:text-base text-[#16f2b3] font-semibold">
        Class 10th 
      </p>
    </div>
    <div className="flex items-center justify-center gap-4 "> {/* Increase the gap-x value */}
     
      <div>
        <p className="text-lg sm:text-2xl mb-2 font-semibold uppercase">
          Sainik School Purulia
        </p>
        <p className="text-md sm:text-lg text-gray-300">
          Achieved a score of <span className="text-white font-bold">89.99%</span>
        </p>
      </div>
    </div>
  </div>
</GlowCard>
          
<GlowCard>
  <div className="p-6 relative text-white bg-gradient-to-br from-[#1e1f2b] to-[#282a36] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <Image
      src="/blur-23.svg"
      alt="Hero"
      width={1080}
      height={200}
      className="absolute bottom-0 opacity-80"
    />
    <div className="flex justify-center mb-10 gap-4">
    <div className="mb-3" >
        <FaSchool size={40} />
      </div>
      <p className="text-2xl sm:text-base text-[#16f2b3] font-semibold">
        Class 12th 
      </p>
    </div>
    <div className="flex items-center justify-center gap-4 "> {/* Increase the gap-x value */}
     
      <div>-
        <p className="text-lg sm:text-2xl mb-2 font-semibold uppercase">
         Holy Garden Model School
        </p>
        <p className="text-lg sm:text-lg text-gray-300">
          Achieved a score of <span className="text-white font-bold">89.99%</span>
        </p>
      </div>
    </div>
  </div>
</GlowCard>

<GlowCard>
  <div className="p-6 relative text-white bg-gradient-to-br from-[#1e1f2b] to-[#282a36] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    {/* Background Image */}
    <Image
      src="/blur-23.svg"
      alt="Hero"
      width={1080}
      height={200}
      className="absolute bottom-0 opacity-80"
    />
    {/* College Details Header */}
    <div className="flex justify-center mb-2 gap-4">
      <div>
        {/* College Icon */}
        <FaUniversity size={40} />
      </div>
      <p className="text-2xl sm:text-base text-[#16f2b3] font-semibold">
        College Details
      </p>
    </div>
    {/* College Information */}
    <div className="flex items-center justify-center gap-6">
      <div>
        <p className="text-lg sm:text-2xl mb-2 font-semibold uppercase ml-9">
         Jalpaiguri Goverment Engineering College
        </p>
        <p className="text-md sm:text-lg text-gray-300">
          Year: <span className="text-white font-bold">2021-2025</span>
        </p>
        <p className="text-md sm:text-lg text-gray-300">
          Department: <span className="text-white font-bold">Computer Science</span>
        </p>
        <p className="text-md sm:text-lg text-gray-300">
          Field of Study: <span className="text-white font-bold">B.Tech</span>
        </p>
      </div>
    </div>
  </div>
</GlowCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  
   
    </>
  );
};

export default Education;