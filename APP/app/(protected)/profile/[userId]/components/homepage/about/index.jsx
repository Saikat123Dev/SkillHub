// @flow strict

import { personalData } from '@/utils/data/personal-data';
import Image from "next/image";
import Education from '../../education/page';
import Experience from '../../experience/page';

function AboutSection({details}) {

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
            {details && details.about?details.about:"Write about Yourself"}
          </p>
        </div>
        
        {/* Image Section */}
        <div className="flex justify-center order-1 lg:order-2">
  <div className="relative">
    {details && details.profilePic ? (
      <Image
        src={details.profilePic}
        width={280}
        height={280}
        alt="Abu Said"
        className="rounded-lg transition-all duration-1000  hover:scale-105 shadow-md hover:shadow-xl cursor-pointer"
      />
    ) : (
      <h1>Upload your Profile Picture</h1>
    )}
  </div>
</div>

      </div>
      
    
     
      
    </div>
    </div>
  );
}

export default AboutSection;
