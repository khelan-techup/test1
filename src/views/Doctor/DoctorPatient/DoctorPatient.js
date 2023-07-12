import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button, Input, FormGroup, Collapse, Fade } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import Confirm from "../../CustomModal/Confirm";
import axiosInstance from "./../../../common/axiosInstance"
import ReactPaginate from 'react-paginate';
import { BE_PractitionerPatient_DeletePatient, BE_PractitionerPatient_GetPatientsByPractitionerIdPaging } from '../../../common/allApiEndPoints';

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
      collapseId: 0,
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
      role_Id: null,
      PatientName: "",
      pageCountNew: 0
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

    this.setState({ roleName: userToken.roleName, role_Id: userToken.roleId });

    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("practitioners"));
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          this.getListData(0);
          // this.getPractitionerData();
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
    this.setState({ loading: true });

    const param = this.props.match.params;

    if (param.id != undefined) {
      var userToken = JSON.parse(localStorage.getItem('AUserToken'));
      let userId = (userToken.userId == null ? 0 : userToken.userId);

      const apiroute = window.$APIPath;
      // const url = apiroute + '/api/BE_PractitionerPatient/GetPatientsByPractitionerIdPaging';
      const url = apiroute + BE_PractitionerPatient_GetPatientsByPractitionerIdPaging

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
          this.setState({
            PatientName: result.data
          })
          if (result.data.flag) {
            // console.log(result.data.outdata);
            this.setState({
              pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              pageCountNew: Math.ceil(
                result.data.totalRecord / window.$TotalRecord
              ),
              patients: result.data.outdata,
              loading: false,


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
      this.props.history.push('/practitioners/list');
    }
  }

  //Practitioner Data

  //pagination
  handleClick(e, index, currIndex) {
    this.setState({ loading: true })
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
  deleteRow(e, patientId, id) {
    // e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_PractitionerPatient/DeletePatient?id=' + patientId + '&userId=' + id + '';
    const url = apiroute + BE_PractitionerPatient_DeletePatient(patientId, id)

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
        toast.success(result.data.message);
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
        toast.error(error.message);
        this.setState({ authError: true, error: error });
      });
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin">
      </div>;
    }
  }
  handlePageClick = (e) => {
    console.log("datra", e.selected)
    let currentPage = e.selected;
    this.getListData(currentPage)

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
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Practitioner Patient List</h5>
          </Col>
          <Col xs="2" lg="2">
            <Link to="/practitioners/list">
              <button className="btn btn-primary btn-block">Practitioners</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>

                  <Col xs="6" >
                    <h5 className='mt-2'>Practitioner: <b>{this.state.PatientName.flag == true ? (this.state?.PatientName.message) : ""}</b></h5>
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
                      return (<Col key={i} xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem", "margin-top": "20px " }}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white" }} >
                            <Row style={{ "fontSize": "16px" }} key={i} onClick={() => this.setCollapse(i)}>
                              <Col md="12">
                                <b>
                                  {/* {this.state.isView && (roleName == 'Neo Admin' || roleName == 'Admin') ? */}
                                  {this.state.isView ?
                                    <React.Fragment>


                                      <span>
                                        {
                                          (!!(data?.displayName))
                                            ? (data?.displayName) : (data.firstName +
                                              " " +
                                              (data.middleName != null &&
                                                data.middleName != ""
                                                ? data.middleName + " "
                                                : "") +
                                              data.lastName)
                                        }
                                        {
                                          (
                                            data.displayStatus == "Open" ||
                                            data.displayStatus == "On Hold" ||
                                            data.displayStatus == "Complete" ||
                                            data.displayStatus == "Cancelled" ||
                                            data.displayStatus == "Deceased"
                                          )
                                            ? <span className="ml-2 h6"
                                              style={
                                                {
                                                  color: data.displayStatus == "Open" ? "white" :
                                                    (data.displayStatus == "On Hold" ? "white" :
                                                      (data.displayStatus == "Complete" ? "white" :
                                                        (data.displayStatus == "Cancelled" ? "white" :
                                                          (data.displayStatus == "Deceased" ? "white" : ""))))
                                                }
                                              }
                                            >
                                              {/* {
                                                console.log(data?.patientAccessionMappings?.filter((fData) => {
                                                  return fData?.accessionStatus == "Active"
                                                })[0]
                                                )
                                              } */}
                                              {
                                                // data?.patientAccessionMappings.filter((d) => d.accessionStatus != "Active").length > 0 ?
                                                false ?
                                                  <>
                                                    {"( "}

                                                    {
                                                      Array.from(new Set(data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus != "Open"
                                                      }).map((d) => d.accessionStatus))).map((s, i) => {
                                                        return <span>{s}{
                                                          Array.from(new Set(data?.patientAccessionMappings?.filter((fData) => {
                                                            return fData?.accessionStatus != "Open"
                                                          }).map((d) => d.accessionStatus))).length - 1 == i
                                                            ? "" : ", "}</span>
                                                      })

                                                    }


                                                    {/* {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Active"
                                                      })[0]?.accessionStatus
                                                    } */}
                                                    {/* {" "} */}

                                                    {/* {


                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Complete"
                                                      })[0]?.accessionStatus}
                                                    {" "}

                                                    {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "On Hold"
                                                      })[0]?.accessionStatus
                                                    }
                                                    {" "}

                                                    {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Cancelled"
                                                      })[0]?.accessionStatus
                                                    }
                                                    {" "}
                                                    {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Deceased"
                                                      })[0]?.accessionStatus
                                                    }
                                                    {" "} */}

                                                    {" )"}
                                                  </>
                                                  : ""
                                              }

                                            </span> : ""
                                        }
                                      </span>
                                      <br />
                                      <div>
                                        <small>
                                          {data?.isRedFlag && data?.redMessage}
                                        </small>
                                      </div>
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
                                        <th>Neo7 Analysis Type</th>
                                        {/* {this.state.isEdit ?
                                          <th>Action</th> : null} */}

                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        data.patientAccessionMappings.map((adata, index) => (
                                          <tr key={index}>
                                            <td>

                                              <b>
                                                {/* {this.state.isView && (roleName == 'Neo Admin' || roleName == 'Admin') ? */}
                                                {this.state.isView ?

                                                  <React.Fragment>
                                                    {adata.accessionNo == "" || adata.accessionNo == null ?
                                                      "Not Available"
                                                      : (

                                                        /* <span >{data.accessionNo}</span>*/
                                                        <span>


                                                          <Link className="anchorAccessNo" to={((this.state.role_Id == 5 || this.state.role_Id == 1 || this.state.role_Id == 4) ? '/patients/admininfo/' : '/patients/info/') + data.patientId + '/' + adata.patientAccessionId}><b>{adata.accessionNo.replace(/-/g, "")}</b></Link>
                                                          <br />
                                                          {adata?.accessionNo != null
                                                            ? ` (${adata?.accessionStatus})`
                                                            : "55"}
                                                        </span>

                                                      )
                                                    }



                                                  </React.Fragment>
                                                  : (adata.accessionNo == "" || adata.accessionNo == null ?
                                                    "Not Available"
                                                    : <span className="anchorAccessNo"><b>{adata.accessionNo.replace(/-/g, "")}</b></span>
                                                  )

                                                }
                                              </b>
                                            </td>
                                            <td>
                                              {
                                                adata?.diseaseCategory != null && adata.diseaseCategory != "" ?
                                                  adata.diseaseCategory : ""
                                              }
                                              {adata.diseaseName != null && adata.diseaseName != "" ?
                                                " - " + adata.diseaseName
                                                : ""
                                              }
                                              {/* <br /> */}
                                              {/* {adata.diseaseCode != null && adata.diseaseCode != "" ?
                                                "(" + adata.diseaseCode + ")"
                                                : ""
                                              } */}
                                            </td>
                                            {/* {this.state.isEdit ?
                                              <td>
                                                {this.state.isEdit ?
                                                  <Confirm title="Confirm" description="Are you sure want to delete this patient ?">
                                                    {confirm => (
                                                      <Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={confirm(e => this.deleteRow(e, adata.patientId, adata.patientAccessionId))}><b>Delete</b></Link>
                                                    )}
                                                  </Confirm>
                                                  : null}
                                                <br />
                                             
                                              </td>
                                              : null} */}
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
                {/*                        //<Link to={'/practitioners/patientsInfo/' + data.patientId}>{data.accessionNo}</Link>*/}
                {/*                        <Link className="anchorAccessNo" to={'/patients/info/' + data.patientId}>{data.accessionNo}</Link>*/}
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
                */}{/*             <td>{data.firstName} {data.middleName != "" && data.middleName != null ? "(" + data.middleName + ")" : ""} {"(" + data.lastName + ")"} </td>*/}{/*
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
                {/*                    <Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={e => this.deleteRow(e, data.practitionerPatientId)}><b>Delete</b></Link>*/}
                {/*                    : null}*/}
                {/*                  <br />*/}
                {/*                  */}{/*this.state.isView ?*/}{/*
                */}{/*                    <Link className="btn btn-info btn-sm btn-pill" to={'/practitioners/patientsInfo/' + data.patientId}>View Details</Link>*/}{/*
                */}{/*                    : null*/}
                {/*                </td>*/}
                {/*                : null}*/}
                {/*            </tr>);*/}
                {/*          })*/}
                {/*      ) : (*/}
                {/*          <tr>*/}
                {/*            <td colSpan="5" className="tdCenter">No patients.</td></tr>*/}
                {/*        )) : (*/}
                {/*        <tr>*/}
                {/*          <td colSpan="5" className="tdCenter">Loading...</td></tr>*/}
                {/*      )}*/}
                {/*  </tbody>*/}
                {/*</Table>*/}

                {/* <Pagination aria-label="Page navigation example" className="customPagination">
                  <PaginationItem disabled={currentIndex - 4 <= 0}>
                    <PaginationLink onClick={e =>
                      this.handleClick(e,
                        Math.floor((currentPage - 5) / 5) * 5,
                        Math.floor((currentIndex - 5) / 5) * 5
                      )

                    }

                      previous href="#">
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
                    <PaginationLink onClick={e =>
                      this.handleClick(e,
                        Math.floor((currentPage + 5) / 5) * 5,
                        Math.floor((currentIndex + 5) / 5) * 5
                      )
                    } next href="#">
                      Next
                    </PaginationLink>
                  </PaginationItem>
                </Pagination> */}
                <ReactPaginate
                  nextLabel="Next >"
                  breakLabel="..."
                  previousLabel="< Prev"
                  pageCount={this.state.pageCountNew}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={this.handlePageClick}
                  containerClassName={"pagination justify-content-end "}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  pageClassName={"page-item "}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
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
