"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notification } from "antd";
import SearchBox from "../component/ui/SearchBox";
import Badge from "../component/ui/Badge";
import DifficultySelector from "../component/ui/DifficultySelector";
import PremiumModal from "../component/ui/PremiumModal";
import { quizAPI, userAPI } from "../utils/api";
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
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const profile = await userAPI.getProfile();
        setQuizzesRemaining(profile.quizzesRemaining === 'unlimited' ? Infinity : profile.quizzesRemaining);
      }
    } catch (error) {
      // User not logged in or error fetching profile
    }
  };

  const handleGenerate = () => {
    const topic = searchValue.trim();
    if (!topic) {
      notification.warning({
        message: "Topic Required",
        description: "Please enter a quiz topic",
        placement: "topRight",
      });
      return;
    }
    setShowDifficultyModal(true);
  };

  const handleDifficultySelect = async (difficulty) => {
    const topic = searchValue.trim();
    setIsGenerating(true);
    setShowDifficultyModal(false);

    try {
      const quiz = await quizAPI.generateQuiz(topic, difficulty.range);
      
      notification.success({
        message: "Quiz Generated!",
        description: `Your ${difficulty.label} quiz on "${topic}" is ready!`,
        placement: "topRight",
      });

      await fetchUserProfile();
      router.push(`/quiz/${quiz._id}`);
    } catch (error) {
      if (error.response?.data?.limitReached) {
        // Check if it's testing mode restriction
        if (error.response?.data?.testingMode) {
          notification.error({
            message: "Testing Mode Restriction",
            description: error.response?.data?.message,
            placement: "topRight",
            duration: 8,
          });
        } else {
          // Free tier limit
          setShowPremiumModal(true);
          notification.warning({
            message: "Free Tier Limit Reached",
            description: error.response?.data?.message,
            placement: "topRight",
            duration: 5,
          });
        }
      } else {
        notification.error({
          message: "Generation Failed",
          description: error.message || "Failed to generate quiz. Please try again.",
          placement: "topRight",
        });
      }
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (topic) => {
    setSearchValue(topic);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      {/* BRAND */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          AI Quiz Generator
        </h1>
        <p className="mt-3 max-w-xl text-zinc-400">
          Type any topic. Get an AI‑generated quiz.  
          Level up from <span className="text-white">0 to 10</span>.
        </p>
      </div>

      {/* SEARCH BOX */}
      <SearchBox
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onGenerate={handleGenerate}
        placeholder={PLACEHOLDER_TEXT}
        helperText={FREE_QUIZZES_TEXT}
      />

      {/* QUICK SUGGESTIONS */}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {QUICK_SUGGESTIONS.map((topic) => (
          <Badge
            key={topic}
            variant="default"
            onClick={() => handleSuggestionClick(topic)}
          >
            {topic}
          </Badge>
        ))}
      </div>

      {/* LEVEL INFO */}
      <div className="mt-14 text-center">
        <p className="text-sm text-zinc-400">
          Difficulty levels
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-3 text-sm">
          {DIFFICULTY_LEVELS.map((level) => (
            <Badge
              key={level.range}
              variant={level.color === "green" ? "easy" : level.color === "yellow" ? "medium" : level.color === "orange" ? "hard" : "expert"}
              className="px-3 py-1"
            >
              {level.range} {level.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-6 text-xs text-zinc-600">
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
            <p className="text-zinc-400">AI is creating your questions</p>
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
