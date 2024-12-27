import React from 'react';
import CardVocab from './CardVocab';
import dayjs from 'dayjs';

const VocabNotLearned = ({ data, updateLearnedStatus, removeFromLocalStorage, openEditModal }) => {
    const groupedData = data
        .filter(item => item.learned !== true)
        .reduce((groups, item) => {
            const dateKey = dayjs(item.addedAt).format("DD/MM/YYYY");
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(item);
            return groups;
        }, {});

    return (
        <>
            <div className="space-y-6">
                {
                    Object.keys(groupedData).map((date, index) => {
                        return (
                            <div key={index}>
                                {/* Nhãn dính chứa ngày */}
                                <div className="flex items-center mb-4 justify-end">
                                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full px-4 py-2 text-center text-lg font-semibold shadow-lg">
                                        {dayjs(date, "DD/MM/YYYY").format('DD/MM/YYYY')}
                                    </div>
                                </div>
                                {/* Hiển thị các từ học */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {groupedData[date].map((item, itemIndex) => (
                                        <div key={itemIndex}>
                                            <CardVocab
                                                item={item}
                                                removeFromLocalStorage={removeFromLocalStorage}
                                                updateLearnedStatus={updateLearnedStatus}
                                                openEditModal={openEditModal}
                                                index={itemIndex}
                                                check_remove_edit={false}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {index < Object.keys(groupedData).length - 1 && (
                                    <div className="my-4 border-t border-gray-300"></div>
                                )}
                            </div>
                        );
                    })
                }
            </div>
        </>
    );
};

export default VocabNotLearned;