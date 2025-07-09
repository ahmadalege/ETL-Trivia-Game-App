import React from "react";

export default function QuizCard({
  question,
  answers,
  selectedAnswer,
  correctAnswer,
  onSelect,
  showResults,
  questionNumber,
  totalQuestions,
}) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-[#8E44AD]">
        {questionNumber}. {question} ({questionNumber}/{totalQuestions})
      </h2>
      <div className="grid gap-4">
        {answers.map((answer, idx) => {
          let bgClass = "bg-gray-100 hover:bg-gray-200";
          if (showResults) {
            if (answer === correctAnswer)
              bgClass = "bg-[#00B8A9] text-white font-bold";
            else if (answer === selectedAnswer)
              bgClass = "bg-[#FF6F3C] text-white font-bold";
          } else if (answer === selectedAnswer) {
            bgClass = "bg-[#FF6F3C] text-white font-semibold";
          }

          return (
            <button
              key={idx}
              onClick={() => onSelect(answer)}
              disabled={showResults}
              className={`${bgClass} p-4 rounded-lg text-left text-lg transition`}
            >
              {answer}
            </button>
          );
        })}
      </div>
    </div>
  );
}
