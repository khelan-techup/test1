import React, { Component } from 'react';
import {
  Label, Card, CardBody, CardFooter, Col, Container, FormGroup, Input, Row, CardHeader
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import Confirm from "../../CustomModal/Confirm";
import "@reach/dialog/styles.css";
import { toast } from 'react-toastify';
import axiosInstance from "./../../../common/axiosInstance"

class PractitionerIRB extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      practitionerId: 0,
      basicInfo: "",
      modal: false,
      modalTitle: '',
      modalBody: '',
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
  }

  //get detail
  componentDidMount() {
    const param = this.props.match.params;

    if (param.id != undefined) {
      this.setState({ practitionerId: param.id });
      this.getData(param.id);
    }
    else {
      this.setState({ loading: false });
    }
  }

  //get detail(for update)
  getData = (id) => {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_Practitioner/GetById?id=' + id + '';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        // console.log(result);
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState({
            practitionerId: rData.practitionerId,
            basicInfo: rData,
            loading: false
          });
          // console.log(this.state);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
      });
  }

  //Approve IRB No
  ApproveIRBNo = (e, id) => {
    //e.preventDefault();
    //var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    //let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_Practitioner/ApproveIRBNo?id=' + id + '';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message
          }, this.getData(this.state.practitionerId));
          toast.success(result.data.message)

        } else {
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
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  //Reject IRB No
  RejectIRBNo = (e, id) => {
    //e.preventDefault();
    //var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    //let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_Practitioner/RejectIRBNo?id=' + id + '';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message
          }, this.getData(this.state.practitionerId));
          toast.success(result.data.message)

        } else {
          this.setState({ loading: false });
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
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  render() {
    const { loading, practitionerId,
      basicInfo,
      errors } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="12" lg="10" xl="8">
              <Card className="mx-4">
                <CardHeader className="text-center text-white bg-primary">
                  <h2>Neo7Logix</h2>
                </CardHeader>
                <CardBody className="p-4">
                  <h4>Practitioner Details</h4>
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label>IRB No </Label>
                        <Input type="text" className="txtReadOnly" disabled name="IRBNo" value={basicInfo.irbNo != null ? basicInfo.irbNo : ""} />
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Name </Label>
                        <Input type="text" className="txtReadOnly" disabled name="practitionerName" value={basicInfo.firstName != null ? (basicInfo.firstName + " " + basicInfo.middleName + " " + basicInfo.lastName) : ""} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="4">
                      <FormGroup>
                        <Label>Qualification </Label>
                        <Input type="text" className="txtReadOnly" disabled name="dob" value={basicInfo.qualification == null ? "" : basicInfo.qualification} />
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>Email </Label>
                        <Input type="text" className="txtReadOnly" disabled name="email" value={basicInfo.email != null ? basicInfo.email : ""} />
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>Phone </Label>
                        <Input type="text" className="txtReadOnly" disabled name="mobile" value={basicInfo.mobile == null ? "" : basicInfo.mobile} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <Label>Address </Label>
                        <Input type="text" className="txtReadOnly" disabled name="address" value={(basicInfo.residentAddress != null ? basicInfo.residentAddress + " - " : "") + basicInfo.residentPostalCode} />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter className="p-4">
                  {basicInfo.irbStatus == "P" ?
                    <Row>
                      <Col xs="12" sm="2">
                        <Confirm title="Confirm" description="Are you sure want to approve IRB no?">
                          {confirm => (
                            <Link className="btn btn-success" to="#" onClick={confirm(e => this.ApproveIRBNo(e, basicInfo.practitionerId))}><b>Approve</b></Link>
                          )}
                        </Confirm>
                      </Col>
                      <Col xs="12" sm="2">
                        <Confirm title="Confirm" description="Are you sure want to reject IRB no?">
                          {confirm => (
                            <Link className="btn btn-danger" to="#" onClick={confirm(e => this.RejectIRBNo(e, basicInfo.practitionerId))}><b>Reject</b></Link>
                          )}
                        </Confirm>
                      </Col>
                    </Row>
                    :
                    (basicInfo.irbStatus == "A" ?
                      <Row>
                        <Col xs="12" sm="6">
                          <span className="badge badge-success" style={{ "padding": "10px", "color": "#fff", "fontSize": "14px" }}>Approved</span>
                        </Col>
                      </Row>
                      :
                      <Row>
                        <Col xs="12" sm="6">
                          <span className="badge badge-danger" style={{ "padding": "10px", "color": "#fff", "fontSize": "14px" }}>Rejected</span>
                        </Col>
                      </Row>
                    )
                  }
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>

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

export default PractitionerIRB;
