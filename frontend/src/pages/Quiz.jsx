import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import QuizCard from "../components/QuizCard";
import ProgressBar from "../components/ProgressBar";
import HintButton from "../components/HintButton";

const TOTAL_QUESTIONS = 10;
const TIMER_SECONDS = 20;

export default function Quiz({ category, onFinish, onExitQuiz }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [visibleAnswers, setVisibleAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState(
    Array(TOTAL_QUESTIONS).fill(null)
  );

  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(
          `/api/questions?category=${category}&limit=${TOTAL_QUESTIONS}`
        );
        if (!res.ok) {
          throw new Error("Failed to load questions");
        }
        const data = await res.json();
        console.log("Questions fetched:", data);
        setQuestions(data);
        setUserAnswers(Array(data.length).fill(null));
      } catch (err) {
        toast.error(err.message);
      }
    }
    fetchQuestions();
  }, [category]);

  useEffect(() => {
    if (questions.length > 0) {
      const q = questions[currentIndex];
      setVisibleAnswers(q.options);
      setSelectedAnswer(null);
      setShowResults(false);
      setTimeLeft(TIMER_SECONDS);
    }
  }, [questions, currentIndex]);

  useEffect(() => {
    if (showResults || questions.length === 0) {
      clearInterval(timerRef.current);
      return;
    }

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [showResults, questions, currentIndex]);

  if (questions.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-700">
        Loading questions...
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  function handleAnswer(answer) {
    clearInterval(timerRef.current);
    setSelectedAnswer(answer);
    setShowResults(true);

    const nextUserAnswers = [...userAnswers];
    nextUserAnswers[currentIndex] = answer;
    setUserAnswers(nextUserAnswers);

    const isCorrect = answer === currentQ.correct_answer;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentIndex(nextIndex);
      } else {
        const finalScore = isCorrect && answer !== null ? score + 1 : score;
        console.log("Quiz finished. Data for review page:");
        console.log("Final Score:", finalScore);
        console.log("Questions array:", questions);
        console.log("User Answers array:", nextUserAnswers);
        onFinish({
          score: finalScore,
          questions: questions,
          userAnswers: nextUserAnswers,
        });
      }
    }, 2000);
  }

  function useHint() {
    if (hintsLeft <= 0 || showResults) return;

    const incorrects = visibleAnswers.filter(
      (a) => a !== currentQ.correct_answer
    );

    if (incorrects.length > 0) {
      const randomIndex = Math.floor(Math.random() * incorrects.length);
      const toRemove = incorrects[randomIndex];
      const newAnswers = visibleAnswers.filter((a) => a !== toRemove);
      setVisibleAnswers(newAnswers);
      setHintsLeft((prev) => prev - 1);
      console.log(
        "Hint used. Removed:",
        toRemove,
        "New visible answers:",
        newAnswers
      );
    } else {
      console.warn(
        "Hint could not be applied: No incorrect answers to remove, or correct_answer is missing."
      );
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-16">
      <div className="flex justify-between items-center mb-6">
        <ProgressBar current={currentIndex} total={questions.length} />
        <div className="font-semibold text-gray-700 text-lg">
          Time left: <span className="text-[#FF6F3C]">{timeLeft}s</span>
        </div>
      </div>

      <QuizCard
        question={currentQ.question}
        answers={visibleAnswers}
        selectedAnswer={selectedAnswer}
        correctAnswer={currentQ.correct_answer}
        onSelect={handleAnswer}
        showResults={showResults}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
      />

      <div className="mt-6 flex justify-between items-center">
        <HintButton
          hintsLeft={hintsLeft}
          onUseHint={useHint}
          disabled={showResults}
        />
        <div className="text-gray-700 font-bold text-xl">
          Score: <span className="text-[#00B8A9]">{score}</span>
        </div>
      </div>

      <button
        onClick={onExitQuiz}
        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-bold text-lg transition duration-200"
      >
        Exit Quiz
      </button>
    </div>
  );
}
