import { combineReducers } from "redux";
import login from "./loginReducer";
import logout from "./logoutReducer";
import loading from "./loadingReducer";


export default combineReducers({
    login,
    logout,
    loading,
})