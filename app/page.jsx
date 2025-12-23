"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { message } from "antd";
import SearchBox from "../component/ui/SearchBox";
import Badge from "../component/ui/Badge";
import { quizAPI, userAPI } from "../api/api";

// Dynamic imports for heavy components
const DifficultySelector = dynamic(() => import("../component/ui/DifficultySelector"), {
  ssr: false,
});

const PremiumModal = dynamic(() => import("../component/ui/PremiumModal"), {
  ssr: false,
});
import {
  QUICK_SUGGESTIONS,
  DIFFICULTY_LEVELS,
  PLACEHOLDER_TEXT,
  FOOTER_TEXT,
  FREE_QUIZZES_TEXT,
} from "./constants";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizzesRemaining, setQuizzesRemaining] = useState(3);
  const router = useRouter();

  useEffect(() => {
    // Defer profile fetch to avoid blocking initial render
    const timer = setTimeout(() => {
      fetchUserProfile();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const profile = await userAPI.getProfile();
        setQuizzesRemaining(profile.quizzesRemaining === 'unlimited' ? Infinity : profile.quizzesRemaining);
      }
    } catch (error) {
      // User not logged in or error fetching profile
    }
  }, []);

  const handleGenerate = useCallback(() => {
    const topic = searchValue.trim();
    if (!topic) {
      message.warning("Please enter a quiz topic");
      return;
    }
    setShowDifficultyModal(true);
  }, [searchValue]);

  const handleDifficultySelect = useCallback(async (difficulty) => {
    const topic = searchValue.trim();
    setIsGenerating(true);
    setShowDifficultyModal(false);

    try {
      const quiz = await quizAPI.generateQuiz(topic, difficulty.range);
      
      message.success(`Quiz Generated! Your ${difficulty.label} quiz on "${topic}" is ready!`);

      await fetchUserProfile();
      router.push(`/quiz/${quiz._id}`);
    } catch (error) {
      if (error.response?.data?.limitReached) {
        // Check if it's testing mode restriction
        if (error.response?.data?.testingMode) {
          message.error(error.response?.data?.message || "Testing Mode Restriction", 8);
        } else {
          // Free tier limit
          setShowPremiumModal(true);
          message.warning(error.response?.data?.message || "Free Tier Limit Reached", 5);
        }
      } else {
        message.error(error.message || "Failed to generate quiz. Please try again.");
      }
      setIsGenerating(false);
    }
  }, [searchValue, fetchUserProfile, router]);

  const handleSuggestionClick = useCallback((topic) => {
    setSearchValue(topic);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 sm:py-16">
      <div className="flex w-full max-w-4xl flex-col items-center">
        {/* BRAND */}
        <div className="mb-8 w-full text-center sm:mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            AI Quiz Generator
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-300 sm:mt-4 sm:text-base">
            Type any topic. Get an AI‑generated quiz.  
            Level up from <span className="text-white">0 to 10</span>.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="mb-8 flex w-full justify-center sm:mb-10">
          <div className="w-full max-w-2xl">
            <SearchBox
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onGenerate={handleGenerate}
              placeholder={PLACEHOLDER_TEXT}
              helperText={FREE_QUIZZES_TEXT}
            />
          </div>
        </div>

        {/* QUICK SUGGESTIONS */}
        <div className="mb-8 flex w-full max-w-2xl flex-wrap justify-center gap-2 sm:mb-10 sm:gap-3">
          {QUICK_SUGGESTIONS.map((topic) => (
            <Badge
              key={topic}
              variant="default"
              onClick={() => handleSuggestionClick(topic)}
              className="text-xs sm:text-sm"
            >
              {topic}
            </Badge>
          ))}
        </div>

        {/* LEVEL INFO */}
        <div className="mb-8 w-full text-center sm:mb-12">
          <p className="mb-3 text-xs text-zinc-300 sm:mb-4 sm:text-sm">
            Difficulty levels
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs sm:gap-3 sm:text-sm">
            {DIFFICULTY_LEVELS.map((level) => (
              <Badge
                key={level.range}
                variant={level.color === "green" ? "easy" : level.color === "yellow" ? "medium" : level.color === "orange" ? "hard" : "expert"}
                className="px-2.5 py-1.5 sm:px-3"
              >
                {level.range} {level.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-4 left-0 right-0 w-full py-6 text-center text-xs text-zinc-400 sm:bottom-6 sm:py-0">
        {FOOTER_TEXT}
      </footer>

      {/* DIFFICULTY SELECTOR MODAL */}
      <DifficultySelector
        isOpen={showDifficultyModal}
        onClose={() => setShowDifficultyModal(false)}
        onSelect={handleDifficultySelect}
        topic={searchValue.trim()}
      />

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/80 p-8 text-center backdrop-blur-xl">
            <div className="mb-4 text-6xl">🤖</div>
            <h3 className="mb-2 text-2xl font-bold text-zinc-100">Generating Quiz...</h3>
            <p className="text-zinc-300">AI is creating your questions</p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: '150ms' }}></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        quizzesRemaining={quizzesRemaining}
      />
    </main>
  );
}
