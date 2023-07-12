import React, { Component } from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Col,
    FormGroup,
    Table,
    Input,
    Row, Modal, ModalBody, ModalFooter, ModalHeader,
    Label,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import axiosInstance from '../../common/axiosInstance';




import "@reach/dialog/styles.css";
import { toast } from "react-toastify";
import close_icon from "../../assets/close.png"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build'
import ReactHtmlParser from 'react-html-parser';
import Moment from "moment";



class View extends Component {
    constructor(props) {
        super(props);

        this.initialState = {
            loading: false, leadType: "", leadId: null,
            practitionerId: 0,
            basicInfo: {},
            mainSelected: "",
            institute: "",
            redirect: false,
            modal: false,
            modalTitle: "",
            modalBody: "",
            DeletemodalforNoteComment_crm: "",
            isView: false,
            isEdit: false,
            roleName: "",
            showPopup: false,
            redirect: false,
            url: "",
            patientId: "",
            patientAccessionId: "",
            accessionNo: "",

            add_notes_crm: false,
            inputTextforNotes_crm: "",
            notes_Comments_updatedBy_Id: "",
            showComments_crm: [],
            EditCommentId_crm: "",
            EditcommentText_crm: "",
            costumerCare: [],
            CcId: 0,
            changeCcModal: false,
            commentText_crm: "",
            commentId_crm: 0,
            ccName: ""
            , DeleteCommentId_crm: "",
            DeletepatientNotesId_crm: ""
            //options: [{name: 'Srigar', id: 1},{name: 'Sam', id: 2}]
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
            this.props.history.push("/practitioners/list");
        }
    };
    handleShowNotes_crm = () => {

        this.setState({
            add_notes_crm: true
        },
            // , this.OrganizationUserDataForNotes()
        );


    }

    AddNotes_crm(e) {
        e.preventDefault();
        this.setState({ loading: true });
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        const param = this.props.match.params;
        const apiroute = window.$APIPath;
        if (this.validateNotesData(this.state.errors)) {
            let url = apiroute + "/api/BE_PatientNotes/Save";
            let data = JSON.stringify({
                "patientNoteId": 0,
                "patientAccessionId": parseInt(param.aid),
                // "notesTitle": this.state.note_title,
                // "notes": this.state.inputTextforNotes.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, " "),
                "notes": this.state.inputTextforNotes,
                // "assignedToUserId": parseInt(this.state.assignUserId),
                "sectionId": parseInt(this.state.sectionId),
                "createdBy": parseInt(userToken.organizationUserId),
                // "createdByUserName":String(userToken.userName)
            })
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
                        toast.success("Comment created successfully");
                        this.handleCloseNotes_crm()
                        // this.getData(param.id, param.aid);
                        // this.getAllNotes(param.id, param.aid);
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
    AddNoteComment_crm(e) {
        e.preventDefault();
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        const param = this.props.match.params;
        const leadeTypeId = param.type;
        const leadeId = param.id;

        const apiroute = window.$APIPath;
        let url = apiroute + "/api/BE_NeoInquiry/CreateLeadComment";
        let data = JSON.stringify({
            "id": 0,
            "leadType": parseInt(leadeTypeId),
            "leadId": parseInt(leadeId),
            "commentText": this.state.commentText_crm,
            // "patientAccessionId": parseInt(param.aid),
            // "notesTitle": this.state.note_title,
            // "notes": this.state.inputTextforNotes,
            // "assignedToUserId": parseInt(this.state.assignUserId),
            // "sectionId": parseInt(this.state.sectionId),
            // "notifyToUserIds": "5",
            "createdBy": parseInt(userToken.organizationUserId),
            // "patientNotesId": this.state.patientNoteId,
            // "commentText": this.state.commentText
            // "createdByUserName":String(userToken.userName)
        })
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
                        commentText_crm: "",
                        // IsReply_crm: false
                    });
                    // this.getComments(result.data.outdata.patientNotesId)
                    toast.success(result.data.message);

                    // this.handleCloseNotes_crm()
                    this.getComments_crm(leadeTypeId, leadeId);
                    this.getData(leadeId, leadeTypeId)



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
    CancelEditComments_crm = () => {
        this.setState({
            EditCommentId_crm: "",
            EditcommentText_crm: ""
        })


    }
    EditComment_crm(e, commentId, noteleadType, noteLeadId) {
        e.preventDefault();
        this.setState({ loading: true });

        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        const apiroute = window.$APIPath;
        const param = this.props.match.params;
        const leadeTypeId = param.type;
        const leadeId = param.id;

        let url = apiroute + "/api/BE_NeoInquiry/UpdateLeadComment";
        let data = JSON.stringify({
            // "commentId": commentId,
            "id": commentId,
            "leadType": parseInt(leadeTypeId),
            "leadId": parseInt(leadeId),
            // "patientNotesId": parseInt(patientNotesId),
            "commentText": this.state.EditcommentText_crm,
            "updatedBy": parseInt(userToken.organizationUserId)
        })

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
                    this.CancelEditComments_crm();

                    toast.success("Comment updated successfully.");
                    // this.handleCloseNotesEdit()
                    // this.getData(param.id, param.aid);
                    this.getComments_crm(leadeTypeId, leadeId);

                    // this.getComments(parseInt(noteLeadId))
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
    toggleComment_crm(e, id, noteLeadId) {
        this.setState({
            DeletemodalforNoteComment_crm: !this.state?.DeletemodalforNoteComment_crm,
            DeleteCommentId_crm: id,
            DeletepatientNotesId_crm: this.state?.notes_Comments_updatedBy_Id

        });
    }
    DeleteComment_crm(e, commentId, organizationUserId) {
        e.preventDefault();
        this.setState({ loading: true });
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        const apiroute = window.$APIPath;
        const param = this.props.match.params;
        let leadeTypeId = param.type;
        let leadeId = param.id;

        let url = apiroute + "/api/BE_NeoInquiry/DeleteLeadComment?id=" + commentId + "&userId=" + organizationUserId
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
                        DeletemodalforNoteComment_crm: false,
                        DeleteCommentId_crm: "",
                        DeletepatientNotesId_crm: ""


                    });

                    toast.success("Comment deleted successfully.");
                    this.getComments_crm(leadeTypeId, leadeId);
                    // this.handleCloseNotesEdit()
                    // this.getData(param.id, param.aid);
                    // this.getComments_crm(parseInt(patientNotesId))
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
                        showComments: result.data.outdata.outdata

                    })
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                // console.log(error);
                this.setState({ loading: false });
            });
    }
    handleCloseNotes_crm = () => {
        const param = this.props.match.params
        const leadeTypeId = param.type;
        const leadeId = param.id;
        this.setState({
            add_notes_crm: false,
            commentText_crm: ""
        },
            this.getData(leadeId, leadeTypeId)
        );
        // let errors = this.state.errors;
        // errors.inputTextforNotes = "";
        // errors.sectionId = "";
    }
    handleCCCareChange = (e) => {
        const target = e.target;
        const value = target.value;

        const id = target.children[target.selectedIndex].id;
        console.log(id)
        if (value != "") {
            this.setState({
                CcId: Number(value),
                changeCcModal: true,
                ccName: id
            });
        }

    };
    handleShowCcModal = () => {
        this.setState({
            changeCcModal: true
        })
    }
    assigntot_crm(e) {
        e.preventDefault();
        this.setState({ loading: true });
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        const param = this.props.match.params;
        const leadeTypeId = param.type;
        const leadeId = param.id;

        const apiroute = window.$APIPath;
        let url = apiroute + "/api/BE_NeoInquiry/AssignLead";
        let data = JSON.stringify({
            // "id": 0,
            "leadType": parseInt(leadeTypeId),
            "leadId": parseInt(leadeId),
            // "commentText": this.state.commentText_crm,
            // "patientAccessionId": parseInt(param.aid),
            // "notesTitle": this.state.note_title,
            // "notes": this.state.inputTextforNotes,
            // "assignedToUserId": parseInt(this.state.assignUserId),
            // "sectionId": parseInt(this.state.sectionId),
            // "notifyToUserIds": "5",
            "userId": parseInt(userToken.organizationUserId),
            // "patientNotesId": this.state.patientNoteId,
            // "commentText": this.state.commentText
            // "createdByUserName":String(userToken.userName)
        })
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
                        // commentText_crm: "",
                        // IsReply_crm: false
                    });
                    // this.getComments(result.data.outdata.patientNotesId)
                    toast.success(result.data.message);

                    // this.handleCloseNotes_crm()
                    this.getComments_crm(leadeTypeId, leadeId);


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
    handleCloseCcModal = () => {
        this.setState({
            changeCcModal: false,
            CcId: this.state.mainSelected
        })
    }
    getLeadType = (lead, url = false) => {
        switch (Number(lead)) {
            case 1: {
                if (url) {
                    return "/api/BE_NeoInquiry/GetContactInquirybyId"
                } else {

                    return "Contact"
                }
            }
            case 2: {
                if (url) {
                    return "/api/BE_NeoInquiry/GetProviderContactInquirybyId"
                } else {

                    return "ProviderContact"
                }
            }
            case 3: {
                if (url) {
                    return "/api/BE_NeoInquiry/GetSignupInquirybyId"
                } else {

                    return "SignUp"
                }
            }
            default:
                return "Contact"
        }
    }

    getCostumerCareData() {
        const apiroute = window.$APIPath;
        const url = apiroute + "/api/BE_OrganizationUser/GetLeadAssignees";
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

    assignCCData() {
        this.setState({
            loading: true
        })
        const apiroute = window.$APIPath;
        const url = apiroute + "/api/BE_NeoInquiry/AssignLead";
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        console.log(userToken.userId)
        const param = this.props.match.params
        // let data = JSON.stringify({
        //   isDeleted: true,
        //   searchString: "",
        //   id: 0,
        // });

        let data = JSON.stringify({
            "leadType": parseInt(param.type),
            "leadId": parseInt(this.state?.leadId),
            "userId": parseInt(this.state?.CcId)
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

                })
                toast.success(result.data.message)

                // console.log(this.state.costumerCare, "ghvvvvyyvtgvtgresult")

            })

    }



    //get detail
    componentDidMount() {
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        var rights = userToken.roleModule;
        const param = this.props.match.params
        const leadeTypeId = param.type;
        const leadeId = param.id;
        // console.log(param)

        this.setState({
            roleName: userToken.roleName,
            notes_Comments_updatedBy_Id: userToken.organizationUserId,
            leadType: this.getLeadType(param.type),
            leadId: param.id,
            loading: true
        }, () => {

            this.getData(leadeId, leadeTypeId)
            this.getCostumerCareData()
            // this.getEnquiryData_crm(leadeId)
        });

        //console.log(rights);
        // if (rights.length > 0) {
        //   let currentrights = rights.filter((role) =>
        //     role.moduleName.toLowerCase().includes("patients")
        //   );
        //   //console.log(currentrights);
        //   if (currentrights.length > 0) {
        //     this.setState({
        //       isView: currentrights[0].isViewed,
        //       isEdit: currentrights[0].isEdited,
        //     });
        //     if (currentrights[0].isViewed) {
        //     } else {
        //       this.setState({ loading: false });
        //     }
        //   } else {
        //     this.setState({ loading: false });
        //   }
        // } else {
        //   this.setState({ loading: false });
        // }
    }

    //get detail(for update)
    getData = (id, type) => {
        const apiroute = window.$APIPath;
        //         const url = apiroute + "/api/BE_Practitioner/GetById?id=" + id + "";

        const url = apiroute + this.getLeadType(type, true) + `?id=` + id;

        axiosInstance
            .get(url, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((result) => {
                // console.log(result);
                if (result.data.flag) {
                    var rData = result.data.outdata;
                    this.setState({
                        basicInfo: rData,
                        CcId: rData.assignedTo,
                        mainSelected: rData.assignedTo,
                        loading: false,
                        commentId_crm: rData.commentId
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
    };

    loader() {
        if (this.state.loading) {
            return <div className="cover-spin"></div>;
        }
    }
    getComments_crm = (notesId, leadId) => {
        const apiroute = window.$APIPath;
        const url =
            // apiroute + "/api/BE_PatientNotes/GetAll?id=" + id + "&aid=" + aid + "";
            apiroute + "/api/BE_NeoInquiry/GetCommentsByLeadId?LeadType=" + notesId + "&leadId=" + leadId;
        axiosInstance
            .get(url, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((result) => {
                if (result.data.flag) {
                    this.setState({
                        showComments_crm: result.data.outdata.outdata,
                        loading: false
                    })
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                // console.log(error);
                this.setState({ loading: false });
            });
    }

    handleEditNotes_crm = () => {
        const param = this.props.match.params;
        const leadeTypeId = param.type;
        const leadeId = param.id;
        this.setState({
            add_notes_crm: true
        },
            this.getComments_crm(leadeTypeId, leadeId)
        );

    }
    getEnquiryData_crm = (leadId) => {
        this.setState({ loading: true });

        const param = this.props.match.params;
        const leadeTypeId = param.type;
        const leadeId = param.id;

        const apiroute = window.$APIPath;
        const url =
            // apiroute + "/api/BE_PatientNotes/GetAll?id=" + id + "&aid=" + aid + "";
            apiroute + "/api/BE_NeoInquiry/GetContactInquirybyId?id=" + leadId;
        axiosInstance
            .get(url, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((result) => {
                if (result.data.flag) {
                    this.setState({
                        // showComments_crm: result.data.outdata.outdata
                        commentId_crm: result.data.outdata.commentId

                    })
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                // console.log(error);
                this.setState({ loading: false });
            });
    }
    render() {
        if (localStorage.getItem("AUserToken") == null) {
            return <Redirect to="/login" />;
        }

        const { loading, practitionerId, basicInfo, institute, errors, changeCcModal, ccName } =
            this.state;

        return (
            <div className="animated fadeIn">

                {this.loader()}
                <>




                    <Modal isOpen={this.state.add_notes_crm} className="modal-dialog modal-lg">
                        <ModalBody className="">
                            <p className="">
                                <span className="h4">
                                    Write your comment
                                </span>

                                <span className="float-right"
                                    onClick={this.handleCloseNotes_crm}
                                >
                                    <img style={{ height: "20px", width: "20px", cursor: "pointer" }} className="img-fluid" src={close_icon} alt="close" />
                                </span>
                            </p>
                            {/* <p className="bg- pb-3 pl-2 rounded rounded-2 h4">

                            Create Note

                          </p> */}


                            <div className="form-group">
                                <div className="note bg-light">
                                    <div className="note__body">
                                        <CKEditor
                                            editor={ClassicEditor}
                                            name="commentText_crm"
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
                                                simpleUpload: {
                                                    // The URL that the images are uploaded to.
                                                    uploadUrl: window.$APIPath + '/api/BE_ReportBuilder/UploadNotesCkeditorImage',

                                                    // Enable the XMLHttpRequest.withCredentials property.
                                                    // withCredentials: true,

                                                    // Headers sent along with the XMLHttpRequest to the upload server.
                                                    headers: {
                                                        'X-CSRF-TOKEN': 'CSRF-Token',
                                                        Authorization: 'Bearer <JSON Web Token>'
                                                    }
                                                }
                                            }}
                                            onChange={
                                                (event, editor) => {
                                                    const data = editor?.getData();
                                                    let errors = this.state.errors;
                                                    // errors.inputTextforNotes = ""
                                                    this.setState({ commentText_crm: data });


                                                    // this.handleNoteInput.bind(this)
                                                }
                                            }
                                            data={this.state.commentText_crm || ""}
                                        ></CKEditor>
                                        <span className="error">
                                            <small>
                                                {/* {this.state.errors.inputTextforNotes} */}
                                            </small>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {

                                <Button
                                    disabled={!this.state.commentText_crm ? true : false}
                                    className="float-right"
                                    color="primary"
                                    onClick={this.AddNoteComment_crm.bind(this)}
                                >
                                    Post
                                </Button>


                            }



                        </ModalBody>
                        {
                            this.state.showComments_crm.length > 0 ?
                                <>

                                    <ModalFooter>
                                    </ModalFooter>


                                    <ModalBody
                                        style={{
                                            overflowY: "auto",
                                            height: this.state.showComments_crm.length > 4 ? "80vh" : "100%"
                                        }}
                                    >
                                        <p className="h4">All comments {
                                            this.state.showComments_crm.length > 0 ? (`(${this.state.showComments_crm.length})`) : null
                                        } </p>
                                        <div className="d-flex my-3">

                                        </div>
                                        <div className="row">
                                            <div
                                                className="col-10 "
                                            >
                                                <p className="px-lg-1">
                                                    {
                                                        this.state.showComments_crm.length > 0 ?

                                                            this.state.showComments_crm.map((data, i) => {
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
                                                                                                <span>(Updated)</span>  {Moment(data.updatedDate).format("Do MMM YYYY, kk:mm A")}
                                                                                            </>
                                                                                            : <>
                                                                                                {
                                                                                                    Moment(data.createdDate).format("Do MMM YYYY, kk:mm A")
                                                                                                }

                                                                                            </>

                                                                                        // console.log(Moment(data.createdDate).format("YYYY/MM/DD kk:mm:ss"))


                                                                                    }
                                                                                </small>

                                                                            </span>

                                                                        </div>
                                                                    </p>
                                                                    {
                                                                        this.state.EditCommentId_crm == data.id ?
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
                                                                                                simpleUpload: {
                                                                                                    // The URL that the images are uploaded to.
                                                                                                    uploadUrl: window.$APIPath + '/api/BE_ReportBuilder/UploadNotesCkeditorImage',

                                                                                                    // Enable the XMLHttpRequest.withCredentials property.
                                                                                                    // withCredentials: true,

                                                                                                    // Headers sent along with the XMLHttpRequest to the upload server.
                                                                                                    headers: {
                                                                                                        'X-CSRF-TOKEN': 'CSRF-Token',
                                                                                                        Authorization: 'Bearer <JSON Web Token>'
                                                                                                    }
                                                                                                }
                                                                                            }}
                                                                                            // maxLength="500"

                                                                                            onChange={
                                                                                                (event, editor) => {
                                                                                                    const data = editor?.getData();
                                                                                                    this.setState({ EditcommentText_crm: data });
                                                                                                    // this.handleNoteInput.bind(this)
                                                                                                }
                                                                                            }
                                                                                            data={this.state.EditcommentText_crm || ""}
                                                                                        ></CKEditor>



                                                                                        <div className="note__foter mt-2">
                                                                                            <div className="d-flex flex-row float-right">
                                                                                                <Button onClick={this.CancelEditComments_crm} className="note__save text-light bg-primary" >Cancel</Button> {" "}
                                                                                                <Button
                                                                                                    onClick={e => this.EditComment_crm(e, data.id, data.leadType, data.leadId)}
                                                                                                    disabled={this.state.EditcommentText_crm.trim() == ""}
                                                                                                    className="ml-1 note__save text-light bg-primary">Save</Button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div> : <p className="pl-5">{ReactHtmlParser(data.commentText || "<p> </p>")}</p>
                                                                    }


                                                                    {
                                                                        this.state.notes_Comments_updatedBy_Id == data.createdBy ? <p className="pl-5">
                                                                            {
                                                                                <span
                                                                                    className="comment_crm"
                                                                                    style={{ cursor: "pointer", fontWeight: "bold", opacity: "75%" }}



                                                                                    onClick={() => {
                                                                                        this.setState({
                                                                                            EditCommentId_crm: data.id,
                                                                                            EditcommentText_crm: data.commentText
                                                                                        })

                                                                                    }}

                                                                                >
                                                                                    Edit
                                                                                </span>
                                                                            }



                                                                            <span className="mx-2 comment_crm"
                                                                                style={{ cursor: "pointer", fontWeight: "bold", opacity: "75%" }}





                                                                                // onClick={e => this.DeleteComment(e, data.commentId, data.patientNotesId)}
                                                                                onClick={e => this.toggleComment_crm(e, data.id, data.leadId)}
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
                                        </div>


                                    </ModalBody>
                                </>



                                : null
                        }



                    </Modal>
                </>
                <Row className="mb-3">
                    <Col xs="4" >
                        <h5 className="mt-2">
                            <i className="fa fa-align-justify"></i>  Details
                        </h5>
                    </Col>
                    <Col xs="4" className="d-flex aling-items-center" style={{ alignItems: "flex-end" }} >

                        <Label>Assign To: </Label>
                        <Input
                            style={{ maxWidth: "65%", marginLeft: "5px" }}
                            type="select"
                            name="CcId"
                            value={this.state?.CcId}
                            placeholder="Select sub Category"
                            onChange={this.handleCCCareChange}
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


                    </Col>
                    <Col xs="2">
                        {
                            this.state.commentId_crm == 0 ?
                                <Button
                                    color="primary"
                                    Style={{ cursor: "pointer" }}
                                    className="btn btn-primary text-light float-right" onClick={this.handleShowNotes_crm}>
                                    {/* <i className="fa fa-plus text-light" ></i>  */}
                                    <i className="icon-plus text-light mr-1"></i>  Comments
                                    {/* <i className="fa-light fa-note-sticky"></i> */}
                                    {/* <img src={notes_icon} style={{color:"blue", height: "20px", width: "20px", float: "right", cursor: "pointer" }} alt="Notes" /> */}
                                </Button>


                                :

                                <Button
                                    color="primary"
                                    Style={{ cursor: "pointer" }}
                                    className="btn btn-primary text-light float-right" onClick={this.handleEditNotes_crm}>
                                    {/* <i className="fa fa-plus text-light" ></i>  */}
                                    <i className="fa fa-eye text-light opacity-50 mr-1" aria-hidden="true"></i>
                                    Comments
                                    {/* <i className="fa-light fa-note-sticky"></i> */}
                                    {/* <img src={notes_icon} style={{color:"blue", height: "20px", width: "20px", float: "right", cursor: "pointer" }} alt="Notes" /> */}
                                </Button>

                        }
                    </Col>
                    <Col xs='2'>
                        <Link to="/inquiry/">
                            <button className="btn btn-primary btn-block">Back to List</button>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    {this.state.leadType === 'Contact' && <Col xs="12" md="12">
                        <Card className="viewPractitionerDetails ">
                            <CardBody>
                                <Row>

                                    <Col xs="4">
                                        <FormGroup>
                                            <Label>Working area: </Label>
                                            <span className="form-control p-0" readonly>
                                                {this.state.basicInfo.workingArea}
                                            </span>


                                        </FormGroup>
                                    </Col>
                                    <Col xs="4">
                                        <FormGroup>
                                            <Label>First Name:</Label>
                                            <span className="form-control">
                                                {this.state.basicInfo.firstName}
                                            </span>
                                        </FormGroup>
                                    </Col>
                                    <Col xs="4">
                                        <FormGroup>
                                            <Label>Last Name:</Label>
                                            <span className="form-control">
                                                {this.state.basicInfo.lastName}
                                            </span>

                                        </FormGroup>
                                    </Col>
                                </Row>



                                <Row>
                                    <Col xs="4">
                                        <FormGroup>
                                            <Label>Phone Number: </Label>
                                            <span className="form-control" style={{ display: "flex", alignItems: "center" }}>
                                                {this.state.basicInfo?.phoneNumber ? <>    <i className="fa fa-mobile fa-2x my-1 " />&nbsp;
                                                    <a className='text-dark' href={`phoneto: ${this.state.basicInfo?.phoneNumber}`}>   {this.state.basicInfo?.phoneNumber && this.state.basicInfo?.phoneNumber.replace(/\D+/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}</a>
                                                </> : "Not provided"}
                                                {/* {this.state.basicInfo?.phoneNumber} */}
                                            </span>

                                        </FormGroup>
                                    </Col>
                                    <Col xs="4">
                                        <FormGroup>
                                            <Label>Email:</Label>
                                            <span className="form-control">
                                                <i className="fa fa-envelope fa-lg my-1" style={{ fontSize: "16px" }} />&nbsp; <a
                                                    className='text-dark'
                                                    href={`mailto: ${this.state.basicInfo?.email}`}
                                                >{this.state.basicInfo?.email}</a>
                                                {/* {this.state.basicInfo?.email} */}
                                            </span>

                                        </FormGroup>
                                    </Col>
                                    <Col xs="4">
                                        <FormGroup>
                                            <Label>State:</Label>
                                            <span className="form-control">

                                                {this.state.basicInfo.state}
                                            </span>

                                        </FormGroup>
                                    </Col>
                                    <Col xs="4">
                                        <FormGroup>
                                            <Label>City:</Label>
                                            <span className="form-control">

                                                {this.state.basicInfo.city}
                                            </span>

                                        </FormGroup>
                                    </Col>
                                    
                                    <Col xs="4">
                                        <FormGroup>
                                            <Label>Date:</Label>
                                            <span className="form-control">
                                                {Moment(this.state.basicInfo.createdDate).format('MM/DD/YYYY')}
                                            </span>

                                        </FormGroup>
                                    </Col>
                                    <Col xs="12">
                                        <FormGroup>
                                            <Label>Reason:</Label>
                                            <p className="">
                                                {this.state.basicInfo.reason}
                                            </p>

                                        </FormGroup>
                                    </Col>

                                </Row>



                            </CardBody>
                        </Card>
                    </Col>}
                </Row>
                <Row>
                    {this.state.leadType === 'ProviderContact' &&
                        <Col xs="12" md="12">
                            <Card className="viewPractitionerDetails ">
                                <CardBody>
                                    <Row>
                                        <Col xs="3">
                                            <FormGroup>
                                                <Label>Provider Type:</Label>
                                                <span className="form-control">
                                                    {this.state.basicInfo?.providerType}
                                                </span>

                                            </FormGroup>
                                        </Col>
                                        <Col xs="3">
                                            <FormGroup>
                                                <Label>Speciality:</Label>
                                                <span className="form-control">
                                                    {this.state.basicInfo?.speciality}
                                                </span>

                                            </FormGroup>
                                        </Col>

                                        <Col xs="3">
                                            <FormGroup>
                                                <Label>First Name:</Label>
                                                <span className="form-control">
                                                    {this.state.basicInfo?.firstName}
                                                </span>

                                            </FormGroup>
                                        </Col>
                                        <Col xs="3  ">
                                            <FormGroup>
                                                <Label>Last Name: </Label>
                                                <span className="form-control">
                                                    {this.state.basicInfo?.lastName}
                                                </span>

                                            </FormGroup>
                                        </Col>

                                        <Col xs="3">
                                            <FormGroup>
                                                <Label>Phone Number:</Label>
                                                <span className="form-control" style={{ display: "flex", alignItems: "center" }}>
                                                    {this.state.basicInfo?.phoneNumber ? <>    <i className="fa fa-mobile fa-2x my-1 " />&nbsp;
                                                        <a className='text-dark' href={`phoneto: ${this.state.basicInfo?.phoneNumber}`}>   {this.state.basicInfo?.phoneNumber && this.state.basicInfo?.phoneNumber.replace(/\D+/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}</a>
                                                    </> : "Not provided"}
                                                    {/* {this.state.basicInfo?.phoneNumber} */}
                                                </span>

                                            </FormGroup>
                                        </Col>
                                        <Col xs="3">
                                            <FormGroup>
                                                <Label>Email:</Label>
                                                <span className="form-control">
                                                    <i className="fa fa-envelope fa-lg my-1" style={{ fontSize: "16px" }} />&nbsp; <a
                                                        className='text-dark'
                                                        href={`mailto: ${this.state.basicInfo?.email}`}
                                                    >{this.state.basicInfo?.email}</a>
                                                    {/* {this.state.basicInfo?.email} */}
                                                </span>

                                            </FormGroup>
                                        </Col>

                                        <Col xs="3">
                                            <FormGroup>
                                                <Label>State:</Label>
                                                <span className="form-control">
                                                    {this.state.basicInfo?.state}
                                                </span>

                                            </FormGroup>
                                        </Col>
                                        <Col xs="3">
                                            <FormGroup>
                                                <Label>Date:</Label>
                                                <span className="form-control">
                                                    {Moment(this.state.basicInfo?.createdDate).format('MM/DD/YYYY')}
                                                </span>

                                            </FormGroup>
                                        </Col>

                                    </Row>






                                </CardBody>
                            </Card>
                        </Col>}
                </Row>
                <Row>
                    {this.state.leadType === 'SignUp' &&
                        <Col xs="12" md="12">
                            <Card className="viewPractitionerDetails ">
                                <CardBody>
                                    <Row>


                                        <Col xs="3">
                                            <FormGroup>
                                                <Label>First Name:</Label>
                                                <span className="form-control">
                                                    {this.state.basicInfo.firstName}
                                                </span>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="3">
                                            <FormGroup>
                                                <Label>Last Name:</Label>
                                                <span className="form-control">
                                                    {this.state.basicInfo.lastName}
                                                </span>

                                            </FormGroup>
                                        </Col>
                                        <Col xs="3">
                                            <FormGroup>
                                                <Label>Email:</Label>
                                                <span className="form-control">
                                                    <i className="fa fa-envelope fa-lg my-1" style={{ fontSize: "16px" }} />&nbsp; <a
                                                        className='text-dark'
                                                        href={`mailto: ${this.state.basicInfo?.email}`}
                                                    >{this.state.basicInfo?.email}</a>
                                                    {/* {this.state.basicInfo?.email} */}
                                                </span>

                                            </FormGroup>
                                        </Col>
                                        <Col xs="3">
                                            <FormGroup>
                                                <Label>Date:</Label>
                                                <span className="form-control">
                                                    {Moment(this.state.basicInfo.createdDate).format('MM/DD/YYYY')}
                                                </span>

                                            </FormGroup>
                                        </Col>
                                    </Row>






                                </CardBody>
                            </Card>
                        </Col>}
                </Row>
                <Modal isOpen={changeCcModal} className="modal-dialog modal-md">
                    <ModalHeader>Assign </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            Are you sure you want to assign this lead to <b>{ccName}</b> ?
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

                <div style={{ marginLeft: "36%" }}>
                    <Modal isOpen={this.state.DeletemodalforNoteComment_crm} style={{ width: "500px" }} >
                        <ModalHeader>Confirm</ModalHeader>
                        <ModalBody>Are you sure you want to delete this comment?</ModalBody>
                        <ModalFooter>
                            <Button outline color="danger" onClick={e => this.DeleteComment_crm(e, this.state.DeleteCommentId_crm, this.state.DeletepatientNotesId_crm)}>Delete</Button>
                            <Button color="secondary" onClick={this.toggleComment_crm.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>

            </div>

        );
    }
}

export default View;
