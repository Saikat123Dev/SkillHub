"use client"
import React, { useState, useEffect } from 'react';
import { Search, Users, BookOpen, Play, ChevronDown, Rocket, PenTool, MessageCircle, Github, Linkedin, ArrowRight, Star, Zap, Target, Shield, Sparkles, Globe, Award, TrendingUp } from 'lucide-react';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TeamBuilder
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Contact</a>
          </div>
          
          <button
          onClick={() => window.location.href = '/auth/register'}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Connect', 'Build', 'Collaborate', 'Succeed'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 text-white/80">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">#1 Collaborative Platform</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                <span className="block">Transform Ideas</span>
                <span className="block">Into Reality</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  {words[currentWord]}
                </span>
              </h1>

              <p className="text-xl text-blue-100 leading-relaxed max-w-xl">
                Find the perfect teammates, showcase your skills, and collaborate seamlessly on projects, hackathons, and startups. Built for the next generation of innovators.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
              onClick={()=> window.location.href = '/auth/register'}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Start Building</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group border-2 border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-blue-200 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-blue-200 text-sm">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-blue-200 text-sm">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Demo */}
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center animate-bounce">
                <Zap className="w-12 h-12 text-white" />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Find Your Team</h3>
                    <p className="text-blue-200 text-sm">Connect with like-minded professionals</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Execute Projects</h3>
                    <p className="text-blue-200 text-sm">All-in-one project management hub</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Achieve Success</h3>
                    <p className="text-blue-200 text-sm">Track progress and celebrate wins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToFeatures}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
      >
        <ChevronDown size={32} />
      </button>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }) => (
  <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500" style={{background: gradient}}></div>
    
    <div className="relative z-10">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
      
      <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
        <span>Learn more</span>
        <ArrowRight className="w-4 h-4 ml-2" />
      </div>
    </div>
  </div>
);

const FeatureSection = () => (
  <div id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white">
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 text-blue-600 mb-6">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold">POWERFUL FEATURES</span>
        </div>
        
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Everything You Need to
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build Amazing Teams
          </span>
        </h2>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          From finding teammates to project execution, our platform provides all the tools 
          you need for successful collaboration.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <FeatureCard
          icon={<Search className="w-8 h-8 text-white" />}
          title="Smart Discovery"
          description="Advanced AI-powered search to find teammates based on skills, experience, and project compatibility."
          gradient="from-blue-500 to-blue-600"
        />
        
        <FeatureCard
          icon={<Users className="w-8 h-8 text-white" />}
          title="Team Building"
          description="Create and join teams effortlessly. Post project needs and let professionals apply to join your vision."
          gradient="from-green-500 to-green-600"
        />
        
        <FeatureCard
          icon={<PenTool className="w-8 h-8 text-white" />}
          title="Collaborative Workspace"
          description="Interactive whiteboards, real-time editing, and brainstorming tools to bring ideas to life."
          gradient="from-purple-500 to-purple-600"
        />
        
        <FeatureCard
          icon={<MessageCircle className="w-8 h-8 text-white" />}
          title="Seamless Communication"
          description="Built-in chat, video calls, and project updates to keep your team connected and informed."
          gradient="from-pink-500 to-pink-600"
        />
        
        <FeatureCard
          icon={<Target className="w-8 h-8 text-white" />}
          title="Project Management"
          description="Kanban boards, task tracking, and milestone management to keep projects on track."
          gradient="from-indigo-500 to-indigo-600"
        />
        
        <FeatureCard
          icon={<TrendingUp className="w-8 h-8 text-white" />}
          title="Analytics & Insights"
          description="Track team performance, project progress, and collaboration metrics for continuous improvement."
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Feature Highlights */}
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-4xl font-bold text-gray-900">
              Revolutionary Team Matching
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our AI-powered platform doesn't just connect people—it creates perfect team chemistry. 
              Match based on complementary skills, work styles, and project goals.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-700">Skill-based matching algorithm</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-700">Personality and work style compatibility</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-700">Project timeline and commitment alignment</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Global Reach</h4>
                <p className="text-sm text-gray-600">Connect with talent worldwide</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure</h4>
                <p className="text-sm text-gray-600">Enterprise-grade security</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fast</h4>
                <p className="text-sm text-gray-600">Instant team formation</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Proven</h4>
                <p className="text-sm text-gray-600">95% success rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ComingSoonSection = () => (
  <div className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
    {/* Background Effects */}
    <div className="absolute inset-0">
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
    
    <div className="relative z-10 container mx-auto px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 text-white/90 mb-8">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="font-semibold">Coming Soon</span>
        </div>

        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
          AI-Powered Smart Matching
          <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Revolution
          </span>
        </h2>

        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          Experience the future of team building with our revolutionary AI that understands 
          not just skills, but team chemistry, work patterns, and project success factors.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <Rocket className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Instant Matching</h3>
            <p className="text-blue-200">Find perfect teammates in under 10 seconds</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Perfect Synergy</h3>
            <p className="text-blue-200">AI analyzes work styles and personalities</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Predictive Success</h3>
            <p className="text-blue-200">Forecast project outcomes before you start</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6">Be the First to Know</h3>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
            />
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
              Get Early Access
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white py-16">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">TeamBuilder</span>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-8">
            Empowering the next generation of innovators to build, collaborate, and succeed together. 
            Transform your ideas into reality with the perfect team.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Platform</h3>
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-6">Support</h3>
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © 2025 TeamBuilder. All rights reserved.
          </p>
          <p className="text-gray-400 mt-4 md:mt-0">
            Made with ❤️ for innovators worldwide
          </p>
        </div>
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Hero />
      <FeatureSection />
      <ComingSoonSection />
      <Footer />
    </div>
  );
};

export default App;
