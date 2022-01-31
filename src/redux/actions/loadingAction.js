import * as actionTypes from "./loadingTypes";

export const loading = (payload) => {
  return { type: actionTypes.LOADING, payload };
};

