import React, { Component } from "react";
import { Link } from "react-router-dom";
import Api from "../../../adaptor/Api";
import { getToken, removeUserSession } from "../../../utils/Common";
import Spinner from "../../../component/loading/Spinner";

export default class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      error: null,
      isLoading: true,
      banks: [],
      pagination: {
        pageSize: 10,
        currentPage: 1,
        totalPages: 1,
        totalRecords: 1,
        isFirstPage: true,
        isLastPage: true,
      },
      pageNumber: 1,
      sortBy: "bankName",
      sortType: "asc",
      searchBy: "",
    };
  }

  getListBank() {
    this.setState({isLoading:true})
    Api.get(
      "/v1/bank/list?pageSize=" +
        this.state.pagination.pageSize +
        "&pageNumber=" +
        this.state.pageNumber +
        "&sortBy=bankName&sortType=asc&searchBy",
      {
        headers: {
          Authorization: getToken(),
        },
      }
    ).then(
      (response) => {
        this.setState({
          isLoading: false,
          banks: response.data.content,
          pagination: response.data.pagination,
        });
      },
      (error) => {
        // if (error.response.data.status === 401) {
        //   removeUserSession();
        // }
        this.setState({
          isLoading: false,
          error: error,
        });
      }
    );
  }
  
  async componentDidMount() {
    await this.getListBank();
  }

  onEdit(id){
    this.props.history.push('/bank/update-bank/'+id);
  }

  renderTableData() {
    return this.state.banks.map((bank, index) => {
      const { bankId,bankName,countryCode, active } = bank; //destructuring
      let id=bankId;
      return (
        <tr key={bankId}>
          <td>
            {this.state.pagination.pageSize *
              (this.state.pagination.currentPage - 1) +
              index +
              1}
          </td>
          <td>{bankId}</td>
          <td>{bankName}</td>
          <td>{countryCode}</td>
          <td>{active == "Y" ? "Yes" : "No"}</td>
          <td className="action-button">
            <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => this.onEdit(bankId)}
              >
              Edit
            </button>
            <button
                className="btn btn-sm btn-outline-secondary"
              >
              Delete
            </button>
           </td>
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
      await this.getListBank;
    }
  }

  async onNext() {
    if (this.state.pagination.currentPage < this.state.pagination.totalPages) {
      await this.setState({ pageNumber: this.state.pageNumber + 1 });
      await this.getListBank;
    }
  }

  async onChangeRecords(event) {
    let page = Object.assign({}, this.state.pagination);
    page.pageSize = event.target.value;
    await this.setState({ pagination: page });
    await this.getListBank();
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
                to="/bank/create-bank"
              >
                Add New
              </Link>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-md">
            <thead>
              <tr>
                <th>No</th>
                <th>Bank Id</th>
                <th>Bank Name</th>
                <th>Country Code</th>
                <th>Active</th>
                <th>Action</th>
              </tr>
            </thead>
            {this.state.isLoading ? <Spinner /> :<tbody>{this.renderTableData()}</tbody>}
          </table>
        </div>
        {/* Pagination */}
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 pagination">
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
