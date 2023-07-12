import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, FormGroup, Table, Input, Row, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { Multiselect } from 'multiselect-react-dropdown';
import axiosInstance from "./../../../common/axiosInstance"

class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      practitionerId: 0,
      basicInfo: "",
      institute: "",
      redirect: false,
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
    if (this.state.redirect) {
      this.props.history.push('/institutes/list');
    }
  }

  //get detail
  componentDidMount() {
    const param = this.props.match.params;

    if (param.id != undefined) {
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
            institute: rData.institutePractitioner,
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

    const { loading, practitionerId,
      basicInfo,
      institute,
      errors } = this.state;

    return (

      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Practitioner Details</h5>
          </Col>
          <Col xs="2" lg="2">
            <Link to="/institutes/list">
              <button className="btn btn-primary btn-block">Institutions</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardBody>
                <Row>
                  {/*<Col xs="6">
                      <FormGroup>
                        <Label>Accession No </Label>
                        <Input type="text" className="txtReadOnly" disabled name="accessionNo" value={basicInfo.practitionerKey} />
                      </FormGroup>
                    </Col>*/}
                  <Col xs="6">
                    <FormGroup>
                      <Label>Name </Label>
                      <Input type="text" className="txtReadOnly" disabled name="practitionerName" value={basicInfo.firstName != null ? (basicInfo.firstName + " " + basicInfo.middleName + " " + basicInfo.lastName) : ""} />
                    </FormGroup>
                  </Col>
                  <Col xs="6">
                    <FormGroup>
                      <Label>Qualification </Label>
                      <Input type="text" className="txtReadOnly" disabled name="dob" value={basicInfo.qualification == null ? "" : basicInfo.qualification} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="6">
                    <FormGroup>
                      <h5 className="mt-2">Institute Name </h5>
                      <Input type="text" className="txtReadOnly" disabled name="pInstitute" value={institute != null ? (institute.instituteName) : "Not Assigned"} />
                    </FormGroup>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col xs="12">
                    <h5 className="mt-2">Practitioner Personal Details</h5>
                    <Table responsive bordered key="tblpractitioners">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {basicInfo != null && basicInfo != "" ?
                          (<tr>
                            <td>{basicInfo.email}</td>
                            <td>{basicInfo.mobile} <br />{basicInfo.phoneNumber}</td>
                            <td>{basicInfo.residentAddress + " - " + basicInfo.residentPostalCode}</td>
                          </tr>
                          ) : (
                            <tr>
                              <td colSpan="3" className="tdCenter">No records...</td></tr>
                          )
                        }
                      </tbody>
                    </Table>
                  </Col>
                </Row>
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
      </div >
    );
  }
}

export default Details;
