import React, { Component } from "react";
import Api from "../../../adaptor/Api";
import {
  setUserSession,
  removeUserSession,
  getToken,
} from "../../../utils/Common";

export default class CreateBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      bankId: "",
      bankName: "",
      bankImageLink: "",
      countryCode: "",
      active: "Y",
      listCountry: [],
    };
  }

  //onChangeForm
  onChangeBankId = (e) => {
    this.setState({
      bankId: e.target.value,
    });
  };

  onChangeBankName = (e) => {
    this.setState({
      bankName: e.target.value,
    });
  };

  onChangeActive = (e) => {
    this.setState({
      active: e.target.value,
    });
  };

  onChangeCountryCode = (e) => {
    this.setState({
      countryCode: e.target.value,
    });
  };

  onChangeBankImageLink = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({
        bankImageLink:reader.result
      });
    };
  };

  onSave = () => {
    if (this.state.bankId != "" && this.state.bankName !== "") {
      this.postBank();
    } else {
      alert("Please complete form!");
    }
  };

  onCancel =() =>{
    this.props.history.push("/bank");
  }

  //Post Country
  postBank = () => {
    Api.post(
      "/v1/bank/add",
      {
        bankId: this.state.bankId,
        bankName: this.state.bankName,
        bankImageLink: this.state.bankImageLink,
        countryCode: this.state.countryCode,
        active: this.state.active,
      },
      {
        headers: {
          Authorization: getToken(),
        },
      }
    ).then(
      (response) => {
        this.props.history.push("/bank");
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
  // call country list
  getListCountry = () => {
    Api.get("/v1/country/countries?countryName=", {
      headers: {
        Authorization: getToken(),
      },
    }).then(
      (response) => {
        this.setState({ listCountry: response.data.content });
      },
      (error) => {
        if (error.response.data.status === 401) {
          removeUserSession();
        }
        this.setState({
          isLoading: false,
          error: error,
        });
      }
    );
  };

  componentDidMount() {
    this.getListCountry();
  }

  renderCountyList = () => {
    return this.state.listCountry.map((countries, index) => {
      const { countryCode, countryName } = countries;
      return (
        <option key={index} value={countryCode}>
          {countryName}
        </option>
      );
    });
  };
  render() {
    return (
      <div className="">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h3 className="h3">Create Bank</h3>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <form>
                <div className="form-group row">
                  <label className="col-sm-4 col-md-4 col-lg-4 col-form-label">
                    Bank ID
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="countryCode"
                      className="form-control form-control-sm"
                      placeholder="input bank id"
                      onChange={this.onChangeBankId}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-md-4 col-lg-4 col-form-label">
                    Bank Name
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="countryName"
                      className="form-control form-control-sm"
                      placeholder="input bank name"
                      onChange={this.onChangeBankName}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-md-4 col-lg-4 col-form-label">
                    Country
                  </label>
                  <div className="col-sm-8">
                    <select
                      className="custom-select d-block w-100 custom-select-sm"
                      onChange={this.onChangeCountryCode}
                      required
                    >
                      <option value="" disabled>Choose...</option>
                      {this.renderCountyList()}
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-md-4 col-lg-4 col-form-label">
                    Bank Image
                  </label>
                  <div className="col-sm-2">                
                      <input
                      ref="file"
                      type="file"
                      id="image-link"
                      encType="multipart/form-data"
                      placeholder="image"
                      accept="image/png, image/jpeg"
                      onChange={this.onChangeBankImageLink}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-md-4 col-lg-4 col-form-label">
                    Active
                  </label>
                  <div className="col-sm-8" id="acitve">
                    <select
                      className="custom-select d-block w-100 custom-select-sm"
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
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    type="button"
                    onClick={this.onCancel}
                    >
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
