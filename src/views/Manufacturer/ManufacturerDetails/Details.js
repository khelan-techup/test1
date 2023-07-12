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
import { Multiselect } from "multiselect-react-dropdown";
import { toast } from "react-toastify";

class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      manufacturerId: 0,
      companyName: "",
      contactPerson: "",
      accessionNo: "",
      fax: "",
      website: "",
      address: "",
      userId: 0,
      countryId: 0,
      countries: [],
      stateId: 0,
      states: [],
      cityId: 0,
      cities: [],
      postalCode: "",
      email: "",
      phoneNumber: "",
      mobile: "",
      errors: {
        companyName: "",
        fax: "",
        website: "",
        address: "",
        postalCode: "",
        email: "",
        mobile: "",
      },
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
      this.props.history.push("/manufacturer/list");
    }
  };

  //get detail
  componentDidMount() {
    //var deses=[{name: 'Srigar', id: 1},{name: 'Sam', id: 2}];
    //this.setState({ disease: deses});
    this.getCountry();
    this.setState({ loading: false });
  }

  getCountry() {
    const param = this.props.match.params;
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/BE_Common/GetAllCountry";
    let data = JSON.stringify({
      isDeleted: false,
      searchString: "",
    });
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState(
            {
              countries: result.data.outdata,
            },
            () => {
              if (param.id != undefined) {
                this.getData(param.id);
              }
            }
          );
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  //get detail(for update)
  getData = (id) => {
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/BE_Manufacturer/GetById?id=" + id + "";

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
              manufacturerId: rData.manufacturerId,
              companyName: rData.companyName,
              accessionNo: rData.accessionNo,
              fax: rData.fax,
              website: rData.website,
              address: rData.address,
              countryId: rData.countryId,
              userId: rData.userId,
              contactPerson: rData.contactPerson,
              postalCode: rData.postalCode,
              email: rData.email,
              phoneNumber: rData.phoneNumber,
              mobile: rData.mobile,
            },
            () => {
              if (rData.countryId != null) {
                this.getStateData(rData.countryId, rData.stateId, rData.cityId);
              } else {
                this.setState({ loading: false });
              }
            }
          );
          //console.log(this.state);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  //form reset button click
  onResetClick(e) {
    e.preventDefault();
    this.setState({
      loading: false,
      companyName: "",
      accessionNo: "",
      fax: "",
      website: "",
      address: "",
      countryId: 0,
      countries: [],
      stateId: 0,
      states: [],
      cityId: 0,
      cities: [],
      postalCode: "",
      email: "",
      phoneNumber: "",
      mobile: "",
      errors: {
        companyName: "",
        fax: "",
        website: "",
        address: "",
        postalCode: "",
        email: "",
        mobile: "",
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
    });
  }

  //input handle input change and validation
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;

    const validMobileRegex = RegExp(/^[0-9+() -]+$/);
    const validNumberRegex = RegExp(/^[0-9]+$/);
    const validAlphaRegex = RegExp(/^[a-zA-Z \b]+$/);
    const validEmailRegex = RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    const validWebsiteRegex = RegExp(
      /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
    );

    switch (name) {
      case "companyName":
        errors.companyName = !value
          ? "Please enter company name."
          : validAlphaRegex.test(value)
          ? ""
          : "Only alphabets allowed.";
        this.setState({ companyName: value.replace(/[^a-zA-Z \b]+$/, "") });
        break;

      case "email":
        errors.email = !value
          ? "Please enter email."
          : validEmailRegex.test(value)
          ? ""
          : "Invalid Email.";
        break;

      case "mobile":
        errors.mobile = value
          ? validMobileRegex.test(value)
            ? ""
            : "Only numbers allowed."
          : "";
        this.setState({
          mobile: value
            .replace(/\D+/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
        });
        break;

      //case 'Address':
      //    errors.Address = (!value) ? 'Please enter address.' : '';
      //    break;

      case "phoneNumber":
        errors.phoneNumber = value
          ? validMobileRegex.test(value)
            ? ""
            : "Only numbers allowed."
          : "";
        this.setState({
          phoneNumber: value
            .replace(/\D+/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
        });
        break;

      case "postalCode":
        errors.postalCode = value
          ? validNumberRegex.test(value)
            ? ""
            : "Only numbers allowed."
          : "";
        this.setState({ postalCode: value.replace(/[^0-9]+$/, "") });
        break;

      case "website":
        errors.website = value
          ? validWebsiteRegex.test(value)
            ? ""
            : "Invalid website url."
          : "";
        break;
      default:
        //(!value) ? '' :'This field is required.'
        break;
    }

    this.setState({ errors }, () => {
      if (name == "countryId") {
        if (value != "") {
          this.getStateData(value, "", "");
          this.setState({ cities: [], cityId: "" });
        } else {
          this.setState({ states: [], stateId: "", cities: [], cityId: "" });
        }
      }
      if (name == "stateId") {
        if (value != "") {
          this.getCityData(value, "");
        } else {
          this.setState({ cities: [], cityId: "" });
        }
      }
    });
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.companyName == undefined || this.state.companyName == "") {
      errors.companyName = "Please enter company name.";
    }
    if (this.state.email == undefined || this.state.email == "") {
      errors.email = "Please enter email.";
    }
    if (this.state.mobile == undefined || this.state.mobile == "") {
      errors.mobile = "Please enter primary phone.";
    }
    // if (this.state.website == undefined || this.state.website == '') {
    //   errors.website = 'This field is required.';
    // }
    // if (this.state.fax == undefined || this.state.fax == '') {
    //   errors.fax = 'This field is required.';
    // }
    // if (this.state.address == undefined || this.state.address == '') {
    //   errors.address = 'This field is required.';
    // }
    // if (this.state.postalCode == undefined || this.state.postalCode == '') {
    //   errors.postalCode = 'This field is required.';
    // }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  };

  //form submit
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    //console.log('Submit');
    //console.log(this.state);
    let url = "";

    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      if (this.state.manufacturerId == 0) {
        url = apiroute + "/api/BE_Manufacturer/Save";
      } else {
        url = apiroute + "/api/BE_Manufacturer/Update";
      }

      let data = JSON.stringify({
        manufacturerId: this.state.manufacturerId,
        companyName: this.state.companyName,
        contactPerson: this.state.contactPerson,
        accessionNo: this.state.accessionNo,
        fax: this.state.fax,
        website: this.state.website,
        address: this.state.address,
        cityId:
          this.state.cityId == "" || this.state.cityId == 0
            ? null
            : parseInt(this.state.cityId),
        countryId:
          this.state.countryId == "" || this.state.countryId == 0
            ? null
            : parseInt(this.state.countryId),
        stateId:
          this.state.stateId == "" || this.state.stateId == 0
            ? null
            : parseInt(this.state.stateId),
        postalCode: this.state.postalCode,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber,
        mobile: this.state.mobile,
        registerType: "A",
        createdBy: userToken.userId == null ? 0 : userToken.userId,
        UserId: parseInt(this.state.userId),
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
              loading: false,
            });
            toast.success(result.data.message);
            this.props.history.push("/manufacturer/list");
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
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: error.message,
            loading: false,
          });
          toast.error(error.message);
          //this.setState({ authError: true, error: error });
        });
    } else {
      this.setState({ loading: false });
    }
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
            { states: result.data.outdata, stateId: StateId },
            () => {
              if (StateId != "" || StateId != null) {
                this.getCityData(StateId, CityId);
              } else {
                this.setState({ loading: false });
              }
            }
          );
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
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
          this.setState({
            cities: result.data.outdata,
            cityId: CityId,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
  }

  render() {
    if (localStorage.getItem("AUserToken") == null) {
      return <Redirect to="/login" />;
    }

    const {
      loading,
      manufacturerId,
      companyName,
      accessionNo,
      fax,
      website,
      address,
      countryId,
      countries,
      stateId,
      contactPerson,
      states,
      cityId,
      cities,
      postalCode,
      email,
      phoneNumber,
      mobile,
      errors,
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Manufacturer Detail
            </h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/manufacturer/list">
              <button className="btn btn-primary btn-block">List</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardBody>
                <Form
                  className="form-horizontal"
                  onSubmit={this.handleSubmit.bind(this)}
                >
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label>
                          Manufacturer Name{" "}
                          <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.companyName ? "is-invalid" : "is-valid"
                          }
                          name="companyName"
                          value={companyName}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter company name"
                          maxLength="200"
                        />
                        {<span className="error">{errors.companyName}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Contact Person </Label>
                        <Input
                          type="text"
                          name="contactPerson"
                          value={contactPerson}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter contact person"
                          maxLength="200"
                        />
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Email <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={errors.email ? "is-invalid" : "is-valid"}
                          name="email"
                          value={email}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter email"
                          maxLength="100"
                        />
                        {<span className="error">{errors.email}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Primary Phone <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={errors.mobile ? "is-invalid" : "is-valid"}
                          name="mobile"
                          value={mobile}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter primary phone"
                          maxLength="20"
                        />
                        {<span className="error">{errors.mobile}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>Secondary Phone </Label>
                        <Input
                          type="text"
                          name="phoneNumber"
                          value={phoneNumber}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter secondary phone"
                          maxLength="20"
                        />
                        {<span className="error">{errors.phoneNumber}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Fax </Label>
                        <Input
                          type="text"
                          name="fax"
                          value={fax}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter fax"
                          maxLength="20"
                        />
                        {<span className="error">{errors.fax}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Website </Label>
                        <Input
                          type="text"
                          name="website"
                          value={website}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter website"
                          maxLength="100"
                        />
                        {<span className="error">{errors.website}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="12">
                      <FormGroup>
                        <Label>Address </Label>
                        <Input
                          type="textarea"
                          name="address"
                          value={address}
                          onChange={this.handleInputChange.bind(this)}
                          maxLength="500"
                        />
                        {<span className="error">{errors.address}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Country </Label>
                        <Input
                          type="select"
                          className="custom-select"
                          name="countryId"
                          value={countryId}
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
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>State </Label>
                        <Input
                          type="select"
                          className="custom-select"
                          name="stateId"
                          value={stateId}
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
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>City </Label>
                        <Input
                          type="select"
                          className="custom-select"
                          name="cityId"
                          value={cityId}
                          onChange={this.handleInputChange.bind(this)}
                        >
                          <option value="">Select City</option>
                          {cities.map((data, i) => {
                            return (
                              <option key={i} value={data.id}>
                                {data.name}
                              </option>
                            );
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Postal Code </Label>
                        <Input
                          type="text"
                          name="postalCode"
                          value={postalCode}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter postal code"
                          maxLength="10"
                        />
                        {<span className="error">{errors.postalCode}</span>}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input
                          type="hidden"
                          name="manufacturerId"
                          value={manufacturerId}
                        />
                        <Button
                          type="submit"
                          disabled={loading}
                          color="primary"
                        >
                          <i className="fa fa-dot-circle-o"></i> Submit
                        </Button>{" "}
                        <Button
                          type="reset"
                          color="danger"
                          onClick={this.onResetClick.bind(this)}
                        >
                          <i className="fa fa-ban"></i> Reset
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
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

export default Details;
