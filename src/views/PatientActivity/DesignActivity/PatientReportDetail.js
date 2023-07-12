import React, { Component, createRef } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row,
  Table, Button, Input, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter, Form, Collapse, Fade, Alert
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build'
import Confirm from "../../CustomModal/Confirm";
import "@reach/dialog/styles.css";
import { toast } from 'react-toastify';
import _ from "lodash"
import axiosInstance from "../../../common/axiosInstance"
import { GrammarlyEditorPlugin, Grammarly } from '@grammarly/editor-sdk-react'


// import 'test.css'
class PatientReportDetail extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      loading: true, isSubmitEnabled: true,
      PatientId: 0, geneHallMarkPayload: [],
      PatientAccessionId: 0,
      DesignActivityId: 0,
      PatientReportId: 0, hallMarkErrs: {},
      ImmuneCheckpointNote: "",
      LinkForEmergingDrugs: "",
      RegenerativePeptideNote: "",
      //PbiMaItiPesVaccineNote: "",
      SampleIntravenousNote: "",
      OtherConsiderationsNote: "",
      LastSummaryNote: "",
      PRGeneticCharacteristics: [],
      PRImmuneCheckpoint: [],
      PRDrugsIdentified: [],
      PRNaturalAgents: [],
      PRRegenerativePeptides: [],
      PRClinicalTrial: [],
      PRImmunogenicAblation: [],
      PRSampleIntravenous: [],
      PRNutrition: [],
      ReportBuilder: [],
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      showGenetic: false,
      showTableGene: false,
      geneticTitle: '',
      geneticDesc: '',
      isSubmited: false,
      errors: {
        ImmuneCheckpointNote: "",
        LinkForEmergingDrugs: "",
        RegenerativePeptideNote: "",
        //PbiMaItiPesVaccineNote: "",
        SampleIntravenousNote: "",
        OtherConsiderationsNote: "",
        LastSummaryNote: "",
        PRGeneticCharacteristics: "",
        PRImmuneCheckpoint: "",
        PRDrugsIdentified: "",
        PRNaturalAgents: "",
        PRRegenerativePeptides: "",
        PRClinicalTrial: "",
        PRImmunogenicAblation: "",
        PRSampleIntravenous: "",
        PRNutrition: "",
        link: "",
        gctitle: "",
        linkTitle: "",
        pointTitle: "",
        drugName: "",
        agentName: "",
        regenerativeLink: "",
        regenerativeTitle: "",
        clinicalLink: "",
        clinicalName: "",
        immunoTitle: "",
        sampleDose: "",
        sampleElements: "",
        nutriName: "",
        nutriLink: "",
        richDescription: "",
        iterativeDescription: "",
        geneticTitle: '',
        geneticDesc: ''
      },
      PatientName: "",
      PatientAccessionNo: "",
      titleEditorIndex: "",
      collapse: false,
      fadeIn: true,
      timeout: 300,
      collapseId: 1,
      collapseId_3: null,
      inputRefList: [],
      geneHallmarkData: [
        // {
        //   "geneProtienDataId": 0,
        //   "geneHallmarkReferenceId": 71,
        //   "geneName": "RPS4Y2",
        //   "hallMarkNo": "1,6",
        //   "hallMarkTitle": "Hallmarks of Cancer (1): Sustaining Prolifera",
        //   "hallMarkReference": "https://doi.org/10.18632/oncotarget.19350",
        //   "createdBy": 0
        // },
        // {
        //   "geneProtienDataId": 0,
        //   "geneHallmarkReferenceId": 70,
        //   "geneName": "MDGA1",
        //   "hallMarkNo": "12",
        //   "hallMarkTitle": "Hallmarks of Cancer (12): Tumor Microenvironm",
        //   "hallMarkReference": "https://doi.org/10.1038/sj.onc.1205383\n",
        //   "createdBy": 0
        // }
      ],


    };
    this.state = this.initialState;
    // this.scroll_ref=createRef([])
    this.ClinicRefList = createRef()

  }

  supportRef = (el) => {

    console.log("ele", el)
    const refList = [];
    el.forEach((data) => {
      refList.push(React.createRef())

    })
    this.setState({
      inputRefList: refList
    })
  }
  //modal close button event
  handleModalClose = () => {
    this.setState({
      modal: false,
      modalTitle: '',
      modalBody: ''
    });
    if (this.state.redirect) {
      setTimeout(() => this.props.history.push('/patientactivity/designactivity'), 2000);
    }
  }

  handleHallmarkRefChange = (value, name, index, msg) => {
    let clone = _.cloneDeep(this.state.geneHallmarkData)
    clone[index][name] = value;
    // let errClone = this.state.hallMarkErrs
    // if (!(index in errClone)) {
    //   errClone[index] = {}
    // }
    // if (value) {
    //   if (name in errClone[index]) { delete errClone[index][name] }
    // } else {
    //   errClone[index][name] = msg + ' is required'
    // }
    // errClone[index][name] =!value ? msg
    // hallMarkReference = value;
    this.setState({
      geneHallmarkData: clone,
      // hallMarkErrs: errClone
    })


  }
  validateHallMarks = () => {
    return new Promise((resolve) => {
      let clone = _.cloneDeep(this.state.geneHallmarkData)
      let errors = {}
      clone.map((e, i) => {
        errors[i] = {}
        if (!e.hallMarkNo) {
          errors[i].hallMarkNo = "Hallmark No is required"
        }
        if (!e.hallMarkReference) {
          errors[i].hallMarkReference = 'Hallmark References is required'
        }
        if (!e.hallMarkTitle) {
          errors[i].hallMarkTitle = "Hallmark Title is required"
        }
        if (e.hallMarkNo && e.hallMarkTitle && e.hallMarkReference) {
          delete errors[i]
        }
        if (clone.length - 1 == i) {
          this.setState({ hallMarkErrs: errors })
          return resolve(Object.keys(errors).length > 0)
        }
      })
    })

  }
  submitHallMarkRefs = async () => {
    try {
      // if (await this.validateHallMarks()) { return }
      // /api/BE_PatientReport/SaveGeneReferences

      this.setState({ loading: true })

      const apiroute = window.$APIPath;
      var userToken = JSON.parse(localStorage.getItem('AUserToken'));
      let uid = 0;
      if (userToken != null) {
        uid = (userToken.userId == null ? 0 : userToken.userId);
      }
      let payload = this.state.geneHallmarkData
      const url = apiroute + '/api/BE_PatientReport/SaveGeneReferences';
      axiosInstance.post(url, payload).then((res) => {

        this.setState({

          showTableGene: false,
          loading: false,
          isSubmitEnabled: false
        })
        toast.success(res.data.message)
      }).catch((error) => {
        this.setState({ loading: false })
        toast.error(error.message || "Something went wrong while loading Gene Hallmark data")
      })
    } catch (error) {

    }
  }

  componentDidMount() {
    const param = this.props.match.params;

    // TODO: remove below comment :)
    this.getData(param.id, param.aid)
    // this.setState({ loading: false })
    // if (param.id != undefined && param.aid != undefined && param.did != undefined) {
    //   this.setState({ PatientId: param.id, DesignActivityId: param.did, PatientAccessionId: param.aid });
    //   let id = param.id;
    //   let aid = param.aid;
    //   const apiroute = window.$APIPath;
    //   // /api/BE_PatientReport/GetPatientReportData
    //   const url = apiroute + '/api/BE_PatientReport/GetPatientReportData?id=' + id + '&aid=' + aid;

    //   axiosInstance.get(url, {
    //     headers: {
    //       'Content-Type': 'application/json; charset=utf-8'
    //     }
    //   })
    //     .then(result => {
    //       if (result.data.flag) {
    //         let rData = result?.data?.outdata;
    //         this.setState({
    //           PatientName: rData?.patientName,
    //           PatientAccessionNo: rData?.patientAccessionNo,
    //           ReportBuilder: rData?.reportBuilder,
    //           //PatientReportId: rData?.patientReportId,
    //           // ImmuneCheckpointNote: rData?.immuneCheckpointNote === null ? "<p></p>" : rData?.immuneCheckpointNote,
    //           // LinkForEmergingDrugs: rData?.linkForEmergingDrugs === null ? "<p></p>" : rData?.linkForEmergingDrugs,
    //           // RegenerativePeptideNote: rData?.regenerativePeptideNote === null ? "<p></p>" : rData?.regenerativePeptideNote,
    //           // PbiMaItiPesVaccineNote: rData?.pbiMaItiPesVaccineNote,
    //           // SampleIntravenousNote: rData?.sampleIntravenousNote === null ? "<p></p>" : rData?.sampleIntravenousNote,
    //           // OtherConsiderationsNote: rData?.otherConsiderationsNote === null ? "<p></p>" : rData?.otherConsiderationsNote,
    //           // LastSummaryNote: rData?.lastSummaryNote === null ? "<p></p>" : rData?.lastSummaryNote,
    //           PRGeneticCharacteristics: rData?.prGeneticCharacteristics,
    //           // PRImmuneCheckpoint: rData?.prImmuneCheckpoint,
    //           // PRDrugsIdentified: rData?.prDrugsIdentified,
    //           // PRNaturalAgents: rData?.prNaturalAgents,
    //           // PRRegenerativePeptides: rData?.prRegenerativePeptides,
    //           PRClinicalTrial: rData?.prClinicalTrial,
    //           // PRImmunogenicAblation: rData?.prImmunogenicAblation,
    //           // PRSampleIntravenous: rData?.prSampleIntravenous,
    //           // PRNutrition: rData?.prNutrition, 
    //           loading: false
    //         });
    //         console.log(this.state);
    //       }
    //       else {
    //         console.log(result.data.message);
    //         this.setState({ loading: false });
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //       this.setState({ authError: true, error: error, loading: false });
    //     });
    // } else {
    //   this.setState({ loading: false });
    // }
  }
  getData = (id, aid) => {
    const param = { id, aid, did: 0 }
    if (param.id != undefined && param.aid != undefined && param.did != undefined) {
      // alert(id)
      // alert(aid)
      this.setState({ PatientId: param.id, DesignActivityId: param.did, PatientAccessionId: param.aid });
      // let id = param.id;
      // let aid = param.aid;
      const apiroute = window.$APIPath;
      // /api/BE_PatientReport/GetPatientReportData
      const url = apiroute + '/api/BE_PatientReport/GetPatientReportData?id=' + id + '&aid=' + aid;

      axiosInstance.get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(result => {
          if (result.data.flag) {
            let rData = result?.data?.outdata;
            // let geneHallMarkPayload = [];


            this.setState({
              PatientName: rData?.patientName,
              PatientAccessionNo: rData?.patientAccessionNo,
              ReportBuilder: rData?.reportBuilder,
              //PatientReportId: rData?.patientReportId,
              // ImmuneCheckpointNote: rData?.immuneCheckpointNote === null ? "<p></p>" : rData?.immuneCheckpointNote,
              // LinkForEmergingDrugs: rData?.linkForEmergingDrugs === null ? "<p></p>" : rData?.linkForEmergingDrugs,
              // RegenerativePeptideNote: rData?.regenerativePeptideNote === null ? "<p></p>" : rData?.regenerativePeptideNote,
              // PbiMaItiPesVaccineNote: rData?.pbiMaItiPesVaccineNote,
              // SampleIntravenousNote: rData?.sampleIntravenousNote === null ? "<p></p>" : rData?.sampleIntravenousNote,
              // OtherConsiderationsNote: rData?.otherConsiderationsNote === null ? "<p></p>" : rData?.otherConsiderationsNote,
              // LastSummaryNote: rData?.lastSummaryNote === null ? "<p></p>" : rData?.lastSummaryNote,
              PRGeneticCharacteristics: rData?.prGeneticCharacteristics,

              // PRImmuneCheckpoint: rData?.prImmuneCheckpoint,
              // PRDrugsIdentified: rData?.prDrugsIdentified,
              // PRNaturalAgents: rData?.prNaturalAgents,
              // PRRegenerativePeptides: rData?.prRegenerativePeptides,
              PRClinicalTrial: rData?.prClinicalTrial,
              // geneHallMarkPayload: rData?.geneHallmarkReferences || [],
              geneHallMarkPayload: rData?.geneHallmarkReferences || [],
              // PRImmunogenicAblation: rData?.prImmunogenicAblation,
              // PRSampleIntravenous: rData?.prSampleIntravenous,
              // PRNutrition: rData?.prNutrition, 
              loading: false

            });
            this.supportRef(this.state.ReportBuilder)

            // console.log(this.state);
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
    } else {
      this.setState({ loading: false });
    }
  }
  setCollapse(cid) {
    // debugger
    let currentCid = this.state.collapseId;
    if (currentCid == cid) {
      this.setState({ collapseId: -1 });
    }
    else {
      this.setState({ collapseId: cid });
    }

    if (currentCid != cid) {
      if (cid > 2) {
        setTimeout(() => {
          this.state.inputRefList[cid - 3].current.scrollIntoView(true)

        }, 500)
      }
    }
    if (currentCid != cid) {
      if (cid == 2) {
        setTimeout(() => {
          this.ClinicRefList.current.scrollIntoView(true)
        }, 500)
      }
    }




  }

  // setCollapse_3(cid) {
  //   let currentCid = this.state.collapseId_3;
  //   if (currentCid == cid) {
  //     this.setState({ collapseId_3: -1 });
  //   }
  //   else {
  //     this.setState({ collapseId_3: cid,collapseId:-1 });

  //   }


  // }

  //add disease


  handleCloseTableGene = () => {
    this.setState({

      showTableGene: false
    });
  }


  handleShowTableGene = () => {

    this.setState({ loading: true })

    const apiroute = window.$APIPath;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let uid = 0;
    if (userToken != null) {
      uid = (userToken.userId == null ? 0 : userToken.userId);
    }
    let payload = this.state.geneHallMarkPayload
    // payload = [...payload].map((e) => {
    //   return {
    //     ...e,
    //     // hallMarkRefNo,
    //     createdBy: uid
    //   }
    // })
    const url = apiroute + '/api/BE_PatientReport/LoadGeneHallMarks';
    axiosInstance.post(url, payload).then((res) => {
      let data = res.data.outdata;
      this.setState({
        geneHallmarkData: data,
        showTableGene: true,
        loading: false
      })
    }).catch((error) => {
      this.setState({ loading: false })
      toast.error(error.message || "Something went wrong while loading Gene Hallmark data")
    })

  }
  handleCloseGeneric = () => {
    this.setState({
      geneticTitle: "",
      geneticDesc: "",
      showGenetic: false
    });
  }
  handleShowGeneric = () => {
    this.setState({
      showGenetic: true,
    });
  }

  addGeneric(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let data = this.state.PRGeneticCharacteristics;
    let errors = this.state.errors

    let gTitle = this.state.geneticTitle;
    let gDesc = this.state.geneticDesc;

    if (gTitle != undefined && gTitle != "") {

      var userToken = JSON.parse(localStorage.getItem('AUserToken'));
      let uid = 0;
      if (userToken != null) {
        uid = (userToken.userId == null ? 0 : userToken.userId);
      }

      const apiroute = window.$APIPath;
      // /api/BE_PatientReport/SaveDataForPatientReport
      // /api/BE_PatientReport/SaveGeneticCharacteristic
      let url = apiroute + '/api/BE_PatientReport/SaveGeneticCharacteristic';


      let datae = {
        // "patientReportId": 0,
        "patientAccessionId": Number(this.state.PatientAccessionId),
        // "version": "1",
        "id": 0,
        "title": gTitle,
        "description": gDesc || "",
        "patientId": Number(this.state.PatientId),
        // "patientName": this.state.PatientName,
        // "patientAccessionNo": this.state.PatientAccessionNo,

        // "prClinicalTrial": [
        //   {
        //     "id": 0,
        //     "name": "string",
        //     "link": "string"
        //   }
        // ],
        // prClinicalTrial: this.state.PRClinicalTrial,
        // reportBuilder: this.state.ReportBuilder,
        // "reportBuilder": [
        //   {
        //     "prByPatientId": 0,
        //     "title": "string",
        //     "description": "string",
        //     "isNewPage": true
        //   }
        // ],
        // "userId": uid
      }
      // console.log("FINAL", data);
      axiosInstance.post(url, datae, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(result => {
        if (result.data.flag) {
          // console.log(result);
          let resultData = result.data.outdata;
          let data = []
          data.push({ id: resultData.id, description: resultData.description, title: resultData.title, });

          // let geneHallMarkPayload = [...this.state.geneHallMarkPayload, { geneName: resultData.title, hallMarkRefNo: 0 }]
          this.setState(
            // PRGeneticCharacteristics: data,
            // showGenetic:false,
            prevState => ({
              PRGeneticCharacteristics: [...prevState.PRGeneticCharacteristics, ...data],
              // geneHallMarkPayload
            })


          );
          // errors.geneticTitle = "";
          // errors.geneticDesc = "";
          let error = this.state.errors;
          errors.PRGeneticCharacteristics = ""
          toast.success(result.data.message);
          const param = this.props.match.params;
          this.setState({
            loading: false
          })
          // this.getData(param.id, param.aid)
          this.handleCloseGeneric()
        }
        else {
          this.setState({
            loading: false
          });
          toast.error(result.data.message)
        }
      })
        .catch(error => {
          this.setState({
            loading: false
          });
          toast.error(error.message)
        });

    } else {
      if (gTitle != undefined || gTitle != "") {
        errors.geneticTitle = "Plese enter title";
      }
      // if (gDesc != undefined || gDesc != "") {
      //   errors.geneticDesc = "Please enter description.";
      // }

      this.setState({ loading: false });
    }

  }


  handleGenericInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    let errors = this.state.errors;

    switch (name) {
      case 'geneticTitle':
        errors.geneticTitle = (!value) ? "Please enter title." : '';
        break;
      // case 'geneticDesc':
      //   errors.geneticDesc = (!value) ? "Please enter description." : '';
      //   break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }


    this.setState({ errors, [name]: value }, () => {

    })
  }

  deleteGeneric(e, id) {
    //e.preventDefault(); 

    const apiroute = window.$APIPath;
    // /api/BE_PatientReport/DeleteGeneticCharacteristic
    const url = apiroute + '/api/BE_PatientReport/DeleteGeneticCharacteristic?id=' + id + '';

    axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {
      if (result.data.flag) {
        let removedData = this.state.PRGeneticCharacteristics.filter(x => {
          return x.id !== id;
        });
        // let finalGenForload=  this.state.geneHallMarkPayload.filter((d)=>d.geneName==this.state.PRGeneticCharacteristics.title)



        this.setState({
          PRGeneticCharacteristics: removedData,
          loading: false,
          // geneHallMarkPayload:finalGenForload
        });
        toast.success(result.data.message);

      } else {
        toast.error(result.data.message);
      }
    })
      .catch(error => {
        toast.error(error.message)
        this.setState({ authError: true, error: error });
      });

    this.setState({});
  }


  //input handle input change Generic
  handleInputChangeGeneric(event, index, fieldType, description) {
    //alert(fieldType);
    let data = this.state.PRGeneticCharacteristics;
    let errors = this.state.errors;
    errors.PRGeneticCharacteristics = "";

    // console.log(data);
    // this.setState({
    //   PRGeneticCharacteristics: []
    // });
    const elementsIndex = index;

    // const elementsIndex = data.findIndex(element => element.id == id)
    //alert(elementsIndex);
    if (fieldType == "desc") {
      data[elementsIndex].description = description;
      errors.richDescription = ""
    }
    //else if (fieldType == "link") {
    //  data[elementsIndex].link = event.target.value;
    //  errors.link = ""
    //}
    //else if (fieldType == "ltitle") {
    //  data[elementsIndex].linkTitle = event.target.value;
    //  errors.linkTitle = ""
    //}
    //else if (fieldType == "gctitle") {
    //  data[elementsIndex].title = event.target.value.toUpperCase();
    //  errors.gctitle = ""
    //}

    // console.log(data);
    this.setState({
      PRGeneticCharacteristics: data
    });
  }

  //addGeneric() {
  //  let data = this.state.PRGeneticCharacteristics;
  //  let length = data.length;
  //  let errors = this.state.errors;
  //  errors.PRGeneticCharacteristics = "";

  //  if (length == 0) {
  //    data.push({ id: 0, linkTitle: '', link: '', description: '', title: '', tempTitle: '' });
  //  } else {
  //    let lastData = data[length - 1];
  //    // if ((lastData.linkTitle != undefined && lastData.link != undefined && lastData.title != undefined) && (lastData.linkTitle != "" && lastData.link != "" && lastData.title != "")) {
  //    if (lastData.title != undefined && lastData.title != "" && lastData.description != undefined && lastData.description != "") {
  //      data.push({ id: 0, linkTitle: '', link: '', description: '', title: '', tempTitle: '' });
  //      // errors.link = ""
  //      // errors.linkTitle = ""
  //      errors.gctitle = ""
  //      errors.richDescription = ""
  //    } else {
  //      // errors.link = "Please enter link"
  //      // errors.linkTitle = "Please enter link title"
  //      errors.richDescription = "Please enter genetic characteristics."
  //      errors.gctitle = "Plese enter title"
  //    }
  //  }
  //  this.setState({
  //    PRGeneticCharacteristics: data
  //  });
  //}

  // addImmune() {
  //   let data = this.state.PRImmuneCheckpoint;
  //   let length = data.length;
  //   let errors = this.state.errors;
  //   errors.PRImmuneCheckpoint = "";

  //   if (length == 0) {
  //     data.push({ id: 0, pointTitle: '', pointLink: '' });
  //   } else {
  //     let lastData = data[length - 1];
  //     if (lastData.pointTitle != undefined && (lastData.pointTitle != "" || lastData.pointLink != "")) {
  //       data.push({ id: 0, pointTitle: '', pointLink: '' });
  //       errors.pointTitle = ""
  //     } else {
  //       errors.pointTitle = "Please enter title or link"
  //     }
  //   }
  //   this.setState({
  //     PRImmuneCheckpoint: data
  //   });
  // }
  // //input handle input change Immune
  // handleInputChangeImmune(event, index, fieldType) {
  //   //alert(fieldType);
  //   let data = this.state.PRImmuneCheckpoint;
  //   let errors = this.state.errors;
  //   errors.PRImmuneCheckpoint = "";
  //   errors.pointTitle = ""

  //   console.log(data);
  //   this.setState({
  //     PRImmuneCheckpoint: []
  //   });
  //   const elementsIndex = index;
  //   //if (id != 0) {
  //   //  elementsIndex = data.findIndex(element => element.id == id);
  //   //}
  //   //alert(elementsIndex);
  //   if (fieldType == "link") {
  //     data[elementsIndex].pointLink = event.target.value;
  //   }
  //   else if (fieldType == "title") {
  //     data[elementsIndex].pointTitle = event.target.value;
  //   }

  //   console.log(data);
  //   this.setState({
  //     PRImmuneCheckpoint: data
  //   });
  // }

  // addDrug() {
  //   let data = this.state.PRDrugsIdentified;
  //   let length = data.length;
  //   let errors = this.state.errors;
  //   errors.PRDrugsIdentified = "";

  //   if (length == 0) {
  //     data.push({ id: 0, name: '', link: '', description: '' });
  //   } else {
  //     let lastData = data[length - 1];
  //     if (lastData.name != undefined && lastData.name != "") {
  //       data.push({ id: 0, name: '', link: '', description: '' });
  //       errors.drugName = "";
  //     } else {
  //       errors.drugName = "Please enter name"
  //     }
  //   }
  //   this.setState({
  //     PRDrugsIdentified: data
  //   });
  // }
  // //input handle input change Drug
  // handleInputChangeDrug(event, index, fieldType) {
  //   //alert(fieldType);
  //   let data = this.state.PRDrugsIdentified;
  //   let errors = this.state.errors;
  //   errors.PRDrugsIdentified = ""

  //   console.log(data);
  //   this.setState({
  //     PRDrugsIdentified: []
  //   });
  //   const elementsIndex = index;
  //   //if (id != 0) {
  //   //  elementsIndex = data.findIndex(element => element.id == id);
  //   //}
  //   //alert(elementsIndex);
  //   if (fieldType == "name") {
  //     data[elementsIndex].name = event.target.value;
  //     errors.drugName = "";
  //   }
  //   else if (fieldType == "link") {
  //     data[elementsIndex].link = event.target.value;
  //   }
  //   else if (fieldType == "desc") {
  //     data[elementsIndex].description = event.target.value;
  //   }

  //   console.log(data);
  //   this.setState({
  //     PRDrugsIdentified: data
  //   });
  // }

  // addNatural() {
  //   let data = this.state.PRNaturalAgents;
  //   let length = data.length;
  //   let errors = this.state.errors;
  //   errors.PRNaturalAgents = "";

  //   if (length == 0) {
  //     data.push({ id: 0, name: '', link: '', linkTitle: '' });
  //   } else {
  //     let lastData = data[length - 1];
  //     if (lastData.name != undefined && lastData.name != "") {
  //       data.push({ id: 0, name: '', link: '', linkTitle: '' });
  //       errors.agentName = ""
  //     } else {
  //       errors.agentName = "Please enter name"
  //     }
  //   }
  //   this.setState({
  //     PRNaturalAgents: data
  //   });
  // }
  // //input handle input change Natural
  // handleInputChangeNatural(event, index, fieldType) {
  //   //alert(fieldType);
  //   let data = this.state.PRNaturalAgents;
  //   let errors = this.state.errors;
  //   errors.PRNaturalAgents = "";

  //   console.log(data);
  //   this.setState({
  //     PRNaturalAgents: []
  //   });
  //   const elementsIndex = index;
  //   //if (id != 0) {
  //   //  elementsIndex = data.findIndex(element => element.id == id);
  //   //}
  //   //alert(elementsIndex);
  //   if (fieldType == "name") {
  //     data[elementsIndex].name = event.target.value;
  //     errors.agentName = ""
  //   }
  //   else if (fieldType == "link") {
  //     data[elementsIndex].link = event.target.value;
  //   }
  //   else if (fieldType == "ltitle") {
  //     data[elementsIndex].linkTitle = event.target.value;
  //   }

  //   console.log(data);
  //   this.setState({
  //     PRNaturalAgents: data
  //   });
  // }

  // addRegenerative() {
  //   let data = this.state.PRRegenerativePeptides;
  //   let length = data.length;
  //   let errors = this.state.errors;
  //   errors.PRRegenerativePeptides = "";

  //   if (length == 0) {
  //     data.push({ id: 0, title: '', link: '' });
  //   } else {
  //     let lastData = data[length - 1];
  //     if ((lastData.title != undefined && lastData.link != undefined) && (lastData.title != "" && lastData.link != "")) {
  //       data.push({ id: 0, title: '', link: '' });
  //       errors.regenerativeLink = ""
  //       errors.regenerativeTitle = ""
  //     } else {
  //       errors.regenerativeLink = "Please enter link"
  //       errors.regenerativeTitle = "Please enter title"
  //     }
  //   }
  //   this.setState({
  //     PRRegenerativePeptides: data
  //   });
  // }
  // //input handle input change Regenerative
  // handleInputChangeRegenerative(event, index, fieldType) {
  //   //alert(fieldType);
  //   let data = this.state.PRRegenerativePeptides;
  //   let errors = this.state.errors;
  //   errors.PRRegenerativePeptides = "";

  //   console.log(data);
  //   this.setState({
  //     PRRegenerativePeptides: []
  //   });
  //   const elementsIndex = index;
  //   //if (id != 0) {
  //   //  elementsIndex = data.findIndex(element => element.id == id);
  //   //}
  //   //alert(elementsIndex);
  //   if (fieldType == "title") {
  //     data[elementsIndex].title = event.target.value;
  //     errors.regenerativeTitle = ""
  //   }
  //   else if (fieldType == "link") {
  //     data[elementsIndex].link = event.target.value;
  //     errors.regenerativeLink = ""
  //   }

  //   console.log(data);
  //   this.setState({
  //     PRRegenerativePeptides: data
  //   });
  // }

  addClinical() {
    // alert(1)
    // debugger;
    let data = this.state.PRClinicalTrial;
    let length = data.length;
    let errors = this.state.errors;
    errors.PRClinicalTrial = "";

    if (length == 0) {
      data.push({ id: 0, name: '', link: '' });
      // debugger;
    } else {
      let lastData = data[length - 1];
      if ((lastData.name != undefined && lastData.link != undefined) && (lastData.name != "" && lastData.link != "")) {
        // alert(2)
        // debugger;
        data.push({ id: 0, name: '', link: '' });
        errors.clinicalName = ""
        errors.clinicalLink = ""
        // debugger;
      } else {
        errors.clinicalName = "Please enter link title"
        errors.clinicalLink = "Please enter link"
      }
      debugger;
    }
    this.setState({
      PRClinicalTrial: data
    });
    debugger;
  }

  //input handle input change Clinical
  handleInputChangeClinical(event, index, fieldType) {
    //alert(fieldType);
    let data = this.state.PRClinicalTrial;
    let errors = this.state.errors;
    errors.PRClinicalTrial = "";

    // console.log(data);
    this.setState({
      PRClinicalTrial: []
    });
    const elementsIndex = index;
    //if (id != 0) {
    //  elementsIndex = data.findIndex(element => element.id == id);
    //}
    //alert(elementsIndex);
    if (fieldType == "name") {
      data[elementsIndex].name = event.target.value;
      errors.clinicalName = ""
    }
    else if (fieldType == "link") {
      data[elementsIndex].link = event.target.value;
      errors.clinicalLink = ""
    }

    // console.log(data);
    this.setState({
      PRClinicalTrial: data
    });
  }

  // addImmuno() {
  //   let data = this.state.PRImmunogenicAblation;
  //   let length = data.length;
  //   let errors = this.state.errors;
  //   errors.PRImmunogenicAblation = "";

  //   if (length == 0) {
  //     data.push({ id: 0, title: '', link: '' });
  //   } else {
  //     let lastData = data[length - 1];
  //     if ((lastData.title != undefined && lastData.title != "")) {
  //       data.push({ id: 0, title: '', link: '' });
  //       errors.immunoTitle = ""
  //     } else {
  //       errors.immunoTitle = "Please enter title"
  //     }
  //   }
  //   this.setState({
  //     PRImmunogenicAblation: data
  //   });
  // }
  // //input handle input change Immuno
  // handleInputChangeImmuno(event, index, fieldType) {
  //   //alert(fieldType);
  //   let data = this.state.PRImmunogenicAblation;
  //   let errors = this.state.errors;
  //   errors.PRImmunogenicAblation = "";

  //   console.log(data);
  //   this.setState({
  //     PRImmunogenicAblation: []
  //   });
  //   const elementsIndex = index;
  //   //if (id != 0) {
  //   //  elementsIndex = data.findIndex(element => element.id == id);
  //   //}
  //   //alert(elementsIndex);
  //   if (fieldType == "title") {
  //     data[elementsIndex].title = event.target.value;
  //     errors.immunoTitle = ""
  //   }
  //   else if (fieldType == "link") {
  //     data[elementsIndex].link = event.target.value;
  //   }

  //   console.log(data);
  //   this.setState({
  //     PRImmunogenicAblation: data
  //   });
  // }

  // addSample() {
  //   let data = this.state.PRSampleIntravenous;
  //   let length = data.length;
  //   let errors = this.state.errors;
  //   errors.PRSampleIntravenous = "";

  //   if (length == 0) {
  //     data.push({ id: 0, elements: '', dose: '', strength: '', volumeMl: '' });
  //   } else {
  //     let lastData = data[length - 1];
  //     if ((lastData.elements != undefined && lastData.dose != undefined) && (lastData.dose != "" && lastData.elements != "")) {
  //       data.push({ id: 0, elements: '', dose: '', strength: '', volumeMl: '' });
  //       errors.sampleDose = ""
  //       errors.sampleElements = ""
  //     } else {
  //       errors.sampleElements = "Please enter elements"
  //       errors.sampleDose = "Please enter dose"
  //     }
  //   }
  //   this.setState({
  //     PRSampleIntravenous: data
  //   });
  // }
  // //input handle input change Sample
  // handleInputChangeSample(event, index, fieldType) {
  //   //alert(fieldType);
  //   let data = this.state.PRSampleIntravenous;
  //   let errors = this.state.errors;
  //   errors.PRSampleIntravenous = "";

  //   console.log(data);
  //   this.setState({
  //     PRSampleIntravenous: []
  //   });
  //   const elementsIndex = index;
  //   //if (id != 0) {
  //   //  elementsIndex = data.findIndex(element => element.id == id);
  //   //}
  //   //alert(elementsIndex);
  //   if (fieldType == "elements") {
  //     data[elementsIndex].elements = event.target.value;
  //     errors.sampleElements = ""
  //   }
  //   else if (fieldType == "dose") {
  //     data[elementsIndex].dose = event.target.value;
  //     errors.sampleDose = ""
  //   }
  //   else if (fieldType == "strength") {
  //     data[elementsIndex].strength = event.target.value;
  //   }
  //   else if (fieldType == "volumeMl") {
  //     data[elementsIndex].volumeMl = event.target.value;
  //   }

  //   console.log(data);
  //   this.setState({
  //     PRSampleIntravenous: data
  //   });
  // }

  // addNutri() {
  //   let data = this.state.PRNutrition;
  //   let length = data.length;
  //   let errors = this.state.errors;
  //   errors.PRNutrition = "";

  //   if (length == 0) {
  //     data.push({ id: 0, name: '', link: '', description: '' });
  //   } else {
  //     let lastData = data[length - 1];
  //     if (lastData.name != undefined && lastData.name != "" && lastData.link != undefined && lastData.link != "") {
  //       data.push({ id: 0, name: '', link: '', description: '' });
  //       errors.nutriName = ""
  //       errors.nutriLink = ""
  //     } else {
  //       errors.nutriName = "Please enter link title"
  //       errors.nutriLink = "Please enter link"
  //     }
  //   }
  //   this.setState({
  //     PRNutrition: data
  //   });
  // }
  // //input handle input change Nutrition
  // handleInputChangeNutri(event, index, fieldType) {
  //   //alert(fieldType);
  //   let data = this.state.PRNutrition;
  //   let errors = this.state.errors;
  //   errors.PRNutrition = "";

  //   console.log(data);
  //   this.setState({
  //     PRNutrition: []
  //   });
  //   const elementsIndex = index;
  //   //if (id != 0) {
  //   //  elementsIndex = data.findIndex(element => element.id == id);
  //   //}
  //   //alert(elementsIndex);
  //   if (fieldType == "name") {
  //     data[elementsIndex].name = event.target.value;
  //     errors.nutriName = ""
  //   }
  //   else if (fieldType == "link") {
  //     data[elementsIndex].link = event.target.value;
  //     errors.nutriLink = ""
  //   }
  //   else if (fieldType == "desc") {
  //     data[elementsIndex].description = event.target.value;
  //   }

  //   console.log(data);
  //   this.setState({
  //     PRNutrition: data
  //   });
  // }

  //input handle input change report module
  handleInputChangeReportBuilder(event, index, fieldType, description) {
    let data = this.state.ReportBuilder;
    let errors = this.state.errors;

    // console.log(data);
    const elementsIndex = index;

    if (fieldType == "desc") {
      data[elementsIndex].description = description;
      errors.iterativeDescription = ""
    }
    else if (fieldType == "title") {
      data[elementsIndex].title = event.target.value;
    }

    // console.log(data);
    this.setState({
      ReportBuilder: data
    });
  }

  openTitleEditor(event, index) {
    this.setState({
      titleEditorIndex: index
    })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    let errors = this.state.errors;
    switch (name) {
      case 'ImmuneCheckpointNote':
        errors.ImmuneCheckpointNote = (!value) ? 'Please enter immune checkpoint note.' : ''
        break;
      case 'LinkForEmergingDrugs':
        errors.LinkForEmergingDrugs = (!value) ? 'Please enter link for emerging drug.' : ''
        break;
      case 'RegenerativePeptideNote':
        errors.RegenerativePeptideNote = (!value) ? 'Please enter regenerative peptide note.' : ''
        break;
      case 'SampleIntravenousNote':
        errors.SampleIntravenousNote = (!value) ? 'Please enter sample intravenous note.' : ''
        break;
      case 'OtherConsiderationsNote':
        errors.OtherConsiderationsNote = (!value) ? 'Please enter other considerations note.' : ''
        break;
      case 'LastSummaryNote':
        errors.LastSummaryNote = (!value) ? 'Please enter last summary note.' : ''
        break;
      default:
        //(!value) ? '' :'This field is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => {

    })
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    // if (this.state.ImmuneCheckpointNote == undefined || this.state.ImmuneCheckpointNote == '') {
    //   errors.ImmuneCheckpointNote = 'Please enter immune checkpoint note.';
    // }
    // if (this.state.LinkForEmergingDrugs == undefined || this.state.LinkForEmergingDrugs == '') {
    //   errors.LinkForEmergingDrugs = 'Please enter link for emerging drug.';
    // }
    // if (this.state.RegenerativePeptideNote == undefined || this.state.RegenerativePeptideNote == '') {
    //   errors.RegenerativePeptideNote = 'Please enter regenerative peptide note.';
    // }
    // if (this.state.SampleIntravenousNote == undefined || this.state.SampleIntravenousNote == '') {
    //   errors.SampleIntravenousNote = 'Please enter sample intravenous note.';
    // }
    // if (this.state.OtherConsiderationsNote == undefined || this.state.OtherConsiderationsNote == '') {
    //   errors.OtherConsiderationsNote = 'Please enter other considerations note.';
    // }
    // if (this.state.LastSummaryNote == undefined || this.state.LastSummaryNote == '') {
    //   errors.LastSummaryNote = 'Please enter last summary note.';
    // }
    // debugger;
    // { console.log("this.state.PRGeneticCharacteristics.length", this.state.PRGeneticCharacteristics.length) }
    if (this.state.PRGeneticCharacteristics.length <= 0) {
      // errors.PRGeneticCharacteristics = 'Please enter data for genetic characteristics.';
    } else {
      let data = this.state.PRGeneticCharacteristics;
      let length = data.length;

      let lastData = data[length - 1];
      if (
        // lastData.linkTitle === "" || lastData.linkTitle === null || lastData.link === "" || lastData.link === null
        lastData.title === "" || lastData.title === null
      ) {
        errors.PRGeneticCharacteristics = 'Please fill out empty data of Genetics.';
        errors.gctitle = (lastData.title === "" || lastData.title === null) ? "Please enter title" : ""
        // errors.richDescription = (lastData.description === "" || lastData.description === null) ? "Please enter genetic characteristics" : ""
        // errors.linkTitle = (lastData.linkTitle?.trim() === "" || lastData.linkTitle === null) ? "Please enter link title" : ""
        // errors.link = (lastData.link?.trim() === "" || lastData.link === null) ? "Please enter link" : ""
      }
    }

    // if (this.state.PRImmuneCheckpoint.length <= 0) {
    //   errors.PRImmuneCheckpoint = 'Please enter data for immune checkpoint.';
    // } else {
    //   let data = this.state.PRImmuneCheckpoint;
    //   let length = data.length;

    //   let lastData = data[length - 1];
    //   if (lastData.pointTitle == "" && lastData.pointLink == "") {
    //     errors.PRImmuneCheckpoint = 'Please fill out empty data of immune checkpoint.';
    //     errors.pointTitle = "Please enter title"
    //   }
    // }

    // if (this.state.PRDrugsIdentified.length <= 0) {
    //   errors.PRDrugsIdentified = 'Please enter data for drugs identified.';
    // } else {
    //   let data = this.state.PRDrugsIdentified;
    //   let length = data.length;

    //   let lastData = data[length - 1];
    //   if (lastData.name == "") {
    //     errors.PRDrugsIdentified = 'Please fill out empty data of drugs identified.';
    //     errors.drugName = "Please enter name"
    //   }
    // }

    // if (this.state.PRNaturalAgents.length <= 0) {
    //   errors.PRNaturalAgents = 'Please enter data for natural agents.';
    // } else {
    //   let data = this.state.PRNaturalAgents;
    //   let length = data.length;

    //   let lastData = data[length - 1];
    //   if (lastData.name == "") {
    //     errors.PRNaturalAgents = 'Please fill out empty data of natural agents.';
    //     errors.agentName = "Please enter name"
    //   }
    // }

    // if (this.state.PRRegenerativePeptides.length <= 0) {
    //   errors.PRRegenerativePeptides = 'Please enter data for regenerative peptides.';
    // } else {
    //   let data = this.state.PRRegenerativePeptides;
    //   let length = data.length;

    //   let lastData = data[length - 1];
    //   if (lastData.title == "" || lastData.link == "") {
    //     errors.PRRegenerativePeptides = 'Please fill out empty data of regenerative peptides.';
    //     errors.regenerativeLink = (lastData.title?.trim() === "") ? "Please enter link" : ""
    //     errors.regenerativeTitle = (lastData.link?.trim() === "") ? "Please enter title" : ""
    //   }
    // }

    if (this.state.PRClinicalTrial.length <= 0) {
      errors.PRClinicalTrial = 'Please enter data for clinical trial.';
    } else {
      let data = this.state.PRClinicalTrial;
      let length = data.length;

      let lastData = data[length - 1];
      // console.log(lastData);
      if (lastData.link == "") {
        errors.PRClinicalTrial = 'Please fill out empty data of clinical trial.';
        //errors.clinicalName = (lastData.name?.trim() === "") ? "Please enter link title" : ""
        errors.clinicalLink = (lastData.link?.trim() === "") ? "Please enter link" : ""
      }
    }

    // if (this.state.PRImmunogenicAblation.length <= 0) {
    //   errors.PRImmunogenicAblation = 'Please enter data for immunogenic ablation.';
    // } else {
    //   let data = this.state.PRImmunogenicAblation;
    //   let length = data.length;

    //   let lastData = data[length - 1];
    //   if (lastData.title == "") {
    //     errors.PRImmunogenicAblation = 'Please fill out empty data of immunogenic ablation.';
    //     errors.immunoTitle = "Please enter title"
    //   }
    // }

    // if (this.state.PRSampleIntravenous.length <= 0) {
    //   errors.PRSampleIntravenous = 'Please enter data for sample intravenous.';
    // } else {
    //   let data = this.state.PRSampleIntravenous;
    //   let length = data.length;

    //   let lastData = data[length - 1];
    //   if (lastData.dose == "" || lastData.elements == "") {
    //     errors.PRSampleIntravenous = 'Please fill out empty data of sample intravenous.';
    //     errors.sampleElements = (lastData.elements?.trim() === "") ? "Please enter elements" : ""
    //     errors.sampleDose = (lastData.dose?.trim() === "") ? "Please enter dose" : ""
    //   }
    // }

    // if (this.state.PRNutrition.length <= 0) {
    //   errors.PRNutrition = 'Please enter data for nutrition.';
    // } else {
    //   let data = this.state.PRNutrition;
    //   let length = data.length;

    //   let lastData = data[length - 1];
    //   if (lastData.name == "" || lastData.link == "") {
    //     errors.PRNutrition = 'Please fill out empty data of nutrition.';
    //     errors.nutriName = (lastData.name?.trim() == "") ? "Please enter link title" : ""
    //     errors.nutriLink = (lastData.link?.trim() == "") ? "Please enter link" : ""
    //   }
    // }

    if (this.state.ReportBuilder.length > 0) {
      this.state.ReportBuilder.forEach((rep, i) => {
        // console.log(rep.title, rep?.description?.length)
        let title = "Existing Clinical Trials".toLowerCase();
        let description = rep?.description;
        if (!description) {


          if (String(rep?.title).toLowerCase() === title || String(rep?.headingTitle).toLowerCase() === title) {
            // e.description = '<p>Existing Clinical Trials</p>'
          }
          // else {
          //   // if (rep?.description?.length == 0 || rep?.description?.length == undefined) {
          //   errors[`seq${rep.sequence}`] = "* Please enter title and description."
          //   // }
          // }
        }
        // console.log(rep?.description?.length)


        // errors.iterativeDescription = rep?.description == "" ? "* Please enter  description." : ""
      })
    }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

  handleSubmit(e) {
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
      url = apiroute + '/api/BE_PatientReport/SaveDataForPatientReport';

      let data = JSON.stringify({
        PatientId: Number(this.state.PatientId),
        PatientAccessionId: Number(this.state.PatientAccessionId),
        PatientReportId: 0,
        // ImmuneCheckpointNote: this.state.ImmuneCheckpointNote,
        // LinkForEmergingDrugs: this.state.LinkForEmergingDrugs,
        // RegenerativePeptideNote: this.state.RegenerativePeptideNote,
        // //PbiMaItiPesVaccineNote: "",
        // SampleIntravenousNote: this.state.SampleIntravenousNote,
        // OtherConsiderationsNote: this.state.OtherConsiderationsNote,
        // LastSummaryNote: this.state.LastSummaryNote,
        PRGeneticCharacteristics: this.state.PRGeneticCharacteristics,
        // PRImmuneCheckpoint: this.state.PRImmuneCheckpoint,
        // PRDrugsIdentified: this.state.PRDrugsIdentified,
        // PRNaturalAgents: this.state.PRNaturalAgents,
        // PRRegenerativePeptides: this.state.PRRegenerativePeptides,
        PRClinicalTrial: this.state.PRClinicalTrial,
        // PRImmunogenicAblation: this.state.PRImmunogenicAblation,
        // PRSampleIntravenous: this.state.PRSampleIntravenous,
        // PRNutrition: this.state.PRNutrition,
        reportBuilder: this.state.ReportBuilder.map((e) => {
          let title = "Existing Clinical Trials".toLowerCase();
          let description = e?.description;
          if (!description) {


            if (String(e?.title).toLowerCase() === title || String(e?.headingTitle).toLowerCase() === title) {
              e.description = '<p>Existing Clinical Trials</p>'
            }
          }
          return e;
        }),
        userId: parseInt(uid)
      })

      // console.log("FINAL", data);
      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(result => {
        if (result.data.flag) {
          // console.log(result);
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            //modalBody: 'Patient report details saved successfully.Wait for few moments to generate report.',
            // modalBody: result.data.message,
            //redirect: true,
            loading: false,
            isSubmited: false,
            redirect: true
          });
          toast.success(result.data.message)
          if (this?.props?.location?.state?.redirectTo) {
            return this.props.history.push(this?.props?.location?.state?.redirectTo)
          } else {
            // setTimeout(() => this.props.location.state?.patient ? this.props.history.push('/patients/list') : this.props.history.push('/patientactivity/designactivity'), 2000);
            setTimeout(() => this.props.location.state?.patient ? this.props.history.push('/patients/list') : this.props.history.push('/patients/list'), 2000);
          }
          //return <Confirm title="Confirm" description="Patient report details saved successfully.Are you want to genrate dynamic report?">
          //  {(confirm => (
          //    confirm(e => this.generateReport())
          //  ))}
          //</Confirm>

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
    }
    else {
      this.setState({ loading: false });
      toast.error("Please fill up all the required details")
    }
  }



  generateReport() {
    //e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true, modal: false });
    const apiroute = window.$APIPath;
    //const url = apiroute + '/api/DesignActivity/UpdateDesignActivityDesignDelivered?id=' + id + '&userId=' + userId + '';
    const url = apiroute + '/api/BE_PatientReport/GeneratePatientReport';

    let data = JSON.stringify({
      patientId: parseInt(this.state.PatientId),
      PatientAccessionId: parseInt(this.state.PatientAccessionId),
      designActivityId: parseInt(this.state.DesignActivityId),
      userId: parseInt(userId)
    });

    // console.log("data", data);
    //axiosInstance.get(url, {
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {

      // console.log("result", result);
      if (result.data.flag) {
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Success',
          // modalBody: result.data.message,
          loading: false
        }, this.getDesignActivityData(0));
        toast.success(result.data.message)
        //this.setState({
        //  employees: curremployees.filter(employee => employee.org_Id !== id)
        //});

      }
      else {
        this.setState({
          loading: false
        });
      }
    })
      .catch(error => {
        //console.log(error);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: error.message,
          authError: true, error: error,
          loading: false
        });
        toast.error(error.message)
      });
  }

  richTextDescription(e, i, value) {
    this.state.PRGeneticCharacteristics.map((rep, index) => {
      if (index === i) {
        return ({
          ...rep,
          description: value
        })
      } else {
        return rep
      }
    })
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin">
      </div>;
    }
  }

  render() {
    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const { loading, PatientId,
      PatientReportId, ImmuneCheckpointNote, LinkForEmergingDrugs, RegenerativePeptideNote,
      PbiMaItiPesVaccineNote, SampleIntravenousNote, OtherConsiderationsNote, LastSummaryNote, titleEditorIndex,
      PRGeneticCharacteristics, PRImmuneCheckpoint, PRDrugsIdentified, PRNaturalAgents, PatientAccessionId,
      PRRegenerativePeptides, PRClinicalTrial, PRImmunogenicAblation, PRSampleIntravenous, ReportBuilder,
      PRNutrition, errors, PatientName, PatientAccessionNo, isSubmited, collapse, collapseId,
      showGenetic, geneticDesc, geneticTitle, showTableGene, geneHallmarkData, hallMarkErrs
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            {/* <h5 className="mt-2"><i className="fa fa-align-justify"></i> Patient Report Detail</h5> */}
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> {PatientName} &nbsp; {PatientAccessionNo != "" && PatientAccessionNo != null ? "(" + PatientAccessionNo.replace(/-/g, "") + ")" : ""}</h5>
          </Col>

          <Col xs="2" lg="2">
            {/* <Link to={this?.props?.location?.state?.redirectTo ? this?.props?.location?.state?.redirectTo : '/patientactivity/designactivity'}> */}
            <Link to={this?.props?.location?.state?.redirectTo ? (this?.props?.location?.state?.redirectTo) : '/patients/list'}>
              {this?.props?.location?.state?.redirectTo ? <button onClick={() => this.props.history.goBack()} className="btn btn-primary btn-block">Back to Details</button> : <button className="btn btn-primary btn-block">Patient List</button>}
            </Link>
          </Col>

        </Row>
        <Row>
          <Col xs="12" md="12">
            {/*{!loading ? (*/}
            <Card>
              <CardBody>
                <Form onSubmit={this.handleSubmit.bind(this)}>

                  <div className="row">
                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(1)}>
                            <b style={{ "fontSize": "16px" }}>Genetic Characteristics</b>
                          </CardHeader>
                          <Collapse isOpen={1 == collapseId} id="collapseExample1">
                            <CardBody>
                              <Button className="btn btn-primary btn-md" color="primary" onClick={() => this.handleShowGeneric()}>Add</Button>
                              {PRGeneticCharacteristics.length > 0 ? (
                                PRGeneticCharacteristics
                                  .map((gdata, i) => {
                                    return (
                                      <React.Fragment>
                                        <div className="form-group row my-4">
                                          <div className="col-md-12">
                                            <h5>{i + 1} {gdata.title} <Confirm title="Confirm" description="Are you sure want to delete this record?">
                                              {confirm => (
                                                <Link to="#" onClick={confirm(e => this.deleteGeneric(e, gdata.id))}><i className="icon-trash"></i></Link>
                                              )}
                                            </Confirm>
                                            </h5>

                                          </div>
                                        </div>
                                        <div className="form-group row my-4">
                                          <div className="col-md-1">
                                          </div>
                                          <div className="col-md-10">
                                            <Grammarly clientId="client_Mygif7MAqrmjKVPfFwatyC">
                                              <GrammarlyEditorPlugin>
                                                <CKEditor
                                                  editor={ClassicEditor}
                                                  data={gdata.description || ""}
                                                  config={{
                                                    scayt_autoStartup: true,
                                                    placeholder: "Enter description for genetic characteristics here"
                                                  }}
                                                  //onReady={editor => {
                                                  // You can store the "editor" and use when it is needed.
                                                  //console.log('Editor is ready to use!', editor);
                                                  //}}
                                                  // onBlur = {e => this.handleInputChangeGeneric(e, i, 'desc')}
                                                  onChange={(event, editor) => {
                                                    const data = editor?.getData();
                                                    this.handleInputChangeGeneric(event, i, 'desc', data)
                                                    errors.richDescription = '';
                                                  }}
                                                />
                                              </GrammarlyEditorPlugin>
                                            </Grammarly>
                                            {!gdata.description && <h5 className='error'>{errors.richDescription}</h5>}
                                            {/* </div> */}
                                          </div>
                                        </div>
                                      </React.Fragment>
                                    )
                                  })) : null}
                            </CardBody>
                          </Collapse>
                          {<h5 className='error'>{errors.PRGeneticCharacteristics}</h5>}
                        </Card>
                      </Fade>
                    </Col>

                    <hr />

                    {/* <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(2)}>
                            <b style={{ "fontSize": "16px" }}>Immune Checkpoint Therapy</b>
                          </CardHeader>
                          <Collapse isOpen={2 == collapseId} id="collapseExample">
                            <CardBody>
                              <h4><b>Note</b></h4>
                              <div className="form-group row my-4">
                                <div className="col-md-12">
                                  {/*<Input className={errors.ImmuneCheckpointNote ? "is-invalid" : "is-valid"} type="textarea" rows="2" placeholder="Enter immune checkpoint note" name="ImmuneCheckpointNote" value={ImmuneCheckpointNote} onChange={this.handleInputChange.bind(this)} />
                                  <CKEditor
                                    editor={ClassicEditor}
                                    placeholder= "this field can not be empty"
                                    data={ImmuneCheckpointNote}
                                    //onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    //console.log('Editor is ready to use!', editor);
                                    //}}
                                    onChange={(event, editor) => {
                                      const data = editor?.getData();
                                      this.setState({ ImmuneCheckpointNote: data });
                                      errors.ImmuneCheckpointNote = '';
                                    }}
                                  />
                                  {ImmuneCheckpointNote?.trim() === '' && <h5 className='error'>{errors.ImmuneCheckpointNote}</h5>}
                                </div>
                              </div>
                              <Button className="btn btn-primary btn-md" color="primary" onClick={this.addImmune.bind(this)}>Add</Button>
                              {PRImmuneCheckpoint.length > 0 ? (
                                PRImmuneCheckpoint
                                  .map((idata, i) => {
                                    return (
                                    <>
                                      <div className="form-group row my-4">
                                        <div className="col-md-1">
                                          <h5>{i + 1}</h5>
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                          <div className='input-group'>
                                          <span class="input-group-text" id="basic-addon1">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/>
                                              </svg>
                                            </span>
                                          <Input type="text" className={errors.pointTitle && !idata.pointTitle && !idata.pointLink ? "is-invalid" : "is-valid"} maxlength="250" placeholder="Enter title" name="PointTitle" value={idata.pointTitle} onChange={e => this.handleInputChangeImmune(e, i, 'title')} />
                                          </div>
                                          {(idata.pointTitle?.trim() === "" && idata.pointLink?.trim() === "") && <span className='error'>{errors.pointTitle}</span>}
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className="input-group">
                                            <span class="input-group-text" id="basic-addon1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                                              <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                              <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                                            </svg>
                                            </span>
                                          <Input type="text" className={errors.pointTitle && !idata.pointLink && !idata.pointTitle ? "is-invalid" : "is-valid"} placeholder="Enter link" name="PointLink" value={idata.pointLink} onChange={e => this.handleInputChangeImmune(e, i, 'link')} />
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                  })) : null}
                            </CardBody>
                          </Collapse>
                              {<h5 className='error'>{errors.PRImmuneCheckpoint}</h5>}
                        </Card>
                      </Fade>
                    </Col> */}

                    <hr />

                    {/* <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(3)}>
                            <b style={{ "fontSize": "16px" }}>Drugs Identified</b>
                          </CardHeader>
                          <Collapse isOpen={3 == collapseId} id="collapseExample">
                            <CardBody>
                              <h4><b>Link For Emerging Drugs</b></h4>
                              <div className="form-group row my-4">
                                <div className="col-md-12">
                                  {/*<Input type="text" className={errors.LinkForEmergingDrugs ? "is-invalid" : "is-valid"} placeholder="Enter drugs identified link" name="LinkForEmergingDrugs" value={LinkForEmergingDrugs} onChange={this.handleInputChange.bind(this)} />
                                  <CKEditor
                                    editor={ClassicEditor}
                                    data={LinkForEmergingDrugs}
                                    //onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    //console.log('Editor is ready to use!', editor);
                                    //}}
                                    onChange={(event, editor) => {
                                      const data = editor?.getData();
                                      this.setState({ LinkForEmergingDrugs: data });
                                      errors.LinkForEmergingDrugs = '';
                                    }}
                                  />
                                  {LinkForEmergingDrugs?.trim() === '' && <h5 className='error'>{errors.LinkForEmergingDrugs}</h5>}
                                </div>
                              </div>
                              <Button className="btn btn-primary btn-md" color="primary" onClick={this.addDrug.bind(this)}>Add</Button>
                              {PRDrugsIdentified.length > 0 ? (
                                PRDrugsIdentified
                                  .map((ddata, i) => {
                                    return (
                                      <>
                                      <div className="form-group row my-4">
                                        <div className="col-md-1">
                                          <h5>{i + 1}</h5>
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className='input-group'>
                                        <span class="input-group-text" id="basic-addon1">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/>
                                              </svg>
                                            </span>
                                          <Input className={errors.drugName && !ddata.name ? "is-invalid" : "is-valid"} maxlength="250" type="text" placeholder="Enter name" name="Name" value={ddata.name} onChange={e => this.handleInputChangeDrug(e, i, 'name')} />
                                          </div>
                                          {!ddata.name && <span className='error'>{errors.drugName}</span>}
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className="input-group">
                                            <span class="input-group-text" id="basic-addon1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                                              <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                              <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                                            </svg>
                                            </span>
                                          <Input type="text" placeholder="Enter link" name="Link" value={ddata.link} onChange={e => this.handleInputChangeDrug(e, i, 'link')} />
                                        </div>
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className="input-group">
                                            <span class="input-group-text" id="basic-addon1">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                                          </svg>
                                          </span>
                                          <Input maxlength="250" type="textarea" rows="2" placeholder="Enter description" name="Description" value={ddata.description} onChange={e => this.handleInputChangeDrug(e, i, 'desc')} />
                                        </div>
                                        </div>
                                      </div>
                                      </>
                                    )
                                  })) : null}
                            </CardBody>
                          </Collapse>
                              {<h5 className='error'>{errors.PRDrugsIdentified}</h5>}
                        </Card>
                      </Fade>
                    </Col> */}

                    <hr />

                    {/* <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(4)}>
                            <b style={{ "fontSize": "16px" }}>Botanical / Natural Agents Identified</b>
                          </CardHeader>
                          <Collapse isOpen={4 == collapseId} id="collapseExample">
                            <CardBody>
                              <Button className="btn btn-primary btn-md" color="primary" onClick={this.addNatural.bind(this)}>Add</Button>
                              {PRNaturalAgents.length > 0 ? (
                                PRNaturalAgents
                                  .map((ndata, i) => {
                                    return (
                                      <>
                                      <div className="form-group row my-4">
                                        <div className="col-md-1">
                                          <h5>{i + 1}</h5>
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className='input-group'>
                                            <span class="input-group-text" id="basic-addon1">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-at" viewBox="0 0 16 16">
                                              <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"/>
                                              </svg>
                                            </span>
                                          <Input className={errors.agentName && !ndata.name ? "is-invalid" : "is-valid"} type="text" maxlength="250" placeholder="Enter name" name="Name" value={ndata.name} onChange={e => this.handleInputChangeNatural(e, i, 'name')} />
                                        </div>
                                          {!ndata.name && <span className='error'>{errors.agentName}</span>}
                                        </div>
                                        </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className='input-group'>
                                        <span class="input-group-text" id="basic-addon1">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/>
                                              </svg>
                                            </span>
                                          <Input type="text" placeholder="Enter link title" name="LinkTitle" value={ndata.linkTitle} onChange={e => this.handleInputChangeNatural(e, i, 'ltitle')} />
                                        </div>
                                        </div>
                                        </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className="input-group">
                                            <span class="input-group-text" id="basic-addon1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                                              <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                              <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                                            </svg>
                                            </span>
                                          <Input type="text" placeholder="Enter link" name="Link" value={ndata.link} onChange={e => this.handleInputChangeNatural(e, i, 'link')} />
                                        </div>
                                        </div>
                                      </div>
                                      </>
                                    )
                                  })) : null}
                            </CardBody>
                          </Collapse>
                              {<h5 className='error'>{errors.PRNaturalAgents}</h5>}
                        </Card>
                      </Fade>
                    </Col> */}

                    <hr />

                    {/* <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(5)}>
                            <b style={{ "fontSize": "16px" }}>Regenerative Peptides</b>
                          </CardHeader>
                          <Collapse isOpen={5 == collapseId} id="collapseExample">
                            <CardBody>
                              <h4><b>Note</b></h4>
                              <div className="form-group row my-4">
                                <div className="col-md-12">
                                  {/*<Input className={errors.RegenerativePeptideNote ? "is-invalid" : "is-valid"} type="textarea" rows="2" placeholder="Enter regenerative peptide note" name="RegenerativePeptideNote" value={RegenerativePeptideNote} onChange={this.handleInputChange.bind(this)} />
                                  <CKEditor
                                    editor={ClassicEditor}
                                    data={RegenerativePeptideNote}
                                    //onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    //console.log('Editor is ready to use!', editor);
                                    //}}
                                    onChange={(event, editor) => {
                                      const data = editor?.getData();
                                      this.setState({ RegenerativePeptideNote: data });
                                      errors.RegenerativePeptideNote = '';
                                    }}
                                  />
                                  {RegenerativePeptideNote?.trim() === '' && <h5 className='error'>{errors.RegenerativePeptideNote}</h5>}
                                </div>
                              </div>
                              <Button className="btn btn-primary btn-md" color="primary" onClick={this.addRegenerative.bind(this)}>Add</Button>
                              {PRRegenerativePeptides.length > 0 ? (
                                PRRegenerativePeptides
                                  .map((rdata, i) => {
                                    return (
                                      <>
                                      <div className="form-group row my-4">
                                        <div className="col-md-1">
                                          <h5>{i + 1}</h5>
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className='input-group'>
                                        <span class="input-group-text" id="basic-addon1">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/>
                                              </svg>
                                            </span>
                                          <Input className={errors.regenerativeTitle && !rdata.title ? "is-invalid" : "is-valid"} type="text" placeholder="Enter title" name="Title" value={rdata.title} onChange={e => this.handleInputChangeRegenerative(e, i, 'title')} />
                                        </div>
                                          {!rdata.title && <span className='error'>{errors.regenerativeTitle}</span>}
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className="input-group">
                                            <span class="input-group-text" id="basic-addon1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                                              <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                              <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                                            </svg>
                                            </span>
                                          <Input className={errors.regenerativeLink && !rdata.link ? "is-invalid" : "is-valid"} type="text" placeholder="Enter link" name="Link" value={rdata.link} onChange={e => this.handleInputChangeRegenerative(e, i, 'link')} />
                                        </div>
                                          {!rdata.link && <span className='error'>{errors.regenerativeLink}</span>}
                                        </div>
                                      </div>
                                      </>
                                    )
                                  })) : null}
                            </CardBody>
                          </Collapse>
                              {<h5 className='error'>{errors.PRRegenerativePeptides}</h5>}
                        </Card>
                      </Fade>
                    </Col> */}

                    <hr />

                    <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(2)}>
                            <b style={{ "fontSize": "16px" }}>Clinical Trial</b>
                          </CardHeader>
                          <Collapse isOpen={2 == collapseId} id="collapseExample2">
                            <CardBody>

                              {!this.state.PRClinicalTrial?.[0]?.link &&
                                <Button className="btn btn-primary btn-md" color="primary" onClick={this.addClinical.bind(this)}>Add</Button>}
                              {PRClinicalTrial.length > 0 ? (
                                PRClinicalTrial
                                  .map((cdata, i) => {
                                    return (
                                      <>
                                        {/*<div className="form-group row my-4">
                                          <div className="col-md-1">
                                            <h5>{i + 1}</h5>
                                          </div>
                                        </div>
                                        <div className="form-group row my-4">
                                          <div className="col-md-1"></div>
                                          <div className="col-md-10">
                                            <div className='input-group'>
                                              <span class="input-group-text" id="basic-addon1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                  <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
                                                </svg>
                                              </span>
                                              <Input className={errors.clinicalName && !cdata.name ? "is-invalid" : "is-valid"} type="text" placeholder="Enter link title" name="Name" value={cdata.name} onChange={e => this.handleInputChangeClinical(e, i, 'name')} />
                                            </div>
                                            {!cdata.name && <span className='error'>{errors.clinicalName}</span>}
                                          </div>
                                        </div>*/}
                                        <div ref={this.ClinicRefList} className="form-group row my-4">
                                          <div className="col-md-1" style={{ "flex": "0" }}> <h5>{i + 1}</h5></div>
                                          <div className="col-md-10">
                                            <div className="input-group">
                                              <span class="input-group-text" id="basic-addon1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                                                  <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                                                  <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
                                                </svg>
                                              </span>
                                              <Input className={errors.clinicalLink && !cdata.link ? "is-invalid" : "is-valid"} type="text" placeholder="Enter link" name="Link" value={cdata.link} onChange={e => this.handleInputChangeClinical(e, i, 'link')} />
                                            </div>
                                            {!cdata.link && <span className='error'>{errors.clinicalLink}</span>}
                                          </div>
                                        </div>
                                      </>
                                    )
                                  })) : null}
                            </CardBody>
                          </Collapse>
                          {<h5 className='error'>{errors.PRClinicalTrial}</h5>}
                        </Card>
                      </Fade>
                    </Col>

                    <hr />

                    {/* <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(7)}>
                            <b style={{ "fontSize": "16px" }}>Immunogenic Ablation</b>
                          </CardHeader>
                          <Collapse isOpen={7 == collapseId} id="collapseExample">
                            <CardBody>
                              <Button className="btn btn-primary btn-md" color="primary" onClick={this.addImmuno.bind(this)}>Add</Button>
                              {PRImmunogenicAblation.length > 0 ? (
                                PRImmunogenicAblation
                                  .map((idata, i) => {
                                    return (
                                      <>
                                      <div className="form-group row my-4">
                                        <div className="col-md-1">
                                          <h5>{i + 1}</h5>
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className='input-group'>
                                        <span class="input-group-text" id="basic-addon1">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/>
                                              </svg>
                                            </span>
                                          <Input type="text" className={errors.immunoTitle && !idata.title ? "is-invalid" : "is-valid"} placeholder="Enter title" name="Title" value={idata.title} onChange={e => this.handleInputChangeImmuno(e, i, 'title')} />
                                        </div>
                                          {!idata.title && <span className='error'>{errors.immunoTitle}</span>}
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                      <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className="input-group">
                                            <span class="input-group-text" id="basic-addon1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                                              <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                              <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                                            </svg>
                                            </span>
                                          <Input type="text" placeholder="Enter link" name="Link" value={idata.link} onChange={e => this.handleInputChangeImmuno(e, i, 'link')} />
                                        </div>
                                        </div>
                                      </div>
                                      </>
                                    )
                                  })) : null}
                            </CardBody>
                          </Collapse>
                              {<h5 className='error'>{errors.PRImmunogenicAblation}</h5>}
                        </Card>
                      </Fade>
                    </Col> */}

                    <hr />

                    {/* <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(8)}>
                            <b style={{ "fontSize": "16px" }}>Sample Intravenous</b>
                          </CardHeader>
                          <Collapse isOpen={8 == collapseId} id="collapseExample">
                            <CardBody>
                              <h4><b>Note</b></h4>
                              <div className="form-group row my-4">
                                <div className="col-md-12">
                                  {/*<Input className={errors.SampleIntravenousNote ? "is-invalid" : "is-valid"} type="textarea" rows="2" placeholder="Enter sample intravenous note" name="SampleIntravenousNote" value={SampleIntravenousNote} onChange={this.handleInputChange.bind(this)} />
                                  <CKEditor
                                    editor={ClassicEditor}
                                    data={SampleIntravenousNote}
                                    //onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    //console.log('Editor is ready to use!', editor);
                                    //}}
                                    onChange={(event, editor) => {
                                      const data = editor?.getData();
                                      this.setState({ SampleIntravenousNote: data });
                                      errors.SampleIntravenousNote = '';
                                    }}
                                  />
                                  {SampleIntravenousNote?.trim() === '' && <h5 className='error'>{errors.SampleIntravenousNote}</h5>}
                                </div>
                              </div>
                              <Button className="btn btn-primary btn-md" color="primary" onClick={this.addSample.bind(this)}>Add</Button>
                              {PRSampleIntravenous.length > 0 ? (
                                PRSampleIntravenous
                                  .map((sdata, i) => {
                                    return (
                                      <>
                                      <div className="form-group row my-4">
                                        <div className="col-md-1">
                                          <h5>{i + 1}</h5>
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                        <div className="col-md-1"></div>
                                        <div className="col-md-5">
                                          <Input maxlength="250" type="text" className={errors.sampleElements && !sdata.elements ? "is-invalid" : "is-valid"} placeholder="Enter elements" name="Elements" value={sdata.elements} onChange={e => this.handleInputChangeSample(e, i, 'elements')} />
                                          {!sdata.elements && <span className='error'>{errors.sampleElements}</span>}
                                        </div>
                                        <div className="col-md-5">
                                          <Input maxlength="250" type="text" className={errors.sampleDose && !sdata.dose ? "is-invalid" : "is-valid"} placeholder="Enter dose" name="Dose" value={sdata.dose} onChange={e => this.handleInputChangeSample(e, i, 'dose')} />
                                          {!sdata.dose && <span className='error'>{errors.sampleDose}</span>}
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                        <div className="col-md-1"></div>
                                        <div className="col-md-5">
                                          <Input maxlength="250" type="text" placeholder="Enter strength" name="Strength" value={sdata.strength} onChange={e => this.handleInputChangeSample(e, i, 'strength')} />
                                        </div>
                                        <div className="col-md-5">
                                          <Input maxlength="250" type="text" placeholder="Enter volume (Ml)" name="VolumeMl" value={sdata.volumeMl} onChange={e => this.handleInputChangeSample(e, i, 'volumeMl')} />
                                        </div>
                                      </div>
                                      </>
                                    )
                                  })) : null}
                            </CardBody>
                          </Collapse>
                              {<h5 className='error'>{errors.PRSampleIntravenous}</h5>}
                        </Card>
                      </Fade>
                    </Col> */}

                    <hr />

                    {/* <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem" }}>
                      <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => this.setCollapse(9)}>
                            <b style={{ "fontSize": "16px" }}>Nutrition</b>
                          </CardHeader>
                          <Collapse isOpen={9 == collapseId} id="collapseExample">
                            <CardBody>
                              <Button className="btn btn-primary btn-md" color="primary" onClick={this.addNutri.bind(this)}>Add</Button>
                              {PRNutrition.length > 0 ? (
                                PRNutrition
                                  .map((ndata, i) => {
                                    return (
                                      <>
                                      <div className="form-group row my-4">
                                        <div className="col-md-1">
                                          <h5>{i + 1}</h5>
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                        <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className='input-group'>
                                        <span class="input-group-text" id="basic-addon1">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                                                <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/>
                                              </svg>
                                            </span>
                                          <Input type="text" className={errors.nutriName && !ndata.name ? "is-invalid" : "is-valid"} maxlength="250" placeholder="Enter link title" name="Name" value={ndata.name} onChange={e => this.handleInputChangeNutri(e, i, 'name')} />
                                        </div>
                                          {!ndata.name && <span className='error'>{errors.nutriName}</span>}
                                        </div>
                                      </div>
                                      <div className="form-group row my-4">
                                        <div className="col-md-1"></div>
                                        <div className="col-md-10">
                                        <div className="input-group">
                                            <span class="input-group-text" id="basic-addon1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                                              <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                              <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                                            </svg>
                                            </span>
                                          <Input type="text" className={errors.nutriLink && !ndata.link ? "is-invalid" : "is-valid"} placeholder="Enter link" name="Link" value={ndata.link} onChange={e => this.handleInputChangeNutri(e, i, 'link')} />
                                        </div>
                                          {!ndata.link && <span className='error'>{errors.nutriLink}</span>}
                                        </div>
                                        {/*<div className="col-md-4">*/}
                    {/*  <Input type="textarea" rows="2" placeholder="Enter description" name="Description" value={ndata.description} onChange={e => this.handleInputChangeNutri(e, i, 'desc')} />*/}
                    {/*</div>
                                      </div>
                                      </>
                                    )
                                  })) : null}
                            </CardBody>
                          </Collapse>
                              {<h5 className='error'>{errors.PRNutrition}</h5>}
                        </Card>
                      </Fade>
                    </Col> */}


                    {ReportBuilder?.length > 0 &&
                      ReportBuilder?.map((item, index) => {
                        // || String(item?.title?.trim()).toLowerCase() === "List Of Top ITI-PES Sequences".toLowerCase()
                        return (
                          <>
                            <Col key={index} xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem", "display": String(item.title).toLowerCase() === 'Existing Clinical Trials'.toLowerCase() ? "none" : "block" }}>
                              <Fade timeout={this.state.timeout} in={this.state.fadeIn}>

                                <Card style={{ "border": "1px solid #1C3A84" }}>
                                  <CardHeader className="d-flex justify-content-between align-items-center" style={{ "backgroundColor": "#1C3A84", "color": "white", "cursor": "pointer" }} onClick={() => titleEditorIndex !== index && this.setCollapse(index + 3)}>


                                    {
                                      titleEditorIndex === index ?
                                        <div className="col-md-11" >
                                          <Input type="text" value={item.title} readOnly={item?.type == "D"} onChange={(e) => this.handleInputChangeReportBuilder(e, index, "title")} />
                                        </div>
                                        :
                                        <b style={{ "fontSize": "16px" }} >{item.title}</b>
                                    }
                                    {
                                      titleEditorIndex === index ?
                                        <Link className="btn btn-primary btn-pill" onClick={(e) => this.openTitleEditor(e, "")}>Save</Link>
                                        :
                                        <Link className="btn btn-primary btn-pill" onClick={(e) => this.openTitleEditor(e, index)}><i className="icon-pencil"></i></Link>
                                    }

                                  </CardHeader>
                                  <Collapse isOpen={index + 3 == this.state.collapseId} id="collapseExample3">
                                    <CardBody  >
                                      {/* <h4><b>Note</b></h4> */}
                                      <div key={index} ref={this.state.inputRefList[index]} className="form-group row my-4" >
                                        <div className="col-md-12">
                                          <Grammarly clientId="client_Mygif7MAqrmjKVPfFwatyC">
                                            <GrammarlyEditorPlugin>
                                              <CKEditor
                                                editor={ClassicEditor}
                                                data={item.description || ""}
                                                config={{
                                                  scayt_autoStartup: true,
                                                  placeholder: "Please enter description",

                                                }}
                                                isReadOnly={item?.type == "D"}

                                                //onReady={editor => {
                                                // You can store the "editor" and use when it is needed.
                                                //console.log('Editor is ready to use!', editor);
                                                //}}
                                                onChange={(event, editor) => {
                                                  const data = editor?.getData();
                                                  this.handleInputChangeReportBuilder(event, index, "desc", data)
                                                  errors[`seq${item?.sequence}`] = '';
                                                }}
                                              />
                                            </GrammarlyEditorPlugin>
                                          </Grammarly>
                                        </div>
                                      </div>
                                    </CardBody>
                                  </Collapse>
                                  {(item.description !== '' || item.title !== '') && <h5 className='error'>{`seq${item?.sequence}` in errors && errors[`seq${item?.sequence}`]}</h5>}
                                </Card>
                              </Fade>
                            </Col>

                          </>
                        )
                      })}

                    <hr />

                    {/* <div className="col-md-12">
                      <div className="form-group row my-4">
                        <div className="col-md-12">
                          {/*<Input className={errors.OtherConsiderationsNote ? "is-invalid" : "is-valid"} type="textarea" rows="2" placeholder="Enter other considerations note" name="OtherConsiderationsNote" value={OtherConsiderationsNote} onChange={this.handleInputChange.bind(this)} />
                          <h4><u>Other Considerations Note</u></h4>
                          <CKEditor
                            editor={ClassicEditor}
                            data={OtherConsiderationsNote}
                            //onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            //console.log('Editor is ready to use!', editor);
                            //}}
                            onChange={(event, editor) => {
                              const data = editor?.getData();
                              this.setState({ OtherConsiderationsNote: data });
                              errors.OtherConsiderationsNote = '';
                            }}
                          />
                          {OtherConsiderationsNote?.trim() === '' && <h5 className='error'>{errors.OtherConsiderationsNote}</h5>}
                        </div>
                      </div>
                    </div> */}

                    <hr />

                    {/* <div className="col-md-12">
                      <div className="form-group row my-4">
                        <div className="col-md-12">
                          {/*<Input className={errors.LastSummaryNote ? "is-invalid" : "is-valid"} type="textarea" rows="2" placeholder="Enter last summary note" name="LastSummaryNote" value={LastSummaryNote} onChange={this.handleInputChange.bind(this)} />
                          <h4><u>Last Summary Note</u></h4>
                          <CKEditor
                            editor={ClassicEditor}
                            data={LastSummaryNote}
                            //onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            //console.log('Editor is ready to use!', editor);
                            //}}
                            onChange={(event, editor) => {
                              const data = editor?.getData();
                              this.setState({ LastSummaryNote: data });
                              errors.LastSummaryNote = '';
                            }}
                          />
                          {LastSummaryNote?.trim() === '' && <h5 className='error'>{errors.LastSummaryNote}</h5>}
                        </div>
                      </div>
                    </div> */}

                    <div className="col-md-12">
                      <div className="form-group my-4 mx-0 col-md-12 text-right">
                        <Button onClick={() => { this.handleShowTableGene() }} color="primary"> Load Gene Hallmarks</Button>{" "}
                        <Button
                          disabled={loading || this.state.isSubmitEnabled}

                          type="submit" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>{" "}
                      </div>
                      <div className="form-group my-4 mx-0 formButton col-md-2">

                      </div>
                    </div>

                  </div>



                </Form>
              </CardBody>
            </Card>
            {/*) : (
                <div className="animated fadeIn pt-1 text-center">Loading...</div>
              )}*/}
          </Col>
        </Row>
        <Modal isOpen={showTableGene} className="modal-dialog modal-xl">
          <ModalHeader>
            Gene Hallmarks
          </ModalHeader>
          <ModalBody className="modal-body_right_modal">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Gene/ Protein</th>
                  <th scope="col">Hallmark No</th>
                  <th scope="col">Hallmark Title</th>
                  <th scope="col">Hallmark References</th>
                </tr>
              </thead>
              <tbody>
                {/* <span className="requiredField">*</span> */}
                {geneHallmarkData?.length > 0 ?
                  geneHallmarkData.map((data, index) => {
                    let hmno = hallMarkErrs?.[index]?.hallMarkNo
                    let htitle = hallMarkErrs?.[index]?.hallMarkTitle
                    let haref = hallMarkErrs?.[index]?.hallMarkReference
                    return <tr key={index}>
                      <td style={{ width: "10%" }}>{data?.geneName}</td>
                      <td style={{ width: "15%" }}>
                        {data?.hallMarkNo &&
                          <input value={data?.hallMarkNo}
                            onChange={(e) => { this.handleHallmarkRefChange(e.target.value, 'hallMarkNo', index, "Hallmark No") }}
                            disabled
                            className={
                              hmno ? "is-invalid" : "is-valid"
                            }
                          />}

                        <span className="error">{hmno}</span>
                      </td>
                      <td style={{ width: "30%" }}>
                        <textarea value={data?.hallMarkTitle}
                          style={{ width: "100%" }}

                          onChange={(e) => { this.handleHallmarkRefChange(e.target.value, 'hallMarkTitle', index, "Hallmark Title") }}
                          disabled
                          rows={5}
                          className={
                            htitle ? "is-invalid" : "is-valid"
                          }
                        />
                        <span className="error">{htitle}</span>
                      </td>
                      <td style={{ margin: "0" }}><textarea
                        onChange={(e) => { this.handleHallmarkRefChange(e.target.value, 'hallMarkReference', index, 'Hallmark References') }}
                        style={{ width: "100%" }}
                        placeholder="Enter Hallmark Reference"
                        className={
                          haref ? "is-invalid" : "is-valid"
                        }
                        rows={5} value={data?.hallMarkReference} />

                        <span className="error">{haref}</span>

                      </td>

                    </tr>
                  })
                  : ""}

              </tbody>
            </table>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseTableGene}>
              Close
            </Button>
            <Button color="primary" onClick={this.submitHallMarkRefs} type='button'>
              Confirm and Submit
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={showGenetic} className="modal-dialog modal-md right-modal">
          <ModalHeader>
            Add Genetic Characteristic
          </ModalHeader>
          <ModalBody className="modal-body_right_modal">
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Gene Name <span className="requiredField">*</span></label>
              <Input type="text" name="geneticTitle" tabIndex="1" className="form-control" value={geneticTitle} onChange={this.handleGenericInputChange.bind(this)} placeholder="Enter a Gene Name" />
              {errors.geneticTitle.length > 0 && <span className='error'>{errors.geneticTitle}</span>}
            </div>
            <div className="form-group">

              <label htmlFor="recipient-name" className="form-control-label">Description <span className="requiredField">*</span></label>
              <Grammarly clientId="client_Mygif7MAqrmjKVPfFwatyC">
                <GrammarlyEditorPlugin>
                  <CKEditor
                    editor={ClassicEditor}
                    // data={gdata.description || ""}
                    config={{
                      scayt_autoStartup: true,
                      placeholder: "Enter a description"
                    }}
                    //onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    //console.log('Editor is ready to use!', editor);
                    //}}
                    // onBlur = {e => this.handleInputChangeGeneric(e, i, 'desc')}
                    onChange={(event, editor) => {
                      const data = editor?.getData();
                      // errors.geneticDesc = data ? "" : "Please enter description.";
                      this.setState({
                        geneticDesc: data,
                        // errors
                      })
                      // this.handleInputChangeGeneric(event, i, 'desc', data)
                    }}
                    value={geneticDesc}
                  />
                </GrammarlyEditorPlugin>
              </Grammarly>

              {/* <Input type="textarea" name="geneticDesc" tabIndex="1" className="form-control " style={{ height: '55vh' }} value={geneticDesc} onChange={this.handleGenericInputChange.bind(this)} placeholder="Enter a description" /> */}
              {/* {errors.geneticDesc.length > 0 && <span className='error'>{errors.geneticDesc}</span>} */}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseGeneric}>
              Close
            </Button>
            <Button color="primary" onClick={this.addGeneric.bind(this)}>
              Add
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

export default PatientReportDetail;
