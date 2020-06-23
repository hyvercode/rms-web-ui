import React, { Component } from "react";
import Api from "../../../adaptor/Api";
import { Link, Redirect } from "react-router-dom";
import { getToken, removeUserSession } from "../../../utils/Common";

export default class Country extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      error: null,
      isLoading: true,
      countries: [],
      pagination: {
        pageSize: 10,
        currentPage: 1,
        totalPages: 1,
        totalRecords: 1,
        isFirstPage: true,
        isLastPage: true,
      },
      pageNumber: 1,
      sortBy: "countryName",
      sortType: "asc",
      searchBy: "",
    };
  }

  getListCountry() {
    Api.get(
      "/v1/country/list?pageSize=" +
        this.state.pagination.pageSize +
        "&pageNumber=" +
        this.state.pageNumber +
        "&sortBy=countryName&sortType=asc&searchBy",
      {
        headers: {
          Authorization: getToken(),
        },
      }
    ).then(
      (response) => {
        this.setState({
          isLoading: false,
          countries: response.data.content,
          pagination: response.data.pagination,
        });
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
  }

  async componentDidMount() {
    await this.getListCountry();
  }

  renderTableData() {
    return this.state.countries.map((countries, index) => {
      const { countryId, countryCode, countryName, active } = countries; //destructuring
      return (
        <tr key={countryId}>
          <td>
            <div className="checkbox">
              <input type="checkbox" />
            </div>
          </td>
          <td>
            {this.state.pagination.pageSize *
              (this.state.pagination.currentPage - 1) +
              index +
              1}
          </td>
          <td>{countryCode}</td>
          <td>{countryName}</td>
          <td>{active == "Y" ? "Yes" : "No"}</td>
        </tr>
      );
    });
  }

  onAddNew() {
    window.location.href = "/contact";
  }

  async onPrev() {
    if (this.state.pagination.currentPage != 1) {
      await this.setState({ pageNumber: this.state.pageNumber - 1 });
      await this.getListCountry();
    }
  }

  async onNext() {
    if (this.state.pagination.currentPage < this.state.pagination.totalPages) {
      await this.setState({ pageNumber: this.state.pageNumber + 1 });
      await this.getListCountry();
    }
  }

  async onChangeRecords(event) {
    let page = Object.assign({}, this.state.pagination);
    page.pageSize = event.target.value;
    await this.setState({ pagination: page });
    await this.getListCountry();
  }
  render() {
    return (
      <div className="app">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h3 className="h3">Country</h3>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group mr-2">
              <Link
                className="btn btn-sm btn-outline-secondary"
                to="/create-country"
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
        <div className="table-responsive">
          <table className="table table-striped table-md">
            <thead>
              <tr>
                <th>
                  <div className="checkbox">
                    <input type="checkbox" />
                  </div>
                </th>
                <th>No</th>
                <th>Country Code</th>
                <th>Country Name</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>{this.renderTableData()}</tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <div className="btn-toolbar mb-2 mb-md-0">
            <label style={{ marginTop: 5 }}>Record : </label>
            <select
              className="custom-select d-block w-10 custom-select-sm"
              style={{ width: 80, marginLeft: 5 }}
              value={this.state.pagination.pageSize}
              onChange={this.onChangeRecords.bind(this)}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
          </div>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group mr-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={this.onPrev.bind(this)}
              >
                Prev
              </button>
              <button className="btn btn-sm btn-outline-secondary" disabled>
                {this.state.pagination.currentPage}/
                {this.state.pagination.totalPages}
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={this.onNext.bind(this)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
