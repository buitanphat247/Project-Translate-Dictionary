import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Quizz = () => {
  const [start, setStart] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null); // Để chọn game

  const handleStart = (gameType) => {
    setSelectedGame(gameType); // Cập nhật game đã chọn

    const storedData = JSON.parse(localStorage.getItem("translations")) || [];

    let filteredData = storedData; // Cùng sử dụng dữ liệu dịch sẵn.

    if (gameType === "learned") {
      // Nếu chọn 'Từ đã học', lọc các từ đã học
      filteredData = storedData.filter(item => item.learned === true);
    } else if (gameType === "notLearned") {
      // Nếu chọn 'Từ chưa học', lọc các từ chưa học
      filteredData = storedData.filter(item => item.learned === false);
    }

    // Định dạng câu hỏi
    const formattedQuestions = filteredData.map((item) => {
      const otherOptions = storedData
        .filter((otherItem) => otherItem.trans !== item.trans)
        .map((otherItem) => otherItem.trans)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3); // Lấy 3 đáp án sai ngẫu nhiên
      const options = [...otherOptions, item.trans].sort(() => 0.5 - Math.random()); // Trộn đáp án
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
    const shuffledQuestions = formattedQuestions.sort(() => 0.5 - Math.random());
    setQuestions(shuffledQuestions);
    setStart(true);
  };

  const handleOptionClick = (questionIndex, option) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, idx) =>
        idx === questionIndex
          ? {
            ...q,
            userAnswer: option,
            feedback: option === q.correct ? "Correct! Well done." : "Incorrect. Try again.",
            isLearned: option === q.correct,
          }
          : q
      )
    );

    const correctOption = questions[questionIndex].correct; // Dùng correctOption để kiểm tra
    const feedbackMessage =
      option === correctOption
        ? "🎉 Correct Answer! Well done!"
        : "😢 Oops! That's incorrect. Try again!";

    toast[option === correctOption ? "success" : "error"](feedbackMessage, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Cập nhật trạng thái học vào localStorage
    const storedData = JSON.parse(localStorage.getItem("translations")) || [];
    const updatedData = storedData.map((item) =>
      item.word === questions[questionIndex].word
        ? { ...item, learned: option === correctOption }
        : item
    );
    localStorage.setItem("translations", JSON.stringify(updatedData));
  };


  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center justify-center py-8">
      {/* Section for selecting game */}
      {!start && !selectedGame && (
        <div className="grid grid-cols-1 gap-8 w-full max-w-6xl px-4 py-8">
          {/* Card for 'Từ đã học' */}
          <div
            className="bg-cover bg-center h-64 rounded-lg shadow-lg relative"
            style={{
              backgroundImage: "url('https://png.pngtree.com/thumb_back/fw800/background/20240801/pngtree-nice-full-hd-background-image-image_16123210.jpg')", // Thêm ảnh nền cho trò chơi 'Từ đã học'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <button
                onClick={() => handleStart("learned")}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-8 rounded-lg shadow-lg"
              >
                Chơi Game - Từ đã học
              </button>
            </div>
          </div>

          {/* Card for 'Từ chưa học' */}
          <div
            className="bg-cover bg-center h-64 rounded-lg shadow-lg relative"
            style={{
              backgroundImage: "url('https://vietnamitx.com/attachments/top-hinh-nen-dong-wallpaper-engine-desktop-tuyet-dep-download-chon-loc-2021-jpg.2215/')", // Thêm ảnh nền cho trò chơi 'Từ chưa học'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <button
                onClick={() => handleStart("notLearned")}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-8 rounded-lg shadow-lg"
              >
                Chơi Game - Từ chưa học
              </button>
            </div>
          </div>

          {/* Card for 'Tổng từ vựng' */}
          <div
            className="bg-cover bg-center h-64 rounded-lg shadow-lg relative"
            style={{
              backgroundImage: "url('https://png.pngtree.com/background/20230519/original/pngtree-sunset-hd-wallpaper-picture-image_2655741.jpg')", // Thêm ảnh nền cho trò chơi 'Tổng từ vựng'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <button
                onClick={() => handleStart("all")}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-8 rounded-lg shadow-lg"
              >
                Chơi Game - Tổng từ vựng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section for game content */}
      {start && selectedGame && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6 w-full max-w-6xl">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className={`bg-gray-800 p-6 rounded-lg shadow-lg bg-cover`}
              style={{
                backgroundImage:
                  selectedGame === "learned"
                    ? "url('/path/to/learned-image.jpg')" // Đổi ảnh nền cho trò chơi 'Từ đã học'
                    : selectedGame === "notLearned"
                      ? "url('/path/to/not-learned-image.jpg')" // Đổi ảnh nền cho trò chơi 'Từ chưa học'
                      : "url('/path/to/all-vocab-image.jpg')", // Ảnh nền cho 'Tổng từ vựng'
              }}
            >
              <h2 className="text-xl font-semibold mb-4">
                {idx + 1}. What is the meaning of:{" "}
                <span className="text-blue-400">{q.word}</span>?
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {q.options.map((option, optionIdx) => (
                  <button
                    key={optionIdx}
                    onClick={() => handleOptionClick(idx, option)}
                    className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${q.userAnswer === option
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
                className={`mt-4 text-sm font-medium ${q.isLearned ? "text-green-500" : "text-red-500"
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
