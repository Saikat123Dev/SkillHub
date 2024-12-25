// @flow strict



import { FaGraduationCap } from 'react-icons/fa';

function Experience() {
  return (
    <>
      <div className="relative z-50 border-t my-12 lg:my-24 border-gray-700">
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
              <FaGraduationCap  size={40} className=" mr-3" />
              <span className="border-2 border-indigo-500 text-black p-2 px-6 text-3xl rounded-lg shadow-lg hover:shadow-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600  transition-colors duration-300 ease-in-out">
                Experience
              </span>
            </div>
            <span className="w-20 h-[2px] bg-indigo-600"></span>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
           

            {/* Education Cards */}
            <div>
              <div className="flex flex-col gap-6">
                {/* Class 10th Card */}
                <div className="p-6  rounded-lg shadow-2xl border over:shadow-3xl transition-shadow duration-300 transform hover:scale-105 overflow-hidden border-t-[2px] border-indigo-900 bg-slate-700 px-4 lg:px-8 py-4 lg:py-8">
                  <div className="flex justify-center mb-8 gap-4">
                  
                    <p className="text-2xl text-gray-300 font-semibold">
                    Goldman Sacs

                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl text-gray-200 font-bold uppercase">
                    2nd December 2021-1st May 2022

                    </p>
                    <p className="text-md text-gray-100 mt-2">
                    As a software engineer at Goldman Sachs, your role involves designing, developing, and maintaining robust technology solutions to support the firm's financial operations and trading activities. You will work on building and optimizing systems for trading, risk management, data analytics, and automation of financial processes. This includes developing scalable software, improving performance, and ensuring security and compliance. You'll collaborate closely with other engineers, data scientists, and business teams to deliver innovative tools that drive efficiency and enhance decision-making across various business units.

                    </p> 
                  </div>
                </div>

                {/* Class 12th Card */}
                <div className="p-6  rounded-lg shadow-2xl border over:shadow-3xl transition-shadow duration-300 transform hover:scale-105 overflow-hidden border-t-[2px] border-indigo-900 bg-slate-700 px-4 lg:px-8 py-4 lg:py-8">
                  <div className="flex justify-center mb-8 gap-4">
                   
                    <p className="text-2xl text-gray-300 font-semibold">
                    Goldman Sacs

                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl text-gray-200 font-bold uppercase">
                    2nd December 2021-1st May 2022
                    </p>
                    <p className="text-md text-gray-200 mt-2">
                    As a software engineer at Goldman Sachs, your role involves designing, developing, and maintaining robust technology solutions to support the firm's financial operations and trading activities. You will work on building and optimizing systems for trading, risk management, data analytics, and automation of financial processes. This includes developing scalable software, improving performance, and ensuring security and compliance. You'll collaborate closely with other engineers, data scientists, and business teams to deliver innovative tools that drive efficiency and enhance decision-making across various business units.
                    </p>
                  </div>
                </div>

                {/* College Card */}
                <div className="p-6  rounded-lg shadow-2xl border over:shadow-3xl transition-shadow duration-300 transform hover:scale-105 overflow-hidden border-t-[2px] border-indigo-900 bg-slate-700 px-4 lg:px-8 py-4 lg:py-8">
                  <div className="flex justify-center mb-8 gap-4">
                   
                    <p className="text-2xl text-gray-300 font-semibold">
                    Goldman Sacs
                    </p>
                  </div>
                  <div className="text-center">
                   
                    <p className="text-md text-gray-200">
                    2nd December 2021-1st May 2022
                    </p>
                    
                    <p className="text-md text-gray-200">
                    As a software engineer at Goldman Sachs, your role involves designing, developing, and maintaining robust technology solutions to support the firm's financial operations and trading activities. You will work on building and optimizing systems for trading, risk management, data analytics, and automation of financial processes. This includes developing scalable software, improving performance, and ensuring security and compliance. You'll collaborate closely with other engineers, data scientists, and business teams to deliver innovative tools that drive efficiency and enhance decision-making across various business units.
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

export default Experience;
