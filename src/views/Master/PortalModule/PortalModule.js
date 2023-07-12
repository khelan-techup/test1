import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button, Input, FormGroup } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import Confirm from "../../CustomModal/Confirm";
import axiosInstance from "../../../common/axiosInstance"

class List extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      openSearch: true,
      portalmodules: [],
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
      modalBody: ''
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
    this.getListData(0);
  }

  //get data
  getListData(pageNo) {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PortalModule/GetAllPaging';

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
          var rdata = result.data.outdata;
          this.setState({
            pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
            portalmodules: rdata, loading: false
          });
        } else {
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
    //const currroles = this.state.roles;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PortalModule/Delete?id=' + id + '&userId=' + userId + '';

    axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          // this.setState({
          //   modal: !this.state.modal,
          //   modalTitle: 'Success',
          //   modalBody: result.data.message
          // });
          toast.success(result.data.message)
          //this.setState({
          //  roles: currroles.filter(role => role.role_Id !== id)
          //});
          this.getListData(0);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        //console.log(error);
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Error',
        //   modalBody: error.message
        // });
        toast.error(error.message)
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

    const { loading, portalmodules, currentPage, currentIndex, pagesCount, pageSize, authError, error } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Portal Module List</h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/master/portalmodule/details">
              <button className="btn btn-primary btn-block">Add</button>
            </Link>
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
                <Table responsive bordered key="tblPortalModules">
                  <thead>
                    <tr>
                      <th>Module Name</th>
                      <th>Status</th>
                      <th className="thNone">PortalModule Id</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // !loading ? (
                      //roles.map(function (data,i) {
                      portalmodules.length > 0 ? (
                        portalmodules
                          //.slice(
                          //  currentPage * pageSize,
                          //  (currentPage + 1) * pageSize
                          //)
                          .map((data, i) => {
                            return (<tr key={i}>
                              <td>{data.moduleName}</td>
                              <td>
                                {data.isActive ? (<Badge color="success">Active</Badge>) : (<Badge color="danger">Inactive</Badge>)}
                              </td>
                              <td className="thNone">{data.moduleId}</td>

                              <td>
                                <Link className="btn btn-primary btn-sm btn-pill" to={'/master/portalmodule/modify/' + data.moduleId}>Edit</Link>{" "}
                                <Confirm title="Confirm" description="Are you sure want to delete this module ?">
                                  {confirm => (
                                    <Link to="#" className="btn btn-danger btn-sm btn-pill" onClick={confirm(e => this.deleteRow(e, data.moduleId))}>Delete</Link>
                                  )}
                                </Confirm>
                              </td>
                            </tr>);
                          })
                      ) : (
                        <tr>
                          <td colSpan="3" className="tdCenter">No modules.</td></tr>
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
