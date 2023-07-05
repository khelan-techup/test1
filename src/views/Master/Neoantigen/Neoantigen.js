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
import { Steps } from "intro.js-react";
import axiosInstance from "./../../../common/axiosInstance"
import ReactPaginate from 'react-paginate';
import { BE_Neoantigen_Delete, BE_Neoantigen_GetAllPaging, BE_Neoantigen_GetById, BE_Neoantigen_ImportData, BE_Neoantigen_Save, BE_Neoantigen_Update, BE_OrganizationUser_UpdateTooltipSteps, BE_Patient_GetAll } from '../../../common/allApiEndPoints';

class Neoantigen extends Component {
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
        patientId: ''
      },

      showimport: false,
      showimporterror: '',
      importFile: '',
      demoImportFile: '',

      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      steps: [{
        element: "#pagetitle",
        title: 'Neoantigen',
        intro: "Used to add or update neoantigen and Description",
        tooltipClass: "cssClassName1",
      },

      {
        element: "#Add",
        title: 'Add New Neoantigen',
        tooltipClass: "cssClassName1",
        intro: "You can add new neoantigen by clicking on this Add button."
      },
      {
        element: "#Import",
        title: 'Import Neoantigen Data',
        tooltipClass: "cssClassName1",
        intro: "You can import neoantigen data by clicking on this Import button."
      },
      {
        element: "#activeInactiveFilter",
        title: 'Active/Inactive filter for Neoantigen list',
        intro: "You can filter neoantigen list by selecting active or inactive option from the dropdown.",
        tooltipClass: "cssClassName1",
      },
      // {
      //   element: "#AnalysisTypeCategory",
      //   title: 'Filter Tissue List by Analysis type',
      //   tooltipClass: "cssClassName1",
      //   intro: "You can filter tissue list by selecting analysis type category from the dropdown."
      // },
      // {
      //   element: "#AnalysisTypeSubCategory",
      //   title: 'Filter Tissue List by sub category',
      //   tooltipClass: "cssClassName1",
      //   intro: "You can filter tissue list by selecting sub category from the dropdown."
      // },

      {
        element: "#searchbar ",
        title: 'Search Neoantigen',
        tooltipClass: "cssClassName1",
        intro: "This Search Bar allows the User to search in the neoantigen list."
      },

      {
        element: "#Edit",
        title: 'Edit Neoantigen',
        tooltipClass: "cssClassName1",
        intro: "You can edit or update neoantigen details by clicking on this Edit button."
      },
      {
        element: "#Delete",
        title: 'Delete or Recover Neoantigen',
        tooltipClass: "cssClassName1",
        intro: "You can delete/Recover neoantigen by clicking on Delete/Recover button."
      },
      {
        element: "#help",
        tooltipClass: "cssClassName1",
        title: "Tour",
        intro: "You can always start this tour by clicking this button :)"
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

      pageCountNew: 0

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
      const element = document.querySelector('#Import')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 2) {
      const element = document.querySelector('#activeInactiveFilter')

      if (!element) this.myRef.current.introJs.nextStep()
    }

    // if (newStepIndex === 3) {
    //   const element = document.querySelector('#AnalysisTypeSubCategory')

    //   if (!element) this.myRef.current.introJs.nextStep()
    // }
    if (newStepIndex === 3) {
      const element = document.querySelector('#searchbar')

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
      let currentrights = rights.filter(role => role.moduleId.toString() == "15");
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          // this.getListData(0);
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
    this.getNeoantigenData(0);
    this.getPatientData();
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
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Neoantigen/GetAllPaging';
    const url = apiroute + BE_Neoantigen_GetAllPaging

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
    // const url = apiroute + '/api/BE_Neoantigen/Delete?id=' + id + '&userId=' + userId + '';
    const url = apiroute + BE_Neoantigen_Delete(id, userId)

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
      patientId: '',
      protein: '',
      neoantigenValue: '',
      cancerHallmark: '',
      researchLiteratureLink: '',
      comments: '',
      errors: {
        protein: '',
        neoantigenValue: '',
        cancerHallmark: '',
        researchLiteratureLink: '',
        comments: '',
        patientId: ''
      },
    });
  }

  handleShowNeoantigen = (e, NeoantigenId) => {
    //alert(Math.round(Amount,2))
    if (NeoantigenId != 0) {
      this.setState({ loading: true, title: "Edit Neoantigen" });

      const apiroute = window.$APIPath;
      // const url = apiroute + '/api/BE_Neoantigen/GetById?id=' + NeoantigenId + '';
      const url = apiroute + BE_Neoantigen_GetById(NeoantigenId)

      axiosInstance.get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(result => {
          if (result.data.flag) {
            var rData = result.data.outdata;
            this.setState({
              neoantigenId: rData.neoantigenId, protein: rData.protein,
              cancerHallmark: rData.cancerHallmark, patientId: rData.patientId,
              neoantigenValue: rData.neoantigenValue, researchLiteratureLink: rData.researchLiteratureLink,
              comments: rData.comments, loading: false, showneoantigen: true
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
        neoantigenId: NeoantigenId,
        title: "Add Neoantigen"
      });
    }
  }

  handleNeoantigenInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    let errors = this.state.errors;

    switch (name) {
      case 'protein':
        errors.protein = (!value) ? "Please enter protein." : '';
        break;
      case 'neoantigenValue':
        errors.neoantigenValue = (!value) ? "Please enter neoantigen." : '';
        break;
      case 'cancerHallmark':
        errors.cancerHallmark = (!value) ? "Please enter cancer hallmark." : '';
        break;
      case 'researchLiteratureLink':
        errors.researchLiteratureLink = (!value) ? "Please enter research literature link." : '';
        break;
      case 'comments':
        errors.comments = (!value) ? "Please enter comments." : '';
        break;
      case 'patientId':
        errors.patientId = (!value) ? "Please select patient's Name." : '';
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => {

    })
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.protein == undefined || this.state.protein == '') {
      errors.protein = 'Please enter protein.';
    }
    if (this.state.neoantigenValue == undefined || this.state.neoantigenValue == '') {
      errors.neoantigenValue = 'Please enter neoantigen.';
    }
    if (this.state.cancerHallmark == undefined || this.state.cancerHallmark == '') {
      errors.cancerHallmark = 'Please enter cancer hallmark.';
    }
    if (this.state.researchLiteratureLink == undefined || this.state.researchLiteratureLink == '') {
      errors.researchLiteratureLink = 'Please enter research literature link.';
    }
    if (this.state.comments == undefined || this.state.comments == '') {
      errors.comments = 'Please enter comments.';
    }
    if (this.state.patientId == undefined || this.state.patientId == '') {
      errors.patientId = "Please select patient's Name.";
    }

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
      if (this.state.neoantigenId == 0) {
        // url = apiroute + '/api/BE_Neoantigen/Save';
        url = apiroute + BE_Neoantigen_Save
      }
      else {
        // url = apiroute + '/api/BE_Neoantigen/Update';
        url = apiroute + BE_Neoantigen_Update
      }

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        NeoantigenId: parseInt(this.state.neoantigenId),
        Protein: this.state.protein,
        NeoantigenValue: this.state.neoantigenValue,
        CancerHallmark: this.state.cancerHallmark,
        ResearchLiteratureLink: this.state.researchLiteratureLink,
        Comments: this.state.comments,
        CreatedBy: uid
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
            patientId: '',
            neoantigenId: 0,
            protein: '',
            neoantigenValue: '',
            cancerHallmark: '',
            researchLiteratureLink: '',
            comments: ''
          }, this.getNeoantigenData(0));
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
      let url = apiroute + BE_Neoantigen_ImportData
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

  render() {
    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const { loading, neoantigens, currentPage, currentIndex, pagesCount, pageSize, authError, error,
      patientId, neoantigenId, protein, neoantigenValue, cancerHallmark, researchLiteratureLink, errors,
      patients, comments, showneoantigen, title, showimport, showimporterror,
      importFile, demoImportFile } = this.state;
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
            <h5 className="mt-2 " id="pagetitle" style={{ width: "fit-content" }}><i className="fa fa-align-justify"></i> Neoantigen</h5>
          </Col>
          <Col xs="1" lg="1" style={{ "paddingRight": "5px" }}>
            {
              this.state.isEdit ? <>
                <Link to="#">
                  <button id="Add" className="btn btn-primary btn-block" onClick={e => this.handleShowNeoantigen(e, 0)}>Add</button>
                </Link>
              </> : null
            }

          </Col>
          <Col xs="1" lg="1" style={{ "paddingLeft": "5px" }}>
            {
              this.state.isEdit ? <>
                <Link to="#" style={{ textDecoration: "none" }} id="Import">
                  <button className="btn btn-success btn-block" onClick={() => this.handleShowImport()}>Import</button>
                </Link>
              </> : null
            }

          </Col>
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
                      <th>Patient Name</th>
                      <th>Gene/Protein</th>
                      <th>Neoantigen</th>
                      <th>Cancer Hallmark</th>
                      <th>Research Literature Link</th>
                      <th>Comments</th>
                      <th>Status</th>
                      <th className="thNone">Neoantigen Id</th>
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
                            return (<tr key={i}>
                              <td>{data.patientName}</td>
                              <td>{data.protein}</td>
                              <td>{data.neoantigenValue}</td>
                              <td>{data.cancerHallmark}</td>
                              <td>{data.researchLiteratureLink}</td>
                              <td>{data.comments}</td>
                              <td>
                                {data.isActive ? (<Badge color="success">Active</Badge>) : (<Badge color="danger">Inactive</Badge>)}
                              </td>
                              <td className="thNone">{data.neoantigenId}</td>

                              <td>
                                <div className='d-flex'>
                                  <Link to="#" id="Edit" className="btn btn-primary btn-sm btn-pill" onClick={e => this.handleShowNeoantigen(e, data.neoantigenId)}>Edit</Link>{" "}
                                  {
                                    this.state.isEdit ? <>
                                      <Confirm title="Confirm"
                                        description={`${data.isActive ? 'Are you sure you want to delete this Noeantigen?' : 'Are you sure you want to recover this Neoantigen?'}`}
                                      >
                                        {confirm => (
                                          <Link id="Delete" className="btn btn-danger btn-sm btn-pill ml-1" to="#" onClick={confirm(e => this.deleteRow(e, data.neoantigenId))}>{data.isActive ? "Delete" : "Recover"}</Link>
                                        )}
                                      </Confirm>
                                    </> : null
                                  }

                                </div>
                              </td>
                            </tr>);
                          })
                      ) : (
                        <tr>
                          <td colSpan="8" className="tdCenter">No neoantigen details.</td></tr>
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
              <label htmlFor="recipient-name" className="form-control-label">Patient <span className="requiredField">*</span></label>
              <Input type="select"
                tabIndex="1"
                name="patientId" className={errors.patientId ? "is-invalid" : "is-valid"} value={patientId} onChange={this.handleNeoantigenInputChange.bind(this)}>
                <option value="">Select Patient's Name</option>
                {patients
                  .map((data, i) => {
                    return (<option key={i} value={data.patientId}>{data.firstName + " " + data.lastName + (data.accessionNo != null ? " (" + data.accessionNo.replace(/-/g, "") + ")" : "")}</option>);


                    // return (<option key={i} value={data.patientId}>{data.firstName + " " + data.lastName + (data.accessionNo != null ? " (" + data.accessionNo.replace(/-/g, "") + ")" : "")}</option>);
                  })}
              </Input>
              {/* <Input type="select"
                tabIndex="1"
                name="patientId" className={errors.patientId ? "is-invalid" : "is-valid"} value={patientId} onChange={this.handleNeoantigenInputChange.bind(this)}>
                <option value="">Select Patient's Accession Number</option>
                {patients
                  .map((data, i) => {
                    return(
                    data?.patientAccessionMappings?.filter((e)=>e.accessionNo!=null)?.map((Cdata) => {
                      // let filter_aNum=Cdata.filter((e)=e.accessionNo!=null)
                      // console.log()
                      return (<option key={i} value={Cdata.patientAccessionId}>
                        {
                          Cdata?.accessionNo != ""
                            ? Cdata?.accessionNo?.replace(/-/g, "")
                            : ""
                        }
                        {
                          console.log("dd",Cdata )
                        }
                      </option>)
                    })
                    )
                    // return (<option key={i} value={data.patientId}>{data.firstName + " " + data.lastName + (data.accessionNo != null ? " (" + data.accessionNo.replace(/-/g, "") + ")" : "")}</option>);
                  })}
              </Input> */}
              {<span className='error'>{errors.patientId}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Gene/Protein <span className="requiredField">*</span></label>
              <Input type="text" autoComplete="off" name="protein" tabIndex="2" maxLength="45" className="form-control" value={protein} onChange={this.handleNeoantigenInputChange.bind(this)} placeholder="Enter a gene/protein" />
              {errors.protein.length > 0 && <span className='error'>{errors.protein}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Neoantigen <span className="requiredField">*</span></label>
              <Input type="text" autoComplete="off" className="form-control here" maxLength="45" tabIndex="3" name="neoantigenValue" placeholder="Enter a neoantigen" value={neoantigenValue} onChange={this.handleNeoantigenInputChange.bind(this)} />
              {errors.neoantigenValue.length > 0 && <span className='error'>{errors.neoantigenValue}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Cancer Hallmark <span className="requiredField">*</span></label>
              <Input type="text" autoComplete="off" className="form-control here" tabIndex="4" name="cancerHallmark" placeholder="Enter a cancer hallmark" value={cancerHallmark} onChange={this.handleNeoantigenInputChange.bind(this)} />
              {errors.cancerHallmark.length > 0 && <span className='error'>{errors.cancerHallmark}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Research Literature Link <span className="requiredField">*</span></label>
              <Input type="text" autoComplete="off" className="form-control here" tabIndex="5" name="researchLiteratureLink" placeholder="Enter a research literature link" value={researchLiteratureLink} onChange={this.handleNeoantigenInputChange.bind(this)} />
              {errors.researchLiteratureLink.length > 0 && <span className='error'>{errors.researchLiteratureLink}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Comments <span className="requiredField">*</span></label>
              <Input type="textarea" autoComplete="off" className="form-control here" tabIndex="6" name="comments" placeholder="Enter comments" value={comments} onChange={this.handleNeoantigenInputChange.bind(this)} />
              {errors.comments.length > 0 && <span className='error'>{errors.comments}</span>}
            </div>
          </ModalBody>
          <ModalFooter style={{ backgroundColor: 'white' }}>
            <Button color="secondary" onClick={this.handleCloseNeoantigen}>
              Close
            </Button>
            {
              this.state.isEdit ? <>
                <Button color="primary" disabled={loading} onClick={this.AddPatientNeoantigen.bind(this)}>
                  {title == "Edit Neoantigen" ? "Update" : "Add"}
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

export default Neoantigen;
