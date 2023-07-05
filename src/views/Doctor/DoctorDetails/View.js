import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  FormGroup,
  Table,
  Input,
  Row,
  Label,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import { Multiselect } from "multiselect-react-dropdown";
import axiosInstance from "./../../../common/axiosInstance"
import { BE_Practitioner_GetById } from "../../../common/allApiEndPoints";

class View extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      practitionerId: 0,
      basicInfo: "",
      institute: "",
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
      //options: [{name: 'Srigar', id: 1},{name: 'Sam', id: 2}]
    };
    this.state = this.initialState;
  }

  //modal close button event
  handleModalClose = () => {
    this.setState({
      modal: false,
      modalTitle: "",
      modalBody: "",
    });
    if (this.state.redirect) {
      this.props.history.push("/practitioners/list");
    }
  };

  //get detail
  componentDidMount() {
    const param = this.props.match.params;

    if (param.id != undefined) {
      this.getData(param.id);
    } else {
      this.setState({ loading: false });
    }
  }

  //get detail(for update)
  getData = (id) => {
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Practitioner/GetById?id=" + id + "";
    const url = apiroute + BE_Practitioner_GetById(id)

    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log(result);
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState({
            practitionerId: rData.practitionerId,
            basicInfo: rData,
            institute: rData.institutePractitioner,
            loading: false,
          });
          // console.log(this.state);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
  };

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
  }

  render() {
    if (localStorage.getItem("AUserToken") == null) {
      return <Redirect to="/login" />;
    }

    const { loading, practitionerId, basicInfo, institute, errors } =
      this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Practitioner Details
            </h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to={"/practitioners/modify/" + basicInfo.practitionerId}>
              <button className="btn btn-primary btn-block">Edit</button>
            </Link>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/practitioners/list">
              <button className="btn btn-primary btn-block">List</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            <Card className="viewPractitionerDetails ">
              <CardBody>
                <Row>
                  {/* <Col xs="6">
                      <FormGroup>
                        <Label>Accession No </Label>
                        <Input type="text" className="txtReadOnly" disabled name="accessionNo" value={basicInfo.practitionerKey} />
                      </FormGroup>
                    </Col>*/}
                  <Col xs="3">
                    <FormGroup>
                      <Label>Name </Label>
                      <span className="form-control p-0" readonly>
                        {basicInfo.firstName != null
                          ? basicInfo.firstName +
                          " " +
                          basicInfo.middleName +
                          " " +
                          basicInfo.lastName
                          : ""}
                      </span>


                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label>Degree Earned </Label>
                      <span className="form-control">
                        {basicInfo.qualification == null
                          ? ""
                          : basicInfo.qualification
                        }
                      </span>
                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label>IRB Number </Label>
                      <span className="form-control">
                        {!basicInfo.irbNo ? "Not available" : basicInfo.irbNo
                        }
                      </span>

                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <FormGroup>
                      <Label>NPI Number </Label>
                      <span className="form-control">
                        {!basicInfo.npiNumber ? "Not available" : basicInfo.npiNumber
                        }
                      </span>

                    </FormGroup>
                  </Col>
                </Row>
                {/*<Row>*/}
                {/*  <Col xs="6">*/}
                {/*    <FormGroup>*/}
                {/*      <h5 className="mt-2">Institute Name </h5>*/}
                {/*      <Input type="text" className="txtReadOnly" disabled name="pInstitute" value={institute != null ? (institute.instituteName) : "Not Assigned"} />*/}
                {/*    </FormGroup>*/}
                {/*  </Col>*/}
                {/*</Row>*/}
                {/*<br />*/}
                <Row>
                  <Col xs="12">
                    <h5 className="mt-2">Practitioner Personal Details</h5>
                    <Table responsive bordered key="tblpractitioners">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Phone</th>
                          {/* <th>Address</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {basicInfo != null && basicInfo != "" ? (
                          <tr>
                            <td><a
                              className="form-control"
                              href={`mailto: ${basicInfo.email}`}
                            >{basicInfo.email}</a></td>
                            <td>
                              <a
                                className="text-dark"
                                href={`phoneto: ${basicInfo.mobile}`}
                              >{basicInfo.mobile}</a> <br />
                              <a
                                className="text-dark"
                                href={`phoneto: ${basicInfo.phoneNumber}`}
                              >{basicInfo.phoneNumber}</a>
                            </td>
                            {/* <td>
                              {basicInfo.residentAddress +
                                " - " +
                                basicInfo.residentPostalCode}
                            </td> */}
                          </tr>
                        ) : (
                          <tr>
                            <td colSpan="3" className="tdCenter">
                              No records...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <br />
                {/* {console.log(basicInfo)} */}
                <Row>
                  <Col xs="12">
                    <h5 className="mt-2">Clinic Details:</h5>
                    <Row>
                      <Col xs="4">
                        <FormGroup>
                          <Label>Clinic Name</Label>
                          <p className="">{
                            basicInfo.clinicName !== null
                              ? basicInfo.clinicName
                              : "Not Assigned"
                          }</p>

                        </FormGroup>
                      </Col>
                      <Col xs="4">

                        <FormGroup>
                          <Label>Clinic Street</Label>
                          <p className="">
                            {
                              basicInfo.clinicStreet !== null
                                ? basicInfo.clinicStreet
                                : "Not Assigned"
                            }
                          </p>


                        </FormGroup>
                      </Col>
                      <Col xs="4">
                        <FormGroup>
                          <Label>Clinic State</Label>
                          <p className="">
                            {
                              basicInfo.clinicStateId !== null
                                ? basicInfo.clinicState
                                : "Not Assigned"
                            }
                          </p>

                        </FormGroup>
                      </Col>

                      <Col xs="4">
                        <FormGroup>
                          <Label>Clinic City</Label>
                          <p className="f">
                            {
                              basicInfo.clinicCityId !== null
                                ? basicInfo.clinicCity
                                : "Not Assigned"
                            }
                          </p>

                        </FormGroup>
                      </Col>
                      <Col xs="4">
                        <FormGroup>
                          <Label>Clinic Postal Code</Label>
                          <p className="">
                            {
                              basicInfo.clinicPostalCode !== null
                                ? basicInfo.clinicPostalCode
                                : "Not Assigned"
                            }
                          </p>

                        </FormGroup>
                      </Col>


                    </Row>

                  </Col>

                </Row>

                <br />
                <Row>
                  <Col xs="12">
                    <h5 className="mt-2">Medical Licenses</h5>
                    <Table responsive bordered key="tblpractitioners">
                      <thead>
                        <tr>
                          <th>License No.</th>
                          <th>Country</th>
                          <th>State</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {console.log(basicInfo)} */}
                        {basicInfo?.practitionerMedical?.length > 0 ? (
                          basicInfo?.practitionerMedical.map((license, i) => {
                            return (
                              <tr key={i}>
                                <td>{license?.licenseNo}</td>
                                <td>{license?.countryName}</td>
                                <td>{license?.stateName}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="3" className="tdCenter">
                              No records...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col xs="12">
                    <h5 className="mt-2">Contact Persons</h5>
                    <Table responsive bordered key="tblpractitioners">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {console.log(basicInfo)} */}
                        {basicInfo?.practitionerContactPerson?.length > 0 ? (
                          basicInfo?.practitionerContactPerson.map(
                            (contact, i) => {
                              return (
                                <tr key={i}>
                                  <td>{contact?.name}</td>
                                  <td><a
                                    className="form-control"
                                    href={`mailto: ${contact?.email}`}
                                  >{contact?.email}</a></td>
                                  <td>
                                    <a
                                      className="form-control"
                                      href={`phoneto: ${contact?.mobile}`}
                                    >{!contact?.mobile ? "N/A" : contact?.mobile}</a></td>
                                </tr>
                              );
                            }
                          )
                        ) : (
                          <tr>
                            <td colSpan="3" className="tdCenter">
                              No records...
                            </td>
                          </tr>
                        )}
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
      </div>
    );
  }
}

export default View;
