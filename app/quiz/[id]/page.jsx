"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notification } from "antd";
import { quizAPI } from "../../../api/api";
import Button from "../../../component/ui/Button";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [params.id]);

  const fetchQuiz = async () => {
    try {
      const data = await quizAPI.getQuizById(params.id);
      setQuiz(data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to load quiz",
        placement: "topRight",
      });
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const answersArray = quiz.questions.map((_, index) => selectedAnswers[index] ?? -1);
    
    try {
      const result = await quizAPI.submitQuizAnswer(params.id, answersArray);
      setResults(result);
      setShowResults(true);
      
      notification.success({
        message: "Quiz Submitted! 🎉",
        description: `You scored ${result.score}/${result.total} (${result.percentage}%) - Earned ${result.pointsEarned || result.score * 10} points!`,
        placement: "topRight",
        duration: 5,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to submit quiz",
        placement: "topRight",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-6xl">📚</div>
          <p className="text-xl text-zinc-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  if (showResults) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <div className="mb-4 text-8xl">
              {results.percentage >= 80 ? "🏆" : results.percentage >= 60 ? "🎉" : "📝"}
            </div>
            <h1 className="mb-2 text-4xl font-bold text-zinc-100">Quiz Completed!</h1>
            <p className="text-xl text-zinc-400">Here are your results</p>
          </div>

          <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
              <div>
                <p className="mb-2 text-sm text-zinc-400">Score</p>
                <p className="text-3xl font-bold text-indigo-400">
                  {results.score}/{results.total}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-zinc-400">Percentage</p>
                <p className="text-3xl font-bold text-green-400">{results.percentage}%</p>
              </div>
              <div>
                <p className="mb-2 text-sm text-zinc-400">Grade</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {results.percentage >= 90 ? "A+" : results.percentage >= 80 ? "A" : results.percentage >= 70 ? "B" : results.percentage >= 60 ? "C" : "D"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-zinc-400">Points Earned</p>
                <p className="text-3xl font-bold text-purple-400">
                  +{results.pointsEarned || results.score * 10}
                </p>
              </div>
            </div>
            {results.pointsPerQuestion && (
              <div className="mt-4 text-center">
                <p className="text-sm text-zinc-500">
                  {results.pointsPerQuestion} points per correct answer
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-zinc-100">Answer Review</h2>
            {results.results.map((result, index) => (
              <div
                key={index}
                className={`rounded-xl border p-6 ${
                  result.isCorrect
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-red-500/30 bg-red-500/10"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="flex-1 text-lg font-semibold text-zinc-100">
                    {index + 1}. {result.question}
                  </h3>
                  <span className="text-2xl">{result.isCorrect ? "✅" : "❌"}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-300">
                    <span className="font-semibold">Your answer:</span>{" "}
                    {quiz.questions[index].options[result.userAnswer] || "Not answered"}
                  </p>
                  {!result.isCorrect && (
                    <p className="text-sm text-zinc-300">
                      <span className="font-semibold text-green-400">Correct answer:</span>{" "}
                      {quiz.questions[index].options[result.correctAnswer]}
                    </p>
                  )}
                  {result.explanation && (
                    <p className="text-sm text-zinc-400">
                      <span className="font-semibold">Explanation:</span> {result.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Button href="/" variant="outline" size="lg" className="flex-1">
              Back to Home
            </Button>
            <Button href="/leaderboard" variant="primary" size="lg" className="flex-1">
              View Leaderboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-100">{quiz.title}</h1>
            <span className="text-sm text-zinc-400">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="mb-6 text-xl font-semibold text-zinc-100">{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? "border-indigo-500 bg-indigo-500/20"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-indigo-500 bg-indigo-500"
                        : "border-zinc-600"
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-zinc-100">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            size="lg"
          >
            Previous
          </Button>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

