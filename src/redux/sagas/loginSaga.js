import { all, takeEvery, put } from "redux-saga/effects";
import * as helper from "../../utils/helper";
import * as actionTypes from "../actions/loginTypes";

export default function* watchLoginSaga() {
  yield all([
    takeEvery(actionTypes.LOG_IN, watchLogin),
    takeEvery(actionTypes.CHECK_LOGIN, watchCheckLogin),
  ]);
}

function* watchLogin(payload) {
  const { data, history } = payload.payload;
  console.log("dataSaga: ", data);
  helper.sessionSave("login", data.data[0]);
  helper.sessionSave("token", 'Bearer ' + data.token);
  history.push("/index");
  // JSON.parse(data)
  try {
    yield put({ type: actionTypes.LOG_IN_SUCCESS, payload: data });
  } catch (e) {
    yield put({ type: actionTypes.LOG_IN_FAILED, payload: e });
  }
}

function* watchCheckLogin() {
  const items = yield helper.sessionGet("login");
  // console.log("JSON.parse(items)", JSON.parse(items));
  // JSON.parse(items)
  try {
    if (items) {
      yield put({ type: actionTypes.LOG_IN_SUCCESS, payload: JSON.parse(items) });
    }
  } catch (e) {
    yield put({ type: actionTypes.LOG_IN_FAILED, payload: e });
  }
}


