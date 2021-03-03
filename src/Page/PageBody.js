import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import {AnimatePresence} from "framer-motion"

import Index from '../Page/Index';
import About from '../Page/About';
import Work from '../Page/Work';
import NotFound from '../Page/NotFound404';

const PageBody = () => {
    const location = useLocation();
    const [rootPath] = location.pathname.split("/");

    return(
        // <></>について https://ja.reactjs.org/docs/fragments.html#short-syntax
        // <React.Fragment>の短縮形
        <>
        <AnimatePresence exitBeforeEnter initial={true}>
            <Switch location={location} key={rootPath}>
                <Route exact path="/" component={Index} />
                <Route exact path="/about" component={About} />
                <Route exact path="/work" component={Work} />
                <Route component={NotFound} />
            </Switch>
        </AnimatePresence>
        </>
    )
}

export default PageBody
