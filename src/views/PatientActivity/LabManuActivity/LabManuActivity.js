import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row,
  Table, Button, Input, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter, Collapse, Fade
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import axiosInstance from "../../../common/axiosInstance"

class DesignActivity extends Component {
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
      }), function () { this.getActivityData(0); });
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
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("lab and manu activity"));
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          this.getActivityData(0);
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
  getActivityData(pageNo) {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_LabManuActivity/GetAllPaging';

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: 0,
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

  //pagination
  handleClick(e, index, currIndex) {
    e.preventDefault();
    var pgcount = this.state.pagesCount - 1;
    var pgCurr = (index >= pgcount ? pgcount : index);
    this.setState({
      currentPage: pgCurr,
      currentIndex: currIndex
    }, function () { this.getActivityData(pgCurr); });
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
      }), function () { this.getActivityData(0); });
    }
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

    const { loading, patients, currentPage, currentIndex, pagesCount, pageSize, authError,
      error, roleName, collapseId } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Laboratory and Manufacturer Activity</h5>
          </Col>
          <Col xs="2" lg="2">

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
                    patients
                      //.slice(
                      //  currentPage * pageSize,
                      //  (currentPage + 1) * pageSize
                      //)
                      .map((data, i) => {
                        return (
                          <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem", "margin-top": "20px " }}>
                            <Card style={{ "border": "1px solid #1C3A84" }}>
                              <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white" }} >
                                <Row style={{ "fontSize": "16px" }} key={i} onClick={() => this.setCollapse(i)}>
                                  <Col md="6">
                                    <b>
                                      {/*<Link from='/' to={'/patientprofile/' + data.patientId}><b>{data.accessionNo == "" || data.accessionNo == null ? "Not Available" : data.accessionNo}</b></Link>
                                <Link from='/' to={'/patients/info/' + data.patientId}><b>{data.accessionNo == "" || data.accessionNo == null ? "Not Available" : data.accessionNo}</b></Link>*/}
                                      {roleName == 'Neo Admin' || roleName == 'Admin' ?
                                        <React.Fragment>
                                          <span>{data.patientName}</span>
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
                                      <Table responsive bordered key="tblpatients">
                                        <thead>
                                          <tr>
                                            <th>Accession No</th>
                                            {this.state.isEdit || this.state.isView ?
                                              <React.Fragment>
                                                <th>Laboratory Activity</th>
                                                <th>Manufacturer Activity</th>
                                              </React.Fragment>
                                              : null}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {
                                            data.patientAccessionMappings.map((adata, index) =>
                                            (<tr>
                                              <td>
                                                <b>

                                                  {roleName == 'Neo Admin' || roleName == 'Admin' ?
                                                    <React.Fragment>
                                                      {adata.accessionNo == "" || adata.accessionNo == null ?
                                                        "Not Available"
                                                        :
                                                        <Link className="anchorAccessNo" to={'/patientprofile/' + adata.patientId + '/' + adata.patientAccessionId}>{adata.accessionNo.replace(/-/g, "")}</Link>
                                                      }
                                                    </React.Fragment>
                                                    : (adata.accessionNo == "" || adata.accessionNo == null ?
                                                      "Not Available"
                                                      : <span className="anchorAccessNo"><b>{adata.accessionNo.replace(/-/g, "")}</b></span>
                                                    )
                                                  }
                                                </b></td>
                                              {this.state.isEdit || this.state.isView ?
                                                <React.Fragment>
                                                  {this.state.isView ?
                                                    <td>
                                                      {adata.labManuActivities.labStatus == "View" ?
                                                        <Link className="btn btn-info btn-sm btn-pill" to={'/patientactivity/ngslaboratory/activity/' + adata.patientAccessionId}><b>View</b></Link>
                                                        :
                                                        adata.labManuActivities.labStatus == "Pending" ?
                                                          <span className="badge badge-Info" style={{ "padding": "8px", "color": "#fff", "backgroundColor": "#73818f" }}>{adata.labManuActivities.labStatus}</span>
                                                          :
                                                          adata.labManuActivities.labStatus == "Patient Payment Pending" ?
                                                            <span className="badge badge-warning" style={{ "padding": "8px", "color": "#fff" }}>{adata.labManuActivities.labStatus}</span>
                                                            :
                                                            <span className="badge badge-danger" style={{ "padding": "8px", "color": "#fff" }}>{adata.labManuActivities.labStatus}</span>
                                                      }
                                                    </td>
                                                    : null}
                                                  {this.state.isView ?
                                                    <td>
                                                      {adata.labManuActivities.manuStatus == "View" ?
                                                        <Link className="btn btn-info btn-sm btn-pill" to={'/patientactivity/manufacturer/activity/' + adata.patientAccessionId}><b>View</b></Link>
                                                        :
                                                        adata.labManuActivities.manuStatus == "Pending" ?
                                                          <span className="badge badge-Info" style={{ "padding": "8px", "color": "#fff", "backgroundColor": "#73818f" }}>{adata.labManuActivities.manuStatus}</span>
                                                          :
                                                          adata.labManuActivities.manuStatus == "Patient Payment Pending" ?
                                                            <span className="badge badge-warning" style={{ "padding": "8px", "color": "#fff" }}>{adata.labManuActivities.manuStatus}</span>
                                                            :
                                                            <span className="badge badge-danger" style={{ "padding": "8px", "color": "#fff" }}>{adata.labManuActivities.manuStatus}</span>
                                                      }

                                                    </td>
                                                    : null}
                                                </React.Fragment>
                                                : null}
                                            </tr>))}
                                        </tbody>
                                      </Table>
                                    </Row>
                                  </CardBody>
                                </Collapse>
                              </Fade>
                            </Card>
                          </Col>);
                      })) : (
                    <Table><tr>
                      <td colSpan="4" className="tdCenter">No activities...</td></tr></Table>
                    // )) : (
                    // <Table><tr>
                    //   <td colSpan="4" className="tdCenter">Loading...</td></tr></Table>
                  )}
                {/*new design ends*/}
                {/*{authError ? <p>{error.message}</p> : null}*/}
                {/*<Table responsive bordered key="tblpatients">*/}
                {/*  <thead>*/}
                {/*    <tr>*/}
                {/*      <th>Accession No</th>*/}
                {/*      {this.state.isEdit || this.state.isView ?*/}
                {/*        <React.Fragment>*/}
                {/*          <th>Laboratory Activity</th>*/}
                {/*          <th>Manufacturer Activity</th>*/}
                {/*        </React.Fragment>*/}
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
                {/*                  */}{/*<Link from='/' to={'/patientprofile/' + data.patientId}><b>{data.accessionNo == "" || data.accessionNo == null ? "Not Available" : data.accessionNo}</b></Link>*/}{/*
                */}{/*                <Link from='/' to={'/patients/info/' + data.patientId}><b>{data.accessionNo == "" || data.accessionNo == null ? "Not Available" : data.accessionNo}</b></Link>*/}
                {/*                  {roleName == 'Neo Admin' || roleName == 'Admin' ?*/}
                {/*                    <React.Fragment>*/}
                {/*                      <span>{data.patientName}</span>*/}
                {/*                      <br />*/}
                {/*                      {data.accessionNo == "" || data.accessionNo == null ?*/}
                {/*                        "Not Available"*/}
                {/*                        :*/}
                {/*                        //<Link to={'/patientprofile/' + data.patientId}>{data.accessionNo}</Link>*/}
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
                {/*              {this.state.isEdit || this.state.isView ?*/}
                {/*                <React.Fragment>*/}
                {/*                  {this.state.isView ?*/}
                {/*                    <td>*/}
                {/*                      {data.labStatus == "View" ?*/}
                {/*                        <Link className="btn btn-info btn-sm btn-pill" to={'/patientactivity/ngslaboratory/activity/' + data.patientId}><b>View</b></Link>*/}
                {/*                        :*/}
                {/*                        data.labStatus == "Pending" ?*/}
                {/*                          <span className="badge badge-Info" style={{ "padding": "8px", "color": "#fff" }}>{data.labStatus}</span>*/}
                {/*                          :*/}
                {/*                          data.labStatus == "Patient Payment Pending" ?*/}
                {/*                            <span className="badge badge-warning" style={{ "padding": "8px", "color": "#fff" }}>{data.labStatus}</span>*/}
                {/*                            :*/}
                {/*                            <span className="badge badge-danger" style={{ "padding": "8px", "color": "#fff" }}>{data.labStatus}</span>*/}
                {/*                      }*/}
                {/*                    </td>*/}
                {/*                    : null}*/}
                {/*                  {this.state.isView ?*/}
                {/*                    <td>*/}
                {/*                      {data.manuStatus == "View" ?*/}
                {/*                        <Link className="btn btn-info btn-sm btn-pill" to={'/patientactivity/manufacturer/activity/' + data.patientId}><b>View</b></Link>*/}
                {/*                        :*/}
                {/*                        data.manuStatus == "Pending" ?*/}
                {/*                          <span className="badge badge-Info" style={{ "padding": "8px", "color": "#fff" }}>{data.manuStatus}</span>*/}
                {/*                          :*/}
                {/*                          data.manuStatus == "Patient Payment Pending" ?*/}
                {/*                            <span className="badge badge-warning" style={{ "padding": "8px", "color": "#fff" }}>{data.manuStatus}</span>*/}
                {/*                            :*/}
                {/*                            <span className="badge badge-danger" style={{ "padding": "8px", "color": "#fff" }}>{data.manuStatus}</span>*/}
                {/*                      }*/}

                {/*                    </td>*/}
                {/*                    : null}*/}
                {/*                </React.Fragment>*/}
                {/*                : null}*/}
                {/*            </tr>);*/}
                {/*          })*/}
                {/*      ) : (*/}
                {/*        <tr>*/}
                {/*          <td colSpan="4" className="tdCenter">No activities...</td></tr>*/}
                {/*      )) : (*/}
                {/*      <tr>*/}
                {/*        <td colSpan="4" className="tdCenter">Loading...</td></tr>*/}
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
      </div>
    );
  }
}

export default DesignActivity;
