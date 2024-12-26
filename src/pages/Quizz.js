import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Quizz = () => {
  const [start, setStart] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleStart = () => {
    const storedData = JSON.parse(localStorage.getItem("translations")) || [];
    if (storedData.length > 0) {
      const formattedQuestions = storedData.map((item) => {
        const otherOptions = storedData
          .filter((otherItem) => otherItem.trans !== item.trans)
          .map((otherItem) => otherItem.trans)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3); // Lấy 3 đáp án sai ngẫu nhiên
        const options = [...otherOptions, item.trans].sort(
          () => 0.5 - Math.random()
        ); // Trộn đáp án
        return {
          word: item.word,
          options,
          correct: item.trans,
          userAnswer: null,
          feedback: null,
          isLearned: item.learned || false, // Kiểm tra trạng thái học từ localStorage
        };
      });

      // Đảo lộn thứ tự hiển thị câu hỏi
      const shuffledQuestions = formattedQuestions.sort(
        () => 0.5 - Math.random()
      );
      setQuestions(shuffledQuestions);
    }
    setStart(true);
  };

  const handleOptionClick = (questionIndex, option) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, idx) =>
        idx === questionIndex
          ? {
              ...q,
              userAnswer: option,
              feedback:
                option === q.correct
                  ? "Correct! Well done."
                  : "Incorrect. Try again.",
              isLearned: option === q.correct, // Update learned status if correct
            }
          : q
      )
    );

    if (questions[questionIndex].correct === option) {
      // Update localStorage for the learned status (Correct Answer)
      const storedData = JSON.parse(localStorage.getItem("translations")) || [];
      const updatedData = storedData.map((item) =>
        item.word === questions[questionIndex].word
          ? { ...item, learned: true }
          : item
      );
      localStorage.setItem("translations", JSON.stringify(updatedData));

      toast.success("🎉 Correct Answer! Well done!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      // Update localStorage for the learned status (Incorrect Answer)
      const storedData = JSON.parse(localStorage.getItem("translations")) || [];
      const updatedData = storedData.map((item) =>
        item.word === questions[questionIndex].word
          ? { ...item, learned: false }
          : item
      );
      localStorage.setItem("translations", JSON.stringify(updatedData));

      toast.error("😢 Oops! That's incorrect. Try again!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center justify-center">
      {!start && (
        <button
          onClick={handleStart}
          className="px-8 py-4 text-lg font-bold rounded-lg shadow-lg bg-blue-600 hover:bg-blue-500 transition-colors duration-300"
        >
          Start Game
        </button>
      )}
      {start && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6 w-full max-w-6xl">
          {questions.map((q, idx) => (
            <div key={idx} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {idx + 1}. What is the meaning of:{" "}
                <span className="text-blue-400">{q.word}</span>?
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {q.options.map((option, optionIdx) => (
                  <button
                    key={optionIdx}
                    onClick={() => handleOptionClick(idx, option)}
                    className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
                      q.userAnswer === option
                        ? option === q.correct
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p
                className={`mt-4 text-sm font-medium ${
                  q.isLearned ? "text-green-500" : "text-red-500"
                }`}
              >
                {q.isLearned ? "Learned" : "Not Learned"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quizz;
