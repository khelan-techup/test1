import React, { Component } from "react";
import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    Col,
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
    Table,
    Button,
    Input,
    FormGroup,
    Collapse,
    Fade,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import { toast } from 'react-toastify';
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import Moment from "moment";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { Steps } from "intro.js-react";
import axiosInstance from '../../common/axiosInstance';
import ReactPaginate from "react-paginate";
import { BE_NeoInquiry_AssignLead, BE_NeoInquiry_DeleteNeoContactInquiry, BE_NeoInquiry_DeleteNeoProviderContactInquiry, BE_NeoInquiry_DeleteNeoSignupInquiry, BE_NeoInquiry_GetAllPaging, BE_NeoInquiry_GetAllcount, BE_OrganizationUser_GetLeadAssignees, BE_OrganizationUser_UpdateTooltipSteps } from "../../common/allApiEndPoints";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();

        this.initialState = {
            loading: true,
            openSearch: true,
            //patients: [],

            searchString: "",
            costumerCare: [],
            count: {},
            slDelete: true, leads: [],
            currentPage: 0,
            currentIndex: 0,
            pagesCount: 0,
            pageSize: 5, //window.$TotalRecord,
            authError: false,
            error: "",
            pcount: 0,
            prcount: 0,
            icount: 0,
            lcount: 0,
            mcount: 0,
            allPatientCount: 0,
            // allPatient: [],
            analysisList: [],
            anaDesignCount: 0,
            designCount: 0,
            anaDesign: [],
            manuCount: 0,
            manu: [],
            treatmentList: [],
            treatmentCount: 0,
            filterType: 4,
            isView: false,
            isEdit: false,
            roleName: "",
            collapse: false,
            fadeIn: true,
            timeout: 300,
            allTypeFilter: null,
            collapseId: 0,
            SampleCollectionCount: 0,
            SampleList: "",
            DeleteInquieryModal: false,
            allPatientSort: { accessionNo: "", patientName: "" },
            leadId: 0,
            isSkipped: false,
            stepsEnabled: false, // stepsEnabled starts the tutorial
            initialStep: 0,
            currentStep: 0,
            steps: [{
                element: "#pagetitle",
                title: 'Inquiry List',
                intro: "This is a comprehensive list of all Inquiries in our system.",
                tooltipClass: "cssClassName1",
            }, {
                element: "#contactsinquiery",
                title: 'Contacts Inquiry',
                intro: "The total number of Contact inquiries.",
                tooltipClass: "cssClassName1",
            },
            {
                element: "#providerinquiery",
                title: 'Provider inquiry',
                tooltipClass: "cssClassName1",
                intro: "The total number of Provider inquiries."
            },
            {
                element: "#providersignup",
                title: "Provider Signup Inquiry",
                tooltipClass: "cssClassName1",
                intro: "The total numbers of Provider signup inquiries."
            },
            {
                element: "#assignedto",
                title: "Assign to Customer Care",
                intro: 'To assign the Inquiry to a Customer Care Representative.',

                tooltipClass: "cssClassName1",
            },
            {
                element: "#viewdetails",
                title: 'View Details of Inquiry',

                tooltipClass: "cssClassName1",
                intro: "View the details of the inquiry."
            },
            {
                element: "#deleteinquiery",
                title: 'Delete Inquiry',

                tooltipClass: "cssClassName1",
                intro: "Delete the inquiry using this button."
            }, {
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

        };
        this.state = this.initialState;
    }

    onExit = (e) => {
        console.log(e)
        this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 7 }));
        // localStorage.setItem("isFirstLogin", false);
        // this.sendCurrentStep()

    };

    onAfterChange = newStepIndex => {
        if (newStepIndex === 4) {
            const element = document.querySelector('#assignedto')

            if (!element) this.myRef.current.introJs.nextStep()
        }
        if (newStepIndex === 5) {
            const element = document.querySelector('#viewdetails')

            if (!element) this.myRef.current.introJs.nextStep()
        }
        if (newStepIndex === 6) {
            const element = document.querySelector('#deleteinquiery')

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



    handleClick(e, index, currIndex) {
        this.setState({ loading: true })
        e.preventDefault();
        var pgcount = this.state.pagesCount - 1;
        var pgCurr = (index >= pgcount ? pgcount : index);
        this.setState({
            currentPage: pgCurr,
            currentIndex: currIndex
        }, function () { this.getListData(pgCurr); });
    }
    handleShowNotes_crm = () => {
        this.setState({
            add_notes_crm: true
        },
            // , this.OrganizationUserDataForNotes()
        );

    }
    handleShowInquieryModal = (id, ltype) => {
        this.setState({
            DeleteInquieryModal: true,
            leadId: id,
            allTypeFilter: ltype

        })
    }
    handleCloseInquieryModal = () => {
        this.setState({
            DeleteInquieryModal: false,
            leadId: 0,
            allTypeFilter: null
        })
    }




    getCostumerCareData() {
        const apiroute = window.$APIPath;
        // const url = apiroute + "/api/BE_OrganizationUser/GetLeadAssignees";
        const url = apiroute + BE_OrganizationUser_GetLeadAssignees
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
    getCount() {
        const apiroute = window.$APIPath;
        // const url = apiroute + '/api/BE_NeoInquiry/GetAllcount';
        const url = apiroute + BE_NeoInquiry_GetAllcount;
        let data = JSON.stringify({
            "flag": true,
            "message": "",
            "totalRecord": 0
        });

        axiosInstance
            .post(url, data, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((result) => {
                this.setState({
                    count: result?.data?.outdata?.patintData
                })
                // console.log(this.state.costumerCare, "ghvvvvyyvtgvtgresult")

            })

    }



    getListData(pageNo) {
        this.setState({ loading: true })
        var userToken = JSON.parse(localStorage.getItem('AUserToken'));
        let userId = (userToken.userId == null ? 0 : userToken.userId);

        const apiroute = window.$APIPath;
        // const url = apiroute + '/api/BE_NeoInquiry/GetAllPaging';
        const url = apiroute + BE_NeoInquiry_GetAllPaging
        // alert(String(this.state.diseaseCatId))
        let data = JSON.stringify({
            leadType: this.state.filterType || 1,

            // fromDate: new Date(), toDate: new Date(),
            "isActive": true,

            searchString: '',
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
                    // console.log("result", result);
                    const rdata = result.data.outdata
                    this.setState({
                        pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
                        pageCountNew: Math.ceil(
                            result.data.totalRecord / window.$TotalRecord
                        ),
                        leads: rdata, loading: false
                    });

                } else {
                    this.setState({ loading: false });
                }
            })
            .catch(error => {
                // console.log(error);
                this.setState({ authError: true, loading: false });
            });
    }
    closeSearch = (e) => {
        if (this.state.searchString === "") {
            this.setState({
                openSearch: false,
            });
        } else {
            this.setState(
                () => ({
                    openSearch: false,
                    loading: true,
                    currentPage: 0,
                    currentIndex: 0,
                    pagesCount: 0,
                    //pageSize: window.$TotalRecord,
                    searchString: "",
                }),
                function () {
                    this.getListData(0);
                }
            );
        }
    };

    //load event
    componentDidMount() {
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        var rights = userToken.roleModule;

        this.setState({ roleName: userToken.roleName });

        //console.log(rights);
        if (rights?.length > 0) {
            let currentrights = rights.filter((role) =>
                role.moduleId == 30
            );
            //console.log(currentrights);
            if (currentrights?.length > 0) {
                this.setState({
                    isView: currentrights[0].isViewed,
                    isEdit: currentrights[0].isEdited,
                });
                if (currentrights[0].isViewed) {
                    this.getListData(0);
                    this.getCostumerCareData()
                    this.getCount()
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

    //get data
    // getListData(pageNo) {
    //     var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    //     let userId = userToken.userId == null ? 0 : userToken.userId;

    //     const apiroute = window.$APIPath;
    //     const url = apiroute + "/api/BE_Dashboard/GetAll";

    //     let data = JSON.stringify({
    //         isDeleted: this.state.slDelete,
    //         searchString: this.state.searchString,
    //         Id: userId,
    //         pageNo: pageNo,
    //         totalNo: 5, //window.$TotalRecord,
    //     });

    //     axiosInstance
    //         .post(url, data, {
    //             headers: {
    //                 "Content-Type": "application/json; charset=utf-8",
    //             },
    //         })
    //         .then((result) => {
    //             // console.log("result", result);
    //             if (result.data.flag) {
    //                 var rData = result.data.outdata;
    //                 this.setState({
    //                     //pagesCount: Math.ceil(result.data.totalRecord / 5),//window.$TotalRecord
    //                     //patients: rData.patintData,
    //                     analysisList: rData.patintData.analysisList,
    //                     anaDesign: rData.patintData.designList,
    //                     manu: rData.patintData.manufacturingList,
    //                     allPatientCount: rData.patintData.registeredCount,
    //                     SampleCollectionCount: rData.patintData.sampleCollectionCount,
    //                     anaDesignCount: rData.patintData.analysisCount,
    //                     designCount: rData.patintData.designCount,
    //                     SampleList: rData.patintData.sampleList,
    //                     treatmentList: rData.patintData.treatmentList,
    //                     // anaDesignCount: rData.patintData.anaDesignCount,
    //                     manuCount: rData.patintData.manuCount,
    //                     treatmentCount: rData.patintData.treatmentCount,
    //                     pcount: rData.pcount,
    //                     prcount: rData.prcount,
    //                     icount: rData.icount,
    //                     lcount: rData.lcount,
    //                     mcount: rData.mcount,
    //                     loading: false,
    //                 });
    //             } else {
    //                 this.setState({ loading: false });
    //                 // console.log(result.data.message);
    //             }
    //         })
    //         .catch((error) => {
    //             // console.log(error);
    //             this.setState({ authError: true, error: error, loading: false });
    //         });
    // }

    //pagination
    handleClick(e, index, currIndex) {
        e.preventDefault();
        var pgcount = this.state.pagesCount - 1;
        var pgCurr = index >= pgcount ? pgcount : index;
        this.setState(
            {
                currentPage: pgCurr,
                currentIndex: currIndex,
                loading: true,
            },
            function () {
                this.getListData(pgCurr);
            }
        );
    }

    //search
    filter = (e) => {
        if (e.key == "Enter") {
            const target = e.target;
            const value = target.value;

            this.setState(
                () => ({
                    loading: true,
                    currentPage: 0,
                    currentIndex: 0,
                    pagesCount: 0,
                    //pageSize: window.$TotalRecord,
                    searchString: value.trim(),
                }),
                function () {
                    this.getListData(0);
                }
            );
        }
    };

    //active/inactive filter
    handleChange = (e) => {
        const target = e.target;
        const value = target.value;

        this.setState(
            () => ({
                loading: true,
                currentPage: 0,
                currentIndex: 0,
                pagesCount: 0,
                //pageSize: window.$TotalRecord,
                slDelete: JSON.parse(value),
            }),
            function () {
                this.getListData(0);
            }
        );
    };

    setCollapse(cid) {
        // debugger
        let currentCid = this.state.collapseId;
        if (currentCid == cid) {
            this.setState({ collapseId: -1 });
        } else {
            this.setState({ collapseId: cid });
        }
    }

    filterType(ftype) {
        this.setState({ filterType: ftype });
    }

    loader() {
        if (this.state.loading) {
            return <div className="cover-spin"></div>;
        }
    }

    deleteInquiery(id, filterType) {
        //e.preventDefault();
        //const currroles = this.state.roles;
        var userToken = JSON.parse(localStorage.getItem('AUserToken'));
        let userId = userToken.userId;

        this.setState({ loading: true });
        const apiroute = window.$APIPath;
        const url = apiroute + this.getDeleteLeadUrl(this.state.allTypeFilter || this.state.filterType, true) + '?id=' + id;

        axiosInstance.delete(url, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(result => {
                if (result.data.flag) {

                    toast.success(result.data.message)
                    this.setState({ loading: false, DeleteInquieryModal: false, leadId: 0 });
                    this.getListData(0);
                    this.getCount()
                    // toast.success(result.data.massage)
                } else {
                    this.setState({ loading: false });

                }
            })
            .catch(error => {

                // toast.error(error.message)
                toast.success(error.massage)
                this.setState({ authError: true, error: error, loading: false });
            });
    }









    getDeleteLeadUrl = (lead, url = false) => {
        switch (Number(lead)) {
            case 1: {
                if (url) {
                    // return "/api/BE_NeoInquiry/DeleteNeoContactInquiry"
                    return BE_NeoInquiry_DeleteNeoContactInquiry

                } else {

                    return "Contact"
                }
            }
            case 2: {
                if (url) {
                    // return "/api/BE_NeoInquiry/DeleteNeoProviderContactInquiry"
                    return BE_NeoInquiry_DeleteNeoProviderContactInquiry

                } else {

                    return "ProviderContact"
                }
            }
            case 3: {
                if (url) {
                    // return "/api/BE_NeoInquiry/DeleteNeoSignupInquiry"
                    return BE_NeoInquiry_DeleteNeoSignupInquiry
                } else {

                    return "SignUp"
                }
            }
            default:
                return "Contact"
        }
    }
    requestSort(column, sortOrder) {
        /* const data1 = this.state.allPatient.sort((a, b) => (a[column] < b[column]  ? -1 : 1));*/

        //const data1 = this.state.allPatient.sort((a, b) => (a[column].localeCompare(b[column])));
        // console.log(this.state.allPatientSort);
        const sorted = this.state.analysisList.sort(
            (a, b) =>
                a[column].toString().localeCompare(b[column].toString(), "en", {
                    numeric: true,
                }) * (sortOrder === "" ? 1 : sortOrder === "asc" ? 1 : -1)
        );

        this.state.allPatientSort[column] =
            sortOrder === "" ? "asc" : sortOrder === "asc" ? "desc" : "asc";

        this.setState({ analysisList: sorted });
        // console.log(this.state.allPatientSort);
    }

    handleCCCareChange = (value, leadId) => {




        if (value != "") {
            this.setState({
                CcId: Number(value),
                changeCcModal: true,
                leadId: leadId

            });
        }

    };
    handleCloseCcModal = () => {
        this.setState({
            changeCcModal: false,
            CcId: 0
        })
    }
    assignCCData() {
        this.setState({
            loading: true
        })
        const apiroute = window.$APIPath;
        // const url = apiroute + "/api/BE_NeoInquiry/AssignLead";
        const url = apiroute + BE_NeoInquiry_AssignLead
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        console.log(userToken.userId)
        const param = this.props.match.params
        // let data = JSON.stringify({
        //   isDeleted: true,
        //   searchString: "",
        //   id: 0,
        // });

        let data = JSON.stringify({
            "leadType": parseInt(this.state.filterType),
            "leadId": parseInt(this.state.leadId),
            "userId": parseInt(this.state.CcId)
        })

        axiosInstance
            .post(url, data, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((result) => {
                this.setState({
                    loading: false,
                    changeCcModal: false

                }, () => {
                    this.getListData()

                    toast.success(result.data.message)

                })



                // console.log(this.state.costumerCare, "ghvvvvyyvtgvtgresult")

            })

    }
    handlePageClick = (e) => {
        console.log("datra", e.selected)
        let currentPage = e.selected;
        this.getListData(currentPage)

    }

    render() {
        if (localStorage.getItem("AUserToken") == null) {
            return <Redirect to="/login" />;
        }

        const {
            loading,
            patients,
            currentPage,
            currentIndex,
            pagesCount,
            pageSize,
            authError,
            error,
            pcount,
            prcount,
            icount,
            lcount,
            mcount,
            treatmentList,
            roleName,
            collapse,
            collapseId,
            anaDesign,
            designCount,
            manu,
            anaDesignCount,
            allPatientCount,
            manuCount,
            treatmentCount,
            analysisList,
            filterType,
            allPatientSort,
            DeleteInquieryModal,
            costumerCare,
            leadId
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
                        hideNext: false, exitOnOverlayClick: false, skipLabel: "Skip",
                        disableInteraction: true
                    }}
                    onChange={(e) => {
                        this.setState({ currentStep: e })
                        console.log({ id: e?.id, e })
                    }}

                />
                <button className="help" id="help" type="btn" onClick={() => { this.toggleSteps() }}>
                    <i class="fa fa-question" aria-hidden="true"></i>
                </button>
                <Row className="mb-3">
                    <Col xs="10" lg="10">
                        <h5 className="mt-2" id="pagetitle" style={{ width: "fit-content" }}>
                            <i className="fa fa-align-justify"></i> Inquiry List
                        </h5>
                    </Col>
                    <Col xs="2" lg="2">

                    </Col>
                </Row>
                <Row>
                    <Col xs="12" lg="12">
                        <Card >

                            <CardHeader >


                                {/* Search Bar */}
                                {/* <Row>

                                    <Col xs="12">
                                        <Row>

                                            Filter by Date :
                                        </Row>

                                        <Row>

                                            <div>

                                                From:
                                                <DatePicker
                                                    defaultValue=""
                                                    dateFormat="MM/dd/yyyy"
                                                    placeholderText="mm/dd/yyyy"
                                                    className={`form-control here text-center`}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    fixedHeight
                                                />
                                            </div>

                                            <div>


                                                TO :
                                                <DatePicker
                                                    defaultValue=""
                                                    dateFormat="MM/dd/yyyy"
                                                    placeholderText="mm/dd/yyyy"
                                                    className={`form-control here text-center`}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    fixedHeight
                                                />
                                            </div>
                                        </Row>
                                    </Col>

                                </Row>
                                <br /> */}
                                <Row

                                    style={{ paddingLeft: 20, paddingRight: 20, display: "flex", alignItems: "center", justifyContent: "space-around" }}
                                >
                                    <Card
                                        className="bg-success"
                                        onClick={() => this.setState({ filterType: 4 }, () => { this.getListData(0) })}
                                        style={{
                                            // backgroundColor: "#379457",
                                            width: 150,
                                            cursor: "pointer"
                                        }}
                                    >
                                        <CardBody id="contactsinquiery">
                                            <div className="text-value text-center">{this.state?.count?.allCount || 0}</div>
                                            <div className="text-center">All</div>
                                        </CardBody>
                                    </Card>

                                    <Card
                                        onClick={() => this.setState({ filterType: 1 }, () => { this.getListData(0) })}
                                        style={{
                                            backgroundColor: "#E2F0D9",
                                            width: 150,
                                            cursor: "pointer"
                                        }}
                                    >
                                        <CardBody id="contactsinquiery">
                                            <div className="text-value text-center">{this.state?.count?.contactCount || 0}</div>
                                            <div className="text-center">Contact</div>
                                        </CardBody>
                                    </Card>

                                    <Card
                                        onClick={() => this.setState({ filterType: 2 }, () => { this.getListData(0) })}
                                        style={{
                                            backgroundColor: "#DAE3F3",
                                            width: 150,
                                            cursor: "pointer"
                                        }}
                                    >
                                        <CardBody id="providerinquiery">
                                            <div className="text-value text-center">{this.state.count?.providerCount || 0}</div>
                                            <div className="text-center">Provider</div>
                                        </CardBody>
                                    </Card>

                                    <Card
                                        style={{
                                            backgroundColor: "#FFCCCC",
                                            width: 150,
                                            cursor: "pointer"
                                        }}
                                        onClick={() => this.setState({ filterType: 3 }, () => { this.getListData(0) })}
                                    >
                                        <CardBody id="providersignup">
                                            <div className="text-value text-center">{this.state.count?.singupCount || 0}</div>
                                            <div className="text-center">Provider Signup</div>
                                        </CardBody>
                                    </Card>


                                </Row>
                            </CardHeader>
                            <CardBody>
                                {/* {authError ? <p>{error.message}</p> : null} */}


                                {
                                    filterType == 4 || filterType == "" ? (
                                        <Col
                                            xs="12"
                                            sm="12"
                                            md="12"
                                            key="5"
                                            style={{ fontSize: "0.72rem" }}
                                        >
                                            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                                                <Card style={{ border: "1px solid #F4F7DB" }}>
                                                    <CardHeader
                                                        className="bg-success"
                                                        style={{
                                                            // backgroundColor: "#379457",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => this.setCollapse(5)}
                                                    >
                                                        <Row style={{ fontSize: "16px" }}>
                                                            <Col md="12">All</Col>
                                                        </Row>
                                                    </CardHeader>
                                                    <Collapse isOpen={filterType == 4 || filterType == "" ? true : 5 == collapseId} id="collapseExample">
                                                        <CardBody>
                                                            <Table className="table table-hover table-bordered mb-0 d-none d-sm-table ">
                                                                <thead
                                                                    style={{
                                                                        backgroundColor: "#1C3A84",
                                                                        color: "white",
                                                                        fontSize: "16px",
                                                                    }}
                                                                >
                                                                    <tr>
                                                                        <th >Name</th>
                                                                        <th className="w-20">Contact Details</th>
                                                                        <th>Assign To</th>
                                                                        <th >Received On</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.state.leads.length > 0 ? this.state.leads.map((lead, i) => {
                                                                        let assigned = costumerCare.filter(costumerCare => costumerCare.organizationUserId == lead.assignedTo)[0]

                                                                        // let assigned = this.filter((e) => { return this.state.costumerCare.organizationUserId == lead.assignedTo })?.[0]
                                                                        return <tr key={i}>
                                                                            <td>
                                                                                <div className="d-flex flex-column">
                                                                                    <span>

                                                                                        {lead.firstName} {lead.lastName}
                                                                                        <br />
                                                                                        {lead.leadType == 1 ? "(Contact)" : ""}
                                                                                        {lead.leadType == 2 ? "(Provider)" : ""}
                                                                                        {lead.leadType == 3 ? "(Provider Signup)" : ""}

                                                                                        <hr />
                                                                                        <b>Working Area:</b>
                                                                                        <br />
                                                                                        {lead.workingArea}
                                                                                    </span>


                                                                                </div>
                                                                            </td>
                                                                            <td>

                                                                                <div className="d-flex flex-column">
                                                                                    {lead.city || lead.state ?

                                                                                        <span>{lead.city}{lead.city && <span>,</span>}{lead.state}</span> : <span>N/A</span>}
                                                                                    <hr className="w-100" />
                                                                                    <div>
                                                                                        <i className="fa fa-mobile fa-2x my-1 " />&nbsp;
                                                                                        {
                                                                                            lead.phoneNumber ?
                                                                                                <a
                                                                                                    className='text-dark'
                                                                                                    href={`phoneto: ${lead.phoneNumber}`}
                                                                                                >   {lead.phoneNumber && lead.phoneNumber.replace(/\D+/g, "")
                                                                                                    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}</a>
                                                                                                : "N/A"
                                                                                        }

                                                                                        {/* {lead.phoneNumber} */}
                                                                                    </div>
                                                                                    <br />

                                                                                    <div><i className="fa fa-envelope fa-lg my-1" style={{ fontSize: "16px" }} />&nbsp; <a
                                                                                        className='text-dark'
                                                                                        href={`mailto: ${lead.email}`}
                                                                                    >{lead.email}</a></div>
                                                                                </div>


                                                                            </td>
                                                                            <td>
                                                                                <span >
                                                                                    <Input
                                                                                        id="assignedto"
                                                                                        type="select"
                                                                                        name="CcId"
                                                                                        value={lead.assignedTo}
                                                                                        placeholder="Select sub Category"
                                                                                        onChange={(e) => {
                                                                                            const value = e?.target?.value

                                                                                            this.handleCCCareChange(value, lead.id)
                                                                                        }}
                                                                                    >
                                                                                        <option value={""}>Select </option>
                                                                                        {this?.state?.costumerCare?.map((data, i) => {
                                                                                            return (
                                                                                                <option key={i} value={data.organizationUserId} id={data.fullName} selected={data.organizationUserId == this.state?.CcId}>
                                                                                                    {data.fullName}
                                                                                                </option>
                                                                                            );

                                                                                        })}

                                                                                    </Input>

                                                                                </span>
                                                                            </td>

                                                                            {/* <td style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflowX: "hidden", maxWidth: "10px" }}>{lead.reason}</td> */}
                                                                            <td style={{ color: lead.isRedFlag ? "Red" : "#23282c", fontWeight: lead.isRedFlag ? "bold" : "400" }}>{lead.createdDate && Moment(lead.createdDate).format('MM/DD/YYYY')}</td>
                                                                            <td><Link id="viewdetails" to={`/inquiry/details/${lead.leadType}/${lead.id}`} className="btn btn-primary mr-2">View</Link>
                                                                                <Button id="deleteinquiery" className="btn btn-danger" onClick={() => { this.handleShowInquieryModal(lead.id, lead.leadType) }}>Delete</Button>
                                                                            </td>
                                                                        </tr>

                                                                    }) : <tr><td>No record(s) to show </td></tr>}
                                                                </tbody>
                                                            </Table>
                                                        </CardBody>
                                                    </Collapse>
                                                </Card>
                                            </Fade>
                                        </Col>
                                    ) : null

                                }

                                {
                                    filterType == 1 ? (
                                        <Col
                                            xs="12"
                                            sm="12"
                                            md="12"
                                            key="5"
                                            style={{ fontSize: "0.72rem" }}
                                        >
                                            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                                                <Card style={{ border: "1px solid #F4F7DB" }}>
                                                    <CardHeader
                                                        style={{
                                                            backgroundColor: "#E2F0D9",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => this.setCollapse(5)}
                                                    >
                                                        <Row style={{ fontSize: "16px" }}>
                                                            <Col md="12">Contact</Col>
                                                        </Row>
                                                    </CardHeader>
                                                    <Collapse isOpen={filterType == 1 || filterType == "" ? true : 5 == collapseId} id="collapseExample">
                                                        <CardBody>
                                                            <Table className="table table-hover table-bordered mb-0 d-none d-sm-table ">
                                                                <thead
                                                                    style={{
                                                                        backgroundColor: "#1C3A84",
                                                                        color: "white",
                                                                        fontSize: "16px",
                                                                    }}
                                                                >
                                                                    <tr>
                                                                        <th >Name</th>
                                                                        <th className="w-20">Contact Details</th>
                                                                        <th>Assign To</th>
                                                                        <th >Received On</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.state.leads.length > 0 ? this.state.leads.map((lead, i) => {
                                                                        let assigned = costumerCare.filter(costumerCare => costumerCare.organizationUserId == lead.assignedTo)[0]

                                                                        // let assigned = this.filter((e) => { return this.state.costumerCare.organizationUserId == lead.assignedTo })?.[0]
                                                                        return <tr key={i}>
                                                                            <td>
                                                                                <div className="d-flex flex-column">
                                                                                    <span>

                                                                                        {lead.firstName} {lead.lastName}
                                                                                        <hr />
                                                                                        <b>Working Area:</b>
                                                                                        <br />
                                                                                        {lead.workingArea}
                                                                                    </span>


                                                                                </div>
                                                                            </td>
                                                                            <td>

                                                                                <div className="d-flex flex-column">

                                                                                    <span>{lead.city},{lead.state}</span>
                                                                                    <hr className="w-100" />
                                                                                    <div>
                                                                                        <i className="fa fa-mobile fa-2x my-1 " />&nbsp;
                                                                                        {
                                                                                            lead.phoneNumber ?
                                                                                                <a
                                                                                                    className='text-dark'
                                                                                                    href={`phoneto: ${lead.phoneNumber}`}
                                                                                                >   {lead.phoneNumber && lead.phoneNumber.replace(/\D+/g, "")
                                                                                                    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}</a>
                                                                                                : "N/A"
                                                                                        }

                                                                                        {/* {lead.phoneNumber} */}
                                                                                    </div>
                                                                                    <br />

                                                                                    <div><i className="fa fa-envelope fa-lg my-1" style={{ fontSize: "16px" }} />&nbsp; <a
                                                                                        className='text-dark'
                                                                                        href={`mailto: ${lead.email}`}
                                                                                    >{lead.email}</a></div>
                                                                                </div>


                                                                            </td>
                                                                            <td>
                                                                                <span >
                                                                                    <Input
                                                                                        id="assignedto"
                                                                                        type="select"
                                                                                        name="CcId"
                                                                                        value={lead.assignedTo}
                                                                                        placeholder="Select sub Category"
                                                                                        onChange={(e) => {
                                                                                            const value = e?.target?.value

                                                                                            this.handleCCCareChange(value, lead.id)
                                                                                        }}
                                                                                    >
                                                                                        <option value={""}>Select </option>
                                                                                        {this?.state?.costumerCare?.map((data, i) => {
                                                                                            return (
                                                                                                <option key={i} value={data.organizationUserId} id={data.fullName} selected={data.organizationUserId == this.state?.CcId}>
                                                                                                    {data.fullName}
                                                                                                </option>
                                                                                            );

                                                                                        })}

                                                                                    </Input>

                                                                                </span>
                                                                            </td>

                                                                            {/* <td style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflowX: "hidden", maxWidth: "10px" }}>{lead.reason}</td> */}
                                                                            <td style={{ color: lead.isRedFlag ? "Red" : "#23282c", fontWeight: lead.isRedFlag ? "bold" : "400" }}>{lead.createdDate && Moment(lead.createdDate).format('MM/DD/YYYY')}</td>
                                                                            <td><Link id="viewdetails" to={"/inquiry/details/1/" + lead.id} className="btn btn-primary mr-2">View</Link>
                                                                                <Button id="deleteinquiery" className="btn btn-danger" onClick={() => { this.handleShowInquieryModal(lead.id) }}>Delete</Button>
                                                                            </td>
                                                                        </tr>

                                                                    }) : <tr><td>No record(s) to show </td></tr>}
                                                                </tbody>
                                                            </Table>
                                                        </CardBody>
                                                    </Collapse>
                                                </Card>
                                            </Fade>
                                        </Col>
                                    ) : null

                                }

                                {/* Analysis */}
                                {filterType == 2 ? (
                                    <Col
                                        xs="12"
                                        sm="12"
                                        md="12"
                                        key="1"
                                        style={{ fontSize: "0.72rem" }}
                                    >
                                        <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                                            <Card style={{ border: "1px solid #E2F0D9" }}>
                                                <CardHeader
                                                    style={{
                                                        backgroundColor: "#DAE3F3",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => this.setCollapse(1)}
                                                >
                                                    <Row style={{ fontSize: "16px" }}>
                                                        <Col md="12">Provider</Col>
                                                    </Row>
                                                </CardHeader>
                                                <Collapse isOpen={filterType == 2 ? true : 1 == collapseId} id="collapseExample">
                                                    <CardBody>
                                                        <Table className="table table-hover table-bordered  mb-0 d-none d-sm-table">
                                                            <thead
                                                                style={{
                                                                    backgroundColor: "#1C3A84",
                                                                    color: "white",
                                                                    fontSize: "16px",
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th >Name</th>
                                                                    <th className="w-20">Contact Details</th>
                                                                    <th>Assign To</th>
                                                                    {/* <th className="w-20">Reason</th> */}
                                                                    <th >Received On</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.leads.length > 0 ? this.state.leads.map((lead, i) => {
                                                                    let assigned = this.filter((e) => { return e.organizationUserId == lead.assignedTo })?.[0]
                                                                    return <tr key={i}>
                                                                        <td>
                                                                            <div className="d-flex flex-column">
                                                                                <span>

                                                                                    {lead.firstName} {lead.lastName}
                                                                                    {/* <hr />
                                                                                    <b>Working Area:</b>
                                                                                    <br />
                                                                                    {lead.workingArea} */}
                                                                                </span>
                                                                                {/* <span>

                                                                                    {lead.email}
                                                                                </span>
                                                                                <span >

                                                                                    <b>Assigned To :</b>
                                                                                    {assigned?.fullName ? <>
                                                                                        <br />
                                                                                        {assigned?.fullName}
                                                                                        <br />
                                                                                        {assigned?.email}
                                                                                    </> : "None"
                                                                                    }
                                                                                </span> */}
                                                                            </div>
                                                                        </td>
                                                                        <td>

                                                                            <div className="d-flex flex-column" >

                                                                                <span>{lead.state}</span>
                                                                                <hr className="w-100" />
                                                                                <div >
                                                                                    <i className="fa fa-mobile fa-2x my-1 " />&nbsp;
                                                                                    {
                                                                                        lead.phoneNumber ?
                                                                                            <a
                                                                                                className='text-dark'
                                                                                                href={`phoneto: ${lead.phoneNumber}`}
                                                                                            >   {lead.phoneNumber && lead.phoneNumber.replace(/\D+/g, "")
                                                                                                .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}</a>
                                                                                            : "N/A"
                                                                                    }

                                                                                    {/* {lead.phoneNumber} */}
                                                                                </div>
                                                                                <br />

                                                                                <div><i className="fa fa-envelope fa-lg my-1" style={{ fontSize: "16px" }} />&nbsp; <a
                                                                                    className='text-dark'
                                                                                    href={`mailto: ${lead.email}`}
                                                                                >{lead.email}</a></div>
                                                                            </div>


                                                                        </td>
                                                                        <td>
                                                                            <span >
                                                                                <Input
                                                                                    type="select"
                                                                                    name="CcId"
                                                                                    value={lead.assignedTo}
                                                                                    placeholder="Select sub Category"
                                                                                    onChange={(e) => {
                                                                                        const value = e?.target?.value

                                                                                        this.handleCCCareChange(value, lead.id)
                                                                                    }}
                                                                                >
                                                                                    <option value={""}>Select </option>
                                                                                    {this?.state?.costumerCare?.map((data, i) => {
                                                                                        return (
                                                                                            <option key={i} value={data.organizationUserId} id={data.fullName} selected={data.organizationUserId == this.state?.CcId}>
                                                                                                {data.fullName}
                                                                                            </option>
                                                                                        );

                                                                                    })}

                                                                                </Input>

                                                                            </span>
                                                                        </td>
                                                                        {/* <td style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflowX: "hidden", maxWidth: "10px" }}>{lead.reason}</td> */}
                                                                        <td style={{ color: lead.isRedFlag ? "Red" : "#23282c", fontWeight: lead.isRedFlag ? "bold" : "400" }}>{lead.createdDate && Moment(lead.createdDate).format('MM/DD/YYYY')}</td>
                                                                        <td><Link to={"/inquiry/details/2/" + lead.id} className="btn btn-primary mr-2" >View</Link>
                                                                            <Button className="btn btn-danger" onClick={() => { this.handleShowInquieryModal(lead.id) }} >Delete</Button>
                                                                        </td>
                                                                    </tr>

                                                                }) : <tr><td>No record(s) to show </td></tr>}

                                                            </tbody>
                                                        </Table>
                                                    </CardBody>
                                                </Collapse>
                                            </Card>
                                        </Fade>
                                    </Col>
                                ) : null}

                                {/* Design */}
                                {filterType == 3 ? (
                                    <Col
                                        xs="12"
                                        sm="12"
                                        md="12"
                                        key="2"
                                        style={{ fontSize: "0.72rem" }}
                                    >
                                        <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                                            <Card style={{ border: "1px solid #DAE3F3" }}>
                                                <CardHeader
                                                    style={{
                                                        backgroundColor: "#FFCCCC",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => this.setCollapse(2)}
                                                >
                                                    <Row style={{ fontSize: "16px" }}>
                                                        <Col md="12">Provider Signup</Col>
                                                    </Row>
                                                </CardHeader>
                                                <Collapse isOpen={filterType == 3 ? true : 2 == collapseId} id="collapseExample">
                                                    <CardBody>
                                                        <Table className="table table-hover table-bordered  mb-0 d-none d-sm-table">
                                                            <thead
                                                                style={{
                                                                    backgroundColor: "#1C3A84",
                                                                    color: "white",
                                                                    fontSize: "16px",
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th >Name</th>
                                                                    {/* <th className="w-20">Reason</th> */}
                                                                    <th className="w-20">Contact Details</th>
                                                                    <th>Assign To</th>
                                                                    <th >Received On</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.leads.length > 0 ? this.state.leads.map((lead, i) => {
                                                                    let assigned = this.filter((e) => { return e.organizationUserId == lead.assignedTo })?.[0]
                                                                    return <tr key={i}>
                                                                        <td>
                                                                            <div className="d-flex flex-column">
                                                                                <span>

                                                                                    {lead.firstName} {lead.lastName}
                                                                                    {/* <hr /> */}
                                                                                    {/* <b>Working Area:</b>
                                                                                    <br />
                                                                                    {lead.workingArea} */}
                                                                                </span>

                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex flex-column">

                                                                                {/* <span>{lead.city},{lead.state}</span>
                                                                                <hr className="w-100" /> */}
                                                                                {/* <div>
                                                                                    <i className="fa fa-mobile fa-2x my-1 " />&nbsp;
                                                                                    <a
                                                                                        className='text-dark'
                                                                                        href={`phoneto: ${lead.mobile}`}
                                                                                    >   {lead.phoneNumber}</a>
                                                                                    {/* {lead.phoneNumber} */}
                                                                                {/* </div> */}
                                                                                {/* <br /> */}

                                                                                <div><i className="fa fa-envelope fa-lg my-1" style={{ fontSize: "16px" }} />&nbsp; <a
                                                                                    className='text-dark'
                                                                                    href={`mailto: ${lead.email}`}
                                                                                >{lead.email}</a></div>
                                                                            </div>


                                                                        </td>
                                                                        <td>
                                                                            <span >
                                                                                <Input
                                                                                    type="select"
                                                                                    name="CcId"
                                                                                    value={lead.assignedTo}
                                                                                    placeholder="Select sub Category"
                                                                                    onChange={(e) => {
                                                                                        const value = e?.target?.value

                                                                                        this.handleCCCareChange(value, lead.id)
                                                                                    }}
                                                                                >
                                                                                    <option value={""}>Select </option>
                                                                                    {this?.state?.costumerCare?.map((data, i) => {
                                                                                        return (
                                                                                            <option key={i} value={data.organizationUserId} id={data.fullName} selected={data.organizationUserId == this.state?.CcId}>
                                                                                                {data.fullName}
                                                                                            </option>
                                                                                        );

                                                                                    })}

                                                                                </Input>

                                                                            </span>
                                                                        </td>
                                                                        {/* <td style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflowX: "hidden", maxWidth: "10px" }}>{lead.reason}</td> */}
                                                                        <td style={{ color: lead.isRedFlag ? "Red" : "#23282c", fontWeight: lead.isRedFlag ? "bold" : "400" }}>{lead.createdDate && Moment(lead.createdDate).format('MM/DD/YYYY')}</td>
                                                                        <td><Link to={"/inquiry/details/3/" + lead.id} className="btn btn-primary mr-2">View</Link>
                                                                            <Button className="btn btn-danger" onClick={() => { this.handleShowInquieryModal(lead.id) }}>Delete</Button>
                                                                        </td>
                                                                    </tr>

                                                                }) : <tr><td>No record(s) to show </td></tr>}
                                                            </tbody>
                                                        </Table>
                                                    </CardBody>
                                                </Collapse>
                                            </Card>
                                        </Fade>
                                    </Col>
                                ) : null}





                                {/* 
                                <Pagination aria-label="Page navigation example" className="customPagination">
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

                <Modal isOpen={DeleteInquieryModal} className="modal-dialog modal-md">
                    <ModalHeader>Change Status </ModalHeader>
                    <ModalBody>
                        <div className="form-group">

                            Are you sure you want to delete this Inquiry ?
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary"
                            onClick={this.handleCloseInquieryModal}
                        >
                            Close
                        </Button>
                        <Button color="primary" onClick={() => { this.deleteInquiery(leadId) }}  >
                            OK

                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state?.changeCcModal} className="modal-dialog modal-md">
                    <ModalHeader>Assign </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            Are you sure you want to assign this lead to <b>{this.state.costumerCare.filter(costumerCare => costumerCare.organizationUserId == this.state.CcId)?.[0]?.fullName}</b> ?
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary"
                            onClick={this.handleCloseCcModal}
                        >
                            Close
                        </Button>
                        <Button color="primary" onClick={() => { this.assignCCData() }} >
                            OK

                        </Button>
                    </ModalFooter>
                </Modal>
            </div >
        );
    }
}

export default Dashboard;
