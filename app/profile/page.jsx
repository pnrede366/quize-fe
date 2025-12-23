"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Link from "next/link";
import { userAPI } from "../../api/api";
import { LEVEL_COLORS } from "../../../helper/constant";
import { STATS_CARDS_CONFIG } from "./constants";
import { getPlanDetails } from "./utility";
import { getDifficultyBadge, calculatePercentage } from "../../../helper/utility";
import Loader from "../../component/ui/Loader";

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
      message.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <Loader emoji="👤" message="Loading profile..." />;
  }

  if (!user || !stats) return null;

  const difficultyBadge = getDifficultyBadge(stats.level, 'color');
  const planDetails = getPlanDetails(user);

  const statsCards = STATS_CARDS_CONFIG.map((config, index) => {
    const values = [stats.points.toLocaleString(), stats.quizzesTaken, `#${stats.rank}`, `${stats.averageScore}%`];
    return { ...config, value: values[index] };
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-6 sm:px-6 sm:py-8">
      <div className="container mx-auto max-w-6xl">
        {/* Profile Header */}
        <div className="mb-6 sm:mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-indigo-500/20 text-3xl sm:text-4xl md:text-5xl flex-shrink-0">
                {user.isPremium ? "👑" : "👤"}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-zinc-100 break-words">
                  {user.username}
                  {user.isPremium && (
                    <span className="ml-2 sm:ml-3 inline-block rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold text-white mt-1 sm:mt-0">
                      Premium
                    </span>
                  )}
                </h1>
                <p className="mb-1 text-sm sm:text-base text-zinc-400 break-words">{user.email}</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold ${difficultyBadge.color}/20 ${LEVEL_COLORS[stats.level]}`}>
                    Level {stats.level}
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-500 hidden sm:inline">•</span>
                  <span className="text-xs sm:text-sm text-zinc-400 whitespace-nowrap">
                    Rank #{stats.rank}
                  </span>
                  {!user.isPremium && (
                    <>
                      <span className="text-xs sm:text-sm text-zinc-500 hidden sm:inline">•</span>
                      <span className="text-xs sm:text-sm text-zinc-400 break-words">
                        {user.quizzesRemaining === 'unlimited' ? 'Unlimited' : `${user.quizzesRemaining} quizzes left`}
                      </span>
                    </>
                  )}
                </div>
                
                {/* Subscription Details */}
                {planDetails && (
                  <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-2 sm:px-3 py-1.5 sm:py-2">
                    <span className="text-xs sm:text-sm text-yellow-300 whitespace-nowrap">
                      {planDetails.planName}
                    </span>
                    <span className="text-xs sm:text-sm text-zinc-500 hidden sm:inline">•</span>
                    <span className={`text-xs sm:text-sm ${planDetails.isExpiring ? 'text-red-400 font-semibold' : 'text-zinc-400'} break-words`}>
                      {planDetails.isExpiring ? `Expires in ${planDetails.daysLeft} days` : `Valid until ${planDetails.expiryDate}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {statsCards.map((stat, index) => (
            <div key={index} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 text-center">
              <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-zinc-400">{stat.label}</p>
              <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${stat.color} break-words`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Quiz History */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 md:p-8">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Recent Quizzes</h2>
            <Link href="/dashboard" className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 whitespace-nowrap">
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
                const badge = getDifficultyBadge(quiz.difficulty, 'color');
                const percentage = calculatePercentage(quiz.score, quiz.totalQuestions);
                
                return (
                  <Link
                    key={quiz.id}
                    href={`/quiz/${quiz.id}/results`}
                    className="block rounded-lg border border-zinc-800 bg-zinc-950 p-4 sm:p-6 transition-all hover:border-indigo-500/50 hover:bg-zinc-800"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                          <h3 className="text-base sm:text-lg font-semibold text-zinc-100 break-words">{quiz.title}</h3>
                          <span className={`rounded-full ${badge.color}/20 px-2 sm:px-3 py-1 text-xs font-semibold text-${badge.color.replace('bg-', '')} whitespace-nowrap`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="mb-2 text-xs sm:text-sm text-zinc-400 break-words">{quiz.topic}</p>
                        <p className="text-xs text-zinc-500 flex flex-wrap items-center gap-1 sm:gap-2">
                          <span>{new Date(quiz.completedAt).toLocaleDateString()}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{quiz.questionsCount} questions</span>
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="mb-1 text-xl sm:text-2xl font-bold text-indigo-400">{percentage}%</p>
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

        {/* My Generated Quizzes */}
        <div className="mt-6 sm:mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 md:p-8">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">My Generated Quizzes</h2>
            <span className="text-xs sm:text-sm text-zinc-400 whitespace-nowrap">
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
                const badge = getDifficultyBadge(quiz.difficulty, 'color');
                
                return (
                  <Link
                    key={quiz.id}
                    href={`/quiz/${quiz.id}`}
                    className="block rounded-lg border border-zinc-800 bg-zinc-950 p-4 sm:p-6 transition-all hover:border-indigo-500/50 hover:bg-zinc-800"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-2 text-base sm:text-lg font-semibold text-zinc-100 line-clamp-2 break-words">{quiz.title}</h3>
                        <p className="mb-2 text-xs sm:text-sm text-zinc-400 break-words">{quiz.topic}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className={`rounded-full ${badge.color}/20 px-2 sm:px-3 py-1 text-xs font-semibold text-${badge.color.replace('bg-', '')} whitespace-nowrap`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-zinc-500 whitespace-nowrap">
                          {quiz.questionsCount} questions
                        </span>
                      </div>
                      <div className="text-right sm:text-left">
                        <p className="text-xs text-zinc-500 whitespace-nowrap">
                          {quiz.timesPlayed || 0} {quiz.timesPlayed === 1 ? 'play' : 'plays'}
                        </p>
                        <p className="text-xs text-zinc-500 whitespace-nowrap">
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

