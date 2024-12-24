import Image from "next/image";

function AboutSection({ details }) {
  return (
    <div className="relative w-full border-t border-[#25213b]  bg-gradient-to-b from-blue-50 to-white">
      {/* Background Image with adjusted positioning */}
     

      {/* Main Content Container */}
      <div className="relative z-10">
        <div className="border-t border-[#25213b] mx-6">
          <div id="about" className="my-12 lg:my-20 relative">
            {/* Decorative "About Me" Text for larger screens */}
            <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8">
              <span className="border-2 border-indigo-500 text-black rotate-90 p-2 px-6 text-3xl rounded-lg shadow-lg hover:shadow-xl hover:bg-indigo-500 hover:text-white transition-colors duration-300 ease-in-out truncate max-w-[200px]">
                About Me
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-full items-center">
              {/* Text Section */}
              <div className="order-2 lg:order-1 max-w-full">
                <h2 className="font-bold mb-4 text-indigo-600 text-3xl uppercase tracking-wide truncate">
                  Who I Am
                </h2>
                <div className="overflow-hidden">
                  <p className="text-gray-700 text-md lg:text-xl leading-relaxed mb-6 break-words">
                    {details?.about ?? 
                      "Write about yourself. Let people know what makes you unique."}
                  </p>
                </div>
              </div>

              {/* Profile Picture Section */}
              <div className="flex justify-center order-1 lg:order-2">
                <div className="relative">
                  {details?.profilePic ? (
                    <div className="w-56 h-56 rounded-lg overflow-hidden">
                      <Image
                        src={details.profilePic}
                        width={280}
                        height={450}
                        alt="Profile Picture"
                        className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-105 shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-56 h-56 bg-gray-200 rounded-lg shadow-inner">
                      <span className="text-gray-500 text-lg text-center px-4">
                        Upload Your Profile Picture
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;