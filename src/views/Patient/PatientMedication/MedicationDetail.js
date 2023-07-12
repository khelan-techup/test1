import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, FormGroup, Form, Input, Row, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import moment from 'moment';
import Confirm from "../../CustomModal/Confirm";
import downloadIcon from '../../../assets/download.svg';
import closeIcon from '../../../assets/x.svg';
import axiosInstance from "./../../../common/axiosInstance"

class MedicationDetail extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      PatientId: 0,
      PatientMedicationId: 0,
      Description: "",
      MedicationDate: moment(new Date())._d,
      docFiles: [],
      DocumentFile: "",
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
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
    if (this.state.redirect) {
      this.props.history.push('/patient/medication/list');
    }
  }

  componentDidMount() {
    const param = this.props.match.params;

    if (param.id != undefined) {
      //this.getData(param.id);
    }
    else {
      this.setState({ loading: false });
    }
  }

  //get detail(for update)
  getData(id) {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/PatientMedication/GetById?id=' + id;

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {
      if (result.data.flag) {
        var rData = result.data.outdata.medicationData;
        var dData = result.data.outdata.docData;
        this.setState({
          PatientId: rData.patientId, Description: rData.description,
          // MedicationDate: rData.medicationDate == null ? "" : rData.medicationDate.slice(0, 10),
          MedicationDate: rData.medicationDate == null ? "" : moment(rData.medicationDate)._d,
          PatientMedicationId: rData.patientMedicationId,
          loading: false, docFiles: dData
        });
        //console.log(this.state);
      } else { this.setState({ loading: false }); }
    })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
      });
  }

  handleMedicationDateChange(date) {
    this.setState({ MedicationDate: date })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleFileInputChange(event) {
    const target = event.target;
    const value = target.files;

    this.setState({
      DocumentFile: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    var userToken = JSON.parse(localStorage.getItem('Usertoken'));
    let pid = (userToken.patientId == null ? 0 : userToken.patientId);

    const apiroute = window.$APIPath;
    if (this.state.PatientMedicationId == 0) {
      url = apiroute + '/api/PatientMedication/Save';
    }
    else {
      url = apiroute + '/api/PatientMedication/Update';
    }

    let data = JSON.stringify({
      PatientId: parseInt(pid),
      Description: this.state.Description,
      MedicationDate: this.state.MedicationDate,
      PatientMedicationId: parseInt(this.state.PatientMedicationId),
    })

    // console.log(data);
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          if (this.state.DocumentFile != "") {
            this.filesUploadDoc(result.data.outdata.patientMedicationId, result.data.message)
          }
          else {
            this.setState({
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message,
              redirect: true
            });
            toast.success(result.data.message)
            this.props.history.push('/patient/medication/list');
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
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Error',
        //   modalBody: error.message
        // });
        toast.error(error.message)
        //this.setState({ authError: true, error: error });
      });
  }

  filesUploadDoc(id, msg) {
    const apiroute = window.$APIPath;
    let url = apiroute + '/api/PatientMedicationFile/Save?id=' + id + '';
    //alert(this.state.DocumentFile)
    let files = this.state.DocumentFile;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append(`files[${i}]`, files[i])
    }
    axiosInstance.post(url, data, {
      // receive two    parameter endpoint url ,form data
    }).then(result => {
      if (result.data.flag) {
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Success',
          // modalBody: msg,
          redirect: true
        });
        toast.success(msg)
        this.props.history.push('/patient/medication/list');
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
    });
  }

  //file preview
  previewToggle(e, path) {
    this.setState({
      preview: !this.state.preview,
      url: window.$FileUrl + path,
    })
  }

  //delete(active/inactive) button click
  deleteRow(e, id) {
    e.preventDefault();

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/PatientMedicationFile/Delete?id=' + id + '';

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

  render() {
    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const { loading, Description, MedicationDate, docFiles, DocumentFile, errors, preview, url } = this.state;

    return (
      <div className="animated fadeIn">
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Medication Details</h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/patients/list">
              <button className="btn btn-primary btn-block">List</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            {/* {!loading ? ( */}
            <Card>
              <CardBody>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group row my-4">
                        <div className="col-md-6">
                          <label className="col-12 col-form-label">Medication Date</label>
                          <div className="col-12">
                            {/* <Input type="date" name="MedicationDate" tabIndex="1" min="1000-01-01" max="9999-12-31" className="form-control" value={MedicationDate} onChange={this.handleInputChange.bind(this)} placeholder="Enter a Medication Date" required /> */}
                            <div className="cus-date-picker">
                              <DatePicker
                                selected={MedicationDate}
                                onChange={this.handleMedicationDateChange.bind(this)}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="mm/dd/yyyy"
                                className="form-control"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                fixedHeight
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">

                        </div>
                      </div>
                      <div className="form-group row my-4">
                        <div className="col-md-12">
                          <label className="col-12 col-form-label">Description</label>
                          <div className="col-12">
                            <Input className="form-control here" type="text" tabIndex="2" placeholder="Enter your Description" name="Description" value={Description} onChange={this.handleInputChange.bind(this)} required />
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="form-group row my-4">
                        <div className="col-md-6">
                          <label className="col-12 col-form-label">Medication File</label>
                          <div className="col-12">
                            <Input type="file" name="DocumentFile" id="File" className="form-control" multiple="multiple" tabIndex="3" onChange={this.handleFileInputChange.bind(this)} />
                          </div>
                        </div>
                        <div className="col-md-6">
                        </div>
                      </div>
                      <div className="form-group row my-4">
                        {docFiles.length > 0 ? (
                          docFiles
                            .map((data, i) => {
                              return (
                                <div className="col-md-2" key={i}>
                                  <span>{i + 1}.)</span>{" "}
                                  <Link className='btn btn-primary' onClick={e => this.previewToggle(e, data.document)}><span><i className='fa fa-download'></i></span></Link>{" "}
                                  <Confirm title="Confirm" description="Are you sure want to delete this file?">
                                    {confirm => (
                                      <Link to="#" onClick={confirm(e => this.deleteRow(e, data.patientMedicationFileId))}><i className="fa fa-trash" /></Link>
                                    )}
                                  </Confirm>
                                </div>
                              )
                            })) : (null)}
                      </div>
                      {/* {loading ?
                          <div className="form-group row my-4 mx-0">
                            <div className="animated fadeIn pt-1 text-center">Loading...</div>
                          </div>
                          : */}
                      <div className="form-group row my-4 mx-0">
                        <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>{" "}
                      </div>
                      {/* } */}
                    </div>
                  </div>

                </Form>
              </CardBody>
            </Card>
            {/* ) : (
                <div className="animated fadeIn pt-1 text-center">Loading...</div>
              )} */}
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
                    <a href={url.split("/").filter((obj, index) => index > 2).join("/")} download >
                      <img src={downloadIcon} style={{ margin: "0 12px", cursor: "pointer" }} alt='download' /></a>
                  }
                  <img src={closeIcon} style={{ cursor: "pointer" }} alt='close' onClick={e => this.previewToggle(e, "")} />
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

export default MedicationDetail
