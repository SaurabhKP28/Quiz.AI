'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizQuestion from '../../components/QuizQuestion';
import Timer from '../../components/Timer';
import { QuizQuestion as QuizQuestionType, QuizSetup } from '../../lib/types';
import { supabase, dbOperations } from '../../lib/supabaseClient';
import { getTotalQuizTime } from '../../lib/timeUtils';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Quiz() {
  const router = useRouter();

  const [quizSetup, setQuizSetup] = useState<QuizSetup | null>(null);
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  /* ================= LOAD QUIZ ================= */

  useEffect(() => {
    const setup = sessionStorage.getItem('quizSetup');
    if (!setup) {
      router.push('/setup');
      return;
    }

    const parsedSetup: QuizSetup = JSON.parse(setup);
    setQuizSetup(parsedSetup);

    const loadQuestions = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: parsedSetup.topic,
            difficulty: parsedSetup.difficulty,
            numberOfQuestions: parsedSetup.numberOfQuestions,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to generate quiz');
        }

        const data = await response.json();
        const generatedQuestions: QuizQuestionType[] = data.questions;

        setQuestions(generatedQuestions);
        setUserAnswers(new Array(generatedQuestions.length).fill(''));
        setStartTime(Date.now());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [router]);

  /* ================= HANDLERS ================= */

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const goToNextQuestion = (answers: string[]) => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1] || null);
    } else {
      finishQuiz(answers);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);

    goToNextQuestion(newAnswers);
  };

  const handleTimeUp = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer || '';
    setUserAnswers(newAnswers);

    goToNextQuestion(newAnswers);
  };

  /* ================= FINISH QUIZ ================= */

  const finishQuiz = async (finalAnswers: string[]) => {
    let score = 0;

    const questionsWithAnswers = questions.map((q, i) => {
      if (finalAnswers[i] === q.answer) score++;
      return { ...q, userAnswer: finalAnswers[i] };
    });

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const totalPossibleTime = getTotalQuizTime(questions.length);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && quizSetup) {
        await dbOperations.saveQuizResult({
          topic: quizSetup.topic,
          difficulty: quizSetup.difficulty,
          questions: questionsWithAnswers,
          score,
          totalQuestions: questions.length,
          timeTaken,
        });
      }
    } catch (err) {
      console.error('Failed to save quiz result:', err);
    }

    sessionStorage.setItem(
      'quizResults',
      JSON.stringify({
        score,
        total: questions.length,
        questions: questionsWithAnswers,
        timeTaken,
        totalPossibleTime,
      })
    );

    router.push('/result');
  };

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!questions.length) return null;

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-6 items-center">
          <h1 className="text-2xl font-bold">{quizSetup?.topic}</h1>

          {/* 🔥 KEY RESETS TIMER PER QUESTION */}
          <Timer
            key={currentQuestionIndex}
            duration={60}
            isActive={true}
            onTimeUp={handleTimeUp}
          />
        </div>

        <QuizQuestion
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
        />

        <div className="mt-6 flex justify-between">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((i) => i - 1)}
            className="btn-secondary"
          >
            Previous
          </button>

          <button
            disabled={!selectedAnswer}
            onClick={handleNextQuestion}
            className="btn-primary"
          >
            {currentQuestionIndex === questions.length - 1
              ? 'Finish Quiz'
              : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
