import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button, Input, FormGroup } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import Confirm from "../../CustomModal/Confirm";
import "@reach/dialog/styles.css";
import { toast } from 'react-toastify';
import { Steps } from "intro.js-react";
import axiosInstance from "./../../../common/axiosInstance"
import ReactPaginate from 'react-paginate';
import { BE_CognitoMail_RegisterUser, BE_OrganizationUser_UpdateTooltipSteps, BE_Practitioner_ApproveIRBNo, BE_Practitioner_Delete, BE_Practitioner_GetAllPaging, BE_Practitioner_RejectIRBNo, BE_Practitioner_SetDiscount } from '../../../common/allApiEndPoints';

class List extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

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
      modal: false,
      modalTitle: '',
      modalBody: '',
      isView: false,
      isEdit: false,
      roleName: '',
      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      steps: [
        {
          element: "#pagetitle",
          title: 'Practitioner List',
          intro: "This page is for adding, deleting, or editing Practioners to the Portal.",
          tooltipClass: "cssClassName1",
        }, {
          element: "#addpatient",
          title: 'Add New Practitioner',
          intro: "Add new Practitioner by clicking on this button.",
          tooltipClass: "cssClassName1",
        },
        {
          element: "#activeinactive",

          title: 'Select Status',
          tooltipClass: "cssClassName1",
          intro: "This will filter Practitioner list to either active/inactive."
        },
        {
          element: "#searchbar",
          title: 'Search Practitioner',

          tooltipClass: "cssClassName1",
          intro: "Search for a Practitioner."
        },
        {
          element: "#practitionerdetails",
          title: "Practitioner Details",
          intro: 'You will be redirected to the Practitioner Details page by clicking on this hyperlink.',

          tooltipClass: "cssClassName1",
        },
        {
          element: "#editdetails",
          title: 'Edit Practitioner Details',

          tooltipClass: "cssClassName1",
          intro: "You can edit Practitioner details using this button."
        },
        {
          element: "#deletepractitioner",
          title: 'Delete Practitioner',

          tooltipClass: "cssClassName1",
          intro: "You can delete the Practitioner using this button."
        },
        {
          element: "#viewpatient",
          title: 'View Patient List',

          tooltipClass: "cssClassName1",
          intro: "This will show the list of patients which is assigned to this laboratory."
        }, {
          element: "#statusoflab ",
          title: 'Status of Laboratory',

          tooltipClass: "cssClassName1",
          intro: "Change title to: Status of Practitioner <Br />  Current status of the Practitioner."
        }, {
          element: "#help",
          tooltipClass: "cssClassName1",
          title: "Tour",
          intro: "Highlights key page features and functions."
        }

      ],
      hintsEnabled: false,
      hints: [
        {
          element: "#hello",
          hint: "Hello hint",
          hintPosition: "middle-right"
        }
      ],
      pageCountNew: 0,

    };
    this.state = this.initialState;
  }


  onExit = (e) => {
    console.log(e)
    this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 9 }));
    // localStorage.setItem("isFirstLogin", false);
    // this.sendCurrentStep()

  };

  onAfterChange = newStepIndex => {
    if (newStepIndex === 1) {
      const element = document.querySelector('#addpatient')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 6) {
      const element = document.querySelector('#deletepractitioner')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 7) {
      const element = document.querySelector('#viewpatient')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 9) {
      const element = document.querySelector('#help')

      if (!element) this.myRef.current.introJs.nextStep()
    }
  }
  sendCurrentStep = () => {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken?.userId == null ? 0 : userToken?.userId;
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Dashboard/GetAll";
    const url = apiroute + BE_OrganizationUser_UpdateTooltipSteps
    let data = JSON.stringify({
      userId: userId,
      step: this.state.currentStep,
      isComplete: !this.state.isSkipped,
      isSkip: this.state.isSkipped
    });
    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log("result", result);
        if (result.data.flag) {

          this.setState({

            loading: false,
          });
        } else {
          this.setState({ loading: false });
          // console.log(result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });




  }
  toggleSteps = () => {
    this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));
  };




  //modal close button event
  handleModalClose = () => {
    this.setState({
      modal: false,
      modalTitle: '',
      modalBody: ''
    });
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
    this.setState({ roleName: userToken.roleName });
    //console.log(rights);
    if (rights?.length > 0) {
      let currentrights = rights.filter(role => role.moduleId == 4);
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
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Practitioner/GetAllPaging'; // const url = apiroute + '/api/BE_Practitioner/GetAllPaging';
    const url = apiroute + BE_Practitioner_GetAllPaging // const url = apiroute + '/api/BE_Practitioner/GetAllPaging';

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
            pageCountNew: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            doctors: result.data.outdata, loading: false
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

  //pagination
  handleClick(e, index, currIndex) {
    this.setState({ loading: true });
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
        searchString: value.trim()
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
    // e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Practitioner/Delete?id=' + id + '&userId=' + userId + ''; // const url = apiroute + '/api/BE_Practitioner/Delete?id=' + id + '&userId=' + userId + '';
    const url = apiroute + BE_Practitioner_Delete(id, userId) // const url = apiroute + '/api/BE_Practitioner/Delete?id=' + id + '&userId=' + userId + '';

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
          toast.success(result.data.message);

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
        toast.error(error.message);
        this.setState({ authError: true, error: error, loading: false });
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
    // const url = apiroute + '/api/BE_CognitoMail/RegisterUser?id=' + id + '&uid=' + userId + ''; // const url = apiroute + '/api/BE_CognitoMail/RegisterUser?id=' + id + '&uid=' + userId + '';
    const url = apiroute + BE_CognitoMail_RegisterUser(id, userId)

    axiosInstance.post(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {
      if (result.data.flag) {
        this.getListData(0);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Success',
          // modalBody: result.data.message,
          loading: false
        });
        toast.success(result.data.message);
        //this.setState({
        //  employees: curremployees.filter(employee => employee.org_Id !== id)
        //});
      }
      else {
        this.getListData(0);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Success',
          // modalBody: result.data.message,
          loading: false
        });
        toast.success(result.data.message);

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

  //Approve IRB No
  ApproveIRBNo = (e, id) => {
    //e.preventDefault();
    //var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    //let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Practitioner/ApproveIRBNo?id=' + id + ''; //const url = apiroute + '/api/BE_Practitioner/ApproveIRBNo?id=' + id + '';
    const url = apiroute + BE_Practitioner_ApproveIRBNo(id)

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message
          }, this.getListData(0));
          toast.success(result.data.message);

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
        toast.error(error.message);
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  //Reject IRB No
  RejectIRBNo = (e, id) => {
    //e.preventDefault();
    //var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    //let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Practitioner/RejectIRBNo?id=' + id + ''; // const url = apiroute + '/api/BE_Practitioner/RejectIRBNo?id=' + id + '';
    const url = apiroute + BE_Practitioner_RejectIRBNo(id)

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message
          }, this.getListData(0));
          toast.success(result.data.message);

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
        toast.error(error.message);
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  //Approve IRB No
  SetDiscount = (e, id, isDiscount) => {
    //e.preventDefault();
    //var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    //let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Practitioner/SetDiscount?id=' + id + '&discount=' + isDiscount + '';    // const url = apiroute + '/api/BE_Practitioner/SetDiscount?id=' + id + '&discount=' + isDiscount + '';
    const url = apiroute + BE_Practitioner_SetDiscount(id, isDiscount)

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message
          }, this.getListData(0));
          toast.success(result.data.message);

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
        toast.error(error.message);
        this.setState({ authError: true, error: error, loading: false });
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

    const { loading, doctors, currentPage, currentIndex, pagesCount,
      pageSize, authError, error, roleName } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Steps
          enabled={this.state.stepsEnabled}
          steps={this.state.steps}
          initialStep={this.state.initialStep}
          onExit={this.onExit}
          onAfterChange={this.onAfterChange}
          ref={this.myRef}
          options={{
            hideNext: false, exitOnOverlayClick: false, skipLabel: "Skip",
            disableInteraction: true
          }}
          // onChange={function (e) { console.log(this.currentStep) }}
          onChange={(e) => {
            this.setState({ currentStep: e })
            console.log({ id: e?.id, e })
          }}

        />
        <button className="help" type="btn" id='help' onClick={() => { this.toggleSteps() }}>
          <i class="fa fa-question" aria-hidden="true"></i>
        </button>
        <Row className="mb-3">
          <Col xs="11" lg="11" >
            <h5 className="mt-2" id='pagetitle' style={{ width: "fit-content" }}><i className="fa fa-align-justify"></i> Practitioner List</h5>
          </Col>
          <Col xs="1" lg="1">
            {this.state.isEdit ?
              <Link to="/practitioners/details" id='addpatient'>
                <button className="btn btn-primary btn-block">Add</button>
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
                    <Input id='activeinactive' type="select" name="slDelete" onChange={this.handleChange}>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Input>
                  </Col>
                  <Col xs="4">
                  </Col>
                  <Col xs="6">
                    {
                      this.state.openSearch ? (
                        <div className="searchBox" id="searchbar">
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
                  <thead className="thead-light">
                    <tr>
                      <th>Practitioner Details</th>
                      {/* <th>Institution</th> */}
                      {/* {roleName == 'Neo Admin' || roleName == 'Admin' ?
                        <th>IRB No</th>
                        : null} */}
                      {this.state.isView ?
                        <th>Action</th>
                        : null}
                      {this.state.isView ?
                        <th>View</th>
                        : null}
                      {/* {this.state.isView ?
                        <th> Discount</th>
                        : null} */}
                      <th> Status</th>
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
                                {/* {console.log("data::", data)} */}
                                <b>
                                  {this.state.isView ?
                                    <Link id='practitionerdetails' className="anchorAccessNo" to={'/practitioners/info/' + data.practitionerId}>
                                      {data.firstName} {" " + data.middleName + " "} {" " + data.lastName + ""}
                                    </Link>
                                    : data.firstName + " " + data.middleName + " " + data.lastName + ""}</b>{" "}
                                {data.qualification}
                                <p><b>IRB No:</b>{!!data.irbNo ? data.irbNo : "Not available"}</p>

                                <hr />

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>

                                  <i className="fa fa-envelope fa-lg my-1" style={{ fontSize: "16px" }} />&nbsp; <a
                                    className='text-dark'
                                    href={`mailto: ${data.email}`}
                                  >{data.email}</a>&nbsp;
                                </div>
                                {data.mobile != "" && data.mobile != null ?
                                  <React.Fragment>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>

                                      <br />
                                      <i className="fa fa-mobile fa-2x my-1 " />&nbsp;
                                      <a
                                        className='text-dark'
                                        href={`phoneto: ${data.mobile}`}
                                      >   {data.mobile}</a>
                                    </div>
                                  </React.Fragment>
                                  :
                                  ""
                                }
                              </td>
                              {/* <td>
                                {data.instituteName == "" || data.instituteName == null ? "Not Assigned" : data.instituteName}
                              </td> */}
                              {/* {roleName == 'Neo Admin' || roleName == 'Admin' ?
                                <td>
                                  {data.irbNo ?
                                    <React.Fragment>
                                      {data.irbNo}
                                      <br />
                                      {data.irbStatus == "P" ?
                                        <React.Fragment>
                                          <Confirm title="Confirm" description="Are you sure want to approve IRB no?">
                                            {confirm => (
                                              <Link className="btn btn-success btn-sm btn-pill" to="#" onClick={confirm(e => this.ApproveIRBNo(e, data.practitionerId))}><b>Apprvoe</b></Link>
                                            )}
                                          </Confirm>{" "}
                                          <Confirm title="Confirm" description="Are you sure want to reject IRB no?">
                                            {confirm => (
                                              <Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={confirm(e => this.RejectIRBNo(e, data.practitionerId))}><b>Reject</b></Link>
                                            )}
                                          </Confirm>
                                        </React.Fragment>
                                        :
                                        (data.irbStatus == "A" ?
                                          <span className="badge badge-success btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Approved</span>
                                          :
                                          <span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Rejected</span>
                                        )
                                      }
                                    </React.Fragment>
                                    : null}
                                </td>
                                : null} */}
                              {/* {this.state.isEdit && this.state.isView ? */}
                              {true ?
                                <td>
                                  <div className='d-flex'>
                                    {/*<Link className="btn btn-success btn-sm btn-pill" to={'/practitioners/info/' + data.practitionerId}><b>View</b></Link>{" "}*/}
                                    {/* {this.state.isEdit ? */}
                                    {true ?
                                      <React.Fragment>
                                        <Link id='editdetails' className="btn btn-primary btn-sm btn-pill" to={'/practitioners/modify/' + data.practitionerId}><b>Edit</b></Link>{" "}
                                        {/* {console.log("isEdit",this.state.isEdit)} */}
                                        {this.state.isEdit ?

                                          <Confirm title="Confirm"
                                            description={`${data.isActive ? 'Are you sure you want to delete this Practitioner?' : 'Are you sure you want to recover this Practitioner?'}`}

                                          >
                                            {confirm => (
                                              <Link id='deletepractitioner' className="btn btn-danger btn-sm btn-pill ml-1" to="#" onClick={confirm(e => this.deleteRow(e, data.practitionerId))}>{data.isActive ? "Delete" : "Recover"}</Link>
                                            )}
                                          </Confirm> : null}
                                      </React.Fragment>
                                      : null}
                                  </div>
                                </td>
                                : null}
                              {this.state.isView ?
                                <td>
                                  <Link id='viewpatient' className="btn btn-dark btn-sm btn-pill" to={'/practitioners/patients/' + data.practitionerId}>Patients</Link>
                                </td>
                                : null}
                              {/* {this.state.isEdit && this.state.isView ?
                                <td>
                                  {this.state.isEdit ?
                                      (data.isDiscount ?
                                      <Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={e => this.SetDiscount(e, data.practitionerId, "n")}><b>No</b></Link>
                                      :
                                      <Link className="btn btn-success btn-sm btn-pill" to="#" onClick={e => this.SetDiscount(e, data.practitionerId, "y")}><b>Yes</b></Link>
                                    )
                                    : (data.isDiscount ? <span className="badge badge-success btn-pill">Yes</span> : <span className="badge badge-danger btn-pill">No</span>)}
                                </td>
                                : null} */}
                              <td id='statusoflab'>
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
                          <td colSpan="10" className="tdCenter">No practitioners.</td></tr>
                        // )) : (
                        // <tr>
                        //   <td colSpan="10" className="tdCenter">Loading...</td></tr>
                      )}
                  </tbody>
                </Table>
                {/* 
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
      </div>
    );
  }
}

export default List;
