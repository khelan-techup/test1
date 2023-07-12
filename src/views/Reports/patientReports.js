import React, { Component, createRef } from 'react'
import { toast } from "react-toastify";
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
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
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container,
} from "reactstrap";
import _, { create } from "lodash"
import { Link, Redirect } from 'react-router-dom';
import axiosInstance from '../../common/axiosInstance';
import Moment from 'moment';
import { CSVLink } from "react-csv"
import ReactExport from 'react-data-export';
import TableToExcel from "@linways/table-to-excel";
import { data } from 'autoprefixer';
import axios from "axios";
import ReactHtmlParser from 'react-html-parser';
import InfiniteScroll from "react-infinite-scroll-component";
import { Steps } from "intro.js-react";
import { BE_Common_GetPatientDropdown, BE_NGSLaboratory_GetAllPaging, BE_OrganizationUser_GetByRoleId, BE_OrganizationUser_UpdateTooltipSteps, BE_Patient_GetAllPatientLogs } from '../../common/allApiEndPoints';


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class patientReports extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();

        this.initialState = {
            cols: "40,40,60,60,20,20,20,20,20,20,20,60,60,60,60,20,20,20,30,30,8,8,8,20,20,20,20",
            tableMenu: false,
            tableData: [],
            tableData2: [],
            loading: false, searchString: "",
            designActivityData: [],
            allData: false,
            AnalysisOrder: {
                orderSubmitted: true,
                poSent: true,
                invoiceSent: true,
                paymentRecieve: true
            },
            designOrder: {
                designOrder: true,
                poSent: true,
                invoiceSent: true,
                paymentRecieve: true
            },
            Pipeline: {
                varifyData: true,
                processData: true,
            },
            report: {
                cancer: true,
                healthIndex: true,
                pmr: true,
            },
            peptide: {
                pmrSentToClinic: true,
                clinicSentPmr: true,
                peptideRecivedByClinic: true,
                treamentStarted: true
            },
            // tymora: {
            //     ResultRecieved: true,
            //     samplesRecieved: true
            // },
            // psomagen: {
            //     ResultRecieved: true,
            //     samplesRecieved: true
            // },
            allpractitioners: [],
            practitionerId: ''
            ,
            isRunning: true,
            patientStage: 1,
            AdminUser: false,
            role_Id: null,
            contactArrow: true,
            PractitionerArrow: true,
            analysisArrow: true,
            statusArrow: true,
            accesionArrow: true,
            openSearch: true,
            searchString: "",
            ngslaboratorys: [],
            labnames: [],
            labDetail: {},
            costumerCare: [],
            CcName: "",
            isSkipped: false,
            stepsEnabled: false, // stepsEnabled starts the tutorial
            initialStep: 0,
            currentStep: 0,
            AnalysisOrderSubmittedArrow: true,
            steps: [{
                element: "#pagetitle",
                title: 'Patient Tracker',
                intro: "This is a comprehensive table of all patients in our system.",
                tooltipClass: "cssClassName1",
            },
            {
                element: "#exportdata",
                title: 'Export Table Date',
                intro: "You can Export Table Data by clicking on this button.",
                tooltipClass: "cssClassName1",
            },
            {
                element: "#stage",

                title: 'Select Stage',
                tooltipClass: "cssClassName1",
                intro: "This will filter Patient list as per selected Stage of our process."
            }
                ,
            {
                element: "#selectcc",

                title: 'Select CC Representative',
                tooltipClass: "cssClassName1",
                intro: "Allows you to filter by Customer Care Representative."
            },
            {
                element: "#practitionerselect",
                title: "Select Practitioner",
                intro: 'This will filter Patient list as per selected Practitioner.',

                tooltipClass: "cssClassName1",
            },
            {
                element: "#searchbar",
                title: 'Search Patient',

                tooltipClass: "cssClassName1",
                intro: "You can search Patient using this searchbar."
            },
            {
                element: "#togglecontent",
                title: "Toggle Table Content",
                intro: 'This button displays a section that allows you to customize the content to display on the page and in the exported report.',

                tooltipClass: "cssClassName1",
            },
            {
                element: "#viewpatient",
                title: 'View Patient Details',

                tooltipClass: "cssClassName1",
                intro: "This will redirect you to the patient details page."
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
            ]
        }
        this.state = this.initialState;

    }

    onExit = (e) => {
        console.log(e)
        this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 8 }));
        // localStorage.setItem("isFirstLogin", false);
        // this.sendCurrentStep()

    };

    onAfterChange = newStepIndex => {
        if (newStepIndex === 7) {
            const element = document.querySelector('#viewpatient')

            if (!element) this.myRef.current.introJs.nextStep()
        }

    }
    getCostumerCareData() {
        const apiroute = window.$APIPath;
        // const url = apiroute + "/api/BE_OrganizationUser/GetByRoleId?id=5";
        const url = apiroute + BE_OrganizationUser_GetByRoleId(5)
        // let data = JSON.stringify({
        //   isDeleted: true,
        //   searchString: "",
        //   id: 0,
        // });
        axiosInstance.get(url, {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        })
            .then((result) => {
                this.setState({
                    costumerCare: result?.data?.outdata
                })
                // console.log(this.state.costumerCare, "ghvvvvyyvtgvtgresult")

            }).catch((e) => {
                this.setState({ loading: false })
            })

    }
    getSelectedCcRepDetail() {
        let data = this.state.costumerCare.filter((obj) => obj.userId == this.state.ccId);
        console.log(`data`, data);

        this.setState({
            CcName: data[0]?.userId
        }, () => {

            this.getData()
        })
        // return `${data[0]?.fullName}`
        // this.setState({practitionerfirstName:data[0].firstName,practitionerlastName:data[0].lastName})
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





    export = () => {
        let ele = document.getElementById("mytable")
        const cols = this.countCols();
        this.setState({ cols: cols.join(',') }, () => {

            TableToExcel.convert(ele, {
                name: `PatientTracker-${Moment(new Date().toString()).format("DD-MMM-YYYY")}.xlsx`,
                sheet: {
                    name: "Sheet 1"
                }
            });
        })
    }
    getStatusValue = (status) => {
        switch (status) {
            // Active = 1,
            // OnHold = 2,
            // Complete = 3,
            // Cancelled = 4,
            // Deceased = 5,
            case 1:
            case '1':
                {
                    return 'Active'

                    break;
                };
            case 2:
            case '2':
                {
                    return "On Hold"
                    break;
                }
            case 3:
            case '3': {
                return 'Complete';
                break;
            }
            case 4:
            case '4': {
                return 'Cancelled';
                break;
            }
            case 5:
            case '5':
                {
                    return 'Deceased'
                    break;
                }
            default:
                return "Active"
        }
    }
    countCols = () => {
        let cols = [40, 40, 60, 60, 20];
        const analysis = this.state.AnalysisOrder
        const design = this.state.designOrder
        const pipeline = this.state.Pipeline
        const report = this.state.report
        const peptide = this.state.peptide

        const anakeys = Object.keys(analysis).filter((e) => analysis[e]).map((e) => { return 20 })
        const desKeys = Object.keys(design).filter((e) => design[e]).map((e) => { return 20 })
        const pipKeys = Object.keys(pipeline).filter((e) => pipeline[e]).map((e) => { return 30 })
        const repKeys = Object.keys(report).filter((e) => report[e]).map((e) => { return 8 })
        const pepkeys = Object.keys(peptide).filter((e) => peptide[e]).map((e) => { return 20 })
        // console.log({
        //     anakeys,
        //     desKeys,
        //     pipKeys,
        //     repKeys,
        //     pepkeys,
        //     cols,
        //     colsU: [...cols, ...anakeys, ...desKeys, ...pipKeys, ...repKeys, ...pepkeys]

        // })
        return [...cols, ...anakeys, ...desKeys, ...pipKeys, ...repKeys, ...pepkeys]

    }


    /**
     * 
     * @param {'AnalysisOrder'|'designOrder'|'Pipeline'|'report'|'peptide'} name 
     */
    isMainCheked = (name) => {

        let state = this.state[name];
        return Object.keys(state).every((e) => !state[e])
    }
    isMainChekedForLab = (pName, cName) => {

        let state = this.state[pName];
        return Object.keys(state[cName]).every((e) => !state[cName][e])
    }
    getExcelData = () => {

        return this.state.tableData.map((e) => {
            //     let analysisType = e?.patientAccessionMappings?.[0]?.diseaseCategory
            //     let accessionNo = e?.patientAccessionMappings?.[0]?.accessionNo?.replaceAll?.("-", '')
            //     let practitioner = e?.practitionerModels?.[0];
            //     let practitionerName = `${practitioner?.firstName + " " + practitioner?.lastName} + " " ${practitioner?.email + "  " + practitioner?.mobile}
            // }  `
            //     let sectionDetails = e?.viewPatientModel;
            //     let analysisOrderStatus = sectionDetails?.analysisOrderStatus
            //     let orderSubmitedDate = analysisOrderStatus?.orderSubmitedDate
            //     let patientName = e?.firstName + " " + (e?.middleName != null ? e?.middleName : "") + " " + e?.lastName
            //     let contact = `
            //         ${e?.email}

            //         ${e?.mobile}
            //     `

            let accessionDetails = e?.patientAccessionMappings?.[0]
            let patientDisease = e?.viewPatientModel?.patientDisease?.[0]
            let analysisType = e?.patientAccessionMappings?.[0]?.diseaseCategory
            let diseaseCategoryId = accessionDetails?.diseaseCategoryId
            let displayDisase = [1, 2, 3].includes(diseaseCategoryId)
            let accessionNo = e?.patientAccessionMappings?.[0]?.accessionNo?.replaceAll?.("-", '')
            let patientName = e?.firstName + " " + (e?.middleName != null ? e?.middleName : "") + " " + e?.lastName
            let contact = `
                ${e?.email}
                ${e?.mobile}
            `
            let practitioner = e?.practitionerModels?.[0];
            let practitionerName = practitioner?.firstName + " " + practitioner?.lastName

            let sectionDetails = e?.viewPatientModel;
            let analysisOrderStatus = sectionDetails?.analysisOrderStatus
            let orderSubmitedDate = analysisOrderStatus?.orderSubmitedDate
            let poSent = analysisOrderStatus?.poReceivedDate
            let invoiceSent = analysisOrderStatus?.invoiceSendDate
            let paymentReceived = analysisOrderStatus?.paymentReceivedDate


            let designOrderStatus = sectionDetails?.designOrderStatus
            let dPoSent = designOrderStatus?.orderSubmitedDate
            let sentToAcc = designOrderStatus?.poReceivedDate
            let dInvoiceSent = designOrderStatus?.invoiceSendDate
            let dPayment = designOrderStatus?.paymentReceivedDate
            let designActivityData = sectionDetails?.designActivity
            let patientReportsData = sectionDetails?.patientReports

            let peptidestatus = sectionDetails?.peptideStatus
            let peptidePmrSentDate = peptidestatus?.pmrSendToCilnicDate
            let peptideClinicSentDate = peptidestatus?.clinicSendPMRToPharmacyDate
            let peptidePeptideRecievedDate = peptidestatus?.peptidesReceivedByClinicDate
            let peptideTreatmentDate = peptidestatus?.treatmentStartedDate






            return {
                // orderHistoryId: e?.viewPatientModel?.analysisOrderStatus?.orderHistoryId || "",
                patientName,
                accessionNo,
                contact,
                analysisType,
                practitionerName,
                orderSubmitedDate: Moment(orderSubmitedDate).format("MM/DD/YYYY") || "",
                poSent: Moment(poSent).format("MM/DD/YYYY") || "",
                invoiceSent: Moment(invoiceSent).format("MM/DD/YYYY") || "",
                paymentReceived: Moment(paymentReceived).format("MM/DD/YYYY") || "",
                dPoSent: Moment(dPoSent).format("MM/DD/YYYY") || "",
                sentToAcc: Moment(sentToAcc).format("MM/DD/YYYY") || "",
                dInvoiceSent: Moment(dInvoiceSent).format("MM/DD/YYYY") || "",
                dPayment: Moment(dPayment).format("MM/DD/YYYY") || "",
                verifyData: this.getPipeLineStatus(designActivityData) || "",
                processData: this.getProcessStatus(designActivityData) || "",
                cancer: patientReportsData?.patientReport == null ? "" : "Yes",
                healthIndex: patientReportsData?.healthIndexReport == null ? "" : "Yes",
                pmr: patientReportsData?.pmrReport == null ? "" : "Yes",
                peptidePmrSentDate: Moment(peptidePmrSentDate).format("MM/DD/YYYY") || "",
                peptideClinicSentDate: Moment(peptideClinicSentDate).format("MM/DD/YYYY") || "",
                peptidePeptideRecievedDate: Moment(peptidePeptideRecievedDate).format("MM/DD/YYYY") || "",
                peptideTreatmentDate: Moment(peptideTreatmentDate).format("MM/DD/YYYY") || ""
            }
        })
    }

    // getStyledData = () => {
    //     let data = {
    //         columns: [
    //             { title: "Headings", width: { wpx: 80 } },//pixels width 
    //             { title: "Text Style", width: { wch: 40 } },//char width 
    //             { title: "Colors", width: { wpx: 90 } },
    //         ]
    //     }
    //     let arrValues = this.state.tableData.map((e) => {
    //         let accessionNo = e?.patientAccessionMappings?.[0]?.accessionNo?.replaceAll?.("-", '')
    //         let patientName = e?.firstName + " " + (e?.middleName != null ? e?.middleName : "") + " " + e?.lastName
    //         let contact = <>
    //             {e?.email}<br />
    //             {e?.mobile}<br />
    //         </>

    //         return [
    //             { value: accessionNo, style: { font: { sz: "24", bold: true } } },
    //             { value: patientName, style: { font: { bold: true } } },
    //             { value: contact, style: { fill: { patternType: "solid", fgColor: { rgb: "FFFF0000" } } } },
    //         ]
    //         // return {
    //         //     // orderHistoryId: e?.viewPatientModel?.analysisOrderStatus?.orderHistoryId || "",
    //         //     patientName,
    //         //     accessionNo
    //         // }
    //     })
    //     data.data = arrValues
    //     console.log(data)
    //     return data
    // }
    displayContext = () => {
        const keys = Object.keys(this.state.labDetail)
        const ladDetails = this.state.labDetail
        return keys.map((name) => {
            return <>

                <Col lg="12">
                    <Input type="checkbox"
                        checked={!this.isMainChekedForLab("labDetail", name)}
                        className='ml-4' tabIndex="4" id={name + 1} name={_.capitalize(name)} onChange={(e) => { this.toggleAllChildsForLab("labDetail", name) }} />
                    <Label htmlFor={name + 1} className='ml-5 font-weight-bold'>{_.capitalize(name)}</Label>


                </Col>

                <Col lg='12' className='ml-5'>
                    <Input type="checkbox" className='ml-0' checked={ladDetails[name].resultRecieved} tabIndex="4" id={name + 2} name="resultRecieved" onChange={(e) => { this.handleChangeLab(e, "labDetail", name) }} />
                    <Label htmlFor={name + 2} className='ml-4' >Result received</Label>

                </Col>
                <Col lg='12' className='ml-5'>
                    <Input type="checkbox" className='ml-0' checked={ladDetails[name].samplesRecieved} tabIndex="4" id={name + 3} name="samplesRecieved" onChange={(e) => { this.handleChangeLab(e, "labDetail", name) }} />
                    <Label htmlFor={name + 3} className='ml-4' name="">Samples received</Label></Col>














                {/*                 
                {_.capitalize(e)}
                <div>
                    resultRecieved:   {String(ladDetails[e].resultRecieved)}
                    <br />
                    samplesRecieved : {String(ladDetails[e].samplesRecieved)}
                </div> */}
            </>
        })
    }
    /**
     * 
     * 
     * 
     * @param {'AnalysisOrder'|'designOrder'|'report'|'peptide'} name 
     */
    getCallSpans = (name) => {
        let state = this.state[name]
        let falsys = Object.keys(state).filter(e => state[e] === true)
        return falsys.length
    }
    /**
         * 
         * @param {'AnalysisOrder'|'designOrder'|'report'|'peptide'} name 
         */
    toggleAllChilds = (name) => {

        let state = _.cloneDeep(this.state[name])
        let value = this.isMainCheked(name)
        Object.keys(state).map((e) => {
            state[e] = value;
        })
        this.setState({
            [name]: state
        })
    }
    toggleAllChildsForLab = (pName, name) => {

        let state = _.cloneDeep(this.state[pName][name])
        let value = this.isMainChekedForLab(pName, name)
        Object.keys(state).map((e) => {
            state[e] = value;
        })
        this.setState({
            [pName]: {
                ...this.state[pName],
                [name]: state
            }
        })
    }
    loader() {
        if (this.state.loading) {

            if (this.state?.allData) {

                return <div><div className="cover-spin"></div><div style={{ position: "fixed", top: "58%", left: "45%", zIndex: "1000" }}><p style={{ backgroundColor: "#1C3A84", color: "#fff", padding: "5px" }}> It will take some time to load</p></div></div>;
            } else {
                return <div className="cover-spin"></div>
            }
        }
    }

    getData = () => {
        if (Number(this.state?.patientStage) == 0) {
            this.setState({ loading: true, allData: true })
        } else {

            this.setState({ loading: true })
        }
        const apiroute = window.$APIPath;
        // const url = apiroute + '/api/BE_Patient/GetAllPatientLogs';
        const url = apiroute + BE_Patient_GetAllPatientLogs

        let data = JSON.stringify({
            "practitionerId": this.state.practitionerId,
            "isRunning": false,
            // "isRunning": this.state.isRunning,
            "isDeleted": true,
            "searchString": this.state.searchString,
            "id": 0,
            "pageNo": 0,
            "totalNo": 0,
            "patientStage": Number(this.state?.patientStage),
            "ccName": this.state?.CcName != undefined ? String(this.state?.CcName) : ""

        });

        axiosInstance.post(url, data, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then((res) => {
            // console.log(res)
            if (res.data?.flag) {
                let data = res.data?.outdata
                let data2 = res.data?.outdata
                this.setState({
                    tableData: [...data] || [],
                    tableData2: data2 || [],
                    designActivityData: data.viewPatientModel?.designActivity || [],
                    loading: false,
                    allData: false
                })
                this.getCostumerCareData()
            }
            else {
                this.setState({
                    loading: false,
                })
                toast.error(res.data?.message)
            }
        }).catch((e) => {
            this.setState({ loading: false })
        })
        // this.setState({ loading: false })

    }


    getLabListData(pageNo) {
        this.setState({ loading: true })
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        let userId = userToken.userId == null ? 0 : userToken.userId;

        const apiroute = window.$APIPath;
        // const url = apiroute + "/api/BE_NGSLaboratory/GetAllPaging";
        const url = apiroute + BE_NGSLaboratory_GetAllPaging

        let data = JSON.stringify({
            isDeleted: true,
            searchString: "",
            Id: userId,
            pageNo: pageNo,
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
                    console.log(result.data.outdata);
                    // let labsCheked = result.data.outdata.ngsLaboratoryData.map((e, i) => {
                    //     return e.ngsLabName = [i = true, i = true]
                    // })
                    // console.log(labsCheked);
                    const labDetail = {}
                    let labs = result.data.outdata.ngsLaboratoryData.map((e) => {

                        labDetail[e.ngsLabName] = { resultRecieved: true, samplesRecieved: true }
                        // return { [e.ngsLabName]: { resultRecieved: true, samplesRecieved: true } }

                    })
                    this.setState({
                        // labData: result?.data?.outdata?.ngsLaboratoryData,
                        labDetail,
                        ngslaboratorys: result.data.outdata.ngsLaboratoryData,
                        labnames: labs,
                        // AllDiseaseCategory: result.data.outdata.diseaseCategoryData,
                        // diseaseCategoryId: result.data.outdata.diseaseCategoryData[0]?.diseaseCategoryId,
                        // loading: false,
                    });
                } else {
                    // console.log(result.data.message);
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                // console.log(error);
                this.setState({ authError: true, error: error, loading: false });
            });
    }


    getPipeLineStatus = (designData) => {

        let designactivity = designData
        let status = String(designactivity?.verifyStatus).toLowerCase()
        let started = status == 'started'
        let completed = status == 'completed'
        let failed = status == 'failed'
        let isWarning = status == 'warning'

        let Pstarted = designactivity?.designStarted
        let Pfailed = designactivity?.designFailed
        let Pcompleted = designactivity?.designCompleted
        let PisWarning = designactivity?.designWarning
        let currentStatus = designactivity?.currentStatus
        let Preason = designactivity?.reason || ""
        let varifyReason = designactivity?.verifyReason || ""
        if (failed) {
            return <>{varifyReason}</>
            // return (

            //     <div className="">
            //         <br />
            //         <p className="px-lg-2 text-bold" style={{ color: "red", fontWeight: "bold" }}>
            //             {/* <span>
            //             <img className="mr-3"
            //                 src={error_icon} style={{ height: "20px", width: "20px" }} alt="" />
            //         </span> */}
            //             Something went wrong, please see the reason.</p>
            //         <p className="px-lg-2 text-bold" >
            //             {/* {console.log("designactivity?.reason", designactivity?.reason)} */}
            //             <a style={{ color: "black" }} href={varifyReason?.slice?.(varifyReason?.search("http"))} target="_blank">
            //                 {varifyReason}
            //                 {/* Click here to see the reason. */}
            //             </a>
            //         </p>
            //     </div>
            // )
        }
        if (completed && !Pstarted) {

            return "Data Verified successfully."
            // return
            //  <div>
            //     <br />
            //     <p className="px-lg-2  text-bold" style={{ color: "green", fontWeight: "bold" }}>
            //         {/* <span>
            //             <img className="mr-3"
            //                 src={success_icon} style={{ height: "20px", width: "20px" }} alt="" />
            //         </span> */}
            //         Data Verified successfully.
            //     </p>

            //     {/* <p className="pl-lg-5 text-bold" style={{ color: "black", fontWeight: "bold" }}>Please go for further steps.</p> */}

            // </div>


        }
        if (started) {

            return "Verifying Data"
            // return (<><p className="px-lg-5 text-bold d-flex align-items-center" style={{ color: "orange", fontWeight: "bold" }}>

            //     Verifying Data

            //     {/* <div class="dot-puls mb-2 ml-1" role="status">
            //     </div> */}
            // </p></>)
            {/* <div className='dot-puls'></div></> */ }
        }
        if (isWarning) {
            return `${designactivity?.verifyReason}`
            // return 
            // <p className="px-lg-5 m-2 text-bold" style={{ color: "orange", fontWeight: "bold" }}>{designactivity?.verifyReason}</p>

        }
        if (Pfailed) {

            return `${Preason}`
            // return (<div className="m-2">
            //     <br />
            //     <p className="px-lg-3 text-bold" style={{ color: "red", fontWeight: "bold" }}>
            //         {/* <span>
            //             <img className="mr-2"
            //                 src={error_icon} style={{ height: "20px", width: "20px", marginTop: "-5px" }} alt="" />
            //         </span> */}
            //         Pipeline Failed, please see the reason.</p>
            //     <a className="p-2 m-2 " href={Preason?.slice?.(Preason?.search("http"))}  >
            //         {Preason}
            //     </a>
            // </div>
            // )
        }
        if (Pcompleted) {

            return "Data processed successfully."
            // return <div>
            //     <br />
            //     <p className="px-lg-2  text-bold" style={{ color: "green", fontWeight: "bold" }}>
            //         {/* <span>
            //             <img className="mr-3"
            //                 src={success_icon} style={{ height: "20px", width: "20px" }} alt="" />
            //         </span> */}
            //         Data processed successfully.
            //     </p>
            //     <p className="pl-lg-5 text-bold" style={{ color: "green", fontWeight: "bold" }}>Please go for further steps.</p>
            // </div>
        }
        if (Pstarted) {

            return "Processing Data"
            // return (<><p className="px-lg-5 text-bold d-flex align-items-center" style={{ color: "orange", fontWeight: "bold" }}>
            //     Processing Data

            //     {/* <div class="dot-puls mb-2 ml-1" role="status">
            //     </div> */}
            // </p></>)
            {/* <div className='dot-puls'></div></> */ }
        }
        if (PisWarning) {

            return <>{Preason}</>
            // return <p className="px-lg-5 text-bold" style={{ color: "orange", fontWeight: "bold" }}>Here is some Warning to Process Data
            //     <br />
            //     {Preason}</p>

        }
    }
    getProcessStatus = (designData) => {

        let designactivity = designData


        let Pstarted = designactivity?.designStarted
        let Pfailed = designactivity?.designFailed
        let Pcompleted = designactivity?.designCompleted
        let PisWarning = designactivity?.designWarning
        let currentStatus = designactivity?.currentStatus
        let Preason = designactivity?.reason || ""
        let varifyReason = designactivity?.verifyReason || ""


        if (Pfailed) {

            // return { Preason }
            return <>{Preason}</>
            // return (<div className="m-2">
            //     <br />
            //     <p className="px-lg-3 text-bold" style={{ color: "red", fontWeight: "bold" }}>
            //         {/* <span>
            //             <img className="mr-2"
            //                 src={error_icon} style={{ height: "20px", width: "20px", marginTop: "-5px" }} alt="" />
            //         </span> */}
            //         Process Data Failed, please see the reason.</p>
            //     <a className="p-2 m-2 " href={Preason?.slice?.(Preason?.search("http"))}  >
            //         {Preason}
            //     </a>
            // </div>
            // )
        } else if (Pcompleted) {

            return "Data processed successfully."
            // return <div>
            //     <br />
            //     <p className="px-lg-2  text-bold" style={{ color: "green", fontWeight: "bold" }}>
            //         {/* <span>
            //             <img className="mr-3"
            //                 src={success_icon} style={{ height: "20px", width: "20px" }} alt="" />
            //         </span> */}
            //         Data processed successfully.
            //     </p>
            // </div>
        } else if (Pstarted && !Pcompleted) {

            return "Processing design Data"
            // return (<><p className="px-lg-5 text-bold d-flex align-items-center" style={{ color: "orange", fontWeight: "bold" }}>
            //     Processing design Data

            //     {/* <div class="dot-puls mb-2 ml-1" role="status">
            //     </div> */}
            // </p ></>)
            {/* <div className='dot-puls'></div></> */ }
        } else if (PisWarning) {

            return <>{Preason}</>
            // return <p className="px-lg-5 text-bold" style={{ color: "orange", fontWeight: "bold" }}>
            //     <br />
            //     Here is some Warning to Process Data
            //     {Preason}</p>

        }
    }
    filter = (e) => {
        if (e.key == 'Enter') {
            const target = e.target;
            const value = target.value;

            this.setState(() => ({
                loading: true,
                // currentPage: 0,
                // currentIndex: 0,
                // pagesCount: 0,
                //pageSize: 10,
                searchString: value.trim()
            }), function () { this.getData(0); });
        }
    }
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
                // currentPage: 0,
                // currentIndex: 0,
                // pagesCount: 0,
                //pageSize: 10,
                searchString: ''
            }), function () { this.getData(0); });
        }
    }

    getPatientData() {
        this.setState({
            loading: true
        })
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
            }).then((result) => {
                this.setState({
                    allpractitioners: result?.data?.outdata?.practitionerData
                })
                this.getLabListData()
                // console.log(this.state.allpractitioners, "hhhhhhhhhhhhhhhh")
            }).catch((e) => {
                toast.error(e.message || "error while getting report tracker data")
                this.setState({
                    loading: false
                })
            })

    }


    handleChange = (e, pname) => {
        // Destructuring
        // console.log(e.target)

        const { value, checked, name } = e.target;
        // console.log(value, checked, name)
        // if (name == "AnalysisOrderStatus") {
        //     this.setState({
        //         analysisOrderStatus: checked
        //     });
        // } else {
        this.setState({
            [pname]: {
                ...this.state[pname],
                [name]: checked,
            }
        });
        // }


        let analysisArr = this.state.AnalysisOrder

        let check = Object.values(analysisArr).every(
            value => value === true
        );

        this.setState({
            analysisOrderStatus: check
        });
        // console.log(check)
        // console.log(this.state.AnalysisOrder)
    }

    handleChangeLab = (e, pname, cName) => {
        // Destructuring
        // console.log(e.target)

        const { value, checked, name } = e.target;
        // console.log(value, checked, name)
        // if (name == "AnalysisOrderStatus") {
        //     this.setState({
        //         analysisOrderStatus: checked
        //     });
        // } else {
        this.setState({
            [pname]: {
                ...this.state[pname],
                [cName]: {
                    ...this.state[pname][cName],
                    [name]: checked
                }
            }
        });
        // }


        let analysisArr = this.state.AnalysisOrder

        let check = Object.values(analysisArr).every(
            value => value === true
        );

        this.setState({
            analysisOrderStatus: check
        });
        // console.log(check)
        // console.log(this.state.AnalysisOrder)
    }
    handleRadio = (e) => {
        let target = e?.target;
        let value = target?.value == 'y';

        this.setState({ isRunning: value }, () => {

            this.getData()
        })
    }

    search = (e) => {
        if (e.key == "Enter") {
            const target = e.target;
            const value = target.value;

            this.setState(
                () => ({
                    // loading: true,


                    searchString: value.trim(),
                }),
                () => {
                    // this.getData()
                }
            );
        }
    };

    handleInputChange(event) {

        const target = event.target;
        let value = target.value;
        const name = target.name;

        // alert(`${ name } - ${ value } `)
        this.setState({
            [name]: value,
        }, () => {
            if (name == 'practitionerId' || name == 'patientStage') {
                this.getData()
            } else if (name == "ccId") {
                this.getSelectedCcRepDetail()

            }

        });
    }
    assandData = () => {
        const numAscending = [...this.state.tableData].sort((a, b) => a?.email - b?.email);
        console.log(numAscending);
    }

    alphaDecending = (name) => {
        if (name == "accesionno") {
            const strAscending = [...this.state.tableData].sort((a, b) =>
                a?.patientAccessionMappings?.[0]?.accessionNo > b?.patientAccessionMappings?.[0]?.accessionNo ? 1 : -1,
            );
            console.log(strAscending);
            this.setState({
                tableData: [...strAscending],
                // contactArrow: false,
                accesionArrow: false
                // PractitionerArrow: true,
                // analysisArrow: true
            })
        }
        if (name == "AnalysisOrderSubmitted") {
            const strAscending = [...this.state.tableData].sort((a, b) =>
                a?.viewPatientModel?.analysisOrderStatus?.orderSubmitedDate > b?.viewPatientModel?.analysisOrderStatus?.orderSubmitedDate ? 1 : -1,
            );
            console.log(strAscending);
            this.setState({
                tableData: [...strAscending],
                // contactArrow: false,
                AnalysisOrderSubmittedArrow: false
                // PractitionerArrow: true,
                // analysisArrow: true
            })
        }

        if (name == "email") {
            const strAscending = [...this.state.tableData].sort((a, b) =>
                a.email > b.email ? 1 : -1,
            );
            console.log(strAscending);
            this.setState({
                tableData: [...strAscending],
                contactArrow: false,
                // PractitionerArrow: true,
                // analysisArrow: true
            })
        }
        if (name == "PractitionerName") {

            const strAscending = [...this.state.tableData].sort((a, b) =>
                a?.viewPatientModel?.practitionerPatient.firstName > b?.viewPatientModel?.practitionerPatient.firstName ? 1 : -1,
            );
            // console.log(strAscending)
            this.setState({
                tableData: [...strAscending],
                // contactArrow: true,
                PractitionerArrow: false,
                // analysisArrow: true
            })
        }
        if (name == "analysisType") {

            const strAscending = [...this.state.tableData].sort((a, b) =>
                (a?.patientAccessionMappings?.[0]?.diseaseCategory).toLowerCase() > (b?.patientAccessionMappings?.[0]?.diseaseCategory).toLowerCase() ? 1 : -1,
            );
            // console.log(strAscending)
            this.setState({
                tableData: [...strAscending],
                // contactArrow: true,
                // PractitionerArrow: true,
                analysisArrow: false
            })
        }
        if (name == "status") {

            const strAscending = [...this.state.tableData].sort((a, b) =>
                a?.patientAccessionMappings?.[0]?.accessionStatusId - b?.patientAccessionMappings?.[0]?.accessionStatusId

            );
            // ((a, b) => a?.email - b?.email)
            // console.log(strAscending)
            this.setState({
                tableData: [...strAscending],
                // contactArrow: true,
                // PractitionerArrow: true,
                // analysisArrow: true,
                statusArrow: false
            })
        }

    }


    alphaAcsending = (name) => {
        if (name == "accesionno") {
            const strAscending = [...this.state.tableData].sort((a, b) =>
                a?.patientAccessionMappings?.[0]?.accessionNo > b?.patientAccessionMappings?.[0]?.accessionNo ? -1 : 1,
            );
            console.log(strAscending);
            this.setState({
                tableData: [...strAscending],
                // contactArrow: false,
                accesionArrow: true
                // PractitionerArrow: true,
                // analysisArrow: true
            })
        }
        if (name == "AnalysisOrderSubmitted") {
            const strAscending = [...this.state.tableData].sort((a, b) =>
                a?.viewPatientModel?.analysisOrderStatus?.orderSubmitedDate > b?.viewPatientModel?.analysisOrderStatus?.orderSubmitedDate ? -1 : 1,
            );
            console.log(strAscending);
            this.setState({
                tableData: [...strAscending],
                // contactArrow: false,
                AnalysisOrderSubmittedArrow: true
                // PractitionerArrow: true,
                // analysisArrow: true
            })
        }
        if (name == "email") {
            const strAscending = [...this.state.tableData].sort((a, b) =>
                a.email > b.email ? -1 : 1,
            );
            console.log(strAscending);
            this.setState({
                tableData: [...strAscending],
                contactArrow: true,
                // PractitionerArrow: true,
                // analysisArrow: true
            })
        }
        if (name == "PractitionerName") {

            const strAscending = [...this.state.tableData].sort((a, b) =>
                a?.viewPatientModel?.practitionerPatient.firstName > b?.viewPatientModel?.practitionerPatient.firstName ? -1 : 1,
            );
            // console.log(strAscending)
            this.setState({
                tableData: [...strAscending],
                // contactArrow: true,
                PractitionerArrow: true,
                // analysisArrow: true
            })
        }
        if (name == "analysisType") {

            const strAscending = [...this.state.tableData].sort((a, b) =>
                (a?.patientAccessionMappings?.[0]?.diseaseCategory).toLowerCase() > (b?.patientAccessionMappings?.[0]?.diseaseCategory).toLowerCase() ? -1 : 1,
            );
            // console.log(strAscending)
            this.setState({
                tableData: [...strAscending],
                // contactArrow: true,
                // PractitionerArrow: true,
                analysisArrow: true
            })
        }
        if (name == "status") {

            const strAscending = [...this.state.tableData].sort((a, b) =>
                b?.patientAccessionMappings?.[0]?.accessionStatusId - a?.patientAccessionMappings?.[0]?.accessionStatusId

            );
            // ((a, b) => a?.email - b?.email)
            // console.log(strAscending)
            this.setState({
                tableData: [...strAscending],
                // contactArrow: true,
                // PractitionerArrow: true,
                // analysisArrow: true,
                statusArrow: true
            })
        }

    }




    componentDidMount() {
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        var rights = userToken.roleModule;
        console.log(userToken.userType);

        if (userToken.roleId == 4 || userToken.roleId == 1) {

            this.setState({
                AdminUser: true
            })
        }
        this.setState({
            role_Id: userToken.roleId
        })
        this.getPatientData()
        this.getData()



        // let data = this.getStyledData()
        // this.setState({ td: data })

    }

    // fetchMoreData() {
    //     // this.state.tableData.length = 4
    //     // console.log("Hi",this.state.tableData.length = 4)
    //     this.setState({
    //         tableData:[...this.state.tableData2]
    //     },
    //    ()=>{
    //     this.state.tableData.length +=2 

    //    }

    //     )


    // }


    render() {
        const { tableMenu, tableData, designActivityData, AnalysisOrder, analysisOrderStatus, designOrder, Pipeline, report, peptide, allpractitioners, practitionerId, patientStage, contactArrow, PractitionerArrow, analysisArrow, statusArrow, accesionArrow, ngslaboratorys, labnames, costumerCare, } = this.state
        return (

            <div className='report-wrapper '>
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

                />
                <button className="help" id="help" type="btn" onClick={() => { this.toggleSteps() }}>
                    <i class="fa fa-question" aria-hidden="true"></i>
                </button>
                <Row className="mb-3">
                    <Col xs="11" lg="11">
                        <h5 className="mt-2" id='pagetitle' style={{ width: "fit-content" }}><i className="fa fa-align-justify"></i> Patient Tracker</h5>
                    </Col>
                    <Col xs="1" lg="1">
                        {/* <Link to="/report/list">
                            <button className="btn btn-primary btn-block">List</button>
                        </Link> */}
                    </Col>
                </Row>

                <Card className="">

                    <CardHeader>


                        <Row>
                            <Col xs="2">
                                <button className='btn btn-primary' onClick={this.export} id="exportdata">Export Data</button>
                                {/* <ExcelFile element={<button className='btn btn-primary'>Export Data</button>}>
                                    <ExcelSheet data={this.getExcelData()} name="Leaves">
                                        <ExcelColumn label="Accession No." value="accessionNo" />
                                        <ExcelColumn label="Patient Name" value="patientName" />
                                        <ExcelColumn label="Contact" value="contact" />
                                        <ExcelColumn label="Neo7 Analysis Type" value="analysisType" />
                                        <ExcelColumn label="Practitioner" value="practitionerName" />
                                        <ExcelColumn label="Order Submited" value="orderSubmitedDate" />
                                        <ExcelColumn label="PO Sent to Accounting" value="poSent" />
                                        <ExcelColumn label="Invoice Sent To Clinic" value="invoiceSent" />
                                        <ExcelColumn label="Payment Recieved" value="paymentReceived" />
                                        <ExcelColumn label="Send PO Notification" value="dPoSent" />
                                        <ExcelColumn label="PO Sent to Accounting" value="sentToAcc" />
                                        <ExcelColumn label="Invoice Sent to Clinic" value="dInvoiceSent" />
                                        <ExcelColumn label="Payment Recevied" value="dPayment" />
                                        <ExcelColumn label="Verify Data" value="verifyData" />

                                        <ExcelColumn label="Process Data" value="processData" />
                                        <ExcelColumn label="Cancer" value="cancer" />
                                        <ExcelColumn label="Health Index" value="healthIndex" />
                                        <ExcelColumn label="PMR" value="pmr" />
                                        <ExcelColumn label="PMR Sent To Clinic" value="peptidePmrSentDate" />
                                        <ExcelColumn label="Clinic sent PMR TO Pharmacy" value="peptideClinicSentDate" />
                                        <ExcelColumn label="Peptides Received By Clinic" value="peptidePeptideRecievedDate" />
                                        <ExcelColumn label="Treatment Started" value="peptideTreatmentDate" />


                                    </ExcelSheet>
                                </ExcelFile> */}
                            </Col>

                            <Col xs="2">
                                <FormGroup>
                                    {/* <Label>
                                        Practitioner{" "}
                                        <span className="requiredField">*</span>
                                    </Label> */}
                                    <Input
                                        id='stage'
                                        type="select"
                                        className={"custom-select "}
                                        name="patientStage"

                                        defaultValue={patientStage}
                                        onChange={this.handleInputChange.bind(this)}
                                    >
                                        <option value="0">All</option>
                                        <option value="1">All Open Orders</option>
                                        <option value="2">Orders with an Issue</option>
                                        <option value="3">On Hold Orders</option>
                                        <option value="4">Orders Completed or Stopped</option>

                                    </Input>

                                </FormGroup>

                                {/* <Form>
                                    <FormGroup className='d-flex'>
                                        <div className="custom-control custom-radio m-1">

                                            <Input type="radio" checked={this.state.isRunning} className="custom-control-input" value="y" id="male" name="type" tabIndex="3" onChange={this.handleRadio} />

                                            <Label className="custom-control-label" htmlFor="male">Running</Label>


                                        </div>
                                        <div className="custom-control custom-radio m-1">



                                            <Input type="radio" className="custom-control-input" value="n" id="Female" name="type" tabIndex="3" onChange={this.handleRadio} checked={!this.state.isRunning} />

                                            <Label className="custom-control-label" htmlFor="Female">Completed</Label>
                                        </div>

                                    </FormGroup>
                                </Form> */}
                            </Col>
                            <Col xs="2">
                                <FormGroup>
                                    {/* <Label>
                                        CC Representative{" "}
                                        <span className="requiredField">*</span>
                                    </Label> */}

                                    <Input
                                        type="select"
                                        className="custom-select"
                                        id='selectcc'
                                        name="ccId"

                                        // value={countryId}
                                        onChange={this.handleInputChange.bind(this)}
                                    >
                                        <option value="" >Select CC Representative</option>
                                        {costumerCare.map((data, i) => {
                                            return (
                                                <option key={i} value={data.userId}>
                                                    {data.fullName}
                                                </option>
                                            );
                                        })}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col xs="2">
                                <FormGroup>
                                    {/* <Label>
                                        Practitioner{" "}
                                        <span className="requiredField">*</span>
                                    </Label> */}
                                    <Input
                                        id='practitionerselect'
                                        type="select"
                                        className={"custom-select "}
                                        name="practitionerId"

                                        value={practitionerId}
                                        onChange={this.handleInputChange.bind(this)}
                                    >
                                        <option value="">Select Practitioner</option>
                                        {allpractitioners?.map((data, i) => {
                                            return (
                                                <option key={i} value={data.practitionerId} selected={this.state.practitionerId == data.practitionerId}>
                                                    {data.firstName + " " + data.lastName} {data.clinicName ? ("-" + data.clinicName) : ""}
                                                </option>
                                            );
                                        })}
                                    </Input>

                                </FormGroup>
                            </Col>
                            <Col xs="3">
                                <FormGroup>
                                    {/* <Label>
                                        Practitioner{" "}
                                        <span className="requiredField">*</span>
                                    </Label> */}


                                    <Col xs="12">
                                        {
                                            this.state.openSearch ? (
                                                <div className="searchBox">
                                                    <input id='searchbar' type="text" placeholder="Search..." onKeyPress={this.filter} />
                                                    <Link className="closeSearch" to="#" onClick={() => this.closeSearch()}><i className="fa fa-close" /></Link>
                                                </div>
                                            ) : (
                                                <div className="search" onClick={() => this.setState({ openSearch: true })}>
                                                    <i className="fa fa-search" />
                                                </div>
                                            )}
                                    </Col>



                                    {/* <Input
                                        type="select"
                                        className={"custom-select "}
                                        name="practitionerId"

                                        value={practitionerId}
                                        onChange={this.handleInputChange.bind(this)}
                                    >
                                        <option value="">Select Clinic</option>
                                        {allpractitioners?.map((data, i) => {
                                            return (
                                                <option key={i} value={data.practitionerId} selected={this.state.practitionerId == data.practitionerId}>
                                                    {data.firstName + " " + data.lastName}
                                                </option>
                                            );
                                        })}
                                    </Input> */}

                                </FormGroup>
                            </Col>
                        </Row>
                        <Dropdown isOpen={tableMenu} toggle={() => {
                            this.setState({ tableMenu: !tableMenu })
                        }}>
                            <DropdownToggle style={{ "float": "right", position: "absolute", top: "-51px", right: "0" }} id="togglecontent"><i className="fa fa-align-justify"></i></DropdownToggle>
                            <DropdownMenu style={{ "width": "80%", height: "85vh", overflowY: "auto" }}>
                                <DropdownItem header>Toggle Contents</DropdownItem>

                                <Form>
                                    <FormGroup>
                                        <Row>

                                            <Col lg="5" sm="5">
                                                {/* <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" /> */}
                                                <Label htmlFor='chk' className='ml-4 font-weight-bold'>Section Details</Label>

                                                <Col lg="12">
                                                    <Input type="checkbox"
                                                        checked={!this.isMainCheked('AnalysisOrder')}
                                                        className='ml-4' tabIndex="4" id="chk" name="AnalysisOrderStatus" onChange={(e) => { this.toggleAllChilds('AnalysisOrder') }} />
                                                    <Label htmlFor='chk' className='ml-5 font-weight-bold'>Analysis Order Status</Label>


                                                </Col>

                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={AnalysisOrder?.orderSubmitted} tabIndex="4" id="chk1" name="orderSubmitted" onChange={(e) => { this.handleChange(e, "AnalysisOrder") }} />
                                                    <Label htmlFor='chk1' className='ml-4' >Order Submitted</Label>

                                                </Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={AnalysisOrder?.poSent} tabIndex="4" id="chk2" name="poSent" onChange={(e) => { this.handleChange(e, "AnalysisOrder") }} />
                                                    <Label htmlFor='chk2' className='ml-4' name="">PO Sent to Accounting</Label></Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={AnalysisOrder?.invoiceSent} tabIndex="4" id="chk3" name="invoiceSent" onChange={(e) => { this.handleChange(e, "AnalysisOrder") }} />
                                                    <Label htmlFor='chk3' className='ml-4 '>Invoice Sent To Clinic</Label></Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={AnalysisOrder?.paymentRecieve} tabIndex="4" id="chk4" name="paymentRecieve" onChange={(e) => { this.handleChange(e, "AnalysisOrder") }} />
                                                    <Label htmlFor='chk4' className='ml-4 '>Payment Recieved</Label></Col>



                                                {this.displayContext()}


                                                {/*
                                                <Col lg="12">
                                                    <Input type="checkbox"
                                                        checked={!this.isMainCheked('tymora')}
                                                        className='ml-4' tabIndex="4" id="tym" name="tymora" onChange={(e) => { this.toggleAllChilds('tymora') }} />
                                                    <Label htmlFor='tym' className='ml-5 font-weight-bold'>Tymora (Lab)</Label>


                                                </Col>

                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={tymora?.samplesRecieved} tabIndex="4" id="Lab1" name="samplesRecieved" onChange={(e) => { this.handleChange(e, "tymora") }} />
                                                    <Label htmlFor='Lab1' className='ml-4' >Sample Received</Label>

                                                </Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={tymora?.ResultRecieved} tabIndex="4" id="Lab2" name="ResultRecieved" onChange={(e) => { this.handleChange(e, "tymora") }} />
                                                    <Label htmlFor='Lab2' className='ml-4' name="">Result Received</Label></Col>




                                                <Col lg="12">
                                                    <Input type="checkbox"
                                                        checked={!this.isMainCheked('psomagen')}
                                                        className='ml-4' tabIndex="4" id="lab3" name="psomagen" onChange={(e) => { this.toggleAllChilds('psomagen') }} />
                                                    <Label htmlFor='lab3' className='ml-5 font-weight-bold'>Psomagen (Lab)</Label>


                                                </Col>


                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={psomagen?.samplesRecieved} tabIndex="4" id="Lab4" name="samplesRecieved" onChange={(e) => { this.handleChange(e, "psomagen") }} />
                                                    <Label htmlFor='Lab4' className='ml-4' >Sample Received</Label>

                                                </Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={psomagen?.ResultRecieved} tabIndex="4" id="Lab5" name="ResultRecieved" onChange={(e) => { this.handleChange(e, "psomagen") }} />
                                                    <Label htmlFor='Lab5' className='ml-4' name="">Result Received</Label></Col> */}
                                            </Col>
                                            <Col lg="7" sm="7">
                                                <Label htmlFor='chk' className='ml-4 font-weight-bold'></Label>
                                                <Col lg='12'>
                                                    <Input type="checkbox"
                                                        checked={!this.isMainCheked('designOrder')}
                                                        onChange={(e) => { this.toggleAllChilds('designOrder') }}
                                                        className='ml-4' tabIndex="4" id="chk5" name="isNewPage" />
                                                    <Label htmlFor='chk5' className='ml-5 font-weight-bold'>Design Order Status</Label>


                                                </Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={designOrder?.designOrder} tabIndex="4" id="chk6" name="designOrder" onChange={(e) => { this.handleChange(e, "designOrder") }} />
                                                    <Label htmlFor='chk6' className='ml-4'>Send PO Notification	</Label>

                                                </Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={designOrder?.poSent} tabIndex="4" id="chk7" name="poSent" onChange={(e) => { this.handleChange(e, "designOrder") }} />
                                                    <Label htmlFor='chk7' className='ml-4 '>PO Sent to Accounting</Label></Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={designOrder?.invoiceSent} tabIndex="4" id="chk8" name="invoiceSent" onChange={(e) => { this.handleChange(e, "designOrder") }} />
                                                    <Label htmlFor='chk8' className='ml-4 '>Invoice Sent To Clinic</Label></Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={designOrder?.paymentRecieve} tabIndex="4" id="chk9" name="paymentRecieve" onChange={(e) => { this.handleChange(e, "designOrder") }} />
                                                    <Label htmlFor='chk9' className='ml-4 '>Payment Recieved</Label></Col>


                                                <Col lg='12'>
                                                    <Input type="checkbox"
                                                        checked={!this.isMainCheked('Pipeline')}
                                                        onChange={(e) => { this.toggleAllChilds('Pipeline') }}
                                                        className='ml-4' tabIndex="4" id="chk10" name="isNewPage" />
                                                    <Label htmlFor='chk10' className='ml-5 font-weight-bold'>Pipeline</Label>


                                                </Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={Pipeline?.varifyData} tabIndex="4" id="chk11" name="varifyData" onChange={(e) => { this.handleChange(e, "Pipeline") }} />
                                                    <Label htmlFor='chk11' className='ml-4'>Varify Data</Label>

                                                </Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={Pipeline?.processData} tabIndex="4" id="chk12" name="processData" onChange={(e) => { this.handleChange(e, "Pipeline") }} />
                                                    <Label htmlFor='chk12' className='ml-4 '>Process Data</Label></Col>


                                                {/* </Col> */}
                                                {/* <Col lg="4" sm="4"> */}

                                                <Col lg='12'>
                                                    <Input type="checkbox"
                                                        checked={!this.isMainCheked('report')}
                                                        onChange={(e) => { this.toggleAllChilds('report') }}
                                                        className='ml-4' tabIndex="4" id="chk13" name="isNewPage" />
                                                    <Label htmlFor='chk13' className='ml-5 font-weight-bold'>PMR & Final Report</Label>


                                                </Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={report?.cancer} tabIndex="4" id="chk14" name="cancer" onChange={(e) => { this.handleChange(e, "report") }} />
                                                    <Label htmlFor='chk14' className='ml-4'>Cancer</Label>

                                                </Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={report?.healthIndex} tabIndex="4" id="chk15" name="healthIndex" onChange={(e) => { this.handleChange(e, "report") }} />
                                                    <Label htmlFor='chk15' className='ml-4 '>Health Index</Label></Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={report?.pmr} tabIndex="4" id="chk16" name="pmr" onChange={(e) => { this.handleChange(e, "report") }} />
                                                    <Label htmlFor='chk16' className='ml-4 '>PMR</Label></Col>


                                                <Col lg='12'>
                                                    <Input type="checkbox"
                                                        checked={!this.isMainCheked('peptide')}
                                                        onChange={(e) => { this.toggleAllChilds('peptide') }}
                                                        className='ml-4' tabIndex="4" id="chk17" name="isNewPage" />
                                                    <Label htmlFor='chk17' className='ml-5 font-weight-bold'>PMR & Final Report Delivery</Label>


                                                </Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={peptide?.pmrSentToClinic} tabIndex="4" id="chk18" name="pmrSentToClinic" onChange={(e) => { this.handleChange(e, "peptide") }} />
                                                    <Label htmlFor='chk18' className='ml-4'>PMR Sent To Customer Care</Label>

                                                </Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={peptide?.clinicSentPmr} tabIndex="4" id="chk19" name="clinicSentPmr" onChange={(e) => { this.handleChange(e, "peptide") }} />
                                                    <Label htmlFor='chk19' className='ml-4 '>Final Report Sent To Customer Care</Label></Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={peptide?.peptideRecivedByClinic} tabIndex="4" id="chk20" name="peptideRecivedByClinic" onChange={(e) => { this.handleChange(e, "peptide") }} />
                                                    <Label htmlFor='chk20' className='ml-4 '>PMR Sent To Provider</Label></Col>
                                                <Col lg='12' className='ml-5'>
                                                    <Input type="checkbox" className='ml-0' checked={peptide?.treamentStarted} tabIndex="4" id="chk21" name="treamentStarted" onChange={(e) => { this.handleChange(e, "peptide") }} />
                                                    <Label htmlFor='chk21' className='ml-4 '>Final Report Sent To Provider</Label></Col>

                                            </Col>
                                        </Row>
                                        {/* <Row className='ml-4'>
                                            <Col lg="10" >
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4'>Accession No.</Label>

                                            </Col>

                                        </Row> */}
                                        {/* <Row className='ml-4'>
                                            <Col>
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4 '>First Name</Label></Col>
                                        </Row> */}
                                        {/* <Row className='ml-4'>
                                            <Col>
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4 '>Last Name</Label></Col>
                                        </Row> */}
                                        {/* <Row className='ml-4'>
                                            <Col>
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4 '>Email</Label></Col>
                                        </Row> */}
                                        {/* <Row className='ml-4'>
                                            <Col>
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4 '>Accession No.</Label></Col>
                                        </Row> */}
                                        {/* </FormGroup> */}

                                        {/* <FormGroup> */}
                                        {/* <Row>
                                            <Col lg="6">
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4 font-weight-bold'>Section Details</Label>

                                                <Col lg="6">
                                                    <Input type="checkbox" className='ml-4' tabIndex="4" id="chk" name="isNewPage" />
                                                    <Label htmlFor='chk' className='ml-5 font-weight-bold'>Analysis Order Status</Label>


                                                </Col>
                                            </Col>
                                        </Row> */}
                                        {/* <Row>
                                            <Col lg="6">
                                                <Input type="checkbox" className='ml-4' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-5 font-weight-bold'>Analysis Order Status</Label>


                                            </Col>
                                        </Row> */}
                                        {/* <Row className='ml-4'>
                                            <Col lg="10" >
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4'>Order Submitted</Label>

                                            </Col>

                                        </Row> */}
                                        {/* <Row className='ml-4'>
                                            <Col>
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4 '>PO Sent to Accounting</Label></Col>
                                        </Row> */}
                                        {/* <Row className='ml-4'>
                                            <Col>
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4 '>Invoice Sent To Clinic</Label></Col>
                                        </Row> */}
                                        {/* <Row className='ml-4'>
                                            <Col>
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4 '>Payment Recieved</Label></Col>
                                        </Row> */}

                                        {/* <Row>
                                            <Col lg="6">
                                                <Input type="checkbox" className='ml-4' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-5 font-weight-bold'>Design Order Status</Label>


                                            </Col>
                                        </Row> */}
                                        {/* <Row className='ml-4'>
                                            <Col lg="10" >
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4'>Send PO Notification	</Label>

                                            </Col>

                                        </Row> */}
                                        {/* <Row className='ml-4'>
                                            <Col>
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4 '>PO Sent to Accounting</Label></Col>
                                        </Row> */}
                                        {/* <Row className='ml-4'>
                                            <Col>
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4 '>Invoice Sent To Clinic</Label></Col>
                                        </Row>
                                        <Row className='ml-4'>
                                            <Col>
                                                <Input type="checkbox" className='ml-0' tabIndex="4" id="chk" name="isNewPage" />
                                                <Label htmlFor='chk' className='ml-4 '>Payment Recieved</Label></Col>
                                        </Row> */}

                                    </FormGroup>
                                </Form>
                                {/* <DropdownItem>

                                    <b>aaaa</b>
                                </DropdownItem> */}
                                {/* <DropdownItem text>Dropdown Item Text</DropdownItem> */}

                            </DropdownMenu>
                        </Dropdown>



                    </CardHeader>


                    <CardBody>








                        <div >
                            <div >
                                {/* <button onClick={this.export}>aaaaa</button> */}

                                {/* <ExcelFile element={<button>Download Data With Styles</button>}>
                                    <ExcelSheet dataSet={this.td || []} name="Organization" />
                                </ExcelFile> */}

                                <table class="table table-bordered table-responsive" id="mytable" data-cols-width={this.state.cols} style={{ maxHeight: "80vh" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF", position: "sticky", top: '0', zIndex: "200" }}>
                                            <th colSpan={7} rowSpan='1' className="text-center">Patient Details</th>
                                            <th colSpan={39} className="text-center">Section Details</th>
                                            {/* <th rowspan="2">Number</th>
                                                <th rowspan="2">Competitor</th>
                                                <th rowspan="2">Keywords</th>
                                                <th rowspan="2">Vicinity</th>
                                                <th colspan="3">Contact</th>
                                                <th colSpan={2}>Details</th> */}
                                        </tr>
                                        <tr style={{ position: "sticky", top: '46px', zIndex: "200", background: "#fff", }}>
                                            <th rowSpan="2" style={{ position: "sticky", left: "-2px", backgroundColor: "#fff", zIndex: "100", minWidth: "100px", border: "1px solid #c8ced3", boxShadow: "inset -1px -1px 0px 0px #c8ced3 " }}>Accession No. {accesionArrow ? <i class="fa fa-arrow-up" aria-hidden="true" onClick={() => { this.alphaDecending("accesionno") }}></i> : <i class="fa fa-arrow-down" aria-hidden="true" onClick={() => { this.alphaAcsending("accesionno") }}></i>}</th>
                                            {/* <th rowspan="2" style={{ position: "sticky", left: "130px", backgroundColor: "#fff", zIndex: "100", minWidth: "100px", border: "1px solid #c8ced3", boxShadow: "inset -1px 0px 0px 0px #c8ced3 " }}>Patient Name</th> */}
                                            <th rowSpan="2">Contact {contactArrow ? <i class="fa fa-arrow-up" aria-hidden="true" onClick={() => { this.alphaDecending("email") }}></i> : <i class="fa fa-arrow-down" aria-hidden="true" onClick={() => { this.alphaAcsending("email") }}></i>}</th>
                                            <th rowSpan="2">Neo7 Analysis Type {analysisArrow ? <i class="fa fa-arrow-up" aria-hidden="true" onClick={() => { this.alphaDecending("analysisType") }}></i> : <i class="fa fa-arrow-down" aria-hidden="true" onClick={() => { this.alphaAcsending("analysisType") }}></i>}</th>
                                            <th rowSpan="2">Practitioner {PractitionerArrow ? <i class="fa fa-arrow-up" aria-hidden="true" onClick={() => { this.alphaDecending("PractitionerName") }}></i> : <i class="fa fa-arrow-down" aria-hidden="true" onClick={() => { this.alphaAcsending("PractitionerName") }}></i>}</th>
                                            <th rowSpan="2">Status {statusArrow ? <i class="fa fa-arrow-up" aria-hidden="true" onClick={() => { this.alphaDecending("status") }}></i> : <i class="fa fa-arrow-down" aria-hidden="true" onClick={() => { this.alphaAcsending("status") }}></i>}</th>
                                            <th rowSpan="2">CC Representative</th>

                                            <th rowSpan="2">notes</th>
                                            {this.isMainCheked('AnalysisOrder') ? "" :

                                                <th
                                                    style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF" }}
                                                    className="text-center"
                                                    colSpan={this.getCallSpans('AnalysisOrder')}>Analysis Order Status</th>}
                                            {/* {this.isMainCheked('tymora') ? "" :

                                                <th
                                                    style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF" }}
                                                    className="text-center"
                                                    colSpan={this.getCallSpans('tymora')}>Tymora (Lab)</th>}
                                            {this.isMainCheked('psomagen') ? "" :

                                                <th
                                                    style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF" }}
                                                    className="text-center"
                                                    colSpan={this.getCallSpans('psomagen')}>Psomagen (Lab)</th>} */}
                                            {ngslaboratorys.map((e) => {
                                                return <>
                                                    {this.isMainChekedForLab("labDetail", e.ngsLabName) ? "" : <th
                                                        style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF" }}
                                                        className="text-center"
                                                        colSpan={2}>{e.ngsLabName}</th>}</>
                                            })}




                                            {
                                                this.isMainCheked('designOrder') ? "" :
                                                    <th
                                                        style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF" }}
                                                        className="text-center"
                                                        colSpan={this.getCallSpans('designOrder')}>Design Order Status</th>}
                                            {
                                                this.isMainCheked('Pipeline') ? "" :
                                                    <th
                                                        style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF" }}
                                                        className="text-center"
                                                        colSpan={this.getCallSpans('Pipeline')}>Pipeline</th>}
                                            {
                                                this.isMainCheked('report') ? "" :
                                                    <th
                                                        style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF" }}
                                                        className="text-center"
                                                        colSpan={this.getCallSpans('report')}>PMR & Final Report</th>}
                                            {
                                                this.isMainCheked('peptide') ? "" :
                                                    <th
                                                        style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF" }}
                                                        className="text-center"
                                                        colSpan={this.getCallSpans('peptide')}>PMR & Final Report Delivery</th>}
                                        </tr>
                                        <tr style={{ position: "sticky", top: '92px', zIndex: "100", background: "#fff", border: "1px solid #c8ced3", boxShadow: "inset 0px -1px 0px 0px #c8ced3 " }}>
                                            {/* Analysis Order Status columns */}

                                            {!AnalysisOrder.orderSubmitted ? "" : <th rowSpan="1">Order Submitted  {this.state.AnalysisOrderSubmittedArrow ? <i class="fa fa-arrow-up" aria-hidden="true" onClick={() => { this.alphaDecending("AnalysisOrderSubmitted") }}></i> : <i class="fa fa-arrow-down" aria-hidden="true" onClick={() => { this.alphaAcsending("AnalysisOrderSubmitted") }} />} </th>}
                                            {!AnalysisOrder.poSent ? "" : <th rowSpan="1">PO Sent to Accounting</th>}
                                            {!AnalysisOrder.invoiceSent ? "" : <th rowSpan="1">Invoice Sent To Clinic</th>}
                                            {!AnalysisOrder.paymentRecieve ? "" : <th rowSpan="1">Payment Received</th>}

                                            {/* tymora lab
                                            {!tymora.samplesRecieved ? "" : <th rowSpan="1">Samples Received</th>}
                                            {!tymora.ResultRecieved ? "" : <th rowSpan="1">Results Received</th>}

                                            {/* psomagon lab  */}
                                            {/* {!psomagen.samplesRecieved ? "" : <th rowSpan="1">Samples Received</th>} */}
                                            {/* {!psomagen.ResultRecieved ? "" : <th rowSpan="1">Results Received</th>} */}

                                            {ngslaboratorys.map((e) => {
                                                return <>
                                                    {!this.state?.labDetail?.[e.ngsLabName]?.samplesRecieved ? "" : <th rowSpan="1">Samples Received</th>}
                                                    {!this.state?.labDetail?.[e.ngsLabName]?.resultRecieved ? "" : <th rowSpan="1">Results Received</th>
                                                    }</>
                                            })}





                                            {/* Design Order Status */}
                                            {!designOrder.designOrder ? "" : <th rowSpan="1">Send PO Notification</th>}
                                            {!designOrder.poSent ? "" : <th rowSpan="1">PO Sent to Accounting</th>}
                                            {!designOrder.invoiceSent ? "" : <th rowSpan="1">Invoice Sent to Clinic</th>}
                                            {!designOrder.paymentRecieve ? "" : <th rowSpan="1">Payment Received</th>}

                                            {/* pipline */}

                                            {!Pipeline.varifyData ? "" : <th rowSpan="1">Verify Data</th>}
                                            {!Pipeline.processData ? "" : <th rowSpan="1">Process Data</th>}
                                            {/* PMR & Final Report */}
                                            {!report.cancer ? "" : <th rowSpan="1">Cancer</th>}
                                            {!report.healthIndex ? "" : <th rowSpan="1">Health Index</th>}
                                            {!report.pmr ? "" : <th rowSpan="1">PMR </th>}

                                            {/* peptide status */}
                                            {!peptide.pmrSentToClinic ? "" : <th rowSpan="1">PMR Sent To Customer Care</th>}
                                            {!peptide.clinicSentPmr ? "" : <th rowSpan="1">Final Report Sent To Customer Care</th>}
                                            {!peptide.peptideRecivedByClinic ? "" : <th rowSpan="1">PMR Sent To Provider</th>}
                                            {!peptide.treamentStarted ? "" : <th rowSpan="1">Final Report Sent To Provider</th>}




                                            {/* <th
                                                style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF" }}
                                            >Tymora</th>
                                            <th
                                                style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF" }}
                                            >Lab Results Received  & Uploaded in S3 bucket</th>
                                            <th
                                                style={{ backgroundColor: "#1C3A84", color: "#fff", border: "1px solid #FFF" }}
                                            >Peptide Status</th> */}
                                            {/* Peptide Status */}

                                        </tr>
                                        {/* <tr> */}

                                        {/* </tr> */}
                                    </thead>
                                    <tbody id="rows">


                                        {/* <InfiniteScroll
                                            dataLength={this.state.tableData.length}
                                            next={this.fetchMoreData.bind(this)}
                                            hasMore={true}
                                            loader={<h4>Loading...</h4>}
                                        > */}

                                        {Array.isArray(tableData) && tableData.length > 0 && tableData.map((ele, i) => {
                                            // console.log(ele?.patientAccessionMappings?.[0]?.accessionStatusId)
                                            let accessionDetails = ele?.patientAccessionMappings?.[0]
                                            let patientDisease = ele?.viewPatientModel?.patientDisease?.[0]

                                            let diseaseCategoryId = accessionDetails?.diseaseCategoryId
                                            let displayDisase = [1, 2, 3].includes(diseaseCategoryId)
                                            let accessionNo = ele?.patientAccessionMappings?.[0]?.accessionNo?.replaceAll?.("-", '')
                                            let patientName = ele?.firstName + " " + (ele?.middleName != null ? ele?.middleName : "") + " " + ele?.lastName
                                            let contact = <>
                                                {ele?.email}<br />
                                                {ele?.mobile}<br />
                                            </>
                                            let practitioner = ele?.viewPatientModel?.practitionerPatient
                                            let practitionerName = (practitioner?.firstName != null ? practitioner?.firstName : "") + " " + (practitioner?.lastName != null ? practitioner?.lastName : "")

                                            let sectionDetails = ele?.viewPatientModel;
                                            let analysisOrderStatus = sectionDetails?.analysisOrderStatus
                                            let orderSubmitedDate = analysisOrderStatus?.orderSubmitedDate
                                            let poSent = analysisOrderStatus?.poReceivedDate
                                            let invoiceSent = analysisOrderStatus?.invoiceSendDate
                                            let paymentReceived = analysisOrderStatus?.paymentReceivedDate

                                            let patientNotes = sectionDetails?.patientNotes
                                            let labResultReceived = sectionDetails?.labReceivedResultStatus
                                            let labSampleReceived = sectionDetails?.specimenReceivedStatus

                                            let designOrderStatus = sectionDetails?.designOrderStatus
                                            let dPoSent = designOrderStatus?.orderSubmitedDate
                                            let sentToAcc = designOrderStatus?.poReceivedDate
                                            let dInvoiceSent = designOrderStatus?.invoiceSendDate
                                            let dPayment = designOrderStatus?.paymentReceivedDate
                                            let designActivityData = sectionDetails?.designActivity
                                            let patientReportsData = sectionDetails?.patientReports
                                            let patientReport = sectionDetails?.patientReports
                                            let dataCancerLength = patientReport?.length
                                            let CancerVs = ""
                                            if (dataCancerLength > 0) {
                                                CancerVs = patientReport[dataCancerLength - 1].pmrCurrentVersion
                                            }
                                            let patientPmrReports = sectionDetails?.patientPMRReports
                                            let dataPmrLength = patientPmrReports?.length
                                            let PmrVs = ""
                                            if (dataPmrLength > 0) {
                                                PmrVs = patientPmrReports[dataPmrLength - 1].pmrCurrentVersion
                                            }
                                            let PatientHIReports = sectionDetails?.patientHIReports
                                            let dataHiLength = PatientHIReports?.length
                                            let HealthIndexVs = ""
                                            if (dataHiLength > 0) {
                                                HealthIndexVs = PatientHIReports[dataHiLength - 1].pmrCurrentVersion
                                            }

                                            let peptidestatus = sectionDetails?.peptideStatus
                                            let peptidePmrSentDate = peptidestatus?.pmrSendToCilnicDate
                                            let peptideClinicSentDate = peptidestatus?.clinicSendPMRToPharmacyDate
                                            let peptidePeptideRecievedDate = peptidestatus?.peptidesReceivedByClinicDate
                                            let peptideTreatmentDate = peptidestatus?.treatmentStartedDate
                                            const regex = /(<([^>]+)>)/ig;
                                            // let data = accessionDetails.sort((a, b) => (a.accessionNo > b.accessionNo) ? 1 : -1)

                                            // console.log(data)



                                            return <>

                                                <tr key={i}>
                                                    <td style={{ position: "sticky", left: "-2px", backgroundColor: "#fff", zIndex: "100", minWidth: "100px", border: "1px solid #c8ced3", boxShadow: "inset -1px 0px 0px 0px #c8ced3 " }}>
                                                        <Link
                                                            id="viewpatient"

                                                            className="anchorAccessNo font-weight-bold"
                                                            target="_blank"
                                                            to={
                                                                ((this.state.role_Id == 5 || this.state.role_Id == 1 || this.state.role_Id == 4) ? "/patients/admininfo/" : "/patients/info/")
                                                                //   "/patients/info/" +
                                                                //   "/patients/admininfo/" 
                                                                +
                                                                ele?.patientAccessionMappings?.[0]?.patientId +
                                                                "/" +
                                                                ele?.patientAccessionMappings?.[0]?.patientAccessionId

                                                            }
                                                        >
                                                            {accessionNo || ""}
                                                        </Link>
                                                        {/* <br /> {patientName || ""} */}
                                                    </td>
                                                    {/* <td style={{ position: "sticky", left: "130px", backgroundColor: "#fff", zIndex: "100", minWidth: "100px", border: "1px solid #c8ced3", boxShadow: "inset -1px 0px 0px 0px #c8ced3 " }}>{patientName || ""}</td> */}
                                                    <td>{contact || " "}</td >
                                                    <td>
                                                        {accessionDetails?.diseaseCategory}
                                                        {displayDisase && accessionDetails?.diseaseName != (null || "") ? (" - " + accessionDetails?.diseaseName) : ""}
                                                        {displayDisase && accessionDetails?.diseaseCode && accessionDetails?.diseaseCode != null ? `(${accessionDetails?.diseaseCode})` : ""}
                                                        {displayDisase && patientDisease?.isMetastasis == true ? <span className='text-danger'> - Metastasis</span> : null}
                                                        {displayDisase && accessionDetails?.tissue != null ? (" - " + accessionDetails?.tissue) : ""}
                                                        {/* {console.log("accessionDetails.isMetastasis",patientDisease.isMetastasis)} */}
                                                    </td>
                                                    <td>
                                                        {practitionerName != undefined ? practitionerName : ""}<br />
                                                        {practitioner?.email != undefined ? practitioner?.email : ""}<br />
                                                        {practitioner?.mobile != undefined ? practitioner?.mobile : ""}<br />
                                                    </td>
                                                    <td >{ele?.patientAccessionMappings?.[0]?.accessionStatusId ? this.getStatusValue(ele?.patientAccessionMappings?.[0]?.accessionStatusId) : ""}</td>
                                                    <td >{ele?.viewPatientModel?.ccName ? ele?.viewPatientModel?.ccName : ""}</td>

                                                    <td style={{ minWidth: "200px" }} >{patientNotes?.length > 0 ? patientNotes?.map((data, i) => {
                                                        // return <p style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", maxWidth: "180px" }}  > <a href="#" data-toggle="tooltip" title={data.notes}> - {data.notes}</a></p>
                                                        return <><p style={{ whiteSpace: "break-spaces", maxHeight: "100px", overflowY: "auto", maxWidth: "180px", backgroundColor: "#f0f3f5" }}  >  - {data.notes.replace(regex, "")}</p></>

                                                    }) : ""
                                                    }
                                                    </td>
                                                    {/* {
                                                    patientNotes.map((data) => {
                                                        return console.log(data.notes)
                                                    })

                                                } */}
                                                    {!AnalysisOrder.orderSubmitted ? "" : <td >{orderSubmitedDate && Moment(orderSubmitedDate).format("MM/DD/YYYY") || ""}</td>}
                                                    {!AnalysisOrder.poSent ? "" : <td>{poSent && Moment(poSent).format("MM/DD/YYYY") || " "}</td>}
                                                    {!AnalysisOrder.invoiceSent ? "" : <td>{invoiceSent && Moment(invoiceSent).format("MM/DD/YYYY") || " "}</td>}
                                                    {!AnalysisOrder.paymentRecieve ? "" : <td>{paymentReceived && Moment(paymentReceived).format("MM/DD/YYYY") || " "}</td>}
                                                    {/* {`console`.log("Analysis Date:",Moment(poSent).format("DD/MM/YYYY"))} */}
                                                    {/* {console.log("Design  Date:",Moment(dPoSent).format("DD/MM/YYYY"))} */}
                                                    {/* {!tymora.samplesRecieved ? "" : <td>{
                                                    labSampleReceived.map((data, i) => {
                                                        if (data.ngsLaboratoryId == 2 && data.sampleTypeReceivedDate) {

                                                            return <div style={{ display: "flex", justifyContent: "space-between" }}><span>{data.sampleTypeName}:</span> <b>&nbsp; {Moment(data.sampleTypeReceivedDate).format("MM/DD/YYYY")}</b></div>
                                                        }
                                                    })
                                                }
                                                </td>
                                                } */}



                                                    {/* {!tymora.ResultRecieved ? "" : <td>{
                                                    labResultReceived.map((data, i) => {
                                                        if (data.ngsLaboratoryId == 2 && data.sampleTypeResultDate) {

                                                            return <div style={{ display: "flex", justifyContent: "space-between" }}><span>{data.sampleTypeName}:</span>   <b>&nbsp;{Moment(data.sampleTypeResultDate).format("MM/DD/YYYY")}</b></div>
                                                        }
                                                    })
                                                }</td>} */}

                                                    {/* {!psomagen.samplesRecieved ? "" : <td>{
                                                    labSampleReceived.map((data, i) => {
                                                        if (data.ngsLaboratoryId == 3 && data.sampleTypeReceivedDate) {

                                                            return <div style={{ display: "flex", justifyContent: "space-between" }}><span>{data.sampleTypeName}:</span> <b>&nbsp; {Moment(data.sampleTypeReceivedDate).format("MM/DD/YYYY")}</b></div>
                                                        }
                                                    })
                                                }
                                                </td>
                                                }



                                                {!psomagen.ResultRecieved ? "" : <td>{
                                                    labResultReceived.map((data, i) => {
                                                        if (data.ngsLaboratoryId == 3 && data.sampleTypeResultDate) {

                                                            return <div style={{ display: "flex", justifyContent: "space-between" }}><span>{data.sampleTypeName}:</span>   <b>&nbsp;{Moment(data.sampleTypeResultDate).format("MM/DD/YYYY")}</b></div>
                                                        }
                                                    })
                                                }</td>} */}
                                                    {/* ngsLabName */}
                                                    {ngslaboratorys.map((e) => {
                                                        return <>

                                                            {!this.state?.labDetail?.[e.ngsLabName]?.resultRecieved ? "" : <td >{labSampleReceived?.length > 0 ? labSampleReceived.map((data, i) => {
                                                                if (data.ngsLaboratoryId == e.ngsLaboratoryId && data.sampleTypeReceivedDate) {

                                                                    return <div style={{ display: "flex", justifyContent: "space-between" }}><span>{data.sampleTypeName}:</span> <b>&nbsp; {Moment(data.sampleTypeReceivedDate).format("MM/DD/YYYY")}</b></div>
                                                                }
                                                            }) : ""}</td>}


                                                            {!this.state?.labDetail?.[e.ngsLabName]?.samplesRecieved ? "" : <td >

                                                                {labResultReceived?.length > 0 ? labResultReceived?.map((data, i) => {
                                                                    if (data.ngsLaboratoryId == e.ngsLaboratoryId && data.sampleTypeResultDate) {

                                                                        return <div style={{ display: "flex", justifyContent: "space-between" }}><span>{data.sampleTypeName}:</span>   <b>&nbsp;{Moment(data.sampleTypeResultDate).format("MM/DD/YYYY")}</b></div>
                                                                    }
                                                                }) : ""}


                                                            </td>}
                                                        </>
                                                    })}
                                                    {!designOrder.designOrder ? "" : <td>{dPoSent && Moment(dPoSent).format("MM/DD/YYYY") || " "}</td>}
                                                    {!designOrder.poSent ? "" : <td>{sentToAcc && Moment(sentToAcc).format("MM/DD/YYYY") || " "}</td>}
                                                    {!designOrder.invoiceSent ? "" : <td>{dInvoiceSent && Moment(dInvoiceSent).format("MM/DD/YYYY") || " "}</td>}
                                                    {!designOrder.paymentRecieve ? "" : <td>{dPayment && Moment(dPayment).format("MM/DD/YYYY") || " "}</td>}
                                                    {!Pipeline.varifyData ? "" : <td >{this.getPipeLineStatus(designActivityData) || " "} </td>}
                                                    {!Pipeline.processData ? "" : <td>{this.getProcessStatus(designActivityData) || " "} </td>}
                                                    {/* {!report.cancer ? "" : <td>{patientReportsData?.patientReport == null ? " " : "Yes"}</td>} */}
                                                    {!report.cancer ? "" : <td>{CancerVs}</td>}

                                                    {/* {!report.healthIndex ? "" : <td>{patientReportsData?.healthIndexReport == null ? " " : "Yes"}</td>} */}
                                                    {!report.healthIndex ? "" : <td>{HealthIndexVs}</td>}

                                                    {/* {!report.pmr ? "" : <td>{patientReportsData?.pmrReport == null ? " " : "Yes"}</td>} */}
                                                    {!report.pmr ? "" : <td>{PmrVs}</td>}

                                                    {!peptide.pmrSentToClinic ? "" : <td>{peptidePmrSentDate && Moment(peptidePmrSentDate).format("MM/DD/YYYY") || " "}</td>}
                                                    {!peptide.clinicSentPmr ? "" : <td>{peptideClinicSentDate && Moment(peptideClinicSentDate).format("MM/DD/YYYY") || " "}</td>}
                                                    {!peptide.peptideRecivedByClinic ? "" : <td>{peptidePeptideRecievedDate && Moment(peptidePeptideRecievedDate).format("MM/DD/YYYY") || " "}</td>}
                                                    {!peptide.treamentStarted ? "" : <td>{peptideTreatmentDate && Moment(peptideTreatmentDate).format("MM/DD/YYYY") || " "}</td>}

                                                </tr >



                                            </>
                                        })
                                        }

                                        {/* </InfiniteScroll> */}



                                    </tbody >
                                </table >
                            </div >
                        </div >



                    </CardBody >

                </Card >



            </div >






        )
    }
}
