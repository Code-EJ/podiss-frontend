import React from 'react';

interface ButtomFormProps {
    children: React.ReactNode;
}

const ButtomForm: React.FC<ButtomFormProps> = (props) => {
    return (
        <button type="submit"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300">
            {props.children}
        </button>
    );
};

export default ButtomForm;