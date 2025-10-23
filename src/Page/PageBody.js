import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
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
                <Routes location={location} key={rootPath}>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/work" element={<Work />} />
                    <Route component={NotFound} />
                </Routes>
            </AnimatePresence>
        </>
    )
}

export default PageBody
