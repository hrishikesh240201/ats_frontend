// src/components/Spinner.js
import React from 'react';
import { PulseLoader } from 'react-spinners';

const Spinner = () => {
    return (
        <div className="flex justify-center items-center py-10">
            <PulseLoader color={"#3498db"} size={15} />
        </div>
    );
};

export default Spinner;