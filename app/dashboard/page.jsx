"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notification } from "antd";
import Link from "next/link";
import { userAPI } from "../../utils/api";
import Badge from "../../component/ui/Badge";

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
    if (filterDifficulty === "all") {
      setFilteredHistory(quizHistory);
    } else {
      const filtered = quizHistory.filter((quiz) => {
        const difficulty = quiz.difficulty;
        if (filterDifficulty === "easy") return difficulty <= 2;
        if (filterDifficulty === "medium") return difficulty > 2 && difficulty <= 5;
        if (filterDifficulty === "hard") return difficulty > 5 && difficulty <= 8;
        if (filterDifficulty === "expert") return difficulty > 8;
        return true;
      });
      setFilteredHistory(filtered);
    }
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
      notification.error({
        message: "Error",
        description: "Failed to load dashboard data",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    if (difficulty <= 2) return { label: "Easy", variant: "easy" };
    if (difficulty <= 5) return { label: "Medium", variant: "medium" };
    if (difficulty <= 8) return { label: "Hard", variant: "hard" };
    return { label: "Expert", variant: "expert" };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-6xl">📊</div>
          <p className="text-xl text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !stats) return null;

  const statsCards = [
    { label: "Total Quizzes", value: stats.quizzesTaken, color: "text-indigo-400" },
    { label: "Total Points", value: stats.points.toLocaleString(), color: "text-green-400" },
    { label: "Average Score", value: `${stats.averageScore}%`, color: "text-purple-400" },
    { label: "Current Level", value: stats.level, color: "text-yellow-400" },
  ];

  const difficultyFilters = [
    { label: "All", value: "all" },
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
    { label: "Expert", value: "expert" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="mb-4 inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300">
            ← Back to Profile
          </Link>
          <h1 className="text-4xl font-bold text-zinc-100">Quiz Dashboard</h1>
          <p className="mt-2 text-lg text-zinc-400">Your complete quiz history and performance</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {statsCards.map((stat, index) => (
            <div key={index} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
              <p className="mb-2 text-sm text-zinc-400">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="mb-3 text-sm font-medium text-zinc-400">Filter by Difficulty</p>
          <div className="flex flex-wrap gap-3">
            {difficultyFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterDifficulty(filter.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filterDifficulty === filter.value
                    ? "bg-indigo-600 text-white"
                    : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-indigo-500"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Showing {filteredHistory.length} of {quizHistory.length} quizzes
          </p>
        </div>

        {/* Quiz History */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="mb-6 text-2xl font-bold text-zinc-100">Complete Quiz History</h2>

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
                const percentage = ((quiz.score / quiz.totalQuestions) * 100).toFixed(0);
                const isPerfect = quiz.score === quiz.totalQuestions;
                
                return (
                  <Link
                    key={quiz.id}
                    href={`/quiz/${quiz.id}/results`}
                    className="block rounded-lg border border-zinc-800 bg-zinc-950 p-6 transition-all hover:scale-[1.01] hover:border-indigo-500/50 hover:bg-zinc-800 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-zinc-100">{quiz.title}</h3>
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                          {isPerfect && (
                            <span className="text-xl" title="Perfect Score!">🏆</span>
                          )}
                        </div>
                        <p className="mb-2 text-sm text-zinc-400">{quiz.topic}</p>
                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          <span>{new Date(quiz.completedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{quiz.questionsCount} questions</span>
                          <span>•</span>
                          <span>Level {quiz.difficulty}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`mb-1 text-3xl font-bold ${isPerfect ? 'text-yellow-400' : 'text-indigo-400'}`}>
                          {percentage}%
                        </p>
                        <p className="text-sm text-zinc-400">
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
