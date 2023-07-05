import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Form, Row, Table, Button, Input, FormGroup, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import Moment from 'moment';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import Confirm from "../../CustomModal/Confirm";
import axiosInstance from "./../../../common/axiosInstance"

class PSamples extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      modal: false,
      modalBody: '',
      modal: false,
      modalTitle: '',
      modalBody: '',
      isView: false,
      isEdit: false,
      roleName: '',

      patientpayments: [],
      checkbox: [],
      patientId: "",
      patientAccessionId: "",
      patientSampleId: "",
      AllSamples: [],
      Samples: [],

      companyName: "",
      trackingCode: "",
      shipDate: Moment(new Date())._d,
      AllTracking: [],
      errors: {
        patientSampleId: '',
        companyName: '',
        trackingCode: '',
        shipDate: ''
      }
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

  //load event
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    var rights = userToken.roleModule;

    this.setState({ roleName: userToken.roleName });

    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("patients"));
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          this.getListData();
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

  getListData() {

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PaymentHistory/getPatientPaymentDone';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          var rData = result.data.outdata;

          this.setState({
            patientpayments: rData.patientPaymentData,
            AllSamples: rData.sampleTypeData,
            loading: false
          });
        }
        else { this.setState({ loading: false }); }
      })
      .catch(modalBody => {
        // console.log(modalBody);
        this.setState({
          // modal: !this.state.modal, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
      });
  }

  handleDateChange(date) {
    let errors = this.state.errors;
    errors.shipDate = (!date) ? 'Please enter ship date.' : '';
    this.setState({ shipDate: date })
  }

  handleSampleDateChange = (date, id) => {
    debugger;

    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    //console.log(newDate);

    let nCheckbox = this.state.checkbox.slice();
    const index = nCheckbox.findIndex(e => e.sampleTypeId == id);

    nCheckbox[index].sampleDate = newDate.toISOString();
    this.setState({ checkbox: nCheckbox });
    // console.log(this.state.checkbox);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;


    if (name == "patientAccessionId") {
      if (value != "") {

        this.setState({ loading: true, checkbox: [], Samples: [] });
        let samples = this.state.patientpayments.filter(ml => ml.patientAccessionId === parseInt(value));


        // console.log(this.state.AllSamples);
        let dcId = samples[0].diseaseCategoryId;
        let filtersamples = this.state.AllSamples.filter(ml => ml.diseaseCategoryId === dcId);
        // console.log(filtersamples);

        this.setState({
          patientId: samples[0].patientId,
          patientAccessionId: value,
          Samples: filtersamples
        });

        debugger;
        if (samples.length > 0) {
          //let sids = samples[0].sampleTypeIds;
          this.setState({
            /* checkbox: (sids != "" && sids != null ? sids.split(",") : [])*/
            checkbox: samples[0].patientSample,
            loading: false
          });
        } else {
          this.setState({
            checkbox: [],
            loading: false
          });
        }
        //this.getPatientSampleTrackingData(value, samples[0].patientId);
      }
      else {
        this.setState({
          checkbox: [],
          AllTracking: [],
          patientAccessionId: "",
          Samples: []
        });
      }
    } else {

      this.setState({
        [name]: value
      });
    }

    let errors = this.state.errors;

    switch (name) {
      case 'companyName':
        errors.companyName = (!value) ? 'Please enter company name.' : ''
        break;
      case 'trackingCode':
        errors.trackingCode = (!value) ? 'Please enter tracking code.' : ''
        break;
      case 'shipDate':
        errors.shipDate = (!value) ? 'Please enter ship date.' : ''
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value }, () => {

    })
  }

  //add Sample
  handleSampleInputChange(event) {
    debugger;
    if (event != null) {
      let nCheckbox = this.state.checkbox.slice(); // create a new copy of state value
      if (this.isValueExist(nCheckbox, event.target.value)) { // check if the same value is preexisted in the array
        /*const index = nCheckbox.indexOf(event.target.value);*/
        const index = nCheckbox.findIndex(e => e.sampleTypeId == event.target.value);
        nCheckbox.splice(index, 1); // removing the preexciting value 
      } else {
        let objSample = { sampleTypeId: parseInt(event.target.value), sampleType: '', sampleDate: new Date().toISOString() };
        nCheckbox.push(objSample); // inserting the value of checkbox in the array
      }
      this.setState({
        checkbox: nCheckbox,
        patientSampleId: nCheckbox.map(item => item.sampleTypeId).join(', ')//nCheckbox.join(',')
      });
    }
  }

  //edit time set checkbox selected
  setCheckbox(id) {
    debugger;
    let nCheckbox = this.state.checkbox.slice(); // create a new copy of state value 
    if (this.isValueExist(nCheckbox, id)) { // check if the same value is preexisted in the array
      return true;
    } else {
      return false; // inserting the value of checkbox in the array
    }
  }

  isValueExist(data, event) {
    debugger;
    if (data.length == 0) {
      return false;
    }
    for (let i = 0; i < data.length; i++) {
      if (event == data[i].sampleTypeId) {
        return true;
      }
    }
    return false;
  }

  getDate(id) {
    debugger;
    let data = this.state.checkbox;
    if (data.length == 0) {
      return new Date();
    }
    else {
      let objData = data.filter(e => e.sampleTypeId == id);
      if (objData.length > 0) {
        // console.log(objData[0]?.sampleDate);
        // console.log(new Date(Moment(objData[0]?.sampleDate.slice(0, 10), "YYYY-MM-DD").format('MM/DD/YYYY')));
        return new Date(Moment(objData[0]?.sampleDate.slice(0, 10), "YYYY-MM-DD").format('MM/DD/YYYY'));
      }
      else {
        return new Date();
      }
    }
  }

  AddPatientSample(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    if (userToken != null) {
      uid = (userToken.userId == null ? 0 : userToken.userId);
    }
    if (this.state.patientSampleId != null && this.state.patientSampleId != "") {
      const apiroute = window.$APIPath;
      let url = apiroute + '/api/BE_PatientSample/Save';

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        PatientAccessionId: parseInt(this.state.patientAccessionId),
        //SampleTypeIds: this.state.patientSampleId,
        patientSample: this.state.checkbox,
        createdBy: uid,
        createdByFlag: "A"
      })

      // console.log(data);
      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            loading: false,
            patientSampleId: '',
            Samples: []
          }, this.getListData());
          toast.success(result.data.message)
        }
        else {
          errors.patientSampleId = result.data.message;
          this.setState({ loading: false });
        }
      })
        .catch(modalBody => {
          this.setState({
            // modal: !this.state.modal, modalTitle: 'Error', modalBody: modalBody.message, 
            loading: false
          });
          toast.error(modalBody.message)
        });
    }
    else {
      errors.patientSampleId = "Please select sample.";
      this.setState({ loading: false });
    }
  }
  //end add Sample


  //Sample Tracking
  getPatientSampleTrackingData(anid, pid) {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PatientTrackingSample/GetByPatientId?id=' + pid + '&aid=' + anid;

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          var rData = result.data.outdata;

          this.setState({
            AllTracking: rData,
            loading: false
          });
        }
        else { this.setState({ loading: false }); }
      })
      .catch(modalBody => {
        // console.log(modalBody);
        this.setState({
          // modal: !this.state.modal, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
      });
  }

  validateForm = (errors) => {
    let valid = true;

    if (this.state.companyName == undefined || this.state.companyName == '') {
      errors.companyName = 'Please enter company name.';
    }
    if (this.state.trackingCode == undefined || this.state.trackingCode == '') {
      errors.trackingCode = 'Please enter tracking code.';
    }
    if (this.state.shipDate == undefined || this.state.shipDate == '') {
      errors.shipDate = 'Please select ship date.';
    }

    Object.values(errors).forEach(
      // if we have an modalBody string set valid to false
      (val) => val.length > 0 && (valid = false)
    );

    if (!valid) {
      this.scrollToTop();
    }
    return valid;
  }

  AddPatientSampleTracking(e) {
    e.preventDefault();
    this.setState({ loading: true });

    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    if (userToken != null) {
      uid = (userToken.userId == null ? 0 : userToken.userId);
    }

    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      let url = apiroute + '/api/BE_PatientTrackingSample/Save';

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        PatientAccessionId: parseInt(this.state.patientAccessionId),
        CompanyName: this.state.companyName,
        TrackingCode: this.state.trackingCode,
        ShipDate: this.state.shipDate,
        createdBy: uid,
        createdByFlag: "A"
      })

      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            loading: false,
            companyName: '',
            trackingCode: '',
            shipDate: ''
          }, this.getPatientSampleTrackingData(parseInt(this.state.patientAccessionId), parseInt(this.state.patientId)));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: !this.state.modal, modalTitle: 'Error', modalBody: result.data.message, 
            loading: false
          });
          toast.error(result.data.message)
        }
      })
        .catch(modalBody => {
          this.setState({
            // modal: !this.state.modal, modalTitle: 'Error', modalBody: modalBody.message, 
            loading: false
          });
          toast.error(modalBody.message)
        });
    }
    else {
      this.setState({ loading: false });
    }
  }

  deleteRow(e, id) {
    e.preventDefault();

    this.setState({ loading: true });

    var uid;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    if (userToken != null) {
      uid = (userToken.userId == null ? 0 : userToken.userId);
    }

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PatientTrackingSample/Delete?id=' + id + '&userId=' + uid;

    axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            loading: false,
          }, this.getPatientSampleTrackingData(parseInt(this.state.patientAccessionId), parseInt(this.state.patientId)));
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
      .catch(modalBody => {
        //console.log(modalBody);
        this.setState({
          // modal: !this.state.modal, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
      });
  }
  //Sample Tracking


  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // for smoothly scrolling
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

    const { loading, patientpayments, modalBody, errorType, authError,
      AllSamples, patientSampleId, patientId, companyName, trackingCode, shipDate, AllTracking,
      errors, patientAccessionId, Samples
    } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Patient Specimen Received at Lab</h5>
          </Col>
          <Col xs="2" lg="2">

          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              {/* <CardHeader>
                <Row>
                  <Col xs="6">
                  </Col>
                  <Col xs="6">

                  </Col>
                </Row>
              </CardHeader> */}
              <CardBody>
                {authError ? <p>{modalBody.message}</p> : null}

                <Form className="form-horizontal" onSubmit={this.AddPatientSample.bind(this)}>
                  <Row>
                    <Col xs="4">
                      <FormGroup>
                        <Label>Patient <span className="requiredField">*</span></Label>
                        <Input type="select" tabIndex="1" name="patientAccessionId" value={patientAccessionId} onChange={this.handleInputChange.bind(this)}>
                          <option value="">Select Patient</option>
                          {patientpayments
                            .map((data, i) => {
                              return (<option key={i} value={data.patientAccessionId}>{data.patientName + (data.accessionNo != null ? " (" + data.accessionNo.replace(/-/g, "") + ")" : "")}</option>);
                            })}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  {patientId != "" ?
                    <React.Fragment>
                      <Row>
                        <div className="form-group">
                          {
                            Samples.length > 0 ?
                              Samples.map((data, i) => {
                                return (
                                  <FormGroup check row key={i}>
                                    <Row style={{ "marginBottom": "3px", "marginLeft": Samples.length == 1 ? "20px" : "0px" }}>
                                      <Col xs="1">
                                      </Col>
                                      <Col xs="7" style={{ "float": "right", "paddingTop": "6px" }}>
                                        {/*this.setCheckbox(data.sampleTypeId) ? (*/}
                                        {this.setCheckbox(data.sampleTypeId) ? (
                                          <Input className="form-check-input" type="checkbox" id={"chk" + data.sampleTypeId} checked name="inline-checkbox1" value={data.sampleTypeId} onChange={this.handleSampleInputChange.bind(this)} />
                                        ) : (
                                          <Input className="form-check-input" type="checkbox" id={"chk" + data.sampleTypeId} name="inline-checkbox1" value={data.sampleTypeId} onChange={this.handleSampleInputChange.bind(this)} />
                                        )
                                        }
                                        <Label className="form-check-label" check htmlFor={" chk" + data.sampleTypeId}>{data.sampleTypeName}</Label>
                                      </Col>
                                      <Col xs="4">
                                        <div className="cus-date-picker">
                                          <DatePicker
                                            selected={this.getDate(data.sampleTypeId)}
                                            onChange={e => this.handleSampleDateChange(e, data.sampleTypeId)}
                                            dateFormat="MM/dd/yyyy"
                                            placeholderText="mm/dd/yyyy"
                                            className="form-control here"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            fixedHeight
                                            disabled={!this.setCheckbox(data.sampleTypeId)}
                                          />
                                        </div>
                                      </Col>
                                    </Row>
                                  </FormGroup>
                                )
                              }) :
                              null
                          }
                          {errors.patientSampleId.length > 0 && <span className='error' style={{ "marginLeft": "15px" }}>{errors.patientSampleId}</span>}
                        </div>
                      </Row>
                      <Row>
                        <Col xs="12">
                          <FormGroup className="formButton">
                            <Button type="submit" disabled={loading} color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>{" "}
                          </FormGroup>
                        </Col>
                      </Row>
                    </React.Fragment>
                    : null}
                  {/*{patientId != "" ?
                  {/*  <React.Fragment>*/}
                  {/*    <br />*/}
                  {/*    <hr />*/}
                  {/*    <h4>Sample Tracking Detail</h4>*/}
                  {/*    <Row>*/}
                  {/*      <Col xs="4">*/}
                  {/*        <FormGroup>*/}
                  {/*          <Label>Company Name <span className="requiredField">*</span></Label>*/}
                  {/*          <Input className="form-control here" type="text" maxLength="250" tabIndex="1" placeholder="Enter company name" name="companyName" value={companyName} onChange={this.handleInputChange.bind(this)} />*/}
                  {/*          {errors.companyName.length > 0 && <span className='error'>{errors.companyName}</span>}*/}
                  {/*        </FormGroup>*/}
                  {/*      </Col>*/}
                  {/*      <Col xs="4">*/}
                  {/*        <FormGroup>*/}
                  {/*          <Label>Tracking Code <span className="requiredField">*</span></Label>*/}
                  {/*          <Input className="form-control here" type="text" maxLength="100" tabIndex="2" placeholder="Enter tracking code" name="trackingCode" value={trackingCode} onChange={this.handleInputChange.bind(this)} />*/}
                  {/*          {errors.trackingCode.length > 0 && <span className='error'>{errors.trackingCode}</span>}*/}
                  {/*        </FormGroup>*/}
                  {/*      </Col>*/}
                  {/*      <Col xs="4">*/}
                  {/*        <FormGroup>*/}
                  {/*          <Label>Ship Date <span className="requiredField">*</span></Label>*/}
                  {/*          <div className="cus-date-picker">*/}
                  {/*            <DatePicker*/}
                  {/*              selected={shipDate}*/}
                  {/*              onChange={this.handleDateChange.bind(this)}*/}
                  {/*              dateFormat="MM/dd/yyyy"*/}
                  {/*              placeholderText="mm/dd/yyyy"*/}
                  {/*              className="form-control here"*/}
                  {/*              showMonthDropdown*/}
                  {/*              showYearDropdown*/}
                  {/*              dropdownMode="select"*/}
                  {/*              fixedHeight*/}
                  {/*            />*/}
                  {/*          </div>*/}
                  {/*          {errors.shipDate.length > 0 && <span className='error'>{errors.shipDate}</span>}*/}
                  {/*        </FormGroup>*/}
                  {/*      </Col>*/}
                  {/*    </Row>*/}
                  {/*    <Row>*/}
                  {/*      <Col xs="12">*/}
                  {/*        <FormGroup className="formButton">*/}
                  {/*          <Button type="button" onClick={this.AddPatientSampleTracking.bind(this)} disabled={loading} color="primary"><i className="fa fa-dot-circle-o"></i> Add</Button>{" "}*/}
                  {/*        </FormGroup>*/}
                  {/*      </Col>*/}
                  {/*    </Row>*/}

                  {/*    <br />*/}

                  {/*    <Table responsive bordered key="tblpatients">*/}
                  {/*      <thead class="thead-light">*/}
                  {/*        <tr>*/}
                  {/*          <th>Company Name</th>*/}
                  {/*          <th>Tracking Code</th>*/}
                  {/*          <th>Ship Date</th>*/}
                  {/*          <th>Action</th>*/}
                  {/*        </tr>*/}
                  {/*      </thead>*/}
                  {/*      <tbody>*/}
                  {/*        {*/}
                  {/*          (AllTracking.length > 0 ? (*/}
                  {/*            AllTracking*/}
                  {/*              .map((data, i) => {*/}
                  {/*                return (<tr key={i}>*/}
                  {/*                  <td>{data.companyName}</td>*/}
                  {/*                  <td>{data.trackingCode} </td>*/}
                  {/*                  <td>{Moment(data.shipDate, "YYYY-MM-DD").format('MM/DD/YYYY')}</td>*/}
                  {/*                  <td>*/}
                  {/*                  <Confirm title="Confirm" description="Are you sure want to delete this traking record?">*/}
                  {/*                    {confirm => (*/}
                  {/*                      <Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={confirm(e => this.deleteRow(e, data.trackingId))}><b>Delete</b></Link>*/}
                  {/*                    )}*/}
                  {/*                  </Confirm>*/}
                  {/*                  </td>*/}
                  {/*                </tr>*/}
                  {/*                )*/}
                  {/*              })) : (*/}
                  {/*            <tr>*/}
                  {/*              <td colSpan="4" className="tdCenter">No trackings found.</td></tr>*/}
                  {/*          ))*/}
                  {/*        }*/}
                  {/*      </tbody>*/}
                  {/*    </Table>*/}
                  {/*  </React.Fragment>*/}
                  {/*  : null}*/}
                </Form>
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

export default PSamples;
