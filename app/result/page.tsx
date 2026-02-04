'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizQuestion from '../../components/QuizQuestion';
import { QuizResult } from '../../lib/types';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';



export default function Result() {
  const router = useRouter();

  const [results, setResults] = useState<QuizResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [analytics, setAnalytics] = useState<{
    totalQuizzes: number;
    averageScore: number;
    bestScore: number;
    accuracy: number;
  } | null>(null);

  /* ================= LOAD RESULTS ================= */

  useEffect(() => {
    const storedResults = sessionStorage.getItem('quizResults');

    if (!storedResults) {
      router.push('/');
      return;
    }

    const parsed: QuizResult = JSON.parse(storedResults);
    setResults(parsed);

    const fetchAnalytics = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: quizzes } = await supabase
        .from('quizzes')
        .select('score, total_questions')
        .eq('user_id', user.id);

      if (!quizzes || quizzes.length === 0) return;

      const totalScore = quizzes.reduce((s, q) => s + q.score, 0);
      const totalQuestions = quizzes.reduce((s, q) => s + q.total_questions, 0);

      setAnalytics({
        totalQuizzes: quizzes.length,
        averageScore: Number((totalScore / quizzes.length).toFixed(2)),
        bestScore: Math.max(...quizzes.map(q => q.score)),
        accuracy: Number(((totalScore / totalQuestions) * 100).toFixed(1)),
      });
    };

    fetchAnalytics();
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  /* ================= DERIVED VALUES ================= */

  const accuracy = Math.round((results.score / results.total) * 100);
  const passed = accuracy >= 70;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const getAccuracyColor = () => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLabel = () => {
    if (accuracy >= 90) return 'Excellent';
    if (accuracy >= 80) return 'Very Good';
    if (accuracy >= 60) return 'Good';
    return 'Needs Improvement';
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ================= SUMMARY ================= */}
        <div className="card text-center mb-8">
          <Trophy
            className={`mx-auto h-12 w-12 ${
              passed ? 'text-green-600' : 'text-red-600'
            }`}
          />

          <h1 className="text-3xl font-bold mt-4">Quiz Complete!</h1>

          <div className="grid md:grid-cols-3 gap-6 mt-6">

            {/* FINAL SCORE (NUMBER ONLY) */}
            <div>
              <div className="text-4xl font-bold text-gray-900">
                {results.score}
              </div>
              <div className="text-gray-600">
                Correct out of {results.total}
              </div>
            </div>

            {/* ACCURACY */}
            <div>
              <div className={`text-4xl font-bold ${getAccuracyColor()}`}>
                {accuracy}%
              </div>
              <div className="text-gray-600">Accuracy</div>
            </div>

            {/* TIME */}
            <div>
              <div className="text-4xl font-bold text-gray-900">
                {formatTime(results.timeTaken ?? 0)}
              </div>
              <div className="text-gray-600">
                Out of {formatTime(results.totalPossibleTime ?? 0)}
              </div>
            </div>
          </div>

          {/* PERFORMANCE */}
          <p className={`mt-4 text-lg font-semibold ${getAccuracyColor()}`}>
            {getPerformanceLabel()}
          </p>

          {/* ACTIONS */}
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/setup" className="btn-primary inline-flex items-center">
              <RotateCcw className="mr-2 h-5 w-5" />
              Take Another Quiz
            </Link>

            <Link href="/" className="btn-secondary inline-flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* ================= ANALYTICS ================= */}
        {analytics && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">
              Your Overall Progress
            </h2>

            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600">
                  {analytics.totalQuizzes}
                </div>
                <div className="text-gray-600">Quizzes Taken</div>
              </div>

              <div>
                <div className="text-3xl font-bold">
                  {analytics.averageScore}
                </div>
                <div className="text-gray-600">Avg Score</div>
              </div>

              <div>
                <div className="text-3xl font-bold text-green-600">
                  {analytics.bestScore}
                </div>
                <div className="text-gray-600">Best Score</div>
              </div>

              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {analytics.accuracy}%
                </div>
                <div className="text-gray-600">Overall Accuracy</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= REVIEW ================= */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Review Questions</h2>

            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCurrentQuestionIndex(i => Math.max(0, i - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-gray-600">
                {currentQuestionIndex + 1} / {results.questions.length}
              </span>

              <button
                onClick={() =>
                  setCurrentQuestionIndex(i =>
                    Math.min(results.questions.length - 1, i + 1)
                  )
                }
                disabled={currentQuestionIndex === results.questions.length - 1}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <QuizQuestion
            question={results.questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={results.questions.length}
            selectedAnswer={
              results.questions[currentQuestionIndex].userAnswer || ''
            }
            onAnswerSelect={() => {}}
            showResult
            disabled
          />
        </div>
      </div>
    </div>
  );
}
