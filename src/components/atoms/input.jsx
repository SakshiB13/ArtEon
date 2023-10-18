import React from "react"

const Input = ({ placeholder, type, onChange, className, onClick }) => {
  return (
    <input
      className={`bg-[#E2FBF5] focus:outline-none placeholder:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 p-2.5 ${className}`}
      placeholder={`${placeholder}`}
      type={`${type}`}
      onChange={onChange}
      onClick={onClick}
    ></input>
  )
}
export default Input
