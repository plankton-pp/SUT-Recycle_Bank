import React from "react";
import { Form } from "react-bootstrap";

function InputText({
  title, star, type, idName, value, placeholder, classLabel, handleChange, maxLength, minLength,
  invalid, handleInvalid, disabled, classFormGroup, as, rows, classFormCon, min, max
}) {
  return (
    <Form.Group className={classFormGroup}>
      {title ? <Form.Label className={`${classLabel} mb-1`}>{title} <span className="text-danger">{star ? "*" : ""}</span></Form.Label> : ""}
      <Form.Control type={type} id={idName} name={idName}
        className={invalid ? "is-invalid" : classFormCon ? classFormCon : ""}
        as={as} rows={rows}
        value={value} disabled={disabled ? true : false}
        placeholder={placeholder}
        min={min ? min : ""}
        max={max ? max : ""}
        maxLength={maxLength ? maxLength : ""}
        minLength={minLength ? minLength : ""}
        onChange={e => {
          handleChange(e.target.value)
          if (handleInvalid) {
            handleInvalid()
          }
        }} />
      {invalid ? <div className="invalid-error"><span style={{ color: 'red' }}>{invalid}</span></div> : ""}
    </Form.Group>
  );
}

export default InputText;
