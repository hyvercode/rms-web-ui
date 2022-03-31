import React, { Component } from "react";
import Api from "../../adaptor/Api";
import { setUserSession, windowReload } from '../../utils/Common';
import Spinner from "../../component/loading/Spinner";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state ={
        username:"admin@admin.com",
        password:"Admin@123!",
        isLoading:false
    }
  }

  //onChange form
  onChangeUsername = (e) =>{
    this.setState({
        username: e.target.value
    });
  }

  onChangePassword = (e) =>{
    this.setState({
        password: e.target.value
    });
  }
  // handle button click of login form
  handleLogin = () => {
    if(this.state.username !=="" && this.state.password !==""){
      this.setState({
        isLoading:true
      })
      this.login();
    }else{
      alert("Please complete form!")
    }
  };

  login =() =>{
    Api.post('/v1/auth/login',{
        username:this.state.username,
        password:this.state.password
      }).then(response => {
       setUserSession(response.data.accessToken, response.data.employeeId,response.data.outletId);
       this.setState({
         isLoading:false
       })
       this.props.history.push('/dashboard');
      }, (error) => {
        this.setState({
          isLoading: false,
          error: error
        });
        alert(error.response.data.message)
        windowReload();
      });
  }

  render() {
    return (
      <div className="text-center">
        <Spinner />
        <form className="form-signin">
          <img
            className="mb-4"
            src="../../../logo.svg"
            alt=""
            width="72"
            height="72"
          />
          <h1 className="h3 mb-3 font-weight-normal">RMS POS</h1>
          <label className="sr-only">Email address</label>
          <input
            type="text"
            id="inputEmail"
            className="form-control"
            placeholder="Username"
            onChange={this.onChangeUsername.bind(this)}
            required
          />
          <label className="sr-only">Password</label>
          <input
            type="password"
            id="inputPassword"
            className="form-control"
            placeholder="Password"
            onChange={this.onChangePassword.bind(this)}
            required
          />
          <button
            className="btn btn-lg btn-primary btn-block"
            type="button"
            onClick={this.handleLogin.bind(this)}
          >
            Login
          </button>
          <p className="mt-5 mb-3 text-muted">&copy; alfaz.id@2020</p>
        </form>
      </div>
    );
  }
}
