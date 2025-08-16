"use client"
import React, { useState, useEffect } from 'react';
import { SignUp } from '@clerk/nextjs';
import { Mic, Brain, Target, TrendingUp, CheckCircle, Users, Award, Sparkles } from 'lucide-react';

export default function SignUpPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: "AI-Powered Interviews",
      description: "Experience realistic interview scenarios with advanced AI that adapts to your responses"
    },
    {
      icon: <Target className="w-8 h-8 text-green-400" />,
      title: "Personalized Feedback",
      description: "Get detailed insights on your performance with actionable improvement suggestions"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
      title: "Track Your Progress",
      description: "Monitor your improvement over time with comprehensive analytics and scoring"
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-400" />,
      title: "Industry-Specific Practice",
      description: "Practice for your dream job with role-specific questions and scenarios"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Left Side - Creative Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Interview Master
            </h1>
            <p className="text-xl text-blue-200 mb-8">
              Transform your interview skills with AI-powered practice sessions
            </p>
          </div>

          {/* Feature Showcase */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center mb-6 transform transition-all duration-500">
              {features[currentFeature].icon}
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              {features[currentFeature].title}
            </h3>
            <p className="text-blue-200 leading-relaxed mb-6">
              {features[currentFeature].description}
            </p>
            
            {/* Feature Dots */}
            <div className="flex justify-center space-x-2">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentFeature 
                      ? 'bg-blue-400 w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm text-blue-300">Users Trained</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-blue-300">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-blue-300">Companies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Authentication */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join Us Today
            </h2>
            <p className="text-gray-600">
              Start your journey to interview success
            </p>
          </div>
        </div>

        {/* Auth Form Container */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <div className="transform transition-all duration-300 hover:scale-105">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none bg-transparent border-0",
                  formButtonPrimary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl py-3 text-white font-semibold transition-all duration-200",
                  formFieldInput: "rounded-xl border-2 border-gray-200 focus:border-blue-500 px-4 py-3 transition-colors",
                  identityPreview: "rounded-xl",
                  formFieldLabel: "text-gray-700 font-medium",
                  footerActionLink: "text-blue-500 hover:text-blue-600"
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Secure</span>
            </span>
            <span className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Trusted by thousands</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}