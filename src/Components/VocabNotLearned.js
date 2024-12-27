import React from 'react';
import CardVocab from './CardVocab';

const VocabNotLearned = ({ data, updateLearnedStatus, removeFromLocalStorage, openEditModal }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                data.map((item, index) => item.learned !== true && (
                    <CardVocab
                        key={index} // Nên dùng key khi sử dụng trong map
                        item={item}
                        removeFromLocalStorage={removeFromLocalStorage}
                        updateLearnedStatus={updateLearnedStatus}
                        openEditModal={openEditModal}
                        check_remove_edit={false}
                    />
                ))
            }
        </div>
    );
};

export default VocabNotLearned;