import React from 'react';
import CardVocab from './CardVocab';

const VocabLearned = ({ data, updateLearnedStatus, removeFromLocalStorage, openEditModal }) => {
    console.log('data: ', data);
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {
                    data.map((item, index) => item.learned === true && (

                        <CardVocab
                            item={item}
                            removeFromLocalStorage={removeFromLocalStorage}
                            updateLearnedStatus={updateLearnedStatus}
                            openEditModal={openEditModal}
                            index={index}
                            check_remove_edit={false}
                        ></CardVocab>
                    ))
                }
            </div>
        </>

    );
};

export default VocabLearned;