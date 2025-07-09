import React, { useState } from "react";
import StartScreen from "./pages/StartScreen";
import Quiz from "./pages/Quiz";
import Review from "./pages/Review";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [stage, setStage] = useState("start");
  const [category, setCategory] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizUserAnswers, setQuizUserAnswers] = useState([]);
  const [finalScore, setFinalScore] = useState(0);

  const handleStart = async (selectedCategory) => {
    setCategory(selectedCategory);
    setStage("quiz");
  };

  const handleFinish = (results) => {
    console.log("App.jsx - Received quiz results:", results);

    setFinalScore(results.score);
    setQuizQuestions(results.questions);
    setQuizUserAnswers(results.userAnswers);
    setStage("review");
  };

  const handleExitQuiz = () => {
    console.log("App.jsx - Exiting quiz, resetting state.");
    setCategory("");
    setFinalScore(0);
    setQuizQuestions([]);
    setQuizUserAnswers([]);
    setStage("start");
  };

  const handleRestart = () => {
    setCategory("");
    setFinalScore(0);
    setQuizQuestions([]);
    setQuizUserAnswers([]);
    setStage("start");
  };

  return (
    <>
      <ToastContainer />
      {stage === "start" && <StartScreen onStart={handleStart} />}
      {stage === "quiz" && (
        <Quiz
          category={category}
          onFinish={handleFinish}
          onExitQuiz={handleExitQuiz}
        />
      )}
      {stage === "review" && (
        <Review
          questions={quizQuestions}
          userAnswers={quizUserAnswers}
          onRestart={handleRestart}
          finalScore={finalScore}
          totalQuestions={quizQuestions.length}
        />
      )}
    </>
  );
}
