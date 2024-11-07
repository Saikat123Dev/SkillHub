import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

const SkillCard = ({ skill, size = 'medium' }) => (
  <div
    className={`
      transform transition-all duration-300 hover:scale-105
      ${size === 'large' ? 'w-48' : 'w-32'}
      mx-4 rounded-xl overflow-hidden
    `}
  >
    <div className="
      bg-white border border-gray-200 hover:border-indigo-500
      p-6 h-full flex flex-col items-center justify-center gap-4
      transition-all duration-300
    ">
      <div className={`
        relative
        ${size === 'large' ? 'h-16 w-16' : 'h-12 w-12'}
      `}>
        <Image
          src={`/images/${skill}.png`}
          alt={skill}
          fill
          className="object-contain"
        />
      </div>
      <p className="text-gray-800 font-medium text-center">
        {skill}
      </p>
    </div>
  </div>
);

const Skills = ({ userId }) => {
  const [primarySkill, setPrimarySkill] = useState('');
  const [secondarySkills, setSecondarySkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const userData = await res.json();
        setPrimarySkill(userData.primarySkill);
        setSecondarySkills(userData.secondarySkills.split(','));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Primary Skills Section */}
        <div className="mt-16">
          <h3 className="text-xl font-medium text-indigo-500 mb-8 uppercase tracking-wider">
            Primary Expertise
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkillCard skill={primarySkill} size="large" />
          </div>
        </div>

        {/* Secondary Skills Section */}
        <div className="mt-24">
          <h3 className="text-xl font-medium text-indigo-500 mb-8 uppercase tracking-wider">
            Secondary Skills
          </h3>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              className="py-4"
            >
              {secondarySkills.map((skill, idx) => (
                <SkillCard key={idx} skill={skill} />
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;