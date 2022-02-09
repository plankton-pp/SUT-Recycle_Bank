import React from "react";
import { BoxCardHead, BoxCardBody } from '../components/styles/boxCardStyles';

function BoxCard({ style, classNameBox, title, children, classLabel, headRight, required, option }) {
  return (
    <div className={`${classNameBox ? classNameBox : ""}`} style={style}>
      {title && <BoxCardHead className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className={`${classLabel}`}>{title}</h4> {required && <span className="text-danger">*</span>}
        </div>
        <div>{headRight && headRight}</div>
      </BoxCardHead>}
      <BoxCardBody props={title ? false : true}>{children}</BoxCardBody>
    </div>
  );
}
export default BoxCard;
