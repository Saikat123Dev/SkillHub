"use client"; 

import React from "react";
import { Button } from "@/components/ui/moving-border"; 
import Image from "next/image"; 
import { SparklesCore } from "@/components/ui/sparkles";
import Link from 'next/link'; 
import Article from '@/images/Article.png'; 
import communicate from '@/images/Communicate.png'; // Image import
import Badge from '@/images/Profile Badges_ 2b31e583-03f4-47bd-b406-5eba2bf79072.png'; // Image import
import Global from '@/images/Global Connecti 770a56d2-46ae-435d-abb7-3c33115e9ba8.png'; // Image import
import Skill from '@/images/Skill.png'; // Image import
import connect from '@/images/Connect.png'; // Image import
import { BackgroundGradient } from "@/components/ui/background-gradient"; // Custom background gradient component
import './page.css'; // Importing custom CSS styles for the page
import { GlobeDemo } from "@/components/globeGithub";
import { SparklesPreview } from "@/components/sparkleBackground";

export default function Widget() {
  return (
    <div className="min-h-full">
      {/* Header section */}
      <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/artistic-blurry-colorful-wallpaper-background_58702-8632.jpg')" }}>
        {/* Navigation bar */}
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 md:p-6 z-20 ">
          <div className="text-white text-xl md:text-2xl font-bold">Skill Connect</div>
          <div className="flex items-center space-x-4 md:space-x-6 text-white">
            {/* Navigation links */}
            <Link href="/profile" className="nav-link relative inline-block px-2 py-1 font-bold">Profile</Link>
            <Link href="/search" className="nav-link font-bold">Search</Link>
            <Link href="/groups" className="nav-link font-bold ">Groups</Link>
            <Link href="/projects" className="nav-link font-bold">Projects</Link>
            {/* Button component */}
            <Button borderRadius="1.5rem" className="border-neutral-200 dark:border-slate-800 transform transition-transform duration-300 hover:scale-95 px-3 py-1">
              <Link href="/auth/register" className="text-white rounded-full font-bold">Join Now</Link>
            </Button>
          </div>
        </nav>
        {/* Hero section */}

        <SparklesPreview />

        {/* Main content */}
        <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/artistic-blurry-colorful-wallpaper-background_58702-8632.jpg')" }}>
        <div className="container mx-auto px-4 py-40">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              Seamless Integration, Comprehensive Profiles, Endless Opportunities
            </h1>
            <p className="text-lg text-zinc-400 light:text-zinc-400 mt-2">
              Showcase talents, connect, and collaborate professionally.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-white light:text-white">
                Profile Integration Made Easy
              </h2>
              <p className="text-lg text-zinc-400 light:text-zinc-400 mt-2">
                Combine LinkedIn, GitHub, and certificates for a complete profile.
              </p>
              <div className="mt-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded-full mr-2 font-bold hover:bg-green-600">
                  Get Started
                </button>
                <button className="border border-zinc-300 text-zinc-700 font-bold  light:text-zinc-300 light:border-zinc-600 px-4 py-2 rounded-full hover:bg-zinc-300 light:hover:bg-zinc-600">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              {/* Image component */}
              <img
                src="https://t3.ftcdn.net/jpg/05/58/79/54/360_F_558795469_pvzp1H4yYhRSqo6hdhD00GzQMt2Vhian.jpg"
                alt="Hands together on a table"
                width={600}
                height={100}
                className="image-box w-full h-auto rounded-lg shadow-lg border-4 border-spacing-48 border-black"
              />
            </div>
          </div>
        </div>
        </div>

        {/* Feature section */}
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white-900 text-white p-6">
          <div className="md:w-1/2">
            {/* Image component */}
            <img
              src="https://st3.depositphotos.com/4282501/18282/i/450/depositphotos_182825916-stock-photo-skill-concept-chart-with-keywords.jpg"
              alt="Person with magnifying glass"
              className="image-box w-full h-auto rounded-lg shadow-lg border-4 border-spacing-48 border-black"
            />
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0 md:ml-6 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white light:text-white">
              Skill-Based Search Simplified
            </h1>
            <p className="text-lg text-zinc-400 light:text-zinc-400 mt-2">
              Find users by specific talents with our advanced search feature.
            </p>
            <div className="mt-6 flex justify-center md:justify-start space-x-4">
              <button className="bg-green-500 text-white py-2 px-6 font-bold rounded-full hover:bg-green-600">
                Try Now
              </button>
              <button className="bg-zinc-200 text-zinc-700 font-bold light:bg-zinc-700 light:text-zinc-300 py-2 px-6 rounded-full hover:bg-zinc-300 light:hover:bg-zinc-600">
                More Info
              </button>
            </div>
          </div>
        </div>

        {/* Collaboration section */}
        <div className="flex flex-col md:flex-row items-center p-6 bg-white-900 light:bg-zinc-800">
          <div className="md:w-1/2 p-6">
            <h2 className="text-3xl font-bold text-white light:text-white">
              Real-Time Collaboration Groups
            </h2>
            <p className="text-lg text-zinc-400 light:text-zinc-400 mt-2">
              Create or join groups for real-time discussions and projects.
            </p>
            <div className="mt-6 flex space-x-4">
              <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600">
                Join Groups
              </button>
              <button className="border border-zinc-300 font-bold text-zinc-700 light:text-zinc-300 light:border-zinc-600 py-2 px-4 rounded-full hover:bg-zinc-300 light:hover:bg-zinc-600">
                Learn How
              </button>
            </div>
          </div>
          <div className="md:w-1/2 p-6">
            {/* Image component */}
            <img
              src="https://www.freshbooks.com/wp-content/uploads/2021/11/Why-is-collaboration-important.jpg"
              alt="Collaboration Image"
              className="image-box w-full h-auto rounded-lg shadow-lg border-4 border-spacing-48 border-black"
            />
          </div>
        </div>


        {/* Call to action section */}
        <div className=" text-white p-8" style={{
          backgroundImage: "url('https://img.freepik.com/free-photo/artistic-blurry-colorful-wallpaper-background_58702-8632.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "850px",
          width: "100%",
        }}>
          <div className=" mx-auto min-h-screen p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16">
              <h2 className="mt-20 md:mt-0 text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-8 md:mb-0">
                Boost Your Professional Network
              </h2>
              <p className="mt-4 font-medium text-base md:text-lg text-neutral-300 max-w-lg mx-auto">
                Showcase projects and skills to the community, fostering recognition and valuable networking.
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
                {/* Individual image components */}
                <div className="relative">
                  {/* Background gradient wrapper */}
                  <BackgroundGradient className="rounded-lg max-w-2xl p-1 dark:bg-zinc-900 bg-cover bg-center shadow-lg">
                    <Image
                      src={connect}
                      alt="Person with magnifying glass"
                      width={700}
                      height={200}
                      className="w-full  rounded-3xl shadow-2xl object-contain border-4 border-spacing-48 border-black"
                    />
                  </BackgroundGradient>
                </div>
                {/* Repeat similar blocks for other images */}
                <div className="relative">
                  <BackgroundGradient className="rounded-lg max-w-2xl p-1 dark:bg-zinc-900 bg-cover bg-center shadow-lg">
                    <Image
                      src={communicate}
                      alt="Person with magnifying glass"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-3xl shadow-lg object-contain border-4 border-black"
                    />
                  </BackgroundGradient>
                </div>
                <div className="relative">
                  <BackgroundGradient className="rounded-lg max-w-2xl p-1 dark:bg-zinc-900 bg-cover bg-center shadow-lg">
                    <Image
                      src={Article}
                      alt="Person with magnifying glass"
                      width={900}
                      height={600}
                      className="w-full h-auto rounded-3xl shadow-2xl object-contain border-4 border-spacing-48 border-black"
                    />
                  </BackgroundGradient>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="bg-white dark:bg-zinc-800   py-9 px-4" style={{
          backgroundImage: "url('https://img.freepik.com/free-photo/artistic-blurry-colorful-wallpaper-background_58702-8632.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "300px",
          width: "100%"
        }}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 ">
            {/* Column 1 */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-white dark:text-white">SkillConnect</h2>
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
            {/* Column 2: Company links */}
            <div>
              <h3 className="text-lg font-bold text-white dark:text-white">Company</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="/about" className="text-zinc-500 dark:text-zinc-300">About Us</Link>
                </li>
                <li>
                  <Link href="/careers" className="text-zinc-500 dark:text-zinc-300">Careers</Link>
                </li>
                <li>
                  <Link href="/team" className="text-zinc-500 dark:text-zinc-300">Team</Link>
                </li>
                <li>
                  <Link href="/news" className="text-zinc-500 dark:text-zinc-300">News</Link>
                </li>
              </ul>
            </div>
            {/* Column 3: Resources links */}
            <div>
              <h3 className="text-lg font-bold text-white dark:text-white">Resources</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="/blog" className="text-zinc-500 dark:text-zinc-300">Blog</Link>
                </li>
                <li>
                  <Link href="/webinar" className="text-zinc-500 dark:text-zinc-300">Webinars</Link>
                </li>
                <li>
                  <Link href="/event" className="text-zinc-500 dark:text-zinc-300">Events</Link>
                </li>
                <li>
                  <Link href="/guide" className="text-zinc-500 dark:text-zinc-300">Guides</Link>
                </li>
              </ul>
            </div>
            {/* Column 4: Support links */}
            <div>
              <h3 className="text-lg font-bold text-white dark:text-white">Support</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link href="/help" className="text-zinc-500 dark:text-zinc-300">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-500 dark:text-zinc-300">Contact</Link>
                </li>
                <li>
                  <Link href="FAQ" className="text-zinc-500 dark:text-zinc-300">FAQ</Link>
                </li>
              </ul>
            </div>
            {/* Column 5: Contact details */}
            <div>
              <h3 className="text-lg font-bold text-white dark:text-white">Contact us</h3>
              <p className="mt-2 text-zinc-500 dark:text-zinc-300">support@skillconnect.com</p>
              <p className="text-zinc-500 dark:text-zinc-300">123-456-7890</p>


              {/* Social media links */}
              <div className="mt-4 flex space-x-4 ">
                <Link href="/insta" className="text-zinc-500 dark:text-zinc-300 ">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKWBPH_zlCOipWfslhiZSjBNaVxiSzMfWaYg&s/24x24 " alt="Discord" />
                </Link>
                <Link href="/insta" className="text-zinc-500 dark:text-zinc-300">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS95GxhjFFpXzk2LxvgS5zMnLvueaF5NY6Byg&s/24x24" alt="Reddit" />
                </Link>
                <Link href="/insta" className="text-zinc-500 dark:text-zinc-300">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZs5UtzLGqj9rC_JWwaVREzPoBJ_5DRgFH4Q&s/24x24" alt="Instagram" />
                </Link>
                <Link href="#" className="text-zinc-500 dark:text-zinc-300">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI-h-e2hgz8mwGfCt4gvj4IgMG_wAUolVM6w&s/24x24" alt="Twitter" />
                </Link>
                <Link href="#" className="text-zinc-500 dark:text-zinc-300">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW1M7nqpfp6Xzb7X8GgLQFd9dtOcjdXK20IQ&s/24x24" alt="Facebook" />
                </Link>

              </div>

            </div>
            <div className="text-left text-zinc-400 dark:text-zinc-300 ">
              © 2024 SkillConnect, we love our users!
            </div>

          </div>

        </div>
      </div>
    </div>

  );
}