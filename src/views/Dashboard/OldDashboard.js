import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink,
  Row, Table, Button, Input, FormGroup, Collapse, Fade
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Moment from 'moment';
import axiosInstance from "../../common/axiosInstance"

class OldDashboard extends Component {
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
      pageSize: 5,//window.$TotalRecord,
      authError: false,
      error: '',
      pcount: 0,
      prcount: 0,
      icount: 0,
      lcount: 0,
      mcount: 0,
      allPatientCount: 0,
      allPatient: [],
      anaDesignCount: 0,
      anaDesign: [],
      manuCount: 0,
      manu: [],
      treatmentCount: 0,
      filterType: "",
      isView: false,
      isEdit: false,
      roleName: '',
      collapse: false,
      fadeIn: true,
      timeout: 300,
      collapseId: 0,
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
        //pageSize: window.$TotalRecord,
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
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("dashboard"));
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
    const url = apiroute + '/api/BE_Dashboard/GetAllOld';

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: userId,
      pageNo: pageNo,
      totalNo: 5,//window.$TotalRecord,
    });

    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        // console.log(result);
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState({
            pagesCount: Math.ceil(result.data.totalRecord / 5),//window.$TotalRecord
            patients: rData.patintData,
            allPatient: rData.patintData.allPatientList,
            anaDesign: rData.patintData.analysisDesignList,
            manuCount: rData.patintData.manufacturingList,
            allPatientCount: rData.patintData.registeredCount, anaDesignCount: rData.patintData.anaDesignCount,
            manuCount: rData.patintData.manuCount, treatmentCount: rData.patintData.treatmentCount,
            pcount: rData.pcount, prcount: rData.prcount,
            icount: rData.icount, lcount: rData.lcount, mcount: rData.mcount, loading: false
          })
        }
        else {
          this.setState({ loading: false });
          // console.log(result.data.message);
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
      currentIndex: currIndex,
      loading: true
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
        //pageSize: window.$TotalRecord,
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
      //pageSize: window.$TotalRecord,
      slDelete: JSON.parse(value)
    }), function () { this.getListData(0); });
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

  filterType(ftype) {
    this.setState({ filterType: ftype });
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

    const { loading, patients, currentPage, currentIndex, pagesCount, pageSize, authError, error,
      pcount, prcount, icount, lcount, mcount, roleName, collapse, collapseId, anaDesign, manu,
      anaDesignCount, allPatientCount, manuCount, treatmentCount, allPatient, filterType } = this.state;


    return (
      <>
        <div className="animated fadeIn">
          {this.loader()}
          <Row>
            <Col xs="6" sm="4" lg="2">
              <Card className="text-white bg-primary">
                <CardBody>
                  <div className="text-value">{pcount}</div>
                  <div>Patients</div>
                </CardBody>
              </Card>
            </Col>

            <Col xs="6" sm="4" lg="2">
              <Card className="text-white bg-info">
                <CardBody>
                  <div className="text-value">{prcount}</div>
                  <div>Practitioners</div>
                </CardBody>
              </Card>
            </Col>

            <Col xs="6" sm="4" lg="2">
              <Card className="text-white bg-secondary">
                <CardBody>
                  <div className="text-value">{icount}</div>
                  <div>Institutions</div>
                </CardBody>
              </Card>
            </Col>

            <Col xs="6" sm="4" lg="2">
              <Card className="text-white bg-warning">
                <CardBody>
                  <div className="text-value">{lcount}</div>
                  <div>Laboratories</div>
                </CardBody>
              </Card>
            </Col>

            <Col xs="6" sm="4" lg="2">
              <Card className="text-white bg-danger">
                <CardBody>
                  <div className="text-value">{mcount}</div>
                  <div>Manufacturers</div>
                </CardBody>
              </Card>
            </Col>

            <Col xs="6" sm="4" lg="2">
              <Card className="text-white bg-success">
                <CardBody>
                  <div className="text-value">0</div>
                  <div>Shippers</div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
          </Row>
          <Row className="mb-3">
            <Col xs="10" lg="10">
              <h5 className="mt-2"><i className="fa fa-align-justify"></i> Patients</h5>
            </Col>
            <Col xs="2" lg="2">
              {this.state.isEdit ?
                <Link to="/patients/details">
                  <button className="btn btn-primary btn-block">Add New Patient</button>
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
                      {/*<Input type="select" name="slDelete" onChange={this.handleChange}>*/}
                      {/*  <option value="true">Active</option>*/}
                      {/*  <option value="false">Inactive</option>*/}
                      {/*</Input>*/}
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
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs="12" lg="12">
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
            </Col>

            {patients.length > 0 ? (
              patients
                .map((data, i) => {
                  return (
                    <Col xs="12" sm="12" md="12" key={i} style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(i)}>
                            <Row style={{ "fontSize": "16px" }}>
                              <Col md="2">
                                <b>
                                  {roleName == 'Neo Admin' || roleName == 'Admin' ?
                                    <React.Fragment>
                                      <span>{data.firstName + " " + (data.middleName != null && data.middleName != "" ? "(" + data.middleName + ")" : "") + data.lastName}</span>
                                      <br />
                                      {data.accessionNo == "" || data.accessionNo == null ?
                                        ""
                                        :
                                        <Link style={{ "color": "#FFC107" }} to={'/patientprofile/' + data.patientId + '/' + data.patientAccessionId}>{data.accessionNo.replace(/-/g, "")}</Link>
                                      }
                                    </React.Fragment>

                                    : (data.accessionNo == "" || data.accessionNo == null ?
                                      ""
                                      : <span style={{ "color": "#FFC107" }}><b>{data.accessionNo.replace(/-/g, "")}</b></span>
                                    )
                                  }</b>
                              </Col>
                              <Col md="4">

                                {data.currentStatus != null && data.currentStatus != "" ?
                                  <b>{data.currentStatus}</b>
                                  : ""}

                              </Col>
                              <Col md="3">
                                <b>
                                  {data.diseaseName != null && data.diseaseName != "" ?
                                    data.diseaseName
                                    : ""
                                  }
                                  <br />
                                  {data.diseaseCode != null && data.diseaseCode != "" ?
                                    "(" + data.diseaseCode + ")"
                                    : ""
                                  }
                                </b>
                              </Col>
                              <Col md="3">

                                {data.practionerName != null && data.practionerName != "" ?
                                  <b>{data.practionerName.includes("Dr.") ? data.practionerName : ("Dr. " + data.practionerName)}</b>
                                  : ""}

                              </Col>
                            </Row>
                          </CardHeader>
                          <Collapse isOpen={i == collapseId} id="collapseExample">
                            <CardBody>
                              <Row>
                                {data.ngsLaboratoryPatient.length > 0 ? (
                                  data.ngsLaboratoryPatient.map((ldata, l) => {
                                    return (
                                      data.ngsLaboratoryPatient.length < 2 ?
                                        <Col xs="12" sm="12" md="12">
                                          <h5 style={{ "color": "#427838" }}>{ldata.ngsLabName}</h5>

                                          <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                                            <thead className="dashborad-thead">
                                              <tr>
                                                <th>Date</th>
                                                <th>Activity</th>
                                              </tr>
                                            </thead>
                                            {ldata.ngsLaboratoryPaymentDashboard != null && ldata.ngsLaboratoryPaymentDashboard != "" ?
                                              <tbody>
                                                {ldata.ngsLaboratoryPaymentDashboard.invoiceSend == true ?
                                                  <tr>
                                                    <td>{Moment(ldata.ngsLaboratoryPaymentDashboard.invoiceSendDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                    <td>Invoice Send by Laboratory</td>
                                                  </tr>
                                                  : null}

                                                {ldata.ngsLaboratoryPaymentDashboard.poSend == true ?
                                                  <tr>
                                                    <td>{Moment(ldata.ngsLaboratoryPaymentDashboard.poSendDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                    <td>PO Send To Laboratory</td>
                                                  </tr>
                                                  : null}

                                                {ldata.ngsLaboratoryPaymentDashboard.paymentReqSend == true ?
                                                  <tr>
                                                    <td>{Moment(ldata.ngsLaboratoryPaymentDashboard.paymentReqDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                    <td>Payment Requested by Laboratory</td>
                                                  </tr>
                                                  : null}

                                                {ldata.ngsLaboratoryPaymentDashboard.isPaid == true ?
                                                  <tr>
                                                    <td>{Moment(ldata.ngsLaboratoryPaymentDashboard.paidDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                    <td>Paid to Laboratory by {ldata.ngsLaboratoryPaymentDashboard.paidBy}</td>
                                                  </tr>
                                                  : null}
                                              </tbody>
                                              :
                                              <tbody><tr><td colSpan="2">Invoice Pending</td></tr></tbody>}
                                          </Table>

                                          {ldata.ngsLaboratorySampleDashboard.length > 0 ?
                                            <React.Fragment>
                                              <hr />
                                              <h6>Analysis Activity</h6>
                                              <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                                                <thead className="dashborad-thead">
                                                  <tr>
                                                    {ldata.ngsLaboratorySampleDashboard.map((lsdata, ls) => {
                                                      return (
                                                        <th>{lsdata.sampleTypeName}
                                                          <br />
                                                          Assigned
                                                          {lsdata.sampleAssignedBy != null && lsdata.sampleAssignedBy != "" ? " By " + lsdata.sampleAssignedBy : ""} {lsdata.sampleAssignedDate != null && lsdata.sampleAssignedDate != "" ? "On " + Moment(lsdata.sampleAssignedDate, "YYYY-MM-DD").format('Do MMM YYYY') : ""}
                                                        </th>
                                                      )
                                                    })}
                                                  </tr>
                                                </thead>
                                                <tbody><tr>
                                                  {ldata.ngsLaboratorySampleDashboard.map((lsdata, ls) => {
                                                    return (
                                                      <td>
                                                        <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                                                          {lsdata.ngsLaboratoryPatientActivity.map((lsadata, lsa) => {
                                                            return (
                                                              (ldata.SampleTypeId == lsadata.SampleTypeId ?
                                                                <tbody>
                                                                  {lsadata.sampleDelivered == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.sampleDeliveredDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Sample Delivered By {lsadata.sampleDeliveredBy}</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.sampleReceived == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.sampleReceivedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Sample Received</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.sampleQCPassed == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.sampleQCPassedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Sample QC Passed</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.sampleQCFailed == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.sampleQCFailedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Sample QC Failed</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.newSampleRequested == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.newSampleRequestedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>New Sample Requested</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.analysisStarted == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.analysisStartedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Analysis Started</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.analysisCompleted == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.analysisCompletedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Analysis Completed</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.analysisQCPassed == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.analysisQCPassedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Analysis QC Passed</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.dataFileReady == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.dataFileReadyDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Data File Ready</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.analysisDataAndFileTransferred == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.fileTransferredDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Analysis Data And File Transferred</td>
                                                                    </tr>
                                                                    : null}
                                                                </tbody> : null)
                                                            )
                                                          })}
                                                        </Table>
                                                      </td>
                                                    )
                                                  })}
                                                </tr>
                                                </tbody>
                                              </Table>
                                            </React.Fragment>
                                            : null}
                                        </Col>
                                        :
                                        <Col xs="6" sm="6" md="6">
                                          <h5 style={{ "color": "#427838" }}>{ldata.ngsLabName}</h5>

                                          <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                                            <thead className="dashborad-thead">
                                              <tr>
                                                <th>Date</th>
                                                <th>Activity</th>
                                              </tr>
                                            </thead>
                                            {ldata.ngsLaboratoryPaymentDashboard != null && ldata.ngsLaboratoryPaymentDashboard != "" ?
                                              <tbody>
                                                {ldata.ngsLaboratoryPaymentDashboard.invoiceSend == true ?
                                                  <tr>
                                                    <td>{Moment(ldata.ngsLaboratoryPaymentDashboard.invoiceSendDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                    <td>Invoice Send by Laboratory</td>
                                                  </tr>
                                                  : null}

                                                {ldata.ngsLaboratoryPaymentDashboard.poSend == true ?
                                                  <tr>
                                                    <td>{Moment(ldata.ngsLaboratoryPaymentDashboard.poSendDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                    <td>PO Send To Laboratory</td>
                                                  </tr>
                                                  : null}

                                                {ldata.ngsLaboratoryPaymentDashboard.paymentReqSend == true ?
                                                  <tr>
                                                    <td>{Moment(ldata.ngsLaboratoryPaymentDashboard.paymentReqDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                    <td>Payment Requested by Laboratory</td>
                                                  </tr>
                                                  : null}

                                                {ldata.ngsLaboratoryPaymentDashboard.isPaid == true ?
                                                  <tr>
                                                    <td>{Moment(ldata.ngsLaboratoryPaymentDashboard.paidDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                    <td>Paid to Laboratory by {ldata.ngsLaboratoryPaymentDashboard.paidBy}</td>
                                                  </tr>
                                                  : null}
                                              </tbody>
                                              :
                                              <tbody><tr><td colSpan="2">Invoice Pending</td></tr></tbody>}
                                          </Table>

                                          {ldata.ngsLaboratorySampleDashboard.length > 0 ?
                                            <React.Fragment>
                                              <hr />
                                              <h6 style={{ "color": "#427838" }}>Analysis Activity</h6>
                                              <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                                                <thead className="dashborad-thead">
                                                  <tr>
                                                    {ldata.ngsLaboratorySampleDashboard.map((lsdata, ls) => {
                                                      return (
                                                        <th>{lsdata.sampleTypeName}
                                                          <br />
                                                          Assigned
                                                          {lsdata.sampleAssignedBy != null && lsdata.sampleAssignedBy != "" ? " By " + lsdata.sampleAssignedBy : ""} {lsdata.sampleAssignedDate != null && lsdata.sampleAssignedDate != "" ? "On " + Moment(lsdata.sampleAssignedDate, "YYYY-MM-DD").format('Do MMM YYYY') : ""}
                                                        </th>
                                                      )
                                                    })}
                                                  </tr>
                                                </thead>
                                                <tbody><tr>
                                                  {ldata.ngsLaboratorySampleDashboard.map((lsdata, ls) => {
                                                    return (
                                                      <td>
                                                        <Table>
                                                          {lsdata.ngsLaboratoryPatientActivity.map((lsadata, lsa) => {
                                                            return (
                                                              (ldata.SampleTypeId == lsadata.SampleTypeId ?
                                                                <tbody>
                                                                  {lsadata.sampleDelivered == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.sampleDeliveredDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Sample Delivered By {lsadata.sampleDeliveredBy}</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.sampleReceived == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.sampleReceivedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Sample Received</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.sampleQCPassed == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.sampleQCPassedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Sample QC Passed</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.sampleQCFailed == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.sampleQCFailedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Sample QC Failed</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.newSampleRequested == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.newSampleRequestedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>New Sample Requested</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.analysisStarted == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.analysisStartedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Analysis Started</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.analysisCompleted == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.analysisCompletedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Analysis Completed</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.analysisQCPassed == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.analysisQCPassedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Analysis QC Passed</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.dataFileReady == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.dataFileReadyDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Data File Ready</td>
                                                                    </tr>
                                                                    : null}

                                                                  {lsadata.analysisDataAndFileTransferred == true ?
                                                                    <tr>
                                                                      <td>{Moment(lsadata.fileTransferredDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                                                      <td>Analysis Data And File Transferred</td>
                                                                    </tr>
                                                                    : null}
                                                                </tbody> : null)
                                                            )
                                                          })}
                                                        </Table>
                                                      </td>
                                                    )
                                                  })}
                                                </tr>
                                                </tbody>
                                              </Table>
                                            </React.Fragment>
                                            : null}
                                        </Col>
                                    )
                                  })) :
                                  <Col xs="12" sm="12" md="12" style={{ "textAlign": "Center" }}>
                                    <h5 style={{ "color": "#427838" }}>Laboratory Not Assigned</h5>
                                  </Col>
                                }
                              </Row>
                              <br />
                              <Row>
                                {data.manufacturingActivity != null && data.manufacturingActivity != "" ? (
                                  <Col xs="6" sm="6" md="6">
                                    <h5 style={{ "color": "#427838" }}>{data.manufacturingActivity.manufacturerName}</h5>
                                    <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                                      <thead className="dashborad-thead">
                                        <tr>
                                          <th>Date</th>
                                          <th>Activity</th>
                                        </tr>
                                      </thead>

                                      {data.manufacturingActivity.ManufacturingPaymentDashboard != null &&
                                        data.manufacturingActivity.ManufacturingPaymentDashboard != "" ? (
                                        <tbody>
                                          {data.manufacturingActivity.ManufacturingPaymentDashboard.invoiceSend == true ?
                                            <tr>
                                              <td>{Moment(data.manufacturingActivity.ManufacturingPaymentDashboard.invoiceSendDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                              <td>Invoice Send by Manufacturer</td>
                                            </tr>
                                            : null}

                                          {data.manufacturingActivity.ManufacturingPaymentDashboard.poSend == true ?
                                            <tr>
                                              <td>{Moment(data.manufacturingActivity.ManufacturingPaymentDashboard.poSendDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                              <td>PO Send To Manufacturer</td>
                                            </tr>
                                            : null}

                                          {data.manufacturingActivity.ManufacturingPaymentDashboard.paymentReqSend == true ?
                                            <tr>
                                              <td>{Moment(data.manufacturingActivity.ManufacturingPaymentDashboard.paymentReqDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                              <td>Payment Requested by Manufacturer</td>
                                            </tr>
                                            : null}

                                          {data.manufacturingActivity.ManufacturingPaymentDashboard.isPaid == true ?
                                            <tr>
                                              <td>{Moment(data.manufacturingActivity.ManufacturingPaymentDashboard.paidDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                              <td>Paid to Manufacturer by {data.manufacturingActivity.ManufacturingPaymentDashboard.paidBy}</td>
                                            </tr>
                                            : null}

                                          {data.manufacturingActivity.designDelivered == true ?
                                            <tr>
                                              <td>{Moment(data.manufacturingActivity.designDeliveredDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                              <td>Design Delivered by {data.manufacturingActivity.designDeliveredBy}</td>
                                            </tr>
                                            : null}

                                          {data.manufacturingActivity.MfgStarted == true ?
                                            <tr>
                                              <td>{Moment(data.manufacturingActivity.MfgStarstattedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                              <td>Manufacturing Started </td>
                                            </tr>
                                            : null}

                                          {data.manufacturingActivity.MfgQcPassed == true ?
                                            <tr>
                                              <td>{Moment(data.manufacturingActivity.MfgQcPassedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                              <td>Manufacturing QC Passed</td>
                                            </tr>
                                            : null}

                                          {data.manufacturingActivity.MfgCompleted == true ?
                                            <tr>
                                              <td>{Moment(data.manufacturingActivity.MfgCompletedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                              <td>Manufacturing Completed</td>
                                            </tr>
                                            : null}

                                          {data.manufacturingActivity.MfgShipped == true ?
                                            <tr>
                                              <td>{Moment(data.manufacturingActivity.MfgShippedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                              <td>Shipped by Manufacturer</td>
                                            </tr>
                                            : null}

                                          {data.manufacturingActivity.MfgDelivered == true ?
                                            <tr>
                                              <td>{Moment(data.manufacturingActivity.MfgDeliveredDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                              <td>Delivered by Manufacturer</td>
                                            </tr>
                                            : null}
                                        </tbody>
                                      ) : <tbody>
                                        <tr>
                                          <td colSpan="2">Invoice Pending of Manufacturer</td>
                                        </tr>
                                      </tbody>}
                                    </Table>
                                  </Col>
                                ) :
                                  <Col xs="6" sm="6" md="6">
                                    <h5 style={{ "color": "#427838" }}>Manufacturer Not Assigned</h5>
                                  </Col>
                                }


                                <Col xs="6" sm="6" md="6">
                                  <h5 style={{ "color": "#427838" }}>Design Activity</h5>
                                  <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                                    <thead className="dashborad-thead">
                                      <tr>
                                        <th>Date</th>
                                        <th>Activity</th>
                                      </tr>
                                    </thead>

                                    {data.designActivity != null && data.designActivity != "" ?
                                      <tbody>
                                        {
                                          data.designActivity.designStarted == true ?
                                            <tr>
                                              <td>{Moment(data.designActivity.designStartedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                              <td>Design Started</td>
                                            </tr>
                                            : null
                                        }

                                        {data.designActivity.designCompleted ?
                                          <tr>
                                            <td>{Moment(data.designActivity.designCompletedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                            <td>Design Completed</td>
                                          </tr>
                                          : null}

                                        {data.designActivity.designFailed ?
                                          <tr>
                                            <td>{Moment(data.designActivity.designFailedDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                            <td>Design Failed<br />
                                              due to {data.designActivity.reason}                                                      </td>
                                          </tr>
                                          : null}

                                        {data.designActivity.designDeliveredToMfg ?
                                          <tr>
                                            <td>{Moment(data.designActivity.designDeliveredDate, "YYYY-MM-DD").format('Do MMM YYYY hh:mm A')}</td>
                                            <td>Design Delivered</td>
                                          </tr>
                                          : null}
                                      </tbody>
                                      :
                                      <tbody>
                                        <tr>
                                          <td colSpan="2">Design Activity Not Started Yet.</td>
                                        </tr>
                                      </tbody>
                                    }
                                  </Table>
                                </Col>

                              </Row>

                              <Row>
                                <Col xs="12" sm="12" md="12">
                                  <h5 style={{ "color": "#427838" }}>Operational Status</h5>
                                  <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                                    <thead className="dashborad-thead">
                                      <tr>
                                        <th>Date</th>
                                        <th>Activity</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {data.operationalActivity.length > 0 ? (
                                        data.operationalActivity.map((odata, o) => {
                                          return (
                                            <tr key={o}>
                                              <td>{Moment(odata.activityDate, "YYYY-MM-DD").format('Do MMM YYYY')}</td>
                                              <td>{odata.activityTitle}</td>
                                            </tr>
                                          )
                                        })) : null}
                                    </tbody>
                                  </Table>
                                </Col>
                              </Row>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>)
                })) : null}

          </Row>
        </div>
      </>
    )
  }
}

export default OldDashboard;
