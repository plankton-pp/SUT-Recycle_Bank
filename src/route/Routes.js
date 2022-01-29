import { Switch, Route, Redirect } from 'react-router-dom';
import NavMenu from '../components/NavMenu';
import React from 'react'

import PageNotFound from '../pages/PageNotFound';
import Index from '../pages/Index';
import TestAPI from '../pages/TestAPI';
import Deposit from '../pages/Deposit';
import Price from '../pages/Price';
import Audit from '../pages/Audit';
import Report from '../pages/Report';

const Routes = (props) => {
    return (
        <>
            <NavMenu/>
            <Switch>
                <Route exact path="/" component={() => <Redirect to="/index" />} />
                <Route exact path="/index" component={Index} />
                <Route exact path="/api" component={TestAPI} />
                <Route exact path="/deposit" component={Deposit} />
                <Route exact path="/price" component={Price} />
                <Route exact path="/audit" component={Audit} />
                <Route exact path="/report" component={Report} />
                <Route path="*" exact={true} component={PageNotFound} />

            </Switch>
        </>
    )
}

export default Routes
