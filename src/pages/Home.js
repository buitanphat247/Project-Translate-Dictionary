import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Modal, Tabs } from "antd";
import HomeControl from "../Components/HomeControl";
import VocabLearned from "../Components/VocabLearned";
import VocabNotLearned from "../Components/VocabNotLearned";
import OverviewVocab from "../Components/OverviewVocab";

const Home = () => {
  // State quản lý các giá trị trong ứng dụng
  const [inputText, setInputText] = useState(""); // Text người dùng nhập vào
  const [translatedText, setTranslatedText] = useState(""); // Kết quả dịch
  const [translations, setTranslations] = useState([]); // Danh sách từ đã dịch
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị hộp thoại xác nhận xóa dữ liệu
  const [editWord, setEditWord] = useState(null); // Từ đang chỉnh sửa
  const [editTrans, setEditTrans] = useState(""); // Nghĩa mới đang chỉnh sửa
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Hiển thị modal chỉnh sửa
  const [searchInput, setSearchInput] = useState(""); // Text tìm kiếm trong bảng

  // Tải danh sách từ dịch từ LocalStorage khi ứng dụng khởi động
  useEffect(() => {
    const storedTranslations = JSON.parse(localStorage.getItem("translations"));
    if (storedTranslations) {
      setTranslations(storedTranslations);
    }
  }, []);

  // Hàm dịch từ sử dụng API bên thứ ba
  const translateText = async () => {
    if (isWordInTable(inputText)) {
      alert("Từ này đã tồn tại trong bảng."); // Kiểm tra từ đã có chưa
      return;
    }

    // Cấu hình API
    const apiConfig = {
      url: "https://google-translate113.p.rapidapi.com/api/v1/translator/text",
      options: {
        method: "POST",
        headers: {
          "x-rapidapi-key": "253eff67b9msha750d86c9b39780p12dc71jsn2147d1feb55c",
          "x-rapidapi-host": "google-translate113.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: "en", to: "vi", text: inputText }),
      },
    };

    try {
      // Gửi request dịch
      const response = await fetch(apiConfig.url, apiConfig.options);
      const result = await response.json();

      // Kiểm tra kết quả và thêm từ dịch vào bảng
      if (result?.trans) {
        addNewTranslation(inputText, result.trans);
      } else {
        setTranslatedText("Dịch không thành công. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setTranslatedText("Lỗi kết nối. Vui lòng thử lại!");
    }
  };

  // Kiểm tra từ đã tồn tại trong bảng hay chưa
  const isWordInTable = (word) =>
    translations.some((item) => item.word.toLowerCase() === word.toLowerCase());

  // Thêm từ dịch mới vào danh sách
  const addNewTranslation = (word, translation) => {
    const now = new Date();
    const formattedDate = now.toLocaleString();

    const newTranslation = {
      word,
      trans: translation,
      addedAt: formattedDate,
      learned: false,
    };

    const updatedTranslations = [...translations, newTranslation];
    setTranslations(updatedTranslations);
    saveToLocalStorage(updatedTranslations); // Cập nhật LocalStorage
    setTranslatedText(`${translation}`);
  };

  // Lưu danh sách vào LocalStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem("translations", JSON.stringify(data));
  };

  // Cập nhật trạng thái "Đã học" / "Chưa học" cho từ
  const updateLearnedStatus = (word, learned) => {
    const updatedTranslations = translations.map((item) =>
      item.word === word ? { ...item, learned } : item
    );
    setTranslations(updatedTranslations);
    saveToLocalStorage(updatedTranslations);
  };

  // Xóa từ khỏi LocalStorage và danh sách
  const removeFromLocalStorage = (word) => {
    const updatedTranslations = translations.filter(
      (item) => item.word !== word
    );
    setTranslations(updatedTranslations);
    saveToLocalStorage(updatedTranslations);
  };

  // Hiển thị hộp thoại xác nhận xóa dữ liệu
  const showConfirm = () => setIsModalVisible(true);

  // Xử lý khi người dùng xác nhận xóa toàn bộ dữ liệu
  const handleOk = () => {
    clearTableAndInput();
    setIsModalVisible(false);
  };

  // Đóng hộp thoại xác nhận xóa dữ liệu
  const handleCancel = () => setIsModalVisible(false);

  // Xóa toàn bộ dữ liệu và làm mới giao diện
  const clearTableAndInput = () => {
    console.log("Xóa dữ liệu...");
    setTranslations([]);
    localStorage.removeItem("translations");
    setInputText("");
    setTranslatedText("");
  };

  // Lọc danh sách từ theo từ khóa tìm kiếm
  const filterTranslations = () =>
    translations.filter((item) =>
      item.word.toLowerCase().includes(searchInput.toLowerCase())
    );

  // Xuất danh sách từ thành file Excel
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

  // Nhập dữ liệu từ file Excel vào bảng
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
      saveToLocalStorage(updatedTranslations);
    };

    reader.readAsBinaryString(file);
  };

  // Đếm từ đã học và chưa học
  const learnedCount = translations.filter((item) => item.learned).length;
  const notLearnedCount = translations.length - learnedCount;

  // Mở hộp thoại chỉnh sửa từ
  const openEditModal = (item) => {
    setEditWord(item.word);
    setEditTrans(item.trans);
    setIsEditModalVisible(true);
  };

  // Xác nhận chỉnh sửa từ
  const handleEditOk = () => {
    if (!editWord || !editTrans) {
      alert("Cần nhập nghĩa mới!");
      return;
    }

    const updatedTranslations = translations.map((item) =>
      item.word === editWord ? { ...item, trans: editTrans } : item
    );

    setTranslations(updatedTranslations);
    saveToLocalStorage(updatedTranslations);
    handleEditCancel();
  };

  // Hủy chỉnh sửa từ
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditWord(null);
    setEditTrans("");
  };
  return (
    <>
      <div className="bg-gray-900">
        <div className="container mx-auto p-2 text-gray-100 min-h-screen">
          <HomeControl
            inputText={inputText}
            setInputText={setInputText}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            showConfirm={showConfirm}
            handleFileUpload={handleFileUpload}
            exportToExcel={exportToExcel}
            translateText={translateText}
            learnedCount={learnedCount}
            notLearnedCount={notLearnedCount}
          />
          <div className="mt-6 text-lg font-semibold">
            Nghĩa {inputText || 'NULL'}: {translatedText}
          </div>



          {/* Danh sách từ */}

          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: 'Tất Cả Từ Vựng',
                key: '1',
                children: <OverviewVocab
                  data={filterTranslations()}
                  updateLearnedStatus={updateLearnedStatus}
                  removeFromLocalStorage={removeFromLocalStorage}
                  openEditModal={openEditModal}
                ></OverviewVocab>,
              },
              {
                label: 'Từ Đã Học',
                key: '2',
                children: <VocabLearned
                  data={filterTranslations()}
                  updateLearnedStatus={updateLearnedStatus}
                  removeFromLocalStorage={removeFromLocalStorage}
                  openEditModal={openEditModal}
                ></VocabLearned>,
              },
              {
                label: 'Từ chưa học',
                key: '3',
                children: <VocabNotLearned
                  data={filterTranslations()}
                  updateLearnedStatus={updateLearnedStatus}
                  removeFromLocalStorage={removeFromLocalStorage}
                  openEditModal={openEditModal}
                ></VocabNotLearned>,
              },
            ]}
          />



          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            </div> */}


        </div>
      </div>


      {/* Modal chỉnh sửa */}
      <Modal
        title="Cập nhật nghĩa từ"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Cập nhật"
        cancelText="Hủy bỏ"
      >
        <textarea
          value={editTrans}
          onChange={(e) => setEditTrans(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Nhập nghĩa mới"
        />
      </Modal>

      {/* Modal xóa dữ liệu */}
      <Modal
        title="Xác nhận"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đồng ý"
        cancelText="Hủy bỏ"
      >
        <p>Bạn có chắc chắn muốn xóa không?</p>
      </Modal>
    </>
  );
};

export default Home;
