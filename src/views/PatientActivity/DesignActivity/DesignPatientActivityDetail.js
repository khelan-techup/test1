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
import Confirm from "../../CustomModal/Confirm";
import axiosInstance from "../../../common/axiosInstance"


class DesignPatientActivityDetail extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      PatientId: 0,
      PatientAccessionId: 0,
      DesignPatientActivityId: 0,
      Purpose: "",
      Other: "",
      SubjectId: "",
      docFiles: [],
      allsubjects: [],
      DocumentFile: "",
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      show: false,
      errors: {
        Purpose: '',
        SubjectId: '',
        DocumentFile: ''
      },
      PatientName: "",
      PatientAccessionNo: "",
      preview: false,
      url: "",
      fileName: ""
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
      this.props.history.push('/patientactivity/designactivities/list/' + this.state.PatientAccessionId);
    }
  }

  componentDidMount() {
    const param = this.props.match.params;
    if (param.id != undefined) {
      this.setState({ PatientAccessionId: param.id });

      const apiroute = window.$APIPath;
      const url = apiroute + '/api/BE_DesignActivitySubject/GetDRPAll';

      let data = JSON.stringify({
        isDeleted: true,
        searchString: '',
        Id: parseInt(param.id)
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
              allsubjects: result.data.outdata.designActivitySubject,
              PatientId: result.data.outdata.patientId,
              PatientName: result.data.outdata.patientName,
              PatientAccessionNo: result.data.outdata.accessionNo,
            }, () => {

              if (param.pid != undefined) {
                this.getData(param.pid);
              } else {
                this.setState({ loading: false });
              }

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
    } else {
      this.setState({ loading: false });
    }
  }

  //get detail(for update)
  getData(id) {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/DesignPatientActivity/GetById?id=' + id;

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState({
            Purpose: rData.purpose, SubjectId: rData.subjectId,
            DesignPatientActivityId: rData.designPatientActivityId,
            Other: rData.other,
            loading: false, docFiles: rData.designPatientActivityFile,
            show: (rData.subject.includes("Other") ? true : false)
          });
          //console.log(this.state);
        } else { this.setState({ loading: false }); }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
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
      case 'Purpose':
        errors.Purpose = (!value) ? 'This field is required.' : ''
        break;
      case 'SubjectId':
        errors.SubjectId = (!value) ? 'Please select subject.' : ''
        break;
      default:
        //(!value) ? '' :'This field is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => {
      if (name == "SubjectId") {
        var index = target.selectedIndex;
        if (target[index].text == "Other") {
          this.setState({ show: true });
        }
        else {
          this.setState({ show: false });
        }
      }
    })
  }

  handleFileInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.files;

    this.setState({
      DocumentFile: value
    });

    let errors = this.state.errors;

    switch (name) {
      case 'DocumentFile':
        errors.DocumentFile = (!value) ? 'This field is required.' : ''
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

    if (this.state.SubjectId == undefined || this.state.SubjectId == '') {
      errors.SubjectId = 'Please select subject.';
    }
    if (this.state.Purpose == undefined || this.state.Purpose == '') {
      errors.Purpose = 'This field is required.';
    }
    if (this.state.DocumentFile == undefined || this.state.DocumentFile == '') {
      errors.DocumentFile = 'This field is required.';
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
    let url = "";
    let uid = 0;

    if (this.validateForm(this.state.errors)) {
      var userToken = JSON.parse(localStorage.getItem('AUserToken'));

      if (userToken != null) {
        uid = (userToken.userId == null ? 0 : userToken.userId);
      }

      const apiroute = window.$APIPath;
      if (this.state.DesignPatientActivityId == 0) {
        url = apiroute + '/api/DesignPatientActivity/Save';
      }
      else {
        url = apiroute + '/api/DesignPatientActivity/Update';
      }

      let data = JSON.stringify({
        PatientId: parseInt(this.state.PatientId),
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
        Purpose: this.state.Purpose,
        Other: this.state.Other,
        SubjectId: parseInt(this.state.SubjectId),
        DesignPatientActivityId: parseInt(this.state.DesignPatientActivityId),
        userId: parseInt(uid)
      })

      // console.log(data);
      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(result => {
        if (result.data.flag) {
          //console.log(result.data.outdata);
          let ldata = result.data.outdata;
          if (this.state.DocumentFile != "") {
            this.filesUploadDoc(ldata.designPatientActivityId, result.data.message)
          }
          else {
            this.setState({
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message,
              redirect: true,
              loading: false
            });
            toast.success(result.data.message)
            this.props.history.push('/patientactivity/designactivities/list/' + this.state.PatientAccessionId);
          }
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

  filesUploadDoc(id, msg) {
    const apiroute = window.$APIPath;
    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));

    if (userToken != null) {
      uid = (userToken.userId == null ? 0 : userToken.userId);
    }
    let pid = this.state.PatientId;
    let url = apiroute + '/api/DesignPatientActivityFile/Save?id=' + id + '&uid=' + uid + '&pid=' + pid + '';
    //alert(this.state.DocumentFile)
    let files = this.state.DocumentFile;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append(`files[${i}]`, files[i])
    }
    axiosInstance.post(url, data, {
      // receive two    parameter endpoint url ,form data
    }).then(result => {
      // console.log(result);
      if (result.data.flag) {
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Success',
          // modalBody: msg,
          redirect: true,
          loading: false
        });
        toast.success(msg)
        this.props.history.push('/patientactivity/designactivities/list/' + this.state.PatientAccessionId);
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
    }).catch(error => {
      // console.log(error.message);
      this.setState({ loading: false });
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

  //delete(active/inactive) button click
  deleteRow(e, id) {
    e.preventDefault();

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/DesignPatientActivityFile/Delete?id=' + id + '';

    axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            loading: false,
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message
          });
          toast.success(result.data.message)
          const param = this.props.match.params;

          if (param.id != undefined) {
            this.getData(param.id);
          }
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
        this.setState({ loading: false, authError: true, error: error });
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

    const { loading, PatientId, PatientAccessionId, Purpose, SubjectId, Other, preview, url, fileName,
      allsubjects, docFiles, DocumentFile, errors, PatientName, PatientAccessionNo } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Design Patient Activity Detail</h5>
            <h5 className="mt-2">{PatientName} &nbsp; {PatientAccessionNo != "" && PatientAccessionNo != null ? "(" + PatientAccessionNo.replace(/-/g, "") + ")" : ""}</h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to={'/patientactivity/designactivities/list/' + PatientAccessionId}>
              <button className="btn btn-primary btn-block">List</button>
            </Link>
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
                          <label htmlFor="date" className="col-12 col-form-label">Subject <span className="requiredField">*</span></label>
                          <div className="col-12">
                            <Input type="select" className={errors.SubjectId ? "form-control is-invalid" : "form-control is-valid"} name="SubjectId" value={SubjectId} onChange={this.handleInputChange.bind(this)}>
                              <option value="">Select Subject</option>
                              {allsubjects.length > 0 ?
                                allsubjects
                                  .map((data, i) => {
                                    return (<option key={i} value={data?.id}>{data?.name}</option>);
                                  }) : null}
                            </Input>
                            {<span className='error'>{errors.SubjectId}</span>}
                          </div>
                        </div>
                        <div className="col-md-6" style={{ visibility: this.state.show ? 'visible' : 'hidden' }}>
                          <label htmlFor="date" className="col-12 col-form-label">Other option </label>
                          <div className="col-12">
                            <Input type="text" placeholder="Enter Other" name="Other" value={Other} onChange={this.handleInputChange.bind(this)} />
                          </div>
                        </div>
                      </div>
                      <div className="form-group row my-4">
                        <div className="col-md-12">
                          <label htmlFor="summary" className="col-12 col-form-label">Purpose <span className="requiredField">*</span></label>
                          <div className="col-12">
                            <Input className={errors.Purpose ? "is-invalid" : "is-valid"} type="textarea" rows="10" tabIndex="2" placeholder="Enter Purpose" name="Purpose" value={Purpose} onChange={this.handleInputChange.bind(this)} />
                            {<span className='error'>{errors.Purpose}</span>}
                          </div>
                        </div>

                      </div>
                      <div className="form-group row my-4">
                        <div className="col-md-6">
                          <label htmlFor="file" className="col-12 col-form-label">Design File <span className="requiredField">*</span></label>
                          <div className="col-12">
                            <Input type="file" multiple name="DocumentFile" tabIndex="3" className={errors.DocumentFile ? "form-control is-invalid" : "form-control is-valid"} onChange={this.handleFileInputChange.bind(this)} />
                            {<span className='error'>{errors.DocumentFile}</span>}

                          </div>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group row my-4">
                          {docFiles.length > 0 ? (
                            docFiles
                              .map((data, i) => {
                                return (
                                  <div className="col-md-1" key={i}>
                                    <span>{i + 1}.)</span>{" "}
                                    <a style={{ cursor: "pointer", color: "#1C3A84" }} onClick={e => this.previewToggle(e, data.filePath, data.fileName)} ><span><i className='fa fa-download'></i></span></a>{" "}
                                    <Confirm title="Confirm" description="Are you sure want to delete this file?">
                                      {confirm => (
                                        <Link to="#" onClick={confirm(e => this.deleteRow(e, data.designPatientActivityFileId))}><i className="fa fa-trash" /></Link>
                                      )}
                                    </Confirm>
                                  </div>
                                )
                              })) : (null)}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group row my-4 mx-0 formButton">
                          <Button disabled={loading} type="submit" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>{" "}
                        </div>
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
                    <img src={downloadIcon} style={{ margin: "0 12px", cursor: "pointer" }} alt='download'
                      onClick={e => this.DownloadFile(e, url.split("/").filter((obj, index) => index > 2).join("/"), fileName)} />
                  }
                  <img src={closeIcon} style={{ cursor: "pointer" }} alt='close' onClick={e => this.previewToggle(e, "", "")} />
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

export default DesignPatientActivityDetail;
