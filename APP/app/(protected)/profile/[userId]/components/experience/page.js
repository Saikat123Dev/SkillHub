'use client'
import { getExperiences } from '@/actions/experience';
import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaBriefcase, FaBuilding,FaStar} from 'react-icons/fa';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[600px]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full animate-ping"></div>
    </div>
  </div>
);

const ExperienceCard = ({ company, duration, description, roles }) => (
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
      
      <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
      
      {roles && roles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Roles & Responsibilities</h4>
          <div className="flex flex-wrap gap-2">
            {roles.map((role, index) => (
              <div 
                key={index}
                className="flex items-center space-x-1 px-3 py-1 bg-indigo-50 rounded-full"
              >
                <FaStar className="text-indigo-500 text-sm" />
                <span className="text-indigo-700 text-sm font-medium">{role}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
function Experience({ userId }) {
  // console.log(params);
  const [isLoading, setIsLoading] = useState(true);
  const[Experiences,setExperiences]=useState([])

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        const fetchedExperiences = await getExperiences(userId);
        console.log('fetchedExperiences',fetchedExperiences)
        const transformedExperiences = fetchedExperiences.getExperiences.map(exp => ({
          ...exp,
          role: exp.role ? exp.role.split(',').map(tech => tech.trim()) : []
        }));
        setExperiences(transformedExperiences);
        console.log(Experiences);
        
      } catch (error) {
        setError("Failed to fetch projects");
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, [userId]);

 

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
         

          <div className="grid gap-8 md:grid-cols-1 lg:gap-12 max-w-4xl mx-auto">
            {Experiences.map((exp, index) => (
              <ExperienceCard
                key={index}
                company={exp.company}
                duration={exp.duration}
                description={exp.description}
                roles={exp.role}
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