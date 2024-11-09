import React from 'react';

interface TextFieldProps {
    label: string;
    value: string;
    required?: boolean;
    placeholder: string;
    onChange: (value: string) => void;
}

const TextField : React.FC<TextFieldProps> = (props) => {

    const onTyping = (evento: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(evento.target.value);
    };

    return (
        <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">{props.label}</label>
            <input
                value={props.value}
                onChange={onTyping}
                required={props.required}
                placeholder={props.placeholder}
                className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default TextField;