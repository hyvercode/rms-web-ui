import React, { Component } from "react";
import Api from "../../../adaptor/Api";
import {
  setUserSession,
  removeUserSession,
  getToken,
} from "../../../utils/Common";

export default class CreateCountry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      countryCode: "",
      countryName: "",
      active: "Y",
    };
  }

  //onChangeForm
  onChangeCountryCode = (e) => {
    this.setState({
      countryCode: e.target.value,
    });
  };

  onChangeCountryName = (e) => {
    this.setState({
      countryName: e.target.value,
    });
  };

  onChangeActive = (e) => {
    this.setState({
      active: e.target.value,
    });
  };

  onSave = () => {
      if(this.state.countryCode !="" && this.state.countryName !==""){
        this.postCountry();
      }else{
          alert("Please complete form!");
      }  
  };

  //Post Country
  postCountry = () => {
    Api.post(
      "/v1/country/add",
      {
        countryCode: this.state.countryCode,
        countryName: this.state.countryName,
        active: this.state.active,
      },
      {
        headers: {
          Authorization: getToken(),
        },
      }
    ).then(
      (response) => {
       this.props.history.push('/country');
      },
      (error) => {
        if (error.response.data.status === 401) {
            removeUserSession();
        }
        this.setState({
          isLoading: true,
          error: error,
        });
      }
    );
  };

  render() {
    return (
      <div className="">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h3 className="h3">Create Country</h3>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <form>
                <div className="form-group row">
                  <label className="col-sm-4 col-md-4 col-lg-4 col-form-label">
                    Country Code
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="countryCode"
                      className="form-control form-control-sm"
                      placeholder="input country code"
                      onChange={this.onChangeCountryCode}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-md-4 col-lg-4 col-form-label">
                    Country Name
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="countryName"
                      className="form-control form-control-sm"
                      placeholder="input country name"
                      onChange={this.onChangeCountryName}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    className="col-sm-4 col-md-4 col-lg-4 col-form-label"
                  >
                    Active
                  </label>
                  <div className="col-sm-8" id="acitve">
                    <select
                      className="form-control form-control-sm"
                      onChange={this.onChangeActive}
                      required
                    >
                      <option value="Y">Yes</option>
                      <option value="N">No</option>
                    </select>
                  </div>
                </div>
                <div className="btn-control-group">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={this.onSave}
                  >
                    Save
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
