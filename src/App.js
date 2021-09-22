import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Admin from "./pages/admin/admin";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home"
import Print from "./pages/print/Print";
import PrivateRoute from './utils/PrivateRoute'

import './App.less';

/**
 * 应用根组件
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/register" component={Register}></Route>
          <PrivateRoute path="/admin" component={Admin}></PrivateRoute>
          <PrivateRoute path="/home" component={Home}></PrivateRoute>
          {/* <Route path="/operation-guide" component={OperationGuide}></Route> */}
          <Route path="/print/:id" component={Print}></Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
