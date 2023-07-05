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
      instituteId: 0,
      instituteName: "",
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
      phoneNo: "",
      mobileNo: "",
      userId: 0,
      errors: {
        instituteName: "",
        fax: "",
        website: "",
        address: "",
        postalCode: "",
        email: "",
        mobileNo: "",
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
      disease: [],
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
      this.props.history.push("/institutes/list");
    }
  };

  //get detail
  componentDidMount() {
    //var deses=[{name: 'Srigar', id: 1},{name: 'Sam', id: 2}];
    //this.setState({ disease: deses});
    this.getCountry();
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
        // console.log(error);
        this.setState({ loading: false });
      });
  }

  //get detail(for update)
  getData = (id) => {
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/BE_Institute/GetById?id=" + id + "";

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
              instituteId: rData.instituteId,
              instituteName: rData.instituteName,
              accessionNo: rData.accessionNo,
              fax: rData.fax,
              website: rData.website,
              address: rData.address,
              countryId: rData.countryId,
              userId: rData.userId,
              postalCode: rData.postalCode,
              email: rData.email,
              phoneNo: rData.phoneNumber,
              mobileNo: rData.mobile,
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
      instituteName: "",
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
      phoneNo: "",
      mobileNo: "",
      errors: {
        instituteName: "",
        fax: "",
        website: "",
        address: "",
        postalCode: "",
        email: "",
        mobileNo: "",
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
    const validWebsiteRegex = RegExp(
      /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
    );
    const validEmailRegex = RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    switch (name) {
      case "instituteName":
        errors.instituteName = !value
          ? "Please enter institute name."
          : validAlphaRegex.test(value)
          ? ""
          : "Only alphabets allowed.";
        this.setState({ instituteName: value.replace(/[^a-zA-Z \b]+$/, "") });
        break;

      case "mobileNo":
        errors.mobileNo = value
          ? validMobileRegex.test(value)
            ? ""
            : "Only numbers allowed."
          : "";
        this.setState({
          mobileNo: value
            .replace(/\D+/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
        });
        break;

      //case 'Address':
      //    errors.Address = (!value) ? 'Please enter address.' : '';
      //    break;

      case "phoneNo":
        errors.phoneNo = value
          ? validMobileRegex.test(value)
            ? ""
            : "Only numbers allowed."
          : "";
        this.setState({
          phoneNo: value
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

      case "email":
        errors.email = !value
          ? "Please enter email."
          : validEmailRegex.test(value)
          ? ""
          : "Invalid Email.";
        break;
      // case 'mobileNo':
      //   errors.mobileNo = (!value) ? 'This field is required.' : ''
      //   break;
      // case 'fax':
      //   errors.fax = (!value) ? 'This field is required.' : ''
      //   break;
      // case 'website':
      //   errors.website = (!value) ? 'This field is required.' : ''
      //   break;
      // case 'address':
      //   errors.address = (!value) ? 'This field is required.' : ''
      //   break;
      // case 'postalCode':
      //   errors.postalCode = (!value) ? 'This field is required.' : ''
      //   break;
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

    if (
      this.state.instituteName == undefined ||
      this.state.instituteName == ""
    ) {
      errors.instituteName = "Please enter institute name.";
    }
    if (this.state.email == undefined || this.state.email == "") {
      errors.email = "Please enter email.";
    }
    if (this.state.mobileNo == undefined || this.state.mobileNo == "") {
      errors.mobileNo = "Please enter primary phone.";
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
    if (!valid) {
      this.scrollToTop();
    }
    return valid;
  };

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smoothly scrolling
    });
  }

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
      if (this.state.instituteId == 0) {
        url = apiroute + "/api/BE_Institute/Save";
      } else {
        url = apiroute + "/api/BE_Institute/Update";
      }

      let data = JSON.stringify({
        instituteId: this.state.instituteId,
        instituteName: this.state.instituteName,
        accessionNo: this.state.accessionNo,
        fax: this.state.fax,
        website: this.state.website,
        address: this.state.address,
        CityId:
          this.state.cityId == "" || this.state.cityId == 0
            ? null
            : parseInt(this.state.cityId),
        CountryId:
          this.state.countryId == "" || this.state.countryId == 0
            ? null
            : parseInt(this.state.countryId),
        StateId:
          this.state.stateId == "" || this.state.stateId == 0
            ? null
            : parseInt(this.state.stateId),
        postalCode: this.state.postalCode,
        email: this.state.email,
        phoneNumber: this.state.phoneNo,
        mobile: this.state.mobileNo,
        CreatedBy: parseInt(userToken.userId),
        UserId: parseInt(this.state.userId),
        registerType: "A",
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
            this.props.history.push("/institutes/list");
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
      instituteId,
      instituteName,
      accessionNo,
      fax,
      website,
      address,
      countryId,
      countries,
      stateId,
      states,
      cityId,
      cities,
      postalCode,
      email,
      phoneNo,
      mobileNo,
      errors,
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Institution Detail
            </h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/institutes/list">
              <button className="btn btn-primary btn-block">Institution</button>
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
                          Institution Name{" "}
                          <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.instituteName ? "is-invalid" : "is-valid"
                          }
                          name="instituteName"
                          value={instituteName}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter institution name"
                          maxLength="200"
                        />
                        {<span className="error">{errors.instituteName}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
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
                          maxLength="50"
                        />
                        {<span className="error">{errors.email}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>
                          Primary Phone <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.mobileNo ? "is-invalid" : "is-valid"
                          }
                          name="mobileNo"
                          value={mobileNo}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter primary phone"
                          maxLength="20"
                        />
                        {<span className="error">{errors.mobileNo}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Secondary Phone </Label>
                        <Input
                          type="text"
                          name="phoneNo"
                          value={phoneNo}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter secondary phone"
                          maxLength="20"
                        />
                        {<span className="error">{errors.phoneNo}</span>}
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
                          maxLength="50"
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
                          maxLength="50"
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
                          maxLength="20"
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
                          name="instituteId"
                          value={instituteId}
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
