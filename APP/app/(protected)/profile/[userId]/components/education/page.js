import Image from "next/image";
import AnimationLottie from "../helper/animation-lottie";
import lottieFile from "/public/lottie/study.json";
import { FaSchool, FaUniversity } from "react-icons/fa";

function Education({ details }) {
  return (
    <div className="relative z-50 border-t my-12 lg:my-24 border-gray-300  to-gray-900 text-gray-100">
      {/* Background Section SVG */}
      <Image
        src="/section.svg"
        alt="Background Design"
        width={1800}
        height={900}
        className="absolute top-0 left-0 -z-10 opacity-20"
      />

      {/* Title Section */}
      <div className="flex justify-center items-center py-8">
        <div className="flex items-center gap-4">
          <span className="w-12 lg:w-20 h-[2px] bg-indigo-600"></span>
          <div className="flex items-center gap-3">
            <FaUniversity size={40} className="text-indigo-500" />
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-600">
              Education
            </h2>
          </div>
          <span className="w-12 lg:w-20 h-[2px] bg-indigo-600"></span>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 lg:px-20">
        {/* Lottie Animation */}
        <div className="flex justify-center items-center">
          <div className="w-full lg:w-3/4 rounded-xl overflow-hidden shadow-lg">
            <AnimationLottie animationPath={lottieFile} />
          </div>
        </div>

        {/* Education Cards */}
        <div className="space-y-10">
          {/* Class 10th Card */}
          <div className="p-6 rounded-lg shadow-lg bg-gray-800 border border-indigo-600 hover:shadow-2xl transition-transform transform hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <FaSchool size={32} className="text-indigo-400" />
              <h3 className="text-2xl font-semibold">Class 10th</h3>
            </div>
            <p className="text-lg">
              <strong>School:</strong>{" "}
              {details?.class10 || "Enter your School's Name"}
            </p>
            <p className="text-lg">
              <strong>Score:</strong>{" "}
              <span className="text-indigo-400">
                {details?.percentage_10 || "Enter your percentage marks"}
              </span>
            </p>
          </div>

          {/* Class 12th Card */}
          <div className="p-6 rounded-lg shadow-lg mt-3 bg-gray-800 border border-indigo-600 hover:shadow-2xl transition-transform transform hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <FaSchool size={32} className="text-indigo-400" />
              <h3 className="text-2xl font-semibold">Class 12th</h3>
            </div>
            <p className="text-lg">
              <strong>School:</strong>{" "}
              {details?.class12 || "Enter your School's Name"}
            </p>
            <p className="text-lg">
              <strong>Score:</strong>{" "}
              <span className="text-indigo-400">
                {details?.percentage_12 || "Enter your percentage marks"}
              </span>
            </p>
          </div>

          {/* College Card */}
          <div className="p-6 rounded-lg mt-4 shadow-lg bg-gray-800 border border-indigo-600 hover:shadow-2xl transition-transform transform hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <FaUniversity size={32} className="text-indigo-400" />
              <h3 className="text-2xl font-semibold">College Details</h3>
            </div>
            <p className="text-lg">
              <strong>College:</strong>{" "}
              {details?.college || "Enter your College's Name"}
            </p>
            <p className="text-lg">
              <strong>Current Year:</strong>{" "}
              <span className="text-indigo-400">
                {details?.currentYear || "Enter your Current Year"}
              </span>
            </p>
            <p className="text-lg">
              <strong>Department:</strong>{" "}
              <span className="text-indigo-400">
                {details?.dept || "Enter your Current Department"}
              </span>
            </p>
            <p className="text-lg">
              <strong>Field of Study:</strong>{" "}
              <span className="text-indigo-400">
                {details?.domain || "Enter your Current Domain"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;
