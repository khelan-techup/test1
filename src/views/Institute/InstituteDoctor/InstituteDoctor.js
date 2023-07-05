import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button, Input, FormGroup } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Confirm from "../../CustomModal/Confirm";
import axiosInstance from "../../../common/axiosInstance"


class List extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      openSearch: true,
      doctors: [],
      searchString: '',
      slDelete: true,
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      pageSize: window.$TotalRecord,
      authError: false,
      error: '',
      isView: false,
      isEdit: false,

    };
    this.state = this.initialState;
  }

  closeSearch = (e) => {
    if (this.state.searchString === '') {
      this.setState({
        openSearch: false
      });
    }
    else {
      this.setState(() => ({
        openSearch: false,
        loading: true,
        currentPage: 0,
        currentIndex: 0,
        pagesCount: 0,
        //pageSize: 10,
        searchString: ''
      }), function () { this.getListData(0); });
    }
  }

  //load event
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    var rights = userToken.roleModule;
    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("institution"));
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          this.getListData(0);
        }
        else {
          this.setState({ loading: false });
        }
      }
      else {
        this.setState({ loading: false });
      }
    }
    else {
      this.setState({ loading: false });
    }
  }

  //get data
  getListData(pageNo) {
    const param = this.props.match.params;

    if (param.id != undefined) {
      var userToken = JSON.parse(localStorage.getItem('AUserToken'));
      let userId = (userToken.userId == null ? 0 : userToken.userId);

      const apiroute = window.$APIPath;
      const url = apiroute + '/api/BE_InstitutePractitioner/getInstitutePractitionersPaging';

      let data = JSON.stringify({
        isDeleted: this.state.slDelete,
        searchString: this.state.searchString,
        Id: parseInt(param.id),
        pageNo: pageNo,
        totalNo: window.$TotalRecord,
      });

      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(result => {
          if (result.data.flag) {
            //console.log(result.data.outdata);
            this.setState({
              pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              doctors: result.data.outdata, loading: false,
            })
          } else {
            // console.log(result.data.message);
            this.setState({ loading: false });
          }
        })
        .catch(error => {
          // console.log(error);
          this.setState({ authError: true, error: error, loading: false });
        });
    }
    else {
      this.props.history.push('/institutes/list');
    }
  }

  //pagination
  handleClick(e, index, currIndex) {
    e.preventDefault();
    var pgcount = this.state.pagesCount - 1;
    var pgCurr = (index >= pgcount ? pgcount : index);
    this.setState({
      currentPage: pgCurr,
      currentIndex: currIndex
    }, function () { this.getListData(pgCurr); });
  }

  //search
  filter = (e) => {
    if (e.key == 'Enter') {
      const target = e.target;
      const value = target.value;

      this.setState(() => ({
        loading: true,
        currentPage: 0,
        currentIndex: 0,
        pagesCount: 0,
        //pageSize: 10,
        searchString: value
      }), function () { this.getListData(0); });
    }
  }

  //active/inactive filter
  //handleChange = (e) => {
  //  const target = e.target;
  //  const value = target.value;

  //  this.setState(() => ({
  //    loading: true,
  //    currentPage: 0,
  //    currentIndex: 0,
  //    pagesCount: 0,
  //    pageSize: 10,
  //    slDelete: JSON.parse(value)
  //  }), function () { this.getListData(0); });
  //}

  //delete(active/inactive) button click
  deleteRow(e, id) {
    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_InstitutePractitioner/DeletePractitioner?id=' + id + '';

    axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            modal: !this.state.modal,
            modalTitle: 'Success',
            modalBody: result.data.message
          });

          this.getListData(0);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        //console.log(error);
        this.setState({
          modal: !this.state.modal,
          modalTitle: 'Error',
          modalBody: error.message
        });
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin">
      </div>;
    }
  }

  render() {
    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const { loading, doctors, currentPage, currentIndex, pagesCount, pageSize, authError, error } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Institute Practitioner List</h5>
          </Col>
          <Col xs="2" lg="2">
            <Link to="/institutes/list">
              <button className="btn btn-primary btn-block">Institutions</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col xs="2">

                  </Col>
                  <Col xs="4">
                  </Col>
                  <Col xs="6">
                    {
                      this.state.openSearch ? (
                        <div className="searchBox">
                          <input type="text" placeholder="Search..." onKeyPress={this.filter} />
                          <Link className="closeSearch" to="#" onClick={this.closeSearch}><i className="fa fa-close" /></Link>
                        </div>
                      ) : (
                        <div className="search" onClick={() => this.setState({ openSearch: true })}>
                          <i className="fa fa-search" />
                        </div>
                      )}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {authError ? <p>{error.message}</p> : null}
                <Table responsive bordered key="tbldoctors">
                  <thead>
                    <tr>
                      <th>Practitioner Details</th>
                      <th>Qualification</th>
                      {this.state.isEdit || this.state.isView ?
                        <th>Action</th>
                        : null}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // !loading ? (
                      //employees.map(function (data,i) {
                      doctors.length > 0 ? (
                        doctors
                          //.slice(
                          //  currentPage * pageSize,
                          //  (currentPage + 1) * pageSize
                          //)
                          .map((data, i) => {
                            return (<tr key={i}>
                              <td>
                                <b>
                                  {data.firstName} {data.middleName != "" && data.middleName != null ? " " + data.middleName + " " : ""} {" " + data.lastName + ""}
                                </b>{" "}
                                {data.qualification}
                                <hr />
                                <i className="fa fa-envelope fa-lg" />&nbsp;{data.email}&nbsp;
                                {data.mobile != "" && data.mobile != null ?
                                  <React.Fragment>
                                    <i className="fa fa-mobile fa-2x" />&nbsp;
                                    {data.mobile}
                                  </React.Fragment>
                                  :
                                  ""
                                }
                              </td>
                              <td>{data.qualification}</td>
                              {this.state.isEdit || this.state.isView ?
                                <td>
                                  {this.state.isEdit ?
                                    <Confirm title="Confirm" description="Are you sure want to delete this practitioner ?">
                                      {confirm => (
                                        <Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={confirm(e => this.deleteRow(e, data.practitionerId))}><b>Delete</b></Link>
                                      )}
                                    </Confirm>
                                    : null}
                                  <br />
                                  {this.state.isView ?
                                    <Link className="btn btn-info btn-sm btn-pill" to={'/institutes/practitionerinfo/' + data.practitionerId}>View Details</Link>
                                    : null}
                                </td>
                                : null}
                            </tr>);
                          })
                      ) : (
                        <tr>
                          <td colSpan="3" className="tdCenter">No practitioners.</td></tr>
                        // )) : (
                        // <tr>
                        //   <td colSpan="3" className="tdCenter">Loading...</td></tr>
                      )}
                  </tbody>
                </Table>

                <Pagination aria-label="Page navigation example" className="customPagination">
                  <PaginationItem disabled={currentIndex - 4 <= 0}>
                    <PaginationLink onClick={e => this.handleClick(e, currentPage - 5, currentIndex - 5)} previous href="#">
                      Prev
                    </PaginationLink>
                  </PaginationItem>
                  {[...Array(pagesCount)].slice(currentIndex, currentIndex + 5).map((page, i) =>
                    <PaginationItem active={currentIndex + i === currentPage} key={currentIndex + i}>
                      <PaginationLink onClick={e => this.handleClick(e, currentIndex + i, currentIndex)} href="#">
                        {currentIndex + i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem disabled={currentIndex + 5 >= pagesCount}>
                    <PaginationLink onClick={e => this.handleClick(e, currentPage + 5, currentIndex + 5)} next href="#">
                      Next
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

export default List;
