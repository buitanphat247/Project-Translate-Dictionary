import React, { useState } from 'react';
import { Modal } from 'antd';  // Import Modal từ Ant Design

const CardVocab = ({ item, updateLearnedStatus, removeFromLocalStorage, openEditModal, index, check_is_point, check_remove_edit }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);  // Trạng thái để hiển thị modal

    // Hàm xử lý khi người dùng nhấn OK trong modal (xóa từ)
    const handleRemove = () => {
        removeFromLocalStorage(item.word);  // Xóa từ khỏi localStorage
        setIsModalVisible(false);  // Đóng modal sau khi xóa
    };

    // Mở modal xác nhận xóa
    const showModal = (e) => {
        e.stopPropagation();  // Ngừng sự kiện click, ngăn không cho làm ảnh hưởng đến các phần khác
        setIsModalVisible(true);  // Mở modal
    };

    // Đóng modal khi nhấn "Hủy"
    const handleCancel = (e) => {
        e.stopPropagation();  // Ngừng sự kiện click để tránh tác động không mong muốn
        setIsModalVisible(false);  // Đóng modal
    };

    return (
        <div
            key={index}
            onClick={() => {
                if (check_is_point !== false) {
                    updateLearnedStatus(item.word, !item.learned);  // Thay đổi trạng thái học khi người dùng click ngoài modal
                }
            }}
            className={`relative border px-4 py-4 rounded-lg shadow-lg transition ${item.learned ? "border-green-500 bg-gray-700" : "border-gray-700 bg-gray-800"
                } hover:shadow-xl cursor-pointer min-w-0`}
        >
            {/* Vòng tròn tick ở góc */}
            <div
                className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition ${item.learned ? "bg-green-500 text-white" : "bg-gray-500 text-gray-300"
                    }`}
                onClick={(e) => {
                    e.stopPropagation();  // Ngừng sự kiện click từ đây đi
                    updateLearnedStatus(item.word, !item.learned);  // Thay đổi trạng thái học khi click vào vòng tròn
                }}
            >
                {item.learned ? (
                    <i className="fa-solid fa-check text-lg"></i>
                ) : (
                    <i className="fa-solid fa-circle text-lg"></i>
                )}
            </div>
            {/* Nội dung card */}
            <h3 className="text-base font-semibold text-white mb-2 break-words">
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

            {check_remove_edit !== false &&
                <div className="absolute bottom-2 right-2 flex space-x-1">
                    {/* Nút Xoá */}
                    <button
                        onClick={showModal}  // Gọi hàm mở modal
                        className="bg-red-500 w-[28px] h-[28px] rounded-full text-white hover:bg-red-400 transition flex items-center justify-center text-xs"
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>

                    {/* Nút Chỉnh Sửa */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();  // Ngừng sự kiện click từ button
                            openEditModal(item);
                        }}
                        className="bg-yellow-500 w-[28px] h-[28px] rounded-full text-white hover:bg-yellow-400 transition flex items-center justify-center text-xs"
                    >
                        <i className="fa-solid fa-pen"></i>
                    </button>
                </div>
            }

            {/* Modal xác nhận */}
            <Modal
                title="Xác nhận xóa"
                visible={isModalVisible}
                onOk={handleRemove}  // Gọi hàm xóa khi người dùng nhấn "Ok"
                onCancel={handleCancel}  // Đóng modal khi người dùng nhấn "Hủy"
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc muốn xóa từ "{item.word}" khỏi danh sách?</p>
            </Modal>
        </div>
    );
};

export default CardVocab;
