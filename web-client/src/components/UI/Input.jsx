import React, { useState } from "react";
import "./Input.css";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  variant = "default",
}) => {
  const [show, setShow] = useState(false);
  return (
    <label className="zq-input-wrapper">
      {label && <span className="zq-input-label">{label}</span>}
      <div
        className={`zq-input-field ${
          variant === "underline" ? "zq-input-underline" : ""
        }`}
      >
        {icon && <span className="zq-input-icon">{icon}</span>}
        <input
          type={type === "password" ? (show ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="zq-input"
        />
        {type === "password" && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
            className="zq-input-toggle"
          >
            {show ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z"
                  stroke="#295BFF"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  stroke="#295BFF"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3l18 18"
                  stroke="#295BFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.88 9.88A3 3 0 0014.12 14.12"
                  stroke="#295BFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12s4-8 10-8a9.84 9.84 0 015.5 1.5"
                  stroke="#295BFF"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </label>
  );
};

export default Input;
