import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row,
  Table, Button, Input, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter, Form
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import downloadIcon from '../../../assets/download.svg';
import closeIcon from '../../../assets/x.svg';
import axiosInstance from "../../../common/axiosInstance"

class PMRApprove extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      PatientId: 0,
      PatientAccessionId: 0,
      UserId: 0,
      PatientAccessionNo: "",
      Note: "",
      Version: "",
      PMRFilePath: "",
      RevisedReason: "",
      IsReject: false,
      IsVerified: false,
      IsApproved: false,
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      show: false,
      errors: {
        RevisedReason: ''
      },
      preview: false,
      url: "",
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
  }

  componentDidMount() {
    localStorage.removeItem('redirectPath');

    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);
    this.setState({ UserId: userId });

    const param = this.props.match.params;
    if (param.id != undefined) {
      this.setState({ PatientAccessionId: param.id });
      this.getData(param.id);
    } else {
      this.setState({ loading: false });
    }
  }

  getData(pid) {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PMRReportForUser/GetByPatientId?id=' + pid;

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          // console.log(result.data.outdata);
          this.setState({
            PatientId: result.data.outdata.patientId,
            Version: result.data.outdata.pmrCurrentVersion,
            PatientAccessionNo: result.data.outdata.accessionNo,
            PMRFilePath: result.data.outdata.pmrReportPath,
            Note: result.data.outdata.Notes,
            IsVerified: result.data.outdata.pmrVerified,
            IsApproved: result.data.outdata.pmrApprove,
            loading: false
          });
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

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    let errors = this.state.errors;

    switch (name) {
      case 'RevisedReason':
        errors.RevisedReason = (!value) ? 'This field is required.' : ''
        break;
      default:
        //(!value) ? '' :'This field is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => {

    })
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.RevisedReason == undefined || this.state.RevisedReason == '') {
      errors.RevisedReason = 'This field is required.';
    }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    let url = apiroute + '/api/BE_PMRReportForUser/RejectPMR';

    if (this.validateForm(this.state.errors)) {

      let data = JSON.stringify({
        PatientId: parseInt(this.state.PatientId),
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
        UserId: parseInt(this.state.UserId),
        PMRCurrentVersion: this.state.Version,
        RevisedReason: this.state.RevisedReason,
        PMRReportPath: this.state.PMRFilePath,
        Notes: this.state.Note
      })

      // console.log(data);
      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(result => {
        if (result.data.flag) {
          //console.log(result.data.outdata);
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            redirect: true,
            loading: false
          }, this.getData(this.state.PatientId));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false
          });
          toast.error(result.data.message)
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
          //this.setState({ authError: true, error: error });
        });
    }
    else {
      this.setState({ loading: false });
    }
  }

  handleApproveSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    let url = apiroute + '/api/BE_PMRReportForUser/ApprovePMR';

    let data = JSON.stringify({
      PatientId: parseInt(this.state.PatientId),
      PatientAccessionId: parseInt(this.state.PatientAccessionId),
      UserId: parseInt(this.state.UserId),
      PMRCurrentVersion: this.state.Version,
      PMRReportPath: this.state.PMRFilePath,
      RevisedReason: "",
      Notes: this.state.Note
    })

    // console.log(data);
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {
      if (result.data.flag) {
        //console.log(result.data.outdata);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Success',
          // modalBody: result.data.message,
          redirect: true,
          loading: false
        }, this.getData(this.state.PatientId));
        toast.success(result.data.message)
      }
      else {
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: result.data.message,
          loading: false
        });
        toast.error(result.data.message)
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
        //this.setState({ authError: true, error: error });
      });
  }

  handleRejectSubmit(e) {
    e.preventDefault();
    this.setState({ IsReject: true });
  }

  //download
  DownloadFile(e, filepath) {
    //alert(filename);
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    axiosInstance({
      url: apiroute + '/api/CognitoUserStore/downloadFile?fileName=' + filepath + '',
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      // console.log(response);
      var fname = filepath.substring(filepath.lastIndexOf('/') + 1);
      //alert(fname);
      var fext = fname.substring(fname.lastIndexOf('.'));
      //alert(fext);
      var filename = fname + fext;
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
  previewToggle(e, path) {
    this.setState({
      preview: !this.state.preview,
      url: window.$FileUrl + path,
    })
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin">
      </div>;
    }
  }

  render() {
    //if (localStorage.getItem('AUserToken') == null) {
    //  return <Redirect to="/login" />
    //}

    const { loading, PatientId, UserId, PatientAccessionNo, Note, Version, PMRFilePath,
      RevisedReason, IsReject, IsApproved, IsVerified, errors, preview, url } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> PMR Approve</h5>
            <h5 className="mt-2">{PatientAccessionNo != "" && PatientAccessionNo != null ? "(" + PatientAccessionNo.replace(/-/g, "") + ")" : ""}</h5>
          </Col>
          <Col xs="2" lg="2" style={{ "textAlign": "right" }}>
            {
              IsVerified && !IsApproved ?
                null
                :
                (IsApproved ?
                  <span className="badge badge-success" style={{ "padding": "10px", "fontSize": "14px", "color": "#fff", "marginTop": "20px" }}>Approved</span>
                  :
                  (IsVerified ?
                    <span className="badge badge-warning" style={{ "padding": "10px", "fontSize": "14px", "color": "#fff", "marginTop": "20px" }}>Verified</span>
                    :
                    <span className="badge badge-danger" style={{ "padding": "10px", "fontSize": "14px", "color": "#fff", "marginTop": "20px" }}>Verification Pending</span>
                  )
                )
            }
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            {/*{!loading ? (*/}
            <Card>
              <CardBody>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group row my-4">
                        <div className="col-md-6">
                          <label htmlFor="date" className="col-12 col-form-label">Version</label>
                          <div className="col-12">
                            <Input type="text" readOnly="true" placeholder="Version" name="Version" value={Version} />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="file" className="col-12 col-form-label">PMR Report File</label>
                          <div className="col-12">
                            <a style={{ "cursor": "pointer", "color": "#1C3A84" }} onClick={e => this.previewToggle(e, PMRFilePath)}>Download</a>
                          </div>
                        </div>
                      </div>
                      {
                        IsReject ?
                          <div className="form-group row my-4">
                            <div className="col-md-12">
                              <label htmlFor="summary" className="col-12 col-form-label">Reason of Rejection <span className="requiredField">*</span></label>
                              <div className="col-12">
                                <Input className={errors.RevisedReason ? "is-invalid" : "is-valid"} type="text" maxLength="250" tabIndex="2" placeholder="Enter Rejection Reason" name="RevisedReason" value={RevisedReason} onChange={this.handleInputChange.bind(this)} />
                                {<span className='error'>{errors.RevisedReason}</span>}
                              </div>
                            </div>
                          </div>
                          : null}
                      <div className="col-md-12">
                        {
                          IsVerified && !IsApproved ?
                            <div className="form-group row my-4 mx-0 formButton">
                              {IsReject ?
                                <Button disabled={loading} type="submit" color="danger"><i className="fa fa-dot-circle-o"></i> Reject</Button>
                                :
                                <React.Fragment>
                                  <Button disabled={loading} onClick={this.handleApproveSubmit.bind(this)} style={{ "marginRight": "5px" }} type="button" color="success"><i className="fa fa-dot-circle-o"></i> Approve</Button>{" "}
                                  <Button disabled={loading} onClick={this.handleRejectSubmit.bind(this)} type="button" color="danger"><i className="fa fa-dot-circle-o"></i> Reject</Button>
                                </React.Fragment>
                              }
                            </div>
                            :
                            null
                        }
                      </div>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
            {/*) : (
                <div className="animated fadeIn pt-1 text-center">Loading...</div>
              )}*/}
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
                    <img src={downloadIcon} style={{ margin: "0 12px", cursor: "pointer" }} alt='download' onClick={e => this.DownloadFile(e, url)} />
                    // </a>
                  }
                  <img src={closeIcon} style={{ cursor: "pointer" }} alt='close' onClick={e => this.previewToggle(e, "")} />
                </div>
                <iframe src={url} title="previewFile" width="100%" height="90%" />
              </div>
            </div>
          </>
        }
      </div >
    );
  }

}

export default PMRApprove;
