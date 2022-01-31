import * as actionTypes from "../actions/loadingTypes";

export const initialState = {
  loading: false,
};

export default (state = initialState, { type, payload }) => {  
  switch (type) {
     case actionTypes.LOADING:
      return { ...state, loading: payload};

    default:
      return state;
  }
};
