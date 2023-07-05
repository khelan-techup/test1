import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row,
  Table, Button, Input, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter, Collapse, Fade
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import Moment from 'moment';
import { toast } from 'react-toastify';
import downloadIcon from '../../../assets/download.svg';
import closeIcon from '../../../assets/x.svg';
import axiosInstance from "../../../common/axiosInstance"

class DesignPatientActivity extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      openSearch: true,
      PatientId: 0,
      PatientAccessionId: 0,
      PatientName: "",
      PatientAccessionNo: "",
      designpatientactivitys: [],
      searchString: '',
      slDelete: true,
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      pageSize: 5,
      authError: false,
      error: '',
      modal: false,
      modalTitle: '',
      modalBody: '',
      isView: false,
      isEdit: false,
      loginUser: '',
      collapse: true,
      fadeIn: true,
      timeout: 300,
      preview: false,
      url: "",
      fileName: ""
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
        //pageSize: 5,
        searchString: ''
      }), function () { this.getDesignPatientActivityData(this.state.PatientAccessionId, 0); });
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
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("design activity"));
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          const param = this.props.match.params;
          if (param.id != undefined) {
            this.setState({ PatientAccessionId: param.id });
            this.getDesignPatientActivityData(param.id, 0);
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
    else {
      this.setState({ loading: false });
    }
  }

  //get data
  getDesignPatientActivityData(pid, pageNo) {
    //alert(pid)
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/DesignPatientActivity/getDesignPatientActivitysbyPatientIdPaging';

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: parseInt(pid),
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
          //if (result.data.outdata.length > 0) {
          //  this.setState({
          //    PatientName: result.data.outdata[0].patientName,
          //    PatientAccessionNo: result.data.outdata[0].patientAccessionNo,
          //  })
          //}
          this.setState({ pagesCount: Math.ceil(result.data.totalRecord / 5) });
          this.setState({
            designpatientactivitys: result.data.outdata.patientactivity,
            PatientName: result.data.outdata.patientName,
            PatientAccessionNo: result.data.outdata.accessionNo,
            loginUser: userId, loading: false
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
    }, function () { this.getDesignPatientActivityData(this.state.PatientAccessionId, pgCurr); });
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
        //pageSize: 5,
        searchString: value
      }), function () { this.getDesignPatientActivityData(this.state.PatientAccessionId, 0); });
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
  //    pageSize: 5,
  //    slDelete: JSON.parse(value)
  //  }), function () { this.getDesignPatientActivityData(); });
  //}

  //delete(active/inactive) button click
  deleteRow(e, id) {
    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/DesignPatientActivity/Delete?id=' + id + '&userId=' + userId + '';

    axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {
      if (result.data.flag) {
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Success',
        //   modalBody: result.data.message,
        // });
        toast.success(result.data.message)
        //this.setState({
        //  employees: curremployees.filter(employee => employee.org_Id !== id)
        //});
        this.getDesignPatientActivityData(this.state.PatientAccessionId, 0);
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

  //download
  DownloadFile(e, filepath, filename) {
    //alert(filepath);
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    axiosInstance({
      url: apiroute + '/api/CognitoUserStore/downloadFile?fileName=' + filepath + '',
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      // console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      this.setState({ loading: false });
    }).catch(error => {
      // console.log(error);
      this.setState({ loading: false });
    });

  }

  //file preview
  previewToggle(e, path, name) {
    this.setState({
      preview: !this.state.preview,
      url: window.$FileUrl + path,
      fileName: name
    })
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

    const { loading, PatientId, designpatientactivitys, currentPage, currentIndex, pagesCount, pageSize, authError,
      error, loginUser, PatientName, PatientAccessionNo, PatientAccessionId, preview, url, fileName } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Patient Design Activity
            </h5>
            <h5 className="mt-2">{PatientName} &nbsp; {PatientAccessionNo != "" && PatientAccessionNo != null ? "(" + PatientAccessionNo.replace(/-/g, "") + ")" : ""}</h5>
          </Col>
          <Col xs="2" lg="2">
            {this.state.isEdit ?
              <Link to={'/patientactivity/designactivities/detail/' + PatientAccessionId}>
                <button className="btn btn-primary btn-block">Add New Activity</button>
              </Link>
              : null}
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col xs="6">

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
                  //employees.map(function (data,i) {
                  designpatientactivitys.length > 0 ? (
                    designpatientactivitys
                      //.slice(
                      //  currentPage * pageSize,
                      //  (currentPage + 1) * pageSize
                      //)
                      .map((data, i) => {
                        return (
                          <Col xs="12" sm="12" md="12">
                            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                              <Card>
                                <CardHeader>
                                  <b>{data.subject}</b>
                                  {this.state.isEdit ?
                                    (data.userId == loginUser ?
                                      <div className="card-header-actions">
                                        &nbsp;&nbsp; |
                                        {/*<Link className="card-header-action btn btn-close mb-1" to="#" onClick={e => this.deleteRow(e, data.patientId)}><i className="icon-trash"></i></Link>{"   "}*/}
                                        <Link className="card-header-action btn btn-setting mb-1" to={'/patientactivity/designactivities/modify/' + data.patientAccessionId + '/' + data.designPatientActivityId}><i className="icon-pencil"></i></Link>
                                      </div>
                                      : null) : null}
                                  <div className="card-header-actions">
                                    {data.userName + ", " + Moment(data.createdDate).format('DD MMM YYYY') + ", " + Moment(data.createdDate).format('HH:MM A') + "(" + Moment(data.createdDate).fromNow() + ")"}
                                  </div>
                                </CardHeader>
                                <Collapse isOpen={this.state.collapse} id="collapseExample">
                                  <CardBody>
                                    {/*<Row>
                                      <Col xs="6" sm="6" md="6">
                                        <b>{data.patientName} &nbsp; {"(" + data.patientAccessionNo + ")"}</b>
                                      </Col>
                                    </Row>
                                    <br />
                                    */}
                                    <Row>
                                      <Col xs="12" sm="12" md="12">
                                        {data.purpose}
                                      </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                      {data.designPatientActivityFile.length > 0 ?
                                        data.designPatientActivityFile.map((fdata, i) => {
                                          return (
                                            <Col xs="4" sm="4" md="4">
                                              <a style={{ "cursor": "pointer", "color": "#1C3A84" }} onClick={e => this.previewToggle(e, fdata.filePath, fdata.fileName)}><span><i className='fa fa-download'></i> {fdata.fileName}</span></a>
                                              {/*<a href={fdata.filePath} download><span><i className='fa fa-download'></i> {fdata.fileName}</span></a>*/}
                                            </Col>
                                          )
                                        })
                                        :
                                        <Col xs="12" sm="12" md="12">
                                          No Files
                                        </Col>
                                      }
                                    </Row>
                                    {/*
                                     * <Row>
                                      <Col xs="6" sm="6" md="6">
                                      </Col>
                                      <Col xs="6" sm="6" md="6" style={{ "textAlign": "right" }}>
                                        <b>Added By: {data.userName}<br />{Moment(data.createdDate).format('DD MMM YYYY')}</b>
                                      </Col>
                                    </Row>
                                    */}
                                  </CardBody>
                                </Collapse>
                              </Card>
                            </Fade>
                          </Col>
                        );
                      })
                  ) : (
                    <Col xs="12" sm="12" md="12" className="tdCenter">
                      <span> No Record...</span>
                    </Col>
                    // )) : (
                    // <Col xs="12" sm="12" md="12" className="tdCenter">
                    //   <span> Loading...</span>
                    // </Col>
                  )}

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
        {preview &&
          <>
            <div className='preview-popup'>
              <div className='preview-popup-modal'>
                <div className='preview-popup-header'>
                  {url.split(".").splice(-1)[0] === "pdf" ? null :
                    // <a href={url} download target={`_blank`}>
                    <img src={downloadIcon} style={{ margin: "0 12px", cursor: "pointer" }} alt='download'
                      onClick={e => this.DownloadFile(e, url.split("/").filter((obj, index) => index > 2).join("/"), fileName)} />
                    // </a>
                  }
                  <img src={closeIcon} style={{ cursor: "pointer" }} alt='close' onClick={e => this.previewToggle(e, "", "")} />
                </div>
                <iframe src={url} title="previewFile" width="100%" height="90%" />
              </div>
            </div>
          </>
        }
      </div>
    );
  }
}

export default DesignPatientActivity;
