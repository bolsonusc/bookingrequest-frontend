import React from 'react';

const CustomSwitchButton = ({checked, value, id, onChange}) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          value={value}
          checked={checked}
          onChange={onChange}
          id={id}
        />
        <div className="w-11 h-6 bg-[#22252A] rounded-full peer peer-checked:bg-[#1D4FD7] transition-all"></div>
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-black-950 rounded-full shadow-md transform peer-checked:translate-x-full transition-all"></div>
      </div>
    </label>
  )
}

export default CustomSwitchButton