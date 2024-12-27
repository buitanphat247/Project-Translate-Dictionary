import React, { useState } from 'react';
import { DatePicker, Select, Space, TimePicker } from 'antd';
import dayjs from "dayjs"; // Thêm thư viện dayjs để xử lý ngày (nếu cần)

const HomeControl = ({
    inputText,
    setInputText,
    searchInput,
    setSearchInput,
    showConfirm,
    handleFileUpload,
    exportToExcel,
    translateText,
    learnedCount,
    notLearnedCount, setDateFilter

}) => {
    const handleDateChange = (date, dateString) => {
        // `date` là đối tượng Day.js hoặc null khi không có ngày được chọn
        // `dateString` là giá trị định dạng từ picker (YYYY-MM-DD)
        console.log("Raw Value:", date); // Xem đối tượng ngày
        const formattedDate = dayjs(date).format("MM/DD/YYYY");
        console.log("Formatted Date:", formattedDate);
        setDateFilter(formattedDate) // Lưu giá trị nếu muốn
    };
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 justify-center items-center">
                    {/* Xóa tất cả Button với icon */}
                    <button
                        onClick={showConfirm}
                        className="bg-red-500 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-md shadow-md w-full flex items-center justify-center transition duration-200"
                    >
                        <i className="fas fa-trash-alt text-xl mr-2"></i> {/* Icon xóa */}
                    </button>

                    {/* Nhập Excel Button với icon */}
                    <label htmlFor="upload-file" className="cursor-pointer w-full">
                        <button
                            className="bg-green-500 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded-md shadow-md w-full flex items-center justify-center transition duration-200"
                        >
                            <i className="fas fa-file-upload text-xl mr-2"></i> {/* Icon upload */}
                        </button>
                        <input
                            id="upload-file"
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>

                    {/* Xuất Excel Button với icon */}
                    <button
                        onClick={exportToExcel}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-md w-full flex items-center justify-center transition duration-200"
                    >
                        <i className="fas fa-file-export text-xl mr-2"></i> {/* Icon xuất file */}
                    </button>

                    {/* Dịch Button với icon */}
                    <button
                        onClick={translateText}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-md w-full flex items-center justify-center transition duration-200"
                    >
                        <i className="fas fa-language text-xl mr-2"></i> {/* Icon dịch */}
                    </button>
                    {/* <DatePicker renderExtraFooter={() => 'extra footer'} onChange={handleDateChange} />*/}

                </div>

                <div className="grid grid-cols-2 gap-x-2">

                    {/* Kết quả Từ đã học và Từ chưa học */}
                    <button
                        className="bg-green-500 hover:bg-green-400 text-white font-semibold p-2 rounded-md shadow-md w-full flex items-center justify-center transition duration-200 mt-4"
                    >
                        <span>Từ đã học:</span>
                        <span className="font-semibold ml-2">{learnedCount}</span>
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-400 text-white font-semibold p-2 rounded-md shadow-md w-full flex items-center justify-center transition duration-200 mt-4"
                    >
                        <span>Từ chưa học:</span>
                        <span className="font-semibold ml-2">{notLearnedCount}</span>
                    </button>
                </div>
            </div>



            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 mt-4">

                <input type="text"
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            translateText(); // Gọi hàm translateText khi nhấn phím Enter
                        }
                    }}
                    value={inputText}
                    className="w-full p-4 border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400 "
                    placeholder="Nhập văn bản tiếng Anh" />
                {/* <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows="4"
                className="w-full p-4 border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400 mt-4"
                placeholder="Nhập văn bản tiếng Anh"
            ></textarea> */}
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full p-4 border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400"
                    placeholder="Tìm kiếm từ..."
                />
            </div>
        </>
    );
};

export default HomeControl;
