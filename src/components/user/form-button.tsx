import React from "react";

interface FormButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * Shared form submit control; the parent owns pending state and validation.
 * @author oEnzoRibas
 */
const FormButton: React.FC<FormButtonProps> = (props) => {
  return (
    <button
      type="submit"
      disabled={props.disabled}
      className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
    >
      {props.children}
    </button>
  );
};

export default FormButton;
