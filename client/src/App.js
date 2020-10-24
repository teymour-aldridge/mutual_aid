import React from 'react';
import Register from "./components/auth/Register";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Login from "./components/auth/Login";
import ProvideHelp from "./components/provideHelp/ProvideHelp";
import RequestSimpleHelp from "./components/help/RequestSimpleHelp";
import Navbar from "./components/commonBits/Navbar";
import ComplexHelpRequest from "./components/help/ComplexHelpRequest";
import ProvideComplexHelp from "./components/provideHelp/ProvideComplexHelp";
import CurrentlyFulfilling from "./components/provideHelp/CurrentlyFulfilling";

export function App() {
    return (
        <>
            <BrowserRouter>
                <Navbar>
                    <Switch>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <Route path="/register">
                            <Register/>
                        </Route>
                        <Route path="/provideHelp">
                            <ProvideHelp/>
                        </Route>
                        <Route path="/requestHelp">
                            <RequestSimpleHelp/>
                        </Route>
                        <Route path="/requestComplexHelp">
                            <ComplexHelpRequest/>
                        </Route>
                        <Route path="/provideComplexHelp">
                            <ProvideComplexHelp/>
                        </Route>
                        <Route path="/currentlyFulfilling">
                            <CurrentlyFulfilling/>
                        </Route>
                    </Switch>
                </Navbar>
            </BrowserRouter>
        </>
    );
}

export default App;
