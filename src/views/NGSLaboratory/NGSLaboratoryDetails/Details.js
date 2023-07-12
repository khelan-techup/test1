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
  Fade, Collapse,
  CardHeader
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import { Multiselect } from "multiselect-react-dropdown";
import { toast } from "react-toastify";
import Confirm from "../../CustomModal/Confirm";
import axiosInstance from "./../../../common/axiosInstance"
import { BE_Common_GetAllCountry, BE_Common_GetCityByStateId, BE_Common_GetStateByCountryId, BE_NGSLaboratory_DeleteNGSLabContactPerson, BE_NGSLaboratory_GetById, BE_NGSLaboratory_Save, BE_NGSLaboratory_Update } from "../../../common/allApiEndPoints";


class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      isView: false,
      isEdit: false,
      ngsLaboratoryId: 0,
      ngsLabName: "",
      accessionNo: "",
      fax: "",
      website: "",
      address: "",
      userId: 0,
      country: 0,
      countries: [],
      state: 0,
      states: [],
      city: 0,
      cities: [],
      postalCode: "",
      email: "",
      phoneNo: "",
      mobileNo: "",

      ngsLabName2: "",
      email2: "",
      mobileNo2: "",
      phoneNo2: "",
      fax2: "",
      website2: "",
      address2: "",
      country2: 0,
      state2: 0,
      city2: 0,
      postalCode2: "",
      errors: {
        ngsLabName: "",
        fax: "",
        website: "",
        address: "",
        postalCode: "",
        email: "",
        mobileNo: "",
        contactPerson: "",
        contactName: "",
        contactEmail: "",
        // ExtensionPrimary:"",
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
      disease: [],
      fadeIn: true,
      timeout: 300,
      collapseId: 0,
      contactPerson: [],
      ExtensionPrimary: "",
      ExtensionPrimary2: "",
      ExtensionSecondary: "",
      ExtensionSecondary2: "",
      contactPerson2: [],
      validEmailRegex: RegExp(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
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
      this.props.history.push("/ngslaboratory/list");
    }
  };

  //get detail
  componentDidMount() {
    //var deses=[{name: 'Srigar', id: 1},{name: 'Sam', id: 2}];
    //this.setState({ disease: deses});
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    var rights = userToken.roleModule;
    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter((role) =>
        role.moduleName.toLowerCase().includes("laboratory")
      );
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited,
        });
        if (currentrights[0].isViewed) {
          this.getCountry();
          // this.setState({ loading: false });
        } else {
          this.setState({ loading: false });
        }
      } else {
        this.setState({ loading: false });
      }
    } else {
      this.setState({ loading: false });
    }

  }

  getCountry() {
    this.setState({ loading: true })
    const param = this.props.match.params;
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Common/GetAllCountry";    // const url = apiroute + "/api/BE_Common/GetAllCountry";
    const url = apiroute + BE_Common_GetAllCountry
    let data = JSON.stringify({
      isDeleted: false,
      searchString: "",
    });
    axiosInstance
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
              loading: false
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
        this.setState({ loading: false })
      });
  }

  //get detail(for update)
  getData = (id) => {
    this.setState({ loading: true })
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_NGSLaboratory/GetById?id=" + id + "";// const url = apiroute + "/api/BE_NGSLaboratory/GetById?id=" + id + "";
    const url = apiroute + BE_NGSLaboratory_GetById(id)

    axiosInstance
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
              ngsLaboratoryId: rData.ngsLaboratoryId,
              ngsLabName: rData.ngsLabName,
              accessionNo: rData.accessionNo,
              fax: rData.fax,
              website: rData.website,
              address: rData.address,
              country: rData.country,
              userId: rData.userId,
              postalCode: rData.postalCode,
              email: rData.email,
              phoneNo: rData.phoneNo,
              mobileNo: rData.mobileNo,

              ngsLabName2: rData.ngsLabName,
              email2: rData.email,
              mobileNo2: rData.mobileNo,
              phoneNo2: rData.phoneNo,
              fax2: rData.fax,
              website2: rData.website,
              address2: rData.address,
              country2: rData.country,
              state2: rData.state,
              city2: rData.city,
              postalCode2: rData.postalCode,
              contactPerson: rData.ngsContactPersons,
              contactPerson2: rData.ngsContactPersons,
              ExtensionPrimary: rData.extensionPrimary,
              ExtensionPrimary2: rData.extensionPrimary,
              ExtensionSecondary: rData.extensionSecondary,
              ExtensionSecondary2: rData.extensionSecondary,
              loading: false
            },
            () => {
              if (rData.country != null) {
                this.getStateData(rData.country, rData.state, rData.city);
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
    const params = this.props.match.params;
    this.setState({
      loading: false,
      ngsLabName: this.state.ngsLabName2,
      accessionNo: "",
      fax: this.state.fax2,
      website: this.state.website2,
      address: this.state.address2,
      country: this.state.country2,
      // countries: [],
      state: this.state.state2,
      // states: [],
      city: this.state.city2,
      // cities: [],
      postalCode: this.state.postalCode2,
      email: this.state.email2,
      phoneNo: this.state.phoneNo2,
      mobileNo: this.state.mobileNo2,
      errors: {
        ngsLabName: "",
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
      contactPerson: this.state.contactPerson2,
      ExtensionPrimary: this.state.ExtensionPrimary2,
      ExtensionSecondary: this.state.ExtensionSecondary2

    });
    this.getStateData(this.state.country2, this.state.state2, this.state.city2)
    if (params.id) {
      this.getData(params.id);
    }

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
    // const validWebsiteRegex = RegExp(
    //   /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
    // );

    const validWebsiteRegex = new RegExp(
      '^([a-zA-Z]+:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );


    switch (name) {
      case "email":
        errors.email = !value
          ? "Please enter email."
          : validEmailRegex.test(value)
            ? ""
            : "Invalid Email.";
        break;
      case "ngsLabName":
        errors.ngsLabName = !value
          ? "Please enter Laboratory name."
          : validAlphaRegex.test(value)
            ? ""
            : "Only alphabets allowed.";
        this.setState({ ngsLabName: value.replace(/[^a-zA-Z \b]+$/, "") });
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
      default:
        //(!value) ? '' :'This field is required.'
        break;
    }

    this.setState({ errors }, () => {
      if (name == "country") {
        if (value != "") {
          this.getStateData(value, "", "");
          this.setState({ cities: [], city: "" });
        } else {
          this.setState({ states: [], state: "", cities: [], city: "" });
        }
      }
      if (name == "state") {
        if (value != "") {
          this.getCityData(value, "");
        } else {
          this.setState({ cities: [], city: "" });
        }
      }
    });
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.ngsLabName == undefined || this.state.ngsLabName == "") {
      errors.ngsLabName = "This field is required.";
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

    if (this.state.contactPerson.length <= 0) {
      errors.contactPerson = "Please enter data for contact person.";
    } else {
      let data = this.state.contactPerson;
      let length = data.length;

      let lastData = data[length - 1];
      if (
        lastData.name == "" ||
        !this.state.validEmailRegex.test(lastData.email)
      ) {
        errors.contactPerson = "Please fill out empty data of contact person.";
      }
    }

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
      if (this.state.ngsLaboratoryId == 0) {
        // url = apiroute + "/api/BE_NGSLaboratory/Save";        // url = apiroute + "/api/BE_NGSLaboratory/Save";
        url = apiroute + BE_NGSLaboratory_Save
      } else {
        // url = apiroute + "/api/BE_NGSLaboratory/Update";        // url = apiroute + "/api/BE_NGSLaboratory/Update";
        url = apiroute + BE_NGSLaboratory_Update
      }

      let data = JSON.stringify({
        ngsLaboratoryId: this.state.ngsLaboratoryId,
        ngsLabName: this.state.ngsLabName,
        accessionNo: this.state.accessionNo,
        fax: this.state.fax,
        website: this.state.website,
        address: this.state.address,
        city:
          this.state.city == "" || this.state.city == 0
            ? null
            : this.state.city,
        country:
          this.state.country == "" || this.state.country == 0
            ? null
            : this.state.country,
        state:
          this.state.state == "" || this.state.state == 0
            ? null
            : this.state.state,
        postalCode: this.state.postalCode,
        email: this.state.email,
        phoneNo: this.state.phoneNo,
        mobileNo: this.state.mobileNo,
        registerType: "A",
        createdBy: userToken.userId == null ? 0 : userToken.userId,
        UserId: parseInt(this.state.userId),
        ngsContactPersons: this.state.contactPerson,
        ExtensionPrimary: this.state.ExtensionPrimary,
        ExtensionSecondary: this.state.ExtensionSecondary,
      });
      // console.log(data);
      axiosInstance
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
            this.props.history.push("/ngslaboratory/list");
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

    // const url = apiroute + "/api/BE_Common/GetStateByCountryId?Id=" + CountryId;    // const url = apiroute + "/api/BE_Common/GetStateByCountryId?Id=" + CountryId;
    const url = apiroute + BE_Common_GetStateByCountryId(CountryId)

    axiosInstance
      .post(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          //console.log(result.data);
          this.setState({ states: result.data.outdata, state: StateId }, () => {
            if (StateId != "" || StateId != null) {
              this.getCityData(StateId, CityId);
            } else {
              this.setState({ loading: false });
            }
          });
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

    // const url = apiroute + "/api/BE_Common/GetCityByStateId?Id=" + StateId;    // const url = apiroute + "/api/BE_Common/GetCityByStateId?Id=" + StateId;
    const url = apiroute + BE_Common_GetCityByStateId(StateId)    // const url = apiroute + "/api/BE_Common/GetCityByStateId?Id=" + StateId;

    axiosInstance
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
            city: CityId,
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

  setCollapse(cid) {
    let currentCid = this.state.collapseId;
    if (currentCid == cid) {
      this.setState({ collapseId: -1 });
    } else {
      this.setState({ collapseId: cid });
    }
  }
  addContactPerson() {
    let data = this.state.contactPerson;
    let length = data.length;
    let errors = this.state.errors;
    errors.contactPerson = "";

    if (length == 0) {
      data.push({ name: "", email: "", mobile: "" });
    } else {
      let lastData = data[length - 1];
      if (
        lastData.name != undefined &&
        lastData.name != "" &&
        lastData.email != undefined &&
        lastData.email != ""
      ) {
        data.push({ name: "", email: "", mobile: "" });
        errors.contactEmail = "";
        errors.contactName = "";
      } else {
        errors.contactEmail = "Please enter email";
        errors.contactName = "Please enter name";
      }
    }
    this.setState({
      contactPerson: data,
    });
  }
  handleInputChangeContactPersons(event, index, fieldType) {
    let data = this.state.contactPerson;
    let value = event.target.value;
    let errors = this.state.errors;
    errors.contactPerson = "";

    // console.log(data);
    this.setState({
      contactPerson: [],
    });
    const elementsIndex = index;
    const validAlphaRegex = RegExp(/^[a-zA-Z \b]+$/);
    if (fieldType == "name") {
      errors.contactName = (!value) ? 'Please enter name.' : (validAlphaRegex.test(value) ? '' : 'Only alphabets allowed.');
      data[elementsIndex].name = value.replace(/[^a-zA-Z \b]+$/, '');

    } else if (fieldType == "email") {
      data[elementsIndex].email = value;
      this.state.errors.contactEmail = !value
        ? "Please enter email."
        : this.state.validEmailRegex.test(value)
          ? ""
          : "Invalid Email.";
    } else if (fieldType == "mobile") {
      data[elementsIndex].mobile = value
        .replace(/\D+/g, "")
        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }

    // console.log(data);
    this.setState({
      contactPerson: data,
    });
  }

  removeContactPerson(e, i, id) {
    let data = this.state.contactPerson;
    let errors = this.state.errors;
    errors.contactPerson = "";
    errors.contactName = "";
    errors.contactEmail = "";

    data.splice(i, 1);

    this.setState({
      contactPerson: data,
      loading: true,
    });

    if (id) {
      const apiroute = window.$APIPath;
      const url =
        // apiroute + "/api/BE_NGSLaboratory/DeleteNGSLabContactPerson?id=" + id + "";
        apiroute + BE_NGSLaboratory_DeleteNGSLabContactPerson(id)

      axiosInstance
        .delete(url, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            this.setState(
              {
                loading: false,
              },
              this.getData(0)
            );
            toast.success(result.data.message);
          } else {
            this.setState({
              loading: false,
            });
            toast.error(result.data.message);
          }
        })
        .catch((error) => {
          //console.log(error);
          this.setState({
            loading: false,
          });
          toast.error(error.message);
        });
    } else {
      this.setState({ loading: false });
    }
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
      ngsLaboratoryId,
      ngsLabName,
      accessionNo,
      fax,
      website,
      address,
      country,
      countries,
      state,
      states,
      city,
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
              <i className="fa fa-align-justify"></i> Laboratory Detail
            </h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/ngslaboratory/list">
              <button className="btn btn-primary btn-block">List</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            {/*{!loading ? (*/}
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
                          Laboratory Name{" "}
                          <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.ngsLabName ? "is-invalid" : "is-valid"
                          }
                          name="ngsLabName"
                          value={ngsLabName}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter lab name"
                          maxLength="200"
                          autoComplete="off"
                        />
                        {<span className="error">{errors.ngsLabName}</span>}
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
                          maxLength="100"
                          autoComplete="off"
                        />
                        {<span className="error">{errors.email}</span>}
                      </FormGroup>
                    </Col>


                    <Col xs="6">
                      <FormGroup>
                        <Label>
                          Primary Phone <span className="requiredField">*</span>
                        </Label>
                        <div className="d-flex">
                          <Input
                            type="text"
                            // className={
                            //   errors.ExtensionPrimary ? "is-invalid" : "is-valid"
                            // }
                            style={{ width: "30%" }}
                            name="ExtensionPrimary"
                            value={this.state.ExtensionPrimary}
                            onChange={this.handleInputChange.bind(this)}
                            placeholder="Ex. +91"
                            // maxLength=""
                            autoComplete="off"
                          />
                          <Input
                            type="text"
                            className={
                              errors.mobileNo ? "is-invalid" : "is-valid" +
                                " ml-2"

                            }
                            style={{ width: "70%" }}
                            name="mobileNo"
                            value={mobileNo}
                            onChange={this.handleInputChange.bind(this)}
                            placeholder="Enter primary phone"
                            maxLength="20"
                            autoComplete="off"
                          />

                        </div>

                        {<span className="error">{errors.mobileNo}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Secondary Phone </Label>
                        <div className="d-flex">
                          <Input
                            type="text"
                            className="mr-2"
                            style={{ width: "30%" }}
                            name="ExtensionSecondary"
                            value={this.state.ExtensionSecondary}
                            onChange={this.handleInputChange.bind(this)}
                            placeholder="Ex. +91"
                            // maxLength=""
                            autoComplete="off"
                          />
                          <Input
                            type="text"
                            name="phoneNo"
                            style={{ width: "70%" }}
                            value={phoneNo}
                            onChange={this.handleInputChange.bind(this)}
                            placeholder="Enter secondary phone"
                            maxLength="20"
                            autoComplete="off"
                          />
                        </div>
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
                          maxLength="20"
                          autoComplete="off"
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
                          autoComplete="off"
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
                          placeholder="Enter Address"
                          value={address}
                          onChange={this.handleInputChange.bind(this)}
                          maxLength="500"
                          autoComplete="off"
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
                          name="country"
                          value={country}
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
                          name="state"
                          value={state}
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
                          name="city"
                          value={city}
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
                          autoComplete="off"
                        />
                        {<span className="error">{errors.postalCode}</span>}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs="12"
                      sm="12"
                      md="12"
                      style={{ fontSize: "0.72rem" }}
                    >
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ border: "1px solid #1C3A84" }}>
                          <CardHeader
                            style={{
                              backgroundColor: "#1C3A84",
                              color: "white",
                              cursor: "pointer",
                            }}
                            onClick={() => this.setCollapse(2)}
                          >
                            <b style={{ fontSize: "16px" }}>Contact Persons</b>
                          </CardHeader>
                          <Collapse
                            isOpen={2 == this.state.collapseId}
                            id="collapseExample"
                          >
                            <CardBody>
                              {this.state.isEdit ?
                                <Button
                                  className="btn btn-primary btn-md"
                                  color="primary"
                                  onClick={this.addContactPerson.bind(this)}
                                >
                                  Add
                                </Button> : null}
                              {this.state?.contactPerson?.length > 0
                                ? this.state?.contactPerson?.map((data, i) => {
                                  return (
                                    <div key={i} className="form-group row my-4">
                                      <div className="col-md-1">
                                        <h5>{i + 1}</h5>
                                      </div>
                                      <div className="col-md-3">
                                        <Input
                                          autoComplete="off"
                                          type="text"
                                          className={
                                            errors.contactName && !data.name
                                              ? "is-invalid"
                                              : "is-valid"
                                          }
                                          maxLength="250"
                                          placeholder="Enter name"
                                          name="name"
                                          value={data.name}
                                          onChange={(e) =>
                                            this.handleInputChangeContactPersons(
                                              e,
                                              i,
                                              "name"
                                            )
                                          }
                                        />
                                        {data.name?.trim() === "" && (
                                          <span className="error">
                                            {errors.contactName}
                                          </span>
                                        )}
                                      </div>
                                      <div className="col-md-3">
                                        <Input
                                          autoComplete="off"
                                          type="text"
                                          className={
                                            errors.contactEmail &&
                                              !this.state.validEmailRegex.test(data.email)
                                              ? "is-invalid"
                                              : "is-valid"
                                          }
                                          placeholder="Enter email"
                                          name="email"
                                          value={data.email}
                                          onChange={(e) =>
                                            this.handleInputChangeContactPersons(
                                              e,
                                              i,
                                              "email"
                                            )
                                          }
                                        />
                                        {!this.state.validEmailRegex.test(
                                          data.email
                                        ) && (
                                            <span className="error">
                                              {errors.contactEmail}
                                            </span>
                                          )}
                                      </div>
                                      <div className="col-md-3">
                                        <Input
                                          autoComplete="off"
                                          type="text"
                                          placeholder="Enter phone"
                                          name="mobile"
                                          value={data.mobile}
                                          maxLength="20"
                                          onChange={(e) =>
                                            this.handleInputChangeContactPersons(
                                              e,
                                              i,
                                              "mobile"
                                            )
                                          }
                                        />
                                      </div>
                                      {this.state.isEdit ?
                                        <div className="col-md-2">
                                          <Confirm
                                            title="Confirm"
                                            description="Are you sure you want to delete this contact person?"
                                          >
                                            {(confirm) => (
                                              <Button
                                                color="danger"
                                                onClick={confirm((e) =>
                                                  this.removeContactPerson(
                                                    e,
                                                    i,
                                                    data.ngsLaboratoryContactPersonId
                                                  )
                                                )}
                                              >
                                                Remove
                                              </Button>
                                            )}
                                          </Confirm>
                                        </div> : null

                                      }

                                    </div>
                                  );
                                })
                                : null}
                              {
                                <h5 className="error">
                                  {errors.contactPerson}
                                </h5>
                              }
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>


                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input
                          type="hidden"
                          name="ngsLaboratoryId"
                          value={ngsLaboratoryId}
                        />
                        {this.state.isEdit ? <>
                          <Button
                            type="submit"
                            disabled={loading}
                            color="primary"
                          >
                            <i className="fa fa-dot-circle-o"></i> Submit
                          </Button><span>{" "}</span>
                        </> : null
                        }
                        {this.state.isEdit ? <>
                          <Button
                            type="reset"
                            color="danger"
                            onClick={this.onResetClick.bind(this)}
                          >
                            <i className="fa fa-ban"></i> Reset
                          </Button>
                        </> : null
                        }

                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
            {/*) : (
                <div className="animated fadeIn pt-1 text-center">Loading...</div>
              )}*/}
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
