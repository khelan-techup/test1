import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  FormGroup,
  Form,
  Input,
  Row,
  Label,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import { toast } from "react-toastify";

class EmergencyDetail extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      PatientId: 0,
      PatientEmergencyId: 0,
      FirstName: "",
      MiddleName: "",
      LastName: "",
      UserName: "",
      Email: "",
      CountryId: "",
      countries: [],
      StateId: "",
      states: [],
      CityId: "",
      cities: [],
      errors: {
        StateId: "",
        CityId: "",
      },
      Mobile: "",
      Address: "",
      PhoneNumber: "",
      PostalCode: "",
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
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
      this.props.history.push("/patient/emergency/list");
    }
  };

  componentDidMount() {
    // const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Common/GetAllCountry';
    // let data = JSON.stringify({
    //     isDeleted: false,
    //     searchString: ''
    // });
    // axios.post(url, data, {
    //     headers: {
    //         'Content-Type': 'application/json; charset=utf-8'
    //     }
    // }).then(result => {
    //     if (result.data.flag) {
    //         this.setState({
    //             countries: result.data.outdata
    //         }, () => {
    //             const param = this.props.match.params;
    //             if (param.id != undefined) {
    //                 this.getData(param.id);
    //             }
    //             else {
    //                 this.setState({ loading: false });
    //             }
    //         });
    //     }
    // }).catch(error => {
    //     console.log(error);
    // });
  }

  //get detail(for update)
  getData(id) {
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/PatientEmergency/GetById?id=" + id;

    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState(
            {
              PatientId: rData.patientId,
              FirstName: rData.firstName,
              MiddleName: rData.middleName,
              LastName: rData.lastName,
              Email: rData.email,
              Mobile: rData.mobile,
              Address: rData.address,
              PatientEmergencyId: rData.patientEmergencyId,
              PhoneNumber: rData.phoneNumber,
              PostalCode: rData.postalCode,
              CountryId: rData.countryId,
              loading: false,
              //, StateId: rData.StateId, CityId: rData.CityId
            },
            () => {
              if (rData.countryId != null) {
                this.getStateData(rData.countryId, rData.stateId, rData.cityId);
              }
            }
          );
          //console.log(this.state);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
  }

  getStateData(CountryId, StateId, CityId) {
    const apiroute = window.$APIPath;

    const url = apiroute + "/api/BE_Common/GetStateByCountryId?Id=" + CountryId;

    axios
      .post(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          //console.log(result.data);
          this.setState(
            { states: result.data.outdata, StateId: StateId },
            () => {
              if (StateId != "" || StateId != null) {
                this.getCityData(StateId, CityId);
              }
            }
          );
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  getCityData(StateId, CityId) {
    const apiroute = window.$APIPath;

    const url = apiroute + "/api/BE_Common/GetCityByStateId?Id=" + StateId;

    axios
      .post(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          //console.log(result.data);
          this.setState({ cities: result.data.outdata, CityId: CityId });
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.CityId == undefined || this.state.CityId == "") {
      errors.CityId = "Please select city.";
    }
    if (this.state.StateId == undefined || this.state.StateId == "") {
      errors.StateId = "Please select state.";
    }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;

    switch (name) {
      case "StateId":
        errors.StateId = !value ? "Please select state." : "";

        break;
      case "CityId,":
        errors.CityId = !value ? "Please select city." : "";
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => {
      if (name == "CountryId") {
        if (value != "") {
          this.getStateData(value, "", "");
          this.setState({ cities: [], CityId: "" });
        } else {
          this.setState({ states: [], StateId: "", cities: [], CityId: "" });
        }
      }
      if (name == "StateId") {
        if (value != "") {
          this.getCityData(value, "");
        } else {
          this.setState({ cities: [], CityId: "" });
        }
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    var userToken = JSON.parse(localStorage.getItem("Usertoken"));
    let pid = userToken.patientId == null ? 0 : userToken.patientId;

    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      if (this.state.PatientEmergencyId == 0) {
        url = apiroute + "/api/PatientEmergency/Save";
      } else {
        url = apiroute + "/api/PatientEmergency/Update";
      }

      let data = JSON.stringify({
        PatientId: parseInt(pid),
        FirstName: this.state.FirstName,
        LastName: this.state.LastName,
        MiddleName: this.state.MiddleName,
        Email: this.state.Email,
        Address: this.state.Address,
        PhoneNumber: this.state.PhoneNumber,
        Mobile: this.state.Mobile,
        PostalCode: this.state.PostalCode,
        CountryId: parseInt(this.state.CountryId),
        StateId: parseInt(this.state.StateId),
        CityId: parseInt(this.state.CityId),
        PatientEmergencyId: parseInt(this.state.PatientEmergencyId),
      });

      // console.log(data);
      axios
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            this.setState({
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message,
              redirect: true,
            });
            toast.success(result.data.message);
            this.props.history.push("/patient/emergency/list");
          } else {
            this.setState({
              // modal: !this.state.modal,
              // modalTitle: 'Error',
              // modalBody: result.data.message,
              loading: false,
            });
            toast.error(result.data.message);
          }
        })
        .catch((error) => {
          //console.log(error);
          // this.setState({
          //     modal: !this.state.modal,
          //     modalTitle: 'Error',
          //     modalBody: error.message
          // });
          toast.error(error.message);
          //this.setState({ authError: true, error: error });
        });
    } else {
      // this.setState({
      //     modal: !this.state.modal,
      //     modalTitle: 'Error',
      //     modalBody: "Please fill all the fields."
      // });
      toast.error("Please fill all the fields.");
      this.setState({ loading: false });
    }
  }

  render() {
    if (localStorage.getItem("AUserToken") == null) {
      return <Redirect to="/login" />;
    }

    const {
      loading,
      FirstName,
      MiddleName,
      LastName,
      Email,
      CountryId,
      countries,
      StateId,
      states,
      CityId,
      cities,
      Mobile,
      Address,
      PhoneNumber,
      PostalCode,
      errors,
    } = this.state;

    return (
      <div className="animated fadeIn">
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Emergency Contact
            </h5>
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
                          <label className="col-12 col-form-label">
                            First Name
                          </label>
                          <div className="col-12">
                            <Input
                              className="form-control here"
                              type="text"
                              maxLength="100"
                              tabIndex="1"
                              placeholder="Enter your First Name"
                              name="FirstName"
                              value={FirstName}
                              onChange={this.handleInputChange.bind(this)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="col-12 col-form-label">
                            Middle Name
                          </label>
                          <div className="col-12">
                            <Input
                              className="form-control here"
                              type="text"
                              maxLength="100"
                              tabIndex="2"
                              placeholder="Enter your Middle Name"
                              name="MiddleName"
                              value={MiddleName}
                              onChange={this.handleInputChange.bind(this)}
                              required
                              autoComplete="MiddleName"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group row my-4">
                        <div className="col-md-6">
                          <label className="col-12 col-form-label">
                            Last Name
                          </label>
                          <div className="col-12">
                            <Input
                              className="form-control here"
                              type="text"
                              maxLength="100"
                              tabIndex="3"
                              placeholder="Enter your Last Name"
                              name="LastName"
                              value={LastName}
                              onChange={this.handleInputChange.bind(this)}
                              required
                              autoComplete="LastName"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="col-12 col-form-label">Email</label>
                          <div className="col-12">
                            <Input
                              className="form-control here"
                              type="text"
                              maxLength="100"
                              tabIndex="4"
                              name="Email"
                              placeholder="Enter a valid email address"
                              value={Email}
                              onChange={this.handleInputChange.bind(this)}
                              required
                              autoComplete="Email"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group row my-4">
                        <div className="col-md-6">
                          <label className="col-12 col-form-label">
                            Country
                          </label>
                          <div className="col-12">
                            <Input
                              type="select"
                              className="custom-select mb-3"
                              tabIndex="5"
                              name="CountryId"
                              value={CountryId}
                              onChange={this.handleInputChange.bind(this)}
                            >
                              <option value="">Select Country</option>
                              {countries.map((data, i) => {
                                return (
                                  <option key={i} value={data.id}>
                                    {data.name}
                                  </option>
                                );
                              })}
                            </Input>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="col-12 col-form-label">State</label>
                          <div className="col-12">
                            <Input
                              type="select"
                              className="custom-select mb-3"
                              tabIndex="6"
                              name="StateId"
                              value={StateId}
                              onChange={this.handleInputChange.bind(this)}
                            >
                              <option value="">Select State</option>
                              {states.map((data, i) => {
                                return (
                                  <option key={i} value={data.id}>
                                    {data.name}
                                  </option>
                                );
                              })}
                            </Input>
                          </div>
                        </div>
                      </div>

                      <div className="form-group row my-4">
                        <div className="col-md-6">
                          <label className="col-12 col-form-label">City</label>
                          <div className="col-12">
                            <Input
                              type="select"
                              className="custom-select mb-3"
                              tabIndex="7"
                              name="CityId"
                              value={CityId}
                              onChange={this.handleInputChange.bind(this)}
                            >
                              <option value="">Select City</option>7
                              {cities.map((data, i) => {
                                return (
                                  <option key={i} value={data.id}>
                                    {data.name}
                                  </option>
                                );
                              })}
                            </Input>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="col-12 col-form-label">
                            PostalCode
                          </label>
                          <div className="col-12">
                            <Input
                              className="form-control here"
                              type="text"
                              maxLength="100"
                              tabIndex="8"
                              name="PostalCode"
                              placeholder="Enter a PostalCode"
                              value={PostalCode}
                              onChange={this.handleInputChange.bind(this)}
                              required
                              autoComplete="PostalCode"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group row my-4">
                        <div className="col-md-6">
                          <label className="col-12 col-form-label">
                            Primary Phone
                          </label>
                          <div className="col-12">
                            <Input
                              className="form-control here"
                              type="text"
                              maxLength="100"
                              tabIndex="10"
                              name="Mobile"
                              placeholder="Enter primary phone"
                              value={Mobile}
                              onChange={this.handleInputChange.bind(this)}
                              required
                              autoComplete="Mobile"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="col-12 col-form-label">
                            Secondary Phone
                          </label>
                          <div className="col-12">
                            <Input
                              className="form-control here"
                              type="text"
                              maxLength="100"
                              tabIndex="9"
                              name="PhoneNumber"
                              placeholder="Enter secondary phone"
                              value={PhoneNumber}
                              onChange={this.handleInputChange.bind(this)}
                              required
                              autoComplete="PhoneNumber"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group row my-4">
                        <div className="col-md-12">
                          <label className="col-12 col-form-label">
                            Address
                          </label>
                          <div className="col-12">
                            <textarea
                              className="form-control here"
                              type="text"
                              maxLength="100"
                              tabIndex="11"
                              name="Address"
                              placeholder="Enter a Address"
                              value={Address}
                              onChange={this.handleInputChange.bind(this)}
                              required
                              autoComplete="Address"
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      {/* {loading ?
                                                                        <div className="form-group row my-4 mx-0">
                                                                            <div className="animated fadeIn pt-1 text-center">Loading...</div>
                                                                        </div>
                                                                        : */}
                      <div className="form-group row my-4 mx-0">
                        <Button type="submit" size="sm" color="primary">
                          <i className="fa fa-dot-circle-o"></i> Submit
                        </Button>{" "}
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
      </div>
    );
  }
}

export default EmergencyDetail;
