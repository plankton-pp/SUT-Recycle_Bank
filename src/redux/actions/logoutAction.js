import * as actionTypes from "./logoutTypes";

export const logout = (payload) => {
  return { type: actionTypes.LOG_OUT, payload };
};
