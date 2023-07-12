import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Table,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Popover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import NumberFormat from "react-number-format";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { Link, Redirect } from "react-router-dom";
import React, { Component, createRef } from "react";
import _, { takeWhile } from "lodash";
import ReactHtmlParser from "react-html-parser";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-custom-build";
import Confirm from "../../CustomModal/Confirm";
import DatePicker from "react-datepicker";

import Moment from "moment";

import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import MyModal from "../../CustomModal/CustomModal";
import axios from "axios";
import closeIcon from "../../../assets/x.svg";
import downloadIcon from "../../../assets/download.svg";
import { toast } from "react-toastify";
import { SpinnerRoundOutlined } from "spinners-react";
import error_icon from "./../../../assets/error_icon.png";
import success_icon from "./../../../assets/success.png";
import warn_icon from "./../../../assets/warn.png";
import notes_icon from "./../../../assets/notes.png";
import plus_icon from "./../../../assets/img/avatars/6.jpg";
import reply_icon from "./../../../assets/reply.png";
import close_icon from "./../../../assets/close.png";
import ReactReadMoreReadLess from "react-read-more-read-less";

import { Tooltip as ReactTooltip } from "react-tooltip";

// import { Tooltip } from 'react-tooltip'
import "react-tooltip/dist/react-tooltip.css";
import { Steps } from "intro.js-react";
import axiosInstance from "./../../../common/axiosInstance";

import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import { GrammarlyEditorPlugin, Grammarly } from '@grammarly/editor-sdk-react'
import { BiError } from 'react-icons/bi';
import HtmlParser from "react-html-parser";

class View extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.initialState = {
      PMRapprovelRight: "",

      costumerCare: [],
      showCustomerCare: false,
      ccId: "",
      currentCcId: "",
      currentDiseaseName: "",
      showEmailNotifyConfirm: false,
      emailNotify: true,
      file: {},
      redirectUpdate: false,

      updateStatusCode: 1,
      tempUpdateStatusCode: 1,
      PMRINDEX: null,
      drag: false,
      toggleDropDownForStatus: false,
      showUpdateStatusModel: false,
      newStatus: "",
      currentStatus: "Open",
      reportType: 0,
      patientReports: [],
      patientPMRReports: [],
      patientHIReports: [],
      PatientAdmeToxReports: [], AnalysisReport: [],
      DesignReport: [],
      diseasUpdateHeaderTxt: "Update Disease",
      diseasUpdateBtnTxt: "Update",
      selectedLabs: {},
      callPipeline: false,
      recallPipeline: false,
      currentDiseaseId: 0,
      showPaidStatus: false,
      showConfirmPayment: false,
      diseaseId: 0,
      Tissue: 0,
      currentTissue: 0,
      diseaseCategoryId: 0,
      currentDiseaseCategoryId: 0,
      analysisModal: false,
      analysisText: "",
      analysisHeader: "",
      peptides: {
        pmrSentToClinic: {
          checked: false,
          date: "",
        },
        clinicSentPmrToPharmacy: {
          checked: false,
          date: "",
        },
        peptidesReceivedByClinic: {
          checked: false,
          date: "",
        },
        treatMentStarted: {
          checked: false,
          date: "",
        },
      },
      isRevised: false,
      selectedLabsForBucket: {},
      selectedSpecimenCollection: [],
      specimentCollections: [],
      analysisOrderStatus: {
        orderSubmitted: { checked: false, date: "" },
        poReceived: { checked: false, date: "" },
        invoiceSent: { checked: false, date: "" },
        paymentRecived: { checked: false, date: "" },
      },
      designOrderStatus: {
        orderSubmited: {
          checked: false,
          date: "",
        },
        clinicSentPmrToPharmacy: {
          checked: false,
          date: "",
        },
        peptides: {
          checked: false,
          date: "",
        },
        treatMentStarted: {
          checked: false,
          date: "",
        },
        invoice: {
          checked: false,
          date: "",
        },
        paymentReceived: {
          checked: false,
          date: "",
        },
      },
      activeTab: new Array(7).fill("1"),
      loading: true,
      //patientId: 0,
      //basicInfo: "",
      //practitioner: "",
      //diseases: [],
      //ngslaboratorys: [],
      //assignngslaboratorys: [],
      //diagnosticHistory: [],
      //emergencyContact: [],
      //insuranceDetail: [],
      //prescription: [],
      //treatmentReport: [],
      patientId: 0,
      PatientAccessionId: 0,
      basicInfo: "",
      assignedpractitioner: "",
      assignedinstitute: "",
      assignedlaboratory: [],
      assignedmanufacture: "",
      patientaccessionmapping: "",
      diseases: "",
      diagnosticHistory: [],
      emergencyContact: [],
      insuranceDetail: [],
      prescription: [],
      treatmentReport: [],
      patientpayments: [],

      practitionerId: 0,
      practitionerSearch: "",
      allpractitioners: [],
      filteredpractitioners: [],
      showpractitioner: false,

      instituteId: 0,
      instituteSearch: "",
      allinstitutes: [],
      filteredinstitutes: [],
      showinstitute: false,

      manufacturerId: 0,
      manufacturerSearch: "",
      allmanufactures: [],
      filteredmanufactures: [],
      showmanufacture: false,

      ngslaboratoryId: 0,
      ngslaboratorySearch: "",
      allngslaboratorys: [],
      filteredngslaboratorys: [],
      showngslaboratory: false,

      patientdiseaseId: "",
      Alldiseases: [],
      dieseasData: [],
      showdisease: false,
      allTissues: [],
      UploadFile: false,

      UploadFileFor: "",
      deleteFileModel: false,
      deleteFileFor: "",
      deleteUserId: 0,
      AllSamples: [],
      patientSamples: [],
      patientSampleId: "",
      checkbox: [],

      NewSamples: {},

      //milestones: [],
      //patientMilestoneId: '',
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",

      errors: {
        patientSampleId: "",
        patientdiseaseId: "",
        ngslaboratoryId: "",
        instituteId: "",
        practitionerId: "",
        manufacturerId: "",
        //prescriptionDescription: '',
        //prescribeDate: '',

        //treatmentDescription: '',
        //treatmentDetail: '',
        //treatmentDate: '',

        diagnosticAnalysis: "",
        diagnosticDate: "",
        outcome: "",

        prescriptionDescription: "",
        prescribeDate: "",

        treatmentDescription: "",
        treatmentDetail: "",
        treatmentDate: "",
        notes: "",
        reviseReason: "",
        note_title: "",
        inputTextforNotes: "",
        assignUserId: "",
        sectionId: "",
        tissue: "",
        newDisease: "",
        practitionerContactPersonIdDesign: "",
        DesignDiscount: "",

        PaymentDiscount: "",
        PMRapproveNotes: ""

      },
      uploadError: "",
      isView: false,
      isEdit: false,
      roleName: "",

      preview: false,
      url: "",

      diagnosticAnalysis: "",
      diagnosticDate: Moment(new Date())._d,
      outcome: "",
      diagnosticDocFiles: [],
      diagnosticdocumentFile: "",
      showdiagnosticerror: "",
      showdiagnostic: false,
      showeditdiagnostic: false,
      DeletemodalforDiagnosticFile: false,
      deleteDiagnosticFileId: "",

      prescriptionDescription: "",
      prescribeDate: Moment(new Date())._d,
      prescriptiondocumentFile: "",
      prescriptiondocFiles: [],
      showprescriptionerror: "",
      showprescription: false,
      showeditprescription: false,
      DeletemodalforPrescriptionFile: false,
      deletePrescriptionFileId: "",

      treatmentDescription: "",
      treatmentDetail: "",
      treatmentDate: Moment(new Date())._d,
      treatmentdocumentFile: "",
      treatmentdocFiles: [],
      showtreatmenterror: "",
      showtreatment: false,
      showedittreatment: false,
      canclePiplinemodal: false,
      stopPipelinemodal: false,
      DeletemodalfortreatmentsFile: false,
      deletetreatmentsFileId: "",

      field1: false,
      feild2: false,
      feild3: false,
      feild4: false,
      disableFields: false,
      patientDiagnosticId: 0,
      PatientPrescriptionId: 0,
      patientTreatmentReportId: 0,
      diseaseId: 0,
      diseaseDataId: 0,
      diseasecategory: "",
      isEditDateClass: "",
      spinStatus: false,

      AllpatientNotes: [],
      inputTextforNotes: "",
      add_notes: false,
      organizationusersforNotes: [],
      assignUserId: "",
      notifyToUserIds: "",
      IsReply: false,
      CommentValue: "",
      CommentValues: "",
      note_title: "",
      sectionId: "",
      sectionsNames: [
        {
          id: 1,
          sectionName: "Analysis Order Status",
        },
        {
          id: 2,
          sectionName: "Laboratory",
        },
        {
          id: 3,
          sectionName: "Design Order Status",
        },
        {
          id: 4,
          sectionName: "PMR & Final Report",
        },
        {
          id: 5,
          sectionName: "Peptide Status",
        },
      ],
      DeletemodalforNotes: false,
      deleteNotesId: "",
      Analysis_Order_Status_notes: [],
      Laboratory: [],
      Design_Order_Status: [],
      PMR_and_Final_Report: [],
      Peptide_Status: [],
      notesCreatedId: "",
      patientNoteId: 0,

      commentText: "",
      showComments: [],
      EditCommentId: "",
      notes_updatedBy_Id: "",
      notes_createdBy_Id: "",
      EditcommentText: "",
      DeletemodalforNoteComment: false,
      DeleteCommentId: "",
      DeletepatientNotesId: "",
      note_title_before_Edit: "",
      inputTextforNotes_before_Edit: "",
      version: "",
      verifyPmrPath: "",
      verifyId: 0,
      specimenLabsMap: [],
      LabsStatusMap: [],
      isFullPaymentStatus: false,
      renamePdf: false,
      filePdfname: "",
      showdiseaseDescription: false,
      DiseaseDescData: "",
      newDisease: "",
      newDiseaseCode: "",
      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      steps: [
        {
          element: "#PatientActivityt",
          title: "Patient Activity",
          intro:
            "This page contains all the patients data and tracks them through our process.",
          tooltipClass: "cssClassName1",
        },

        {
          element: "#Status",
          title: "Status of Patient",
          tooltipClass: "cssClassName1",
          intro: "Used to show the patient current status.",
        },

        {
          element: "#PatientDetailsEdit",
          tooltipClass: "cssClassName1",
          intro: "Used to update the contents for the section.",
          title: "Edit Patient's Details",
        },
        {
          element: "#DiseaseTissueDetailsEdit",
          tooltipClass: "cssClassName1",
          title: "Edit Disease/Tissue",
          intro: "You can update disease/tissue by clicking on this icon",
        },
        {
          element: "#DiseaseDescriptionEdit",
          tooltipClass: "cssClassName1",
          title: "EditDisease Description Details",
          intro:
            "You can edit or update Disease Description details by clicking on this icon.",
        },

        {
          element: "#PractitionersDetailsEdit",
          tooltipClass: "cssClassName1",
          title: "Change assigned practitioner ",
          intro:
            "You can update assigned practitioner for this patient by clicking on this icon.",
        },
        {
          element: "#CreatePatientNote",
          tooltipClass: "cssClassName1",
          title: "Creat Note",
          intro:
            "This is used to capture detailed information for this patient, like; lab sample status, delays in process, unique actions, etc.",
        },

        {
          element: "#SpecimenSectionNotApplicable",
          tooltipClass: "cssClassName1",
          title: "submit not assign status",
          intro: "This will submit not assign status to the system.",
        },

        {
          element: "#PMRandFinalReportVerifyData",
          tooltipClass: "cssClassName1",
          title: "Verify Data",
          intro: "You can Verify Data by clicking on this button.",
        },
        {
          element: "#PMRandFinalReportProcessData",
          tooltipClass: "cssClassName1",
          title: "Process Data",
          intro: "You can Process Data by clicking on this button.",
        },
        {
          element: "#PMRandFinalReportGPR",
          tooltipClass: "cssClassName1",
          title: "Generate Patient Report",
          intro:
            "You can generate patient's report by clicking on this button.",
        },
        {
          element: "#PMRandFinalReportGPreventionR",
          tooltipClass: "cssClassName1",
          title: "Generate Prevention Report",
          intro:
            "You can generate prevention report by clicking on this button.",
        },
        {
          element: "#PMRandFinalReportGLongevityR",
          tooltipClass: "cssClassName1",
          title: "Generate Longevity Report",
          intro:
            "You can generate longevity report by clicking on this button.",
        },
        {
          element: "#PMRandFinalReportGPMR",
          tooltipClass: "cssClassName1",
          title: "PMR Report",
          intro: "You can Generate PMR report using this button.",
        },
        {
          element: "#PMRandFinalReportGAToxR",
          tooltipClass: "cssClassName1",
          title: "Generate Adme-Tox Report",
          intro: "You can Generate Adme-Tox report using this button.",
        },

        {
          element: "#PMRandFinalReportPatientFileName",
          tooltipClass: "cssClassName1",
          title: "Can rename file name?",
          intro: "Yes, You can rename the file name by duble clicking here.",
        },

        {
          element: "#PMRandFinalReportPMRUpload",
          tooltipClass: "cssClassName1",
          title: "Upload PMR Report",
          intro: "You can Upload PMR report using this button.",
        },
        {
          element: "#PMRandFinalReportPMRFileName",
          tooltipClass: "cssClassName1",
          title: "Can rename file name?",
          intro: "Yes, You can rename the file name by duble clicking here.",
        },
        {
          element: "#PMRandFinalReportPMRFileView",
          tooltipClass: "cssClassName1",
          title: "View File",
          intro: "To view file just click on this button.",
        },
        {
          element: "#PMRandFinalReportPMRFileDelete",
          tooltipClass: "cssClassName1",
          title: "Delete File",
          intro: "You can Delete file permanently clicking on this button",
        },
        {
          element: "#PMRandFinalReportPMRFileVerify",
          tooltipClass: "cssClassName1",
          title: "PMR verify",
          intro: "You can verify PMR report using this button.",
        },
        {
          element: "#PMRandFinalReportPMRFileApproved",
          tooltipClass: "cssClassName1",
          title: "PMR Approval",
          intro: "You can approve PMR report using this button.",
        },

        {
          element: "#BottomSectionTreatments",
          tooltipClass: "cssClassName1",
          title: "Treatements Details",
          intro: "You can upload file for tretments or other details.",
        },
        {
          element: "#BottomSectionTreatmentsAdd",
          tooltipClass: "cssClassName1",
          title: "Add Details",
          intro: "You can add new detils for this section.",
        },
        {
          element: "#BottomSectionTreatmentsEdit",
          tooltipClass: "cssClassName1",
          title: "Edit Details",
          intro: "You can Edit ou Update detilas clicking on this icon.",
        },
        {
          element: "#BottomSectionTreatmentsDelete",
          tooltipClass: "cssClassName1",
          title: "Delete Records",
          intro: "You can Delete record by clicking on this icon.",
        },
        {
          element: "#help",
          tooltipClass: "cssClassName1",
          title: "Tour",
          intro: "Highlights key page features and functions.",
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
      handleMetastasis: "no",
      pipelineQueued: false,
      pipelineStarted: false,
      disabledButton: "true",
      isPipelineStatusRefreshed: false,
      DesignDiscountType: "",
      DesignDiscount: "",
      practitionerContactPersonIdDesign: [],
      practitionerContactPerson: [],

      disabledButton: true,
      showFRMailModal: false,
      finalReport: {},
      tempFRMail: "",
      addedFREmails: [],
      sendFREmailErrors: null,
      sendFRSubjectErrors: null,
      emailFRSubject: "",
      emailFRDesc: "",
      showADMEMailModal: false,
      admeReport: {},
      tempADMEMail: "",
      addedADMEEmails: [],
      sendADMEEmailErrors: null,
      emailADMESubject: "",
      emailADMEDesc: "",
      designOrderDiscount: "",
      analysisOrderDiscount: "",
      selectedEmails: [],
      allEmail: [],
      showAnalysisPayment: false,
      showDesignPayment: false,
      labTabsVisibility: {},
      showPmrAndFinalReport: false,
      showPmrAndFinalReportDel: false,
      showInvoiceModal: false,
      InvoiceOrPo: {},
      InvoiceOrPoId: "",
      InvoiceOrPoType: "",
      paymentType: "n",
      TypeOfPayment: "3",
      paymentTypeModal: false,
      PaymentDiscountType: "",
      PaymentDiscount: "",
      showDesignPaymentNotRequired: false,
      SelectedTypeOfPayment: "3",
      PMRapproveNotes: "",
      showPMRRejectReason: false,
      popOverId: null




      //options: [{name: 'Srigar', id: 1},{name: 'Sam', id: 2}]
    };

    this.state = this.initialState;
    this.toggleNotes = this.toggleNotes.bind(this);
    this.toggleComment = this.toggleComment.bind(this);
    this.peptideRef = createRef();
    this.pipelineRef = createRef();
    this.designRef = createRef();
    this.labRef = createRef();
    this.analysisRef = createRef();
    this.modal_notes_scroll_ = createRef();
  }
  toggleLabTabVisibility = (labId) => {

    this.setState((prevState) => ({
      labTabsVisibility: {
        ...prevState.labTabsVisibility,
        [labId]: !prevState.labTabsVisibility[labId]
      }
    }));
  };
  handleEmailChange = (selectedOptions, handle_type) => {
    console.log("e:", handle_type)
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

    if (handle_type == "Report_Email") {
      this.state.selectedEmails ?
        this.setState({ selectedEmails: updatedEmails, sendFREmailErrors: "" }) :
        this.setState({ selectedEmails: updatedEmails })
    }

    if (handle_type == "SendPO_Email") {
      this.setState({ practitionerContactPersonIdDesign: updatedEmails, })
    }



  };

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

  handleCcChange = (e) => {
    let value = e.target.value;
    console.log(value);
    this.setState({
      ccId: value,
    });
  };
  handleCloseCustomerCare = () => {
    this.setState({
      showCustomerCare: false,
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

  handleShowCustomerCare = () => {
    this.setState({
      showCustomerCare: true,
      ccId: this.state.currentCcId,
    });
  };

  updateCustomerCareDetail = () => {
    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));

    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }
    this.setState({
      loading: true,
    });
    const apiroute = window.$APIPath;
    const url =
      apiroute + "/api/BE_PatientAccessionMapping/UpdateAccessionDetail";
    let data = JSON.stringify({
      pId: Number(this.state?.patientId),
      aId: Number(this.state?.PatientAccessionId),
      userId: parseInt(uid),
      ccId: Number(this.state?.ccId),
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
          console.log(result);
          this.setState({
            loading: false,
            showCustomerCare: false,
          });
          const param = this.props.match.params;
          this.getData(param.id, param.aid);
          toast.success(result.data.message);
        } else {
          this.setState({ loading: false });
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        // console.ldidmouog(error);
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

  onExit = (e) => {
    console.log(e);
    this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 26 }));
    // localStorage.setItem("isFirstLogin", false);
    // this.sendCurrentStep();
  };
  onAfterChange = (newStepIndex) => {
    if (newStepIndex === 0) {
      const element = document.querySelector("#PatientActivityt");

      if (!element) this.myRef.current.introJs.nextStep();
    }

    if (newStepIndex === 1) {
      const element = document.querySelector("#Status");

      if (!element) this.myRef.current.introJs.nextStep();
    }

    if (newStepIndex === 2) {
      const element = document.querySelector("#PatientDetailsEdit");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 3) {
      const element = document.querySelector("#DiseaseTissueDetailsEdit");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 4) {
      const element = document.querySelector("#DiseaseDescriptionEdit");

      if (!element) this.myRef.current.introJs.nextStep();
    }

    if (newStepIndex === 5) {
      const element = document.querySelector("#PractitionersDetailsEdit");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 6) {
      const element = document.querySelector("#CreatePatientNote");

      if (!element) this.myRef.current.introJs.nextStep();
    }

    if (newStepIndex === 7) {
      const element = document.querySelector("#SpecimenSectionNotApplicable");

      if (!element) this.myRef.current.introJs.nextStep();
    }

    if (newStepIndex === 8) {
      const element = document.querySelector("#PMRandFinalReportVerifyData");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 9) {
      const element = document.querySelector("#PMRandFinalReportProcessData");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 10) {
      const element = document.querySelector("#PMRandFinalReportGPR");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 11) {
      const element = document.querySelector("#PMRandFinalReportGPreventionR");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 12) {
      const element = document.querySelector("#PMRandFinalReportGLongevityR");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 13) {
      const element = document.querySelector("#PMRandFinalReportGPMR");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 14) {
      const element = document.querySelector("#PMRandFinalReportGAToxR");

      if (!element) this.myRef.current.introJs.nextStep();
    }

    if (newStepIndex === 15) {
      const element = document.querySelector(
        "#PMRandFinalReportPatientFileName"
      );

      if (!element) this.myRef.current.introJs.nextStep();
    }

    if (newStepIndex === 16) {
      const element = document.querySelector("#PMRandFinalReportPMRUpload");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 17) {
      const element = document.querySelector("#PMRandFinalReportPMRFileName");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 18) {
      const element = document.querySelector("#PMRandFinalReportPMRFileView");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 19) {
      const element = document.querySelector("#PMRandFinalReportPMRFileDelete");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 20) {
      const element = document.querySelector("#PMRandFinalReportPMRFileVerify");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 21) {
      const element = document.querySelector(
        "#PMRandFinalReportPMRFileApproved"
      );

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 22) {
      const element = document.querySelector("#BottomSectionTreatments");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 23) {
      const element = document.querySelector("#BottomSectionTreatmentsAdd");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 24) {
      const element = document.querySelector("#BottomSectionTreatmentsEdit");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 25) {
      const element = document.querySelector("#BottomSectionTreatmentsDelete");

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
  toggleSteps = () => {
    this.setState((prevState) => ({ stepsEnabled: !prevState.stepsEnabled }));
  };

  handleCloseUpdateStatus = () => {
    this.setState({
      showUpdateStatusModel: false,
      newStatus: this.state.currentStatus,
    });
  };
  handleFRSubject = (e) => {
    // if (this.state.tempFRMail) {
    //   var email = this.state.tempFRMail.trim();

    //   if (email && this.isFRValid(email)) {
    //     this.setState({
    //       addedFREmails: [...this.state.addedFREmails, email],
    //       tempFRMail: ''
    //     });
    //   }
    // }
    const value = e.target.value
    if (!value) {
      this.setState({
        emailFRSubject: e.target.value,
        sendFRSubjectErrors: "Required field"
      })
      return false
    } else {
      this.setState({
        emailFRSubject: e.target.value,
        sendFRSubjectErrors: ""
      })
    }

    // this.setState({
    //   emailFRSubject: e.target.value,
    // });
  }
  handleShowInvoiceModal = (e, fileType) => {
    this.setState({
      // deleteFileFor: name,
      showInvoiceModal: true,
      InvoiceOrPo: e,
      InvoiceOrPoId: e.invoicePOReportId,
      InvoiceOrPoType: fileType

    });
  };
  handleEmailFRDesc = (e) => {
    // if (this.state.tempFRMail) {
    //   var email = this.state.tempFRMail.trim();

    //   if (email && this.isFRValid(email)) {
    //     this.setState({
    //       addedFREmails: [...this.state.addedFREmails, email],
    //       tempFRMail: ''
    //     });
    //   }
    // }
    this.setState({
      emailFRDesc: e.target.value,
    });
  }
  validateEmailFormErrors = () => {
    var validEmail = false;
    var validSubject = false;

    if (this.state.selectedEmails.length == 0) {
      this.setState({
        sendFREmailErrors: "Email address is required"
      })
    } else {
      validEmail = true
    }

    if (!this.state.emailFRSubject) {
      this.setState({
        sendFRSubjectErrors: "Required field"
      })
    } else { validSubject = true }
    return validEmail && validSubject
  }
  handleSubmitFR = () => {
    if (this.validateEmailFormErrors()) {
      if (true) {
        this.setState({
          loading: true
        })
        const apiroute = window.$APIPath;
        const url =
          apiroute + "/api/BE_PatientReport/SendEmailPatientFile";
        const filtredEmails = []
        this.state.selectedEmails.map(obj => {
          filtredEmails.push(obj.value)
        })
        let data = JSON.stringify({
          "id": this.state?.finalReportId_Email,
          "rptType": this.state.finalReportType_Email,
          "subject": this.state?.emailFRSubject,
          "body": this.state?.emailFRDesc,
          // "senderEmailIds": this.state?.addedFREmails
          "senderEmailIds": filtredEmails
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
                showFRMailModal: false,
                addedFREmails: [],
                emailFRDesc: "",
                emailFRSubject: "",
                finalReportId_Email: "",
                finalReportType_Email: "",
                sendFRSubjectErrors: "",
                sendFREmailErrors: ""
              });
              toast.success(result?.data?.message)
            }
            else {
              this.setState({ loading: false });
              toast.error("Something went wrong")

            }
          }).catch((error) => {
            toast.error("Something went wrong")

            this.setState({ loading: false });
          }).finally(() => {
            this.setState({
              selectedEmails: null,

            })
          })
      }
    }


  }
  handleSubmitInvoiceOrPo = () => {
    if (this.validateEmailFormErrors()) {
      if (true) {
        this.setState({
          loading: true
        })
        const apiroute = window.$APIPath;
        const url =
          apiroute + "/api/BE_PatientReport/SendInvoicePOFile";
        const filtredEmails = []
        this.state.selectedEmails.map(obj => {
          filtredEmails.push(obj.value)
        })
        let data = JSON.stringify({
          "id": this.state?.InvoiceOrPoId,
          "rptType": this.state.InvoiceOrPoType,
          "subject": this.state?.emailFRSubject,
          "body": this.state?.emailFRDesc,
          // "senderEmailIds": this.state?.addedFREmails
          "senderEmailIds": filtredEmails
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
                showInvoiceModal: false,
                addedFREmails: [],
                emailFRDesc: "",
                emailFRSubject: "",
                InvoiceOrPoId: "",
                InvoiceOrPoType: "",
                sendFRSubjectErrors: "",
                sendFREmailErrors: ""
              });
              toast.success(result?.data?.message)
            }
            else {
              this.setState({ loading: false });
              toast.error("Something went wrong")

            }
          }).catch((error) => {
            toast.error("Something went wrong")

            this.setState({ loading: false });
          }).finally(() => {
            this.setState({ selectedEmails: null })
          })

      }
    }


  }
  handleUpdateStatusChange = (value, code) => {
    // const target = e.target;
    // const value = target?.value;
    // const name = target?.name
    // console.log({ con: code == this.state.updateStatusCode, code, updateStatusCode: this.state.updateStatusCode })
    if (code == this.state.updateStatusCode) {
      return;
    } else {
      this.setState({
        newStatus: value,
        showUpdateStatusModel: true,
        tempUpdateStatusCode: code,
      });
    }
  };
  getStatusColor = () => {
    switch (this.state.updateStatusCode) {
      case 1:
      case "1": {
        return "lightgreen";

        break;
      }
      case 2:
      case "2": {
        return "blue";
        break;
      }
      case 3:
      case "3": {
        return "darkgray";
        break;
      }
      case 4:
      case "4": {
        return "gold";
        break;
      }
      case 5:
      case "5": {
        return "crimson";
        break;
      }
      default:
        return "darkgray";
    }
  };

  getStatusValue = (status) => {
    switch (status) {
      // Active = 1,
      // OnHold = 2,
      // Complete = 3,
      // Cancelled = 4,
      // Deceased = 5,
      case 1:
      case "1": {
        return "Open";

        break;
      }
      case 2:
      case "2": {
        return "On Hold";
        break;
      }
      case 3:
      case "3": {
        return "Complete";
        break;
      }
      case 4:
      case "4": {
        return "Cancelled";
        break;
      }
      case 5:
      case "5": {
        return "Deceased";
        break;
      }
      default:
        return "Open";
    }
  };
  handleSubmitStatus = () => {
    this.setState({ loading: true }, () => {
      const userToken = JSON.parse(localStorage.getItem("AUserToken"));
      const apiroute = window.$APIPath;
      let uid = 0;
      if (userToken != null) {
        uid = userToken.userId == null ? 0 : userToken.userId;
      }
      let url =
        apiroute + "/api/BE_PatientAccessionMapping/ChangeAccessionStatus";
      const data = {
        patientId: Number(this.state.patientId),
        accessionId: Number(this.state.PatientAccessionId),
        userId: uid,
        status: Number(this.state.tempUpdateStatusCode),
      };

      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((res) => {
          const data = res.data;
          // console.log({ data })
          if (data.flag) {
            this.setState(
              {
                loading: false,
                currentStatus: this.state.newStatus,
                showUpdateStatusModel: false,
                updateStatusCode: this.state.tempUpdateStatusCode,
              },
              () => {
                const param = this.props.match.params;
                this.getData(param.id, param.aid);
              }
            );
            toast.success(data.message);
          } else {
            toast.error(
              data.message ||
              "something went wrong while updating status , please try again"
            );
            this.setState({ loading: false });
          }
        })
        .catch((e) => {
          this.setState({ loading: false });
          toast.error(
            e?.message ||
            "something went wrong while updating status , please try again"
          );
        });
    });
  };

  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log({ typeeeeeeeeeeeeeee: e.type })
    if (e.type === "dragenter" || e.type === "dragover") {
      this.setState({ drag: true });
    } else if (e.type === "dragleave") {
      this.setState({ drag: false });
    }
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    // console.log({ e, files })
    this.setState({ drag: false });
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      let file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf") {
        // alert("Only pdf files allowed")
        this.setState({
          uploadError: "Only pdf files allowed",
          file: {},
        });
      } else {
        this.setState({ file: files[0], uploadError: "" });
      }
    }
  };
  handleFileChange = (e) => {
    e.preventDefault();
    // console.log(e.target.files)
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      if (file.type !== "application/pdf") {
        // alert("Only pdf files allowed")
        this.setState({
          uploadError: "Only pdf files allowed",
          file: {},
        });
      } else {
        // console.log("UUUUUUUUUUURLLLLLLRRRRRRRRRRRLLLLLL", URL.createObjectURL(e.target.files[0]))
        this.setState({
          file: e.target.files[0],
          uploadError: "",

          // pdfPrivew: true,
          // url: URL.createObjectURL(e.target.files[0])
        });
      }
    }
  };
  // onDrop = (files) => {
  //   this.setState({ files })
  // };
  getCurrentActiveStep = (scroll) => {
    if (!scroll) return;
    this.setState({ loading: true });
    let peptide = this.state.basicInfo?.showPeptide;
    let designOrder = this.state.basicInfo?.showDesignOrder;
    let pipline = this.state.basicInfo?.showDesignActivity;
    let lab = this.state.basicInfo?.showSpecimenReceived;
    let analysis = this.state.basicInfo?.showAnalysisOrder;
    // if (true) {
    //   // window.location.href = "#myDiv";
    //   // const violation = document.getElementById("#myDiv");
    //   // window.scrollTo({
    //   //   top: violation?.offsetTop,
    //   //   behavior: "smooth"
    //   // })
    //   // const id = 'myDiv';
    //   // const yOffset = 10;
    //   // const element = document.getElementById(id);
    //   // const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    //   // setTimeout(() => {

    //   this.peptideRef.current.scrollIntoView(true)
    //   //   window.scrollTo({ top: y, behavior: 'smooth' });
    //   // }, 3000)
    //   // this.peptideRef.current.scrollIntoView({
    //   //   behavior: "smooth",
    //   //   block: "center",
    //   //   inline: "start"
    //   // });
    // }
    // console.log({
    //   peptide, designOrder, pipline, lab, analysis
    // })
    if (peptide) {
      // alert("move to peptide")
      this.peptideRef.current && this.peptideRef.current.scrollIntoView(true);
    } else if (pipline) {
      // alert("moveto PipeLine section")
      this.pipelineRef.current && this.pipelineRef.current.scrollIntoView(true);
    } else if (designOrder) {
      // alert("Design")
      this.designRef.current && this.designRef.current.scrollIntoView(true);
    } else if (lab) {
      // alert("move to lab")
      this.labRef.current && this.labRef.current.scrollIntoView(true);
    } else {
      // alert("move to analysis")
      this.analysisRef.current && this.analysisRef.current.scrollIntoView(true);
    }
    this.setState({ loading: false });
  };
  filterPatientNotes = () => {
    let a = this.state.AllpatientNotes.filter((data) => {
      return parseInt(data.sectionId) == 1;
    });
    let b = this.state.AllpatientNotes.filter((data) => {
      return parseInt(data.sectionId) == 2;
    });
    let c = this.state.AllpatientNotes.filter((data) => {
      return parseInt(data.sectionId) == 3;
    });
    let d = this.state.AllpatientNotes.filter((data) => {
      return parseInt(data.sectionId) == 4;
    });
    let e = this.state.AllpatientNotes.filter((data) => {
      return parseInt(data.sectionId) == 5;
    });

    this.setState({
      Analysis_Order_Status_notes: a,
      Laboratory: b,
      Design_Order_Status: c,
      PMR_and_Final_Report: d,
      Peptide_Status: e,
    });
  };

  handleCloseNotes = () => {
    this.setState({
      add_notes: false,
      // note_title: "",
      inputTextforNotes: "",
      // assignUserId: "",
      CommentValue: "",
      sectionId: "",
      notifyToUserIds: "",
    });
    let errors = this.state.errors;
    // errors.note_title = "";
    errors.inputTextforNotes = "";
    // errors.assignUserId = "";
    errors.sectionId = "";
  };

  handleShowNotes = () => {
    this.setState(
      {
        add_notes: true,
      }
      // , this.OrganizationUserDataForNotes()
    );
  };

  handleCloseNotesEdit = () => {
    this.setState({
      edit_notes: false,
      note_title: "",
      inputTextforNotes: "",
      assignUserId: "",
      CommentValue: "",
      sectionId: "",
      notifyToUserIds: "",
      CommentValues: "",
      EditCommentId: "",
      notes_createdBy_Id: "",
    });
    let errors = this.state.errors;
    errors.note_title = "";
  };
  handleShowNotesEdit = () => {
    this.setState(
      {
        edit_notes: true,
      }
      // , this.OrganizationUserDataForNotes()
    );
  };

  handleNoteInput(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
    let errors = this.state.errors;

    switch (name) {
      case "note_title":
        errors.note_title = !value ? "Please enter title for note." : "";
        break;
      // case 'inputTextforNotes':
      //   errors.inputTextforNotes = (!value) ? "Please enter description." : '';
      //   break;

      default:
        break;
    }

    this.setState({ [name]: value }, () => { });
  }
  validateNotesData = (errors) => {
    let valid = true;
    // if (this.state.note_title == undefined || this.state.note_title == "") {
    //   errors.note_title = "Please enter title for note. "
    // }
    if (
      this.state.inputTextforNotes == undefined ||
      this.state.inputTextforNotes == ""
    ) {
      errors.inputTextforNotes = "Please enter description.";
    }
    // if (this.state.assignUserId == undefined || this.state.assignUserId == "") {
    //   errors.assignUserId = "Please select user.";
    // }
    if (this.state.sectionId == undefined || this.state.sectionId == "") {
      errors.sectionId = "Please select section.";
    }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    if (!valid) {
      this.modal_notes_scroll_.current.scrollIntoView(true);
    }
    // if (!valid) {
    //   this.scrollToTop();
    // }
    return valid;
  };

  AddNotes(e) {
    e.preventDefault();
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    // console.log(userToken.email);

    // this.setState({
    //   notes: [
    //     ...this.state.notes,
    //     {
    //       id: 1,
    //       notesTitle: this.state.note_title,
    //       notes: this.state.inputTextforNotes,
    //       assignedToUserId: this.state.assignUserId,
    //       sectionId: this.state.assignUserId

    //     }
    //   ],
    // }, this.handleCloseNotes())
    const param = this.props.match.params;
    const apiroute = window.$APIPath;
    if (this.validateNotesData(this.state.errors)) {
      let url = apiroute + "/api/BE_PatientNotes/Save";
      let data = JSON.stringify({
        patientNoteId: 0,
        patientAccessionId: parseInt(param.aid),
        // "notesTitle": this.state.note_title,
        // "notes": this.state.inputTextforNotes.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, " "),
        notes: this.state.inputTextforNotes,
        // "assignedToUserId": parseInt(this.state.assignUserId),
        sectionId: parseInt(this.state.sectionId),
        notifyToUserIds: "5",
        createdBy: parseInt(userToken.organizationUserId),
        // "createdByUserName":String(userToken.userName)
      });
      // console.log("datadata", data)
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
            toast.success("Note created successfully");
            this.handleCloseNotes();
            this.getData(param.id, param.aid);
            this.getAllNotes(param.id, param.aid);
          } else {
            this.setState({
              loading: false,
            });
            toast.error(result.data.message);
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
          toast.error(error.message);
        });
    } else {
      this.setState({ loading: false });
    }
  }

  toggleNotes(e, id) {
    this.setState({
      DeletemodalforNotes: !this.state.DeletemodalforNotes,
      deleteNotesId: id,
    });
  }
  toggleTreatementsFile = (e, id) => {
    this.setState({
      DeletemodalfortreatmentsFile: !this.state.DeletemodalfortreatmentsFile,
      deletetreatmentsFileId: id,
    });
  };
  toggleDiagonosticFile = (e, id) => {
    this.setState({
      DeletemodalforDiagnosticFile: !this.state.DeletemodalforDiagnosticFile,
      deleteDiagnosticFileId: id,
    });
  };
  togglePrescriptionFile = (e, id) => {
    this.setState({
      DeletemodalforPrescriptionFile:
        !this.state.DeletemodalforPrescriptionFile,
      deletePrescriptionFileId: id,
    });
  };
  toggleComment(e, id, patientNotesId) {
    this.setState({
      DeletemodalforNoteComment: !this.state.DeletemodalforNoteComment,
      DeleteCommentId: id,
      DeletepatientNotesId: patientNotesId,
    });
  }

  deletePatientNote(e, patientNoteId) {
    // e.preventDefault();
    const param = this.props.match.params;

    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));

    const apiroute = window.$APIPath;
    const url =
      apiroute +
      "/api/BE_PatientNotes/Delete?id=" +
      patientNoteId +
      "&userId=" +
      userToken.userId;

    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag == true) {
          this.setState({
            loading: false,
          });
          toast.success("Note deleted successfully.");
          this.getData(param.id, param.aid);
          this.getAllNotes(param.id, param.aid);
        } else {
          this.setState({
            loading: false,
          });
          toast.success(result.data.message);
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.message);
      });
  }

  EditNotes(
    e,
    patAccessId,
    notesId,
    notesTitle,
    sectionId,
    notes,
    assignedToUserId,
    createdBy
  ) {
    this.setState({ loading: true });

    const param = this.props.match.params;
    const apiroute = window.$APIPath;

    // this.OrganizationUserDataForNotes();
    let url =
      apiroute +
      "/api/BE_PatientNotes/GetById?patAccessId=" +
      patAccessId +
      "&notesId=" +
      notesId;

    // this.setState({
    //   edit_notes: true,
    //   note_title: notesTitle,
    //   inputTextforNotes: notes,
    //   assignUserId: assignedToUserId,
    //   sectionId: sectionId,
    //   notifyToUserIds: "",

    // })

    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((res) => {
        // console.log(res)
        if (res.data.flag) {
          this.setState({
            edit_notes: true,
            patientNoteId: res.data.outdata.outdata.patientNoteId,
            // note_title: res.data.outdata.outdata.notesTitle,
            // note_title_before_Edit: res.data.outdata.outdata.notesTitle,
            inputTextforNotes: res.data.outdata.outdata.notes,
            inputTextforNotes_before_Edit: res.data.outdata.outdata.notes,
            // assignUserId: res.data.outdata.outdata.assignedToUserId,
            sectionId: res.data.outdata.outdata.sectionId,
            notifyToUserIds: res.data.outdata.outdata.notifyToUserIds,
            // notes_createdBy_Id:res.data.outdata.outdata.createdBy
            notes_createdBy_Id: createdBy,
            loading: false,
          });
          // this.getComments(this.state.patientNoteId)
          // console.log("res.data", res.data.outdata.outdata.assignedToUserId)
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        // console.log(err)
        this.setState({ loading: false });
      });
  }

  Editnote(e) {
    e.preventDefault();
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    const apiroute = window.$APIPath;
    const param = this.props.match.params;

    let url = apiroute + "/api/BE_PatientNotes/Update";
    let data = JSON.stringify({
      patientNoteId: this.state.patientNoteId,
      // "patientAccessionId": parseInt(param.aid),
      notesTitle: this.state.note_title,
      // "notes": this.state.inputTextforNotes.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, " "),
      notes: this.state.inputTextforNotes,
      // "assignedToUserId": parseInt(this.state.assignUserId),
      // "sectionId": parseInt(this.state.sectionId),
      notifyToUserIds: "5",
      updatedBy: parseInt(userToken.organizationUserId),
    });

    // console.log("EditData", data)
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
            notes_createdBy_Id: "",
          });

          toast.success("Note updated successfully.");
          this.handleCloseNotesEdit();

          this.getData(param.id, param.aid);
          this.getAllNotes(param.id, param.aid);

          // this.props.history.push("/patients/list");
        } else {
          this.setState({
            loading: false,
          });
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.message);
      });
  }

  AddNoteComment(e) {
    e.preventDefault();
    // this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));

    // this.setState({
    //   notes: [
    //     ...this.state.notes,
    //     {
    //       id: 1,
    //       notesTitle: this.state.note_title,
    //       notes: this.state.inputTextforNotes,
    //       assignedToUserId: this.state.assignUserId,
    //       sectionId: this.state.assignUserId

    //     }
    //   ],
    // }, this.handleCloseNotes())
    const param = this.props.match.params;
    const apiroute = window.$APIPath;

    let url = apiroute + "/api/BE_Comments/Save";
    let data = JSON.stringify({
      commentId: 0,
      // "patientAccessionId": parseInt(param.aid),
      // "notesTitle": this.state.note_title,
      // "notes": this.state.inputTextforNotes,
      // "assignedToUserId": parseInt(this.state.assignUserId),
      // "sectionId": parseInt(this.state.sectionId),
      // "notifyToUserIds": "5",
      createdBy: parseInt(userToken.organizationUserId),
      patientNotesId: this.state.patientNoteId,
      commentText: this.state.commentText,
      // "createdByUserName":String(userToken.userName)
    });
    // console.log("datadata", data)
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
            commentText: "",
            IsReply: false,
          });
          this.getComments(result.data.outdata.patientNotesId);
          toast.success(result.data.message);

          // this.handleCloseNotes()

          // this.getData(param.id, param.aid);
          // this.getAllNotes(param.id, param.aid);

          // this.props.history.push("/patients/list");
        } else {
          this.setState({
            loading: false,
          });
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.message);
      });
  }

  getComments = (notesId) => {
    const apiroute = window.$APIPath;
    const url =
      // apiroute + "/api/BE_PatientNotes/GetAll?id=" + id + "&aid=" + aid + "";
      apiroute + "/api/BE_Comments/GetById?notesId=" + notesId;
    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState({
            showComments: result.data.outdata.outdata,
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
  };

  EditComment(e, commentId, patientNotesId) {
    e.preventDefault();
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    const apiroute = window.$APIPath;
    const param = this.props.match.params;

    let url = apiroute + "/api/BE_Comments/Update";
    let data = JSON.stringify({
      commentId: commentId,
      patientNotesId: parseInt(patientNotesId),
      commentText: this.state.EditcommentText,
      updatedBy: parseInt(userToken.organizationUserId),
    });

    // console.log("EditData", data)
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
          this.CancelEditComments();

          toast.success("Comment updated successfully.");
          // this.handleCloseNotesEdit()
          // this.getData(param.id, param.aid);
          this.getComments(parseInt(patientNotesId));
          // this.getAllNotes(param.id, param.aid);

          // this.props.history.push("/patients/list");
        } else {
          this.setState({
            loading: false,
          });
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.message);
      });
  }

  DeleteComment(e, commentId, patientNotesId) {
    e.preventDefault();
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    const apiroute = window.$APIPath;
    const param = this.props.match.params;

    let url =
      apiroute +
      "/api/BE_Comments/Delete?id=" +
      commentId +
      "&userId=" +
      patientNotesId;
    // let data = JSON.stringify({
    //   "commentId": commentId,
    //   "patientNotesId": parseInt(patientNotesId),
    //   "commentText": commentText,
    //   "updatedBy": parseInt(userToken.userId)
    // })

    // console.log("EditData", data)
    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState({
            redirect: true,
            loading: false,
            DeletemodalforNoteComment: false,
            DeleteCommentId: "",
            DeletepatientNotesId: "",
          });

          toast.success("Comment deleted successfully.");
          // this.handleCloseNotesEdit()
          // this.getData(param.id, param.aid);
          this.getComments(parseInt(patientNotesId));
          // this.getAllNotes(param.id, param.aid);

          // this.props.history.push("/patients/list");
        } else {
          this.setState({
            loading: false,
          });
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.message);
      });
  }

  OrganizationUserDataForNotes(pageNo) {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId == null ? 0 : userToken.userId;

    const apiroute = window.$APIPath;
    const url = apiroute + "/api/BE_OrganizationUser/GetAllPaging";

    let data = JSON.stringify({
      isDeleted: true,
      searchString: "",
      Id: userId,
      pageNo: 0,
      totalNo: window.$TotalRecord,
    });

    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          //console.log(result.data.outdata);
          var rdata = result.data.outdata;
          //var finaldata = rdata.filter(organizationuser => organizationuser.organizationuserName !== "SuperAdmin");
          var finaldata = rdata;
          this.setState({
            pagesCount: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            organizationusersforNotes: finaldata,
            loading: false,
          });
          // console.log(this.state.organizationusersforNotes, "jhjhjhjhjhjjhjhjhjh")

          this.temp();
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ authError: true, error: error, loading: false });
      });
  }
  getFeedItems = (queryText) => {
    // console.log(this.state.organizationusersforNotes, "gggggggggggggggggggggggggggg")
    let organs = this.state.organizationusersforNotes;
    let dataorg = organs.map((data) => {
      return {
        id: `@${data.fullName}`,
        userId: data.userId,
        name: data.roleName,
        link: "",
      };
    });
    // console.log([dataorg], "jhhhhhhhhhhhhhhhhhhhh")

    const items = [...dataorg];

    // const items = [
    //   { id: '@abc', userId: '1', name: 'Barney Stinson', link: 'https://www.imdb.com/title/tt0460649/characters/nm0000439' },
    //   { id: '@test', userId: '2', name: 'Lily Aldrin', link: 'https://www.imdb.com/title/tt0460649/characters/nm0004989' },
    //   { id: '@practitioner', userId: '4', name: 'Marshall Eriksen', link: 'https://www.imdb.com/title/tt0460649/characters/nm0781981' },
    //   { id: '@lab', userId: '3', name: 'Marry Ann Lewis', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
    //   { id: '@report', userId: '5', name: 'Robin Scherbatsky', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
    //   { id: '@something', userId: '6', name: 'Ted Mosby', link: 'https://www.imdb.com/title/tt0460649/characters/nm1102140' }
    // ];
    // As an example of an asynchronous action, return a promise
    // that resolves after a 100ms timeout.
    // This can be a server request or any sort of delayed action.
    return new Promise((resolve) => {
      // alert(queryText)
      setTimeout(() => {
        const itemsToDisplay = items
          // Filter out the full list of all items to only those matching the query text.
          .filter(isItemMatching)
          // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
          .slice(0, 10);
        // console.log({ itemsToDisplay })
        resolve(itemsToDisplay);
      }, 100);
    });

    // Filtering function - it uses the `name` and `username` properties of an item to find a match.
    function isItemMatching(item) {
      // Make the search case-insensitive.
      const searchString = queryText.toLowerCase();

      // Include an item in the search results if the name or username includes the current user input.
      return (
        item.name.toLowerCase().includes(searchString) ||
        item.id.toLowerCase().includes(searchString)
      );
    }
  };

  handleInputChangeForUser(event) {
    let target = event.target;
    let value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
    let errors = this.state.errors;
    switch (name) {
      case "assignUserId":
        errors.assignUserId = !value ? "Please select user." : "";
        break;
      case "sectionId":
        errors.sectionId = !value ? "Please select section." : "";
        break;

      default:
        break;
    }
    this.setState({ [name]: value }, () => { });
  }
  ReplyFun = () => {
    this.setState({
      IsReply: !this.state.IsReply,
    });
  };
  PostComments = () => {
    this.setState({
      CommentValues: this.state.CommentValue,
      IsReply: false,
      CommentValue: "",
    });
  };
  CancelComments = () => {
    this.setState({
      IsReply: false,
      CommentValue: "",
      commentText: "",
    });
  };
  CancelEditComments = () => {
    this.setState({
      EditCommentId: "",
    });
  };
  handleInputChangeComments(event) {
    let target = event.target;
    let value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
    // switch(name){
    //   case 'EditcommentText':
    //     errors.EditcommentText = (!value) ? "Please select section." : '';
    //     break;

    //   default:
    //     break;
    // }
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
  isDateDesabledForDesignOrderStatus = (name) => {
    try {
      return !this.state.designOrderStatus[name].checked;
    } catch (error) {
      return true;
    }
  };
  isCheckedForDesignOrderStatus = (name) => {
    try {
      // console.log({ name, con: this.state.designOrderStatus[name].checked })
      return this.state.designOrderStatus[name].checked;
    } catch (error) {
      return false;
    }
  };
  getDateForDesignOrderStatus = (name) => {
    try {
      return this.state.designOrderStatus[name].date || "";
    } catch (err) {
      return "";
    }
  };
  handleDesignOrderStatusChange = (name) => {
    // alert(name);
    let clone = _.cloneDeep(this.state.designOrderStatus);
    if (name in clone) {
      clone[name] = {
        ...clone[name],
        checked: !clone[name].checked,
        // date: "",
      };
    } else {
      clone[name] = {
        checked: true,
        // date: date,
      };
    }
    this.setState({
      designOrderStatus: clone,
    });
  };
  handleDesignOrderStatusDateChange = (name, date = "") => {
    // alert(name);

    let AdjusteddateValue = new Date(date || null); //(new Date(date.getTime() - (date.getTimezoneOffset() * 60000)));
    AdjusteddateValue.setHours(0, 0, 0, 0);
    let clone = _.cloneDeep(this.state.designOrderStatus);
    if (name in clone) {
      clone[name] = {
        ...clone[name],
        // checked: !clone[name].checked,
        date: AdjusteddateValue,
      };
    }
    this.setState({
      designOrderStatus: clone,
    });
  };
  toggleExpander = (e) => {
    const hiddenElement = e.currentTarget.nextSibling;
    hiddenElement.className.indexOf("collapse show") > -1
      ? hiddenElement.classList.remove("show")
      : hiddenElement.classList.add("show");
  };
  previewPdfToggle(file) {
    this.setState({
      pdfPrivew: !this.state.pdfPrivew,
      url: window.$FileUrl + file,
    });
  }

  sendPmrToClinic = () => {
    return new Promise(async (resolve) => {
      try {
        const apiroute = window.$APIPath;
        const url = apiroute + "/api/BE_DesignOrder/CreateDesignOrder";
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }

        let data = {
          patientId: Number(this.state.patientId),
          patientAccessionId: Number(this.state.PatientAccessionId),
          createdBy: uid,
          statusUpdatedDate:
            this.state.designOrderStatus.clinicSentPmrToPharmacy.date,
        };

        await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        resolve(true);
      } catch (error) {
        toast.error("Error while updating PMR Sent to Clinic");
        resolve(true);
      }
    });
  };
  submitDisgnOrderStatus = (isUpdate) => {
    return new Promise(async (resolve) => {
      try {
        const apiroute = window.$APIPath;

        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        let data = {};
        let url = "";
        let x = new Date(
          this.state.paymentType === "y"
            ? this.state.analysisOrderStatus.paymentRecived.date
            : this.state.designOrderStatus.orderSubmited.date
        );
        let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
        let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
        x.setHours(hoursDiff);
        x.setMinutes(minutesDiff);
        if (isUpdate) {
          url = apiroute + "/api/BE_OrderHistory/UpdateOrderHistory";
          data = {
            orderHistoryId: Number(
              this.state.basicInfo?.designOrderStatus?.orderHistoryId
            ),
            orderDate: x,
            updatedBy: uid,
            IsFullPayment: this.state.paymentType === "y" ? true : false,
          };
        } else {
          url = apiroute + "/api/BE_OrderHistory/CreateDesignOrderHistory";

          data = {
            orderHistoryId: 0, // Number(this.state.basicInfo?.analysisOrderStatus?.orderHistoryId),
            diseaseCategoryId: Number(this.state.diseaseCategoryId),
            orderFlag: "",
            orderDate: x,
            patientId: Number(this.state.patientId),
            patientAccessionId: Number(this.state.PatientAccessionId),
            vendorId: null, //Number(this.state.basicInfo?.analysisOrderStatus?.vendorId),
            vendorType: "L", //this.state.basicInfo?.analysisOrderStatus?.vendorType,
            paymentMilestoneId: 0, // Number(this.state.basicInfo?.analysisOrderStatus?.paymentMilestoneId),
            createdDate: new Date(),
            createdBy: uid,
            IsFullPayment: this.state.paymentType === "y" ? true : false,
          };
        }
        // let data = {
        //   patientId: Number(this.state.patientId),
        //   patientAccessionId: Number(this.state.PatientAccessionId),
        //   createdBy: uid,
        //   statusUpdatedDate:
        //     this.state.designOrderStatus.clinicSentPmrToPharmacy.date,
        // };

        let res = await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        if (res.data.flag) {
          if (this.state.paymentType === "y") {
            // await this.poReceived(res.data?.outdata.orderHistoryId);
          } else {
            toast.success(res.data.message);
          }
          // toast.success("Order submitted successfully")
        } else {
          toast.error(res.data.message);
        }
        resolve(true);
      } catch (error) {
        toast.error("Error while Submitting order");
        resolve(true);
      }
    });
  };

  applySameDateForSelectedSpecimenCollections = () => {
    this.setState({ loading: true });
    let clone = _.cloneDeep(this.state.specimentCollections);
    let date = clone[0].sampleDate;
    clone = clone.map((ele) => {
      return {
        ...ele,
        sampleDate: date,
      };
    });
    this.setState({
      loading: false,
      specimentCollections: clone,
    });
  };
  /**
   * @param {Number} labId
   * @param {("selectedLabs"|"selectedLabsForBucket")} labType
   */
  isSubmitDisabledForSampleLab = (labId, labType) => {
    try {
      const allLabs = this.state[labType];
      let submittedSamples = [];

      if (labType === "selectedLabsForBucket") {
        // labReceivedResultStatus
        submittedSamples = this?.state?.basicInfo?.labReceivedResultStatus;
        submittedSamples = submittedSamples
          .filter?.((ele) => {
            return ele.sampleTypeResultStatus && ele.ngsLaboratoryId == labId;
          })
          ?.map?.((ele) => {
            return ele.ngsLaboratoryPatientActivityId;
          });
      } else {
        submittedSamples = this?.state?.basicInfo?.specimenReceivedStatus;
        submittedSamples = submittedSamples
          .filter?.((ele) => {
            return ele.sampleTypeReceived && ele.ngsLaboratoryId == labId;
          })
          ?.map?.((ele) => {
            return ele.ngsLaboratoryPatientActivityId;
          });
      }

      // debugger;
      let sampleIds = Object.keys(allLabs[labId]).filter(
        (ele) => !submittedSamples.includes(Number(ele))
      );

      // debugger;
      let isAllSamplesFalsy = sampleIds.every((sampleId) => {
        let sample = allLabs[labId][sampleId];
        // debugger;
        return (
          sample.checked == false && sample.date == "" && sample.isNa == false
        );
      });

      // if (labType == 'selectedLabsForBucket') {
      //   debugger;
      // }
      // console.log({ isAllSamplesFalsy, labId })
      if (isAllSamplesFalsy) return isAllSamplesFalsy;
      else {
        return (
          sampleIds.filter((sampleId) => {
            let sample = allLabs[labId][sampleId];
            return (
              (sample.checked && sample.date === "") ||
              (!sample.checked && sample.date !== "")
            );
          }).length > 0
        );
      }
    } catch (error) {
      return false;
    }
  };
  isAllSamplesSubmittedForLab = (labId) => {
    try {
      let allSamples = this?.state.basicInfo?.specimenReceivedStatus;
      let filteredSamples = allSamples.filter(
        (ele) => ele.ngsLaboratoryId == labId
      );
      let submitedSamples = filteredSamples.filter(
        (ele) => ele.sampleTypeReceived
      );
      return submitedSamples.length === filteredSamples.length;
    } catch (error) {
      return false;
    }
  };

  getPipeLineStatus = () => {
    let designactivity = this.state.basicInfo?.designActivity;
    let status = String(designactivity?.verifyStatus).toLowerCase();
    let started = status == "started";
    let completed = status == "completed";
    let failed = status == "failed";
    let isWarning = status == "warning";
    let isQueued = designactivity?.isPipelineQueued;
    let isStarted = designactivity?.isPipelineStarted;
    let runningMessage = designactivity?.runningMessage;
    let designStopped = designactivity?.designStopped;
    let queueMessage = designactivity?.queueMessage;

    let Pstarted = designactivity?.designStarted;
    // let Pfailed = designactivity?.designFailed
    // let Pcompleted = designactivity?.designCompleted
    // let PisWarning = designactivity?.designWarning
    // let currentStatus = designactivity?.currentStatus
    // let Preason = designactivity?.reason || ""
    let varifyReason = designactivity?.verifyReason || "";
    if (failed) {
      return (
        <div className="">
          <br />
          {/* <p className="px-lg-2 text-bold" style={{ color: "red", fontWeight: "bold" }}>
          <span>
            <img className="mr-3"
              src={error_icon} style={{ height: "20px", width: "20px" }} alt="" />
          </span>
          Something went wrong, please see the reason.</p>
        <p className="px-lg-2 text-bold" >
          <a style={{ color: "black" }} href={varifyReason?.slice?.(varifyReason?.search("http"))} target="_blank">
            {varifyReason}
          
          </a>
        </p> */}
          <p className="px-lg-2 font-weight-bold text-danger">
            <span
              className="mx-lg-2"
              data-toggle="tooltip"
              data-placement="top"
              title="Pipeline is failed."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-info-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </span>
            {varifyReason?.match(/\bhttps?:\/\/\S+/gi) == null ? (
              varifyReason
            ) : (
              <a
                className="text-danger"
                href={
                  varifyReason?.match(/\bhttps?:\/\/\S+/gi) == null
                    ? "#"
                    : varifyReason?.match(/\bhttps?:\/\/\S+/gi)[0]
                }
                target="_blank"
              >
                {varifyReason}
              </a>
            )}
          </p>
        </div>
      );
    }
    if (completed) {
      return (
        <div>
          <br />
          {/* <p className="px-lg-2  text-bold" style={{ color: "green", fontWeight: "bold" }}>
          <span>
            <img className="mr-3"
              src={success_icon} style={{ height: "20px", width: "20px" }} alt="" />
          </span>
          Data Verified successfully.
        </p> */}
          <p
            className="px-lg-2  text-bold"
            style={{ color: "green", fontWeight: "bold" }}
          >
            {/* <span>
                        <img className="mr-3"
                            src={success_icon} style={{ height: "20px", width: "20px" }} alt="" />
                    </span> */}
            <span
              className="mx-lg-2"
              data-toggle="tooltip"
              data-placement="top"
              title="Pipeline is completed successfully."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-info-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </span>
            Data verified successfully.
          </p>
        </div>
      );
    }
    if (started && isStarted) {
      return (
        <>
          <p
            className="px-lg-5 text-bold d-flex align-items-center"
            style={{ color: "orange", fontWeight: "bold" }}
          >
            Verifying Data
            <div class="dot-puls mb-2 ml-1" role="status"></div>
          </p>
        </>
      );
      {
        /* <div className='dot-puls'></div></> */
      }
    }
    if (started && !isQueued) {
      return <>
        <p
          style={{
            display: "flex",
            alignItems: "center",
            margin: 0,
          }}
        >
          {runningMessage}
        </p>
      </>
    }
    if (isWarning) {
      // return <p className="px-lg-5 m-2 text-bold" style={{ color: "orange", fontWeight: "bold" }}>{designactivity?.verifyReason}</p>
      return (
        <p
          className="px-lg-2 m-2 text-bold"
          style={{ color: "orange", fontWeight: "bold" }}
        >
          <span
            className="mx-lg-2"
            data-toggle="tooltip"
            data-placement="top"
            title="There is some warning occured in pipeline."
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-info-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </span>
          {designactivity?.verifyReason?.match(/\bhttps?:\/\/\S+/gi) == null ? (
            designactivity?.verifyReason
          ) : (
            // <a
            //     className="ml-1 "
            //     target="_blank" href={designactivity?.verifyReason?.slice?.(designactivity?.verifyReason?.search("http"))}
            // >

            //     {designactivity?.verifyReason}

            // </a>
            <a
              className="ml-1 text-warning"
              target="_blank"
              href={
                designactivity?.verifyReason?.match(/\bhttps?:\/\/\S+/gi) ==
                  null
                  ? "#"
                  : designactivity?.verifyReason?.match(/\bhttps?:\/\/\S+/gi)[0]
              }
            >
              {designactivity?.verifyReason}
            </a>
          )}
        </p>
      );
    }
    if (designStopped && !isQueued) {
      return (
        <>
          <p
            className="px-lg-5 text-bold d-flex align-items-center"
            style={{ color: "red", fontWeight: "bold" }}
          >
            {runningMessage}
            <button
              className="btn-success btn"
              style={{ height: "40px", position: "absolute", right: "27px" }}
              onClick={() => {
                this.refreshPipelineCall();
                // this.updateDataAndRefreshPage(this.getData)
              }}
            >
              Refresh
            </button>
          </p>{" "}
          <br />{" "}
        </>
      );
    }
    if (Pstarted && isQueued) {
      return (
        <>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
            }}
          >
            {queueMessage}
          </p>
        </>
      );
    }
    // if (Pfailed) {

    //   return (<div className="m-2">
    //     <br />
    //     <p className="px-lg-3 text-bold" style={{ color: "red", fontWeight: "bold" }}>
    //       <span>
    //         <img className="mr-2"
    //           src={error_icon} style={{ height: "20px", width: "20px", marginTop: "-5px" }} alt="" />
    //       </span>
    //       Pipeline Failed, please see the reason.</p>
    //     <a className="p-2 m-2 " href={Preason?.slice?.(Preason?.search("http"))}  >
    //       {Preason}
    //     </a>
    //   </div>
    //   )
    // }
    // if (Pcompleted) {
    //   return <div>
    //     <br />
    //     <p className="px-lg-2  text-bold" style={{ color: "green", fontWeight: "bold" }}>
    //       <span>
    //         <img className="mr-3"
    //           src={success_icon} style={{ height: "20px", width: "20px" }} alt="" />
    //       </span>
    //       Data processed successfully.
    //     </p>
    //     <p className="pl-lg-5 text-bold" style={{ color: "green", fontWeight: "bold" }}>Please go for further steps.</p>
    //   </div>
    // }
    // if (Pstarted) {
    //   return (<><p className="px-lg-5 text-bold d-flex align-items-center" style={{ color: "orange", fontWeight: "bold" }}>
    //     Processing Data

    //     <div class="dot-puls mb-2 ml-1" role="status">
    //     </div></p></>)
    //   {/* <div className='dot-puls'></div></> */ }
    // }
    // if (PisWarning) {
    //   return <p className="px-lg-5 text-bold" style={{ color: "orange", fontWeight: "bold" }}>Here is some Warning to Process Data
    //     <br />
    //     {Preason}</p>

    // }
  };

  getProcessStatus = () => {
    let designactivity = this.state.basicInfo?.designActivity;

    let Pstarted = designactivity?.designStarted;
    let Pfailed = designactivity?.designFailed;
    let Pcompleted = designactivity?.designCompleted;
    let PisWarning = designactivity?.designWarning;
    let currentStatus = designactivity?.currentStatus;
    let Preason = designactivity?.reason || "";
    let varifyReason = designactivity?.verifyReason || "";
    let isQueued = designactivity?.isPipelineQueued;
    let queueMessage = designactivity?.queueMessage || "";
    let cancled = designactivity?.designCancelled;
    let cancelledBy = designactivity?.designCancelledByUser;
    let runningmsg = designactivity?.runningMessage;
    let designStopped = designactivity?.designStopped;
    let stoppedBy = designactivity?.designStoppedByUser;
    if (Pfailed) {
      return (
        <div className="m-2">
          <br />
          <p className="px-lg-2 " style={{ color: "red", fontWeight: "bold" }}>
            {/* <span>
                        <img className="mr-2"
                            src={error_icon} style={{ height: "20px", width: "20px", marginTop: "-5px" }} alt="" />
                    </span> */}
            {/* Process Data Failed? */}
            <span
              className="mx-lg-2"
              data-toggle="tooltip"
              data-placement="top"
              title="Pipeline is failed."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-info-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </span>

            {Preason?.match(/\bhttps?:\/\/\S+/gi) == null ? (
              Preason
            ) : (
              <a
                className="p-2 m-2 text-danger"
                target="_blank"
                href={
                  Preason?.match(/\bhttps?:\/\/\S+/gi) == null
                    ? "#"
                    : Preason?.match(/\bhttps?:\/\/\S+/gi)[0]
                }
              >
                {Preason}
              </a>
            )}
          </p>
        </div>
      );
    } else if (Pcompleted) {
      return (
        <div>
          <br />
          <p
            className="px-lg-2  text-bold"
            style={{ color: "green", fontWeight: "bold" }}
          >
            <span
              className="mx-lg-2"
              data-toggle="tooltip"
              data-placement="top"
              title="Pipeline is completed successfully."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-info-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </span>
            {/* <span>
                        <img className="mr-3"
                            src={success_icon} style={{ height: "20px", width: "20px" }} alt="" />
                    </span> */}
            Data processed successfully.
          </p>
        </div>
      );
    } else if (PisWarning) {
      return (
        <p className="px-lg-2" style={{ color: "orange", fontWeight: "bold" }}>
          <br />
          <span
            className="mx-lg-2"
            data-toggle="tooltip"
            data-placement="top"
            title="There is some warning occured in pipeline."
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-info-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </span>
          {/* Here is some Warning to Process Data */}
          {Preason?.match(/\bhttps?:\/\/\S+/gi) == null ? (
            Preason
          ) : (
            <a
              className="ml-1 text-warning"
              target="_blank"
              href={
                Preason?.match(/\bhttps?:\/\/\S+/gi) == null
                  ? "#"
                  : Preason?.match(/\bhttps?:\/\/\S+/gi)[0]
              }
            >
              {Preason}
            </a>
          )}
        </p>
      );
    } else if (Pstarted && isQueued) {
      return (
        <>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
            }}
          >
            {queueMessage}
          </p>
        </>
      );
    } else if (Pstarted && !Pcompleted && !isQueued) {
      return (
        <>
          <p
            className="px-lg-5 text-bold d-flex align-items-center"
            style={{ color: "orange", fontWeight: "bold" }}
          >
            Processing design Data
            <div class="dot-puls mb-2 ml-1" role="status"></div>
          </p>{" "}
          <br />{" "}
        </>
      );
      {
        /* <div className='dot-puls'></div></> */
      }
    } else if (cancled && !isQueued) {
      return (
        <>
          <p
            className="px-lg-5 text-bold d-flex align-items-center"
            style={{ color: "red", fontWeight: "bold" }}
          >
            {runningmsg}
            <button
              className="btn-success btn"
              style={{ height: "40px", position: "absolute", right: "27px" }}
              onClick={() => {
                this.refreshPipelineCall();
                // this.updateDataAndRefreshPage(this.getData)
              }}
            >
              Refresh
            </button>
          </p>{" "}
          <br />{" "}
        </>
      );
    } else if (designStopped && !isQueued) {
      return (
        <>
          <p
            className="px-lg-5 text-bold d-flex align-items-center"
            style={{ color: "red", fontWeight: "bold" }}
          >
            {runningmsg}
            <button
              className="btn-success btn"
              style={{ height: "40px", position: "absolute", right: "27px" }}
              onClick={() => {
                this.refreshPipelineCall();
                // this.updateDataAndRefreshPage(this.getData)
              }}
            >
              Refresh
            </button>
          </p>{" "}
          <br />{" "}
        </>
      );
    }
  };

  isProcessDataBtnDiseabled = () => {
    try {
      let designactivity = this.state.basicInfo?.designActivity;
      let status = String(designactivity?.verifyStatus).toLowerCase();
      if (status == "started") return true;
      if (status == "completed") return false;
      return true;
    } catch (error) {
      return true;
    }
  };
  isAllSamplesUploadedToBucket = (labId) => {
    try {
      let allSamples = this?.state.basicInfo?.labReceivedResultStatus;
      let filteredSamples = allSamples.filter(
        (ele) => ele.ngsLaboratoryId == labId
      );
      let submitedSamples = filteredSamples.filter(
        (ele) => ele.sampleTypeResultStatus
      );
      return submitedSamples.length === filteredSamples.length;
    } catch (error) {
      return false;
    }
  };
  getNotesForVerifyPMR = () => {
    try {
      let isRevised = this.state.isRevised;
      if (isRevised) {
        return this.state.notes;
      } else {
        let pmrIndex = this.state.PMRINDEX;
        return this.state.patientPMRReports[pmrIndex].notes;
      }
    } catch (error) {
      return "";
    }
  };
  isSampleUploadedToBucket = (labId, collectionId) => {
    try {
      let samples = this.state.basicInfo?.labReceivedResultStatus.findIndex(
        (ele) => {
          return (
            ele.ngsLaboratoryId == labId &&
            ele.ngsLaboratoryPatientActivityId == collectionId &&
            ele.sampleTypeResultStatus
          );
        }
      );
      return samples >= 0;
    } catch (error) {
      return false;
    }
  };
  isDesignOrderStatusDisabled = (name) => {
    try {
      return this.state.basicInfo?.designOrderStatus[name];
    } catch (error) {
      return false;
    }
  };
  getSpecimendateValue = (name) => {
    try {
      let analysisOrderStatus = this.state.analysisOrderStatus;
      let basicAnalysisOrderStatus = this.state.basicInfo.analysisOrderStatus;
      switch (name) {
        case "orderSubmitted": {
          if (analysisOrderStatus.orderSubmitted.date)
            return analysisOrderStatus.orderSubmitted.date;
          else {
            if (basicAnalysisOrderStatus.orderSubmitedDate)
              return new Date(basicAnalysisOrderStatus.orderSubmitedDate);
            else return "";
          }

          break;
        }

        default:
          break;
      }
    } catch (error) {
      return "";
    }
  };
  getspecimenCheckboxValue = (name) => {
    try {
      switch (name) {
        case "orderSubmitted": {
          try {
            if (this.state.analysisOrderStatus.orderSubmitted.checked)
              if (
                this.state.basicInfo.analysisOrderStatus?.orderSubmited === true
              )
                return true;
          } catch (error) { }
        }

        default:
          break;
      }
    } catch (error) {
      return false;
    }
  };
  spliceFromSash = (data) => {
    let a = String(data)?.lastIndexOf("/") + 1;
    return String(data).slice(a, String(data)?.length);
  };

  isDateDisabledForSpecimenCollection = () => { };

  // submitSpecimenCollections = async () => {
  //   return new Promise(async (resolve) => {
  //     try {
  //       let uid = 0;
  //       var userToken = JSON.parse(localStorage.getItem("AUserToken"));
  //       if (userToken != null) {
  //         uid = userToken.userId == null ? 0 : userToken.userId;
  //       }
  //       console.log({ userToken: userToken.userId });

  //       // alert(`1`);
  //       let data = {
  //         patientId: this.state.patientId,
  //         createdByFlag: "A",
  //         createdBy: uid,
  //         patientAccessionId: Number(this?.state?.PatientAccessionId) || 0,
  //         patientSample: this.state.specimentCollections.map((collection) => {
  //           let x = new Date(collection.sampleDate)
  //           let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
  //           let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
  //           x.setHours(hoursDiff);
  //           x.setMinutes(minutesDiff);
  //           return {
  //             sampleTypeId: collection.sampleTypeId,
  //             sampleType: collection.sampleTypeName,
  //             sampleDate: x,
  //           };
  //         }),
  //       };
  //       // debugger;
  //       const apiroute = window.$APIPath;
  //       console.log("Data::", data)
  //       let response = await axiosInstance.post(apiroute + "/api/BE_PatientSample/Save", data, {
  //         headers: {
  //           "Content-Type": "application/json; charset=utf-8",
  //         },
  //       });
  //       if (response.data?.flag) toast.success(response.data?.message); else toast.error(response.data?.message)
  //       // .then((res) => {
  //       //   console.log(res);
  //       //   toast.success(res?.message);
  //       // })
  //       // .catch((err) => {
  //       //   toast.error(err);
  //       //   console.log();
  //       // });
  //       resolve(true);
  //     } catch (error) {
  //       console.log(error);
  //       resolve(true);
  //     }
  //   });
  // };
  isAnalysisOrdeDisabled = () => {
    try {
      let cheked = this.state.analysisOrderStatus.orderSubmitted.checked;
      let orderSubmited =
        this.state.basicInfo.analysisOrderStatus?.orderSubmited;
      let posubmited = this.state.basicInfo.analysisOrderStatus?.poReceived;
      // if not cheked then disable
      // alert(`not cheked !:${!cheked} and ${cheked}`)
      if (!cheked) {
        return true;
      }
      if (!posubmited) {
        // alert(`chk ${cheked} , os: ${orderSubmited} , !os: ${!orderSubmited} con : ${cheked || orderSubmited}`)
        return cheked && posubmited;
      } else return cheked || orderSubmited;
    } catch (error) { }
  };
  isAnlysisPoDisabled = () => {
    let posubmited = this.state.basicInfo.analysisOrderStatus?.poReceived;
    let checked = this.state.analysisOrderStatus.poReceived.checked;
    let invoiceSent = this.state.basicInfo.analysisOrderStatus?.invoiceSend;
    if (!checked) {
      return true;
    }
    if (!invoiceSent) {
      return checked && invoiceSent;
    } else {
      return checked || posubmited;
    }
  };
  isAnalysisInvoiceDisabled = () => {
    let checked = this.state.analysisOrderStatus.invoiceSent.checked;
    let invoiceSent = this.state.basicInfo.analysisOrderStatus?.invoiceSend;
    let paymentSend = this.state.basicInfo.analysisOrderStatus?.paymentReceived;

    if (!checked) {
      return true;
    }
    if (!paymentSend) {
      return checked && paymentSend;
    } else {
      return checked || invoiceSent;
    }
  };
  isDesignOrderPoDisabled = () => {
    let orderSubmited = this.state.basicInfo?.designOrderStatus?.orderSubmited;
    let checked = this.isCheckedForDesignOrderStatus("poReceived");
    let invoiceSentToClinic =
      this.state.basicInfo?.designOrderStatus?.invoiceSend;
    if (!checked) {
      return true;
    }
    if (!invoiceSentToClinic) {
      return checked && invoiceSentToClinic;
    } else {
      return checked || orderSubmited;
    }
  };
  isDesignOrderSubmittedDisabled = () => {
    let orderSubmited = this.state.basicInfo?.designOrderStatus?.orderSubmited;
    let checked = this.isCheckedForDesignOrderStatus("orderSubmited");
    // alert(`${checked} ${orderSubmited} chk||oderSubmit ${checked || orderSubmited} checked && poReceived ${checked && poReceived}`)
    let poReceived = this.state.basicInfo?.designOrderStatus?.poReceived;
    // console.log({
    //   checked,
    //   orderSubmited,
    //   con: checked || orderSubmited,
    //   rev: !checked
    // })
    if (!checked) {
      return true;
    }
    if (!poReceived) {
      return checked && poReceived;
    } else {
      return checked || orderSubmited;
    }
  };
  isDesignOrderInvoiceDisabled = () => {
    let poSubmited = this.state.basicInfo?.designOrderStatus?.poReceived;
    let checked = this.isCheckedForDesignOrderStatus("invoice");
    let paymentSent = this.state.basicInfo?.designOrderStatus?.paymentReceived;
    if (!checked) {
      return true;
    }
    if (!paymentSent) {
      return checked && paymentSent;
    } else {
      return checked || poSubmited;
    }
  };

  isPeptideDisabledForPMR = () => {
    let checked = this.isPeptidesCheked("pmrSentToClinic");
    let clinicsentToPhr =
      this.state.basicInfo?.peptideStatus?.finalReportSentToCC;
    if (!clinicsentToPhr) {
      return checked && clinicsentToPhr;
    } else {
      return checked;
    }
  };
  isPeptideDisabledForClinic = () => {
    let checked = this.isPeptidesCheked("clinicSentPmrToPharmacy");
    let pmrSendToCilnic = this.state.basicInfo?.peptideStatus?.pmrSendToCilnic;
    let peptidesReceivedByClinic =
      this.state.basicInfo?.peptideStatus?.pmrSentToProvider;
    if (!checked) {
      return true;
    }
    if (!peptidesReceivedByClinic) {
      return checked && peptidesReceivedByClinic;
    } else {
      return checked || pmrSendToCilnic;
    }
  };
  isPeptideDisabledForrecievedByClinic = () => {
    let cheked = this.isPeptidesCheked("peptidesReceivedByClinic");
    let clinicSendPMRToPharmacy =
      this.state.basicInfo?.peptideStatus?.finalReportSentToCC;
    let treatmentStarted =
      this.state.basicInfo?.peptideStatus?.finalReportSentToProvider;
    if (!cheked) {
      return true;
    }
    if (!treatmentStarted) {
      return cheked && treatmentStarted;
    } else {
      return cheked || clinicSendPMRToPharmacy;
    }
  };
  applySameDateToLabReceived = (labId, value, labtype, filtered = []) => {
    let clone = _.cloneDeep(this.state[labtype][labId]);
    let keys = Object.keys(clone);
    keys
      .filter((ele) => clone[ele].checked && filtered.includes(ele))
      .map((ele) => {
        clone[ele].date = value;
      });
    // console.log(clone)
    // debugger;
    this.setState({
      [labtype]: {
        ...this.state[labtype],
        [labId]: clone,
      },
    });
  };
  displayApplyDate = (labId, boxid, checkIfDisabled) => {
    // if (!labId && isDisabled) {
    //   // console.log({ labId, boxid, isDisabled });
    //   return null
    // }
    let lab = this.state.selectedLabs[labId];

    // debugger;
    let isDisabled = (childId) => checkIfDisabled(labId, childId);
    let keys = Object.keys(lab).filter((k) => {
      let isD = isDisabled(k);
      // console.log({ k, isD })
      return !isD;
    });
    let key = keys.find((ele) => {
      return lab[ele].date !== "";
    });
    // alert(key)
    let cheked = keys.filter((ele) => lab[ele].checked);
    let filter = keys.filter((ele) => lab[ele].checked && lab[ele].date !== "");
    let isEqual = keys.every((ele) => {
      let d1 = new Date(lab[ele].date);
      let d2 = new Date(lab[key]?.date);
      // console.log({ d1t: d1.getTime(), d2t: d2.getTime(), for: "bucket", d1, d2, lab1: lab[ele].date, lab2: lab[key]?.date, cond: d1.getTime() === d2.getTime() })
      return d1.getTime() === d2.getTime();
      // // console.log({ 1: new Date(lab[ele].data).toString(), 2: lab[key]?.date })
      // return new Date(lab[ele].data).getTime() === new Date(lab[key]?.date).getTime();
    });
    // console.log({
    //   labId,
    //   key, boxid, filter, keys, cheked, isEqual,
    //   // keyEqBoxId: key == boxid,
    //   // fileterKeyLen: filter.length !== keys.length,
    //   // chLen2: cheked.length >= 2,
    //   // isEqKeyLen: isEqual.length === keys.length,

    // })
    // if ((key == boxid && filter.length !== keys.length && cheked.length >= 2) && !isEqual) {
    if (
      (key == boxid && filter.length !== keys.length && cheked.length >= 2) ||
      (key == boxid && !isEqual)
    ) {
      return (
        <Col style={{ display: "contents" }}>
          <div
            onClick={() =>
              this.applySameDateToLabReceived(
                labId,
                lab[boxid].date,
                "selectedLabs",
                keys
              )
            }
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            Apply same date to selected
          </div>
        </Col>
      );
    } else return null;
  };
  displayApplyDateForBucket = (labId, boxid, checkIfDisabled) => {
    // if (!labId, isDisabled) return null
    let lab = this.state.selectedLabsForBucket[labId];
    // debugger;
    let isDisabled = (childId) => checkIfDisabled(labId, childId);
    let keys = Object.keys(lab).filter((k) => {
      let isD = isDisabled(k);
      // console.log({ k, isD, for: "bucket" })
      return !isD;
    });
    let key = keys.find((ele) => {
      return lab[ele].date !== "";
    });
    let cheked = keys.filter((ele) => lab[ele].checked);
    let isEqual = keys.every((ele) => {
      let d1 = new Date(lab[ele].date);
      let d2 = new Date(lab[key]?.date);
      // console.log({ d1t: d1.getTime(), d2t: d2.getTime(), for: "bucket", d1, d2, lab1: lab[ele].date, lab2: lab[key]?.date, cond: d1.getTime() === d2.getTime() })
      return d1.getTime() === d2.getTime();
      // // console.log({ 1: new Date(lab[ele].data).toString(), 2: lab[key]?.date })
      // return new Date(lab[ele].data).getTime() === new Date(lab[key]?.date).getTime();
    });
    // console.log({ isEqual, key, boxid, filter, keys, cheked })
    let filter = keys.filter((ele) => lab[ele].checked && lab[ele].date !== "");
    if (
      (key == boxid && filter.length !== keys.length && cheked.length >= 2) ||
      (key == boxid && !isEqual)
    ) {
      return (
        <Col>
          <div
            onClick={() =>
              this.applySameDateToLabReceived(
                labId,
                lab[boxid].date,
                "selectedLabsForBucket",
                keys
              )
            }
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            Apply same date to selected
          </div>
        </Col>
      );
    } else return null;
  };
  getReportName = (keyName) => {
    try {
      let report = this.state.basicInfo?.patientReports[keyName];
      if (report) {
        let lindex = report.lastIndexOf("/");
        if (lindex !== -1) {
          let length = report.length;
          return report.slice(Number(lindex) + 1, length);
        } else return `${keyName}_${this.state.PatientAccessionId}_Report.pdf`;
      } else return `${keyName}_${this.state.PatientAccessionId}_Report.pdf`;
    } catch (error) {
      return `${keyName}_${this.state.PatientAccessionId}_Report.pdf`;
    }
  };
  verifyPmr = async () => {
    return new Promise(async (resolve) => {
      try {
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        let data = {
          userId: uid,
          patientId: Number(this.state.patientId),
          id: this.state?.verifyId || "",
          patientAccessionId: Number(this.state.PatientAccessionId),
          pmrCurrentVersion: this.state?.version || "",
          // "pmrCurrentVersion": this.state.basicInfo?.patientReports?.pmrCurrentVersion != null ? this.state.basicInfo?.patientReports?.pmrCurrentVersion : "",
          // "pmrReportPath": this.state.basicInfo?.patientReports?.pmrReport != null ? this.state.basicInfo.patientReports.pmrReport : "",
          pmrReportPath: this.state?.verifyPmrPath.replace(".pdf", "") || "",
          // "logReason": "",
          // "revisedReason": "",
          notes: this.state?.notes || "",

          // "notes": this.state?.notes != null ? this.state.basicInfo?.patientReports?.notes : ""
        };
        const apiroute = window.$APIPath;
        let url = apiroute + "/api/BE_PMRReportForUser/VerifyPMR";
        let result = await axiosInstance.post(url, data, {
          "Content-Type": "application/json; charset=utf-8",
        });
        if (result.data?.flag) {
          toast.success(result.data.message);
        } else {
          toast.error(result.data.message);
        }
        this.setState({
          showPmrVerify: false,
          isRevised: false,
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        resolve(true);
      }
    });
  };

  approvePmr = async () => {
    return new Promise(async (resolve) => {
      try {
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        let data = {
          userId: uid,
          patientId: Number(this.state.patientId),
          patientAccessionId: Number(this.state.PatientAccessionId),
          pmrCurrentVersion: this.state?.version || "",
          // "pmrCurrentVersion": this.state.basicInfo.patientReports.pmrCurrentVersion,
          pmrReportPath: this.state?.verifyPmrPath.replace(".pdf", "") || "",
          // "pmrReportPath": this.state.basicInfo.patientReports.pmrReport,
          notes: this.state?.notes || "",
          id: this.state?.verifyId || "",
        };

        const apiroute = window.$APIPath;
        let url = apiroute + "/api/BE_PMRReportForUser/ApprovePMR";
        let result = await axiosInstance.post(url, data, {
          "Content-Type": "application/json; charset=utf-8",
        });
        if (result.data?.flag) {
          toast.success(result.data.message);
          this.setState({
            showPmrApprove: false,
            isRevised: false,
          });
        } else {
          toast.error(result.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        resolve(true);
      }
    });
  };
  revisedPmr = async () => {
    return new Promise(async (resolve) => {
      try {
        let notesData = this.state.notes;
        let revisedData = this.state.reviseReason;
        let version = this.state.version;
        if (!notesData || !revisedData || !version) {
          let err = this.state.errors;
          if (!notesData) {
            err.notes = "this field is required";
            // this.setState({
            //   errors: err

            // })
          }
          if (!revisedData) {
            err.reviseReason = "this field is required";
          }
          if (!version) {
            err.version = "this field is required";
          }
          this.setState({
            errors: err,
          });
          return;
        }

        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        let data = {
          userId: uid,
          patientId: Number(this.state.patientId),
          patientAccessionId: Number(this.state.PatientAccessionId),
          pmrCurrentVersion: this.state.version,
          pmrReportPath: this.state.verifyPmrPath,
          notes: this.state.notes,
          revisedReason: this.state.reviseReason,
          id: this.state.verifyId,
        };

        const apiroute = window.$APIPath;
        let url = apiroute + "/api/BE_PMRReportForUser/RevisedPMR";
        let result = await axiosInstance.post(url, data, {
          "Content-Type": "application/json; charset=utf-8",
        });
        if (result.data?.flag) {
          toast.success(result.data.message);
          const param = this.props.match.params;
          this.getData(param.id, param.aid);
          this.setState({ loading: false });
        } else {
          toast.error(result.data.message);
        }
        this.setState({
          showPmrVerify: false,
          isRevised: false,
          notes: "",
          version: "",
          reviseReason: "",
        });
        resolve(true);
      } catch (error) {
        toast.error(error.message);
        resolve(true);
      }
    });
  };
  rejecetPMR = async () => {
    return new Promise(async (resolve) => {
      if (this.state.PMRapproveNotes == "") {
        this.state.errors.PMRapproveNotes = "please write reason";
        this.setState({
          loading: false
        })
        return false
      }
      try {
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        let data = {
          userId: uid,
          patientId: Number(this.state.patientId),
          patientAccessionId: Number(this.state.PatientAccessionId),
          pmrCurrentVersion: this.state?.version || "",
          // "pmrCurrentVersion": this.state.basicInfo.patientReports.pmrCurrentVersion,
          pmrReportPath: this.state?.verifyPmrPath.replace(".pdf", "") || "",
          // pmrReportPath: this.state?.verifyPmrPath || "",
          // "pmrReportPath": this.state.basicInfo.patientReports.pmrReport,
          notes: this.state?.notes || "",
          revisedReason: this.state.PMRapproveNotes,
          id: this.state?.verifyId || "",
        };

        const apiroute = window.$APIPath;
        let url = apiroute + "/api/BE_PMRReportForUser/RejectPMR";
        let result = await axiosInstance.post(url, data, {
          "Content-Type": "application/json; charset=utf-8",
        });
        if (result.data?.flag) {
          toast.success(result.data.message);
          this.setState({
            showPmrApprove: false,
            PMRapproveNotes: "",
            showPMRRejectReason: false,
            isRevised: false,
          });
        } else {
          toast.error(result.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        resolve(true);
      }
    });
  };
  handleSubmintDesignDiscount = () => {
    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }
    const errors = this.state.errors
    if (this.state.DesignDiscountType && !this.state.DesignDiscount) {
      this.setState({
        errors: {
          ...this.state.errors,
          DesignDiscount: "Discount is required field"
        }
      })
      return false
    }

    // let errors = this.state.errors;
    // if (!this.state.practitionerContactPersonIdDesign) {
    //   this.setState({
    //     errors: {
    //       ...this.state.errors,
    //       practitionerContactPersonIdDesign: "Please select any one option"
    //     }
    //   })
    //   // errors.practitionerContactPersonIdDesign = "Please select any one option";
    //   return false
    // }
    if (!errors.DesignDiscount) {
      this.setState({ loading: true });
      const apiroute = window.$APIPath;
      // const url = apiroute + "/api/BE_Dashboard/GetAll";
      const url =
        apiroute + "/api/BE_PaymentHistory/UpdateInvoicePOReceivedForDesign";
      let data = JSON.stringify({
        aId: Number(this.state?.PatientAccessionId),
        pId: Number(this.state.patientId),
        discountType: String(this.state.DesignDiscountType),
        discountAmount: String(this.state.DesignDiscount),
        practitionerContactId: 0,
        reciverEmails: this.state.practitionerContactPersonIdDesign.map((m) => m.value),
        practitionerId: Number(this.state.assignedpractitioner.practitionerId),
        userId: uid,


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
              DesignDiscount: "",
              DesignDiscountType: "",
              practitionerContactPersonIdDesign: [],
              showDiscountModal: false,
              loading: false,

            });
            const param = this.props.match.params;

            this.getData(param.id, param.aid);

            toast.success(result?.data?.message)


          } else {
            this.setState({ loading: false });
            toast.error(result.data.message)

          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loading: false });
          toast.error("Something went wrong")


        });
    }
  }
  // handleDiscountType = (e, name) => {
  //   const result = this.state.DesignDiscount
  //   let err = this.state.errors;
  //   if (e.target.value === "Percentage") {
  //     (result < 0 || result > 100) ?
  //       err.DesignDiscount = "Discount must be a number between 0 and 100"
  //       : err.DesignDiscount = ""
  //   } else if (e.target.value === "Amount") {
  //     (result < 0 || result > 100000) ?
  //       err.DesignDiscount = "Discount must be a number between 0 and 100000"
  //       : err.DesignDiscount = ""
  //   } else {
  //     err.DesignDiscount = "";
  //   }
  //   this.setState({
  //     [name]: e.target.value,
  //     errors: err
  //   });

  // }
  handleInputChange = (e, name) => {
    let value = e.target.value;

    this.setState({
      [name]: value,
    });

    if (e.target.name == "handleMetastasis") {
      this.setState({
        handleMetastasis: e.target.value
      })
    }
    // console.log(e.target)

    // alert(name)
    if ((name == "notes" || name == "reviseReason") && value == "") {
      let err = this.state.errors;
      err[name] = "this field is required";
      this.setState({
        errors: err,
      });
    } else {
      let err = this.state.errors;
      err[name] = "";
      this.setState({
        errors: err,
      });
    }

    // if (name == "DesignDiscount") {

    //   // const result = value.replace(/[^0-9\.]/g, '');
    //   const result = value;
    //   let err = this.state.errors;

    //   !value ? err.DesignDiscount = "Discount is required field" : err.DesignDiscount = "";

    //   this.setState({
    //     DesignDiscount: result,

    //   })

    // }
    if (name === "TypeOfPayment") {
      if (value !== "3") {
        this.setState({
          paymentTypeModal: true
        })
      }
      this.setState({
        TypeOfPayment: value
      })
    }
    if (name === "DesignDiscount") {
      const result = value.trim();
      let err = this.state.errors;

      if (result === "") {
        err.DesignDiscount = "Discount is a required field";
      } else if (this.state.DesignDiscountType === "Percentage") {
        (result < 0 || result > 100) ?
          err.DesignDiscount = "Discount must be a number between 0 and 100"
          : err.DesignDiscount = ""
      } else if (this.state.DesignDiscountType === "Amount") {
        (result < 0 || result > 100000) ?
          err.DesignDiscount = "Discount must be a number between 0 and 100000"
          : err.DesignDiscount = ""
      } else {
        err.DesignDiscount = "";
      }

      this.setState({
        DesignDiscount: result,
        errors: err
      });
    }

    if (name == "DesignDiscountType") {
      let err = this.state.errors;
      !!value ? err.DesignDiscount = "Discount is required field" : err.DesignDiscount = "";

      this.setState({
        DesignDiscount: ""
      })

    }

    if (name === "PaymentDiscount") {
      const result = value.trim();
      let err = this.state.errors;

      if (result === "") {
        err.PaymentDiscount = "Discount is a required field";
      } else if (this.state.PaymentDiscountType === "Percentage") {
        (result < 0 || result > 100) ?
          err.PaymentDiscount = "Discount must be a number between 0 and 100"
          : err.PaymentDiscount = ""
      } else if (this.state.PaymentDiscountType === "Amount") {
        (result < 0 || result > 100000) ?
          err.PaymentDiscount = "Discount must be a number between 0 and 100000"
          : err.PaymentDiscount = ""
      } else {
        err.PaymentDiscount = "";
      }

      this.setState({
        PaymentDiscount: result,
        errors: err
      });
    }

    if (name == "PaymentDiscountType") {
      let err = this.state.errors;
      // !!value ? err.PaymentDiscount = "Discount is required field" : err.PaymentDiscount = "";
      err.PaymentDiscount = "";


      this.setState({
        PaymentDiscount: ""
      })

    }

    // if ((name == "practitionerContactPersonIdDesign" && value == "")) {
    //   let err = this.state.errors;
    //   err[name] = "Please select any one option";
    //   this.setState({
    //     errors: err,
    //   });
    // } else {
    //   let err = this.state.errors;
    //   err[name] = "";
    //   this.setState({
    //     errors: err,
    //   });
    // }
  };
  getEditorConfig = () => {
    if (this?.state?.isRevised) {
      return { placeholder: "Please enter description", toolbar: [] };
    } else {
      return { placeholder: "Please enter description" };
    }
  };
  getUniqueSpecimenCollections = (value, index, self) => {
    // debugger;
    // (ele) => {
    // return ele.sampleTypeId === collection.sampleTypeId;
    // }
    return (
      self.findIndex((ele) => ele.sampleTypeId === value.sampleTypeId) === index
    );
  };

  // Patient Specimen Received at Lab
  submitPatientSpecimenFromSelectedLab = (labid) => {
    return new Promise(async (resolve) => {
      try {
        // let index = this.state.selectedLabs.findIndex((ele) => {
        //   return ele.id === labid;
        // });
        const apiroute = window.$APIPath;
        let url =
          apiroute +
          "/api/BE_NGSLaboratoryPatientActivity/UpdateSampleReceivedByLab";
        let clone = _.cloneDeep(this.state.selectedLabs);

        // debugger;
        /*[
           checkBoxes:{ [name]:{
                checked:bool,
                  date,
      }
    id:num
    }
        ]*/
        // {id,checkboxes:{name,id,date}}

        // debugger;
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }

        // let specimenKeys = Object.keys(clone);
        // let data = specimenKeys.map((ele) => {
        //   return {
        //     id: ele,
        //     statusUpdatedDate: lab[ele].date,
        //     statusUpdatedBy: uid,
        //   };
        // });
        let labKeys = Object.keys(clone[labid]);
        let data = labKeys.map((ele) => {
          if (clone[labid][ele].date && !clone[labid][ele].isNa) {
            let x = new Date(clone[labid][ele].date);

            let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
            let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
            x.setHours(hoursDiff);
            x.setMinutes(minutesDiff);
            return {
              id: Number(ele),
              statusUpdatedDate: x, //clone[labid][ele].date,
              statusUpdatedBy: uid,
              sampleNotApplicable: false,
            };
          } else if (clone[labid][ele].isNa) {
            return {
              id: Number(ele),
              statusUpdatedDate: new Date(),
              //clone[labid][ele].date,
              statusUpdatedBy: uid,
              sampleNotApplicable: true,
            };
          }
        });
        data = data.filter((ele) => !_.isEmpty(ele));

        // [
        //   {
        //     "id": 0,
        //     "statusUpdatedDate": "2022-09-12T12:15:54.991Z",
        //     "statusUpdatedBy": 0
        //   }
        // ]
        let result = await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        // debugger;
        // console.log(data);
        toast.success(result?.data?.message);
        debugger;
        resolve(true);
      } catch (error) {
        resolve(true);
        // console.log(error);
        toast.error(
          error?.data?.message ||
          "Error while updating Patient Specimen Received at Lab"
        );
      }
    });
  };
  submitPatientSpecimenFromSelectedLabOfBucket = (labid) => {
    return new Promise(async (resolve) => {
      try {
        // let index = this.state.selectedLabs.findIndex((ele) => {
        //   return ele.id === labid;
        // });
        const apiroute = window.$APIPath;
        let url =
          apiroute +
          "/api/BE_NGSLaboratoryPatientActivity/UpdateResultReceivedByLab";
        let clone = _.cloneDeep(this.state.selectedLabsForBucket);
        // debugger;
        /*[
           checkBoxes:{ [name]:{
                checked:bool,
                  date,
      }
    id:num
    }
        ]*/
        // {id,checkboxes:{name,id,date}}

        // debugger;
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }

        // let specimenKeys = Object.keys(clone);
        // let data = specimenKeys.map((ele) => {
        //   return {
        //     id: ele,
        //     statusUpdatedDate: lab[ele].date,
        //     statusUpdatedBy: uid,
        //   };
        // });
        let labKeys = Object.keys(clone[labid]);
        let data = labKeys.map((ele) => {
          let sampleNotApplicableStatus =
            this.state.basicInfo?.labReceivedResultStatus.filter((Cele) => {
              return Cele.ngsLaboratoryPatientActivityId == ele;
            })[0].analysisNotApplicable;

          if (clone[labid][ele].date) {
            let x = new Date(clone[labid][ele].date);
            let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
            let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
            x.setHours(hoursDiff);
            x.setMinutes(minutesDiff);
            return {
              id: Number(ele),
              statusUpdatedDate: x, //clone[labid][ele].date,
              statusUpdatedBy: uid,
              sampleNotApplicable: sampleNotApplicableStatus,
            };
          }
        });
        data = data.filter((ele) => !_.isEmpty(ele));

        // [
        //   {
        //     "id": 0,
        //     "statusUpdatedDate": "2022-09-12T12:15:54.991Z",
        //     "statusUpdatedBy": 0
        //   }
        // ]
        let result = await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        // debugger;
        let flag = result.data.flag;

        flag
          ? toast.success(result?.data?.message)
          : toast.error(result.data.message);
        resolve(true);
        // console.log(data);
      } catch (error) {
        resolve(true);
        // console.log(error);
        toast.error("Error while updating Patient Specimen Received at Lab");
      }
    });
  };
  isSubmitButtonDisabledForSelectedLab = (lab) => { };
  setSpecimenCollections = (collection) => {
    // sampleTypeId
    // sampleTypeName
    let index = this.state.specimentCollections.findIndex((ele) => {
      return ele.sampleTypeId === collection.sampleTypeId;
    });

    // alert(index);
    if (index === -1) {
      collection.sampleDate = "";
      // alert("add");
      let labs = [...this.state.specimentCollections, collection];
      // debugger;
      let filteredLabs = labs.filter(this.getUniqueSpecimenCollections);
      this.setState({
        specimentCollections: filteredLabs,
      });
    } else {
      this.setState({
        specimentCollections: this.state.specimentCollections.filter(
          (ele) => ele.sampleTypeId !== collection.sampleTypeId
        ),
      });
    }
  };
  setDateForSpecimenCollections = (collection, date) => {
    let index = this.state.specimentCollections.findIndex((ele) => {
      return ele.sampleTypeId === collection.sampleTypeId;
    });
    let AdjusteddateValue = new Date(date); //(new Date(date.getTime() - (date.getTimezoneOffset() * 60000)));
    AdjusteddateValue.setHours(0, 0, 0, 0);
    let clone = _.cloneDeep(this.state.specimentCollections);
    // clone[index]["sampleDate"] = date;
    clone[index] = {
      ...clone[index],
      sampleDate: AdjusteddateValue,
    };
    // console.log(clone[index]);
    this.setState({
      specimentCollections: clone,
    });
  };
  getDateForSpecimenCollection = (collection) => {
    let index = this.state.specimentCollections.findIndex((ele) => {
      return ele.sampleTypeId === collection.sampleTypeId;
    });
    try {
      // console.log(this?.state?.specimentCollections[index]["sampleDate"]);
      if (this?.state?.specimentCollections[index]["sampleDate"]) {
        return new Date(this?.state?.specimentCollections[index]["sampleDate"]);
      } else return "";
    } catch (error) {
      return "";
    }
  };

  //get detail
  componentDidMount() {
    // debugger;

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    var rights = userToken.roleModule;

    this.OrganizationUserDataForNotes();

    this.setState({
      roleName: userToken.roleName,
      notesCreatedId: userToken.organizationUserId,
      notes_updatedBy_Id: userToken.organizationUserId,
      PMRapprovelRight: userToken.email

    });

    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter((role) => role.moduleId == 3);
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited,
          isEditDateClass: !currentrights[0].isEdited ? "disabled-input" : "",
        });
        if (currentrights[0].isViewed) {
          const param = this.props.match.params;

          if (param.id != undefined && param.aid != undefined) {
            this.getData(param.id, param.aid, true);
            this.getAllNotes(param.id, param.aid);
            this.getAllEmail(param.id, param.aid)
            this.getDiseaseData();
            this.getCostumerCareData();
          }
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
  admeToxSaveData = () => {
    // console.log("Hii")
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let url = "";
    let uid = 0;
    this.setState({
      loading: true,
    });
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }
    // const params = new URLSearchParams();
    // params.append('pId', Number(this.state.patientId));
    // params.append('pId', Number(this.state.PatientAccessionId));
    // params.append('userId', parseInt(uid));

    let data = JSON.stringify({
      pId: Number(this.state.patientId),
      aId: Number(this.state.PatientAccessionId),
      userId: parseInt(uid),
    });
    const apiroute = window.$APIPath;
    // url = apiroute + '/api/BE_PatientReport/SaveDataForAdmeToxReport' + "?pid=" + Number(this.state.PatientId) + "&aId=" + Number(this.state.PatientAccessionId) + "&userId=" + parseInt(uid);
    url = apiroute + "/api/BE_PatientReport/SaveDataForAdmeToxReport";
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
            // isSubmited: false,
            redirect: true,
          });
          toast.success(result.data.message);
          this.getData(this.state.patientId, this.state.PatientAccessionId);
        } else {
          this.setState({
            loading: false,
          });
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.message);
      });
  };
  handleLabResultChange = (labid, boxid, name) => {
    // TODO: find index of labs if -1 add new and add[name]:false and date:'' if found , find name if not exist add one if exist toggle it
    // let index = this.state.selectedLabs.findIndex((ele) => {
    //   return ele.id === labid;
    // });

    if (name == "isNA") {
      let clone = _.cloneDeep(this.state.selectedLabs);
      clone[labid][boxid].checked = false;
      clone[labid][boxid].date = "";
      clone[labid][boxid].isNa = !clone[labid][boxid].isNa;

      this.setState({
        DateChangedForSpeceimen: false,
        selectedLabs: clone,
      });
    } else {
      let clone = _.cloneDeep(this.state.selectedLabs);
      let isNa = clone[labid][boxid].isNa;
      if (labid in clone && boxid in clone[labid]) {
        clone[labid][boxid] = {
          ...clone[labid][boxid],
          checked: !clone[labid][boxid].checked,
          // date: "",
          isNa: false,
        };
        // clone.push({
        //   id: labid,
        //   checkBoxes: {
        //     [name]: {
        //       checked: true,
        //       date: "",
        //     },
        //   },
        // });
      } else {
        clone[labid] = {
          [boxid]: {
            checked: true,
            // date: "",
          },
        };
        // clone[index] = {
        //   ...clone[index],
        //   checkBoxes: {
        //     ...clone[index].checkBoxes,
        //     [name]: {
        //       ...clone[index].checkBoxes[name],
        //       checked: !clone[index].checkBoxes[name].checked,
        //     },
        //   },
        // };
      }
      this.setState({
        selectedLabs: clone,
      });
    }
    // alert(2);
    // console.log(clone);
  };
  handleLabResultChangeOfLab = (labid, boxid) => {
    // TODO: find index of labs if -1 add new and add[name]:false and date:'' if found , find name if not exist add one if exist toggle it
    // let index = this.state.selectedLabs.findIndex((ele) => {
    //   return ele.id === labid;
    // });
    let clone = _.cloneDeep(this.state.selectedLabsForBucket);
    if (labid in clone && boxid in clone[labid]) {
      clone[labid][boxid] = {
        ...clone[labid][boxid],
        checked: !clone[labid][boxid].checked,
      };
      // clone.push({
      //   id: labid,
      //   checkBoxes: {
      //     [name]: {
      //       checked: true,
      //       date: "",
      //     },
      //   },
      // });
    } else {
      clone[labid] = {
        [boxid]: {
          checked: true,
          date: "",
        },
      };
      // clone[index] = {
      //   ...clone[index],
      //   checkBoxes: {
      //     ...clone[index].checkBoxes,
      //     [name]: {
      //       ...clone[index].checkBoxes[name],
      //       checked: !clone[index].checkBoxes[name].checked,
      //     },
      //   },
      // };
    }
    // alert(2);
    // console.log(clone);
    this.setState({
      selectedLabsForBucket: clone,
    });
  };
  handleDesignPaymentNotRequired = () => {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let url = "";
    let uid = 0;
    this.setState({
      loading: true,
    });
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }
    const apiroute = window.$APIPath;
    // const url = apiroute + "api/CognitoUserStore/getPatientDropdownEntity";
    url = apiroute + "/api/BE_DesignOrder/UpdatePMRNotRequired";
    let data = JSON.stringify({
      "aId": parseInt(this.state.PatientAccessionId),
      "pId": parseInt(this.state.patientId),
      "userId": uid,
      "isNoPMRRequired": !this.state.basicInfo.peptideStatus.isNoPMRRequired
    });
    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }).then((result) => {
        if (result.data.flag) {
          this.setState({
            loading: false,
            showDesignPaymentNotRequired: false
          });
          toast.success(result.data.message);
          this.getData(this.state.patientId, this.state.PatientAccessionId);
        } else {
          this.setState({
            loading: false,
          });
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.message);
      });

  }

  handleLabResultDateChange = (labid, boxid, date) => {
    // let index = this.state.selectedLabs.findIndex((ele) => {
    //   return ele.id === labid;
    // });
    let AdjusteddateValue = new Date(date); // (new Date(date.getTime() - (date.getTimezoneOffset() * 60000)));
    AdjusteddateValue.setHours(0, 0, 0, 0);
    let clone = _.cloneDeep(this.state.selectedLabs);
    clone[labid][boxid].date = AdjusteddateValue;
    this.setState({
      selectedLabs: clone,
    });
  };
  handleLabResultDateChangeOfBucket = (labid, boxid, date) => {
    // let index = this.state.selectedLabs.findIndex((ele) => {
    //   return ele.id === labid;
    // });
    let AdjusteddateValue = new Date(date); // (new Date(date.getTime() - (date.getTimezoneOffset() * 60000)));
    AdjusteddateValue.setHours(0, 0, 0, 0);
    let clone = _.cloneDeep(this.state.selectedLabsForBucket);
    clone[labid][boxid].date = AdjusteddateValue;
    this.setState({
      selectedLabsForBucket: clone,
    });
  };
  isDateDisabledForSelectedLabs = (labid, boxid) => {
    // console.log({ labid, boxid });
    // let index = this.state.selectedLabs.findIndex((ele) => {
    //   return ele.id === labid;
    // });
    try {
      // false &&  ''
      return !this.state.selectedLabs[labid][boxid].checked;
    } catch (error) {
      // console.log(error);
      return true;
    }
  };
  diasbledCheckboxForSpecimenCollectionSampleLabs = (labId, collectionId) => {
    try {
      let samples = this.state.basicInfo?.specimenReceivedStatus.findIndex(
        (ele) => {
          return (
            ele.ngsLaboratoryId == labId &&
            ele.ngsLaboratoryPatientActivityId == collectionId &&
            ele.sampleTypeReceived
          );
        }
      );
      return samples >= 0;
    } catch (error) {
      return false;
    }
  };
  isCheckBoxDisabledForSelectedLabs = (labid, boxid) => {
    // console.log({ labid });
    // let index = this.state.selectedLabs.findIndex((ele) => {
    //   return ele.id === labid;
    // });
    try {
      // false &&  ''
      return this.state.selectedLabs[labid][boxid].checked;
    } catch (error) {
      // console.log(error);
      return false;
    }
  };
  isNACheckBoxForSelectedLabs = (labid, boxid) => {
    // console.log({ labid });
    // let index = this.state.selectedLabs.findIndex((ele) => {
    //   return ele.id === labid;
    // });

    try {
      // false &&  ''

      return this.state.selectedLabs[labid][boxid].isNa;
    } catch (error) {
      // console.log(error);
      return false;
    }
  };

  disablesNaData = (labid, sampleid) => {
    let labdata = this.state?.basicInfo?.specimenReceivedStatus;
    if (Array.isArray(labdata)) {
      let index = labdata.findIndex((e) => {
        return (
          e.ngsLaboratoryId == labid &&
          e.ngsLaboratoryPatientActivityId == sampleid
        );
      });
      if (index !== -1) {
        let isDate = labdata[index]?.sampleTypeReceivedDate;
        return !!isDate;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  isCheckBoxDisabledForSelectedLabsForBucket = (labid, boxid) => {
    // console.log({ labid });
    // let index = this.state.selectedLabs.findIndex((ele) => {
    //   return ele.id === labid;
    // });
    try {
      // false &&  ''
      return this.state.selectedLabsForBucket[labid][boxid].checked;
    } catch (error) {
      // console.log(error);
      return false;
    }
  };

  isDateDisabledForSelectedLabsOfBucket = (labid, boxid) => {
    // console.log({ labid });
    // let index = this.state.selectedLabs.findIndex((ele) => {
    //   return ele.id === labid;
    // });
    try {
      // false &&  ''
      return !this.state.selectedLabsForBucket[labid][boxid].checked;
    } catch (error) {
      // console.log(error);
      return true;
    }
  };
  getDateForSelectedLab = (labid, boxid) => {
    // let index = this.state.selectedLabs.findIndex((ele) => {
    //   return ele.id === labid;
    // });
    try {
      return this.state.selectedLabs[labid][boxid].date;
    } catch (error) {
      return "";
    }
  };
  getDateForSelectedLabOfBucket = (labid, boxid) => {
    // let index = this.state.selectedLabs.findIndex((ele) => {
    //   return ele.id === labid;
    // });
    try {
      return this.state.selectedLabsForBucket[labid][boxid].date;
    } catch (error) {
      return "";
    }
  };
  updateDataAndRefreshPage = (cb) => {
    this.setState({ loading: true });

    cb().then(() => {
      const param = this.props.match.params;
      this.getData(param.id, param.aid);
      this.setState({ loading: false });
    });
  };
  getDiseaseData = () => {
    const apiroute = window.$APIPath;
    // const url = apiroute + "api/CognitoUserStore/getPatientDropdownEntity";
    const url = apiroute + "/api/BE_Common/GetPatientDropdownEntity";
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
          let diseaseCatObj = result.data.outdata.diseaseCatData;
          //   .filter(
          //   (category) =>
          //     category.diseaseCategoryName.toLowerCase() !== "cancer" ||
          //     category.diseaseCategoryName.toLowerCase() !==
          //     "complete health score"
          // );
          // console.log(result?.data?.outdata?.diseaseData, "ggggggggggggggggggggggggggg")
          this.setState({
            Alldiseases: result?.data?.outdata?.diseaseData,
            allpractitioners: result.data.outdata.practitionerData,
            diseaseCat: result.data.outdata.diseaseCatData,
            diseasecategories: diseaseCatObj,
            //disease: currentdisease
          });

          // console.log(this.state);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
    // console.log(this.state.diseaseName);
  };

  getDataPractitionerContactPerson = (value) => {
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/BE_Practitioner/GetById?id=" + value;

    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log("result", result);
        if (result.data.flag) {
          const practitionerContact = [JSON.parse(JSON.stringify(result?.data?.outdata))]
          const practitionerContactPerson = result.data.outdata.practitionerContactPerson;


          const filteredEmailspractitionerContact = []
          const filteredEmails = [];
          practitionerContact.map((obj) => {
            filteredEmails.push({ value: obj.email, label: obj.email, name: obj.firstName + " " + obj.lastName })

          })

          practitionerContactPerson.map((obj) => {
            filteredEmails.push({ value: obj.email, label: obj.email, name: obj.name })
          })



          this.setState({
            loading: false,
            // practitionerContact: [JSON.parse(JSON.stringify(result?.data?.outdata))] || [],
            practitionerContactPerson: filteredEmails || [],
            practitionerContactPersonIdDesign: [filteredEmails[0]]

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

  //get detail(for update)
  getData = (id, aid, onMount) => {
    // debugger;
    this.setState({ loading: true });

    const apiroute = window.$APIPath;
    const url =
      apiroute + "/api/BE_Patient/GetProfile?id=" + id + "&aid=" + aid + "";

    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log("diagnosticHistory", result.data.outdata.patientData.patientTreatmentReport);
        if (result.data.flag) {
          var rData = result.data.outdata;
          var pData = rData.patientData;
          let specimenLabsData = pData?.specimenReceivedStatus || [];
          let labReceivedResultStatus = pData?.labReceivedResultStatus || [];

          let selectedLabs = {};

          const updateStatusCode =
            pData.patientAccessionMapping?.accessionStatusId;
          let currentStatus = this.getStatusValue(updateStatusCode);
          let selectedLabsForBucket = {};
          let patientReports = pData.patientReports;
          let patientPMRReports = pData.patientPMRReports;
          let paymentType = pData?.isFullPayment ? "y" : "n";
          let patientHIReports = pData.patientHIReports;
          let PatientAdmeToxReports = pData.patientAdmeToxReports;
          let AnalysisReport = pData.analysisReports
          let DesignReport = pData.designReports
          if (Array.isArray(pData.laboratoryPatient)) {
            let a = pData.laboratoryPatient?.map((ele) => {
              if (!(ele.ngsLaboratoryId in selectedLabs)) {
                selectedLabs = {
                  ...selectedLabs,
                  [ele.ngsLaboratoryId]: {},
                };
              }

              let arrOfSpecimenReceivedStatus =
                pData.specimenReceivedStatus || [];
              let filteredSpecimenReceivedStatus =
                arrOfSpecimenReceivedStatus.filter((child) => {
                  return ele.ngsLaboratoryId === child.ngsLaboratoryId;
                });
              filteredSpecimenReceivedStatus.forEach((child) => {
                // alert(String(child?.sampleTypeReceived));
                selectedLabs[ele.ngsLaboratoryId][
                  child.ngsLaboratoryPatientActivityId
                ] = {
                  checked: child?.sampleTypeReceived,
                  date: child?.sampleTypeReceivedDate
                    ? new Date(child?.sampleTypeReceivedDate)
                    : "",
                  isNa: child?.sampleNotApplicable || false,
                };
              });
            });
          }
          if (Array.isArray(pData.labReceivedResultStatus)) {
            let a = pData.labReceivedResultStatus?.map((ele) => {
              if (!(ele.ngsLaboratoryId in selectedLabsForBucket)) {
                selectedLabsForBucket = {
                  ...selectedLabsForBucket,
                  [ele.ngsLaboratoryId]: {},
                };
              }

              let arrOfLabRecievedResult = pData.labReceivedResultStatus;
              let filteredArrOfLabRecievedResult = Array.isArray(
                arrOfLabRecievedResult
              )
                ? arrOfLabRecievedResult.filter((child) => {
                  return ele.ngsLaboratoryId === child.ngsLaboratoryId;
                })
                : [];
              filteredArrOfLabRecievedResult.forEach((child) => {
                // alert(String(child?.sampleTypeReceived));
                selectedLabsForBucket[ele.ngsLaboratoryId][
                  child.ngsLaboratoryPatientActivityId
                ] = {
                  checked: child?.sampleTypeResultStatus,
                  date: child?.sampleTypeResultDate
                    ? new Date(child?.sampleTypeResultDate)
                    : "",
                  isNa: child?.analysisNotApplicable || false,
                };
              });
            });
          }
          this.setState(
            {
              currentCcId: pData?.ccId,
              defaultTissueName: pData?.patientDisease?.[0]?.tissue || "",
              tissueName: pData?.patientDisease?.[0]?.tissue || "",
              specimenLabsMap: specimenLabsData.map((e) => {
                return e.sampleTypeReceivedDate;
              }),
              LabsStatusMap: labReceivedResultStatus.map((e) => {
                return e.sampleTypeResultStatus;
              }),
              defaultSelectedDiseaseName:
                pData?.patientDisease?.[0]?.diseaseName || "",
              currentDiseaseName: pData?.patientDisease?.[0]?.diseaseName || "",
              currentStatus,
              updateStatusCode,
              tempUpdateStatusCode: updateStatusCode,
              paymentType,
              patientHIReports,
              PatientAdmeToxReports,
              AnalysisReport,
              DesignReport,
              patientPMRReports,
              patientReports,
              //patientAccessionId: pData.patientAccessionMapping?.[0]?.
              currentDiseaseId: pData.patientDisease?.[0]?.diseaseId,
              diseaseId: pData.patientDisease?.[0]?.diseaseId,
              diseaseNameforReportUse:
                pData.patientDisease?.[0]?.diseaseDisplayName,
              Tissue: pData.patientDisease?.[0]?.tissueId,
              currentTissue: pData.patientDisease?.[0]?.tissueId,
              diseaseCategoryId: pData.patientDisease?.[0]?.diseaseCategoryId,
              currentDiseaseCategoryId:
                pData.patientDisease?.[0]?.diseaseCategoryId,
              diseaseDataId: pData.patientDisease[0].diseaseId,
              patientdiseaseId: pData.patientDisease?.[0]?.patientDiseaseId,
              diseaseId: pData.patientDisease[0].diseaseCategoryId,
              designOrderDiscount: pData?.designOrderStatus?.discount,
              analysisOrderDiscount: pData?.analysisOrderStatus?.discount,


              selectedLabs: selectedLabs,
              selectedLabsForBucket: selectedLabsForBucket,
              patientId: pData.patientId,
              PatientAccessionId: aid,
              basicInfo: pData,
              // TypeOfPayment: (pData?.analysisReports.length == 0 && pData?.designReports.length == 0) ? "3" : (pData.isFullPaymentType ? "2" : "1"),
              SelectedTypeOfPayment: (pData?.analysisReports.length == 0 && pData?.designReports.length == 0) ? "3" : (pData.isFullPaymentType ? "2" : "1"),
              diseases: pData.patientDisease[0],
              handleMetastasis: pData.patientDisease[0]?.isMetastasis == true ? "yes" : "no",
              diseasecategory: pData.patientDisease[0]?.diseaseCategory,
              diagnosticHistory: pData.patientDiagnosticHistory,
              diagnosticDocFiles: pData.patientDiagnosticHistory,
              prescriptiondocFiles: pData.patientPrescription,
              treatmentdocFiles: pData.patientTreatmentReport,
              emailNotify: pData?.patientAccessionMapping?.isEmailNotification,
              emergencyContact: pData.patientEmergencyContacts,
              insuranceDetail: pData.patientInsuranceDetails,
              prescription: pData.patientPrescription,
              treatmentReport: pData.patientTreatmentReport,
              patientpayments: pData.patientPayment,
              patientSamples: pData.patientSample,

              patientaccessionmapping: pData.patientAccessionMapping,

              assignedinstitute: pData.institutePatient,
              assignedlaboratory: pData.laboratoryPatient,
              assignedmanufacture: pData.manufacturerPatient,
              assignedpractitioner: pData.practitionerPatient,

              allinstitutes: rData.instituteData,
              filteredinstitutes: rData.instituteData,
              allmanufactures: rData.manufactureData,
              filteredmanufactures: rData.manufactureData,
              allngslaboratorys: rData.laboratoryData,
              filteredngslaboratorys: rData.laboratoryData,
              allpractitioners: rData.practionerData,
              filteredpractitioners: rData.practionerData,
              isFullPaymentStatus: pData.isFullPayment,
              // Alldiseases: rData.diseaseData,
              AllSamples: rData.sampleTypeData,
              pipelineQueued: pData.designActivity?.isPipelineQueued,
              pipelineStarted: pData.designActivity?.isPipelineStarted,

              loading: false,
              designOrderStatus: {
                orderSubmited: {
                  checked: pData?.designOrderStatus?.orderSubmited || false,
                  date: pData?.designOrderStatus?.orderSubmitedDate
                    ? pData?.designOrderStatus?.orderSubmitedDate ==
                      "0001-01-01T00:00:00"
                      ? ""
                      : new Date(pData?.designOrderStatus?.orderSubmitedDate)
                    : "",
                },
                poReceived: {
                  checked: pData?.designOrderStatus?.poReceived || false,
                  date: pData?.designOrderStatus?.poReceivedDate
                    ? new Date(pData?.designOrderStatus?.poReceivedDate)
                    : "",
                },
                invoice: {
                  checked: pData?.designOrderStatus?.invoiceSend || false,
                  date: pData?.designOrderStatus?.invoiceSendDate
                    ? new Date(pData?.designOrderStatus?.invoiceSendDate)
                    : "",
                },
                paymentRecived: {
                  checked: pData?.designOrderStatus?.paymentReceived || false,
                  date: pData?.designOrderStatus?.paymentReceivedDate
                    ? new Date(pData?.designOrderStatus?.paymentReceivedDate)
                    : "",
                },
              },
              peptides: {
                pmrSentToClinic: {
                  checked: pData?.peptideStatus?.pmrSendToCilnic,
                  date: pData?.peptideStatus?.pmrSendToCilnicDate
                    ? new Date(pData?.peptideStatus?.pmrSendToCilnicDate)
                    : "",
                },
                clinicSentPmrToPharmacy: {
                  checked: pData?.peptideStatus?.finalReportSentToCC,
                  date: pData?.peptideStatus?.finalReportSentToCCDate
                    ? new Date(pData?.peptideStatus?.finalReportSentToCCDate)
                    : "",
                },
                peptidesReceivedByClinic: {
                  checked: pData?.peptideStatus?.peptidesReceivedByClinic,
                  date: pData?.peptideStatus?.peptidesReceivedByClinicDate
                    ? new Date(
                      pData.peptideStatus?.peptidesReceivedByClinicDate
                    )
                    : "",
                },
                treatMentStarted: {
                  checked: pData?.peptideStatus?.finalReportSentToProvider,
                  date: pData?.peptideStatus?.finalReportSentToProviderDate
                    ? new Date(
                      pData?.peptideStatus?.finalReportSentToProviderDate
                    )
                    : "",
                },
              },
              specimentCollections: pData.patientSample
                .filter((ele) => ele.patientSampleId > 0)
                .map((ele) => {
                  return {
                    sampleDate: ele.createdDate,
                    sampleTypeId: ele.sampleTypeId,
                    sampleTypeName: ele.sampleTypeName,
                  };
                }),
              analysisOrderStatus: {
                ...this.state.analysisOrderStatus,
                orderSubmitted: {
                  checked: pData?.analysisOrderStatus?.orderSubmited || false,
                  date: pData?.analysisOrderStatus?.orderSubmitedDate
                    ? new Date(pData?.analysisOrderStatus?.orderSubmitedDate)
                    : "",
                },
                poReceived: {
                  checked: pData?.analysisOrderStatus?.poReceived || false,
                  date: pData?.analysisOrderStatus?.poReceivedDate
                    ? new Date(pData?.analysisOrderStatus?.poReceivedDate)
                    : "",
                },
                invoiceSent: {
                  checked: pData?.analysisOrderStatus?.invoiceSend || false,
                  date: pData?.analysisOrderStatus?.invoiceSendDate
                    ? new Date(pData?.analysisOrderStatus?.invoiceSendDate)
                    : "",
                },
                paymentRecived: {
                  checked: pData?.analysisOrderStatus?.paymentReceived || false,
                  date: pData?.analysisOrderStatus?.paymentReceivedDate
                    ? new Date(pData?.analysisOrderStatus?.paymentReceivedDate)
                    : "",
                },
              },
            },
            () => {
              // this.getCurrentActiveStep(onMount)
              this.getDataPractitionerContactPerson(this.state.assignedpractitioner.practitionerId)

            }
          );
          // console.log({
          //   filter: pData.patientSample.filter(
          //     (ele) => ele.patientSampleId > 0
          //   ),
          //   org: pData.patientSample,
          // });
          //let sampleTypeIds = pData.patientAccessionMapping.sampleTypeIds;
          //console.log(sampleTypeIds);
          if (pData.patientAccessionMapping != null) {
            this.setState({
              checkbox: pData.patientAccessionMapping.patientSample, //(sampleTypeIds != "" && sampleTypeIds != null ? sampleTypeIds.split(",") : [])
            });
          } else {
            this.setState({
              checkbox: [],
            });
          }
          if (
            this.state.basicInfo?.designActivity?.currentStatus ==
            "Design Started"
          ) {
            this.setState({
              spinStatus: true,
            });
          } else {
            this.setState({
              spinStatus: false,
            });
          }

          // console.log(this.state);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
  };

  getAllNotes = (id, aid) => {
    const apiroute = window.$APIPath;
    const url =
      // apiroute + "/api/BE_PatientNotes/GetAll?id=" + id + "&aid=" + aid + "";
      apiroute + "/api/BE_PatientNotes/GetAll?patAccessId=" + aid;
    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState({
            AllpatientNotes: result.data.outdata,
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
  };

  getAllEmail = (id, aid) => {
    const apiroute = window.$APIPath;
    const url =
      // apiroute + "/api/BE_PatientNotes/GetAll?id=" + id + "&aid=" + aid + "";
      apiroute + "/api/BE_Patient/GetEmailData?id=" + id + "&aid=" + aid + "";
    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          const AllEmails = result.data.outdata

          const filteredEmails = []
          AllEmails.map((obj) => {
            filteredEmails.push({ value: obj.email, label: obj.email, name: obj.name })
          })
          this.setState({ allEmail: filteredEmails })
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      })
  };


  handlePeptidesCheckBoxChanges = (name) => {
    this.setState({
      peptides: {
        ...this.state.peptides,
        [name]: {
          ...this.state.peptides[name],
          checked: !this.state.peptides[name].checked,
        },
      },
    });
  };
  handlePeptidesDateChanges = (name, date) => {
    this.setState({
      peptides: {
        ...this.state.peptides,
        [name]: {
          ...this.state.peptides[name],
          date: date,
        },
      },
    });
  };
  isAllLabSamplesAssignedForVerify = () => {
    if (this.state.basicInfo?.designActivity == null) {
      return true;
    }

    const verifyStatus = String(
      this.state.basicInfo?.designActivity?.verifyStatus
    ).toLowerCase();
    const started = "Started".toLowerCase();
    const completed = "Completed".toLowerCase();
    // console.log(this.state.LabsStatusMap)
    // if (this.state.paymentType == 'y') {
    // let dataResult = this.state?.specimenLabsMap.every((value) => value)
    let labresultdata = this.state?.LabsStatusMap.every(
      (value) => value === true
    );

    // alert(dataResult)

    // return !dataResult
    if (
      labresultdata
      // && this.state.basicInfo?.designOrderStatus?.paymentReceived
    ) {
      return verifyStatusConditon();
    } else {
      return true;
    }
    // } else {
    //     return verifyStatusConditon()
    // }

    function verifyStatusConditon() {
      if (verifyStatus == started || verifyStatus == completed) {
        return true;
      } else {
        return false;
      }
    }
  };

  isAllLabSamplesAssignedForProcess = () => {
    // if (this.state.paymentType == 'y') {
    //   const dataResult = this.state.specimenLabsMap.every((value) => value)
    //   return dataResult
    // } else {
    // console.log(this.isAllLabSamplesAssignedForVerify(), "ggggggggggggggggggggggg")
    const verifyStatus = String(
      this.state.basicInfo?.designActivity?.verifyStatus
    ).toLowerCase();
    const completed = "Completed".toLowerCase();
    const warning = "warning".toLowerCase();
    if (verifyStatus == completed || verifyStatus == warning) {
      return false;
    } else {
      return true;
    }
    // }
  };

  isPeptidesCheked = (name) => {
    try {
      return this.state.peptides[name].checked;
    } catch (error) {
      return false;
    }
  };
  getPeptidesDate = (name) => {
    try {
      return this.state.peptides[name].date || "";
    } catch (error) {
      return "";
    }
  };
  handlePmrSentToClinicSUbmit = (isUpdate) => {
    return new Promise(async (resolve) => {
      try {
        const apiroute = window.$APIPath;
        let url = "";

        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        let x = new Date(this.state.peptides.pmrSentToClinic.date);
        let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
        let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
        x.setHours(hoursDiff);
        x.setMinutes(minutesDiff);
        let data = {};
        if (isUpdate) {
          url = apiroute + "/api/BE_DesignOrder/UpdatePMRSentToClinic";
          data = JSON.stringify({
            id: Number(this.state.basicInfo?.peptideStatus?.designOrderId),
            statusUpdatedDate: x,
            statusUpdatedBy: uid,
          });
        } else {
          url = apiroute + "/api/BE_DesignOrder/CreateDesignOrder";

          data = {
            patientId: Number(this.state.patientId),
            patientAccessionId: Number(this.state.PatientAccessionId),
            createdBy: uid,
            statusUpdatedDate: x,
          };
        }
        await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        toast.success(
          "PMR sent to clinic. Waiting for the Clinic to send the PMR to Pharmacy"
        );
        resolve(true);
      } catch (error) {
        toast.error("Error while updating");
        resolve(true);
      }
    });
  };
  handleClinicSentPmrToPharmacy = () => {
    return new Promise(async (resolve) => {
      try {
        const apiroute = window.$APIPath;
        const url =
          apiroute + "/api/BE_DesignOrder/UpdateClinicSendPMRToPharmacy";
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        // let data = {
        //   patientId: Number(this.state.patientId),
        //   patientAccessionId: Number(this.state.PatientAccessionId),
        //   createdBy: uid,
        //   "statusUpdatedDate": this.state.peptides.pmrSentToClinic.date
        // }
        let x = new Date(this.state.peptides.clinicSentPmrToPharmacy.date);
        let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
        let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
        x.setHours(hoursDiff);
        x.setMinutes(minutesDiff);
        let data = {
          id: this.state?.basicInfo.peptideStatus?.designOrderId, //design order id
          statusUpdatedDate: x,
          statusUpdatedBy: uid,
        };
        await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        toast.success("PMR sent to Pharmacy");
        resolve(true);
      } catch (error) {
        toast.error("Error while updating");
        resolve(true);
      }
    });
  };
  handlePeptidesReceviedByclinic = () => {
    return new Promise(async (resolve) => {
      try {
        const apiroute = window.$APIPath;
        const url =
          apiroute + "/api/BE_DesignOrder/UpdatePeptidesReceivedByClinic";
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        let x = new Date(this.state.peptides.peptidesReceivedByClinic.date);
        let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
        let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
        x.setHours(hoursDiff);
        x.setMinutes(minutesDiff);
        // let data = {
        //   patientId: Number(this.state.patientId),
        //   patientAccessionId: Number(this.state.PatientAccessionId),
        //   createdBy: uid,
        //   "statusUpdatedDate": this.state.peptides.pmrSentToClinic.date
        // }
        let data = {
          id: this.state?.basicInfo?.peptideStatus?.designOrderId, //design order id
          statusUpdatedDate: x,
          statusUpdatedBy: uid,
        };
        await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        toast.success("Peptides Received By Clinic");
        resolve(true);
      } catch (error) {
        toast.error("Error while updating");
        resolve(true);
      }
    });
  };
  isPeptidesDisabled = (name) => {
    try {
      // console.log({ name, con: this.state.basicInfo.peptideStatus[name] })
      if (
        name == "pmrSendToCilnic" &&
        this.state.basicInfo.peptideStatus == null
      ) {
        // alert(name)

        return false;
      } else return this.state.basicInfo.peptideStatus[name];
    } catch (error) {
      return false;
    }
  };
  handlePeptidesTreatmentStarted = () => {
    return new Promise(async (resolve) => {
      try {
        const apiroute = window.$APIPath;
        const url = apiroute + "/api/BE_DesignOrder/UpdateTreatmentStarted";
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        // let data = {
        //   patientId: Number(this.state.patientId),
        //   patientAccessionId: Number(this.state.PatientAccessionId),
        //   createdBy: uid,
        //   "statusUpdatedDate": this.state.peptides.pmrSentToClinic.date
        // }
        let x = new Date(this.state.peptides.treatMentStarted.date);
        let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
        let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
        x.setHours(hoursDiff);
        x.setMinutes(minutesDiff);
        let data = {
          id: this.state?.basicInfo.peptideStatus?.designOrderId, //design order id
          statusUpdatedDate: x,
          statusUpdatedBy: uid,
        };
        await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        toast.success("Treatment Started");
        resolve(true);
      } catch (error) {
        toast.error("Error while updating");
        resolve(true);
      }
    });
  };
  filter = (e) => {
    if (e.key == "Enter") {
      const target = e.target;
      const value = target.value;

      this.getLaboratoryData(value);
    }
  };

  //add disease
  handleCloseDisease = () => {
    this.setState({
      showdisease: false,
      callPipeline: false,
      recallPipeline: false,
      handleMetastasis: this.state.diseases?.isMetastasis == true ? "yes" : "no",
      allTissues: [],
      diseaseNameforReportUse:
        this.state.basicInfo?.patientDisease?.[0]?.diseaseDisplayName,
      errors: {
        ...this.state.errors,
        tissue: "",
        diseaseId: "",
      },
    });
  };
  handleCloseUploadFile = () => {
    this.setState({
      UploadFileFor: "",
      reportType: 0,
      file: {},
      UploadFile: false,
      uploadError: "",
    });
  };
  handleShowUploadFile = (name, reporttype) => {
    this.setState({
      UploadFileFor: name,
      reportType: reporttype,
      UploadFile: true,
      file: {},
      uploadError: "",
    });
  };

  filesUploadReportFile() {
    // alert(1)
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    let url = apiroute + "/api/BE_PatientReport/UploadPatientReportFile";
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId == null ? 0 : userToken.userId;
    let basicInfo = this.state.basicInfo;
    let formData = new FormData();
    formData.append("file", this.state.file);
    // let data = {
    //   // file: this.state.file,
    //   // this.state.patientId
    //   patientId: this.state?.patientId,
    //   // this.state.PatientAccessionId
    //   patientAccessionId: this.state?.PatientAccessionId,
    //   // userId
    //   userId: userId,
    //   // patientaccessionmapping?.accessionNo?.replace(/-/g, "")
    //   accessionNo: this.state?.patientaccessionmapping?.accessionNo?.replace(/-/g, ""),
    //   patientName: `${basicInfo.firstName != null
    //     ? basicInfo.firstName
    //     : ""} ${basicInfo.lastName != null
    //       ? basicInfo.lastName
    //       : ""}`,
    //   disease: this.state?.diseasecategory,
    //   // basicInfo.email
    //   email: basicInfo?.email,
    //   reportType: this.state?.reportType,
    // }
    let data = {
      id: this.state?.patientId,
      pId: this.state?.PatientAccessionId,
      rptType: this.state?.reportType,
    };
    Object.keys(data).forEach((e) => {
      formData.append(e, data[e]);
    });

    axiosInstance
      .post(url, formData, {})
      .then((result) => {
        // console.log(result)
        if (result.data.status) {
          toast.success("File Uploaded!");

          this.setState(
            {
              UploadFile: false,
              uploadError: "",
              file: {},
            },
            () => {
              this.getData(this.state.patientId, this.state.PatientAccessionId);
            }
          );
        } else {
          toast.error("Error while uploading file ");
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
          uploadError: error.msg,
          file: {},
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  handleCloseDeleteFile = () => {
    this.setState({
      deleteFileModel: false,
      deleteUserId: 0,
    });
  };
  handleShowDeleteFile = (id) => {
    this.setState({
      // deleteFileFor: name,
      deleteFileModel: true,
      deleteUserId: id,
    });
  };

  handleShowFREmailModal = (e, fileType) => {
    this.setState({
      // deleteFileFor: name,
      showFRMailModal: true,
      finalReport: e,
      finalReportId_Email: e.id,
      finalReportType_Email: fileType

    });
  };

  DeleteReportfile() {
    // this.setState({ loading: true });
    const apiroute = window.$APIPath;
    let id = this.state?.deleteUserId;
    const url =
      apiroute + "/api/BE_PatientReport/DeletePatientReportFile?id=" + id;
    // alert(String(id))
    // let data = {
    //   id: id,
    // }
    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState({
            loading: false,
            deleteFileModel: false,
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message
          });
          toast.success(result.data.message);
          this.getData(this.state.patientId, this.state.PatientAccessionId);

          // const param = this.props.match.params;

          // if (param.id != undefined) {
          //   this.getData(param.id);
          // }
        }
      })
      .catch((error) => {
        //console.log(error);
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Error',
        //   modalBody: error.message
        // });
        toast.error(error.message);
        this.setState({ loading: false, authError: true, error: error });
      });
  }

  handleShowDisease = (
    callPipeline = false,
    recallPipeline = false,
    redirectUpdate = false
  ) => {
    let diseasData = [...this.state.Alldiseases];
    diseasData.unshift({ id: 0, name: "Other" });

    var nameObject = diseasData.filter(
      (obj) => obj.diseaseCatId == this.state.currentDiseaseCategoryId
    );
    // alert(`${nameObject.length}+ ${this.state.currentDiseaseCategoryId}`)
    this.setState(
      {
        currentDiseaseName: this.state.defaultSelectedDiseaseName,
        tissueName: this.state?.defaultTissueName,
        showdisease: true,
        dieseasData: diseasData,
        diseaseId: this.state.currentDiseaseId,
        Tissue: this.state.currentTissue,
        callPipeline,
        recallPipeline,
        redirectUpdate,

        // diseasUpdateHeaderTxt: headerTxt || "Update Disease",
        // diseasUpdateBtnTxt: btnTxt || "Update"
      },
      () => {
        this.getTissueData(this.state.currentDiseaseId);
      }
    );
  };

  // handleShowDisease = (callPipeline = false, recallPipeline = false, redirectUpdate = false) => {
  //   let diseasData = this.state.Alldiseases
  //   var nameObject = diseasData.filter((obj) => obj.diseaseCatId == this.state.currentDiseaseCategoryId)
  //   // alert(`${nameObject.length}+ ${this.state.currentDiseaseCategoryId}`)
  //   this.setState({
  //     showdisease: true,
  //     dieseasData: nameObject,
  //     diseaseId: this.state.currentDiseaseId,
  //     Tissue: this.state.currentTissue,
  //     callPipeline,
  //     recallPipeline,
  //     redirectUpdate
  //     // diseasUpdateHeaderTxt: headerTxt || "Update Disease",
  //     // diseasUpdateBtnTxt: btnTxt || "Update"
  //   }, () => {

  //     this.getTissueData(this.state.currentDiseaseId)

  //   });
  // };

  handleShowDiseaseDescription = () => {
    let DiseaseDescData =
      this?.state?.basicInfo?.patientAccessionMapping?.diseaseDesc;

    this.setState({
      showdiseaseDescription: true,
      DiseaseDescData: DiseaseDescData,
    });
  };
  handleCloseDiseaseDescription = () => {
    this.setState({
      showdiseaseDescription: false,
      DiseaseDescData: "",
    });
  };

  // handleDiseaseInputChange(event) {
  //   const target = event.target;
  //   const value = target.value;
  //   const name = target.name;

  //   // this.setState({
  //   //   [name]: value,
  //   // });

  //   // console.log(`value`, value);
  //   let errors = this.state.errors;
  //   if (name == 'diseaseId') {
  //     if (value) {
  //       this.getTissueData(value, "")

  //     } else {
  //       this.setState({ allTissues: [] })
  //     }
  //   }
  //   switch (name) {
  //     case "diseaseId":
  //       errors.diseaseId = !value ? "Please select disease." : "";
  //       break;
  //     case "Tissue":
  //       errors.tissue = !value ? "Please select Tissue." : "";
  //       break;
  //     default:
  //       //(!value) ? '' :'This standard is required.'
  //       break;
  //   }

  //   this.setState({ errors, [name]: value },);
  // }
  handleDiseaseInputChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    let errors = this.state.errors;
    errors.newDisease = "";

    if (name == "diseaseId") {
      value = !isNaN(value) ? String(value) : value;
      this.setState({
        Tissue: "",
        newDisease: "",
        updateDiseaseTo: this.state.currentDiseaseName,
        currentDiseaseName: target?.diseaseName,
        tissueName: "",
        updateDisease: target?.updateDisease,
        diseaseNameforReportUse:
          this.state.Alldiseases?.filter(
            (data) => data.id == event.target.value
          )[0]?.displayname || event.target.diseaseName,
      });
    }

    if (name === "Tissue") {
      this.setState({
        tissueName: target.tissueName,
      });
    }

    // console.log(`value`, value);
    if (name == "diseaseId") {
      if (value) {
        this.getTissueData(value, "");
      } else {
        this.setState({ allTissues: [] });
      }
    }
    switch (name) {
      case "diseaseId":
        errors.diseaseId = !value ? "Please select disease." : "";
        break;
      case "Tissue":
        errors.tissue = !value ? "Please select tissue." : "";
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }

    this.setState({ errors, [name]: value });
  }
  getTissueData(DiseaseId, TissueId) {
    const apiroute = window.$APIPath;
    let url = "";

    // const url = apiroute + "/api/BE_Tissue/GetDRPAllByDiseaseId";
    if (DiseaseId == 0) {
      url = apiroute + "/api/BE_Tissue/GetDRPAll";
    } else {
      // const url = apiroute + "/api/BE_Tissue/GetDRPAll";
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
          //console.log(result.data);
          this.setState({ allTissues: result.data.outdata });
          // if (this.state.allTissues[0]) {
          // let alltissue = this.state.allTissues[0]?.id
          // alert()
          // this.setState({
          //   Tissue: this.state.allTissues?.[0]?.id || null
          // })
          // }
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  AddPatientDisease(e) {
    // e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (
      this.state.diseaseId != null &&
      this.state.diseaseId != "" &&
      this.state.Tissue != "" &&
      this.state.Tissue != null
    ) {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_PatientDisease/UpdatePatientDisease";
      let data = {
        patientDiseaseId: Number(this.state?.patientdiseaseId),
        PatientId: parseInt(this.state.patientId),
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
        diseaseCategoryId: Number(this.state?.currentDiseaseCategoryId),
        diseaseId: Number(this.state?.diseaseId),
        isMetastasis: this.state.handleMetastasis == "yes" ? true : false,
        tissueId:
          this.state.Tissue === null ? null : Number(this.state?.Tissue),
        // "newDisease":this.state.newDisease,
        updatedBy: uid,
      };
      // let data = JSON.stringify({
      //   PatientId: parseInt(this.state.patientId),
      //   DiseaseId: parseInt(this.state.patientdiseaseId),
      //   PatientDiseaseId: 0,
      //   createdBy: uid,
      //   createdByFlag: "A",
      //   PatientAccessionId: parseInt(this.state.PatientAccessionId),
      // });

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
                // modal: !this.state.modal,
                // modalTitle: 'Success',
                // modalBody: result.data.message,
                currentDiseaseName: "",
                loading: false,
                showdisease: false,
                newDisease: "",
                updateDisease: false,
                NewOtherDiseaseId: 0,
              },
              () => {
                // alert(`${this.state.callPipeline}`)
                this.getDiseaseData();
                this.getData(
                  this.state.patientId,
                  this.state.PatientAccessionId
                );
                if (this.state.callPipeline) {
                  this.callPipeLine().then(() => { });
                }
                if (this.state.recallPipeline) {
                  this.reCallPipeLine(
                    this.state.basicInfo?.designActivity?.designActivityId
                  );
                }
              }
            );
            if (this.state.redirectUpdate) {
              this.props.history.push({
                // pathname: `/patientactivity/designactivities/report/${this.state.patientId}/${this.state.PatientAccessionId}/`,
                pathname: `/patients/patientReport/${this.state.patientId}/${this.state.PatientAccessionId}`,


                state: {
                  redirectTo: `/patients/info/${this.state.patientId}/${this.state.PatientAccessionId}`,
                },
              });
            }
            if (
              this.state.callPipeline == false &&
              this.state.recallPipeline == false &&
              this.state.redirectUpdate == false
            )
              toast.success(result.data.message);
          } else {
            errors.patientdiseaseId = result.data.message;
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
        });
    } else {
      if (
        this.state.patientdiseaseId != null ||
        this.state.patientdiseaseId != ""
      ) {
        errors.patientdiseaseId = "Please select disease.";
      }
      if (this.state.Tissue != "" || this.state.Tissue != null) {
        errors.tissue = "Please select tissue.";
      }

      this.setState({ loading: false });
    }
  }

  // AddPatientDisease(e) {
  //   e.preventDefault();
  //   this.setState({ loading: true });
  //   let errors = this.state.errors;

  //   let uid = 0;
  //   var userToken = JSON.parse(localStorage.getItem("AUserToken"));
  //   if (userToken != null) {
  //     uid = userToken.userId == null ? 0 : userToken.userId;
  //   }

  //   if (
  //     this.state.diseaseId != null &&
  //     this.state.diseaseId != "" &&
  //     this.state.Tissue != "" &&
  //     this.state.Tissue != null
  //   ) {
  //     const apiroute = window.$APIPath;
  //     let url = apiroute + "/api/BE_PatientDisease/UpdatePatientDisease";
  //     let data = {
  //       "patientDiseaseId": Number(this.state?.patientdiseaseId),
  //       PatientId: parseInt(this.state.patientId),
  //       PatientAccessionId: parseInt(this.state.PatientAccessionId),
  //       "diseaseCategoryId": Number(this.state?.currentDiseaseCategoryId),
  //       "diseaseId": Number(this.state?.diseaseId),
  //       "tissueId": this.state.Tissue === null ? null : Number(this.state?.Tissue),
  //       "updatedBy": uid
  //     }
  //     // let data = JSON.stringify({
  //     //   PatientId: parseInt(this.state.patientId),
  //     //   DiseaseId: parseInt(this.state.patientdiseaseId),
  //     //   PatientDiseaseId: 0,
  //     //   createdBy: uid,
  //     //   createdByFlag: "A",
  //     //   PatientAccessionId: parseInt(this.state.PatientAccessionId),
  //     // });

  //     axiosInstance
  //       .post(url, data, {
  //         headers: {
  //           "Content-Type": "application/json; charset=utf-8",
  //         },
  //       })
  //       .then((result) => {
  //         if (result.data.flag) {
  //           this.setState(
  //             {
  //               // modal: !this.state.modal,
  //               // modalTitle: 'Success',
  //               // modalBody: result.data.message,
  //               loading: false,
  //               showdisease: false,

  //             }, () => {
  //               // alert(`${this.state.callPipeline}`)
  //               this.getData(this.state.patientId, this.state.PatientAccessionId)
  //               if (this.state.callPipeline) {
  //                 this.callPipeLine().then(() => {

  //                 })

  //               }
  //               if (this.state.recallPipeline) {
  //                 this.reCallPipeLine(this.state.basicInfo?.designActivity?.designActivityId)
  //               }
  //             });
  //           if (this.state.redirectUpdate) {

  //             this.props.history.push({
  //               pathname: `/patientactivity/designactivities/report/${this.state.patientId}/${this.state.PatientAccessionId}/`,

  //               state: { redirectTo: `/patients/info/${this.state.patientId}/${this.state.PatientAccessionId}` }
  //             })
  //           }
  //           if (this.state.callPipeline == false && this.state.recallPipeline == false && this.state.redirectUpdate == false) toast.success(result.data.message);
  //         } else {
  //           errors.patientdiseaseId = result.data.message;
  //           this.setState({ loading: false });
  //         }
  //       })
  //       .catch((error) => {
  //         this.setState({
  //           loading: false,
  //         });
  //       });
  //   } else {
  //     if (this.state.patientdiseaseId != null ||
  //       this.state.patientdiseaseId != "") {
  //       errors.patientdiseaseId = "Please select disease.";

  //     }
  //     if (this.state.Tissue != "" ||
  //       this.state.Tissue != null) {
  //       errors.tissue = "Please select tissue."
  //     }

  //     this.setState({ loading: false });
  //   }
  // }

  //end add disease

  UpdatePatientDiseaseDescription(e) {
    e.preventDefault();
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    const apiroute = window.$APIPath;
    const param = this.props.match.params;

    // let url = apiroute + "/api/BE_PatientNotes/Update";
    let url = apiroute + "/api/BE_Patient/UpdateDiseaseDesc";
    let data = JSON.stringify({
      diseaseDesc: this.state?.DiseaseDescData,
      aId: parseInt(param.aid),
      pId: parseInt(param.id),
      // "notesTitle": this.state.note_title,
      // "notes": this.state.inputTextforNotes.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, " "),
      // "notes": this.state.inputTextforNotes,
      // "assignedToUserId": parseInt(this.state.assignUserId),
      // "sectionId": parseInt(this.state.sectionId),
      // "notifyToUserIds": "5",
      uId: parseInt(userToken.userId),
    });

    // console.log("EditData", data)
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
            DiseaseDescData: "",
          });

          toast.success("Disease Description updated successfully.");
          this.handleCloseDiseaseDescription();

          this.getData(param.id, param.aid);

          // this.props.history.push("/patients/list");
        } else {
          this.setState({
            loading: false,
          });
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.message);
      });
  }
  // custom samples

  //add Sample
  handleSampleInputChange(event) {
    // debugger;
    if (event != null) {
      let nCheckbox = this.state.checkbox.slice(); // create a new copy of state value
      // console.log(nCheckbox, "bhbjjjjjjjjjjjjjjj");
      if (this.isValueExist(nCheckbox, event.target.value)) {
        // check if the same value is preexisted in the array
        //const index = nCheckbox.indexOf(event.target.value);
        const index = nCheckbox.findIndex(
          (e) => e.sampleTypeId == event.target.value
        );
        nCheckbox.splice(index, 1); // removing the preexciting value
      } else {
        let objSample = {
          sampleTypeId: parseInt(event.target.value),
          sampleType: "",
          sampleDate: "",
        };
        nCheckbox.push(objSample); // inserting the value of checkbox in the array
      }
      this.setState({
        checkbox: nCheckbox,
        patientSampleId: nCheckbox?.map((item) => item.sampleTypeId).join(", "), //nCheckbox.join(',')
      });
    }
  }

  handleSampleDateChange = (date, id) => {
    // debugger;

    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    //console.log(newDate);

    let nCheckbox = this.state.checkbox.slice();
    const index = nCheckbox.findIndex((e) => e.sampleTypeId == id);

    nCheckbox[index].sampleDate = newDate.toISOString();
    this.setState({ checkbox: nCheckbox });
    // console.log(this.state.checkbox);
  };
  convertDate = (date) => {
    try {
      let newDate = new Date(date);
      // newDate.setDate(newDate.getDate() + 1);
      return newDate || "";
    } catch (error) {
      return "";
    }
  };
  //edit time set checkbox selected
  setCheckbox(id) {
    // debugger;
    let nCheckbox = this.state.checkbox.slice(); // create a new copy of state value
    if (this.isValueExist(nCheckbox, id)) {
      // check if the same value is preexisted in the array
      return true;
    } else {
      return false; // inserting the value of checkbox in the array
    }
  }

  isValueExist(data, event) {
    // debugger;
    if (data.length == 0) {
      return false;
    }
    for (let i = 0; i < data.length; i++) {
      if (event == data[i].sampleTypeId) {
        return true;
      }
    }
    return false;
  }
  /**
   * @param {{[x]:[{[x]:any}]}} data
   * @param {string} parent
   * @param {number} child
   * @param {string|number} sampleTypeId
   * @returns {true|undefined}
   * @description pure function to check if the value exist for the given input
   * @todo: changes are required after intigreting api
   */
  isRequired = (data, parent, child, sampleTypeId) => {
    // return data[parent][child].date?.length;
    // console.log({ parent, child, found: data[parent][child] });
    // return 0;
    if (parent in data) {
      if (child in data[parent]) {
        if ("date" in data[parent][child]) {
          // console.log(data[parent][child], { parent, child });
          return (
            _.isEmpty(data[parent][child].date) &&
            this.setCheckbox(sampleTypeId)
          );
        }
      }
    }
  };

  /**
   *
   * @param {string} parent
   * @param {number} child
   * @param {React<ChangeEvent>} e
   * @param {string|number} sampleTypeId
   * @updates  `this.state.NewSamples`
   */
  setNewSampleDateValue = (parent, child, value) => {
    let clone = _.cloneDeep(this.state.NewSamples);
    clone[parent][child].date = value ? new Date(value).toISOString() : value;
    this.setState({ NewSamples: clone });
  };
  /**
   *
   * @param {string} parent
   * @param {number} childIndex
   * @returns {String} -if not found it will return empty string to handle DatePicker
   */
  getnewSampleDateValue = (parent, childIndex) => {
    let state = this.state.NewSamples;
    if (parent in state) {
      // check if given child index has that much of length in array
      if (state[parent].length >= childIndex) {
        // alert("in childIndex");
        if ("date" in state[parent][childIndex]) {
          let foundValue = state[parent][childIndex].date;
          // console.log({ foundValue });
          // if (foundValue.length) alert(foundValue);
          // alert(foundValue);
          // return foundValue;
          return foundValue?.length > 0 ? new Date(foundValue) : "";
        } else return "";
      } else return "";
    } else return "";
  };
  getDate(id) {
    // debugger;
    let data = this.state.checkbox;
    if (data.length == 0) {
      return "";
    } else {
      let objData = data.filter((e) => e.sampleTypeId == id);
      if (objData.length > 0 && objData[0].sampleDate?.length) {
        // console.log(objData[0]?.sampleDate);
        // console.log(
        //   new Date(
        //     Moment(objData[0]?.sampleDate.slice(0, 10), "YYYY-MM-DD").format(
        //       "MM/DD/YYYY"
        //     )
        //   )
        // );
        let returnVal = new Date(
          Moment(objData[0]?.sampleDate.slice(0, 10), "YYYY-MM-DD").format(
            "MM/DD/YYYY"
          )
        );

        return returnVal;
      } else {
        return "";
      }
    }
  }

  AddPatientSample(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }
    if (
      this.state.patientSampleId != null &&
      this.state.patientSampleId != ""
    ) {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_PatientSample/Save";

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
        //SampleTypeIds: this.state.patientSampleId,
        patientSample: this.state.checkbox,
        createdBy: uid,
        createdByFlag: "A",
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
            this.setState(
              {
                // modal: !this.state.modal,
                // modalTitle: 'Success',
                // modalBody: result.data.message,
                loading: false,
                patientSampleId: "",
              },
              this.getData(this.state.patientId, this.state.PatientAccessionId)
            );
            toast.success(result.data.message);
          } else {
            errors.patientSampleId = result.data.message;
            this.setState({ loading: false });
          }
        })
        .catch((modalBody) => {
          this.setState({
            // modal: !this.state.modal, modalTitle: 'Error', modalBody: modalBody.message,
            loading: false,
          });
          toast.error(modalBody.message);
        });
    } else {
      errors.patientSampleId = "Please select sample.";
      this.setState({ loading: false });
    }
  }
  //end add Sample

  //add practitioner
  handleClosePractitioner = () => {
    this.setState({
      showpractitioner: false,
    });
  };

  handleShowPractitioner = () => {
    this.setState({
      showpractitioner: true,
    });
  };

  handlePractitionerInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;
    if (name == "practitionerSearch") {
      if (value != "") {
        const lowerCased = value.toLowerCase();
        let filterpractioner = this.state.allpractitioners.filter(
          (ml) =>
            ml.firstName.toLowerCase().includes(lowerCased) ||
            ml.lastName.toLowerCase().includes(lowerCased) ||
            ml.email.toLowerCase().includes(lowerCased) ||
            ml.mobile === value
        );
        this.setState({
          filteredpractitioners: filterpractioner,
        });
      } else {
        this.setState({
          filteredpractitioners: this.state.allpractitioners,
        });
      }
    }

    switch (name) {
      case "practitionerId":
        errors.practitionerId = !value ? "Please select practitioner." : "";
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => { });
  }

  AddPatientPractitioner(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (this.state.practitionerId != null && this.state.practitionerId != "") {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_PractitionerPatient/Save";

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        PractitionerId: parseInt(this.state.practitionerId),
        PatientPractitionerId: 0,
        createdBy: uid,
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
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
                // modal: !this.state.modal,
                // modalTitle: 'Success',
                // modalBody: result.data.message,
                loading: false,
                showpractitioner: false,
                practitionerId: "",
              },
              this.getData(this.state.patientId, this.state.PatientAccessionId)
            );
            toast.success(result.data.message);
          } else {
            errors.practitionerId = result.data.message;
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
        });
    } else {
      errors.practitionerId = "Please select practitioner.";
      this.setState({ loading: false });
    }
  }

  deletePractitionerPatient(e, id) {
    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;
    // console.log(id)
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      apiroute +
      "/api/BE_PractitionerPatient/DeletePatient?id=" +
      id +
      "&userId=" +
      userId +
      "";

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
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message
            },
            this.getData(this.state.patientId, this.state.PatientAccessionId)
          );
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
        }
      })
      .catch((error) => {
        //console.log(error);
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Error',
        //   modalBody: error.message
        // });
        toast.error(error.message);
        this.setState({ authError: true, error: error });
      });
    this.setState({ loading: false });
  }
  //end add practitioner

  //add institute
  handleCloseInstitute = () => {
    this.setState({
      showinstitute: false,
    });
  };

  handleShowInstitute = () => {
    this.setState({
      showinstitute: true,
    });
  };

  handleInstituteInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;
    if (name == "instituteSearch") {
      if (value != "") {
        const lowerCased = value.toLowerCase();
        let filterpractioner = this.state.allinstitutes.filter(
          (ml) =>
            ml.instituteName.toLowerCase().includes(lowerCased) ||
            ml.email.toLowerCase().includes(lowerCased) ||
            ml.mobile === value
        );
        this.setState({
          filteredinstitutes: filterpractioner,
        });
      } else {
        this.setState({
          filteredinstitutes: this.state.allinstitutes,
        });
      }
    }

    switch (name) {
      case "instituteId":
        errors.instituteId = !value ? "Please select institute." : "";
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => { });
  }

  AddPatientInstitute(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUsertoken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (this.state.instituteId != null && this.state.instituteId != "") {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_InstitutePatient/SaveMapping";

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        InstituteId: parseInt(this.state.instituteId),
        PatientInstituteId: 0,
        createdBy: uid,
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
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
                // modal: !this.state.modal,
                // modalTitle: 'Success',
                // modalBody: result.data.message,
                loading: false,
                showinstitute: false,
                instituteId: "",
              },
              this.getData(this.state.patientId, this.state.PatientAccessionId)
            );
            toast.success(result.data.message);
          } else {
            errors.instituteId = result.data.message;
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
        });
    } else {
      errors.instituteId = "Please select institute.";
      this.setState({ loading: false });
    }
  }

  deleteInstitutePatient(e, id) {
    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      apiroute +
      "/api/BE_InstitutePatient/DeletePatient?id=" +
      id +
      "&userId=" +
      userId +
      "";

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
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message
            },
            this.getData(this.state.patientId, this.state.PatientAccessionId)
          );
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
        }
      })
      .catch((error) => {
        //console.log(error);
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Error',
        //   modalBody: error.message
        // });
        toast.error(error.message);
        this.setState({ authError: true, error: error });
      });
    this.setState({ loading: false });
  }
  //end add institute
  handleClosePiplineCancle = () => {
    this.setState({
      canclePiplinemodal: false,
    });
  };

  handleShowPiplineCancle = () => {
    this.setState({
      canclePiplinemodal: true,
    });
  };

  handleClosePiplineStop = () => {
    this.setState({
      stopPipelinemodal: false,
    });
  };

  handleShowPiplineStop = () => {
    this.setState({
      stopPipelinemodal: true,
    });
  };
  //add ngslaboratory
  handleClosengsLaboratory = () => {
    this.setState({
      showngslaboratory: false,
    });
  };

  handleShowngsLaboratory = () => {
    this.setState({
      showngslaboratory: true,
    });
  };

  handlengsLaboratoryInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;
    if (name == "ngslaboratorySearch") {
      if (value != "") {
        const lowerCased = value.toLowerCase();
        let filterpractioner = this.state.allngslaboratorys.filter(
          (ml) =>
            ml.ngsLabName.toLowerCase().includes(lowerCased) ||
            ml.email.toLowerCase().includes(lowerCased) ||
            ml.mobile === value
        );
        this.setState({
          filteredngslaboratorys: filterpractioner,
        });
      } else {
        this.setState({
          filteredngslaboratorys: this.state.allngslaboratorys,
        });
      }
    }

    switch (name) {
      case "ngslaboratoryId":
        errors.ngslaboratoryId = !value ? "Please select ngslaboratory." : "";
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => { });
  }

  AddPatientngsLaboratory(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUsertoken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (
      this.state.ngslaboratoryId != null &&
      this.state.ngslaboratoryId != ""
    ) {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_NGSLaboratoryPatient/Save";

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        NGSLaboratoryId: parseInt(this.state.ngslaboratoryId),
        NGSLaboratoryPatientId: 0,
        createdBy: uid,
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
      });
      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          // console.log(result);
          if (result.data.flag) {
            this.setState(
              {
                // modal: !this.state.modal,
                // modalTitle: 'Success',
                // modalBody: result.data.message,
                loading: false,
                showngslaboratory: false,
                ngslaboratoryId: "",
              },
              this.getData(this.state.patientId, this.state.PatientAccessionId)
            );
            toast.success(result.data.message);
          } else {
            errors.ngslaboratoryId = result.data.message;
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
        });
    } else {
      errors.ngslaboratoryId = "Please select ngslaboratory.";
      this.setState({ loading: false });
    }
  }

  deleteLabPatient(e, id) {
    //e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      apiroute +
      "/api/BE_NGSLaboratoryPatient/DeletePatient?id=" +
      id +
      "&userId=" +
      userId +
      "";

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
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message
            },
            this.getData(this.state.patientId, this.state.PatientAccessionId)
          );
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
        }
      })
      .catch((error) => {
        //console.log(error);
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Error',
        //   modalBody: error.message
        // });
        toast.error(error.message);
        this.setState({ authError: true, error: error });
      });
    this.setState({ loading: false });
  }
  //end add ngslaboratory

  //add manufacture
  handleCloseManufacture = () => {
    this.setState({
      showmanufacture: false,
    });
  };

  handleShowManufacture = () => {
    this.setState({
      showmanufacture: true,
    });
  };

  handleManufactureInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;
    if (name == "manufactureSearch") {
      if (value != "") {
        const lowerCased = value.toLowerCase();
        let filterpractioner = this.state.allmanufactures.filter(
          (ml) =>
            ml.companyName.toLowerCase().includes(lowerCased) ||
            ml.email.toLowerCase().includes(lowerCased) ||
            ml.mobile === value
        );
        this.setState({
          filteredmanufactures: filterpractioner,
        });
      } else {
        this.setState({
          filteredmanufactures: this.state.allmanufactures,
        });
      }
    }

    switch (name) {
      case "manufacturerId":
        errors.manufacturerId = !value ? "Please select manufacture." : "";
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => { });
  }

  AddPatientManufacture(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUsertoken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (this.state.manufacturerId != null && this.state.manufacturerId != "") {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_ManufacturerPatient/Save";

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        ManufacturerId: parseInt(this.state.manufacturerId),
        PatientManufactureId: 0,
        createdBy: uid,
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
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
                // modal: !this.state.modal,
                // modalTitle: 'Success',
                // modalBody: result.data.message,
                loading: false,
                showmanufacture: false,
                manufacturerId: "",
              },
              this.getData(this.state.patientId, this.state.PatientAccessionId)
            );
            toast.success(result.data.message);
          } else {
            errors.manufacturerId = result.data.message;
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
        });
    } else {
      errors.manufacturerId = "Please select manufacture.";
      this.setState({ loading: false });
    }
  }

  deleteManufacturerPatient(e, id) {
    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      apiroute +
      "/api/BE_ManufacturerPatient/DeletePatient?id=" +
      id +
      "&userId=" +
      userId +
      "";

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
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message
            },
            this.getData(this.state.patientId, this.state.PatientAccessionId)
          );
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
        }
      })
      .catch((error) => {
        //console.log(error);
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Error',
        //   modalBody: error.message
        // });
        toast.error(error.message);
        this.setState({ authError: true, error: error });
      });
    this.setState({ loading: false });
  }
  //end add manufacture

  //add diagnostic
  handleCloseDiagnostic = () => {
    this.setState({
      showdiagnostic: false,
      showdiagnosticerror: " ",
      outcome: "",
      diagnosticAnalysis: "",
      diagnosticdocumentFile: "",
      diagnosticDate: "",
    });
    let errors = this.state.errors;
    errors.outcome = "";
    errors.diagnosticAnalysis = "";
    errors.diagnosticDate = "";
  };

  handleShowDiagnostic = () => {
    this.setState({
      showdiagnostic: true,
    });
  };

  handleDiagnosticDateChange(date) {
    let errors = this.state.errors;
    errors.diagnosticDate = !date ? "Please enter diagnostic date." : "";
    this.setState({ diagnosticDate: date });
  }

  handleDiagnosticInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;
    switch (name) {
      case "diagnosticDate":
        errors.diagnosticDate = !value ? "Please enter diagnostic date." : "";
        break;
      case "diagnosticAnalysis":
        errors.diagnosticAnalysis = !value
          ? "Please enter diagnostic analysis."
          : "";
        break;
      case "outcome":
        errors.outcome = !value ? "Please enter outcome." : "";
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => { });
  }

  VerifyData = () => {
    return new Promise(async (resolve) => {
      try {
        const apiroute = window.$APIPath;
        // let id = 0; //DesignActivityId

        let id = this.state.basicInfo?.designActivity?.designActivityId;
        // let id = 413

        // console.log("id for verify:", id)
        let url =
          apiroute +
          "/api/BE_DesignActivity/UpdateDesignActivityVerificationStarted?id=" +
          id;
        let res = await axiosInstance.get(url);
        if (res.data.flag) {
          setTimeout(
            () => { this.refreshPipelineCall(); this.setState({ disabledButton: false }) },
            10000);
          // toast.success(res.data.message)
        } else {
          toast.error(res.data.message);
        }
        resolve(true);
      } catch (error) {
        toast.error(error?.message);
        return resolve(true);
      } finally {
        const param = this.props.match.params;
        this.getData(param.id, param.aid);
        this.setState({ loading: false });
      }
    });
  };
  refreshPipelineCall = () => {
    const param = this.props.match.params;

    this.getData(param.id, param.aid);
    this.setState({
      isPipelineStatusRefreshed: true,
    });
  };
  stopPiplineCall = () => {
    const apiroute = window.$APIPath;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken?.userId == null ? 0 : userToken?.userId;
    console.log("dataaaa");
    const param = this.props.match.params;
    let jobId = this.state.basicInfo?.designActivity?.jobId;
    // return;
    let url = apiroute + "/api/BE_DesignActivity/StopDesignActivity";
    //alert(this.state.diagnosticdocumentFile)
    let data = {
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.PatientAccessionId),
      userId: userId,
    };
    axiosInstance
      .post(url, data, {
        // receive two    parameter endpoint url ,form data
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState({
            loading: false,
            stopPipelinemodal: false,
            isPipelineStatusRefreshed: false,
          });
          // this.updateDataAndRefreshPage(this.RefreshPipeLine)
          this.getData(param.id, param.aid);
          console.log(result);
        } else {
          this.setState({
            loading: false,
            stopPipelinemodal: false,
          });
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  canclePiplineCall = () => {
    const apiroute = window.$APIPath;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken?.userId == null ? 0 : userToken?.userId;
    const param = this.props.match.params;
    console.log("dataaaa");
    let jobId = this.state.basicInfo?.designActivity?.jobId;
    // return;
    let url = apiroute + "/api/BE_DesignActivity/CancleDesignActivity";
    //alert(this.state.diagnosticdocumentFile)
    let data = {
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.PatientAccessionId),
      userId: userId,
    };
    axiosInstance
      .post(url, data, {
        // receive two    parameter endpoint url ,form data
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState({
            loading: false,
            canclePiplinemodal: false,
            isPipelineStatusRefreshed: false,
          });
          this.getData(param.id, param.aid);
          console.log(result);
        } else {
          this.setState({
            loading: false,
            canclePiplinemodal: false,
          });
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  RefreshPipeLine = () => {
    return new Promise((resolve) => {
      const apiroute = window.$APIPath;
      let id = this.state.basicInfo?.designActivity?.designActivityId;
      let url =
        apiroute + "/api/BE_DesignActivity/RefreshPipelineStatus?id=" + id;
      //alert(this.state.diagnosticdocumentFile)

      axiosInstance
        .post(url, {
          // receive two    parameter endpoint url ,form data
        })
        .then((result) => {
          if (result.data.flag) {
            this.setState({
              loading: false,
              isPipelineStatusRefreshed: true,
              pipelineStarted: result.data.outdata.isPipelineStarted,
              pipelineQueued: result.data.outdata.isPipelineQueued,
            });

            console.log(result.data.outdata.isPipelineQueued);
          } else {
            this.setState({
              loading: false,
              isPipelineStatusRefreshed: false,
            });
            console.log(result.data.outdata.isPipelineQueued);
          }
        })
        .catch((error) => {
          toast.error(error.message);
          this.setState({
            isPipelineStatusRefreshed: false,
          });
        })
        .finally(() => {
          resolve();
        });
    });
  };
  callPipeLine = () => {
    return new Promise(async (resolve) => {
      try {
        const apiroute = window.$APIPath;
        // let id = 0; //DesignActivityId
        let id = this.state.basicInfo?.designActivity?.designActivityId;
        // console.log("idddd:", id)
        let url =
          apiroute +
          "/api/BE_DesignActivity/UpdateDesignActivityDesignStarted?id=" +
          id;
        let res = await axiosInstance.get(url);
        if (res.data.flag) {
          // toast.success(res.data.message)
        } else {
          toast.error(res.data.message);
        }
        resolve(true);
      } catch (error) {
        toast.error(error?.message);
        return resolve(true);
      } finally {
        const param = this.props.match.params;
        this.getData(param.id, param.aid);
        this.setState({ loading: false });
      }
    });
  };
  reCallPipeLine = (designActivityId) => {
    return new Promise(async (resolve) => {
      try {
        // console.log("sdsdsdd")
        const apiroute = window.$APIPath;

        let url =
          apiroute +
          "/api/BE_DesignActivity/RecallPipeline?id=" +
          designActivityId;
        let res = await axiosInstance.get(url);
        if (res.data.flag) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
        resolve(true);
      } catch (error) {
        toast.error(error?.message);
        return resolve(true);
      } finally {
        const param = this.props.match.params;
        this.getData(param.id, param.aid);
        this.setState({ loading: false });
      }
    });
  };
  handleDiagnosticFileInputChange(event) {
    const target = event.target;
    const value = target.files;

    this.setState({
      diagnosticdocumentFile: value,
    });
  }

  validateDiagnosticForm = (errors) => {
    let valid = true;

    if (
      this.state.diagnosticAnalysis == undefined ||
      this.state.diagnosticAnalysis == ""
    ) {
      errors.diagnosticAnalysis = "Please enter diagnostic analysis.";
    }
    if (
      this.state.diagnosticDate == undefined ||
      this.state.diagnosticDate == ""
    ) {
      errors.diagnosticDate = "Please enter diagnostic date.";
    }
    if (this.state.outcome == undefined || this.state.outcome == "") {
      errors.outcome = "Please enter outcome.";
    }
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  };

  AddPatientDiagnostic(e) {
    e.preventDefault();
    this.setState({ loading: true, showdiagnosticerror: "" });

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (this.validateDiagnosticForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_PatientDiagnostic/Save";

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        DiagnosticAnalysis: this.state.diagnosticAnalysis,
        DiagnosticDate: this.state.diagnosticDate,
        Outcome: this.state.outcome,
        PatientDiagnosticId: parseInt(0),
        createdBy: uid,
        createdByFlag: "A",
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
      });

      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            toast.success(result.data.message);
            if (this.state.diagnosticdocumentFile != "") {
              let dData = result.data.outdata;
              this.filesUploadDocDiagnostic(
                dData.patientDiagnosticId,
                result.data.message
              );
              this.setState({
                showdiagnostic: false,
                showdiagnosticerror: " ",
                outcome: "",
                diagnosticAnalysis: "",
                diagnosticdocumentFile: "",
              });
            } else {
              this.setState(
                {
                  authError: true,
                  errorType: "success",
                  error: result.data.message,
                  loading: false,
                  showdiagnostic: false,
                  diagnosticAnalysis: "",
                  diagnosticDate: "",
                  outcome: "",
                  diagnosticdocumentFile: "",
                },
                this.getData(
                  this.state.patientId,
                  this.state.PatientAccessionId
                )
              );
            }
          } else {
            toast.error(result.data.message);
            this.setState({
              loading: false,
              showdiagnosticerror: result.data.message,
            });
          }
        })
        .catch((error) => {
          toast.error(error.message);
          this.setState({
            authError: true,
            errorType: "danger",
            error: error.message,
            loading: false,
          });
        });
    } else {
      this.setState({ loading: false });
    }
  }
  DeletePatientDiagnostic(e, id) {
    // console.log(id)
    // e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      apiroute +
      "/api/BE_PatientDiagnostic/Delete?id=" +
      id +
      "&userId=" +
      userId +
      "";

    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          toast.success(result.data.message);
          this.getData(this.state.patientId, this.state.PatientAccessionId);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        this.setState({ authError: true, error: error });
      });
    this.setState({ loading: false });
  }
  DeletePatientprescription(e, id) {
    //e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      apiroute +
      "/api/BE_PatientPrescription/Delete?id=" +
      id +
      "&userId=" +
      userId +
      "";

    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          toast.success(result.data.message);
          this.getData(this.state.patientId, this.state.PatientAccessionId);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        this.setState({ authError: true, error: error });
      });
    this.setState({ loading: false });
  }
  DeletePatienttreatmentreport(e, id) {
    // e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      apiroute +
      "/api/BE_PatientTreatment/Delete?id=" +
      id +
      "&userId=" +
      userId +
      "";

    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          toast.success(result.data.message);
          this.getData(this.state.patientId, this.state.PatientAccessionId);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        this.setState({ authError: true, error: error });
      });
    this.setState({ loading: false });
  }
  EditPatientDiagnostic(e) {
    // e.preventDefault();
    this.setState({ loading: true, showdiagnosticerror: "" });

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (this.validateDiagnosticForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_PatientDiagnostic/Update";

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        DiagnosticAnalysis: this.state.diagnosticAnalysis,
        DiagnosticDate: this.state.diagnosticDate,
        Outcome: this.state.outcome,
        PatientDiagnosticId: parseInt(this.state.patientDiagnosticId),
        // createdBy: uid,
        // PatientAccessionId: parseInt(this.state.PatientAccessionId),
      });

      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            toast.success(result.data.message);
            if (this.state.diagnosticdocumentFile != "") {
              let dData = result.data.outdata;
              this.filesUploadDocDiagnostic(
                dData.patientDiagnosticId,
                result.data.message
              );
              this.setState({
                showeditdiagnostic: false,
                showdiagnosticerror: " ",
                outcome: "",
                diagnosticAnalysis: "",
                diagnosticdocumentFile: "",
              });
            } else {
              this.setState(
                {
                  authError: true,
                  errorType: "success",
                  error: result.data.message,
                  loading: false,
                  showeditdiagnostic: false,
                  diagnosticAnalysis: "",
                  diagnosticDate: "",
                  outcome: "",
                  diagnosticdocumentFile: "",
                },
                this.getData(
                  this.state.patientId,
                  this.state.PatientAccessionId
                )
              );
            }
          } else {
            toast.error(result.data.message);
            this.setState({
              loading: false,
              showdiagnosticerror: result.data.message,
            });
          }
        })
        .catch((error) => {
          toast.error(error.message);
          this.setState({
            authError: true,
            errorType: "danger",
            error: error.message,
            loading: false,
          });
        });
    } else {
      this.setState({ loading: false });
    }
  }

  filesUploadDocDiagnostic(id, msg) {
    const apiroute = window.$APIPath;
    let url = apiroute + "/api/BE_PatientDiagnosticFile/Save?id=" + id + "";
    //alert(this.state.diagnosticdocumentFile)
    let files = this.state.diagnosticdocumentFile;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append(`files[${i}]`, files[i]);
    }
    axiosInstance
      .post(url, data, {
        // receive two    parameter endpoint url ,form data
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState(
            {
              authError: true,
              errorType: "success",
              error: msg,
              loading: false,
              showdiagnostic: false,
            },
            this.getData(this.state.patientId, this.state.PatientAccessionId)
          );
        } else {
          this.setState({
            loading: false,
            showdiagnosticerror: result.data.message,
          });
        }
      })
      .catch((error) => {
        this.setState({
          authError: true,
          errorType: "danger",
          error: error.message,
          loading: false,
        });
      });
  }
  //end add diagnostic

  //add prescription
  handleClosePrescription = () => {
    this.setState({
      showprescription: false,
      prescriptionDescription: "",
      prescriptiondocumentFile: "",
      prescribeDate: "",
    });
    let errors = this.state.errors;
    errors.prescriptionDescription = "";
    errors.prescribeDate = "";
  };

  handleShowPrescription = () => {
    this.setState({
      showprescription: true,
    });
  };

  handlePrescribeDateChange(date) {
    let errors = this.state.errors;
    errors.prescribeDate = !date ? "Please enter prescription date." : "";
    this.setState({ prescribeDate: date });
  }

  handlePrescriptionInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;

    switch (name) {
      case "prescribeDate":
        errors.prescribeDate = !value ? "Please enter prescription date." : "";
        break;
      case "prescriptionDescription":
        errors.prescriptionDescription = !value
          ? "Please enter prescription description."
          : "";
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => { });
  }

  handlePrescriptionFileInputChange(event) {
    const target = event.target;
    const value = target.files;

    this.setState({
      prescriptiondocumentFile: value,
    });
  }

  validatePrescriptionForm = (errors) => {
    let valid = true;

    if (
      this.state.prescriptionDescription == undefined ||
      this.state.prescriptionDescription == ""
    ) {
      errors.prescriptionDescription = "Please enter prescription description.";
    }
    if (
      this.state.prescribeDate == undefined ||
      this.state.prescribeDate == ""
    ) {
      errors.prescribeDate = "Please enter prescription date.";
    }
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  };

  AddPatientPrescription(e) {
    e.preventDefault();
    this.setState({ loading: true, showprescriptionerror: "" });

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (this.validatePrescriptionForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_PatientPrescription/Save";

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        PrescriptionDescription: this.state.prescriptionDescription,
        PrescribeDate: this.state.prescribeDate,
        PatientPrescriptionId: parseInt(0),
        createdBy: uid,
        createdByFlag: "A",
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
      });

      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            if (this.state.prescriptiondocumentFile != "") {
              let dData = result.data.outdata;
              this.filesUploadDocPrescription(
                dData.patientPrescriptionId,
                result.data.message
              );
              this.setState({
                prescriptionDescription: "",
                prescribeDate: "",
                prescriptiondocumentFile: "",
              });
            } else {
              this.setState(
                {
                  authError: true,
                  errorType: "success",
                  error: result.data.message,
                  loading: false,
                  showprescription: false,
                  prescriptionDescription: "",
                  prescribeDate: "",
                  prescriptiondocumentFile: "",
                },
                this.getData(
                  this.state.patientId,
                  this.state.PatientAccessionId
                )
              );
            }
            toast.success(result.data.message);
          } else {
            toast.error(result.data.message);
            this.setState({
              loading: false,
              showprescriptionerror: result.data.message,
            });
          }
        })
        .catch((error) => {
          this.setState({
            authError: true,
            errorType: "danger",
            error: error.message,
            loading: false,
          });
          toast.error(error.message);
        });
    } else {
      this.setState({ loading: false });
    }
  }
  EditPatientPrescription(e) {
    e.preventDefault();
    this.setState({ loading: true, showprescriptionerror: "" });

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (this.validatePrescriptionForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_PatientPrescription/Update";

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        PrescriptionDescription: this.state.prescriptionDescription,
        PrescribeDate: this.state.prescribeDate,
        PatientPrescriptionId: parseInt(this.state.PatientPrescriptionId),
        createdBy: uid,
        createdByFlag: "A",
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
      });

      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            if (this.state.prescriptiondocumentFile != "") {
              let dData = result.data.outdata;
              this.filesUploadDocPrescription(
                dData.patientPrescriptionId,
                result.data.message
              );
              this.setState({
                prescriptionDescription: "",
                prescribeDate: "",
                prescriptiondocumentFile: "",
                showeditprescription: false,
              });
            } else {
              this.setState(
                {
                  authError: true,
                  errorType: "success",
                  error: result.data.message,
                  loading: false,
                  showeditprescription: false,
                  prescriptionDescription: "",
                  prescribeDate: "",
                  prescriptiondocumentFile: "",
                },
                this.getData(
                  this.state.patientId,
                  this.state.PatientAccessionId
                )
              );
            }
            toast.success(result.data.message);
          } else {
            toast.error(result.data.message);
            this.setState({
              loading: false,
              showprescriptionerror: result.data.message,
            });
          }
        })
        .catch((error) => {
          this.setState({
            authError: true,
            errorType: "danger",
            error: error.message,
            loading: false,
          });
          toast.error(error.message);
        });
    } else {
      this.setState({ loading: false });
    }
  }
  filesUploadDocPrescription(id, msg) {
    const apiroute = window.$APIPath;
    let url = apiroute + "/api/BE_PatientPrescriptionFile/Save?id=" + id + "";
    //alert(this.state.prescriptiondocumentFile)
    let files = this.state.prescriptiondocumentFile;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append(`files[${i}]`, files[i]);
    }
    axiosInstance
      .post(url, data, {
        // receive two    parameter endpoint url ,form data
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState(
            {
              authError: true,
              errorType: "success",
              error: msg,
              loading: false,
              showprescription: false,
            },
            this.getData(this.state.patientId, this.state.PatientAccessionId)
          );
        } else {
          this.setState({
            loading: false,
            showprescriptionerror: result.data.message,
          });
        }
      })
      .catch((error) => {
        this.setState({
          authError: true,
          errorType: "danger",
          error: error.message,
          loading: false,
        });
      });
  }
  //end add prescription

  //add treatment
  handleCloseTreatment = () => {
    this.setState({
      showtreatment: false,
      treatmentDetail: "",
      treatmentDescription: "",
      treatmentdocumentFile: "",
      treatmentDate: "",
    });
    let errors = this.state.errors;
    errors.treatmentDescription = "";
    errors.treatmentDetail = "";
    errors.treatmentDate = "";
  };

  handleShowTreatment = () => {
    this.setState({
      showtreatment: true,
    });
  };

  handleTreatmentDateChange(date) {
    let errors = this.state.errors;
    errors.treatmentDate = !date ? "Please enter treatment date." : "";
    this.setState({ treatmentDate: date });
  }

  handleTreatmentInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;

    switch (name) {
      case "treatmentDate":
        errors.treatmentDate = !value ? "Please enter treatment date." : "";
        break;
      case "treatmentDetail":
        errors.treatmentDetail = !value ? "Please enter treatment detail." : "";
        break;
      case "treatmentDescription":
        errors.treatmentDescription = !value ? "Please enter description." : "";
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => { });
  }

  handleTreatmentFileInputChange(event) {
    const target = event.target;
    const value = target.files;

    this.setState({
      treatmentdocumentFile: value,
    });
  }

  validateTreatmentForm = (errors) => {
    let valid = true;

    if (
      this.state.treatmentDetail == undefined ||
      this.state.treatmentDetail == ""
    ) {
      errors.treatmentDetail = "Please enter treatment detail.";
    }
    if (
      this.state.treatmentDate == undefined ||
      this.state.treatmentDate == ""
    ) {
      errors.treatmentDate = "Please enter treatment date.";
    }
    if (
      this.state.treatmentDescription == undefined ||
      this.state.treatmentDescription == ""
    ) {
      errors.treatmentDescription = "Please enter description.";
    }
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  };

  DownloadFile(e, filepath) {
    //alert(filename);
    // console.log("event:", e)
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    axiosInstance({
      url:
        apiroute +
        "/api/CognitoUserStore/downloadFile?fileName=" +
        filepath +
        "",
      method: "GET",
      responseType: "blob", // important
    })
      .then((response) => {
        // console.log(response);
        var fname = filepath.substring(filepath.lastIndexOf("/") + 1);
        //alert(fname);
        var fext = fname.substring(fname.lastIndexOf("."));
        //alert(fext);
        var filename = fname + fext;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        this.setState({ loading: false });
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
  }
  updateAnalysisOrderStatus = () => {
    const apiroute = window.$APIPath;
    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }
    let func = {
      orderSubmitted: (isUpdate) => {
        return new Promise(async (resolve) => {
          try {
            let url = "";
            let data = {};
            let x = new Date(
              this.state.analysisOrderStatus.orderSubmitted.date
            );
            let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
            let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
            x.setHours(hoursDiff);
            x.setMinutes(minutesDiff);
            if (isUpdate) {
              url = apiroute + "/api/BE_OrderHistory/UpdateOrderHistory";

              data = {
                orderHistoryId: Number(
                  this.state.basicInfo?.analysisOrderStatus?.orderHistoryId
                ),
                orderDate: x,
                updatedBy: uid,
              };
            } else {
              url =
                apiroute + "/api/BE_OrderHistory/CreateAnalysisOrderHistory";
              data = {
                orderHistoryId: 0,
                diseaseCategoryId: 0,
                orderFlag: null,
                orderDate: x, //this.state.analysisOrderStatus.orderSubmitted.date,
                // orderDate: new Date(),
                patientId: parseInt(this.state.patientId),
                diseaseCategoryId:
                  Array.isArray(this.state.basicInfo.patientDisease) &&
                    this.state.basicInfo.patientDisease.length > 0
                    ? this.state.basicInfo.patientDisease[0].diseaseCategoryId
                    : 0,
                patientAccessionId: null, // parseInt(this.state.PatientAccessionId),
                vendorId:
                  Array.isArray(this.state.filteredpractitioners) &&
                    this.state.filteredpractitioners.length > 0
                    ? this.state.filteredpractitioners[0].practitionerId
                    : 0,
                vendorType: "P",
                paymentMilestoneId: 0,
                // createdDate: new Date(),
                createdBy: uid,
              };
            }

            // console.log({
            //   data,
            //   state: this.state.filteredpractitioners,
            //   vendor: this.state.filteredpractitioners[0].practitionerId,
            // });

            let response = await axiosInstance.post(url, data, {
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
            });
            let flag = response.data?.flag;
            // if (flag) toast.success(`Order ${isUpdate ? "updated" : "sunmitted"}, now waiting for PO from clinic.`); else toast.error(response.data.message)
            if (flag) toast.success(response.data.message);
            else toast.error(response.data.message);
            resolve(true);
            // .then(() => {
            //   //
            // })
            // .catch((err) => {
            //   console.log(err);
            //   toast.error("error while updating order ");
            // });
          } catch (error) {
            resolve(true);
          }
        });
      },
      poReceived: () => {
        return new Promise(async (resolve) => {
          try {
            let url =
              apiroute + "/api/BE_PaymentHistory/UpdatePoReceivedByClinic";
            let x = new Date(this.state.analysisOrderStatus.poReceived.date);
            // x = new Date();
            let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
            let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
            x.setHours(hoursDiff);
            x.setMinutes(minutesDiff);
            // console.log({ x })
            let data = {
              id: this.state.basicInfo.analysisOrderStatus.paymentHistoryId,
              statusUpdatedDate: x,
              statusUpdatedBy: uid,
            };
            let response = await axiosInstance.post(url, data, {
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
            });
            let flag = response.data.flag;

            toast.success("PO received, please send invoice to clinic.");
            // toast.success(response.data.message)

            resolve(true);
          } catch (err) {
            resolve(true);
          }
        });
      },
      invoiceSentToClinic: () => {
        return new Promise(async (resolve) => {
          try {
            let url =
              apiroute + "/api/BE_PaymentHistory/UpdateInvoiceSendToClinic";
            let x = new Date(this.state.analysisOrderStatus.invoiceSent.date);
            let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
            let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
            x.setHours(hoursDiff);
            x.setMinutes(minutesDiff);
            let data = {
              id: this.state.basicInfo.analysisOrderStatus.paymentHistoryId,
              statusUpdatedDate: x,
              statusUpdatedBy: uid,
            };
            await axiosInstance.post(url, data, {
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
            });
            // .catch((err) => {
            //   console.log(err);
            //   toast.error("Error while updating Invoice Sent To Clinic");
            // })
            toast.success(
              "Invoice sent to clinic, waiting for payment status from clinic."
            );
            resolve(true);
          } catch (error) {
            toast.error("Error while updating Invoice Sent To Clinic");
            resolve(true);
          }
        });
      },
      paymentRecived: () => {
        return new Promise(async (resolve) => {
          let url =
            apiroute +
            "/api/BE_PaymentHistory/UpdatePaymentReceivedForAnalysis";
          let x = new Date(this.state.analysisOrderStatus.paymentRecived.date);
          let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
          let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
          x.setHours(hoursDiff);
          x.setMinutes(minutesDiff);

          let data = {
            id: this.state.basicInfo.analysisOrderStatus.paymentHistoryId,
            statusUpdatedDate: x,
            statusUpdatedBy: uid,
            IsFullPayment: this.state.paymentType === "y" ? true : false,
          };
          try {
            await axiosInstance.post(url, data, {
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
            });

            toast.success(
              "Payment received, please follow-up with clinic to deliver all samples to Lab."
            );
            if (this.state.paymentType === "y") {
              let orderHistoryId = "";

              let paymentHistoryId = "";

              // alert("newData")
              if (!this.state?.designOrderStatus?.orderSubmited?.date) {
                orderHistoryId = await this.submitDisgnOrderStatus(false);
                paymentHistoryId = this.state.basicInfo?.designOrderStatus?.paymentHistoryId
              }
              await this.paymentReceived(paymentHistoryId, "temp");

              // await this.submitDisgnOrderStatus(false);
              // await this.poReceived() - done
              // await this.invoiceSentToClinic()
              // await this.paymentReceived()
            }
            resolve(true);
          } catch (error) {
            resolve(true);
            toast.error("Error while updating Payment Recieved");
          }
        });
      },
    };
    return func;
    // let analysisOrderStatus = this.state.analysisOrderStatus;
    // if (analysisOrderStatus.orderSubmitted) {
    //   func.orderSubmitted();
    // }
    // if (analysisOrderStatus.poReceived) {
    //   func.poReceived();
    // }
    // if (analysisOrderStatus.invoiceSent) {
    //   func.invoiceSentToClinic();
    // }
  };
  handleAnalysisOrderChange = (name) => {
    if (
      false && name == "paymentRecived" &&
      this.state?.analysisOrderStatus?.paymentRecived?.checked === false
    ) {
      this.setState({
        showPaidStatus: true,
      });
    } else {
      this.setState({
        analysisOrderStatus: {
          ...this.state.analysisOrderStatus,
          [name]: {
            ...this.state.analysisOrderStatus[name],
            checked: !this.state.analysisOrderStatus[name].checked,
            // date: ""
          },
        },
      });
    }
  };
  invoiceSentToClinic = (id) => {
    return new Promise(async (resolve) => {
      try {
        const apiroute = window.$APIPath;
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        let url = apiroute + "/api/BE_PaymentHistory/UpdateInvoiceSendToClinic";
        let x = new Date(
          this.state.paymentType === "y"
            ? this.state.analysisOrderStatus.paymentRecived.date
            : this.state.designOrderStatus.invoice.date
        );
        let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
        let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
        x.setHours(hoursDiff);
        x.setMinutes(minutesDiff);
        let data = {
          id: id || this.state.basicInfo.designOrderStatus.paymentHistoryId,
          statusUpdatedDate: x,
          statusUpdatedBy: uid,
          IsFullPayment: this.state.paymentType === "y" ? true : false,
        };
        let result = await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        // .catch((err) => {
        //   console.log(err);
        //   toast.error("Error while updating Invoice Sent To Clinic");
        // })
        let flag = result.data.flag;
        if (flag) {
          if (this.state.paymentType === "y") {
            await this.paymentReceived(id);
          } else {
            toast.success(result.data.message);
          }
        } else {
          toast.error(result.data.message);
        }
        resolve(true);
      } catch (error) {
        toast.error(error.message);
        resolve(true);
      }
    });
  };
  paymentReceived = (id, temp) => {
    return new Promise(async (resolve) => {
      try {
        const apiroute = window.$APIPath;
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        let url =
          apiroute + "/api/BE_PaymentHistory/UpdatePaymentReceivedForDesign";
        let x = new Date(
          this.state.paymentType === "y"
            ? this.state.analysisOrderStatus.paymentRecived.date
            : this.state.designOrderStatus.paymentRecived.date
        );
        let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
        let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
        x.setHours(hoursDiff);
        x.setMinutes(minutesDiff);
        let data = {
          id: id || this.state.basicInfo.designOrderStatus.paymentHistoryId,
          statusUpdatedDate: x,
          statusUpdatedBy: uid,
          IsFullPayment: this.state.paymentType === "y" ? true : false,
        };
        let result = await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        let flag = result.data.flag;
        if (flag) {
          toast.success(result.data.message);
        } else {
          toast.error(result.data.message);
        }

        // .catch((err) => {
        //   console.log(err);
        //   toast.error("Error while updating Invoice Sent To Clinic");
        // })
        resolve(true);
      } catch (error) {
        toast.error("Error while updating Invoice Sent To Clinic");
        resolve(true);
      }
    });
  };
  handleAnalysisOrderDate = (name, date) => {
    // let orderSubmitedDate = new Date(this.state.analysisOrderStatus.orderSubmitted.date)
    // let currentDate = new Date(date)
    // alert(`${currentDate < orderSubmitedDate} os: ${orderSubmitedDate} cd: ${currentDate}`)
    // switch (name) {
    //   case 'poReceived': {
    //     if (currentDate < orderSubmitedDate) {
    //       toast.error("can not select past date from order submition")
    //       return
    //     }
    //     break;
    //   }
    //   default:
    //     break;
    // }
    // let AdjusteddateValue = (new Date(date.getTime() - (date.getTimezoneOffset() * 60000)));

    let AdjusteddateValue = new Date(date);
    AdjusteddateValue.setHours(0, 0, 0, 0);
    // console.log(AdjusteddateValue, date);
    this.setState({
      analysisOrderStatus: {
        ...this.state.analysisOrderStatus,
        [name]: {
          ...this.state.analysisOrderStatus[name],
          date: AdjusteddateValue,
        },
      },
    });
  };

  poReceived = (id) => {
    return new Promise(async (resolve) => {
      try {
        const apiroute = window.$APIPath;
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
          uid = userToken.userId == null ? 0 : userToken.userId;
        }
        let url = apiroute + "/api/BE_PaymentHistory/UpdatePoReceivedByClinic";
        let x = new Date(
          this.state.paymentType === "y"
            ? this.state.analysisOrderStatus.paymentRecived.date
            : this.state.designOrderStatus.poReceived.date
        );
        let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
        let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
        x.setHours(hoursDiff);
        x.setMinutes(minutesDiff);
        let data = {
          id: id || this.state.basicInfo.designOrderStatus.paymentHistoryId,
          statusUpdatedDate: x,
          statusUpdatedBy: uid,
          IsFullPayment: this.state.paymentType === "y" ? true : false,
        };
        let result = await axiosInstance.post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        let flag = result.data.flag;
        if (flag) {
          if (this.state.paymentType === "y") {
            await this.invoiceSentToClinic(id);
          } else {
            toast.success(result.data.message);
          }
        } else {
          toast.error(result.data.message);
        }
        resolve(true);
      } catch (err) {
        toast.error(err.message);
        resolve(true);
      }
    });
  };
  AddPatientTreatment(e) {
    //alert(this.state.PatientAccessionId);
    e.preventDefault();
    this.setState({ loading: true, showtreatmenterror: "" });

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (this.validateTreatmentForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_PatientTreatment/Save";

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        TreatmentDetail: this.state.treatmentDetail,
        TreatmentDate: this.state.treatmentDate,
        TeatmentDescription: this.state.treatmentDescription,
        PatientTreatmentReportId: parseInt(0),
        createdBy: uid,
        createdByFlag: "A",
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
      });

      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            if (this.state.treatmentdocumentFile != "") {
              let dData = result.data.outdata;
              this.setState({
                treatmentDetail: "",
                treatmentDate: "",
                treatmentDescription: "",
                // treatmentdocumentFile: "",
              });
              this.filesUploadDocTreatment(
                dData.patientTreatmentReportId,
                result.data.message
              );
            } else {
              this.setState(
                {
                  authError: true,
                  errorType: "success",
                  error: result.data.message,
                  loading: false,
                  showtreatment: false,
                  treatmentDetail: "",
                  treatmentDate: "",
                  treatmentDescription: "",
                  treatmentdocumentFile: "",
                },
                this.getData(
                  this.state.patientId,
                  this.state.PatientAccessionId
                )
              );
            }
            toast.success(result.data.message);
          } else {
            this.setState({
              loading: false,
              showtreatmenterror: result.data.message,
            });
            toast.error(result.data.message);
          }
        })
        .catch((error) => {
          // console.log(error)
          // toast.error(error.message)
          this.setState({
            authError: true,
            errorType: "danger",
            error: error.message,
            loading: false,
          });
        });
    } else {
      this.setState({ loading: false });
    }
  }

  EditPatientTreatment(e) {
    //alert(this.state.PatientAccessionId);
    e.preventDefault();
    this.setState({ loading: true, showtreatmenterror: "" });

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (this.validateTreatmentForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      let url = apiroute + "/api/BE_PatientTreatment/Update";

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        TreatmentDetail: this.state.treatmentDetail,
        TreatmentDate: this.state.treatmentDate,
        TeatmentDescription: this.state.treatmentDescription,
        PatientTreatmentReportId: this.state.patientTreatmentReportId,
        createdBy: uid,
        createdByFlag: "A",
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
      });

      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            if (this.state.treatmentdocumentFile != "") {
              let dData = result.data.outdata;
              this.setState({
                treatmentDetail: "",
                treatmentDate: "",
                treatmentDescription: "",
                // treatmentdocumentFile: "",
                showedittreatment: false,
              });
              this.filesUploadDocTreatment(
                dData.patientTreatmentReportId,
                result.data.message
              );
            } else {
              this.setState(
                {
                  authError: true,
                  errorType: "success",
                  error: result.data.message,
                  loading: false,
                  showedittreatment: false,
                  treatmentDetail: "",
                  treatmentDate: "",
                  treatmentDescription: "",
                  treatmentdocumentFile: "",
                },
                this.getData(
                  this.state.patientId,
                  this.state.PatientAccessionId
                )
              );
            }
            toast.success(result.data.message);
          } else {
            this.setState({
              loading: false,
              showtreatmenterror: result.data.message,
            });
            toast.error(result.data.message);
          }
        })
        .catch((error) => {
          // console.log(error)
          // toast.error(error.message)
          this.setState({
            authError: true,
            errorType: "danger",
            error: error.message,
            loading: false,
          });
        });
    } else {
      this.setState({ loading: false });
    }
  }
  isdateeditale() {
    // if (!this.state?.isEdit) {
    //   this.setState({
    //     isEditDateClass: "disabled-input"
    //   })
    // }
  }
  filesUploadDocTreatment(id, msg) {
    const apiroute = window.$APIPath;
    let url = apiroute + "/api/BE_PatientTreatmentFile/Save?id=" + id + "";
    //alert(this.state.treatmentdocumentFile)
    let files = this.state.treatmentdocumentFile;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append(`files[${i}]`, files[i]);
    }
    axiosInstance
      .post(url, data, {
        // receive two    parameter endpoint url ,form data
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState(
            {
              authError: true,
              errorType: "success",
              error: msg,
              loading: false,
              showtreatment: false,
              treatmentdocumentFile: [],
            },
            this.getData(this.state.patientId, this.state.PatientAccessionId)
          );
        } else {
          this.setState({
            loading: false,
            showtreatmenterror: result.data.message,
          });
        }
      })
      .catch((error) => {
        this.setState({
          authError: true,
          errorType: "danger",
          error: error.message,
          loading: false,
        });
      });
  }
  //end add treatment

  //end add practitioner

  //tab navigation
  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice();
    newArray[tabPane] = tab;
    this.setState({
      activeTab: newArray,
    });
  }

  //file preview
  previewToggle(e, filePath) {
    // console.log("Event", e)
    const apiroute = window.$FileUrl;

    this.setState({
      preview: !this.state.preview,
      url: apiroute + filePath,
    });
  }

  DeleteDiagnostic_file(e, id) {
    e.preventDefault();

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/PatientDiagnosticFile/Delete?id=" + id + "";

    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          // console.log(result)
          this.setState({
            loading: false,
            DeletemodalforDiagnosticFile: false,
            deleteDiagnosticFileId: "",
          });
          toast.success(result.data.message);
          this.getData(this.state.patientId, this.state.PatientAccessionId);
        }
      })
      .catch((error) => {
        //console.log(error);
        // this.setState({
        // });
        // toast.error(error.message)
        this.setState({ loading: false, authError: true, error: error });
      });
  }

  handleEmailNotification = () => {
    // if (this.state.emailNotify) {
    //   this.setState({
    //     showEmailNotifyConfirm: !this.state.showEmailNotifyConfirm,
    //   });
    // } else {
    //   this.handleDisableEmailNotification();
    // }
    this.setState({
      showEmailNotifyConfirm: !this.state.showEmailNotifyConfirm,
    });
  };

  handleDisableEmailNotification = () => {
    this.setState({ loading: true })
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken?.userId == null ? 0 : userToken?.userId;
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Dashboard/GetAll";
    const url =
      apiroute + "/api/BE_PatientAccessionMapping/UpdateEmailNotification";
    let data = JSON.stringify({
      userId: userId,
      accessionId: Number(this.state?.PatientAccessionId),
      patientId: Number(this.state.patientId),
      isEmailNotification: !this.state.emailNotify,
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
            emailNotify: !this.state.emailNotify,
            showEmailNotifyConfirm: false,
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

  DeletePrescription_file(e, id) {
    e.preventDefault();

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/PatientPrescriptionFile/Delete?id=" + id + "";

    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState({
            loading: false,
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message
            DeletemodalforPrescriptionFile: false,
            deletePrescriptionFileId: "",
          });
          toast.success(result.data.message);
          this.getData(this.state.patientId, this.state.PatientAccessionId);

          // const param = this.props.match.params;

          // if (param.id != undefined) {
          //   this.getData(param.id);
          // }
        }
      })
      .catch((error) => {
        //console.log(error);
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Error',
        //   modalBody: error.message
        // });
        toast.error(error.message);
        this.setState({ loading: false, authError: true, error: error });
      });
  }
  handlePdfNameChange = (e) => {
    let target = e.target;
    let value = target.value;

    this.setState({
      filePdfname: value,
    });
    // console.log(value)
  };
  DeleteTreatement_file(e, id) {
    e.preventDefault();
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/PatientTreatmentFile/Delete?id=" + id + "";

    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          this.setState({
            deletetreatmentsFileId: "",
            loading: false,
            DeletemodalfortreatmentsFile: false,
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message
          });
          toast.success(result.data.message);
          this.getData(this.state.patientId, this.state.PatientAccessionId);

          // const param = this.props.match.params;

          // if (param.id != undefined) {
          //   this.getData(param.id);
          // }
        }
      })
      .catch((error) => {
        //console.log(error);
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Error',
        //   modalBody: error.message
        // });
        toast.error(error.message);
        this.setState({ loading: false, authError: true, error: error });
      });
  }
  RenameFun(event, renameFile_ID, rpt_Type) {
    event.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    const apiroute = window.$APIPath;
    let url = apiroute + "/api/BE_PatientReport/RenamePatientFile";

    let data = JSON.stringify({
      id: parseInt(renameFile_ID),
      pId: parseInt(this.state.patientId),
      aId: parseInt(this.state.PatientAccessionId),
      rptType: parseInt(rpt_Type),
      newFileName: this.state.filePdfname,
    });
    // console.log(data)
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
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message,
              filePdfname: "",
              renamePdf: "",
              loading: false,
              // showpractitioner: false,
              // practitionerId: "",
            },
            this.getData(this.state.patientId, this.state.PatientAccessionId)
          );
          toast.success(result.data.message);
        } else {
          toast.error("Something went wrong, please try again.");
          // toast.error(result.data.message);
          // errors.practitionerId = result.data.message;
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        toast.error("Something went wrong, please try again.");
        // toast.error(result.data.message);
        this.setState({
          loading: false,
        });
      });
  }
  previewInvoiceToggle_api(ViewFile_ID, rpt_Type) {
    // event.preventDefault();
    // this.setState({ loading: true });
    console.log(ViewFile_ID)
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    const apiroute = window.$APIPath;
    let url = apiroute + "/api/BE_PatientReport/ViewInvoicePOFile";

    let data = JSON.stringify({
      id: ViewFile_ID,
      pId: parseInt(this.state.patientId),
      aId: parseInt(this.state.PatientAccessionId),
      rptType: rpt_Type,
      // newFileName: this.state.filePdfname
    });
    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          // console.log("rrr", result.data.message)
          this.setState(
            {
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message,

              url: result.data.message,
              preview: !this.state.preview,
              loading: false,

              // showpractitioner: false,
              // practitionerId: "",
            }
            // this.getData(this.state.patientId, this.state.PatientAccessionId)
          );
          // toast.success(result.data.message);
        } else {
          toast.error(result.data.message);
          // errors.practitionerId = result.data.message;
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.message);
      });
  }
  previewPdfToggle_api(ViewFile_ID, rpt_Type) {
    // event.preventDefault();
    // this.setState({ loading: true });

    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    const apiroute = window.$APIPath;
    let url = apiroute + "/api/BE_PatientReport/ViewPatientFile";

    let data = JSON.stringify({
      id: ViewFile_ID,
      pId: parseInt(this.state.patientId),
      aId: parseInt(this.state.PatientAccessionId),
      rptType: rpt_Type,
      // newFileName: this.state.filePdfname
    });
    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          // console.log("rrr", result.data.message)
          this.setState(
            {
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message,

              url: result.data.message,
              preview: !this.state.preview,
              loading: false,

              // showpractitioner: false,
              // practitionerId: "",
            }
            // this.getData(this.state.patientId, this.state.PatientAccessionId)
          );
          // toast.success(result.data.message);
        } else {
          toast.error("Something went wrong, please try again.");
          // errors.practitionerId = result.data.message;
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error("Something went wrong, please try again.");
      });
  }

  UpdatePatientDisease() {
    this.setState({ loading: true });
    let errors = this.state.errors;
    if (!this.state.currentDiseaseName) {
      this.setState({
        loading: false,
      })
      errors.diseaseId = "Please select tissue."
      return false

    } else if (!this.state.tissueName) {
      this.setState({
        loading: false,
      })
      errors.tissue = "Please select tissue."
      return false
    }
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    //console.log('Submit');
    //console.log(this.state);
    let url = "";

    // if (this.validateForm(this.state.errors)) {
    const apiroute = window.$APIPath;
    // if (this.state.diseaseId == 0) {
    url = apiroute + "/api/BE_Disease/Update";
    let data = JSON.stringify({
      diseaseId: Number(this.state.diseaseId),
      diseaseName: this.state.currentDiseaseName,
      EfoDiseasCode: this.state.newDiseaseCode,
      diseaseCode: this.state.newDiseaseCode,
      category: this.state.diseases.parentDiseaseCategory,
      description: "",
      accessionDigit: 0,
      diseaseCategoryId: this.state.diseaseCategoryId,
      createdBy: userToken.userId == null ? 0 : userToken.userId,
      createdByFlag: "A",
      isActive: true,
      isOther: false,
    });

    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          setTimeout(
            () => { this.refreshPipelineCall(); this.setState({ disabledButton: false }) },
            10000);
          if (this.state.diseaseId === "0") {
            this.handleSubmitNewDisease();
          } else {
            this.AddPatientDisease();
          }

          this.setState({
            diseaseId: result.data.outdata.diseaseId,
            newDisease: "",
            newDiseaseCode: "",
            Tissue: "",

            showdisease: false,
          });

          // this.AddPatientDisease()
          this.getData(this.state.patientId, this.state.PatientAccessionId);
          // this.setState({ loading: false });
          this.getDiseaseData();

          this.getTissueData(result.data.outdata.diseaseId, "");

          toast.success(result.data.message);
        } else {
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error(error.message);
      });
  }

  handleSubmitNewDisease = (e) => {
    // debugger;
    if (this.state.diseaseId == 0) {
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

      //   if (this.state.accessionDigit == 0) {
      //     let diseaseCatAccessionDigit = this.state.diseasecategories.filter(ml => ml.diseaseCategoryId == this.state.diseaseCategoryId);
      //     if (diseaseCatAccessionDigit.length > 0) {
      //       this.setState({
      //         accessionDigit: diseaseCatAccessionDigit[0].accessionDigit
      //       });
      //     }
      //   }

      let data = JSON.stringify({
        diseaseId: 0,
        // diseaseName: this.state.newDisease,
        diseaseName: this.state.currentDiseaseName,
        EfoDiseasCode: this.state.newDiseaseCode,
        diseaseCode: this.state.newDiseaseCode,
        category: this.state.diseases.parentDiseaseCategory,
        description: "",
        accessionDigit: 0,
        diseaseCategoryId: String(this.state.diseaseCategoryId),
        createdBy: userToken.userId == null ? 0 : userToken.userId,
        createdByFlag: "A",
        isOther: true,
        diseaseDisplayName: this.state.diseaseNameforReportUse,

        // diseaseDesc: this.state.diseaseDesc
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
            setTimeout(
              () => { this.refreshPipelineCall(); this.setState({ disabledButton: false }) },
              10000);
            // let Alldisease = [...this.state.Alldiseases]
            // let disease = [...this.state.Alldiseases]
            let data = result.data.outdata;
            let newDisease_ = {
              id: data.diseaseId,
              name: data.diseaseName,
              diseaseCatId: data.diseaseCategoryId,
              isActive: true,
            };
            // Alldisease.unshift(newDisease)
            // disease.unshift(newDisease_)
            this.setState({
              diseaseId: result.data.outdata.diseaseId,
              //   Alldiseases, Alldisease,
              // dieseasData: disease,
              currentDiseaseId: result.data.outdata.diseaseId,
              currentDiseaseName: result.data.outdata.diseaseName,
              newDisease: "",
              newDiseaseCode: "",
              //   currentdiseasename: data.diseaseName,
            });
            this.AddPatientDisease();

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
      if (!this.state.Tissue) {
        errors.tissue = "Please select tissue.";
      }
      // if (!this.state.newDiseaseCode) {
      //   errors.newDiseaseCode = 'Please enter code for new disease.';
      // }
      this.setState({ errors });
    }
  };
  handleSubmitUpdateDisease = (e) => {
    // debugger;
    let errors = this.state.errors;
    if (!this.state.currentDiseaseName) {
      this.setState({
        loading: false,
      })
      errors.diseaseId = "Please select disease."
      return false

    } else if (!this.state.Tissue) {
      this.setState({
        loading: false,
      })
      errors.tissue = "Please select tissue."
      return false
    }
    if (this.state.diseaseId) {
      // e.preventDefault();
      this.setState({ loading: true });
      var userToken = JSON.parse(localStorage.getItem("AUserToken"));
      //console.log('Submit');
      //console.log(this.state);
      let url = "";

      // if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      // if (this.state.diseaseId == 0) {
      url = apiroute + "/api/BE_Disease/Update";
      // }
      // else {
      //   url = apiroute + '/api/BE_Disease/Update';
      // }

      //   if (this.state.accessionDigit == 0) {
      //     let diseaseCatAccessionDigit = this.state.diseasecategories.filter(ml => ml.diseaseCategoryId == this.state.diseaseCategoryId);
      //     if (diseaseCatAccessionDigit.length > 0) {
      //       this.setState({
      //         accessionDigit: diseaseCatAccessionDigit[0].accessionDigit
      //       });
      //     }
      //   }

      let data = JSON.stringify({
        diseaseId: Number(this.state.diseaseId),
        // diseaseName: this.state.newDisease,
        diseaseName: this.state.currentDiseaseName,
        EfoDiseasCode: this.state.newDiseaseCode,
        diseaseCode: this.state.newDiseaseCode,
        category: this.state.diseases.parentDiseaseCategory,
        description: "",
        accessionDigit: 0,
        diseaseCategoryId: String(this.state.diseaseCategoryId),
        createdBy: userToken.userId == null ? 0 : userToken.userId,
        createdByFlag: "A",
        isOther: true,
        diseaseDisplayName: this.state.diseaseNameforReportUse,

        // diseaseDesc: this.state.diseaseDesc
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
            setTimeout(
              () => { this.refreshPipelineCall(); this.setState({ disabledButton: false }) },
              10000);
            // let Alldisease = [...this.state.Alldiseases]
            // let disease = [...this.state.Alldiseases]
            let data = result.data.outdata;
            let newDisease_ = {
              id: data.diseaseId,
              name: data.diseaseName,
              diseaseCatId: data.diseaseCategoryId,
              isActive: true,
            };
            // Alldisease.unshift(newDisease)
            // disease.unshift(newDisease_)
            this.setState({
              diseaseId: result.data.outdata.diseaseId,
              //   Alldiseases, Alldisease,
              // dieseasData: disease,
              currentDiseaseId: result.data.outdata.diseaseId,
              currentDiseaseName: result.data.outdata.diseaseName,
              newDisease: "",
              newDiseaseCode: "",
              //   currentdiseasename: data.diseaseName,
            });
            this.AddPatientDisease();

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
      if (!this.state.Tissue) {
        errors.tissue = "Please select tissue.";
      }
      // if (!this.state.newDiseaseCode) {
      //   errors.newDiseaseCode = 'Please enter code for new disease.';
      // }
      this.setState({ errors });
    }
  };

  handleInputChangeForOtherDisease(event) {
    let target = event.target;
    let value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;

    switch (name) {
      case "newDisease":
        errors.newDisease = !value ? "Please enter new disease." : "";
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value }, () => { });
  }
  previewPdfToggle_api_bottom(trid, trfid, PType) {
    // event.preventDefault();
    // this.setState({ loading: true });

    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    const apiroute = window.$APIPath;
    var url = "";
    var data = "";
    if (PType == "t1") {
      url = apiroute + "/api/BE_PatientTreatmentFile/ViewPatientTreatmentFile";
      data = JSON.stringify({
        trid: trid,
        trfid: trfid,
      });
    }
    if (PType == "d1") {
      url =
        apiroute + "/api/BE_PatientDiagnosticFile/ViewPatientDiagnosticFile";
      data = JSON.stringify({
        trid: trid,
        trfid: trfid,
      });
    }
    if (PType == "m1") {
      url =
        apiroute +
        "/api/BE_PatientPrescriptionFile/ViewPatientPrescriptionFile";
      data = JSON.stringify({
        trid: trid,
        trfid: trfid,
      });
    }

    // let data = JSON.stringify({
    //     trid: trid,
    //     trfid: trfid
    // });
    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          // console.log("rrr", result.data.message)
          this.setState(
            {
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message,

              url: result.data.message,
              preview: !this.state.preview,
              loading: false,

              // showpractitioner: false,
              // practitionerId: "",
            }
            // this.getData(this.state.patientId, this.state.PatientAccessionId)
          );
          // toast.success(result.data.message);
        } else {
          toast.error("Something went wrong, please try again.");
          // errors.practitionerId = result.data.message;
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        toast.error("Something went wrong, please try again.");
      });
  }

  handleDiscountType = (e, name) => {
    const result = this.state.DesignDiscount
    const result2 = this.state.PaymentDiscount
    let err = this.state.errors;

    if (name == "PaymentDiscount") {
      if (e.target.value === "Percentage") {
        (result2 < 0 || result2 > 100) ?
          err.PaymentDiscount = "Discount must be a number between 0 and 100"
          : err.PaymentDiscount = ""
      } else if (e.target.value === "Amount") {
        (result2 < 0 || result2 > 100000) ?
          err.PaymentDiscount = "Discount must be a number between 0 and 100000"
          : err.PaymentDiscount = ""
      } else {
        err.PaymentDiscount = "";
      }

    }
    if (name == "DesignDiscount") {
      if (e.target.value === "Percentage") {
        (result < 0 || result > 100) ?
          err.DesignDiscount = "Discount must be a number between 0 and 100"
          : err.DesignDiscount = ""
      } else if (e.target.value === "Amount") {
        (result < 0 || result > 100000) ?
          err.DesignDiscount = "Discount must be a number between 0 and 100000"
          : err.DesignDiscount = ""
      } else {
        err.DesignDiscount = "";
      }

    }

    if (name == "PaymentDiscountType" && e.target.value == "") {
      let err = this.state.errors;
      err.PaymentDiscount = "";
      this.setState({
        PaymentDiscount: ""
      })

    }
    if (name == "DesignDiscountType" && e.target.value == "") {
      let err = this.state.errors;
      // !!value ? err.DesignDiscount = "Discount is required field" : err.DesignDiscount = "";
      err.DesignDiscount = "";

      this.setState({
        DesignDiscount: ""
      })

    }



    this.setState({
      [name]: e.target.value,
      errors: err
    });

  }

  handleSubmintPaymentDiscount = () => {
    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }
    let errors = this.state.errors;

    if (this.state.PaymentDiscountType && !this.state.PaymentDiscount) {
      this.setState({
        errors: {
          ...this.state.errors,
          PaymentDiscount: "Discount is required field"
        }
      })
      return false
    }


    if (!errors.PaymentDiscount) {
      this.setState({ loading: true });
      const apiroute = window.$APIPath;
      // const url = apiroute + "/api/BE_Dashboard/GetAll";
      const url =
        apiroute + "/api/BE_Patient/UpdatePaymentMethod";
      let data = JSON.stringify({
        aId: Number(this.state?.PatientAccessionId),
        pId: Number(this.state.patientId),
        discountType: String(this.state.PaymentDiscountType),
        isFullPayment: this.state.TypeOfPayment == "2",
        discountAmount: String(this.state.PaymentDiscount),
        practitionerContactId: 0,
        hasPaymentType: this.state.TypeOfPayment !== "3",
        reciverEmails: this.state.practitionerContactPersonIdDesign.map((m) => m.value),
        practitionerId: Number(this.state.assignedpractitioner.practitionerId),
        userId: uid,

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
              PaymentDiscount: "",
              PaymentDiscountType: "",
              practitionerContactPersonIdDesign: [],
              paymentTypeModal: false,
              loading: false,
              selectedEmails: [],
              TypeOfPayment: "3",

            });
            const param = this.props.match.params;

            this.getData(param.id, param.aid);

            toast.success(result?.data?.message)
          } else {
            this.setState({ loading: false });
            toast.error(result.data.message)

          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loading: false });
          toast.error("Something went wrong")

        });
    }
  }

  // onError = (err) => console.log("Error:", err); // Write your own logic
  // onError = (err) => console.log(""); // Write your own logic

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
  }

  handleApprovePMRChange(InputType, data) {
    let errors = this.state.errors;
    errors.PMRapproveNotes = ""

    // if (data == "") {
    //   errors.PMRapproveNotes = "Please write reason"
    // } else {
    //   errors.PMRapproveNotes = ""
    // }
    this.setState({
      [InputType]: data
    })

  }

  render() {
    if (localStorage.getItem("AUserToken") == null) {
      return <Redirect to="/login" />;
    }

    const {
      loading,
      patientId,
      preview,
      url,
      basicInfo,
      diseases,
      diagnosticHistory,
      diagnosticDocFiles,

      emergencyContact,
      insuranceDetail,
      prescription,
      treatmentReport,
      patientpayments,
      patientaccessionmapping,
      assignedpractitioner,
      assignedinstitute,
      assignedlaboratory,
      assignedmanufacture,
      practitionerId,
      practitionerSearch,
      allpractitioners,
      filteredpractitioners,
      showpractitioner,
      instituteId,
      allinstitutes,
      showinstitute,
      instituteSearch,
      filteredinstitutes,
      manufacturerId,
      allmanufactures,
      showmanufacture,
      manufactureSearch,
      filteredmanufactures,
      ngslaboratoryId,
      allngslaboratorys,
      showngslaboratory,
      ngslaboratorySearch,
      filteredngslaboratorys,
      patientdiseaseId,
      Alldiseases,
      showdisease,
      UploadFile,
      UploadFileFor,
      deleteFileModel,
      deleteFileFor,
      roleName,
      PatientAccessionId,

      diagnosticAnalysis,
      diagnosticDate,
      outcome,
      diagnosticdocumentFile,
      showdiagnosticerror,
      showdiagnostic,

      prescriptionDescription,
      prescribeDate,
      prescriptiondocumentFile,
      prescriptiondocFiles,
      showprescriptionerror,
      showprescription,

      treatmentDescription,
      treatmenuploadPatientFiletDetail,
      treatmentDate,
      treatmentdocumentFile,
      treatmentdocFiles,
      showtreatmenterror,
      PatientTreatmentReportId,
      showtreatment,
      isEditDateClass,
      AllSamples,
      patientSampleId,
      patientSamples,
      dieseasData,
      allTissues,
      errors,
      treatmentDetail,
      uploadError,
      isFullPaymentStatus,
      pipelineQueued,
      pipelineStarted,
      canclePiplinemodal,
      stopPipelinemodal,
    } = this.state;

    return (
      <div className="animated fadeIn viewPatientDetails">
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
            showStepNumbers: true,
            showBullets: false,
          }}
          // onChange={function (e) { console.log(this.currentStep) }}
          onChange={(e) => {
            this.setState({ currentStep: e });
            console.log({ id: e?.id, e });
          }}
        />
        <button
          className="help text-light"
          id="help"
          type="btn"
          onClick={() => {
            this.toggleSteps();
          }}
        >
          <i class="fa fa-question text-light" aria-hidden="true"></i>
        </button>

        <Row className="mb-3">
          <Col sm="3" xs="3" xl="3">
            <h5 className="mt-2">
              <span id="PatientActivityt">
                <i className="fa fa-align-justify"></i> Patient Activity
              </span>
            </h5>
          </Col>
          <Col sm="4" lg="4" xl="4" style={{ textAlign: "center" }}>
            <h5 className="mt-2 font-bold">
              {patientaccessionmapping?.accessionNo != null &&
                patientaccessionmapping?.accessionNo != ""
                ? patientaccessionmapping?.accessionNo?.replace(/-/g, "")
                : ""}
            </h5>
          </Col>
          <Col sm="3" lg="3" xl="3">
            <div
              className="form-group form-inline"
              id="Status"
              style={{ width: "fit-content" }}
            >
              <label
                htmlFor="PatientStatus"
                className="form-control-label mr-2"
              >
                Status:
              </label>
              {/* <Input
                type="select"
                style={{ "cursor": "pointer" }}
                className="custom-select  mb-3"
                id='PatientStatus'
                name='newStatus'
                onChange={this.handleUpdateStatusChange}
              >
                <option><div className="dot"></div> Active</option>
                <option>On Hold</option>
                <option>Complete</option>
                <option>Cancelled</option>
                <option>Deceased</option>
              </Input> */}
              <Dropdown
                toggle={() => {
                  this.setState({
                    toggleDropDownForStatus:
                      !this.state.toggleDropDownForStatus,
                  });
                }}
                isOpen={this.state.toggleDropDownForStatus}
              >
                <DropdownToggle
                  className="custom-select"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="dot"
                    style={{ backgroundColor: this.getStatusColor() }}
                  ></div>{" "}
                  {this.state.currentStatus}
                </DropdownToggle>
                <DropdownMenu container="body">
                  <DropdownItem
                    onClick={() => this.handleUpdateStatusChange("Open", 1)}
                    active={this.state.updateStatusCode == 1}
                    className="custom-status-dropdown"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <div
                        className="dot"
                        style={{ backgroundColor: "lightgreen" }}
                      ></div>
                      <div>Open</div>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => this.handleUpdateStatusChange("On Hold", 2)}
                    active={this.state.updateStatusCode == 2}
                    className="custom-status-dropdown"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <div
                        className="dot"
                        style={{ backgroundColor: "blue" }}
                      ></div>
                      <div>On Hold</div>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => this.handleUpdateStatusChange("Complete", 3)}
                    active={this.state.updateStatusCode == 3}
                    className="custom-status-dropdown"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <div
                        className="dot"
                        style={{ backgroundColor: "darkgray" }}
                      ></div>
                      <div>Complete</div>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      this.handleUpdateStatusChange("Cancelled", 4)
                    }
                    active={this.state.updateStatusCode == 4}
                    className="custom-status-dropdown"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <div
                        className="dot"
                        style={{ backgroundColor: "gold" }}
                      ></div>
                      <div>Cancelled</div>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => this.handleUpdateStatusChange("Deceased", 5)}
                    active={this.state.updateStatusCode == 5}
                    className="custom-status-dropdown"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <div
                        className="dot"
                        style={{ backgroundColor: "crimson" }}
                      ></div>
                      <div>Deceased</div>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div>
              Email Notifications
              <div
                style={{ position: "absolute", top: "50px", cursor: "pointer" }}
                className="custom-control custom-switch"
                onClick={() => {
                  // console.log("HEEEERe")
                  this.handleEmailNotification();
                }}
              >
                <input
                  type="checkbox"
                  checked={this.state.emailNotify}
                  className="custom-control-input "
                  id="customSwitch1"
                />
                <label
                  style={{ cursor: "pointer" }}
                  className="custom-control-label label-notify"
                >
                  {" "}
                </label>
              </div>
            </div>
          </Col>
          <Col sm="2" lg="2" xl="2">
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
            <React.Fragment>
              {/* {roleName == "Neo Admin" ? ( */}
              <Card className="viewPatientForm">
                <CardBody>
                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <div className="float-left h5">Patient Details</div>
                        <div className="float-right h5">
                          <Link
                            id="PatientDetailsEdit"
                            className="btn"
                            to={
                              "/patients/modify/" + this.props.match.params.id
                            }
                          >
                            <i className="icon-pencil"></i>
                          </Link>
                          {/* <button
                                                    style={{ position: "absolute", top: '0', right: "8px",
                                                     }}
                                                    className="card-header-action btn btn-close"
                                                    to="#"
                                                    // onClick={
                                                    //     () => this.handleShowDisease()
                                                    // }
                                                >
                                                    <i className="icon-pencil"></i>
                                                </button> */}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>First Name:</Label>
                        <span className="form-control p-0" readonly>
                          {basicInfo.firstName != null
                            ? basicInfo.firstName
                            : ""}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Middle Name:</Label>
                        <span className="form-control">
                          {basicInfo.middleName != null
                            ? basicInfo.middleName
                            : "N/A"}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Last Name:</Label>
                        <span className="form-control">
                          {basicInfo.lastName != null ? basicInfo.lastName : ""}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>Date of Birth:</Label>
                        <span className="form-control">
                          {basicInfo.dateOfBirth != null &&
                            basicInfo.dateOfBirth != "" ? (
                            <React.Fragment>
                              {Moment(basicInfo.dateOfBirth).format(
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
                        <span className="form-control">
                          {basicInfo.age != null && basicInfo.age != ""
                            ? basicInfo.age + ` Year(s)`
                            : "N/A"}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Sex:</Label>
                        <span className="form-control">
                          {basicInfo.sex == "M"
                            ? "Male"
                            : basicInfo.sex == "F"
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
                        {basicInfo.email != "No Email" ?
                          <a
                            className="form-control"
                            href={`mailto: ${basicInfo.email}`}
                          >
                            {basicInfo.email}
                          </a>
                          : <span className="form-control">{"N/A"}</span>}

                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Primary Phone:</Label>

                        {basicInfo.mobile != null ? (
                          <a
                            className="form-control"
                            href={`phoneto: ${basicInfo.mobile}`}
                          >
                            {" "}
                            {basicInfo.mobile}{" "}
                          </a>
                        ) : (
                          <div>N/A</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>Secondary Phone:</Label>

                        {basicInfo.phoneNumber != null ? (
                          <a
                            className="form-control"
                            href={`phoneto: ${basicInfo.phoneNumber}`}
                          >
                            {" "}
                            {basicInfo.phoneNumber}{" "}
                          </a>
                        ) : (
                          <div>N/A</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr />

                  {/* <Row>
                        <Col md="6">
                          <FormGroup>
                            <Label>Height:</Label>
                            <span className="form-control">
                              {basicInfo.height != null ? basicInfo.height : ""}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <Label>Weight:</Label>
                            <span className="form-control">
                              {basicInfo.weight != null ? basicInfo.weight : ""}
                            </span>
                          </FormGroup>
                        </Col>
                      </Row> */}
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
                  {/* <hr /> */}

                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>Address:</Label>
                        <span
                          className="form-control"
                          style={{ height: "auto" }}
                        >
                          {!basicInfo.addressLine1
                            ? ""
                            : basicInfo.addressLine1.match(/^\s+$/) === null
                              ? basicInfo.addressLine1 + ", "
                              : ""}

                          <span className="">
                            {!!basicInfo.cityName
                              ? basicInfo.cityName + ", "
                              : ""}
                          </span>
                          <span className="">
                            {!!basicInfo.stateName
                              ? basicInfo.stateName + ", "
                              : ""}
                          </span>
                          <span className="">
                            {!!basicInfo.postalCode
                              ? basicInfo.postalCode + ", "
                              : ""}
                          </span>
                          <span className="">
                            {!!basicInfo.countryName
                              ? basicInfo.countryName
                              : ""}
                          </span>
                        </span>
                      </FormGroup>
                    </Col>

                    {/* <Col md="4">
                      <FormGroup>
                        <Label>Customer Care:</Label>
                        <span
                          className="form-control"
                          style={{ height: "auto" }}
                        >
                          {
                            !!(basicInfo?.ccName) ? (basicInfo?.ccName) : "N/A"
                          }
                        </span>

                      </FormGroup>
                    </Col> */}
                    {/* <Col md="8">
                          <FormGroup>
                            <Label>Address  Line 2:</Label>
                            <span
                              className="form-control"
                              style={{ height: "70px" }}
                            >
                              {basicInfo.addressLine2 != null
                                ? basicInfo.addressLine2 + " - " + basicInfo.postalCode
                                : "NA"}
                            </span>
  
                          </FormGroup>
                        </Col> */}
                  </Row>
                  {/* <hr /> */}
                  {/* <Row>
                        <Col md="4">
                          <FormGroup>
                            <Label>City:</Label>
                            <span className="form-control">
                              {basicInfo.cityName != null
                                ? basicInfo.cityName
                                : ""}
                            </span>
                          </FormGroup>
                        </Col>
  
                        <Col md="4">
                          <FormGroup>
                            <Label>State:</Label>
                            <span className="form-control">
                              {basicInfo.stateName != null
                                ? basicInfo.stateName
                                : ""}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label> Postal Code:</Label>
                            <span className="form-control">
                              {basicInfo.postalCode != null
                                ? basicInfo.postalCode
                                : ""}
                            </span>
                          </FormGroup>
                        </Col>
  
                        <Col md="4">
                          <FormGroup>
                            <Label> Country:</Label>
                            <span className="form-control">
                              {basicInfo.countryName != null
                                ? basicInfo.countryName
                                : ""}
                            </span>
                          </FormGroup>
                        </Col>
  
                      </Row> */}
                  <hr />
                </CardBody>
              </Card>
              {/* ) : null} */}

              {/* {[2, 3, 4, 1].includes(this.state?.diseaseCategoryId) ? <>
                <Card className="viewPatientForm">
                  <CardBody>
                    <Row>
                      <Col xs="6">
                        <FormGroup>
                          <h5 className="mt-2">Disease Details </h5>
                          < hr />
                          {diseases != "" && diseases != null ? (
                            <span>
                              {diseases.diseaseName ? diseases.diseaseName : "Not Assigned"}
                            </span>
                          ) :
                            this.state.isEdit ? (
                              <Button
                                className="btn btn-bold btn-label-brand btn-sm"
                                onClick={() => this.handleShowDisease()}
                              >
                                Add Disease
                              </Button>

                            ) : (
                              "Not Assigned"
                            )}
                        </FormGroup>
                        <div style={{ border: '1px solid #c8ced3', minHeight: '80px', position: "absolute", top: "0", right: "0", height: "100%" }}></div>
                      </Col>
                      <Col xs="6">
                        <FormGroup>
                          <h5 className="mt-2">Tissue Details </h5>
                          < hr />
                          {diseases?.tissue != "" && diseases?.tissue != null ? (
                            <span>{diseases?.tissue}</span>
                          ) : (
                            "Not Assigned"
                          )}
                        </FormGroup>

                        {this.state.isEdit ? <button
                          style={{ position: "absolute", top: '0', right: "8px", display: [1, 2, 4].includes(diseases?.diseaseCategoryId) ? "block" : "none" }}
                          className="card-header-action btn btn-close"
                          to="#"
                          onClick={() => this.handleShowDisease()}
                        >
                          <i className="icon-pencil"></i>
                        </button> : ""}
                      </Col>
                      <Col xs="6">
                        <FormGroup>
                          <h5 className="mt-2">Secondary Disease</h5>

                          {patientaccessionmapping?.secondaryCancer != "" && patientaccessionmapping?.secondaryCancer != null ? (
                            <span>{patientaccessionmapping?.secondaryCancer}</span>
                          ) : (
                            "Not Assigned"
                          )}
                        </FormGroup>


                      </Col>
                    </Row>
                  </CardBody>
                </Card></> : null} */}

              <Card className="viewPatientForm">
                <CardBody>
                  <Row>
                    <Col>
                      <FormGroup>
                        <h5 className="mt-2">Customer Care </h5>
                        <hr />
                        <span
                          className="form-control"
                          style={{ height: "auto" }}
                        >
                          {!!basicInfo?.patientAccessionMapping?.ccName
                            ? basicInfo?.patientAccessionMapping?.ccName
                            : "N/A"}
                        </span>
                      </FormGroup>
                      {/* {this.state.isEdit ?  */}
                      <button
                        id="DiseaseTissueDetailsEdit"
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "8px",
                          // display: [1, 2, 3, 4, 13].includes(diseases?.diseaseCategoryId) ? "block" : "none"
                        }}
                        className="card-header-action btn btn-close"
                        to="#"
                        onClick={() => this.handleShowCustomerCare()}
                      >
                        <i className="icon-pencil"></i>
                      </button>
                      {/* : ""} */}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              {
                ["5", "13"].includes(String(this.state?.diseaseCategoryId)) ?

                  <Card className="viewPatientForm">
                    <CardBody>
                      <Row>


                        <Col xs="12">
                          <FormGroup>
                            <h5 className="mt-2">Disease Name</h5>
                            <hr />

                            {/* {patientaccessionmapping?.diseaseNameNoCancer != "" &&
                              patientaccessionmapping?.diseaseNameNoCancer != null ? (
                              <span>
                                {patientaccessionmapping?.diseaseNameNoCancer}
                              </span>
                            ) : (
                              "Not Assigned"
                            )} */}
                            {basicInfo?.diseaseNameNoCancer != "" &&
                              basicInfo?.diseaseNameNoCancer != null ? (
                              <span>
                                {basicInfo?.diseaseNameNoCancer}
                              </span>
                            ) : (
                              "Not Assigned"
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  : null
              }

              {[2, 3, 4, 1].includes(this.state?.diseaseCategoryId) ? (
                <>
                  <Card className="viewPatientForm">
                    <CardBody>
                      <Row>
                        <Col xs="6">
                          <FormGroup>
                            <h5 className="mt-2">Disease Details </h5>
                            <hr />
                            {diseases != "" && diseases != null ? (
                              <span>
                                {diseases.diseaseName
                                  ? diseases.diseaseName
                                  : "Not Assigned"}{" "}
                                {diseases?.isOther ? (
                                  diseases.diseaseName ? (
                                    <span className="text-danger">
                                      <b>(Pending verification)</b>
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  diseases.diseaseName ?
                                    <span className="text-success">
                                      <b>(Verified)</b>
                                    </span> : ""
                                )}
                              </span>
                            ) : this.state.isEdit ? (
                              <Button
                                className="btn btn-bold btn-label-brand btn-sm"
                                onClick={() => this.handleShowDisease()}
                              >
                                Add Disease
                              </Button>
                            ) : (
                              "Not Assigned"
                            )}
                          </FormGroup>
                          <div
                            style={{
                              border: "1px solid #c8ced3",
                              minHeight: "80px",
                              position: "absolute",
                              top: "0",
                              right: "0",
                              height: "100%",
                            }}
                          ></div>
                        </Col>
                        <Col xs="6">
                          <FormGroup>
                            <h5 className="mt-2">Tissue Details </h5>
                            <hr />
                            {diseases?.tissue != "" &&
                              diseases?.tissue != null ? (
                              <span>{diseases?.tissue}</span>
                            ) : (
                              "Not Assigned"
                            )}
                          </FormGroup>

                          {this.state.isEdit ? (
                            <button
                              id="DiseaseTissueDetailsEdit"
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "8px",
                                display: [1, 2, 3, 4].includes(
                                  diseases?.diseaseCategoryId
                                )
                                  ? "block"
                                  : "none",
                              }}
                              className="card-header-action btn btn-close"
                              to="#"
                              onClick={() => this.handleShowDisease()}
                            >
                              <i className="icon-pencil"></i>
                            </button>
                          ) : (
                            ""
                          )}
                        </Col>
                        <Col xs="6">
                          <FormGroup>
                            <h5 className="mt-2">Secondary Disease</h5>

                            {patientaccessionmapping?.secondaryCancer != "" &&
                              patientaccessionmapping?.secondaryCancer != null ? (
                              <span>
                                {patientaccessionmapping?.secondaryCancer}
                              </span>
                            ) : (
                              "Not Assigned"
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </>
              ) : null}
              {[2, 3, 4, 1, 5].includes(this.state?.diseaseCategoryId) ? (
                <>
                  <Card className="viewPatientForm">
                    <CardBody >
                      <Row>
                        <Col xs="12">
                          <FormGroup>
                            <h5 className="mt-2">Disease Description </h5>
                            <hr />

                          </FormGroup>
                          <div style={{ maxHeight: "300px", overflow: "auto" }}>
                            {ReactHtmlParser(
                              this?.state?.basicInfo?.patientAccessionMapping
                                ?.diseaseDesc || "<p></p>"
                            )}
                          </div>
                          {this.state.isEdit ? (
                            <button
                              disabled={
                                !this?.state?.basicInfo?.patientAccessionMapping
                                  ?.diseaseDesc
                              }
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "8px",
                                //  display: [1, 2, 3,4,5].includes(diseases?.diseaseCategoryId) ? "block" : "none"
                              }}
                              id="DiseaseDescriptionEdit"
                              className="card-header-action btn btn-close"
                              to="#"
                              onClick={() =>
                                this.handleShowDiseaseDescription()
                              }
                            >
                              <i className="icon-pencil"></i>
                            </button>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </>
              ) : null}
              <Card className="viewPatientForm">
                <CardBody>
                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <h5 className="mt-2">Neo7 Analysis Type </h5>
                        <hr />
                        {diseases?.diseaseCategory != "" &&
                          diseases?.diseaseCategory != null ? (
                          <span>
                            {diseases?.parentDiseaseCategory !== ""
                              ? diseases?.parentDiseaseCategory + ` - `
                              : null}
                            {diseases?.diseaseCategory}
                            <b style={{ color: "red" }}>
                              {diseases?.isMetastasis ? " - Metastasis" : ""}
                            </b>
                          </span>
                        ) : (
                          "Not Assigned"
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card className="viewPatientForm">
                <CardBody>
                  <Row>
                    <Col xs="11" sm="11" lg="10" xl="11">
                      <FormGroup>
                        <h5 className="mt-2">Practitioner </h5>
                      </FormGroup>
                    </Col>
                    {assignedpractitioner == "" &&
                      assignedpractitioner == null && (
                        <Col xs="1" sm="1" lg="2" xl="1">
                          <FormGroup>
                            {this.state.isEdit ? (
                              <button
                                id=""
                                className="btn btn-primary btn-md float-right"
                                onClick={() => this.handleShowPractitioner()}
                              >
                                Assign
                              </button>
                            ) : null}
                          </FormGroup>
                        </Col>
                      )}
                  </Row>
                  <hr />
                  {/* {console.log("assignedpractitioner:::", assignedpractitioner)} */}
                  {assignedpractitioner != "" &&
                    assignedpractitioner != null ? (
                    <Row>
                      <Col xs="3">
                        <FormGroup>
                          <h6>Name</h6>
                          <span>
                            {assignedpractitioner.firstName +
                              " " +
                              assignedpractitioner.lastName}
                          </span>
                        </FormGroup>
                      </Col>
                      <Col xs="3">
                        <FormGroup>
                          <h6>Email</h6>
                          <a
                            className="form-control"
                            href={`mailto: ${assignedpractitioner.email}`}
                          >
                            {assignedpractitioner.email}
                          </a>
                        </FormGroup>
                      </Col>
                      <Col xs="3">
                        <FormGroup>
                          <h6>Primary Phone</h6>
                          <a
                            className="form-control"
                            href={`phoneto: ${assignedpractitioner.mobile}`}
                          >
                            {assignedpractitioner.mobile || "Not Provided"}
                          </a>
                        </FormGroup>
                      </Col>
                      <Col xs="3">
                        <FormGroup>
                          <h6>Secondary Phone</h6>
                          <a
                            className="form-control"
                            href={`phoneto: ${assignedpractitioner.phoneNumber}`}
                          >
                            {assignedpractitioner.phoneNumber || "Not Provided"}
                          </a>
                        </FormGroup>
                      </Col>
                      {/* <Col xs="3">
                        <FormGroup>
                          <h6>Mobile</h6>
                          <span>{assignedpractitioner.mobile || "Not Provided"}</span>
                        </FormGroup>
                      </Col> */}
                      {
                        // this.state.isEdit && !this.state.basicInfo?.designOrderStatus?.poReceived
                        true ? (
                          <div style={{ position: "absolute", right: "12px" }}>
                            <Link
                              className="card-header-action btn btn-close"
                              to="#"
                              id="PractitionersDetailsEdit"
                              onClick={() => {
                                this.setState({
                                  practitionerId:
                                    assignedpractitioner.practitionerId,
                                });
                                return this.handleShowPractitioner();
                              }}
                            >
                              <i className="icon-pencil"></i>
                            </Link>
                            {/* <Confirm
                            title="Confirm"
                            description="Are you sure want to delete this practitioner?"
                          >
                            {(confirm) => (
                              <Link
                                className="card-header-action btn btn-close"
                                to="#"
                                onClick={confirm((e) =>
                                  this.deletePractitionerPatient(
                                    e,
                                    assignedpractitioner.practitionerPatientId
                                  )
                                )}
                              >
                                <i className="icon-trash"></i>
                              </Link>
                            )}
                          </Confirm> */}
                          </div>
                        ) : (
                          <Col xs="1"></Col>
                        )
                      }
                    </Row>
                  ) : (
                    <Row>
                      <Col xs="12">
                        <span>Not Assigned</span>
                      </Col>
                    </Row>
                  )}
                </CardBody>
              </Card>

              <Card className="viewPatientForm">
                <CardBody>
                  <Row>
                    <Col xs="12">
                      <p className="mt-2 d-flex align-items-center justify-content-between">
                        <span className="h5">Notes</span>{" "}
                        <Button
                          id="CreatePatientNote"
                          color="primary"
                          Style={{ cursor: "pointer" }}
                          className="btn btn-primary text-light float-right"
                          onClick={this.handleShowNotes}
                        >
                          {/* <i className="fa fa-plus text-light" ></i>  */}
                          <i className="icon-plus text-light"></i> Create Note
                          {/* <i className="fa-light fa-note-sticky"></i> */}
                          {/* <img src={notes_icon} style={{color:"blue", height: "20px", width: "20px", float: "right", cursor: "pointer" }} alt="Notes" /> */}
                        </Button>
                      </p>

                      <hr />

                      {this.state.sectionsNames.map((Pdata) => {
                        return (
                          <>
                            <Row>
                              <Col xs="12">
                                {this.state.AllpatientNotes.filter((Fdata) => {
                                  return Fdata.sectionId == Pdata.id;
                                }).length > 0 ? (
                                  <p className="mt-2 d-flex align-items-center justify-content-between">
                                    <span className="h5 text-primary">
                                      {Pdata.sectionName}
                                    </span>{" "}
                                  </p>
                                ) : null}

                                <Row>
                                  {this.state.AllpatientNotes.filter(
                                    (Fdata) => {
                                      return Fdata.sectionId == Pdata.id;
                                    }
                                  ).length > 0
                                    ? this.state.AllpatientNotes.filter(
                                      (Fdata) => {
                                        return Fdata.sectionId == Pdata.id;
                                      }
                                    ).map((Cdata) => {
                                      return (
                                        <Col xs="12" className="col-lg-4">
                                          <div
                                            // onClick={e => this.EditNotes(e, Cdata.patientAccessionId, Cdata.patientNoteId, Cdata.notesTitle, Cdata.sectionId, Cdata.notes, Cdata.assignedToUserId, Cdata.createdBy)}
                                            // style={{ cursor: "pointer" }}
                                            className="form-group"
                                          >
                                            <div className="note bg-light ">
                                              <div className="note__body p-0 m-0">
                                                <p
                                                  className="m-0 p-0"
                                                  onClick={(e) =>
                                                    this.EditNotes(
                                                      e,
                                                      Cdata.patientAccessionId,
                                                      Cdata.patientNoteId,
                                                      Cdata.notesTitle,
                                                      Cdata.sectionId,
                                                      Cdata.notes,
                                                      Cdata.assignedToUserId,
                                                      Cdata.createdBy
                                                    )
                                                  }
                                                  style={{
                                                    height: "20vh",
                                                    overflowY: "auto",
                                                    overflowX: "auto",
                                                    // height:  "20vh",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  {/* <ReactReadMoreReadLess

                                                    charLimit={300}
                                                    readMoreText={"Read more ▼"}
                                                    readLessText={"Read less ▲"}
                                                    readMoreStyle={{ color: "blue" }}
                                                    readLessStyle={{ color: "blue" }}
                                                  >  */}

                                                  {/* {ReactHtmlParser(Cdata.notes)} */}
                                                  {ReactHtmlParser(
                                                    Cdata.notes
                                                  )}
                                                  {/* </ReactReadMoreReadLess> */}
                                                </p>
                                                {/* <textarea
                                        name="inputTextforNotes"
                                        cols="30"
                                        style={{ width: "auto", fontSize: "12px", overflow: "hidden" }}
                                        rows="5"
                                        disabled={true}
                                        // placeholder="Type ...."
                                        // maxLength="1000"
                                        // onChange={this.handleNoteInput.bind(this)}
                                        value={data.notes}
                                      ></textarea> */}
                                              </div>
                                              <div className="note__foter mt-1 ">
                                                {/* <span>{data.createdDate}</span> */}
                                                <div className="float-">
                                                  {/* <button onClick={e => this.toggleNotes(e, data.patientAccessionId)} className="note__save text-danger">Delete</button> {" "} */}

                                                  {
                                                    <>
                                                      <div className="d-flex justify-content-between">
                                                        {/* <div className="d-flex flex-column">
                                                          <div style={{ height: "32px", width: "32px" }}
                                                            className="bg-primary text-center d-flex justify-content-center rounded-pill border border-1">
                                                            <span className="mt-1 text-light">
                                                              <span>
                                                                <small>
                                                                  {
                                                                    Cdata.createdByUserName?.split(" ")[0].slice(0, 1).toUpperCase()

                                                                  }
                                                                  {
                                                                    Cdata.createdByUserName?.split(" ").length > 1 ?
                                                                      (Cdata.createdByUserName?.split(" ")[Cdata.createdByUserName?.split(" ").length - 1].slice(0, 1).toUpperCase())
                                                                      : ""
                                                                  }

                                                                </small>
                                                              </span>

                                                            </span>
                                                          </div>


                                                        </div> */}
                                                        {/* <div className="d-flex flex-column">
                                                          <span className="text-bold"><samall>Assigned to </samall> </span>

                                                          <div style={{ height: "32px", width: "32px" }}
                                                            className="bg-primary text-center d-flex justify-content-center rounded-pill border border-1">
                                                            <span className="mt-1 text-light">
                                                              <span>
                                                                <small>
                                                                  {
                                                                    Cdata.assignedByUserName?.split(" ")[0].slice(0, 1).toUpperCase()

                                                                  }
                                                                  {
                                                                    Cdata.assignedByUserName?.split(" ").length > 1 ?
                                                                      (Cdata.assignedByUserName?.split(" ")[Cdata.assignedByUserName?.split(" ").length - 1].slice(0, 1).toUpperCase())
                                                                      : ""
                                                                  }

                                                                </small>
                                                              </span>

                                                            </span>
                                                          </div>


                                                        </div> */}
                                                      </div>
                                                      <div className="mt-0">
                                                        <div className="d-flex justify-content-between align-items-center ">
                                                          {/* <span className="">
                                                            <small>
                                                              <b>
                                                                Created at :
                                                              </b>
                                                            </small>
                                                          </span> */}
                                                          <div className="d-flex align-items-center fle-column">
                                                            {/* <span className="text-bold"><samall>Created By </samall> </span> */}
                                                            <ReactTooltip
                                                              anchorId={
                                                                Cdata.patientNoteId
                                                              }
                                                              place="right"
                                                              variant="info"
                                                              content={
                                                                Cdata.createdByUserName
                                                              }
                                                            />
                                                            <div
                                                              id={
                                                                Cdata.patientNoteId
                                                              }
                                                              style={{
                                                                height:
                                                                  "32px",
                                                                width: "32px",
                                                              }}
                                                              className="bg-primary text-center d-flex justify-content-center rounded-pill border border-1"
                                                            >
                                                              <span className="mt-1 text-light">
                                                                <span>
                                                                  <small>
                                                                    {Cdata.createdByUserName
                                                                      ?.split(
                                                                        " "
                                                                      )[0]
                                                                      .slice(
                                                                        0,
                                                                        1
                                                                      )
                                                                      .toUpperCase()}
                                                                    {Cdata.createdByUserName?.split(
                                                                      " "
                                                                    ).length >
                                                                      1
                                                                      ? Cdata.createdByUserName
                                                                        ?.split(
                                                                          " "
                                                                        )
                                                                      [
                                                                        Cdata.createdByUserName?.split(
                                                                          " "
                                                                        )
                                                                          .length -
                                                                        1
                                                                      ].slice(
                                                                        0,
                                                                        1
                                                                      )
                                                                        .toUpperCase()
                                                                      : ""}
                                                                  </small>
                                                                </span>
                                                              </span>
                                                            </div>
                                                            <div className="ml-2">
                                                              <Confirm
                                                                title="Confirm"
                                                                description="Are you sure you want to permanently delete this note?"
                                                              >
                                                                {(
                                                                  confirm
                                                                ) => (
                                                                  <Button
                                                                    className={`btn btn-danger btn-sm btn-pill text-light`}
                                                                    onClick={confirm(
                                                                      (e) =>
                                                                        this.deletePatientNote(
                                                                          e,
                                                                          Cdata.patientNoteId
                                                                        )
                                                                    )}
                                                                  >
                                                                    <i className="icon-trash text-light"></i>
                                                                  </Button>
                                                                )}
                                                              </Confirm>
                                                            </div>
                                                          </div>
                                                          <span className="ml-2 float-right">
                                                            <small>
                                                              <b>
                                                                {
                                                                  (function () {
                                                                    let a =
                                                                      Moment(
                                                                        Cdata.createdDate
                                                                      ).format(
                                                                        "Do MMM YYYY"
                                                                      );
                                                                    // console.log("a", a)
                                                                    return (
                                                                      <>
                                                                        {a.length >
                                                                          12
                                                                          ? a.slice(
                                                                            0,
                                                                            2
                                                                          )
                                                                          : a.slice(
                                                                            0,
                                                                            1
                                                                          )}
                                                                        <sup>
                                                                          {a.length >
                                                                            12
                                                                            ? a.slice(
                                                                              2,
                                                                              4
                                                                            )
                                                                            : a.slice(
                                                                              1,
                                                                              3
                                                                            )}
                                                                        </sup>
                                                                        {a.length >
                                                                          12
                                                                          ? a.slice(
                                                                            4,
                                                                            8
                                                                          )
                                                                          : a.slice(
                                                                            3,
                                                                            7
                                                                          )}
                                                                        {","}
                                                                        {a.length >
                                                                          12
                                                                          ? a.slice(
                                                                            8
                                                                          )
                                                                          : a.slice(
                                                                            7
                                                                          )}
                                                                      </>
                                                                    );
                                                                  })()
                                                                  // Moment(Cdata.createdDate).format("Do MMM YYYY")
                                                                  // Moment(Cdata.createdDate).format("MMM Do YYYY")
                                                                }
                                                              </b>
                                                            </small>
                                                          </span>
                                                        </div>
                                                        {/* 
                                                        <div className="d-flex"
                                                       
                                                        >
                                                          <span className="">
                                                            <small>
                                                              <b>
                                                                Updated at :
                                                              </b>
                                                            </small>
                                                          </span>
                                                          <span className="ml-2">
                                                            <small>
                                                              <b>
                                                                {
                                                                  Moment(Cdata.updatedDate).format("MMM Do YYYY")

                                                                }
                                                              </b>

                                                            </small>

                                                          </span>



                                                        </div> */}
                                                      </div>
                                                    </>
                                                  }

                                                  {/* <button
                                         onClick={e => this.EditNotes(e, data.patientAccessionId, data.patientNoteId, data.notesTitle, data.sectionId, data.notes, data.assignedToUserId)} 
                                         className="ml-1 note__save text-dark">View</button> */}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </Col>
                                      );
                                    })
                                    : ""}
                                </Row>
                              </Col>
                            </Row>
                          </>
                        );
                      })}

                      <Modal
                        isOpen={this.state.add_notes}
                        className="modal-dialog modal-lg"
                      >
                        <ModalBody className="">
                          <p className="" ref={this.modal_notes_scroll_}>
                            <span className="h4">Create Note</span>
                            <span
                              className="float-right"
                              onClick={this.handleCloseNotes}
                            >
                              <img
                                style={{
                                  height: "20px",
                                  width: "20px",
                                  cursor: "pointer",
                                }}
                                className="img-fluid"
                                src={close_icon}
                                alt="close"
                              />
                            </span>
                          </p>
                          {/* <p className="bg- pb-3 pl-2 rounded rounded-2 h4">

                            Create Note

                          </p> */}
                          <div className="d-flex px-2 note_section_main_se">
                            <FormGroup>
                              <Label>
                                Section <span className="requiredField">*</span>
                              </Label>

                              <Input
                                type="select"
                                className={
                                  errors.countryId
                                    ? "is-invalid custom-select"
                                    : "is-valid custom-select"
                                }
                                style={{ maxWidth: "250px" }}
                                name="sectionId"
                                value={this.state.sectionId}
                                onChange={this.handleInputChangeForUser.bind(
                                  this
                                )}
                              >
                                <option value="">Select Section</option>
                                {this.state.sectionsNames.map((data, i) => {
                                  return (
                                    <option
                                      className="text-dark"
                                      key={i}
                                      value={data.id}
                                    >
                                      {data.sectionName}
                                    </option>
                                  );
                                })}
                              </Input>
                              <br />
                              <span className="error">
                                <small>{this.state.errors.sectionId}</small>
                              </span>
                            </FormGroup>
                            <span className="mx-2"></span>

                            {/* <FormGroup>
                              <Label>
                                Assign to{" "}
                                <span className="requiredField">*</span>
                              </Label>

                              <Input
                                type="select"
                                className={
                                  errors.countryId
                                    ? "is-invalid custom-select"
                                    : "is-valid custom-select"
                                }
                                style={{ maxWidth: "250px" }}
                                name="assignUserId"
                                value={this.state.assignUserId}
                                onChange={this.handleInputChangeForUser.bind(this)}
                              >
                                <option value="">Select  User</option>
                                {this.state.organizationusersforNotes.map((data, i) => {
                                  return (
                                    <option className="text-dark" key={i} value={data.organizationUserId}>
                                      {data.fullName}
                                    </option>
                                  );
                                })}
                              </Input>
                              <br />
                              <span className="error ">
                                <small>
                                  {this.state.errors.assignUserId}
                                </small>
                              </span>
                            </FormGroup> */}
                          </div>
                          {/* <p className="bg-light py-3 px-2 rounded rounded-2">
                            <Input type="text" className="" maxLength="100" name="note_title" value={this.state.note_title} onChange={this.handleNoteInput.bind(this)} placeholder="Note title...." />
                            <span className="error">
                              <small>
                                {this.state.errors.note_title}
                              </small>
                            </span>
                          </p> */}
                          <div className="form-group">
                            <div className="note bg-light">
                              <div className="note__body">
                                {/* <textarea
                                  name="inputTextforNotes"
                                  cols="89"
                                  style={{ width: "auto" }}
                                  rows="7"
                                  placeholder="Write Description ...."
                                  maxLength="500"
                                  onChange={this.handleNoteInput.bind(this)}
                                  value={this.state.inputTextforNotes}
                                ></textarea> */}
                                <CKEditor
                                  editor={ClassicEditor}
                                  name="inputTextforNotes"
                                  // cols="89"
                                  style={{ width: "auto" }}
                                  // rows="7"
                                  config={{
                                    placeholder: "Write Something ....",
                                    mention: {
                                      feeds: [
                                        {
                                          marker: "@",
                                          feed: this.getFeedItems,
                                        },
                                      ],
                                    },
                                    simpleUpload: {
                                      // The URL that the images are uploaded to.
                                      uploadUrl:
                                        window.$APIPath +
                                        "/api/BE_ReportBuilder/UploadNotesCkeditorImage",

                                      // Enable the XMLHttpRequest.withCredentials property.
                                      // withCredentials: true,

                                      // Headers sent along with the XMLHttpRequest to the upload server.
                                      headers: {
                                        "X-CSRF-TOKEN": "CSRF-Token",
                                        Authorization:
                                          "Bearer <JSON Web Token>",
                                      },
                                    },
                                  }}
                                  // maxLength="500"
                                  onChange={(event, editor) => {
                                    const data = editor?.getData();
                                    let errors = this.state.errors;
                                    errors.inputTextforNotes = "";
                                    this.setState({ inputTextforNotes: data });

                                    // this.handleNoteInput.bind(this)
                                  }}
                                  data={this.state.inputTextforNotes || ""}
                                ></CKEditor>
                                <span className="error">
                                  <small>
                                    {this.state.errors.inputTextforNotes}
                                  </small>
                                </span>
                              </div>
                            </div>
                          </div>
                        </ModalBody>

                        <ModalFooter>
                          {/* <Button color="secondary" onClick={this.handleCloseNotes}>
                            Close
                          </Button> */}
                          {/* {loading ?
                            <Button color="primary" disabled onClick={this.AddNotes.bind(this)}>
                              Add
                            </Button> : */}
                          <Button
                            color="primary"
                            onClick={this.AddNotes.bind(this)}
                          >
                            Create
                          </Button>
                          {/* } */}
                        </ModalFooter>
                      </Modal>

                      <Modal
                        isOpen={this.state.showEmailNotifyConfirm}
                        className="modal-dialog modal-md"
                      >
                        <ModalHeader>Confirm</ModalHeader>
                        <ModalBody>
                          Are you sure you want to turn{this.state.emailNotify ? " off " : " on "}Email notification?
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="secondary"
                            onClick={() =>
                              this.setState({ showEmailNotifyConfirm: false })
                            }
                          >
                            Cancel
                          </Button>
                          <Button
                            color="primary"
                            disabled={loading}
                            onClick={() =>
                              this.handleDisableEmailNotification()
                            }
                          // this.setState({ emailNotify: false, showEmailNotifyConfirm: false })}
                          >
                            Yes
                          </Button>
                        </ModalFooter>

                      </Modal>
                      <Modal
                        isOpen={this.state.showInvoiceModal}
                        className="modal-dialog modal-md"
                      >
                        <ModalHeader className="justify-content-start">Send file via email</ModalHeader>
                        <ModalBody>
                          <Form className="form-horizontal"
                          // onSubmit={this.handleSubmit.bind(this)}
                          >
                            <Row>
                              <Col xs="12">

                                <FormGroup>

                                  <Label>Email(s)</Label>
                                  <span className="requiredField">*</span>



                                  <CreatableSelect
                                    isMulti
                                    options={this.state.allEmail}
                                    onChange={e => this.handleEmailChange(e, "Report_Email")}
                                    value={this.state.selectedEmails}
                                    isClearable={true}
                                    isSearchable={true}
                                    placeholder="Recipients"
                                    formatCreateLabel={(inputValue) => `${inputValue}`}
                                    isValidNewOption={this.isValidNewOption}
                                    getOptionLabel={(opt) => (this.state.selectedEmails && this.state.selectedEmails.includes(opt) ? opt.name ? opt.name : opt.value : opt.name ? <>{opt.name} <br />{opt.value}</> : `${opt.value}`)}
                                    menuPlacement="bottom"
                                    maxMenuHeight={200}
                                  />
                                  {this.state.sendFREmailErrors && <p className="error">{this.state.sendFREmailErrors}</p>}
                                </FormGroup>
                              </Col>
                              {/* <Col xs="12"></Col> */}
                              <Col xs="12">
                                <FormGroup>
                                  <Label >
                                    Subject
                                  </Label>
                                  <span className="requiredField">*</span>
                                  <Input
                                    type="text" className=""
                                    id="standard-basic" label="Subject"
                                    style={{ padding: "1.30rem 1rem" }}
                                    variant="standard" placeholder="Subject"
                                    value={this.emailFRSubject}
                                    onChange={this.handleFRSubject} />
                                  {
                                    this.state.sendFRSubjectErrors && <p className="error">{this.state.sendFRSubjectErrors}</p>
                                  }

                                </FormGroup>
                              </Col>
                              <Col xs="12">
                                <FormGroup>
                                  <Label>Description </Label>

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
                                          placeholder: "Write description...",
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
                                            this.setState({ emailFRDesc: data });
                                            // this.handleNoteInput.bind(this)
                                          }
                                        }
                                        data={this.state.emailFRDesc || ""}
                                      ></CKEditor>
                                    </GrammarlyEditorPlugin>
                                  </Grammarly >
                                </FormGroup>
                              </Col>
                              <Col xs="12"></Col>
                            </Row>
                          </Form>
                        </ModalBody>
                        <ModalFooter className="justify-content-end">
                          <Button
                            color="secondary"
                            onClick={() =>
                              this.setState({
                                showInvoiceModal: false,
                                addedFREmails: [],
                                emailFRDesc: "",
                                emailFRSubject: "",
                                InvoiceOrPoId: "",
                                InvoiceOrPoType: "",
                                sendFRSubjectErrors: "",
                                sendFREmailErrors: "",
                                selectedEmails: ""
                              })
                            }
                          >
                            Cancel
                          </Button>
                          <Button
                            color="primary"
                            onClick={() => this.handleSubmitInvoiceOrPo()}
                          >
                            Send
                          </Button></ModalFooter>
                      </Modal>
                      <Modal
                        isOpen={this.state.showFRMailModal}
                        className="modal-dialog modal-md"
                      >
                        <ModalHeader className="justify-content-start">Send file via email</ModalHeader>
                        <ModalBody>
                          <Form className="form-horizontal"
                          // onSubmit={this.handleSubmit.bind(this)}
                          >
                            <Row>
                              <Col xs="12">

                                <FormGroup>

                                  <Label>Email(s)</Label>
                                  <span className="requiredField">*</span>

                                  {/* <ReactMultiEmail
                                    placeholder="Recipients..."
                                    emails={this.state.addedFREmails}

                                    onChange={(_emails) => {
                                      console.log("_emails", _emails)
                                      // let test = /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(_emails)
                                      // if (test) {
                                      //   this.setState({
                                      //     addedFREmails: _emails,
                                      //     sendFREmailErrors: ""
                                      //   });
                                      // } else {
                                      //   this.setState({

                                      //     sendFREmailErrors: "Invalid Email"
                                      //   });
                                      // }
                                      // if (this.isFRValid(_emails)) {
                                      this.setState({
                                        addedFREmails: _emails,
                                        sendFREmailErrors: ""
                                      });
                                      // }
                                    }}
                                    getLabel={(
                                      email,
                                      index,
                                      removeEmail
                                    ) => {
                                      return (
                                        <div data-tag key={index}>
                                          {email}
                                          <span data-tag-handle onClick={() => removeEmail(index)}>
                                            ×
                                          </span>
                                        </div>
                                      );
                                    }}
                                  /> */}
                                  <CreatableSelect
                                    isMulti
                                    options={this.state.allEmail}
                                    onChange={e => this.handleEmailChange(e, "Report_Email")}
                                    value={this.state.selectedEmails}
                                    isClearable={true}
                                    isSearchable={true}
                                    placeholder="Recipients"
                                    formatCreateLabel={(inputValue) => `${inputValue}`}
                                    isValidNewOption={this.isValidNewOption}
                                    getOptionLabel={(opt) => (this.state.selectedEmails && this.state.selectedEmails.includes(opt) ? opt.name ? opt.name : opt.value : opt.name ? <>{opt.name} <br />{opt.value}</> : `${opt.value}`)}
                                    menuPlacement="bottom"
                                    maxMenuHeight={200}
                                  />
                                  {this.state.sendFREmailErrors && <p className="error">{this.state.sendFREmailErrors}</p>}
                                </FormGroup>
                              </Col>
                              {/* <Col xs="12"></Col> */}
                              <Col xs="12">
                                <FormGroup>
                                  <Label >
                                    Subject
                                  </Label>
                                  <span className="requiredField">*</span>
                                  <Input
                                    type="text" className=""
                                    id="standard-basic" label="Subject"
                                    style={{ padding: "1.30rem 1rem" }}
                                    variant="standard" placeholder="Subject"
                                    value={this.emailFRSubject}
                                    onChange={this.handleFRSubject} />
                                  {
                                    this.state.sendFRSubjectErrors && <p className="error">{this.state.sendFRSubjectErrors}</p>
                                  }

                                </FormGroup>
                              </Col>
                              {/* <Col xs="12"></Col> */}
                              <Col xs="12">
                                <FormGroup>
                                  <Label>Description </Label>
                                  {/* <Input type="textarea" tabIndex="2" autocomplete="off" name="description"
                                    value={this.emailFRDesc} onChange={this.handleEmailFRDesc}
                                    placeholder="Enter description"
                                    maxLength="300" /> */}

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
                                          placeholder: "Write description...",
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
                                            this.setState({ emailFRDesc: data });
                                            // this.handleNoteInput.bind(this)
                                          }
                                        }
                                        data={this.state.emailFRDesc || ""}
                                      ></CKEditor>
                                    </GrammarlyEditorPlugin>
                                  </Grammarly >
                                </FormGroup>
                              </Col>
                              <Col xs="12"></Col>
                            </Row>
                            {/* <Row>
                              <Col xs="12">
                                <FormGroup className="formButton">
                                  <Input type="hidden" name="roleId"
                                  // value={roleId} 
                                  />
                                  {
                                    this.state.isEdit ? <>
                                      <Button type="submit"
                                        //  disabled={loading}
                                        color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button><span>{" "}</span>
                                    </>
                                      : null
                                  }
                                  {
                                    this.state.isEdit ? <>
                                      <Button type="reset" color="danger"
                                      // onClick={this.onResetClick.bind(this)}
                                      ><i className="fa fa-ban"></i> Reset</Button>
                                    </> : null}
                                </FormGroup>
                              </Col>
                            </Row> */}
                          </Form>
                        </ModalBody>
                        <ModalFooter className="justify-content-end">
                          <Button
                            color="secondary"
                            onClick={() =>
                              this.setState({
                                showFRMailModal: false,
                                addedFREmails: [],
                                emailFRDesc: "",
                                emailFRSubject: "",
                                finalReportId_Email: "",
                                finalReportType_Email: "",
                                sendFRSubjectErrors: "",
                                sendFREmailErrors: "",
                                selectedEmails: "",
                              })
                            }
                          >
                            Cancel
                          </Button>
                          <Button
                            color="primary"
                            // onClick={() =>
                            //   this.handleDisableEmailNotification()
                            // }
                            // this.setState({ emailNotify: false, showFRMailModal: false })}
                            onClick={() => this.handleSubmitFR()}
                          >
                            Send
                          </Button></ModalFooter>
                      </Modal>
                      <Modal
                        isOpen={this.state.edit_notes}
                        className="modal-dialog modal-lg"
                      >
                        <ModalBody>
                          <p className="">
                            <span className="h3">Note</span>
                            <span
                              className="float-right"
                              onClick={this.handleCloseNotesEdit}
                            >
                              <img
                                style={{
                                  height: "20px",
                                  width: "20px",
                                  cursor: "pointer",
                                }}
                                className="img-fluid"
                                src={close_icon}
                                alt="close"
                              />
                            </span>
                          </p>
                          {/* <p className="bg- py-3 px-2 rounded rounded-2 h3 mt-1">
                            Note
                          </p> */}

                          {/* <p className="bg- py-3 px-2 rounded rounded-2 h1 mt-4">

                            <Input
                              type="text"
                              name="note_title"
                              value={this.state.note_title}
                              disabled={this.state.notes_createdBy_Id !== this.state.notes_updatedBy_Id}
                              className="form-control-lg font-weight-bold"
                              onChange={this.handleNoteInput.bind(this)}
                              maxLength="100"
                            />
                          </p> */}

                          {/* </ModalBody> */}

                          {/* <ModalBody className=""> */}
                          <div className="d-flex px-2">
                            <FormGroup>
                              <Label>
                                Section <span className="requiredField">*</span>
                              </Label>

                              <Input
                                type="select"
                                className={
                                  errors.countryId
                                    ? "is-invalid custom-select"
                                    : "is-valid custom-select"
                                }
                                style={{ maxWidth: "250px" }}
                                name="sectionId"
                                disabled={true}
                                value={this.state.sectionId}
                              // onChange={this.handleInputChangeForUser.bind(this)}
                              >
                                <option value="">Select Section</option>
                                {this.state.sectionsNames.map((data, i) => {
                                  return (
                                    <option
                                      className="text-dark"
                                      key={i}
                                      value={data.id}
                                    >
                                      {data.sectionName}
                                    </option>
                                  );
                                })}
                              </Input>
                            </FormGroup>
                            <span className="mx-2"></span>

                            {/* <FormGroup>
                              <Label>
                                Assign to{" "}
                                <span className="requiredField">*</span>
                              </Label>

                              <Input
                                type="select"
                                className={
                                  errors.countryId
                                    ? "is-invalid custom-select"
                                    : "is-valid custom-select"
                                }
                                style={{ maxWidth: "250px" }}
                                name="assignUserId"
                                disabled={true}
                                value={this.state.assignUserId}
                              // onChange={this.handleInputChangeForUser.bind(this)}
                              >
                                <option value="">Select  User</option>
                                {this.state.organizationusersforNotes.map((data, i) => {
                                  return (
                                    <option className="text-dark" key={i} value={data.organizationUserId}>
                                      {data.fullName}
                                    </option>
                                  );
                                })}
                              </Input>
                            </FormGroup> */}
                          </div>
                        </ModalBody>
                        <ModalBody>
                          <div className="form-group note_section_main_se">
                            <div className="note bg-light">
                              <div className="note__body">
                                <CKEditor
                                  editor={ClassicEditor}
                                  // disabled={this.state.notes_createdBy_Id !== this.state.notes_updatedBy_Id}

                                  name="inputTextforNotes"
                                  // cols="89"
                                  style={{ width: "auto" }}
                                  // rows="7"
                                  config={{
                                    placeholder: "Write Something ....",
                                    mention: {
                                      feeds: [
                                        {
                                          marker: "@",
                                          feed: this.getFeedItems,
                                        },
                                      ],
                                    },
                                    simpleUpload: {
                                      // The URL that the images are uploaded to.
                                      uploadUrl:
                                        window.$APIPath +
                                        "/api/BE_ReportBuilder/UploadNotesCkeditorImage",

                                      // Enable the XMLHttpRequest.withCredentials property.
                                      // withCredentials: true,

                                      // Headers sent along with the XMLHttpRequest to the upload server.
                                      headers: {
                                        "X-CSRF-TOKEN": "CSRF-Token",
                                        Authorization:
                                          "Bearer <JSON Web Token>",
                                      },
                                    },
                                  }}
                                  // maxLength="500"
                                  onChange={(event, editor) => {
                                    const data = editor?.getData();
                                    this.setState({ inputTextforNotes: data });

                                    // this.handleNoteInput.bind(this)
                                  }}
                                  data={this.state.inputTextforNotes || ""}
                                ></CKEditor>
                              </div>
                            </div>
                          </div>
                        </ModalBody>

                        {/* // <ModalBody>
                            //   <Row>
                            //     <Col xs="12" className="">
                            //       <div className="form-group" >
                            //         <div className="note bg-light">
                            //           <div
                            //             className=" note__body"

                            //           >
                            //             <ReactReadMoreReadLess

                            //               charLimit={300}
                            //               readMoreText={"Read more ▼"}
                            //               readLessText={"Read less ▲"}
                            //               readMoreStyle={{ color: "blue" }}
                            //               readLessStyle={{ color: "blue" }}
                            //             >
                            //               {this.state.inputTextforNotes}
                            //             </ReactReadMoreReadLess>
                            //           </div>
                            //         </div>
                            //       </div>
                            //     </Col>
                            //   </Row>

                            // </ModalBody> */}

                        {/* <ModalHeader> */}

                        {/* </ModalHeader> */}
                        {/* <ModalBody style={{
                          overflowY: "auto",
                          height: this.state.showComments.length > 4 ? "80vh" : "100%"
                        }}> */}

                        {/* <ModalBody  >
                          <div className="form-group">
                            <div className="note bg-light">
                              <div className="note__body">

                                <textarea
                                  name="inputTextforNotes"
                                  cols="50"
                                  style={{ width: "auto" }}
                                  rows="10"
                                  placeholder="Write Something ...."
                                  // maxLength="1000"
                                  onChange={this.handleNoteInput.bind(this)}
                                  value={this.state.inputTextforNotes}
                                ></textarea>
                              </div>


                            </div>

                          </div>

                        </ModalBody> */}

                        {/* 
                          <div>
                            <b>
                              Comments {this.state.showComments.length > 0 ? `(${this.state.showComments.length})` : ""}
                            </b>
                          </div> */}
                        {/* <br />
                          <div className="" style={{ display: "flex" }} >
                            <Input type="text" value="" disabled={this.state.IsReply} onClick={this.ReplyFun} placeholder="Add Comments...." />

                          </div>
                          <br />
                          <div
                            style={{ display: this.state.IsReply ? "" : "none" }}
                          >

                            <div className="note border shadow ml-lg-5" style={{ maxWidth: "90%" }}>
                              <div className="note__bod">
                                <div className="">
                                 
                                  <CKEditor
                                    editor={ClassicEditor}
                                    name="commentText"
                                    // cols="89"
                                    style={{ width: "auto" }}
                                    // rows="7"
                                    config={{
                                      placeholder: "Write Something ....",
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
                                        this.setState({ commentText: data });
                                      }
                                    }
                                    data={this.state.commentText || ""}
                                  ></CKEditor>
                                  <div className="note__foter mt-2">
                                    <div className="d-flex flex-row float-right">
                                      <Button onClick={this.CancelComments} className="note__save text-light bg-primary" >Cancel</Button> {" "}
                                      <Button
                                        disabled={this.state.commentText.trim() == ""}


                                        onClick={this.AddNoteComment.bind(this)} className="ml-1 note__save text-light bg-primary">Save</Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>


                          </div> */}

                        {/* <div className="container-fluid"> */}

                        {/* <div className=" my-3"> */}
                        {/* <div className="d-flex my-3">
                            
                              </div>
                              <div className="row">
                                <div
                                  className="col-10 "
                                >
                                  <p className="px-lg-1">
                                    {
                                      this.state.showComments.length > 0 ?

                                        this.state.showComments.map((data, i) => {
                                          return <>
                                            <p>
                                              <div className="ml-2 d-flex align-items-center">
                                                <div style={{ height: "32px", width: "32px" }}
                                                  className="bg-primary text-center d-flex justify-content-center rounded-pill border border-1">
                                                  <span className="mt-1 text-light">
                                                    <span>
                                                      <small>
                                                        {
                                                          data.createdByUserName?.split(" ")[0].slice(0, 1).toUpperCase()

                                                        }
                                                        {
                                                          data.createdByUserName?.split(" ").length > 1 ?
                                                            (data.createdByUserName?.split(" ")[data.createdByUserName?.split(" ").length - 1].slice(0, 1).toUpperCase())
                                                            : ""
                                                        }

                                                      </small>
                                                    </span>

                                                  </span>
                                                </div>

                                                <span className="mx-2">
                                                  <b>
                                                    {data.createdByUserName}

                                                  </b>

                                                </span>
                                                <span className="font light">
                                                  <small>

                                                    {
                                                      data.isUpdated == true ?
                                                        <>
                                                          <span>(Updated)</span>  {Moment(data.updatedDate).format("MMM Do YYYY, kk:mm A")}
                                                        </>
                                                        : <>
                                                          {
                                                            Moment(data.createdDate).format("MMM Do YYYY, kk:mm A")
                                                          }

                                                        </>

                                                      // console.log(Moment(data.createdDate).format("YYYY/MM/DD kk:mm:ss"))


                                                    }
                                                  </small>

                                                </span>

                                              </div>
                                            </p>
                                            {
                                              this.state.EditCommentId == data.commentId ?
                                                <div className="note border shadow ml-lg-5 mb-2" style={{ maxWidth: "90%" }}>
                                                  <div className="note__bod">
                                                    <div className="">
                      

                                                      <CKEditor
                                                        editor={ClassicEditor}
                                                        name="EditcommentText"
                                                        // cols="89"
                                                        style={{ width: "auto" }}
                                                        // rows="7"
                                                        config={{
                                                          placeholder: "Write Something ....",
                                                          mention: {
                                                            feeds: [
                                                              {
                                                                marker: '@',
                                                                feed: this.getFeedItems
                                                              }]
                                                          },
                                                        }}
                                                        // maxLength="500"

                                                        onChange={
                                                          (event, editor) => {
                                                            const data = editor?.getData();
                                                            this.setState({ EditcommentText: data });
                                                            // this.handleNoteInput.bind(this)
                                                          }
                                                        }
                                                        data={this.state.EditcommentText || ""}
                                                      ></CKEditor>



                                                      <div className="note__foter mt-2">
                                                        <div className="d-flex flex-row float-right">
                                                          <Button onClick={this.CancelEditComments} className="note__save text-light bg-primary" >Cancel</Button> {" "}
                                                          <Button
                                                            onClick={e => this.EditComment(e, data.commentId, data.patientNotesId)}
                                                            disabled={this.state.EditcommentText.trim() == ""}
                                                            className="ml-1 note__save text-light bg-primary">Save</Button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div> : <p className="pl-lg-5">{ReactHtmlParser(data.commentText || "<p> </p>")}</p>
                                            }


                                            {
                                              this.state.notes_updatedBy_Id == data.createdBy ? <p className="pl-lg-5">
                                                {
                                                  <span
                                                    style={{ cursor: "pointer" }}


                                                    onClick={() => {
                                                      this.setState({
                                                        EditCommentId: data.commentId,
                                                        EditcommentText: data.commentText
                                                      })

                                                    }}

                                                  >
                                                    Edit
                                                  </span>
                                                }



                                                <span className="mx-2"
                                                  style={{ cursor: "pointer" }}


                                                  // onClick={e => this.DeleteComment(e, data.commentId, data.patientNotesId)}
                                                  onClick={e => this.toggleComment(e, data.commentId, data.patientNotesId)}
                                                >
                                                  Delete
                                                </span>

                                              </p> : null
                                            }



                                          </>

                                        })
                                        : null
                                    }
                                  </p>
                                </div>
                              </div> */}
                        {/* <br /> */}

                        {/* </div> */}

                        {/* </div> */}

                        {/* </ModalBody> */}

                        <ModalFooter>
                          {/* {
                            this.state.notes_updatedBy_Id == this.state.notes_createdBy_Id ? */}

                          <Button
                            color="primary"
                            disabled={
                              this.state.inputTextforNotes_before_Edit ==
                              this.state.inputTextforNotes ||
                              this.state.inputTextforNotes.trim() == "" || loading
                            }
                            onClick={this.Editnote.bind(this)}
                          >
                            Update
                          </Button>

                          {/* : null
                          } */}
                        </ModalFooter>
                      </Modal>

                      {this.state.DeletemodalforNotes && (
                        <div style={{ marginLeft: "36%" }}>
                          <Modal
                            isOpen={this.state.DeletemodalforNotes}
                            style={{ width: "500px" }}
                          >
                            <ModalHeader>Confirm</ModalHeader>
                            <ModalBody>
                              Are you sure you want to delete this comment?
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                outline
                                color="danger"
                                onClick={(e) =>
                                  this.deleteRowNote(e, this.state.id)
                                }
                              >
                                Delete
                              </Button>
                              <Button
                                color="secondary"
                                onClick={this.toggleNotes}
                              >
                                Cancel
                              </Button>
                            </ModalFooter>
                          </Modal>
                        </div>
                      )}
                      {this.state.DeletemodalforNoteComment && (
                        <div style={{ marginLeft: "36%" }}>
                          <Modal
                            isOpen={this.state.DeletemodalforNoteComment}
                            style={{ width: "500px" }}
                          >
                            <ModalHeader>Confirm</ModalHeader>
                            <ModalBody>
                              Are you sure you want to delete this comment?
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                outline
                                color="danger"
                                onClick={(e) =>
                                  this.DeleteComment(
                                    e,
                                    this.state.DeleteCommentId,
                                    this.state.DeletepatientNotesId
                                  )
                                }
                              >
                                Delete
                              </Button>
                              <Button
                                color="secondary"
                                onClick={this.toggleComment}
                              >
                                Cancel
                              </Button>
                            </ModalFooter>
                          </Modal>
                        </div>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card className="viewPatientForm">
                <CardBody>
                  <Row>
                    <Col xs="12">
                      <h5 className="mt-2 w-100">
                        Please Submit These Specimens
                      </h5>
                      <hr className="w-100" />
                    </Col>
                    <Col xs="12" xl="9" lg="12">
                      <div className="form-group w-100 dis-contents">
                        {this?.state?.basicInfo?.showSpecimenCollection ? (
                          <FormGroup check row className="w-100">
                            {/* <h5 className="mt-2">Specimen collection</h5>
                            < hr /> */}
                            <Row style={{ marginBottom: "3px" }}>
                              <ol className="w-100 pl-md-3">
                                {this.state.basicInfo?.patientSample?.map(
                                  (collection) => (
                                    <>
                                      {/* <Col xs="1" lg="1" xl="1" > */}
                                      {/* <Input
                                        // onChange={() => {
                                        //   this.setSpecimenCollections({
                                        //     sampleTypeId:
                                        //       collection?.sampleTypeId,
                                        //     sampleTypeName:
                                        //       collection?.sampleTypeName,
                                        //   });
                                        // }}
                                        disabled={this.state.basicInfo?.analysisOrderStatus?.paymentReceived}
                                        id={"chk" + collection?.sampleTypeId}
                                        className="ml-0"
                                        type="checkbox"
                                        // checked={
                                        //   this?.state?.specimentCollections?.filter(
                                        //     (ele) =>
                                        //       ele.sampleTypeId ===
                                        //       collection?.sampleTypeId
                                        //   ).length > 0
                                        // }
                                        checked={true}
                                        name="inline-checkbox1"
                                      /> */}
                                      {/* </Col> */}
                                      <Col xs="11" lg="11" xl="11">
                                        <Label
                                          htmlFor={
                                            "chk" + collection?.sampleTypeId
                                          }
                                          className="form-check-label"
                                          // onClick={console.log("jhbjhbhbbjhbhb")}
                                          check
                                        >
                                          <li className="my-2">
                                            {collection?.sampleTypeName}
                                          </li>
                                        </Label>
                                      </Col>
                                      {/* <Col xs="3" lg="3" xl="3" className="align-self-start my-2">
                                      <div className="cus-date-picker ">
                                        <DatePicker
                                          selected={this.getDateForSpecimenCollection(
                                            collection
                                          )}
                                          onChange={(date) => {
                                            this.setDateForSpecimenCollections(
                                              collection,
                                              date
                                            );
                                          }}
                                          disabled={this.state.basicInfo?.analysisOrderStatus?.paymentReceived ||
                                            !(this?.state?.specimentCollections?.filter(
                                              (ele) =>
                                                ele.sampleTypeId ===
                                                collection?.sampleTypeId
                                            ).length > 0)
                                          }
                                          dateFormat="MM/dd/yyyy"
                                          placeholderText="mm/dd/yyyy"
                                          className="form-control text-center"
                                          showMonthDropdown
                                          showYearDropdown
                                          dropdownMode="select"
                                          fixedHeight
                                        />
                                      </div>
                                    </Col> */}
                                      {/* <Col xs="3" lg="3" xl="3" className="align-self-start my-2" >
                                      {!(this.state.basicInfo?.analysisOrderStatus?.paymentReceived) &&
                                        this?.state?.specimentCollections?.filter(
                                          (ele) =>
                                            ele.sampleTypeId ===
                                            collection?.sampleTypeId
                                        ).length > 0 && this.state.specimentCollections.length > 0 && this.state.specimentCollections[0].sampleTypeId === collection?.sampleTypeId && this.state.specimentCollections[0].sampleDate !== '' &&


                                        <div className="btn" style={{ cursor: "pointer" }} onClick={() => {
                                          this.applySameDateForSelectedSpecimenCollections()
                                        }}><u>Apply same Date to selected</u></div>
                                      }
                                    </Col> */}
                                    </>
                                  )
                                )}
                              </ol>

                              <div ref={this.analysisRef}></div>
                            </Row>
                            {/* <div className=" " style={{ marginLeft: '46%' }}>

                              <button
                                className="btn btn-primary btn-md mt-3 ml-md-5 px-md-5"
                                // disabled={this.state.basicInfo?.analysisOrderStatus?.paymentReceived || this.state.specimentCollections?.filter((ele) => ele?.sampleDate === '').length > 0 || this.state?.specimentCollections?.length === 0}
                                disabled={this.state.basicInfo?.analysisOrderStatus?.paymentReceived || this.state?.specimentCollections?.length === 0}
                                onClick={() => {
                                  this.updateDataAndRefreshPage(() => {
                                    return this.submitSpecimenCollections();
                                  });
                                }}
                              >
                                <i className="fa fa-dot-circle-o text-light"></i> Submit
                              </button>
                            </div> */}
                          </FormGroup>
                        ) : (
                          <>
                            <FormGroup>complete the steps to view</FormGroup>
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Row>
                    <Col xs="12">
                      <div className=" d-flex">
                        <h5 className="mt-2 m-0 p-0 w-100">
                          <span id="" >
                            Payment Type
                          </span>


                        </h5>
                      </div>
                      <hr className="w-100" />
                    </Col>
                    <Col xs="8" lg="6" xl="6">
                      <FormGroup>
                        <Label>
                          Current Payment Type

                        </Label>

                        <Input
                          type="select"
                          // className={
                          //   errors.paymentType
                          //     ? "custom-select is-invalid"
                          //     : "custom-select is-valid"
                          // }
                          // disabled={this.state.basicInfo?.designOrderStatus?.paymentReceived}
                          disabled
                          name="TypeOfPayment"
                          value={this.state.SelectedTypeOfPayment}
                        // onChange={e => this.handleInputChange(e, "TypeOfPayment")}
                        >
                          <option disabled value="3" >Not Selected</option>
                          <option value="1">Analysis Payment</option>
                          <option value="2" >Full Payment</option>
                        </Input>
                      </FormGroup>
                      {/* <p className="text-warning font-weight-bold" >Note: Payment Type must be selected before going to further sections.</p> */}

                    </Col>
                    {true && <Col xs="8" lg="6" xl="6">
                      <FormGroup>
                        <Label>
                          Update Payment Type
                        </Label>
                        <span
                          className="mx-lg-2"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="You can not change or update Payment Type, after entering Design Payment Received Date."
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-info-circle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                          </svg>
                        </span>
                        <Input
                          type="select"
                          // className={
                          //   errors.paymentType
                          //     ? "custom-select is-invalid"
                          //     : "custom-select is-valid"
                          // }
                          disabled={this.state.basicInfo?.designOrderStatus?.paymentReceived}
                          name="TypeOfPayment"
                          value={this.state.TypeOfPayment}
                          // value={this.state.basicInfo?.designOrderStatus?.paymentReceived ? this.state.SelectedTypeOfPayment : this.state.TypeOfPayment}
                          onChange={e => this.handleInputChange(e, "TypeOfPayment")}
                        >
                          <option disabled value="3" >Select Payment Type</option>
                          <option value="1">Analysis Payment</option>
                          <option value="2" >Full Payment</option>
                        </Input>
                      </FormGroup>
                      {/* <p className="text-warning font-weight-bold" >Note: Payment Type must be selected before going to further sections.</p> */}

                    </Col>}
                    {
                      this.state.basicInfo.isFullPaymentType &&

                      <Col xs="12" >
                        <table className="table table-bordered  ">
                          <thead
                            style={{
                              color: "#fff",
                              border: "1px solid #FFF",
                            }}
                          >
                            <tr
                              style={{ backgroundColor: "#1C3A84" }}
                            >
                              <th className="border-0" colSpan="3">
                                <div
                                  className="d-flex"
                                  style={{
                                    // justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <span> PO and Invoice (For Analysis and Design payment) </span>
                                  {" "}
                                  {
                                    this.state.basicInfo.isFullPaymentType &&
                                    <span className="ml-2 text-success">

                                      {
                                        this.state.analysisOrderDiscount > 0 ? `(Discount: ${this.state.analysisOrderDiscount}%)` : ""
                                      }


                                    </span>
                                  }


                                </div>
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr>
                              <td>
                                <table className="table table-bordered  ">
                                  <thead>
                                    <tr
                                      className="text-center "
                                      style={{
                                        // backgroundColor: "#5e75ae"
                                        backgroundColor: "#e4e7ea",
                                        color: "black",
                                      }}
                                    >
                                      <th>File</th>
                                      <th>
                                        File Type
                                      </th>

                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Array.isArray(
                                      this.state.AnalysisReport
                                    ) &&
                                      this.state.AnalysisReport
                                        ?.length > 0 ? (
                                      this.state.AnalysisReport.map(
                                        (e, i) => {
                                          return (
                                            <tr>
                                              <td
                                                className=""
                                                style={{
                                                  verticalAlign:
                                                    "inherit",
                                                  alignItems:
                                                    "center",
                                                }}
                                              >
                                                <i
                                                  className="fa fa-file-pdf-o"
                                                  style={{
                                                    margin: "5px",
                                                    color: "#f64846",
                                                  }}
                                                ></i>
                                                {/* <span>{e.invoiceReportPath ? e.invoiceReportPath : e.poReportPath}</span> */}
                                                <span>{e?.invoiceReportPath ? String(e?.invoiceReportPath)?.substring(e?.invoiceReportPath?.search("Portal/") + 7) : String(e?.poReportPath)?.substring(String(e?.poReportPath)?.search("Portal/") + 7)}</span>

                                                {/* {this.state
                                                    .renamePdf ===
                                                    "pr" + i ? (
                                                    <div
                                                      style={{
                                                        float: "right",
                                                        width: "92%",
                                                        position:
                                                          "relative",
                                                        textAlign:
                                                          "center",
                                                      }}
                                                    >
                                                      <Input
                                                        type="text"
                                                        onChange={(
                                                          e
                                                        ) => {
                                                          this.handlePdfNameChange(
                                                            e
                                                          );
                                                        }}
                                                        value={
                                                          this.state
                                                            ?.filePdfname
                                                        }
                                                      />
                                                      <i
                                                        style={{
                                                          position:
                                                            "absolute",
                                                          right: "9px",
                                                          top: "11px",
                                                          cursor:
                                                            "pointer",
                                                        }}
                                                        onClick={() => {
                                                          this.setState(
                                                            {
                                                              renamePdf:
                                                                "",
                                                              filePdfname:
                                                                "",
                                                            }
                                                          );
                                                        }}
                                                        class="fa fa-close"
                                                      ></i>
                                                      <button
                                                        className="btn btn-success mt-1"
                                                        onClick={(
                                                          event
                                                        ) =>
                                                          this.RenameFun(
                                                            event,
                                                            e.id,
                                                            1
                                                          )
                                                        }
                                                      >
                                                        Submit
                                                        <i
                                                          style={{
                                                            color:
                                                              "#fff",
                                                            marginLeft:
                                                              "3px",
                                                          }}
                                                          class="fa fa-check"
                                                        ></i>
                                                      </button>
                                                    </div>
                                                  ) : (
                                                    <span
                                                      id="PMRandFinalReportPatientFileName"
                                                      onDoubleClick={() => {
                                                        this.setState({
                                                          renamePdf:
                                                            "pr" + i,
                                                          filePdfname:
                                                            this.spliceFromSash(
                                                              e.patientReport
                                                            ).replace(
                                                              ".pdf",
                                                              ""
                                                            ),
                                                        });
                                                      }}
                                                    >
                                                      {this.spliceFromSash(
                                                        e.patientReport
                                                      )}
                                                    </span>
                                                  )}  */}

                                              </td>
                                              <td className=""
                                                style={{
                                                  verticalAlign:
                                                    "inherit",
                                                  textAlign: "center",
                                                }}><span>{e.invoiceReportPath ? "Invoice" : "PO"}</span></td>
                                              <td className="text-center">
                                                <button
                                                  type="btn"
                                                  id="PMRandFinalReportPatientFileView"
                                                  className="btn  btn-success btn-pill mr-2"
                                                  // disabled
                                                  onClick={() =>
                                                    this.previewInvoiceToggle_api(
                                                      e.invoicePOReportId,
                                                      "analysis"
                                                    )
                                                  }
                                                >
                                                  View
                                                </button>
                                                <button
                                                  type="btn"
                                                  id=""
                                                  // disabled
                                                  className="btn  btn-success btn-pill ml-2"
                                                  onClick={() => {
                                                    this.handleShowInvoiceModal(
                                                      e, 1
                                                    );
                                                  }}
                                                >
                                                  E-Mail
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )
                                    ) : (
                                      <tr>
                                        <td
                                          colspan="3"
                                          className="text-center"
                                        >
                                          Generated Invoice or PO will be displayed here.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>}
                  </Row>
                  <Modal
                    isOpen={this.state.paymentTypeModal}
                    className="modal-dialog modal-md"
                  >
                    <ModalHeader>Send PO and Invoice for{" "}
                      {this.state.TypeOfPayment == "1" ? "Analysis Payment" : (this.state.TypeOfPayment == "2" ? "Analysis and Design Payment" : "")}
                    </ModalHeader>
                    <ModalBody>
                      <Form>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group row mb-4">
                              <div className="col-md-12">
                                <Col xs="12">
                                  <FormGroup>
                                    <Label>
                                      Payment Type
                                    </Label>
                                    <Input
                                      type="select"

                                      disabled
                                      name="TypeOfPayment"
                                      value={this.state.TypeOfPayment}
                                    >
                                      <option value="1">Analysis Payment</option>
                                      <option value="2" >Full Payment</option>
                                    </Input>
                                  </FormGroup>
                                  <FormGroup>
                                    <Label>
                                      Discount
                                    </Label>
                                    <div className="d-flex">
                                      <Input
                                        type="select"
                                        name="PaymentDiscountType"
                                        value={this.state.PaymentDiscountType}
                                        onChange={e => this.handleDiscountType(e, "PaymentDiscountType")}
                                      >
                                        <option value="">Select Discount Type</option>
                                        <option value="Percentage">Percentage</option>
                                        <option value="Amount">Amount</option>
                                      </Input>
                                      {
                                        !this.state.PaymentDiscountType ? null :

                                          <>
                                            <Input
                                              type="number"
                                              placeholder="Enter Discount"
                                              value={this.state.PaymentDiscount}
                                              name="PaymentDiscount"
                                              onChange={e => { this.handleInputChange(e, "PaymentDiscount") }}
                                              className={`ml-1 ${errors.PaymentDiscount ? "is-invalid" : ""}`}
                                            />

                                          </>
                                      }
                                    </div>
                                    {<span className="error">{errors.PaymentDiscount}</span>}
                                  </FormGroup>

                                </Col>

                                <Col xs="12">
                                  <FormGroup>
                                    <Label>
                                      Send PO & Invoice to<span className="requiredField"></span>
                                    </Label>


                                    <CreatableSelect
                                      isMulti
                                      options={this.state.practitionerContactPerson}
                                      onChange={e => this.handleEmailChange(e, "SendPO_Email")}
                                      value={this.state.practitionerContactPersonIdDesign}
                                      isClearable={true}
                                      isSearchable={true}
                                      placeholder="Recipients"
                                      formatCreateLabel={(inputValue) => `${inputValue}`}
                                      isValidNewOption={this.isValidNewOption}
                                      getOptionLabel={(opt) => (this.state.practitionerContactPersonIdDesign && this.state.practitionerContactPersonIdDesign.includes(opt) ? opt.name ? opt.name : opt.value : opt.name ? <>{opt.name} <br />{opt.value}</> : `${opt.value}`)}
                                      menuPlacement="bottom"
                                      maxMenuHeight={200}
                                    />
                                    {<span className="error">{errors.practitionerContactPersonIdDesign}</span>}
                                  </FormGroup>

                                </Col>

                              </div>
                            </div>


                          </div>
                        </div>
                      </Form>
                    </ModalBody>
                    <ModalFooter>
                      <div className="text-right">

                        <Button
                          type="button"
                          className="btn  btn-secondary"
                          onClick={() => {
                            let err = this.state.errors;
                            err.PaymentDiscount = ""
                            this.setState({
                              paymentTypeModal: false,
                              TypeOfPayment: "3",
                              PaymentDiscountType: "",
                              PaymentDiscount: "",
                              practitionerContactPersonIdDesign: []
                            }, () => {
                              this.getData(this.state.patientId, this.state.PatientAccessionId)
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          color="primary"
                          // disabled={this.state.DesignDiscountType ? false : true}
                          disabled={loading}
                          onClick={() => {
                            this.handleSubmintPaymentDiscount()
                          }}
                          style={{ marginLeft: "5px" }}
                        >
                          <i className="fa fa-dot-circle-o"></i> Submit
                        </Button>
                      </div>

                    </ModalFooter>
                  </Modal>
                </CardBody>
              </Card>

              {/* anylisys order status */}
              <Card
                className="viewPatientForm"
              // style={{
              //   display: this.state.basicInfo.showAnalysisOrder
              //     ? "block"
              //     : "none",
              // }}
              >
                <CardBody>
                  <Row>
                    <div className="form-grup w-100 dis-cotents">
                      <Col xs="12">
                        <h5 className="mt-2 w-100">
                          <span id="AnalysisOrderSection">
                            Analysis Payment
                          </span>

                          {
                            !this.state.basicInfo.isFullPaymentType &&
                            <span className="ml-2 text-success"
                            // style={{ display: "none" }}
                            >
                              {
                                this.state.analysisOrderDiscount > 0 ? `(Discount: ${this.state.analysisOrderDiscount}%)` : ""
                              }
                            </span>}
                          {/* {this.state.showAnalysisPayment ? <i className="icon-minus float-right" style={{ fontSize: "24px", cursor: "pointer" }} onClick={() => { this.setState({ showAnalysisPayment: !this.state.showAnalysisPayment }) }}>  </i>
                            : <i className="icon-plus float-right " style={{ fontSize: "24px", cursor: "pointer" }} onClick={() => { this.setState({ showAnalysisPayment: !this.state.showAnalysisPayment }) }}>  </i>
                          } */}
                        </h5>
                        <hr className="w-100" />
                      </Col>
                      {/* {this.state.showAnalysisPayment && <><Col xs="8" lg="9" xl="9"> */}
                      {true && <><Col xs="8" lg="9" xl="9">
                        <FormGroup>
                          {this?.state?.basicInfo?.showAnalysisOrder ? (
                            <FormGroup check row>
                              <Row style={{ marginBottom: "3px" }}>
                                <Col xs="1">
                                  <Input
                                    // className="ml-0"
                                    className={`ml-0  ${isEditDateClass}  `}
                                    type="checkbox"
                                    name="inline-checkbox1"
                                    id={"chk_ordrsubmit"}
                                    checked={
                                      this.state.analysisOrderStatus
                                        .orderSubmitted.checked
                                    }
                                    disabled={
                                      this.state.basicInfo.analysisOrderStatus
                                        ?.orderSubmited &&
                                      this.state.basicInfo.analysisOrderStatus
                                        ?.poReceived || loading
                                    }
                                    onChange={(e) => {
                                      // console.log(e.target.value);
                                      this.handleAnalysisOrderChange(
                                        "orderSubmitted"
                                      );
                                    }}
                                  />
                                </Col>
                                <Col xs="4" lg="4" xl="4">
                                  <Label
                                    className={`form-check-label  ${isEditDateClass}  `}
                                    check
                                    htmlFor="chk_ordrsubmit"
                                  >
                                    Order Submitted
                                  </Label>
                                </Col>
                                <Col
                                  xs="3"
                                  lg="3"
                                  xl="3"
                                  style={{ paddingTop: "5px" }}
                                >
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      defaultValue=""
                                      selected={
                                        this.state.analysisOrderStatus
                                          .orderSubmitted.date
                                      }
                                      onChange={(date) => {
                                        this.handleAnalysisOrderDate(
                                          "orderSubmitted",
                                          date
                                        );
                                      }}
                                      disabled={this.isAnalysisOrdeDisabled()}
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here text-center  ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>
                                <Col
                                  xs="4"
                                  lg="4"
                                  xl="4"
                                  style={{ paddingTop: "5px" }}
                                >
                                  {/* {this.state.basicInfo
                                    .analysisOrderStatus?.orderSubmited ? <button className="btn btn-success btn-md"

                                      disabled={
                                        ((!this.state.analysisOrderStatus
                                          .orderSubmitted.checked ||
                                          this.state.analysisOrderStatus
                                            .orderSubmitted.date === "") || this.state.basicInfo
                                              .analysisOrderStatus?.orderSubmited) && this.state.basicInfo
                                                .analysisOrderStatus?.poReceived
                                      }
                                    >Update</button> : */}
                                  <button
                                    className={`btn btn-md btn-${!this.state.basicInfo.analysisOrderStatus
                                      ?.poReceived &&
                                      this.state.basicInfo.analysisOrderStatus
                                        ?.orderSubmited
                                      ? "success"
                                      : "primary"
                                      }`}
                                    style={{
                                      paddingLeft: "3vw",
                                      paddingRight: "3vw",
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    disabled={
                                      this.isAnalysisOrdeDisabled() ||
                                      this.state.analysisOrderStatus
                                        .orderSubmitted.date === "" || loading
                                      // (!this.state.analysisOrderStatus
                                      //   .orderSubmitted.checked ||
                                      //   this.state.analysisOrderStatus
                                      //     .orderSubmitted.date === "") || this.state.basicInfo
                                      //       .analysisOrderStatus?.orderSubmited
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() => {
                                        return this.updateAnalysisOrderStatus().orderSubmitted(
                                          !this.state.basicInfo
                                            .analysisOrderStatus?.poReceived &&
                                          this.state.basicInfo
                                            .analysisOrderStatus
                                            ?.orderSubmited
                                        );
                                      });
                                    }}
                                  >
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    {!this.state.basicInfo.analysisOrderStatus
                                      ?.poReceived &&
                                      this.state.basicInfo.analysisOrderStatus
                                        ?.orderSubmited
                                      ? "Update"
                                      : "Submit"}
                                    {/* <i class="fa fa-paper-plane" aria-hidden="true" style={{ color: "#FFF", fontSize: "13px" }}></i> */}
                                  </button>
                                  {/* } */}
                                </Col>
                                <Col
                                  xs="1"
                                // style={{
                                //   display: this.state.basicInfo
                                //     .analysisOrderStatus?.orderSubmited
                                //     ? "block"
                                //     : "none",
                                // }}
                                >
                                  <Input
                                    checked={
                                      this.state.analysisOrderStatus.poReceived
                                        .checked
                                    }
                                    // disabled={(this.state.basicInfo.analysisOrderStatus?.poReceived && this.state.basicInfo.analysisOrderStatus?.invoiceSend) && !this.state.basicInfo.analysisOrderStatus.orderSubmited}
                                    className={`ml-0  ${isEditDateClass}  `}
                                    id="chk_poRceived"
                                    type="checkbox"
                                    name="inline-checkbox1"
                                    onChange={() => {
                                      this.handleAnalysisOrderChange(
                                        "poReceived"
                                      );
                                    }}
                                    disabled={
                                      !this.state.basicInfo?.analysisOrderStatus
                                        ?.orderSubmited ||
                                      this.state?.basicInfo?.analysisOrderStatus
                                        ?.invoiceSend
                                    }
                                  />
                                </Col>
                                <Col
                                  xs="4"
                                  lg="4"
                                  xl="4"
                                // style={{
                                //   display: this.state.basicInfo
                                //     .analysisOrderStatus?.orderSubmited
                                //     ? "block"
                                //     : "none",
                                // }}
                                >
                                  <Label
                                    className={`form-check-label  ${isEditDateClass}  `}
                                    check
                                    htmlFor="chk_poRceived"
                                  >
                                    PO Sent to Accounting
                                  </Label>
                                </Col>
                                <Col
                                  xs="3"
                                  lg="3"
                                  xl="3"
                                  style={{
                                    paddingTop: "5px",
                                  }}
                                >
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      defaultValue=""
                                      // minDate={new Date(this.state?.basicInfo?.analysisOrderStatus?.orderSubmitedDate) || ''}
                                      selected={
                                        this.state.analysisOrderStatus
                                          .poReceived.date
                                      }
                                      onChange={(date) => {
                                        this.handleAnalysisOrderDate(
                                          "poReceived",
                                          date
                                        );
                                      }}
                                      disabled={this.isAnlysisPoDisabled()}
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here text-center  ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>
                                <Col
                                  xs="4"
                                  lg="4"
                                  xl="4"
                                  style={{
                                    paddingTop: "5px",
                                  }}
                                >
                                  <button
                                    className={`btn btn-md btn-${this.state.basicInfo.analysisOrderStatus
                                      ?.poReceived &&
                                      !this.state.basicInfo.analysisOrderStatus
                                        ?.invoiceSend
                                      ? "success"
                                      : "primary"
                                      }`}
                                    style={{
                                      paddingLeft: "3vw",
                                      paddingRight: "3vw",
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    disabled={
                                      this.isAnlysisPoDisabled() ||
                                      this.state.analysisOrderStatus.poReceived
                                        .date === "" || loading
                                      // !this.state.analysisOrderStatus.poReceived
                                      //   .checked ||
                                      // this.state.analysisOrderStatus.poReceived
                                      //   .date === "" || !this.state.basicInfo
                                      //     .analysisOrderStatus?.orderSubmited || this.state.basicInfo
                                      //       .analysisOrderStatus?.poReceived
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() => {
                                        return this.updateAnalysisOrderStatus().poReceived();
                                      });
                                    }}
                                  >
                                    {/* Submit */}
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    {this.state.basicInfo.analysisOrderStatus
                                      ?.poReceived &&
                                      !this.state.basicInfo.analysisOrderStatus
                                        ?.invoiceSend
                                      ? "Update"
                                      : "Submit"}
                                  </button>
                                </Col>
                                <Col
                                  xs="1"

                                // style={{
                                //   display: this.state.basicInfo
                                //     .analysisOrderStatus?.poReceived
                                //     ? "block"
                                //     : "none",
                                // }}
                                >
                                  <Input
                                    className={`ml-0   `}
                                    type="checkbox"
                                    name="inline-checkbox1"
                                    id="chk_invoiceSent"
                                    checked={
                                      this.state.analysisOrderStatus.invoiceSent
                                        .checked
                                    }
                                    // disabled={!this.state.basicInfo.analysisOrderStatus?.poReceived || this.state.basicInfo
                                    //   .analysisOrderStatus?.invoiceSend}
                                    // disabled={this.state.basicInfo.analysisOrderStatus?.paymentReceived || this.state.basicInfo.analysisOrderStatus?.invoiceSend}
                                    disabled={
                                      !this.state?.basicInfo
                                        ?.analysisOrderStatus?.poReceived ||
                                      this.state.basicInfo?.analysisOrderStatus
                                        ?.paymentReceived
                                    }
                                    onChange={() => {
                                      this.handleAnalysisOrderChange(
                                        "invoiceSent"
                                      );
                                    }}
                                  />
                                </Col>
                                <Col
                                  xs="4"
                                  lg="4"
                                  xl="4"
                                // style={{
                                //   display: this.state.basicInfo
                                //     .analysisOrderStatus?.poReceived
                                //     ? "block"
                                //     : "none",
                                // }}
                                >
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="chk_invoiceSent"
                                  >
                                    Invoice Sent To Clinic
                                  </Label>
                                </Col>
                                <Col
                                  xs="3"
                                  lg="3"
                                  xl="3"
                                  style={{
                                    paddingTop: "5px",
                                  }}
                                >
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      defaultValue=""
                                      // minDate={new Date(this.state.basicInfo?.analysisOrderStatus?.poReceivedDate) || ''}
                                      selected={
                                        this.state.analysisOrderStatus
                                          .invoiceSent.date
                                      }
                                      onChange={(date) => {
                                        this.handleAnalysisOrderDate(
                                          "invoiceSent",
                                          date
                                        );
                                      }}
                                      disabled={this.isAnalysisInvoiceDisabled()}
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here text-center  ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>
                                <Col
                                  xs="4"
                                  lg="4"
                                  xl="4"
                                  style={{
                                    paddingTop: "5px",
                                  }}
                                >
                                  <button
                                    className={`btn btn-md btn-${this.state.basicInfo.analysisOrderStatus
                                      ?.invoiceSend &&
                                      !this.state.basicInfo.analysisOrderStatus
                                        ?.paymentReceived
                                      ? "success"
                                      : "primary"
                                      }`}
                                    style={{
                                      paddingLeft: "3vw",
                                      paddingRight: "3vw",
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    disabled={
                                      this.isAnalysisInvoiceDisabled() ||
                                      this.state.analysisOrderStatus.invoiceSent
                                        .date === "" || loading
                                      // !this.state.analysisOrderStatus
                                      //   .invoiceSent.checked ||
                                      // this.state.analysisOrderStatus.invoiceSent
                                      //   .date === "" || !this.state.basicInfo.analysisOrderStatus?.poReceived || this.state.basicInfo
                                      //     .analysisOrderStatus?.invoiceSend
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() => {
                                        return this.updateAnalysisOrderStatus().invoiceSentToClinic();
                                      });
                                    }}
                                  >
                                    {/* Submit */}
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    {this.state.basicInfo.analysisOrderStatus
                                      ?.invoiceSend &&
                                      !this.state.basicInfo.analysisOrderStatus
                                        ?.paymentReceived
                                      ? "Update"
                                      : "Submit"}
                                  </button>
                                </Col>

                                <Col
                                  xs="1"
                                  style={{
                                    paddingTop: "5px",
                                  }}
                                >
                                  <Input
                                    checked={
                                      this.state.analysisOrderStatus
                                        .paymentRecived.checked
                                    }
                                    // disabled={!this?.state?.basicInfo?.analysisOrderStatus?.invoiceSend || this.state.basicInfo
                                    //   .analysisOrderStatus?.paymentReceived}
                                    disabled={
                                      !this.state.basicInfo?.analysisOrderStatus
                                        ?.invoiceSend ||
                                      this.state.basicInfo?.analysisOrderStatus
                                        ?.paymentReceived
                                    }
                                    onChange={() => {
                                      this.handleAnalysisOrderChange(
                                        "paymentRecived"
                                      );
                                    }}
                                    id="chk_paymentRcieved_analysis"
                                    className={`ml-0 `}
                                    type="checkbox"
                                    name="inline-checkbox1"
                                  />
                                </Col>
                                <Col
                                  xs="4"
                                  lg="4"
                                  xl="4"
                                  style={{
                                    paddingTop: "5px",
                                  }}
                                >
                                  <Label
                                    id="AnalysisOrderSectionPaymentReceived"
                                    className="form-check-label"
                                    check
                                    htmlFor="chk_paymentRcieved_analysis"
                                  >
                                    {/* {isFullPaymentStatus ? "Full" : ""} Payment */}
                                    Payment
                                    Received <br />
                                    {/* {isFullPaymentStatus ? ( */}
                                    {false ? (
                                      <span
                                        style={{
                                          color: "#000",
                                          fontSize: "12px",
                                        }}
                                      >
                                        {" "}
                                        for analysis and design
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </Label>
                                </Col>
                                <Col
                                  xs="3"
                                  lg="3"
                                  xl="3"
                                  style={{
                                    paddingTop: "5px",
                                  }}
                                >
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      defaultValue=""
                                      utcOffset={0}
                                      // minDate={new Date(this.state.basicInfo?.analysisOrderStatus?.invoiceSendDate) || ''}
                                      selected={
                                        this.state.analysisOrderStatus
                                          .paymentRecived.date
                                      }
                                      onChange={(date) => {
                                        this.handleAnalysisOrderDate(
                                          "paymentRecived",
                                          date
                                        );
                                        // console.log(date + 1);
                                      }}
                                      disabled={
                                        !this.state.analysisOrderStatus
                                          .paymentRecived.checked ||
                                        !this?.state?.basicInfo
                                          ?.analysisOrderStatus?.invoiceSend ||
                                        this.state.basicInfo.analysisOrderStatus
                                          ?.paymentReceived
                                      }
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here text-center  ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>
                                <Col
                                  xs="4"
                                  lg="4"
                                  xl="4"
                                  style={{
                                    paddingTop: "5px",
                                  }}
                                >
                                  <button
                                    className="btn btn-md btn-primary"
                                    style={{
                                      paddingLeft: "3vw",
                                      paddingRight: "3vw",
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    disabled={
                                      !this.state.analysisOrderStatus
                                        .paymentRecived.checked ||
                                      this.state.analysisOrderStatus
                                        .paymentRecived.date === "" ||
                                      !this?.state?.basicInfo
                                        ?.analysisOrderStatus?.invoiceSend ||
                                      this.state.basicInfo.analysisOrderStatus
                                        ?.paymentReceived || loading
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() => {
                                        return this.updateAnalysisOrderStatus().paymentRecived();
                                      });
                                    }}
                                  >
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    Submit
                                  </button>
                                </Col>

                                {/* <button
                                  className="btn btn-primary btn-md float-right"
                                  onClick={() => {
                                    this.updateAnalysisOrderStatus();
                                  }}
                                >
                                  Submit
                                </button> */}
                              </Row>
                            </FormGroup>
                          ) : (
                            <>
                              <FormGroup>
                                After assign specimen collection, this section
                                will be visible.
                              </FormGroup>
                            </>
                          )}
                        </FormGroup>
                      </Col>
                        {
                          !this.state.basicInfo.isFullPaymentType &&

                          <Col xs="12" >
                            <table className="table table-bordered  ">
                              <thead
                                style={{
                                  color: "#fff",
                                  border: "1px solid #FFF",
                                }}
                              >
                                <tr
                                  style={{ backgroundColor: "#1C3A84" }}
                                >
                                  <th className="border-0" colSpan="3">
                                    <div
                                      className="d-flex"
                                      style={{
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span> PO and Invoice(Analysis) </span>


                                    </div>
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr>
                                  <td>
                                    <table className="table table-bordered  ">
                                      <thead>
                                        <tr
                                          className="text-center "
                                          style={{
                                            // backgroundColor: "#5e75ae"
                                            backgroundColor: "#e4e7ea",
                                            color: "black",
                                          }}
                                        >
                                          <th>File</th>
                                          <th>
                                            File Type
                                          </th>

                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {Array.isArray(
                                          this.state.AnalysisReport
                                        ) &&
                                          this.state.AnalysisReport
                                            ?.length > 0 ? (
                                          this.state.AnalysisReport.map(
                                            (e, i) => {
                                              return (
                                                <tr>
                                                  <td
                                                    className=""
                                                    style={{
                                                      verticalAlign:
                                                        "inherit",
                                                      alignItems:
                                                        "center",
                                                    }}
                                                  >
                                                    <i
                                                      className="fa fa-file-pdf-o"
                                                      style={{
                                                        margin: "5px",
                                                        color: "#f64846",
                                                      }}
                                                    ></i>
                                                    {/* <span>{e.invoiceReportPath ? e.invoiceReportPath : e.poReportPath}</span> */}
                                                    <span>{e?.invoiceReportPath ? String(e?.invoiceReportPath)?.substring(e?.invoiceReportPath?.search("Portal/") + 7) : String(e?.poReportPath)?.substring(String(e?.poReportPath)?.search("Portal/") + 7)}</span>

                                                    {/* {this.state
                                                    .renamePdf ===
                                                    "pr" + i ? (
                                                    <div
                                                      style={{
                                                        float: "right",
                                                        width: "92%",
                                                        position:
                                                          "relative",
                                                        textAlign:
                                                          "center",
                                                      }}
                                                    >
                                                      <Input
                                                        type="text"
                                                        onChange={(
                                                          e
                                                        ) => {
                                                          this.handlePdfNameChange(
                                                            e
                                                          );
                                                        }}
                                                        value={
                                                          this.state
                                                            ?.filePdfname
                                                        }
                                                      />
                                                      <i
                                                        style={{
                                                          position:
                                                            "absolute",
                                                          right: "9px",
                                                          top: "11px",
                                                          cursor:
                                                            "pointer",
                                                        }}
                                                        onClick={() => {
                                                          this.setState(
                                                            {
                                                              renamePdf:
                                                                "",
                                                              filePdfname:
                                                                "",
                                                            }
                                                          );
                                                        }}
                                                        class="fa fa-close"
                                                      ></i>
                                                      <button
                                                        className="btn btn-success mt-1"
                                                        onClick={(
                                                          event
                                                        ) =>
                                                          this.RenameFun(
                                                            event,
                                                            e.id,
                                                            1
                                                          )
                                                        }
                                                      >
                                                        Submit
                                                        <i
                                                          style={{
                                                            color:
                                                              "#fff",
                                                            marginLeft:
                                                              "3px",
                                                          }}
                                                          class="fa fa-check"
                                                        ></i>
                                                      </button>
                                                    </div>
                                                  ) : (
                                                    <span
                                                      id="PMRandFinalReportPatientFileName"
                                                      onDoubleClick={() => {
                                                        this.setState({
                                                          renamePdf:
                                                            "pr" + i,
                                                          filePdfname:
                                                            this.spliceFromSash(
                                                              e.patientReport
                                                            ).replace(
                                                              ".pdf",
                                                              ""
                                                            ),
                                                        });
                                                      }}
                                                    >
                                                      {this.spliceFromSash(
                                                        e.patientReport
                                                      )}
                                                    </span>
                                                  )}  */}

                                                  </td>
                                                  <td className=""
                                                    style={{
                                                      verticalAlign:
                                                        "inherit",
                                                      textAlign: "center",
                                                    }}><span>{e.invoiceReportPath ? "Invoice" : "PO"}</span></td>
                                                  <td className="text-center">
                                                    <button
                                                      type="btn"
                                                      id="PMRandFinalReportPatientFileView"
                                                      className="btn  btn-success btn-pill mr-2"
                                                      // disabled
                                                      onClick={() =>
                                                        this.previewInvoiceToggle_api(
                                                          e.invoicePOReportId,
                                                          "analysis"
                                                        )
                                                      }
                                                    >
                                                      View
                                                    </button>
                                                    <button
                                                      type="btn"
                                                      id=""
                                                      // disabled
                                                      className="btn  btn-success btn-pill ml-2"
                                                      onClick={() => {
                                                        this.handleShowInvoiceModal(
                                                          e, 1
                                                        );
                                                      }}
                                                    >
                                                      E-Mail
                                                    </button>
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )
                                        ) : (
                                          <tr>
                                            <td
                                              colspan="3"
                                              className="text-center"
                                            >
                                              Generated Invoice Or Po will be displayed here.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Col>}

                      </>}

                    </div>
                  </Row>
                </CardBody>
              </Card>
              {/* lab 1 */}
              <div ref={this.labRef}></div>

              {this.state.basicInfo.showSpecimenReceived &&
                Array.isArray(this.state.basicInfo.laboratoryPatient) &&
                this.state.basicInfo.laboratoryPatient.length > 0 ? (
                this.state.basicInfo.laboratoryPatient.map((ele) => {
                  let arrOfSpecimenReceivedStatus =
                    this.state.basicInfo.specimenReceivedStatus;
                  let filteredSpecimenReceivedStatus =
                    arrOfSpecimenReceivedStatus.filter((child) => {
                      return ele.ngsLaboratoryId === child.ngsLaboratoryId;
                    });
                  let arrOfLabRecievedResult =
                    this.state.basicInfo.labReceivedResultStatus;
                  let filteredArrOfLabRecievedResult = Array.isArray(
                    arrOfLabRecievedResult
                  )
                    ? arrOfLabRecievedResult.filter((child) => {
                      return ele.ngsLaboratoryId === child.ngsLaboratoryId;
                    })
                    : [];
                  return (
                    <Card className="viewPatientForm">
                      <CardBody>
                        <div className="d-flex"><h4 className="mt-2 w-100">
                          {ele?.ngsLaboratoryName}

                          {/* {ele.ngsLaboratoryId}{" "} */}
                        </h4>
                          {/* {this.state.labTabsVisibility[ele?.ngsLaboratoryId] ? (
                            <i
                              className="icon-minus"
                              style={{ fontSize: "24px", cursor: "pointer" }}
                              onClick={() => this.toggleLabTabVisibility(ele?.ngsLaboratoryId)}
                            />
                          ) : (
                            <i
                              className="icon-plus"
                              style={{ fontSize: "24px", cursor: "pointer" }}
                              onClick={() => this.toggleLabTabVisibility(ele?.ngsLaboratoryId)}
                            />
                          )} */}
                        </div>

                        <hr />
                        {/* {this.state.labTabsVisibility[ele?.ngsLaboratoryId] && <><Row */}
                        {true && <><Row
                          className="pb-3"
                          style={{
                            display: this.state.basicInfo.showSpecimenReceived
                              ? "flex"
                              : "none",
                          }}
                        >
                          <Col xs="9" lg="10" xl="9">
                            <div className="form-group w-100 dis-contents">
                              <FormGroup>
                                <h5 className="mt-2">
                                  Patient Specimen Received at Lab
                                </h5>
                                <FormGroup check row>
                                  <Row
                                    className="d-flex justify-content-start align-items-center"
                                    style={{ marginBottom: "3px" }}
                                  >
                                    {filteredSpecimenReceivedStatus.map(
                                      (child) => {
                                        let isDateInputDisabled =
                                          this.isDateDisabledForSelectedLabs(
                                            ele.ngsLaboratoryId,
                                            child.ngsLaboratoryPatientActivityId
                                          ) ||
                                          this.diasbledCheckboxForSpecimenCollectionSampleLabs(
                                            ele.ngsLaboratoryId,
                                            child.ngsLaboratoryPatientActivityId
                                          );

                                        return (
                                          <>
                                            <Col
                                              xs="1"
                                              lg="1"
                                              xl="1"
                                              className="align-self-start my-2"
                                            >
                                              {/* {chyild.sampleTypeId} */}
                                              <Input
                                                className={`ml-0  ${isEditDateClass}  `}
                                                type="checkbox"
                                                name="inline-checkbox1"
                                                disabled={this.diasbledCheckboxForSpecimenCollectionSampleLabs(
                                                  ele.ngsLaboratoryId,
                                                  child.ngsLaboratoryPatientActivityId
                                                )}
                                                checked={this.isCheckBoxDisabledForSelectedLabs(
                                                  ele.ngsLaboratoryId,
                                                  child.ngsLaboratoryPatientActivityId
                                                )}
                                                onChange={() => {
                                                  // alert(1);
                                                  this.handleLabResultChange(
                                                    ele.ngsLaboratoryId,
                                                    child.ngsLaboratoryPatientActivityId
                                                  );
                                                  // this.handleLabResultChange(
                                                  //   ele.ngsLaboratoryId,
                                                  //   "1"
                                                  // );
                                                }}
                                                id={`chkbx_${ele.ngsLaboratoryId}_${child.ngsLaboratoryPatientActivityId}`}
                                              />
                                            </Col>
                                            <Col
                                              xs="4"
                                              lg="4"
                                              xl="4"
                                              className="align-self-start my-2"
                                            >
                                              <Label
                                                className="form-check-label"
                                                htmlFor={`chkbx_${ele.ngsLaboratoryId}_${child.ngsLaboratoryPatientActivityId}`}
                                              >
                                                {child.sampleTypeName}
                                              </Label>
                                            </Col>
                                            <Col
                                              xs="3"
                                              className="align-self-start my-2"
                                              lg="3"
                                              xl="3"
                                            >
                                              <div
                                                className={`cus-date-picker `}
                                              >
                                                <DatePicker
                                                  disabled={isDateInputDisabled}
                                                  defaultValue=""
                                                  utcOffset={0}
                                                  selected={this.getDateForSelectedLab(
                                                    ele.ngsLaboratoryId,
                                                    child.ngsLaboratoryPatientActivityId
                                                  )}
                                                  onChange={(date) => {
                                                    this.handleLabResultDateChange(
                                                      ele.ngsLaboratoryId,
                                                      child.ngsLaboratoryPatientActivityId,
                                                      date
                                                    );
                                                  }}
                                                  dateFormat="MM/dd/yyyy"
                                                  placeholderText="mm/dd/yyyy"
                                                  className={`form-control here text-center  ${isEditDateClass}  `}
                                                  showMonthDropdown
                                                  showYearDropdown
                                                  dropdownMode="select"
                                                  fixedHeight
                                                  maxDate={new Date().setDate(
                                                    new Date().getDate() + 7
                                                  )}
                                                />
                                              </div>
                                            </Col>
                                            <Col
                                              className=" my-2"
                                              id="SpecimenSectionNotApplicable"
                                              xs="1"
                                              lg="1"
                                              xl="1"
                                            >
                                              <Input
                                                className={`ml-0 mt-1  ${isEditDateClass} mr-3 `}
                                                type="checkbox"
                                                name="inline-checkbox1"
                                                disabled={this.disablesNaData(
                                                  ele.ngsLaboratoryId,
                                                  child.ngsLaboratoryPatientActivityId
                                                )}
                                                checked={this.isNACheckBoxForSelectedLabs(
                                                  ele.ngsLaboratoryId,
                                                  child.ngsLaboratoryPatientActivityId
                                                )}
                                                onChange={() => {
                                                  // alert(1);
                                                  this.handleLabResultChange(
                                                    ele.ngsLaboratoryId,
                                                    child.ngsLaboratoryPatientActivityId,
                                                    "isNA"
                                                  );
                                                }}
                                                id={`chkbx_${ele.ngsLaboratoryId}_${child.ngsLaboratoryPatientActivityId}naid`}
                                              />
                                              <Label
                                                className="form-check-label ml-3"
                                                htmlFor={`chkbx_${ele.ngsLaboratoryId}_${child.ngsLaboratoryPatientActivityId}naid`}
                                              >
                                                N/A
                                              </Label>
                                            </Col>
                                            <Col
                                              className="align-self-start my-2"
                                              xs="3"
                                              lg="3"
                                              xl="3"
                                            >
                                              {this.displayApplyDate(
                                                ele.ngsLaboratoryId,
                                                child.ngsLaboratoryPatientActivityId,
                                                (labId, child) =>
                                                  this.isDateDisabledForSelectedLabs(
                                                    labId,
                                                    child
                                                  ) ||
                                                  this.diasbledCheckboxForSpecimenCollectionSampleLabs(
                                                    labId,
                                                    child
                                                  )
                                              )}
                                            </Col>
                                          </>
                                        );
                                      }
                                    )}

                                    {filteredSpecimenReceivedStatus.length ? (
                                      <Col
                                        xs="8"
                                        className="text-right  "
                                        style={{
                                          marginLeft: "4.5vw",
                                          display: "flex",
                                          justifyContent: "end",
                                        }}
                                      >
                                        <button
                                          style={{
                                            paddingLeft: "3vw",
                                            paddingRight: "3vw",
                                            display: this.state.isEdit
                                              ? "block"
                                              : "none",
                                          }}
                                          className="btn btn-primary btn-md mt-2 "
                                          disabled={
                                            this.isSubmitDisabledForSampleLab(
                                              ele.ngsLaboratoryId,
                                              "selectedLabs"
                                            ) || loading
                                            // Object.keys(this.state.selectedLabs[ele.ngsLaboratoryId]).filter((k) => {
                                            //   let lab = this.state.selectedLabs[ele.ngsLaboratoryId][k]
                                            //   return lab.checked && lab.date === '' || !lab.checked && lab.date !== ''
                                            // })
                                            //   .length > 0
                                            //  || this.isAllSamplesSubmittedForLab(ele.ngsLaboratoryId)
                                          }
                                          onClick={() => {
                                            // let a = Object.keys(this.state.selectedLabs[ele.ngsLaboratoryId]).filter((k) => {
                                            //   let lab = this.state.selectedLabs[ele.ngsLaboratoryId][k]
                                            //   return lab.checked && lab.date === ''
                                            // })
                                            // console.log({ isDisabled: a.length > 0, a })
                                            this.updateDataAndRefreshPage(
                                              () => {
                                                return this.submitPatientSpecimenFromSelectedLab(
                                                  ele.ngsLaboratoryId
                                                );
                                              }
                                            );
                                          }}
                                        >
                                          <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                          Submit
                                        </button>
                                      </Col>
                                    ) : (
                                      <FormGroup className="ml-3">
                                        This laboratory is not working on
                                        assigned samples.
                                      </FormGroup>
                                    )}
                                  </Row>
                                </FormGroup>
                              </FormGroup>
                            </div>
                          </Col>
                          {/* <Col xs="4" lg="2" xl="4" className="mb-3">
                            Notes:
                            <textarea style={{ height: "100%", width: "100%" }}></textarea>
                          </Col> */}
                          {/* for bucket */}
                          {/* {Array.isArray(filteredArrOfLabRecievedResult) &&
                            filteredArrOfLabRecievedResult.length > 0 && ( */}
                        </Row>
                          <Row
                            className="pb-3"
                            style={{
                              display: this.state.basicInfo.showSpecimenReceived
                                ? "flex"
                                : "none",
                            }}
                          >
                            <Col xs="9" lg="10" xl="9">
                              <div className="form-group w-100 dis-contents">
                                <FormGroup>
                                  <h5 className="mt-2">
                                    Lab Results Received & Uploaded in S3 bucket
                                  </h5>
                                  {
                                    // this.isAllSamplesSubmittedForLab(ele.ngsLaboratoryId) && Array.isArray(filteredArrOfLabRecievedResult) &&
                                    Array.isArray(
                                      filteredArrOfLabRecievedResult
                                    ) &&
                                      filteredArrOfLabRecievedResult.length > 0 ? (
                                      <FormGroup check row>
                                        <Row style={{ marginBottom: "3px" }}>
                                          {filteredArrOfLabRecievedResult.map(
                                            (child) => {
                                              let isDateInputDisabledForBucket =
                                                this.isDateDisabledForSelectedLabsOfBucket(
                                                  ele.ngsLaboratoryId,
                                                  child.ngsLaboratoryPatientActivityId
                                                ) ||
                                                this.isSampleUploadedToBucket(
                                                  ele.ngsLaboratoryId,
                                                  child.ngsLaboratoryPatientActivityId
                                                );
                                              return (
                                                <>
                                                  <Col
                                                    xs="1"
                                                    lg="1"
                                                    xl="1"
                                                    className="align-self-start my-2"
                                                  >
                                                    <Input
                                                      checked={this.isCheckBoxDisabledForSelectedLabsForBucket(
                                                        ele.ngsLaboratoryId,
                                                        child.ngsLaboratoryPatientActivityId
                                                      )}
                                                      className={`ml-0  ${isEditDateClass}  `}
                                                      type="checkbox"
                                                      name="inline-checkbox1"
                                                      onChange={() => {
                                                        // alert(1);
                                                        this.handleLabResultChangeOfLab(
                                                          ele.ngsLaboratoryId,
                                                          child.ngsLaboratoryPatientActivityId
                                                        );
                                                        // this.handleLabResultChange(
                                                        //   ele.ngsLaboratoryId,
                                                        //   "1"
                                                        // );
                                                      }}
                                                      disabled={this.isSampleUploadedToBucket(
                                                        ele.ngsLaboratoryId,
                                                        child.ngsLaboratoryPatientActivityId
                                                      )}
                                                      id={`chkBoxBucket_${ele.ngsLaboratoryId}_${child.ngsLaboratoryPatientActivityId}`}
                                                    />
                                                  </Col>
                                                  <Col
                                                    xs="4"
                                                    lg="4"
                                                    xl="4"
                                                    className="align-self-start my-2"
                                                    style={{ paddingTop: "0px" }}
                                                  >
                                                    <Label
                                                      className="form-check-label"
                                                      htmlFor={`chkBoxBucket_${ele.ngsLaboratoryId}_${child.ngsLaboratoryPatientActivityId}`}
                                                    >
                                                      {child.sampleTypeName}
                                                    </Label>
                                                  </Col>
                                                  <Col
                                                    xs="3"
                                                    lg="3"
                                                    xl="3"
                                                    className="align-self-start my-2"
                                                  >
                                                    <div
                                                      className={`cus-date-picker `}
                                                    >
                                                      <DatePicker
                                                        disabled={
                                                          this.isDateDisabledForSelectedLabsOfBucket(
                                                            ele.ngsLaboratoryId,
                                                            child.ngsLaboratoryPatientActivityId
                                                          ) ||
                                                          this.isSampleUploadedToBucket(
                                                            ele.ngsLaboratoryId,
                                                            child.ngsLaboratoryPatientActivityId
                                                          )
                                                        }
                                                        defaultValue=""
                                                        selected={this.getDateForSelectedLabOfBucket(
                                                          ele.ngsLaboratoryId,
                                                          child.ngsLaboratoryPatientActivityId
                                                        )}
                                                        onChange={(date) => {
                                                          this.handleLabResultDateChangeOfBucket(
                                                            ele.ngsLaboratoryId,
                                                            child.ngsLaboratoryPatientActivityId,
                                                            date
                                                          );
                                                        }}
                                                        dateFormat="MM/dd/yyyy"
                                                        placeholderText="mm/dd/yyyy"
                                                        className={`form-control here text-center  ${isEditDateClass}  `}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        fixedHeight
                                                        maxDate={new Date().setDate(
                                                          new Date().getDate() + 7
                                                        )}
                                                      />
                                                    </div>
                                                  </Col>
                                                  <Col
                                                    xs="1"
                                                    lg="1"
                                                    xl="1"
                                                    className="align-self-start my-2"
                                                  >
                                                    {child?.analysisNotApplicable ? (
                                                      <Label className="form-check-label ml-3">
                                                        N/A
                                                      </Label>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </Col>
                                                  <Col
                                                    xs="3"
                                                    lg="3"
                                                    xl="3"
                                                    className="align-self-start my-2"
                                                  >
                                                    {this.displayApplyDateForBucket(
                                                      ele.ngsLaboratoryId,
                                                      child.ngsLaboratoryPatientActivityId,
                                                      (labId, child) =>
                                                        this.isDateDisabledForSelectedLabsOfBucket(
                                                          labId,
                                                          child
                                                        ) ||
                                                        this.isSampleUploadedToBucket(
                                                          labId,
                                                          child
                                                        )
                                                    )}
                                                  </Col>
                                                </>
                                              );
                                            }
                                          )}

                                          {filteredArrOfLabRecievedResult?.length ? (
                                            <Col
                                              xs="8"
                                              style={{ marginLeft: "4.5vw" }}
                                            >
                                              {" "}
                                              <button
                                                style={{
                                                  paddingLeft: "3vw",
                                                  paddingRight: "3vw",
                                                  display: this.state.isEdit
                                                    ? "block"
                                                    : "none",
                                                }}
                                                className="btn btn-primary btn-md mt-2 float-right"
                                                // style={{margin: "10px auto"}}
                                                disabled={
                                                  this.isSubmitDisabledForSampleLab(
                                                    ele.ngsLaboratoryId,
                                                    "selectedLabsForBucket"
                                                  ) || loading
                                                  // Object.keys(this.state.selectedLabsForBucket[ele.ngsLaboratoryId]).filter((k) => {
                                                  //   let lab = this.state.selectedLabsForBucket[ele.ngsLaboratoryId][k]
                                                  //   return lab.checked && lab.date === '' || !lab.checked && lab.date !== ''
                                                  // })
                                                  //   .length > 0
                                                  // || this.isAllSamplesUploadedToBucket(ele.ngsLaboratoryId)
                                                }
                                                onClick={() => {
                                                  this.updateDataAndRefreshPage(
                                                    () => {
                                                      return this.submitPatientSpecimenFromSelectedLabOfBucket(
                                                        ele.ngsLaboratoryId
                                                      );
                                                    }
                                                  );
                                                }}
                                              >
                                                <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                                Submit
                                              </button>
                                            </Col>
                                          ) : (
                                            "This laboratory is not working on assigned samples."
                                          )}
                                        </Row>
                                      </FormGroup>
                                    ) : (
                                      <FormGroup>
                                        Please send one of the samples to view
                                        result
                                      </FormGroup>
                                    )
                                  }
                                </FormGroup>
                              </div>
                            </Col>
                            {/* <Col xs="4" lg="2" xl="4" className="mt-3">
                            Notes:
                            
                            <textarea style={{ height: "100%", width: "100%" }}></textarea>
                            
                          </Col> */}
                            {/* )} */}
                          </Row></>}

                      </CardBody>
                    </Card>
                  );
                })
              ) : (
                <Card className="viewPatientForm">
                  <CardBody>
                    <Row>
                      <div className="form-group w-100 dis-contents">
                        <Col xs="6">
                          <FormGroup>
                            <h5>Lab Samples</h5>
                            <hr />
                            {/* <h6 className="mt-2"> */}
                            This section will be visible after analysis order
                            confirmed. {/* </h6> */}
                          </FormGroup>
                        </Col>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              )}

              {/* <Card className="viewPatientForm">
                <CardBody>
                  <h4>Lab 1 </h4>
                  <Row>
                    <div className="form-group w-100 dis-contents">
                      <Col xs="6">
                        <FormGroup>
                          <h5 className="mt-2">
                            Patient Specimen Received at Lab
                          </h5>
                          <FormGroup check row>
                            <Row style={{ marginBottom: "3px" }}>
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  Whole Exome Sequencing (WES/DNA) Blood
                                </Label>
                              </Col>
                              <Col xs="4">
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  RNA Transcriptome Blood
                                </Label>
                              </Col>
                              <Col xs="4">
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  EV Proteomics Urine
                                </Label>
                              </Col>
                              <Col xs="4">
                                {" "}
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    // onChange={valu}
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  Biomarkers/Hormones Urine
                                </Label>
                              </Col>
                              <Col xs="4">
                                {" "}
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                            </Row>
                          </FormGroup>
                        </FormGroup>
                      </Col>
                      <Col xs="6">
                        <FormGroup>
                          <h5 className="mt-2">
                            Lab Results Received & Uploaded in S3 bucket
                          </h5>
                          <FormGroup check row>
                            <Row style={{ marginBottom: "3px" }}>
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  WES Tumor
                                </Label>
                              </Col>
                              <Col xs="4">
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  WES Blood
                                </Label>
                              </Col>
                              <Col xs="4">
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  RNASeq Tumor
                                </Label>
                              </Col>
                              <Col xs="4">
                                {" "}
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  Urine Proteomics
                                </Label>
                              </Col>
                              <Col xs="4">
                                {" "}
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                            </Row>
                          </FormGroup>
                        </FormGroup>
                      </Col>
                    </div>
                  </Row>
                </CardBody>
              </Card> */}
              {/* lab 2 */}
              {/* <Card className="viewPatientForm">
                <CardBody>
                  <h4>Lab 2 </h4>
                  <Row>
                    <div className="form-group w-100 dis-contents">
                      <Col xs="6">
                        <FormGroup>
                          <h5 className="mt-2">
                            Patient Specimen Received at Lab
                          </h5>
                          <FormGroup check row>
                            <Row style={{ marginBottom: "3px" }}>
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-  check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  Whole Exome Sequencing (WES/DNA) Blood
                                </Label>
                              </Col>
                              <Col xs="4">
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  RNA Transcriptome Blood
                                </Label>
                              </Col>
                              <Col xs="4">
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  EV Proteomics Urine
                                </Label>
                              </Col>
                              <Col xs="4">
                                {" "}
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  Biomarkers/Hormones Urine
                                </Label>
                              </Col>
                              <Col xs="4">
                                {" "}
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                            </Row>
                          </FormGroup>
                        </FormGroup>
                      </Col>
                      <Col xs="6">
                        <FormGroup>
                          <h5 className="mt-2">
                            Lab Results Received & Uploaded in S3 bucket
                          </h5>
                          <FormGroup check row>
                            <Row style={{ marginBottom: "3px" }}>
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  WES Tumor
                                </Label>
                              </Col>
                              <Col xs="4">
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  WES Blood
                                </Label>
                              </Col>
                              <Col xs="4">
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  RNASeq Tumor
                                </Label>
                              </Col>
                              <Col xs="4">
                                {" "}
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                              <Col xs="1"></Col>
                              <Col xs="7" style={{ paddingTop: "0px" }}>
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="inline-checkbox1"
                                />
                                <Label className="form-check-label" check>
                                  Urine Proteomics
                                </Label>
                              </Col>
                              <Col xs="4">
                                {" "}
                                <div className={`cus-date-picker `}>
                                  <DatePicker
                                    defaultValue=""
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="mm/dd/yyyy"
                                    className="form-control here "
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                  />
                                </div>
                              </Col>{" "}
                            </Row>
                          </FormGroup>
                        </FormGroup>
                      </Col>
                    </div>
                  </Row>
                </CardBody>
              </Card> */}
              <div ref={this.pipelineRef}></div>
              <div ref={this.designRef}></div>
              <Card className="viewPatientForm">
                <CardBody>
                  <Row>
                    <div className="form-goup w-100 dis-cntents">
                      <Col xs="12">
                        <p className="mt-2 d-flex align-items-center justify-content-between">

                          <span className=" h5">
                            <span id="DesignOrderSection">Design Payment</span>
                            {
                              !this.state.basicInfo.isFullPaymentType &&
                              <span className="ml-2 text-success"
                              // style={{ display: "none" }}
                              >

                                {
                                  this.state.designOrderDiscount > 0 ? `(Discount: ${this.state.designOrderDiscount}%)` : ""
                                }
                              </span>}
                          </span>
                          <div className="mt-2 d-flex align-items-center justify-content-between">
                            {
                              !this.state.basicInfo.isFullPaymentType &&

                              <Button
                                // style={{ display: "none" }}

                                onClick={
                                  () => {
                                    this.setState({
                                      showDiscountModal: true
                                    })
                                  }
                                }
                                color="primary"

                                className="btn btn-primary text-light float-right"

                              >

                                {/* <i className="icon-plus text-light"></i>  */}
                                Send PO & Invoice</Button>}
                            {/* {this.state.showDesignPayment ? <i class="icon-minus ml-2" style={{ fontSize: "24px", cursor: "pointer" }} onClick={() => { this.setState({ showDesignPayment: !this.state.showDesignPayment }) }}>  </i>
                                : <i class="icon-plus ml-2" style={{ fontSize: "24px", cursor: "pointer" }} onClick={() => { this.setState({ showDesignPayment: !this.state.showDesignPayment }) }}>  </i>
                            } */}
                          </div>

                        </p>
                        <hr className="w-100" />
                      </Col>
                      <Modal
                        isOpen={this.state.showDiscountModal}
                        className="modal-dialog modal-md"
                      >
                        <ModalHeader>Send PO and Invoice for Design Payment</ModalHeader>
                        <ModalBody>
                          <Form>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-group row mb-4">
                                  <div className="col-md-12">
                                    <Col xs="12">
                                      <FormGroup>


                                        <Label>
                                          Discount

                                        </Label>
                                        <div className="d-flex">
                                          <Input
                                            type="select"
                                            name="DesignDiscountType"
                                            value={this.state.DesignDiscountType}
                                            onChange={e => this.handleDiscountType(e, "DesignDiscountType")}
                                          >
                                            <option value="">Select Discount Type</option>
                                            <option value="Percentage">Percentage</option>
                                            <option value="Amount">Amount</option>
                                          </Input>
                                          {
                                            !this.state.DesignDiscountType ? null :

                                              // <NumberFormat
                                              //   placeholder={`Enter ${this.state.DesignDiscountType}`}
                                              //   value={this.state.DesignDiscount}
                                              //   name="DesignDiscount"
                                              //   isAllowed={values => {
                                              //     const { formattedValue, floatValue } = values

                                              //     if (floatValue == null) {
                                              //       return formattedValue === ''
                                              //     } else {

                                              //       return this.state.DesignDiscountType === "Percentage" ? (formattedValue <= 100 && formattedValue >= 0) : (formattedValue < 100000 && formattedValue >= 0)
                                              //     }
                                              //   }}
                                              //   onChange={e => { this.handleInputChange(e, "DesignDiscount") }}
                                              //   className={`ml-1 ${errors.DesignDiscount ? "is-invalid" : ""}`}
                                              // ></NumberFormat>
                                              <Input
                                                type="number"
                                                placeholder="Enter Discount"
                                                value={this.state.DesignDiscount}
                                                name="DesignDiscount"
                                                onChange={e => this.handleInputChange(e, "DesignDiscount")}
                                                className={`ml-1 ${errors.DesignDiscount ? "is-invalid" : ""}`}
                                              />
                                          }

                                        </div>

                                      </FormGroup>
                                      {<span className="error">{errors.DesignDiscount}</span>}

                                    </Col>

                                    <Col xs="12">
                                      <FormGroup>
                                        <Label>
                                          Send PO & Invoice to<span className="requiredField"></span>
                                        </Label>
                                        {/* <Input
                                          type="select"
                                          name="practitionerContactPersonIdDesign"
                                          value={this.state.practitionerContactPersonIdDesign}
                                          onChange={e => this.handleInputChange(e, "practitionerContactPersonIdDesign")}
                                        >
                                          <option value="">Select</option>
                                          {this.state.practitionerContact?.map((data, i) => {
                                            return (
                                              <option key={i}
                                                value={0}
                                              >
                                                {data?.firstName + " " + data?.lastName}{" < "}{data.email}{">"}
                                              </option>
                                            );
                                          })}
                                          {this.state.practitionerContactPerson?.map((data, i) => {
                                            return (
                                              <option key={i} value={data?.practitionerContactPersonId}>
                                                {data.name}{" <"}{data.email}{">"}
                                              </option>
                                            );
                                          })}

                                        </Input> */}

                                        <CreatableSelect
                                          isMulti
                                          options={this.state.practitionerContactPerson}
                                          onChange={e => this.handleEmailChange(e, "SendPO_Email")}
                                          // name="Send_PO"
                                          value={this.state.practitionerContactPersonIdDesign}
                                          isClearable={true}
                                          isSearchable={true}
                                          placeholder="Recipients"
                                          formatCreateLabel={(inputValue) => `${inputValue}`}
                                          isValidNewOption={this.isValidNewOption}
                                          getOptionLabel={(opt) => (this.state.practitionerContactPersonIdDesign && this.state.practitionerContactPersonIdDesign.includes(opt) ? opt.name ? opt.name : opt.value : opt.name ? <>{opt.name} <br />{opt.value}</> : `${opt.value}`)}
                                          menuPlacement="bottom"
                                          maxMenuHeight={200}
                                        />


                                        {<span className="error">{errors.practitionerContactPersonIdDesign}</span>}
                                      </FormGroup>

                                    </Col>

                                  </div>
                                </div>


                              </div>
                            </div>
                          </Form>
                        </ModalBody>
                        <ModalFooter>
                          <div className="text-right">

                            <Button
                              type="button"
                              className="btn  btn-secondary"
                              onClick={() => {
                                let err = this.state.errors;
                                err.DesignDiscount = ""
                                this.setState({
                                  showDiscountModal: false,
                                  DesignDiscountType: "",
                                  DesignDiscount: "",
                                  practitionerContactPersonIdDesign: [],
                                });
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              color="primary"
                              onClick={() => {
                                this.handleSubmintDesignDiscount()
                              }}
                              disabled={(this.state.DesignDiscountType ? false : true) || loading}
                              style={{ marginLeft: "5px" }}
                            >
                              <i className="fa fa-dot-circle-o"></i> Submit
                            </Button>
                          </div>

                        </ModalFooter>
                      </Modal>
                      {/* {this.state.showDesignPayment && <><Col xs="8" lg="9" xl="7"> */}
                      {true && <><Col xs="8" lg="9" xl="7">
                        <FormGroup>
                          {this.state.basicInfo.showDesignOrder ? (
                            <FormGroup check row>
                              <Row style={{ marginBottom: "3px" }}>
                                <Col xs="1" className="align-self-start my-2">
                                  <Input
                                    id="do_check_order_submit"
                                    onChange={() => {
                                      this.handleDesignOrderStatusChange(
                                        "orderSubmited"
                                      );
                                    }}
                                    checked={this.isCheckedForDesignOrderStatus(
                                      "orderSubmited"
                                    )}
                                    // disabled={true}
                                    disabled={
                                      this.state.basicInfo?.designOrderStatus
                                        ?.orderSubmited &&
                                      this.state.basicInfo?.designOrderStatus
                                        ?.poReceived
                                    }
                                    // disabled={this.state.basicInfo?.designOrderStatus?.orderSubmited}
                                    className={`ml-0  ${isEditDateClass}  `}
                                    type="checkbox"
                                    name="inline-checkbox1"
                                  />
                                </Col>
                                <Col xs="4" className="align-self-start my-2">
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="do_check_order_submit"
                                  >
                                    {/* Order Submitted */}
                                    Send PO Notification
                                  </Label>
                                </Col>
                                <Col
                                  xs="3"
                                  className="align-self-start my-2"
                                  style={{ paddingTop: "5px" }}
                                >
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      disabled={this.isDesignOrderSubmittedDisabled()}
                                      // disabled={true}
                                      onChange={(date) => {
                                        this.handleDesignOrderStatusDateChange(
                                          "orderSubmited",
                                          date
                                        );
                                      }}
                                      selected={this.getDateForDesignOrderStatus(
                                        "orderSubmited"
                                      )}
                                      defaultValue=""
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here text-center  ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>
                                <Col
                                  xs="4"
                                  className="align-self-start my-2"
                                  style={{ paddingTop: "5px" }}
                                >
                                  <button
                                    className={`btn btn-${this.state.basicInfo?.designOrderStatus
                                      ?.orderSubmited &&
                                      !this.state.basicInfo?.designOrderStatus
                                        ?.poReceived
                                      ? "success"
                                      : "primary"
                                      } btn-md `}
                                    // className="btn btn-primary btn-md"
                                    style={{
                                      paddingLeft: "2vw",
                                      paddingRight: "2vw",
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    // disabled={
                                    //   !this.getDateForDesignOrderStatus("pmr")
                                    // }
                                    disabled={
                                      !this.getDateForDesignOrderStatus(
                                        "orderSubmited"
                                      ) || this.isDesignOrderSubmittedDisabled() || loading
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() => {
                                        return this.submitDisgnOrderStatus(
                                          this.state.basicInfo
                                            ?.designOrderStatus
                                            ?.orderSubmited &&
                                          !this.state.basicInfo
                                            ?.designOrderStatus?.poReceived
                                        );
                                      });
                                    }}
                                  >
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    {this.state.basicInfo?.designOrderStatus
                                      ?.orderSubmited &&
                                      !this.state.basicInfo?.designOrderStatus
                                        ?.poReceived
                                      ? "Update"
                                      : "Submit"}
                                  </button>
                                </Col>
                                {/* PO Received By Acct */}

                                <Col xs="1" className="align-self-start my-2">
                                  <Input
                                    onChange={() => {
                                      this.handleDesignOrderStatusChange(
                                        "poReceived"
                                      );
                                    }}
                                    checked={this.isCheckedForDesignOrderStatus(
                                      "poReceived"
                                    )}
                                    className={`ml-0  ${isEditDateClass}  `}
                                    type="checkbox"
                                    name="inline-checkbox1"
                                    id="chkbox_designOrdrStat_po"
                                    disabled={
                                      !this.state.basicInfo?.designOrderStatus
                                        ?.orderSubmited ||
                                      this.state.basicInfo?.designOrderStatus
                                        ?.poReceived
                                    }
                                  // disabled={this.state.basicInfo?.designOrderStatus?.orderSubmited && this.state.basicInfo?.designOrderStatus?.invoiceSend}
                                  />
                                </Col>
                                <Col xs="4" className="align-self-start my-2">
                                  <Label
                                    className="form-check-label"
                                    htmlFor="chkbox_designOrdrStat_po"
                                  >
                                    PO Sent to Accounting
                                  </Label>
                                </Col>
                                <Col
                                  xs="3"
                                  className="align-self-start my-2"
                                  style={{ paddingTop: "5px" }}
                                >
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      disabled={this.isDesignOrderPoDisabled()}
                                      onChange={(date) => {
                                        this.handleDesignOrderStatusDateChange(
                                          "poReceived",
                                          date
                                        );
                                      }}
                                      // minDate={new Date(this.state.basicInfo?.designOrderStatus?.orderSubmitedDate) || ''}
                                      selected={this.getDateForDesignOrderStatus(
                                        "poReceived"
                                      )}
                                      defaultValue=""
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here text-center  ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>

                                <Col
                                  xs="4"
                                  className="align-self-start my-2"
                                  style={{ paddingTop: "5px" }}
                                >
                                  <button
                                    className={`btn btn-${this.state.basicInfo?.designOrderStatus
                                      ?.poReceived &&
                                      !this.state.basicInfo?.designOrderStatus
                                        ?.invoiceSend
                                      ? "success"
                                      : "primary"
                                      } btn-md `}
                                    style={{
                                      paddingLeft: "2vw",
                                      paddingRight: "2vw",
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    disabled={
                                      !this.getDateForDesignOrderStatus(
                                        "poReceived"
                                      ) || this.isDesignOrderPoDisabled() || loading
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() => {
                                        return this.poReceived();
                                      });
                                    }}
                                  >
                                    {/* Submit */}
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    {this.state.basicInfo?.designOrderStatus
                                      ?.poReceived &&
                                      !this.state.basicInfo?.designOrderStatus
                                        ?.invoiceSend
                                      ? "Update"
                                      : "Submit"}
                                  </button>
                                </Col>
                                {/* PO Received By Acct */}
                                {/* Invoice Sent to Clinic */}

                                <Col xs="1" className="align-self-start my-2">
                                  <Input
                                    className={`ml-0  ${isEditDateClass}  `}
                                    type="checkbox"
                                    name="inline-checkbox1"
                                    id="chkbox_designOrdrStat_invoice"
                                    checked={this.isCheckedForDesignOrderStatus(
                                      "invoice"
                                    )}
                                    onChange={() => {
                                      // alert(`${this.state.basicInfo?.designOrderStatus?.poReceived && this.state.basicInfo?.designOrderStatus?.invoiceSend} a:`)
                                      this.handleDesignOrderStatusChange(
                                        "invoice"
                                      );
                                    }}
                                    disabled={
                                      !this.state.basicInfo?.designOrderStatus
                                        ?.poReceived ||
                                      this.state.basicInfo?.designOrderStatus
                                        ?.paymentReceived
                                    }
                                  />
                                </Col>
                                <Col xs="4" className="align-self-start my-2">
                                  <Label
                                    className="form-check-label"
                                    htmlFor="chkbox_designOrdrStat_invoice"
                                  >
                                    Invoice Sent to Clinic
                                  </Label>
                                </Col>
                                <Col
                                  xs="3"
                                  className="align-self-start my-2"
                                  style={{ paddingTop: "5px" }}
                                >
                                  {" "}
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      disabled={this.isDesignOrderInvoiceDisabled()}
                                      onChange={(date) => {
                                        this.handleDesignOrderStatusDateChange(
                                          "invoice",
                                          date
                                        );
                                      }}
                                      // minDate={new Date(this.state.basicInfo?.designOrderStatus?.poReceivedDate) || ''}
                                      selected={this.getDateForDesignOrderStatus(
                                        "invoice"
                                      )}
                                      defaultValue=""
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here text-center  ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>
                                <Col
                                  xs="4"
                                  className="align-self-start my-2"
                                  style={{ paddingTop: "5px" }}
                                >
                                  <button
                                    className={`btn btn-${this.state.basicInfo?.designOrderStatus
                                      ?.invoiceSend &&
                                      !this.state.basicInfo?.designOrderStatus
                                        ?.paymentReceived
                                      ? "success"
                                      : "primary"
                                      } btn-md `}
                                    style={{
                                      paddingLeft: "2vw",
                                      paddingRight: "2vw",
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    disabled={
                                      !this.getDateForDesignOrderStatus(
                                        "invoice"
                                      ) || this.isDesignOrderInvoiceDisabled() || loading
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() => {
                                        return this.invoiceSentToClinic();
                                      });
                                    }}
                                  >
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    {this.state.basicInfo?.designOrderStatus
                                      ?.invoiceSend &&
                                      !this.state.basicInfo?.designOrderStatus
                                        ?.paymentReceived
                                      ? "Update"
                                      : "Submit"}
                                  </button>
                                </Col>
                                {/* Invoice Sent to Clinic */}
                                {/*    Payment Recevied */}

                                <Col xs="1" className="align-self-start my-2">
                                  <Input
                                    onChange={() => {
                                      this.handleDesignOrderStatusChange(
                                        "paymentRecived"
                                      );
                                    }}
                                    checked={this.isCheckedForDesignOrderStatus(
                                      "paymentRecived"
                                    )}
                                    className={`ml-0  ${isEditDateClass}  `}
                                    disabled={
                                      this.isDesignOrderStatusDisabled(
                                        "paymentReceived"
                                      ) ||
                                      !this.isDesignOrderStatusDisabled(
                                        "invoiceSend"
                                      ) || this.state.basicInfo.peptideStatus.isNoPMRRequired
                                    }
                                    type="checkbox"
                                    name="inline-checkbox1"
                                    id="chkbox_designOrdrStat_payment"
                                  />
                                </Col>
                                <Col xs="4" className="align-self-start my-2">
                                  <Label
                                    className="form-check-label"
                                    htmlFor="chkbox_designOrdrStat_payment"
                                  >
                                    Payment Received <br />
                                  </Label>
                                </Col>
                                <Col
                                  xs="3"
                                  className="align-self-start my-2"
                                  style={{ paddingTop: "5px" }}
                                >
                                  {" "}
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      disabled={
                                        this.isDateDesabledForDesignOrderStatus(
                                          "paymentRecived"
                                        ) ||
                                        this.isDesignOrderStatusDisabled(
                                          "paymentReceived"
                                        )
                                      }
                                      selected={this.getDateForDesignOrderStatus(
                                        "paymentRecived"
                                      )}
                                      // minDate={new Date(this.state.basicInfo?.designOrderStatus?.invoiceSendDate) || ''}
                                      onChange={(date) => {
                                        this.handleDesignOrderStatusDateChange(
                                          "paymentRecived",
                                          date
                                        );
                                      }}
                                      defaultValue=""
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here text-center  ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>
                                <Col
                                  xs="3"
                                  className="align-self-start my-2"
                                  style={{ paddingTop: "5px" }}
                                >
                                  <button
                                    className="btn btn-primary btn-md"
                                    style={{
                                      paddingLeft: "2vw",
                                      paddingRight: "2vw",
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    disabled={
                                      !this.getDateForDesignOrderStatus(
                                        "paymentRecived"
                                      ) ||
                                      !this.isCheckedForDesignOrderStatus(
                                        "paymentRecived"
                                      ) ||
                                      this.isDesignOrderStatusDisabled(
                                        "paymentReceived"
                                      ) || loading
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() => {
                                        return this.paymentReceived();
                                      });
                                    }}
                                  >
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    Submit
                                  </button>
                                </Col>

                                <Col xs="1" className="d-flex align-items-center ml-0" >

                                  <span>
                                    <Input
                                      // className={`ml-0 mt-1  ${isEditDateClass} mr-3 `}
                                      type="checkbox"
                                      name="inline-checkbox1"
                                      disabled={this.state.basicInfo?.designOrderStatus?.paymentReceived}
                                      checked={this.state.basicInfo.peptideStatus.isNoPMRRequired}
                                      onChange={() => {
                                        this.setState({
                                          showDesignPaymentNotRequired: true
                                        })
                                      }}
                                      id="isNoPMRRequired"
                                    />
                                    <Label
                                      className="form-check-label ml-1"
                                      htmlFor={`isNoPMRRequired`}
                                    >
                                      N/A
                                    </Label>

                                  </span>


                                </Col>


                                <Modal
                                  isOpen={this.state.showDesignPaymentNotRequired}
                                  className="modal-dialog modal-md"
                                >
                                  <ModalHeader>Confirm</ModalHeader>
                                  <ModalBody>
                                    {this.state.basicInfo.peptideStatus.isNoPMRRequired ? " Are you sure you want to take design payment?" : "Are you sure you don't want to take Design payment?"}
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button
                                      color="secondary"
                                      onClick={() =>
                                        this.setState({ showDesignPaymentNotRequired: false })
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      color="primary"
                                      onClick={() =>
                                        this.handleDesignPaymentNotRequired()
                                      }
                                    // this.setState({ emailNotify: false, showEmailNotifyConfirm: false })}
                                    >
                                      Yes
                                    </Button>
                                  </ModalFooter>
                                </Modal>
                              </Row>
                            </FormGroup>
                          ) : (
                            <>
                              <FormGroup>
                                This section will be visible after receiving the
                                data.
                              </FormGroup>
                            </>
                          )}
                        </FormGroup>
                      </Col>
                        {
                          !this.state.basicInfo.isFullPaymentType &&

                          <Col xs="12" >
                            <table className="table table-bordered  ">
                              <thead
                                style={{
                                  color: "#fff",
                                  border: "1px solid #FFF",
                                }}
                              >
                                <tr
                                  style={{ backgroundColor: "#1C3A84" }}
                                >
                                  <th className="border-0" colSpan="3">
                                    <div
                                      className="d-flex"
                                      style={{
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span> PO and Invoice(Design) </span>


                                    </div>
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr>
                                  <td>
                                    <table className="table table-bordered  ">
                                      <thead>
                                        <tr
                                          className="text-center "
                                          style={{
                                            // backgroundColor: "#5e75ae"
                                            backgroundColor: "#e4e7ea",
                                            color: "black",
                                          }}
                                        >
                                          <th>File</th>
                                          <th>
                                            File Type
                                          </th>

                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {Array.isArray(
                                          this.state.DesignReport
                                        ) &&
                                          this.state.DesignReport
                                            ?.length > 0 ? (
                                          this.state.DesignReport.map(
                                            (e, i) => {
                                              return (
                                                <tr>
                                                  <td
                                                    className=""
                                                    style={{
                                                      verticalAlign:
                                                        "inherit",
                                                      alignItems:
                                                        "center",
                                                    }}
                                                  >
                                                    <i
                                                      className="fa fa-file-pdf-o"
                                                      style={{
                                                        margin: "5px",
                                                        color: "#f64846",
                                                      }}
                                                    ></i>
                                                    {/* <span>{e.invoiceReportPath ? e.invoiceReportPath : e.poReportPath}</span> */}
                                                    <span>{e?.invoiceReportPath ? String(e?.invoiceReportPath)?.substring(e?.invoiceReportPath?.search("Portal/") + 7) : String(e?.poReportPath)?.substring(String(e?.poReportPath)?.search("Portal/") + 7)}</span>

                                                    {/* {this.state
                                                    .renamePdf ===
                                                    "pr" + i ? (
                                                    <div
                                                      style={{
                                                        float: "right",
                                                        width: "92%",
                                                        position:
                                                          "relative",
                                                        textAlign:
                                                          "center",
                                                      }}
                                                    >
                                                      <Input
                                                        type="text"
                                                        onChange={(
                                                          e
                                                        ) => {
                                                          this.handlePdfNameChange(
                                                            e
                                                          );
                                                        }}
                                                        value={
                                                          this.state
                                                            ?.filePdfname
                                                        }
                                                      />
                                                      <i
                                                        style={{
                                                          position:
                                                            "absolute",
                                                          right: "9px",
                                                          top: "11px",
                                                          cursor:
                                                            "pointer",
                                                        }}
                                                        onClick={() => {
                                                          this.setState(
                                                            {
                                                              renamePdf:
                                                                "",
                                                              filePdfname:
                                                                "",
                                                            }
                                                          );
                                                        }}
                                                        class="fa fa-close"
                                                      ></i>
                                                      <button
                                                        className="btn btn-success mt-1"
                                                        onClick={(
                                                          event
                                                        ) =>
                                                          this.RenameFun(
                                                            event,
                                                            e.id,
                                                            1
                                                          )
                                                        }
                                                      >
                                                        Submit
                                                        <i
                                                          style={{
                                                            color:
                                                              "#fff",
                                                            marginLeft:
                                                              "3px",
                                                          }}
                                                          class="fa fa-check"
                                                        ></i>
                                                      </button>
                                                    </div>
                                                  ) : (
                                                    <span
                                                      id="PMRandFinalReportPatientFileName"
                                                      onDoubleClick={() => {
                                                        this.setState({
                                                          renamePdf:
                                                            "pr" + i,
                                                          filePdfname:
                                                            this.spliceFromSash(
                                                              e.patientReport
                                                            ).replace(
                                                              ".pdf",
                                                              ""
                                                            ),
                                                        });
                                                      }}
                                                    >
                                                      {this.spliceFromSash(
                                                        e.patientReport
                                                      )}
                                                    </span>
                                                  )}  */}

                                                  </td>
                                                  <td className=""
                                                    style={{
                                                      verticalAlign:
                                                        "inherit",
                                                      textAlign: "center",
                                                    }}><span>{e.invoiceReportPath ? "Invoice" : "PO"}</span></td>
                                                  <td className="text-center">
                                                    <button
                                                      type="btn"
                                                      id="PMRandFinalReportPatientFileView"
                                                      className="btn  btn-success btn-pill mr-2"
                                                      // disabled
                                                      onClick={() =>
                                                        this.previewInvoiceToggle_api(
                                                          e.invoicePOReportId,
                                                          "design"
                                                        )
                                                      }
                                                    >
                                                      View
                                                    </button>
                                                    <button
                                                      type="btn"
                                                      id=""
                                                      // disabled
                                                      className="btn  btn-success btn-pill ml-2"
                                                      onClick={() => {
                                                        this.handleShowInvoiceModal(
                                                          e, 2
                                                        );
                                                      }}
                                                    >
                                                      E-Mail
                                                    </button>
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )
                                        ) : (
                                          <tr>
                                            <td
                                              colspan="3"
                                              className="text-center"
                                            >
                                              Generated Invoice Or Po will be displayed here.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Col>}

                      </>}

                    </div>
                  </Row>
                </CardBody>
              </Card>
              {/* Pipeline main */}

              {/* design activity  */}

              <Card className="viewPatientForm">
                <CardBody>
                  {/* <Row>
                    <button
                      onClick={() => {
                       
                          this.updateDataAndRefreshPage(() => {
                            return this.VerifyData();
                          });
                        }}           

                    >
                      Data Verify
                    </button>

                  </Row> */}

                  <Row>
                    <Col xs="12">
                      <FormGroup>
                        <div className="d-flex"><h5 className="mt-2 w-100">PMR & Final Report </h5>
                          {/* {this.state.showPmrAndFinalReport ? <i class="icon-minus " style={{ fontSize: "24px", cursor: "pointer" }} onClick={() => { this.setState({ showPmrAndFinalReport: !this.state.showPmrAndFinalReport }) }}>  </i>
                            : <i class="icon-plus " style={{ fontSize: "24px", cursor: "pointer" }} onClick={() => { this.setState({ showPmrAndFinalReport: !this.state.showPmrAndFinalReport }) }}>  </i>
                          } */}
                        </div>

                        <hr />
                        {/* {this.state.showPmrAndFinalReport && <>{this.state.basicInfo?.showDesignActivity ? ( */}
                        {true && <>{this.state.basicInfo?.showDesignActivity ? (
                          <>
                            <div
                            // style={{ display: [7, 8, 9, 10].includes(this.state?.diseases?.diseaseCategoryId) ? "none" : "" }}
                            >
                              <h5
                                className="mt-2"
                              // style={{ display: [7, 8, 9, 10].includes(this.state?.diseases?.diseaseCategoryId) ? "none" : "" }}
                              >
                                Pipeline{" "}
                              </h5>
                              <Row
                                className="ml-1 text-center justify-content-center"
                                style={{
                                  display: [7, 8, 9, 10].includes(
                                    this.state?.diseases?.diseaseCategoryId
                                  )
                                    ? ""
                                    : "none",
                                }}
                              >
                                This section is under development for LRI
                                analysis
                              </Row>
                              <Row
                                className="ml-1 text-center justify-content-center"
                                style={{
                                  display: [6, 11, 12].includes(
                                    this.state?.diseases?.diseaseCategoryId
                                  )
                                    ? ""
                                    : "none",
                                }}
                              >
                                This section is under development for Prevention
                              </Row>

                              <Row
                                className="ml-1"
                                style={{
                                  display: [6, 7, 8, 9, 10, 11, 12].includes(
                                    this.state?.diseases?.diseaseCategoryId
                                  )
                                    ? "none"
                                    : "",
                                }}
                              >
                                {/* {!this.state.basicInfo?.designActivity?.designStarted && */}
                                <button
                                  id={
                                    [6, 7, 8, 9, 10, 11, 12].includes(
                                      this.state?.diseases?.diseaseCategoryId
                                    )
                                      ? ""
                                      : "PMRandFinalReportVerifyData"
                                  }
                                  style={{ maxWidth: "170px", height: "42px" }}
                                  className="btn btn-primary btn-md m-2 "
                                  // disabled={!this.state.basicInfo?.designActivity?.designStarted}
                                  // disabled={![2, 4, 3].includes(this.state.diseases?.diseaseCategoryId)}
                                  // disabled={this.state.basicInfo?.designOrderStatus?.paymentReceived}
                                  disabled={
                                    this.isAllLabSamplesAssignedForVerify() || loading

                                    // String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Started".toLowerCase() &&
                                    // String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() !== "Failed".toLowerCase() ||
                                    // String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Completed".toLowerCase()
                                    // String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() !== "Warning".toLowerCase()
                                  }
                                  onClick={() => {
                                    // toast.success("Data verified successfully ")
                                    if (false) {
                                      // this.handleShowDisease(true, false)
                                    } else {
                                      this.updateDataAndRefreshPage(() => {
                                        return this.VerifyData();
                                      });
                                    }
                                  }}
                                >
                                  Verify Data
                                  {/* <span
                                  style={{
                                    display: String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "failed".toLowerCase() ? "" : "none"
                                  }}
                                >
                                  <img className="ml-3"
                                    src={error_icon} style={{ height: "auto", maxWidth: "12%" }} alt="" />
                                </span>
                                <span

                                  style={{
                                    display: String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "completed".toLowerCase() ? "" : "none"
                                  }}
                                >
                                  <img
                                    src={success_icon} className="ml-3" style={{ height: "auto", maxWidth: "15%" }} alt="" />
                                </span>
                                <span
                                  style={{
                                    display: String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "warning".toLowerCase() ? "" : "none"
                                  }}
                                >
                                  <img className="ml-2"
                                    src={warn_icon} style={{ height: "auto", width: "15%" }} alt="" />
                                </span>
                                <span>
                                  <SpinnerRoundOutlined enabled={String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "started" == true} style={{ height: "auto", width: "15%", color: "#ffa500", marginLeft: "3px" }} сolor="#ffa500" />

                                </span> */}
                                </button>
                                {this.state.basicInfo?.designActivity?.pipelineStage === "Verification" ? (

                                  <><div
                                    style={{
                                      height: "40px",
                                      position: "absolute",
                                      right: "27px",
                                    }}
                                  >
                                    {pipelineStarted || pipelineQueued ? (
                                      <button
                                        className="btn-success btn"
                                        onClick={() => {
                                          this.refreshPipelineCall();
                                          // this.updateDataAndRefreshPage(this.getData)
                                        }}
                                      >
                                        Refresh
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                    {pipelineStarted ? (
                                      <>
                                        {" "}
                                        <button
                                          className="btn-danger btn ml-2"
                                          disabled={
                                            !this.state
                                              .isPipelineStatusRefreshed || this.state.disabledButton || loading
                                          }
                                          onClick={() => {
                                            this.handleShowPiplineStop();
                                          }}
                                        >
                                          Stop
                                        </button>{" "}
                                      </>
                                    ) : (
                                      ""
                                    )}

                                    {pipelineQueued ? (
                                      <>
                                        {" "}
                                        <button
                                          className="btn-danger btn ml-2"
                                          disabled={
                                            !this.state
                                              .isPipelineStatusRefreshed || this.state.disabledButton || loading
                                          }
                                          onClick={() => {
                                            this.handleShowPiplineCancle();
                                          }}
                                        // onClick={() => { this.handleShowPiplineStop() }}
                                        >
                                          Cancel
                                        </button>{" "}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  </>
                                ) : (
                                  ""
                                )}
                                {this.getPipeLineStatus()}
                              </Row>
                              <Row
                                className="ml-1"
                                style={{
                                  display: [6, 7, 8, 9, 10, 11, 12].includes(
                                    this.state?.diseases?.diseaseCategoryId
                                  )
                                    ? "none"
                                    : "",
                                }}
                              >
                                {/* } */}
                                {/* {!this.state.basicInfo?.designActivity?.designStarted && */}
                                <button
                                  style={{ maxWidth: "170px", height: "42px" }}
                                  id={
                                    [6, 7, 8, 9, 10, 11, 12].includes(
                                      this.state?.diseases?.diseaseCategoryId
                                    )
                                      ? ""
                                      : "PMRandFinalReportProcessData"
                                  }
                                  className="btn btn-primary btn-md m-2"
                                  // disabled={!this.state.basicInfo?.designActivity?.designStarted}
                                  // disabled={![2, 4, 3].includes(this.state.diseases?.diseaseCategoryId)}
                                  // disabled={
                                  //   !(String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() !== "Completed".toLowerCase()) ||
                                  //   // String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Failed".toLowerCase() ||
                                  //   // String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() !== "Completed".toLowerCase() ||
                                  //   // !( String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Completed".toLowerCase() &&  this.state.basicInfo?.designActivity?.designStarted == false )||
                                  //   // !( String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Completed".toLowerCase() &&  this.state.basicInfo?.designActivity?.designCompleted == true )||
                                  //   //  ! ( String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Completed".toLowerCase() &&  this.state.basicInfo?.designActivity?.designFailed == true )
                                  //   // !( String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Completed".toLowerCase() &&  this.state.basicInfo?.designActivity?.designWarning == true ) ||
                                  //   this.state.basicInfo?.designActivity?.designStarted == true

                                  // }
                                  disabled={
                                    this.isAllLabSamplesAssignedForProcess() || loading // main
                                    // (this.state.paymentType === 'y' ? this.isAllLabSamplesAssigned() : "") &&
                                    // String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() !== "Completed".toLowerCase() &&
                                    // String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() !== "warning".toLowerCase()
                                    // // String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Failed".toLowerCase() ||
                                    // // String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() !== "Completed".toLowerCase() ||
                                    // // !( String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Completed".toLowerCase() &&  this.state.basicInfo?.designActivity?.designStarted == false )||
                                    // // !( String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Completed".toLowerCase() &&  this.state.basicInfo?.designActivity?.designCompleted == true )||
                                    // //  ! ( String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Completed".toLowerCase() &&  this.state.basicInfo?.designActivity?.designFailed == true )
                                    // // !( String(this.state.basicInfo?.designActivity?.verifyStatus).toLowerCase() == "Completed".toLowerCase() &&  this.state.basicInfo?.designActivity?.designWarning == true ) ||
                                    // // (this.state.basicInfo?.designActivity?.designStarted == true && this.state.basicInfo?.designActivity?.designCompleted == true)
                                  }
                                  // disabled={this.isProcessDataBtnDiseabled()}
                                  onClick={() => {
                                    if (
                                      this.state.basicInfo?.designActivity
                                        ?.designFailed == true ||
                                      this.state.basicInfo?.designActivity
                                        ?.designWarning == true ||
                                      this.state.basicInfo?.designActivity
                                        ?.designCompleted == true
                                    ) {
                                      if (
                                        [1, 2, 3, 4].includes(
                                          diseases?.diseaseCategoryId
                                        )
                                      ) {
                                        this.handleShowDisease(false, true);
                                      } else {
                                        this.updateDataAndRefreshPage(() => {
                                          this.reCallPipeLine(
                                            this.state.basicInfo?.designActivity
                                              ?.designActivityId
                                          );
                                        });
                                      }
                                    } else {
                                      if (
                                        [1, 2, 3, 4].includes(
                                          diseases?.diseaseCategoryId
                                        )
                                      ) {
                                        this.handleShowDisease(true, false);
                                      } else {
                                        this.updateDataAndRefreshPage(() => {
                                          return this.callPipeLine();
                                        });
                                      }
                                    }
                                  }}
                                >
                                  Process Data
                                  {/* <span
                                  style={{
                                    display: this.state.basicInfo?.designActivity?.designFailed == true ? "" : "none",
                                    maxWidth: "12%"

                                  }}
                                >
                                  <img className="ml-2"
                                    src={error_icon} style={{ height: "auto", width: "12%" }} alt="" />
                                </span>
                                <span
                                  style={{
                                    display: this.state.basicInfo?.designActivity?.designCompleted == true ? "" : "none"
                                  }}
                                >
                                  <img className="ml-3"
                                    src={success_icon} style={{ height: "auto", maxWidth: "15%" }} alt="" />
                                </span>
                                <span
                                  style={{
                                    display: this.state.basicInfo?.designActivity?.designWarning == true ? "" : "none"
                                  }}
                                >
                                  <img className="ml-3"
                                    src={warn_icon} style={{ height: "auto", maxWidth: "15%" }} alt="" />
                                </span>
                                {(this.state.basicInfo?.designActivity?.designStarted == true && this.state.basicInfo?.designActivity?.designCompleted == false && this.state.basicInfo?.designActivity?.designWarning == false && this.state.basicInfo?.designActivity?.designFailed == false) ?
                                  <SpinnerRoundOutlined enabled={this.state.basicInfo?.designActivity?.designStarted == true} style={{ height: "auto", width: "15%", color: "#ffa500", marginLeft: "3px" }} сolor="#ffa500" />
                                  : ""
                                } */}
                                  {/* {

                              if (this.state.basicInfo?.designActivity?.designStarted == true && this.state.basicInfo?.designActivity?.designCompleted == false && this.state.basicInfo?.designActivity?.designWarning == false && this.state.basicInfo?.designActivity?.designFailed == false ) {
                                return(
                               <SpinnerRoundOutlined enabled={this.state.basicInfo?.designActivity?.designStarted == true} style={{ height: "auto", width: "15%", color: "#ffa500" }} сolor="#ffa500" />
                              )
                              }

                              } */}
                                  {/* Verify Data */}
                                </button>
                                {/* {
                              (this.state.basicInfo?.designActivity?.designStarted == true && this.state.basicInfo?.designActivity?.designCompleted == true) ? "Data Processed succesfully." : ""

                            } */}
                                {this.state.basicInfo?.designActivity
                                  ?.designStarted == true && this.state.basicInfo?.designActivity?.pipelineStage !== "Verification" ? (
                                  <>  <div
                                    style={{
                                      height: "40px",
                                      position: "absolute",
                                      right: "27px",
                                    }}
                                  >
                                    {pipelineStarted || pipelineQueued ? (
                                      <button
                                        className="btn-success btn"
                                        onClick={() => {
                                          this.refreshPipelineCall();
                                          // this.updateDataAndRefreshPage(this.getData)
                                        }}
                                      >
                                        Refresh
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                    {pipelineStarted ? (
                                      <>
                                        {" "}
                                        <button
                                          className="btn-danger btn ml-2"
                                          // disabled={
                                          //   this?.state?.disabledButton || !this.state
                                          //     .isPipelineStatusRefreshed
                                          // }
                                          onClick={() => {
                                            this.handleShowPiplineStop();
                                          }}
                                        >
                                          Stop
                                        </button>{" "}
                                      </>
                                    ) : (
                                      ""
                                    )}

                                    {pipelineQueued ? (
                                      <>
                                        {" "}
                                        <button
                                          className="btn-danger btn ml-2"
                                          disabled={
                                            this?.state?.disabledButton || !this.state
                                              .isPipelineStatusRefreshed || loading
                                          }
                                          onClick={() => {
                                            this.handleShowPiplineCancle();
                                          }}
                                        // onClick={() => { this.handleShowPiplineStop() }}
                                        >
                                          Cancel
                                        </button>{" "}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  </>
                                ) : (
                                  ""
                                )}
                                {this.state.basicInfo?.designActivity?.pipelineStage !== "Verification" && this.getProcessStatus()}


                                {/* } */}

                                {/* {
                              (this.state.basicInfo?.designActivity?.designFailed || this.state.basicInfo?.designActivity?.designCompleted) &&
                              <button
                                className="btn btn-md btn-primary m-2"
                                // disabled={this.state.basicInfo?.designActivity?.designStarted === true && this.state.basicInfo?.designActivity?.designCompleted === false}
                                // disabled={!this.state.basicInfo?.designActivity?.designStarted && this.state.basicInfo?.designActivity?.designCompleted}
                                disabled={![2, 4, 3].includes(this.state.diseases?.diseaseCategoryId)}
                                onClick={() => {
                                  if (diseases?.diseaseCategory == "Cancer - No Tumor" || diseases?.diseaseCategory == "Cancer With Tumor" || diseases?.parentDiseaseCategory == "Cancer With Tumor") {
                                    this.handleShowDisease(false, true)
                                  }
                                  else {
                                    this.updateDataAndRefreshPage(() => {
                                      return this.reCallPipeLine(this.state.basicInfo?.designActivity?.designActivityId);
                                    })
                                  }
                                }}
                              >
                                Re-run Pipeline
                              </button>

                            } */}
                                {/* {this.state.basicInfo?.designActivity?.designStarted && <p className="p-2 m-2 text-bold" style={{ color: "orange", fontWeight: "bold" }}>Pipeline Running...</p>}
                            {this.state.basicInfo?.designActivity?.designFailed && <p className="p-2 m-2 text-bold" style={{ color: "red", fontWeight: "bold" }}>Pipeline Failed</p>}
                            {this.state.basicInfo?.designActivity?.designCompleted && <p className="p-2 m-2 text-bold" style={{ color: "green", fontWeight: "bold" }}>Pipeline Completed</p>} */}

                                {/* {[2, 4, 3].includes(this.state.diseases?.diseaseCategoryId) && this.getPipeLineStatus()} */}
                                {/* { this.state.basicinfo?.designActivity?.designCompleted=== true ?"Design Completed":
                            <>
                              <button
                                className="btn btn-primary btn-md m-2"
                                disabled={!this.state.basicInfo?.designActivity?.designStarted}
                                onClick={() => {
                                  if (diseases?.diseaseCategory == "Cancer - No Tumor" || diseases?.diseaseCategory == "Cancer With Tumor" || diseases?.parentDiseaseCategory == "Cancer With Tumor") {
                                    this.handleShowDisease(true, false)
                                  }
                                  else {
                                    this.updateDataAndRefreshPage(() => {
                                      return this.callPipeLine();
                                    });
                                  }
                                }}
                              >
                                Run Pipeline
                              </button>
                              <button
                                  className="btn btn-md btn-primary m-2"
                                  disabled={this.state.basicInfo?.designActivity?.designStarted === true && this.state.basicInfo?.designActivity?.designCompleted === false}
                                  // disabled={!this.state.basicInfo?.designActivity?.designStarted && this.state.basicInfo?.designActivity?.designCompleted}
                                  onClick={() => {
                                    if (diseases?.diseaseCategory == "Cancer - No Tumor" || diseases?.diseaseCategory == "Cancer With Tumor" || diseases?.parentDiseaseCategory == "Cancer With Tumor") {
                                      this.handleShowDisease(false, true)
                                    }
                                    else {
                                      this.updateDataAndRefreshPage(() => {
                                        return this.reCallPipeLine(this.state.basicInfo?.designActivity?.designActivityId);
                                      })
                                    }
                                  }}
                                >
                                  Re-run Pipeline
                                </button>
                            </>} */}
                                {/* { <>
                              {true && <> */}

                                {/* </> */}
                                {/* } </>} */}
                              </Row>
                              <Row>
                                {/* [2, 4, 3].includes(this.state.diseases?.diseaseCategoryId) && */}
                                {/* {this.getPipeLineStatus()} */}
                              </Row>
                              <hr />

                              <h5 className="mt-2"> PMR & Final Report</h5>
                            </div>

                            <Row>
                              <Col xs="12">
                                <div className="text-center">
                                  {/* {this.state.basicInfo?.designActivity?.designCompleted && */}
                                  <>
                                    {Array.isArray(
                                      this.state.basicInfo.patientDisease
                                    ) &&
                                      this.state.basicInfo.patientDisease
                                        .length > 0 &&
                                      this.state.basicInfo.patientDisease.map(
                                        (ele) => {
                                          return (
                                            <>
                                              <button
                                                style={{
                                                  display: [
                                                    2, 3, 1, 5,
                                                  ].includes(
                                                    ele.diseaseCategoryId
                                                  )
                                                    ? "inline-block"
                                                    : "none",
                                                }}
                                                // disabled={!(ele.diseaseCategory === "Cancer" || ele.diseaseCategory === "PBIMA-ITI-PES" || ele.diseaseCategory === "With ctDNA & cfDNA testing" || ele.diseaseCategory === "No ctDNA & cfDNA testing" || ele.diseaseCategory === "Cancer - No Tumor") || this.state.basicInfo.patientReports?.patientReport}
                                                disabled={
                                                  [2, 3, 4, 5].includes(
                                                    this.state?.diseases
                                                      ?.diseaseCategoryId
                                                  ) &&
                                                  !this.state.basicInfo
                                                    ?.designActivity
                                                    ?.designCompleted &&
                                                  !this.state.basicInfo
                                                    ?.designActivity
                                                    ?.designWarning || loading
                                                }
                                                // this.state?.basicInfo?.patientReports?.patientReport ||
                                                // disabled={([2, 3, 4].includes(this.state?.diseases?.diseaseCategoryId) && !this.state.basicInfo?.designActivity?.designCompleted)}
                                                onClick={() => {
                                                  // this.props.history.push(`/patientactivity/designactivities/report/${this.state.patientId}/${this.state.PatientAccessionId}/`)

                                                  if (
                                                    (this.state
                                                      ?.diseaseDataId == 0 ||
                                                      this.state
                                                        ?.diseaseDataId ==
                                                      null) &&
                                                    [1, 2, 3].includes(
                                                      this.state?.diseases
                                                        ?.diseaseCategoryId
                                                    )
                                                  ) {
                                                    this.handleShowDisease(
                                                      false,
                                                      false,
                                                      true
                                                    );
                                                  } else {
                                                    this.props.history.push({
                                                      // pathname: `/patientactivity/designactivities/report/${this.state.patientId}/${this.state.PatientAccessionId}/`,
                                                      pathname: `/patients/patientinfo/patientReport/${this.state.patientId}/${this.state.PatientAccessionId}`,

                                                      state: {
                                                        redirectTo: `/patients/info/${this.state.patientId}/${this.state.PatientAccessionId}`,
                                                      },
                                                    });
                                                  }
                                                }}
                                                className="btn btn-success btn-md m-2 "
                                                id={
                                                  [2, 3, 1, 5].includes(
                                                    ele.diseaseCategoryId
                                                  )
                                                    ? "PMRandFinalReportGPR"
                                                    : ""
                                                }
                                              >
                                                Generate Patient Report
                                              </button>

                                              <button
                                                className="btn btn-success btn-md m-2 "
                                                style={{
                                                  display: [6, 11, 12].includes(
                                                    ele.diseaseCategoryId
                                                  )
                                                    ? "inline-block"
                                                    : "none",
                                                }}
                                                // disabled={this.state?.basicInfo?.patientReports?.healthIndexReport || ([2, 3, 4].includes(this.state?.diseases?.diseaseCategoryId) && !this.state.basicInfo?.designActivity?.designCompleted)}
                                                disabled={
                                                  [6, 11, 12].includes(
                                                    this.state?.diseases
                                                      ?.diseaseCategoryId
                                                  ) &&
                                                  !this.state.basicInfo
                                                    ?.designActivity
                                                    ?.designCompleted || loading
                                                }
                                                onClick={() => {
                                                  this.props.history.push({
                                                    pathname: `/patients/patienthealthindexreportdetail/${this.state.patientId}/${this.state.PatientAccessionId}/${this.state.basicInfo?.designActivity?.designActivityId}`,
                                                    state: {
                                                      redirectTo: `/patients/info/${this.state?.patientId}/${this.state?.PatientAccessionId}`,
                                                    },
                                                  });
                                                }}
                                                id={
                                                  ![6, 11, 12].includes(
                                                    ele.diseaseCategoryId
                                                  )
                                                    ? ""
                                                    : "PMRandFinalReportGPreventionR"
                                                }

                                              // disabled={'Prevention' || 'Complete Health Score' || 'HealthIndex'}
                                              >
                                                Generate Prevention Report{" "}
                                              </button>

                                              <button
                                                className="btn btn-success btn-md m-2 "
                                                style={{
                                                  display: [
                                                    7, 8, 9, 10,
                                                  ].includes(
                                                    ele.diseaseCategoryId
                                                  )
                                                    ? "inline-block"
                                                    : "none",
                                                }}
                                                disabled={true}
                                                // disabled={this.state?.basicInfo?.patientReports?.healthIndexReport || ([2, 3, 4].includes(this.state?.diseases?.diseaseCategoryId) && !this.state.basicInfo?.designActivity?.designCompleted)}
                                                // onClick={() => {
                                                //   this.props.history.push({
                                                //     pathname: `/patientactivity/designactivities/patienthealthindexreportdetail/${this.state.patientId}/${this.state.PatientAccessionId}/${this.state.basicInfo?.designActivity?.designActivityId}/`,
                                                //     state: { redirectTo: `/patients/info/${this.state?.patientId}/${this.state?.PatientAccessionId}` }
                                                //   })
                                                // }}
                                                // disabled={'Prevention' || 'Complete Health Score' || 'HealthIndex'}
                                                id={
                                                  [7, 8, 9, 10].includes(
                                                    ele.diseaseCategoryId
                                                  )
                                                    ? "PMRandFinalReportGLongevityR"
                                                    : ""
                                                }
                                              >
                                                Generate Longevity Report{" "}
                                              </button>
                                              <button
                                                // style={{ display: [5, 7, 8, 9, 10].includes(ele.diseaseCategoryId) ? "none" : "inline-block" }}
                                                style={{
                                                  display: [
                                                    7, 8, 9, 10,
                                                  ].includes(
                                                    ele.diseaseCategoryId
                                                  )
                                                    ? "inline-block"
                                                    : "none",
                                                }}
                                                disabled={true}
                                                // disabled={!(ele.diseaseCategory === "Cancer" || ele.diseaseCategory === "PBIMA-ITI-PES" || ele.diseaseCategory === "With ctDNA & cfDNA testing" || ele.diseaseCategory === "No ctDNA & cfDNA testing" || ele.diseaseCategory === "Cancer - No Tumor") || this.state?.basicInfo?.patientReports?.pmrReport}
                                                // disabled={([2, 3, 4].includes(this.state?.diseases?.diseaseCategoryId) && !this.state.basicInfo?.designActivity?.designCompleted && !this.state.basicInfo?.designActivity?.designWarning)}
                                                // this.state?.basicInfo?.patientReports?.pmrReport ||
                                                // disabled={([2, 3, 4].includes(this.state?.diseases?.diseaseCategoryId) && !this.state.basicInfo?.designActivity?.designCompleted)}
                                                className="btn btn-primary btn-md m-2 ml-4"
                                                onClick={() => {
                                                  // this.props.history.push(`/patientactivity/designactivities/pmr/${this.state.patientId}/${this.state.PatientAccessionId}`)
                                                  // if ((this.state?.diseaseDataId == 0 || this.state?.diseaseDataId == null) && [1, 2, 3].includes(this.state?.diseases?.diseaseCategoryId)) {
                                                  //   this.setState({
                                                  //     showdisease: true
                                                  //   })
                                                  // } else {

                                                  this.props.history.push({
                                                    pathname: `/patients/pmr/${this.state.patientId}/${this.state.PatientAccessionId}`,

                                                    state: {
                                                      redirectTo: `/patients/info/${this.state.patientId}/${this.state.PatientAccessionId}`,
                                                    },
                                                  });
                                                  // }
                                                }}
                                                id={
                                                  [7, 8, 9, 10].includes(
                                                    ele.diseaseCategoryId
                                                  )
                                                    ? "PMRandFinalReportGPMR"
                                                    : ""
                                                }

                                              // href={`/patientactivity/designactivities/patienthealthindexreportdetail/${this.state.patientId}/${this.state.PatientAccessionId}/${this.state.basicInfo?.designActivity?.designActivityId}`}
                                              // className="btn btn-seconadry btn-md"
                                              >
                                                {this.state?.basicInfo
                                                  ?.patientReports?.pmrReport
                                                  ? "PMR Report Generated"
                                                  : "Generate PMR Report"}
                                              </button>
                                              <button
                                                // style={{ display: [5, 7, 8, 9, 10].includes(ele.diseaseCategoryId) ? "none" : "inline-block" }}
                                                style={{
                                                  display: [
                                                    7, 8, 9, 10,
                                                  ].includes(
                                                    ele.diseaseCategoryId
                                                  )
                                                    ? "none"
                                                    : "inline-block",
                                                }}
                                                // style={{ display: [5].includes(ele.diseaseCategoryId) ? "none" : "inline-block" }}
                                                // disabled={!(ele.diseaseCategory === "Cancer" || ele.diseaseCategory === "PBIMA-ITI-PES" || ele.diseaseCategory === "With ctDNA & cfDNA testing" || ele.diseaseCategory === "No ctDNA & cfDNA testing" || ele.diseaseCategory === "Cancer - No Tumor") || this.state?.basicInfo?.patientReports?.pmrReport}
                                                disabled={
                                                  [2, 3, 4, 5].includes(
                                                    this.state?.diseases
                                                      ?.diseaseCategoryId
                                                  ) &&
                                                  !this.state.basicInfo
                                                    ?.designActivity
                                                    ?.designCompleted &&
                                                  !this.state.basicInfo
                                                    ?.designActivity
                                                    ?.designWarning || loading
                                                }
                                                // this.state?.basicInfo?.patientReports?.pmrReport ||
                                                // disabled={([2, 3, 4].includes(this.state?.diseases?.diseaseCategoryId) && !this.state.basicInfo?.designActivity?.designCompleted)}
                                                className="btn btn-primary btn-md m-2 ml-4"
                                                onClick={() => {
                                                  // this.props.history.push(`/patientactivity/designactivities/pmr/${this.state.patientId}/${this.state.PatientAccessionId}`)
                                                  // if ((this.state?.diseaseDataId == 0 || this.state?.diseaseDataId == null) && [1, 2, 3].includes(this.state?.diseases?.diseaseCategoryId)) {
                                                  //   this.setState({
                                                  //     showdisease: true
                                                  //   })
                                                  // } else {

                                                  this.props.history.push({
                                                    // pathname: `/patientactivity/designactivities/pmr/${this.state.patientId}/${this.state.PatientAccessionId}`,
                                                    pathname: `/patients/pmr/${this.state.patientId}/${this.state.PatientAccessionId}`,

                                                    state: {
                                                      redirectTo: `/patients/info/${this.state.patientId}/${this.state.PatientAccessionId}`,
                                                    },
                                                  });
                                                  // }
                                                }}
                                                // href={`/patientactivity/designactivities/patienthealthindexreportdetail/${this.state.patientId}/${this.state.PatientAccessionId}/${this.state.basicInfo?.designActivity?.designActivityId}`}
                                                // className="btn btn-seconadry btn-md"
                                                id={
                                                  ![7, 8, 9, 10].includes(
                                                    ele.diseaseCategoryId
                                                  )
                                                    ? "PMRandFinalReportGPMR"
                                                    : ""
                                                }
                                              >
                                                {this.state?.basicInfo
                                                  ?.patientReports?.pmrReport
                                                  ? "PMR Report Generated"
                                                  : "Generate PMR Report"}
                                              </button>
                                              {true && (
                                                <button
                                                  className="btn btn-success btn-md m-2 "
                                                  // style={{ display: 6 == ele.diseaseCategoryId ? "inline-block" : "none" }}
                                                  // disabled={([6].includes(this.state?.diseases?.diseaseCategoryId) && !this.state.basicInfo?.designActivity?.designCompleted)}
                                                  onClick={this.admeToxSaveData.bind(
                                                    this
                                                  )}
                                                  disabled={
                                                    !this.state.basicInfo
                                                      ?.designActivity
                                                      ?.designCompleted &&
                                                    !this.state.basicInfo
                                                      ?.designActivity
                                                      ?.designWarning || loading
                                                  }
                                                  // disabled={'Prevention' || 'Complete Health Score' || 'HealthIndex'}
                                                  id="PMRandFinalReportGAToxR"
                                                >
                                                  Generate ADME-Tox Report{" "}
                                                </button>
                                              )}

                                              {/* <button
                                        className="btn btn-primary btn-md m-2"
                                        disabled={!(ele.diseaseCategory === "Complete Health Score" || ele.diseaseCategory === "HealthIndex")}
                                      >
                                        Generate Report
                                      </button> */}
                                            </>
                                          );
                                        }
                                      )}
                                  </>
                                </div>
                                <div className="mx-5">
                                  <center>
                                    <table
                                      className="table table-borderless "
                                      style={{ width: "60%" }}
                                    >
                                      {/* <thead>
                                <tr>
                                  <th scope="col"></th>
                                  <th scope="col">First</th>
                                  <th scope="col">Last</th>
                                  <th scope="col">Handle</th>
                                </tr>
                              </thead> */}
                                      {/* {console.log("srat", this.state.basicInfo)} */}
                                      <tbody className="m-2">
                                        {this.state.basicInfo?.patientReports
                                          ?.patientReport && (
                                            <tr className="px-2 d-flex justify-content-between  align-items-center ">
                                              {/* <th scope="row"><i class="cil-document"></i>NB2100000_ITI_PES_Final_Report</th> */}
                                              <td
                                                className="w-50"
                                                style={{
                                                  verticalAlign: "inherit",
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <i
                                                  className="fa fa-file-pdf-o"
                                                  style={{ margin: "5px" }}
                                                ></i>
                                                {this.getReportName(
                                                  "patientReport"
                                                )}
                                                {/* {this.state.basicInfo?.patientReports?.patientReport ? this.state.basicInfo?.patientReports?.patientReport.} */}
                                              </td>
                                              {/* <td>Chrome HTML Document</td> */}
                                              <td className="pr-4 ">
                                                <button
                                                  className="btn btn-success float-right"
                                                  data-toggle="tooltip"
                                                  data-html="true"
                                                  data-placement="right"
                                                  title="View Patient Report"
                                                  onClick={() => {
                                                    this.previewPdfToggle(
                                                      this.state.basicInfo
                                                        .patientReports
                                                        ?.patientReport
                                                    );
                                                  }}
                                                >
                                                  <i
                                                    className="fa fa-eye text-light opacity-50"
                                                    aria-hidden="true"
                                                  ></i>
                                                  <span></span>
                                                </button>
                                              </td>
                                            </tr>
                                          )}

                                        {this.state.basicInfo?.patientReports
                                          ?.pmrReport && (
                                            <tr className="px-2 d-flex justify-content-between align-items-center ">
                                              {/* <th scope="row"><i class="cil-document"></i>NB2100000_ITI_PES_Final_Report</th> */}
                                              <td
                                                style={{
                                                  verticalAlign: "inherit",
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <i
                                                  className="fa fa-file-pdf-o"
                                                  style={{ margin: "5px" }}
                                                ></i>
                                                <div className="">
                                                  {this.getReportName(
                                                    "pmrReport"
                                                  )}
                                                </div>
                                              </td>
                                              {/* <td>Chrome HTML Document</td> */}
                                              <td className="pr-4">
                                                <button
                                                  className="btn btn-success float-right "
                                                  data-toggle="tooltip"
                                                  data-html="true"
                                                  data-placement="right"
                                                  title="View PMR Report"
                                                  onClick={() => {
                                                    this.previewPdfToggle(
                                                      this.state.basicInfo
                                                        .patientReports.pmrReport
                                                    );
                                                  }}
                                                >
                                                  {" "}
                                                  <i
                                                    className="fa fa-eye text-light opacity-50"
                                                    aria-hidden="true"
                                                  ></i>
                                                  <span></span>
                                                </button>
                                              </td>
                                              -
                                            </tr>
                                          )}
                                        {this.state.basicInfo?.patientReports
                                          ?.healthIndexReport && (
                                            <tr className="px-2 d-flex justify-content-between align-items-center ">
                                              {/* <th scope="row"><i class="cil-document"></i>NB2100000_ITI_PES_Final_Report</th> */}
                                              <td
                                                style={{
                                                  verticalAlign: "inherit",
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <i
                                                  className="fa fa-file-pdf-o mr-2"
                                                  style={{ margin: "5px" }}
                                                ></i>{" "}
                                                {this.getReportName(
                                                  "healthIndexReport"
                                                )}
                                              </td>
                                              {/* <td>Chrome HTML Document</td> */}
                                              <td className="pr-4">
                                                <button
                                                  className="btn btn-success float-right "
                                                  data-toggle="tooltip"
                                                  data-html="true"
                                                  data-placement="right"
                                                  title="View Health Index Report"
                                                  onClick={() => {
                                                    this.previewPdfToggle(
                                                      this.state.basicInfo
                                                        .patientReports
                                                        .healthIndexReport
                                                    );
                                                  }}
                                                >
                                                  <i
                                                    className="fa fa-eye text-light opacity-50"
                                                    aria-hidden="true"
                                                  ></i>
                                                  <span></span>
                                                </button>
                                              </td>
                                            </tr>
                                          )}
                                      </tbody>
                                    </table>
                                  </center>
                                </div>
                                {/* <div className="text-center">
                                <button className="btn btn-primary btn-md mr-2"
                                  disabled={!(this.state?.basicInfo?.patientReports?.pmrReport) || this.state.basicInfo?.patientReports?.isPMRVerified}
                                  onClick={
                                    () => {
                                      this.setState({ showPmrVerify: !this.state?.showPmrVerify })
                                    }

                                  }

                                //this.state.basicInfo?.patientReports?.isPMRVerified || !this.state.basicInfo.patientReports?.patientReport

                                >{this.state.basicInfo?.patientReports?.isPMRVerified ? "PMR Verified" : "Verify PMR"}</button>

                                <button className="btn btn-success btn-md"
                                  // disabled={this.state.basicInfo?.patientReports?.isPMRApproved || !this.state?.basicInfo?.patientReports?.pmrReport}
                                  disabled={!(this.state.basicInfo?.patientReports?.isPMRVerified) || this.state.basicInfo?.patientReports?.isPMRApproved}
                                  onClick={
                                    () => {
                                      this.setState({ showPmrApprove: !this.state?.showPmrApprove })
                                    }
                                  }
                                >{this.state.basicInfo?.patientReports?.isPMRApproved ? "PMR Approved" : "Approve PMR"}</button>
                              </div> */}
                              </Col>
                              {[2, 3, 1, 5].includes(
                                this.state?.diseases?.diseaseCategoryId
                              ) ? (
                                <Col xs="12">
                                  <table className="table table-bordered  ">
                                    <thead
                                      style={{
                                        color: "#fff",
                                        border: "1px solid #FFF",
                                      }}
                                    >
                                      <tr
                                        style={{ backgroundColor: "#1C3A84" }}
                                      >
                                        <th className="border-0" colspan="3">
                                          <div
                                            className="d-flex"
                                            style={{
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span> Final Report(s) </span>
                                            <button
                                              className=" btn btn-secondary "
                                              // disabled={!this.state.basicInfo?.designActivity?.designCompleted}
                                              style={{ fontWeight: "700" }}
                                              onClick={() => {
                                                this.handleShowUploadFile(
                                                  "Patient Report",
                                                  1
                                                );
                                              }}
                                            >
                                              Upload{" "}
                                            </button>
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <table className="table table-bordered ">
                                            <thead>
                                              <tr
                                                className="text-center"
                                                style={{
                                                  // backgroundColor: "#5e75ae",
                                                  backgroundColor: "#e4e7ea",
                                                  color: "black",
                                                }}
                                              >
                                                <th>File</th>
                                                {/* <th>
                                                Version
                                              </th> */}

                                                <th>Action</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {Array.isArray(
                                                this.state.patientReports
                                              ) &&
                                                this.state.patientReports
                                                  ?.length > 0 ? (
                                                this.state.patientReports.map(
                                                  (e, i) => {
                                                    return (
                                                      <tr>
                                                        <td
                                                          className="w-50"
                                                          style={{
                                                            verticalAlign:
                                                              "inherit",
                                                            alignItems:
                                                              "center",
                                                          }}
                                                        >
                                                          <i
                                                            className="fa fa-file-pdf-o"
                                                            style={{
                                                              margin: "5px",
                                                              color: "#f64846",
                                                            }}
                                                          ></i>
                                                          {/* {e.patientReport.slice(e.patientReport.lastIndexOf("/"), e.patientReport.length )} */}

                                                          {this.state
                                                            .renamePdf ===
                                                            "pr" + i ? (
                                                            <div
                                                              style={{
                                                                float: "right",
                                                                width: "92%",
                                                                position:
                                                                  "relative",
                                                                textAlign:
                                                                  "center",
                                                              }}
                                                            >
                                                              <Input
                                                                type="text"
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  this.handlePdfNameChange(
                                                                    e
                                                                  );
                                                                }}
                                                                value={
                                                                  this.state
                                                                    ?.filePdfname
                                                                }
                                                              />
                                                              <i
                                                                style={{
                                                                  position:
                                                                    "absolute",
                                                                  right: "9px",
                                                                  top: "11px",
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                                onClick={() => {
                                                                  this.setState(
                                                                    {
                                                                      renamePdf:
                                                                        "",
                                                                      filePdfname:
                                                                        "",
                                                                    }
                                                                  );
                                                                }}
                                                                class="fa fa-close"
                                                              ></i>
                                                              <button
                                                                className="btn btn-success mt-1"
                                                                onClick={(
                                                                  event
                                                                ) =>
                                                                  this.RenameFun(
                                                                    event,
                                                                    e.id,
                                                                    1
                                                                  )
                                                                }
                                                              >
                                                                Submit
                                                                <i
                                                                  style={{
                                                                    color:
                                                                      "#fff",
                                                                    marginLeft:
                                                                      "3px",
                                                                  }}
                                                                  class="fa fa-check"
                                                                ></i>
                                                              </button>
                                                            </div>
                                                          ) : (
                                                            <span
                                                              id="PMRandFinalReportPatientFileName"
                                                              onDoubleClick={() => {
                                                                this.setState({
                                                                  renamePdf:
                                                                    "pr" + i,
                                                                  filePdfname:
                                                                    this.spliceFromSash(
                                                                      e.patientReport
                                                                    ).replace(
                                                                      ".pdf",
                                                                      ""
                                                                    ),
                                                                });
                                                              }}
                                                            >
                                                              {this.spliceFromSash(
                                                                e.patientReport
                                                              )}
                                                            </span>
                                                          )}
                                                          {/* <span onDoubleClick={() => { this.setState({ renamePdf: !this.state.renamePdf }) }}>{this.spliceFromSash(e.patientReport)}</span> */}

                                                          {/* {console.log(this.state.renamePdf)} */}
                                                          {/* NB2100013P01_Report_060120230507.pdf */}
                                                        </td>
                                                        {/* <td>{e.pmrCurrentVersion}</td> */}
                                                        <td>
                                                          {" "}
                                                          <button
                                                            type="btn"
                                                            className="btn  btn-success btn-pill"
                                                            onClick={() =>
                                                              this.previewPdfToggle_api(
                                                                e.id,
                                                                1
                                                              )
                                                            }
                                                          >
                                                            View
                                                          </button>{" "}
                                                          <button
                                                            type="btn"
                                                            className="btn  btn-danger btn-pill"
                                                            onClick={() => {
                                                              this.handleShowDeleteFile(
                                                                e.id
                                                              );
                                                            }}
                                                          >
                                                            Delete
                                                          </button>
                                                          <button
                                                            type="btn"
                                                            id=""
                                                            className="btn  btn-success btn-pill ml-2"
                                                            onClick={() => {
                                                              this.handleShowFREmailModal(
                                                                e, 1
                                                              );
                                                            }}
                                                          >
                                                            E-Mail
                                                          </button>
                                                        </td>
                                                      </tr>
                                                    );
                                                  }
                                                )
                                              ) : (
                                                <tr>
                                                  <td
                                                    colspan="3"
                                                    className="text-center"
                                                  >
                                                    Generated reports will be
                                                    displayed here.
                                                  </td>
                                                </tr>
                                              )}
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>

                                      {/* <tr>
                                      <td className="w-50" style={{ verticalAlign: "inherit", alignItems: "center" }}>
                                        <i className="fa fa-file-pdf-o" style={{ margin: "5px" }}></i> NB2100013P01_Report_060120230507.pdf
                                      </td>
                                      <td>2.0</td>
                                      <td> <button type="btn" className="btn  btn-danger btn-pill">Delete</button> <button type="btn" className="btn  btn-success btn-pill">View</button></td>
                                    </tr> */}
                                    </tbody>
                                  </table>
                                </Col>
                              ) : (
                                ""
                              )}
                              {[6, 11, 12].includes(
                                this.state?.diseases?.diseaseCategoryId
                              ) ? (
                                <Col xs="12">
                                  <table className="table table-bordered  ">
                                    <thead
                                      style={{
                                        color: "#fff",
                                        border: "1px solid #FFF",
                                      }}
                                    >
                                      <tr
                                        style={{ backgroundColor: "#1C3A84" }}
                                      >
                                        <th className="border-0" colspan="3">
                                          <div
                                            className="d-flex"
                                            style={{
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span> Prevention Report(s) </span>
                                            <button
                                              className=" btn btn-secondary "
                                              //  disabled={!this.state.basicInfo?.designActivity?.designCompleted}
                                              style={{ fontWeight: "700" }}
                                              onClick={() => {
                                                this.handleShowUploadFile(
                                                  "Healthindex Report",
                                                  3
                                                );
                                              }}
                                            >
                                              Upload{" "}
                                            </button>
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <table className="table table-bordered">
                                            <thead className="table table-bordered">
                                              <tr
                                                className="text-center"
                                                style={{
                                                  // backgroundColor: "#5e75ae",
                                                  backgroundColor: "#e4e7ea",
                                                  color: "black",
                                                }}
                                              >
                                                <th>File</th>
                                                {/* <th>
                                                Version
                                              </th> */}

                                                <th>Action</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {Array.isArray(
                                                this.state.patientHIReports
                                              ) &&
                                                this.state.patientHIReports
                                                  ?.length > 0 ? (
                                                this.state.patientHIReports.map(
                                                  (e, i) => {
                                                    // console.log(e);
                                                    return (
                                                      <tr>
                                                        <td
                                                          className="w-50"
                                                          style={{
                                                            verticalAlign:
                                                              "inherit",
                                                            alignItems:
                                                              "center",
                                                          }}
                                                        >
                                                          <i
                                                            className="fa fa-file-pdf-o"
                                                            style={{
                                                              margin: "5px",
                                                              color: "#f64846",
                                                            }}
                                                          ></i>
                                                          {/* {e.pmrReport} */}
                                                          {this.state
                                                            .renamePdf ===
                                                            "pvr" + i ? (
                                                            <div
                                                              style={{
                                                                float: "right",
                                                                width: "92%",
                                                                position:
                                                                  "relative",
                                                                textAlign:
                                                                  "center",
                                                              }}
                                                            >
                                                              <Input
                                                                type="text"
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  this.handlePdfNameChange(
                                                                    e
                                                                  );
                                                                }}
                                                                value={
                                                                  this.state
                                                                    ?.filePdfname
                                                                }
                                                              />
                                                              <i
                                                                style={{
                                                                  position:
                                                                    "absolute",
                                                                  right: "9px",
                                                                  top: "11px",
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                                onClick={() => {
                                                                  this.setState(
                                                                    {
                                                                      renamePdf:
                                                                        "",
                                                                      filePdfname:
                                                                        "",
                                                                    }
                                                                  );
                                                                }}
                                                                class="fa fa-close"
                                                              ></i>
                                                              <button
                                                                className="btn btn-success mt-1"
                                                                onClick={(
                                                                  event
                                                                ) =>
                                                                  this.RenameFun(
                                                                    event,
                                                                    e.id,
                                                                    3
                                                                  )
                                                                }
                                                              >
                                                                Submit
                                                                <i
                                                                  style={{
                                                                    color:
                                                                      "#fff",
                                                                    marginLeft:
                                                                      "3px",
                                                                  }}
                                                                  class="fa fa-check"
                                                                ></i>
                                                              </button>
                                                            </div>
                                                          ) : (
                                                            <span
                                                              id="PMRandFinalReportPreventionFileName"
                                                              onDoubleClick={() => {
                                                                this.setState({
                                                                  renamePdf:
                                                                    "pvr" + i,
                                                                  filePdfname:
                                                                    this.spliceFromSash(
                                                                      e.healthIndexReport
                                                                    ).replace(
                                                                      ".pdf",
                                                                      ""
                                                                    ),
                                                                });
                                                              }}
                                                            >
                                                              {this.spliceFromSash(
                                                                e.healthIndexReport
                                                              )}
                                                            </span>
                                                          )}

                                                          {/* {this.spliceFromSash(e.healthIndexReport)} */}
                                                        </td>
                                                        {/* <td>{e.pmrCurrentVersion}</td> */}
                                                        {/* <td><button type="btn" className="btn  btn-primary btn-pill">Approve</button> <button type="btn" className="btn  btn-success btn-pill">Verify</button> </td> */}

                                                        <td
                                                          style={{
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            justifyContent:
                                                              "center",
                                                            gap: "10px",
                                                          }}
                                                        >
                                                          <button
                                                            type="btn"
                                                            className="btn  btn-success btn-pill"
                                                            onClick={() =>
                                                              this.previewPdfToggle_api(
                                                                e.id,
                                                                3
                                                              )
                                                            }
                                                          >
                                                            View
                                                          </button>
                                                          <button
                                                            type="btn"
                                                            className="btn  btn-danger  btn-pill"
                                                            onClick={() => {
                                                              this.handleShowDeleteFile(
                                                                e.id
                                                              );
                                                            }}
                                                          >
                                                            Delete
                                                          </button>
                                                          <button
                                                            type="btn"
                                                            id=""
                                                            className="btn  btn-success btn-pill ml-2"
                                                            onClick={() => {
                                                              this.handleShowFREmailModal(
                                                                e, 3
                                                              );
                                                            }}
                                                          >
                                                            E-Mail
                                                          </button>
                                                          {/* <button type="btn" disabled={e.isPMRVerified} className="btn  btn-secondary btn-pill">{e.isPMRVerified ? "Verified" : "Verify"}</button>
                                            <button type="btn" disabled={e.isPMRApproved} className="btn  btn-primary btn-pill">{e.isPMRApproved ? "Approved" : "Approve"}</button> */}
                                                        </td>
                                                      </tr>
                                                    );
                                                  }
                                                )
                                              ) : (
                                                <tr>
                                                  <td
                                                    colspan="3"
                                                    className="text-center"
                                                  >
                                                    Generated reports will be
                                                    displayed here.
                                                  </td>
                                                </tr>
                                              )}
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                      {/* {this.state.patientHIReports?.length > 0 ?
                                      <tr>
                                        <td className="w-50" style={{ verticalAlign: "inherit", alignItems: "center" }}>
                                          <i className="fa fa-file-pdf-o" style={{ margin: "5px", color: "#f64846" }}></i> NB2100013P01_Report_060120230507.pdf
                                        </td>
                                        <td>2.0</td>
                                        <td> <button type="btn" className="btn  btn-success btn-pill">View</button> <button type="btn" className="btn  btn-danger btn-pill" onClick={() => { this.handleShowDeleteFile() }}>Delete</button> </td>
                                      </tr> : <tr><td colspan="3" className="text-center">Geneated Reports Will be displayed here.</td></tr>} */}
                                    </tbody>
                                  </table>
                                </Col>
                              ) : (
                                ""
                              )}
                              {[7, 8, 9, 10].includes(
                                this.state?.diseases?.diseaseCategoryId
                              ) ? (
                                <Col xs="12">
                                  <table className="table table-bordered  ">
                                    <thead
                                      style={{
                                        color: "#fff",
                                        border: "1px solid #FFF",
                                      }}
                                    >
                                      <tr
                                        style={{ backgroundColor: "#1C3A84" }}
                                      >
                                        <th className="border-0" colspan="3">
                                          <div
                                            className="d-flex"
                                            style={{
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span> Longevity Report(s) </span>
                                            <button
                                              className=" btn btn-secondary "
                                              // disabled={!this.state.basicInfo?.designActivity?.designCompleted}
                                              style={{ fontWeight: "700" }}
                                              onClick={() => {
                                                this.handleShowUploadFile(
                                                  "Patient Report",
                                                  1
                                                );
                                              }}
                                            >
                                              Upload{" "}
                                            </button>
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <table className="table table-bordered">
                                            <thead>
                                              <tr
                                                className="text-center"
                                                style={{
                                                  // backgroundColor: "#5e75ae",
                                                  backgroundColor: "#e4e7ea",
                                                  color: "black",
                                                }}
                                              >
                                                <th>File</th>
                                                {/* <th>
                                                Version
                                              </th> */}

                                                <th>Action</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {Array.isArray(
                                                this.state.patientReports
                                              ) &&
                                                this.state.patientReports
                                                  ?.length > 0 ? (
                                                this.state.patientReports.map(
                                                  (e, i) => {
                                                    return (
                                                      <tr>
                                                        <td
                                                          className="w-50"
                                                          style={{
                                                            verticalAlign:
                                                              "inherit",
                                                            alignItems:
                                                              "center",
                                                          }}
                                                        >
                                                          <i
                                                            className="fa fa-file-pdf-o"
                                                            style={{
                                                              margin: "5px",
                                                              color: "#f64846",
                                                            }}
                                                          ></i>
                                                          {/* {e.patientReport.slice(e.patientReport.lastIndexOf("/"), e.patientReport.length )} */}
                                                          {this.state
                                                            .renamePdf ===
                                                            "lr" + i ? (
                                                            <div
                                                              style={{
                                                                float: "right",
                                                                width: "92%",
                                                                position:
                                                                  "relative",
                                                                textAlign:
                                                                  "center",
                                                              }}
                                                            >
                                                              <Input
                                                                type="text"
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  this.handlePdfNameChange(
                                                                    e
                                                                  );
                                                                }}
                                                                value={
                                                                  this.state
                                                                    ?.filePdfname
                                                                }
                                                              />
                                                              <i
                                                                style={{
                                                                  position:
                                                                    "absolute",
                                                                  right: "9px",
                                                                  top: "11px",
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                                onClick={() => {
                                                                  this.setState(
                                                                    {
                                                                      renamePdf:
                                                                        "",
                                                                    }
                                                                  );
                                                                }}
                                                                class="fa fa-close"
                                                              ></i>
                                                              <button
                                                                className="btn btn-success mt-1"
                                                                onClick={(
                                                                  event
                                                                ) =>
                                                                  this.RenameFun(
                                                                    event,
                                                                    e.id,
                                                                    1
                                                                  )
                                                                }
                                                              >
                                                                Submit
                                                                <i
                                                                  style={{
                                                                    color:
                                                                      "#fff",
                                                                    marginLeft:
                                                                      "3px",
                                                                  }}
                                                                  class="fa fa-check"
                                                                ></i>
                                                              </button>
                                                            </div>
                                                          ) : (
                                                            <span
                                                              id="PMRandFinalReportLongevityFileName"
                                                              onDoubleClick={() => {
                                                                this.setState({
                                                                  renamePdf:
                                                                    "lr" + i,
                                                                  filePdfname:
                                                                    this.spliceFromSash(
                                                                      e.patientReport
                                                                    ).replace(
                                                                      ".pdf",
                                                                      ""
                                                                    ),
                                                                });
                                                              }}
                                                            >
                                                              {this.spliceFromSash(
                                                                e.patientReport
                                                              )}
                                                            </span>
                                                          )}

                                                          {/* {this.spliceFromSash(e.patientReport)} */}
                                                          {/* NB2100013P01_Report_060120230507.pdf */}
                                                        </td>
                                                        {/* <td>{e.pmrCurrentVersion}</td> */}
                                                        <td>
                                                          {" "}
                                                          <button
                                                            type="btn"
                                                            className="btn  btn-success btn-pill"
                                                            onClick={() =>
                                                              this.previewPdfToggle(
                                                                e.patientReport
                                                              )
                                                            }
                                                          >
                                                            View
                                                          </button>{" "}
                                                          <button
                                                            type="btn"
                                                            className="btn  btn-danger btn-pill"
                                                            onClick={() => {
                                                              this.handleShowDeleteFile(
                                                                e.id
                                                              );
                                                            }}
                                                          >
                                                            Delete
                                                          </button>

                                                        </td>
                                                      </tr>
                                                    );
                                                  }
                                                )
                                              ) : (
                                                <tr>
                                                  <td
                                                    colspan="3"
                                                    className="text-center"
                                                  >
                                                    Generated reports will be
                                                    displayed here.
                                                  </td>
                                                </tr>
                                              )}
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>

                                      {/* <tr>
                                      <td className="w-50" style={{ verticalAlign: "inherit", alignItems: "center" }}>
                                        <i className="fa fa-file-pdf-o" style={{ margin: "5px" }}></i> NB2100013P01_Report_060120230507.pdf
                                      </td>
                                      <td>2.0</td>
                                      <td> <button type="btn" className="btn  btn-danger btn-pill">Delete</button> <button type="btn" className="btn  btn-success btn-pill">View</button></td>
                                    </tr> */}
                                    </tbody>
                                  </table>
                                </Col>
                              ) : (
                                ""
                              )}

                              {/* {[5, 7, 8, 9, 10].includes(this.state?.diseases?.diseaseCategoryId) ? "" : */}
                              {false ? (
                                ""
                              ) : (
                                <Col xs="12">
                                  <table className="table table-bordered  ">
                                    <thead
                                      style={{
                                        color: "#fff",
                                        border: "1px solid #FFF",
                                      }}
                                    >
                                      <tr
                                        className="text-center"
                                        style={{ backgroundColor: "#1C3A84" }}
                                      >
                                        <th className="border-0" colspan="4">
                                          <div
                                            className="d-flex"
                                            style={{
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span> PMR </span>
                                            <button
                                              className="btn btn-secondary "
                                              id="PMRandFinalReportPMRUpload"
                                              // disabled={!this.state.basicInfo?.designActivity?.designCompleted}
                                              style={{ fontWeight: "700" }}
                                              onClick={() => {
                                                this.handleShowUploadFile(
                                                  "PMR Report",
                                                  2
                                                );
                                              }}
                                            >
                                              Upload{" "}
                                            </button>
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <table className="table table-bordered">
                                            <thead>
                                              <tr
                                                className="text-center"
                                                style={{
                                                  // backgroundColor: "#5e75ae",
                                                  backgroundColor: "#e4e7ea",
                                                  color: "black",
                                                }}
                                              >
                                                <th>File</th>
                                                {/* <th>
                                                Version
                                              </th> */}
                                                {/* <th>
                                      Approve and Verify
                                    </th> */}
                                                <th>Action</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {Array.isArray(
                                                this.state.patientPMRReports
                                              ) &&
                                                this.state.patientPMRReports
                                                  ?.length > 0 ? (
                                                this.state.patientPMRReports.map(
                                                  (e, i) => {
                                                    // console.log(e)
                                                    return (
                                                      <tr>
                                                        <td
                                                          className="w-50"
                                                          style={{
                                                            verticalAlign:
                                                              "inherit",
                                                            alignItems:
                                                              "center",
                                                          }}
                                                        >
                                                          <i
                                                            className="fa fa-file-pdf-o"
                                                            style={{
                                                              margin: "5px",
                                                              color: "#f64846",
                                                            }}
                                                          ></i>
                                                          {/* {e.pmrReport} */}

                                                          {this.state
                                                            .renamePdf ===
                                                            "pmr" + i ? (
                                                            <div
                                                              style={{
                                                                float: "right",
                                                                width: "92%",
                                                                position:
                                                                  "relative",
                                                                textAlign:
                                                                  "center",
                                                              }}
                                                            >
                                                              <Input
                                                                type="text"
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  this.handlePdfNameChange(
                                                                    e
                                                                  );
                                                                }}
                                                                value={
                                                                  this.state
                                                                    ?.filePdfname
                                                                }
                                                              />

                                                              <i
                                                                style={{
                                                                  position:
                                                                    "absolute",
                                                                  right: "9px",
                                                                  top: "11px",
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                                onClick={() => {
                                                                  this.setState(
                                                                    {
                                                                      renamePdf:
                                                                        "",
                                                                      filePdfname:
                                                                        "",
                                                                    }
                                                                  );
                                                                }}
                                                                class="fa fa-close"
                                                              ></i>
                                                              <button
                                                                className="btn btn-success mt-1"
                                                                onClick={(
                                                                  event
                                                                ) =>
                                                                  this.RenameFun(
                                                                    event,
                                                                    e.id,
                                                                    2
                                                                  )
                                                                }
                                                              >
                                                                Submit
                                                                <i
                                                                  style={{
                                                                    color:
                                                                      "#fff",
                                                                    marginLeft:
                                                                      "3px",
                                                                  }}
                                                                  class="fa fa-check"
                                                                ></i>
                                                              </button>

                                                            </div>
                                                          ) : (
                                                            <span
                                                              id="PMRandFinalReportPMRFileName"
                                                              onDoubleClick={() => {
                                                                this.setState({
                                                                  renamePdf:
                                                                    "pmr" + i,
                                                                  filePdfname:
                                                                    this.spliceFromSash(
                                                                      e.pmrReport
                                                                    ).replace(
                                                                      ".pdf",
                                                                      ""
                                                                    ),
                                                                });
                                                              }}
                                                            >
                                                              {this.spliceFromSash(
                                                                e.pmrReport
                                                              )}
                                                              <ReactTooltip
                                                                anchorId={
                                                                  String(e?.id)
                                                                }
                                                                place="top"
                                                                variant="error"
                                                                content={
                                                                  ReactHtmlParser("<h5>PMR Rejected</h5>" + e?.pmrRejectReason)
                                                                }
                                                              />
                                                              <span style={{ color: "red", fontSize: "1.5vmax", display: e?.pmrRejectReason ? "" : "none", marginLeft: "3vmax" }} >
                                                                <BiError id={String(e?.id)} /></span>

                                                            </span>

                                                          )}

                                                          {/* {this.spliceFromSash(e.pmrReport)} */}
                                                        </td>
                                                        {/* <td>{e.pmrCurrentVersion}</td> */}
                                                        {/* <td><button type="btn" className="btn  btn-primary btn-pill">Approve</button> <button type="btn" className="btn  btn-success btn-pill">Verify</button> </td> */}

                                                        {/* <td style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "10px" }}>
                                                    <button type="btn" className="btn  btn-success btn-pill" onClick={() => this.previewPdfToggle_api(e.id, 2)}>View</button>
                                                    <button type="btn" className="btn  btn-danger  btn-pill" onClick={() => { this.handleShowDeleteFile(e.id) }} >Delete</button>
                                                    <button type="btn" disabled={e.isPMRVerified} style={{ fontWeight: "700" }} className="btn  btn-secondary btn-pill" onClick={() => { this.setState({ showPmrVerify: !this.state?.showPmrVerify, notes: e.notes || "<p>aaa<p/>", version: e.pmrCurrentVersion, verifyPmrPath: e.pmrReport, verifyId: e.id, PMRINDEX: i }) }}>{e.isPMRVerified ? "Verified" : "Verify"}</button>
                                                    <button type="btn" disabled={e.isPMRApproved} style={{ fontWeight: "700" }} className="btn  btn-primary btn-pill" onClick={() => { this.setState({ showPmrApprove: !this.state?.showPmrApprove, version: e.pmrCurrentVersion, verifyPmrPath: e.pmrReport, verifyId: e.id }) }}>{e.isPMRApproved ? "Approved" : "Approve"}</button>
                                                  </td> */}
                                                        <td
                                                          style={{
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            justifyContent:
                                                              "start",
                                                            gap: "10px",
                                                          }}
                                                        >
                                                          <button
                                                            type="btn"
                                                            id="PMRandFinalReportPMRFileView"
                                                            className="btn  btn-success btn-pill"
                                                            onClick={() =>
                                                              this.previewPdfToggle_api(
                                                                e.id,
                                                                2
                                                              )
                                                            }
                                                          >
                                                            View
                                                          </button>
                                                          {!e.pmrRejectReason && <button
                                                            type="btn"
                                                            id="PMRandFinalReportPMRFileDelete"
                                                            className="btn  btn-danger  btn-pill"
                                                            onClick={() => {
                                                              this.handleShowDeleteFile(
                                                                e.id
                                                              );
                                                            }}
                                                          >
                                                            Delete
                                                          </button>}
                                                          {!e.pmrRejectReason && <button
                                                            type="btn"
                                                            id="PMRandFinalReportPMRFileVerify"
                                                            disabled={
                                                              e.isPMRVerified
                                                              || !["sultankhan@neo7bioscience.com", "shams.sultankhan@neo7bioscience.com", "shams.sultankhan@gmail.com"].includes(this.state.PMRapprovelRight)
                                                            }
                                                            style={{
                                                              fontWeight: "700",
                                                            }}
                                                            className="btn  btn-secondary btn-pill"
                                                            onClick={() => {
                                                              this.setState({
                                                                showPmrVerify:
                                                                  !this.state
                                                                    ?.showPmrVerify,
                                                                notes:
                                                                  e.notes ||
                                                                  "<p><p/>",
                                                                version:
                                                                  e.pmrCurrentVersion,
                                                                verifyPmrPath:
                                                                  e.pmrReport,
                                                                verifyId: e.id,
                                                                PMRINDEX: i,
                                                              });
                                                            }}
                                                          >
                                                            {e.isPMRVerified
                                                              ? "Verified"
                                                              : "Verify"}
                                                          </button>}
                                                          <button
                                                            type="btn"
                                                            id="PMRandFinalReportPMRFileApproved"
                                                            disabled={
                                                              !e.isPMRVerified ||
                                                              e.isPMRApproved ||
                                                              e.pmrRejectDate
                                                              || !["john.catanzaro@neo7bioscience.com", "john.catanzaro@neo7bioscience.com", "john@mailinator.com"].includes(this.state.PMRapprovelRight)
                                                            }
                                                            style={{
                                                              backgroundColor:
                                                                e?.pmrRejectDate &&
                                                                "red",
                                                              border:
                                                                e?.pmrRejectDate &&
                                                                "none",
                                                              opacity:
                                                                e.pmrRejectDate !==
                                                                null && "0.5",
                                                              fontWeight: "700",
                                                            }}
                                                            className="btn  btn-primary btn-pill"
                                                            onClick={() => {
                                                              this.setState({
                                                                showPmrApprove:
                                                                  !this.state
                                                                    ?.showPmrApprove,
                                                                version:
                                                                  e.pmrCurrentVersion,
                                                                verifyPmrPath:
                                                                  e.pmrReport,
                                                                verifyId: e.id,
                                                              });
                                                            }}
                                                          >
                                                            {e.pmrRejectDate
                                                              ? "Rejected"
                                                              : e.isPMRApproved
                                                                ? "Approved"
                                                                : "Approve"}
                                                          </button>


                                                          {!e.pmrRejectReason && <button
                                                            disabled={!e.isPMRApproved}

                                                            type="btn"
                                                            id=""
                                                            className="btn  btn-success btn-pill ml-2"
                                                            onClick={() => {
                                                              this.handleShowFREmailModal(
                                                                e, 2
                                                              );
                                                            }}
                                                          >
                                                            E-Mail
                                                          </button>}
                                                        </td>
                                                      </tr>
                                                    );
                                                  }
                                                )
                                              ) : (
                                                <tr>
                                                  <td
                                                    colspan="4"
                                                    className="text-center"
                                                  >
                                                    Generated reports will be
                                                    displayed here.
                                                  </td>
                                                </tr>
                                              )}
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>

                                      {/* <tr>
                                    <td className="w-50" style={{ verticalAlign: "inherit", alignItems: "center" }}>
                                      <i className="fa fa-file-pdf-o" style={{ margin: "5px" }}></i> NB2100013P01_Report_060120230507.pdf
                                    </td>
                                    <td>2.0</td>
                                    <td><button type="btn" className="btn  btn-primary btn-pill">Approve</button> <button type="btn" className="btn  btn-success btn-pill">Verify</button> </td>
                                    <td> <button type="btn" className="btn  btn-danger btn-pill">Delete</button> <button type="btn" className="btn  btn-success btn-pill">View</button></td>
                                  </tr> */}
                                    </tbody>
                                  </table>
                                </Col>
                              )}

                              {true ? (
                                <Col xs="12">
                                  <table className="table table-bordered  ">
                                    <thead
                                      style={{
                                        color: "#fff",
                                        border: "1px solid #FFF",
                                      }}
                                    >
                                      <tr
                                        style={{ backgroundColor: "#1C3A84" }}
                                      >
                                        <th className="border-0" colspan="3">
                                          <div
                                            className="d-flex"
                                            style={{
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span> ADME-Tox Report(s) </span>
                                            <button
                                              className=" btn btn-secondary "
                                              //  disabled={!this.state.basicInfo?.designActivity?.designCompleted}
                                              style={{ fontWeight: "700" }}
                                              onClick={() => {
                                                this.handleShowUploadFile(
                                                  "ADME-Tox Report",
                                                  4
                                                );
                                              }}
                                            >
                                              Upload{" "}
                                            </button>
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <table className="table table-bordered">
                                            <thead>
                                              <tr
                                                className="text-center"
                                                style={{
                                                  // backgroundColor: "#5e75ae",
                                                  backgroundColor: "#e4e7ea",
                                                  color: "black",
                                                }}
                                              >
                                                <th>File</th>
                                                {/* <th>
                                                Version
                                              </th> */}

                                                <th>Action</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {Array.isArray(
                                                this.state.PatientAdmeToxReports
                                              ) &&
                                                this.state.PatientAdmeToxReports
                                                  ?.length > 0 ? (
                                                this.state.PatientAdmeToxReports.map(
                                                  (e, i) => {
                                                    return (
                                                      <tr>
                                                        <td
                                                          className="w-50"
                                                          style={{
                                                            verticalAlign:
                                                              "inherit",
                                                            alignItems:
                                                              "center",
                                                          }}
                                                        >
                                                          <i
                                                            className="fa fa-file-pdf-o"
                                                            style={{
                                                              margin: "5px",
                                                              color: "#f64846",
                                                            }}
                                                          ></i>
                                                          {this.state
                                                            .renamePdf ===
                                                            "adm" + i ? (
                                                            <div
                                                              style={{
                                                                float: "right",
                                                                width: "92%",
                                                                position:
                                                                  "relative",
                                                                textAlign:
                                                                  "center",
                                                              }}
                                                            >
                                                              <Input
                                                                type="text"
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  this.handlePdfNameChange(
                                                                    e
                                                                  );
                                                                }}
                                                                value={
                                                                  this.state
                                                                    ?.filePdfname
                                                                }
                                                              />
                                                              <i
                                                                style={{
                                                                  position:
                                                                    "absolute",
                                                                  right: "9px",
                                                                  top: "11px",
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                                onClick={() => {
                                                                  this.setState(
                                                                    {
                                                                      renamePdf:
                                                                        "",
                                                                      filePdfname:
                                                                        "",
                                                                    }
                                                                  );
                                                                }}
                                                                class="fa fa-close"
                                                              ></i>
                                                              <button
                                                                className="btn btn-success mt-1"
                                                                onClick={(
                                                                  event
                                                                ) =>
                                                                  this.RenameFun(
                                                                    event,
                                                                    e.id,
                                                                    4
                                                                  )
                                                                }
                                                              >
                                                                Submit
                                                                <i
                                                                  style={{
                                                                    color:
                                                                      "#fff",
                                                                    marginLeft:
                                                                      "3px",
                                                                  }}
                                                                  class="fa fa-check"
                                                                ></i>
                                                              </button>
                                                            </div>
                                                          ) : (
                                                            <span
                                                              id="PMRandFinalReportAdmeToxFileName"
                                                              onDoubleClick={() => {
                                                                this.setState({
                                                                  renamePdf:
                                                                    "adm" + i,
                                                                  filePdfname:
                                                                    this.spliceFromSash(
                                                                      e.admeToxReport
                                                                    ).replace(
                                                                      ".pdf",
                                                                      ""
                                                                    ),
                                                                });
                                                              }}
                                                            >
                                                              {this.spliceFromSash(
                                                                e.admeToxReport
                                                              )}
                                                            </span>
                                                          )}
                                                        </td>
                                                        {/* <td>{e.pmrCurrentVersion}</td> */}

                                                        <td
                                                          style={{
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            justifyContent:
                                                              "center",
                                                            gap: "10px",
                                                          }}
                                                        >
                                                          <button
                                                            type="btn"
                                                            className="btn  btn-success btn-pill"
                                                            onClick={() =>
                                                              this.previewPdfToggle_api(
                                                                e.id,
                                                                4
                                                              )
                                                            }
                                                          >
                                                            View
                                                          </button>
                                                          <button
                                                            type="btn"
                                                            className="btn  btn-danger  btn-pill"
                                                            onClick={() => {
                                                              this.handleShowDeleteFile(
                                                                e.id
                                                              );
                                                            }}
                                                          >
                                                            Delete
                                                          </button>
                                                          <button
                                                            type="btn"
                                                            id=""
                                                            className="btn  btn-success btn-pill ml-2"
                                                            onClick={() => {
                                                              this.handleShowFREmailModal(
                                                                e, 4
                                                              );
                                                            }}
                                                          >
                                                            E-Mail
                                                          </button>
                                                        </td>
                                                      </tr>
                                                    );
                                                  }
                                                )
                                              ) : (
                                                <tr>
                                                  <td
                                                    colspan="3"
                                                    className="text-center"
                                                  >
                                                    Generated reports will be
                                                    displayed here.
                                                  </td>
                                                </tr>
                                              )}
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Col>
                              ) : (
                                ""
                              )}
                            </Row>
                          </>
                        ) : (
                          <FormGroup>
                            This section will be visible after receiving the
                            design payment.
                          </FormGroup>
                        )}</>}

                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {this.state.pdfPrivew && (
                <>
                  <div className="preview-popup">
                    <div className="preview-popup-modal">
                      <div className="preview-popup-header">
                        {
                          url.split(".").splice(-1)[0] === "pdf" ? null : (
                            // <a href={url} download target={`_blank`}>
                            <img
                              src={downloadIcon}
                              style={{ margin: "0 12px", cursor: "pointer" }}
                              alt="download"
                              onClick={(e) => this.DownloadFile(e, url)}
                            />
                          )
                          // </a>
                        }
                        <img
                          src={closeIcon}
                          style={{ cursor: "pointer" }}
                          alt="close"
                          onClick={(e) => this.previewPdfToggle("")}
                        />
                      </div>
                      <iframe
                        src={url}
                        title="previewFile"
                        width="100%"
                        height="90%"
                      />
                      {/* <FilePreview
            type={"url"}
            width="100%"
            url={url}
            onError={this.onError}
            style={{ borderRadius: 0 }}
          /> */}
                    </div>
                  </div>
                </>
              )}

              {/* -------- */}
              <Card className="viewPatientForm">
                <CardBody>
                  <Row>
                    <div className="form-goup w-100 dis-cotents">
                      <Col xs="12">
                        <div className="d-flex"> <h5 className="mt-2 w-100">
                          PMR & Final Report Delivery
                        </h5>
                          {/* {this.state.showPmrAndFinalReportDel ? <i class="icon-minus " style={{ fontSize: "24px", cursor: "pointer" }} onClick={() => { this.setState({ showPmrAndFinalReportDel: !this.state.showPmrAndFinalReportDel }) }}>  </i>
                            : <i class="icon-plus " style={{ fontSize: "24px", cursor: "pointer" }} onClick={() => { this.setState({ showPmrAndFinalReportDel: !this.state.showPmrAndFinalReportDel }) }}>  </i>
                          } */}
                        </div>

                        <hr className="w-100" />
                        <div ref={this.peptideRef} id="myDiv"></div>
                      </Col>
                      {/* {this.state.showPmrAndFinalReportDel && <>{this.state.basicInfo.showPeptide ? ( */}
                      {true && <>{this.state.basicInfo.showPeptide ? (
                        <Col xs="8" lg="9" xl="7">
                          <FormGroup>
                            {/* <h5 className="mt-2">Peptide Status </h5>
                          < hr /> */}

                            <FormGroup check row>
                              <Row style={{ marginBottom: "3px" }}>
                                <Col xs="1">
                                  <Input
                                    id="peptide_sentToClinic"
                                    onChange={() => {
                                      this.handlePeptidesCheckBoxChanges(
                                        "pmrSentToClinic"
                                      );
                                    }}
                                    checked={this.isPeptidesCheked(
                                      "pmrSentToClinic"
                                    )}
                                    disabled={
                                      this.state?.basicInfo?.peptideStatus
                                        ?.pmrSendToCilnic &&
                                      this.state.basicInfo?.peptideStatus
                                        .finalReportSentToCC
                                    }
                                    className={`ml-0  ${isEditDateClass}  `}
                                    type="checkbox"
                                    name="inline-checkbox1"
                                  />
                                </Col>
                                <Col xs="5" style={{ paddingTop: "0px" }}>
                                  <Label
                                    className="form-check-label"
                                    htmlFor="peptide_sentToClinic"
                                  >
                                    PMR Sent To Customer Care
                                  </Label>
                                </Col>
                                <Col xs="3">
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      onChange={(date) => {
                                        this.handlePeptidesDateChanges(
                                          "pmrSentToClinic",
                                          date
                                        );
                                      }}
                                      selected={this.getPeptidesDate(
                                        "pmrSentToClinic"
                                      )}
                                      disabled={this.isPeptideDisabledForPMR()}
                                      defaultValue=""
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here   ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>
                                <Col xs="3">
                                  <button
                                    style={{
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    className={`btn btn-${this.state?.basicInfo?.peptideStatus
                                      ?.pmrSendToCilnic &&
                                      !this.state.basicInfo?.peptideStatus
                                        .finalReportSentToCC
                                      ? "success"
                                      : "primary"
                                      } btn-md`}
                                    disabled={
                                      this.isPeptideDisabledForPMR() ||
                                      this.getPeptidesDate(
                                        "pmrSentToClinic"
                                      ) === "" || loading
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() =>
                                        this.handlePmrSentToClinicSUbmit(
                                          this.state?.basicInfo?.peptideStatus
                                            ?.pmrSendToCilnic &&
                                          !this.state.basicInfo?.peptideStatus
                                            .finalReportSentToCC
                                        )
                                      );
                                    }}
                                  >
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    {this.state?.basicInfo?.peptideStatus
                                      ?.pmrSendToCilnic &&
                                      !this.state.basicInfo?.peptideStatus
                                        .finalReportSentToCC
                                      ? "Update"
                                      : "Submit"}
                                  </button>
                                </Col>
                                <Col xs="1">
                                  <Input
                                    onChange={() => {
                                      this.handlePeptidesCheckBoxChanges(
                                        "clinicSentPmrToPharmacy"
                                      );
                                    }}
                                    checked={this.isPeptidesCheked(
                                      "clinicSentPmrToPharmacy"
                                    )}
                                    id="peptide_csendtophr"
                                    disabled={
                                      !this.state?.basicInfo?.peptideStatus
                                        ?.pmrSendToCilnic ||
                                      this.state.basicInfo?.peptideStatus
                                        ?.peptidesReceivedByClinic
                                    }
                                    className={`ml-0  ${isEditDateClass}  `}
                                    type="checkbox"
                                    name="inline-checkbox1"
                                  />
                                </Col>
                                <Col xs="5" style={{ paddingTop: "0px" }}>
                                  <Label
                                    className="form-check-label"
                                    htmlFor="peptide_csendtophr"
                                  >
                                    {/* Clinic sent PMR TO Pharmacy */}
                                    Final Report Sent To Customer Care
                                  </Label>
                                </Col>
                                <Col xs="3 pt-2">
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      // minDate={new Date(this.state?.basicInfo?.peptideStatus?.pmrSendToCilnicDate) || ''}
                                      onChange={(date) => {
                                        this.handlePeptidesDateChanges(
                                          "clinicSentPmrToPharmacy",
                                          date
                                        );
                                      }}
                                      selected={this.getPeptidesDate(
                                        "clinicSentPmrToPharmacy"
                                      )}
                                      disabled={this.isPeptideDisabledForClinic()}
                                      defaultValue=""
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here  ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>{" "}
                                <Col xs="3 pt-2">
                                  <button
                                    style={{
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    className={`btn btn-${this.state?.basicInfo?.peptideStatus
                                      ?.finalReportSentToCC &&
                                      !this.state.basicInfo?.peptideStatus
                                        ?.pmrSentToProvider
                                      ? "success"
                                      : "primary"
                                      } btn-md `}
                                    disabled={
                                      this.isPeptideDisabledForClinic() ||
                                      this.getPeptidesDate(
                                        "clinicSentPmrToPharmacy"
                                      ) === "" || loading
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() => {
                                        return this.handleClinicSentPmrToPharmacy();
                                      });
                                    }}
                                  >
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    {this.state?.basicInfo?.peptideStatus
                                      ?.finalReportSentToCC &&
                                      !this.state.basicInfo?.peptideStatus
                                        ?.pmrSentToProvider
                                      ? "Update"
                                      : "Submit"}
                                  </button>
                                </Col>
                                <Col xs="1">
                                  {/* {alert(`${this.isPeptidesDisabled('peptidesReceivedByClinic')} ${!this.isPeptidesDisabled("clinicSendPMRToPharmacy")}`)} */}
                                  <Input
                                    id="PEP_RecByClinic"
                                    disabled={
                                      !this.state?.basicInfo?.peptideStatus
                                        ?.finalReportSentToCC ||
                                      this.state.basicInfo?.peptideStatus
                                        ?.finalReportSentToProvider || this.state.basicInfo.peptideStatus.isNoPMRRequired
                                    }
                                    className={`ml-0  ${isEditDateClass}  `}
                                    type="checkbox"
                                    name="inline-checkbox1"
                                    onChange={() => {
                                      this.handlePeptidesCheckBoxChanges(
                                        "peptidesReceivedByClinic"
                                      );
                                    }}
                                    checked={this.isPeptidesCheked(
                                      "peptidesReceivedByClinic"
                                    ) || this.state.basicInfo.peptideStatus.isNoPMRRequired}
                                  />
                                </Col>
                                <Col xs="5" style={{ paddingTop: "0px" }}>
                                  <Label
                                    className="form-check-label"
                                    htmlFor="PEP_RecByClinic"
                                  >
                                    {/* Peptides Received By Clinic */}
                                    PMR Sent To Provider
                                  </Label>
                                </Col>
                                <Col xs="3 pt-2">
                                  {" "}
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      // minDate={new Date(this.state?.basicInfo?.peptideStatus?.clinicSendPMRToPharmacyDate) || ''}
                                      onChange={(date) => {
                                        this.handlePeptidesDateChanges(
                                          "peptidesReceivedByClinic",
                                          date
                                        );
                                      }}
                                      selected={this.getPeptidesDate(
                                        "peptidesReceivedByClinic"
                                      )}
                                      disabled={this.isPeptideDisabledForrecievedByClinic() || this.state.basicInfo.peptideStatus.isNoPMRRequired}
                                      defaultValue=""
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>{" "}
                                <Col xs="3 pt-2">
                                  <button
                                    style={{
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    className={`btn btn-${this.state?.basicInfo?.peptideStatus
                                      ?.pmrSentToProvider &&
                                      !this.state.basicInfo?.peptideStatus
                                        .finalReportSentToProvider
                                      ? "success"
                                      : "primary"
                                      } btn-md`}
                                    disabled={
                                      this.isPeptideDisabledForrecievedByClinic() ||
                                      this.getPeptidesDate(
                                        "peptidesReceivedByClinic"
                                      ) === "" || this.state.basicInfo.peptideStatus.isNoPMRRequired || loading
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() =>
                                        this.handlePeptidesReceviedByclinic()
                                      );
                                    }}
                                  >
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    {this.state?.basicInfo?.peptideStatus
                                      ?.pmrSentToProvider &&
                                      !this.state.basicInfo?.peptideStatus
                                        .finalReportSentToProvider
                                      ? "Update"
                                      : "Submit"}
                                  </button>
                                </Col>
                                <Col xs="1">
                                  <Input
                                    onChange={() => {
                                      this.handlePeptidesCheckBoxChanges(
                                        "treatMentStarted"
                                      );
                                    }}
                                    id="peptide_treatmntstrt"
                                    checked={this.isPeptidesCheked(
                                      "treatMentStarted"
                                    )}
                                    disabled={
                                      !this.state?.basicInfo?.peptideStatus
                                        ?.pmrSentToProvider ||
                                      this.state.basicInfo?.peptideStatus
                                        ?.finalReportSentToProvider
                                    }
                                    className={`ml-0  ${isEditDateClass}  `}
                                    type="checkbox"
                                    name="inline-checkbox1"
                                  />
                                </Col>
                                <Col xs="5" style={{ paddingTop: "0px" }}>
                                  <Label
                                    className="form-check-label"
                                    htmlFor="peptide_treatmntstrt"
                                  >
                                    {/* Treatment Started */}
                                    Final Report Sent To Provider
                                  </Label>
                                </Col>
                                <Col xs="3 pt-2">
                                  {" "}
                                  <div className={`cus-date-picker `}>
                                    <DatePicker
                                      // minDate={new Date(this.state?.basicInfo?.peptideStatus?.peptidesReceivedByClinicDate) || ''}
                                      onChange={(date) => {
                                        this.handlePeptidesDateChanges(
                                          "treatMentStarted",
                                          date
                                        );
                                      }}
                                      selected={this.getPeptidesDate(
                                        "treatMentStarted"
                                      )}
                                      disabled={
                                        !this.isPeptidesCheked(
                                          "treatMentStarted"
                                        ) ||
                                        this.isPeptidesDisabled(
                                          "treatmentStarted"
                                        )
                                      }
                                      defaultValue=""
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="mm/dd/yyyy"
                                      className={`form-control here  ${isEditDateClass}  `}
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      fixedHeight
                                      maxDate={new Date().setDate(
                                        new Date().getDate() + 7
                                      )}
                                    />
                                  </div>
                                </Col>{" "}
                                <Col xs="3 pt-2">
                                  <button
                                    style={{
                                      display: this.state.isEdit
                                        ? "block"
                                        : "none",
                                    }}
                                    className="btn btn-primary btn-md"
                                    disabled={
                                      !this.isPeptidesCheked(
                                        "treatMentStarted"
                                      ) ||
                                      this.getPeptidesDate(
                                        "treatMentStarted"
                                      ) === "" ||
                                      this.isPeptidesDisabled(
                                        "treatmentStarted"
                                      ) || loading
                                    }
                                    onClick={() => {
                                      this.updateDataAndRefreshPage(() =>
                                        this.handlePeptidesTreatmentStarted()
                                      );
                                    }}
                                  >
                                    <i className="fa fa-dot-circle-o text-light"></i>{" "}
                                    Submit
                                  </button>
                                </Col>
                              </Row>
                            </FormGroup>
                          </FormGroup>
                        </Col>
                      ) : (
                        <FormGroup className="ml-3">
                          This section will be visible after completion of PMR &
                          Final Report.
                        </FormGroup>
                      )}</>}

                    </div>
                  </Row>
                </CardBody>
              </Card>

              {/* <Card className="viewPatientForm">
                <CardBody>
                  <Row>
                    <div className="form-group w-100 dis-contents">
                      {Object.keys(this.state.NewSamples).length > 0 &&
                        Object.keys(this.state.NewSamples).map(
                          (parent, parentIndex) => {
                            let ele = this.state.NewSamples[parent];
                            if (Array.isArray(ele) && ele.length) {
                              return (
                                <>
                                  <Col xs="6">
                                    <FormGroup>
                                      <h5 className="mt-2">{parent}</h5>
                                      {ele.map((child, childIndex) => {
                                        sampleTypeName: string;
                                        date: string;
                                        isActive: boolean;

                                        let {
                                          date,
                                          sampleTypeName,
                                          isActive,
                                          sampleTypeId,
                                        } = child;
                                        return (
                                          <FormGroup check row>
                                            <Row
                                              style={{ marginBottom: "3px" }}
                                            >
                                              <Col xs="1"></Col>
                                              <Col
                                                xs="7"
                                                style={{ paddingTop: "6px" }}
                                              >
                                                this.setCheckbox(data.sampleTypeId) ? (
                                                {this.setCheckbox(
                                                  sampleTypeId
                                                ) ? (
                                                  <Input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={"chk" + sampleTypeId}
                                                    checked
                                                    name="inline-checkbox1"
                                                    value={sampleTypeId}
                                                    onChange={(e) => {
                                                      this.handleSampleInputChange.bind(
                                                        this
                                                      )(e);
                                                      this.setNewSampleDateValue(
                                                        parent,
                                                        childIndex,
                                                        ""
                                                      );
                                                    }}
                                                  />
                                                ) : (
                                                  <Input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={"chk" + sampleTypeId}
                                                    name="inline-checkbox1"
                                                    value={sampleTypeId}
                                                    onChange={(e) => {
                                                      this.handleSampleInputChange.bind(
                                                        this
                                                      )(e);
                                                      this.setNewSampleDateValue(
                                                        parent,
                                                        childIndex,
                                                        ""
                                                      );
                                                    }}
                                                  />
                                                )}
                                                <Label
                                                  className="form-check-label"
                                                  check
                                                  htmlFor={
                                                    " chk" + sampleTypeId
                                                  }
                                                >
                                                  {sampleTypeName}
                                                </Label>
                                              </Col>
                                              <Col xs="4">
                                                <div
                                                  className={`cus-date-picker ${
                                                    this.isRequired(
                                                      this.state.NewSamples,
                                                      parent,
                                                      childIndex,
                                                      sampleTypeId
                                                    )
                                                      ? "invalid"
                                                      : ""
                                                  } `}
                                                >
                                                  <DatePicker
                                                    selected={this.getnewSampleDateValue(
                                                      parent,
                                                      childIndex
                                                    )}
                                                    defaultValue=""
                                                    onChange={(e) => {
                                                      this.setNewSampleDateValue(
                                                        parent,
                                                        childIndex,
                                                        e
                                                      );
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    placeholderText="mm/dd/yyyy"
                                                    className="form-control here "
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    fixedHeight
                                                    disabled={
                                                      !this.setCheckbox(
                                                        sampleTypeId
                                                      )
                                                    }
                                                  />
                                                  {this.isRequired(
                                                    this.state.NewSamples,
                                                    parent,
                                                    childIndex,
                                                    sampleTypeId
                                                  )
                                                    ? "required"
                                                    : ""}
                                                </div>
                                              </Col>
                                            </Row>
                                          </FormGroup>
                                        );
                                      })}
                                    </FormGroup>
                                  </Col>
                                </>
                              );
                            }
                          }
                        )}
                    </div>
                  </Row>
                  <Col xs="6">
                    <FormGroup>
                      <h5 className="mt-2">Patient Specimen Received at Lab</h5>
                      {AllSamples.length > 0
                        ? AllSamples.map((data, i) => {
                            return (
                              <FormGroup check row key={i}>
                                <Row style={{ marginBottom: "3px" }}>
                                  <Col xs="1"></Col>
                                  <Col xs="7" style={{ paddingTop: "6px" }}>
                                    this.setCheckbox(data.sampleTypeId) ? (
                                    {this.setCheckbox(data.sampleTypeId) ? (
                                      <Input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={"chk" + data.sampleTypeId}
                                        checked
                                        name="inline-checkbox1"
                                        value={data.sampleTypeId}
                                        onChange={this.handleSampleInputChange.bind(
                                          this
                                        )}
                                      />
                                    ) : (
                                      <Input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={"chk" + data.sampleTypeId}
                                        name="inline-checkbox1"
                                        value={data.sampleTypeId}
                                        onChange={this.handleSampleInputChange.bind(
                                          this
                                        )}
                                      />
                                    )}
                                    <Label
                                      className="form-check-label"
                                      check
                                      htmlFor={" chk" + data.sampleTypeId}
                                    >
                                      {data.sampleTypeName}
                                    </Label>
                                  </Col>
                                  <Col xs="4">
                                    <div className="cus-date-picker">
                                      <DatePicker
                                        selected={this.getDate(
                                          data.sampleTypeId
                                        )}
                                        onChange={(e) => {
                                          this.handleSampleDateChange(
                                            e,
                                            data.sampleTypeId
                                          );
                                        }}
                                        dateFormat="MM/dd/yyyy"
                                        placeholderText="mm/dd/yyyy"
                                        className="form-control here"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        fixedHeight
                                        disabled={
                                          !this.setCheckbox(data.sampleTypeId)
                                        }
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>
                            );
                          })
                        : null}
                      {errors.patientSampleId.length > 0 && (
                        <span className="error" style={{ marginLeft: "15px" }}>
                          {errors.patientSampleId}
                        </span>
                      )}
                    </FormGroup>
                  </Col>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        {AllSamples.length > 0 ? (
                          <Button
                            type="button"
                            onClick={this.AddPatientSample.bind(this)}
                            disabled={loading}
                            color="primary"
                          >
                            <i className="fa fa-dot-circle-o"></i> Submit
                          </Button>
                        ) : (
                          <Button
                            // disabled
                            type="button"
                            onClick={this.AddPatientSample.bind(this)}
                            disabled={loading}
                            color="primary"
                          >
                            <i className="fa fa-dot-circle-o"></i> Submit
                          </Button>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card> */}

              {preview && (
                <>
                  <div className="preview-popup">
                    <div className="preview-popup-modal">
                      <div className="preview-popup-header">
                        {url.split(".").splice(-1)[0] === "pdf" ? null : (
                          <a href={url} download target={`_blank`}>
                            <img
                              src={downloadIcon}
                              style={{ margin: "0 12px", cursor: "pointer" }}
                              alt="download"
                            />
                          </a>
                        )}
                        <img
                          src={closeIcon}
                          style={{ cursor: "pointer" }}
                          alt="close"
                          onClick={(e) => this.previewToggle(e, "")}
                        />
                      </div>
                      {/* {console.log("url",url)} */}
                      <iframe
                        src={url}
                        title="previewFile"
                        width="100%"
                        height="90%"
                      />
                      {/* <FilePreview
                          type={"url"}
                          width="100%"
                          url={url}
                          onError={this.onError}
                          style={{ borderRadius: 0 }}
                        /> */}
                    </div>
                  </div>
                </>
              )}
              <Card>
                <CardBody>
                  <Col xs="12" md="12" className="mb-4">
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === "1"}
                          onClick={() => {
                            this.toggle(0, "1");
                          }}
                        >
                          Treatments
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === "2"}
                          onClick={() => {
                            this.toggle(0, "2");
                          }}
                        >
                          Diagnostics
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === "3"}
                          onClick={() => {
                            this.toggle(0, "3");
                          }}
                        >
                          Medication
                        </NavLink>
                      </NavItem>

                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === "4"}
                          onClick={() => {
                            this.toggle(0, "4");
                          }}
                        >
                          Emergency Contacts
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === "5"}
                          onClick={() => {
                            this.toggle(0, "5");
                          }}
                        >
                          Insurances
                        </NavLink>
                      </NavItem>
                      {/* <NavItem>
                          <NavLink
                            active={this.state.activeTab[0] === "6"}
                            onClick={() => {
                              this.toggle(0, "6");
                            }}
                          >
                            Payments
                          </NavLink>
                        </NavItem> */}
                    </Nav>
                    <TabContent activeTab={this.state.activeTab[0]}>
                      <TabPane tabId="2">
                        <button
                          className="btn btn-primary btn-md"
                          style={{
                            marginBottom: "5px",
                            float: "right",
                            display: this.state.isEdit ? "block" : "none",
                          }}
                          onClick={() => this.handleShowDiagnostic()}
                        >
                          Add{" "}
                        </button>
                        <Table
                          responsive
                          bordered
                          key="tblPDisease"
                          className="table-hover"
                        >
                          <thead className="thead-light">
                            <tr>
                              <th>S.No.</th>
                              <th>Date</th>
                              <th>Analysis</th>
                              <th>Outcome</th>
                              <th colSpan="3">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {diagnosticHistory.length > 0 ? (
                              diagnosticHistory?.map((data, i) => {
                                return (
                                  <React.Fragment>
                                    <tr key={i} onClick={this.toggleExpander}>
                                      <td>{i + 1}</td>
                                      <td>
                                        {Moment(data.diagnosticDate).format(
                                          "MM/DD/YYYY"
                                        )}
                                      </td>
                                      {/* <td>
                                                                                <div
                                                                                    style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px", float: "left" }}
                                                                                >

                                                                                    {data.diagnosticAnalysis}
                                                                                </div>
                                                                                <a style={{
                                                                                    display: data.diagnosticAnalysis?.length >= 24 ? "block" : "none",
                                                                                    background: "none", textDecoration: "underline", color: "blue", cursor: "pointer"

                                                                                }}
                                                                                    onClick={() => { this.setState({ analysisModal: true, analysisText: data.diagnosticAnalysis, analysisHeader: "Diagnostics - Analysis" }) }}>view more</a>
                                                                            </td> */}

                                      <td>
                                        <div
                                          className=""
                                        // style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px", float: "left" }}
                                        >
                                          {/* {data.diagnosticAnalysis} */}

                                          <ReactReadMoreReadLess
                                            charLimit={70}
                                            readMoreText={"Read more ▼"}
                                            readLessText={"Read less ▲"}
                                            readMoreStyle={{ color: "blue" }}
                                            readLessStyle={{ color: "blue" }}
                                          >
                                            {/* {data.hallMarkReference} */}
                                            {data.diagnosticAnalysis}
                                          </ReactReadMoreReadLess>
                                        </div>
                                        {/* <a style={{
                                                                                    display: data.diagnosticAnalysis?.length >= 24 ? "block" : "none",
                                                                                    background: "none", textDecoration: "underline", color: "blue", cursor: "pointer"

                                                                                }}
                                                                                    onClick={() => { this.setState({ analysisModal: true, analysisText: data.diagnosticAnalysis, analysisHeader: "Diagnostics - Analysis" }) }}>view more</a> */}
                                      </td>
                                      {/* <td >
                                                                                <div 
                                                                                style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px", float: "left" }}
                                                                                >

                                                                                    {data.outcome}
                                                                                </div>
                                                                                <a style={{
                                                                                    display: data.outcome?.length >= 24 ? "block" : "none",
                                                                                    background: "none", textDecoration: "underline", color: "blue", cursor: "pointer",

                                                                                }}
                                                                                    onClick={() => { this.setState({ analysisModal: true, analysisText: data.outcome, analysisHeader: "Diagnostics - 	Outcome" }) }}>
                                                                                    view more</a>
                                                                            </td> */}
                                      <td>
                                        <div
                                        // style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px", float: "left" }}
                                        >
                                          <ReactReadMoreReadLess
                                            charLimit={70}
                                            readMoreText={"Read more ▼"}
                                            readLessText={"Read less ▲"}
                                            readMoreStyle={{ color: "blue" }}
                                            readLessStyle={{ color: "blue" }}
                                          >
                                            {data.outcome}
                                          </ReactReadMoreReadLess>
                                        </div>
                                        {/* <a style={{
                                                                                    display: data.outcome?.length >= 24 ? "block" : "none",
                                                                                    background: "none", textDecoration: "underline", color: "blue", cursor: "pointer",

                                                                                }}
                                                                                    onClick={() => { this.setState({ analysisModal: true, analysisText: data.outcome, analysisHeader: "Diagnostics - 	Outcome" }) }}>
                                                                                    view more</a> */}
                                      </td>
                                      <td className="">
                                        <div className="d-flex">
                                          {/* <svg
                                            id="color"
                                            enable-background="new 0 0 24 24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="m12 16c-.205 0-.401-.084-.542-.232l-5.25-5.5c-.456-.477-.117-1.268.542-1.268h2.75v-5.75c0-.689.561-1.25 1.25-1.25h2.5c.689 0 1.25.561 1.25 1.25v5.75h2.75c.659 0 .998.791.542 1.268l-5.25 5.5c-.141.148-.337.232-.542.232z"
                                              fill="#00bcd4"
                                            />
                                            <path
                                              d="m22.25 22h-20.5c-.965 0-1.75-.785-1.75-1.75v-.5c0-.965.785-1.75 1.75-1.75h20.5c.965 0 1.75.785 1.75 1.75v.5c0 .965-.785 1.75-1.75 1.75z"
                                              fill="#607d8b"
                                            />
                                            <path
                                              d="m12 2h-1.25c-.689 0-1.25.561-1.25 1.25v5.75h-2.75c-.659 0-.998.791-.542 1.268l5.25 5.5c.141.148.337.232.542.232z"
                                              fill="#00a4b9"
                                            />
                                            <path
                                              d="m12 18h-10.25c-.965 0-1.75.785-1.75 1.75v.5c0 .965.785 1.75 1.75 1.75h10.25z"
                                              fill="#546d79"
                                            />
                                          </svg> */}

                                          <Link
                                            className="card-header-action btn btn-close"
                                            to="#"
                                            onClick={() => {
                                              this.setState({
                                                showeditdiagnostic: true,
                                                diagnosticDate: new Date(
                                                  data.diagnosticDate
                                                ),
                                                diagnosticAnalysis:
                                                  data.diagnosticAnalysis,
                                                outcome: data.outcome,
                                                patientDiagnosticId:
                                                  data.patientDiagnosticId,
                                              });
                                            }}
                                          >
                                            <i className="icon-pencil"></i>
                                          </Link>
                                          <Confirm
                                            title="Confirm"
                                            description="Are you sure want to remove this detail?"
                                          >
                                            {(confirm) => (
                                              <Link
                                                className="card-header-action btn btn-close"
                                                to="#"
                                                onClick={confirm((e) =>
                                                  this.DeletePatientDiagnostic(
                                                    e,
                                                    data.patientDiagnosticId
                                                  )
                                                )}
                                              >
                                                <i className="icon-trash"></i>
                                              </Link>
                                            )}
                                          </Confirm>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr
                                      // className="collapse"
                                      key={data.patientDiagnosticId}
                                    >
                                      <td></td>
                                      <td colSpan="4">
                                        {data.patientDiagnosticHistoryFile
                                          .length > 0
                                          ? data.patientDiagnosticHistoryFile.map(
                                            (dataFile, i) => {
                                              return (
                                                <div
                                                  key={
                                                    dataFile.patientDiagnosticFileId
                                                  }
                                                >
                                                  <a
                                                    onClick={(e) =>
                                                      // this.previewToggle(
                                                      //   e,
                                                      //   dataFile.filePath
                                                      // )
                                                      this.previewPdfToggle_api_bottom(
                                                        dataFile.patientDiagnosticId,
                                                        dataFile.patientDiagnosticFileId,
                                                        "d1"
                                                      )
                                                    }
                                                    className="kt-widget4__title"
                                                  >
                                                    <i className="fa fa-download"></i>
                                                    &nbsp;{dataFile.fileName}
                                                    <br />
                                                    {/* {dataFile.filePath} */}
                                                  </a>
                                                </div>
                                              );
                                            }
                                          )
                                          : "No files..."}
                                      </td>
                                    </tr>
                                    <tr></tr>
                                  </React.Fragment>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="5" className="tdCenter">
                                  No diagnostics found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="3">
                        <button
                          className="btn btn-primary btn-md"
                          style={{
                            marginBottom: "5px",
                            float: "right",
                            display: this.state.isEdit ? "block" : "none",
                          }}
                          onClick={() => this.handleShowPrescription()}
                        >
                          Add{" "}
                        </button>
                        <Table
                          responsive
                          bordered
                          key="tblPPrescription"
                          className="table-hover"
                        >
                          <thead className="thead-light">
                            <tr>
                              <th>S.No.</th>
                              <th>Medication Date</th>
                              <th>Description</th>
                              <th colSpan="3">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescription.length > 0 ? (
                              prescription?.map((data, i) => {
                                return (
                                  <React.Fragment>
                                    <tr key={i} onClick={this.toggleExpander}>
                                      <td>{i + 1}</td>
                                      <td>
                                        {Moment(data.prescribeDate).format(
                                          "MM/DD/YYYY"
                                        )}
                                      </td>
                                      {/* <td>
                                                                                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px", float: "left" }}>

                                                                                    {data.prescriptionDescription}
                                                                                </div>

                                                                                <a style={{
                                                                                    background: "none", textDecoration: "underline", color: "blue", cursor: "pointer",
                                                                                    display: data.prescriptionDescription?.length >= 24 ? "block" : "none"
                                                                                }}
                                                                                    onClick={() => { this.setState({ analysisModal: true, analysisText: data.prescriptionDescription, analysisHeader: "Medication - Description" }) }}
                                                                                >view more</a>
                                                                            </td> */}
                                      <td>
                                        <div
                                        //  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px", float: "left" }}
                                        >
                                          <ReactReadMoreReadLess
                                            charLimit={70}
                                            readMoreText={"Read more ▼"}
                                            readLessText={"Read less ▲"}
                                            readMoreStyle={{ color: "blue" }}
                                            readLessStyle={{ color: "blue" }}
                                          >
                                            {data.prescriptionDescription}
                                          </ReactReadMoreReadLess>
                                        </div>

                                        {/* <a style={{
                                                                                    background: "none", textDecoration: "underline", color: "blue", cursor: "pointer",
                                                                                    display: data.prescriptionDescription?.length >= 24 ? "block" : "none"
                                                                                }}
                                                                                    onClick={() => { this.setState({ analysisModal: true, analysisText: data.prescriptionDescription, analysisHeader: "Medication - Description" }) }}
                                                                                >view more</a> */}
                                      </td>
                                      <td>
                                        <div className="d-flex">
                                          {/* <svg
                                            id="color"
                                            enable-background="new 0 0 24 24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="m12 16c-.205 0-.401-.084-.542-.232l-5.25-5.5c-.456-.477-.117-1.268.542-1.268h2.75v-5.75c0-.689.561-1.25 1.25-1.25h2.5c.689 0 1.25.561 1.25 1.25v5.75h2.75c.659 0 .998.791.542 1.268l-5.25 5.5c-.141.148-.337.232-.542.232z"
                                              fill="#00bcd4"
                                            />
                                            <path
                                              d="m22.25 22h-20.5c-.965 0-1.75-.785-1.75-1.75v-.5c0-.965.785-1.75 1.75-1.75h20.5c.965 0 1.75.785 1.75 1.75v.5c0 .965-.785 1.75-1.75 1.75z"
                                              fill="#607d8b"
                                            />
                                            <path
                                              d="m12 2h-1.25c-.689 0-1.25.561-1.25 1.25v5.75h-2.75c-.659 0-.998.791-.542 1.268l5.25 5.5c.141.148.337.232.542.232z"
                                              fill="#00a4b9"
                                            />
                                            <path
                                              d="m12 18h-10.25c-.965 0-1.75.785-1.75 1.75v.5c0 .965.785 1.75 1.75 1.75h10.25z"
                                              fill="#546d79"
                                            />
                                          </svg> */}
                                          <Link
                                            className="card-header-action btn btn-close"
                                            to="#"
                                            onClick={() => {
                                              this.setState({
                                                showeditprescription: true,
                                                prescriptionDescription:
                                                  data.prescriptionDescription,
                                                prescribeDate: new Date(
                                                  data.prescribeDate
                                                ),
                                                PatientPrescriptionId:
                                                  data.patientPrescriptionId,
                                              });
                                            }}
                                          >
                                            <i className="icon-pencil"></i>
                                          </Link>

                                          <Confirm
                                            title="Confirm"
                                            description="Are you sure want to remove this detail?"
                                          >
                                            {(confirm) => (
                                              <Link
                                                className="card-header-action btn btn-close"
                                                to="#"
                                                onClick={confirm((e) =>
                                                  this.DeletePatientprescription(
                                                    e,
                                                    data.patientPrescriptionId
                                                  )
                                                )}
                                              >
                                                <i className="icon-trash"></i>
                                              </Link>
                                            )}
                                          </Confirm>
                                        </div>
                                        {/* <img style={{ "width": "80%" }} src="../../assets/img/brand/direct-download.svg" alt="" title="View Files" /> */}
                                      </td>
                                    </tr>
                                    <tr
                                      // className="collapse"
                                      key={data.patientPrescriptionId}
                                    >
                                      <td></td>
                                      <td colSpan="3">
                                        {data.patientPrescriptionFile.length > 0
                                          ? data.patientPrescriptionFile.map(
                                            (dataFile, i) => {
                                              return (
                                                <div
                                                  key={
                                                    dataFile.patientPrescriptionFileId
                                                  }
                                                >
                                                  <a
                                                    onClick={(e) =>
                                                      // this.previewToggle(
                                                      //   e,
                                                      //   dataFile.filePath
                                                      // )
                                                      this.previewPdfToggle_api_bottom(
                                                        dataFile.patientPrescriptionId,
                                                        dataFile.patientPrescriptionFileId,
                                                        "m1"
                                                      )
                                                    }
                                                    className="kt-widget4__title"
                                                  >
                                                    <i className="fa fa-download"></i>
                                                    &nbsp;{dataFile.fileName}
                                                  </a>
                                                </div>
                                              );
                                            }
                                          )
                                          : "No files..."}
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="4" className="tdCenter">
                                  No prescription found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="1" id="BottomSectionTreatments">
                        <button
                          id="BottomSectionTreatmentsAdd"
                          className="btn btn-primary btn-md"
                          style={{
                            marginBottom: "5px",
                            float: "right",
                            display: this.state.isEdit ? "block" : "none",
                          }}
                          onClick={() => this.handleShowTreatment()}
                        >
                          Add{" "}
                        </button>
                        <Table
                          responsive
                          bordered
                          key="tblPTreatmentReport"
                          className="table-hover"
                        >
                          <thead className="thead-light">
                            <tr>
                              <th>S.No.</th>
                              <th>Treatment Date</th>
                              <th>Detail</th>
                              <th>Description</th>
                              <th colSpan="3">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {treatmentReport.length > 0 ? (
                              treatmentReport?.map((data, i) => {
                                return (
                                  <React.Fragment>
                                    <tr key={i} onClick={this.toggleExpander}>
                                      <td>{i + 1}</td>
                                      <td>
                                        {Moment(data.treatmentDate).format(
                                          "MM/DD/YYYY"
                                        )}
                                      </td>
                                      {/* <td>
                                                                                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px", float: "left" }}>
                                                                                    {data.treatmentDetail}
                                                                                </div>
                                                                                <a style={{ background: "none", textDecoration: "underline", color: "blue", cursor: "pointer", display: data.treatmentDetail?.length >= 24 ? "block" : "none" }}
                                                                                    onClick={() => { this.setState({ analysisModal: true, analysisText: data.treatmentDetail, analysisHeader: "Treatments - Detail" }) }}>
                                                                                    view more</a>
                                                                            </td> */}
                                      <td>
                                        <div
                                        //  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px", float: "left" }}
                                        >
                                          {/* {data.treatmentDetail} */}
                                          <ReactReadMoreReadLess
                                            charLimit={70}
                                            readMoreText={"Read more ▼"}
                                            readLessText={"Read less ▲"}
                                            readMoreStyle={{ color: "blue" }}
                                            readLessStyle={{ color: "blue" }}
                                          >
                                            {data.treatmentDetail}
                                          </ReactReadMoreReadLess>
                                        </div>
                                        {/* <a style={{ background: "none", textDecoration: "underline", color: "blue", cursor: "pointer", display: data.treatmentDetail?.length >= 24 ? "block" : "none" }}
                                                                                    onClick={() => { this.setState({ analysisModal: true, analysisText: data.treatmentDetail, analysisHeader: "Treatments - Detail" }) }}>
                                                                                    view more</a> */}
                                      </td>

                                      {/* <td>
                                                                                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px", float: "left", }}>
                                                                                    {data.teatmentDescription}
                                                                                </div>

                                                                                <a style={{ background: "none", textDecoration: "underline", color: "blue", cursor: "pointer", display: data.teatmentDescription?.length >= 24 ? "block" : "none" }}
                                                                                    onClick={() => { this.setState({ analysisModal: true, analysisText: data.teatmentDescription, analysisHeader: "Treatments - Description" }) }}>view more</a>
                                                                            </td> */}
                                      <td>
                                        <div
                                        // style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px", float: "left", }}
                                        >
                                          <ReactReadMoreReadLess
                                            charLimit={70}
                                            readMoreText={"Read more ▼"}
                                            readLessText={"Read less ▲"}
                                            readMoreStyle={{ color: "blue" }}
                                            readLessStyle={{ color: "blue" }}
                                          >
                                            {data.teatmentDescription}
                                          </ReactReadMoreReadLess>
                                        </div>
                                        {/* 
                                                                                <a style={{ background: "none", textDecoration: "underline", color: "blue", cursor: "pointer", display: data.teatmentDescription?.length >= 24 ? "block" : "none" }}
                                                                                    onClick={() => { this.setState({ analysisModal: true, analysisText: data.teatmentDescription, analysisHeader: "Treatments - Description" }) }}>view more</a> */}
                                      </td>
                                      <td>
                                        <div className="d-flex">
                                          {/* <svg
                                            id="color"
                                            enable-background="new 0 0 24 24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="m12 16c-.205 0-.401-.084-.542-.232l-5.25-5.5c-.456-.477-.117-1.268.542-1.268h2.75v-5.75c0-.689.561-1.25 1.25-1.25h2.5c.689 0 1.25.561 1.25 1.25v5.75h2.75c.659 0 .998.791.542 1.268l-5.25 5.5c-.141.148-.337.232-.542.232z"
                                              fill="#00bcd4"
                                            />
                                            <path
                                              d="m22.25 22h-20.5c-.965 0-1.75-.785-1.75-1.75v-.5c0-.965.785-1.75 1.75-1.75h20.5c.965 0 1.75.785 1.75 1.75v.5c0 .965-.785 1.75-1.75 1.75z"
                                              fill="#607d8b"
                                            />
                                            <path
                                              d="m12 2h-1.25c-.689 0-1.25.561-1.25 1.25v5.75h-2.75c-.659 0-.998.791-.542 1.268l5.25 5.5c.141.148.337.232.542.232z"
                                              fill="#00a4b9"
                                            />
                                            <path
                                              d="m12 18h-10.25c-.965 0-1.75.785-1.75 1.75v.5c0 .965.785 1.75 1.75 1.75h10.25z"
                                              fill="#546d79"
                                            />
                                          </svg> */}
                                          <Link
                                            id="BottomSectionTreatmentsEdit"
                                            className="card-header-action btn btn-close"
                                            to="#"
                                            onClick={() => {
                                              this.setState({
                                                showedittreatment: true,
                                                treatmentDate: new Date(
                                                  data.treatmentDate
                                                ),
                                                treatmentDetail:
                                                  data.treatmentDetail,
                                                treatmentDescription:
                                                  data.teatmentDescription,
                                                dataFiles:
                                                  data.patientTreatmentReportFile.map(
                                                    (dataFile) =>
                                                      dataFile.filePath
                                                  ),
                                                patientTreatmentReportId:
                                                  data.patientTreatmentReportId,
                                              });
                                            }}
                                          >
                                            <i className="icon-pencil"></i>
                                          </Link>

                                          <Confirm
                                            title="Confirm"
                                            description="Are you sure want to remove this detail?"
                                          >
                                            {(confirm) => (
                                              <Link
                                                id="BottomSectionTreatmentsDelete"
                                                className="card-header-action btn btn-close"
                                                to="#"
                                                onClick={confirm((e) =>
                                                  this.DeletePatienttreatmentreport(
                                                    e,
                                                    data.patientTreatmentReportId
                                                  )
                                                )}
                                              >
                                                <i className="icon-trash"></i>
                                              </Link>
                                            )}
                                          </Confirm>
                                        </div>
                                        {/* <img style={{ "width": "80%" }} src="../../assets/img/brand/direct-download.svg" alt="" title="View Files" /> */}
                                      </td>
                                    </tr>
                                    <tr
                                      // className="collapse"
                                      key={data.patientTreatmentReportId}
                                    >
                                      <td></td>
                                      <td colSpan="4">
                                        {data.patientTreatmentReportFile
                                          .length > 0
                                          ? data.patientTreatmentReportFile.map(
                                            (dataFile, i) => {
                                              return (
                                                <div
                                                  key={
                                                    dataFile.patientTreatmentreportFileId
                                                  }
                                                  onClick={(e) =>
                                                    // this.previewToggle(
                                                    //   e,
                                                    //   dataFile.filePath
                                                    // )
                                                    this.previewPdfToggle_api_bottom(
                                                      dataFile.patientTreatmentReportId,
                                                      dataFile.patientTreatmentreportFileId,
                                                      "t1"
                                                    )
                                                  }
                                                >
                                                  <a
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    className="kt-widget4__title"
                                                  >
                                                    <i className="fa fa-download"></i>
                                                    &nbsp;{dataFile.fileName}
                                                  </a>
                                                </div>
                                              );
                                            }
                                          )
                                          : "No files..."}
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="5" className="tdCenter">
                                  No treatment found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="4">
                        <Table
                          responsive
                          bordered
                          key="tblPEmergenCnts"
                          className="table-hover"
                        >
                          <thead className="thead-light">
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Address</th>
                            </tr>
                          </thead>
                          <tbody>
                            {emergencyContact.length > 0 ? (
                              emergencyContact?.map((data, i) => {
                                return (
                                  <tr key={i}>
                                    <td>
                                      {data.firstName + " " + data.lastName}
                                    </td>
                                    <td>{data.email}</td>
                                    <td>
                                      {data.mobile} <br />
                                      {data.phoneNumber}
                                    </td>
                                    <td>
                                      {data.address + " - " + data.postalCode}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="4" className="tdCenter">
                                  No emergency contacts found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="5">
                        <Table
                          responsive
                          bordered
                          key="tblPInsurance"
                          className="table-hover"
                        >
                          <thead className="thead-light">
                            <tr>
                              <th>Insurance Company</th>
                              <th>Policy Number</th>
                              <th>Health Plan</th>
                              <th>Member ID</th>
                              <th>Group Number</th>
                              <th>Phone</th>
                              <th>Address</th>
                            </tr>
                          </thead>
                          <tbody>
                            {insuranceDetail.length > 0 ? (
                              insuranceDetail?.map((data, i) => {
                                return (
                                  <>
                                    <tr key={i} onClick={this.toggleExpander}>
                                      <td>{data.insuranceCompany}</td>
                                      <td>{data.policyNumber}</td>
                                      <td>{data.healthPlan}</td>
                                      <td>{data.memberID}</td>
                                      <td>{data.groupNumber}</td>
                                      <td>{data.phoneNumber}</td>
                                      <td>{data.address}</td>
                                    </tr>
                                    <tr
                                      className="collapse"
                                      key={data.patientInsuranceFileId}
                                    >
                                      <td colSpan="6">
                                        {data.patientInsuranceFile.length > 0
                                          ? data.patientInsuranceFile.map(
                                            (dataFile, i) => {
                                              return (
                                                <div
                                                  key={
                                                    dataFile.patientInsuranceFileId
                                                  }
                                                  onClick={(e) =>
                                                    this.previewToggle(
                                                      e,
                                                      dataFile.filePath
                                                    )
                                                  }
                                                >
                                                  <a
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    className="kt-widget4__title"
                                                  >
                                                    <i className="fa fa-download"></i>
                                                    &nbsp;{dataFile.fileName}
                                                  </a>
                                                </div>
                                              );
                                            }
                                          )
                                          : "No files..."}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="7" className="tdCenter">
                                  No insurance detail found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </TabPane>
                      <TabPane tabId="6">
                        {(basicInfo.firstName != null ||
                          basicInfo.firstName != "") &&
                          (basicInfo.lastName != null ||
                            basicInfo.lastName != "") &&
                          (basicInfo.email != null || basicInfo.email != "") &&
                          (basicInfo.postalCode != null ||
                            basicInfo.postalCode != "") &&
                          (basicInfo.countryName != null ||
                            basicInfo.countryName != "") ? (
                          <Link
                            style={{ marginBottom: "5px", float: "right" }}
                            to={"/patients/paymentDetail/" + patientId}
                          >
                            <button className="btn btn-primary btn-block">
                              Payment Detail
                            </button>
                          </Link>
                        ) : null}
                        <Table responsive bordered key="tblPPayament">
                          <thead className="thead-light">
                            <tr>
                              <th>Milestone</th>
                              <th>Transaction</th>
                              <th>Amount</th>
                              <th>Remark</th>
                              <th>Payment By</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patientpayments?.length > 0 ? (
                              patientpayments?.map((data, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{data.paymentMilestone}</td>
                                    <td>
                                      {Moment(data.transactionDate).format(
                                        "MM/dd/yyyy"
                                      )}
                                      <br />
                                      {data.transactionId}
                                    </td>
                                    <td>{data.transactionAmount}</td>
                                    <td>{data.remark}</td>
                                    <td>
                                      {data.userType != 1
                                        ? data.userType != 2
                                          ? "Institution"
                                          : "Practitioner"
                                        : "Patient"}
                                    </td>
                                    <td>
                                      <Badge color="success">
                                        {data.transactionStatus}
                                      </Badge>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="6" className="tdCenter">
                                  No payment transactions found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </TabPane>
                    </TabContent>
                  </Col>
                </CardBody>
              </Card>
            </React.Fragment>
            {/* ) : (
                <div className="animated fadeIn pt-1 text-center">Loading...</div>
              )}*/}
          </Col>
        </Row>

        <Modal
          isOpen={this.state.showPmrVerify}
          className="modal-dialog modal-lg"
        >
          <ModalHeader
            toggle={() => {
              errors.notes = "";
              errors.reviseReason = "";
              errors.version = "";
              this.setState({
                showPmrVerify: false,
                isRevised: false,
                errors,
              });
            }}
          >
            PMR Verifcation
          </ModalHeader>
          <ModalBody>
            <Form>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group row my-4">
                    <div className="col-md-3">
                      <label htmlFor="date" className="col-12 col-form-label">
                        Version
                      </label>
                      <div className="col-12">
                        {/* onChange={(e) => {
                                                    this.handleInputChange(e, 'version')
                                                }} */}
                        <Input
                          type="text"
                          onChange={(e) => {
                            let numberRegex =
                              /^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d+)?\s*$/;
                            let isNumber = function (s) {
                              return numberRegex.test(s);
                            };
                            if (
                              isNumber(e.target.value) ||
                              e.target.value.trim() === ""
                            ) {
                              e.target.value = e.target.value.trim();
                              this.handleInputChange(e, "version");
                            }
                          }}
                          readOnly={!this.state.isRevised}
                          placeholder="Version"
                          name="Version"
                          value={this.state?.version || ""}
                        />
                        {<span className="error">{errors?.version} </span>}
                      </div>
                    </div>
                    <div className="col-md-9">
                      <label htmlFor="date" className="col-12 col-form-label">
                        File Name
                      </label>
                      <div className="col-12">
                        {/* onChange={(e) => {
                                                    this.handleInputChange(e, 'version')
                                                }} */}
                        <Input
                          type="text"
                          // onChange={(e) => {
                          //   let numberRegex =
                          //     /^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d+)?\s*$/;
                          //   let isNumber = function (s) {
                          //     return numberRegex.test(s);
                          //   };
                          //   if (
                          //     isNumber(e.target.value) ||
                          //     e.target.value.trim() === ""
                          //   ) {
                          //     e.target.value = e.target.value.trim();
                          //     this.handleInputChange(e, "version");
                          //   }
                          // }}
                          readOnly={!this.state.isRevised}
                          placeholder="File Name"
                          name="Version"
                          value={this.spliceFromSash(
                            this.state?.verifyPmrPath
                          ) || ""}
                          style={{ overflowX: "auto" }}
                        />
                        {<span className="error">{errors?.version} </span>}
                      </div>
                    </div>
                    {
                      // Hide Notes section 
                    }
                    {false && <div className="form-group my-4 col-md-12">
                      <label
                        htmlFor="summary"
                        className="col-12 col-form-label"
                      >
                        Notes <span className="requiredField">*</span>
                      </label>
                      <div className="col-12">
                        {/* <Input className="is-valid" disabled={!this?.state?.isRevised} type="textarea" rows="10" tabIndex="1" placeholder="Enter Note Content" name="Note"
                            value={this.getNotesForVerifyPMR()}
                            onChange={(e) => { this.handleInputChange(e, 'notes') }}
                          /> */}
                        {!this.state.isRevised ? (
                          <div className="note bg-light">
                            <div className="note__body p-0 m-0">
                              {/* <textarea value={this.getNotesForVerifyPMR() || ""} /> */}
                              <p
                                className="m-0 p-0"
                                style={{
                                  height: "30vh",
                                  overflowY: "auto",
                                  overflowX: "hidden",
                                  fontSize: "12px",
                                }}
                              >
                                {/* {this.state.notes} */}
                                {ReactHtmlParser(this.getNotesForVerifyPMR()) ||
                                  ""}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <CKEditor
                            editor={ClassicEditor}
                            // disabled={!this?.state?.isRevised}

                            // data={item.description || ""}
                            // config={{ placeholder: "Please enter description", toolbar: [] }}
                            // config={this.getEditorConfig()}
                            //onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            //console.log('Editor is ready to use!', editor);
                            //}}
                            onChange={(event, editor) => {
                              const data = editor?.getData();
                              // console.log("daa", data)
                              // this.handleChange("notes", data)
                              let e = {
                                target: {
                                  value: data,
                                },
                              };
                              this.handleInputChange(e, "notes");
                            }}
                            data={this.getNotesForVerifyPMR() || ""}
                          />
                        )}
                        {<span className="error">{errors.notes}</span>}
                      </div>
                    </div>}
                    {this.state.isRevised ? (
                      <>
                        <div className="form-group my-4 col-md-12">
                          <label
                            htmlFor="summary"
                            className="col-12 col-form-label"
                          >
                            Reason of Revision{" "}
                            <span className="requiredField">*</span>
                          </label>
                          <div className="col-12">
                            <Input
                              className="is-valid"
                              disabled={!this?.state?.isRevised}
                              type="text"
                              tabIndex="2"
                              placeholder="Enter Revised Reason"
                              onChange={(e) => {
                                this.handleInputChange(e, "reviseReason");
                              }}
                            />
                            {
                              <span className="error">
                                {errors.reviseReason}
                              </span>
                            }
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                  {!this.state.isRevised ? (
                    <div className="text-right d-flex justify-content-end">
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => {
                          // errors.notes = "";
                          // errors.reviseReason = "";
                          // errors.version = "";
                          this.setState({
                            showPmrVerify: false,
                            // isRevised: false,
                            // errors,
                          });
                        }}
                        style={{
                          marginRight: "5px",
                          display: this.state.isEdit ? "block" : "none",
                        }}
                      >
                        <i className="fa fa-dot-circle-o"></i> cancel{" "}
                      </Button>
                      <Button
                        type="button"
                        color="primary"
                        onClick={() => {
                          this.updateDataAndRefreshPage(async () =>
                            this.verifyPmr()
                          );
                        }}
                        style={{
                          marginRight: "5px",
                          display: this.state.isEdit ? "block" : "none",
                        }}
                      >
                        <i className="fa fa-dot-circle-o"></i> Verify
                      </Button>
                      {/* <Button
                        type="button"
                        color="primary"
                        onClick={() => {
                          this.setState({
                            isRevised: true,
                          });
                        }}
                        style={{
                          display: this.state.isEdit ? "block" : "none",
                        }}
                      >
                        <i className="fa fa-dot-circle-o"></i> Revision
                      </Button> */}
                    </div>
                  ) : (
                    <div className="form-group my-4 col-md-12 text-right d-flex justify-content-end">
                      <Button
                        type="button"
                        color="primary"
                        onClick={() => {
                          this.revisedPmr();
                        }}
                        style={{
                          marginRight: "5px",
                          display: this.state.isEdit ? "block" : "none",
                        }}
                      >
                        <i className="fa fa-dot-circle-o"></i>
                        Revise PMR
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => {
                          errors.notes = "";
                          errors.reviseReason = "";
                          errors.version = "";
                          this.setState({
                            isRevised: false,
                            version:
                              this?.state?.patientPMRReports?.[
                                this?.state?.PMRINDEX
                              ]?.pmrCurrentVersion,
                            notes:
                              this?.state?.patientPMRReports?.[
                                this?.state?.PMRINDEX
                              ]?.notes || ``,
                            errors,
                          });
                        }}
                        style={{
                          marginRight: "5px",
                          display: this.state.isEdit ? "block" : "none",
                        }}
                      >
                        <i className="fa fa-dot-circle-o"></i> cancel{" "}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.showPmrApprove}
          className="modal-dialog modal-lg"
        >
          <ModalHeader
            toggle={() => {
              this.setState({
                showPmrApprove: false,
                isRevised: false,
              });
            }}
          >
            Approve PMR
          </ModalHeader>
          <ModalBody>
            <Form>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group row my-4">
                    <div className="col-md-3">
                      <label htmlFor="date" className="col-12 col-form-label">
                        Version
                      </label>
                      <div className="col-12">
                        <Input
                          type="text"
                          readOnly="true"
                          placeholder="Version"
                          name="Version"
                          value={this.state.version}
                        />
                      </div>
                    </div>
                    <div className="col-md-9">
                      <label htmlFor="date" className="col-12 col-form-label">
                        File Name
                      </label>
                      <div className="col-12">
                        {/* onChange={(e) => {
                                                    this.handleInputChange(e, 'version')
                                                }} */}
                        <Input
                          type="text"
                          // onChange={(e) => {
                          //   let numberRegex =
                          //     /^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d+)?\s*$/;
                          //   let isNumber = function (s) {
                          //     return numberRegex.test(s);
                          //   };
                          //   if (
                          //     isNumber(e.target.value) ||
                          //     e.target.value.trim() === ""
                          //   ) {
                          //     e.target.value = e.target.value.trim();
                          //     this.handleInputChange(e, "version");
                          //   }
                          // }}
                          readOnly={true}
                          placeholder="File Name"
                          name="Version"
                          value={this.spliceFromSash(
                            this.state?.verifyPmrPath
                          ) || ""}
                          style={{ overflowX: "auto" }}
                        />
                        {<span className="error">{errors?.version} </span>}
                      </div>
                    </div>




                  </div>

                </div>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter>
            <div className="text-right">
              <Button
                type="button"
                color="success"
                onClick={() => {
                  this.updateDataAndRefreshPage(() => this.approvePmr());
                }}
                style={{ marginRight: "5px" }}
              >
                <i className="fa fa-dot-circle-o"></i> Approve
              </Button>
              <Button
                type="button"
                color="danger"
                onClick={() => {
                  this.setState({
                    showPMRRejectReason: true

                  })
                  // this.updateDataAndRefreshPage(() => this.rejecetPMR());
                }}
              >
                <i className="fa fa-dot-circle-o"></i> Reject
              </Button>
            </div>

          </ModalFooter>
        </Modal>



        <Modal
          isOpen={this.state.showPMRRejectReason}
          className="modal-dialog modal-lg"

        >
          <ModalHeader
            toggle={() => {
              this.setState({
                showPMRRejectReason: false,
                PMRapproveNotes: "",
                errors: {
                  ...errors,
                  PMRapproveNotes: ""
                }
              });
            }}
          >
            PMR Reject's Reason
          </ModalHeader>
          <ModalBody>
            <div className="col-md-12" >
              {/* <label className="col-12 col-form-label">
                Reason
              </label> */}
              <div className="col-12">

                <CKEditor
                  editor={ClassicEditor}
                  // data={item.description || ""}
                  config={{ placeholder: "Write something..." }}
                  //onReady={editor => {
                  // You can store the "editor" and use when it is needed.
                  //console.log('Editor is ready to use!', editor);
                  //}}
                  onChange={(event, editor) => {
                    const data = editor?.getData();
                    this.handleApprovePMRChange("PMRapproveNotes", data)
                  }}
                  data={this?.state?.PMRapproveNotes}
                />
                <span className="error">{errors.PMRapproveNotes}</span>


              </div>


            </div>


          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                this.setState({
                  showPMRRejectReason: false,
                  PMRapproveNotes: "",
                  errors: {
                    ...errors,
                    PMRapproveNotes: ""
                  }
                })
                // this.updateDataAndRefreshPage(() => this.rejecetPMR());
              }}
            >
              <i className="fa fa-dot-circle-o"></i> Cancel

            </Button>
            <Button
              type="button"
              color="danger"
              onClick={() => {
                this.updateDataAndRefreshPage(() => this.rejecetPMR());
              }}
            >
              <i className="fa fa-dot-circle-o"></i> Reject
            </Button>

          </ModalFooter>

        </Modal>


        <Modal
          isOpen={this.state.showPaidStatus}
          className="modal-dialog modal-md"
        >
          <ModalHeader>Payment</ModalHeader>
          <ModalBody>
            <Form>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group row my-4">
                    <div className="col-md-12">
                      {/* <label htmlFor="date" className=" w-100 col-form-label">is the payment in full ? </label> */}
                      <div class="form-check-inline w-100">
                        <label class="form-check-label">
                          <Input
                            type="radio"
                            class="form-check-input"
                            onChange={(e) => {
                              this.handleInputChange(e, "paymentType");
                            }}
                            name="paymentType"
                            value={"y"}
                          />
                          Full Payment
                        </label>
                      </div>
                      <div class="form-check-inline w-100">
                        <label class="form-check-label">
                          <Input
                            type="radio"
                            class="form-check-input"
                            checked={this.state.paymentType == "n"}
                            name="paymentType"
                            onChange={(e) => {
                              this.handleInputChange(e, "paymentType");
                            }}
                            value={"n"}
                          />
                          Analysis Payment
                        </label>
                      </div>

                      {/* <div className="col-12">
                        <label>
                          Yes
                        </label>
                        <Input type="radio" name="Version" value={'y'} />
                        <label>
                          No
                        </label>
                        <Input type="radio" name="Version" value={'n'} />
                      </div> */}
                    </div>
                  </div>
                  <div className="text-right">
                    <Button
                      color="primary"
                      onClick={() => {
                        this.setState({
                          showConfirmPayment: true,
                          showPaidStatus: false,
                        });
                      }}
                      style={{ marginRight: "5px" }}
                    >
                      <i className="fa fa-dot-circle-o"></i> Submit
                    </Button>
                    <Button
                      className="btn  btn-secondary"
                      onClick={() => {
                        this.setState({
                          showPaidStatus: false,
                          paymentType: "n",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.showConfirmPayment}
          className="modal-dialog modal-md"
        >
          <ModalHeader>Confirm Payment</ModalHeader>
          <ModalBody>
            <Form>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group row my-4">
                    <div className="col-md-12">
                      Please confirm,{" "}
                      {this.state.paymentType === "y"
                        ? `did you received Full`
                        : "This is just an Analysis Payment and not a Full"}{" "}
                      payment ?
                    </div>
                  </div>
                  <div className="text-right">
                    <Button
                      type="button"
                      color="primary"
                      onClick={() => {
                        this.setState({
                          analysisOrderStatus: {
                            ...this.state.analysisOrderStatus,
                            paymentRecived: {
                              checked: true,
                            },
                          },
                          showConfirmPayment: false,
                          showPaidStatus: false,
                        });
                      }}
                      style={{ marginRight: "5px" }}
                    >
                      <i className="fa fa-dot-circle-o"></i> Yes
                    </Button>
                    <Button
                      type="button"
                      className="btn  btn-secondary"
                      onClick={() => {
                        this.setState({
                          showConfirmPayment: false,
                          paymentType: "n",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          </ModalBody>
        </Modal>
        <Modal isOpen={showdisease} className="modal-dialog modal-md">
          <ModalHeader>Update Disease </ModalHeader>
          <ModalBody>
            <Form className="form-horizontal">
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Disease<span className="requiredField">*</span>
                </label>
                <Autocomplete
                  value={this.state.currentDiseaseName}
                  className="custom-autocomplete"
                  clearOnBlur
                  selectOnFocus
                  onChange={(event, newValue) => {
                    console.log({ newValue }, "ON change in disease");
                    this.handleDiseaseInputChange({
                      target: {
                        value: newValue?.id,
                        diseaseName: newValue?.inputValue || newValue?.name,
                        name: "diseaseId",
                        updateDisease: !!newValue?.updateDisease,
                      },
                    });
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
                  filterOptions={(options, params) => {
                    console.log({ options, params });

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

                      console.log({ filtered });

                      let search = String(this.state.currentDiseaseName);
                      let reg = new RegExp(`^${search}`);
                      let updates = [];

                      // options.filter(obj => {
                      //     let str = String(obj.name).slice(0, search.length)
                      //     let result = reg.test(str)
                      //     // str.match(reg)
                      //     console.log({ result, str, obj, search })
                      //     return result
                      // }).map(ele => {
                      //     return {
                      //         ...ele,
                      //         inputValue, updateDisease: true,
                      //         name: `Update "${ele.name}" to "${inputValue}"`

                      //     }
                      // })
                      console.log({ updates });
                      filtered = [...filtered, ...updates];
                      filtered.push({
                        inputValue,
                        diseaseCatId: 0,
                        id: 0,
                        name: `Add new Disease: "${inputValue}"`,
                      });
                    }
                    console.log("Return ", { filtered });

                    return filtered;
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  )}
                  id="free-solo-with-text-demo"
                  options={dieseasData.filter(
                    (e) => e.diseaseCatId == this.state?.diseaseCategoryId
                  )}
                  getOptionLabel={(option) => {
                    // console.log({ option }, "select disease in auto")
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
                  sx={{
                    width: 300,
                    border:
                      this.state?.updateDisease || this.state?.diseaseId == "0"
                        ? "1px solid #4dbd74"
                        : "none",
                    borderRadius: "10px",
                  }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Disease" />
                  )}
                />

                {errors?.diseaseId?.length > 0 && (
                  <span className="error">{errors.diseaseId}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Disease
                </label>
                <span
                  className="mx-lg-2"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="This disease name will only be used in patient's report, Please make it more readable by adding space."
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-info-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                  </svg>
                </span>
                <Input
                  type="text"
                  autocomplete="off"
                  name="diseaseNameforReportUse"
                  value={this.state.diseaseNameforReportUse}
                  onChange={this.handleDiseaseInputChange.bind(this)}
                  placeholder="Enter disease name"
                  tabIndex="2"
                  maxLength="100"
                />
              </div>
              {/* {this.state.diseaseId !== null && Number(this.state.diseaseId || 1) === 0 ? */}
              {false ? (
                <Row>
                  <FormGroup
                    style={{ display: "flex", alignItems: "end " }}
                    className="w-100"
                  >
                    <div className="col-12">
                      <label className=" col-form-label">
                        New Disease<span className="requiredField">*</span>
                      </label>

                      <div className="">
                        <Input
                          autoComplete="off"
                          className="form-control here"
                          type="text"
                          maxLength="100"
                          name="newDisease"
                          placeholder="Enter new disease"
                          value={this.state.newDisease}
                          onChange={this.handleInputChangeForOtherDisease.bind(
                            this
                          )}
                        />
                        {errors.newDisease?.length > 0 && (
                          <span className="error">{errors.newDisease}</span>
                        )}
                      </div>
                    </div>
                  </FormGroup>
                </Row>
              ) : null}
              {/* {Array.isArray(allTissues) && allTissues.length > 0 && */}
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Tissue<span className="requiredField">*</span>
                </label>
                <Input
                  type="select"
                  className={
                    errors.tissue
                      ? "custom-select is-invalid mb-3"
                      : "custom-select is-valid mb-3"
                  }
                  name="Tissue"
                  onChange={this.handleDiseaseInputChange.bind(this)}
                  value={this.state.Tissue}
                >
                  {/* {console.log("isueeeeeeeeeeeeee", this.state.Tissue)} */}
                  <option value={""}>Select Tissue</option>
                  {allTissues?.map((data, i) => {
                    // var nameObject = Alldiseases.filter((obj) => obj.diseaseCatId == thuis.stat5a.sdsdsdfdf)
                    return (
                      <option
                        key={i}
                        value={data.id}
                        selected={data.id == this.state.Tissue}
                      >
                        {data.name}
                        {/* - {data.id} */}
                      </option>
                    );
                  })}
                </Input>
                {errors?.tissue?.length > 0 && (
                  <span className="error">{errors.tissue}</span>
                )}
              </div>
              <div

                style={{
                  display: [2, 3, 13].includes(
                    Number(this.state.diseaseCategoryId)
                  )
                    ? "block"
                    : "none",
                }}
              >


                <FormGroup>
                  <Label>
                    Metastasis{" "}
                    {/* <span className="requiredField">*</span> */}
                  </Label>
                  <br />
                  <div className="custom-control custom-radio ">
                    {this.state.handleMetastasis == "yes" ? (
                      <Input
                        type="radio"
                        className="custom-control-input"
                        value="yes"
                        checked
                        onChange={this.handleInputChange.bind(this)}
                        name="handleMetastasis"
                        id="Yes"
                      />
                    ) : (
                      <Input
                        type="radio"
                        className="custom-control-input"
                        value="yes"
                        onChange={this.handleInputChange.bind(this)}
                        name="handleMetastasis"
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
                    {this.state.handleMetastasis == "no" ? (
                      <Input
                        type="radio"
                        value="no"
                        checked
                        className="custom-control-input"
                        onChange={this.handleInputChange.bind(this)}
                        name="handleMetastasis"
                        id="No"
                      />
                    ) : (
                      <Input
                        type="radio"
                        value="no"
                        className="custom-control-input"
                        onChange={this.handleInputChange.bind(this)}
                        name="handleMetastasis"
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
              </div>

              {this.state.callPipeline == true ||
                this.state.recallPipeline == true ? (
                <div
                  className="form-group"
                  style={{
                    display: [2, 3, 13].includes(
                      Number(this.state.diseaseCategoryId)
                    )
                      ? "block"
                      : "none",
                  }}
                >
                  <label
                    htmlFor="recipient-name"
                    className="form-control-label"
                  >
                    use RNA Blood instead of RNA Tumor and ctDNA instead of WES
                    Tumor (for inoperable patients)
                  </label>
                  <hr />

                  <div class="custom-control custom-radio mb-2">
                    <input
                      id="yespipeline"
                      type="radio"
                      className="custom-control-input"
                      disabled
                      checked={this.state?.diseaseCategoryId == 2}
                    />
                    <label
                      for="yespipeline"
                      className="custom-control-label"
                      style={{ fontWeight: 500 }}
                    >
                      Yes
                    </label>
                  </div>

                  <div class="custom-control custom-radio mb-2">
                    <input
                      id="Nopipeline"
                      type="radio"
                      className="custom-control-input "
                      disabled
                      checked={this.state?.diseaseCategoryId == 3}
                    />
                    <label
                      for="Nopipeline"
                      className="custom-control-label"
                      style={{ fontWeight: 500 }}
                    >
                      No
                    </label>
                  </div>
                </div>
              ) : (
                ""
              )}
            </Form>
            {/* } */}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseDisease}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={() => {
                if (
                  this.state.diseaseId !== null &&
                  Number(this.state.diseaseId || 1) === 0
                ) {
                  this.handleSubmitNewDisease();
                } else if (
                  this.state.diseaseId !== null &&
                  this.state.diseaseId > 0
                ) {
                  this.handleSubmitUpdateDisease();
                } else {
                  this.handleSubmitUpdateDisease();

                  // this.AddPatientDisease()
                }
              }}
            // onClick={this.AddPatientDisease.bind(this)}
            >
              {/* {this.state.diseasUpdateBtnTxt} */}
              {this.state.callPipeline && "Update and Run Pipeline"}
              {this.state.recallPipeline && "Update and Re-run Pipeline"}
              {this.state.recallPipeline == false &&
                this.state.callPipeline == false &&
                "Update"}
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.showdiseaseDescription}
          className="modal-dialog modal-lg"
        >
          <ModalHeader>Update Disease Description </ModalHeader>
          <ModalBody style={{ maxHeight: "70vh", overflow: "auto" }} >
            <Form className="form-horizontal">
              <div className="form-group">
                {/* <label htmlFor="recipient-name" className="form-control-label">
                                    Disease Description<span className="requiredField">*</span>
                                </label> */}
                <CKEditor
                  editor={ClassicEditor}
                  name="DiseaseDescData"
                  // cols="89"
                  style={{ width: "auto" }}
                  // rows="7"
                  onChange={(e, editor) => {
                    const data = editor.getData();
                    // errors.diseaseDesc = data.replace(/<[^>]*>/g, '').trim() ? "" : "Please enter disease description."
                    this.setState({ DiseaseDescData: data });
                  }}
                  config={{
                    placeholder: "Enter Disease Description....",
                  }}
                  // maxLength="500"

                  data={this.state?.DiseaseDescData}
                ></CKEditor>
              </div>
            </Form>
            {/* } */}
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={this.handleCloseDiseaseDescription}
            >
              Close
            </Button>
            <Button
              color="primary"
              disabled={this.state?.DiseaseDescData?.trim() == "" || loading}
              onClick={this.UpdatePatientDiseaseDescription.bind(this)}
            >
              {"Update"}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Update Status Model popup */}
        <Modal
          isOpen={this.state.showUpdateStatusModel}
          className="modal-dialog modal-md"
        >
          <ModalHeader>Change Status </ModalHeader>
          <ModalBody>
            <div className="form-group">
              Are you sure you want to change the status to{" "}
              <b>{this.state.newStatus} </b>?
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseUpdateStatus}>
              Close
            </Button>
            <Button color="primary" onClick={this.handleSubmitStatus}>
              Change Status
            </Button>
          </ModalFooter>
        </Modal>
        {/* ENDDD */}

        <Modal isOpen={UploadFile} className="modal-dialog modal-md">
          <ModalHeader>
            {" "}
            {_.capitalize(String(this.state?.UploadFileFor))}
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Upload File
              </label>
              <label
                htmlFor="FileUpload"
                className="fileuploadlabel"
                onDragEnter={this.handleDrag}
                onDrop={this.handleDrop}
                onDragLeave={this.handleDrag}
                onDragOver={this.handleDrag}
              >
                {this.state?.file?.name ? (
                  this.state?.file?.name
                ) : this.state?.drag ? (
                  "Drop file here to Upload"
                ) : (
                  <p>Drag and drop your file here or Click to Upload a file </p>
                )}
                <Input
                  type="file"
                  id="FileUpload"
                  name="UploadFile"
                  className="form-control fileuploadinput"
                  tabIndex="1"
                  multiple={false}
                  onChange={this.handleFileChange}
                />
              </label>

              {/* <a href={demoImportFile} download>Download Import Demo File</a> */}
              {uploadError?.length > 0 ? (
                <span className="error">{uploadError}</span>
              ) : this.state.file?.name ? (
                <div
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    this.setState({
                      pdfPrivew: true,
                      url: URL.createObjectURL(this.state.file),
                    });
                  }}
                >
                  Preview File
                </div>
              ) : (
                ""
              )}
            </div>
            {/* } */}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseUploadFile}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={(e) => {
                this.filesUploadReportFile();
              }}
              disabled={!this.state.file?.name}
            >
              Upload
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={deleteFileModel} className="modal-dialog modal-md">
          <ModalHeader>Delete File</ModalHeader>
          <ModalBody>
            <div>
              <p> Are you sure you want to delete this file ?</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseDeleteFile}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.DeleteReportfile();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={showpractitioner} className="modal-dialog modal-md">
          <ModalHeader>Assign Practitioner </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <Input
                type="text"
                className="form-control"
                placeholder="Search here..."
                name="practitionerSearch"
                value={practitionerSearch}
                onChange={this.handlePractitionerInputChange.bind(this)}
              ></Input>
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Practitioner
              </label>
              <Input
                type="select"
                className="custom-select mb-3"
                name="practitionerId"
                value={practitionerId}
                onChange={this.handlePractitionerInputChange.bind(this)}
              >
                <option value="">Select Practitioner</option>
                {filteredpractitioners.map((data, i) => {
                  return (
                    <option key={i} value={data.practitionerId}>
                      {data.firstName + " " + data.lastName}
                    </option>
                  );
                })}
              </Input>
              {errors.practitionerId.length > 0 && (
                <span className="error">{errors.practitionerId}</span>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClosePractitioner}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={this.AddPatientPractitioner.bind(this)}
            >
              Add
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={showinstitute} className="modal-dialog modal-md">
          <ModalHeader>Assign Institute</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <Input
                type="text"
                className="form-control"
                placeholder="search here..."
                name="instituteSearch"
                value={instituteSearch}
                onChange={this.handleInstituteInputChange.bind(this)}
              ></Input>
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Institute
              </label>
              <Input
                type="select"
                className="custom-select mb-3"
                name="instituteId"
                value={instituteId}
                onChange={this.handleInstituteInputChange.bind(this)}
              >
                <option value="">Select Institute</option>
                {filteredinstitutes?.map((data, i) => {
                  return (
                    <option key={i} value={data.instituteId}>
                      {data.instituteName}
                    </option>
                  );
                })}
              </Input>
              {errors.instituteId.length > 0 && (
                <span className="error">{errors.instituteId}</span>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseInstitute}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={this.AddPatientInstitute.bind(this)}
            >
              Add
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={stopPipelinemodal} className="modal-dialog modal-md ">
          <ModalHeader>Stop Pipeline</ModalHeader>
          <ModalBody>Are you sure you want to stop Processing data?</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClosePiplineStop}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.stopPiplineCall();
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={canclePiplinemodal} className="modal-dialog modal-md ">
          <ModalHeader>Cancel Pipeline</ModalHeader>
          <ModalBody>
            Are you sure you want to cancel Processing data?
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClosePiplineCancle}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.canclePiplineCall();
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={showngslaboratory}
          className="modal-dialog modal-md left-modal"
        >
          <ModalHeader>Assign Laboratory</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <Input
                type="text"
                className="form-control"
                placeholder="search here..."
                name="ngslaboratorySearch"
                value={ngslaboratorySearch}
                onChange={this.handlengsLaboratoryInputChange.bind(this)}
              ></Input>
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                ngsLaboratory
              </label>
              <Input
                disabled={patientSamples.length <= 0 ? true : false}
                type="select"
                className="custom-select mb-3"
                name="ngslaboratoryId"
                value={ngslaboratoryId}
                onChange={this.handlengsLaboratoryInputChange.bind(this)}
              >
                <option value="">Select Laboratory</option>
                {filteredngslaboratorys.map((data, i) => {
                  return (
                    <option key={i} value={data.ngsLaboratoryId}>
                      {data.ngsLabName}
                    </option>
                  );
                })}
              </Input>
              {errors.ngslaboratoryId.length > 0 && (
                <span className="error">{errors.ngslaboratoryId}</span>
              )}
              {patientSamples.length <= 0 ? (
                <span className="error">Please assign sample first.</span>
              ) : null}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClosengsLaboratory}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={this.AddPatientngsLaboratory.bind(this)}
            >
              Add
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={showmanufacture} className="modal-dialog modal-md">
          <ModalHeader>Assign Manufacture</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <Input
                type="text"
                className="form-control"
                placeholder="search here..."
                name="manufactureSearch"
                value={manufactureSearch}
                onChange={this.handleManufactureInputChange.bind(this)}
              ></Input>
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Manufacture
              </label>
              <Input
                type="select"
                className="custom-select mb-3"
                name="manufacturerId"
                value={manufacturerId}
                onChange={this.handleManufactureInputChange.bind(this)}
              >
                <option value="">Select Manufacture</option>
                {filteredmanufactures?.map((data, i) => {
                  return (
                    <option key={i} value={data.manufacturerId}>
                      {data.companyName}
                    </option>
                  );
                })}
              </Input>
              {errors.manufacturerId.length > 0 && (
                <span className="error">{errors.manufacturerId}</span>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseManufacture}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={this.AddPatientManufacture.bind(this)}
            >
              Add
            </Button>
          </ModalFooter>
        </Modal>
        <div className="modl-left modal-left">
          <Modal
            isOpen={showdiagnostic}
            className="modal-dialog modal-lg left-modal"
          >
            <ModalHeader>Add Diagnostic</ModalHeader>
            <ModalBody className="" style={{ backgroundColor: "white" }}>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Diagnostic Date
                </label>
                {/* <Input type="date" name="diagnosticDate" tabIndex="1" min="1000-01-01" max="9999-12-31" className="form-control" value={diagnosticDate} onChange={this.handleDiagnosticInputChange.bind(this)} placeholder="Enter a diagnostic date" /> */}
                <div className="cus-date-picker">
                  <DatePicker
                    selected={diagnosticDate}
                    onChange={this.handleDiagnosticDateChange.bind(this)}
                    dateFormat="MM/dd/yyyy"
                    placeholderText="mm/dd/yyyy"
                    className={`form-control  ${isEditDateClass}  `}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    fixedHeight
                  />
                </div>
                {errors.diagnosticDate.length > 0 && (
                  <span className="error">{errors.diagnosticDate}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Diagnostic Analysis <span className="requiredField">*</span>
                </label>
                <Input
                  type="textarea"
                  name="diagnosticAnalysis"
                  tabIndex="2"
                  rows="5"
                  className={
                    errors.diagnosticAnalysis ? "is-invalid" : "is-valid"
                  }
                  value={diagnosticAnalysis}
                  onChange={this.handleDiagnosticInputChange.bind(this)}
                  placeholder="Enter a diagnostic analysis"
                  maxLength="2000"
                />
                {errors.diagnosticAnalysis.length > 0 && (
                  <span className="error">{errors.diagnosticAnalysis}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Outcome <span className="requiredField">*</span>
                </label>
                <Input
                  type="textarea"
                  name="outcome"
                  tabIndex="3"
                  rows="5"
                  className={errors.outcome ? "is-invalid" : "is-valid"}
                  value={outcome}
                  onChange={this.handleDiagnosticInputChange.bind(this)}
                  placeholder="Enter a outcome"
                  maxLength="2000"
                />
                {errors.outcome.length > 0 && (
                  <span className="error">{errors.outcome}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Diagnostic File
                </label>
                <Input
                  type="file"
                  name="diagnosticdocumentFile"
                  id="File"
                  className="form-control"
                  accept="application/pdf"
                  multiple="multiple"
                  style={{ paddingBottom: "35px" }}
                  tabIndex="4"
                  onChange={this.handleDiagnosticFileInputChange.bind(this)}
                />
              </div>
              {showdiagnosticerror != "" && (
                <div>
                  <span className="error">{showdiagnosticerror}</span>
                </div>
              )}
            </ModalBody>
            <ModalFooter style={{ backgroundColor: "white" }}>
              <Button color="secondary" onClick={this.handleCloseDiagnostic}>
                Close
              </Button>
              {loading ? (
                <Button
                  color="primary"
                  disabled
                  onClick={this.AddPatientDiagnostic.bind(this)}
                >
                  Add
                </Button>
              ) : (
                <Button
                  color="primary"
                  onClick={this.AddPatientDiagnostic.bind(this)}
                >
                  Add
                </Button>
              )}
            </ModalFooter>
          </Modal>
        </div>

        <div className="modl-left modal-left">
          <Modal
            isOpen={this.state.showeditdiagnostic}
            className="modal-dialog modal-lg left-modal"
          >
            <ModalHeader>Edit Diagnostic</ModalHeader>
            {/* {diagnosticHistory.map((data) => {
              return (
                <React.Fragment> */}
            <ModalBody className="" style={{ backgroundColor: "white" }}>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Diagnostic Date
                </label>
                {/* <Input type="date" name="diagnosticDate" tabIndex="1" min="1000-01-01" max="9999-12-31" className="form-control" value={diagnosticDate} onChange={this.handleDiagnosticInputChange.bind(this)} placeholder="Enter a diagnostic date" /> */}
                <div className="cus-date-picker">
                  <DatePicker
                    selected={diagnosticDate}
                    onChange={this.handleDiagnosticDateChange.bind(this)}
                    dateFormat="MM/dd/yyyy"
                    placeholderText="mm/dd/yyyy"
                    className={`form-control   ${isEditDateClass}  `}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    fixedHeight
                  />
                </div>
                {errors.diagnosticDate.length > 0 && (
                  <span className="error">{errors.diagnosticDate}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Diagnostic Analysis <span className="requiredField">*</span>
                </label>
                <Input
                  type="textarea"
                  name="diagnosticAnalysis"
                  tabIndex="2"
                  rows="5"
                  className={
                    errors.diagnosticAnalysis ? "is-invalid" : "is-valid"
                  }
                  value={diagnosticAnalysis}
                  onChange={this.handleDiagnosticInputChange.bind(this)}
                  placeholder="Enter a diagnostic analysis"
                  maxLength="2000"
                />
                {errors.diagnosticAnalysis.length > 0 && (
                  <span className="error">{errors.diagnosticAnalysis}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Outcome <span className="requiredField">*</span>
                </label>
                <Input
                  type="textarea"
                  name="outcome"
                  tabIndex="3"
                  rows="5"
                  className={errors.outcome ? "is-invalid" : "is-valid"}
                  value={outcome}
                  onChange={this.handleDiagnosticInputChange.bind(this)}
                  placeholder="Enter a outcome"
                  maxLength="2000"
                />
                {errors.outcome.length > 0 && (
                  <span className="error">{errors.outcome}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Diagnostic File
                </label>
                <Input
                  type="file"
                  name="diagnosticdocumentFile"
                  id="File"
                  className="form-control"
                  accept="application/pdf"
                  multiple="multiple"
                  style={{ paddingBottom: "35px" }}
                  tabIndex="4"
                  onChange={this.handleDiagnosticFileInputChange.bind(this)}
                />
              </div>
              {showdiagnosticerror != "" && (
                <div>
                  <span className="error">{showdiagnosticerror}</span>
                </div>
              )}
              <b>Uploaded Files: </b>
              <hr />
              <table className="table table-bordered">
                <th># </th>
                <th> File name </th>
                <th> Action </th>
                <tbody>
                  {diagnosticDocFiles.map((data, i) => {
                    return (
                      <>
                        {data?.patientDiagnosticHistoryFile?.length > 0 ? (
                          data?.patientDiagnosticHistoryFile?.map(
                            (data2, i2) => {
                              // console.log("data2", this.state.PatientInsuranceId)

                              return data2.patientDiagnosticId ==
                                this.state.patientDiagnosticId &&
                                this.state.patientDiagnosticId !== 0 ? (
                                <tr key={i2}>
                                  <td>{i2 + 1}</td>
                                  <td className="mr-3">{data2.fileName}</td>
                                  <td>
                                    <a
                                      href={window.$FileUrl + data2.filePath}
                                      download
                                      target="_blank"
                                      className="kt-widget4__title"
                                    >
                                      <i
                                        className="fa fa-download mr-2"
                                        aria-hidden="true"
                                      >
                                        {" "}
                                      </i>
                                    </a>
                                    <Link
                                      to="#"
                                      onClick={(e) =>
                                        this.toggleDiagonosticFile(
                                          e,
                                          data2.patientDiagnosticFileId
                                        )
                                      }
                                    >
                                      <i className="icon-trash" />
                                    </Link>
                                  </td>
                                </tr>
                              ) : (
                                ""
                              );
                            }
                          )
                        ) : (
                          <tr>
                            <td colSpan={3} style={{ textAlign: "center" }}>
                              {" "}
                              No files...
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>

              {/* {diagnosticDocFiles?.length > 0 ? (
                diagnosticDocFiles
                  .map((data, i) => {
                    return (
                      <div className="kt-widget4 mr-20">
                        {

                          data?.patientDiagnosticHistoryFile

                            ?.map((data2, i2) => {
                              // console.log("data2", this.state.PatientInsuranceId)
                              let a = (data2.fileName).indexOf("Patient_Insurance");
                              let b = (data2.fileName)
                              return (data2.patientDiagnosticId
                                == this.state.patientDiagnosticId
                                && this.state.patientDiagnosticId !== 0 ?
                                <div className="kt-widget4__item d-flex align-items-center justify-content-start" key={i2}>
                                  <div className="kt-widget4__pic kt-widget4__pic--icon">
                                    <h5>{i2 + 1}.)</h5>{" "}
                                  </div>
                                  <span className='mr-3'>
                                    {
                                      data2.fileName
                                    }
                                  </span>
                                  <div className=''>
                                    <a href={window.$FileUrl + data2.filePath} download target="_blank" className="kt-widget4__title">
                                      <i className="fa fa-download mr-2" aria-hidden="true"></i>
                                    </a>
                                   

                                    <Link
                                      className="card-header-action btn btn-close"
                                      to="#"
                                      onClick={(e) => this.toggleDiagonosticFile(e, data2.patientDiagnosticFileId)}>
                                      <i className="icon-trash"></i>
                                    </Link>
                                    {this.state.DeletemodalforDiagnosticFile &&
                                      <div style={{ marginLeft: "36%" }}>
                                        <Modal isOpen={this.state.DeletemodalforDiagnosticFile} style={{ width: "500px" }} >
                                          <ModalHeader>Confirm</ModalHeader>
                                          <ModalBody>Are you sure you want to delete this file?</ModalBody>
                                          <ModalFooter>
                                            <Button outline color="danger" onClick={e => this.DeleteDiagnostic_file(e, this.state.deleteDiagnosticFileId)}>Delete</Button>
                                            <Button color="secondary" onClick={this.toggleDiagonosticFile}>Cancel</Button>
                                          </ModalFooter>
                                        </Modal>
                                      </div>
                                    }


                                  </div>
                                </div> : "")
                            })
                        }

                      </div>
                    )
                  })) : (null)} */}
            </ModalBody>
            <ModalFooter style={{ backgroundColor: "white" }}>
              <Button
                color="secondary"
                onClick={() => {
                  this.handleCloseDiagnostic();
                  this.setState({
                    showeditdiagnostic: false,
                    diagnosticDate: "",
                    diagnosticAnalysis: "",
                    outcome: "",
                    patientDiagnosticId: 0,
                  });
                }}
              >
                Close
              </Button>
              {loading ? (
                <Button
                  color="primary"
                  disabled
                  onClick={this.EditPatientDiagnostic.bind(this)}
                >
                  Update
                </Button>
              ) : (
                <Button
                  color="primary"
                  onClick={this.EditPatientDiagnostic.bind(this)}
                >
                  Update
                </Button>
              )}
            </ModalFooter>
            {/* </React.Fragment>
              )
            })} */}
          </Modal>
        </div>

        <Modal
          isOpen={showprescription}
          className="modal-dialog modal-lg left-modal"
        >
          <ModalHeader>Add Prescription</ModalHeader>
          <ModalBody className="modal-body_left_modal">
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Prescription Date
              </label>
              {/* <Input type="date" name="prescribeDate" tabIndex="1" min="1000-01-01" max="9999-12-31" className="form-control" value={prescribeDate} onChange={this.handlePrescriptionInputChange.bind(this)} placeholder="Enter a prescription date" /> */}
              <div className="cus-date-picker">
                <DatePicker
                  selected={prescribeDate}
                  onChange={this.handlePrescribeDateChange.bind(this)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="mm/dd/yyyy"
                  className={`form-control   ${isEditDateClass}  `}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  fixedHeight
                />
              </div>
              {errors.prescribeDate.length > 0 && (
                <span className="error">{errors.prescribeDate}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Prescription Description{" "}
                <span className="requiredField">*</span>
              </label>
              <Input
                type="textarea"
                name="prescriptionDescription"
                tabIndex="2"
                rows="5"
                className={
                  errors.prescriptionDescription ? "is-invalid" : "is-valid"
                }
                value={prescriptionDescription}
                onChange={this.handlePrescriptionInputChange.bind(this)}
                placeholder="Enter a prescription description"
                maxLength="2000"
              />
              {errors.prescriptionDescription.length > 0 && (
                <span className="error">{errors.prescriptionDescription}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Prescription File
              </label>
              <Input
                type="file"
                name="prescriptiondocumentFile"
                id="File"
                className="form-control"
                accept="application/pdf"
                multiple="multiple"
                style={{ paddingBottom: "35px" }}
                tabIndex="3"
                onChange={this.handlePrescriptionFileInputChange.bind(this)}
              />
            </div>
            {showprescriptionerror != "" && (
              <div>
                <span className="error">{showprescriptionerror}</span>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClosePrescription}>
              Close
            </Button>
            {loading ? (
              <Button
                color="primary"
                disabled
                onClick={this.AddPatientPrescription.bind(this)}
              >
                Add
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={this.AddPatientPrescription.bind(this)}
              >
                Add
              </Button>
            )}
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.showCustomerCare}
          className="modal-dialog modal-md"
        >
          <ModalHeader>Update Customer Care </ModalHeader>
          <ModalBody>
            <Form className="form-horizontal">
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">
                  Customer Care<span className="requiredField">*</span>hi
                </label>
              </div>

              <Input
                type="select"
                onChange={(e) => this.handleCcChange(e)}
                // className={
                //     errors.tissue
                //         ? "custom-select is-invalid mb-3"
                //         : "custom-select is-valid mb-3"
                // }
                name="CustomerCare"
              // onChange={this.handleDiseaseInputChange.bind(this)}
              // value={this.state.customerCare}
              >
                {/* <option value={""}  >Select Customer Care</option> */}
                {this.state.costumerCare?.map((cc) => {
                  return (
                    <option
                      value={cc.userId}
                      selected={this.state.ccId === cc.userId}
                    >
                      {cc.fullName}
                    </option>
                  );
                })}
              </Input>
            </Form>
            {/* } */}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseCustomerCare}>
              Close
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.updateCustomerCareDetail();
              }}
            >
              {/* {this.state.diseasUpdateBtnTxt} */}
              Update
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.showeditprescription}
          className="modal-dialog modal-lg left-modal"
        >
          <ModalHeader>Edit Prescription</ModalHeader>
          <ModalBody
            className="modal-body_left_modal"
            style={{ backgroundColor: "white" }}
          >
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Prescription Date
              </label>
              {/* <Input type="date" name="prescribeDate" tabIndex="1" min="1000-01-01" max="9999-12-31" className="form-control" value={prescribeDate} onChange={this.handlePrescriptionInputChange.bind(this)} placeholder="Enter a prescription date" /> */}
              <div className="cus-date-picker">
                <DatePicker
                  selected={prescribeDate}
                  onChange={this.handlePrescribeDateChange.bind(this)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="mm/dd/yyyy"
                  className={`form-control  ${isEditDateClass}  `}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  fixedHeight
                />
              </div>
              {errors.prescribeDate.length > 0 && (
                <span className="error">{errors.prescribeDate}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Prescription Description{" "}
                <span className="requiredField">*</span>
              </label>
              <Input
                type="textarea"
                name="prescriptionDescription"
                tabIndex="2"
                rows="5"
                className={
                  errors.prescriptionDescription ? "is-invalid" : "is-valid"
                }
                value={prescriptionDescription}
                onChange={this.handlePrescriptionInputChange.bind(this)}
                placeholder="Enter a prescription description"
                maxLength="2000"
              />
              {errors.prescriptionDescription.length > 0 && (
                <span className="error">{errors.prescriptionDescription}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Prescription File
              </label>
              <Input
                type="file"
                name="prescriptiondocumentFile"
                id="File"
                className="form-control"
                accept="application/pdf"
                multiple="multiple"
                style={{ paddingBottom: "35px" }}
                tabIndex="3"
                onChange={this.handlePrescriptionFileInputChange.bind(this)}
              />
            </div>
            {showprescriptionerror != "" && (
              <div>
                <span className="error">{showprescriptionerror}</span>
              </div>
            )}

            <b>Uploaded Files: </b>
            <hr />
            <table className="table table-bordered">
              <th># </th>
              <th> File name </th>
              <th> Action </th>
              <tbody>
                {prescriptiondocFiles.map((data, i) => {
                  return (
                    <>
                      {data?.patientPrescriptionFile?.length > 0 ? (
                        data?.patientPrescriptionFile?.map((data2, i2) => {
                          // console.log("data2", this.state.PatientInsuranceId)

                          return data2.patientPrescriptionId ==
                            this.state.PatientPrescriptionId &&
                            this.state.PatientPrescriptionId !== 0 ? (
                            <tr key={i2}>
                              <td>{i2 + 1}</td>
                              <td className="mr-3">{data2.fileName}</td>
                              <td>
                                <a
                                  href={window.$FileUrl + data2.filePath}
                                  download
                                  target="_blank"
                                  className="kt-widget4__title"
                                >
                                  <i
                                    className="fa fa-download mr-2"
                                    aria-hidden="true"
                                  >
                                    {" "}
                                  </i>
                                </a>
                                <Link
                                  to="#"
                                  onClick={(e) =>
                                    this.togglePrescriptionFile(
                                      e,
                                      data2.patientPrescriptionFileId
                                    )
                                  }
                                >
                                  <i className="icon-trash" />
                                </Link>
                              </td>
                            </tr>
                          ) : (
                            ""
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} style={{ textAlign: "center" }}>
                            {" "}
                            No files...
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
            {/* {prescriptiondocFiles?.length > 0 ? (
              prescriptiondocFiles
                .map((data, i) => {
                  return (
                    <div className="kt-widget4 mr-20">
                      {

                        data?.patientPrescriptionFile


                          ?.map((data2, i2) => {
                            // console.log("data2", this.state.PatientInsuranceId)
                            let a = (data2.fileName).indexOf("Patient_Insurance");
                            let b = (data2.fileName)
                            return (data2.patientPrescriptionId
                              == this.state.PatientPrescriptionId
                              && this.state.PatientPrescriptionId
                              !== 0 ?
                              <div className="kt-widget4__item d-flex align-items-center justify-content-start" key={i2}>
                                <div className="kt-widget4__pic kt-widget4__pic--icon">
                                  <h5>{i2 + 1}.)</h5>{" "}
                                </div>
                                <span className='mr-3'>
                                  {
                                    data2.fileName
                                  }
                                </span>
                                <div className=''>
                                  <a href={window.$FileUrl + data2.filePath} download target="_blank" className="kt-widget4__title">
                                    <i className="fa fa-download mr-2" aria-hidden="true"></i>
                                  </a>



                                  <Link
                                    className="card-header-action btn btn-close"
                                    to="#"
                                    onClick={(e) => this.togglePrescriptionFile(e, data2.patientPrescriptionFileId)}>
                                    <i className="icon-trash"></i>
                                  </Link>
                                  {this.state.DeletemodalforPrescriptionFile &&
                                    <div style={{ marginLeft: "36%" }}>
                                      <Modal isOpen={this.state.DeletemodalforPrescriptionFile} style={{ width: "500px" }} >
                                        <ModalHeader>Confirm</ModalHeader>
                                        <ModalBody>Are you sure you want to delete this file?</ModalBody>
                                        <ModalFooter>
                                          <Button outline color="danger" onClick={e => this.DeletePrescription_file(e, this.state.deletePrescriptionFileId)}>Delete</Button>
                                          <Button color="secondary" onClick={this.togglePrescriptionFile}>Cancel</Button>
                                        </ModalFooter>
                                      </Modal>
                                    </div>
                                  }


                                </div>
                              </div> : "")
                          })
                      }

                    </div>
                  )
                })) : (null)} */}
          </ModalBody>
          <ModalFooter style={{ backgroundColor: "white" }}>
            <Button
              color="secondary"
              onClick={() => {
                let error = this.state.errors;
                error.prescribeDate = "";
                error.prescriptionDescription = "";
                this.setState({
                  showeditprescription: false,
                  prescriptionDescription: "",
                  prescribeDate: "",
                  PatientPrescriptionId: 0,
                });
              }}
            >
              Close
            </Button>
            {loading ? (
              <Button
                color="primary"
                disabled
                onClick={this.EditPatientPrescription.bind(this)}
              >
                Update
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={this.EditPatientPrescription.bind(this)}
              >
                Update
              </Button>
            )}
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={showtreatment}
          className="modal-dialog modal-lg left-modal"
        >
          <ModalHeader>Add Treatment</ModalHeader>
          <ModalBody style={{ backgroundColor: "white" }}>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Treatment Date
              </label>
              {/* <Input type="date" name="treatmentDate" tabIndex="1" min="1000-01-01" max="9999-12-31" className="form-control" value={treatmentDate} onChange={this.handleTreatmentInputChange.bind(this)} placeholder="Enter a treatment date" /> */}
              <div className="cus-date-picker">
                <DatePicker
                  selected={treatmentDate}
                  onChange={this.handleTreatmentDateChange.bind(this)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="mm/dd/yyyy"
                  className={`form-control   ${isEditDateClass}  `}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  fixedHeight
                />
              </div>
              {errors.treatmentDate.length > 0 && (
                <span className="error">{errors.treatmentDate}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Treatment Detail <span className="requiredField">*</span>
              </label>
              <Input
                type="textarea"
                maxLength="2000"
                name="treatmentDetail"
                tabIndex="2"
                rows="5"
                className={errors.treatmentDetail ? "is-invalid" : "is-valid"}
                value={treatmentDetail}
                onChange={this.handleTreatmentInputChange.bind(this)}
                placeholder="Enter a treatment details"
              />
              {errors.treatmentDetail.length > 0 && (
                <span className="error">{errors.treatmentDetail}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Description <span className="requiredField">*</span>
              </label>
              <Input
                type="textarea"
                name="treatmentDescription"
                tabIndex="3"
                rows="5"
                maxLength="2000"
                className={
                  errors.treatmentDescription ? "is-invalid" : "is-valid"
                }
                value={treatmentDescription}
                onChange={this.handleTreatmentInputChange.bind(this)}
                placeholder="Enter a treatment description"
              />
              {errors.treatmentDescription.length > 0 && (
                <span className="error">{errors.treatmentDescription}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Treatment File
              </label>
              <Input
                type="file"
                name="treatmentdocumentFile"
                id="File"
                accept="application/pdf"
                className="form-control"
                multiple="multiple"
                tabIndex="4"
                style={{ paddingBottom: "35px" }}
                onChange={this.handleTreatmentFileInputChange.bind(this)}
              />
            </div>
            {showtreatmenterror != "" && (
              <div>
                <span className="error">{showtreatmenterror}</span>
              </div>
            )}
          </ModalBody>
          <ModalFooter style={{ backgroundColor: "white" }}>
            <Button color="secondary" onClick={this.handleCloseTreatment}>
              Close
            </Button>
            {loading ? (
              <Button
                color="primary"
                disabled
                onClick={this.AddPatientTreatment.bind(this)}
              >
                Add
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={this.AddPatientTreatment.bind(this)}
              >
                Add
              </Button>
            )}
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.showedittreatment}
          className="modal-dialog modal-lg left-modal"
        >
          <ModalHeader>Edit Treatment</ModalHeader>
          <ModalBody style={{ backgroundColor: "white" }}>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Treatment Date
              </label>
              {/* <Input type="date" name="treatmentDate" tabIndex="1" min="1000-01-01" max="9999-12-31" className="form-control" value={treatmentDate} onChange={this.handleTreatmentInputChange.bind(this)} placeholder="Enter a treatment date" /> */}
              <div className="cus-date-picker">
                <DatePicker
                  selected={treatmentDate}
                  onChange={this.handleTreatmentDateChange.bind(this)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="mm/dd/yyyy"
                  className={`form-control  ${isEditDateClass}  `}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  fixedHeight
                />
              </div>
              {errors.treatmentDate.length > 0 && (
                <span className="error">{errors.treatmentDate}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Treatment Detail <span className="requiredField">*</span>
              </label>
              <Input
                type="textarea"
                maxLength="2000"
                name="treatmentDetail"
                tabIndex="2"
                rows="5"
                className={errors.treatmentDetail ? "is-invalid" : "is-valid"}
                value={treatmentDetail}
                onChange={this.handleTreatmentInputChange.bind(this)}
                placeholder="Enter a treatment details"
              />
              {errors.treatmentDetail.length > 0 && (
                <span className="error">{errors.treatmentDetail}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Description <span className="requiredField">*</span>
              </label>
              <Input
                type="textarea"
                name="treatmentDescription"
                tabIndex="3"
                rows="5"
                maxLength="2000"
                className={
                  errors.treatmentDescription ? "is-invalid" : "is-valid"
                }
                value={treatmentDescription}
                onChange={this.handleTreatmentInputChange.bind(this)}
                placeholder="Enter a treatment description"
              />
              {errors.treatmentDescription.length > 0 && (
                <span className="error">{errors.treatmentDescription}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                Treatment File
              </label>
              <Input
                type="file"
                name="treatmentdocumentFile"
                id="File"
                className="form-control"
                accept="application/pdf"
                multiple="multiple"
                tabIndex="4"
                style={{ paddingBottom: "35px" }}
                onChange={this.handleTreatmentFileInputChange.bind(this)}
              />
            </div>
            <b>Uploaded Files: </b>
            <hr />
            {showtreatmenterror != "" && (
              <div>
                <span className="error">{showtreatmenterror}</span>
              </div>
            )}
            <table className="table table-bordered">
              <th># </th>
              <th> File name </th>
              <th> Action </th>
              <tbody>
                {treatmentdocFiles.map((data, i) => {
                  return (
                    <>
                      {data?.patientTreatmentReportFile?.length > 0 ? (
                        data?.patientTreatmentReportFile?.map((data2, i2) => {
                          return data2.patientTreatmentReportId ==
                            this.state.patientTreatmentReportId &&
                            this.state.patientTreatmentReportId !== 0 ? (
                            <tr key={i2}>
                              <td>{i2 + 1}</td>
                              <td className="mr-3">{data2.fileName}</td>
                              <td className="">
                                <a
                                  href={window.$FileUrl + data2.filePath}
                                  download
                                  target="_blank"
                                  className="kt-widget4__title"
                                >
                                  <i
                                    className="fa fa-download mr-2"
                                    aria-hidden="true"
                                  >
                                    {" "}
                                  </i>
                                </a>
                                <Link
                                  to="#"
                                  onClick={(e) =>
                                    this.toggleTreatementsFile(
                                      e,
                                      data2.patientTreatmentreportFileId
                                    )
                                  }
                                >
                                  <i className="icon-trash" />
                                </Link>
                              </td>
                            </tr>
                          ) : (
                            ""
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} style={{ textAlign: "center" }}>
                            {" "}
                            No files...
                          </td>{" "}
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
            {/* {this.state.dataFiles?.map?.(file => file)} */}
            {/* {treatmentdocFiles?.length > 0 ? (
              treatmentdocFiles
                .map((data, i) => {
                  return (
                    <div className="kt-widget4 mr-20">
                      {

                        data?.patientTreatmentReportFile
                          ?.map((data2, i2) => {
                            // console.log("data2", this.state.PatientInsuranceId)
                            let a = (data2.fileName).indexOf("Patient_Insurance");
                            let b = (data2.fileName)
                            return (data2.patientTreatmentReportId
                              == this.state.patientTreatmentReportId
                              && this.state.patientTreatmentReportId
                              !== 0 ?
                              <div className="kt-widget4__item d-flex align-items-start justify-content-start" key={i2}>
                                <div className="kt-widget4__pic kt-widget4__pic--icon">
                                  <h5>{i2 + 1}.)</h5>{" "}
                                </div>
                                <span className='mr-3'>
                                  {
                                    data2.fileName
                                  }
                                </span>
                                <div className=''>
                                  <a href={window.$FileUrl + data2.filePath} download target="_blank" className="kt-widget4__title">
                                    <i className="fa fa-download mr-2" aria-hidden="true"></i>
                                  </a>

                                  <Link
                                    className="card-header-action btn btn-close"
                                    to="#"
                                    onClick={(e) => this.toggleTreatementsFile(e, data2.patientTreatmentreportFileId)}>
                                    <i className="icon-trash"></i>
                                  </Link>

                                </div>
                              </div> : "")
                          })
                      }

                    </div>
                  )
                })) : (null)} */}
          </ModalBody>
          <ModalFooter style={{ backgroundColor: "white" }}>
            <Button
              color="secondary"
              onClick={() => {
                this.handleCloseTreatment();
                this.setState({
                  showedittreatment: false,
                });
              }}
            >
              Close
            </Button>
            {loading ? (
              <Button
                color="primary"
                disabled
                onClick={this.EditPatientTreatment.bind(this)}
              >
                Update
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={this.EditPatientTreatment.bind(this)}
              >
                Update
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {
          this.state.DeletemodalfortreatmentsFile && (
            <div style={{ marginLeft: "36%" }}>
              <Modal
                isOpen={this.state.DeletemodalfortreatmentsFile}
                style={{ width: "500px" }}
              >
                <ModalHeader>Confirm</ModalHeader>
                <ModalBody>Are you sure you want to delete this file?</ModalBody>
                <ModalFooter>
                  <Button
                    outline
                    color="danger"
                    onClick={(e) =>
                      this.DeleteTreatement_file(
                        e,
                        this.state.deletetreatmentsFileId
                      )
                    }
                  >
                    Delete
                  </Button>
                  <Button color="secondary" onClick={this.toggleTreatementsFile}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          )
        }
        {
          this.state.DeletemodalforDiagnosticFile && (
            <div style={{ marginLeft: "36%" }}>
              <Modal
                isOpen={this.state.DeletemodalforDiagnosticFile}
                style={{ width: "500px" }}
              >
                <ModalHeader>Confirm</ModalHeader>
                <ModalBody>Are you sure you want to delete this file?</ModalBody>
                <ModalFooter>
                  <Button
                    outline
                    color="danger"
                    onClick={(e) =>
                      this.DeleteDiagnostic_file(
                        e,
                        this.state.deleteDiagnosticFileId
                      )
                    }
                  >
                    Delete
                  </Button>
                  <Button color="secondary" onClick={this.toggleDiagonosticFile}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          )
        }
        {
          this.state.DeletemodalforPrescriptionFile && (
            <div style={{ marginLeft: "36%" }}>
              <Modal
                isOpen={this.state.DeletemodalforPrescriptionFile}
                style={{ width: "500px" }}
              >
                <ModalHeader>Confirm</ModalHeader>
                <ModalBody>Are you sure you want to delete this file?</ModalBody>
                <ModalFooter>
                  <Button
                    outline
                    color="danger"
                    onClick={(e) =>
                      this.DeletePrescription_file(
                        e,
                        this.state.deletePrescriptionFileId
                      )
                    }
                  >
                    Delete
                  </Button>
                  <Button color="secondary" onClick={this.togglePrescriptionFile}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          )
        }
        <MyModal
          handleModal={this.handleModalClose.bind(this)}
          //modalAction={this.state.modalAction}
          isOpen={this.state.modal}
          modalBody={this.state.modalBody}
          modalTitle={this.state.modalTitle}
          modalOptions={this.state.modalOptions}
        />

        <Modal
          isOpen={this.state.analysisModal}
          className="modal-dialog modal-md h-500"
        >
          <ModalHeader
            toggle={() => {
              this.setState({
                analysisModal: false,
                analysisText: "",
                analysisHeader: "",
              });
            }}
          >
            {this.state.analysisHeader}
          </ModalHeader>
          <ModalBody>
            <div className="form-group" style={{ wordBreak: "break-word" }}>
              {this.state.analysisText}
            </div>
          </ModalBody>
        </Modal>
      </div >
    );
  }
}

export default View;
