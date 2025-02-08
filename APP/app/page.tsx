'use client'
import React, { useState } from 'react';

import { Search, Users, BookOpen, Play, ChevronDown } from 'lucide-react';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import Link from 'next/link';
import { Button } from '@/components/ui/moving-border';
import { Facebook, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import search from '@/public/image/search.png'
import join from '@/public/image/join.png'
import meet from '@/public/image/meet.png'

const NavBar = () => (
  
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <div className="text-xl font-bold">ConnectAll</div>
        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-900">Profile</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Search</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Groups</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Projects</a>
        </div>
        <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors">
          Join Now
        </button>
      </div>
    </div>
  </nav>
);

const Hero = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoClick = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Overlay Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Content */}
        <div className="relative lg:w-1/2 flex items-center px-6 lg:px-16 py-20">
          <div className="relative z-10 max-w-2xl mx-auto lg:mx-0">
            
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8">
              <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                Connect.
              </span>
              <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Showcase.
              </span>
              <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Collaborate.
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                Succeed.
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Transform your digital presence with our cutting-edge platform. 
              Connect with industry leaders, showcase your expertise, and drive success.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-600 transition-all transform hover:translate-y-[-2px] hover:shadow-lg">
                Get Started
              </button>
              <Button
                borderRadius="1.75rem"
                className="dark:bg-slate-900 border-neutral-200 dark:border-slate-800 font-bold transform transition-transform duration-300 hover:scale-95"
              >
                <Link href="/auth/register" className="text-white px-1 py-1 md:px-1 md:py-1 rounded-full">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Video */}
        <div className="relative lg:w-1/2 flex items-center justify-center p-6 lg:p-16">
          <div className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-2xl relative group">
            <div 
              className="absolute inset-0 cursor-pointer transform transition-transform hover:scale-[1.02]"
              onClick={handleVideoClick}
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0"
                title="Promotional Video"
                allow="autoplay; encrypted-media"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <Play size={72} className="text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToNextSection}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 hover:text-white/80 transition-colors"
      >
        <ChevronDown size={32} className="animate-bounce" />
      </button>
    </div>
  );
};

const FeatureSection = () => (
  <div className="bg-white py-12 sm:py-24">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Seamless Integration, Comprehensive Profiles, Endless Opportunities
        </h2>
        <p className="mt-6 text-xl text-gray-500">
          Showcase talents, connect, and collaborate professionally.
        </p>
        <div className="mt-8">
          <div className="inline-flex rounded-md shadow">
            <a href="#" className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-5 py-3 text-base font-medium text-white hover:bg-green-700">
              Get Started
            </a>
          </div>
          <div className="inline-flex ml-3">
            <a href="#" className="inline-flex items-center justify-center rounded-md border border-transparent text-base font-medium text-green-600 hover:text-green-500">
              Learn More
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 lg:mt-0">
        <img className="w-full rounded-lg shadow-xl" src={join.src} alt="Profile integration"/>
      </div>
    </div>
  </div>
  <div className="bg-white py-12 sm:py-24">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
    <div className="mt-12 lg:mt-0">
        <img className="w-full rounded-lg shadow-xl" src={search.src} alt="Profile integration"/>
      </div>
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Skill-Based Search Simplified
        </h2>
        <p className="mt-6 text-xl text-gray-500">
          Find users by specific talents with our advanced search feature.
        </p>
        <div className="mt-8">
          <div className="inline-flex rounded-md shadow">
            <a href="#" className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-5 py-3 text-base font-medium text-white hover:bg-green-700">
              Try Now
            </a>
          </div>
          <div className="inline-flex ml-3">
            <a href="#" className="inline-flex items-center justify-center rounded-md border border-transparent text-base font-medium text-green-600 hover:text-green-500">
              More Info
            </a>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Seamless Integration, Comprehensive Profiles, Endless Opportunities
        </h2>
        <p className="mt-6 text-xl text-gray-500">
          Showcase talents, connect, and collaborate professionally.
        </p>
        <div className="mt-8">
          <div className="inline-flex rounded-md shadow">
            <a href="#" className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-5 py-3 text-base font-medium text-white hover:bg-green-700">
              Get Started
            </a>
          </div>
          <div className="inline-flex ml-3">
            <a href="#" className="inline-flex items-center justify-center rounded-md border border-transparent text-base font-medium text-green-600 hover:text-green-500">
              Learn More
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 lg:mt-0">
        <img className="w-full rounded-lg shadow-xl" src={meet.src} alt="Profile integration"/>
      </div>
    </div>
  </div>
  
</div>


);



const TestimonialCard = ({ testimonials}) => (
  <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
      
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
);

const Features = ({testimonials}) => (
  <div>
 <div className="bg-gray-900 text-white py-20">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center mb-16">Boost Your Professional Network</h2>
    <InfiniteMovingCards
      
      items={testimonials}
      direction="right"
      speed="slow"
    />
  </div>
</div>
  
  </div>
);

const Footer = () => (
  <footer className="bg-white shadow-lg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-6">
          <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-black dark:text-white">TeamMadeEasy</h2>
              <p className="mt-2 mb-2 text-zinc-400 dark:text-zinc-300">
                Connect, Collaborate, Grow Together
              </p>
              {/* Button component */}
              <Button
                borderRadius="1.75rem"
                className="dark:bg-slate-900 border-neutral-200 dark:border-slate-800 font-bold transform transition-transform duration-300 hover:scale-95"
              >
                <Link href="/auth/register" className="text-white px-1 py-1 md:px-1 md:py-1 rounded-full">Join Now</Link>
              </Button>
            </div>
            
            <div className="flex space-x-6">
              <SocialLink 
                href="https://github.com/jwoc-jgec" 
                icon={<Github className="w-8 h-8 text-gray-500 hover:text-blue-600" />} 
                label="GitHub" 
              />
              <SocialLink 
                href="https://discord.gg/7xwWUTdb" 
                icon={<DiscordIcon className="w-8 h-8 text-gray-500 hover:text-blue-600" />} 
                label="Discord" 
              />
             
              <SocialLink 
                href="https://www.linkedin.com/company/jwoc" 
                icon={<Linkedin className="w-8 h-8 text-gray-500 hover:text-blue-600" />} 
                label="LinkedIn" 
              />
            </div>
            
            <p className="text-xs text-gray-500">
              © JWoC {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>
          
          {/* Archives Section */}
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-gray-50 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Archives
              </h2>
              
              <ArchiveLink year="2024" link="https://jwoc-5.vercel.app/" />
              <ArchiveLink year="2023" link="https://jwoc-2k23.vercel.app/" />
              <ArchiveLink year="2022" link="https://jwoc-2k22.vercel.app/" />
              <ArchiveLink year="2021" link="https://jwoc-2k21.vercel.app/" />
              <ArchiveLink year="2020" link="https://jwoc-2k20.vercel.app/" />
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="flex justify-center">
            <form 
             
              className="w-full max-w-xs bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
                Contact Us
              </h3>

              <div className="space-y-4">
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                   
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                   
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                   
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Your message here..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send Message
                </button>

                {status && (
                  <p className={`text-center text-sm mt-2 ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {status}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </footer>
);

const SocialLink = ({ href, icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="transition transform hover:scale-110"
    aria-label={label}
  >
    {icon}
  </a>
);

const ArchiveLink = ({ year, link }) => (
  <div className="mb-4 group">
    <a 
      href={link} 
      className="flex items-center text-gray-700 hover:text-blue-600 transition"
    >
      <span className="mr-2 opacity-0 group-hover:opacity-100 transition">→</span>
      Jwoc {year}
    </a>
  </div>
);

const DiscordIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="currentColor" {...props}>
    <path d="M41.625 10.77C37.645 7.566 31.348 7.023 31.078 7.004c-.418-.036-.817.199-.988.586-.016.024-.152.34-.304.832 2.633.446 5.867 1.34 8.793 3.156.469.29.613.906.324 1.375a1.06 1.06 0 0 1-1.53.153C37.492 10.156 31.211 10 25 10c-6.21 0-12.496.156-17.523 3.277-.469.293-1.086.148-1.375-.32-.293-.472-.148-1.086.32-1.375C14.348 9.766 17.582 8.868 20.215 8.426 20.062 7.93 19.926 7.617 19.914 7.59c-.176-.387-.57-.63-.992-.586-.27.02-6.566.563-10.601 3.809C6.215 12.762 2 24.152 2 34c0 .176.047.344.133.496 2.906 5.11 10.84 6.445 12.648 6.504h.03c.32 0 .621-.152.808-.41l1.828-2.516C12.516 36.8 9.996 34.637 9.852 34.508c-.414-.364-.453-.996-.086-1.41.363-.414.996-.453 1.41-.086.059.055 4.7 3.993 13.824 3.993 9.14 0 13.78-3.954 13.828-3.993.414-.36 1.043-.324 1.41.094.364.414.324 1.043-.086 1.41-.144.129-2.664 2.293-7.598 3.566l1.828 2.516c.188.258.488.41.808.41h.031c1.808-.059 9.742-1.395 12.648-6.504.086-.152.133-.32.133-.496 0-9.848-4.215-21.238-6.375-23.23zM18.5 30c-1.934 0-3.5-1.79-3.5-4s1.566-4 3.5-4 3.5 1.79 3.5 4-1.566 4-3.5 4zm13 0c-1.934 0-3.5-1.79-3.5-4s1.566-4 3.5-4 3.5 1.79 3.5 4-1.566 4-3.5 4z" />
  </svg>
);

const App = () => {
  const testimonials = [
    {
      name: "Advanced Search",
      title: "Find and connect with professionals based on skills and expertise.",
      icon:    <Search className="w-12 h-12 text-green-500 mb-4" />
    },
    {
   
      name: "Group Collaboration",
      title: "Create or join groups for real-time discussions and projects.",
      icon:    <Users className="w-12 h-12 text-green-500 mb-4" />
    },
    {
    
      name: "Skill Validation",
      title: "Verify your expertise with certificates and peer endorsements.",
      icon:    <BookOpen className="w-12 h-12 text-green-500 mb-4" />
    },
    {
      quote:
        "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
      name: "Herman Melville",
      title: "Moby-Dick",
    },
  ];
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Hero />
      <FeatureSection />
      <Features testimonials={testimonials}/>
     
      <Footer />
    </div>
  );
};

export default App;