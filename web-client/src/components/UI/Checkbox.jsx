import React from "react";
import "./Checkbox.css";

const Checkbox = ({ label, checked, onChange, id }) => (
  <label className="zq-checkbox" htmlFor={id}>
    <input id={id} type="checkbox" checked={checked} onChange={onChange} />
    <span className="zq-checkbox-box" aria-hidden="true" />
    <span className="zq-checkbox-label">{label}</span>
  </label>
);

export default Checkbox;
