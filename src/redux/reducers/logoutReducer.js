import * as actionTypes from "../actions/logoutTypes";
import { initialState } from "./loginReducer";


export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actionTypes.LOG_OUT_FETCHING:
      return { ...state, result: null, isFetching: true, error: false };

    case actionTypes.LOG_OUT_SUCCESS:
      return { ...state, result: null, isFetching: false, error: false };

    case actionTypes.LOG_OUT_FAILED:
      return { ...state, result: null, isFetching: false, error: true };

    default:
      return state;
  }
};
