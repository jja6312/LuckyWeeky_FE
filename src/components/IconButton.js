// components/IconButton.js
import React from "react";

const IconButton = ({ icon: Icon, isSelected, onClick, label }) => {
  return (
    <button
      className={`w-full flex flex-col justify-center items-center transition-colors duration-200  pt-4
        ${isSelected ? "text-indigo-300" : "text-white hover:text-indigo-200"}`}
      onClick={onClick}
    >
      <Icon size={24} />
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
};

export default IconButton;
