import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const Home = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translations, setTranslations] = useState([]);
  const [searchInput, setSearchInput] = useState("");

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

  const clearTableAndInput = () => {
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

  return (
    <div className="bg-gray-900">
      <div className="container mx-auto p-6 text-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">Translation App</h1>

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
          className="w-full p-4 border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400"
          placeholder="Nhập văn bản tiếng Anh"
        ></textarea>

        <div className="flex justify-between mt-4">
          <button
            onClick={clearTableAndInput}
            className="bg-red-500 px-4 py-2 rounded-md shadow hover:bg-red-400 transition"
          >
            Xóa tất cả
          </button>

          {/* Nút Nhập Excel */}
          <label
            htmlFor="upload-file"
            className="bg-green-500 px-4 py-2 rounded-md shadow hover:bg-green-400 transition cursor-pointer"
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
            className="bg-blue-600 px-4 py-2 rounded-md shadow hover:bg-blue-500 transition"
          >
            Xuất Excel
          </button>

          <button
            onClick={translateText}
            className="bg-blue-600 px-4 py-2 rounded-md shadow hover:bg-blue-500 transition"
          >
            Dịch
          </button>
        </div>

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

        <table className="table-auto w-full mt-8 border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 px-4 py-2">Word</th>
              <th className="border border-gray-700 px-4 py-2">Meaning</th>
              <th className="border border-gray-700 px-4 py-2">Added At</th>
              <th className="border border-gray-700 px-4 py-2">Learned</th>
              <th className="border border-gray-700 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filterTranslations().map((item, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className="border border-gray-700 px-4 py-2">
                  {item.word}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {item.trans}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  {item.addedAt}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.learned}
                    onChange={(e) =>
                      updateLearnedStatus(item.word, e.target.checked)
                    }
                    className="form-checkbox text-blue-500"
                  />
                </td>
                <td className="border border-gray-700 px-4 py-2 text-center">
                  <button
                    onClick={() => removeFromLocalStorage(item.word)}
                    className="bg-red-500 px-3 py-1 rounded-md text-white hover:bg-red-400 transition"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
