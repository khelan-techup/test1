import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row,
  Table, Button, Input, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter, Form, Collapse, Fade
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build'
import Confirm from "../../CustomModal/Confirm";
import "@reach/dialog/styles.css";
import { toast } from 'react-toastify';
import axiosInstance from "../../../common/axiosInstance"

class PatientHealthIndexReportDetail extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: false,
      userId: 0,
      PatientId: 0,
      PatientAccessionId: 0,
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      show: false,
      isSubmited: false,
      ColumnTitle: "",
      ScoreDetail: "",
      lstBeHiGeneticWesTable: [],
      lstBeHiHlaImmuneTypeTables: [],
      lstBeHIHlaHaplotypeTables: [],
      lstBeHiProteomicsTables: [],
      lstBeHiPesRegenerativeDesignTables: [],
      lstBeHiPesRegenerativeSequenceTables: [],
      lstBeHiCancerAssociatationTables: [],
      lstBeHiUrineHormoneTables: [],
      lstBeHiUrineBioMakersTables: [],
      lstBeHiGeneDrugPropertyTables: [],
      lstBeHiGeneDrugResponseTables: [],
      lstBeHiGeneDrugRecommendationTables: [],
      lstBEHIGeneticAncestryTables: [],
      summary: "",
      valueOfReportDetail: "",
      dietRecommendation: "",
      regenerativePeptidesConsider: "",
      hiReportReferences: "",
      closingThoughts: "",
      followUpScreening: "",
      recommendationsForDoctor: "",
      programTimeline: "",
      disclaimer: "",

      errors: {
        ColumnTitle: "",
        ScoreDetail: "",
        lstBeHiGeneticWesTable: "",
        lstBeHiHlaImmuneTypeTables: "",
        lstBeHIHlaHaplotypeTables: "",
        lstBeHiProteomicsTables: "",
        lstBeHiPesRegenerativeDesignTables: "",
        lstBeHiPesRegenerativeSequenceTables: "",
        lstBeHiCancerAssociatationTables: "",
        lstBeHiUrineHormoneTables: "",
        lstBeHiUrineBioMakersTables: "",
        lstBeHiGeneDrugPropertyTables: "",
        lstBeHiGeneDrugResponseTables: "",
        lstBeHiGeneDrugRecommendationTables: "",
        lstBEHIGeneticAncestryTables: "",
        Gene: "",
        Disease: "",
        DiseaseAssociation: "",
        Summary: "",
        valueOfReportDetail: "",
        dietRecommendation: "",
        regenerativePeptidesConsider: "",
        hiReportReferences: "",
        closingThoughts: "",
        followUpScreening: "",
        recommendationsForDoctor: "",
        summary: "",
        programTimeline: "",
        disclaimer: "",
        geneticGene: "",
        HLATyping: "",
        HLADiseaseAssociation: "",
        PDiseaseAssociation: "",
        ProteomicsScore: "",
        PESGene: "",
        PESDescription: "",
        Sequence: "",
        finalPESGene: "",
        CancerAssociatation: "",
        protienGene: "",
        Hormone: "",
        HComments: "",
        BioMarkers: "",
        BComments: "",
        PharmaDrug: "",
        PharmaGene: "",
        safetyGene: "",
        safetyDrug: "",
        TherapyDrug: "",
        TherapyGene: "",
        GAAncestry: "",
        GADiseaseAssociation: ""
      },
      PatientId: "",
      PatientAccessionNo: "",
      collapse: false,
      fadeIn: true,
      timeout: 300,
      collapseId: 1,
    };
    this.state = this.initialState;

  }
  componentDidMount() {

    // const param = this.props.match.params;
    // if (param.id != undefined && param.aid != undefined && param.did != undefined) {
    this.setState({ PatientId: 1, PatientAccessionId: 1 });
    let id = 1;
    let aid = 1;
    //const apiroute = window.$APIPath;
    this.getData(id, aid);
    //}
  }

  getData = (id, aid) => {

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/HealthIndex/GetSaveGeneProteins?id=' + id + '&aid=' + aid + '';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          // console.log("result", result);
          let rData = result.data.outdata;
          this.setState({
            loading: false,
            ScoreDetail: rData.ScoreDetail,
            summary: rData.summary,
            valueOfReportDetail: rData.valueOfReportDetail,
            dietRecommendation: rData.dietRecommendation,
            regenerativePeptidesConsider: rData.regenerativePeptidesConsider,
            hiReportReferences: rData.hiReportReferences,
            closingThoughts: rData.closingThoughts,
            followUpScreening: rData.followUpScreening,
            recommendationsForDoctor: rData.recommendationsForDoctor,
            programTimeline: rData.programTimeline,
            disclaimer: rData.disclaimer
          });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
      });
  }

  setCollapse(cid) {
    let currentCid = this.state.collapseId;
    if (currentCid == cid) {
      this.setState({ collapseId: -1 });
    }
    else {
      this.setState({ collapseId: cid });
    }
  }

  handleInputChangeHealthIndexScore(event) {
    const target = event.target;
    const value = target.value;
    //const ScoreDetail = target.ScoreDetail;
    let errors = this.state.errors;
    errors.ScoreDetail = (!value) ? 'Please enter immune checkpoint note.' : ''
    this.setState({
      ScoreDetail: value
    });
  }

  addGenetics() {
    // debugger;
    let data = this.state.lstBeHiGeneticWesTable;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHiGeneticWesTable = "";

    if (length == 0) {
      data.push({ Id: 0, Gene: '', Disease: '', DiseaseAssociation: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.Gene != undefined && lastData.Gene != "") {
        data.push({ id: 0, Gene: '', DiseaseAssociation: '' });
        errors.geneticGene = ""
      } else {
        errors.geneticGene = "Please enter gene."
      }
    }
    this.setState({
      lstBeHiGeneticWesTable: data
    });
  }
  handleInputChangeGenetics(event, index, fieldType) {
    // debugger;
    let data = this.state.lstBeHiGeneticWesTable;
    let errors = this.state.errors;
    errors.lstBeHiGeneticWesTable = "";

    // console.log(data);
    this.setState({
      lstBeHiGeneticWesTable: []
    });
    const elementsIndex = index;

    if (fieldType == "Gene") {
      data[elementsIndex].Gene = event.target.value;
      errors.geneticGene = ""
    }
    if (fieldType == "Disease") {
      data[elementsIndex].Disease = event.target.value;
    }
    if (fieldType == "DiseaseAssociation") {
      data[elementsIndex].DiseaseAssociation = event.target.value;
    }
    // console.log(data);
    this.setState({
      lstBeHiGeneticWesTable: data,
    });
  }

  addHLAImmuneType() {
    let data = this.state.lstBeHiHlaImmuneTypeTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHiHlaImmuneTypeTables = "";

    if (length == 0) {
      data.push({ Id: 0, ColumnTitle: '', ColumnValue: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.ColumnTitle != undefined && lastData.ColumnTitle != "") {
        data.push({ id: 0, ColumnTitle: '', ColumnValue: '' });
        errors.ColumnTitle = ""
      } else {
        errors.ColumnTitle = "Please enter column title."
      }
    }
    this.setState({
      lstBeHiHlaImmuneTypeTables: data
    });
  }
  handleInputChangeHLAImmuneType(event, index, fieldType) {
    let data = this.state.lstBeHiHlaImmuneTypeTables;
    let errors = this.state.errors;
    errors.lstBeHiHlaImmuneTypeTables = "";

    // console.log(data);
    this.setState({
      lstBeHiHlaImmuneTypeTables: []
    });
    const elementsIndex = index;

    if (fieldType == "ColumnTitle") {
      data[elementsIndex].ColumnTitle = event.target.value;
      errors.ColumnTitle = ""
    }
    if (fieldType == "ColumnValue") {
      data[elementsIndex].ColumnValue = event.target.value;
    }
    this.setState({
      lstBeHiHlaImmuneTypeTables: data,
    });
  }

  addHLAHaploType() {
    let data = this.state.lstBeHIHlaHaplotypeTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHIHlaHaplotypeTables = "";

    if (length == 0) {
      data.push({ Id: 0, HLATyping: '', DiseaseAssociation: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.HLATyping != undefined && lastData.HLATyping != "" && lastData.DiseaseAssociation != "") {
        data.push({ id: 0, HLATyping: '', DiseaseAssociation: '' });
        errors.HLATyping = ""
        errors.HLADiseaseAssociation = ""
      } else {
        errors.HLATyping = "Please enter HLAT type."
        errors.HLADiseaseAssociation = "Please enter disease association."
      }
    }
    this.setState({
      lstBeHIHlaHaplotypeTables: data
    });
  }
  handleInputChangeHLAHaploType(event, index, fieldType) {
    let data = this.state.lstBeHIHlaHaplotypeTables;
    let errors = this.state.errors;
    errors.lstBeHIHlaHaplotypeTables = "";

    this.setState({
      lstBeHIHlaHaplotypeTables: []
    });
    const elementsIndex = index;

    if (fieldType == "HLATyping") {
      data[elementsIndex].HLATyping = event.target.value;
      errors.HLATyping = ""
    }
    if (fieldType == "DiseaseAssociation") {
      data[elementsIndex].DiseaseAssociation = event.target.value;
      errors.HLADiseaseAssociation = ""
    }
    this.setState({
      lstBeHIHlaHaplotypeTables: data
    })
  }

  addProteomics() {
    let data = this.state.lstBeHiProteomicsTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHiProteomicsTables = "";

    if (length == 0) {
      data.push({ Id: 0, ProteomicsScore: '', DiseaseAssociation: '', Protein: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.ProteomicsScore != undefined && lastData.ProteomicsScore != "" && lastData.DiseaseAssociation != "") {
        data.push({ id: 0, ProteomicsScore: '', DiseaseAssociation: '', Protein: '' });
        errors.ProteomicsScore = "";
        errors.PDiseaseAssociation = "";
      } else {
        errors.ProteomicsScore = "Please enter proteomics score.";
        errors.PDiseaseAssociation = "Please enter disease association.";
      }
    }
    this.setState({
      lstBeHiProteomicsTables: data
    });
  }
  handleInputChangeProteomics(event, index, fieldType) {
    let data = this.state.lstBeHiProteomicsTables;
    let errors = this.state.errors;
    errors.lstBeHiProteomicsTables = "";

    this.setState({
      lstBeHiProteomicsTables: []
    });
    const elementsIndex = index;

    if (fieldType == "ProteomicsScore") {
      data[elementsIndex].ProteomicsScore = event.target.value;
      errors.ProteomicsScore = "";
    }
    if (fieldType == "DiseaseAssociation") {
      data[elementsIndex].DiseaseAssociation = event.target.value;
      errors.PDiseaseAssociation = "";
    }
    if (fieldType == "Protein") {
      data[elementsIndex].Protein = event.target.value;
    }
    this.setState({
      lstBeHiProteomicsTables: data
    })
  }

  addPES() {
    let data = this.state.lstBeHiPesRegenerativeDesignTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHiPesRegenerativeDesignTables = "";

    if (length == 0) {
      data.push({ Id: 0, Gene: '', Description: '', PSMSVal: '', Disease: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.Gene != undefined && lastData.Gene != "" && lastData.Description != "") {
        data.push({ id: 0, Gene: '', Description: '', PSMSVal: '', Disease: '' });
        errors.PESGene = ""
        errors.PESDescription = ""
      } else {
        errors.PESGene = "Please enter gene."
        errors.PESDescription = "Please enter description."
      }
    }
    this.setState({
      lstBeHiPesRegenerativeDesignTables: data
    });
  }
  handleInputChangePES(event, index, fieldType) {
    let data = this.state.lstBeHiPesRegenerativeDesignTables;
    let errors = this.state.errors;
    errors.lstBeHiPesRegenerativeDesignTables = "";

    this.setState({
      lstBeHiPesRegenerativeDesignTables: []
    });
    const elementsIndex = index;

    if (fieldType == "Gene") {
      data[elementsIndex].Gene = event.target.value;
      errors.PESGene = ""
    }
    if (fieldType == "Description") {
      data[elementsIndex].Description = event.target.value;
      errors.PESDescription = ""
    }
    if (fieldType == "PSMSVal") {
      data[elementsIndex].PSMSVal = event.target.value;
    }
    if (fieldType == "Disease") {
      data[elementsIndex].Disease = event.target.value;
    }
    this.setState({
      lstBeHiPesRegenerativeDesignTables: data
    })
  }

  addFianlPES() {
    let data = this.state.lstBeHiPesRegenerativeSequenceTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHiPesRegenerativeSequenceTables = "";

    if (length == 0) {
      data.push({ Id: 0, Gene: '', Sequence: '', Rank: '', Icnm: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.Gene != undefined && lastData.Gene != "" && lastData.Sequence != "") {
        data.push({ id: 0, Gene: '', Sequence: '', Rank: '', Icnm: '' });
        errors.finalPESGene = ""
        errors.Sequence = ""
      } else {
        errors.finalPESGene = "Please enter gene."
        errors.Sequence = "Please enter sequence."
      }
    }
    this.setState({
      lstBeHiPesRegenerativeSequenceTables: data
    });
  }
  handleInputChangeFinalPES(event, index, fieldType) {
    let data = this.state.lstBeHiPesRegenerativeSequenceTables;
    let errors = this.state.errors;
    errors.lstBeHiPesRegenerativeSequenceTables = "";

    this.setState({
      lstBeHiPesRegenerativeSequenceTables: []
    });
    const elementsIndex = index;

    if (fieldType == "Gene") {
      data[elementsIndex].Gene = event.target.value;
      errors.finalPESGene = ""
    }
    if (fieldType == "Sequence") {
      data[elementsIndex].Sequence = event.target.value;
      errors.Sequence = ""
    }
    if (fieldType == "Rank") {
      data[elementsIndex].Rank = event.target.value;
    }
    if (fieldType == "Icnm") {
      data[elementsIndex].Icnm = event.target.value;
    }
    this.setState({
      lstBeHiPesRegenerativeSequenceTables: data
    })
  }

  addCancerAssociatedProteins() {
    let data = this.state.lstBeHiCancerAssociatationTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHiCancerAssociatationTables = "";

    if (length == 0) {
      data.push({ Id: 0, Gene: '', CancerAssociatation: '', Score: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.Gene != undefined && lastData.Gene != "" && lastData.CancerAssociatation != "") {
        data.push({ id: 0, Gene: '', CancerAssociatation: '', Score: '' });
        errors.protienGene = ""
        errors.CancerAssociatation = ""
      } else {
        errors.protienGene = "Please enter gene."
        errors.CancerAssociatation = "Please enter cancer association."
      }
    }
    this.setState({
      lstBeHiCancerAssociatationTables: data
    });
  }
  handleInputChangeCancerAssociatedProteins(event, index, fieldType) {
    let data = this.state.lstBeHiCancerAssociatationTables;
    let errors = this.state.errors;
    errors.lstBeHiCancerAssociatationTables = "";

    this.setState({
      lstBeHiCancerAssociatationTables: []
    });
    const elementsIndex = index;

    if (fieldType == "Gene") {
      data[elementsIndex].Gene = event.target.value;
      errors.protienGene = ""
    }
    if (fieldType == "CancerAssociatation") {
      data[elementsIndex].CancerAssociatation = event.target.value;
      errors.CancerAssociatation = ""
    }
    if (fieldType == "Score") {
      data[elementsIndex].Score = event.target.value;
    }
    this.setState({
      lstBeHiCancerAssociatationTables: data
    })
  }

  addHormones() {
    let data = this.state.lstBeHiUrineHormoneTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHiUrineHormoneTables = "";

    if (length == 0) {
      data.push({ Id: 0, Hormone: '', Comments: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.Hormone != undefined && lastData.Hormone != "" && lastData.Comments != "") {
        data.push({ id: 0, Hormone: '', Comments: '' });
        errors.Hormone = ""
        errors.HComments = ""
      } else {
        errors.Hormone = "Please enter hormone."
        errors.HComments = "Please enter comments."
      }
    }
    this.setState({
      lstBeHiUrineHormoneTables: data
    });
  }
  handleInputChangeHormones(event, index, fieldType) {
    let data = this.state.lstBeHiUrineHormoneTables;
    let errors = this.state.errors;
    errors.lstBeHiUrineHormoneTables = "";

    this.setState({
      lstBeHiUrineHormoneTables: []
    });
    const elementsIndex = index;

    if (fieldType == "Hormone") {
      data[elementsIndex].Hormone = event.target.value;
      errors.Hormone = ""
    }
    if (fieldType == "Comments") {
      data[elementsIndex].Comments = event.target.value;
      errors.HComments = ""
    }
    this.setState({
      lstBeHiUrineHormoneTables: data
    })
  }

  addBiomarkers() {
    let data = this.state.lstBeHiUrineBioMakersTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHiUrineBioMakersTables = "";

    if (length == 0) {
      data.push({ Id: 0, BioMakers: '', Comments: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.BioMakers != undefined && lastData.BioMakers != "" && lastData.Comments != "") {
        data.push({ id: 0, BioMakers: '', Comments: '' });
        errors.BioMarkers = ""
        errors.BComments = ""
      } else {
        errors.BioMarkers = "Please add biomarkers."
        errors.BComments = "Please add comments."
      }
    }
    this.setState({
      lstBeHiUrineBioMakersTables: data
    });
  }
  handleInputChangeBiomarkers(event, index, fieldType) {
    let data = this.state.lstBeHiUrineBioMakersTables;
    let errors = this.state.errors;
    errors.lstBeHiUrineBioMakersTables = "";

    this.setState({
      lstBeHiUrineBioMakersTables: []
    });
    const elementsIndex = index;

    if (fieldType == "BioMakers") {
      data[elementsIndex].BioMakers = event.target.value;
      errors.BioMarkers = ""
    }
    if (fieldType == "Comments") {
      data[elementsIndex].Comments = event.target.value;
      errors.BComments = ""
    }
    this.setState({
      lstBeHiUrineBioMakersTables: data
    })
  }

  addGeneDrugProperty() {
    let data = this.state.lstBeHiGeneDrugPropertyTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHiGeneDrugPropertyTables = "";

    if (length == 0) {
      data.push({ Id: 0, Drug: '', Gene: '', AffectedSubgroups: '', Description: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.Drug != undefined && lastData.Drug != "" && lastData.Gene != "") {
        data.push({ id: 0, Drug: '', Gene: '', AffectedSubgroups: '', Description: '' });
        errors.PharmaDrug = ""
        errors.PharmaGene = ""
      } else {
        errors.PharmaDrug = "Please enter drug."
        errors.PharmaGene = "Please enter gene."
      }
    }
    this.setState({
      lstBeHiGeneDrugPropertyTables: data
    });
  }
  handleGeneDrugProperty(event, index, fieldType) {
    let data = this.state.lstBeHiGeneDrugPropertyTables;
    let errors = this.state.errors;
    errors.lstBeHiGeneDrugPropertyTables = "";

    this.setState({
      lstBeHiGeneDrugPropertyTables: []
    });
    const elementsIndex = index;

    if (fieldType == "Drug") {
      data[elementsIndex].Drug = event.target.value;
      errors.PharmaDrug = ""
    }
    if (fieldType == "Gene") {
      data[elementsIndex].Gene = event.target.value;
      errors.PharmaGene = ""
    }
    if (fieldType == "AffectedSubgroups") {
      data[elementsIndex].AffectedSubgroups = event.target.value;
    }
    if (fieldType == "Description") {
      data[elementsIndex].Description = event.target.value;
    }
    this.setState({
      lstBeHiGeneDrugPropertyTables: data
    })
  }

  addGeneDrugSafetyOrResponse() {
    let data = this.state.lstBeHiGeneDrugResponseTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHiGeneDrugResponseTables = "";

    if (length == 0) {
      data.push({ Id: 0, Drug: '', Gene: '', AffectedSubgroups: '', Description: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.Drug != undefined && lastData.Drug != "" && lastData.Gene != "") {
        data.push({ id: 0, Drug: '', Gene: '', AffectedSubgroups: '', Description: '' });
        errors.safetyDrug = ""
        errors.safetyGene = ""
      } else {
        errors.safetyDrug = "Please enter drug."
        errors.safetyGene = "Please enter gene."
      }
    }
    this.setState({
      lstBeHiGeneDrugResponseTables: data
    });
  }
  handleGeneDrugSafetyOrResponse(event, index, fieldType) {
    let data = this.state.lstBeHiGeneDrugResponseTables;
    let errors = this.state.errors;
    errors.lstBeHiGeneDrugResponseTables = "";

    this.setState({
      lstBeHiGeneDrugResponseTables: []
    });
    const elementsIndex = index;

    if (fieldType == "Drug") {
      data[elementsIndex].Drug = event.target.value;
      errors.safetyDrug = ""
    }
    if (fieldType == "Gene") {
      data[elementsIndex].Gene = event.target.value;
      errors.safetyGene = ""
    }
    if (fieldType == "AffectedSubgroups") {
      data[elementsIndex].AffectedSubgroups = event.target.value;
    }
    if (fieldType == "Description") {
      data[elementsIndex].Description = event.target.value;
    }
    this.setState({
      lstBeHiGeneDrugResponseTables: data
    })
  }

  addGeneDrugTherapeuticManagement() {
    let data = this.state.lstBeHiGeneDrugRecommendationTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBeHiGeneDrugRecommendationTables = "";

    if (length == 0) {
      data.push({ Id: 0, Drug: '', Gene: '', AffectedSubgroups: '', Description: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.Drug != undefined && lastData.Drug != "" && lastData.Gene != "") {
        data.push({ id: 0, Drug: '', Gene: '', AffectedSubgroups: '', Description: '' });
        errors.TherapyDrug = ""
        errors.TherapyGene = ""
      } else {
        errors.TherapyDrug = "Please enter drug."
        errors.TherapyGene = "Please enter gene."
      }
    }
    this.setState({
      lstBeHiGeneDrugRecommendationTables: data
    });
  }
  handleGeneTherapeuticManagement(event, index, fieldType) {
    let data = this.state.lstBeHiGeneDrugRecommendationTables;
    let errors = this.state.errors;
    errors.lstBeHiGeneDrugRecommendationTables = "";

    this.setState({
      lstBeHiGeneDrugRecommendationTables: []
    });
    const elementsIndex = index;

    if (fieldType == "Drug") {
      data[elementsIndex].Drug = event.target.value;
      errors.TherapyDrug = ""
    }
    if (fieldType == "Gene") {
      data[elementsIndex].Gene = event.target.value;
      errors.TherapyGene = ""
    }
    if (fieldType == "AffectedSubgroups") {
      data[elementsIndex].AffectedSubgroups = event.target.value;
    }
    if (fieldType == "Description") {
      data[elementsIndex].Description = event.target.value;
    }
    this.setState({
      lstBeHiGeneDrugRecommendationTables: data
    })
  }

  addGeneticAncestry() {
    let data = this.state.lstBEHIGeneticAncestryTables;
    let length = data.length;
    let errors = this.state.errors;
    errors.lstBEHIGeneticAncestryTables = "";

    if (length == 0) {
      data.push({ Id: 0, DiseaseAssociation: '', Ancestry: '', AlleleFrequency: '' });
    }
    else {
      let lastData = data[length - 1];
      if (lastData.DiseaseAssociation != undefined && lastData.DiseaseAssociation != "" && lastData.Ancestry != "") {
        data.push({ id: 0, DiseaseAssociation: '', Ancestry: '', AlleleFrequency: '' });
        errors.GADiseaseAssociation = ""
        errors.GAAncestry = ""
      } else {
        errors.GADiseaseAssociation = "Please enter disease association"
        errors.GAAncestry = "Please enter ancestry"
      }
    }
    this.setState({
      lstBEHIGeneticAncestryTables: data
    });
  }
  handleGeneticAncestry(event, index, fieldType) {
    let data = this.state.lstBEHIGeneticAncestryTables;
    let errors = this.state.errors;
    errors.lstBEHIGeneticAncestryTables = "";

    this.setState({
      lstBEHIGeneticAncestryTables: []
    });
    const elementsIndex = index;

    if (fieldType == "DiseaseAssociation") {
      data[elementsIndex].DiseaseAssociation = event.target.value;
      errors.GADiseaseAssociation = ""
    }
    if (fieldType == "Ancestry") {
      data[elementsIndex].Ancestry = event.target.value;
      errors.GAAncestry = ""
    }
    if (fieldType == "AlleleFrequency") {
      data[elementsIndex].AlleleFrequency = event.target.value;
    }
    this.setState({
      lstBEHIGeneticAncestryTables: data
    })
  }

  handleInputChange(event) {
    debugger;
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    let errors = this.state.errors;

    switch (name) {
      case 'Gene':
        errors.Gene = (!value) ? 'Please enter Gene.' : ''
        break;
      case 'Disease':
        errors.Disease = (!value) ? 'Please enter Disease.' : ''
        break;
      case 'DiseaseAssociation':
        errors.DiseaseAssociation = (!value) ? 'Please enter DiseaseAssociation.' : ''
        break;

      default:
        break;
    }
    this.setState({ errors, [name]: value }, () => {
    })
  }


  validateForm = (errors) => {
    let valid = true;

    if (this.state.ScoreDetail == undefined || this.state.ScoreDetail == '') {
      errors.ScoreDetail = 'Please enter ScoreDetail.';
    }
    //if (this.state.Gene == undefined || this.state.Gene == '') {
    //  errors.Gene = 'Please enter Gene.';
    //}
    //if (this.state.Disease == undefined || this.state.Disease == '') {
    //  errors.Disease = 'Please enter Disease.';
    //}
    //if (this.state.DiseaseAssociation == undefined || this.state.DiseaseAssociation == '') {
    //  errors.DiseaseAssociation = 'Please enter DiseaseAssociation.';
    //}
    //if (this.state.ColumnTitle == undefined || this.state.ColumnTitle == '') {
    //  errors.ColumnTitle = 'Please enter ColumnTitle.';
    //}
    //if (this.state.ColumnValue == undefined || this.state.ColumnValue == '') {
    //  errors.ColumnValue = 'Please enter ColumnValue.';
    //}
    //if (this.state.Protein == undefined || this.state.Protein == '') {
    //  errors.Protein = 'Please enter Protein.';
    //}
    //if (this.state.ProteomicsScore == undefined || this.state.ProteomicsScore == '') {
    //  errors.ProteomicsScore = 'Please enter ProteomicsScore.';
    //}
    //if (this.state.Description == undefined || this.state.Description == '') {
    //  errors.Description = 'Please enter Description.';
    //}
    //if (this.state.PSMSVal == undefined || this.state.PSMSVal == '') {
    //  errors.PSMSVal = 'Please enter PSMSVal.';
    //}
    //if (this.state.Sequence == undefined || this.state.Sequence == '') {
    //  errors.Sequence = 'Please enter Sequence.';
    //}
    //if (this.state.Rank == undefined || this.state.Rank == '') {
    //  errors.Rank = 'Please enter Rank.';
    //}
    //if (this.state.Icnm == undefined || this.state.Icnm == '') {
    //  errors.Icnm = 'Please enter Icnm.';
    //}
    //if (this.state.CancerAssociatation == undefined || this.state.CancerAssociatation == '') {
    //  errors.CancerAssociatation = 'Please enter CancerAssociatation.';
    //}
    //if (this.state.Score == undefined || this.state.Score == '') {
    //  errors.Score = 'Please enter Score.';
    //}
    //if (this.state.Hormone == undefined || this.state.Hormone == '') {
    //  errors.Hormone = 'Please enter Hormone.';
    //}
    //if (this.state.Comments == undefined || this.state.Comments == '') {
    //  errors.Comments = 'Please enter Comments.';
    //}
    //if (this.state.BioMakers == undefined || this.state.BioMakers == '') {
    //  errors.BioMakers = 'Please enter BioMakers.';
    //}
    //if (this.state.Comments == undefined || this.state.Comments == '') {
    //  errors.Comments = 'Please enter Comments.';
    //}
    //if (this.state.Drug == undefined || this.state.Drug == '') {
    //  errors.Drug = 'Please enter Drug.';
    //}
    //if (this.state.AffectedSubgroups == undefined || this.state.AffectedSubgroups == '') {
    //  errors.AffectedSubgroups = 'Please enter AffectedSubgroups.';
    //}
    //if (this.state.Ancestry == undefined || this.state.Ancestry == '') {
    //  errors.Ancestry = 'Please enter Ancestry.';
    //}
    //if (this.state.AlleleFrequency == undefined || this.state.AlleleFrequency == '') {
    //  errors.AlleleFrequency = 'Please enter AlleleFrequency.';
    //}
    if (this.state.summary == undefined || this.state.summary == '') {
      errors.summary = 'Please enter summary.';
    }
    if (this.state.valueOfReportDetail == undefined || this.state.valueOfReportDetail == '') {
      errors.valueOfReportDetail = 'Please enter value of report detail.';
    }
    if (this.state.dietRecommendation == undefined || this.state.dietRecommendation == '') {
      errors.dietRecommendation = 'Please enter diet recommendation.';
    }
    if (this.state.closingThoughts == undefined || this.state.closingThoughts == '') {
      errors.closingThoughts = 'Please enter closing thoughts.';
    }
    if (this.state.followUpScreening == undefined || this.state.followUpScreening == '') {
      errors.followUpScreening = 'Please enter followUp screening.';
    }
    if (this.state.recommendationsForDoctor == undefined || this.state.recommendationsForDoctor == '') {
      errors.recommendationsForDoctor = 'Please enter recommendations for doctor.';
    }
    if (this.state.regenerativePeptidesConsider == undefined || this.state.regenerativePeptidesConsider == '') {
      errors.regenerativePeptidesConsider = 'Please enter regenerative peptides consider.';
    }
    if (this.state.hiReportReferences == undefined || this.state.hiReportReferences == '') {
      errors.hiReportReferences = 'Please enter references.';
    }
    if (this.state.disclaimer == undefined || this.state.disclaimer == '') {
      errors.disclaimer = 'Please enter disclaimer.';
    }
    if (this.state.programTimeline == undefined || this.state.programTimeline == '') {
      errors.programTimeline = 'Please enter program timeline.';
    }

    if (this.state.lstBeHIHlaHaplotypeTables.length <= 0) {
      errors.lstBeHIHlaHaplotypeTables = 'Please enter data for HLA Haplotype Disease.';
    } else {
      let data = this.state.lstBeHIHlaHaplotypeTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.HLATyping === "" || lastData.DiseaseAssociation === "") {
        errors.HLATyping = "Please enter HLAT type."
        errors.HLADiseaseAssociation = "Please enter disease association."
        errors.lstBeHIHlaHaplotypeTables = 'Please fill out empty data of HLA Haplotype Disease.';
      }
    }

    if (this.state.lstBeHiGeneticWesTable.length <= 0) {
      errors.lstBeHiGeneticWesTable = 'Please enter data for Genetics.';
    } else {
      let data = this.state.lstBeHiGeneticWesTable;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.Gene === "") {
        errors.geneticGene = 'Please enter Gene'
        errors.lstBeHiGeneticWesTable = 'Please fill out empty data of Genetics.';
      }
    }

    if (this.state.lstBeHiHlaImmuneTypeTables.length <= 0) {
      errors.lstBeHiHlaImmuneTypeTables = 'Please enter data for HLA Immune type.';
    } else {
      let data = this.state.lstBeHiHlaImmuneTypeTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.ColumnTitle === "") {
        errors.ColumnTitle = 'Please enter ColumnTitle.';
        errors.lstBeHiHlaImmuneTypeTables = 'Please fill out empty data of HLA Immune type.';
      }
    }

    if (this.state.lstBeHiProteomicsTables.length <= 0) {
      errors.lstBeHiProteomicsTables = 'Please enter data for Proteomics.';
    } else {
      let data = this.state.lstBeHiProteomicsTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.ProteomicsScore === "" || lastData.DiseaseAssociation === "") {
        errors.ProteomicsScore = "Please enter proteomics score.";
        errors.PDiseaseAssociation = "Please enter disease association.";
        errors.lstBeHiProteomicsTables = 'Please fill out empty data of Proteomics.';
      }
    }

    if (this.state.lstBeHiPesRegenerativeDesignTables.length <= 0) {
      errors.lstBeHiPesRegenerativeDesignTables = 'Please enter data for PES Regenerative Design.';
    } else {
      let data = this.state.lstBeHiPesRegenerativeDesignTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.Gene === "" || lastData.Description === "") {
        errors.PESGene = "Please enter gene."
        errors.PESDescription = "Please enter description."
        errors.lstBeHiPesRegenerativeDesignTables = 'Please fill out empty data of PES Regenerative Design.';
      }
    }

    if (this.state.lstBeHiPesRegenerativeSequenceTables.length <= 0) {
      errors.lstBeHiPesRegenerativeSequenceTables = 'Please enter data for Final PES Regenerative Sequence.';
    } else {
      let data = this.state.lstBeHiPesRegenerativeSequenceTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.Gene === "" || lastData.Sequence === "") {
        errors.finalPESGene = "Please enter gene."
        errors.Sequence = "Please enter sequence."
        errors.lstBeHiPesRegenerativeSequenceTables = 'Please fill out empty data of Final PES Regenerative Sequence.';
      }
    }

    if (this.state.lstBeHiCancerAssociatationTables.length <= 0) {
      errors.lstBeHiCancerAssociatationTables = 'Please enter data for Cancer-Associated Proteins.';
    } else {
      let data = this.state.lstBeHiCancerAssociatationTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.Gene === "" || lastData.CancerAssociatation === "") {
        errors.protienGene = "Please enter gene."
        errors.CancerAssociatation = "Please enter cancer association."
        errors.lstBeHiCancerAssociatationTables = 'Please fill out empty data of Cancer-Associated Proteins.';
      }
    }

    if (this.state.lstBeHiUrineHormoneTables.length <= 0) {
      errors.lstBeHiUrineHormoneTables = 'Please enter data for Hormones.';
    } else {
      let data = this.state.lstBeHiUrineHormoneTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.Hormone === "" || lastData.Comments === "") {
        errors.Hormone = "Please enter hormone."
        errors.HComments = "Please enter comments."
        errors.lstBeHiUrineHormoneTables = 'Please fill out empty data of Hormones.';
      }
    }

    if (this.state.lstBeHiUrineBioMakersTables.length <= 0) {
      errors.lstBeHiUrineBioMakersTables = 'Please enter data for Biomarkers.';
    } else {
      let data = this.state.lstBeHiUrineBioMakersTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.BioMakers === "" || lastData.Comments === "") {
        errors.BioMarkers = "Please add biomarkers."
        errors.BComments = "Please add comments."
        errors.lstBeHiUrineBioMakersTables = 'Please fill out empty data of Biomarkers.';
      }
    }

    if (this.state.lstBeHiGeneDrugPropertyTables.length <= 0) {
      errors.lstBeHiGeneDrugPropertyTables = 'Please enter data for Gene drug property.';
    } else {
      let data = this.state.lstBeHiGeneDrugPropertyTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.Drug === "" || lastData.Gene === "") {
        errors.PharmaDrug = "Please enter drug."
        errors.PharmaGene = "Please enter gene."
        errors.lstBeHiGeneDrugPropertyTables = 'Please fill out empty data of Gene drug property.';
      }
    }

    if (this.state.lstBeHiGeneDrugResponseTables.length <= 0) {
      errors.lstBeHiGeneDrugResponseTables = 'Please enter data for Gene drug response.';
    } else {
      let data = this.state.lstBeHiGeneDrugResponseTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.Drug === "" || lastData.Gene === "") {
        errors.safetyDrug = "Please enter drug."
        errors.safetyGene = "Please enter gene."
        errors.lstBeHiGeneDrugResponseTables = 'Please fill out empty data of Gene drug response.';
      }
    }

    if (this.state.lstBeHiGeneDrugRecommendationTables.length <= 0) {
      errors.lstBeHiGeneDrugRecommendationTables = 'Please enter data for Gene drug recommendations.';
    } else {
      let data = this.state.lstBeHiGeneDrugRecommendationTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.Drug === "" || lastData.Gene === "") {
        errors.TherapyDrug = "Please enter drug."
        errors.TherapyGene = "Please enter gene."
        errors.lstBeHiGeneDrugRecommendationTables = 'Please fill out empty data of Gene drug recommendations.';
      }
    }

    if (this.state.lstBEHIGeneticAncestryTables.length <= 0) {
      errors.lstBEHIGeneticAncestryTables = 'Please enter data for Genetic Ancestry.';
    } else {
      let data = this.state.lstBEHIGeneticAncestryTables;
      let length = data.length;

      let lastData = data[length - 1];
      if (lastData.DiseaseAssociation === "" || lastData.Ancestry === "") {
        errors.GADiseaseAssociation = "Please enter disease association"
        errors.GAAncestry = "Please enter ancestry"
        errors.lstBEHIGeneticAncestryTables = 'Please fill out empty data of Genetic Ancestry.';
      }
    }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;

  }


  generateReport() {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_HealthIndex/GenerateHealthIndexReport';
  }

  // onResetClick(e) {
  //   e.preventDefault();
  //   this.setState({
  //     loading: true,
  //     PatientId: 0,
  //     PatientAccessionId: 0,
  //     redirect: false,
  //     modal: false,
  //     modalTitle: '',
  //     modalBody: '',
  //     show: false,
  //     isSubmited: false,
  //     ColumnTitle: "",
  //     // newdeclaration
  //     Genetics: [],
  //     HLA: [],
  //     GeneDrug: [],
  //     GeneticAncestry: [],
  //     HealthIndexScore: [],
  //     Proteomics: [],
  //     Cancer: [],
  //     Hormones: [],
  //     Biomarkers: [],
  //     GeneDrug: [],
  //     GeneticTitle: [],
  //     GeneticLink: [],
  //     GeneticDescription: [],
  //     ProteomicsScore: [],
  //     DiseaseAssociation: [],
  //     Protein: [],
  //     Gene: [],
  //     CancerAssociatation: [],
  //     score: [],
  //     Hormone: [],
  //     Comments: [],
  //     HLAColumnTitle: [],
  //     HLAColumnValue: [],
  //     Drug: [],
  //     DrugGene: [],
  //     AffectedSubgroups: [],
  //     Description: [],
  //     GADiseaseAssociation: [],
  //     Ancestry: [],
  //     AlleleFrequency: [],
  //     ScoreDetail: [],
  //     //new declaration ends
  //   })

  // }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin">
      </div>;
    }
  }

  handleSubmit(e) {
    debugger;
    e.preventDefault();
    this.setState({ loading: true, isSubmited: true });
    let url = "";
    let uid = 0;

    if (this.validateForm(this.state.errors)) {
      var userToken = JSON.parse(localStorage.getItem('AUserToken'));

      if (userToken != null) {
        uid = (userToken.userId == null ? 0 : userToken.userId);
      }

      const apiroute = window.$APIPath;
      url = apiroute + '/api/HealthIndex/SaveDataForPatientReport';

      let data = JSON.stringify({

        PatientId: parseInt(this.state.PatientId),
        PatientAccessionId: parseInt(this.state.PatientAccessionId),
        userId: parseInt(uid),
        PatientReportId: 0,
        scoreDetail: this.state.ScoreDetail,
        lstBeHiGeneticWesTable: this.state.lstBeHiGeneticWesTable,
        lstBeHiHlaImmuneTypeTables: this.state.lstBeHiHlaImmuneTypeTables,
        lstBeHIHlaHaplotypeTables: this.state.lstBeHIHlaHaplotypeTables,
        lstBeHiProteomicsTables: this.state.lstBeHiProteomicsTables,
        lstBeHiPesRegenerativeDesignTables: this.state.lstBeHiPesRegenerativeDesignTables,
        lstBeHiPesRegenerativeSequenceTables: this.state.lstBeHiPesRegenerativeSequenceTables,
        lstBeHiCancerAssociatationTables: this.state.lstBeHiCancerAssociatationTables,
        lstBeHiUrineHormoneTables: this.state.lstBeHiUrineHormoneTables,
        lstBeHiUrineBioMakersTables: this.state.lstBeHiUrineBioMakersTables,
        lstBeHiGeneDrugPropertyTables: this.state.lstBeHiGeneDrugPropertyTables,
        lstBeHiGeneDrugResponseTables: this.state.lstBeHiGeneDrugResponseTables,
        lstBeHiGeneDrugRecommendationTables: this.state.lstBeHiGeneDrugRecommendationTables,
        lstBEHIGeneticAncestryTables: this.state.lstBEHIGeneticAncestryTables,
        summary: this.state.summary,
        valueOfReportDetail: this.state.valueOfReportDetail,
        dietRecommendation: this.state.dietRecommendation,
        regenerativePeptidesConsider: this.state.regenerativePeptidesConsider,
        hiReportReferences: this.state.hiReportReferences,
        closingThoughts: this.state.closingThoughts,
        followUpScreening: this.state.followUpScreening,
        recommendationsForDoctor: this.state.recommendationsForDoctor,
        programTimeline: this.state.programTimeline,
        disclaimer: this.state.disclaimer,

      })

      // console.log("Data to submit", data);
      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'success',
            // modalBody: result.data.message,
            loading: false,
            isSubmited: false,
            redirect: true
          });
          toast.success(result.data.message)
          setTimeout(() => this.props.location.state?.patient ? this.props.history.push('/patients/list') : this.props.history.push('/patientactivity/designactivity'), 2000);
        }
        else {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false
          });
          toast.error(result.data.message)
        }
      })
        .catch(error => {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // ModalBody: error.message,
            loading: false
          });
          toast.error(error.message)
        });
    }
    else {
      this.setState({ loading: false });
    }
  }


  render() {

    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const {
      collapseId,
      loading,
      patientId,
      PatientAccessionId,
      ScoreDetail,
      lstBeHiGeneticWesTable,
      lstBeHiHlaImmuneTypeTables,
      lstBeHIHlaHaplotypeTables,
      lstBeHiProteomicsTables,
      lstBeHiPesRegenerativeDesignTables,
      lstBeHiPesRegenerativeSequenceTables,
      lstBeHiCancerAssociatationTables,
      lstBeHiUrineHormoneTables,
      lstBeHiUrineBioMakersTables,
      lstBeHiGeneDrugPropertyTables,
      lstBeHiGeneDrugResponseTables,
      lstBeHiGeneDrugRecommendationTables,
      lstBEHIGeneticAncestryTables,
      errors,
      summary,
      valueOfReportDetail,
      dietRecommendation,
      regenerativePeptidesConsider,
      hiReportReferences,
      closingThoughts,
      followUpScreening,
      recommendationsForDoctor,
      programTimeline,
      disclaimer
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Health Index Details</h5>
          </Col>
          <Col xs="1" lg="1">
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardBody>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                  <div className="row">
                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(1)}>
                            <b style={{ "fontSize": "16px" }}>Neo7HealthIndex Score</b>
                          </CardHeader>
                          <Collapse isOpen={1 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <div className="form-group row my-4">
                                  <div className="col-md-1"></div>
                                  <div className="col-md-10 mt-2">
                                    <div className="input-group">
                                      <span class="input-group-text" id="basic-addon1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
                                          <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                      </span>
                                      <Input type="textarea" className={errors.ScoreDetail ? "is-invalid" : "is-valid"} rows="2" placeholder="Enter HealthIndex Score Detail" value={ScoreDetail} name="ScoreDetail" onChange={this.handleInputChangeHealthIndexScore.bind(this)} />
                                    </div>
                                    {<span className='error'>{errors.ScoreDetail}</span>}
                                  </div>
                                </div>
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(2)}>
                            <b style={{ "fontSize": "16px" }}>Genetics by WES</b>
                          </CardHeader>
                          <Collapse isOpen={2 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addGenetics.bind(this)}>Add</Button>
                                {lstBeHiGeneticWesTable.length > 0 ? (
                                  lstBeHiGeneticWesTable
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-12">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.geneticGene && !ddata.Gene ? "is-invalid" : "is-valid"} value={ddata.Gene} placeholder="Enter Gene Title" name="Gene" onChange={e => this.handleInputChangeGenetics(e, i, 'Gene')} />
                                              </div>
                                              {!ddata.Gene && <span className='error'>{errors.geneticGene}</span>}
                                            </div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.Disease} value={ddata.Disease} placeholder="Enter Disease" name="Disease" onChange={e => this.handleInputChangeGenetics(e, i, 'Disease')} />
                                              </div>
                                              {<span className='error'>{errors.Disease}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1">
                                            </div>
                                            <div className="col-md-10 mt-2">
                                              <div className="input-group">
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.DiseaseAssociation} value={ddata.DiseaseAssociation} placeholder="Enter Disease Association" name="DiseaseAssociation" onChange={e => this.handleInputChangeGenetics(e, i, 'DiseaseAssociation')} />
                                              </div>
                                              {<span className='error'>{errors.DiseaseAssociation}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHiGeneticWesTable}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(3)}>
                            <b style={{ "fontSize": "16px" }}>HLA Immune Type</b>
                          </CardHeader>
                          <Collapse isOpen={3 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addHLAImmuneType.bind(this)}>Add</Button>
                                {lstBeHiHlaImmuneTypeTables.length > 0 ? (
                                  lstBeHiHlaImmuneTypeTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.ColumnTitle && !ddata.ColumnTitle ? "is-invalid" : "is-valid"} value={ddata.ColumnTitle} placeholder="Enter ColumnTitle" name="ColumnTitle" onChange={e => this.handleInputChangeHLAImmuneType(e, i, 'ColumnTitle')} />
                                              </div>
                                              {!ddata.ColumnTitle && <span className='error'>{errors.ColumnTitle}</span>}
                                            </div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.ColumnValue} value={ddata.ColumnValue} placeholder="Enter ColumnValue" name="ColumnValue" onChange={e => this.handleInputChangeHLAImmuneType(e, i, 'ColumnValue')} />
                                              </div>
                                              {<span className='error'>{errors.ColumnValue}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHiHlaImmuneTypeTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(4)}>
                            <b style={{ "fontSize": "16px" }}>HLA Haplotype Disease Association</b>
                          </CardHeader>
                          <Collapse isOpen={4 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addHLAHaploType.bind(this)}>Add</Button>
                                {lstBeHIHlaHaplotypeTables.length > 0 ? (
                                  lstBeHIHlaHaplotypeTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                            </div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.HLATyping && !ddata.HLATyping ? "is-invalid" : "is-valid"} value={ddata.HLATyping} placeholder="Enter HLA Typing" name="HLATyping" readOnly={false} onChange={e => this.handleInputChangeHLAHaploType(e, i, 'HLATyping')} />
                                              </div>
                                              {!ddata.HLATyping && <span className='error'>{errors.HLATyping}</span>}
                                            </div>
                                            <div className="col-md-5">
                                              <div className="input-group">
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.HLADiseaseAssociation && !ddata.DiseaseAssociation ? "is-invalid" : "is-valid"} value={ddata.DiseaseAssociation} placeholder="Enter Disease Association" name="DiseaseAssociation" onChange={e => this.handleInputChangeHLAHaploType(e, i, 'DiseaseAssociation')} />
                                              </div>
                                              {!ddata.DiseaseAssociation && <span className='error'>{errors.HLADiseaseAssociation}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHIHlaHaplotypeTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(5)}>
                            <b style={{ "fontSize": "16px" }}>Proteomics</b>
                          </CardHeader>
                          <Collapse isOpen={5 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addProteomics.bind(this)}>Add</Button>
                                {lstBeHiProteomicsTables.length > 0 ? (
                                  lstBeHiProteomicsTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                            </div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.ProteomicsScore && !ddata.ProteomicsScore ? "is-invalid" : "is-valid"} value={ddata.ProteomicsScore} placeholder="Enter ProteomicsScore" name="ProteomicsScore" onChange={e => this.handleInputChangeProteomics(e, i, 'ProteomicsScore')} />
                                              </div>
                                              {!ddata.ProteomicsScore && <span className='error'> {errors.ProteomicsScore}</span>}
                                            </div>
                                            <div className="col-md-5">
                                              <div className="input-group">
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" className={errors.PDiseaseAssociation && !ddata.DiseaseAssociation ? "is-invalid" : "is-valid"} value={ddata.DiseaseAssociation} maxlength="250" placeholder="Enter DiseaseAssociation" name="DiseaseAssociation" onChange={e => this.handleInputChangeProteomics(e, i, 'DiseaseAssociation')} />
                                              </div>
                                              {!ddata.DiseaseAssociation && <span className='error'> {errors.PDiseaseAssociation}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                            </div>
                                            <div className="col-md-10 mt-2">
                                              <div className="input-group">
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                                  </svg>
                                                </span>
                                                <Input type="textarea" className={errors.Protein} value={ddata.Protein} maxlength="250" placeholder="Enter Protein" name="Protein" onChange={e => this.handleInputChangeProteomics(e, i, 'Protein')} />
                                              </div>
                                              {<span className='error'> {errors.Protein}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHiProteomicsTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(6)}>
                            <b style={{ "fontSize": "16px" }}>PES Regenerative Design and Selection</b>
                          </CardHeader>
                          <Collapse isOpen={6 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addPES.bind(this)}>Add</Button>
                                {lstBeHiPesRegenerativeDesignTables.length > 0 ? (
                                  lstBeHiPesRegenerativeDesignTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" className={errors.PESGene && !ddata.Gene ? "is-invalid" : "is-valid"} value={ddata.Gene} maxlength="250" placeholder="Enter Gene" name="Gene" onChange={e => this.handleInputChangePES(e, i, 'Gene')} />
                                              </div>
                                              {!ddata.Gene && <span className='error'>{errors.PESGene}</span>}
                                            </div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" className={errors.PSMSVal} value={ddata.PSMSVal} maxlength="250" placeholder="Enter PSMs" name="PSMSVal" onChange={e => this.handleInputChangePES(e, i, 'PSMSVal')} />
                                              </div>
                                              {<span className='error'>{errors.PSMSVal}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5 mt-2">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" className={errors.Disease} value={ddata.Disease} maxlength="250" placeholder="Enter Disease" name="Disease" onChange={e => this.handleInputChangePES(e, i, 'Disease')} />
                                              </div>
                                              {<span className='error'>{errors.Disease}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-10">
                                              <div className="input-group">
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                                  </svg>
                                                </span>
                                                <Input type="textarea" className={errors.PESDescription && !ddata.Description ? "is-invalid" : "is-valid"} value={ddata.Description} maxlength="250" placeholder="Enter Description" name="Description" onChange={e => this.handleInputChangePES(e, i, 'Description')} />
                                              </div>
                                              {!ddata.Description && <span className='error'>{errors.PESDescription}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHiPesRegenerativeDesignTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(7)}>
                            <b style={{ "fontSize": "16px" }}>Final PES Regenerative Sequence Selection</b>
                          </CardHeader>
                          <Collapse isOpen={7 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addFianlPES.bind(this)}>Add</Button>
                                {lstBeHiPesRegenerativeSequenceTables.length > 0 ? (
                                  lstBeHiPesRegenerativeSequenceTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" className={errors.finalPESGene && !ddata.Gene ? "is-invalid" : "is-valid"} value={ddata.Gene} maxlength="250" placeholder="Enter Gene/Protein" name="Gene" onChange={e => this.handleInputChangeFinalPES(e, i, 'Gene')} />
                                              </div>
                                              {!ddata.Gene && <span className='error'>{errors.finalPESGene}</span>}
                                            </div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" className={errors.Sequence && !ddata.Sequence ? "is-invalid" : "is-valid"} value={ddata.Sequence} maxlength="250" placeholder="Enter Sequence" name="Sequence" onChange={e => this.handleInputChangeFinalPES(e, i, 'Sequence')} />
                                              </div>
                                              {!ddata.Sequence && <span className='error'>{errors.Sequence}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" className={errors.Rank} value={ddata.Rank} maxlength="250" placeholder="Enter Rank" name="Rank" onChange={e => this.handleInputChangeFinalPES(e, i, 'Rank')} />
                                              </div>
                                              {<span className='error'>{errors.Rank}</span>}
                                            </div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" className={errors.Icnm} value={ddata.Icnm} maxlength="250" placeholder="Enter IC50" name="Icnm" onChange={e => this.handleInputChangeFinalPES(e, i, 'Icnm')} />
                                              </div>
                                              {<span className='error'>{errors.Icnm}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHiPesRegenerativeSequenceTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(8)}>
                            <b style={{ "fontSize": "16px" }}>Cancer-Associated Proteins</b>
                          </CardHeader>
                          <Collapse isOpen={8 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addCancerAssociatedProteins.bind(this)}>Add</Button>
                                {lstBeHiCancerAssociatationTables.length > 0 ? (
                                  lstBeHiCancerAssociatationTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-10">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" className={errors.protienGene && !ddata.Gene ? "is-invalid" : "is-valid"} value={ddata.Gene} maxlength="250" placeholder="Enter Gene" name="Gene" onChange={e => this.handleInputChangeCancerAssociatedProteins(e, i, 'Gene')} />
                                              </div>
                                              {!ddata.Gene && <span className='error'>{errors.protienGene}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-10">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                                  </svg>
                                                </span>
                                                <Input type="textarea" className={errors.CancerAssociatation && !ddata.CancerAssociatation ? "is-invalid" : "is-valid"} value={ddata.CancerAssociatation} rows="2" placeholder="Enter CancerAssociatation" name="CancerAssociatation" onChange={e => this.handleInputChangeCancerAssociatedProteins(e, i, 'CancerAssociatation')} />
                                              </div>
                                              {!ddata.CancerAssociatation && <span className='error'>{errors.CancerAssociatation}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-10">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                                  </svg>
                                                </span>
                                                <Input type="textarea" maxlength="250" className={errors.Score} value={ddata.Score} rows="2" placeholder="Enter score" name="Score" onChange={e => this.handleInputChangeCancerAssociatedProteins(e, i, 'Score')} />
                                              </div>
                                              {<span className='error'>{errors.Score}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHiCancerAssociatationTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(9)}>
                            <b style={{ "fontSize": "16px" }}>Hormones</b>
                          </CardHeader>
                          <Collapse isOpen={9 == collapseId} id="collapseExample">
                            <CardBody>
                              <Button className="btn btn-primary btn-md" color="primary" onClick={this.addHormones.bind(this)}>Add</Button>
                              <React.Fragment>
                                {lstBeHiUrineHormoneTables.length > 0 ? (
                                  lstBeHiUrineHormoneTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" className={errors.Hormone && !ddata.Hormone ? "is-invalid" : "is-valid"} value={ddata.Hormone} maxlength="250" placeholder="Enter Hormone" name="Hormone" onChange={e => this.handleInputChangeHormones(e, i, 'Hormone')} />
                                              </div>
                                              {!ddata.Hormone && <span className='error'>{errors.Hormone}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-10 ">
                                              <div className="input-group">
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                                  </svg>
                                                </span>
                                                <Input type="textarea" className={errors.HComments && !ddata.Comments ? "is-invalid" : "is-valid"} value={ddata.Comments} rows="2" placeholder="Enter Comments" name="Comments" onChange={e => this.handleInputChangeHormones(e, i, 'Comments')} />
                                              </div>
                                              {!ddata.Comments && <span className='error'>{errors.HComments}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHiUrineHormoneTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(10)}>
                            <b style={{ "fontSize": "16px" }}>Biomarkers</b>
                          </CardHeader>
                          <Collapse isOpen={10 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addBiomarkers.bind(this)}>Add</Button>
                                {lstBeHiUrineBioMakersTables.length > 0 ? (
                                  lstBeHiUrineBioMakersTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" className={errors.BioMarkers && !ddata.BioMakers ? "is-invalid" : "is-valid"} value={ddata.BioMakers} maxlength="250" placeholder="Enter Biomarkers" name="BioMakers" onChange={e => this.handleInputChangeBiomarkers(e, i, 'BioMakers')} />
                                              </div>
                                              {!ddata.BioMakers && <span className='error'>{errors.BioMarkers}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-10 ">
                                              <div className="input-group">
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                                  </svg>
                                                </span>
                                                <Input type="textarea" className={errors.BComments && !ddata.Comments ? "is-invalid" : "is-valid"} value={ddata.Comments} rows="2" placeholder="Enter Comments" name="Comments" onChange={e => this.handleInputChangeBiomarkers(e, i, 'Comments')} />
                                              </div>
                                              {!ddata.Comments && <span className='error'>{errors.BComments}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHiUrineBioMakersTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(11)}>
                            <b style={{ "fontSize": "16px" }}>Gene-Drug pharmacokinetic properties</b>
                          </CardHeader>
                          <Collapse isOpen={11 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addGeneDrugProperty.bind(this)}>Add</Button>
                                {lstBeHiGeneDrugPropertyTables.length > 0 ? (
                                  lstBeHiGeneDrugPropertyTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.PharmaDrug && !ddata.Drug ? "is-invalid" : "is-valid"} value={ddata.Drug} placeholder="Enter Drug Detail" name="Drug" onChange={e => this.handleGeneDrugProperty(e, i, 'Drug')} />
                                              </div>
                                              {!ddata.Drug && <span className='error'>{errors.PharmaDrug}</span>}
                                            </div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.PharmaGene && !ddata.Gene ? "is-invalid" : "is-valid"} value={ddata.Gene} placeholder="Enter Gene Detail" name="Gene" onChange={e => this.handleGeneDrugProperty(e, i, 'Gene')} />
                                              </div>
                                              {!ddata.Gene && <span className='error'>{errors.PharmaGene}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5 ">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.AffectedSubgroups} value={ddata.AffectedSubgroups} placeholder="Enter Affected Subgroups Detail" name="AffectedSubgroups" onChange={e => this.handleGeneDrugProperty(e, i, 'AffectedSubgroups')} />
                                              </div>
                                              {<span className='error'>{errors.AffectedSubgroups}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-10 ">
                                              <div className="input-group">
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                                  </svg>
                                                </span>
                                                <Input type="textarea" className={errors.Description} value={ddata.Description} placeholder="Enter Description of Gene-Drug Interaction" name="Description" onChange={e => this.handleGeneDrugProperty(e, i, 'Description')} />
                                              </div>
                                              {<span className='error'>{errors.Description}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHiGeneDrugPropertyTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(12)}>
                            <b style={{ "fontSize": "16px" }}>Gene-Drug safety or
                              response</b>
                          </CardHeader>
                          <Collapse isOpen={12 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addGeneDrugSafetyOrResponse.bind(this)}>Add</Button>
                                {lstBeHiGeneDrugResponseTables.length > 0 ? (
                                  lstBeHiGeneDrugResponseTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.safetyDrug && !ddata.Drug ? "is-invalid" : "is-valid"} value={ddata.Drug} placeholder="Enter Drug Detail" name="Drug" onChange={e => this.handleGeneDrugSafetyOrResponse(e, i, 'Drug')} />
                                              </div>
                                              {!ddata.Drug && <span className='error'>{errors.safetyDrug}</span>}
                                            </div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.safetyGene && !ddata.Gene ? "is-invalid" : "is-valid"} value={ddata.Gene} placeholder="Enter Gene Detail" name="Gene" onChange={e => this.handleGeneDrugSafetyOrResponse(e, i, 'Gene')} />
                                              </div>
                                              {!ddata.Gene && <span className='error'>{errors.safetyGene}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5 ">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.AffectedSubgroups} value={ddata.AffectedSubgroups} placeholder="Enter Affected Subgroups Detail" name="AffectedSubgroups" onChange={e => this.handleGeneDrugSafetyOrResponse(e, i, 'AffectedSubgroups')} />
                                              </div>
                                              {<span className='error'>{errors.AffectedSubgroups}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-10 ">
                                              <div className="input-group">
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                                  </svg>
                                                </span>
                                                <Input type="textarea" className={errors.Description} value={ddata.Description} placeholder="Enter Description of Gene-Drug Interaction" name="Description" onChange={e => this.handleGeneDrugSafetyOrResponse(e, i, 'Description')} />
                                              </div>
                                              {<span className='error'>{errors.Description}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHiGeneDrugResponseTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(13)}>
                            <b style={{ "fontSize": "16px" }}>Gene-Drug therapeutic management
                              recommendations</b>
                          </CardHeader>
                          <Collapse isOpen={13 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addGeneDrugTherapeuticManagement.bind(this)}>Add</Button>
                                {lstBeHiGeneDrugRecommendationTables.length > 0 ? (
                                  lstBeHiGeneDrugRecommendationTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.TherapyDrug && !ddata.Drug ? "is-invalid" : "is-valid"} value={ddata.Drug} placeholder="Enter Drug Detail" name="Drug" onChange={e => this.handleGeneTherapeuticManagement(e, i, 'Drug')} />
                                              </div>
                                              {!ddata.Drug && <span className='error'>{errors.TherapyDrug}</span>}
                                            </div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.TherapyGene && !ddata.Gene ? "is-invalid" : "is-valid"} value={ddata.Gene} placeholder="Enter Gene Detail" name="Gene" onChange={e => this.handleGeneTherapeuticManagement(e, i, 'Gene')} />
                                              </div>
                                              {!ddata.Gene && <span className='error'>{errors.TherapyGene}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5 ">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.AffectedSubgroups} value={ddata.AffectedSubgroups} placeholder="Enter Affected Subgroups Detail" name="AffectedSubgroups" onChange={e => this.handleGeneTherapeuticManagement(e, i, 'AffectedSubgroups')} />
                                              </div>
                                              {<span className='error'>{errors.AffectedSubgroups}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-10 ">
                                              <div className="input-group">
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                                                  </svg>
                                                </span>
                                                <Input type="textarea" className={errors.Description} value={ddata.Description} placeholder="Enter Description of Gene-Drug Interaction" name="Description" onChange={e => this.handleGeneTherapeuticManagement(e, i, 'Description')} />
                                              </div>
                                              {<span className='error'>{errors.Description}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBeHiGeneDrugRecommendationTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(14)}>
                            <b style={{ "fontSize": "16px" }}>Genetic Ancestry</b>
                          </CardHeader>
                          <Collapse isOpen={14 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addGeneticAncestry.bind(this)}>Add</Button>
                                {lstBEHIGeneticAncestryTables.length > 0 ? (
                                  lstBEHIGeneticAncestryTables
                                    .map((ddata, i) => {
                                      return (
                                        <React.Fragment>
                                          <div className="form-group row my-4">
                                            <div className="col-md-1">
                                              <h5>{i + 1}</h5>
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.GADiseaseAssociation && !ddata.DiseaseAssociation ? "is-invalid" : "is-valid"} value={ddata.DiseaseAssociation} placeholder="Enter DiseaseAssociation" name="DiseaseAssociation" onChange={e => this.handleGeneticAncestry(e, i, 'DiseaseAssociation')} />
                                              </div>
                                              {!ddata.DiseaseAssociation && <span className='error'>{errors.GADiseaseAssociation}</span>}
                                            </div>
                                            <div className="col-md-5">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.GAAncestry && !ddata.Ancestry ? "is-invalid" : "is-valid"} value={ddata.Ancestry} placeholder="Enter Ancestry" name="Ancestry" onChange={e => this.handleGeneticAncestry(e, i, 'Ancestry')} />
                                              </div>
                                              {!ddata.Ancestry && <span className='error'>{errors.GAAncestry}</span>}
                                            </div>
                                          </div>
                                          <div className="form-group row ">
                                            <div className="col-md-1"></div>
                                            <div className="col-md-5 mt-2">
                                              <div className='input-group'>
                                                <span class="input-group-text" id="basic-addon1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                  </svg>
                                                </span>
                                                <Input type="text" maxlength="250" className={errors.AlleleFrequency} value={ddata.AlleleFrequency} placeholder="Enter AlleleFrequency" name="AlleleFrequency" onChange={e => this.handleGeneticAncestry(e, i, 'AlleleFrequency')} />
                                              </div>
                                              {<span className='error'>{errors.AlleleFrequency}</span>}
                                            </div>
                                          </div>
                                        </React.Fragment>
                                      )
                                    })) : null}
                                {<h5 className='error'>{errors.lstBEHIGeneticAncestryTables}</h5>}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(15)}>
                            <b style={{ "fontSize": "16px" }}>Summary</b>
                          </CardHeader>
                          <Collapse isOpen={15 == collapseId} id="collapseExample">
                            <CardBody>
                              <React.Fragment>
                                {/* <div className="form-group row my-4"> */}
                                <div className="col-md-1">
                                </div>

                                <div className="form-group row my-4">
                                  <div className="col-md-12">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      config={{ placeholder: "Enter summary here" }}
                                      data={summary || ""}
                                      //onChange={e => this.handleInputChangeGeneric(e, gdata.id, 'desc')}
                                      //onReady={editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log('Editor is ready to use!', editor);
                                      //}}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        this.setState({ summary: data });
                                        errors.summary = '';
                                      }}
                                    />
                                    {!summary && <h5 className='error'>{errors.summary}</h5>}
                                  </div>

                                  <div className="col-md-12 mt-4">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      config={{ placeholder: "Enter value of report detail here" }}
                                      data={valueOfReportDetail || ""}
                                      //onChange={e => this.handleInputChangeGeneric(e, gdata.id, 'desc')}
                                      //onReady={editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log('Editor is ready to use!', editor);
                                      //}}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        this.setState({ valueOfReportDetail: data });
                                        errors.valueOfReportDetail = '';
                                      }}
                                    />
                                    {!valueOfReportDetail && <h5 className='error'>{errors.valueOfReportDetail}</h5>}
                                  </div>

                                  <div className="col-md-12 mt-4">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      config={{ placeholder: "Enter diet recommendation here" }}
                                      data={dietRecommendation || ""}
                                      //onChange={e => this.handleInputChangeGeneric(e, gdata.id, 'desc')}
                                      //onReady={editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log('Editor is ready to use!', editor);
                                      //}}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        this.setState({ dietRecommendation: data });
                                        errors.dietRecommendation = '';
                                      }}
                                    />
                                    {!dietRecommendation && <h5 className='error'>{errors.dietRecommendation}</h5>}
                                  </div>

                                  <div className="col-md-12 mt-4">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      config={{ placeholder: "Enter regenerative peptides consider here" }}
                                      data={regenerativePeptidesConsider || ""}
                                      //onChange={e => this.handleInputChangeGeneric(e, gdata.id, 'desc')}
                                      //onReady={editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log('Editor is ready to use!', editor);
                                      //}}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        this.setState({ regenerativePeptidesConsider: data });
                                        errors.regenerativePeptidesConsider = '';
                                      }}
                                    />
                                    {!regenerativePeptidesConsider && <h5 className='error'>{errors.regenerativePeptidesConsider}</h5>}
                                  </div>

                                  <div className="col-md-12 mt-4">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      config={{ placeholder: "Enter references here" }}
                                      data={hiReportReferences || ""}
                                      //onChange={e => this.handleInputChangeGeneric(e, gdata.id, 'desc')}
                                      //onReady={editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log('Editor is ready to use!', editor);
                                      //}}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        this.setState({ hiReportReferences: data });
                                        errors.hiReportReferences = '';
                                      }}
                                    />
                                    {!hiReportReferences && <h5 className='error'>{errors.hiReportReferences}</h5>}
                                  </div>

                                  <div className="col-md-12 mt-4">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      config={{ placeholder: "Enter closing thoughts here" }}
                                      data={closingThoughts || ""}
                                      //onChange={e => this.handleInputChangeGeneric(e, gdata.id, 'desc')}
                                      //onReady={editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log('Editor is ready to use!', editor);
                                      //}}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        this.setState({ closingThoughts: data });
                                        errors.closingThoughts = '';
                                      }}
                                    />
                                    {!closingThoughts && <h5 className='error'>{errors.closingThoughts}</h5>}
                                  </div>

                                  <div className="col-md-12 mt-4">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      config={{ placeholder: "Enter followUp screening here" }}
                                      data={followUpScreening || ""}
                                      //onChange={e => this.handleInputChangeGeneric(e, gdata.id, 'desc')}
                                      //onReady={editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log('Editor is ready to use!', editor);
                                      //}}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        this.setState({ followUpScreening: data });
                                        errors.followUpScreening = '';
                                      }}
                                    />
                                    {!followUpScreening && <h5 className='error'>{errors.followUpScreening}</h5>}
                                  </div>

                                  <div className="col-md-12 mt-4">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      config={{ placeholder: "Enter recommendations for doctor here" }}
                                      data={recommendationsForDoctor || ""}
                                      //onChange={e => this.handleInputChangeGeneric(e, gdata.id, 'desc')}
                                      //onReady={editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log('Editor is ready to use!', editor);
                                      //}}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        this.setState({ recommendationsForDoctor: data });
                                        errors.recommendationsForDoctor = '';
                                      }}
                                    />
                                    {!recommendationsForDoctor && <h5 className='error'>{errors.recommendationsForDoctor}</h5>}
                                  </div>

                                  <div className="col-md-12 mt-4">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      config={{ placeholder: "Enter program timeline here" }}
                                      data={programTimeline || ""}
                                      //onChange={e => this.handleInputChangeGeneric(e, gdata.id, 'desc')}
                                      //onReady={editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log('Editor is ready to use!', editor);
                                      //}}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        this.setState({ programTimeline: data });
                                        errors.programTimeline = '';
                                      }}
                                    />
                                    {!programTimeline && <h5 className='error'>{errors.programTimeline}</h5>}
                                  </div>

                                  <div className="col-md-12 mt-4">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      config={{ placeholder: "Enter disclaimer here" }}
                                      data={disclaimer || ""}
                                      //onChange={e => this.handleInputChangeGeneric(e, gdata.id, 'desc')}
                                      //onReady={editor => {
                                      // You can store the "editor" and use when it is needed.
                                      //console.log('Editor is ready to use!', editor);
                                      //}}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        this.setState({ disclaimer: data });
                                        errors.disclaimer = '';
                                      }}
                                    />
                                    {!disclaimer && <h5 className='error'>{errors.disclaimer}</h5>}
                                  </div>

                                </div>
                                {/* </div> */}
                              </React.Fragment>
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Fade>
                    </Col>
                  </div>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input type="hidden" name="patientId" />
                        <Button type="submit" color="primary" className="mr-2"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                        {/* <Button type="reset" color="danger" onClick={this.onResetClick.bind(this)}><i className="fa fa-ban"></i> Reset</Button> */}
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <MyModal
        // handleModal={this.handleModalClose.bind(this)}
        //modalAction={this.state.modalAction}
        //isOpen={this.state.modal}
        //modalBody={this.state.modalBody}
        //modalTitle={this.state.modalTitle}
        //modalOptions={this.state.modalOptions}
        />
      </div >
    );
  }
}
export default PatientHealthIndexReportDetail;