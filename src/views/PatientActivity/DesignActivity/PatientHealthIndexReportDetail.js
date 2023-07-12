import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row,
  Table, Button, Input, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter, Form, Collapse, Fade
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build'
import Confirm from "../../CustomModal/Confirm";
import "@reach/dialog/styles.css";
import { toast } from 'react-toastify';
import axiosInstance from "../../../common/axiosInstance"

class PatientHealthIndexReportDetail extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      userId: 0,
      PatientId: 0,
      PatientAccessionId: 0,
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      show: false,
      isSubmited: false,
      ColumnTitle: "",
      ReportBuilder: [],
      titleEditorIndex: "",
      errors: {
        iterativeDescription: ""
      },
      PatientName: "",
      PatientId: "",
      PatientAccessionNo: "",
      collapse: false,
      fadeIn: true,
      timeout: 300,
      collapseId: 1,
    };
    this.state = this.initialState;

  }
  componentDidMount() {

    const param = this.props.match.params;
    if (param.id != undefined && param.aid != undefined && param.did != undefined) {
      let id = parseInt(param.id);
      let aid = parseInt(param.aid);
      this.setState({ PatientId: id, PatientAccessionId: aid });
      this.getData(id, aid);
    }
  }

  getData = (id, aid) => {

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_HealthIndex/GetReportData?id=' + id + '&aid=' + aid + '';


    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          // console.log("result", result);
          let rData = result.data.outdata;
          this.setState({
            loading: false,
            PatientName: rData?.patientName,
            PatientAccessionNo: rData?.patientAccessionNo,
            ReportBuilder: rData?.reportBuilder
          });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
      });
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


  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.ReportBuilder.length > 0) {
      this.state.ReportBuilder.forEach((rep, i) => {
        // console.log(rep.title, rep?.description?.length)
        let title = "Existing Clinical Trials".toLowerCase();
        let description = rep?.description;
        if (!description) {


          if (String(rep?.title).toLowerCase() === title || String(rep?.headingTitle).toLowerCase() === title) {
            // e.description = '<p>Existing Clinical Trials</p>'
          } else {
            // if (rep?.description?.length == 0 || rep?.description?.length == undefined) {
            errors[`seq${rep.sequence}`] = "* Please enter title and description."
            // }
          }
        }

      })
    }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }



  // validateForm = (errors) => {
  //   let valid = true;

  //   //if (this.state.ReportBuilder.length > 0) {
  //   //  this.state.ReportBuilder.forEach((rep, i) => {
  //   //    errors.iterativeDescription = rep.description === "" || rep.title === "" ? "* Please enter title and description." : ""
  //   //  })
  //   //}

  //   //Object.values(errors).forEach(
  //   //  // if we have an error string set valid to false
  //   //  (val) => val.length > 0 && (valid = false)
  //   //);
  //   return valid;

  // }


  loader() {
    if (this.state.loading) {
      return <div className="cover-spin">
      </div>;
    }
  }

  //input handle input change report module
  handleInputChangeReportBuilder(event, index, fieldType, description) {
    let data = this.state.ReportBuilder;
    let errors = this.state.errors;

    // console.log(data);
    const elementsIndex = index;

    if (fieldType == "desc") {
      data[elementsIndex].description = description;
      //errors.iterativeDescription = ""
    }
    else if (fieldType == "title") {
      data[elementsIndex].title = event.target.value;
    }

    // console.log(data);
    this.setState({
      ReportBuilder: data
    });
  }

  openTitleEditor(event, index) {
    this.setState({
      titleEditorIndex: index
    })
  }

  handleSubmit(e) {
    debugger;
    e.preventDefault();
    this.setState({ loading: true, isSubmited: true });
    let url = "";
    let uid = 0;

    if (this.validateForm(this.state.errors)) {
      var userToken = JSON.parse(localStorage.getItem('AUserToken'));

      if (userToken != null) {
        uid = (userToken.userId == null ? 0 : userToken.userId);
      }

      const apiroute = window.$APIPath;
      // url = apiroute + '/api/HealthIndex/SaveDataForPatientReport';
      url = apiroute + '/api/BE_HealthIndex/SaveDataForHealthIndexReport'

      let data = JSON.stringify({

        PatientId: parseInt(this.state.PatientId),
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
        userId: parseInt(uid),
        ReportBuilder: this.state.ReportBuilder,
        userId: parseInt(uid)
      })

      // console.log("Data to submit", data);
      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'success',
            // modalBody: result.data.message,
            loading: false,
            isSubmited: false,
            redirect: true
          });

          toast.success(result.data.message)
          let redirectTo = this?.props?.location?.state?.redirectTo
          setTimeout(() => redirectTo ? this.props.history.push(redirectTo) : this.props.location.state?.patient ? this.props.history.push('/patients/list') : this.props.history.push('/patientactivity/designactivity'), 2000);

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
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // ModalBody: error.message,
            loading: false
          });
          toast.error(error.message)
        });
    }
    else {
      this.setState({ loading: false });
    }
  }


  render() {

    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const {
      collapseId,
      loading,
      patientId,
      PatientAccessionId,
      errors,
      ReportBuilder,
      titleEditorIndex
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Health Index Details</h5>
          </Col>
          <Col xs="1" lg="1">
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardBody>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                  <div className="row">

                    {ReportBuilder.length > 0 &&
                      ReportBuilder.map((item, index) => {
                        return (
                          <>
                            <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                              <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                                <Card style={{ "border": "1px solid #1C3A84" }}>
                                  <CardHeader className="d-flex justify-content-between align-items-center" style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => titleEditorIndex !== index && this.setCollapse(index + 3)}>
                                    {
                                      titleEditorIndex === index ?
                                        <div className="col-md-11">
                                          <Input type="text" value={item.title} onChange={(e) => this.handleInputChangeReportBuilder(e, index, "title")} />
                                        </div>
                                        :
                                        <b style={{ "fontSize": "16px" }}>{item.title}</b>
                                    }
                                    {
                                      titleEditorIndex === index ?
                                        <Link className="btn btn-primary btn-pill" onClick={(e) => this.openTitleEditor(e, "")}>Save</Link>
                                        :
                                        <Link className="btn btn-primary btn-pill" onClick={(e) => this.openTitleEditor(e, index)}><i className="icon-pencil"></i></Link>
                                    }
                                  </CardHeader>
                                  <Collapse isOpen={index + 3 == collapseId} id="collapseExample">
                                    <CardBody>
                                      {/* <h4><b>Note</b></h4> */}
                                      <div className="form-group row my-4">
                                        <div className="col-md-12">
                                          <CKEditor
                                            editor={ClassicEditor}
                                            data={item.description || ""}
                                            config={{ placeholder: "Please enter description" }}
                                            //onReady={editor => {
                                            // You can store the "editor" and use when it is needed.
                                            //console.log('Editor is ready to use!', editor);
                                            //}}
                                            onChange={(event, editor) => {
                                              const data = editor?.getData();
                                              this.handleInputChangeReportBuilder(event, index, "desc", data)
                                              // errors.iterativeDescription = '';
                                              errors[`seq${item?.sequence}`] = '';
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </CardBody>
                                  </Collapse>
                                  {(item.description !== '' || item.title !== '') && <h5 className='error'>{`seq${item?.sequence}` in errors && errors[`seq${item?.sequence}`]}</h5>}
                                  {/*{(item.description !== '' || item.title !== '') && <h5 className='error'>{errors.iterativeDescription}</h5>}*/}
                                </Card>
                              </Fade>
                            </Col>
                          </>
                        )
                      })}
                  </div>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input type="hidden" name="patientId" />

                        <Button type="submit" color="primary" className="mr-2"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                        {/* <Button type="reset" color="danger" onClick={this.onResetClick.bind(this)}><i className="fa fa-ban"></i> Reset</Button> */}
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <MyModal
        // handleModal={this.handleModalClose.bind(this)}
        //modalAction={this.state.modalAction}
        //isOpen={this.state.modal}
        //modalBody={this.state.modalBody}
        //modalTitle={this.state.modalTitle}
        //modalOptions={this.state.modalOptions}
        />
      </div >
    );
  }
}
export default PatientHealthIndexReportDetail;
