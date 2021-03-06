import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import NavMenu from '../components/NavMenu';
import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/logoutAction';

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';

import * as API from '../utils/apis'


import SecureRoute from '../utils/SecureRoute';

import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgetPass from '../pages/ForgetPass'
import ResetPass from '../pages/ResetPass';
import PageNotFound from '../pages/PageNotFound';
import Home from '../pages/Home';
import Deposit from '../pages/Deposit';
import Management from '../pages/Management';
import Audit from '../pages/Audit';
import Report from '../pages/Report';
import Setting from '../pages/Setting';

const Routes = (props) => {
    const MySwal = withReactContent(swal);
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const login = useSelector(state => state.login);
    const [isAuthen, setIsAuthen] = useState(useSelector(state => state.login));
    // const { loading } = useSelector((state) => state.loading);

    const checkPath = (location) => {
        let outPath = location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/forgetpass' && !String(location.pathname).includes("/resetpassword");
        return outPath
    }

    //check authenticated
    useEffect(async () => {
        try {
            const response = await API.userAuthenticated();
            const data = await response?.data;
            if (response.status == 200) {
                if (sessionStorage.length !== 0 && !data.auth && checkPath(location)) {
                    MySwal.fire({
                        text: "หมดเวลาในการเชื่อมต่อกรุณาเข้าสู่ระบบอีกครั้ง",
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        dispatch(logout({ history }))
                    })
                } else {
                    // user authenticated
                }
            } else {
                dispatch(logout({ history }))
            }
        } catch (error) {
            console.log(error);
        }

    }, [location.pathname])

    return (
        <>
            {isAuthen && checkPath(location) && <NavMenu />}
            <Switch>
                <Route exact path="/" component={() => <Redirect to="/login" />} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/forgetpass" component={ForgetPass} />
                <Route exact path="/resetpassword" component={ResetPass} />
                <SecureRoute exact path="/index" component={Home} />
                <SecureRoute exact path="/deposit" component={Deposit} />
                <SecureRoute exact path="/management" component={Management} />
                <SecureRoute exact path="/audit" component={Audit} />
                <SecureRoute exact path="/report" component={Report} />
                <SecureRoute exact path="/profile" component={Setting} />
                <Route path="*" exact={true} component={PageNotFound} />

            </Switch>
        </>
    )
}

export default Routes
