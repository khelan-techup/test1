import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button, Input, FormGroup } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Confirm from "../../CustomModal/Confirm";

class List extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      openSearch: true,
      diseases: [],
      searchString: '',
      diseaseCategoryId: 0,
      diseasecategories: [],
      slDelete: true,
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      pageSize: window.$TotalRecord,
      authError: false,
      error: '',
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
    this.getListData(0);
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_DiseaseCategory/GetAll';

    let data = JSON.stringify({
      isDeleted: true,
      searchString: '',
      id: 0
    });

    axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })

      .then(result => {
        if (result.data.flag) {
          //let diseaseCat = [];
          //let cancerObj = result.data.outdata.filter(category => category.diseaseCategoryName.toLowerCase() == 'pbima-iti-pes');
          //diseaseCat.push(cancerObj);

          //let healthObj = result.data.outdata.filter(category => category.diseaseCategoryName.toLowerCase() == 'healthindex');
          //diseaseCat.push(healthObj);

          let diseaseCatObj = result.data.outdata.filter(category => category.diseaseCategoryName.toLowerCase() == 'cancer' || category.diseaseCategoryName.toLowerCase() == 'complete health score');

          this.setState({ diseasecategories: diseaseCatObj, diseaseCategoryId: diseaseCatObj[0].diseaseCategoryId },
            function () { this.getListData(0); });

          // console.log("final", this.state.diseasecategories);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
      });


  }

  //get data
  getListData(pageNo) {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_ReportBuilder/GetAll';

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      id: userId,
      diseaseCatId: parseInt(this.state.diseaseCategoryId),
    });

    axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {

          // console.log(result.data.outdata);
          //   var rdata = result.data.outdata.filter(dl => dl.category.toLowerCase() != 'healthindex');
          this.setState({
            pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
            diseases: result.data.outdata, loading: false
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

  //select
  filterOnSelect = (e) => {
    const target = e.target;
    const value = target.value;

    this.setState(() => ({
      loading: true,
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      //pageSize: 10,
      diseaseCategoryId: value
    }), function () { this.getListData(0); });
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
    // e.preventDefault();
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_ReportBuilder/Delete?id=' + id + '&userId=' + userId + '';

    axios.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          toast.success(result.data.message)
          this.getListData(0);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        //console.log(error);
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

    const { loading, diseases, currentPage, currentIndex, diseasecategories, diseaseCategoryId, pagesCount, pageSize, authError, error } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Report Builder </h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/master/report/details">
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
                  <Col xs="2">
                    <FormGroup>
                      <Input type="select" name="diseaseCategoryId" onChange={this.filterOnSelect}>
                        {diseasecategories
                          .map((data, i) => {
                            return (<option key={i} value={data.diseaseCategoryId}>{data.diseaseCategoryName + " (" + data.productName + ")"}</option>);
                          })}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col xs="2">
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
                <Table responsive bordered key="tblDiseases">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Report Type</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // !loading ? (
                      //roles.map(function (data,i) {
                      diseases.length > 0 ? (
                        diseases
                          //.slice(
                          //  currentPage * pageSize,
                          //  (currentPage + 1) * pageSize
                          //)
                          .map((data, i) => {
                            return (<tr key={i}>
                              <td>{data.title}</td>
                              <td>{data.diseaseCategory}</td>
                              <td>
                                {data.type == 'D' ? "Dynamic" : "Static"}
                              </td>
                              <td>
                                {data.isActive ? (<Badge color="success">Active</Badge>) : (<Badge color="danger">Inactive</Badge>)}
                              </td>

                              <td>
                                <Link className="btn btn-primary btn-sm btn-pill" to={'/master/report/modify/' + data.reportBuilderId}>Edit</Link>{" "}
                                {data.isActive ?
                                  <Confirm title="Confirm" description="Are you sure you want to inactive this report data ?">
                                    {confirm => (
                                      <Link className="btn btn-warning btn-sm btn-pill" to="#" onClick={confirm(e => this.deleteRow(e, data.reportBuilderId))}><b>Inactive</b></Link>
                                    )}
                                  </Confirm> :
                                  <Confirm title="Confirm" description="Are you sure you want to active this report data ?">
                                    {confirm => (
                                      <Link className="btn btn-info btn-sm btn-pill" to="#" onClick={confirm(e => this.deleteRow(e, data.reportBuilderId))}><b>Active</b></Link>
                                    )}
                                  </Confirm>}
                              </td>
                            </tr>);
                          })
                      ) : (
                        <tr>
                          <td colSpan="5" className="tdCenter">No record found.</td></tr>
                        // )) : (
                        // <tr>
                        //   <td colSpan="4" className="tdCenter">Loading...</td></tr>
                      )}
                  </tbody>
                </Table>

                {/* <Pagination aria-label="Page navigation example" className="customPagination">
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
                </Pagination> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default List;
