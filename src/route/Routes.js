import { Switch, Route, Redirect } from 'react-router-dom';
import NavMenu from '../components/NavMenu';

import React from 'react'
import Index from '../pages/Index';
import TestAPI from '../pages/TestAPI';
import TestComponent from '../pages/TestComponent';

const Routes = (props) => {
    return (
        <>
            <NavMenu></NavMenu>
            <Switch>
                <Route exact path="/" component={() => <Redirect to="/index" />} />
                <Route exact path="/index" component={Index} />
                <Route exact path="/api" component={TestAPI} />
                <Route exact path="/compo" component={TestComponent} />

            </Switch>
        </>
    )
}

export default Routes
