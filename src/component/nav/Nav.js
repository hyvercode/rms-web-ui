import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {removeUserSession} from '../../utils/Common';


export default class Nav extends Component {
    logout = () =>{
        removeUserSession();
    }
    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
             <Link className="navbar-brand col-sm-3 col-md-2 mr-0" to="/dashboard">
                    Retail System
              </Link>
                {/* <button classNameName="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                     <span classNameName="navbar-toggler-icon"></span>
                  </button> */}
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <a className="nav-link" href="#" onClick={this.logout.bind(this)}>
                            Sign out
                        </a>
                    </li>
                </ul>
            </nav>
        );
    }
}

