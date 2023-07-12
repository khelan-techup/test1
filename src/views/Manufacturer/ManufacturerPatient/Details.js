import React, { Component } from 'react';
import {
  Button, Card, CardBody, CardFooter, Col, FormGroup, Table, Input, Row, Label, Nav,
  NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter, Badge
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { Multiselect } from 'multiselect-react-dropdown';
import Moment from 'moment';
import FilePreview from "react-file-preview-latest";
import downloadIcon from '../../../assets/download.svg';
import closeIcon from '../../../assets/x.svg';
import axiosInstance from "./../../../common/axiosInstance"

class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      activeTab: new Array(7).fill('1'),
      loading: true,
      patientId: 0,
      basicInfo: "",
      assignedpractitioner: "",
      assignedinstitute: "",
      assignedlaboratory: [],
      assignedmanufacture: "",
      diseases: "",
      diagnosticHistory: [],
      emergencyContact: [],
      insuranceDetail: [],
      prescription: [],
      treatmentReport: [],
      patientpayments: [],
      showdisease: false,
      preview: false,
      url: "",
      //milestones: [],
      //patientMilestoneId: '',
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      roleName: ''
      //options: [{name: 'Srigar', id: 1},{name: 'Sam', id: 2}]
    };
    this.state = this.initialState;
  }

  //modal close button event
  handleModalClose = () => {
    this.setState({
      modal: false,
      modalTitle: '',
      modalBody: ''
    });
    if (this.state.redirect) {
      this.props.history.push('/manufacturer/patients');
    }
  }

  toggleExpander = (e) => {
    const hiddenElement = e.currentTarget.nextSibling;
    hiddenElement.className.indexOf("collapse show") > -1 ? hiddenElement.classList.remove("show") : hiddenElement.classList.add("show");
  }

  //get detail
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    this.setState({ roleName: userToken.roleName });
    const param = this.props.match.params;

    if (param.id != undefined) {
      this.getData(param.id);
    }
    else {
      this.setState({ loading: false });
    }
  }

  //get detail(for update)
  getData = (id) => {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_Patient/GetById?id=' + id + '';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        // console.log(result);
        if (result.data.flag) {
          var rData = result.data.outdata;
          var pData = rData.patientData;
          this.setState({
            patientId: pData.patientId,
            basicInfo: pData,
            diseases: pData.patientDisease[0],
            diagnosticHistory: pData.patientDiagnosticHistory,
            emergencyContact: pData.patientEmergencyContacts,
            insuranceDetail: pData.patientInsuranceDetails,
            prescription: pData.patientPrescription,
            treatmentReport: pData.patientTreatmentReport,
            patientpayments: pData.patientPayment,

            assignedinstitute: pData.institutePatient,
            assignedlaboratory: pData.laboratoryPatient,
            assignedmanufacture: pData.manufacturerPatient,
            assignedpractitioner: pData.practitionerPatient,
            loading: false
          });
          // console.log(this.state);
        }
        else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
      });
  }


  //tab navigation
  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice()
    newArray[tabPane] = tab
    this.setState({
      activeTab: newArray,
    });
  }

  //file preview
  previewToggle(e, file) {
    this.setState({
      preview: !this.state.preview,
      url: file
    })
  }

  // onError = (err) => console.log("Error:", err); // Write your own logic
  onError = (err) => console.log(""); // Write your own logic

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

    const { loading, patientId,
      basicInfo, diseases, diagnosticHistory, emergencyContact, insuranceDetail,
      prescription, treatmentReport, patientpayments, preview, url,
      assignedpractitioner, assignedinstitute, assignedlaboratory, assignedmanufacture, roleName
    } = this.state;

    return (

      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Patient Details</h5>
            <h5 className="mt-2">{basicInfo.accessionNo != "" ? "[" + basicInfo.accessionNo.replace(/-/g, "") + "]" : ""}</h5>
          </Col>
          <Col xs="2" lg="2">
            <Link to="/manufacturer/list">
              <button className="btn btn-primary btn-block">Manufacturer</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            <React.Fragment>
              {roleName == 'Neo Admin' ?
                <Card>
                  <CardBody>
                    <FormGroup row>
                      <Col md="4">
                        <Col md="3" style={{ "maxWidth": "unset" }}> <Label>First Name:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.firstName != null ? (basicInfo.firstName) : ""}</span>
                        </Col>
                      </Col>
                      <Col md="4">
                        <Col md="3" style={{ "maxWidth": "unset" }}> <Label>Middle Name:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.middleName != null ? (basicInfo.middleName) : ""}</span>
                        </Col>
                      </Col>
                      <Col md="4">
                        <Col md="3" style={{ "maxWidth": "unset" }}> <Label>Last Name:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.lastName != null ? (basicInfo.lastName) : ""}</span>
                        </Col>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="4">
                        <Col md="3"> <Label>Email:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.email != null ? (basicInfo.email) : ""}</span>
                        </Col>
                      </Col>
                      <Col md="4">
                        <Col md="3"> <Label>Primary Phone:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.mobile != null ? (basicInfo.mobile) : ""}</span>
                        </Col>
                      </Col>
                      <Col md="4">
                        <Col md="3"> <Label>Secondary Phone:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.phoneNumber != null ? (basicInfo.phoneNumber) : ""}</span>
                        </Col>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="4">
                        <Col md="3" style={{ "maxWidth": "unset" }}> <Label>Country:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.oCountryName != null ? (basicInfo.oCountryName) : ""}</span>
                        </Col>
                      </Col>
                      <Col md="4">
                        <Col md="4"> <Label>Date of Birth:</Label> </Col>
                        <Col xs="12" md="8">
                          <span className="form-control">
                            {
                              basicInfo.dateOfBirth != null && basicInfo.dateOfBirth != "" ?
                                <React.Fragment>
                                  {Moment(basicInfo.dateOfBirth).format('MM/DD/YYYY')}
                                </React.Fragment>
                                : "NA"
                            }
                          </span>
                        </Col>
                      </Col>
                      <Col md="4">
                        <Col md="3"> <Label>Age:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.age != null && basicInfo.age != "" ? basicInfo.age : "0"}</span>
                        </Col>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="4">
                        <Col md="3"> <Label>Height:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.height != null ? (basicInfo.height) : ""}</span>
                        </Col>
                      </Col>
                      <Col md="4">
                        <Col md="3"> <Label>Weight:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.weight != null ? (basicInfo.weight) : ""}</span>
                        </Col>
                      </Col>
                      <Col md="4">
                        <Col md="3"> <Label>Sex:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.sex == "M" ? "Male" : basicInfo.sex == "F" ? "Female" : "-"}</span>
                        </Col>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="4">
                        <Col md="3"> <Label>Resident Country:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.countryName != null ? (basicInfo.countryName) : ""}</span>
                        </Col>
                      </Col>
                      <Col md="4">
                        <Col md="3"> <Label>Resident State:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.stateName != null ? (basicInfo.stateName) : ""}</span>
                        </Col>
                      </Col>
                      <Col md="4">
                        <Col md="3"> <Label>Resident City:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control">{basicInfo.cityName != null ? (basicInfo.cityName) : ""}</span>
                        </Col>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="12">
                        <Col md="3"> <Label>Resident Address:</Label> </Col>
                        <Col xs="12" md="9">
                          <span className="form-control" style={{ "height": "70px" }}>{basicInfo.address != null ? basicInfo.address + " - " + basicInfo.postalCode : "NA"}</span>
                        </Col>
                      </Col>
                    </FormGroup>
                  </CardBody>
                </Card>
                : null}
              <Card>
                <CardBody>
                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <h5 className="mt-2">Disease Details </h5>
                        {diseases != "" && diseases != null ? (
                          <span>{diseases.diseaseName + " (" + diseases.diseaseCode + ")"}</span>
                        ) : (
                          "Not Assigned"
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <h5 className="mt-2">Practitioner </h5>
                      </FormGroup>
                    </Col>
                    <Col xs="12">
                      <FormGroup>
                        {assignedpractitioner != "" && assignedpractitioner != null ? (
                          <React.Fragment>
                            <h6>Name</h6>
                            <span>{assignedpractitioner.firstName + " " + assignedpractitioner.lastName}</span>
                          </React.Fragment>
                        ) : (
                          "Not Assigned"
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <h5 className="mt-2">Institute </h5>
                      </FormGroup>
                    </Col>
                    {assignedinstitute != "" && assignedinstitute != null ? (
                      <React.Fragment>
                        <Col xs="4">
                          <FormGroup>
                            <h6>Name</h6>
                            <span>{assignedinstitute.instituteName}</span>
                          </FormGroup>
                        </Col>
                        <Col xs="4">
                          <FormGroup>
                            <h6>Email</h6>
                            <span>{assignedinstitute.instituteEmail}</span>
                          </FormGroup>
                        </Col>
                        <Col xs="4">
                          <FormGroup>
                            <h6>Phone</h6>
                            <span>{assignedinstitute.institutePhone}</span>
                          </FormGroup>
                        </Col>
                      </React.Fragment>
                    ) : (
                      <Col xs="12">
                        <FormGroup>
                          Not Assigned
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                  <hr />
                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <h5 className="mt-2">Laboratory </h5>
                      </FormGroup>
                    </Col>
                  </Row>
                  {assignedlaboratory.length > 0 ?
                    <Row>
                      <Col xs="4">
                        <FormGroup>
                          <h6>Name</h6>
                        </FormGroup>
                      </Col>
                      <Col xs="4">
                        <FormGroup>
                          <h6>Email</h6>
                        </FormGroup>
                      </Col>
                      <Col xs="4">
                        <FormGroup>
                          <h6>Phone</h6>
                        </FormGroup>
                      </Col>
                    </Row>
                    : null}

                  {assignedlaboratory.length > 0 ?
                    assignedlaboratory
                      .map((data, i) => {
                        return (
                          <Row>
                            <Col xs="4">
                              <FormGroup>
                                <span>{data.ngsLaboratoryName}</span>
                              </FormGroup>
                            </Col>
                            <Col xs="4">
                              <FormGroup>
                                <span>{data.ngsLaboratoryEmail}</span>
                              </FormGroup>
                            </Col>
                            <Col xs="4">
                              <FormGroup>
                                <span>{data.ngsLaboratoryPhone}</span>
                              </FormGroup>
                            </Col>
                          </Row>
                        )
                      }) : (
                      <Row>
                        <Col xs="12">
                          <span>Not Assigned</span>
                        </Col>
                      </Row>
                    )}
                  <hr />
                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <h5 className="mt-2">Manufacture </h5>
                      </FormGroup>
                    </Col>
                    {assignedmanufacture != "" && assignedmanufacture != null ? (
                      <React.Fragment>
                        <Col xs="4">
                          <FormGroup>
                            <h6>Name</h6>
                            <span>{assignedmanufacture.manufacturerName}</span>
                          </FormGroup>
                        </Col>
                        <Col xs="4">
                          <FormGroup>
                            <h6>Email</h6>
                            <span>{assignedmanufacture.manufacturerEmail}</span>
                          </FormGroup>
                        </Col>
                        <Col xs="4">
                          <FormGroup>
                            <h6>Phone</h6>
                            <span>{assignedmanufacture.manufacturerPhone}</span>
                          </FormGroup>
                        </Col>
                      </React.Fragment>
                    ) : (
                      <Col xs="12">
                        <FormGroup>
                          Not Assigned
                        </FormGroup>
                      </Col>
                    )}
                  </Row>
                </CardBody>
              </Card>

              {preview &&
                <>
                  <div className='preview-popup'>
                    <div className='preview-popup-modal'>
                      <div className='preview-popup-header'>
                        {url.split(".").splice(-1)[0] === "pdf" ? null :
                          <a href={url} download target={`_blank`}>
                            <img src={downloadIcon} style={{ margin: "0 12px", cursor: "pointer" }} alt='download' />
                          </a>
                        }
                        <img src={closeIcon} style={{ cursor: "pointer" }} alt='close' onClick={e => this.previewToggle(e, "")} />
                      </div>
                      <iframe src={url} title="previewFile" width="100%" height="90%" />
                      {/* <FilePreview
                          type={"url"}
                          width="100%"
                          url={url}
                          onError={this.onError}
                          style={{ borderRadius: 0 }}
                        /> */}
                    </div>
                  </div>
                </>
              }

              <Card>
                <CardBody>
                  <Col xs="12" md="12" className="mb-4">
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === '1'}
                          onClick={() => { this.toggle(0, '1'); }}
                        >
                          Diagnostics
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === '2'}
                          onClick={() => { this.toggle(0, '2'); }}
                        >
                          Medication
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === '3'}
                          onClick={() => { this.toggle(0, '3'); }}
                        >
                          Treatments/Visits
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === '4'}
                          onClick={() => { this.toggle(0, '4'); }}
                        >
                          Emergency Contacts
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === '5'}
                          onClick={() => { this.toggle(0, '5'); }}
                        >
                          Insurances
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === '6'}
                          onClick={() => { this.toggle(0, '6'); }}
                        >
                          Payments
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab[0]}>
                      <TabPane tabId="1">
                        <Table responsive bordered key="tblPDisease">
                          <thead className="thead-light">
                            <tr>
                              <th>Date</th>
                              <th>Analysis</th>
                              <th colSpan="2">Outcome</th>
                            </tr>
                          </thead>
                          <tbody>
                            {diagnosticHistory.length > 0 ? (
                              diagnosticHistory
                                .map((data, i) => {
                                  return (
                                    <React.Fragment>
                                      <tr key={i} onClick={this.toggleExpander}>
                                        <td>{Moment(data.diagnosticDate).format('MM/DD/YYYY')}</td>
                                        <td>{data.diagnosticAnalysis}</td>
                                        <td>{data.outcome}</td>
                                        <td className="tblexpand">
                                          {/* <img style={{ "width": "80%" }} src="../../assets/img/brand/direct-download.svg" alt="" title="View Files" /> */}
                                          <svg id="color" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m12 16c-.205 0-.401-.084-.542-.232l-5.25-5.5c-.456-.477-.117-1.268.542-1.268h2.75v-5.75c0-.689.561-1.25 1.25-1.25h2.5c.689 0 1.25.561 1.25 1.25v5.75h2.75c.659 0 .998.791.542 1.268l-5.25 5.5c-.141.148-.337.232-.542.232z" fill="#00bcd4" />
                                            <path d="m22.25 22h-20.5c-.965 0-1.75-.785-1.75-1.75v-.5c0-.965.785-1.75 1.75-1.75h20.5c.965 0 1.75.785 1.75 1.75v.5c0 .965-.785 1.75-1.75 1.75z" fill="#607d8b" />
                                            <path d="m12 2h-1.25c-.689 0-1.25.561-1.25 1.25v5.75h-2.75c-.659 0-.998.791-.542 1.268l5.25 5.5c.141.148.337.232.542.232z" fill="#00a4b9" />
                                            <path d="m12 18h-10.25c-.965 0-1.75.785-1.75 1.75v.5c0 .965.785 1.75 1.75 1.75h10.25z" fill="#546d79" />
                                          </svg>
                                        </td>
                                      </tr>
                                      <tr className="collapse" key={data.patientDiagnosticId}>
                                        <td colSpan="4">
                                          {data.patientDiagnosticHistoryFile.length > 0 ? (
                                            data.patientDiagnosticHistoryFile
                                              .map((dataFile, i) => {
                                                return (
                                                  <div key={dataFile.patientDiagnosticFileId} onClick={e => this.previewToggle(e, dataFile.filePath)}>
                                                    <a className="kt-widget4__title">
                                                      <i className="fa fa-download"></i>&nbsp;{dataFile.fileName}
                                                    </a>
                                                  </div>
                                                )
                                              })) : ("No files...")}
                                        </td>
                                      </tr>
                                    </React.Fragment>
                                  )
                                })) : (
                              <tr>
                                <td colSpan="3" className="tdCenter">No diagnostics found.</td></tr>
                            )
                            }
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="2">
                        <Table responsive bordered key="tblPPrescription">
                          <thead className="thead-light">
                            <tr>
                              <th>Medication Date</th>
                              <th colSpan="2">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescription.length > 0 ? (
                              prescription
                                .map((data, i) => {
                                  return (
                                    <React.Fragment>
                                      <tr key={i} onClick={this.toggleExpander}>
                                        <td>{Moment(data.prescribeDate).format('MM/DD/YYYY')}</td>
                                        <td>{data.prescriptionDescription}</td>
                                        <td className="tblexpand">
                                          {/* <img style={{ "width": "80%" }} src="../../assets/img/brand/direct-download.svg" alt="" title="View Files" /> */}
                                          <svg id="color" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m12 16c-.205 0-.401-.084-.542-.232l-5.25-5.5c-.456-.477-.117-1.268.542-1.268h2.75v-5.75c0-.689.561-1.25 1.25-1.25h2.5c.689 0 1.25.561 1.25 1.25v5.75h2.75c.659 0 .998.791.542 1.268l-5.25 5.5c-.141.148-.337.232-.542.232z" fill="#00bcd4" />
                                            <path d="m22.25 22h-20.5c-.965 0-1.75-.785-1.75-1.75v-.5c0-.965.785-1.75 1.75-1.75h20.5c.965 0 1.75.785 1.75 1.75v.5c0 .965-.785 1.75-1.75 1.75z" fill="#607d8b" />
                                            <path d="m12 2h-1.25c-.689 0-1.25.561-1.25 1.25v5.75h-2.75c-.659 0-.998.791-.542 1.268l5.25 5.5c.141.148.337.232.542.232z" fill="#00a4b9" />
                                            <path d="m12 18h-10.25c-.965 0-1.75.785-1.75 1.75v.5c0 .965.785 1.75 1.75 1.75h10.25z" fill="#546d79" />
                                          </svg>
                                        </td>
                                      </tr>
                                      <tr className="collapse" key={data.patientPrescriptionId}>
                                        <td colSpan="3">
                                          {data.patientPrescriptionFile.length > 0 ? (
                                            data.patientPrescriptionFile
                                              .map((dataFile, i) => {
                                                return (
                                                  <div key={dataFile.patientPrescriptionFileId} onClick={e => this.previewToggle(e, dataFile.filePath)}>
                                                    <a className="kt-widget4__title">
                                                      <i className="fa fa-download"></i>&nbsp;{dataFile.fileName}
                                                    </a>
                                                  </div>
                                                )
                                              })) : ("No files...")}
                                        </td>
                                      </tr>
                                    </React.Fragment>
                                  )
                                })) : (
                              <tr>
                                <td colSpan="2" className="tdCenter">No prescription found.</td></tr>
                            )
                            }
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="3">
                        <Table responsive bordered key="tblPTreatmentReport">
                          <thead className="thead-light">
                            <tr>
                              <th>Treatment Date</th>
                              <th>Detail</th>
                              <th colSpan="2">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {treatmentReport.length > 0 ? (
                              treatmentReport
                                .map((data, i) => {
                                  return (
                                    <React.Fragment>
                                      <tr key={i} onClick={this.toggleExpander}>
                                        <td>{Moment(data.treatmentDate).format('MM/DD/YYYY')}</td>
                                        <td>{data.treatmentDetail}</td>
                                        <td>{data.teatmentDescription}</td>
                                        <td className="tblexpand">
                                          {/* <img style={{ "width": "80%" }} src="../../assets/img/brand/direct-download.svg" alt="" title="View Files" /> */}
                                          <svg id="color" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m12 16c-.205 0-.401-.084-.542-.232l-5.25-5.5c-.456-.477-.117-1.268.542-1.268h2.75v-5.75c0-.689.561-1.25 1.25-1.25h2.5c.689 0 1.25.561 1.25 1.25v5.75h2.75c.659 0 .998.791.542 1.268l-5.25 5.5c-.141.148-.337.232-.542.232z" fill="#00bcd4" />
                                            <path d="m22.25 22h-20.5c-.965 0-1.75-.785-1.75-1.75v-.5c0-.965.785-1.75 1.75-1.75h20.5c.965 0 1.75.785 1.75 1.75v.5c0 .965-.785 1.75-1.75 1.75z" fill="#607d8b" />
                                            <path d="m12 2h-1.25c-.689 0-1.25.561-1.25 1.25v5.75h-2.75c-.659 0-.998.791-.542 1.268l5.25 5.5c.141.148.337.232.542.232z" fill="#00a4b9" />
                                            <path d="m12 18h-10.25c-.965 0-1.75.785-1.75 1.75v.5c0 .965.785 1.75 1.75 1.75h10.25z" fill="#546d79" />
                                          </svg>
                                        </td>
                                      </tr>
                                      <tr className="collapse" key={data.patientTreatmentReportId}>
                                        <td colSpan="4">
                                          {data.patientTreatmentReportFile.length > 0 ? (
                                            data.patientTreatmentReportFile
                                              .map((dataFile, i) => {
                                                return (
                                                  <div key={dataFile.patientTreatmentreportFileId} onClick={e => this.previewToggle(e, dataFile.filePath)}>
                                                    <a style={{ cursor: "pointer" }} className="kt-widget4__title">
                                                      <i className="fa fa-download"></i>&nbsp;{dataFile.fileName}
                                                    </a>
                                                  </div>
                                                )
                                              })) : ("No files...")}
                                        </td>
                                      </tr>
                                    </React.Fragment>
                                  )
                                })) : (
                              <tr>
                                <td colSpan="3" className="tdCenter">No treatment found.</td></tr>
                            )
                            }
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="4">
                        <Table responsive bordered key="tblPEmergenCnts">
                          <thead className="thead-light">
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Address</th>
                            </tr>
                          </thead>
                          <tbody>
                            {emergencyContact.length > 0 ? (
                              emergencyContact
                                .map((data, i) => {
                                  return (<tr key={i}>
                                    <td>{data.firstName + " " + data.lastName}</td>
                                    <td>{data.email}</td>
                                    <td>{data.mobile} <br />{data.phoneNumber}</td>
                                    <td>{data.address + " - " + data.postalCode}</td>
                                  </tr>
                                  )
                                })) : (
                              <tr>
                                <td colSpan="4" className="tdCenter">No emergency contacts found.</td></tr>
                            )
                            }
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="5">
                        <Table responsive bordered key="tblPInsurance">
                          <thead className="thead-light">
                            <tr>
                              <th>Insurance Company</th>
                              <th>Policy Number</th>
                              <th>Health Plan</th>
                              <th>Member ID</th>
                              <th>Group Number</th>
                              <th>Phone</th>
                              <th>Address</th>
                            </tr>
                          </thead>
                          <tbody>
                            {insuranceDetail.length > 0 ? (
                              insuranceDetail
                                .map((data, i) => {
                                  return (<tr key={i}>
                                    <td>{data.insuranceCompany}</td>
                                    <td>{data.policyNumber}</td>
                                    <td>{data.healthPlan}</td>
                                    <td>{data.memberID}</td>
                                    <td>{data.groupNumber}</td>
                                    <td>{data.phoneNumber}</td>
                                    <td>{data.address}</td>
                                  </tr>
                                  )
                                })) : (
                              <tr>
                                <td colSpan="7" className="tdCenter">No insurance detail found.</td></tr>
                            )
                            }
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="6">
                        <Table responsive bordered key="tblPPayament">
                          <thead className="thead-light">
                            <tr>
                              <th>Milestone</th>
                              <th>Transaction</th>
                              <th>Amount</th>
                              <th>Remark</th>
                              <th>Payment By</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patientpayments.length > 0 ? (
                              patientpayments
                                .map((data, i) => {
                                  return (<tr key={i}>
                                    <td>{data.paymentMilestone}</td>
                                    <td>{Moment(data.transactionDate).format('DD MMM YYYY')}<br />{data.transactionId}</td>
                                    <td>{data.transactionAmount}</td>
                                    <td>{data.remark}</td>
                                    <td>{data.userType != 1 ? data.userType != 2 ? "Institution" : "Practitioner" : "Patient"}</td>
                                    <td><Badge color="success">{data.transactionStatus}</Badge></td>
                                  </tr>
                                  )
                                })) : (
                              <tr>
                                <td colSpan="6" className="tdCenter">No payment transactions found.</td></tr>
                            )
                            }
                          </tbody>
                        </Table>
                      </TabPane>
                    </TabContent>
                  </Col>
                </CardBody>
              </Card>
            </React.Fragment>

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

export default Details;
