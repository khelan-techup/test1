import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button, Input, FormGroup } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import axiosInstance from "../../../common/axiosInstance"

class List extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      openSearch: true,
      manufacturers: [],
      searchString: '',
      slDelete: true,
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      pageSize: window.$TotalRecord,
      authError: false,
      error: '',
      modal: false,
      modalTitle: '',
      modalBody: '',
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


  //modal close button event
  handleModalClose = () => {
    this.setState({
      modal: false,
      modalTitle: '',
      modalBody: ''
    });
  }

  //load event
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    var rights = userToken.roleModule;
    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("manufacturer"));
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
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_Manufacturer/GetAllPaging';

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: userId,
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
            manufacturers: result.data.outdata, loading: false
          })
        }
        else {
          // console.log(result.data.message);
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ authError: true, error: error, loading: false });
      });
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
  handleChange = (e) => {
    const target = e.target;
    const value = target.value;

    this.setState(() => ({
      loading: true,
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      //pageSize: 10,
      slDelete: JSON.parse(value)
    }), function () { this.getListData(0); });
  }

  //delete(active/inactive) button click
  deleteRow(e, id) {
    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_Manufacturer/Delete?id=' + id + '&userId=' + userId + '';

    axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {
      if (result.data.flag) {
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Success',
        //   modalBody: result.data.message
        // });
        toast.success(result.data.message)
        //this.setState({
        //  employees: curremployees.filter(employee => employee.org_Id !== id)
        //});
        this.getListData(0);
      } else {
        this.setState({ loading: false });
      }
    })
      .catch(error => {
        //console.log(error);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: error.message,
          loading: false
        });
        toast.error(error.message)
        this.setState({ authError: true, error: error });
      });
  }

  //welcome mail button click
  sendMail(e, id) {
    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_CognitoMail/RegisterUser?id=' + id + '&uid=' + userId + '';

    axiosInstance.post(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {
      if (result.data.flag) {
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Success',
          // modalBody: result.data.message,
          loading: false
        });
        toast.success(result.data.message)
        //this.setState({
        //  employees: curremployees.filter(employee => employee.org_Id !== id)
        //});
      }
      else {
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Success',
          // modalBody: result.data.message,
          loading: false
        });
        toast.success(result.data.message)
      }
    })
      .catch(error => {
        //console.log(error);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: error.message,
          loading: false
        });
        toast.error(error.message)
        this.setState({ authError: true, error: error });
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
      return <Redirect to="/Login" />
    }

    const { loading, manufacturers, currentPage, currentIndex, pagesCount, pageSize, authError, error } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Manufacturer List</h5>
          </Col>
          <Col xs="2" lg="2">
            {this.state.isEdit ?
              <Link to="/manufacturer/details">
                <button className="btn btn-primary btn-block">Add Manufacturer</button>
              </Link>
              : null}
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col xs="2">
                    <Input type="select" name="slDelete" onChange={this.handleChange}>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Input>
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
                <Table responsive bordered key="tblmanufacturers">
                  <thead>
                    <tr>
                      <th>Manufacturer Name</th>
                      <th>Contact</th>
                      {this.state.isEdit && this.state.isView ?
                        <th>Action</th>
                        : null}
                      {this.state.isView ?
                        <th>View</th>
                        : null}
                      <th> Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // !loading ? (
                      //employees.map(function (data,i) {
                      manufacturers.length > 0 ? (
                        manufacturers
                          //.slice(
                          //  currentPage * pageSize,
                          //  (currentPage + 1) * pageSize
                          //)
                          .map((data, i) => {
                            return (<tr key={i}>
                              <td>{data.companyName}
                                {/*<br /> {"(" + data.accessionNo + ")"}*/} </td>
                              <td>
                                <i className="fa fa-envelope fa-lg" />&nbsp;{data.email}
                                <br />
                                {data.mobile != "" && data.mobile != null ?
                                  <React.Fragment>
                                    <i className="fa fa-mobile fa-2x" />&nbsp;
                                    {data.mobile}
                                  </React.Fragment>
                                  :
                                  ""
                                }
                              </td>
                              {this.state.isEdit && this.state.isView ?
                                <td>
                                  {this.state.isEdit ?
                                    <React.Fragment>
                                      <Link className="btn btn-primary btn-sm btn-pill" to={'/manufacturer/modify/' + data.manufacturerId}><b>Edit</b></Link>{" "}
                                      {/*<Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={e => this.deleteRow(e, data.manufacturerId)}><b>Delete</b></Link>*/}
                                    </React.Fragment>
                                    : null}
                                </td>
                                : null}
                              {this.state.isView ?
                                <td>
                                  <Link className="btn btn-dark btn-sm btn-pill" to={'/manufacturer/patients/' + data.manufacturerId}>Patients</Link>
                                </td>
                                : null}
                              <td>
                                {data.isCognito ?
                                  (data.isConfirm ?
                                    (data.isActivate ?
                                      <span className="badge badge-success btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Active</span>
                                      :
                                      <span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Inactive</span>
                                    )
                                    :
                                    <span className="badge badge-warning btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Confirmation Pending</span>
                                  )
                                  :
                                  this.state.isEdit ?
                                    <Link className="btn btn-info btn-sm btn-pill" to="#" onClick={e => this.sendMail(e, data.userId)} ><b>Activate Account</b></Link>
                                    :
                                    <span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Inactive</span>
                                }
                              </td>
                            </tr>);
                          })
                      ) : (
                        <tr>
                          <td colSpan="5" className="tdCenter">No manufacturers.</td></tr>
                        // )) : (
                        // <tr>
                        //   <td colSpan="5" className="tdCenter">Loading...</td></tr>
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
        <MyModal
          handleModal={this.handleModalClose.bind(this)}
          //modalAction={this.state.modalAction}
          isOpen={this.state.modal}
          modalBody={this.state.modalBody}
          modalTitle={this.state.modalTitle}
          modalOptions={this.state.modalOptions}
        />
      </div>
    );
  }
}

export default List;
