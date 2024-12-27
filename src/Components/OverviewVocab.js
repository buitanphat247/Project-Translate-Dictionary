import React from 'react';
import CardVocab from './CardVocab';

const OverviewVocab = ({ data, updateLearnedStatus, removeFromLocalStorage, openEditModal }) => {
    // Sắp xếp data để các từ đã học lên đầu
    const sortedData = [...data].sort((a, b) => b.learned - a.learned);  // Từ đã học (learned: true) sẽ đứng đầu

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                sortedData.map((item, index) => (
                    <CardVocab
                        key={index} // Nên dùng key khi sử dụng trong map
                        item={item}
                        removeFromLocalStorage={removeFromLocalStorage}
                        updateLearnedStatus={updateLearnedStatus}
                        openEditModal={openEditModal}
                        check_is_point={false}
                    />
                ))
            }
        </div>
    );
};

export default OverviewVocab;
