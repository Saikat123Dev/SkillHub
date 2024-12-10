import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, ChevronLeft, ChevronRight, Award, Book } from 'lucide-react';

const Skills = ({ userId }) => {
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const userData = await res.json();
        setRoles(userData.Roles);
        setSkills(userData.Skills);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user skills:', error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserSkills();
    }
  }, [userId]);

  const nextSkill = () => {
    setActiveSkillIndex((prev) => 
      prev === skills.length - 1 ? 0 : prev + 1
    );
  };

  const prevSkill = () => {
    setActiveSkillIndex((prev) => 
      prev === 0 ? skills.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen border-t border-[#25213b]  bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Header Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
            Professional Profile
          </h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Expertise & Professional Background</p>
        </div>

        {/* Roles Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3 text-gray-800">
            <Briefcase className="w-7 h-7 text-blue-500" />
            Professional Roles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.length>0 ? (roles.map((role, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-blue-100 p-3 group-hover:bg-blue-500 transition-colors duration-300">
                      <Award className="w-6 h-6 text-blue-500 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{role}</h3>
                      <div className="w-12 h-1 bg-blue-500 transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))):(
              <div className="text-center text-gray-600 text-lg p-6">No roles available 
              </div>
            )}
          </div>
        </div>

      
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3 text-gray-800">
            <Book className="w-7 h-7 text-blue-500" />
            Technical Skills
          </h2>
          <div className="relative ">
            <Card className="border-none shadow-lg  ">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={prevSkill}
                    className="p-3 rounded-full hover:bg-blue-50 transition-colors text-blue-500"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="flex-2 px-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {skills.length > 0 ? (
                      <div className="text-center transform transition-all duration-500">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                          {skills[activeSkillIndex]}
                        </h3>
                        <div className="w-32 h-1 bg-blue-500 mx-auto mb-4 transform hover:scale-x-110 transition-transform duration-300"></div>
                      </div>
                    ):(
                      <div className="text-center text-gray-500 text-lg">
                        You haven't mentioned your Skills yet.

                        </div>
                    )}
                  </div>

                  <button 
                    onClick={nextSkill}
                    className="p-3 rounded-full hover:bg-blue-50 transition-colors text-blue-500"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Skill Indicators */}
            <div className="flex justify-center mt-6 gap-3">
              {skills.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                    index === activeSkillIndex 
                      ? 'bg-blue-500 scale-110' 
                      : 'bg-gray-300 hover:bg-blue-300'
                  }`}
                  onClick={() => setActiveSkillIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;