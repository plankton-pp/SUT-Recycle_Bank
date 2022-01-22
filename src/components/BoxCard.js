import React from "react";
import { BoxCardHead, BoxCardBody } from '../components/styles/boxCardStyles';

function BoxCard({ classNameBox, title, children, classLabel, headRight, required }) {
  return (
    <div className={`${classNameBox ? classNameBox : ""}`}>
      <BoxCardHead className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className={`${classLabel}`}>{title}</h4> {required && <span className="text-danger">*</span>}
        </div>
        <div>{headRight && headRight}</div>
      </BoxCardHead>
      <BoxCardBody>{children}</BoxCardBody>
    </div>
  );
}
export default BoxCard;
