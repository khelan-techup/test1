import React, { Component } from 'react'
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row,
  Table, Button, Input, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter, Form, Collapse, Fade, Label
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build'
import axios from 'axios';
import { toast } from 'react-toastify';
import neologo from '../../assets/img/brand/logo-small.png'
import axiosInstance from "../../common/axiosInstance"

export class generatePmrReport extends Component {
  constructor(props) {
    super(props);
    this.initState = {
      qtyPerVial: "",
      totalVialsDP: "",
      notes: ""
      ,
      version: "",
      // Vials: "120"
    }
    this.state = this.initState
  }
  componentDidMount() {
    const param = this.props.match.params;
    this.getData(param.id, param.aid)
  }
  loader() {
    if (this.state.loading) {
      return <div className="cover-spin">
      </div>;
    }
  }



  submitData = () => {
    const param = this.props.match.params;
    this.setState({ loading: true })
    let data = {

      "patientAccessionId": Number(param.aid),
      "version": this.state.version,
      "patientId": Number(param.id),
      "patientName": "string",
      "patientAccessionNo": "",
      "pmReport": {
        "pmReportId": 0,
        "version": "string",
        "notes": this.state.notes,
        "qtyPerVial": this.state.qtyPerVial,
        "totalVialsDP": this.state.totalVialsDP,
        // "totalVials": this.state.Vials,
        "verifiedOrgUserId": 0,
        "verifiedUserName": "string",
        "approvedOrgUserId": 0,
        "approvedUserName": "string",
        "isCurrent": true,
        "isActive": true,
        "createdDate": new Date(),
        // "updatedDate": "2022-09-15T11:58:14.238Z",
        // "deletedDate": "2022-09-15T11:58:14.238Z",
        "createdBy": 0,
        "updatedBy": 0,
        "deletedBy": 0
      },
      // "userId": 0
    }
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PatientReport/SaveDataForPMRReport';
    axiosInstance.post(url, data).then((res) => {
      console.log(res)
      if (res.data.flag) {
        toast.success("PMR Report Generated Successfully")
        this.setState({ loading: false })
        if (this?.props?.location?.state?.redirectTo) this.props.history.push(this?.props?.location?.state?.redirectTo)

      } else {
        toast.error("Something went wrong while generating PMR report , please try again")
        this.setState({ loading: false })
        if (this?.props?.location?.state?.redirectTo) this.props.history.push(this?.props?.location?.state?.redirectTo)



      }

    }).catch(() => {
      toast.error("Something went wrong while generating PMR report , please try again")
      this.setState({
        loading: false
      })
    })
  }




  getData = (id, aid) => {
    const apiroute = window.$APIPath;
    // /api/BE_PatientReport/GetPatientReportData
    const url = apiroute + '/api/BE_PatientReport/GetPMRReportData?' + id + '&aid=' + aid;

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      // console.log(response.data?.outdata?.pmReport)
      if (response.data.flag) {
        let data = response.data.outdata.pmReport;
        this.setState({
          ...data
        })
      }
    })
  }
  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
    // console.log(this.state)
  }
  render() {
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            {/* <h5 className="mt-2"><i className="fa fa-align-justify"></i> </h5> */}
            <h5 className="mt-2"><i className="fa fa-align-justify"></i>  PMR Report Detail   </h5>
          </Col>
          <Col xs="2" lg="2">
            <Link to={this?.props?.location?.state?.redirectTo ? this?.props?.location?.state?.redirectTo : "/patients/list"}>
              <button className="btn btn-primary btn-block">
                {this?.props?.location?.state?.redirectTo ? "Back to Details" : "Back to List"}
              </button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardBody>
                <Form >
                  <div className="row">
                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade>
                        <Card style={{ "border": "1px solid #1C3A84" }}>

                          <Collapse isOpen={true} id="collapseExample">
                            <CardBody>
                              <Row>
                                <Col xs="6">
                                  <FormGroup>
                                    <Label>
                                      Version
                                    </Label>
                                    <Input
                                      onChange={(e) => {
                                        this.handleChange("version", e.target.value)
                                      }}
                                      value={this.state?.version}
                                      type="text"
                                    // className="is-valid"



                                    />
                                  </FormGroup>
                                </Col>
                                <Col xs="6">
                                  <FormGroup>
                                    <Label>
                                      {/* qtyPerVial */}
                                      Quantity Per Vial
                                    </Label>
                                    <Input
                                      onChange={(e) => {
                                        this.handleChange("qtyPerVial", e.target.value)
                                      }}
                                      value={this.state?.qtyPerVial}
                                      type="text"
                                    // className="is-valid"



                                    />
                                  </FormGroup>
                                </Col>
                                <Col xs="6">
                                  <FormGroup>
                                    <Label>
                                      {/* totalVialsDP */}
                                      Total Vial DP
                                    </Label>
                                    <Input
                                      onChange={(e) => {
                                        this.handleChange("totalVialsDP", e.target.value)
                                      }}
                                      value={this.state?.totalVialsDP}
                                      type="text"
                                      // className="is-valid"
                                      name="firstName"
                                      placeholder="Enter first name"
                                      maxLength="200"
                                    />
                                  </FormGroup>
                                </Col>
                                {/* <Col xs="6">
                                  <FormGroup>
                                    <Label>
                                      Vials
                                    </Label>
                                    <Input
                                      onChange={(e) => {
                                        this.handleChange("Vials", e.target.value)
                                      }}
                                      value={this.state?.Vials}
                                      type="text"
                                      // className="is-valid"
                                      name="firstName"
                                      placeholder="Enter Vials"
                                      maxLength="200"
                                    />
                                  </FormGroup>
                                </Col> */}
                              </Row>
                              <Row>
                                <Col xs="12">
                                  <FormGroup>
                                    <Label>
                                      Notes
                                    </Label>
                                    <CKEditor
                                      editor={ClassicEditor}
                                      // data={item.description || ""}
                                      config={{ placeholder: "Please enter description" }}
                                      //onReady={editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log('Editor is ready to use!', editor);
                                      //}}
                                      onChange={(event, editor) => {
                                        const data = editor?.getData();
                                        this.handleChange("notes", data)
                                      }}
                                      data={this?.state?.notes}
                                    />

                                  </FormGroup>
                                </Col>
                              </Row>
                              <div className="text-right ">
                                <button className='btn btn-primary btn-md m-2' type='button'

                                  disabled={this.state?.loading}
                                  onClick={() => { this.submitData() }}>Submit </button></div>
                            </CardBody>

                          </Collapse>

                        </Card>

                      </Fade>
                    </Col>

                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default generatePmrReport