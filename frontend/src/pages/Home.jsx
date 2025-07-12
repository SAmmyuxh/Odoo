import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, TrendingUp, Sparkles, ArrowRight, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-4 rounded-full shadow-2xl animate-bounce-slow">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 animate-slide-up">
            Welcome to the
            <br />
            <span className="text-7xl md:text-9xl bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Odoo Platform
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-up delay-200">
            Connect with others and share your skills! Join our community to 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold"> learn</span>,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold"> teach</span>, and
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 font-semibold"> grow together</span>.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl w-full animate-slide-up delay-300">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-500 hover:transform hover:scale-105 group">
            <Users className="w-12 h-12 text-blue-400 mb-4 group-hover:animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">Connect</h3>
            <p className="text-gray-300">Build meaningful connections with like-minded individuals</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-105 group">
            <BookOpen className="w-12 h-12 text-purple-400 mb-4 group-hover:animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">Learn</h3>
            <p className="text-gray-300">Expand your knowledge through skill exchanges</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-pink-400/50 transition-all duration-500 hover:transform hover:scale-105 group">
            <TrendingUp className="w-12 h-12 text-pink-400 mb-4 group-hover:animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">Grow</h3>
            <p className="text-gray-300">Develop your skills and unlock new opportunities</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center animate-slide-up delay-500">
          <Link 
            to="/login" 
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center gap-2"
          >
            Login
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/register" 
            className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 flex items-center gap-2"
          >
            Register
            <Star className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Link>
          
          <Link 
            to="/dashboard" 
            className="group bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-gray-500/25 flex items-center gap-2"
          >
            Dashboard
            <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
          
          <Link 
            to="/swaps/new" 
            className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-indigo-500/25 flex items-center gap-2"
          >
            Create Swap
            <Sparkles className="w-5 h-5 group-hover:animate-spin transition-transform" />
          </Link>
        </div>

        {/* Bottom decorative element */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default Home;