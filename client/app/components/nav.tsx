"use client"
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Nav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="w-full flex justify-between items-center p-6 relative z-50">
      <div className="px-4">
        <Link href="/">
          <h1 className="text-2xl font-black">
            ML-Hub
          </h1>
        </Link>
      </div>

      <div className="flex items-center space-x-8 px-4 text-md font-bold">
        <div 
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="flex items-center gap-1 transition-colors py-2">
            Models
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -left-20 mt-1 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 flex flex-col gap-1"
              >
                <Link 
                  href="/models" 
                  className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex flex-col"
                >
                  <span className="text-neutral-900 dark:text-white">Analytical Models</span>
                  <span className="text-[10px] text-neutral-400 normal-case font-medium">Pre-trained computer vision & NLP</span>
                </Link>
                <Link 
                  href="/trainable" 
                  className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex flex-col"
                >
                  <span className="text-neutral-900 dark:text-white">Trainable Models</span>
                  <span className="text-[10px] text-neutral-400 normal-case font-medium">Custom training & fine-tuning</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link 
          href="https://github.com/saiimonn/ml-hub" 
          target="_blank"
        >
          Github
        </Link>
      </div>
    </nav>
  );
};

export default Nav;