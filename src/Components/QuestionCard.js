import React, { useState } from "react";

const QuestionCard = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const questions = [
    {
      question: "Translate",
      options: ["Dịch", "Chạy", "Nghe", "Học"],
      correct: "Dịch",
    },
    {
      question: "Run",
      options: ["Chạy", "Nghe", "Học", "Dịch"],
      correct: "Chạy",
    },
  ];

  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === questions[questionIndex].correct) {
      setFeedback("Correct! Well done.");
    } else {
      setFeedback("Incorrect. Try again.");
    }
  };

  const handleNext = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedOption(null);
      setFeedback("");
    }
  };

  const handlePrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      setSelectedOption(null);
      setFeedback("");
    }
  };

  const currentQuestion = questions[questionIndex];

  return (
    <div className="bg-gray-800 text-gray-100 shadow-md rounded-lg p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">
        What is the meaning of:{" "}
        <span className="text-blue-400">{currentQuestion.question}</span>?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 
                        ${
                          selectedOption === option
                            ? option === currentQuestion.correct
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && <p className="mt-3 text-sm font-medium">{feedback}</p>}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={questionIndex === 0}
          className="px-4 py-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-500 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={questionIndex === questions.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
