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
import Moment from "moment";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { browserHistory } from 'react-router-dom'
import axiosInstance from "./../../../common/axiosInstance"

class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      patientId: 0,
      //diseaseId: "",
      firstName: "",
      firstName_1: "",
      patientKey: "",
      patientKey_1: "",
      middleName: "",
      middleName_1: "",
      lastName: "",
      lastName_1: "",
      dateOfBirth: "",
      dateOfBirth_1: "",
      age: "",
      age_1: "",
      sex: "M",
      sex_1: "M",
      //diseasename: "Cancer Patients",
      address: "",
      addressLine1: '',
      addressLine_1: '',
      // addressLine2:'',
      // addressLine_2:'',
      address_1: "",
      // weight: "",
      // weight_1: "",
      // height: "",
      // height_1: "",
      ocountryId: 0,
      ocountryId_1: 0,
      countryId: 233,
      countryId_1: 233,
      countries: [],
      countries_1: [],
      ocountries: [],
      stateId: 0,
      stateId_1: 0,
      states: [],
      states_1: [],
      cityId: 0,
      cityId_1: 0,
      cities: [],
      cities_1: [],
      postalCode: "",
      postalCode_1: "",
      email: "",
      email_1: "",
      phoneNumber: "",
      phoneNumber_1: "",
      mobile: "",
      mobile_1: "",
      userId: 0,
      errors: {
        firstName: "",
        patientKey: "",
        middleName: "",
        lastName: "",
        dateOfBirth: "",
        age: "",
        sex: "",
        address: "",
        cityId: "",
        countryId: "",
        stateId: "",
        postalCode: "",
        email: "",
        phoneNumber: "",
        mobile: "",
        //diseaseId: '',
        //Tissue: '',
        //practitionerId: '',
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
      costumerCare: [],
      ccId: 0,
      ccId_2: 0,


      //disease: [],
      //diseasedetails: [],

      //Tissue: "",
      //allTissues: [],
      //practitionerId: 0,
      //allpractitioners: [],
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
      this.props.history.push("/patients/list");
    }
  };

  //get detail
  componentDidMount() {
    this.getCountry();
    this.getCostumerCareData()

    this.state.sex = "M";
    //this.setState({ loading: false });
  }
  getCostumerCareData() {
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/BE_OrganizationUser/GetByRoleId?id=5";
    // let data = JSON.stringify({
    //   isDeleted: true,
    //   searchString: "",
    //   id: 0,
    // });
    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        this.setState({
          costumerCare: result?.data?.outdata
        })
        // console.log(this.state.costumerCare, "ghvvvvyyvtgvtgresult")

      })

  }
  getCountry() {
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/BE_Common/GetPatientDropdown";
    let data = JSON.stringify({
      isDeleted: true,
      searchString: "",
      id: 0,
    });
    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log(result.data);
        if (result.data.flag) {
          this.setState(
            {
              countries: result.data.outdata.countryData,
              ocountries: result.data.outdata.ocountryData,
              //disease: result.data.outdata.diseaseData,
              //allpractitioners: result.data.outdata.practitionerData
              //allTissues: result.data.outdata.tissueData
            },
            () => {
              const param = this.props.match.params;
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
    const url = apiroute + "/api/BE_Patient/GetById?id=" + id + "";

    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          var rData = result.data.outdata;
          // console.log("Orignial::", result.data.outdata);
          //console.log("Orignial1", Moment(rData.dateOfBirth.slice(0, 10), "DD-MM-YYYY").format('YYYY-MM-DD'));
          //this.getStateData(rData.countryId, rData.stateId, rData.cityId);

          //let currentdisease = this.state.disease.filter(ds => ds.name.toLowerCase().includes("vibranthealthx"));
          //if (currentdisease.length > 0) {
          //  if (currentdisease[0].id == rData.diseaseId) {
          //    this.setState({ diseasename: "VibrantHealthX" });
          //  }
          //}
          //console.log(new Date(Moment(rData.dateOfBirth.slice(0, 10), "MM/DD/YYYY").format('MM/DD/YYYY')))
          this.setState(
            {
              patientId: rData.patientId,
              patientId_1: rData.patientId,
              firstName: rData.firstName,
              firstName_1: rData.firstName,
              patientKey: rData.accessionNo,
              patientKey_1: rData.accessionNo,
              middleName: rData.middleName,
              middleName_1: rData.middleName,
              lastName: rData.lastName,
              lastName_1: rData.lastName,
              // dateOfBirth: (rData.dateOfBirth != null ? Moment(rData.dateOfBirth.slice(0, 10), "MM-DD-YYYY").format('YYYY-MM-DD') : ""),
              /*dateOfBirth: (rData.dateOfBirth != null ? Moment(rData.dateOfBirth)._d : ""), */
              dateOfBirth:
                rData.dateOfBirth != null
                  ? new Date(
                    Moment(
                      rData.dateOfBirth.slice(0, 10),
                      "MM/DD/YYYY"
                    ).format("MM/DD/YYYY")
                  )
                  : "",
              dateOfBirth_1:
                rData.dateOfBirth != null
                  ? new Date(
                    Moment(
                      rData.dateOfBirth.slice(0, 10),
                      "MM/DD/YYYY"
                    ).format("MM/DD/YYYY")
                  )
                  : "",
              age: rData.age,
              age_1: rData.age,
              sex: rData.sex,
              sex_1: rData.sex,
              addressLine1: rData.addressLine1,
              addressLine_1: rData.addressLine1,
              // addressLine2: rData.addressLine2,
              // addressLine_2: rData.addressLine2,
              cityId: rData.cityId,
              cityId_1: rData.cityId,
              countryId: rData.countryId,
              countryId_1: rData.countryId,
              stateId: rData.stateId,
              stateId_1: rData.stateId,
              postalCode: rData.postalCode,
              postalCode_1: rData.postalCode,
              email: rData.email,
              email_1: rData.email,
              phoneNumber: rData.phoneNumber,
              phoneNumber_1: rData.phoneNumber,
              mobile: rData.mobile,
              mobile_1: rData.mobile,
              userId: rData.userId,
              // weight: rData.weight,
              // weight_1: rData.weight,
              // height: rData.height,
              // height_1: rData.height,
              //Tissue: rData.tissue, practitionerId: rData.practionerId, diseaseId: rData.diseaseId,
              ocountryId: rData.oCountryId,
              ocountryId_1: rData.oCountryId,
              ccId: rData.ccId, ccId_2: rData.ccId,

            },
            () => {
              //if (rData.diseaseId != null) {
              //  this.getTissueData(rData.diseaseId, rData.tissue)
              //}
              if (rData.countryId != null) {
                this.getStateData(rData.countryId, rData.stateId, rData.cityId);
              } else {
                this.setState({ countryId: 0, loading: false }, () => {
                  this.getStateData(0, "", "");
                });
              }
            }
          );
          // console.log("allstates::", this.state);
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
  };

  //form reset button click
  onResetClick(e) {
    e.preventDefault();
    // this.getCityData(this.state.stateId, this.state.cityId);
    // console.log("Hi",this.state.address_1)
    this.setState({
      loading: false,
      firstName: this.state.firstName_1,
      patientKey: this.state.patientKey_1,
      middleName: this.state.middleName_1,
      lastName: this.state.lastName_1,
      dateOfBirth: this.state.dateOfBirth_1,
      age: this.state.age_1,
      sex: this.state.sex_1,
      //diseasename: "VibrantHealthX",
      addressLine1: this.state.addressLine_1,
      // addressLine2: this.state.addressLine_2,

      // weight: this.state.weight_1,
      // height: this.state.height_1,
      ocountryId: this.state.ocountryId_1,
      countryId: this.state.countryId_1,
      // countries: this.state.countries_1,
      stateId: this.state.stateId_1,
      // states: this.state.states_1,
      cityId: this.state.cityId_1,
      cities: this.state.cities_1,
      postalCode: this.state.postalCode_1,
      email: this.state.email_1,
      phoneNumber: this.state.phoneNumber_1,
      mobile: this.state.mobile_1,
      ccId: this.state.ccId_2,
      //diseaseId: "",
      //Tissue: "",
      //practitionerId: 0,
      errors: {
        firstName: "",
        patientKey: "",
        middleName: "",
        lastName: "",
        dateOfBirth: "",
        age: 0,
        sex: "",
        address: "",
        cityId: "",
        countryId: "",
        //practitionerId: '',
        stateId: "",
        postalCode: "",
        email: "",
        phoneNumber: "",
        mobile: "",
        //diseaseId: '',
        //Tissue: '',
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
    });
    this.getStateData(this.state.countryId, this.state.stateId_1, this.state.cityId_1);

  }

  handleDateChange(date) {
    // console.log(date);
    let errors = this.state.errors;
    // errors.dateOfBirth = !date ? "Please enter date of birth." : "";
    var newAge = date ? this.calculate_age(date) : 0;
    this.setState({ dateOfBirth: date, age: newAge });
  }

  //input handle input change and validation
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    //if (name == 'diseasename') {
    //  if (value != 'Cancer Patients') {

    //    let currentdisease = this.state.disease.filter(ds => ds.name.toLowerCase().includes("vibranthealthx"));
    //    //console.log(currentdisease);

    //    let currentocountry = this.state.ocountries.filter(oc => oc.name.toLowerCase().includes("usa"));
    //    //console.log(currentocountry);

    //    this.setState({ ocountryId: currentocountry[0].id, diseaseId: currentdisease[0].id });
    //  } else {
    //    this.setState({ diseaseId: "", ocountryId: 0 });
    //  }
    //}

    let errors = this.state.errors;

    const validMobileRegex = RegExp(/^[0-9+() -]+$/);
    const validNumberRegex = RegExp(/^[0-9]+$/);
    const validAlphaRegex = RegExp(/^[a-zA-Z \b]+$/);
    const validAlphaNoRegex = RegExp(/^[a-zA-Z0-9 \b]+$/);
    const validEmailRegex = RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    switch (name) {
      case "firstName":
        errors.firstName = !value?.trim()
          ? "Please enter firstname."
          : validAlphaNoRegex.test(value)
            ? ""
            : "Only alphanumeric allowed.";
        this.setState({ firstName: value.replace(/[^a-zA-Z0-9 \b]+$/, "") });
        break;

      case "middleName":
        errors.middleName = value
          ? validAlphaNoRegex.test(value)
            ? ""
            : "Only alphanumeric allowed."
          : "";
        this.setState({ middleName: value.replace(/[^a-zA-Z0-9 \b]+$/, "") });
        break;

      case "lastName":
        errors.lastName = !value?.trim()
          ? "Please enter lastname."
          : validAlphaNoRegex.test(value)
            ? ""
            : "Only alphanumeric allowed.";
        this.setState({ lastName: value.replace(/[^a-zA-Z0-9 \b]+$/, "") });
        break;

      case "mobile":
        // errors.mobile = !value
        //   ? "Please enter primary phone."
        //   : validMobileRegex.test(value)
        //     ? ""
        //     : "Only numbers allowed.";
        this.setState({
          mobile: value
            .replace(/\D+/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
        });
        break;

      case "email":
        errors.email = !value
          ? ""
          : validEmailRegex.test(value)
            ? ""
            : "Invalid Email.";
        break;

      case "dateOfBirth":
        var newAge = value ? this.calculate_age(value) : 0;
        this.setState({ age: newAge });
        break;

      case "phoneNumber":
        // errors.phoneNumber = value
        //   ? validMobileRegex.test(value)
        //     ? ""
        //     : "Only numbers allowed."
        //   : "";
        this.setState({
          phoneNumber: value
            .replace(/\D+/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
        });
        break;

      case "postalCode":
        // errors.postalCode = !value
        // ? "Please enter valid postal code"
        // : validNumberRegex.test(value)
        //   ? ""
        //   : "Only numbers allowed.";
        this.setState({ postalCode: value.replace(/[^0-9]+$/, "") });
        break;

      // case "countryId":
      //   errors.countryId = !value ? "Please select country." : "";
      //   break;

      // case "stateId":
      //   errors.stateId = !value ? "Please select state." : "";
      //   break;

      // case "cityId":
      //   errors.cityId = !value ? "Please select city." : "";
      //   break;

      //case 'diseaseId':
      //  errors.diseaseId = this.state.diseasename == "Cancer Patients" ? ((!value) ? 'Please select disease.' : '') : ''
      //  break;
      //case 'ocountryId':
      //  errors.ocountryId = this.state.diseasename == "Cancer Patients" ? ((!value) ? 'Please select country.' : '') : ''
      //  break;
      //case 'practitionerId':
      //  errors.practitionerId = this.state.diseasename == "Cancer Patients" ? ((!value) ? 'Please select practitioner.' : '') : ''
      //  break;
      //case 'Tissue':
      //  errors.Tissue = this.state.diseasename == "Cancer Patients" ? ((!value) ? 'Please select tissue.' : '') : ''
      //  //this.setState({ Tissue: value });
      //  break;

      default:
        //(!value) ? '' :'This field is required.'
        break;
    }
    // console.log("value", value)
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
      //if (name == 'diseaseId') {
      //  if (value != '') {
      //    this.getTissueData(value, "");
      //    this.setState({ allTissues: [], Tissue: "" });
      //  }
      //  else {
      //    this.setState({ allTissues: [], Tissue: "" });
      //  }
      //}
    });
  }

  calculate_age = (dob1) => {
    var today = new Date();
    var birthDate = new Date(dob1); // create a date object directly from `dob1` argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    // console.log(age_now);
    return age_now;
  };

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.firstName == undefined || this.state.firstName == "") {
      errors.firstName = "Please enter firstname.";
    }

    if (this.state.lastName == undefined || this.state.lastName == "") {
      errors.lastName = "Please enter lastname.";
    }

    // if (this.state.email == undefined || this.state.email == "") {
    //   errors.email = "Please enter email.";
    // }

    // if (this.state.dateOfBirth == undefined || this.state.dateOfBirth == "") {
    //   errors.dateOfBirth = "Please enter date of birth.";
    // }

    // if (this.state.mobile == undefined || this.state.mobile == "") {
    //   errors.mobile = "Please enter primary phone.";
    // }

    // if (this.state.cityId == undefined || this.state.cityId == "") {
    //   errors.cityId = "Please select state.";
    // }

    // if (this.state.countryId == undefined || this.state.countryId == "") {
    //   errors.countryId = "Please select country.";
    // }

    // if (this.state.stateId == undefined || this.state.stateId == "") {
    //   errors.stateId = "Please select city.";
    // }

    // if (this.state.postalCode == undefined || this.state.postalCode == "") {
    //   errors.postalCode = "Please enter valid postal code.";
    // }

    //if (this.state.diseasename == "Cancer Patients") {
    //  if (this.state.practitionerId == undefined || this.state.practitionerId == '') {
    //    errors.practitionerId = 'Please select practitioner.';
    //  }

    //  //if (this.state.Tissue == undefined || this.state.Tissue == '') {
    //  //  errors.Tissue = 'Please select tissue';
    //  //}

    //  if (this.state.diseaseId == undefined || this.state.diseaseId == '') {
    //    errors.diseaseId = 'Please select disease.';
    //  }

    //  if (this.state.ocountryId == undefined || this.state.ocountryId == '') {
    //    errors.ocountryId = 'Please select country.';
    //  }
    //} else {
    //  errors.practitionerId = '';
    //  errors.Tissue = '';
    //  errors.diseaseId = '';
    //  errors.ocountryId = '';
    //}

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  };

  //form submit
  handleSubmit(e) {
    // debugger;

    e.preventDefault();
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let url = "";

    let x = new Date(this.state.dateOfBirth);
    let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
    let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
    x.setHours(hoursDiff);
    x.setMinutes(minutesDiff);
    //console.log('Submit');
    //console.log(this.state);

    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      url = apiroute + "/api/BE_Patient/Update";
      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        UserId: parseInt(this.state.userId),
        UserType: userToken.userType,
        UserName: userToken.email,
        FirstName: this.state.firstName?.trim(),
        PatientKey: this.state.patientKey,
        MiddleName: this.state.middleName?.trim(),
        LastName: this.state.lastName?.trim(),
        DateOfBirth:
          this.state.dateOfBirth != null && this.state.dateOfBirth != ""
            ? x
            : null,
        //Age: parseInt(this.state.age),
        //Tissue: this.state.Tissue,
        Age:
          this.state.Age == "" || this.state.Age == null || this.state.Age == 0
            ? null
            : this.state.Age.toString(),
        Sex: this.state.sex,
        Address: this.state.address,
        addressLine1: this.state.addressLine1?.trim(),
        // addressLine2:this.state.addressLine2,
        // weight: this.state.weight,
        // height: this.state.height,
        oCountryId:
          this.state.ocountryId == "" || this.state.ocountryId == 0
            ? null
            : parseInt(this.state.ocountryId),
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
        PostalCode: this.state.postalCode,
        Email: this.state.email,
        PhoneNumber: this.state.phoneNumber,
        Mobile: this.state.mobile,
        CreatedBy: userToken.userId,
        ccId: parseInt(this.state.ccId),
        //diseaseId: (this.state.diseaseId != "" ? parseInt(this.state.diseaseId) : null),
        //practionerId: (this.state.practitionerId != "" ? parseInt(this.state.practitionerId) : null)
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

            this.props.history.goBack()



            // this.props.history.push("/patients/list");
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

    axiosInstance
      .post(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          // console.log(result.data);
          this.setState(
            { states: result.data.outdata, StateId: StateId },
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
        // console.log(error);
        this.setState({ loading: false });
      });
  }

  getCityData(StateId, CityId) {
    const apiroute = window.$APIPath;

    const url = apiroute + "/api/BE_Common/GetCityByStateId?Id=" + StateId;

    axiosInstance
      .post(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          // console.log(result.data.outdata);
          this.setState({
            cities: result.data.outdata,
            cities_1: result.data.outdata,
            CityId: CityId,
            // CityId_1: CityId,
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

  //getTissueData(DiseaseId, TissueId) {
  //  const apiroute = window.$APIPath;

  //  const url = apiroute + '/api/BE_Tissue/GetDRPAllByDiseaseId';

  //  let data = JSON.stringify({
  //    isDeleted: true,
  //    searchString: '',
  //    id: parseInt(DiseaseId)
  //  });
  //  axiosInstance.post(url, data, {
  //    headers: {
  //      'Content-Type': 'application/json; charset=utf-8'
  //    }
  //  }).then(result => {
  //    if (result.data.flag) {
  //      //console.log(result.data);
  //      this.setState({ allTissues: result.data.outdata, Tissue: TissueId });
  //    }
  //  }).catch(error => {
  //    console.log(error);
  //  });
  //}

  onSelect(selectedList, selectedItem) {
    // debugger;
    // console.log(selectedList);
    // console.log(selectedItem);
    // this.state.diseasedetails = selectedList;
  }

  onRemove(selectedList, removedItem) {
    // console.log(selectedList);
    // console.log(removedItem);
    //this.state.diseasedetails = selectedList;
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
      patientId,
      firstName,
      patientKey,
      middleName,
      lastName,
      dateOfBirth,
      age,
      sex,
      address,
      countryId,
      countries,
      stateId,
      states,
      cityId,
      cities,
      postalCode,
      email,
      phoneNumber,
      mobile,
      errors,
      ocountryId,
      ocountries,
      // height,
      // weight,
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Patient Detail
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
                <Form
                  className="form-horizontal"
                  onSubmit={this.handleSubmit.bind(this)}
                >
                  <Row>
                    <Col xs="4">
                    </Col>
                    <Col xs="4">
                    </Col>
                    {/* <Col xs="4">
                      <FormGroup>
                        <Label>
                          CC Representative <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="select"
                          className={errors.ccId
                            ? "custom-select is-invalid"
                            : "custom-select is-valid"}
                          name="ccId"
                          value={this.state.ccId}
                          onChange={this.handleInputChange.bind(this)}
                        >
                          {this.state.costumerCare.map((data, i) => {
                            return (
                              <option key={i} value={data.userId}>
                                {data.fullName}
                              </option>
                            );
                          })}
                        </Input>
                      </FormGroup>
                    </Col> */}
                  </Row>
                  <Row>
                    {/*<Col xs="12">*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label>Type </Label>*/}

                    {/*    <div className="custom-control custom-radio">*/}
                    {/*      {diseasename == "Cancer Patients" ?*/}
                    {/*        <Input type="radio" checked className="custom-control-input" value="Cancer Patients" onChange={this.handleInputChange.bind(this)} id="CancerPatients" name="diseasename" tabIndex="16" />*/}
                    {/*        :*/}
                    {/*        <Input type="radio" className="custom-control-input" value="Cancer Patients" onChange={this.handleInputChange.bind(this)} id="CancerPatients" name="diseasename" tabIndex="16" />*/}
                    {/*      }*/}
                    {/*      <Label className="custom-control-label" htmlFor="CancerPatients">PBIMA-PES</Label>*/}
                    {/*    </div>*/}
                    {/*    <div className="custom-control custom-radio">*/}
                    {/*      {diseasename == "VibrantHealthX" ?*/}
                    {/*        <Input type="radio" className="custom-control-input" value="VibrantHealthX" onChange={this.handleInputChange.bind(this)} checked id="VibrantHealthX" name="diseasename" tabIndex="15" />*/}
                    {/*        : <Input type="radio" className="custom-control-input" value="VibrantHealthX" onChange={this.handleInputChange.bind(this)} id="VibrantHealthX" name="diseasename" tabIndex="15" />*/}
                    {/*      }*/}
                    {/*      <Label className="custom-control-label" htmlFor="VibrantHealthX">HealthIndex</Label>*/}
                    {/*    </div>*/}

                    {/*  </FormGroup>*/}

                    {/*</Col>*/}
                    {/*<Col xs="4">*/}
                    {/*  <FormGroup>*/}
                    {/*    <Label>Accession No </Label>*/}
                    {/*    <Input type="text" name="patientKey" value={patientKey} onChange={this.handleInputChange.bind(this)} disabled maxLength="100" />*/}

                    {/*  </FormGroup>*/}
                    {/*</Col>*/}
                    {/*<Col xs="4">*/}
                    {/*  {diseasename == "Cancer Patients" ?*/}
                    {/*    <FormGroup>*/}
                    {/*      <Label>Practitioner <span className="requiredField">*</span></Label>*/}
                    {/*      <Input type="select" className={errors.practitionerId ? "custom-select is-invalid" : "custom-select is-valid"} name="practitionerId" value={practitionerId} onChange={this.handleInputChange.bind(this)}>*/}
                    {/*        <option value="">Select Practitioner</option>*/}
                    {/*        {allpractitioners*/}
                    {/*          .map((data, i) => {*/}
                    {/*            return (<option key={i} value={data.practitionerId}>{data.firstName + " " + data.lastName}</option>);*/}
                    {/*          })}*/}
                    {/*      </Input>*/}
                    {/*      {<span className='error'>{errors.practitionerId}</span>}*/}
                    {/*    </FormGroup>*/}
                    {/*    : null}*/}

                    {/*</Col>*/}

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

                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Date of Birth
                          {/* Date of Birth <span className="requiredField">*</span> */}
                        </Label>
                        {/* <Input type="date" max="9999-12-31" className={errors.dateOfBirth ? "is-invalid" : "is-valid"} name="dateOfBirth" value={dateOfBirth} onChange={this.handleInputChange.bind(this)} /> */}
                        <div className="cus-date-picker">
                          <DatePicker
                            selected={dateOfBirth}
                            onChange={this.handleDateChange.bind(this)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="mm/dd/yyyy"
                            showMonthDropdown
                            showYearDropdown
                            className={
                              errors.dateOfBirth ? "is-invalid" : "is-valid"
                            }
                            dropdownMode="select"
                            fixedHeight
                          />
                        </div>
                        {<span className="error">{errors.dateOfBirth}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>Age </Label>
                        <Input
                          type="text"
                          disabled
                          name="age"
                          value={age}
                          placeholder="Age"
                          maxLength="100"
                        />
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>Sex </Label>

                        <div className="custom-control custom-radio">
                          {sex == "M" ? (
                            <Input
                              type="radio"
                              className="custom-control-input"
                              value="M"
                              onChange={this.handleInputChange.bind(this)}
                              checked
                              id="Male"
                              name="sex"
                              tabIndex="15"
                            />
                          ) : (
                            <Input
                              type="radio"
                              className="custom-control-input"
                              value="M"
                              onChange={this.handleInputChange.bind(this)}
                              id="Male"
                              name="sex"
                              tabIndex="15"
                            />
                          )}
                          <Label
                            className="custom-control-label"
                            htmlFor="Male"
                          >
                            Male
                          </Label>
                        </div>
                        <div className="custom-control custom-radio">
                          {sex == "F" ? (
                            <Input
                              type="radio"
                              checked
                              className="custom-control-input"
                              value="F"
                              onChange={this.handleInputChange.bind(this)}
                              id="Female"
                              name="sex"
                              tabIndex="16"
                            />
                          ) : (
                            <Input
                              type="radio"
                              className="custom-control-input"
                              value="F"
                              onChange={this.handleInputChange.bind(this)}
                              id="Female"
                              name="sex"
                              tabIndex="16"
                            />
                          )}
                          <Label
                            className="custom-control-label"
                            htmlFor="Female"
                          >
                            Female
                          </Label>
                        </div>
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Email <span className="requiredField"></span>
                        </Label>
                        <Input
                          type="text"
                          className={errors.email ? "is-invalid" : "is-valid"}
                          name="email"
                          value={email == "No Email" ? "" : email}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter email"
                          maxLength="50"
                          autoComplete="off"
                          disabled={false}
                        />
                        {<span className="error">{errors.email}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          {/* Primary Phone <span className="requiredField">*</span> */}
                          Primary Phone
                        </Label>
                        <Input
                          type="text"
                          className={errors.mobile ? "is-invalid" : "is-valid"}
                          name="mobile"
                          value={mobile}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter primary phone"
                          maxLength="19"
                          autoComplete="off"
                        />
                        {/* <Input type="text" className={errors.mobile ? "is-invalid" : "is-valid"} name="mobile" value={mobile} onChange={this.handleInputChange.bind(this)} placeholder="Enter mobile number" maxLength="100" /> */}
                        {/* {<span className="error">{errors.mobile}</span>} */}
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
                          maxLength="19"
                          placeholder="Enter secondary phone"
                          autoComplete="off"
                        />
                        {/* {<span className="error">{errors.phoneNumber}</span>} */}
                      </FormGroup>
                    </Col>
                    {/* <Col xs="6">
                      <FormGroup>
                        <Label>Weight </Label>
                        <Input
                          type="text"
                          name="weight"
                          value={weight}
                          onChange={this.handleInputChange.bind(this)}
                          maxLength="50"
                          placeholder="Enter weight"
                        />
                      </FormGroup>
                    </Col> */}
                    {/* <Col xs="6">
                      <FormGroup>
                        <Label>Height </Label>
                        <Input
                          type="text"
                          name="height"
                          value={height}
                          onChange={(event) => {
                            if (event.target.value.length < 5)
                                this.handleInputChange.bind(this)(event)
                        }}
                        maxLength="50"
                        placeholder="Enter height"
                        />
                      </FormGroup>
                    </Col> */}
                    {/* <Col xs="4">
                      <FormGroup>
                        <Label>Country</Label>

                        <Input type="select" className={errors.countryId ? "is-invalid custom-select" : "is-valid custom-select"} name="countryId" value={countryId} onChange={this.handleInputChange.bind(this)}>
                          <option value="">Select Country</option>
                          {countries
                            .map((data, i) => {
                              return (<option key={i} value={data.id}>{data.name}</option>);
                            })}
                        </Input>
                        {<span className='error'>{errors.countryId}</span>}
                      </FormGroup>
                    </Col> */}
                    <Col xs="4">
                      <FormGroup>
                        <Label>Address</Label>
                        <Input
                          type="textarea"
                          name="addressLine1"
                          value={this.state.addressLine1}
                          onChange={this.handleInputChange.bind(this)}
                          maxLength="500"
                          placeholder="Enter address"
                          autoComplete="off"
                        />
                        {/* <Input type="textarea" className={errors.address ? "is-invalid" : "is-valid"} name="address" value={address} onChange={this.handleInputChange.bind(this)} maxLength="100" /> */}
                        {/* {<span className='error'>{errors.address}</span>} */}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Postal Code{" "}
                          {/* <span className="requiredField">*</span> */}
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.postalCode ? "is-invalid" : "is-valid"
                          }
                          name="postalCode"
                          value={postalCode}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter  postal code"
                          maxLength="20"
                          autoComplete="off"
                        />
                        {/* <Input type="text" className={errors.postalCode ? "is-invalid" : "is-valid"} name="postalCode" value={postalCode} onChange={this.handleInputChange.bind(this)} placeholder="Enter postal name" maxLength="100" /> */}
                        {/* {<span className="error">{errors.postalCode}</span>} */}
                      </FormGroup>
                    </Col>

                    <Col xs="4">
                    </Col>
                    {/* {
  console.log("this.params",this.props)
} */}

                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Country{" "}
                          {/* <span className="requiredField">*</span> */}
                        </Label>

                        <Input
                          type="select"
                          className="is-valid custom-select"
                          // className={
                          //   errors.countryId
                          //     ? "is-invalid custom-select"
                          //     : "is-valid custom-select"
                          // }
                          name="countryId"
                          // disabled={newAccesion}
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
                        {/* {<span className="error">{errors.countryId}</span>} */}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          State{" "}
                          {/* <span className="requiredField">*</span> */}
                        </Label>

                        <Input
                          type="select"
                          className={
                            errors.stateId
                              ? "is-invalid custom-select"
                              : "is-valid custom-select"
                          }
                          name="stateId"
                          value={stateId}
                          onChange={this.handleInputChange.bind(this)}
                        >
                          <option value="">Select  State</option>
                          {states.map((data, i) => {
                            return (
                              <option key={i} value={data.id}>
                                {data.name}
                              </option>
                            );
                          })}
                        </Input>
                        {/* {<span className="error">{errors.stateId}</span>} */}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          {/* City <span className="requiredField">*</span> */}
                          City
                        </Label>
                        <Input
                          type="select"
                          className={
                            errors.cityId
                              ? "is-invalid custom-select"
                              : "is-valid custom-select"
                          }
                          name="cityId"
                          value={cityId}
                          onChange={this.handleInputChange.bind(this)}
                        >
                          <option value="">Select  City</option>
                          {cities.map((data, i) => {
                            return (
                              <option key={i} value={data.id}>
                                {data.name}
                              </option>
                            );
                          })}
                        </Input>
                        {/* {<span className="error">{errors.cityId}</span>} */}
                      </FormGroup>
                    </Col>

                    {/* <Col xs="4">
                      <FormGroup>
                        <Label>Address Line 2 </Label>
                        <Input
                          type="textarea"
                          name="addressLine2"
                          value={this.state?.addressLine2}
                          onChange={this.handleInputChange.bind(this)}
                          maxLength="500"
                          placeholder="Enter address line 2"
                        />
                       
                      </FormGroup>
                    </Col> */}

                    {/* <Col xs="4"></Col> */}
                  </Row>

                  {/*<Row className="mb-3">*/}
                  {/*  <Col xs="11" lg="11">*/}
                  {/*    <h5 className="mt-2"><i className="fa fa-align-justify"></i> Disease Detail</h5>*/}
                  {/*  </Col>*/}
                  {/*  <Col xs="1" lg="1">*/}

                  {/*  </Col>*/}
                  {/*</Row>*/}
                  {/*<Row>*/}
                  {/*  <Col xs="4">*/}
                  {/*    {diseasename == "Cancer Patients" ?*/}
                  {/*      <FormGroup>*/}
                  {/*        <Label>Country <span className="requiredField">*</span></Label>*/}
                  {/*        <Input type="select" className={errors.ocountryId ? "custom-select is-invalid" : "custom-select is-valid"} name="ocountryId" value={ocountryId} onChange={this.handleInputChange.bind(this)}>*/}
                  {/*          <option value="">Select Country</option>*/}
                  {/*          {ocountries*/}
                  {/*            .map((data, i) => {*/}
                  {/*              return (<option key={i} value={data.id}>{data.name}</option>);*/}
                  {/*            })}*/}
                  {/*        </Input>*/}
                  {/*        {<span className='error'>{errors.ocountryId}</span>}*/}
                  {/*      </FormGroup>*/}
                  {/*      :*/}
                  {/*      <FormGroup>*/}
                  {/*        <Label>Country </Label>*/}
                  {/*        <Input type="select" name="ocountryId" value={ocountryId} onChange={this.handleInputChange.bind(this)}>*/}
                  {/*          <option value="">Select Country</option>*/}
                  {/*          {ocountries*/}
                  {/*            .map((data, i) => {*/}
                  {/*              return (<option key={i} value={data.id}>{data.name}</option>);*/}
                  {/*            })}*/}
                  {/*        </Input>*/}
                  {/*      </FormGroup>*/}
                  {/*    }*/}
                  {/*  </Col>*/}

                  {/*  <Col xs="4">*/}
                  {/*    {diseasename == "Cancer Patients" ?*/}
                  {/*      <FormGroup>*/}
                  {/*        <Label>Disease Name <span className="requiredField">*</span></Label>*/}
                  {/*        <Input type="select" className={errors.diseaseId ? "custom-select is-invalid" : "custom-select is-valid"} name="diseaseId" value={diseaseId} onChange={this.handleInputChange.bind(this)}>*/}
                  {/*          <option value="">Select Disease</option>*/}
                  {/*          {disease*/}
                  {/*            .map((data, i) => {*/}
                  {/*              return (<option key={i} value={data.id}>{data.name}</option>);*/}
                  {/*            })}*/}
                  {/*        </Input>*/}
                  {/*        {<span className='error'>{errors.diseaseId}</span>}*/}
                  {/*      </FormGroup>*/}
                  {/*      :*/}
                  {/*      <FormGroup>*/}
                  {/*        <Label>Disease Name </Label>*/}
                  {/*        <Input type="select" name="diseaseId" value={diseaseId} onChange={this.handleInputChange.bind(this)}>*/}
                  {/*          <option value="">Select Disease</option>*/}
                  {/*          {disease*/}
                  {/*            .map((data, i) => {*/}
                  {/*              return (<option key={i} value={data.id}>{data.name}</option>);*/}
                  {/*            })}*/}
                  {/*        </Input>*/}
                  {/*      </FormGroup>*/}
                  {/*    }*/}
                  {/*  </Col>*/}
                  {/*  <Col xs="4">*/}
                  {/*    {diseasename == "Cancer Patients" ?*/}
                  {/*      <FormGroup>*/}
                  {/*        <Label>Tissue </Label>*/}
                  {/*        <Input type="select" className="custom-select" name="Tissue" value={Tissue} onChange={this.handleInputChange.bind(this)}>*/}
                  {/*          <option value="">Select Tissue</option>*/}
                  {/*          {allTissues*/}
                  {/*            .map((data, i) => {*/}
                  {/*              return (<option key={i} value={data.name}>{data.name}</option>);*/}
                  {/*            })}*/}
                  {/*        </Input>*/}
                  {/*        {<span className='error'>{errors.Tissue}</span>}*/}
                  {/*      </FormGroup>*/}
                  {/*      :*/}
                  {/*      null*/}
                  {/*    }*/}
                  {/*  </Col>*/}
                  {/*</Row>*/}
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input
                          type="hidden"
                          name="patientId"
                          value={patientId}
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
