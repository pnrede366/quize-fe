"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Link from "next/link";
import { userAPI } from "../../api/api";
import Badge from "../../component/ui/Badge";
import Loader from "../../component/ui/Loader";
import { STATS_CARDS_CONFIG, DIFFICULTY_FILTERS } from "./constants";
import { getDifficultyBadge, filterQuizzesByDifficulty, calculatePercentage } from "../../helper/utility.js";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const filtered = filterQuizzesByDifficulty(quizHistory, filterDifficulty);
    setFilteredHistory(filtered);
  }, [filterDifficulty, quizHistory]);

  const fetchDashboardData = async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        userAPI.getUserStats(),
        userAPI.getQuizHistory(),
      ]);
      setStats(statsData);
      setQuizHistory(historyData);
      setFilteredHistory(historyData);
    } catch (error) {
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <Loader emoji="📊" message="Loading dashboard..." />;
  }

  if (!user || !stats) return null;

  const statsCards = STATS_CARDS_CONFIG.map((config, index) => {
    const values = [stats.quizzesTaken, stats.points.toLocaleString(), `${stats.averageScore}%`, stats.level];
    return { ...config, value: values[index] };
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-6 sm:px-6 sm:py-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/profile" className="mb-3 sm:mb-4 inline-flex items-center text-xs sm:text-sm text-indigo-400 hover:text-indigo-300">
            ← Back to Profile
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-100">Quiz Dashboard</h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-zinc-400">Your complete quiz history and performance</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {statsCards.map((stat, index) => (
            <div key={index} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 text-center">
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-zinc-400">{stat.label}</p>
              <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${stat.color} break-words`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="mb-4 sm:mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
          <p className="mb-2 sm:mb-3 text-xs sm:text-sm font-medium text-zinc-400">Filter by Difficulty</p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {DIFFICULTY_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterDifficulty(filter.value)}
                className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all ${
                  filterDifficulty === filter.value
                    ? "bg-indigo-600 text-white"
                    : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-indigo-500"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <p className="mt-2 sm:mt-3 text-xs text-zinc-500">
            Showing {filteredHistory.length} of {quizHistory.length} quizzes
          </p>
        </div>

        {/* Quiz History */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 md:p-8">
          <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-zinc-100">Complete Quiz History</h2>

          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">📝</div>
              <p className="mb-4 text-xl text-zinc-400">
                {quizHistory.length === 0 ? "No quizzes taken yet" : "No quizzes match this filter"}
              </p>
              {quizHistory.length === 0 ? (
                <Link
                  href="/"
                  className="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500"
                >
                  Take Your First Quiz
                </Link>
              ) : (
                <button
                  onClick={() => setFilterDifficulty("all")}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((quiz) => {
                const badge = getDifficultyBadge(quiz.difficulty);
                const percentage = calculatePercentage(quiz.score, quiz.totalQuestions);
                const isPerfect = quiz.score === quiz.totalQuestions;
                
                return (
                  <Link
                    key={quiz.id}
                    href={`/quiz/${quiz.id}/results`}
                    className="block rounded-lg border border-zinc-800 bg-zinc-950 p-4 sm:p-6 transition-all hover:scale-[1.01] hover:border-indigo-500/50 hover:bg-zinc-800 hover:shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                          <h3 className="text-base sm:text-lg font-semibold text-zinc-100 break-words">{quiz.title}</h3>
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                          {isPerfect && (
                            <span className="text-lg sm:text-xl flex-shrink-0" title="Perfect Score!">🏆</span>
                          )}
                        </div>
                        <p className="mb-2 text-xs sm:text-sm text-zinc-400 break-words">{quiz.topic}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-zinc-500">
                          <span className="whitespace-nowrap">{new Date(quiz.completedAt).toLocaleDateString()}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="whitespace-nowrap">{quiz.questionsCount} questions</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="whitespace-nowrap">Level {quiz.difficulty}</span>
                        </div>
                      </div>
                      <div className="text-right sm:text-left flex-shrink-0">
                        <p className={`mb-1 text-2xl sm:text-3xl font-bold ${isPerfect ? 'text-yellow-400' : 'text-indigo-400'}`}>
                          {percentage}%
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-400">
                          {quiz.score}/{quiz.totalQuestions}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
