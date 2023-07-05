import React, { Component, Fragment } from "react";
import {
  Button,
  Card,
  CardBody,
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
import NumberFormat from "react-number-format";
import { Link, Redirect } from "react-router-dom";
import _, { includes } from "lodash";
import MyModal from "../../CustomModal/CustomModal";
import Seach from "./autocomplete";
import Moment from "moment";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { Steps } from "intro.js-react";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-custom-build";
import HtmlParser from "react-html-parser";
import axiosInstance from "./../../../common/axiosInstance";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { GrammarlyEditorPlugin, Grammarly } from '@grammarly/editor-sdk-react'
import CreatableSelect from 'react-select/creatable';
import { Select } from "@mui/material";

class Details extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.initialState = {
      deseaseName: "",
      selectedAccession: "",
      selecetedAid: "",
      defaultSelectedDiseaseId: null,
      loading: true,
      diseaseForNonCancerDesc: "",
      labs: [],
      existingUser: {},
      existingPopUp: false,
      labSamples: [],
      boxes: [],
      // addressLine2: "",
      addressLine1: "",
      patientId: 0,
      diseaseId: null,
      firstName: "",
      tissueName: "",
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
        // dateOfBirth: "",
        age: "",
        sex: "",
        address: "",
        // cityId: "",
        // countryId: "",
        // stateId: "",
        // postalCode: "",
        // email: "",
        phoneNumber: "",
        // mobile: "",
        // diseaseId: "",
        // Tissue: "",
        practitionerId: "",
        // metastasis: "",
        newDisease: "",
        // newDiseaseCode: "",
        newTissue: "",
        ccId: "",
        diseaseForNonCancer: "",
        diseaseDesc: "",
        practitionerContactPersonId: "",
        // practitionerContactPersonIdDesign: "",
        practitionerContactPerson: [],
        practitionerContact: [],
        discount: "",
        paymentType: ""
        // practitionerContactPersonIdDesign: ""





        // weight: '',
        // height: '',
      },
      diseaseDesc: "",
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
      subDiseaseCatId: "",
      newDisease: "",
      newDiseaseCode: "",
      newTissue: "",
      laboratoryData: [],
      Tissue: "",
      allTissues: [],
      SelectedTissue: null,
      practitionerId: 0,
      allpractitioners: [],
      currentdiseasename: "",
      redesignCheck: false,
      redesignCheckSubmit: false,
      sampleSelect: false,
      previewDetailsModal: false,
      practitionerfirstName: "",
      practitionerlastName: "",
      metastasis: "no",
      costumerCare: [],
      ccId: 0,
      diseaseForNonCancer: "",
      newAccesion: false,
      secondaryCancer: "",
      isOtherDisease: false,
      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      disesevalue: {},
      accessionData: [],
      steps: [
        {
          element: "#pagetitle",
          title: "Add New Patient",
          intro: "Used to add New Patient.",
          tooltipClass: "cssClassName1",
        },
        {
          element: "#backtolist",
          title: "Back to Patient List",
          intro: "Using this button you can go back to the patient list page.",
          tooltipClass: "cssClassName1",
        },
        {
          element: "#analysistype",
          title: "Select Analysis Type",
          tooltipClass: "cssClassName1",
          intro:
            "You can select analysis type from selecting it from this list.",
        },
        {
          element: "#redisgn",
          title: "Redesign",
          tooltipClass: "cssClassName1",
          intro:
            "If another peptide design is required on a prior patient select Redesign.  When submitting the order,  a popup will request you to select the required samples to be submitted.",
        },
        {
          element: "#submitform",
          title: "Submit Form",
          tooltipClass: "cssClassName1",
          intro: "Using this button you can submit your details.",
        },
        {
          element: "#resetform",
          title: "Reset Form",
          tooltipClass: "cssClassName1",
          intro:
            "Using this button you can reset your all details on this form.",
        },
        {
          element: "#help",
          tooltipClass: "cssClassName1",
          title: "Tour",
          intro: "You can always start this tour by clicking this button :)",
        },
      ],
      hintsEnabled: false,
      hints: [
        {
          element: "#hello",
          hint: "Hello hint",
          hintPosition: "middle-right",
        },
      ],
      diseaseNameforReportUse: "",
      discount: "",
      discountType: "",
      practitionerContactPersonId: [],
      practitionerContact: [],
      practitionerContactPerson: [],
      paymentType: "3",
      paymentTypeModal: false



    };
    this.state = this.initialState;
  }

  onExit = (e) => {
    this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 5 }));
    // localStorage.setItem("isFirstLogin", false);
    // this.sendCurrentStep();
  };
  onAfterChange = (newStepIndex) => {
    console.log({ newStepIndex });
    if (newStepIndex === 3) {
      const element = document.querySelector("#redisgn");

      if (!element) this.myRef.current.introJs.nextStep();
    }
  };
  sendCurrentStep = () => {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken?.userId == null ? 0 : userToken?.userId;
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Dashboard/GetAll";
    const url = apiroute + "/api/BE_OrganizationUser/UpdateTooltipSteps";
    let data = JSON.stringify({
      userId: userId,
      step: this.state.currentStep,
      isComplete: !this.state.isSkipped,
      isSkip: this.state.isSkipped,
    });
    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log("result", result);
        if (result.data.flag) {
          this.setState({
            loading: false,
          });
        } else {
          this.setState({ loading: false });
          // console.log(result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  };

  filterDisease = (array, search) => {
    return array.filter((obj) => {
      let str = String(obj.name).toLowerCase();
      search = String(search).toLowerCase();
      return str.search(search) != -1;
    });
  };

  toggleSteps = () => {
    this.setState((prevState) => ({ stepsEnabled: !prevState.stepsEnabled }));
  };

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
    this.getCostumerCareData();
    // this.getUserData()
    this.getData();
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));

    // console.log(userToken)
    // this.getStateData(233, "", "")

    // this.state.sex = "M";
    //this.setState({ loading: false });
  }

  filterDeaseNameDrp(tissueId) {
    let o = this.state.Alldisease.filter(
      (al) => al.id === this.state.defaultSelectedDiseaseId
    );
    let data = { deseaseName: o?.[0]?.name || "" };
    console.log({
      defaultSelectedDiseaseId: this.state.defaultSelectedDiseaseId,
      ad: this.state.Alldisease,
      o,
    });
    if (tissueId) {
      let currentTissue = this.state.allTissues.filter(
        (ele) => ele.id == tissueId
      );
      console.log({
        currentTissue,
        tissueId,
        allTissues: this.state.allTissues,
      });
      if (currentTissue) {
        data.Tissue = currentTissue[0].id;
        data.tissueName = currentTissue[0].name;
      }
    }
    console.log({ data });
    this.setState(data);
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
      let err = "";

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
      this.state.errors.labs = "";
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
  // handleDiseaseNameForReportUse(e) {
  //   const value = e.target.value
  //   this.setState({
  //     diseaseNameforReportUse: value
  //   })

  // }
  handleSubmitDisease = (e) => {
    // debugger;
    if (Number(this.state.newDisease) == 0) {
      // e.preventDefault();
      this.setState({ loading: true });
      var userToken = JSON.parse(localStorage.getItem("AUserToken"));
      //console.log('Submit');
      //console.log(this.state);
      let url = "";

      // if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      // if (this.state.diseaseId == 0) {
      url = apiroute + "/api/BE_Disease/Save";
      // }
      // else {
      //   url = apiroute + '/api/BE_Disease/Update';
      // }

      if (this.state.accessionDigit == 0) {
        let diseaseCatAccessionDigit = this.state.diseasecategories.filter(
          (ml) => ml.diseaseCategoryId == this.state.diseaseCategoryId
        );
        if (diseaseCatAccessionDigit.length > 0) {
          this.setState({
            accessionDigit: diseaseCatAccessionDigit[0].accessionDigit,
          });
        }
      }

      let data = JSON.stringify({
        diseaseId: 0,
        diseaseName: this.state.currentdiseasename,
        // diseaseName: this.state.newDisease,
        EfoDiseasCode: this.state.newDiseaseCode,
        diseaseCode: this.state.newDiseaseCode,
        category: this.state.diseasename,
        description: "",
        accessionDigit: 0,
        diseaseCategoryId:
          this.state.diseaseCatId != ""
            ? String(this.state.subDiseaseCatId)
              ? String(this.state.subDiseaseCatId)
              : String(this.state.diseaseCatId)
            : null,
        createdBy: userToken.userId == null ? 0 : userToken.userId,
        createdByFlag: "A",
        diseaseDesc: this.state.diseaseDesc,
        isOther: true,
        diseaseDisplayName: this.state.currentdiseasename,
      });

      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          this.setState({ loading: false });

          if (result.data.flag) {
            let Alldisease = this.state.Alldisease;
            let disease = this.state.disease;
            let data = result.data.outdata;
            let newDisease = {
              id: data.diseaseId,
              name: data.diseaseName,
              diseaseCatId: data.diseaseCategoryId,
              isActive: true,
            };
            Alldisease.unshift(newDisease);
            disease.unshift(newDisease);
            this.setState({
              diseaseId: result.data.outdata.diseaseId,
              Alldisease,
              disease,
              newDisease: "",
              newDiseaseCode: "",
              currentdiseasename: data.diseaseName,
              isOtherDisease: true,
              // diseaseNameforReportUse: ""
            });

            this.handleSubmit();
            // this.setState({
            //   modal: !this.state.modal,
            //   modalTitle: 'Success',
            //   modalBody: result.data.message
            // });
            // toast.success(result.data.message)
            // this.setState({ redirect: true });
            // this.props.history.push('/master/diseases/list');
          } else {
            // this.setState({
            //   modal: !this.state.modal,
            //   modalTitle: 'Error',
            //   modalBody: result.data.message
            // });
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
      // }
      // else {
      //   this.setState({ loading: false });
      // }
    } else {
      let errors = this.state.errors;
      // if (!this.state.newDisease) {
      //   errors.newDisease = 'Please enter new disease.';
      // }
      // if (!this.state.newDiseaseCode) {
      //   errors.newDiseaseCode = 'Please enter code for new disease.';
      // }
      this.setState({ errors });
    }
  };

  // handleSubmitDiseaseUpdate = (e) => {
  //   // debugger;
  //   if (Number(this.state.newDisease) == 0) {
  //     // e.preventDefault();
  //     this.setState({ loading: true });
  //     var userToken = JSON.parse(localStorage.getItem("AUserToken"));
  //     //console.log('Submit');
  //     //console.log(this.state);
  //     let url = "";

  //     // if (this.validateForm(this.state.errors)) {
  //     const apiroute = window.$APIPath;
  //     // if (this.state.diseaseId == 0) {
  //     url = apiroute + "/api/BE_Disease/Update";
  //     // }
  //     // else {
  //     //   url = apiroute + '/api/BE_Disease/Update';
  //     // }

  //     if (this.state.accessionDigit == 0) {
  //       let diseaseCatAccessionDigit = this.state.diseasecategories.filter(
  //         (ml) => ml.diseaseCategoryId == this.state.diseaseCategoryId
  //       );
  //       if (diseaseCatAccessionDigit.length > 0) {
  //         this.setState({
  //           accessionDigit: diseaseCatAccessionDigit[0].accessionDigit,
  //         });
  //       }
  //     }

  //     let data = JSON.stringify({
  //       diseaseId: Number(this.state.diseaseId),
  //       diseaseName: this.state.currentdiseasename,
  //       // diseaseName: this.state.newDisease,
  //       EfoDiseasCode: this.state.newDiseaseCode,
  //       diseaseCode: this.state.newDiseaseCode,
  //       category: this.state.diseasename,
  //       description: "",
  //       accessionDigit: 0,
  //       diseaseCategoryId:
  //         this.state.diseaseCatId != ""
  //           ? String(this.state.subDiseaseCatId)
  //             ? String(this.state.subDiseaseCatId)
  //             : String(this.state.diseaseCatId)
  //           : null,
  //       createdBy: userToken.userId == null ? 0 : userToken.userId,
  //       createdByFlag: "A",
  //       diseaseDesc: this.state.diseaseDesc,
  //       isOther: true,
  //       // diseaseDisplayName: this.state.diseaseNameforReportUse
  //     });

  //     axiosInstance
  //       .post(url, data, {
  //         headers: {
  //           "Content-Type": "application/json; charset=utf-8",
  //         },
  //       })
  //       .then((result) => {
  //         this.setState({ loading: false });

  //         if (result.data.flag) {
  //           let Alldisease = this.state.Alldisease;
  //           let disease = this.state.disease;
  //           let data = result.data.outdata;
  //           let newDisease = {
  //             id: data.diseaseId,
  //             name: data.diseaseName,
  //             diseaseCatId: data.diseaseCategoryId,
  //             isActive: true,
  //           };
  //           Alldisease.unshift(newDisease);
  //           disease.unshift(newDisease);
  //           this.setState({
  //             diseaseId: result.data.outdata.diseaseId,
  //             Alldisease,
  //             disease,
  //             newDisease: "",
  //             newDiseaseCode: "",
  //             currentdiseasename: data.diseaseName,
  //             isOtherDisease: true,
  //             // diseaseNameforReportUse: ""
  //           });

  //           this.handleSubmit();
  //           // this.setState({
  //           //   modal: !this.state.modal,
  //           //   modalTitle: 'Success',
  //           //   modalBody: result.data.message
  //           // });
  //           // toast.success(result.data.message)
  //           // this.setState({ redirect: true });
  //           // this.props.history.push('/master/diseases/list');
  //         } else {
  //           // this.setState({
  //           //   modal: !this.state.modal,
  //           //   modalTitle: 'Error',
  //           //   modalBody: result.data.message
  //           // });
  //           toast.error(result.data.message);
  //         }
  //       })
  //       .catch((error) => {
  //         //console.log(error);
  //         this.setState({
  //           // modal: !this.state.modal,
  //           // modalTitle: 'Error',
  //           // modalBody: error.message,
  //           loading: false,
  //         });
  //         toast.error(error.message);
  //         //this.setState({ authError: true, error: error });
  //       });
  //     // }
  //     // else {
  //     //   this.setState({ loading: false });
  //     // }
  //   } else {
  //     let errors = this.state.errors;
  //     // if (!this.state.newDisease) {
  //     //   errors.newDisease = 'Please enter new disease.';
  //     // }
  //     // if (!this.state.newDiseaseCode) {
  //     //   errors.newDiseaseCode = 'Please enter code for new disease.';
  //     // }
  //     this.setState({ errors });
  //   }
  // };

  handleLinkOldAccessionId = (value) => {
    return new Promise(async (resolve) => {
      this.setState({ isAccLoading: true });
      const apiroute = window.$APIPath;
      const url = apiroute + "/api/BE_PatientAccessionMapping/GetAllPaging";
      let data = JSON.stringify({
        isDeleted: true,
        searchString: value,
        id: 0,
        pageNo: 0,
        totalNo: 0,
      });
      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          // result.data.outdata
          console.log(result);
          this.setState(
            {
              accessionData: [...result.data.outdata],
            },
            () => {
              this.setState({ isAccLoading: false });
            }
          );
          resolve(result.data.outdata);
          // this.setState({ isAccLoading: false })
        });
    });
  };

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
          costumerCare: result?.data?.outdata,
        });
        // console.log(this.state.costumerCare, "ghvvvvyyvtgvtgresult")
      });
  }
  getCountry(
    countryId,
    stateId = "",
    cityId = "",
    diseaseCategoryId,
    parentDiseaseCategoryId
  ) {
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
        // console.log(result.data.outdata.laboratoryData, "hhhhhhhhhhhhhh");
        // console.log(result.data);
        if (result.data.flag) {
          let dcid = 0;
          let dcname = "";
          let currentdisease = [];
          let subDiseaseCatId = "";
          if (result.data.outdata.diseaseCatData.length > 0) {
            dcid = result.data.outdata.diseaseCatData[0].diseaseCategoryId;
            // let subDcid=''
            // if (result.data.outdata.diseaseCatData[0]?.subCategory?.length > 0) {
            //   subDcid= result.data.outdata.diseaseCatData[0]?.subCategory[0]?.diseaseCategoryId
            // }
            dcname = result.data.outdata.diseaseCatData[0].diseaseCategoryName;

            if (result.data.outdata.diseaseCatData[0].subCategory?.length > 0) {
              subDiseaseCatId =
                result.data.outdata.diseaseCatData[0].subCategory[0]
                  .diseaseCategoryId;
            }
            // alert(subDiseaseCatId)
            let dData = result.data.outdata.diseaseData;
            currentdisease = dData.filter((ds) => {
              if (subDiseaseCatId) {
                return ds.diseaseCatId == subDiseaseCatId;
              } else {
                return ds.diseaseCatId == dcid;
              }
              // return ds.diseaseCatId == subDiseaseCatId ? subDiseaseCatId : dcid;
            });
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
              diseaseCat: result.data.outdata.diseaseCatData.map((e, i) => {
                let order = i + 1;
                return {
                  ...e,
                  order:
                    e?.diseaseCategoryId === 13 ? 3 : order === 3 ? 4 : order,
                };
              }),
              diseaseCatId: parentDiseaseCategoryId || dcid,
              diseasename: dcname,
              subDiseaseCatId: diseaseCategoryId || subDiseaseCatId,
              // disease: currentdisease,
              // currentdisease
              // laboratoryData
              // laboratoryData: result.data.outdata.laboratoryData,
              //allTissues: result.data.outdata.tissueData
            },
            () => {
              // const param = this.props.match.params;
              // let newAccesion = this.props.location.state?.newAccesion || false
              // if (!newAccesion) {
              // alert(`${diseaseCategoryId}||${subDiseaseCatId}||${dcid}`)
              this.getlabdetailsBydiseaseCatId(
                diseaseCategoryId || subDiseaseCatId || dcid
              );
              if (countryId) {
                this.getStateData(countryId, stateId, cityId);
              }
              // }

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
  //  axiosInstance.post(url, data, {
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

  //  axiosInstance.post(url, data, {
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
    let newAccesion = this.props.location.state?.newAccesion || false;
    this.setState({
      newAccesion,
      // redesignCheck: newAccesion,
    });

    if (newAccesion) {
      const url = apiroute + "/api/BE_Patient/GetById?id=" + `${param.id}`;

      axiosInstance
        .get(url, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            var rData = result?.data?.outdata;
            // console.log("Orignial", rData);
            //console.log("Orignial1", Moment(rData.dateOfBirth.slice(0, 10), "DD-MM-YYYY").format('YYYY-MM-DD'));
            //this.getStateData(rData.countryId, rData.stateId, rData.cityId);
            if (rData.patientAccessionMappings) {
              let diseaseId = rData?.patientAccessionMappings[0]?.diseaseID || "";
              let subDiseaseCatId =
                rData?.patientAccessionMappings[0]?.diseaseCategoryId || 2;
              let diseaseCategoryId =
                rData?.patientAccessionMappings[0]?.diseaseCategoryId || "";
              let parentDiseaseCategoryId =
                rData?.patientAccessionMappings[0]?.parentDiseaseCategoryId || 1;

              this.setState(
                {
                  patientId: rData?.patientId,
                  firstName: rData?.firstName,
                  patientKey: rData?.accessionNo || "",
                  middleName: rData?.middleName,
                  lastName: rData?.lastName,
                  defaultSelectedDiseaseId: diseaseId,
                  // dateOfBirth: (rData.dateOfBirth != null ? Moment(rData.dateOfBirth.slice(0, 10), "MM-DD-YYYY").format('YYYY-MM-DD') : ""),
                  dateOfBirth:
                    rData?.dateOfBirth != null ? Moment(rData.dateOfBirth)._d : "",
                  age: rData?.age,
                  sex: rData?.sex,
                  address: rData?.address,
                  cityId: rData?.cityId ?? "",
                  countryId: rData?.countryId ?? "",
                  stateId: rData?.stateId ?? "",
                  postalCode: rData?.postalCode ?? "",
                  email: rData?.email,
                  phoneNumber: rData?.phoneNumber,
                  mobile: rData?.mobile,
                  diseaseId: diseaseId,
                  userId: rData?.userId,
                  // weight: rData.weight,
                  // height: rData.height,
                  Tissue: rData?.tissue,
                  practitionerId: rData?.practionerId,
                  subDiseaseCatId: subDiseaseCatId,
                  diseaseCategoryId,
                  // ocountryId: rData.oCountryId
                },
                () => {
                  let accessionMap = rData?.patientAccessionMappings[0];
                  let diseaseId = accessionMap?.diseaseID;
                  let tissueId = accessionMap?.tissueId;
                  console.log("tissueee id ", { diseaseId, tissueId });
                  if (diseaseId != null) {
                    this.getTissueData(diseaseId, tissueId);
                  }

                  this.getCountry(
                    rData.countryId,
                    rData.stateId,
                    rData.cityId,
                    diseaseCategoryId,
                    parentDiseaseCategoryId
                  );
                }
              );

            }
            else {

              this.setState(
                {
                  patientId: rData?.patientId,
                  firstName: rData?.firstName,
                  // patientKey: rData?.accessionNo || "",
                  middleName: rData?.middleName,
                  lastName: rData?.lastName,
                  // defaultSelectedDiseaseId: diseaseId,
                  // dateOfBirth: (rData.dateOfBirth != null ? Moment(rData.dateOfBirth.slice(0, 10), "MM-DD-YYYY").format('YYYY-MM-DD') : ""),
                  dateOfBirth:
                    rData?.dateOfBirth != null ? Moment(rData.dateOfBirth)._d : "",
                  age: rData?.age,
                  sex: rData?.sex,
                  address: rData?.address,
                  cityId: rData?.cityId ?? "",
                  countryId: rData?.countryId ?? "",
                  stateId: rData?.stateId ?? "",
                  postalCode: rData?.postalCode ?? "",
                  email: rData?.email,
                  phoneNumber: rData?.phoneNumber,
                  mobile: rData?.mobile,
                  // diseaseId: diseaseId,
                  userId: rData?.userId,
                  // weight: rData.weight,
                  // height: rData.height,
                  Tissue: rData?.tissue,
                  // practitionerId: rData?.practionerId,
                  // subDiseaseCatId: subDiseaseCatId,
                  // diseaseCategoryId,
                  // ocountryId: rData.oCountryId
                },
                () => {
                  // let accessionMap = rData?.patientAccessionMappings[0];
                  // let diseaseId = accessionMap?.diseaseID;
                  // let tissueId = accessionMap?.tissueId;
                  // console.log("tissueee id ", { diseaseId, tissueId });
                  // if (diseaseId != null) {
                  //   this.getTissueData(diseaseId, tissueId);
                  // }

                  this.getCountry(
                    rData.countryId,
                    rData.stateId,
                    rData.cityId,
                    2,
                    1
                  );
                }
              );

            }







            // console.log(this.state);
          }
        })
        .catch((error) => {
          // console.log(error);
          this.setState({ loading: false });
        });
    } else {
      this.getCountry(this.state.countryId);
    }
  };

  //form reset button click
  onResetClick(e) {
    e.preventDefault();
    this.setState(
      {
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
        practitionerContactPersonId: [],
        ccId: "",
        discount: "",
        discountType: "",
        paymentType: "",
        errors: {
          firstName: "",
          patientKey: "",
          middleName: "",
          lastName: "",
          // dateOfBirth: "",
          age: 0,
          sex: "",
          address: "",
          // cityId: "",
          // countryId: "",
          practitionerId: "",
          // stateId: "",
          // postalCode: "",
          // email: "",
          phoneNumber: "",
          // mobile: "",
          diseaseId: "",
          // Tissue: "",
        },
        redirect: false,
        modal: false,
        modalTitle: "",
        modalBody: "",
      },
      () => {
        const param = this.props.match.params;
        if (param.id && param.aid) {
          this.getData();
        } else {
          this.getCountry();
          this.getCostumerCareData();
          setTimeout(() => {
            this.setState({ loading: false });
          }, 800);
        }
      }
    );
  }
  getlabdetailsBydiseaseCatId(diseaseCatId) {
    // alert(diseaseCatId)
    const apiroute = window.$APIPath;
    let redesign = this.state.redesignCheck;
    const url =
      apiroute +
      "/api/BE_NGSLaboratory/GetNGSLaboratorybyDiseaseCatId?id=" +
      diseaseCatId +
      "&isRedesign=" +
      redesign;
    this.setState({ loading: true });
    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          let currentdisease = this.state.Alldisease.filter(
            (ds) => ds.diseaseCatId == diseaseCatId
          );

          let labids = result?.data?.outdata?.map((ele) => ele.ngsLaboratoryId);
          // currentdisease.unshift({ id: 0, name: "Other" });
          // console.log(currentdisease);
          let diseaseId = "";
          let diseasName =
            this.state.Alldisease.find(
              (obj) => obj.id == this.state.defaultSelectedDiseaseId
            )?.name || "";
          // alert(`${this.state.defaultSelectedDiseaseId} : ${diseasName}`)
          // console.log({ f, d: this.state.Alldisease })
          let laboratoryData = result?.data?.outdata || [];
          let labSamplesState = [];
          laboratoryData.map((e) => {
            let labId = e.ngsLaboratoryId,
              labSamples = e.ngsLabSamples;

            if (Array.isArray(labSamples) && labSamples.length) {
              labSamples = labSamples.map((s) => {
                return {
                  name: s.sampleTypeName,
                  id: s.sampleTypeId,
                  checked: true,
                };
              });
              let index = labSamplesState.findIndex(
                (ele) => ele.ngsLaboratoryId === labId
              );
              if (index < 0) {
                labSamplesState.push({
                  ngsLaboratoryId: labId,
                  name: e.ngsLabName,
                  sampleTypeId: labSamples,
                });
              }
            }
          });

          this.setState(
            {
              laboratoryData,
              labSamples: labSamplesState,
              labs: labids,
              secondaryCancer: "",
              disease: currentdisease,
              diseaseId,
              currentdiseasename: diseasName,
              errors: {
                ...this.state.errors,
                labs: "",
                diseaseDesc: "",
                newDisease: "",
              },
            },
            () => {
              // this.getTissueData(diseaseId, '')
              if (diseaseId) {
                this.getTissueData(diseaseId, "");
              }
            }
          );
        }
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }
  handleSampleChekbox = (index, sampleIndex, value) => {
    let labSamples = _.cloneDeep(this.state.labSamples);
    labSamples[index]["sampleTypeId"][sampleIndex]["checked"] = value;
    this.setState({ labSamples }, () => {
      let labSamples2 = _.cloneDeep(labSamples)
      let arr0 = []

      let sample2 = labSamples2.filter((lab, i) => {
        let filteredSamples01 = lab.sampleTypeId
          .filter((sample) => sample.checked)
          .map((sample) => sample);
        lab.sampleTypeId = filteredSamples01;
        return filteredSamples01;
      }).map((e) => e.sampleTypeId)

      sample2.forEach((ele) => {
        let ids = ele.map((ele) => ele.id);
        arr0.push(...ids);
      });
      if (arr0.length === 0) {
        this.setState({
          sampleSelect: true,
        });
      } else {
        this.setState({
          sampleSelect: false,
        });
      }

    });
    let redesignLabSamples = [];
    // let chekedBox = [...this.state.boxes];
    let arr = [];
    if (this.state.redesignCheck) {
      redesignLabSamples = this.state.labSamples.filter((lab, i) => {
        let filteredSamples = lab.sampleTypeId
          .filter((sample) => sample.checked)
          .map((sample) => sample);
        lab.sampleTypeId = filteredSamples;
        return filteredSamples;
      });
      let sample = redesignLabSamples.map((e) => e.sampleTypeId);
      // let newarr = sample.map(data=> data.checked)

      sample.forEach((ele) => {
        let ids = ele.map((ele) => ele.id);
        arr.push(...ids);
      });
      // console.log(arr);
      // if (arr.length === 0) {
      //   this.setState({
      //     sampleSelect: true,
      //   });
      // } else {
      //   this.setState({
      //     sampleSelect: false,
      //   });
      // }
      // for (ele of sample) {

      // }
      // console.log(samples)
      // alert(1)
      // return
    }
    // this.setState({ labSamples }, () => {
    //   if (arr.length === 0) {
    //     this.setState({
    //       sampleSelect: true,
    //     });
    //   } else {
    //     this.setState({
    //       sampleSelect: false,
    //     });
    //   }
    // });
  };

  handleDateChange(date) {
    // console.log("sdfsd", date);
    // let errors = this.state.errors;
    // errors.dateOfBirth = !date ? "Please enter date of birth." : "";
    var newAge = date ? this.calculate_age(date) : 0;
    this.setState({ dateOfBirth: date, age: newAge });
  }
  validateEmail = (inputValue) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputValue);
  };

  isValidNewOption = (inputValue, selectValue) => {
    if (!this.validateEmail(inputValue)) {
      return false; // Reject invalid email format
    }

    const isAlreadySelected = selectValue.some(
      (option) =>
        option.value.toLowerCase() === inputValue.toLowerCase()
    );

    return !isAlreadySelected;
  };

  handleEmailChange = (selectedOptions) => {
    const newOptions = selectedOptions.filter((option) => option.__isNew__);
    const existingOptions = selectedOptions.filter(
      (option) => !option.__isNew__
    );

    // Add new options to existing options
    const updatedEmails = [
      ...existingOptions,
      ...newOptions.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    ];
    // this.state.selectedEmails ?
    //   this.setState({ selectedEmails: updatedEmails, sendFREmailErrors: "" }) :
    //   this.setState({ selectedEmails: updatedEmails })
    this.state.practitionerContactPersonId ?
      this.setState({ practitionerContactPersonId: updatedEmails, }) :
      this.setState({ practitionerContactPersonId: updatedEmails })
  };

  handleDiseaseChange = (selectedOption) => {
    // const newOptions = selectedOption.filter((option) => option.__isNew__);
    // const existingOptions = selectedOption.filter(
    //   (option) => !option.__isNew__
    // );

    console.log(selectedOption)
    // if (selectedOption?.id != "0") {
    //   this.setState({
    //     allTissues: [],
    //     Tissue: "",
    //     tissueName: "",
    //     currentdiseasename: selectedOption?.name,
    //     diseaseId: selectedOption?.value
    //   })
    //   this.getTissueData(selectedOption?.value, "");
    // } else {
    //   this.setState({ allTissues: [], Tissue: "" });

    // }
    if (selectedOption?.value !== "" && selectedOption !== null) {
      this.setState({
        allTissues: [],
        Tissue: "",
        tissueName: "",
        SelectedTissue: null,
        currentdiseasename: selectedOption?.label,
        diseaseId: selectedOption?.__isNew__ ? "0" : selectedOption?.value
      })
      selectedOption?.__isNew__ ? this.getTissueData("0", "") : this.getTissueData(selectedOption?.value, "");

    } else {
      this.setState({ allTissues: [], Tissue: "", tissueName: "", currentdiseasename: "", diseaseId: "", SelectedTissue: null });

    }

  }

  handleTissueChange = (selectedOption) => {


    console.log(selectedOption)

    if (selectedOption?.value !== "" && selectedOption !== null) {
      this.setState({
        // allTissues: [],
        // Tissue: "",
        // tissueName: "",
        Tissue: selectedOption.value,
        tissueName: selectedOption.name,
        SelectedTissue: selectedOption
      })

    } else {
      this.setState({ SelectedTissue: {}, Tissue: "", tissueName: "" });

    }

  }



  //input handle input change and validation
  handleInputChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    //console.log(value);
    if (name == "diseaseCatId" && !["2", "3"].includes(String(value))) {
      this.state.Tissue = "";
      this.state.diseaseId = "";
      this.state.tissueName = "";
      this.state.allTissues = []
    }
    if (name == "diseaseCatId" && !["5", "13"].includes(String(value))) {
      this.state.diseaseForNonCancer = ""
    }
    if (name == "diseaseCatId" && ["7", "6"].includes(String(value))) {
      this.state.diseaseDesc = ""
    }

    if (name == "diseaseId") {
      let errors = this.state.errors;
      errors.newDisease = "";
    }
    if (name === "diseaseId" && value === "") {
      value = null;
    }
    if (name === "email") {
      value = String(value).toLowerCase();
    }
    if (name == "ccId") {
      console.log(`value`, value);
      value = value;
    }

    if (name == "redesigncheckbox") {
      this.setState({ redesignCheck: !this.state.redesignCheck }, () => {
        if (this.state?.subDiseaseCatId != "") {
          this.getlabdetailsBydiseaseCatId(this.state?.subDiseaseCatId);
        } else {
          this.getlabdetailsBydiseaseCatId(this.state?.diseaseCatId);
        }
      });
    }
    // alert(`${ name } - ${ value } `)
    this.setState({
      [name]: value ?? "",
    });

    if (name == "paymentType") {
      if (value == "3") {
        this.setState({
          practitionerContactPersonId: [],
          discountType: "",
          discount: "",

        })
      }
    }

    // if (name == "discount") {

    //   // const result = value.replace(/[^0-9\.]/g, '');
    //   const result = value;
    //   let errors = this.state.errors;

    //   !value ? errors.discount = "This is required field" : errors.discount = "";

    //   this.setState({
    //     discount: result,

    //   })

    // }
    // if (name === "paymentType" && value !== "") {
    //   this.setState({
    //     paymentTypeModal: true
    //   })
    // }
    if (name === "discount") {
      const result = value.trim();
      let err = this.state.errors;

      if (result === "") {
        err.discount = "Discount is a required field";
      } else if (this.state.discountType === "Percentage") {
        (result < 0 || result > 100) ?
          err.discount = "Discount must be a number between 0 and 100"
          : err.discount = ""
      } else if (this.state.discountType === "Amount") {
        (result < 0 || result > 100000) ?
          err.discount = "Discount must be a number between 0 and 100000"
          : err.discount = ""
      } else {
        err.discount = "";
      }

      this.setState({
        discount: result,
        errors: err
      });
    }
    if (name == "discountType" && value == "") {
      let errors = this.state.errors;
      !!value ? errors.discount = "This is required field" : errors.discount = "";

      this.setState({
        discount: ""
      })

    }


    if (name == "diseaseCatId") {
      this.state.metastasis = "no";
      this.setState({
        // diseaseNameforReportUse:"",
        errors: {
          ...this.state.errors,
          labs: "",
        },
      });
      let index = this.state.diseaseCat.findIndex(
        (ele) => ele.diseaseCategoryId == value
      );
      // console.log(index);
      let catId = value;
      if (index >= 0) {
        if (this.state.diseaseCat[index]?.subCategory?.length > 0) {
          catId = this.state.diseaseCat[index].subCategory[0].diseaseCategoryId;
        }
      }
      this.getlabdetailsBydiseaseCatId(catId);

      let currentdiseasecat = this.state.diseaseCat.filter(
        (ds) => ds.diseaseCategoryId == value
      );

      // let currentdisease = this.state.Alldisease.filter(
      //   (ds) => ds.diseaseCatId == value
      // );
      let subCategory = currentdiseasecat[0]?.subCategory;
      let stateData = { diseasename: currentdiseasecat[0].diseaseCategoryName };
      if (subCategory[0]?.diseaseCategoryId) {
        stateData.subDiseaseCatId = subCategory[0].diseaseCategoryId;

        stateData.disease = this.state.Alldisease.filter(
          (ds) => ds.diseaseCatId == subCategory[0].diseaseCategoryId
        );
        // if (['8', '9', '10'].includes(String(stateData.subDiseaseCatId))) {
        //   //  diseaseId
        //   stateData.diseaseId = stateData?.disease[0]?.diseaseCategoryId || ''//subCategory[0].diseaseCategoryId
        //   // this.setState({ diseaseId: value })
        // }
      } else {
        stateData.subDiseaseCatId = "";
        // stateData.diseaseId = ''
        stateData.disease = this.state.Alldisease.filter(
          (ds) => ds.diseaseCatId == value
        );
      }
      if (currentdiseasecat.length > 0) {
        this.setState(stateData);
      }
    }
    if (name === "subDiseaseCatId") {
      // this.state({
      //   diseaseNameforReportUse:""
      // })
      // if (['8', '9', '10'].includes(String(value))) {
      //  diseaseId
      // this.setState({ diseaseId: value })
      // }
      this.getlabdetailsBydiseaseCatId(value);
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
    console.log(this.state);
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
        errors.firstName = !value?.trim()
          ? "Please enter firstname."
          : validAlphaNoRegex.test(value)
            ? ""
            : "Only alphanumeric allowed.";
        // if (value) {
        //   errors.firstName = value.replace(/<[^>]*>/g, '').trim() ? "" : "Please enter firstname."
        // } else {
        //   errors.firstName = "Please enter firstname."
        // }
        this.setState({ firstName: value.replace(/[^a-zA-Z0-9 \b]+$/, "") });
        break;
      case "diseaseDesc": {
        if (value) {
          errors.diseaseDesc = value.replace(/<[^>]*>/g, "")?.trim()
            ? ""
            : "Please enter disease description.";
        } else {
          errors.diseaseDesc = "Please enter disease description.";
        }

        break;
      }
      case "middleName":
        errors.middleName = value?.trim()
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
        this.setState({ lastName: value.replace(/[^a-zA-Z0-9' \b]+$/, "") });
        break;

      case "mobile":
        // errors.mobile = !value
        //   ? "Please enter primary phone."
        //   : validMobileRegex.test(value)
        //     ? ""
        //     : "Only numbers allowed.";
        this.setState({
          mobile: value
            ?.trim()
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
      // case 'weight':
      //   errors.weight = (!value) ? 'Please enter weight.' : '';
      //   break;
      // case 'height':
      //   errors.height = (!value) ? 'Please enter height.' : '';
      //   break;

      case "postalCode":
        // errors.postalCode = value
        //   ? validNumberRegex.test(value)
        //     ? ""
        //     : "Only numbers allowed."
        //   : "";
        this.setState({ postalCode: value.replace(/[^0-9]+$/, "") });
        break;

      // case 'newDisease':
      //   errors.newDisease = (!value?.trim()) ? 'Please enter new disease.' : '';
      //   break;

      // case 'newDiseaseCode':
      //   errors.newDiseaseCode = (!value) ? 'Please enter code for new disease.' : '';
      //   break;

      // case 'newTissue':
      //   errors.newTissue = (!value) ? 'Please enter new tissue.' : '';
      //   break;

      // case "diseaseId":

      //   errors.diseaseId =
      //     // this.state.diseasename == "Cancer - No Tumor" || this.state.diseasename == "Cancer With Tumor"

      //     Number(this.state.diseaseCatId) == 4 || Number(this.state.diseaseCatId) == 1
      //       ? !value ? "Please select disease."
      //         : ""
      //       : "";
      //   break;
      // case 'ocountryId':
      //   errors.ocountryId = this.state.diseasename == "Cancer Patients" ? ((!value) ? 'Please select country.' : '') : ''
      //   break;
      case "practitionerId":
        errors.practitionerId = !value ? "Please select practitioner." : "";

        break;
      // case "practitionerContactPersonId":
      //   errors.practitionerContactPersonId = !value ? "Please select any one option." : "";

      //   break;
      // case 'Tissue':
      //   errors.Tissue = !value ? 'Please select tissue.' : '';
      //   //this.setState({ Tissue: value });
      //   break;
      // case 'metastasis':
      //   errors.metastasis = !value ? 'Please select Metastasis.' : '';
      //   break;
      // case 'dateOfBirth':
      //   errors.dateOfBirth = (!value) ? 'This field is required.' : ''
      //   break;
      // case 'address':
      //   errors.address = (!value) ? 'This field is required.' : ''
      //   break;
      // case "postalCode":
      //   errors.postalCode = !value ? "Please enter valid postal code." : "";
      //   break;
      // case 'mobile':
      //   errors.mobile = (!value) ? 'This field is required.' : ''
      //   break;
      //case 'cityId':
      //  errors.cityId = (!value) ? 'This field is required.' : ''
      //  break;
      // case "countryId":
      //   errors.countryId = !value ? "Please select country." : "";
      //   break;
      // case "stateId":
      //   errors.stateId = !value ? "Please select state." : "";
      //   break;
      // case "cityId":
      //   errors.cityId = !value ? "Please select city." : "";
      //   break;
      case "diseaseForNonCancer":
        errors.diseaseForNonCancer = !value?.trim()
          ? "Please enter disease."
          : "";
        break;
      case "diseaseDesc":
        errors.diseaseDesc = !value?.trim()
          ? "Please enter disease description"
          : "";
      case "ccId":
        errors.ccId = !value ? "Please select Representative." : "";
        break;
      // case "paymentType":
      // errors.paymentType = !value ? "Please select payment type" : "";
      default:
        //(!value) ? '' :'This field is required.'
        break;
    }

    if (name == "practitionerId") {
      this.state.practitionerContactPersonId = []
      const apiroute = window.$APIPath;
      const url = apiroute + "/api/BE_Practitioner/GetById?id=" + value;

      axiosInstance
        .get(url, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            const data1 = [JSON.parse(JSON.stringify(result?.data?.outdata))]
            const data2 = result.data.outdata.practitionerContactPerson
            const FiltetredAllEmails = [];
            data1.map((data) => {
              FiltetredAllEmails.push(
                {
                  name: data.firstName + " " + data?.lastName,
                  value: data.email,
                  label: data.email
                })

            })

            data2.map((data) => {
              FiltetredAllEmails.push(
                {
                  name: data.name,
                  value: data.email,
                  label: data.email
                })

            })

            this.setState({
              loading: false,
              // practitionerContact: [JSON.parse(JSON.stringify(result?.data?.outdata))] || [],
              practitionerContactPerson: FiltetredAllEmails || [],
              practitionerContactPersonId: [FiltetredAllEmails[0]]
            });
          } else {
            this.setState({ loading: false });
            // console.log(result.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loading: false });
        });


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
          let currentdiseasename =
            this.state.disease.filter((obj) => obj.id == value)?.[0]?.name ||
            "";
          this.setState({ allTissues: [], Tissue: "", currentdiseasename });

          this.getTissueData(value, "");
        } else {
          this.setState({ allTissues: [], Tissue: "" });
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
  handleDiscountType = (e) => {
    const result = this.state.discount
    let err = this.state.errors;
    err.discount = ""
    // if (e.target.value === "Percentage") {
    //   (result < 0 || result > 100) ?
    //     err.discount = "Discount must be a number between 0 and 100"
    //     : err.discount = ""
    // } else if (e.target.value === "Amount") {
    //   (result < 0 || result > 100000) ?
    //     err.discount = "Discount must be a number between 0 and 100000"
    //     : err.discount = ""
    // } else {
    //   err.discount = "";
    // }
    this.setState({
      discountType: e.target.value,
      errors: err,
      discount: ""
    });

  }
  handleAutocompletechange = (event, newValue) => {
    console.log({ newValue }, "IN HANDLE CHASNGE IN AUTOCOMPLETE");
    console.log("e.target.value", event?.target);
    if (!isNaN(newValue?.id)) {
      newValue.id = String(newValue?.id);
    }
    if (newValue != null && newValue != "" && newValue) {
      this.setState({
        allTissues: [],
        Tissue: "",
        tissueName: "",
        currentdiseasename: newValue?.inputValue || newValue?.name || "",
        disesevalue: newValue || "",
        diseaseId: newValue?.id ? String(newValue?.id) : null,
        // diseaseNameforReportUse: newValue?.displayname || newValue?.inputValue
      });
      this.getTissueData(newValue?.id, "");
    } else {
      this.setState({ allTissues: [], Tissue: "", currentdiseasename: "", diseaseId: "", defaultSelectedDiseaseId: "" });
    }
  };
  AddnewHandleAutocompletechange = (value) => {
    console.log(value);
  };
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
      errors.labs = "Please Assign Laboratory";
    } else {
      // debugger
      errors.labs = "";
    }
    // debugger
    if (this.state.firstName == undefined || this.state.firstName == "") {
      errors.firstName = "Please enter firstname.";
    }
    if (["1", "5", "13"].includes(this.state.diseaseCatId.toString())) {
      if (this.state.diseaseDesc == undefined || this.state.diseaseDesc == "") {
        errors.diseaseDesc = "Please enter disease description.";
      }
    }

    if (this.state.lastName == undefined || this.state.lastName == "") {
      errors.lastName = "Please enter lastname.";
    }

    // if (this.state.paymentType == "") {
    //   errors.paymentType = "Please select payment type"
    // }

    // if (this.state.email == undefined || this.state.email == "") {
    //   errors.email = "Please enter email.";
    // }
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

      this.state.discountType == ""
    ) {
      errors.discount = "";

    } else {
      if (this.state.discount == "") {
        errors.discount = "This is required field";

      }

    }

    if (this.state.ccId == undefined || this.state.ccId == "") {
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
    if (["1", "4"].includes(String(this.state.diseaseCatId))) {
      // if (this.state.diseaseId == undefined || this.state.diseaseId == "") {
      //   // errors.diseaseId = "Please select disease.";
      // } else {
      //   errors.diseaseId = "";
      // }
      // if (this.state.metastasis == undefined || this.state.metastasis == "") {
      //   // errors.metastasis = "Please select Metastasis.";
      // } else {
      //   // errors.metastasis = "";
      // }
      // if (this.state.Tissue == undefined || this.state.Tissue == '') {
      //   // errors.Tissue = 'Please select tissue';
      // } else {
      //   // errors.Tissue = "";
      // }
    } else {
      // errors.Tissue = "";
      // errors.diseaseId = "";
      // errors.metastasis = "";
    }
    if (["5", "13"].includes(this.state.diseaseCatId)) {
      if (!this.state?.diseaseForNonCancer) {
        errors.diseaseForNonCancer = "Please enter disease";
      } else {
        errors.diseaseForNonCancer = "";
      }
    } else {
      errors.diseaseForNonCancer = "";
    }

    // if (this.state.middleName == undefined || this.state.middleName == '') {
    //   errors.middleName = 'This field is required.';
    // }
    // if (this.state.address == undefined || this.state.address == '') {
    //   errors.address = 'This field is required.';
    // }
    // if (this.state.dateOfBirth == undefined || this.state.dateOfBirth == "") {
    //   errors.dateOfBirth = "Please enter date of birth.";
    // }
    // if (this.state.postalCode == undefined || this.state.postalCode == "") {
    //   errors.postalCode = "Please enter valid postal code.";
    // }
    // if (this.state.mobile == undefined || this.state.mobile == "") {
    //   errors.mobile = "Please enter primary phone.";
    // }
    // if (this.state.cityId == undefined || this.state.cityId == "") {
    //   errors.cityId = "Please select city.";
    // }
    // if (this.state.countryId == undefined || this.state.countryId == "") {
    //   errors.countryId = "Please select country.";
    // }
    // if (this.state.stateId == undefined || this.state.stateId == "") {
    //   errors.stateId = "Please select state.";
    // }
    // if (this.state.diseaseId == '0') {
    //   if (this.state.newDisease == "" || this.state.newDisease == undefined) {
    //     errors.newDisease = "Please enter new disease.";
    //   }
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

  handleShowPreview(e) {
    e.preventDefault();
    this.setState({ loading: true });
    if (this.validateForm(this.state.errors)) {
      if (this.state?.newAccesion) {
        this.setState({
          loading: false,
          previewDetailsModal: !this.state.redesignCheck,
          redesignCheckSubmit: this.state.redesignCheck,
        });
      } else {
        // this.checkEmailData();
        this.setState({
          loading: false,
          previewDetailsModal: true,
          // redesignCheckSubmit: this.state.redesignCheck,
        });
      }
    } else {
      this.setState({ loading: false });
    }
  }
  //form submit
  handleSubmit = (e) => {
    // debugger;

    // e.preventDefault();

    this.setState({ loading: true });

    const param = this.props.match.params;

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    //console.log('Submit');
    //console.log(this.state);
    let tissueId = this.state.Tissue;
    if (tissueId) {
      tissueId = parseInt(this.state.Tissue);
    } else {
      tissueId = null;
    }
    let url = "";
    let data = {};
    let x = new Date(this.state.dateOfBirth);
    let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
    let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
    x.setHours(hoursDiff);
    x.setMinutes(minutesDiff);
    // debugger
    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;

      if (param.id && param.aid) {
        url = apiroute + "/api/BE_Patient/SaveAccessionNo";
        let redesignLabSamples = [];
        if (this.state.redesignCheck) {
          redesignLabSamples = this.state.labSamples.filter((lab, i) => {
            let filteredSamples = lab.sampleTypeId
              .filter((sample) => sample.checked)
              .map((sample) => sample.id);
            lab.sampleTypeId = filteredSamples;
            if (filteredSamples.length) {
              return true;
            } else {
              console.log("daattaaaaaa");
              return false;
            }
          });

          // console.log(samples)
          // alert(1)
          // return
        }
        data = JSON.stringify({
          patientAccessionId: 0,
          PatientId: parseInt(this.state.patientId),

          // diseaseId:
          //   this.state.diseaseId != "" ? parseInt(this.state.diseaseId) : null,
          diseaseId:
            this.state.defaultSelectedDiseaseId != ""
              ? (this.state.diseaseId == ""
                ? parseInt(this.state.defaultSelectedDiseaseId)
                : parseInt(this.state.diseaseId))
              : (this.state.diseaseId == ""
                ? null
                : parseInt(this.state.diseaseId)),

          diseaseCategoryId:
            this.state.diseaseCatId != ""
              ? Number(this.state.subDiseaseCatId)
                ? Number(this.state.subDiseaseCatId)
                : Number(this.state.diseaseCatId)
              : null,
          tissueId: tissueId || 0,
          practionerId:
            this.state.practitionerId != ""
              ? parseInt(this.state.practitionerId)
              : null,
          ccId: this?.state?.ccId ? parseInt(this?.state?.ccId) : "",
          accessionNo: this.props.location.state?.accessionNo,
          isActive: true,
          createdDate: new Date(),
          createdBy: userToken.userId,
          paFlag: "A",
          isMetastasis: this.state.metastasis == "yes" ? true : false,
          laboratoryId: this.state.labs,
          secondaryCancer: this.state.secondaryCancer?.trim(),
          DiseaseNameNoCancer:
            this.state?.diseaseForNonCancer?.trim() != ""
              ? this.state?.diseaseForNonCancer?.trim()
              : "",
          diseaseDesc: this.state.diseaseDesc?.trim(),
          isRedesign: this.state.redesignCheck,
          redesignLabSamples: redesignLabSamples,
          diseaseCategory: this.state.diseaseCat
            ?.filter((ele) => {
              return ele.diseaseCategoryId == this.state.diseaseCatId;
            })
            .map((ele) => {
              return ele.diseaseCategoryName;
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
          diseaseName: this.state.currentdiseasename?.trim(),
          isOtherDisease: this.state.isOtherDisease,
          discountType: this.state.discountType,
          discountAmount: String(this.state.discount),
          // practitionerContactId: this.state.practitionerContactPersonId == "" ? 0 : Number(this.state.practitionerContactPersonId)
          practitionerContactId: 0,
          reciverEmails: this.state.practitionerContactPersonId.map(e => e.value),
          hasPaymentType: this.state.paymentType == "3" ? false : true,
          isFullPayment: this.state.paymentType == "2" ? true : false,
          // paymentType: this.state.paymentType
        });
      } else {
        // if (this.state.patientId == 0 || this.state.patientId == undefined) {
        url = apiroute + "/api/BE_Patient/Save";

        data = JSON.stringify({
          laboratoryId: this.state.labs,
          PatientId: parseInt(this.state.patientId),
          UserId: parseInt(this.state.userId),
          isLinkedAccession: !!this.state?.selecetedAid,
          linkedAccessionId: this.state?.selecetedAid || null,
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
          TissueId: tissueId,
          Age:
            this.state.age == "" ||
              this.state.age == null ||
              this.state.age == 0
              ? null
              : this.state.age.toString(),
          Sex: this.state.sex,
          Address: this.state.address?.trim(),
          // Weight: this.state.weight,
          // Height: this.state.height,
          addressLine1: this.state.addressLine1?.trim(),
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
          diseaseId:
            this.state.diseaseId != "" ? parseInt(this.state.diseaseId) : null,
          practionerId:
            this.state.practitionerId != ""
              ? parseInt(this.state.practitionerId)
              : null,
          diseaseCategoryId:
            this.state.diseaseCatId != ""
              ? Number(this.state.subDiseaseCatId)
                ? Number(this.state.subDiseaseCatId)
                : Number(this.state.diseaseCatId)
              : null,
          diseaseName: this.state.currentdiseasename?.trim(),
          diseaseDesc: this.state.diseaseDesc?.trim(),
          secondaryCancer: this.state.secondaryCancer?.trim(),
          diseaseCategory: this.state.diseaseCat
            ?.filter((ele) => {
              return ele.diseaseCategoryId == this.state.diseaseCatId;
            })
            .map((ele) => {
              return ele.diseaseCategoryName;
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
          diseaseNameNoCancer:
            ["5", "13"].includes(this.state.diseaseCatId)
              ? this.state.diseaseForNonCancer?.trim()
              : "",
          isOtherDisease: this.state.isOtherDisease,
          discountType: this.state.discountType,
          discountAmount: String(this.state.discount),
          // practitionerContactId: this.state.practitionerContactPersonId == "" ? 0 : Number(this.state.practitionerContactPersonId)
          practitionerContactId: 0,
          reciverEmails: this.state.practitionerContactPersonId.map(e => e.value),
          hasPaymentType: this.state.paymentType == "3" ? false : true,
          isFullPayment: this.state.paymentType == "2" ? true : false,
          // paymentType: this.state.paymentType,

        });
      }
      // console.log("data", data);
      // this.setState({
      //   previewDetailsModal: true
      // })
      // console.log(`data`, data);

      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            this.setState({
              redirect: true,
              loading: false,
            });
            toast.success(
              this.state.patientId == 0 || this.state.patientId == undefined
                ? "Patient Registered successfully"
                : "Patient Accesion number generated successfully"
            );
            this.props.history.push("/patients/list");
          } else {
            this.setState({
              // modal: !this.state.modal,
              // modalTitle: 'Error',
              // modalBody: result.data.message,
              loading: false,
            });
            toast.error(result.data.message);
            // toast.error("Test");
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
  };

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
          //console.log(result.data);
          this.setState(
            { states: result.data.outdata, StateId: StateId },
            () => {
              if (StateId != "" && StateId != null) {
                this.getCityData(StateId, CityId);
                // alert(StateId)
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

    let url = "";
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
    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState(
            { allTissues: result.data.outdata, Tissue: TissueId },
            () => {
              this.filterDeaseNameDrp(TissueId);
            }
          );
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  checkEmailData() {
    const apiroute = window.$APIPath;

    let url = "";
    url = apiroute + "/api/BE_Patient/CheckEmailForPatient";

    let data = JSON.stringify({
      patientId: this.state.patientId,
      email: this.state?.email,
    });
    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState({
            loading: false,
            redesignCheckSubmit: this.state?.newAccesion,
            previewDetailsModal: true,
          });
        } else {
          this.setState({
            existingPopUp: true,
            existingUser: result.data.outdata,
            loading: false,
          });
          toast.error(result.data.massage);
          this.setState({
            loading: false,
          });
        }
      })
      .catch((error) => {
        toast.error(error.massage);
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
    let data = this.state.allpractitioners.filter(
      (obj) => obj.practitionerId == this.state.practitionerId
    );
    return `${data[0]?.firstName}  ${data[0]?.lastName}`;
    // this.setState({practitionerfirstName:data[0].firstName,practitionerlastName:data[0].lastName})
  }
  getSelectedCcRepDetail() {
    let data = this.state.costumerCare.filter(
      (obj) => obj.userId == this.state.ccId
    );
    // console.log(`data`, data);

    return `${data[0]?.fullName}`;
    // this.setState({practitionerfirstName:data[0].firstName,practitionerlastName:data[0].lastName})
  }

  getSelectedanalysistype() {
    let data = this.state.diseaseCat.filter(
      (obj) => obj.diseaseCategoryId == this.statediseaseCatId
    );
    // console.log(data);
    if (data?.subCategory?.length > 0) {
    } else {
      return `${data[0]?.productName}`;
    }
  }
  render() {
    if (localStorage.getItem("AUserToken") == null) {
      return <Redirect to="/login" />;
    }

    const {
      labSamples,
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
      redesignCheckSubmit,
      costumerCare,
      subDiseaseCatId,
      newAccesion,
      disesevalue,
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Steps
          enabled={this.state.stepsEnabled}
          steps={this.state.steps}
          initialStep={this.state.initialStep}
          onExit={this.onExit}
          onAfterChange={this.onAfterChange}
          ref={this.myRef}
          options={{
            hideNext: false,
            exitOnOverlayClick: false,
            skipLabel: "Skip",
            disableInteraction: true,
          }}
          // onChange={function (e) { console.log(this.currentStep) }}
          onChange={(e) => {
            this.setState({ currentStep: e });
            console.log({ id: e?.id, e });
          }}
        />
        <button
          className="help"
          id="help"
          type="btn"
          onClick={() => {
            this.toggleSteps();
          }}
        >
          <i className="fa fa-question" aria-hidden="true"></i>
        </button>

        <Row className="mb-3">
          <Col xs="11" lg="9" xl="10">
            <h5
              className="mt-2"
              id="pagetitle"
              style={{ width: "fit-content" }}
            >
              <i className="fa fa-align-justify"></i> Patient Detail
            </h5>
          </Col>
          <Col xs="1" lg="3" xl="2">
            <Link to="/patients/list" id="backtolist">
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
                      <FormGroup id="analysistype">
                        <b>Neo7 Analysis Type </b>

                        {(newAccesion && this.props.match.params.aid != "undefined") ? (
                          <>
                            {" "}
                            (
                            <label
                              style={{ position: "relative" }}
                              id="redisgn"
                            >
                              {" "}
                              <span
                                style={{
                                  marginRight: "18px",
                                  fontWeight: "bold",
                                }}
                              >
                                {" "}
                                Redesign{" "}
                              </span>{" "}
                              <Input
                                style={{
                                  position: "absolute",
                                  top: "-1px",
                                  right: "0",
                                }}
                                checked={this.state.redesignCheck}
                                type="checkbox"
                                name="redesigncheckbox"
                                onChange={this.handleInputChange.bind(this)}
                              />
                            </label>{" "}
                            ){" "}
                          </>
                        ) : (
                          ""
                        )}

                        {/* {console.log(diseaseCat)} */}
                        {diseaseCat
                          .sort((a, b) => a.order - b.order)
                          .map((data, i) => {
                            return (
                              <div
                                key={i}
                                className="custom-control custom-radio mb-2"
                              >
                                {data.diseaseCategoryId == diseaseCatId ? (
                                  <>
                                    <Input
                                      type="radio"
                                      checked
                                      className="custom-control-input"
                                      value={data.diseaseCategoryId}
                                      onChange={this.handleInputChange.bind(
                                        this
                                      )}
                                      id={data.diseaseCategoryName}
                                      name="diseaseCatId"
                                      tabIndex={i + 1}
                                    />
                                    <Label
                                      className="custom-control-label"
                                      style={{ fontWeight: "500" }}
                                      htmlFor={data.diseaseCategoryName}
                                    >
                                      {data.diseaseCategoryName}
                                    </Label>
                                    {data.subCategory.map((ele, key) => {
                                      // if (Array.isArray(ele) && ele.length) {
                                      return (
                                        <div
                                          className="custom-control custom-radio "
                                          key={key}
                                        >
                                          <div className="custom-control custom-radio my-1">
                                            {ele.diseaseCategoryId ==
                                              this.state.subDiseaseCatId ? (
                                              <Input
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
                                              {ele.diseaseCategoryName}
                                            </Label>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </>
                                ) : (
                                  <>
                                    <Label
                                      className="custom-control-label"
                                      style={{ fontWeight: "500" }}
                                      htmlFor={data.diseaseCategoryName}
                                    >
                                      {
                                        data.diseaseCategoryName
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
                                      onChange={this.handleInputChange.bind(
                                        this
                                      )}
                                      id={data.diseaseCategoryName}
                                      name="diseaseCatId"
                                      tabIndex={i + 1}
                                    />
                                  </>
                                )}
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
                          Practitioner <span className="requiredField">*</span>
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
                        {<span className="error">{errors.practitionerId}</span>}
                      </FormGroup>
                      <FormGroup>
                        <Label>
                          Payment Type{" "}
                        </Label>
                        <Input
                          type="select"
                          name="paymentType"
                          value={this.state.paymentType}
                          onChange={this.handleInputChange.bind(this)}
                        >
                          <option value="3" >Select Payment Type</option>
                          <option value="1">Analysis Payment</option>
                          <option value="2" >Full Payment</option>
                        </Input>
                        {/* <span className="error">
                          {this.state.errors.paymentType}
                        </span> */}
                      </FormGroup>
                      {
                        this.state.paymentType != "3"
                        && <FormGroup>
                          <Label>
                            Send PO & Invoice to<span className="requiredField"></span>
                          </Label>

                          <CreatableSelect
                            isMulti
                            options={this.state.practitionerContactPerson}
                            onChange={this.handleEmailChange}
                            value={this.state.practitionerContactPersonId}
                            isClearable={true}
                            isSearchable={true}
                            placeholder="Recipients"
                            formatCreateLabel={(inputValue) => `${inputValue}`}
                            isValidNewOption={this.isValidNewOption}
                            getOptionLabel={(opt) => (this.state.practitionerContactPersonId && this.state.practitionerContactPersonId.includes(opt) ? opt.name ? opt.name : opt.value : opt.name ? <>{opt.name} <br />{opt.value}</> : `${opt.value}`)}
                            menuPlacement="bottom"
                            maxMenuHeight={200}
                          />
                          {<span className="error">{errors.practitionerContactPersonId}</span>}
                        </FormGroup>}
                    </Col>
                    {/* <Col xs="3" className="mb-2">
                      
                    </Col> */}

                    <Col xs="4">
                      <FormGroup>
                        {/* <Label> */}
                        {/* Do You want link old accession no ? */}
                        {/* <span className="requiredField">*</span> */}
                        {/* </Label> */}
                        {/* <Autocomplete
                          // disablePortal

                          id="custom-autocomplete"
                          className="custom-autocomplete"
                          options={this.state.accessionData}
                          loading={this.state?.isAccLoading}
                          open={!this.state?.isAccLoading}
                          onInputChange={async (event, newValue) => {
                            // this.setState({ isAccLoading: true })
                            await this.handleLinkOldAccessionId(newValue)
                            // this.setState({ isAccLoading: true })
                            console.log({ newValue })
                          }}

                          renderOption={(props, option) => (
                            <li {...props} key={option.patientId}>
                              {option.accessionNo}
                            </li>
                          )}
                          renderInput={(params) => <TextField {...params} />}
                        /> */}
                        {/* <Seach selected={this.state.selectedAccession} onChange={

                            (value, aid) => {


                              this.setState({ selectedAccession: value, selecetedAid: aid })
                            }
                          }></Seach> */}

                        {/* <Input
                          type="select"
                          className={
                            errors.ccId
                              ? "custom-select is-invalid"
                              : "custom-select is-valid"
                          }
                          name="ccId"
                          // value={countryId}
                          onChange={this.handleInputChange.bind(this)}
                        >
                          <option value="">Select Representative</option>
                          {costumerCare.map((data, i) => {
                            return (
                              <option key={i} value={data.userId}>
                                {data.fullName}
                              </option>
                            );
                          })}
                        </Input> */}
                        <Label>
                          CC Representative{" "}
                          <span className="requiredField">*</span>
                        </Label>

                        <Input
                          type="select"
                          className={
                            errors.ccId
                              ? "custom-select is-invalid"
                              : "custom-select is-valid"
                          }
                          name="ccId"
                          value={this.state.ccId}
                          onChange={this.handleInputChange.bind(this)}
                        >
                          <option value="">Select Representative</option>
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
                      {
                        this.state.paymentType != "3" &&

                        <FormGroup>


                          <Label>
                            Discount

                          </Label>
                          <div className="d-flex">
                            <Input
                              type="select"
                              name="discountType"
                              value={this.state.discountType}
                              onChange={this.handleDiscountType.bind(this)}
                            >
                              <option value="">Select Discount Type</option>
                              <option value="Percentage">Percentage</option>
                              <option value="Amount">Amount</option>
                            </Input>
                            {
                              !this.state.discountType ?
                                null :
                                <Input
                                  type="number"
                                  placeholder="Enter Discount"
                                  value={this.state.discount}
                                  name="discount"
                                  onChange={this.handleInputChange.bind(this)}
                                  className="ml-1"
                                />
                              // <NumberFormat
                              //   placeholder={`Enter ${this.state.discountType}`}
                              //   value={this.state.discount}
                              //   name="discount"
                              //   isAllowed={values => {
                              //     const { formattedValue, floatValue } = values

                              //     if (floatValue == null) {
                              //       return formattedValue === ''
                              //     } else {

                              //       return this.state.discountType === "Percentage" ? (formattedValue <= 100 && formattedValue >= 0) : (formattedValue < 100000 && formattedValue >= 0)
                              //     }
                              //   }}
                              //   onChange={this.handleInputChange.bind(this)}
                              //   className={`ml-1 ${errors.DesignDiscount ? "is-invalid" : ""}`}
                              // ></NumberFormat>
                            }

                          </div>
                          {<span className="error">{errors.discount}</span>}


                        </FormGroup>}

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
                          onChange={(event) => {
                            let regex = /^([A-Za-z\s])+$/gi; //allow alphabetics only

                            if (
                              regex.test(event.target.value) ||
                              event.target.value === ""
                            )
                              this.handleInputChange.bind(this)(event);
                          }}
                          placeholder="Enter first name"
                          maxLength="15"
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
                          disabled={newAccesion}
                          onChange={(event) => {
                            let regex = /^([A-Za-z\s])+$/gi; //allow alphabetics only

                            if (
                              regex.test(event.target.value) ||
                              event.target.value === ""
                            )
                              this.handleInputChange.bind(this)(event);
                          }}
                          placeholder="Enter middle name"
                          maxLength="15"
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
                          disabled={newAccesion}
                          onChange={(event) => {
                            // let regex = /^([A-Za-z\s])+$/gi; //allow alphabetics only
                            let regex = /^([A-Za-z'\s])+$/gi; //allow alphabetics with ' only

                            if (
                              regex.test(event.target.value) ||
                              event.target.value === ""
                            ) {
                              this.handleInputChange.bind(this)(event);
                            }
                          }}
                          placeholder="Enter last name"
                          maxLength="15"
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
                          {/* <span className="requiredField">*</span> */}
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
                            className="is-valid"
                            // className={
                            //   errors.dateOfBirth ? "is-invalid" : "is-valid"
                            // }
                            style={{
                              backgroundColor: newAccesion
                                ? "#e4e7ea !important"
                                : "#fff",
                            }}
                            dropdownMode="select"
                            fixedHeight
                          />
                        </div>
                        {/* {<span className="error">{errors.dateOfBirth}</span>} */}
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
                          Email
                          <span className="requiredField"></span>
                        </Label>
                        <Input
                          type="text"
                          className="is-valid"
                          // className={errors.email ? "is-invalid" : "is-valid"}
                          name="email"
                          value={email == "No Email" ? "" : email}
                          disabled={newAccesion}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter email"
                          maxLength="50"
                          autoComplete="off"
                        />
                        {<span className="error">{errors.email}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Primary Phone
                          {/* <span className="requiredField">*</span> */}
                        </Label>
                        <Input
                          type="text"
                          className="is-valid"
                          // className={errors.mobile ? "is-invalid" : "is-valid"}
                          name="mobile"
                          value={mobile}
                          disabled={newAccesion}
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
                          disabled={newAccesion}
                          onChange={this.handleInputChange.bind(this)}
                          maxLength="19"
                          placeholder="Enter secondary phone"
                          autoComplete="off"
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
                          name="postalCode"
                          className="is-valid"
                          // className={
                          //   errors.postalCode ? "is-invalid" : "is-valid"
                          // }
                          disabled={newAccesion}
                          value={postalCode}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter residential postal code"
                          maxLength="20"
                          autoComplete="off"
                        />
                        {/* <Input type="text" className={errors.postalCode ? "is-invalid" : "is-valid"} name="postalCode" value={postalCode} onChange={this.handleInputChange.bind(this)} placeholder="Enter postal name" maxLength="100" /> */}
                        {/* {<span className="error">{errors.postalCode}</span>} */}
                      </FormGroup>
                    </Col>
                    <Col xs="4"> </Col>
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
                          disabled={newAccesion}
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
                          State {/* <span className="requiredField">*</span> */}
                        </Label>

                        <Input
                          type="select"
                          className="is-valid custom-select"
                          // className={
                          //   errors.stateId
                          //     ? "is-invalid custom-select"
                          //     : "is-valid custom-select"
                          // }
                          disabled={newAccesion}
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
                        {/* {<span className="error">{errors.stateId}</span>} */}
                      </FormGroup>
                    </Col>

                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          City
                          {/* <span className="requiredField">*</span> */}
                        </Label>
                        <Input
                          type="select"
                          className="is-valid custom-select"
                          // className={
                          //   errors.cityId
                          //     ? "is-invalid custom-select"
                          //     : "is-valid custom-select"
                          // }
                          name="cityId"
                          value={cityId}
                          disabled={newAccesion}
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
                        {/* {<span className="error">{errors.cityId}</span>} */}
                      </FormGroup>
                    </Col>

                    <Col xs="4" className="mb-4">
                      {["5", "13"].includes(this.state.diseaseCatId) ? (
                        <>
                          <Label>
                            Disease
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
                            autoComplete="off"
                          />
                          {
                            <span className="error">
                              {errors.diseaseForNonCancer}
                            </span>
                          }
                        </>
                      ) : (
                        ""
                      )}
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
                  {[1, 4].includes(Number(diseaseCatId)) ||
                    [1, 2, 3].includes(Number(subDiseaseCatId)) ? (
                    <React.Fragment>
                      <Row className="mb-3">
                        <Col xs="11" lg="11">
                          <h5 className="mt-2">
                            <i className="fa fa-align-justify"></i> Disease
                            Detail
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
                              {/* <span className="requiredField">*</span> */}
                            </Label>

                            <Autocomplete
                              disableCloseOnSelect

                              value={this.state.currentdiseasename}
                              className="custom-autocomplete"
                              // clearOnBlur
                              selectOnFocus
                              onChange={(event, newValue) => {
                                this.handleAutocompletechange(event, newValue);
                              }}
                              filterOptions={(options, params) => {
                                const { inputValue } = params;
                                let filtered = this.filterDisease(
                                  options,
                                  params.inputValue
                                );
                                // Suggest the creation of a new value
                                const isExisting = options.some(
                                  (option) => inputValue === option.name
                                );
                                if (inputValue !== "" && !isExisting) {
                                  filtered = [...filtered];
                                  filtered.push({
                                    inputValue,
                                    diseaseCatId: 0,
                                    id: 0,
                                    name: `Add new Disease: "${inputValue}"`,
                                  });
                                }

                                return filtered;
                              }}
                              renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                  {option.name}
                                </li>
                              )}
                              // id="free-solo-with-text-demo"
                              id="disable-close-on-select"
                              options={disease}
                              getOptionLabel={(option) => {
                                if (typeof option === "string") {
                                  return option || "";
                                }

                                if (option.inputValue) {
                                  return option.inputValue || "";
                                }

                                return option.name || "";
                              }}
                              isOptionEqualToValue={(op) => {
                                // console.log({ op })
                                return (
                                  op.name === this.state.currentdiseasename
                                );
                              }}
                              sx={{
                                width: 300,
                                border:
                                  this.state?.diseaseId == "0"
                                    ? "1px solid #4dbd74"
                                    : "none",
                                borderRadius: "10px",
                              }}
                              // freeSolo
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Disease"
                                  InputProps={{
                                    ...params.InputProps,
                                  }}
                                />
                              )}
                            />
                            {/* <CreatableSelect
                              isMulti={false}
                              isClearable
                              isSearchable
                              placeholder="Select or Add Disease"
                              formatCreateLabel={(inputValue) => `${inputValue}`}
                              options={disease.map((data) => { return { ...data, label: data.name, value: data.id } })}
                              onChange={this.handleDiseaseChange}
                            /> */}
                            {
                              <span
                                className="success"
                                style={{ color: "#4dbd74" }}
                              >
                                {this.state?.diseaseId == "0" &&
                                  `A new Disease "${this.state.currentdiseasename}" will be created !`}
                              </span>
                            }
                            {/* <Input
                              type="select"

                              className="custom-select is-valid"

                              // className={
                              //   errors.diseaseId
                              //     ? "custom-select is-invalid"
                              //     : "custom-select is-valid"
                              // }
                              name="diseaseId"
                              value={diseaseId}
                              style={{ fontWeight: diseaseId === 0 ? "bold" : "400" }}
                              onChange={this.handleInputChange.bind(this)}
                              autoComplete="off"
                            >
                              <option value={''}  >Select Disease</option>
                              {disease.map((data, i) => {
                                return (
                                  <option key={i} value={data.id}
                                    selected={data.id == this.state.diseaseId}
                                    style={{ fontWeight: data.id === 0 ? "bold" : "400" }}>
                                    {data.name}
                                  </option>
                                );
                              })}
                            </Input> */}
                            {/* {<span className="error">{errors.diseaseId}</span>} */}

                            {/*<Multiselect
                            options={this.state.disease} // Options to display in the dropdown
                            selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                          />*/}
                          </FormGroup>
                          {/* <FormGroup>
                            <CreatableSelect
                              isMulti={false}
                              isClearable
                              isSearchable
                              placeholder="Select or Add Disease"
                              formatCreateLabel={(inputValue) => `${inputValue}`}
                              options={disease.map((data) => { return { ...data, label: data.name, value: data.id } })}
                              onChange={this.handleDiseaseChange}
                            />
                          </FormGroup> */}
                        </Col>
                        {/* <Col xs="4">
                          <FormGroup>
                            <Label>Disease Name</Label> {"(For report use only)"}

                            <span className="mx-lg-4"
                              data-toggle="tooltip" data-placement="top" title="It will be displayed in patient's report."

                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                              </svg>
                            </span>
                            <Input type="text" autocomplete="off" name="diseaseNameforReportUse"
                              value={this.state.diseaseNameforReportUse} onChange={this.handleDiseaseNameForReportUse.bind(this)} placeholder="Enter disease name" tabIndex="2"

                              maxLength="100"

                            />

                          </FormGroup>
                        </Col> */}

                        <Col xs="4">
                          <FormGroup>
                            <Label>Tissue</Label>
                            {/* <span className="requiredField">*</span> */}
                            {/* <Input
                              type="select"
                              // className="custom-select"
                              className="custom-select is-valid"
                              // className={
                              //   errors.Tissue
                              //     ? "custom-select is-invalid"
                              //     : "custom-select is-valid"
                              // }
                              name="Tissue"
                              value={Tissue}
                              onChange={this.handleInputChange.bind(this)}
                            >
                              <option value="">Select Tissue</option>
                              {allTissues.sort((a, b) => b.name - a.name).map((data, i) => {
                                return (
                                  <option key={i} value={data.id}>
                                    {data.name}
                                  </option>
                                );
                              })}
                            </Input> */}
                            <Autocomplete
                              disableCloseOnSelect

                              value={this.state.tissueName}
                              className="custom-autocomplete"
                              label="Select Tissue"
                              handleHomeEndKeys={false}
                              onChange={(event, newValue) => {
                                console.log({ newValue }, "on change tissue");
                                this.handleInputChange({
                                  target: {
                                    value: newValue?.id,
                                    name: "Tissue",
                                  },
                                });
                                this.setState({
                                  tissueName: newValue?.name || "",
                                });
                                // console.log("SELECTED TISUE ", { newValue })
                                // this.setState({
                                //   Tissue: newValue?.name || newValue || "",
                                //   tissueId: newValue?.id || newValue || 0
                                // })
                                // console.log({ newValue })
                                // this.handleAutocompletechange(event, newValue)
                                // return;
                                // if (typeof newValue === 'string') {
                                //   console.log({ newValue }, "Stringgg")
                                //   this.setState({
                                //     disesevalue: newValue,
                                //   });
                                //   // console.log()
                                // } else if (newValue && newValue.inputValue) {
                                //   // Create a new value from the user input
                                //   console.log({ newValue }, "INPUTVALUE")
                                //   this.setState({
                                //     disesevalue: newValue.name,
                                //   });

                                // } else {
                                //   this.setState({
                                //     disesevalue: newValue,
                                //   });

                                //   // console.log("newwwww")
                                // }
                              }}
                              getOptionLabel={(option) => {
                                // Value selected with enter, right from the input
                                if (typeof option === "string") {
                                  return option;
                                }
                                // Add "xxx" option created dynamically
                                if (option.inputValue) {
                                  return option.inputValue;
                                }
                                // Regular option
                                return option.name;
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.name === value
                              }
                              filterOptions={(options, params) => {
                                let filtered = this.filterDisease(
                                  options,
                                  params.inputValue
                                );

                                return filtered;
                              }}
                              selectOnFocus
                              renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                  {option.name}
                                </li>
                              )}
                              id="autoCompTissue"
                              options={allTissues.sort(
                                (a, b) => b.name - a.name
                              )}
                              sx={{ width: 300 }}
                              // disableClearable
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Tissue"
                                />
                              )}
                            />
                          </FormGroup>

                          {/* <FormGroup>
                            <CreatableSelect
                              isMulti={false}
                              isClearable
                              isSearchable
                              value={this.state.SelectedTissue}
                              placeholder="Select Tissue"
                              formatCreateLabel={(inputValue) => `${inputValue}`}
                              options={allTissues.sort(
                                (a, b) => b.name - a.name
                              ).map((data) => { return { ...data, label: data.name, value: data.id } })}
                              onChange={this.handleTissueChange}
                            />
                          </FormGroup> */}


                        </Col>
                        <Col xs="4">
                          <FormGroup>
                            <Label>
                              Metastasis{" "}
                              {/* <span className="requiredField">*</span> */}
                            </Label>
                            <br />
                            <div className="custom-control custom-radio ">
                              {this.state.metastasis == "yes" ? (
                                <Input
                                  type="radio"
                                  className="custom-control-input"
                                  value="yes"
                                  checked
                                  onChange={this.handleInputChange.bind(this)}
                                  name="metastasis"
                                  id="Yes"
                                />
                              ) : (
                                <Input
                                  type="radio"
                                  className="custom-control-input"
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
                              {this.state.metastasis == "no" ? (
                                <Input
                                  type="radio"
                                  value="no"
                                  checked
                                  className="custom-control-input"
                                  onChange={this.handleInputChange.bind(this)}
                                  name="metastasis"
                                  id="No"
                                />
                              ) : (
                                <Input
                                  type="radio"
                                  value="no"
                                  className="custom-control-input"
                                  onChange={this.handleInputChange.bind(this)}
                                  name="metastasis"
                                  id="No"
                                />
                              )}
                              <Label
                                className="custom-control-label"
                                htmlFor="No"
                              >
                                No
                              </Label>
                            </div>
                            {/* {<span className="error">{errors.metastasis}</span>} */}
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
                    </React.Fragment>
                  ) : null}

                  <Row>
                    {[1, 4].includes(Number(diseaseCatId)) ||
                      [1, 2, 3].includes(Number(subDiseaseCatId)) ? (
                      <>
                        {" "}
                        <Col xs="4">
                          <FormGroup>
                            <Label>
                              Secondary Disease{" "}
                              {/* <span className="requiredField">*</span> */}
                            </Label>
                            <Input
                              type="text"
                              name="secondaryCancer"
                              className="is-valid"
                              // className={
                              //   errors.postalCode ? "is-invalid" : "is-valid"
                              // }
                              // disabled={newAccesion}
                              value={this.state.secondaryCancer}
                              onChange={this.handleInputChange.bind(this)}
                              placeholder="Secondary Disease"
                              maxLength="20"
                              autoComplete="off"
                            />
                            {/* <Input type="text" className={errors.postalCode ? "is-invalid" : "is-valid"} name="postalCode" value={postalCode} onChange={this.handleInputChange.bind(this)} placeholder="Enter postal name" maxLength="100" /> */}
                            {/* {<span className="error">{errors.postalCode}</span>} */}
                          </FormGroup>
                        </Col>{" "}
                      </>
                    ) : (
                      ""
                    )}
                  </Row>

                  {[1, 4, 5, 13].includes(Number(diseaseCatId)) ||
                    [1, 2, 3, 5].includes(Number(subDiseaseCatId)) ? (
                    <Row>
                      <Col xs="12">
                        <Label>
                          Disease Description
                          <span className="requiredField">*</span>
                        </Label>
                        <Grammarly clientId="client_Mygif7MAqrmjKVPfFwatyC">
                          <GrammarlyEditorPlugin>
                            <CKEditor
                              editor={ClassicEditor}
                              name="diseaseDesc"
                              // cols="89"
                              style={{ width: "auto" }}
                              // rows="7"
                              onChange={(e, editor) => {
                                const data = editor.getData();
                                errors.diseaseDesc = data
                                  .replace(/<[^>]*>/g, "")
                                  ?.trim()
                                  ? ""
                                  : "Please enter disease description.";
                                this.setState({ diseaseDesc: data, errors });
                              }}
                              config={{
                                placeholder: "Enter Disease Description....",
                              }}
                              // maxLength="500"

                              data={this.state.diseaseDesc}
                            ></CKEditor>
                          </GrammarlyEditorPlugin>
                        </Grammarly>

                        {/* 
                    <Input
                    className={
                      errors.diseaseDesc
                      ? "is-invalid " :
                      "is-valid "
                    }
                    type="textarea"
                    name="diseaseDesc"
                    value={this.state.diseaseDesc}
                    onChange={this.handleInputChange.bind(this)}
                    maxLength="500"
                    placeholder="Enter Disease"
                    autoComplete="off"
                  /> */}
                        {<span className="error">{errors.diseaseDesc}</span>}
                      </Col>
                    </Row>
                  ) : null}
                  <React.Fragment>
                    <Row className="my-3">
                      <Col xs="11" lg="11">
                        <h5 className="mt-2">
                          <i className="fa fa-align-justify"></i> Assign
                          Laboratory
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
                                        disabled
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
                                          )
                                            ? "#1C3A84"
                                            : "#000",
                                          fontWeight: "600",
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
                          id="submitform"
                          type="submit"
                          disabled={loading}
                          color="primary"
                        >
                          <i className="fa fa-dot-circle-o"></i> Submit
                        </Button>{" "}
                        <Button
                          id="resetform"
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

        <Modal
          isOpen={this.state.existingPopUp}
          className="modal-dialog modal-lg"
        >
          <ModalHeader>Email already exist</ModalHeader>
          <ModalBody className="modal-body">
            <span readonly>
              This email is already registered for a patient :{" "}
              <b>
                {" "}
                {this.state.existingUser?.firstName}{" "}
                {this.state.existingUser?.middleName}
              </b>
              <br />
              Please search following Patient Accession Number(s) in the patient
              List :
              {this.state.existingUser?.accessionNo?.length > 0
                ? this.state.existingUser?.accessionNo?.map((data) => {
                  return (
                    <>
                      <b> {data}</b>
                    </>
                  );
                })
                : ""}
            </span>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.setState({
                  existingPopUp: false,
                });
              }}
            >
              Ok
            </Button>
          </ModalFooter>
        </Modal>

        {/* customModal  */}
        <Modal isOpen={this.state.redesignCheckSubmit}>
          <ModalHeader>Redesign samples</ModalHeader>
          <ModalBody>
            {Array.isArray(labSamples) &&
              labSamples.length &&
              labSamples.map((e, labIndex) => {
                return (
                  <div key={labIndex}>
                    <b>{e.name}</b>
                    <hr />
                    <div className="mx-1">
                      {Array.isArray(e.sampleTypeId) &&
                        e.sampleTypeId?.length &&
                        e?.sampleTypeId?.map?.((sample, sampleIndex) => {
                          return (
                            <div key={sampleIndex}>
                              {" "}
                              <label>
                                <input
                                  type="checkbox"
                                  className="mr-1"
                                  checked={sample.checked}
                                  onChange={(e) => {
                                    this.handleSampleChekbox(
                                      labIndex,
                                      sampleIndex,
                                      e.target.checked
                                    );
                                  }}
                                />
                                {sample.name}
                              </label>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => {
                this.setState({
                  redesignCheckSubmit: false,
                });
              }}
            >
              Close
            </Button>
            <Button
              color="primary"
              disabled={this.state.sampleSelect}
              onClick={() => {
                this.setState({ previewDetailsModal: true });
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.previewDetailsModal}
          className="modal-dialog modal-xl preview_data_modal"
        >
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
                        {!!this.state.middleName?.trim()
                          ? this.state.middleName
                          : "N/A"}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Last Name:</Label>
                      <span className="form-control p-0">
                        {this.state.lastName != null ? this.state.lastName : ""}
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
                          "N/A"
                        )}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Age:</Label>
                      <span className="form-control p-0">
                        {this.state.age != null && this.state.age != ""
                          ? this.state.age + ` Year(s)`
                          : "N/A"}
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
                      {
                        this.state.email != "No Email" ?
                          (this.state.email != "" ?
                            <a
                              className="form-control p-0"
                              href={`mailto: ${this.state.email}`}
                            >
                              {this.state.email}
                            </a> : <span className="form-control p-0">{"N/A"}</span>) :
                          <span className="form-control p-0">{"N/A"}</span>
                      }
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Primary Phone:</Label>
                      <span className="form-control shadow-none p-0">
                        {!!this.state.mobile?.trim()
                          ? this.state.mobile
                          : "N/A"}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Secondary Phone:</Label>
                      <span className="form-control shadow-none p-0">
                        {!!this.state.phoneNumber?.trim()
                          ? this.state.phoneNumber
                          : "N/A"}
                      </span>
                    </FormGroup>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label>Neo7 Analysis Type:</Label>
                      <span className="form-control p-0">
                        {this.state.diseaseCat
                          .filter((ele) => {
                            return (
                              ele.diseaseCategoryId == this.state.diseaseCatId
                            );
                          })
                          .map((ele) => {
                            // if (isParent) {
                            if (
                              Array.isArray(ele.subCategory) &&
                              ele.subCategory.length
                            ) {
                              let child = ele.subCategory.filter(
                                (e) =>
                                  e?.diseaseCategoryId ==
                                  this.state.subDiseaseCatId
                              );
                              return `${ele?.diseaseCategoryName} - ${child[0]?.diseaseCategoryName}`;
                            } else {
                              return `${ele?.diseaseCategoryName}`;
                            }
                            // } else {
                            //   return parent
                            // }
                          })}{" "}
                        {this.state.metastasis == "yes" ? (
                          <>
                            -<b style={{ color: "red" }}> Metastasis</b>
                          </>
                        ) : (
                          ""
                        )}
                      </span>
                    </FormGroup>
                  </Col>
                </Row>
                <hr />
                {["5", "13"].includes(this.state.diseaseCatId) ? (
                  <>
                    <Row>
                      <Col md="12">
                        <Label>Disease:</Label>
                        <span className="form-control shadow-none p-0">
                          {this.state.diseaseForNonCancer != null
                            ? this.state.diseaseForNonCancer
                            : ""}
                        </span>
                      </Col>
                    </Row>
                    <hr />
                  </>
                ) : (
                  ""
                )}
                {/* {['with ctdna & cfdna testing', 'no ctdna & cfdna testing', 'cancer - no tumor', 'cancer with tumor'].includes(diseasename.toLowerCase()) ? */}
                {[4].includes(Number(diseaseCatId)) ||
                  [2, 3].includes(Number(subDiseaseCatId)) ? (
                  <>
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <Label>Disease:</Label>
                          <span className="form-control p-0">
                            {this.state.currentdiseasename != (null || "")
                              ? this.state.currentdiseasename
                              : "N/A"}
                          </span>
                        </FormGroup>
                      </Col>
                      {/* <Col md="4">
                        <FormGroup>
                          <Label>Disease (For report use only):</Label>
                          <span className="form-control p-0">
                            {this.state.diseaseNameforReportUse != (null || "")
                              ? this.state.diseaseNameforReportUse
                              : "N/A"}
                          </span>
                        </FormGroup>
                      </Col> */}
                      <Col md="4">
                        <FormGroup>
                          <Label>Tissue:</Label>
                          <span className="form-control p-0">
                            {this.state.allTissues.filter(
                              (obj) => obj.id == this.state.Tissue
                            )?.[0]?.name || "N/A"}
                          </span>
                        </FormGroup>
                      </Col>
                      {/* {this.state.diseaseId !== null && Number(this.state.diseaseId || 1) === 0
                        ?
                        <Col md='4'>
                          <Label>New Disease:</Label>
                          <span className="form-control shadow-none p-0">
                            {this.state.newDisease != null
                              ? this.state.newDisease
                              : ""}
                          </span>
                        </Col> : ""} */}

                      <Col md="4">
                        <Label>Secondary Disease Name:</Label>
                        <span className="form-control shadow-none p-0">
                          {this.state.secondaryCancer != (null || "")
                            ? this.state.secondaryCancer
                            : "N/A"}
                        </span>
                      </Col>

                      {[1, 4, 5].includes(Number(diseaseCatId)) ||
                        [1, 2, 3, 5].includes(Number(subDiseaseCatId)) ? (
                        <>
                          <Col md="8">
                            <FormGroup>
                              <Label>Disease Description:</Label>
                              <span className="form-control shadow-none p-0">
                                {this.state.diseaseDesc != (null || "")
                                  ? HtmlParser(this.state.diseaseDesc)
                                  : "N/A"}
                              </span>
                            </FormGroup>
                          </Col>

                          <hr />
                        </>
                      ) : null}
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
                ) : null}

                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Laboratory :</Label>
                      {/* <span className="form-control"> */}
                      {this.state.laboratoryData
                        .filter((obj) =>
                          this.state.labs?.includes(obj.ngsLaboratoryId)
                        )
                        .map((obj, key) => (
                          <div key={key}>

                            {obj?.ngsLabName}

                          </div>
                        ))}
                      {
                        // console.log(this.state.labs)
                        /* {this.state.labs.length > 0 ? this.state.labs.map((ele) => { this.state.laboratoryData.ngsLaboratoryId==ele?this.state.laboratoryData. }) : ""} */
                      }
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
                <hr />

                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Payment Type:</Label>
                      <span className="form-control p-0">
                        {this.state.paymentType == "3" ? "N/A" : (this.state.paymentType == "2" ? "Full Payment" : "Analysis Payment")}
                      </span>
                    </FormGroup>
                  </Col>
                  {
                    this.state.paymentType !== "3" &&
                    <Fragment>



                      <Col md="4">
                        <FormGroup>
                          <Label> Discount Type:</Label>
                          <span className="form-control p-0">
                            {!this.state.discountType ? "N/A" : this.state.discountType}
                          </span>
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label> Discount:</Label>
                          <span className="form-control p-0">
                            {!this.state.discount ? "N/A" : String(this.state.discount)}
                          </span>
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label> Send PO & Invoice to:</Label>
                          <span className=" p-0">

                            {
                              this.state.practitionerContactPersonId?.length == 0 ? <p>{"N/A"}</p> :
                                (
                                  this.state.practitionerContactPersonId?.map((m) => {
                                    return <Fragment>
                                      <div>
                                        {`${m.value}`}
                                      </div>
                                    </Fragment>
                                  })
                                )
                            }
                          </span>
                        </FormGroup>
                      </Col>
                    </Fragment>
                  }
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
                        style={{ height: "100px" }}
                      >
                        {!this.state.addressLine1
                          ? ""
                          : this.state.addressLine1.match(/^\s+$/) === null
                            ? this.state.addressLine1 + ", "
                            : ""}
                        <span className="">
                          {this.state.cityId == 0
                            ? ""
                            : `${this.state.cities.filter(
                              (obj) => obj.id == this.state.cityId
                            )?.[0]?.name
                            }, `}
                        </span>
                        <span className="">
                          {this.state.stateId == 0
                            ? ""
                            : `${this.state.states.filter(
                              (obje) => obje.id == this.state.stateId
                            )?.[0]?.name || ""
                            }, `}
                        </span>
                        <span className="">
                          {!this.state.postalCode
                            ? ``
                            : `${this.state.postalCode}, `}
                        </span>
                        <span className="">
                          {
                            this.state.countries.filter(
                              (obje) => obje.id == this.state?.countryId
                            )?.[0]?.name
                          }
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
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => {
                this.setState({
                  previewDetailsModal: false,
                });
              }}
            >
              Close
            </Button>
            <Button
              color="primary"
              onClick={() => {
                if (diseaseId !== null && Number(diseaseId || 1) === 0) {
                  this.handleSubmitDisease();
                } else {
                  this.handleSubmit();
                }
              }}
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

        {/* <Modal
          isOpen={this.state.paymentTypeModal}
          className="modal-dialog modal-md"
        >
          <ModalHeader>Confirm Payment Type</ModalHeader>

          <ModalBody className="">

            You have selected {this.state.paymentType == "PP" ? <b >Partial Payment</b> : <b>Full Payment</b>}, you <span className="text-danger" >can not change</span> it later ?

          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => {
                // let errors = this.state.errors;
                this.setState({
                  paymentTypeModal: false,
                  paymentType: ""
                })
                // errors.paymentType = "Please select payment type"
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => this.setState({

                paymentTypeModal: false
              })}
            >
              Yes
            </Button>

          </ModalFooter>

        </Modal> */}
      </div>
    );
  }
}

export default Details;
