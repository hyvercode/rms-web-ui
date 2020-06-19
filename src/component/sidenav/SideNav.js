import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class SideNav extends Component {
  render() {
    return (
      <nav className="col-md-2 d-none d-md-block bg-light sidebar">
        <div className="sidebar-sticky">
          <Link to="/dashboard">
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Dashboard</span>
            </h6>
          </Link>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a
                className="nav-link collapsed text-truncate"
                href="#submenu1"
                data-toggle="collapse"
                data-target="#submenu1"
              >
                <i className="fa fa-table"></i>{" "}
                <span className="d-none d-sm-inline">Master</span>
              </a>
              <div className="collapse" id="submenu1" aria-expanded="false">
                <ul className="flex-column pl-2 nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/country">
                      <span data-feather="file"></span>
                      Country
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/bank">
                      <span data-feather="file"></span>
                      Bank
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Reports</span>
            <a className="d-flex align-items-center text-muted" href="#">
              <span data-feather="plus-circle"></span>
            </a>
          </h6>
          <ul className="nav flex-column mb-2">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <span data-feather="file-text"></span>
                Current month
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
