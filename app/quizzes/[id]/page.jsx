"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { message } from "antd";
import Link from "next/link";
import { categoryAPI } from "../../../api/api";
import Button from "../../../component/ui/Button";
import Loader from "../../../component/ui/Loader";
import { getDifficultyBadgeWithColor } from "../../../helper/utility.js";

export default function CategoryQuizzesPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, [params.id]);

  const fetchCategoryData = async () => {
    try {
      const [categoryData, quizzesData] = await Promise.all([
        categoryAPI.getCategoryById(params.id),
        categoryAPI.getQuizzesByCategory(params.id),
      ]);
      setCategory(categoryData);
      setQuizzes(quizzesData);
    } catch (error) {
      message.error("Failed to load quizzes");
      router.push("/quizzes");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <Loader emoji="📚" message="Loading quizzes..." />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-6 sm:px-6 sm:py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/quizzes"
            className="mb-3 inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 sm:mb-4 sm:text-sm"
          >
            ← Back to Categories
          </Link>
          <h1 className="mb-2 text-2xl font-bold text-zinc-100 sm:text-3xl md:text-4xl">{category.name}</h1>
          {category.description && (
            <p className="text-sm text-zinc-400 sm:text-base">{category.description}</p>
          )}
          <p className="mt-2 text-xs text-zinc-500 sm:text-sm">
            {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"} available
          </p>
        </div>

        {quizzes.length === 0 ? (
          <div className="py-12 text-center sm:py-20">
            <div className="mb-4 text-6xl sm:text-8xl">📝</div>
            <h2 className="mb-4 text-xl font-bold text-zinc-100 sm:text-2xl">No Quizzes in this Category</h2>
            <p className="mb-6 text-sm text-zinc-400 sm:mb-8 sm:text-base">Generate the first quiz for {category.name}!</p>
            <Button href="/" variant="primary" size="lg">
              Generate Quiz
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {quizzes.map((quiz) => {
              const badge = getDifficultyBadgeWithColor(quiz.difficulty);
              
              return (
                <Link
                  key={quiz._id}
                  href={`/quiz/${quiz._id}`}
                  className="block rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-indigo-500/50 hover:bg-zinc-800 sm:rounded-xl sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-3 sm:gap-3">
                        <h3 className="break-words text-base font-bold text-zinc-100 sm:text-lg md:text-xl">{quiz.title}</h3>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold sm:px-3 sm:py-1 ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      
                      {quiz.description && (
                        <p className="mb-2 line-clamp-2 text-xs text-zinc-400 sm:mb-3 sm:text-sm">{quiz.description}</p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 sm:gap-4 sm:text-sm">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          📝 {quiz.questions.length} questions
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          👤 {quiz.userId?.username || "Anonymous"}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          🎮 {quiz.timesPlayed || 0} plays
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="whitespace-nowrap">
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center sm:ml-4">
                      <span className="text-2xl text-indigo-400 sm:text-3xl">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

