import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

const initialiseSagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  applyMiddleware(initialiseSagaMiddleware, logger)
);

initialiseSagaMiddleware.run(rootSaga);

export default store;
