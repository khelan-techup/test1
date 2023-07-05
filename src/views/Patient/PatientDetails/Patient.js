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
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import Confirm from "../../CustomModal/Confirm";
import "@reach/dialog/styles.css";
import { toast } from "react-toastify";
import FilePreview from "react-file-preview-latest";
import downloadIcon from "../../../assets/download.svg";
import closeIcon from "../../../assets/x.svg";
import { Steps } from "intro.js-react";
import axiosInstance from "./../../../common/axiosInstance"
import ReactPaginate from 'react-paginate';
import { BE_CognitoMail_RegisterUser, BE_Common_GetPatientDropdownEntity, BE_DiseaseCategory_GetSubAllDRP, BE_OrganizationUser_GetByRoleId, BE_OrganizationUser_UpdateTooltipSteps, BE_PatientAccessionMapping_Delete, BE_Patient_Delete, BE_Patient_GetAllPaging, BE_Patient_SaveAccessionNo, BE_Tissue_GetDRPAllByDiseaseId, CognitoUserStore_downloadFile } from "../../../common/allApiEndPoints";

class List extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.initialState = {
      loading: true,
      openSearch: true,
      patients: [],
      diseasecategories: [],
      searchString: "",
      slDelete: true,
      diseaseName: "",
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      pageSize: window.$TotalRecord,
      authError: false,
      error: "",
      modal: false,
      modalTitle: "",
      modalBody: "",
      isView: false,
      isEdit: false,
      roleName: "",
      collapseId: 0,
      showPopup: false,
      redirect: false,
      subCatagory: false,
      preview: false,
      url: "",

      patientId: "",
      patientAccessionId: "",
      accessionNo: "",
      diseaseId: "",
      alldiseases: [],
      disease: [],
      diseaseCat: [],
      diseasesubCat: [],
      diseaseCatId: 0,
      popupdiseaseName: "",

      tissueId: "",
      allTissues: [],
      costumerCare: [],
      practitionerId: "",
      allpractitioners: [],
      paFlag: "",
      diseaseCatId: "",
      metastasis: 'no',
      errors: {
        diseaseId: "",
        tissueId: "",
        practitionerId: "",
        ccId: ""
      },
      diseaseForNonCancer: "",
      AdminUser: false,
      role_Id: null,
      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      steps: [
        {
          element: "#patientpage",
          title: 'Patient List',
          intro: "This is a comprehensive list of all patients in our system.",
          tooltipClass: "cssClassName1",
        }, {
          element: "#selectdiease",

          title: 'Select Disease',
          tooltipClass: "cssClassName1",
          intro: "Allows you to filter by Analysis Type."
        }, {
          element: "#selectcc",

          title: 'Select CC Representative',
          tooltipClass: "cssClassName1",
          intro: "Allows you to filter by Custome Care Representative."
        },
        {
          element: "#searchbar",
          title: 'Search Patients',

          tooltipClass: "cssClassName1",
          intro: "Search for patient by name, accession number, Notes field content."
        }, {
          element: "#addpatient",
          title: 'Add New Patient',
          intro: "This feature is used to place an Analysis order for a new patient, generating a unique Accession Number in our system.",
          tooltipClass: "cssClassName1",
        },

        {
          element: "#addaccetion",
          title: "Add New Accesion",
          intro: 'Place a new order for Patient.',

          tooltipClass: "cssClassName1",
        },
        {
          element: "#editdetails",
          title: 'Edit Patient Details',

          tooltipClass: "cssClassName1",
          intro: "Edit Patient Details."
        },
        {
          element: "#deletepatient ",
          title: 'Delete Entire Patient',

          tooltipClass: "cssClassName1",
          intro: "Deletes entire patient from the Portal after all orders have been deleted."
        },
        {
          element: "#viewpatient",
          title: 'View Patient Details',

          tooltipClass: "cssClassName1",
          intro: "This is the unique patient number and a hyperlink to the patient and order details."
        }, {
          element: "#deleterecord ",
          title: 'Delete Order',

          tooltipClass: "cssClassName1",
          intro: "Delete a specific order from the system, does not delete the patient."
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
      ccId: "",
      pageCountNew: 0,
      currentPageIndex: 0

    };
    this.state = this.initialState;
  }
  onExit = (e) => {
    console.log(e)
    this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 10 }));
    // localStorage.setItem("isFirstLogin", false);
    // this.sendCurrentStep()

  };

  onAfterChange = newStepIndex => {
    if (newStepIndex === 4) {
      const element = document.querySelector('#addpatient')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 6) {
      const element = document.querySelector('#editdetails')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 5) {
      const element = document.querySelector('#addaccetion')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 7) {
      const element = document.querySelector('#deletepatient')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 8) {
      const element = document.querySelector('#viewpatient')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 9) {
      const element = document.querySelector('#deleterecord')

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
          //pageSize: 10,
          searchString: "",
        }),
        function () {
          this.getListData(0);
        }
      );
    }
  };

  //modal close button event
  handleModalClose = () => {
    this.setState({
      modal: false,
      modalTitle: "",
      modalBody: "",
    });
  };

  //load event
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    var rights = userToken.roleModule;
    // console.log(userToken.userType);
    if (userToken.roleId == 4 || userToken.roleId == 1) {

      this.setState({
        AdminUser: true
      })
    }

    this.setState({ roleName: userToken.roleName, role_Id: userToken.roleId });

    //console.log(rights);
    if (rights?.length > 0) {
      let currentrights = rights.filter((role) =>
        role.moduleId == 3
      );
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited,
        });
        if (currentrights[0].isViewed) {
          this.getListData(0);
          this.getCostumerCareData()
          // this.getCostumerCareData()
        } else {
          this.setState({ loading: false });
        }
      } else {
        this.setState({ loading: false });
      }
    } else {
      this.setState({ loading: false });
    }
    this.getDrpData();
  }

  //get data
  getListData(pageNo) {
    // debugger;
    this.setState({ loading: true })
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId == null ? 0 : userToken.userId;
    let isFirstLogin = JSON.parse(localStorage.getItem("isFirstLogin"));
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Patient/GetAllPaging";
    const url = apiroute + BE_Patient_GetAllPaging
    // console.log("ccId",this.state.organizationUserId)
    // console.log("ccId", this.state.ccId)
    // console.log(this.state.costumerCare.filter((d) => d.userId == this.state.ccId)[0]?.fullName)
    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      diseaseName: this.state.diseaseName,
      // ccName: this.state.costumerCare.filter((d) => d.userId == this.state.ccId)[0]?.fullName ?? "",
      ccName: this.state.ccId ?? "",
      searchString: this.state.searchString,
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
          // console.log(result.data.outdata);
          this.setState({
            pagesCount: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            pageCountNew: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            patients: result.data.outdata,
            loading: false,
            stepsEnabled: isFirstLogin,
            // ccId:""
          });
        }
        //else {
        //  console.log(result.data.message);
        //},
        else {
          this.setState({ loading: false });
        }

      })
      .catch((error) => {
        // console.log(error);
        this.setState({ authError: true, error: error, loading: false });
      });
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
  getDrpData() {
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
          let diseaseCatObj = result.data.outdata.diseaseCatData.filter(
            (category) =>
              category.diseaseCategoryName.toLowerCase() !== "cancer" ||
              category.diseaseCategoryName.toLowerCase() !==
              "complete health score"
          );

          this.setState({
            alldiseases: result.data.outdata.diseaseData,
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

  }
  dsubhandleChange = (e) => {
    const target = e.target;
    const value = target.value;

    // console.log(value);
    this.setState(
      () => ({
        loading: true,
        currentPage: 0,
        currentIndex: 0,
        pagesCount: 0,
        //pageSize: 10,
        diseaseName: value,
      }),
      function () {
        // debugger;
        this.getListData(0);


      }
    );
  };

  getsubDrpData(id) {

    const apiroute = window.$APIPath;
    // console.log(id);
    //    if (id != "") {
    // const url = apiroute + "/api/BE_DiseaseCategory/GetSubAllDRP?id=" + id + "";
    const url = apiroute + BE_DiseaseCategory_GetSubAllDRP(id)

    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log(result);

        if (result.data.flag) {

          if (result.data.outdata.length != 0) {
            this.setState(() => ({
              loading: true,
              currentPage: 0,
              currentIndex: 0,
              pagesCount: 0,
              diseasesubCat: result.data.outdata,
              diseaseName: String(result.data.outdata[0].diseaseCategoryId),
            }
            ), function () { this.getListData(0) });
          } else {
            this.getListData(0)
          }
          // console.log(this.state.diseasesubCat[0].diseaseCategoryId);
          // this.getListData(0);
        } else {

          this.setState({ loading: false }, function () { return this.getListData(0); });
        }

      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });

    //   }
  }

  //pagination
  handleClick(e, index, currIndex) {
    e.preventDefault();
    this.setState({ loading: true });
    var pgcount = this.state.pagesCount - 1;
    var pgCurr = index >= pgcount ? pgcount : index;
    this.setState(
      {
        currentPage: pgCurr,
        currentIndex: currIndex,
      },
      function () {
        this.getListData(pgCurr);
      }
    );
  }

  // handleClick_Next(e, index, currIndex) {
  //   e.preventDefault();
  //   this.setState({ loading: true });
  //   var pgcount = this.state.pagesCount - 1;
  //   var pgCurr = index >= pgcount ? pgcount : index;
  //   this.setState(
  //     {
  //       currentPage: pgCurr,
  //       currentIndex: currIndex,
  //     },
  //     function () {
  //       this.getListData(pgCurr);
  //     }
  //   );
  // }
  // handleClick_Prev(e, index, currIndex) {
  //   e.preventDefault();
  //   this.setState({ loading: true });
  //   var pgcount = this.state.pagesCount - 1;
  //   var pgCurr = index >= pgcount ? pgcount : index;
  //   this.setState(
  //     {
  //       currentPage: pgCurr,
  //       currentIndex: currIndex,
  //     },
  //     function () {
  //       this.getListData(pgCurr);
  //     }
  //   );
  // }
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
          //pageSize: 10,
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
        //pageSize: 10,
        slDelete: JSON.parse(value),
      }),
      function () {
        debugger;
        this.getListData(0);
      }
    );
  };

  dhandleChange = (e) => {
    const target = e.target;
    const value = target.value;

    // console.log(value);
    if (value == "") {
      this.setState(() => ({
        loading: false, currentPage: 0,
        currentIndex: 0,
        pagesCount: 0,
        diseasesubCat: [],
        //pageSize: 10,
        diseaseName: value,
      }), () => {
        this.getListData(0);
      })
    }
    else {
      this.setState(
        () => ({
          loading: true,
          currentPage: 0,
          currentIndex: 0,
          pagesCount: 0,
          diseasesubCat: [],
          //pageSize: 10,
          diseaseName: value,
        }),
        function () {
          // debugger;
          this.getsubDrpData(value);
        });
    }
  };

  //delete(active/inactive) button click
  deleteRow = (e, id, PuserId) => {
    //e.preventDefault();
    //const curremployees = this.state.employees;
    let patientLength = this.state.patients.filter((data) => data.patientId == id)
    // console.log("patientLength",patientLength.length)
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      // apiroute + "/api/BE_Patient/Delete?id=" + id + "&userId=" + PuserId + "&deletedBy=" + userId + "";
      apiroute + BE_Patient_Delete(id, PuserId, userId)

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
            () => {
              this.getListData(this.state.currentPageIndex);
            }
          );
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
        } else {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false,
          });
          toast.error(result.data.message);
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
        this.setState({ authError: true, error: error, loading: false });
      });
  };

  ///delete (active/inactive) accession No click
  deleteAccessRow = (e, patientId, pAcceId) => {
    debugger;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      // apiroute + "/api/BE_PatientAccessionMapping/Delete?patientId=" + patientId + "&pAcceId=" + pAcceId + "&deletedBy=" + userId + "";
      apiroute + BE_PatientAccessionMapping_Delete(patientId, pAcceId, userId)



    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result?.data?.flag) {
          this.setState(
            {
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message
            },
            () => {
              this.getListData(this.state.currentPageIndex);
            }
          );
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
        } else {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false,
          });
          toast.error(result.data.message);
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
        this.setState({ authError: true, error: error, loading: false });
      });
  };

  //welcome mail button click
  sendMail(e, id) {
    debugger;
    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      // apiroute + "/api/BE_CognitoMail/RegisterUser?id=" + id + "&uid=" + userId + "";
      apiroute + BE_CognitoMail_RegisterUser(id, userId)


    axiosInstance
      .post(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          this.getListData(0);
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            loading: false,
          });
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
        } else {
          this.getListData(0);
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            loading: false,
          });
          toast.success(result.data.message);
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
        this.setState({ authError: true, error: error });
      });
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
  }

  setCollapse(cid) {
    let currentCid = this.state.collapseId;
    if (currentCid == cid) {
      this.setState({ collapseId: -1 });
    } else {
      this.setState({ collapseId: cid });
    }
  }

  //Accession No modal functions
  handleClosePopup = () => {
    this.setState({
      patientId: "",
      patientAccessionId: "",
      accessionNo: "",
      diseaseId: "",
      tissueId: "",
      practitionerId: "",
      diseaseName: "Cancer Patients",
      showPopup: false,
      errors: {
        diseaseId: "",
        tissueId: "",
        practitionerId: "",

      }
    });
  };
  handleInputChange(event) {

    const target = event.target;
    let value = target.value;
    const name = target.name;
    //console.log(value);

    if (name === 'email') {
      value = String(value).toLowerCase()
    }

    // alert(`${ name } - ${ value } `)
    this.setState({
      [name]: value,
    });
    if (name == "ccId") {
      this.setState({
        [name]: value,
      }, () => {
        this.getListData(0);
      });

      // console.log(`value`, target);
    }
  }
  handleShowPopup = (pid, paid, ano, pracid, did, tid, dCatId, fg) => {
    let dcid = 0;
    let dcname = "";
    let currentdisease = [];

    if (fg == "a") {
      if (this.state.diseaseCat.length > 0) {
        dcid = this.state.diseaseCat[0].diseaseCategoryId;
        dcname = this.state.diseaseCat[0].diseaseCategoryName;
        currentdisease = this.state.alldiseases.filter(
          (ds) => ds.diseaseCatId == dcid
        );
      }
    } else {
      dcid = dCatId;
      let diseaseCat = this.state.diseaseCat.filter(
        (dl) => dl.diseaseCategoryId == dCatId
      );
      dcname = diseaseCat[0].diseaseCategoryName;
      currentdisease = this.state.alldiseases.filter(
        (ds) => ds.diseaseCatId == dCatId
      );
    }

    //let dname = "cancer";
    //if (did != 0) {
    //  let disease = this.state.alldiseases.filter(dl => dl.id == did);
    //  if (disease[0].name.toLowerCase() == 'complete health score') {
    //    dname = "Complete Health Score";
    //  }
    //}

    this.setState(
      {
        diseaseCatId: dcid,
        popupdiseaseName: dcname,
        disease: currentdisease,

        patientId: pid,
        patientAccessionId: paid,
        accessionNo: ano,
        diseaseId: did,
        tissueId: tid,
        practitionerId: pracid,
        //diseaseName: dname,
        showPopup: true,
        paFlag: fg,
      },
      () => {
        if (did != 0) {
          this.getTissueData(did, tid);
        }
      }
    );
  };

  handlePopupInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;

    if (name == "diseaseCatId") {
      let currentdiseasecat = this.state.diseaseCat.filter(
        (ds) => ds.diseaseCategoryId == value
      );
      if (currentdiseasecat.length > 0) {
        this.setState({
          popupdiseaseName: currentdiseasecat[0].diseaseCategoryName,
        });
      }
    }

    switch (name) {
      case "diseaseId":
        errors.diseaseId = !value
          ? this.state.diseaseName.toLowerCase() == "cancer"
            ? "Please select disease."
            : ""
          : "";
        break;
      case "tissueId":
        errors.tissueId = !value
          ? this.state.diseaseName.toLowerCase() == "cancer"
            ? "Please select tissue."
            : ""
          : "";
        break;
      case "practitionerId":
        errors.practitionerId = !value ? "Please select practitioner." : "";
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => {
      if (name == "diseaseId") {
        if (value != "") {
          this.setState({ allTissues: [], Tissue: "" });
          this.getTissueData(value, "");
        } else {
          this.setState({ allTissues: [], Tissue: "" });
        }
      }
      if (name == "diseaseCatId") {
        debugger;
        this.setState({ disease: [], diseaseId: "" });
        if (value != "") {
          let currentdisease = this.state.alldiseases.filter(
            (ds) => ds.diseaseCatId == value
          );
          if (currentdisease.length > 0) {
            this.setState({ disease: currentdisease });
          }
        }
      }
    });
  }

  getTissueData(DiseaseId, TissueId) {
    const apiroute = window.$APIPath;

    // const url = apiroute + "/api/BE_Tissue/GetDRPAllByDiseaseId";
    const url = apiroute + BE_Tissue_GetDRPAllByDiseaseId

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
          this.setState({ allTissues: result.data.outdata, Tissue: TissueId });
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.practitionerId == null || this.state.practitionerId == "") {
      errors.practitionerId = "Please select practitioner.";
    }
    if (this.state.popupdiseaseName.toLowerCase() == "cancer") {
      if (this.state.diseaseId == null || this.state.diseaseId == "") {
        errors.diseaseId = "Please select disease.";
      }
      if (this.state.tissueId == null || this.state.tissueId == "") {
        errors.tissueId = "Please select tissue.";
      }
    }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  };

  AddPatientAccessionNo(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      // let url = apiroute + "/api/BE_Patient/SaveAccessionNo";
      let url = apiroute + BE_Patient_SaveAccessionNo

      var did = 0;
      //if (this.state.popupdiseaseName.toLowerCase() == 'complete health score') {
      //  let diseases = this.state.alldiseases.filter(dl => dl.name.toLowerCase() == 'healthindex');
      //  console.log(diseases);
      //  if (diseases) {
      //    did = diseases[0].id;
      //    //alert(did);
      //  }
      //} else {
      //  did = parseInt(this.state.diseaseId);
      //}

      if (this.state.popupdiseaseName.toLowerCase() != "cancer") {
        let currentdisease = this.state.alldiseases.filter(
          (ds) => ds.diseaseCatId == parseInt(this.state.diseaseCatId)
        );
        did = currentdisease[0]?.id;
      } else {
        did = parseInt(this.state.diseaseId);
      }

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        DiseaseCategoryId: parseInt(this.state.diseaseCatId),
        DiseaseId: parseInt(did),
        PatientAccessionId: parseInt(this.state.patientAccessionId),
        TissueId: parseInt(this.state.tissueId),
        PractionerId: parseInt(this.state.practitionerId),
        createdBy: uid,
        paFlag: this.state.paFlag,
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
              () => ({
                // modal: !this.state.modal,
                // modalTitle: 'Success',
                // modalBody: result.data.message,
                loading: false,
                showPopup: false,
                patientId: "",
                patientAccessionId: "",
                accessionNo: "",
                diseaseId: "",
                tissueId: "",
                practitionerId: "",
                diseaseCatId: "",
                disease: [],
                popupdiseaseName: "",
              }),
              function () {
                debugger;
                this.getListData(0);
              }
            );
            toast.success(result.data.message);
          } else {
            this.setState({
              // modal: !this.state.modal,
              // modalTitle: 'Error',
              // modalBody: result.data.message,
              loading: false,
            });
            toast.error(result.data.message);
          }
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
        });
    } else {
      this.setState({ loading: false });
    }
  }
  //ends show hide model

  //download
  DownloadFile(e, filepath) {
    //alert(filename);
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    axiosInstance({
      url:
        // apiroute + "/api/CognitoUserStore/downloadFile?fileName=" + filepath + "",
        apiroute + CognitoUserStore_downloadFile(filepath),
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

  //file preview
  previewToggle(e, file) {
    this.setState({
      preview: !this.state.preview,
      url: window.$FileUrl + file,
    });
  }

  handlePageClick = (e) => {
    console.log("datra", e.selected)
    let currentPage = e.selected;
    this.setState({
      currentPageIndex: currentPage
    })
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
      roleName,
      collapse,
      collapseId,
      showPopup,
      patientId,
      patientAccessionId,
      accessionNo,
      diseaseId,
      tissueId,
      practitionerId,
      allpractitioners,
      alldiseases,
      allTissues,
      errors,
      diseaseName,
      preview,
      url,
      diseaseCat,
      diseaseCatId,
      diseasecategories,
      disease,
      popupdiseaseName,
      costumerCare,
      AdminUser
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
            <h5 className="mt-2" id="patientpage" style={{ width: "fit-content" }}>
              <i className="fa fa-align-justify"></i> Patient List
            </h5>
          </Col>
          <Col xs="2" lg="2">
            {this.state.isEdit ? (
              <Link to="/patients/details" id="addpatient">
                <button className="btn btn-primary btn-block">
                  Add New Patient
                </button>
              </Link>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  {/* <Col xs="2">
                    <Input
                      type="select"
                      name="slDelete"
                      onChange={this.handleChange}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Input>
                  </Col> */}
                  <Col xs="3">
                    <Input
                      type="select"
                      name="diseaseName"
                      onChange={this.dhandleChange.bind(this)}
                      id="selectdiease"
                    >
                      <option value="" >All</option>
                      {/* {console.log("diseasecategories", diseasecategories)} */}
                      {diseasecategories.map((data, i) => {
                        return (
                          <option key={i} value={data.diseaseCategoryId}>
                            {data.diseaseCategoryName}
                          </option>
                        );
                      })}
                    </Input>
                  </Col>
                  <Col xs="3">
                    <Input
                      type="select"
                      name="diseaseName"
                      placeholder="Select sub Category"
                      style={{ display: this.state.diseasesubCat.length > 0 ? 'block' : 'none' }}
                      onChange={this.dsubhandleChange}
                    >
                      <option disabled={this.state?.diseaseName} >Select sub Category</option>
                      {/* {console.log("diseasecategories", diseasecategories)} */}
                      {this?.state?.diseasesubCat?.map((data, i) => {
                        return (
                          <option key={i} value={data.diseaseCategoryId} selected={this.state?.diseaseName == data.diseaseCategoryId}>
                            {data.diseaseCategoryName}
                          </option>
                        );
                      })}
                    </Input>
                  </Col>
                  <Col xs="3">

                    <Input
                      id="selectcc"
                      type="select"
                      // className={errors.ccId
                      //   ? "custom-select is-invalid"
                      //   : "custom-select is-valid"}
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
                    </Input></Col>
                  <Col xs="3">
                    {this.state.openSearch ? (
                      <div className="searchBox">
                        <input
                          id="searchbar"
                          type="text"
                          placeholder="Search..."
                          onKeyPress={this.filter}
                        />
                        <Link
                          className="closeSearch"
                          to="#"
                          onClick={this.closeSearch}
                        >
                          <i className="fa fa-close" />
                        </Link>
                      </div>
                    ) : (
                      <div
                        className="search"
                        onClick={() => this.setState({ openSearch: true })}
                      >
                        <i className="fa fa-search" />
                      </div>
                    )}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {authError ? <p>{error.message}</p> : null}
                {patients.length > 0 ? (
                  patients.map((data, i) => {
                    // console.log({ data });
                    return (
                      <Col
                        key={i}
                        xs="12"
                        sm="12"
                        md="12"
                        style={{ fontSize: "0.72rem", "margin-top": "20px ", }}
                      >
                        <Card style={{ border: "1px solid #1C3A84" }}>
                          <CardHeader
                            style={{
                              backgroundColor: data?.patientAccessionMappings.filter((d) => d.accessionRedFlag == true).length > 0 ? "#d05656" : "#1C3A84",
                              // backgroundColor: "red",
                              color: "white",
                            }}
                          >
                            <Row
                              style={{ fontSize: "16px", }}
                              key={i}
                              onClick={() => this.setCollapse(i)}
                            >
                              <Col md="6">
                                <b>
                                  {
                                    <React.Fragment>
                                      {/* <span>
                                        {data.firstName +
                                          " " +
                                          (data.middleName != null &&
                                            data.middleName != ""
                                            ? data.middleName + " "
                                            : "") +
                                          data.lastName}
                                      </span> */}
                                      <span>
                                        {
                                          (!!(data?.displayName))
                                            ? (data?.displayName) : (data.firstName +
                                              " " +
                                              (data.middleName != null &&
                                                data.middleName != ""
                                                ? data.middleName + " "
                                                : "") +
                                              data.lastName)
                                        }
                                        {
                                          (
                                            data.displayStatus == "Open" ||
                                            data.displayStatus == "On Hold" ||
                                            data.displayStatus == "Complete" ||
                                            data.displayStatus == "Cancelled" ||
                                            data.displayStatus == "Deceased"
                                          )
                                            ? <span className="ml-2 h6"
                                              style={
                                                {
                                                  color: data.displayStatus == "Open" ? "white" :
                                                    (data.displayStatus == "On Hold" ? "white" :
                                                      (data.displayStatus == "Complete" ? "white" :
                                                        (data.displayStatus == "Cancelled" ? "white" :
                                                          (data.displayStatus == "Deceased" ? "white" : ""))))
                                                }
                                              }
                                            >
                                              {/* {
                                                console.log(Object.values( data?.patientAccessionMappings?.filter((fData) => {
                                                  return fData?.accessionStatus == "Active"
                                                })
                                                )[0])
                                              } */}
                                              {
                                                // data?.patientAccessionMappings.filter((d) => d.accessionStatus != "Active")?.length > 0 ?
                                                false ?
                                                  <>
                                                    {"( "}


                                                    {/* {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Active"
                                                      })[0]?.accessionStatus
                                                    } */}
                                                    {" "}
                                                    {/* {
                                                      console.log(
                                                        Array.from(new Set(data?.patientAccessionMappings?.filter((fData) => {
                                                          return fData?.accessionStatus != "Active"
                                                        }).map((d) => d.accessionStatus)))
                                                      )
                                                    } */}
                                                    {
                                                      Array.from(new Set(data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus != "Open"
                                                      }).map((d) => d.accessionStatus))).map((s, i) => {
                                                        return <span>{s}{
                                                          Array.from(new Set(data?.patientAccessionMappings?.filter((fData) => {
                                                            return fData?.accessionStatus != "Open"
                                                          }).map((d) => d.accessionStatus))).length - 1 == i
                                                            ? "" : ", "}</span>
                                                      })

                                                    }
                                                    {/* {


                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Complete"
                                                      })[0]?.accessionStatus}
                                                    {" "}

                                                    {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "On Hold"
                                                      })[0]?.accessionStatus
                                                    }
                                                    {" "}

                                                    {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Cancelled"
                                                      })[0]?.accessionStatus
                                                    }
                                                    {" "}
                                                    {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Deceased"
                                                      })[0]?.accessionStatus
                                                    } */}
                                                    {" )"}


                                                  </>
                                                  : ""
                                              }

                                            </span> : ""
                                        }
                                      </span>
                                      <div>
                                        <small>

                                          {/* {data?.isRedFlag && data?.redMessage} */}
                                        </small>
                                      </div>
                                    </React.Fragment>
                                  }
                                </b>
                              </Col>
                              <Col md="6" style={{ "text-align": "right" }}>
                                {this.state.isEdit ? (
                                  <Col>

                                    {data.isGenerateNewAccession || data.patientAccessionMappings.length == 0 ? (
                                      <React.Fragment>
                                        <Link
                                          id="addaccetion"
                                          to={{ pathname: `/patientsDetails/addaccesion/${data.patientId}/${data?.patientAccessionMappings[data?.patientAccessionMappings?.length - 1]?.patientAccessionId}`, state: { newAccesion: true, accessionNo: String(data?.patientAccessionMappings[data?.patientAccessionMappings?.length - 1]?.accessionNo).replaceAll("-", "") } }}
                                          style={{
                                            "text-align": "right",
                                            backgroundColor: "#1A73E8",
                                          }}
                                          title="Add New Accession No"
                                          className="btn btn-primary btn-pill"
                                        // onClick={() => {

                                        //   // this.handleShowPopup(
                                        //   //   data.patientId,
                                        //   //   0,
                                        //   //   "",
                                        //   //   0,
                                        //   //   0,
                                        //   //   0,
                                        //   //   0,
                                        //   //   "a"
                                        //   // )
                                        // }}
                                        >
                                          <i className="icon-plus"></i>
                                        </Link>
                                        {"   "}
                                      </React.Fragment>
                                    ) : null}
                                    {/* {Array.isArray(
                                      data.patientAccessionMappings
                                    ) &&
                                      data.patientAccessionMappings?.length &&
                                      data.patientAccessionMappings[0].patientAccessionId !== 0 ? "" : (
                                      <>
                                        <Link
                                          className="btn btn-primary btn-pill mr-1"
                                          style={{ backgroundColor: "#1A73E8" }}
                                          to={`/patients/info/${data.patientId
                                            }/0`}
                                        >
                                          view
                                        </Link>
                                      </>
                                    )} */}

                                    <Link
                                      className="btn btn-primary btn-pill"
                                      style={{ backgroundColor: "#1A73E8" }}
                                      to={"/patients/modify/" + data.patientId}
                                      id="editdetails"

                                    >
                                      <i className="icon-pencil"></i>
                                    </Link>

                                    {"   "}
                                    {

                                    }
                                    {data.isActive ? (
                                      <Confirm
                                        title="Confirm"
                                        description="Are you sure you want to permanently delete this Patient?"
                                      >
                                        {/* data.isRedFlag */}
                                        {(confirm) => (
                                          <Button
                                            id="deletepatient"
                                            className={`btn btn-danger btn-sm btn-pill`} to="#"
                                            style={{ backgroundColor: data.isRedFlag ? "#1A73E8" : "#d05656" }}
                                            onClick={confirm((e) =>
                                              this.deleteRow(e, data.patientId, data.userId)
                                            )}
                                            disabled={data.patientAccessionMappings.length !== 0}

                                          >
                                            <i className="icon-trash"></i>
                                          </Button>
                                        )}
                                      </Confirm>
                                    ) : (
                                      <Confirm
                                        title="Confirm"
                                        description="Are you sure want to recover this patient?"
                                      >
                                        {(confirm) => (
                                          <Link
                                            className="btn btn-danger btn-sm btn-pill"
                                            to="#"
                                            onClick={confirm((e) =>
                                              this.deleteRow(e, data.patientId)
                                            )}
                                          >
                                            <b>Recover</b>
                                          </Link>
                                        )}
                                      </Confirm>
                                    )}
                                  </Col>
                                ) : null}
                              </Col>

                            </Row>
                          </CardHeader>

                          <Fade
                            timeout={this.state.timeout}
                            in={this.state.fadeIn}
                          >
                            <Collapse
                              isOpen={i == collapseId}
                              id="collapseExample"
                            >
                              <CardBody>
                                <Row>
                                  <Table responsive bordered>
                                    <thead className="thead-light">
                                      <tr>
                                        <th className="w-25">Accession No</th>
                                        <th>
                                          Practitioner Institution
                                        </th>
                                        <th>Neo7 Analysis Type</th>
                                        <th>Order Date</th>

                                        {this.state.isEdit ? (
                                          <th>Action</th>
                                        ) : null}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* {
                                        console.log("data.patientAccessionMappings", data.patientAccessionMappings.length)
                                      } */}
                                      {data.patientAccessionMappings.filter((data) => data.diseaseCategoryId == diseaseName || diseaseName === "").map(
                                        (adata, index) => (
                                          <tr key={index}>
                                            <td>
                                              {/*{adata.accessionNo}*/}
                                              {adata.patientAccessionId ?
                                                <>
                                                  <Link
                                                    className="anchorAccessNo"
                                                    id="viewpatient"
                                                    to={
                                                      (
                                                        // AdminUser || this.state.role_Id == 5 
                                                        (this.state.role_Id == 5 || this.state.role_Id == 1 || this.state.role_Id == 4)
                                                          ? "/patients/admininfo/" : "/patients/info/")
                                                      // "/patients/info/" +
                                                      // "/patients/admininfo/" 
                                                      +
                                                      data.patientId +
                                                      "/" +
                                                      adata.patientAccessionId
                                                    }
                                                  >
                                                    <b>
                                                      {adata.accessionNo != null
                                                        ? adata.accessionNo.replace(
                                                          /-/g,
                                                          ""
                                                        )
                                                        : ""}
                                                    </b>
                                                  </Link>
                                                  {" "}
                                                  <b>
                                                    {adata.accessionNo != null
                                                      ? ` (${adata?.accessionStatus})`
                                                      : ""} &nbsp;
                                                    <i class="fa fa-envelope" title={`email notification ${adata?.isEmailNotification ? "enabled" : "disabled"}`} style={{ color: adata?.isEmailNotification ? "green" : "red" }} aria-hidden="true"></i>
                                                  </b>
                                                  {
                                                    !!adata?.accessionRedMessage ? <div className="mt-1 d-flex flex-column">
                                                      {
                                                        adata?.accessionRedMessage.split(",").map((Data) => {
                                                          return <>
                                                            <div style={{ borderRadius: "" }} className="bg-danger pl-3 py-0 my-1 btn btn-danger btn-sm btn-pill text-left ">
                                                              {
                                                                Data
                                                              }

                                                            </div>
                                                          </>
                                                        })
                                                      }


                                                    </div> : ""
                                                  }


                                                </>
                                                :
                                                // <Link
                                                //   className="anchorAccessNo"

                                                //   to={`/patients/info/${data.patientId
                                                //     }/0`}
                                                // >
                                                <b>Not Available</b>
                                                // {/* </Link> */}
                                              }
                                            </td>
                                            <td>
                                              {adata.practionerName}
                                              <br /> {adata.institutionName}
                                            </td>

                                            <td>
                                              {adata.diseaseName != null &&
                                                adata.diseaseName != ""
                                                ? !(['2', '3', '4'].includes(String(adata.diseaseCategoryId)))
                                                  ?
                                                  adata.diseaseCategory : adata.diseaseCategory + ` - ` + adata.diseaseName
                                                : adata.diseaseCategory}{adata.tissue != null ? `  (${adata.tissue})` : " "}
                                              <br />
                                              {/* {adata.diseaseCode != null &&
                                                adata.diseaseCode != ""
                                                ? "(" + adata.diseaseCode + ")"
                                                : ""} */}
                                            </td>
                                            <td>
                                              {adata?.orderCreatedDate}
                                            </td>
                                            {/* <td>

                                            </td> */}
                                            {this.state.isEdit ? (
                                              <td>
                                                <Col className="m-0 p-0">
                                                  {/* <Link
                                                    className="btn btn-primary btn-sm btn-pill"
                                                    onClick={() =>
                                                      this.handleShowPopup(
                                                        adata.patientId,
                                                        adata.patientAccessionId,
                                                        adata.accessionNo,
                                                        adata.practitionerId,
                                                        adata.diseaseID,
                                                        adata.tissueId,
                                                        adata.diseaseCategoryId,
                                                        "e"
                                                      )
                                                    }
                                                  >
                                                    <b>Edit</b>
                                                  </Link> */}
                                                  {/* {"   "} */}
                                                  {adata.patientAccessionId !=
                                                    0 ? (
                                                    adata.isActive ? (
                                                      <Confirm

                                                        title="Confirm"
                                                        description="Are you sure you want to permanently delete this accession record ?"
                                                      >
                                                        {(confirm) => (
                                                          <Link
                                                            id="deleterecord"
                                                            className="btn btn-danger btn-sm btn-pill"
                                                            to="#"
                                                            onClick={confirm(
                                                              (e) =>
                                                                this.deleteAccessRow(
                                                                  e,
                                                                  adata.patientId,
                                                                  adata.patientAccessionId
                                                                )
                                                            )}
                                                          ><b>Delete</b>
                                                          </Link>
                                                        )}
                                                      </Confirm>
                                                    ) : (
                                                      <Confirm
                                                        title="Confirm"
                                                        description="Are you sure want to recover this accession record ?"
                                                      >
                                                        {(confirm) => (
                                                          <Link
                                                            className="btn btn-danger btn-sm btn-pill"
                                                            to="#"
                                                            onClick={confirm(
                                                              (e) =>
                                                                this.deleteAccessRow(
                                                                  e,
                                                                  adata.patientId,
                                                                  adata.patientAccessionId
                                                                )
                                                            )}
                                                          >
                                                            <b>Recover</b>
                                                          </Link>
                                                        )}
                                                      </Confirm>
                                                    )
                                                  ) : null}
                                                  {"   "}
                                                  {/* {adata.patientAccessionId !=
                                                  0 ? (
                                                    <Link
                                                      to={{
                                                        pathname:
                                                          adata.diseaseName ===
                                                          "HealthIndex"
                                                            ? "/patientactivity/designactivities/patienthealthindexreportdetail/" +
                                                              adata.patientId +
                                                              "/" +
                                                              adata.patientAccessionId +
                                                              "/" +
                                                              adata.designActivityId
                                                            : "/patientactivity/designactivities/report/" +
                                                              adata.patientId +
                                                              "/" +
                                                              adata.patientAccessionId +
                                                              "/" +
                                                              adata.designActivityId,
                                                        state: {
                                                          patient: true,
                                                        },
                                                      }}
                                                      className="btn btn-info btn-sm btn-pill"
                                                      style={{
                                                        marginRight: "5px",
                                                      }}
                                                    >
                                                      Generate Report
                                                    </Link>
                                                  ) : null} */}
                                                  {/* {adata.healthIndexFilePath !=
                                                    "" &&
                                                    adata.healthIndexFilePath !=
                                                    null ? (
                                                    <React.Fragment>
                                                      <br />
                                                      <br />
                                                      <a
                                                        style={{
                                                          cursor: "pointer",
                                                          color: "#1C3A84",
                                                          marginRight: "8px",
                                                        }}
                                                        onClick={(e) =>
                                                          this.previewToggle(
                                                            e,
                                                            adata.healthIndexFilePath
                                                          )
                                                        }
                                                      >
                                                        <b>
                                                          <i class="fa fa-download"></i>{" "}
                                                          View Report
                                                        </b>
                                                      </a>
                                                    </React.Fragment>
                                                  ) : null}
                                                  {(adata.patientReport != "" &&
                                                    adata.patientReport !=
                                                    null) ||
                                                    (adata.pmrFilePath != "" &&
                                                      adata.pmrFilePath !=
                                                      null) ? (
                                                    <React.Fragment>
                                                      <br />
                                                      <br />
                                                      {adata.patientReport !=
                                                        "" ? (
                                                        <a
                                                          style={{
                                                            cursor: "pointer",
                                                            color: "#1C3A84",
                                                            marginRight: "8px",
                                                            display: adata.patientReport ? 'block' : 'none',
                                                          }}
                                                          onClick={(e) =>
                                                            this.previewToggle(
                                                              e,
                                                              adata.patientReport
                                                            )
                                                          }
                                                        >
                                                          <b>
                                                            <i class="fa fa-download"></i>{" "}
                                                            View Patient Report
                                                          </b>
                                                        </a>
                                                      ) : null}
                                                      {adata.pmrFilePath !=
                                                        "" ? (
                                                        <a
                                                          style={{
                                                            cursor: "pointer",
                                                            color: "#1C3A84",
                                                            display: adata.pmrFilePath ? 'block' : 'none'
                                                          }}
                                                          onClick={(e) =>
                                                            this.previewToggle(
                                                              e,
                                                              adata.pmrFilePath
                                                            )
                                                          }
                                                        >
                                                          <b>
                                                            <i class="fa fa-download"></i>{" "}
                                                            View PMR
                                                          </b>
                                                        </a>
                                                      ) : null}
                                                    </React.Fragment>
                                                  ) : null} */}
                                                </Col>
                                              </td>
                                            ) : null}
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </Table>
                                </Row>
                              </CardBody>

                            </Collapse>
                          </Fade>
                        </Card>
                      </Col>
                    );
                  })
                ) : (
                  <span
                    style={{ "text-align": "center", "margin-top": "20px" }}
                  >
                    <b>No record(s) to show !!!</b>
                  </span>
                )}

                {/* <Pagination
                  aria-label="Page navigation example"
                  className="customPagination"
                >
                  <PaginationItem disabled={currentIndex == 0}>
                    <PaginationLink
                      onClick={(e) =>
                        this.handleClick(e,
                          Math.floor((currentPage - 5) / 5) * 5,
                          Math.floor((currentIndex - 5) / 5) * 5
                        )
                      }
                      previous
                      href="#"
                    >
                      Prev
                    </PaginationLink>
                  </PaginationItem>
                 
                  {[...Array(pagesCount)]
                    .slice(currentIndex, currentIndex + 5)
                    .map((page, i) => (
                      <PaginationItem
                        active={currentIndex + i === currentPage}
                        key={currentIndex + i}
                      >
                        <PaginationLink
                          onClick={(e) =>
                            this.handleClick(e, currentIndex + i, currentIndex)
                          }
                          href="#"
                        >

                          {currentIndex + i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  <PaginationItem
                    disabled={currentIndex + 5 >= pagesCount}
                  >
                    <PaginationLink
                      onClick={(e) =>
                      

                        this.handleClick(e,
                          Math.floor((currentPage + 5) / 5) * 5,
                          Math.floor((currentIndex + 5) / 5) * 5
                        )
                      }
                      next
                      href="#"
                    >
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
                  pageClassName={"page-item custom-page-link"}
                  pageLinkClassName={"page-link "}
                  previousClassName={"page-item "}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  activeClassName={"active"}

                />
              </CardBody>

              <Modal isOpen={showPopup} className="modal-dialog modal-md left-modal" >
                <ModalHeader>
                  {accessionNo != null && accessionNo != ""
                    ? accessionNo
                    : "Add Details For New Accession"}
                </ModalHeader>
                <ModalBody className="modal-body_left_modal">
                  <div className="form-group">
                    <label
                      htmlFor="recipient-name"
                      className="form-control-label"
                    >
                      Type
                    </label>




                    {diseaseCat.map((data, i) => {
                      return (
                        <div key={i} className="custom-control custom-radio">
                          {data.diseaseCategoryId == diseaseCatId ? (
                            <>
                              <Input
                                type="radio"
                                checked
                                className="custom-control-input"
                                value={data.diseaseCategoryId}
                                onChange={this.handlePopupInputChange.bind(this)}
                                id={data.diseaseCategoryName}
                                name="diseaseCatId"
                                tabIndex={i + 1}
                              />
                              {/* <Label
                                className="custom-control-label"
                                style={{ fontWeight: "500" }}
                                htmlFor={data.diseaseCategoryName}
                              >
                                {data.diseaseCategoryName
                                }
                              </Label> */}
                              {/* {

                                data.subCategory.map((ele) => {

                                  // if (Array.isArray(ele) && ele.length) {
                                  return (
                                    <div className="custom-control custom-radio ">

                                      <div className="custom-control custom-radio my-1">
                                        {ele.diseaseCategoryId == this.state.subDiseaseCatId ? (<Input
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
                                          {ele.diseaseCategoryName

                                          }
                                        </Label>
                                      </div>

                                    </div>
                                  );

                                })} */}


                            </>
                          ) : (
                            <Input
                              type="radio"
                              className="custom-control-input"
                              value={data.diseaseCategoryId}
                              onChange={this.handlePopupInputChange.bind(this)}
                              id={data.diseaseCategoryName}
                              name="diseaseCatId"
                              tabIndex={i + 1}
                            />
                          )}
                          <Label
                            className="custom-control-label"
                            htmlFor={data.diseaseCategoryName}
                          >
                            {data.diseaseCategoryName +
                              " (" +
                              data.productName +
                              ")"}
                          </Label>

                        </div>
                      );
                    })}
                    {/*<div className="custom-control custom-radio">*/}
                    {/*  {diseaseName == "Cancer Patients" ?*/}
                    {/*    <Input type="radio" checked className="custom-control-input" value="Cancer Patients" onChange={this.handlePopupInputChange.bind(this)} id="CancerPatients" name="diseaseName" tabIndex="1" />*/}
                    {/*    :*/}
                    {/*    <Input type="radio" className="custom-control-input" value="Cancer Patients" onChange={this.handlePopupInputChange.bind(this)} id="CancerPatients" name="diseaseName" tabIndex="1" />*/}
                    {/*  }*/}
                    {/*  <label className="custom-control-label" htmlFor="CancerPatients">Cancer</label>*/}
                    {/*</div>*/}
                    {/*<div className="custom-control custom-radio">*/}
                    {/*  {diseaseName == "VibrantHealthX" ?*/}
                    {/*    <Input type="radio" className="custom-control-input" value="VibrantHealthX" onChange={this.handlePopupInputChange.bind(this)} checked id="VibrantHealthX" name="diseaseName" tabIndex="2" />*/}
                    {/*    : <Input type="radio" className="custom-control-input" value="VibrantHealthX" onChange={this.handlePopupInputChange.bind(this)} id="VibrantHealthX" name="diseaseName" tabIndex="2" />*/}
                    {/*  }*/}
                    {/*  <label className="custom-control-label" htmlFor="VibrantHealthX">Complete Health Score</label>*/}
                    {/*</div>*/}
                    {/*<div className="custom-control custom-radio">*/}
                    {/*  {diseaseName == "Neurodegenerative" ?*/}
                    {/*    <Input type="radio" className="custom-control-input" value="Neurodegenerative" onChange={this.handlePopupInputChange.bind(this)} checked id="Neurodegenerative" name="diseaseName" tabIndex="2" />*/}
                    {/*    : <Input type="radio" className="custom-control-input" value="Neurodegenerative" onChange={this.handlePopupInputChange.bind(this)} id="Neurodegenerative" name="diseaseName" tabIndex="2" />*/}
                    {/*  }*/}
                    {/*  <label className="custom-control-label" htmlFor="Neurodegenerative">Neurodegenerative</label>*/}
                    {/*</div>*/}
                    {/*<div className="custom-control custom-radio">*/}
                    {/*  {diseaseName == "Autoimmunity" ?*/}
                    {/*    <Input type="radio" className="custom-control-input" value="Autoimmunity" onChange={this.handlePopupInputChange.bind(this)} checked id="Autoimmunity" name="diseaseName" tabIndex="2" />*/}
                    {/*    : <Input type="radio" className="custom-control-input" value="Autoimmunity" onChange={this.handlePopupInputChange.bind(this)} id="Autoimmunity" name="diseaseName" tabIndex="2" />*/}
                    {/*  }*/}
                    {/*  <label className="custom-control-label" htmlFor="Autoimmunity">Autoimmunity</label>*/}
                    {/*</div>*/}
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="recipient-name"
                      className="form-control-label"
                    >
                      Practitioner
                    </label>
                    <Input
                      type="select"
                      className="custom-select mb-3"
                      name="practitionerId"
                      value={practitionerId}
                      onChange={this.handlePopupInputChange.bind(this)}
                      tabIndex="3"
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
                    {errors.practitionerId.length > 0 && (
                      <span className="error">{errors.practitionerId}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <Label>
                      CC Representative{" "}

                    </Label>

                    <Input
                      type="select"
                      className={errors.ccId
                        ? "custom-select is-invalid"
                        : "custom-select is-valid"}
                      name="ccId"
                      // value={countryId}
                      onChange={this.handleInputChange.bind(this)}
                    >
                      <option value="" >Select Representative</option>
                      {costumerCare?.map((data, i) => {
                        return (
                          <option key={i} value={data.userId}>
                            {data.fullName}
                          </option>
                        );
                      })}
                    </Input>
                    {/* {<span className="error">{errors.ccId}</span>} */}


                  </div>
                  {this.state.diseaseCatId == "5" ?
                    <div className="form-group">
                      <Label>
                        Disease {" "}
                        {/* <span className="requiredField">*</span> */}
                      </Label>
                      <Input
                        type="text"
                        name="diseaseForNonCancer"
                        value={this.state.diseaseForNonCancer}
                        onChange={this.handleInputChange.bind(this)}
                        maxLength="500"
                        placeholder="Enter Disease"
                      />

                    </div> : ""}

                  {diseaseCatId == "1" ? (
                    <React.Fragment>
                      <div className="form-group">
                        <label
                          htmlFor="recipient-name"
                          className="form-control-label"
                        >
                          Disease
                        </label>
                        <Input
                          type="select"
                          className="custom-select mb-3"
                          name="diseaseId"
                          value={diseaseId}
                          onChange={this.handlePopupInputChange.bind(this)}
                          tabIndex="4"
                        >
                          <option value="">Select Disease</option>
                          {alldiseases.map((data, i) => {
                            return (
                              <option key={i} value={data.id}>
                                {data.name}
                              </option>
                            );
                          })}
                        </Input>
                        {errors.diseaseId.length > 0 && (
                          <span className="error">{errors.diseaseId}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label
                          htmlFor="recipient-name"
                          className="form-control-label"
                        >
                          Tissue
                        </label>
                        <Input
                          type="select"
                          className="custom-select mb-3"
                          name="tissueId"
                          value={tissueId}
                          onChange={this.handlePopupInputChange.bind(this)}
                          tabIndex="5"
                        >
                          <option value="">Select Tissue</option>
                          {allTissues.map((data, i) => {
                            return (
                              <option key={i} value={data.id}>
                                {data.name}
                              </option>
                            );
                          })}
                        </Input>
                        {errors.tissueId.length > 0 && (
                          <span className="error">{errors.tissueId}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <FormGroup>
                          <Label>Metastasis{" "}   <span className="requiredField">*</span> </Label><br />
                          <div className="custom-control custom-radio ">
                            {this.state.metastasis == "yes" ? (

                              <Input
                                type="radio" className="custom-control-input"
                                value="yes"
                                checked
                                onChange={this.handleInputChange.bind(this)}
                                name="metastasis"
                                id="Yes"
                              />
                            ) : (

                              <Input
                                type="radio" className="custom-control-input"
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
                            {this.state.metastasis == "no" ?

                              (<Input
                                type="radio"
                                value="no"
                                checked
                                className="custom-control-input"
                                onChange={this.handleInputChange.bind(this)}
                                name="metastasis"
                                id="No"
                              />)
                              : (
                                <Input
                                  type="radio"
                                  value="no"
                                  className="custom-control-input"
                                  onChange={this.handleInputChange.bind(this)}
                                  name="metastasis"
                                  id="No"
                                />)}
                            <Label
                              className="custom-control-label"
                              htmlFor="No"
                            >
                              No
                            </Label>
                          </div>
                          {<span className="error">{errors.metastasis}</span>}
                        </FormGroup>
                      </div>

                    </React.Fragment>
                  ) : null}
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={this.handleClosePopup}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    disabled={loading}
                    onClick={this.AddPatientAccessionNo.bind(this)}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </Modal>
            </Card>
          </Col>
        </Row>
        <MyModal
          handleModal={this.handleModalClose.bind(this)}
          //modalAction={this.state.modalAction}
          isOpen={this.state.modal}
          modalBody={this.state.modalBody}
          modalTitle={this.state.modalTitle}
          modalOptions={this.state.modalOptions}
        />
        {
          preview && (
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
                      onClick={(e) => this.previewToggle(e, "")}
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
          )
        }
      </div >
    );
  }
}

export default List;
