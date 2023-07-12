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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import { Multiselect } from "multiselect-react-dropdown";
import Moment from "moment";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import axiosInstance from "./../../../common/axiosInstance"

class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      labs: [],
      // addressLine2: "",
      addressLine1: "",
      patientId: 0,
      diseaseId: "",
      firstName: "",
      patientKey: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      age: "",
      sex: "M",
      diseasename: "cancer",
      address: "",
      // weight: "",
      // height: "",
      ocountryId: 1,
      countryId: 233,
      countries: [],
      ocountries: [],
      stateId: 0,
      states: [],
      cityId: 0,
      cities: [],
      postalCode: "",
      email: "",
      phoneNumber: "",
      mobile: "",
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
        diseaseId: "",
        Tissue: "",
        practitionerId: "",
        metastasis: "",
        newDisease: "",
        newDiseaseCode: "",
        newTissue: "",
        ccId: "",
        diseaseForNonCancer: ""
        // weight: '',
        // height: '',
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
      basicInfo: [],
      disease: [],
      Alldisease: [],
      diseasedetails: [],
      diseaseCat: [],
      diseaseCatId: 0,
      subDiseaseCatId: '',
      newDisease: "",
      newDiseaseCode: "",
      newTissue: "",
      laboratoryData: [],
      Tissue: "",
      allTissues: [],
      practitionerId: 0,
      allpractitioners: [],
      currentdiseasename: "",
      previewDetailsModal: false,
      practitionerfirstName: '',
      practitionerlastName: '',
      metastasis: 'no',
      costumerCare: [],
      ccId: 0,
      diseaseForNonCancer: "",
      newAccesion: false

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
    this.getCostumerCareData()
    // this.getUserData()
    this.getData()
    // this.getStateData(233, "", "")

    // this.state.sex = "M";
    //this.setState({ loading: false });
  }

  getUniques = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  setLabs = (labId) => {
    let index = this.state.labs.indexOf(labId);
    // alert(index);
    if (index === -1) {
      // alert("add");
      let labs = [...this.state.labs, labId];
      let filteredLabs = labs.filter(this.getUniques);
      let err = ''

      this.setState({
        labs: filteredLabs,
      });
    } else {
      // alert("remove");
      this.setState({
        labs: this.state.labs.filter((id) => id !== labId),
      });
    }
    if (this.state.labs.length > 0) {
      this.state.errors.labs = ''
    }
  };


  // getUserData() {
  //   this.setState({ loading: true });
  //   // const param = this.props.match.params;
  //   // console.log(param.id)

  //   var userToken = JSON.parse(localStorage.getItem('AUserToken'));
  //   //console.log('Submit');
  //   //console.log(this.state);
  //   let url = "";

  //   // if (this.validateForm(this.state.errors)) {
  //   const apiroute = window.$APIPath;
  //   // if (this.state.diseaseId == 0) {
  //   url = apiroute + '/api/BE_Patient/GetById?id=24';


  //   axiosInstance.get(url, {
  //     headers: {
  //       'Content-Type': 'application/json; charset=utf-8'
  //     }
  //   })
  //     .then(result => { console.log(result) })

  // }


  handleSubmitDisease(e) {
    // debugger;
    if (this.state.newDisease && this.state.newDiseaseCode) {



      e.preventDefault();
      this.setState({ loading: true });
      var userToken = JSON.parse(localStorage.getItem('AUserToken'));
      //console.log('Submit');
      //console.log(this.state);
      let url = "";

      // if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      // if (this.state.diseaseId == 0) {
      url = apiroute + '/api/BE_Disease/Save';
      // }
      // else {
      //   url = apiroute + '/api/BE_Disease/Update';
      // }

      if (this.state.accessionDigit == 0) {
        let diseaseCatAccessionDigit = this.state.diseasecategories.filter(ml => ml.diseaseCategoryId == this.state.diseaseCategoryId);
        if (diseaseCatAccessionDigit.length > 0) {
          this.setState({
            accessionDigit: diseaseCatAccessionDigit[0].accessionDigit
          });
        }
      }

      let data = JSON.stringify({
        diseaseId: 0,
        diseaseName: this.state.newDisease,
        EfoDiseasCode: this.state.newDiseaseCode,
        diseaseCode: this.state.newDiseaseCode,
        category: this.state.diseasename,
        description: '',
        accessionDigit: 0,
        diseaseCategoryId: this.state.diseaseCatId != ""
          ? this.state.subDiseaseCatId ? Number(this.state.subDiseaseCatId) : parseInt(this.state.diseaseCatId)
          : null,
        createdBy: (userToken.userId == null ? 0 : userToken.userId),
        createdByFlag: 'A'
      })

      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(result => {

          this.setState({ loading: false });

          if (result.data.flag) {
            let Alldisease = this.state.Alldisease
            let disease = this.state.disease
            let data = result.data.outdata
            let newDisease = {
              id: data.diseaseId,
              name: data.diseaseName,
              diseaseCatId: data.diseaseCategoryId,
              isActive: true
            }
            Alldisease.unshift(newDisease)
            disease.unshift(newDisease)
            this.setState({ diseaseId: result.data.outdata.diseaseId, Alldisease, disease, newDisease: '', newDiseaseCode: '', currentdiseasename: data.diseaseName })
            // this.setState({
            //   modal: !this.state.modal,
            //   modalTitle: 'Success',
            //   modalBody: result.data.message
            // });
            toast.success(result.data.message)
            // this.setState({ redirect: true });
            // this.props.history.push('/master/diseases/list');
          }
          else {
            // this.setState({
            //   modal: !this.state.modal,
            //   modalTitle: 'Error',
            //   modalBody: result.data.message
            // });
            toast.error(result.data.message)
          }
        })
        .catch(error => {
          //console.log(error);
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: error.message,
            loading: false
          });
          toast.error(error.message)
          //this.setState({ authError: true, error: error });
        });
      // }
      // else {
      //   this.setState({ loading: false });
      // }
    } else {
      let errors = this.state.errors;
      if (!this.state.newDisease) {
        errors.newDisease = 'Please enter new disease.';
      }
      if (!this.state.newDiseaseCode) {
        errors.newDiseaseCode = 'Please enter code for new disease.';
      }
      this.setState({ errors })

    }
  }
  getCostumerCareData() {
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/BE_OrganizationUser/GetByRoleId?id=5";
    // let data = JSON.stringify({
    //   isDeleted: true,
    //   searchString: "",
    //   id: 0,
    // });
    axios
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
  getCountry(countryId = 233, stateId = '', cityId = '') {
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/BE_Common/GetPatientDropdown";
    let data = JSON.stringify({
      isDeleted: true,
      searchString: "",
      id: 0,
    });
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log(result.data.outdata.laboratoryData, "hhhhhhhhhhhhhh");
        // console.log(result.data);
        if (result.data.flag) {
          let dcid = 0;
          let dcname = "";
          let currentdisease = [];
          let subDiseaseCatId = ''
          if (result.data.outdata.diseaseCatData.length > 0) {

            dcid = result.data.outdata.diseaseCatData[0].diseaseCategoryId;
            // let subDcid=''
            // if (result.data.outdata.diseaseCatData[0]?.subCategory?.length > 0) {
            //   subDcid= result.data.outdata.diseaseCatData[0]?.subCategory[0]?.diseaseCategoryId
            // }
            dcname = result.data.outdata.diseaseCatData[0].diseaseCategoryName;


            if (result.data.outdata.diseaseCatData[0].subCategory?.length > 0) {
              subDiseaseCatId = result.data.outdata.diseaseCatData[0].subCategory[0].diseaseCategoryId

            }
            // alert(subDiseaseCatId)
            let dData = result.data.outdata.diseaseData
            currentdisease = dData.filter(
              (ds) => {
                if (subDiseaseCatId) {

                  return ds.diseaseCatId == subDiseaseCatId
                } else {

                  return ds.diseaseCatId == dcid
                }
                // return ds.diseaseCatId == subDiseaseCatId ? subDiseaseCatId : dcid;
              }
            );
            // alert(`in ${currentdisease.length}`)
          }
          // alert(`out ${currentdisease.length}`)
          // debugger;
          // console.log(dcid);
          // alert(subDiseaseCatId)

          // console.log({ a: result.data.outdata.laboratoryData });
          this.setState(
            {
              countries: result.data.outdata.countryData,
              ocountries: result.data.outdata.ocountryData,
              Alldisease: result.data.outdata.diseaseData,
              allpractitioners: result.data.outdata.practitionerData,
              diseaseCat: result.data.outdata.diseaseCatData,
              diseaseCatId: dcid,
              diseasename: dcname,
              subDiseaseCatId,
              // disease: currentdisease,
              // currentdisease
              // laboratoryData
              // laboratoryData: result.data.outdata.laboratoryData,
              //allTissues: result.data.outdata.tissueData
            },
            () => {
              this.getlabdetailsBydiseaseCatId(subDiseaseCatId || dcid)
              this.getStateData(countryId, stateId, cityId);
              //const param = this.props.match.params;
              //if (param.id != undefined) {
              //  this.getData(param.id);
              //} else {
              //  this.setState({ loading: false });
              //}
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
  //   getCountryName = () => {
  //   let filter = this.state.countries.filter(obje=>obje.id == this.state.ocountryId)
  // }
  //getPractioner() {
  //  const apiroute = window.$APIPath;
  //  const url = apiroute + '/api/BE_Practitioner/GetAll';
  //  let data = JSON.stringify({
  //    isDeleted: true,
  //    searchString: '',
  //    Id: 0
  //  });
  //  axios.post(url, data, {
  //    headers: {
  //      'Content-Type': 'application/json; charset=utf-8'
  //    }
  //  }).then(result => {
  //    if (result.data.flag) {
  //      this.setState({
  //        allpractitioners: result.data.outdata
  //      }, () => { this.getDisease() });
  //    } else {
  //      this.setState({ loading: false });
  //    }
  //  }).catch(error => {
  //    console.log(error);
  //    this.setState({ loading: false });
  //  });
  //}

  //getDisease() {
  //  var userToken = JSON.parse(localStorage.getItem('AUserToken'));
  //  let userId = (userToken.userId == null ? 0 : userToken.userId);

  //  const apiroute = window.$APIPath;
  //  const url = apiroute + '/api/BE_Disease/GetDRPAll';

  //  let data = JSON.stringify({
  //    isDeleted: true,
  //    searchString: this.state.searchString,
  //    id: userId
  //  });

  //  axios.post(url, data, {
  //    headers: {
  //      'Content-Type': 'application/json; charset=utf-8'
  //    }
  //  }).then(result => {
  //    if (result.data.flag) {
  //      this.setState({
  //        disease: result.data.outdata
  //      }, () => {

  //        const param = this.props.match.params;
  //        if (param.id != undefined) {
  //          this.getData(param.id);
  //        } else {
  //          this.setState({ loading: false });
  //        }
  //      });
  //    } else {
  //      this.setState({ loading: false });
  //    }
  //  }).catch(error => {
  //    console.log(error);
  //    this.setState({ loading: false });
  //  });
  //}

  //get detail(for update)

  getData = () => {
    const apiroute = window.$APIPath;
    const param = this.props.match.params;
    let newAccesion = this.props.location.state?.newAccesion || false
    this.setState({
      newAccesion
    })

    if (newAccesion) {


      const url = apiroute + "/api/BE_Patient/GetById?id=" + `${param.id}`;

      axios
        .get(url, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            var rData = result.data.outdata;
            // console.log("Orignial", rData);
            //console.log("Orignial1", Moment(rData.dateOfBirth.slice(0, 10), "DD-MM-YYYY").format('YYYY-MM-DD'));
            //this.getStateData(rData.countryId, rData.stateId, rData.cityId);

            let currentdisease = this.state.disease.filter((ds) =>
              ds.name.toLowerCase().includes("complete health score")
            );
            if (currentdisease.length > 0) {
              if (currentdisease[0].id == rData.diseaseId) {
                this.setState({ diseasename: "Complete Health Score" });
              }
            }

            this.setState(
              {
                patientId: rData.patientId,
                firstName: rData.firstName,
                patientKey: rData.accessionNo,
                middleName: rData.middleName,
                lastName: rData.lastName,
                // dateOfBirth: (rData.dateOfBirth != null ? Moment(rData.dateOfBirth.slice(0, 10), "MM-DD-YYYY").format('YYYY-MM-DD') : ""),
                dateOfBirth:
                  rData.dateOfBirth != null ? Moment(rData.dateOfBirth)._d : "",
                age: rData.age,
                sex: rData.sex,
                address: rData.address,
                cityId: rData.cityId,
                countryId: rData.countryId,
                stateId: rData.stateId,
                postalCode: rData.postalCode,
                email: rData.email,
                phoneNumber: rData.phoneNumber,
                mobile: rData.mobile,
                diseaseId: rData.diseaseId,
                userId: rData.userId,
                // weight: rData.weight,
                // height: rData.height,
                Tissue: rData.tissue,
                practitionerId: rData.practionerId,
                // ocountryId: rData.oCountryId
              },
              () => {
                if (rData.diseaseId != null) {
                  this.getTissueData(rData.diseaseId, rData.tissue);
                }
                if (rData.countryId != null) {
                  // this.getStateData(rData.countryId, rData.stateId, rData.cityId);
                  this.getCountry(rData.countryId, rData.stateId, rData.cityId)
                } else {
                  this.setState({ loading: false });
                }
              }
            );
            // console.log(this.state);
          }
        })
        .catch((error) => {
          // console.log(error);
          this.setState({ loading: false });
        });
    } else {
      this.getCountry();

    }
  };

  //form reset button click
  onResetClick(e) {
    e.preventDefault();
    this.setState({
      loading: true,
      addressLine1: "",
      firstName: "",
      patientKey: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      age: 0,
      sex: "",
      diseasename: "cancer",
      address: "",
      // weight: "",
      // height: "",
      ocountryId: 1,
      countryId: 0,
      // countries: [],
      stateId: 0,
      states: [],
      cityId: 0,
      cities: [],
      postalCode: "",
      email: "",
      phoneNumber: "",
      mobile: "",
      diseaseId: "",
      Tissue: "",
      practitionerId: 0,
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
        practitionerId: "",
        stateId: "",
        postalCode: "",
        email: "",
        phoneNumber: "",
        mobile: "",
        diseaseId: "",
        Tissue: "",
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
    }, () => {
      const param = this.props.match.params;
      if (param.id && param.aid) {

        this.getData()
      } else {
        this.getCountry();
        this.getCostumerCareData()
        setTimeout(() => { this.setState({ loading: false }) }, 800)
      }
    });
  }
  getlabdetailsBydiseaseCatId(diseaseCatId) {
    // alert(diseaseCatId)
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/BE_NGSLaboratory/GetNGSLaboratorybyDiseaseCatId?id=" + diseaseCatId;
    this.setState({ loading: true })
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }).then((result) => {
        if (result.data.flag) {
          let currentdisease = this.state.Alldisease.filter(
            (ds) => ds.diseaseCatId == diseaseCatId
          );

          let labids = result?.data?.outdata?.map((ele) => ele.ngsLaboratoryId)
          currentdisease.unshift({ id: 0, name: "unknown" });
          // console.log(currentdisease);
          let diseaseId = currentdisease[1]?.id || '';
          let diseasName = currentdisease[1]?.name || '';
          // console.log(`diseasName`, diseasName);

          // this.state.errors.diseaseId = diseasName == "Cancer - No Tumor" || diseasName == "Cancer With Tumor"

          // this.state.errors.diseaseId = diseasName == "Cancer - No Tumor" || diseasName == "Cancer With Tumor"
          //   ? diseaseId == '' ? "Please select disease."
          //     : ""
          //   : "";

          // alert(`diseaseCatId: ${diseaseCatId} +  diseaseId : ${this.state.diseaseId} + diseaseCatId: ${currentdisease[0]?.diseaseCatId}+ currentdisease: ${currentdisease?.length} `)
          // if (['8', '9', '10'].includes(String(diseaseCatId))) {
          //   //  diseaseId
          //   diseaseId = String(diseaseCatId)
          //   // this.setState({ diseaseId: value })
          // }
          // console.log(diseaseId);
          // let diseasecategoryname = this.state.Alldisease.filter((ele) => ele.diseaseCatId == diseaseId);
          // diseaseId = diseasecategoryname[0]?.id;
          this.setState({ laboratoryData: result?.data?.outdata || [], labs: labids, disease: currentdisease, diseaseId, currentdiseasename: diseasName }, () => {
            this.getTissueData(diseaseId, '')
          })
        }

      }).finally(() => { this.setState({ loading: false }) })

  }
  handleDateChange(date) {
    // console.log("sdfsd", date);
    let errors = this.state.errors;
    errors.dateOfBirth = !date ? "Please enter date of birth." : "";
    var newAge = date ? this.calculate_age(date) : 0;
    this.setState({ dateOfBirth: date, age: newAge });
  }

  //input handle input change and validation
  handleInputChange(event) {

    const target = event.target;
    let value = target.value;
    const name = target.name;
    //console.log(value);

    if (name === 'email') {
      value = String(value).toLowerCase()
    }
    if (name == "ccId") {
      // console.log(`value`, target);
    }
    // alert(`${ name } - ${ value } `)
    this.setState({
      [name]: value,
    });


    if (name == "diseaseCatId") {
      this.state.metastasis = 'no';

      let index = this.state.diseaseCat.findIndex(ele => ele.diseaseCategoryId == value)
      // console.log(index);
      let catId = value
      if (index >= 0) {
        if (this.state.diseaseCat[index]?.subCategory?.length > 0) {
          catId = this.state.diseaseCat[index].subCategory[0].diseaseCategoryId
        }
      }
      this.getlabdetailsBydiseaseCatId(catId)

      let currentdiseasecat = this.state.diseaseCat.filter(
        (ds) => ds.diseaseCategoryId == value
      );

      // let currentdisease = this.state.Alldisease.filter(
      //   (ds) => ds.diseaseCatId == value
      // );
      let subCategory = currentdiseasecat[0]?.subCategory
      let stateData = { diseasename: currentdiseasecat[0].diseaseCategoryName, }
      if (subCategory[0]?.diseaseCategoryId) {
        stateData.subDiseaseCatId = subCategory[0].diseaseCategoryId

        stateData.disease = this.state.Alldisease.filter(
          (ds) => ds.diseaseCatId == subCategory[0].diseaseCategoryId
        );
        // if (['8', '9', '10'].includes(String(stateData.subDiseaseCatId))) {
        //   //  diseaseId
        //   stateData.diseaseId = stateData?.disease[0]?.diseaseCategoryId || ''//subCategory[0].diseaseCategoryId
        //   // this.setState({ diseaseId: value })
        // }
      } else {
        stateData.subDiseaseCatId = ''
        // stateData.diseaseId = ''
        stateData.disease = this.state.Alldisease.filter(
          (ds) => ds.diseaseCatId == value
        );
      }
      if (currentdiseasecat.length > 0) {
        this.setState(stateData);
      }

    }
    if (name === 'subDiseaseCatId') {
      // if (['8', '9', '10'].includes(String(value))) {
      //  diseaseId
      // this.setState({ diseaseId: value })
      // }
      this.getlabdetailsBydiseaseCatId(value)
    }

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
    const validAlphaNoRegex = RegExp(/^[a-zA-Z0-9' \b]+$/);
    const validEmailRegex = RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    switch (name) {
      case "firstName":
        errors.firstName = !value
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
        errors.lastName = !value
          ? "Please enter lastname."
          : validAlphaNoRegex.test(value)
            ? ""
            : "Only alphanumeric allowed.";
        this.setState({ lastName: value.replace(/[^a-zA-Z0-9' \b]+$/, "") });
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

      case "email":
        errors.email = !value
          ? "Please enter email."
          : validEmailRegex.test(value)
            ? ""
            : "Invalid Email.";
        break;

      case "dateOfBirth":
        var newAge = value ? this.calculate_age(value) : 0;
        this.setState({ age: newAge });
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
      // case 'weight':
      //   errors.weight = (!value) ? 'Please enter weight.' : '';
      //   break;
      // case 'height':
      //   errors.height = (!value) ? 'Please enter height.' : '';
      //   break;

      case "postalCode":
        errors.postalCode = value
          ? validNumberRegex.test(value)
            ? ""
            : "Only numbers allowed."
          : "";
        this.setState({ postalCode: value.replace(/[^0-9]+$/, "") });
        break;

      case 'newDisease':
        errors.newDisease = (!value) ? 'Please enter new disease.' : '';
        break;

      case 'newDiseaseCode':
        errors.newDiseaseCode = (!value) ? 'Please enter code for new disease.' : '';
        break;

      case 'newTissue':
        errors.newTissue = (!value) ? 'Please enter new tissue.' : '';
        break;

      case "diseaseId":

        errors.diseaseId =
          // this.state.diseasename == "Cancer - No Tumor" || this.state.diseasename == "Cancer With Tumor"

          Number(this.state.diseaseCatId) == 4 || Number(this.state.diseaseCatId) == 1
            ? !value ? "Please select disease."
              : ""
            : "";
        break;
      // case 'ocountryId':
      //   errors.ocountryId = this.state.diseasename == "Cancer Patients" ? ((!value) ? 'Please select country.' : '') : ''
      //   break;
      case "practitionerId":
        errors.practitionerId = !value ? "Please select practitioner." : ""

        break;
      case 'Tissue':
        errors.Tissue = !value ? 'Please select tissue.' : '';
        //this.setState({ Tissue: value });
        break;
      case 'metastasis':
        errors.metastasis = !value ? 'Please select Metastasis.' : '';
        break;
      // case 'dateOfBirth':
      //   errors.dateOfBirth = (!value) ? 'This field is required.' : ''
      //   break;
      // case 'address':
      //   errors.address = (!value) ? 'This field is required.' : ''
      //   break;
      case "postalCode":
        errors.postalCode = !value ? "Please enter valid postal code." : "";
        break;
      // case 'mobile':
      //   errors.mobile = (!value) ? 'This field is required.' : ''
      //   break;
      //case 'cityId':
      //  errors.cityId = (!value) ? 'This field is required.' : ''
      //  break;
      case "countryId":
        errors.countryId = !value ? "Please select country." : "";
        break;
      case "stateId":
        errors.stateId = !value ? "Please select state." : "";
        break;
      case "cityId":
        errors.cityId = !value ? "Please select city." : "";
        break;
      case "diseaseForNonCancer":
        errors.diseaseForNonCancer = !value ? "Please enter disease." : "";
        break;
      case "ccId":
        errors.ccId = !value ? "Please select Representative." : "";
        break;
      default:
        //(!value) ? '' :'This field is required.'
        break;
    }

    this.setState({ errors }, () => {
      // debugger;
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
      if (name == "diseaseId") {
        // alert(value)
        if (value != "") {
          // alert(value)
          let currentdiseasename = this.state.disease.filter(obj => obj.id == value)?.[0]?.name || ''
          this.setState({ allTissues: [], Tissue: "", currentdiseasename });

          this.getTissueData(value, "");
        } else {

          this.setState({ allTissues: [], Tissue: "", });
        }
      }

      // if (name == "diseaseCatId") {
      //   // debugger;
      //   // this.setState({ disease: [], diseaseId: "" });
      //   if (value != "") {
      //     let currentdisease = this.state.Alldisease.filter(
      //       (ds) => ds.diseaseCatId == value
      //     );
      //     let currentdiseasecat = this.state.diseaseCat.filter(
      //       (ds) => ds.diseaseCategoryId == value
      //     );
      //     let subDCatId = ''
      //     let subCategory = currentdiseasecat[0]?.subCategory
      //     le
      // stateData = { diseasename: currentdiseasecat[0].diseaseCategoryName, disease: currentdisease, currentdisease }
      //     if (subCategory[0]?.diseaseCategoryId) {
      //       stateData.subDiseaseCatId = subCategory[0].diseaseCategoryId
      //       if (['8', '9', '10'].includes(String(stateData.subDiseaseCatId))) {
      //         //  diseaseId
      //         stateData.diseaseId = subCategory[0].diseaseCategoryId
      //         // this.setState({ diseaseId: value })
      //       }
      //     }
      //     if (this.state.diseasename.toLowerCase() != "cancer") {
      //       alert(currentdisease[0]?.id || value)
      //       this.setState({ diseaseId: currentdisease[0]?.id || value });
      //     } else {
      //       currentdisease.push({ id: 0, name: "Custom", isActive: true });
      //       if (currentdisease.length > 0) {

      //         this.setState({ disease: currentdisease });
      //       }
      //     }
      //   }
      // }
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
    if (this.state.labs.length === 0) {
      // debugger
      errors.labs = "Please Assign Laboratory"
    } else {
      // debugger
      errors.labs = ''
    }
    // debugger
    if (this.state.firstName == undefined || this.state.firstName == "") {
      errors.firstName = "Please enter firstname.";
    }

    if (this.state.lastName == undefined || this.state.lastName == "") {
      errors.lastName = "Please enter lastname.";
    }

    if (this.state.email == undefined || this.state.email == "") {
      errors.email = "Please enter email.";
    }
    // if (this.state.weight == undefined || this.state.weight == '') {
    //   errors.weight = 'Please enter weight.';
    // }
    // if (this.state.height == undefined || this.state.height == '') {
    //   errors.height = 'Please enter height.';
    // }
    // console.log("diseasenamer",this.state.diseasename)

    if (
      this.state.practitionerId == undefined ||
      this.state.practitionerId == ""
    ) {
      errors.practitionerId = "Please select practitioner.";


      // if (this.state.ocountryId == undefined || this.state.ocountryId == '') {
      //   errors.ocountryId = 'Please select country.';
      // }
    } else {
      errors.practitionerId = "";
      // errors.Tissue = "";
      // errors.diseaseId = "";
      // errors.ocountryId = "";
      // errors.metastasis = "";

    }
    if (
      this.state.ccId == undefined ||
      this.state.ccId == ""
    ) {
      errors.ccId = "Please select Representative.";


      // if (this.state.ocountryId == undefined || this.state.ocountryId == '') {
      //   errors.ocountryId = 'Please select country.';
      // }
    } else {
      errors.ccId = "";
      // errors.Tissue = "";
      // errors.diseaseId = "";
      // errors.ocountryId = "";
      // errors.metastasis = "";

    }
    if (['1', '4'].includes(String(this.state.diseaseCatId))) {
      if (this.state.diseaseId == undefined || this.state.diseaseId == "") {
        errors.diseaseId = "Please select disease.";
      } else {
        errors.diseaseId = "";
      }
      if (this.state.metastasis == undefined || this.state.metastasis == "") {
        errors.metastasis = "Please select Metastasis.";
      } else {
        errors.metastasis = "";
      }
      if (this.state.Tissue == undefined || this.state.Tissue == '') {
        errors.Tissue = 'Please select tissue';
      } else {
        errors.Tissue = "";
      }
    } else {
      errors.Tissue = "";
      errors.diseaseId = "";
      errors.metastasis = "";
    }
    if (this.state.diseaseCatId == 5) {
      if (!this.state?.diseaseForNonCancer) {
        errors.diseaseForNonCancer = "Please enter disease"
      } else {
        errors.diseaseForNonCancer = ''
      }
    } else {
      errors.diseaseForNonCancer = ''
    }

    // if (this.state.middleName == undefined || this.state.middleName == '') {
    //   errors.middleName = 'This field is required.';
    // }
    // if (this.state.address == undefined || this.state.address == '') {
    //   errors.address = 'This field is required.';
    // }
    if (this.state.dateOfBirth == undefined || this.state.dateOfBirth == "") {
      errors.dateOfBirth = "Please enter date of birth.";
    }
    if (this.state.postalCode == undefined || this.state.postalCode == "") {
      errors.postalCode = "Please enter valid postal code.";
    }
    if (this.state.mobile == undefined || this.state.mobile == "") {
      errors.mobile = "Please enter primary phone.";
    }
    if (this.state.cityId == undefined || this.state.cityId == "") {
      errors.cityId = "Please select city.";
    }
    if (this.state.countryId == undefined || this.state.countryId == "") {
      errors.countryId = "Please select country.";
    }
    if (this.state.stateId == undefined || this.state.stateId == "") {
      errors.stateId = "Please select state.";
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

  handleShowPreview(e) {
    e.preventDefault()
    this.setState({ loading: true, });
    if (this.validateForm(this.state.errors)) {
      this.setState({
        loading: false,
        previewDetailsModal: true
      })
    } else {
      this.setState({ loading: false, });
    }
  }
  //form submit
  handleSubmit(e) {
    // debugger;

    // e.preventDefault();




    this.setState({ loading: true, });



    const param = this.props.match.params;


    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    //console.log('Submit');
    //console.log(this.state);
    let tissueId = this.state.Tissue
    if (tissueId) {
      tissueId = parseInt(this.state.Tissue)
    } else {
      tissueId = null
    }
    let url = "";
    let data = {}
    let x = new Date(this.state.dateOfBirth);
    let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
    let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
    x.setHours(hoursDiff);
    x.setMinutes(minutesDiff);
    // debugger
    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;

      if (param.id && param.aid) {
        url = apiroute + '/api/BE_Patient/SaveAccessionNo'
        data = JSON.stringify({
          patientAccessionId: 0,
          PatientId: parseInt(this.state.patientId),

          diseaseId: this.state.diseaseId != "" ? parseInt(this.state.diseaseId) : null,

          diseaseCategoryId:
            this.state.diseaseCatId != ""
              ? this.state.subDiseaseCatId ? Number(this.state.subDiseaseCatId) : parseInt(this.state.diseaseCatId)
              : null,

          tissueId: tissueId || 0,
          practionerId:
            this.state.practitionerId != ""
              ? parseInt(this.state.practitionerId)
              : null,
          "accessionNo": this.props.location.state?.accessionNo,
          "isActive": true,
          "createdDate": new Date(),
          "createdBy": userToken.userId,
          "paFlag": "A",
          "isMetastasis": this.state.metastasis == "yes" ? true : false,
          laboratoryId: this.state.labs,
        })
      } else {
        // if (this.state.patientId == 0 || this.state.patientId == undefined) {
        url = apiroute + "/api/BE_Patient/Save";
        // } else {
        //   url = apiroute + "/api/BE_Patient/Update";
        // }
        // console.log("handlesubmit", this.state.age);

        data = JSON.stringify({
          laboratoryId: this.state.labs,
          PatientId: parseInt(this.state.patientId),
          UserId: parseInt(this.state.userId),
          UserType: userToken.userType,
          UserName: userToken.email,
          FirstName: this.state.firstName,
          PatientKey: this.state.patientKey,
          MiddleName: this.state.middleName,
          LastName: this.state.lastName,
          DateOfBirth:
            this.state.dateOfBirth != null && this.state.dateOfBirth != ""
              ? x
              : null,
          //Age: parseInt(this.state.age),
          TissueId:
            tissueId,
          Age:
            this.state.age == "" || this.state.age == null || this.state.age == 0
              ? null
              : this.state.age.toString(),
          Sex: this.state.sex,
          Address: this.state.address,
          // Weight: this.state.weight,
          // Height: this.state.height,
          addressLine1: this.state.addressLine1,
          // addressLine2: this.state.addressLine2,
          oCountryId:
            this.state.ocountryId == "" || this.state.ocountryId == 0
              ? null
              : parseInt(this.state.ocountryId),
          ccId:
            this.state.ccId == "" || this.state.ccId == 0
              ? null
              : parseInt(this.state.ccId),

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
          diseaseId: this.state.diseaseId != "" ? parseInt(this.state.diseaseId) : null,
          practionerId:
            this.state.practitionerId != ""
              ? parseInt(this.state.practitionerId)
              : null,
          diseaseCategoryId:
            this.state.diseaseCatId != ""
              ? this.state.subDiseaseCatId ? Number(this.state.subDiseaseCatId) : parseInt(this.state.diseaseCatId)
              : null,
          diseaseName: this.state.currentdiseasename,
          diseaseCategory: this.state.diseaseCat.filter((ele) => {
            return ele.diseaseCategoryId == this.state.diseaseCatId
          }).map((ele) => {
            return ele.diseaseCategoryName
            // if (isParent) {
            // if (Array.isArray(ele.subCategory) && ele.subCategory.length) {
            //   let child = ele.subCategory.filter((e) => e.diseaseCategoryId == this.state.subDiseaseCatId)
            //   return child[0].diseaseCategoryName
            // } else {
            // }
            // } else {
            //   return parent
            // }
          })[0],
          IsMetastasis: this.state.metastasis == "yes" ? true : false,
          diseaseNameNoCancer: this.state.diseaseCatId == "5" ? this.state.diseaseForNonCancer : ""
        });
      }
      // console.log("data", data);
      // this.setState({
      //   previewDetailsModal: true
      // }) 
      // console.log(`data`, data);

      axios
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          // console.log("data::::", data);

          if (result.data.flag) {
            this.setState({
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message,
              redirect: true,
              loading: false,
            });
            toast.success(this.state.patientId == 0 || this.state.patientId == undefined ? "Patient Registered successfully" : "Patient Accesion number generated successfully");
            this.props.history.push("/patients/list");
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
            CityId: CityId,
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

  getTissueData(DiseaseId, TissueId) {
    const apiroute = window.$APIPath;

    let url = ""
    if (parseInt(DiseaseId) == 0) {

      url = apiroute + "/api/BE_Tissue/GetDRPAll";
    } else {
      url = apiroute + "/api/BE_Tissue/GetDRPAllByDiseaseId";
    }


    let data = JSON.stringify({
      isDeleted: true,
      searchString: "",
      id: parseInt(DiseaseId),

    });
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          //console.log(result.data);
          // let tissueId = result.data.outdata?.[0]?.id || TissueId
          this.setState({ allTissues: result.data.outdata, Tissue: TissueId });
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }



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

  //scroll top loader
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smoothly scrolling
    });
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
  }

  newDiseaseCat = {
    "LRI Longevity": [
      {
        diseaseCategoryName: "LRI Entry Analysis",
        diseaseCategoryId: 11,
      },
      {
        diseaseCategoryName: "LRI Mid Analysis",
        diseaseCategoryId: 12,
      },
      {
        diseaseCategoryName: "LRI Exit Analysis",
        diseaseCategoryId: 13,
      },
    ],
  };
  getSelectedPractiotionerDetail() {
    let data = this.state.allpractitioners.filter((obj) => obj.practitionerId == this.state.practitionerId);
    return `${data[0]?.firstName}  ${data[0]?.lastName}`
    // this.setState({practitionerfirstName:data[0].firstName,practitionerlastName:data[0].lastName})
  }
  getSelectedCcRepDetail() {
    let data = this.state.costumerCare.filter((obj) => obj.userId == this.state.ccId);
    // console.log(`data`, data);

    return `${data[0]?.fullName}`
    // this.setState({practitionerfirstName:data[0].firstName,practitionerlastName:data[0].lastName})
  }


  getSelectedanalysistype() {
    let data = this.state.diseaseCat.filter((obj) => obj.diseaseCategoryId == this.statediseaseCatId);
    // console.log(data);
    if (data?.subCategory?.length > 0) {

    }
    else {
      return `${data[0]?.productName}`;
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
      disease,
      diseaseId,
      diseasename,
      ocountryId,
      ocountries,
      practitionerId,
      allpractitioners,
      // height,
      // weight,
      Tissue,
      allTissues,
      diseaseCat,
      diseaseCatId,
      basicInfo,
      newDisease,
      newDiseaseCode,
      newTissue,
      costumerCare,
      subDiseaseCatId,
      newAccesion
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="9" xl="10">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Patient Detail
            </h5>
          </Col>
          <Col xs="1" lg="3" xl="2">
            <Link to="/patients/list">
              <button className="btn btn-primary btn-block">
                Back to List
              </button>
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
                  onSubmit={this.handleShowPreview.bind(this)}
                >
                  <Row>
                    <Col xs="4" className="mb-2">
                      <FormGroup>
                        <Label><b>Neo7 Analysis Type</b> </Label>
                        {/* {console.log(diseaseCat)} */}
                        {diseaseCat.map((data, i) => {
                          return (
                            <div className="custom-control custom-radio mb-2">

                              {
                                data.diseaseCategoryId == diseaseCatId ? (
                                  <>

                                    <Input
                                      type="radio"
                                      checked
                                      className="custom-control-input"
                                      value={data.diseaseCategoryId}
                                      onChange={this.handleInputChange.bind(this)}
                                      id={data.diseaseCategoryName}
                                      name="diseaseCatId"
                                      tabIndex={i + 1}
                                    />
                                    <Label
                                      className="custom-control-label"
                                      style={{ fontWeight: "500" }}
                                      htmlFor={data.diseaseCategoryName}
                                    >
                                      {data.diseaseCategoryName
                                      }
                                    </Label>
                                    {

                                      data.subCategory.map((ele) => {

                                        // if (Array.isArray(ele) && ele.length) {
                                        return (
                                          <div className="custom-control custom-radio ">

                                            <div className="custom-control custom-radio my-1">
                                              {ele.diseaseCategoryId == this.state.subDiseaseCatId ? (<Input
                                                type="radio"
                                                checked
                                                className="custom-control-input"
                                                value={ele.diseaseCategoryId}
                                                onChange={this.handleInputChange.bind(
                                                  this
                                                )}
                                                id={ele.diseaseCategoryName}
                                                name="subDiseaseCatId"
                                              // tabIndex={i + 1}
                                              />
                                              ) : (
                                                <Input
                                                  type="radio"
                                                  className="custom-control-input"
                                                  value={ele.diseaseCategoryId}
                                                  onChange={this.handleInputChange.bind(
                                                    this
                                                  )}
                                                  id={ele.diseaseCategoryName}
                                                  name="subDiseaseCatId"
                                                />
                                              )}
                                              <Label
                                                className="custom-control-label"
                                                htmlFor={ele.diseaseCategoryName}
                                              >
                                                {ele.diseaseCategoryName

                                                }
                                              </Label>
                                            </div>

                                          </div>
                                        );

                                      })}

                                  </>
                                ) : (<>


                                  <Label
                                    className="custom-control-label"
                                    style={{ fontWeight: "500" }}
                                    htmlFor={data.diseaseCategoryName}
                                  >
                                    {data.diseaseCategoryName
                                      // +
                                      //   " (" +
                                      //   data.productName +
                                      //   ")"
                                    }
                                  </Label>


                                  <Input
                                    type="radio"
                                    className="custom-control-input"
                                    value={data.diseaseCategoryId}
                                    onChange={this.handleInputChange.bind(this)}
                                    id={data.diseaseCategoryName}
                                    name="diseaseCatId"
                                    tabIndex={i + 1}
                                  />
                                </>
                                )
                              }

                            </div>
                          );
                        })}
                        {/* diseaseCatId == 5 ? data.subCategory. */}

                        {/* <div className="custom-control custom-radio"></div> */}

                        {/*<div className="custom-control custom-radio">*/}
                        {/*  {diseasename == "Cancer Patients" ?*/}
                        {/*    <Input type="radio" checked className="custom-control-input" value="Cancer Patients" onChange={this.handleInputChange.bind(this)} id="CancerPatients" name="diseasename" tabIndex="16" />*/}
                        {/*    :*/}
                        {/*    <Input type="radio" className="custom-control-input" value="Cancer Patients" onChange={this.handleInputChange.bind(this)} id="CancerPatients" name="diseasename" tabIndex="16" />*/}
                        {/*  }*/}
                        {/*  <Label className="custom-control-label" htmlFor="CancerPatients">Cancer</Label>*/}
                        {/*</div>*/}
                        {/*<div className="custom-control custom-radio">*/}
                        {/*  {diseasename == "VibrantHealthX" ?*/}
                        {/*    <Input type="radio" className="custom-control-input" value="VibrantHealthX" onChange={this.handleInputChange.bind(this)} checked id="VibrantHealthX" name="diseasename" tabIndex="15" />*/}
                        {/*    : <Input type="radio" className="custom-control-input" value="VibrantHealthX" onChange={this.handleInputChange.bind(this)} id="VibrantHealthX" name="diseasename" tabIndex="15" />*/}
                        {/*  }*/}
                        {/*  <Label className="custom-control-label" htmlFor="VibrantHealthX">Complete Health Score</Label>*/}
                        {/*</div>*/}
                        {/*<div className="custom-control custom-radio">*/}
                        {/*  {diseasename == "Neurodegenerative" ?*/}
                        {/*    <Input type="radio" className="custom-control-input" value="Neurodegenerative" onChange={this.handleInputChange.bind(this)} checked id="Neurodegenerative" name="diseasename" tabIndex="15" />*/}
                        {/*    : <Input type="radio" className="custom-control-input" value="Neurodegenerative" onChange={this.handleInputChange.bind(this)} id="Neurodegenerative" name="diseasename" tabIndex="15" />*/}
                        {/*  }*/}
                        {/*  <Label className="custom-control-label" htmlFor="Neurodegenerative">Neurodegenerative</Label>*/}
                        {/*</div>*/}
                        {/*<div className="custom-control custom-radio">*/}
                        {/*  {diseasename == "Autoimmunity" ?*/}
                        {/*    <Input type="radio" className="custom-control-input" value="Autoimmunity" onChange={this.handleInputChange.bind(this)} checked id="Autoimmunity" name="diseasename" tabIndex="15" />*/}
                        {/*    : <Input type="radio" className="custom-control-input" value="Autoimmunity" onChange={this.handleInputChange.bind(this)} id="Autoimmunity" name="diseasename" tabIndex="15" />*/}
                        {/*  }*/}
                        {/*  <Label className="custom-control-label" htmlFor="Autoimmunity">Autoimmunity</Label>*/}
                        {/*</div>*/}
                      </FormGroup>
                    </Col>
                    {/* <Col xs="4" className="mb-2">
                      <FormGroup>
                        <Label>Accession No </Label>
                        <Input
                          type="text"
                          name="patientKey"
                          value={patientKey}
                          onChange={this.handleInputChange.bind(this)}
                          disabled
                          maxLength="100"
                        />
                      </FormGroup>
                    </Col> */}
                    <Col xs="4" className="mb-2">
                      <FormGroup>
                        <Label>
                          Practitioner{" "}
                          <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="select"
                          className={
                            errors.practitionerId
                              ? "custom-select is-invalid"
                              : "custom-select is-valid"
                          }
                          name="practitionerId"

                          value={practitionerId}
                          onChange={this.handleInputChange.bind(this)}
                        >
                          <option value="">Select Practitioner</option>
                          {allpractitioners.map((data, i) => {
                            return (
                              <option key={i} value={data.practitionerId}>
                                {data.firstName + " " + data.lastName}
                              </option>
                            );
                          })}
                        </Input>
                        {
                          <span className="error">
                            {errors.practitionerId}
                          </span>
                        }
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          CC Representative{" "}

                        </Label>

                        <Input
                          type="select"
                          className={errors.ccId
                            ? "custom-select is-invalid"
                            : "custom-select is-valid"}
                          name="ccId"

                          // value={countryId}
                          onChange={this.handleInputChange.bind(this)}
                        >
                          <option value="" >Select Representative</option>
                          {costumerCare.map((data, i) => {
                            return (
                              <option key={i} value={data.userId}>
                                {data.fullName}
                              </option>
                            );
                          })}
                        </Input>
                        {<span className="error">{errors.ccId}</span>}
                      </FormGroup>
                    </Col>
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
                          disabled={newAccesion}
                          name="firstName"
                          value={firstName}
                          onChange={
                            (event) => {
                              let regex = /^([A-Za-z\s])+$/gi; //allow alphabetics only

                              if (regex.test(event.target.value) || event.target.value === '')
                                this.handleInputChange.bind(this)(event)
                            }
                          }

                          placeholder="Enter first name"
                          maxLength="15"
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
                          disabled={newAccesion}
                          onChange={
                            (event) => {

                              let regex = /^([A-Za-z\s])+$/gi; //allow alphabetics only

                              if (regex.test(event.target.value) || event.target.value === '')
                                this.handleInputChange.bind(this)(event)
                            }
                          }

                          placeholder="Enter middle name"
                          maxLength="15"
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
                          disabled={newAccesion}
                          onChange={
                            (event) => {
                              // let regex = /^([A-Za-z\s])+$/gi; //allow alphabetics only
                              let regex = /^([A-Za-z'\s])+$/gi;  //allow alphabetics with ' only

                              if (regex.test(event.target.value) || event.target.value === '') {

                                this.handleInputChange.bind(this)(event)
                              }
                            }
                          }

                          placeholder="Enter last name"
                          maxLength="15"
                        />
                        {<span className="error">{errors.lastName}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>

                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Date of Birth <span className="requiredField">*</span>
                        </Label>
                        {/* <Input type="date" max="9999-12-31" className={errors.dateOfBirth ? "is-invalid" : "is-valid"} name="dateOfBirth" value={dateOfBirth} onChange={this.handleInputChange.bind(this)} /> */}
                        <div className="cus-date-picker">
                          <DatePicker
                            selected={dateOfBirth}
                            maxDate={new Date()}
                            onChange={this.handleDateChange.bind(this)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="mm/dd/yyyy"
                            showMonthDropdown
                            showYearDropdown
                            disabled={newAccesion}
                            className={
                              errors.dateOfBirth ? "is-invalid" : "is-valid"
                            }
                            style={{ backgroundColor: newAccesion ? "#e4e7ea !important" : "#fff" }}
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
                          placeholder="Enter age"
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
                              disabled={newAccesion}
                              id="Male"
                              name="sex"
                              tabIndex="15"
                            />
                          ) : (
                            <Input
                              type="radio"
                              className="custom-control-input"
                              value="M"
                              disabled={newAccesion}
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
                              disabled={newAccesion}
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
                              disabled={newAccesion}
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
                          Email <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={errors.email ? "is-invalid" : "is-valid"}
                          name="email"
                          value={email}
                          disabled={newAccesion}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter email"
                          maxLength="50"
                        />
                        {<span className="error">{errors.email}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
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
                          disabled={newAccesion}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter primary phone"
                          maxLength="20"
                        />
                        {/* <Input type="text" className={errors.mobile ? "is-invalid" : "is-valid"} name="mobile" value={mobile} onChange={this.handleInputChange.bind(this)} placeholder="Enter mobile number" maxLength="100" /> */}
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
                          disabled={newAccesion}
                          onChange={this.handleInputChange.bind(this)}
                          maxLength="20"
                          placeholder="Enter secondary phone"
                        />
                        {<span className="error">{errors.phoneNumber}</span>}
                      </FormGroup>
                    </Col>
                    {/* <Col xs="6">
                      <FormGroup>
                        <Label>Weight <span className="requiredField">*</span></Label>
                        <Input
                          type="text"

                          name="weight"
                          value={weight}
                          onChange={

                            this.handleInputChange.bind(this)
                          }
                          maxLength="4"
                          placeholder="Enter weight"
                        />
                        {<span className="error">{errors.weight}</span>}

                      </FormGroup>
                    </Col> */}
                    {/* <Col xs="6">
                      <FormGroup>
                        <Label>Height <span className="requiredField">*</span></Label>
                        <Input
                          type="text"
                          name="height"
                          value={height}
                          onChange={

                            this.handleInputChange.bind(this)
                          }
                          maxLength="4"
                          placeholder="Enter height"
                        />
                        {<span className="error">{errors.height}</span>}

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
                          disabled={newAccesion}
                          placeholder="Enter address"
                        />
                        {/* <Input type="textarea" className={errors.address ? "is-invalid" : "is-valid"} name="address" value={address} onChange={this.handleInputChange.bind(this)} maxLength="100" /> */}
                        {/* {<span className='error'>{errors.address}</span>} */}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Postal Code{" "}
                          <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          name="postalCode"
                          className={
                            errors.postalCode ? "is-invalid" : "is-valid"
                          }
                          disabled={newAccesion}
                          value={postalCode}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter residential postal code"
                          maxLength="20"
                        />
                        {/* <Input type="text" className={errors.postalCode ? "is-invalid" : "is-valid"} name="postalCode" value={postalCode} onChange={this.handleInputChange.bind(this)} placeholder="Enter postal name" maxLength="100" /> */}
                        {<span className="error">{errors.postalCode}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="4">


                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Country{" "}
                          <span className="requiredField">*</span>
                        </Label>

                        <Input
                          type="select"
                          className={
                            errors.countryId
                              ? "is-invalid custom-select"
                              : "is-valid custom-select"
                          }
                          name="countryId"
                          disabled={newAccesion}
                          value={countryId}
                          onChange={this.handleInputChange.bind(this)}
                        >
                          <option value="">Select  Country</option>
                          {countries.map((data, i) => {
                            return (
                              <option key={i} value={data.id}>
                                {data.name}
                              </option>
                            );
                          })}
                        </Input>
                        {<span className="error">{errors.countryId}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          State{" "}
                          <span className="requiredField">*</span>
                        </Label>

                        <Input
                          type="select"
                          className={
                            errors.stateId
                              ? "is-invalid custom-select"
                              : "is-valid custom-select"
                          }
                          disabled={newAccesion}
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
                        {<span className="error">{errors.stateId}</span>}
                      </FormGroup>
                    </Col>

                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          City <span className="requiredField">*</span>
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
                          disabled={newAccesion}
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
                        {<span className="error">{errors.cityId}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      {this.state.diseaseCatId == "5" ?
                        <>
                          <Label>
                            Disease {" "}
                            <span className="requiredField">*</span>
                          </Label>
                          <Input
                            className={
                              errors.diseaseForNonCancer
                                ? "is-invalid "
                                : "is-valid "
                            }
                            type="text"
                            name="diseaseForNonCancer"
                            value={this.state.diseaseForNonCancer}
                            onChange={this.handleInputChange.bind(this)}
                            maxLength="500"
                            placeholder="Enter Disease"
                          />
                          {<span className="error">{errors.diseaseForNonCancer}</span>}

                        </> : ""}

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

                  {/* {['with ctdna & cfdna testing', 'no ctdna & cfdna testing', 'cancer - no tumor', 'cancer with tumor'].includes(diseasename.toLowerCase()) ? ( */}
                  {[1, 4].includes(Number(diseaseCatId)) || [1, 2, 3].includes(Number(subDiseaseCatId)) ? (
                    <React.Fragment>
                      <Row className="mb-3">
                        <Col xs="11" lg="11">
                          <h5 className="mt-2">
                            <i className="fa fa-align-justify"></i> Disease Detail
                          </h5>
                        </Col>
                        <hr className="w-100" />
                        <Col xs="1" lg="1"></Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs="4">
                          <FormGroup>
                            <Label>
                              Disease Name{" "}
                              <span className="requiredField">*</span>
                            </Label>
                            <Input
                              type="select"

                              className={
                                errors.diseaseId
                                  ? "custom-select is-invalid"
                                  : "custom-select is-valid"
                              }
                              name="diseaseId"
                              value={diseaseId}
                              style={{ fontWeight: diseaseId == 0 ? "bold" : "400" }}
                              onChange={this.handleInputChange.bind(this)}
                            >
                              <option value={'-1'} disabled>Select Disease</option>
                              {/* <option value="0">Unknown</option> */}
                              {disease.map((data, i) => {
                                return (
                                  <option key={i} value={data.id} style={{ fontWeight: data.id == 0 ? "bold" : "400" }} selected={data.id == this.state.diseaseId}>
                                    {data.name}
                                  </option>
                                );
                              })}
                            </Input>
                            {<span className="error">{errors.diseaseId}</span>}

                            {/*<Multiselect
                            options={this.state.disease} // Options to display in the dropdown
                            selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                          />*/}
                          </FormGroup>
                        </Col>

                        <Col xs="4">
                          <FormGroup>
                            <Label>Tissue</Label>
                            <span className="requiredField">*</span>
                            <Input
                              type="select"
                              // className="custom-select"
                              className={
                                errors.Tissue
                                  ? "custom-select is-invalid"
                                  : "custom-select is-valid"
                              }
                              name="Tissue"
                              value={Tissue}
                              onChange={this.handleInputChange.bind(this)}
                            >
                              <option value="">Select Tissue</option>
                              {allTissues.map((data, i) => {
                                return (
                                  <option key={i} value={data.id}>
                                    {data.name}
                                  </option>
                                );
                              })}
                            </Input>
                            {<span className="error">{errors.Tissue}</span>}
                          </FormGroup>
                        </Col>
                        <Col xs="4">
                          <FormGroup>
                            <Label>Metastasis{" "}   <span className="requiredField">*</span> </Label><br />
                            <div className="custom-control custom-radio ">
                              {this.state.metastasis == "yes" ? (

                                <Input
                                  type="radio" className="custom-control-input"
                                  value="yes"
                                  checked
                                  onChange={this.handleInputChange.bind(this)}
                                  name="metastasis"
                                  id="Yes"
                                />
                              ) : (

                                <Input
                                  type="radio" className="custom-control-input"
                                  value="yes"

                                  onChange={this.handleInputChange.bind(this)}
                                  name="metastasis"
                                  id="Yes"
                                />
                              )}
                              <Label
                                className="custom-control-label"
                                htmlFor="Yes"
                              >
                                Yes
                              </Label>
                            </div>
                            <div className="custom-control custom-radio">
                              {this.state.metastasis == "no" ?

                                (<Input
                                  type="radio"
                                  value="no"
                                  checked
                                  className="custom-control-input"
                                  onChange={this.handleInputChange.bind(this)}
                                  name="metastasis"
                                  id="No"
                                />)
                                : (
                                  <Input
                                    type="radio"
                                    value="no"
                                    className="custom-control-input"
                                    onChange={this.handleInputChange.bind(this)}
                                    name="metastasis"
                                    id="No"
                                  />)}
                              <Label
                                className="custom-control-label"
                                htmlFor="No"
                              >
                                No
                              </Label>
                            </div>
                            {<span className="error">{errors.metastasis}</span>}
                          </FormGroup>
                        </Col>


                        {/* <Col xs="4">
                          <FormGroup>
                            <Label>Metastasis{" "}   <span className="requiredField">*</span> </Label>
                            <Input
                              type="select"
                              className="custom-select"
                              name="metastasis"
                              onChange={this.handleInputChange.bind(this)}
                            >
                              <option value="">Select Yes or No</option>
                              <option value="Yes"> Yes</option>
                              <option value="No"> No</option>
                            </Input>
                            {<span className="error">{errors.metastasis}</span>}
                          </FormGroup>
                        </Col> */}
                      </Row>
                      <Row >
                        {/* <Row className="mb-3">
                             <Col xs="4"> */}
                        {diseaseId == 0 ?
                          <FormGroup style={{ display: "flex", alignItems: "end " }} className="w-100">

                            <div className="col-5" >

                              <label className=" col-form-label">New Disease<span className="requiredField">*</span></label>

                              <div className="">
                                <Input className="form-control here" type="text" maxLength="100" name="newDisease" placeholder="Enter new disease" value={newDisease} onChange={this.handleInputChange.bind(this)} />
                                {errors.newDisease?.length > 0 && <span className='error'>{errors.newDisease}</span>}
                                {/* </div>
                                    </div> */}


                              </div>
                            </div>
                            <div className="col-5">
                              <label className="col-12 col-form-label">Disease Code<span className="requiredField">*</span></label>

                              <div className="col-12">
                                <Input className="form-control here" type="text" maxLength="50" name="newDiseaseCode" placeholder="Enter code for new disease" value={newDiseaseCode} onChange={this.handleInputChange.bind(this)} />
                                {errors.newDiseaseCode?.length > 0 && <span className='error'>{errors.newDiseaseCode}</span>}
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="col-12">
                                {loading ?
                                  <button type="button" className="btn btn-primary kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light" disabled="disabled">Add</button>
                                  :
                                  <button type="button" onClick={this.handleSubmitDisease.bind(this)} className="btn btn-primary" >Add</button>
                                }
                              </div>
                            </div>
                          </FormGroup>
                          : null}
                        {/* </Col>
                            </Row> */}
                      </Row>
                    </React.Fragment>
                  ) : null}
                  <React.Fragment>
                    <Row className="mb-3">
                      <Col xs="11" lg="11">
                        <h5 className="mt-2">
                          <i className="fa fa-align-justify"></i> Assign Laboratory
                        </h5>
                      </Col>
                      <hr className="w-100" />

                      <Col xs="1" lg="1"></Col>
                    </Row>
                    <Row>
                      <Col xs="6">
                        <FormGroup>
                          <span className="error">
                            {this?.state?.errors?.labs}
                          </span>
                          {this.state.laboratoryData?.length > 0
                            ? this.state.laboratoryData.map((data, i) => {
                              return (
                                <FormGroup check row key={i}>
                                  <Row
                                    className="mb-4"
                                    // style={{ marginBottom: "3px" }}
                                    xs="12"
                                  >
                                    <Col xs="1" style={{ paddingTop: "3px" }}>
                                      <Input
                                        onChange={() => {
                                          this.setLabs(data.ngsLaboratoryId);
                                        }}
                                        checked={this.state.labs.includes(
                                          data.ngsLaboratoryId
                                        )}
                                        id={" chk" + data.ngsLaboratoryId}
                                        className="m-0"
                                        type="checkbox"
                                        name="inline-checkbox1"
                                      />
                                    </Col>
                                    <Col xs="11">
                                      {/* this.setCheckbox(data.sampleTypeId) ? ( */}

                                      <Label
                                        className="form-check-label"
                                        checked={true}
                                        htmlFor={
                                          " chk" + data.ngsLaboratoryId
                                        }
                                        style={{
                                          color: this.state.labs.includes(
                                            data.ngsLaboratoryId
                                          ) ? "#1C3A84" : "#000",
                                          fontWeight: "600"
                                        }}
                                      >
                                        {data.ngsLabName}
                                      </Label>
                                    </Col>
                                  </Row>
                                </FormGroup>
                              );
                            })
                            : ""}
                        </FormGroup>
                      </Col>
                    </Row>
                  </React.Fragment>
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


        <Modal isOpen={this.state.previewDetailsModal} className="modal-dialog preview_data_modal">
          <ModalHeader>Confirm patient Details</ModalHeader>
          <ModalBody className="modal-body">
            <Card className="viewPatientForm">
              <CardBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>First Name:</Label>
                      <span className="form-control p-0" readonly>
                        {this.state.firstName != null
                          ? this.state.firstName
                          : ""}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Middle Name:</Label>
                      <span className="form-control p-0">
                        {this.state.middleName != null
                          ? this.state.middleName
                          : ""}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Last Name:</Label>
                      <span className="form-control p-0">
                        {this.state.lastName != null
                          ? this.state.lastName
                          : ""}
                      </span>
                    </FormGroup>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Date of Birth:</Label>
                      <span className="form-control p-0">
                        {this.state.dateOfBirth != null &&
                          this.state.dateOfBirth != "" ? (
                          <React.Fragment>
                            {Moment(this.state.dateOfBirth).format(
                              "MM/DD/YYYY"
                            )}
                            {/*format('DD MMM YYYY')*/}
                          </React.Fragment>
                        ) : (
                          "NA"
                        )}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Age:</Label>
                      <span className="form-control p-0">
                        {this.state.age != null && this.state.age != ""
                          ? this.state.age
                          : "0"}
                        &nbsp;Year(s)
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Sex:</Label>
                      <span className="form-control p-0">
                        {this.state.sex == "M"
                          ? "Male"
                          : this.state.sex == "F"
                            ? "Female"
                            : "-"}
                      </span>
                    </FormGroup>
                  </Col>
                </Row>
                <hr />

                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Email:</Label>
                      <a
                        className="form-control p-0"
                        href={`mailto: ${this.state.email}`}
                      >
                        {this.state.email != null ? this.state.email : ""}
                      </a>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Primary Phone:</Label>
                      <span className="form-control shadow-none p-0">
                        {this.state.mobile != null ? this.state.mobile : ""}
                      </span>

                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Secondary Phone:</Label>
                      <span className="form-control shadow-none p-0">
                        {this.state.phoneNumber != null
                          ? this.state.phoneNumber
                          : ""}
                      </span>
                    </FormGroup>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md='6'>
                    <FormGroup>
                      <Label>Neo7 Analysis Type:</Label>
                      <span className="form-control p-0">
                        {this.state.diseaseCat.filter((ele) => {
                          return ele.diseaseCategoryId == this.state.diseaseCatId
                        }).map((ele) => {
                          // if (isParent) {
                          if (Array.isArray(ele.subCategory) && ele.subCategory.length) {
                            let child = ele.subCategory.filter((e) => e.diseaseCategoryId == this.state.subDiseaseCatId)
                            return `${ele.diseaseCategoryName} - ${child[0].diseaseCategoryName}`
                          } else {
                            return `${ele.diseaseCategoryName}`
                          }
                          // } else {
                          //   return parent
                          // }
                        })}  {this.state.metastasis == 'yes' ? <>-<b style={{ color: "red" }}> Metastasis</b></> : ""}
                      </span>
                    </FormGroup>
                  </Col>
                  {this.state.diseaseCatId == "5" ?
                    <Col md='6'>
                      <Label>Disease:</Label>
                      <span className="form-control shadow-none p-0">
                        {this.state.diseaseForNonCancer != null
                          ? this.state.diseaseForNonCancer
                          : ""}
                      </span>
                    </Col> : ""}
                </Row>
                <hr />
                {/* {['with ctdna & cfdna testing', 'no ctdna & cfdna testing', 'cancer - no tumor', 'cancer with tumor'].includes(diseasename.toLowerCase()) ? */}
                {[4].includes(Number(diseaseCatId)) || [2, 3].includes(Number(subDiseaseCatId)) ?
                  <>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label>Disease:</Label>
                          <span className="form-control p-0">
                            {this.state.currentdiseasename != null ? this.state.currentdiseasename : ""}


                          </span>
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>Tissue:</Label>
                          <span className="form-control p-0">

                            {this.state.allTissues.filter((obj) => obj.id == this.state.Tissue)?.[0]?.name || "N/a"}
                          </span>
                        </FormGroup>
                      </Col>
                      {/* <Col md="4">
                    <FormGroup>
                      <Label>Analysis type:</Label>
                      <span className="form-control">
                        
                        
                      </span>
                    </FormGroup>
                  </Col> */}
                    </Row>
                    <hr />
                  </>
                  : null}


                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Laboratory :</Label>
                      {/* <span className="form-control"> */}
                      {this.state.laboratoryData.filter((obj) => this.state.labs?.includes(obj.ngsLaboratoryId)).map((obj) => <>
                        <br />
                        {obj?.ngsLabName}
                      </>)
                      }
                      {
                      // console.log(this.state.labs)
                      /* {this.state.labs.length > 0 ? this.state.labs.map((ele) => { this.state.laboratoryData.ngsLaboratoryId==ele?this.state.laboratoryData. }) : ""} */}
                      {/* </span> */}
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Practitioner: </Label>
                      <span className="form-control p-0">
                        {this.getSelectedPractiotionerDetail()}

                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label> CC Representative:</Label>
                      <span className="form-control p-0">
                        {this.getSelectedCcRepDetail()}

                      </span>
                    </FormGroup>
                  </Col>
                </Row>
                {/* <hr />
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label>Country:</Label>
                          <span className="form-control">
                            {basicInfo.oCountryName != null
                              ? basicInfo.oCountryName
                              : ""}
                          </span>
                        </FormGroup>
                      </Col>
                    </Row> */}
                <hr />

                <Row>
                  <Col md="12">
                    <FormGroup>
                      {/* {console.log("add", this.state.addressLine1)} */}
                      <Label>Address :</Label>
                      <span
                        className="form-control p-0"
                        style={{ height: "70px" }}

                      >{!this.state.addressLine1
                        ? ""
                        : (this.state.addressLine1.match(/^\s+$/) === null ? (this.state.addressLine1 + ", ") : "")}
                        <span className="">
                          {this.state.cities.filter((obj) => obj.id == this.state.cityId)?.[0]?.name}{", "}
                        </span>
                        <span className="">
                          {this.state.states.filter(obje => obje.id == this.state.stateId)?.[0]?.name}{", "}
                        </span>
                        <span className="">
                          {this.state.postalCode}{", "}
                        </span>
                        <span className="">
                          {this.state.countries.filter((obje) => obje.id == this.state?.countryId)?.[0]?.name}
                        </span>

                      </span>

                    </FormGroup>
                  </Col>
                  {/* <Col md="4">
                    <FormGroup>
                      <Label>City:</Label>
                      <span className="form-control">
                        {this.state.cities.filter((obj) => obj.id == this.state.cityId)?.[0]?.name}

                      </span>
                    </FormGroup>
                  </Col> */}
                  {/* <Col md="4">
                    <FormGroup>
                      <Label>State:</Label>
                      <span className="form-control">
                        {this.state.states.filter(obje => obje.id == this.state.stateId)?.[0]?.name}
                      </span>
                    </FormGroup>
                  </Col> */}
                  {/* <Col md="4">
                    <FormGroup>
                      <Label> Postal Code :</Label>
                      <span className="form-control">
                        {this.state.postalCode}
                      </span>
                    </FormGroup>
                  </Col> */}
                  {/* <Col md="4">
                    <FormGroup>
                      <Label> Country:</Label>
                      <span className="form-control">
                        {this.state.countries.filter((obje) => obje.id == this.state?.countryId)?.[0]?.name}
                      </span>
                    </FormGroup>
                  </Col> */}


                </Row>
                <hr />

                <Row>


                </Row>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => {
              this.setState({
                previewDetailsModal: false,
              })
            }} >
              Close
            </Button>
            <Button
              color="primary"
              onClick={this.handleSubmit.bind(this)}
            >
              Confirm
            </Button>
          </ModalFooter>
        </Modal>

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