import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Bank extends Component {
  render() {
    return (
      <div className="app">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h3 className="h3">Bank</h3>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group mr-2">
              <Link
                className="btn btn-sm btn-outline-secondary"
                to="/create-bank"
              >
                Add New
              </Link>
              <button className="btn btn-sm btn-outline-secondary">Edit</button>
              <button className="btn btn-sm btn-outline-secondary">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
