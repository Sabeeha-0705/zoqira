import React from "react";
import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  onClick,
  className,
  ...rest
}) => {
  const cls = `zq-btn ${
    variant === "primary" ? "zq-primary" : "zq-secondary"
  } ${className || ""}`;
  return (
    <button className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

export default Button;
