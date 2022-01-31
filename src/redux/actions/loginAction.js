import * as actionTypes from "./loginTypes";

export const login = (payload) => {
  // console.log("payload action", payload);
  return { type: actionTypes.LOG_IN, payload };
};

export const checkLogin = () => {
  return { type: actionTypes.CHECK_LOGIN };
};
