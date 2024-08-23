import React from 'react';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/footer';
import ScrollToTop from './components/helper/scroll-to-top';
import AboutSection from "./components/homepage/about";
import HeroSection from "./components/homepage/hero-section";
import Skills from "./components/homepage/skills";
import './css/card.scss';
import './css/globals.scss';
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Portfolio of Abu Said - Software Developer',
  description: 'This is the portfolio of Abu Said. I am a full stack developer and a self-taught developer. I love to learn new things and I am always open to collaborating with others. I am a quick learner and I am always looking for new challenges.',
};

const HomePage = () => {
  return (
    <div className={`flex flex-col ${inter.className}`}>
      <ToastContainer />
      <Navbar/>
      <div className="flex-grow">
        <HeroSection />
        <AboutSection />
        <Skills />
        <ScrollToTop />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
