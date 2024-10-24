// @flow strict
import Image from "next/image";
import AnimationLottie from "../helper/animation-lottie";
import lottieFile from '/public/lottie/study.json';
import { FaSchool, FaUniversity } from 'react-icons/fa';

function Education() {
  return (
    <>
      <div className="relative z-50 border-t my-12 lg:my-24 border-gray-700">
        <Image
          src="/section.svg"
          alt="Hero"
          width={1800}
          height={900}
          className="absolute top-0 -z-0"  // Increased opacity for subtle effect
        />
        <div className="flex justify-center">
          <div className="w-3/4">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent w-full" />
          </div>
        </div>

        {/* Title Section */}
        <div className="flex justify-center my-8 lg:py-8 ">
          <div className="flex items-center">
            <span className="w-20 h-[2px] bg-indigo-600"></span>
            <div className="flex items-center">
              <FaUniversity size={40} className=" mr-3" />
              <span className="border-2 border-indigo-500 text-black p-2 px-6 text-3xl rounded-lg shadow-lg hover:shadow-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600  transition-colors duration-300 ease-in-out">
                Education
              </span>
            </div>
            <span className="w-20 h-[2px] bg-indigo-600"></span>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Lottie Animation */}
            <div className="flex justify-center items-start">
              <div className="w-full lg:w-3/4 h-full lg:h-3/4 rounded-xl overflow-hidden shadow-lg">
                <AnimationLottie animationPath={lottieFile} />
              </div>
            </div>

            {/* Education Cards */}
            <div>
              <div className="flex flex-col gap-6">
                {/* Class 10th Card */}
                <div className="p-6  rounded-lg shadow-2xl border over:shadow-3xl transition-shadow duration-300 transform hover:scale-105 overflow-hidden border-t-[2px] border-indigo-900 bg-slate-700 px-4 lg:px-8 py-4 lg:py-8">
                  <div className="flex justify-center mb-8 gap-4">
                    <FaSchool size={32} className="text-gray-200" />
                    <p className="text-2xl text-gray-300 font-semibold">
                      Class 10th
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl text-gray-200 font-bold uppercase">
                      Sainik School Purulia
                    </p>
                    <p className="text-md text-gray-100 mt-2">
                      Achieved a score of <span className="text-indigo-400 font-bold">89.99%</span>
                    </p>
                  </div>
                </div>

                {/* Class 12th Card */}
                <div className="p-6  rounded-lg shadow-2xl border over:shadow-3xl transition-shadow duration-300 transform hover:scale-105 overflow-hidden border-t-[2px] border-indigo-900 bg-slate-700 px-4 lg:px-8 py-4 lg:py-8">
                  <div className="flex justify-center mb-8 gap-4">
                    <FaSchool size={32} className="text-gray-200" />
                    <p className="text-2xl text-gray-300 font-semibold">
                      Class 12th
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl text-gray-200 font-bold uppercase">
                      Holy Garden Model School
                    </p>
                    <p className="text-md text-gray-200 mt-2">
                      Achieved a score of <span className="text-indigo-400 font-bold">89.99%</span>
                    </p>
                  </div>
                </div>

                {/* College Card */}
                <div className="p-6  rounded-lg shadow-2xl border over:shadow-3xl transition-shadow duration-300 transform hover:scale-105 overflow-hidden border-t-[2px] border-indigo-900 bg-slate-700 px-4 lg:px-8 py-4 lg:py-8">
                  <div className="flex justify-center mb-8 gap-4">
                    <FaUniversity size={32} className="text-gray-400" />
                    <p className="text-2xl text-gray-300 font-semibold">
                      College Details
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl text-gray-200 font-bold uppercase">
                      Jalpaiguri Government Engineering College
                    </p>
                    <p className="text-md text-gray-200">
                      Year: <span className="text-indigo-400 font-bold">2021-2025</span>
                    </p>
                    <p className="text-md text-gray-200">
                      Department: <span className="text-indigo-400 font-bold">Computer Science</span>
                    </p>
                    <p className="text-md text-gray-200">
                      Field of Study: <span className="text-indigo-400 font-bold">B.Tech</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Education;
