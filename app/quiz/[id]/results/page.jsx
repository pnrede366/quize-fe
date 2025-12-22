"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notification } from "antd";
import Link from "next/link";
import Button from "../../../../component/ui/Button";
import { quizAPI, userAPI } from "../../../../api/api";

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizResults();
  }, [params.id]);

  const fetchQuizResults = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Fetch quiz data
      const quizData = await quizAPI.getById(params.id);
      setQuiz(quizData);

      // Fetch user's result for this quiz
      const resultData = await userAPI.getQuizResult(params.id);
      setResult(resultData);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to load quiz results",
        placement: "topRight",
      });
      router.push("/profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-6xl">📊</div>
          <p className="text-xl text-zinc-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!quiz || !result) return null;

  const percentage = result.percentage;
  const isPerfect = result.score === result.totalQuestions;

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="mb-4 inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300">
            ← Back to Profile
          </Link>
          <div className="text-center">
            <div className="mb-4 text-8xl">
              {isPerfect ? "🏆" : percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📝"}
            </div>
            <h1 className="mb-2 text-4xl font-bold text-zinc-100">{quiz.title}</h1>
            <p className="text-xl text-zinc-400">Your Results</p>
          </div>
        </div>

        {/* Score Summary */}
        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="mb-2 text-sm text-zinc-400">Score</p>
              <p className="text-3xl font-bold text-indigo-400">
                {result.score}/{result.totalQuestions}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-zinc-400">Percentage</p>
              <p className={`text-3xl font-bold ${isPerfect ? 'text-yellow-400' : 'text-green-400'}`}>
                {percentage}%
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-zinc-400">Grade</p>
              <p className="text-3xl font-bold text-yellow-400">
                {percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : "D"}
              </p>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-100">Answer Review</h2>
          {quiz.questions.map((question, index) => {
            const userAnswerObj = result.answers.find(a => a.questionIndex === index);
            const userAnswer = userAnswerObj?.selectedAnswer ?? -1;
            const isCorrect = userAnswerObj?.isCorrect ?? false;
            
            return (
              <div
                key={index}
                className={`rounded-xl border p-6 ${
                  isCorrect
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-red-500/30 bg-red-500/10"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="flex-1 text-lg font-semibold text-zinc-100">
                    {index + 1}. {question.question}
                  </h3>
                  <span className="text-2xl">{isCorrect ? "✅" : "❌"}</span>
                </div>
                
                {/* All Options */}
                <div className="mb-4 space-y-2">
                  {question.options.map((option, optIndex) => {
                    const isUserAnswer = userAnswer === optIndex;
                    const isCorrectAnswer = question.correctAnswer === optIndex;
                    
                    return (
                      <div
                        key={optIndex}
                        className={`rounded-lg border p-3 ${
                          isCorrectAnswer
                            ? "border-green-500/50 bg-green-500/20"
                            : isUserAnswer
                            ? "border-red-500/50 bg-red-500/20"
                            : "border-zinc-700 bg-zinc-900"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isCorrectAnswer && <span className="text-green-400">✓</span>}
                          {isUserAnswer && !isCorrectAnswer && <span className="text-red-400">✗</span>}
                          <span className={`${isCorrectAnswer ? 'text-zinc-100 font-semibold' : 'text-zinc-300'}`}>
                            {option}
                          </span>
                          {isUserAnswer && (
                            <span className="ml-auto text-xs text-zinc-400">(Your answer)</span>
                          )}
                          {isCorrectAnswer && (
                            <span className="ml-auto text-xs text-green-400">(Correct)</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
                    <p className="mb-1 text-sm font-semibold text-zinc-300">Explanation:</p>
                    <p className="text-sm text-zinc-400">{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button href="/profile" variant="outline" size="lg" className="flex-1">
            Back to Profile
          </Button>
          <Button href="/leaderboard" variant="primary" size="lg" className="flex-1">
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}

