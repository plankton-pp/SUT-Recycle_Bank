import * as actionTypes from "../actions/loginTypes";

export const initialState = {
  result: null,
  isFetching: false,
  error: false,
};

export default (state = initialState, { type, payload }) => {  
  switch (type) {
     case actionTypes.LOG_IN_FETCHING:
      return { ...state, result: null, isFetching: true, error: false };

    case actionTypes.LOG_IN_SUCCESS:
      return { ...state, result: payload, isFetching: false, error: false };

    case actionTypes.LOG_IN_FAILED:
      return { ...state, result: null, isFetching: false, error: true };

    default:
      return state;
  }
};
