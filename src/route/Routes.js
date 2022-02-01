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
import PageNotFound from '../pages/PageNotFound';
import Index from '../pages/Index';
import TestAPI from '../pages/TestAPI';
import Deposit from '../pages/Deposit';
import Price from '../pages/Price';
import Audit from '../pages/Audit';
import Report from '../pages/Report';
import ProfileSetting from '../pages/ProfileSetting';

const Routes = (props) => {
    const MySwal = withReactContent(swal);
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    //check authenticated
    history.listen(async () => {
        try {
            const response = await API.userAuthenticated();
            const data = await response?.data;
            if (response.status == 200) {
                if (!data.auth) {
                    MySwal.fire({
                        text: "หมดเวลาในการเชื่อมต่อกรุณาเข้าสู่ระบบอีกครั้ง",
                        icon: 'warning',
                        confirmButtonColor: '#96CC39',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        dispatch(logout({ history }))
                    })
                }
            } else {
                dispatch(logout({ history }))
            }
        } catch (error) {

        }
    })
    // const login = useSelector(state => state.login);
    const [isAuthen, setIsAuthen] = useState(useSelector(state => state.login));
    const [renderNav, setRenderNav] = useState(true);
    // const { loading } = useSelector((state) => state.loading);

    const checkPath = (location) => {
        return location.pathname !== '/login' && location.pathname !== '/register';
    }

    useEffect(() => {
    }, [])

    return (
        <>
            {isAuthen && checkPath(location) && <NavMenu />}
            <Switch>
                <Route exact path="/" component={() => <Redirect to="/login" />} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />

                <SecureRoute exact path="/index" component={Index} />
                <SecureRoute exact path="/api" component={TestAPI} />
                <SecureRoute exact path="/deposit" component={Deposit} />
                <SecureRoute exact path="/price" component={Price} />
                <SecureRoute exact path="/audit" component={Audit} />
                <SecureRoute exact path="/report" component={Report} />
                <SecureRoute exact path="/profile" component={ProfileSetting} />
                <Route path="*" exact={true} component={PageNotFound} />

            </Switch>
        </>
    )
}

export default Routes
