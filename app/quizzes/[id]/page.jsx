"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notification } from "antd";
import Link from "next/link";
import { categoryAPI } from "../../../api/api";
import Button from "../../../component/ui/Button";

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
      notification.error({
        message: "Error",
        description: "Failed to load quizzes",
        placement: "topRight",
      });
      router.push("/quizzes");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    if (difficulty <= 2) return { label: "Easy", color: "bg-green-500 text-green-100" };
    if (difficulty <= 5) return { label: "Medium", color: "bg-yellow-500 text-yellow-100" };
    if (difficulty <= 8) return { label: "Hard", color: "bg-orange-500 text-orange-100" };
    return { label: "Expert", color: "bg-red-500 text-red-100" };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-6xl">📚</div>
          <p className="text-xl text-zinc-400">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/quizzes"
              className="mb-4 inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300"
            >
              ← Back to Categories
            </Link>
            <h1 className="mb-2 text-4xl font-bold text-zinc-100">{category.name}</h1>
            {category.description && (
              <p className="text-zinc-400">{category.description}</p>
            )}
            <p className="mt-2 text-sm text-zinc-500">
              {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"} available
            </p>
          </div>
        </div>

        {quizzes.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-8xl">📝</div>
            <h2 className="mb-4 text-2xl font-bold text-zinc-100">No Quizzes in this Category</h2>
            <p className="mb-8 text-zinc-400">Generate the first quiz for {category.name}!</p>
            <Button href="/" variant="primary" size="lg">
              Generate Quiz
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => {
              const badge = getDifficultyBadge(quiz.difficulty);
              
              return (
                <Link
                  key={quiz._id}
                  href={`/quiz/${quiz._id}`}
                  className="block rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-indigo-500/50 hover:bg-zinc-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <h3 className="text-xl font-bold text-zinc-100">{quiz.title}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      
                      {quiz.description && (
                        <p className="mb-3 text-sm text-zinc-400">{quiz.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                          📝 {quiz.questions.length} questions
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          👤 {quiz.userId?.username || "Anonymous"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          🎮 {quiz.timesPlayed || 0} plays
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center">
                      <span className="text-3xl text-indigo-400">→</span>
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

