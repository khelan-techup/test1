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
  Fade,
  CardHeader,
  Collapse,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import { toast } from "react-toastify";
import Confirm from "../../CustomModal/Confirm";
import axiosInstance from "./../../../common/axiosInstance"
import { BE_Common_GetAllCountry, BE_Common_GetCityByStateId, BE_Common_GetStateByCountryId, BE_Practitioner_DeletePractitionerContactPerson, BE_Practitioner_DeletePractitionerMedical, BE_Practitioner_GetById, BE_Practitioner_Save, BE_Practitioner_Update } from "../../../common/allApiEndPoints";

class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      isView: false,
      isEdit: false,
      practitionerId: 0,
      practitionerMedicalId: 0,
      practitionerKey: "",
      userName: "",
      userType: "",
      userId: 0,
      firstName: "",
      middleName: "",
      lastName: "",
      qualification: "",
      phoneNumber: "",
      mobile: "",
      email: "",
      residentAddress: "",
      residentCityId: 0,
      cities: [],
      residentStateId: 0,
      states: [],
      residentCountryId: 233,
      countries: [],
      residentPostalCode: "",
      medicalLicense: [],
      medicalStates: [],
      contactPerson: [],
      clinicName: "",
      clinicStreet: "",
      clinicStateId: 0,
      clinicCities: [],
      clinicCityId: 0,
      clinicPostalCode: "",
      isPesPipeline: false,
      isHealthindexPipeline: false,
      npiNumber: "",
      practitionerKey2: "",
      userName2: "",
      userType2: "",
      firstName2: "",
      middleName2: "",
      lastName2: "",
      qualification2: "",
      phoneNumber2: "",
      mobile2: "",
      email2: "",
      residentAddress2: "",
      residentCityId2: 0,
      cities2: [],
      residentStateId2: 0,
      states2: [],
      npiNumber2: '',
      residentCountryId2: 233,
      // countries: [],
      residentPostalCode2: "",
      medicalLicense2: [],
      contactPerson2: [],
      clinicName2: "",
      clinicStreet2: "",
      clinicCityId2: 0,
      clinicPostalCode2: "",
      clinicStateId2: 0,
      clinicState2: '',
      clinicCity2: '',
      clinicCities2: [],

      errors: {
        practitionerKey: "",
        userName: "",
        userType: "",
        firstName: "",
        middleName: "",
        lastName: "",
        qualification: "",
        phoneNumber: "",
        mobile: "",
        email: "",
        contactName: "",
        contactEmail: "",
        residentAddress: "",
        residentCityId: "",
        residentStateId: "",
        residentCountryId: "",
        residentPostalCode: "",
        medicalLicense: "",
        contactPerson: "",
        clinicStreet: "",
        clinicStateId: "",
        clinicCityId: "",
        clinicPostalCode: "",
        isPipeline: "",
        npiNumber: "",
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
      fadeIn: true,
      timeout: 300,
      collapseId: 0,
      validEmailRegex: RegExp(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),
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
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    var rights = userToken.roleModule;
    this.setState({ roleName: userToken.roleName });
    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("practitioners"));
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          this.getAllCountry();

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
  getAllCountry() {
    this.setState({ loading: true })
    const param = this.props.match.params;

    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Common/GetAllCountry";
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
              countries: result.data.outdata, loading: false
            },
            () => {
              if (param.id != undefined) {
                this.getData(param.id);
              } else {

                this.getStateData(233, "", "", "", "");
              }

            }
          );
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        // console.log(error);
      });

  }

  //get detail(for update)
  getData = (id) => {
    this.setState({ loading: true })
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
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState(
            {
              practitionerId: rData.practitionerId,
              practitionerKey: rData.practitionerKey,

              userName: rData.userName,
              userType: rData.userType,
              firstName: rData.firstName,
              middleName: rData.middleName,
              lastName: rData.lastName,
              qualification: rData.qualification,
              email: rData.email,
              mobile: rData.mobile,
              phoneNumber: rData.phoneNumber,
              npiNumber: rData.npiNumber,

              residentAddress: rData.residentAddress,
              residentCountryId: rData.residentCountryId,
              residentPostalCode: rData.residentPostalCode,
              userId: rData.userId,

              clinicName: rData.clinicName,
              clinicStreet: rData.clinicStreet,
              clinicStateId: rData.clinicStateId,
              clinicCityId: rData.clinicCityId,
              clinicPostalCode: rData.clinicPostalCode,

              contactPerson: rData.practitionerContactPerson,
              medicalLicense: rData.practitionerMedical,

              practitionerMedicalId:
                rData.practitionerMedical[0]?.practitionerMedicalId,
              isPesPipeline: rData.isPesPipeline,
              isHealthindexPipeline: rData.isHealthindexPipeline,


              userName2: rData.userName,
              userType2: rData.userType,
              firstName2: rData.firstName,
              middleName2: rData.middleName,
              lastName2: rData.lastName,
              qualification2: rData.qualification,
              email2: rData.email,
              mobile2: rData.mobile,
              phoneNumber2: rData.phoneNumber,
              npiNumber2: rData.npiNumber,

              residentAddress2: rData.residentAddress,
              residentCountryId2: rData.residentCountryId,
              residentPostalCode2: rData.residentPostalCode,
              residentStateId2: rData.residentStateId,

              clinicName2: rData.clinicName,
              clinicStreet2: rData.clinicStreet,
              clinicStateId2: rData.clinicStateId,
              clinicCityId2: rData.clinicCityId,
              clinicPostalCode2: rData.clinicPostalCode,
              // clinicCity2:rData.clinicCity,
              // clinicState2: rData.clinicState,



              medicalLicense2: rData.practitionerMedical,
              contactPerson2: rData.practitionerContactPerson,
              loading: false
            },
            () => {
              //get states for added countries
              function getData(countryId, i) {
                let elementsIndex = i;
                let data = rData.practitionerMedical;
                const url =
                  apiroute +
                  // "/api/BE_Common/GetStateByCountryId?Id=" +
                  BE_Common_GetStateByCountryId(parseInt(countryId))

                axiosInstance
                  .post(url, {
                    headers: {
                      "Content-Type": "application/json; charset=utf-8",
                    },
                  })
                  .then(async (result) => {
                    if (result.data.flag) {
                      data[elementsIndex].states = await result.data.outdata;
                    }
                  })
                  .catch((error) => {
                    // console.log(error);
                  });
              }
              rData.practitionerMedical.map((rep, i) => {
                getData(rep.countryId, i);
              });

              // if (rData.residentCountryId != null) {
              this.getStateData(
                233,
                rData.residentStateId,
                rData.residentCityId,
                rData.clinicStateId,
                rData.clinicCityId
              );
              // }
              // else {
              //   this.setState({ loading: false });
              // }
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
    // console.log("This.state", this.state);
    this.setState({
      loading: false,
      practitionerKey: "",
      userName: this.state.userName2,
      userType: this.state.userType2,

      firstName: this.state.firstName2,
      middleName: this.state.middleName2,
      lastName: this.state.lastName2,
      qualification: this.state.qualification2,
      email: this.state.email2,
      mobile: this.state.mobile2,
      phoneNumber: this.state.phoneNumber2,
      npiNumber: this.state.npiNumber2,

      clinicName: this.state.clinicName2,
      clinicStreet: this.state.clinicStreet2,
      clinicStateId: this.state.clinicStateId2,
      clinicCityId: this.state.clinicCityId2,
      clinicPostalCode: this.state.clinicPostalCode2,
      // clinicCities: this.state.clinicCities2,

      // clinicState: this.state.clinicState2,
      // clinicCity:this.state.clinicCity2,

      // residentAddress: this.state.residentAddress2,
      // residentCityId: 0,
      // cities: this.state.clinicCities2,
      // residentStateId:0,
      // // states: [],
      // residentCountryId: this.state.residentCountryId2,
      // // countries: [],
      // residentPostalCode: this.state.residentPostalCode2,

      medicalLicense: this.state.medicalLicense2,
      contactPerson: this.state.contactPerson2,

      errors: {
        practitionerKey: "",
        userName: "",
        userType: "",
        firstName: "",
        middleName: "",
        lastName: "",
        qualification: "",
        phoneNumber: "",
        mobile: "",
        email: "",
        contactName: "",
        contactEmail: "",
        residentAddress: "",
        residentCityId: 0,
        residentStateId: 0,
        residentCountryId: 0,
        residentPostalCode: "",
        clinicName: "",
        clinicStreet: "",
        clinicCityId: "",
        clinicPostalCode: "",
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",


    });
    this.getStateData(
      this.state.residentCountryId,
      this.state.residentStateId,
      this.state.residentCityId2,
      this.state.clinicStateId2,
      this.state.clinicCityId2
    )
  }

  //input handle input change and validation
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const checked = target.checked;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;

    const validMobileRegex = RegExp(/^[0-9+() -]+$/);
    const validNumberRegex = RegExp(/^[0-9]+$/);
    const validAlphaRegex = RegExp(/^[a-zA-Z \b]+$/);
    const validAlphaNumericRegex = RegExp(/^[a-zA-Z0-9 \b]+$/);
    const validEmailRegex = RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    switch (name) {
      case "firstName":
        errors.firstName = !value
          ? "Please enter firstname."
          : validAlphaRegex.test(value)
            ? ""
            : "Only alphabets allowed.";
        this.setState({ firstName: value.replace(/[^a-zA-Z \b]+$/, "") });
        break;

      case "middleName":
        errors.middleName = value
          ? validAlphaRegex.test(value)
            ? ""
            : "Only alphabets allowed."
          : "";
        this.setState({ middleName: value.replace(/[^a-zA-Z \b]+$/, "") });
        break;

      case "lastName":
        errors.lastName = !value
          ? "Please enter lastname."
          : validAlphaRegex.test(value)
            ? ""
            : "Only alphabets allowed.";
        this.setState({ lastName: value.replace(/[^a-zA-Z \b]+$/, "") });
        break;

      case "qualification":
        errors.qualification = !value ? "Please enter qualification." : "";
        break;

      case "email":
        errors.email = !value
          ? "Please enter email."
          : validEmailRegex.test(value)
            ? ""
            : "Invalid Email.";
        break;

      case "mobile":
        errors.mobile = !value
          ? "Please enter primary phone."
          : validMobileRegex.test(value)
            ? ""
            : "Only numbers allowed.";
        this.setState({
          mobile: value
            .replace(/\D+/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
        });
        break;

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

      case "residentPostalCode":
        errors.residentPostalCode = !value
          ? "Please enter resident postal code."
          : validNumberRegex.test(value)
            ? ""
            : "Only numbers allowed.";
        this.setState({ residentPostalCode: value.replace(/[^0-9]+$/, "") });
        break;

      case "clinicStreet":
        errors.clinicStreet = !value
          ? "Please enter clinicStreet."
          : validAlphaNumericRegex.test(value)
            ? ""
            : "Only alpha numerics allowed.";
        this.setState({ clinicStreet: value.replace(/[^a-zA-Z0-9 \b]+$/, "") });
        break;

      case "clinicStateId":
        errors.clinicStateId = !value ? "Please enter clinic state." : "";
        break;

      case "clinicCityId":
        errors.clinicCityId = !value ? "Please enter clinic city." : "";
        break;

      case "isPesPipeline":
        errors.isPipeline =
          !checked && !this.state.isHealthindexPipeline
            ? "Please select atleast one pipeline"
            : "";
        break;

      case "isHealthindexPipeline":
        errors.isPipeline =
          !checked && !this.state.isPesPipeline
            ? "Please select atleast one pipeline"
            : "";
        break;

      case "clinicPostalCode":
        errors.clinicPostalCode = !value
          ? "Please enter clinic postal code."
          : validNumberRegex.test(value)
            ? ""
            : "Only numbers allowed.";
        this.setState({ clinicPostalCode: value.replace(/[^0-9]+$/, "") });
        break;

      case "npiNumber":
        errors.npiNumber = value
          ? validMobileRegex.test(value)
            ? ""
            : "Only numbers allowed."
          : "";
        this.setState({ npiNumber: value.replace(/[^0-9]+$/, "") });
        break;

      default:
        //(!value) ? '' :'This field is required.'
        break;
    }

    this.setState({ errors }, () => {
      if (name == "residentCountryId") {
        if (value != "") {
          this.getStateData(value, "", "", "", "");
          this.setState({
            cities: [],
            residentCityId: "",
            clinicCities: [],
            clinicCityId: "",
          });
        } else {
          this.setState({
            states: [],
            residentStateId: "",
            cities: [],
            residentCityId: "",
            clinicCities: [],
            clinicStateId: "",
            clinicCityId: "",
          });
        }
      }
      if (name == "residentStateId") {
        if (value != "") {
          this.getCityData(value, "");
        } else {
          this.setState({ cities: [], residentCityId: "" });
        }
      }
      if (name == "clinicStateId") {
        if (value != "") {
          this.getClinicCityData(value, "");
        } else {
          this.setState({ clinicCities: [], clinicCityId: "" });
        }
      }
      if (name === "isPesPipeline") {
        if (checked === true) {
          this.setState({ isPesPipeline: true });
        } else {
          this.setState({ isPesPipeline: false });
        }
      }
      if (name === "isHealthindexPipeline") {
        if (checked === true) {
          this.setState({ isHealthindexPipeline: true });
        } else {
          this.setState({ isHealthindexPipeline: false });
        }
      }
    });
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.firstName == undefined || this.state.firstName == "") {
      errors.firstName = "Please enter firstname.";
    }

    // if (this.state.middleName == undefined || this.state.middleName == '') {
    //   errors.middleName = 'This field is required.';
    // }
    if (this.state.lastName == undefined || this.state.lastName == "") {
      errors.lastName = "Please enter lastname.";
    }

    // if (this.state.residentAddress == undefined || this.state.residentAddress == '') {
    //   errors.residentAddress = 'This field is required.';
    // }
    if (
      this.state.qualification == undefined ||
      this.state.qualification == ""
    ) {
      errors.qualification = "Please enter qualification.";
    }

    if (this.state.email == undefined || this.state.email == "") {
      errors.email = "Please enter email.";
    }

    if (this.state.clinicStreet == undefined || this.state.clinicStreet == "") {
      errors.clinicStreet = "Please enter clinic street.";
    }

    if (
      this.state.clinicStateId == undefined ||
      this.state.clinicStateId == ""
    ) {
      errors.clinicStateId = "Please select clinic state.";
    }

    if (this.state.clinicCityId == undefined || this.state.clinicCityId == "") {
      errors.clinicCityId = "Please select clinic city.";
    }

    if (
      this.state.clinicPostalCode == undefined ||
      this.state.clinicPostalCode == ""
    ) {
      errors.clinicPostalCode = "Please enter clinic postal code.";
    }
    // if (this.state.isPesPipeline == false) {
    //   if (this.state.isHealthindexPipeline == false) {
    //     errors.isPipeline = 'Please select atleast one pipeline';
    //   }
    // }

    // if (this.state.residentPostalCode == undefined || this.state.residentPostalCode == '') {
    //   errors.residentPostalCode = 'This field is required.';
    // }

    if (this.state.mobile == undefined || this.state.mobile == "") {
      errors.mobile = "Please enter primary phone.";
    }

    if (this.state.medicalLicense.length <= 0) {
      errors.medicalLicense = "Please enter data for medical license.";
    } else {
      let data = this.state.medicalLicense;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.licenseNo == "") {
        errors.medicalLicense =
          "Please fill out empty data of medical license.";
      }
    }

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

  removeContactPerson(e, i, id) {
    let data = this.state.contactPerson;
    let errors = this.state.errors;
    errors.contactPerson = "";

    data.splice(i, 1);

    this.setState({
      contactPerson: data,
      loading: true,
    });

    if (id) {
      const apiroute = window.$APIPath;
      const url =
        apiroute + BE_Practitioner_DeletePractitionerContactPerson(id)

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

  //input handle input change Contact Persons
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

  addMedicalLicense() {
    let data = this.state.medicalLicense.map((object) => {
      return {
        countryId: object.countryId,
        licenseNo: object.licenseNo,
        stateId: object.stateId,
        states: object.states,
        createdBy: object.createdBy,
        practitionerMedicalId: object.practitionerMedicalId,
        practitionerId: object.practitionerId,
      };
    });
    let length = data.length;
    let errors = this.state.errors;
    errors.medicalLicense = "";

    if (length == 0) {
      data.push({
        licenseNo: "",
        countryId: parseInt(this.state.residentCountryId),
        stateId: "",
        states: this.state.states,
        practitionerMedicalId: 0,
      });
    } else {
      let lastData = data[length - 1];
      if (lastData.licenseNo != undefined && lastData.licenseNo != "") {
        data.push({
          licenseNo: "",
          countryId: parseInt(this.state.residentCountryId),
          stateId: "",
          states: this.state.states,
          practitionerMedicalId: 0,
        });
        errors.licenseNo = "";
      } else {
        errors.licenseNo = "Please enter license no.";
      }
    }
    this.setState({
      medicalLicense: data,
    });
  }

  removeMedicalLicense(e, i, id) {
    let data = this.state.medicalLicense;
    let errors = this.state.errors;
    errors.medicalLicense = "";

    data.splice(i, 1);

    this.setState({
      medicalLicense: data,
      loading: true,
    });

    if (id) {
      const apiroute = window.$APIPath;
      const url =
        apiroute + BE_Practitioner_DeletePractitionerMedical(id)

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

  //input handle input change Medical license
  async handleInputChangeMedicalLicense(event, index, fieldType) {
    let data = this.state.medicalLicense;
    let errors = this.state.errors;
    errors.medicalLicense = "";

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));

    // console.log(data);
    this.setState({
      medicalLicense: [],
    });
    const elementsIndex = index;

    if (fieldType == "licenseNo") {
      errors.licenseNo = (!event.target.value) ? 'Please enter licenseNo.' : "";
      data[elementsIndex].licenseNo = event.target.value;
      data[elementsIndex].practitionerId = this.state.practitionerId;
      // data[elementsIndex].practitionerMedicalId = this.state.practitionerMedicalId
      data[elementsIndex].createdBy = parseInt(userToken.userId);
    } else if (fieldType == "countryId") {
      data[elementsIndex].countryId = parseInt(event.target.value);

      const apiroute = window.$APIPath;
      if (event.target.value) {
        const url =
          // apiroute + "/api/BE_Common/GetStateByCountryId?Id=" + parseInt(event.target.value);
          apiroute + BE_Common_GetStateByCountryId(parseInt(event.target.value))

        axiosInstance
          .post(url, {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          })
          .then(async (result) => {
            if (result.data.flag) {
              // console.log(result.data);
              data[elementsIndex].states = await result.data.outdata;
            }
          })
          .catch((error) => {
            // console.log(error);
          });
      }
    } else if (fieldType == "stateId") {
      data[elementsIndex].stateId = parseInt(event.target.value);
    }

    // console.log("data", data);
    this.setState({
      medicalLicense: data,
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
      if (this.state.practitionerId == 0) {
        // url = apiroute + "/api/BE_Practitioner/Save";
        url = apiroute + BE_Practitioner_Save
      } else {
        // url = apiroute + "/api/BE_Practitioner/Update";
        url = apiroute + BE_Practitioner_Update
      }

      let data = JSON.stringify({
        PractitionerId: this.state.practitionerId,
        PractitionerKey: this.state.practitionerKey,
        UserName: this.state.email,
        UserType: parseInt(2),
        FirstName: this.state.firstName,
        MiddleName: this.state.middleName,
        LastName: this.state.lastName,
        Qualification: this.state.qualification,
        PhoneNumber: this.state.phoneNumber,
        Mobile: this.state.mobile,
        Email: this.state.email,
        ResidentAddress: this.state.residentAddress,
        ResidentCityId:
          this.state.residentCityId == "" || this.state.residentCityId == 0
            ? null
            : parseInt(this.state.residentCityId),
        ResidentCountryId:
          this.state.residentCountryId == "" ||
            this.state.residentCountryId == 0
            ? null
            : parseInt(this.state.residentCountryId),
        ResidentStateId:
          this.state.residentStateId == "" || this.state.residentStateId == 0
            ? null
            : parseInt(this.state.residentStateId),
        ResidentPostalCode: this.state.residentPostalCode,
        CreatedBy: parseInt(userToken.userId),
        UserId: parseInt(this.state.userId),
        registerType: "A",
        practitionerMedical: this.state.medicalLicense.map((object) => {
          return {
            countryId: object.countryId,
            licenseNo: object.licenseNo,
            stateId: object.stateId == "" ? null : object.stateId,
            createdBy: object.createdBy,
            practitionerMedicalId: object.practitionerMedicalId,
            practitionerId: object.practitionerId,
          };
        }),
        practitionerContactPerson: this.state.contactPerson,
        clinicName: this.state.clinicName,
        clinicStreet: this.state.clinicStreet,
        clinicCityId:
          this.state.clinicCityId == "" || this.state.clinicCityId == 0
            ? null
            : parseInt(this.state.clinicCityId),
        clinicStateId:
          this.state.clinicStateId == "" || this.state.clinicStateId == 0
            ? null
            : parseInt(this.state.clinicStateId),
        clinicPostalCode: this.state.clinicPostalCode,
        isPesPipeline: this.state.isPesPipeline,
        isHealthindexPipeline: this.state.isHealthindexPipeline,
        npiNumber: this.state.npiNumber,
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
            this.props.history.push("/practitioners/list");
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

  getStateData(
    ResidentCountryId,
    ResidentStateId,
    ResidentCityId,
    clinicStateId,
    clinicCityId
  ) {
    const apiroute = window.$APIPath;
    this.setState({ loading: true })
    const url =
      // apiroute + "/api/BE_Common/GetStateByCountryId?Id=" + ResidentCountryId;
      apiroute + BE_Common_GetStateByCountryId(ResidentCountryId)

    axiosInstance
      .post(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          //console.log(result.data);
          this.setState(
            {
              states: result.data.outdata,
              residentStateId: ResidentStateId,
              clinicStateId: clinicStateId, loading: false
            },
            () => {
              if (clinicStateId != "" && clinicStateId != null) {
                this.getClinicCityData(clinicStateId, clinicCityId);
              }
              // if (ResidentStateId != "" || ResidentStateId != null) {
              //   this.getCityData(ResidentStateId, ResidentCityId);
              // }
            }
          );
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  getCityData(ResidentStateId, ResidentCityId) {
    const apiroute = window.$APIPath;

    const url =
      // apiroute + "/api/BE_Common/GetCityByStateId?Id=" + ResidentStateId;
      apiroute + BE_Common_GetCityByStateId(ResidentStateId)

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
            cities2: result.data.outdata,
            residentCityId: ResidentCityId,
          });
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  getClinicCityData(clinicStateId, clinicCityId) {
    const apiroute = window.$APIPath;

    const url =
      // apiroute + "/api/BE_Common/GetCityByStateId?Id=" + clinicStateId;
      apiroute + BE_Common_GetCityByStateId(clinicStateId)

    axiosInstance
      .post(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          // console.log("asd431",result.data);
          this.setState({
            clinicCities: result.data.outdata,
            clinicCities2: result.data.outdata,
            clinicCityId: clinicCityId,
          });
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
  }

  render() {
    if (localStorage.getItem("AUserToken") == null) {
      return <Redirect to="/Login" />;
    }

    const {
      loading,
      practitionerId,
      practitionerKey,
      firstName,
      middleName,
      lastName,
      userName,
      userType,
      qualification,
      phoneNumber,
      mobile,
      email,
      residentAddress,
      residentCountryId,
      countries,
      residentStateId,
      states,
      residentCityId,
      cities,
      residentPostalCode,
      errors,
      collapseId,
      medicalLicense,
      contactPerson,
      clinicName,
      clinicStreet,
      clinicStateId,
      clinicCityId,
      clinicPostalCode,
      clinicCities,
      isPesPipeline,
      isHealthindexPipeline,
      validEmailRegex,
      npiNumber,
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Practitioner Detail
            </h5>
          </Col>
          <Col xs="2" lg="2">
            <Link to="/practitioners/list">
              <button className="btn btn-primary btn-block">
                Practitioners
              </button>
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
                    {/* <Col xs="6">
                        <FormGroup>
                          <Label>Practitioner Key </Label>
                          <Input type="text" name="practitionerKey" value={practitionerKey} onChange={this.handleInputChange.bind(this)} disabled maxLength="100" />
                          {<span className='error'>{errors.practitionerKey}</span>}
                        </FormGroup>
                      </Col>
                      <Col xs="6">
                        <FormGroup>
                          <Label>User Name </Label>
                          <Input type="text" name="userName" value={userName} onChange={this.handleInputChange.bind(this)} placeholder="Enter user name" disabled maxLength="100" />
                          {<span className='error'>{errors.userName}</span>}
                        </FormGroup>
                      </Col>*/}
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          First Name <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.firstName ? "is-invalid" : "is-valid"
                          }
                          name="firstName"
                          value={firstName}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter first name"
                          maxLength="200"
                          autoComplete="off"
                        />
                        {<span className="error">{errors.firstName}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>Middle Name </Label>
                        <Input
                          type="text"
                          name="middleName"
                          value={middleName}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter middle name"
                          maxLength="200"
                          autoComplete="off"
                        />
                        {<span className="error">{errors.middleName}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Last Name <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.lastName ? "is-invalid" : "is-valid"
                          }
                          name="lastName"
                          value={lastName}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter last name"
                          maxLength="200"
                          autoComplete="off"
                        />
                        {<span className="error">{errors.lastName}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>

                    <Col xs="6">
                      <FormGroup>
                        <Label>
                          Degree Earned <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.qualification ? "is-invalid" : "is-valid"
                          }
                          name="qualification"
                          value={qualification}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter degree earned "
                          maxLength="200"
                          autoComplete="off"
                        />
                        {<span className="error">{errors.qualification}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
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
                          autoComplete="off"
                        />
                        {<span className="error">{errors.email}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
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
                          autoComplete="off"
                        />
                        {<span className="error">{errors.mobile}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Secondary Phone </Label>
                        <Input
                          type="tel"
                          name="phoneNumber"
                          value={phoneNumber}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter secondary phone"
                          maxLength="20"
                          autoComplete="off"
                        />
                        {<span className="error">{errors.phoneNumber}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>

                    <Col xs="6">
                      <FormGroup>
                        <Label>NPI Number</Label>
                        <Input
                          name="npiNumber"
                          value={npiNumber}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter NPI Number"
                          maxLength="10"
                          autoComplete="off"
                        />
                        {<span className="error">{errors.npiNumber}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>

                    {/* <Col xs="4">
                        <FormGroup>
                          <Label>Country </Label>
                          <Input type="select" className="custom-select mb-3"  name="residentCountryId" value={residentCountryId} onChange={this.handleInputChange.bind(this)}>
                            <option value="">Select Country</option>
                            {countries
                              .map((data, i) => {
                                return (<option key={i} value={data.id}>{data.name}</option>);
                              })}
                          </Input>
                        </FormGroup>
                      </Col> */}
                    {/* <Col xs="4">
                        <FormGroup>
                          <Label>State </Label>
                          <Input type="select" className="custom-select mb-3"  name="residentStateId" value={residentStateId} onChange={this.handleInputChange.bind(this)}>
                            <option value="">Select State</option>
                            {states
                              .map((data, i) => {
                                return (<option key={i} value={data.id}>{data.name}</option>);
                              })}
                          </Input>
                        </FormGroup>
                      </Col> */}
                    {/* <Col xs="4">
                        <FormGroup>
                          <Label>City </Label>
                          <Input type="select" className="custom-select mb-3"  name="residentCityId" value={residentCityId} onChange={this.handleInputChange.bind(this)}>
                            <option value="">Select City</option>
                            {cities
                              .map((data, i) => {
                                return (<option key={i} value={data.id}>{data.name}</option>);
                              })}
                          </Input>
                        </FormGroup>
                      </Col> */}
                    {/* <Col xs="8">
                        <FormGroup>
                          <Label>Address </Label>
                          <Input type="textarea"  name="residentAddress" value={residentAddress} onChange={this.handleInputChange.bind(this)} maxLength="500" />
                          {<span className='error'>{errors.residentAddress}</span>}
                          <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" />
                        </FormGroup>
                      </Col> */}
                    {/* <Col xs="4">
                        <FormGroup>
                          <Label>Postal Code </Label>
                          <Input type="text"  name="residentPostalCode" value={residentPostalCode} onChange={this.handleInputChange.bind(this)} placeholder="Enter postal code" maxLength="20" />
                          {<span className='error'>{errors.residentPostalCode}</span>}
                          <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" />
                        </FormGroup>
                      </Col> */}
                  </Row>

                  <Row>
                    <div className="page-title">
                      <h1>Clinic</h1>
                    </div>
                  </Row>

                  <Row>
                    <Col xs="4">
                      <FormGroup>
                        <Label>Clinic Name</Label>
                        <Input
                          type="text"
                          name="clinicName"
                          value={clinicName}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter clinic name"
                          maxLength="200"
                          autoComplete="off"
                        />
                        {<span className="error">{errors.clinicName}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Clinic Street <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.clinicStreet ? "is-invalid" : "is-valid"
                          }
                          name="clinicStreet"
                          value={clinicStreet}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter clinic street"
                          maxLength="200"
                          autoComplete="off"
                        />
                        {<span className="error">{errors.clinicStreet}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Clinic State <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="select"
                          className={
                            errors.clinicStateId
                              ? "is-invalid custom-select mb-3"
                              : "is-valid custom-select mb-3"
                          }
                          name="clinicStateId"
                          value={clinicStateId}
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
                        {<span className="error">{errors.clinicStateId}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Clinic City <span className="requiredField">*</span>
                        </Label>
                        {/* {console.log("DSAfas", clinicCities)} */}
                        <Input
                          type="select"
                          className={
                            errors.clinicCityId
                              ? "is-invalid custom-select mb-3"
                              : "is-valid custom-select mb-3"
                          }
                          name="clinicCityId"
                          value={clinicCityId}
                          onChange={this.handleInputChange.bind(this)}
                        >
                          <option value="">Select City</option>
                          {clinicCities.map((data, i) => {
                            return (
                              <option key={i} value={data.id}>
                                {data.name}
                              </option>
                            );
                          })}
                        </Input>
                        {<span className="error">{errors.clinicCityId}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Clinic Postal Code{" "}
                          <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.clinicPostalCode ? "is-invalid" : "is-valid"
                          }
                          name="clinicPostalCode"
                          value={clinicPostalCode}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter clinic postal code"
                          maxLength="20"
                          autoComplete="off"
                        />
                        {
                          <span className="error">
                            {errors.clinicPostalCode}
                          </span>
                        }
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* <Row>
                        <div className='page-title'>
                            <h1>Pipeline<span style={{ "color": "red", "font-size": "16px", "margin-left": "3px" }}>*</span></h1>
                        </div>
                      </Row> */}

                  {/* <Row>
                        <Col>
                          <FormGroup>
                            <div className='all-checkbox-alignment'>
                            <div className='checkbox-alignment'>
                                <div>
                                    <Input type="checkbox" name="isPesPipeline" checked={isPesPipeline} onChange={this.handleInputChange.bind(this)} />
                                </div>
                                <div>
                                    <span>ITI-PES</span>
                                </div>
                            </div>
                            <div className='checkbox-alignment'>
                                <div>
                                    <Input type="checkbox" name="isHealthindexPipeline" checked={isHealthindexPipeline} onChange={this.handleInputChange.bind(this)} />
                                </div>
                                <div>
                                    <span>HealthIndex</span>
                                </div>
                            </div>
                            {isPesPipeline == false && isHealthindexPipeline == false && <span className='error'>{errors.isPipeline}</span>}
                            </div>
                          </FormGroup>
                        </Col>
                      </Row> */}
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
                            onClick={() => {
                              this.setCollapse(1);
                            }}
                          >
                            <b style={{ fontSize: "16px" }}>Medical Licenses</b>
                          </CardHeader>
                          <Collapse
                            isOpen={1 == collapseId}
                            id="collapseExample"
                          >
                            <CardBody>
                              {this.state.isEdit ?
                                <Button
                                  className="btn btn-primary btn-md"
                                  color="primary"
                                  onClick={this.addMedicalLicense.bind(this)}
                                >
                                  Add
                                </Button> : null}

                              {medicalLicense.length > 0
                                ? medicalLicense.map((data, i) => {
                                  return (
                                    <div key={i} className="form-group row my-4">
                                      <div className="col-md-1">
                                        <h5>{i + 1}</h5>
                                      </div>
                                      <div className="col-md-3">
                                        <Input
                                          type="text"
                                          className={
                                            errors.licenseNo &&
                                              !data.licenseNo
                                              ? "is-invalid"
                                              : "is-valid"
                                          }
                                          maxlength="20"
                                          placeholder="Enter license No"
                                          name="licenseNo"
                                          value={data.licenseNo}
                                          autoComplete="off"
                                          onChange={(e) =>
                                            this.handleInputChangeMedicalLicense(
                                              e,
                                              i,
                                              "licenseNo"
                                            )
                                          }
                                        />
                                        {data.licenseNo?.trim() === "" && (
                                          <span className="error">
                                            {errors.licenseNo}
                                          </span>
                                        )}
                                      </div>
                                      <div className="col-md-3">
                                        <Input
                                          type="select"
                                          placeholder="Enter country"
                                          name="countryId"
                                          value={data.countryId}
                                          onMouseOut={this.handleInputChangeMedicalLicense.bind(
                                            this
                                          )}
                                          onChange={(e) =>
                                            this.handleInputChangeMedicalLicense(
                                              e,
                                              i,
                                              "countryId"
                                            )
                                          }
                                        >
                                          <option value="">
                                            Select Country
                                          </option>
                                          {countries.map((data, i) => {
                                            return (
                                              <option key={i} value={data.id}>
                                                {data.name}
                                              </option>
                                            );
                                          })}
                                        </Input>
                                      </div>
                                      <div className="col-md-3">
                                        <Input
                                          type="select"
                                          placeholder="Enter state"
                                          name="stateId"
                                          value={data.stateId}
                                          onFocus={this.handleInputChangeMedicalLicense.bind(
                                            this
                                          )}
                                          onChange={(e) =>
                                            this.handleInputChangeMedicalLicense(
                                              e,
                                              i,
                                              "stateId"
                                            )
                                          }
                                        >
                                          <option value="">
                                            Select State
                                          </option>
                                          {data?.states?.map((data, i) => {
                                            return (
                                              <option
                                                key={i}
                                                value={data?.id}
                                              >
                                                {data?.name}
                                              </option>
                                            );
                                          })}
                                        </Input>
                                      </div>
                                      {this.state.isEdit ?
                                        <div className="col-md-2">
                                          <Confirm
                                            title="Confirm"
                                            description="Are you sure you want to delete this medical license?"
                                          >
                                            {(confirm) => (
                                              <Button
                                                color="danger"
                                                onClick={confirm((e) =>
                                                  this.removeMedicalLicense(
                                                    e,
                                                    i,
                                                    data.practitionerMedicalId
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
                                  {errors.medicalLicense}
                                </h5>
                              }
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

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
                            isOpen={2 == collapseId}
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
                              {contactPerson.length > 0
                                ? contactPerson.map((data, i) => {
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
                                          maxlength="250"
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
                                              !validEmailRegex.test(data.email)
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
                                        {!validEmailRegex.test(
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
                                                    data.practitionerContactPersonId
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
                          name="practitionerId"
                          value={practitionerId}
                        />
                        {this.state.isEdit ? (<>
                          <Button
                            type="submit"
                            disabled={loading}
                            color="primary"
                          >
                            <i className="fa fa-dot-circle-o"></i> Submit
                          </Button><span>{" "}</span>
                        </>) : null}
                        {this.state.isEdit ?
                          <Button
                            type="reset"
                            color="danger"
                            onClick={this.onResetClick.bind(this)}
                          >
                            <i className="fa fa-ban"></i> Reset
                          </Button>
                          : null}
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
