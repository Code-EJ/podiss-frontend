import React, { useId } from 'react';

interface TextFieldProps {
    label: string;
    value: string;
    required?: boolean;
    maxLength?: number;
    type?: 'text' | 'email';
    placeholder: string;
    onChange: (value: string) => void;
}

/**
 * Associates a stable accessible label with input validation and a controlled string value.
 * @author oEnzoRibas
 */
const TextField : React.FC<TextFieldProps> = (props) => {

    const id = useId();
    const onTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(event.target.value);
    };

    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="mb-2 font-semibold text-gray-700">{props.label}</label>
            <input id={id} type={props.type ?? 'text'} maxLength={props.maxLength}
                value={props.value}
                onChange={onTyping}
                required={props.required}
                placeholder={props.placeholder}
                className="mb-4 w-full min-w-0 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
            />
        </div>
    );
};

export default TextField;
