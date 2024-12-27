import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Modal } from "antd";

const Home = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translations, setTranslations] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editWord, setEditWord] = useState(null); // Từ cần sửa
  const [editTrans, setEditTrans] = useState(""); // Nghĩa mới
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    const savedTranslations =
      JSON.parse(localStorage.getItem("translations")) || [];
    setTranslations(savedTranslations);
  }, []);

  const translateText = async () => {
    if (isWordInTable(inputText)) {
      alert("Từ này đã tồn tại trong bảng.");
      return;
    }

    const url =
      "https://google-translate113.p.rapidapi.com/api/v1/translator/text";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": "253eff67b9msha750d86c9b39780p12dc71jsn2147d1feb55c",
        "x-rapidapi-host": "google-translate113.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "en",
        to: "vi",
        text: inputText,
      }),
    };

    try {
      const response = await fetch(url, options);
      console.log("response: ", response);
      const result = await response.json();
      console.log("result: ", result);
      if (result && result.trans) {
        const now = new Date();
        const formattedDate = now.toLocaleString();
        const newTranslation = {
          word: inputText,
          trans: result.trans,
          addedAt: formattedDate,
          learned: false,
        };

        setTranslations([...translations, newTranslation]);
        saveDataToLocalStorage(newTranslation);
        setTranslatedText(`Dịch: ${result.trans}`);
        setInputText("");
      } else {
        setTranslatedText("Dịch không thành công. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setTranslatedText("Lỗi kết nối. Vui lòng thử lại!");
    }
  };

  const isWordInTable = (word) => {
    return translations.some((item) => item.word === word);
  };

  const saveDataToLocalStorage = (newTranslation) => {
    const updatedTranslations = [...translations, newTranslation];
    localStorage.setItem("translations", JSON.stringify(updatedTranslations));
  };

  const updateLearnedStatus = (word, learned) => {
    const updatedTranslations = translations.map((item) => {
      if (item.word === word) {
        item.learned = learned;
      }
      return item;
    });
    setTranslations(updatedTranslations);
    localStorage.setItem("translations", JSON.stringify(updatedTranslations));
  };

  const removeFromLocalStorage = (word) => {
    const updatedTranslations = translations.filter(
      (item) => item.word !== word
    );
    setTranslations(updatedTranslations);
    localStorage.setItem("translations", JSON.stringify(updatedTranslations));
  };

  const showConfirm = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    clearTableAndInput();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const clearTableAndInput = () => {
    console.log("Xóa dữ liệu...");
    setTranslations([]);
    localStorage.removeItem("translations");
    setInputText("");
    setTranslatedText("");
  };

  const filterTranslations = () => {
    return translations.filter((item) =>
      item.word.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  // Xuất dữ liệu thành file Excel
  const exportToExcel = () => {
    const dataToExport = translations.map((item) => ({
      Word: item.word,
      Meaning: item.trans,
      AddedAt: item.addedAt,
      Learned: item.learned ? "Yes" : "No",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Translations");

    XLSX.writeFile(wb, "translations.xlsx");
  };

  // Nhập dữ liệu từ file Exceln
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      const newTranslations = data.map((row) => ({
        word: row["Word"] || "",
        trans: row["Meaning"] || "",
        addedAt: new Date().toLocaleString(),
        learned: row["Learned"] === "Yes",
      }));

      const updatedTranslations = [...translations, ...newTranslations];
      setTranslations(updatedTranslations);
      localStorage.setItem("translations", JSON.stringify(updatedTranslations));
    };

    reader.readAsBinaryString(file);
  };

  // Thống kê từ đã học / chưa học
  const learnedCount = translations.filter((item) => item.learned).length;
  const notLearnedCount = translations.length - learnedCount;

  const openEditModal = (item) => {
    setEditWord(item.word);
    setEditTrans(item.trans);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    if (!editWord || !editTrans) {
      alert("Cần nhập nghĩa mới!");
      return;
    }

    const updatedTranslations = translations.map((item) =>
      item.word === editWord ? { ...item, trans: editTrans } : item
    );

    setTranslations(updatedTranslations);
    localStorage.setItem("translations", JSON.stringify(updatedTranslations));

    setIsEditModalVisible(false);
    setEditWord(null);
    setEditTrans("");
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditWord(null);
    setEditTrans("");
  };

  return (
    <div className="bg-gray-900">
      <div className="container mx-auto p-2 text-gray-100 min-h-screen">

        <div className="flex flex-col md:flex-row justify-between ">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 justify-center">
            {/* Nút Xóa tất cả */}
            <button
              onClick={showConfirm}
              className="bg-red-500 px-4 py-2 rounded-md shadow hover:bg-red-400 transition w-full"
            >
              Xóa tất cả
            </button>

            {/* Nút Nhập Excel */}
            <label
              htmlFor="upload-file"
              className="bg-green-500 px-4 py-2 rounded-md shadow hover:bg-green-400 transition cursor-pointer w-full"
            >
              Nhập Excel
              <input
                id="upload-file"
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Nút Xuất Excel */}
            <button
              onClick={exportToExcel}
              className="bg-blue-600 px-4 py-2 rounded-md shadow hover:bg-blue-500 transition w-full"
            >
              Xuất Excel
            </button>

            {/* Nút Dịch */}
            <button
              onClick={translateText}
              className="bg-blue-600 px-4 py-2 rounded-md shadow hover:bg-blue-500 transition w-full"
            >
              Dịch
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 sm:mt-0">
            <div className="bg-gray-800 px-3 py-2 rounded-md flex items-center justify-between w-full sm:w-auto">
              <h3 className=" font-bold text-white">Từ đã học:</h3>
              <p className="font-semibold text-green-400 ml-2">
                {learnedCount}
              </p>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded-md flex items-center justify-between w-full sm:w-auto">
              <h3 className="font-bold text-white">Từ chưa học:</h3>
              <p className="font-semibold text-red-400 ml-2">
                {notLearnedCount}
              </p>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded-md flex items-center justify-between w-full sm:w-auto">
              <h3 className="font-bold text-white">Tổng từ vựng:</h3>
              <p className="font-semibold text-red-400 ml-2">
                {notLearnedCount + learnedCount}
              </p>
            </div>
          </div>

        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              translateText();
            }
          }}
          rows="4"
          className="w-full p-4 border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400 mt-4"
          placeholder="Nhập văn bản tiếng Anh"
        ></textarea>
        <div className="mt-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full p-4 border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400"
            placeholder="Tìm kiếm từ..."
          />
        </div>
        <div className="mt-6 text-lg font-semibold">{translatedText}</div>
        <Modal
          title="Xác nhận"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Đồng ý"
          cancelText="Hủy bỏ"
        >
          <p>Bạn có chắc chắn muốn xóa không?</p>
        </Modal>{" "}

        <div className="overflow-x-auto mt-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {filterTranslations().map((item, index) => (
    <div
      key={index}
      onClick={() => updateLearnedStatus(item.word, !item.learned)}
      className={`relative border px-4 py-4 rounded-lg shadow-lg transition ${item.learned ? "border-green-500 bg-gray-700" : "border-gray-700 bg-gray-800"
        } hover:shadow-xl cursor-pointer min-w-0`} // Đảm bảo độ rộng tối thiểu không phá vỡ layout
    >
      {/* Vòng tròn tick ở góc */}
      <div
        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition ${item.learned ? "bg-green-500 text-white" : "bg-gray-500 text-gray-300"
          }`}
        onClick={(e) => {
          e.stopPropagation(); // Ngừng sự kiện click từ đây đi
          updateLearnedStatus(item.word, !item.learned);
        }}
      >
        {item.learned ? (
          <i className="fa-solid fa-check text-lg"></i>
        ) : (
          <i className="fa-solid fa-circle text-lg"></i>
        )}
      </div>

      {/* Nội dung card */}
      <h3 className="text-base font-semibold text-white mb-2 break-words"> {/* Điều chỉnh kích thước chữ */}
        {item.word} <span className="text-sm text-gray-400">({item.partOfSpeech})</span>
      </h3>
      <p className="text-gray-300 text-sm mb-2 break-words">
        <strong>Meaning:</strong> {item.trans}
      </p>
      <p className="text-gray-300 text-sm mb-2 italic">
        <strong>Pronunciation:</strong> {item.pronunciation || "N/A"}
      </p>
      <p className="text-gray-300 text-sm mb-2">
        <strong>Added At:</strong> {item.addedAt || "N/A"}
      </p>

      {/* Div chứa nút Xoá và Chỉnh Sửa */}
      <div className="absolute bottom-2 right-2 flex space-x-1">
        {/* Nút Xoá */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Ngừng sự kiện click từ button
            removeFromLocalStorage(item.word);
          }}
          className="bg-red-500 w-[28px] h-[28px] rounded-full text-white hover:bg-red-400 transition flex items-center justify-center text-xs" // Giảm kích thước trên mobile
        >
          <i className="fa-solid fa-trash"></i>
        </button>

        {/* Nút Chỉnh Sửa */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Ngừng sự kiện click từ button
            openEditModal(item);
          }}
          className="bg-yellow-500 w-[28px] h-[28px] rounded-full text-white hover:bg-yellow-400 transition flex items-center justify-center text-xs" // Giảm kích thước trên mobile
        >
          <i className="fa-solid fa-pen"></i>
        </button>
      </div>
    </div>
  ))}
</div>


          <Modal
            title="Cập nhật nghĩa từ"
            visible={isEditModalVisible}
            onOk={handleEditOk}
            onCancel={handleEditCancel}
            okText="Cập nhật"
            cancelText="Hủy bỏ"
          >
            <div>
              <p><strong>Từ:</strong> {editWord}</p>
              <textarea
                value={editTrans}
                onChange={(e) => setEditTrans(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Nhập nghĩa mới"
              />
            </div>
          </Modal>

        </div>
      </div>
    </div>
  );
};

export default Home;
