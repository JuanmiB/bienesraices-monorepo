import React from 'react';

const FormInput = ({ type = "text", placeholder, value, onChange, id, label, hint }) => {
  return (
    <div>
      {label && (
        <label
          className="block text-sm font-medium text-gray-600 mb-1.5"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 placeholder:italic transition duration-200 focus:ring-2 focus:ring-primary-200 focus:border-primary-300 focus:bg-white outline-none"
        required
      />
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
};

export default FormInput;