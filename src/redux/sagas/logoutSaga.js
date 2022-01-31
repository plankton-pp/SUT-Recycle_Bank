import { all, takeEvery, put } from "redux-saga/effects";
import  * as helper from "../../utils/helper";
import * as loginTypes from "../actions/loginTypes";
import * as logoutTypes from "../actions/logoutTypes";

function* watchLogout(payload) {
  helper.sessionRemove("login");
  helper.sessionRemove("token");
  const { history } = payload.payload;
  history.push("/login");
  try {
    yield put({ type: loginTypes.LOG_IN_SUCCESS, payload: null });
  } catch (e) {
    yield put({ type: logoutTypes.LOG_OUT_FAILED, payload: e });
  }
}

export default function* watchLogoutSaga() {
  yield all([
    takeEvery(logoutTypes.LOG_OUT, watchLogout)
]);
}
