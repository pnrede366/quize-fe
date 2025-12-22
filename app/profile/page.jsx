"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notification } from "antd";
import Link from "next/link";
import { userAPI } from "../../utils/api";
import { LEVEL_COLORS } from "../leaderboard/constants";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [generatedQuizzes, setGeneratedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileData, statsData, historyData, generatedData] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getUserStats(),
        userAPI.getQuizHistory(),
        userAPI.getGeneratedQuizzes(),
      ]);
      setUser(profileData);
      setStats(statsData);
      setQuizHistory(historyData);
      setGeneratedQuizzes(generatedData);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to load profile data",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanDetails = (user) => {
    if (!user.isPremium) return null;

    const expiryDate = new Date(user.premiumExpiresAt);
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    // Calculate plan duration
    const createdDate = new Date(user.createdAt);
    const totalDays = Math.ceil((expiryDate - createdDate) / (1000 * 60 * 60 * 24));
    
    let planName = "Premium";
    if (totalDays >= 300) planName = "Yearly Premium";
    else if (totalDays >= 60) planName = "Quarterly Premium";
    else if (totalDays >= 15) planName = "Monthly Premium";

    return {
      planName,
      expiryDate: expiryDate.toLocaleDateString('en-IN', { 
        day: 'numeric',
        month: 'short', 
        year: 'numeric' 
      }),
      daysLeft,
      isExpiring: daysLeft <= 7,
    };
  };

  const getDifficultyBadge = (difficulty) => {
    if (difficulty <= 2) return { label: "Easy", color: "bg-green-500" };
    if (difficulty <= 5) return { label: "Medium", color: "bg-yellow-500" };
    if (difficulty <= 8) return { label: "Hard", color: "bg-orange-500" };
    return { label: "Expert", color: "bg-red-500" };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-6xl">👤</div>
          <p className="text-xl text-zinc-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !stats) return null;

  const difficultyBadge = getDifficultyBadge(stats.level);
  const planDetails = getPlanDetails(user);

  const statsCards = [
    { label: "Total Points", value: stats.points.toLocaleString(), color: "text-indigo-400" },
    { label: "Quizzes Taken", value: stats.quizzesTaken, color: "text-green-400" },
    { label: "Current Rank", value: `#${stats.rank}`, color: "text-yellow-400" },
    { label: "Avg Score", value: `${stats.averageScore}%`, color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8">
      <div className="container mx-auto max-w-6xl">
        {/* Profile Header */}
        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/20 text-5xl">
                {user.isPremium ? "👑" : "👤"}
              </div>
              <div>
                <h1 className="mb-2 text-3xl font-bold text-zinc-100">
                  {user.username}
                  {user.isPremium && (
                    <span className="ml-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 text-sm font-bold text-white">
                      Premium
                    </span>
                  )}
                </h1>
                <p className="mb-1 text-zinc-400">{user.email}</p>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${difficultyBadge.color}/20 ${LEVEL_COLORS[stats.level]}`}>
                    Level {stats.level}
                  </span>
                  <span className="text-sm text-zinc-500">•</span>
                  <span className="text-sm text-zinc-400">Rank #{stats.rank}</span>
                  {!user.isPremium && (
                    <>
                      <span className="text-sm text-zinc-500">•</span>
                      <span className="text-sm text-zinc-400">
                        {user.quizzesRemaining === 'unlimited' ? 'Unlimited' : `${user.quizzesRemaining} quizzes left`}
                      </span>
                    </>
                  )}
                </div>
                
                {/* Subscription Details */}
                {planDetails && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2">
                    <span className="text-sm text-yellow-300">
                      {planDetails.planName}
                    </span>
                    <span className="text-sm text-zinc-500">•</span>
                    <span className={`text-sm ${planDetails.isExpiring ? 'text-red-400 font-semibold' : 'text-zinc-400'}`}>
                      {planDetails.isExpiring ? `Expires in ${planDetails.daysLeft} days` : `Valid until ${planDetails.expiryDate}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {statsCards.map((stat, index) => (
            <div key={index} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
              <p className="mb-2 text-sm text-zinc-400">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Quiz History */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-100">Recent Quizzes</h2>
            <Link href="/dashboard" className="text-sm text-indigo-400 hover:text-indigo-300">
              View All →
            </Link>
          </div>

          {quizHistory.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">📝</div>
              <p className="mb-4 text-xl text-zinc-400">No quizzes taken yet</p>
              <Link
                href="/"
                className="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500"
              >
                Take Your First Quiz
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {quizHistory.map((quiz) => {
                const badge = getDifficultyBadge(quiz.difficulty);
                const percentage = ((quiz.score / quiz.totalQuestions) * 100).toFixed(0);
                
                return (
                  <Link
                    key={quiz.id}
                    href={`/quiz/${quiz.id}/results`}
                    className="block rounded-lg border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-indigo-500/50 hover:bg-zinc-800"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-zinc-100">{quiz.title}</h3>
                          <span className={`rounded-full ${badge.color}/20 px-3 py-1 text-xs font-semibold text-${badge.color.replace('bg-', '')}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="mb-2 text-sm text-zinc-400">{quiz.topic}</p>
                        <p className="text-xs text-zinc-500">
                          {new Date(quiz.completedAt).toLocaleDateString()} • {quiz.questionsCount} questions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="mb-1 text-2xl font-bold text-indigo-400">{percentage}%</p>
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

        {/* My Generated Quizzes */}
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-100">My Generated Quizzes</h2>
            <span className="text-sm text-zinc-400">
              {generatedQuizzes.length} {generatedQuizzes.length === 1 ? 'quiz' : 'quizzes'}
            </span>
          </div>

          {generatedQuizzes.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">🎨</div>
              <p className="mb-4 text-xl text-zinc-400">No quizzes generated yet</p>
              <Link
                href="/"
                className="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500"
              >
                Generate Your First Quiz
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {generatedQuizzes.map((quiz) => {
                const badge = getDifficultyBadge(quiz.difficulty);
                
                return (
                  <Link
                    key={quiz.id}
                    href={`/quiz/${quiz.id}`}
                    className="block rounded-lg border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-indigo-500/50 hover:bg-zinc-800"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-semibold text-zinc-100 line-clamp-2">{quiz.title}</h3>
                        <p className="mb-2 text-sm text-zinc-400">{quiz.topic}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full ${badge.color}/20 px-3 py-1 text-xs font-semibold text-${badge.color.replace('bg-', '')}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {quiz.questionsCount} questions
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">
                          {quiz.timesPlayed || 0} {quiz.timesPlayed === 1 ? 'play' : 'plays'}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(quiz.createdAt).toLocaleDateString()}
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

