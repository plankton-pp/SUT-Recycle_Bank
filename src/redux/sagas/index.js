import { all, fork } from "redux-saga/effects";
import watchLoginSaga from "./loginSaga";
import watchLogoutSaga from "./logoutSaga";

export default function* rootSaga() {
  yield all([
    fork(watchLoginSaga),
    fork(watchLogoutSaga),
]);
}
