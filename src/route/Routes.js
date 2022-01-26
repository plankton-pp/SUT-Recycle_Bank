import { Switch, Route, Redirect } from 'react-router-dom';
import NavMenu from '../components/NavMenu';
import React from 'react'

import PageNotFound from '../pages/PageNotFound';
import Index from '../pages/Index';
import TestAPI from '../pages/TestAPI';
import Deposit from '../pages/Deposit';
const Routes = (props) => {
    return (
        <>
            <NavMenu/>
            <Switch>
                <Route exact path="/" component={() => <Redirect to="/index" />} />
                <Route exact path="/index" component={Index} />
                <Route exact path="/api" component={TestAPI} />
                <Route exact path="/deposit" component={Deposit} />
                <Route path="*" exact={true} component={PageNotFound} />

            </Switch>
        </>
    )
}

export default Routes
