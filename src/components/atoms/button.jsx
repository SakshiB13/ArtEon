import React from "react"

const Button = ({ label, styles, onClick, type, disabled }) => {
  return (
    <button
      className={
        type === "white"
          ? `px-4 py-3 bg-white border border-[#9194A0] rounded-3xl ${styles}`
          : `px-4 py-3 bg-blue text-white rounded-3xl ${styles}`
      }
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default Button
