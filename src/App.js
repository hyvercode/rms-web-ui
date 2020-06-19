import React, { Fragment } from "react";
import "./App.scss";
import $ from "jquery";
import PopperJs from "popper.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SideNav from "./component/sidenav/SideNav";
import Nav from "./component/nav/Nav.js";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import NotFound from "./pages/error/404";
import PublicRoute from "./router/PublicRoute";
import PrivateRoute from "./router/PrivateRoute";
import Country from "./pages/master/country/Country";
import CreateCountry from "./pages/master/country/CreateCountry";
import Bank from "./pages/master/bank/Bank";

export default function App() {
  return (
    <Router>
      <div id="wrapper">
        <Switch>
        <PublicRoute path="/login" component={Login} />
          <div className="container-fluid">
          <Nav />
            <div className="row">
                <SideNav />         
                  <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                    <PrivateRoute exact path="/" exact component={Dashboard} />
                    <PrivateRoute exact path="/dashboard" component={Dashboard} />
                    <PrivateRoute exact path="/country" component={Country} />
                    <PrivateRoute exact path="/create-country" component={CreateCountry} />
                    <PrivateRoute exact path="/bank" component={Bank} />
                    <PublicRoute component={NotFound} />
                  </main>            
            </div>
          </div>
        </Switch>
      </div>
    </Router>
  );
}
