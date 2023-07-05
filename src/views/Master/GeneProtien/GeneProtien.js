import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table,
  Button, Input, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter, Label
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import Confirm from "../../CustomModal/Confirm";
import DatePicker from "react-datepicker";
import Moment from "moment";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build'
import ReactHtmlParser from 'react-html-parser';
import ShowMoreText from "react-show-more-text";
import { Steps } from "intro.js-react";
import axiosInstance from "./../../../common/axiosInstance"
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { GrammarlyEditorPlugin, Grammarly } from '@grammarly/editor-sdk-react'
import CreatableSelect from 'react-select/creatable';
import { BE_Common_GetPatientDropdown, BE_Common_GetPatientDropdownEntity, BE_GeneProtienData_DeleteGeneProtien, BE_GeneProtienData_GetAllPaging, BE_GeneProtienData_GetGeneProtienById, BE_GeneProtienData_SaveGeneProtien, BE_GeneProtienData_UpdateGeneProtien, BE_Neoantigen_ImportData, BE_OrganizationUser_UpdateTooltipSteps, BE_PatientAccessionMapping_GetAllPaging, BE_Patient_GetAll } from '../../../common/allApiEndPoints';



class GeneProtien extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.initialState = {
      loading: true,
      isEdit: false,
      isView: false,
      openSearch: true,
      neoantigens: [],
      searchString: '',
      slDelete: true,
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      pageSize: window.$TotalRecord,
      authError: false,
      error: '',
      modal: false,
      modalTitle: '',
      modalBody: '',
      showneoantigen: false,
      protein: '',
      neoantigenValue: '',
      cancerHallmark: '',
      researchLiteratureLink: '',
      comments: '',
      patientId: '',
      neoantigenId: 0,
      patients: [],
      title: "Add Neoantigen",
      activeCountTrue: '',
      activeCountFalse: '',
      tempCount: true,
      errors: {
        protein: '',
        neoantigenValue: '',
        cancerHallmark: '',
        researchLiteratureLink: '',
        comments: '',
        patientId: '',

        geneName: "",
        description: "",
        dob: "",
        countryId: "",
        diseaseName: "",
        countryname: "",




      },
      dieseasData: [],
      showimport: false,
      showimporterror: '',
      importFile: '',
      demoImportFile: '',

      geneProtienDataId: 0,
      geneName: "",
      description: "",
      age: "",
      gender: "M",
      dob: "",
      country: "",
      diseaseName: "",
      countryId: 233,
      countries: [],
      countryname: "",
      showMore: false,
      Showmore_id: null,
      Showmore_ids: [],
      Showless_ids: [],
      Showless_id: null,
      diseaseId: 0,
      AlldiseaseData: [],
      AllSelectedDisease: "",
      AllSelectedDiseaseName: "",


      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      steps: [{
        element: "#pagetitle",
        title: 'Gene/Protein Desc',
        intro: "Used to add or update Gene Names and Description.",
        tooltipClass: "cssClassName1",
      },

      {
        element: "#Add",
        title: 'Add New Gene/Protein Description',
        tooltipClass: "cssClassName1",
        intro: "You can add new gene description by clicking on this Add button."
      },
      {
        element: "#activeInactiveFilter",
        title: 'Active/Inactive filter for Report Builder list',
        intro: "You can filter gene/protein description list by selecting active or inactive option from the dropdown.",
        tooltipClass: "cssClassName1",
      },
      // {
      //   element: "#AnalysisTypeCategory",
      //   title: 'Filter Report Builder List by Analysis type',
      //   tooltipClass: "cssClassName1",
      //   intro: "You can filter report builder list by selecting analysis type category from the dropdown."
      // },
      // {
      //   element: "#AnalysisTypeSubCategory",
      //   title: 'Filter Sample Type List by sub category',
      //   tooltipClass: "cssClassName1",
      //   intro: "You can filter sample type list by selecting sub category from the dropdown."
      // },

      {
        element: "#searchbar ",
        title: 'Search in Gene/Protein Description List',
        tooltipClass: "cssClassName1",
        intro: "This Search Bar allows the User to search in the Gene/Protein Description list."
      },
      {
        element: "#showMore ",
        title: 'Show More Description',
        tooltipClass: "cssClassName1",
        intro: "By clicking on it , You can see full description."
      },

      {
        element: "#Edit",
        title: 'Edit Gene/Protein Description',
        tooltipClass: "cssClassName1",
        intro: "You can edit or update gene/protein description details by clicking on this Edit button."
      },
      {
        element: "#Delete",
        title: 'Delete or Recover Gene/Protein Description',
        tooltipClass: "cssClassName1",
        intro: "You can delete/recover gene/protein description by clicking on Delete/Recover button."
      },
      {
        element: "#help",
        tooltipClass: "cssClassName1",
        title: "Tour",
        intro: "Highlights key page features and functions."
      }
      ],
      hintsEnabled: false,
      hints: [
        {
          element: "#hello",
          hint: "Hello hint",
          hintPosition: "middle-right"
        }
      ],
      pageCountNew: 0,
      AllPatientAccessionMappingData: [],
      SelectedPAtientAccessionNumber: ""


    };
    this.state = this.initialState;
  }

  //Help tooltip
  onExit = (e) => {
    console.log(e)
    this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 7 }));
    // localStorage.setItem("isFirstLogin", false);
    // this.sendCurrentStep()

  };
  onAfterChange = newStepIndex => {
    if (newStepIndex === 0) {
      const element = document.querySelector('#Add')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 1) {
      const element = document.querySelector('#activeInactiveFilter')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 2) {
      const element = document.querySelector('#searchbar')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 3) {
      const element = document.querySelector('#showMore')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 4) {
      const element = document.querySelector('#Edit')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 5) {
      const element = document.querySelector('#Delete')

      if (!element) this.myRef.current.introJs.nextStep()
    }
  }
  sendCurrentStep = () => {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken?.userId == null ? 0 : userToken?.userId;
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Dashboard/GetAll";
    // const url = apiroute + "/api/BE_OrganizationUser/UpdateTooltipSteps";
    const url = apiroute + BE_OrganizationUser_UpdateTooltipSteps
    let data = JSON.stringify({
      userId: userId,
      step: this.state.currentStep,
      isComplete: !this.state.isSkipped,
      isSkip: this.state.isSkipped
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
  }
  toggleSteps = () => {
    this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));
  };

  closeSearch = (e) => {
    if (this.state.searchString === '') {
      this.setState({
        openSearch: false
      });
    }
    else {
      this.setState(() => ({
        openSearch: false,
        loading: true,
        currentPage: 0,
        currentIndex: 0,
        pagesCount: 0,
        //pageSize: 10,
        searchString: ''
      }), function () { this.getNeoantigenData(0); });
    }
  }

  //modal close button event
  handleModalClose = () => {
    this.setState({
      modal: false,
      modalTitle: '',
      modalBody: ''
    });
  }

  //load event
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    var rights = userToken.roleModule;
    if (rights?.length > 0) {
      let currentrights = rights.filter(role => role.moduleId.toString() == "33");
      //console.log(currentrights);
      // console.log("rights",currentrights)
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          // this.getListData(0);
          // this.getCountry()
          this.getNeoantigenData(0);
          this.getDiseaseData()
          this.getCountry()
          this.getAllPatientAccessionMapping()
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

    const apiroute = window.$FileUrl;
    this.setState({ demoImportFile: apiroute + 'Neo7PatientFiles/demo_import.xlsx' });
    // this.getNeoantigenData(0);
    // this.getPatientData();
  }

  getCountry() {
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Common/GetPatientDropdown";
    const url = apiroute + BE_Common_GetPatientDropdown
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

        if (result.data.flag) {





          this.setState(
            {
              countries: result.data.outdata.countryData,
              AlldiseaseData: result?.data?.outdata?.diseaseMasterData
            }, (() => {
              let data = this.state.AlldiseaseData.map((d) => ({ ...d, label: d.name }))
            })

          );


        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });

  }

  getAllPatientAccessionMapping() {
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_PatientAccessionMapping/GetAllPaging";
    const url = apiroute + BE_PatientAccessionMapping_GetAllPaging
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

        if (result.data.flag) {





          this.setState(
            {
              loading: false,
              AllPatientAccessionMappingData: result.data.outdata,
              // AlldiseaseData: result?.data?.outdata?.diseaseMasterData
            }, (() => {
              // let data = this.state.AlldiseaseData.map((d) => ({ ...d, label: d.name }))
            })

          );


        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });

  }

  handleAllDisease = (e) => {
    // console.log("Value", e)
    let errors = this.state.errors;
    if (e == "" || e == null) {
      errors.diseaseName = "Please enter disease name.";
    } else {
      errors.diseaseName = "";

    }
    // let AllSelectedDisease = String(e.map(d => d.value));
    let AllSelectedDisease = String(e?.value ?? "");

    // let AllSelectedDiseaseName = String(e.map(d => d.name));
    let AllSelectedDiseaseName = String(e?.name ?? "");
    this.setState({
      AllSelectedDisease,
      AllSelectedDiseaseName,

    }, () => {


    })
  }

  //get patient data
  getPatientData() {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Patient/GetAll';
    const url = apiroute + BE_Patient_GetAll

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: userId
    });

    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          //console.log(result.data.outdata);
          this.setState({ patients: result.data.outdata, loading: false })
        }
        else {
          // console.log(result.data.message);
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  //get data
  getNeoantigenData(pageNo) {
    this.setState({ loading: true })

    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_GeneProtienData/GetAllPaging';
    const url = apiroute + BE_GeneProtienData_GetAllPaging

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: userId,
      pageNo: pageNo,
      totalNo: window.$TotalRecord,
    });

    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          //console.log(result.data.outdata);
          var rdata = result.data.outdata;
          this.setState({
            pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
            pageCountNew: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            neoantigens: rdata, loading: false
          });
          this.temp();
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  //pagination
  handleClick(e, index, currIndex) {
    this.setState({ loading: true });
    e.preventDefault();
    var pgcount = this.state.pagesCount - 1;
    var pgCurr = (index >= pgcount ? pgcount : index);
    this.setState({
      currentPage: pgCurr,
      currentIndex: currIndex
    }, function () { this.getNeoantigenData(pgCurr); });
  }

  //search
  filter = (e) => {
    if (e.key == 'Enter') {
      const target = e.target;
      const value = target.value;

      this.setState(() => ({
        loading: true,
        currentPage: 0,
        currentIndex: 0,
        pagesCount: 0,
        //pageSize: 10,
        searchString: value.trim()
      }), function () { this.getNeoantigenData(0); });
    }
  }

  //active/inactive filter
  handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    this.setState({
      tempCount: JSON.parse(value)
    })

    this.setState(() => ({
      loading: true,
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      //pageSize: 10,
      slDelete: JSON.parse(value)
    }), function () { this.getNeoantigenData(0); });
  }

  //delete(active/inactive) button click
  deleteRow(e, id) {
    // e.preventDefault();
    //const currroles = this.state.roles;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_GeneProtienData/DeleteGeneProtien?id=' + id + '&userId=' + userId + '';
    const url = apiroute + BE_GeneProtienData_DeleteGeneProtien(id, userId)

    axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          // this.setState({
          //   modal: !this.state.modal,
          //   modalTitle: 'Success',
          //   modalBody: result.data.message
          // });
          toast.success(result.data.message)
          //this.setState({
          //  roles: currroles.filter(role => role.role_Id !== id)
          //});
          this.getNeoantigenData(0);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        //console.log(error);
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Error',
        //   modalBody: error.message
        // });
        toast.error(error.message)
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  //add neoantigen
  handleCloseNeoantigen = () => {
    this.setState({
      showneoantigen: false,
      // patientId: '',
      // protein: '',
      // neoantigenValue: '',
      // cancerHallmark: '',
      // researchLiteratureLink: '',
      // comments: '',
      geneName: "",
      diseaseName: "",
      gender: "M",
      dob: "",
      age: "",
      SelectedPAtientAccessionNumber: "",
      countryname: "",
      description: "",
      AllSelectedDiseaseName: "",
      AllSelectedDisease: "",
      countryId: 233,
      errors: {
        geneName: "",
        description: "",
        dob: "",
        countryId: "",
        diseaseName: "",
        countryname: "",
        // protein: '',
        // neoantigenValue: '',
        // cancerHallmark: '',
        // researchLiteratureLink: '',
        // comments: '',
        // patientId: ''
      },
    });
  }

  handleShowNeoantigen = (e, geneProtienDataId) => {
    //alert(Math.round(Amount,2))
    if (geneProtienDataId != 0) {
      this.setState({ loading: true, title: "Edit Gen/Protein Deatils" });

      const apiroute = window.$APIPath;
      // const url = apiroute + '/api/BE_GeneProtienData/GetGeneProtienById?id=' + geneProtienDataId + '';
      const url = apiroute + BE_GeneProtienData_GetGeneProtienById(geneProtienDataId)

      axiosInstance.get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(result => {
          if (result.data.flag) {
            var rData = result.data.outdata;
            this.setState({
              geneProtienDataId: rData.geneProtienDataId,
              geneName: rData.geneName,
              description: rData.description,
              age: rData.age,
              gender: rData.gender,
              dob: rData.dob != null
                ? new Date(
                  Moment(
                    rData.dob
                  ).format("MM/DD/YYYY")
                )
                : "",
              countryname: rData?.country,
              countryId: rData?.countryId,
              // diseaseName: rData.diseaseName,
              AllSelectedDisease: rData?.diseaseIds,
              AllSelectedDiseaseName: rData?.diseaseName,
              loading: false,
              showneoantigen: true
            });
            //console.log(this.state);
          } else {
            this.setState({ loading: false });
          }
        })
        .catch(error => {
          // console.log(error);
          this.setState({ loading: false });
        });

    } else {
      this.setState({
        showneoantigen: true,
        geneProtienDataId: geneProtienDataId,
        title: "Add Gene/Protein Details"
      });
    }
  }

  handleDateChange(date) {
    // console.log("sdfsd", date);
    let errors = this.state.errors;
    // errors.dob = !date ? "Please enter date of birth." : "";
    var newAge = date ? this.calculate_age(date) : 0;
    this.setState({ dob: date, age: newAge });
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


  handleNeoantigenInputChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;

    if (name == "geneName") {
      value = value.toUpperCase()
    }

    this.setState({
      [name]: value
    });

    let errors = this.state.errors;

    switch (name) {
      case 'geneName':
        errors.geneName = (!value) ? "Please enter gene." : '';
        break;
      case 'description':
        errors.description = (!value) ? "Please enter description." : '';
        break;
      // case 'dob':
      //   errors.dob = (!value) ? "Please select date." : '';
      //   break;

      // case 'countryname':
      //   errors.countryname = (!value) ? "Please enter country name " : '';
      //   break;
      // case 'diseaseName':
      //   errors.diseaseName = (!value) ? "Please enter disease name." : '';
      //   break;

      default:
        break;
    }

    this.setState({ errors, [name]: value }, () => {

    })
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.geneName == undefined || this.state.geneName == '') {
      errors.geneName = 'Please enter gene.';
    }
    if (this.state.description == undefined || this.state.description == '') {
      errors.description = 'Please enter description.';
    }
    // if (this.state.dob == undefined || this.state.dob == '') {
    //   errors.dob = 'Please enter date of birth.';
    // }
    // if (this.state.countryname == undefined || this.state.countryname == '') {
    //   errors.countryname = 'Please enter country name.';
    // }
    if (this.state.AllSelectedDisease == undefined || this.state.AllSelectedDisease == '') {
      errors.diseaseName = 'Please enter disease name.';
    }
    // if (this.state.patientId == undefined || this.state.patientId == '') {
    //   errors.patientId = "Please select patient's Name.";
    // }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

  AddPatientNeoantigen(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;
    const param = this.props.match.params;
    let url = "";

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    if (userToken != null) {
      uid = (userToken.userId == null ? 0 : userToken.userId);
    }

    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      if (this.state.geneProtienDataId == 0) {
        // url = apiroute + '/api/BE_GeneProtienData/SaveGeneProtien';
        url = apiroute + BE_GeneProtienData_SaveGeneProtien
      }
      else {
        // url = apiroute + '/api/BE_GeneProtienData/UpdateGeneProtien';
        url = apiroute + BE_GeneProtienData_UpdateGeneProtien

      }

      let data = JSON.stringify({
        geneProtienDataId: parseInt(this.state.geneProtienDataId),
        geneName: this.state.geneName,
        description: this.state.description,
        age: this.state.age.toString(),
        gender: this.state.gender,
        dob: this.state.dob == "" ? null : this.state.dob,
        country: this.state?.countries?.filter((d) => d?.id == this.state?.countryId)[0]?.name,
        countryId: parseInt(this.state?.countryId),
        diseaseName: this.state?.AllSelectedDiseaseName,
        diseaseIds: this.state?.AllSelectedDisease,
        CreatedBy: uid,
        accessionNo: this.state.SelectedPAtientAccessionNumber ?? ""
      })

      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            loading: false,
            showneoantigen: false,
            // patientId: '',
            // neoantigenId: 0,
            // protein: '',
            // neoantigenValue: '',
            // cancerHallmark: '',
            // researchLiteratureLink: '',
            // comments: '',
            geneProtienDataId: 0,
            geneName: "",
            description: "",
            age: "",
            gender: "M",
            dob: "",
            country: "",
            diseaseName: "",
            countryname: "",
            AllSelectedDiseaseName: "",
            AllSelectedDisease: "",
            countryId: 233,
            SelectedPAtientAccessionNumber: ""


          });
          this.getNeoantigenData(0)
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false,
          });
          toast.error(result.data.message)
        }
      })
        .catch(error => {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: error.message,
            loading: false,
          });
          toast.error(error.message)
        });
    }
    else {
      this.setState({ loading: false });
    }
  }
  //end add neoantigen


  //Start Import
  handleCloseImport = () => {
    this.setState({
      showimporterror: '',
      importFile: '',
      showimport: false
    });
  }

  handleShowImport = () => {
    this.setState({
      showimport: true,
    });
  }

  handleImportFileInputChange(event) {
    const target = event.target;
    const value = target.files[0];

    this.setState({
      importFile: value
    });

    if (!value) {
      this.setState({
        showimporterror: "Please select import file.",
      })
    } else {
      this.setState({
        showimporterror: "",
      })
    }
  }

  ImportData(e) {
    if (this.state.importFile != "") {
      const apiroute = window.$APIPath;
      // let url = apiroute + '/api/BE_Neoantigen/ImportData';
      let url = apiroute + BE_Neoantigen_ImportData;
      //alert(this.state.treatmentdocumentFile)
      let uid = 0;
      var userToken = JSON.parse(localStorage.getItem('AUserToken'));
      if (userToken != null) {
        uid = (userToken.userId == null ? 0 : userToken.userId);
      }
      let files = this.state.importFile;
      const data = new FormData();
      data.append(`UserId`, uid);
      data.append(`file`, files);
      axiosInstance.post(url, data, {
        // receive two    parameter endpoint url ,form data
      }).then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            loading: false,
            showimport: false,
            importFile: '',
          }, this.getNeoantigenData(0));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            loading: false,
            showimporterror: result.data.message
          });
        }
      }).catch(error => {
        this.setState({
          modal: !this.state.modal, modalTitle: 'Error', modalBody: error.message, loading: false,
        });
      });
    }
    else {
      this.setState({
        loading: false,
        showimporterror: "Please select import file."
      });
    }
  }
  //End Import


  temp() {
    let countT = this.state.neoantigens.filter((data, i) => {
      return data.isActive == true
    })
    let countF = this.state.neoantigens.filter((data, i) => {
      return data.isActive == false
    })
    this.setState({
      activeCountTrue: countT.length,
      activeCountFalse: countF.length,
    })
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin">
      </div>;
    }
  }
  handlePageClick = (e) => {
    console.log("datra", e.selected)
    let currentPage = e.selected;
    this.getNeoantigenData(currentPage)

  }
  handleDiseaseChange = (e) => {
    let value = e.target.value;
    this.setState({
      diseaseId: value
    })
  }
  getDiseaseData = () => {
    const apiroute = window.$APIPath;
    // const url = apiroute + "api/CognitoUserStore/getPatientDropdownEntity";
    // const url = apiroute + "/api/BE_Common/GetPatientDropdownEntity"
    const url = apiroute + BE_Common_GetPatientDropdownEntity
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

          let diseaseCatObj = result.data.outdata.diseaseCatData
          //   .filter(
          //   (category) =>
          //     category.diseaseCategoryName.toLowerCase() !== "cancer" ||
          //     category.diseaseCategoryName.toLowerCase() !==
          //     "complete health score"
          // );
          // console.log(result?.data?.outdata?.diseaseData, "ggggggggggggggggggggggggggg")
          this.setState({
            dieseasData: result?.data?.outdata?.diseaseData,
            //disease: currentdisease
          });

          // console.log(this.state);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.ldidmouog(error);
        this.setState({ loading: false });
      });
    // console.log(this.state.diseaseName);
  }

  render() {
    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const { loading, neoantigens, currentPage, currentIndex, pagesCount, pageSize, authError, error,
      patientId, neoantigenId, protein, neoantigenValue, cancerHallmark, researchLiteratureLink, errors,
      patients, comments, showneoantigen, title, showimport, showimporterror,
      importFile, demoImportFile, dieseasData } = this.state;
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
            hideNext: false, exitOnOverlayClick: false, skipLabel: "Skip",
            disableInteraction: true
          }}
          // onChange={function (e) { console.log(this.currentStep) }}
          onChange={(e) => {
            this.setState({ currentStep: e })
            console.log({ id: e?.id, e })
          }}
        // onComplete={(e) => {
        //   this.setState({
        //     isSkipped: false
        //   })
        //   console.log("Complete", { e })
        // }}

        />
        <button className="help" id="help" type="btn" onClick={() => { this.toggleSteps() }}>
          <i class="fa fa-question" aria-hidden="true"></i>
        </button>

        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2" id="pagetitle" style={{ width: "fit-content" }}><i className="fa fa-align-justify"></i> Gene/Protein Description</h5>
          </Col>
          <Col xs="1" lg="1" style={{ "paddingLeft": "5px" }}>
          </Col>
          <Col xs="1" lg="1" style={{ "paddingLeft": "5px" }}>
            {
              this.state.isEdit ? <>


                <Link to="#">
                  <button id="Add" className="btn btn-primary btn-block" disabled={loading} onClick={e => this.handleShowNeoantigen(e, 0)}>Add</button>
                </Link>


              </> : null
            }

          </Col>
          {/* <Col xs="1" lg="1" style={{ "paddingLeft": "5px" }}>
            {
              this.state.isEdit ? <>
                <Link to="#">
                  <button className="btn btn-success btn-block" onClick={() => this.handleShowImport()}>Import</button>
                </Link>
              </> : null
            }

          </Col> */}
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col xs="2">
                    <Input id="activeInactiveFilter" type="select" name="slDelete" onChange={this.handleChange}>
                      <option value="true">Active {this.state.tempCount == true ? `(${this.state.activeCountTrue})` : ''}</option>
                      <option value="false">Inactive {this.state.tempCount == false ? `(${this.state.activeCountFalse})` : ''}</option>
                    </Input>
                  </Col>
                  <Col xs="4">
                  </Col>
                  <Col xs="6">
                    {
                      this.state.openSearch ? (
                        <div className="searchBox">
                          <input id="searchbar" type="text" placeholder="Search..." onKeyPress={this.filter} />
                          <Link className="closeSearch" to="#" onClick={this.closeSearch}><i className="fa fa-close" /></Link>
                        </div>
                      ) : (
                        <div className="search" onClick={() => this.setState({ openSearch: true })}>
                          <i className="fa fa-search" />
                        </div>
                      )}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {authError ? <p>{error.message}</p> : null}
                <Table responsive bordered key="tblDiseases">
                  <thead>
                    <tr>
                      <th>Gene/Protein</th>
                      <th>Disease Name</th>
                      {/* <th>Country</th> */}
                      {/* <th>Gender</th> */}
                      {/* <th>Date of Birth</th> */}
                      {/* <th>Age</th> */}
                      <th>Description</th>
                      <th>Active</th>
                      <th className="thNone">Gene/Protein Data Id</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // !loading ? (
                      //roles.map(function (data,i) {
                      neoantigens.length > 0 ? (
                        neoantigens
                          //.slice(
                          //  currentPage * pageSize,
                          //  (currentPage + 1) * pageSize
                          //)
                          .map((data, i) => {

                            return <tr key={i}>
                              <td>{data.geneName}</td>
                              <td>{data.diseaseName}</td>
                              {/* <td>{data.country}</td> */}
                              {/* <td>{data.gender}</td> */}
                              {/* <td>{data.dob != null && data.dob != "" ?
                                Moment(data.dob).format(
                                  "MM/DD/YYYY"
                                ) : "NA"
                              }</td> */}
                              {/* <td>{data.age}</td> */}
                              <td>
                                {/* <ReactReadMoreReadLess
                                  charLimit={200}
                                  readMoreText={"Read more ▼"}
                                  readLessText={"Read less ▲"}
                                  readMoreStyle={{ color: "blue" }}
                                  readLessStyle={{ color: "blue" }}
                                >
                                  {data.description}
                                  
                                </ReactReadMoreReadLess> */}
                                {/* 
                                <ShowMoreText
                                  lines={3}
                                  more={<span className='text-primary font-weight-bold'><br/>Show more</span>}
                                  less={<span className='text-primary font-weight-bold'>Show less</span>}
                                  anchorClass="show-more-less-clickable"
                                  expanded={false}
                                  truncatedEndingComponent={"... "}
                                  keepNewLines={false}
                                >
                                  <div>
                                  {ReactHtmlParser(data.description)}


                                  </div>

                                </ShowMoreText> */}
                                {<p className={i}>
                                  {/* {this.state.Showmore_id == data.geneProtienDataId ? ReactHtmlParser(data.description) : ReactHtmlParser(data.description.substring(0, 250))} */}
                                  {this.state.Showmore_ids.includes(data.geneProtienDataId) ? ReactHtmlParser(data.description) : ReactHtmlParser(data.description.substring(0, 250))}



                                  {this.state.Showmore_ids.includes(data.geneProtienDataId) ?

                                    <span className='text-primary font-weight-bold' onClick={() => {
                                      // let data2 = []
                                      // data2.push(data.geneProtienDataId)
                                      let deleteId = []
                                      let deleteId2 = 0;
                                      deleteId = this.state.Showmore_ids.filter((d) => d != data.geneProtienDataId)
                                      deleteId2 = this.state.Showmore_ids.filter((d) => d == data.geneProtienDataId)
                                      this.setState({
                                        // showMore: !this.state.showMore,
                                        // Showless_id: data.geneProtienDataId,
                                        // Showless_ids: [...this.state.Showless_ids, ...data2],
                                        Showmore_ids: [...deleteId],
                                        Showmore_id: deleteId2,



                                      })
                                    }}>
                                      {" "}Show less
                                    </span>
                                    :
                                    (
                                      data.description.length > 250 ?
                                        <span id="showMore" className='text-primary font-weight-bold' onClick={() => {
                                          let data2 = []
                                          data2.push(data.geneProtienDataId)
                                          this.setState({
                                            // showMore: !this.state.showMore,
                                            Showmore_id: data.geneProtienDataId,
                                            Showmore_ids: [...this.state.Showmore_ids, ...data2]


                                          })
                                        }}>
                                          ...Show more
                                        </span>

                                        : ""
                                    )
                                  }




                                </p>
                                }





                              </td>
                              <td>
                                {data.isActive ? (<Badge color="success">Active</Badge>) : (<Badge color="danger">Inactive</Badge>)}
                              </td>
                              <td className="thNone">{data.geneProtienDataId}</td>

                              <td>
                                <div className='d-flex'>
                                  <Link to="#" id="Edit" className="btn btn-primary btn-sm btn-pill" onClick={e => this.handleShowNeoantigen(e, data.geneProtienDataId)}>Edit</Link>{" "}
                                  {
                                    this.state.isEdit ? <>
                                      <Confirm title="Confirm"
                                        description={`${data.isActive ? 'Are you sure you want to delete this Gene details?' : 'Are you sure you want to recover this Gene details?'}`}
                                      >
                                        {confirm => (
                                          <Link id="Delete" className="btn btn-danger btn-sm btn-pill ml-1" to="#" onClick={confirm(e => this.deleteRow(e, data.geneProtienDataId))}>{data.isActive ? "Delete" : "Recover"}</Link>
                                        )}
                                      </Confirm>
                                    </> : null
                                  }

                                </div>
                              </td>
                            </tr>;
                          })
                      ) : (
                        <tr>
                          <td colSpan="5" className="tdCenter">No Gene/Protein details.</td></tr>
                        // )) : (
                        // <tr>
                        //   <td colSpan="8" className="tdCenter">Loading...</td></tr>
                      )}
                  </tbody>
                </Table>

                {/* <Pagination aria-label="Page navigation example" className="customPagination">
                  <PaginationItem disabled={currentIndex - 4 <= 0}>
                    <PaginationLink onClick={e =>
                      this.handleClick(e,
                        Math.floor((currentPage - 5) / 5) * 5,
                        Math.floor((currentIndex - 5) / 5) * 5
                      )
                    } previous href="#">
                      Prev
                    </PaginationLink>
                  </PaginationItem>
                  {[...Array(pagesCount)].slice(currentIndex, currentIndex + 5).map((page, i) =>
                    <PaginationItem active={currentIndex + i === currentPage} key={currentIndex + i}>
                      <PaginationLink onClick={e => this.handleClick(e, currentIndex + i, currentIndex)} href="#">
                        {currentIndex + i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem disabled={currentIndex + 5 >= pagesCount}>
                    <PaginationLink onClick={e =>
                      this.handleClick(e,
                        Math.floor((currentPage + 5) / 5) * 5,
                        Math.floor((currentIndex + 5) / 5) * 5
                      )
                    } next href="#">
                      Next
                    </PaginationLink>
                  </PaginationItem>
                </Pagination> */}

                <ReactPaginate
                  nextLabel="Next >"
                  breakLabel="..."
                  previousLabel="< Prev"
                  pageCount={this.state.pageCountNew}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={this.handlePageClick}
                  containerClassName={"pagination justify-content-end "}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  pageClassName={"page-item "}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal isOpen={showneoantigen} className="modal-dialog modal-md left-modal">
          <ModalHeader>
            {title}
          </ModalHeader>
          <ModalBody style={{ backgroundColor: 'white' }}>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Gene/Protein<span className="requiredField">*</span></label>
              <Input type="text" autoComplete="off" name="geneName" tabIndex="2" maxLength="45" className="form-control" value={this.state.geneName} onChange={this.handleNeoantigenInputChange.bind(this)} placeholder="Enter gene/protein" />
              {<span className="error">{errors.geneName}</span>}

            </div>

            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Disease Name <span className="requiredField">*</span></label>
              {/* <Input type="text" autoComplete="off" name="diseaseName" tabIndex="2" maxLength="45" className="form-control" value={this.state.diseaseName} onChange={this.handleNeoantigenInputChange.bind(this)} placeholder="Enter disease name" /> */}
              <Select
                defaultValue={[...this.state?.AlldiseaseData?.map((d) => ({ ...d, label: d.name, value: d.id }))?.filter((d) => this.state?.AllSelectedDisease.split(",").includes(String(d.id)))]}
                // isMulti
                // name="colors"
                isClearable
                isSearchable
                options={[...this.state?.AlldiseaseData?.map((d) => ({ ...d, label: d.name, value: d.id }))?.filter((d) => d.isVerified == true)]}
                // className="basic-multi-select"
                className='basic-single'
                classNamePrefix="select"
                onChange={this.handleAllDisease}
                name="diseaseName"
                placeholder="Select Disease"


              />

              {<span className="error">{errors.diseaseName}</span>}

            </div>

            {/* <div className="form-group  ">
              <label htmlFor="recipient-name" className="form-control-label">Patient's Accession Number </label>
              <span className="mx-lg-2"
                data-toggle="tooltip" data-placement="top" title="You can bind this gene/protein details with selected patient's accession number. "
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </span>
              <Input type='select' value={this.state.SelectedPAtientAccessionNumber} onChange={e => this.setState({ SelectedPAtientAccessionNumber: e.target.value })} >
                <option value="" >Select Accession Number</option>
                {
                  this.state.AllPatientAccessionMappingData.map((data) => {
                    return <>
                      <option value={data.accessionNo} >
                        {data.accessionNo}
                      </option>
                    </>
                  })
                }

              </Input>
            </div> */}

            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Patient Accession Number</label>
              {/* <Input type="text" autoComplete="off" name="diseaseName" tabIndex="2" maxLength="45" className="form-control" value={this.state.diseaseName} onChange={this.handleNeoantigenInputChange.bind(this)} placeholder="Enter disease name" /> */}
              <Select
                // defaultValue={[...this.state?.AlldiseaseData?.map((d) => ({ ...d, label: d.name, value: d.id }))?.filter((d) => this.state?.AllSelectedDisease.split(",").includes(String(d.id)))]}
                // isMulti
                isClearable
                isSearchable
                // name="colors"
                options={[...this.state?.AllPatientAccessionMappingData.map((d) => ({ ...d, label: d.accessionNo, value: d.accessionNo }))]}
                // className="basic-multi-select"
                className='basic-single'
                classNamePrefix="select"
                onChange={(e) => this.setState({ SelectedPAtientAccessionNumber: e?.value })}
                name="SelectedPAtientAccessionNumber"
                placeholder="Select Accession Number"

              />

              {/* <CreatableSelect
                isMulti={false}
                isClearable
                isSearchable
                placeholder="Select Accession Number"
                formatCreateLabel={(inputValue) => `${inputValue}`}
                options={[...this.state?.AllPatientAccessionMappingData.map((d) => ({ ...d, label: d.accessionNo, value: d.accessionNo }))]}
                onChange={(e) => this.setState({ SelectedPAtientAccessionNumber: e.value })}

              /> */}




            </div>



            <div className="form-group  ">
              <label htmlFor="recipient-name" className="form-control-label">Gender </label>
              <div className='d-flex'>
                <div className="custom-control custom-radio mr-3">
                  {this.state.gender == "M" ? (
                    <Input
                      type="radio"
                      className="custom-control-input"
                      value="M"
                      onChange={this.handleNeoantigenInputChange.bind(this)}
                      checked
                      // disabled={newAccesion}
                      id="Male"
                      name="gender"
                      tabIndex="15"
                    />
                  ) : (
                    <Input
                      type="radio"
                      className="custom-control-input"
                      value="M"
                      onChange={this.handleNeoantigenInputChange.bind(this)}
                      id="Male"
                      name="gender"
                      tabIndex="15"

                    />
                  )}
                  <label
                    className="custom-control-label"
                    htmlFor="Male"
                  >
                    Male
                  </label>
                </div>
                <div className="custom-control custom-radio">
                  {this.state.gender == "F" ? (
                    <Input
                      type="radio"
                      checked
                      className="custom-control-input"
                      value="F"
                      // disabled={newAccesion}
                      onChange={this.handleNeoantigenInputChange.bind(this)}
                      id="Female"
                      name="gender"
                      tabIndex="16"
                    />
                  ) : (
                    <Input
                      type="radio"
                      className="custom-control-input"
                      value="F"
                      // disabled={newAccesion}
                      onChange={this.handleNeoantigenInputChange.bind(this)}
                      id="Female"
                      name="gender"
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
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Date of Birth </label>
              <div className="cus-date-picker">
                <DatePicker
                  selected={this.state.dob}
                  maxDate={new Date()}
                  onChange={this.handleDateChange.bind(this)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="mm/dd/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  fixedHeight
                />
                {<span className="error">{errors.dob}</span>}

              </div>
            </div>

            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Age</label>
              <Input
                type="text"
                disabled
                name="age"
                value={this.state.age}
                placeholder="0"
                maxLength="100"
              />

            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Country <span className="requiredField"></span></label>

              <Input
                type="select"
                name="countryId"
                value={this.state.countryId}
                onChange={this.handleNeoantigenInputChange.bind(this)}
              >
                <option value="">Select  Country</option>
                {this.state?.countries?.map((data, i) => {
                  return (
                    <option key={i} value={data?.id}>
                      {data?.name}
                    </option>
                  );
                })}
              </Input>
              {<span className="error">{errors.countryId}</span>}
            </div>

            {/* <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Country Name </label>
              <Input type="select" autoComplete="off" name="countryname" tabIndex="2" maxLength="45" className="form-control" value={this.state.countryname} onChange={this.handleNeoantigenInputChange.bind(this)} placeholder="Enter country name" />
              {<span className="error">{errors.countryname}</span>}
            </div> */}

            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Description <span className="requiredField">*</span></label>
              <Grammarly clientId="client_Mygif7MAqrmjKVPfFwatyC">
                <GrammarlyEditorPlugin>
                  <CKEditor
                    contenteditable="true"
                    editor={ClassicEditor}
                    name="description"


                    style={{ width: "auto" }}
                    spellcheck={true}
                    config={{
                      scayt_autoStartup: true,
                      placeholder: "Write description ....",
                      mention: {
                        feeds: [
                          {
                            marker: '@',
                            feed: this.getFeedItems
                          }]
                      },
                    }}
                    onChange={
                      (event, editor) => {
                        const data = editor?.getData();
                        let errors = this.state.errors;
                        errors.description = ""
                        this.setState({ description: data });


                        // this.handleNoteInput.bind(this)
                      }
                    }
                    data={this.state.description || ""}
                  ></CKEditor>
                </GrammarlyEditorPlugin>
              </Grammarly >
              {/* <Input type="textarea" rows="10" autoComplete="off" className="form-control here" maxLength="" tabIndex="6" name="description" placeholder="Write description" value={this.state.description} onChange={this.handleNeoantigenInputChange.bind(this)} /> */}
              {<span className="error">{errors.description}</span>}

            </div>








          </ModalBody>
          <ModalFooter style={{ backgroundColor: 'white' }}>
            <Button color="secondary" onClick={this.handleCloseNeoantigen}>
              Close
            </Button>
            {
              this.state.isEdit ? <>

                <Button color="primary" disabled={loading} onClick={this.AddPatientNeoantigen.bind(this)}>
                  {title == "Edit Gen/Protein Deatils" ? "Update" : "Add"}
                </Button>



              </> : null
            }

          </ModalFooter>
        </Modal>

        <Modal isOpen={showimport} className="modal-dialog modal-md">
          <ModalHeader>
            Import Neoantigen Data
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Import File</label>
              <Input type="file" name="importFile" id="File" className="form-control" tabIndex="1" onChange={this.handleImportFileInputChange.bind(this)} />
              <a href={demoImportFile} download>Download Import Demo File</a>
            </div>
            {showimporterror != "" &&
              <div>
                <span className='error'>{showimporterror}</span>
              </div>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseImport}>
              Close
            </Button>
            {loading ?
              <Button color="primary" disabled onClick={this.ImportData.bind(this)}>
                Add
              </Button> :
              <Button color="primary" onClick={this.ImportData.bind(this)}>
                Add
              </Button>}
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
      </div>
    );
  }
}

export default GeneProtien;
