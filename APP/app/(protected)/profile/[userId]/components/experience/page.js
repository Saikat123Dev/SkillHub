'use client'
import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaBriefcase, FaBuilding } from 'react-icons/fa';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[600px]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full animate-ping"></div>
    </div>
  </div>
);

const ExperienceCard = ({ company, duration, description }) => (
  <div className="group relative">
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
    <div className="relative p-6 bg-white rounded-lg shadow-xl transform transition duration-500 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FaBuilding className="text-blue-600 text-xl" />
          <h3 className="text-2xl font-bold text-gray-800">{company}</h3>
        </div>
        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
          {duration}
        </span>
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

function Experience() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const experiences = [
    {
      company: "Goldman Sachs",
      duration: "Dec 2021 - May 2022",
      description: "As a software engineer at Goldman Sachs, I led the development of robust technology solutions supporting financial operations and trading activities. Specialized in building and optimizing systems for trading, risk management, and data analytics while ensuring security and compliance. Collaborated with cross-functional teams to deliver innovative tools enhancing decision-making across business units."
    },
    {
      company: "JPMorgan Chase",
      duration: "May 2022 - Dec 2022",
      description: "Spearheaded the development of high-performance trading platforms and risk management systems. Implemented scalable solutions for real-time data processing and analytics. Worked closely with quantitative teams to optimize algorithmic trading strategies and enhance system reliability."
    },
    {
      company: "Morgan Stanley",
      duration: "Jan 2023 - Present",
      description: "Leading the modernization of legacy systems and implementation of cloud-native solutions. Developing microservices architecture for improved scalability and maintenance. Driving technical initiatives for process automation and efficiency improvements across the platform."
    }
  ];

  return (
    <div className="relative min-h-screen border-t border-[#25213b] bg-gradient-to-b from-blue-50 to-white">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          {/* Header Section */}
          <div className="relative mb-10">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
                <div className="flex flex-col items-center mb-12 px-3 py-5 rounded-full ">
          <div className="flex items-center gap-3 mb-4">
          <FaBriefcase className=" text-2xl" />
            <h2 className="text-3xl font-bold text-gray-900">Professional Experience</h2>
          </div>
          <div className="h-1 w-20 bg-indigo-600 rounded-full" />
        </div>
              
             
            </div>
            
          </div>
         

          {/* Experience Cards Grid */}
          <div className="grid gap-8 md:grid-cols-1 lg:gap-12 max-w-4xl mx-auto">
            {experiences.map((exp, index) => (
              <ExperienceCard
                key={index}
                company={exp.company}
                duration={exp.duration}
                description={exp.description}
              />
            ))}
          </div>
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 blur-3xl opacity-20">
            <div className="aspect-square h-[400px] bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full"></div>
          </div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 blur-3xl opacity-20">
            <div className="aspect-square h-[400px] bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Experience;