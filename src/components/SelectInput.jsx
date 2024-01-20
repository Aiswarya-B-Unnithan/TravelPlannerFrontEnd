// SelectInput.js
import React from "react";

const SelectInput = ({
  label,
  name,
  register,
  styles,
  options,
  error,
  ...inputProps
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-ascent-1">{label}</label>
      <select
        {...register(name, { required: `${label} is required!` })}
        className={`
          bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666] ${styles}`}
        {...inputProps}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SelectInput;
