"use client"
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { 
  Home, 
  Mic, 
  BookOpen, 
  HelpCircle, 
  Menu, 
  X,
  Sparkles,
  TrendingUp,
  Brain
} from 'lucide-react';

const Header = () => {
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    console.log(path);
  }, []);

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="w-4 h-4" />
    },
    {
      name: 'Interviews',
      path: '/dashboard/interviews',
      icon: <Mic className="w-4 h-4" />
    },
    {
      name: 'Practice',
      path: '/dashboard/practice',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      name: 'Questions',
      path: '/dashboard/questions',
      icon: <HelpCircle className="w-4 h-4" />
    }
  ];

  return (
    <>
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                {/* AI Brain Logo */}
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden">
                  {/* Background circuit pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute top-3 right-3 w-0.5 h-0.5 bg-white rounded-full"></div>
                    <div className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white rounded-full"></div>
                    <div className="absolute bottom-3 right-2 w-1 h-1 bg-white rounded-full"></div>
                    {/* Connection lines */}
                    <div className="absolute top-2.5 left-3 w-3 h-px bg-white/30"></div>
                    <div className="absolute top-4 right-2 w-2 h-px bg-white/30 rotate-45"></div>
                  </div>
                  
                  {/* AI Brain Icon */}
                  <div className="relative z-10">
                    <Brain className="w-6 h-6 text-white drop-shadow-sm" />
                  </div>
                  
                  {/* Neural network dots */}
                  <div className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full animate-pulse delay-700 shadow-lg"></div>
                  <div className="absolute top-3 left-0.5 w-1 h-1 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full animate-pulse delay-1000 shadow-lg"></div>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 bg-clip-text text-transparent group-hover:from-cyan-700 group-hover:via-blue-700 group-hover:to-purple-800 transition-all duration-300">
                  AI Interview
                </h1>
                <p className="text-xs text-gray-500 -mt-1 group-hover:text-gray-600 transition-colors">AI-Powered Practice</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = path === item.path || path.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4"> 
              {/* Notification Badge (Optional) */}
              <div className="hidden sm:flex items-center space-x-3">
                <div className="relative">
                 
                </div>
               
              </div>

              {/* User Button */}
              <div className="relative">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-blue-500/20 ring-offset-2 ring-offset-white hover:ring-blue-500/40 transition-all duration-200",
                      userButtonPopoverCard: "shadow-xl border border-gray-200/50 backdrop-blur-xl",
                      userButtonPopoverActionButton: "hover:bg-gray-100 rounded-lg transition-colors"
                    }
                  }}
                />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = path === item.path || path.startsWith(item.path + '/');
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;