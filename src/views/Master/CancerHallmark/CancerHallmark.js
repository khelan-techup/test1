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
import { BE_Common_GetPatientDropdown, BE_GeneHallmarkMaster_DeleteCancerHallmarks, BE_GeneHallmarkMaster_GetAllPaging, BE_GeneHallmarkMaster_GetCancerHallmarksById, BE_GeneHallmarkMaster_SaveCancerHallmarks, BE_GeneHallmarkMaster_UpdateCancerHallmarks, BE_Neoantigen_ImportData, BE_OrganizationUser_UpdateTooltipSteps, BE_Patient_GetAll } from '../../../common/allApiEndPoints';




class CancerHallmark extends Component {
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
                HallmarkTitle: "",
                HallmarkNumber: ""




            },

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
            HallmarkId: 0,
            HallmarkTitle: "",
            HallmarkNumber: "",


            isSkipped: false,
            stepsEnabled: false, // stepsEnabled starts the tutorial
            initialStep: 0,
            currentStep: 0,
            steps: [{
                element: "#pagetitle",
                title: 'Cancer Hallmark(s)',
                intro: "Used to add or update Cancer Hallmarks and Description.",
                tooltipClass: "cssClassName1",
            },

            {
                element: "#Add",
                title: 'Add New Cancer Hallmark',
                tooltipClass: "cssClassName1",
                intro: "You can add new Cancer Hallmark by clicking on this Add button."
            },
            {
                element: "#activeInactiveFilter",
                title: 'Active/Inactive filter for Cancer Hallmark list',
                intro: "You can filter Cancer Hallmark list by selecting active or inactive option from the dropdown.",
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
                title: 'Search in Cancer Hallmark List',
                tooltipClass: "cssClassName1",
                intro: "This Search Bar allows the User to search in the Cancer Hallmark list."
            },
            // {
            //   element: "#showMore ",
            //   title: 'Show More Description',
            //   tooltipClass: "cssClassName1",
            //   intro: "By clicking on it , You can see full description."
            // },

            {
                element: "#Edit",
                title: 'Edit Cancer Hallmark',
                tooltipClass: "cssClassName1",
                intro: "You can edit or update Cancer Hallmark details by clicking on this Edit button."
            },
            {
                element: "#Delete",
                title: 'Delete or Recover Cancer Hallmark',
                tooltipClass: "cssClassName1",
                intro: "You can delete/recover Cancer Hallmark by clicking on Delete/Recover button."
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


        };
        this.state = this.initialState;
    }

    //Help tooltip
    onExit = (e) => {
        console.log(e)
        this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 6 }));
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
            const element = document.querySelector('#Edit')

            if (!element) this.myRef.current.introJs.nextStep()
        }
        if (newStepIndex === 4) {
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
            let currentrights = rights.filter(role => role.moduleId.toString() == "35");
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

                        },

                    );


                }
            })
            .catch((error) => {
                // console.log(error);
                this.setState({ loading: false });
            });

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
        // const url = apiroute + '/api/BE_GeneHallmarkMaster/GetAllPaging';
        const url = apiroute + BE_GeneHallmarkMaster_GetAllPaging

        let data = JSON.stringify({
            isDeleted: this.state.slDelete,
            searchString: this.state.searchString,
            //   Id: userId,
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
        // const url = apiroute + '/api/BE_GeneHallmarkMaster/DeleteCancerHallmarks?id=' + id + '&userId=' + userId + '';
        const url = apiroute + BE_GeneHallmarkMaster_DeleteCancerHallmarks(id, userId)

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
            HallmarkTitle: "",
            HallmarkNumber: "",

            geneName: "",
            diseaseName: "",
            gender: "M",
            dob: "",
            age: "",
            countryname: "",
            description: "",
            errors: {
                geneName: "",
                description: "",
                dob: "",
                countryId: "",
                diseaseName: "",
                countryname: "",
                HallmarkNumber: "",
                HallmarkTitle: ""


                // protein: '',
                // neoantigenValue: '',
                // cancerHallmark: '',
                // researchLiteratureLink: '',
                // comments: '',
                // patientId: ''
            },
        });
    }

    handleShowNeoantigen = (e, Hid) => {
        //alert(Math.round(Amount,2))
        if (Hid != 0) {
            this.setState({ loading: true, title: "Edit Hallmark Deatils" });
            console.log("jjjj")

            const apiroute = window.$APIPath;
            // const url = apiroute + '/api/BE_GeneHallmarkMaster/GetCancerHallmarksById?id=' + Hid + '';
            const url = apiroute + BE_GeneHallmarkMaster_GetCancerHallmarksById(Hid)

            axiosInstance.get(url, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
                .then(result => {
                    if (result.data.flag) {
                        var rData = result.data.outdata;
                        this.setState({
                            HallmarkId: rData.id,
                            HallmarkTitle: rData.title,
                            HallmarkNumber: rData.hallMarkNo,
                            //   description: rData.description,
                            //   age: rData.age,
                            //   gender: rData.gender,
                            //   dob: rData.dob != null
                            //     ? new Date(
                            //       Moment(
                            //         rData.dob
                            //       ).format("MM/DD/YYYY")
                            //     )
                            //     : "",
                            //   countryname: rData.country,
                            //   diseaseName: rData.diseaseName,
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
                // geneProtienDataId: geneProtienDataId,
                title: "Add Hallmark Details"
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
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        let errors = this.state.errors;

        switch (name) {
            case 'HallmarkNumber':
                errors.HallmarkNumber = (!value) ? "Please enter Hallmark Number." : '';
                break;
            case 'HallmarkTitle':
                errors.HallmarkTitle = (!value) ? "Please enter Hallmark Title." : '';
                break;
            // case 'dob':
            //   errors.dob = (!value) ? "Please select date." : '';
            //   break;

            // case 'countryname':
            //   errors.countryname = (!value) ? "Please enter country name " : '';
            //   break;
            //   case 'diseaseName':
            //     errors.diseaseName = (!value) ? "Please enter disease name." : '';
            //     break;

            default:
                break;
        }

        this.setState({ errors, [name]: value }, () => {

        })
    }

    //form validation
    validateForm = (errors) => {
        let valid = true;

        if (this.state.HallmarkTitle == undefined || this.state.HallmarkTitle == '') {
            errors.HallmarkTitle = 'Please enter Hallmark Title.';
        }
        if (this.state.HallmarkNumber == undefined || this.state.HallmarkNumber == '') {
            errors.HallmarkNumber = 'Please enter Hallmark Number.';
        }
        // if (this.state.dob == undefined || this.state.dob == '') {
        //   errors.dob = 'Please enter date of birth.';
        // }
        // if (this.state.countryname == undefined || this.state.countryname == '') {
        //   errors.countryname = 'Please enter country name.';
        // }
        // if (this.state.diseaseName == undefined || this.state.diseaseName == '') {
        //   errors.diseaseName = 'Please enter disease name.';
        // }
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
        var data = ""
        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem('AUserToken'));
        if (userToken != null) {
            uid = (userToken.userId == null ? 0 : userToken.userId);
        }

        if (this.validateForm(this.state.errors)) {
            const apiroute = window.$APIPath;
            if (this.state.HallmarkId == 0) {
                // url = apiroute + '/api/BE_GeneHallmarkMaster/SaveCancerHallmarks';
                url = apiroute + BE_GeneHallmarkMaster_SaveCancerHallmarks
            }
            else {
                // url = apiroute + '/api/BE_GeneHallmarkMaster/UpdateCancerHallmarks';
                url = apiroute + BE_GeneHallmarkMaster_UpdateCancerHallmarks
            }

            if (this.state.HallmarkId == 0) {
                data = JSON.stringify({
                    id: parseInt(this.state.HallmarkId),
                    patientReportId: 1,
                    title: this.state.HallmarkTitle,
                    hallMarkNo: parseInt(this.state.HallmarkNumber),

                    CreatedBy: uid
                })
            } else {
                data = JSON.stringify({
                    id: parseInt(this.state.HallmarkId),
                    patientReportId: 1,
                    title: this.state.HallmarkTitle,
                    hallMarkNo: parseInt(this.state.HallmarkNumber),

                    updatedBy: uid
                })
            }

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
                        HallmarkId: 0,
                        HallmarkTitle: "",
                        HallmarkNumber: ""
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
                    <Col xs="10" lg="10" >
                        <h5 className="mt-2" id="pagetitle" style={{ width: "fit-content" }}><i className="fa fa-align-justify"></i> Cancer Hallmarks</h5>
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
                                            <th>Hallmark No</th>
                                            <th>Hallmark Title</th>
                                            {/* <th>Country</th> */}
                                            {/* <th>Gender</th> */}
                                            {/* <th>Date of Birth</th> */}
                                            {/* <th>Age</th> */}
                                            {/* <th>Description</th> */}
                                            <th>Active</th>
                                            <th className="thNone">Gene/Protien Data Id</th>
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
                                                            <td>{data.hallMarkNo}</td>
                                                            <td>{data.title}</td>
                                                            {/* <td>{data.country}</td> */}
                                                            {/* <td>{data.gender}</td> */}
                                                            {/* <td>{data.dob != null && data.dob != "" ?
                                Moment(data.dob).format(
                                  "MM/DD/YYYY"
                                ) : "NA"
                              }</td> */}
                                                            {/* <td>{data.age}</td> */}

                                                            <td>
                                                                {data.isActive ? (<Badge color="success">Active</Badge>) : (<Badge color="danger">Inactive</Badge>)}
                                                            </td>
                                                            <td className="thNone">{data.id}</td>

                                                            <td>
                                                                <div className='d-flex'>
                                                                    <Link to="#" id="Edit" className="btn btn-primary btn-sm btn-pill" onClick={e => this.handleShowNeoantigen(e, data.id)}>Edit</Link>{" "}
                                                                    {
                                                                        this.state.isEdit ? <>
                                                                            <Confirm title="Confirm"
                                                                                description={`${data.isActive ? 'Are you sure you want to delete this Hallmark details?' : 'Are you sure you want to recover this Hallmark details?'}`}
                                                                            >
                                                                                {confirm => (
                                                                                    <Link id="Delete" className="btn btn-danger btn-sm btn-pill ml-1" to="#" onClick={confirm(e => this.deleteRow(e, data.id))}>{data.isActive ? "Delete" : "Recover"}</Link>
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
                                                    <td colSpan="5" className="tdCenter">No Hallmark details.</td></tr>
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
                            <label htmlFor="recipient-name" className="form-control-label">Hallmark Number<span className="requiredField">*</span></label>
                            <Input type="number" autoComplete="off" name="HallmarkNumber" tabIndex="2" maxLength="45" className="form-control" value={this.state.HallmarkNumber} onChange={this.handleNeoantigenInputChange.bind(this)} placeholder="Enter hallmark No" />
                            {<span className="error">{errors.HallmarkNumber}</span>}

                        </div>

                        <div className="form-group">
                            <label htmlFor="recipient-name" className="form-control-label">Hallmark Title <span className="requiredField">*</span></label>
                            <Input type="textarea" spellcheck="true" rows="13" autoComplete="off" name="HallmarkTitle" tabIndex="2" className="form-control" value={this.state.HallmarkTitle} onChange={this.handleNeoantigenInputChange.bind(this)} placeholder="Enter hallmark title" />
                            {<span className="error">{errors.HallmarkTitle}</span>}

                        </div>



                        {/* <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Country <span className="requiredField">*</span></label>
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
            </div> */}










                    </ModalBody>
                    <ModalFooter style={{ backgroundColor: 'white' }}>
                        <Button color="secondary" onClick={this.handleCloseNeoantigen}>
                            Close
                        </Button>
                        {
                            this.state.isEdit ? <>

                                <Button color="primary" disabled={loading} onClick={this.AddPatientNeoantigen.bind(this)}>
                                    {title == "Edit Hallmark Deatils" ? "Update" : "Add"}
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

export default CancerHallmark;
