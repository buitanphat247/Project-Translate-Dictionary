import React, { useState, useEffect } from "react";
import dayjs from "dayjs"; // Import dayjs để xử lý ngày tháng
import { toast } from "react-toastify"; // Để hiển thị thông báo sau khi người dùng trả lời đúng/sai

const Quizz = () => {
  const [questionsGroupedByDate, setQuestionsGroupedByDate] = useState({});
  const [start, setStart] = useState(false); // Trạng thái để bắt đầu quiz
  const [selectedGame, setSelectedGame] = useState(null); // Lưu trữ kiểu trò chơi đã chọn (Từ Đã Học, Chưa Học, Tất Cả)
  const [questions, setQuestions] = useState([]); // Câu hỏi trong trò chơi

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("translations")) || [];

    const groupedByDate = storedData.reduce((groups, item) => {
      const dateKey = dayjs(item.addedAt).format("DD/MM/YYYY");

      if (!groups[dateKey]) {
        groups[dateKey] = {
          learned: [],
          notLearned: [],
          all: [],
        };
      }

      if (item.learned) {
        groups[dateKey].learned.push(item);
      } else {
        groups[dateKey].notLearned.push(item);
      }

      groups[dateKey].all.push(item);
      return groups;
    }, {});

    setQuestionsGroupedByDate(groupedByDate);
  }, []);

  const handleGameStart = (dateKey, gameType) => {
    setSelectedGame(gameType);
    setStart(true);

    const selectedQuestions = questionsGroupedByDate[dateKey][gameType]; // Lọc đúng mảng tương ứng từ đối tượng gameType

    if (!selectedQuestions) {
      // Nếu không tìm thấy từ nào, có thể là do gameType không hợp lệ, ta cần xử lý tình huống này
      console.error("No questions found for the selected type:", gameType);
      return;
    }

    // Định dạng câu hỏi cho quiz
    const formattedQuestions = selectedQuestions.map(item => {
      const otherOptions = selectedQuestions
        .filter(otherItem => otherItem.trans !== item.trans)
        .map(otherItem => otherItem.trans)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3); // 3 đáp án sai
      const options = [...otherOptions, item.trans].sort(() => 0.5 - Math.random());

      return {
        word: item.word,
        options,
        correct: item.trans,
        userAnswer: null,
        feedback: null,
      };
    });

    setQuestions(formattedQuestions);
  };

  const handleOptionClick = (questionIndex, option) => {
    const selectedQuestion = questions[questionIndex];
    const correctOption = selectedQuestion.correct;

    // Cập nhật câu trả lời của người dùng
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, idx) =>
        idx === questionIndex
          ? {
            ...q,
            userAnswer: option,
            feedback: option === correctOption ? "Correct! Well done." : "Incorrect. Try again.",
            isLearned: option === correctOption, // Đánh dấu trạng thái learned
          }
          : q
      )
    );

    // Tạo thông báo cho câu trả lời
    const feedbackMessage =
      option === correctOption
        ? "🎉 Correct Answer! Well done!"
        : "😢 Oops! That's incorrect. Try again!";

    // Hiển thị thông báo
    toast[option === correctOption ? "success" : "error"](feedbackMessage, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Cập nhật lại trạng thái learned trong localStorage
    const storedData = JSON.parse(localStorage.getItem("translations")) || [];
    const updatedData = storedData.map((item) =>
      item.word === selectedQuestion.word
        ? { ...item, learned: option === correctOption }  // Cập nhật trạng thái learned
        : item
    );

    // Lưu lại dữ liệu đã được cập nhật vào localStorage
    localStorage.setItem("translations", JSON.stringify(updatedData));
  };


  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center py-8">
      {/* Hiển thị giao diện chọn nhóm và bắt đầu trò chơi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 container gap-5 p-2">

        {!start && Object.keys(questionsGroupedByDate).map((dateKey) => (
          <div key={dateKey} className="my-6 bg-gray-800 rounded-lg shadow-lg p-2 w-full max-w-2xl mx-auto">
            <div className="text-white font-bold text-2xl sm:text-xl md:text-2xl text-center">
              <span>{dateKey}</span>
            </div>

            {/* Các button trò chơi */}
            <div className="mt-4 space-y-2">
              {/* Từ Đã Học */}
              <button
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg transform transition duration-200 text-sm sm:text-base lg:text-lg"
                onClick={() => handleGameStart(dateKey, "learned")}
              >
                Từ Đã Học ({questionsGroupedByDate[dateKey].learned.length})
              </button>

              {/* Từ Chưa Học */}
              <button
                className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg transform transition duration-200 text-sm sm:text-base lg:text-lg"
                onClick={() => handleGameStart(dateKey, "notLearned")}
              >
                Từ Chưa Học ({questionsGroupedByDate[dateKey].notLearned.length})
              </button>

              {/* Tất Cả */}
              <button
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 px-6 rounded-lg shadow-lg transform transition duration-200 text-sm sm:text-base lg:text-lg"
                onClick={() => handleGameStart(dateKey, "all")}
              >
                Tất Cả ({questionsGroupedByDate[dateKey].all.length})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hiển thị trò chơi quiz */}
      {start && selectedGame && questions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 container gap-5 p-2">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-3 rounded-lg shadow-lg transition-all duration-300 transform "
              style={{ backgroundColor: "#2D2D2D" }}
            >
              <h2 className="text-md mb-2 font-semibold text-white">
                {idx + 1}. What is the meaning of:{" "}
                <span className="text-blue-400">{q.word}</span>?
              </h2>

              <div className="space-y-3">
                {q.options.map((option, optionIdx) => (
                  <button
                    key={optionIdx}
                    onClick={() => handleOptionClick(idx, option)}
                    className={`w-full p-2 text-sm font-medium rounded-lg border-2 transition duration-300 ${q.userAnswer === option
                      ? option === q.correct
                        ? "bg-green-500 text-white border-green-700"
                        : "bg-red-500 text-white border-red-700"
                      : "bg-gray-700 text-white border-gray-600 hover:bg-gray-600 hover:border-white"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Feedback cho câu trả lời */}
              <p
                className={`mt-4 text-md sm:text-sm md:text-md font-medium ${q.feedback === "Correct! Well done."
                  ? "text-green-400"
                  : "text-red-500"
                  }`}
              >
                {q.feedback}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>


  );
};

export default Quizz;
