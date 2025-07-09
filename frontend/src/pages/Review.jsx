import React from "react";

export default function Review({
  questions,
  userAnswers,
  onRestart,
  finalScore,
  totalQuestions,
}) {
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-16">
      <h2 className="text-3xl font-bold mb-4 text-[#8E44AD] text-center">
        Quiz Review
      </h2>
      <div className="text-center text-2xl font-bold mb-8 text-gray-800">
        You scored: <span className="text-[#00B8A9]">{finalScore}</span> /{" "}
        {totalQuestions}
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userAnswer = userAnswers[idx];
          const correct = q.correct_answer === userAnswer;
          return (
            <div key={idx} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{q.question}</h3>
              <p>
                Your answer:{" "}
                <span className={correct ? "text-green-600" : "text-red-600"}>
                  {userAnswer || "No answer"}
                </span>
              </p>
              {!correct && (
                <p>
                  Correct answer:{" "}
                  <span className="text-green-700">{q.correct_answer}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={onRestart}
        className="mt-8 w-full bg-[#FF6F3C] hover:bg-[#e65920] text-white py-3 rounded font-bold text-xl"
      >
        Restart Quiz
      </button>
    </div>
  );
}
