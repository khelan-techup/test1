import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button, Input, FormGroup, Collapse, Fade } from 'reactstrap';
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
      patients: [],
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
      roleName: '',
      collapseId: 0,
    };
    this.state = this.initialState;
  }

  setCollapse(cid) {
    let currentCid = this.state.collapseId;
    if (currentCid == cid) {
      this.setState({ collapseId: -1 });
    }
    else {
      this.setState({ collapseId: cid });
    }
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

    this.setState({ roleName: userToken.roleName });

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
      const url = apiroute + '/api/BE_InstitutePatient/getInstitutePatientsPaging';

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
            // console.log(result.data.outdata);
            this.setState({
              pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              patients: result.data.outdata, loading: false
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
    const url = apiroute + '/api/BE_InstitutePatient/DeletePatient?id=' + id + '&userId=' + userId + '';

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

    const { loading, patients, currentPage, currentIndex, pagesCount, pageSize, authError, error, roleName, collapseId } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Institute Patient List</h5>
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
                {
                  // !loading ? (
                  patients.length > 0 ? (
                    patients.map((data, i) => {
                      return (<Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem", "margin-top": "20px " }}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white" }} >
                            <Row style={{ "fontSize": "16px" }} key={i} onClick={() => this.setCollapse(i)}>
                              <Col md="12">
                                <b>
                                  {this.state.isView && (roleName == 'Neo Admin' || roleName == 'Admin') ?
                                    <React.Fragment>
                                      <span>{data.firstName + " " + (data.middleName != null && data.middleName != "" ? "(" + data.middleName + ")" : "") + data.lastName}</span>
                                    </React.Fragment>
                                    : null
                                  }
                                </b>
                              </Col>
                            </Row>
                          </CardHeader>
                          <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                            <Collapse isOpen={i == collapseId} id="collapseExample">
                              <CardBody>
                                <Row>
                                  <Table responsive bordered >
                                    <thead class="thead-light">
                                      <tr>
                                        <th>Accession No</th>
                                        <th>Diesease</th>
                                        {this.state.isEdit ?
                                          <th>Action</th> : null}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        data.patientAccessionMappings.map((adata, index) => (
                                          <tr>

                                            <td>
                                              <b>
                                                {this.state.isView && (roleName == 'Neo Admin' || roleName == 'Admin') ?
                                                  <React.Fragment>
                                                    {adata.accessionNo == "" || adata.accessionNo == null ?
                                                      "Not Available"
                                                      :
                                                      <Link className="anchorAccessNo" to={'/patientprofile/' + data.patientId + '/' + adata.patientAccessionId}><b>{adata.accessionNo.replace(/-/g, "")}</b></Link>
                                                      //<Link to={'/institutes/patientsinfo/' + data.patientId}>{data.accessionNo}</Link>
                                                    }
                                                  </React.Fragment>
                                                  : (adata.accessionNo == "" || adata.accessionNo == null ?
                                                    "Not Available"
                                                    : <span className="anchorAccessNo"><b>{adata.accessionNo.replace(/-/g, "")}</b></span>
                                                  )
                                                }
                                              </b>
                                            </td>

                                            <td>{adata.diseaseName != null && adata.diseaseName != "" ?
                                              adata.diseaseName
                                              : "-"
                                            }
                                              <br />
                                              {adata.diseaseCode != null && adata.diseaseCode != "" ?
                                                "(" + adata.diseaseCode + ")"
                                                : ""
                                              }</td>

                                            {this.state.isEdit || this.state.isView ?
                                              <td>
                                                {this.state.isEdit ?
                                                  <Confirm title="Confirm" description="Are you sure want to delete this patient ?">
                                                    {confirm => (
                                                      <Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={confirm(e => this.deleteRow(e, data.institutePatientId))}><b>Delete</b></Link>
                                                    )}
                                                  </Confirm>
                                                  : null}
                                                <br />
                                                {/*this.state.isView ?
                                    <Link className="btn btn-info btn-sm btn-pill" to={'/institutes/patientsinfo/' + data.patientId}>View Details</Link>
                                    : null*/}
                                              </td>
                                              : null}
                                          </tr>
                                        ))
                                      }
                                    </tbody>
                                  </Table>
                                </Row>
                              </CardBody>
                            </Collapse>
                          </Fade>
                        </Card>
                      </Col>
                      );
                    })
                  ) : (<Table>
                    <tr>
                      <td className="tdCenter">No patients.</td></tr></Table>
                    // )) : (<Table>                  <tr>
                    //   <td colSpan="6" className="tdCenter">Loading...</td></tr></Table>
                  )}
                {/*newdesignends*/}

                {/*{authError ? <p>{error.message}</p> : null}*/}
                {/*<Table responsive bordered key="tblpatients">*/}
                {/*  <thead>*/}
                {/*    <tr>*/}
                {/*      <th>Accession No</th>*/}
                {/*      */}{/*<th>Patient Name</th>*/}{/*
                */}{/*      <th>Contact</th>*/}
                {/*      <th>Diesease</th>*/}
                {/*      {this.state.isEdit || this.state.isView ?*/}
                {/*        <th>Action</th>*/}
                {/*        : null}*/}
                {/*    </tr>*/}
                {/*  </thead>*/}
                {/*  <tbody>*/}
                {/*    {!loading ? (*/}
                {/*      //employees.map(function (data,i) {*/}
                {/*      patients.length > 0 ? (*/}
                {/*        patients*/}
                {/*          //.slice(*/}
                {/*          //  currentPage * pageSize,*/}
                {/*          //  (currentPage + 1) * pageSize*/}
                {/*          //)*/}
                {/*          .map((data, i) => {*/}
                {/*            return (<tr key={i}>*/}
                {/*              <td>*/}
                {/*                <b>*/}
                {/*                  {this.state.isView && (roleName == 'Neo Admin' || roleName == 'Admin') ?*/}
                {/*                    <React.Fragment>*/}
                {/*                      <span>{data.firstName + " " + (data.middleName != null && data.middleName != "" ? "(" + data.middleName + ")" : "") + data.lastName}</span>*/}
                {/*                      <br />*/}
                {/*                      {data.accessionNo == "" || data.accessionNo == null ?*/}
                {/*                        "Not Available"*/}
                {/*                        :*/}
                {/*                        <Link className="anchorAccessNo" to={'/patients/info/' + data.patientId}>{data.accessionNo}</Link>*/}
                {/*                        //<Link to={'/institutes/patientsinfo/' + data.patientId}>{data.accessionNo}</Link>*/}
                {/*                      }*/}
                {/*                    </React.Fragment>*/}
                {/*                    : (data.accessionNo == "" || data.accessionNo == null ?*/}
                {/*                      "Not Available"*/}
                {/*                      : <span className="anchorAccessNo"><b>{data.accessionNo}</b></span>*/}
                {/*                    )*/}
                {/*                  }*/}
                {/*                </b>*/}
                {/*              </td>*/}
                {/*              */}{/*<td><b>{data.accessionNo == "" || data.accessionNo == null ? "Not Avaialable" : data.accessionNo}</b></td>*/}{/*
                */}{/*              <td>{data.firstName} {data.middleName != "" && data.middleName != null ? "(" + data.middleName + ")" : ""} {"(" + data.lastName + ")"} </td>*/}{/*
                */}{/*              <td><i className="fa fa-envelope fa-lg" />&nbsp;{data.email}*/}{/*
                */}{/*                <br />*/}{/*
                */}{/*                {data.mobile != "" && data.mobile != null ?*/}{/*
                */}{/*                  <React.Fragment>*/}{/*
                */}{/*                    <i className="fa fa-mobile fa-2x" />&nbsp;*/}{/*
                */}{/*                    {data.mobile}*/}{/*
                */}{/*                  </React.Fragment>*/}{/*
                */}{/*                  :*/}{/*
                */}{/*                  ""*/}{/*
                */}{/*                }*/}{/*
                */}{/*              </td>*/}
                {/*              <td>*/}
                {/*                {data.diseaseName != null && data.diseaseName != "" ?*/}
                {/*                  data.diseaseName*/}
                {/*                  : "-"*/}
                {/*                }*/}
                {/*                <br />*/}
                {/*                {data.diseaseCode != null && data.diseaseCode != "" ?*/}
                {/*                  "(" + data.diseaseCode + ")"*/}
                {/*                  : ""*/}
                {/*                }</td>*/}
                {/*              {this.state.isEdit || this.state.isView ?*/}
                {/*                <td>*/}
                {/*                  {this.state.isEdit ?*/}
                {/*                    <Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={e => this.deleteRow(e, data.institutePatientId)}><b>Delete</b></Link>*/}
                {/*                    : null}*/}
                {/*                  <br />*/}
                {/*                  */}{/*this.state.isView ?*/}{/*
                */}{/*                    <Link className="btn btn-info btn-sm btn-pill" to={'/institutes/patientsinfo/' + data.patientId}>View Details</Link>*/}{/*
                */}{/*                    : null*/}
                {/*                </td>*/}
                {/*                : null}*/}
                {/*            </tr>);*/}
                {/*          })*/}
                {/*      ) : (*/}
                {/*        <tr>*/}
                {/*          <td colSpan="6" className="tdCenter">No patients.</td></tr>*/}
                {/*      )) : (*/}
                {/*      <tr>*/}
                {/*        <td colSpan="6" className="tdCenter">Loading...</td></tr>*/}
                {/*    )}*/}
                {/*  </tbody>*/}
                {/*</Table>*/}

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
      </div >
    );
  }
}

export default List;
