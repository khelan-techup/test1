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
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Label,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import { toast } from "react-toastify";
import { Steps } from "intro.js-react";
import axiosInstance from "./../../../common/axiosInstance"
import ReactPaginate from "react-paginate";
import { BE_CognitoMail_RegisterUser, BE_NGSLabSample_BulkDelete, BE_NGSLabSample_Save, BE_NGSLaboratory_Delete, BE_NGSLaboratory_GetAllPaging, BE_OrganizationUser_UpdateTooltipSteps, BE_SampleType_GetSampleTypebyCatId } from "../../../common/allApiEndPoints";

class List extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.initialState = {
      loading: true,
      openSearch: true,
      ngslaboratorys: [],
      searchString: "",
      slDelete: true,
      selectedCategory: [],
      checkbox: [],
      ngsLabId: "",
      AllDiseaseCategory: [],
      diseaseCategoryId: "",
      ngsLabSampleTypeId: "",
      AllSamples: [],
      showSample: false, cperson: false,
      labIndex: null,
      aviableSample: [], selectedCheckBox: [],
      errors: {
        diseaseCategoryId: "",
        ngsLabSampleTypeId: "",
      },
      deleteUncheked: [],
      currentSamples: [],
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
      isEdit: false, selectedSamples: [],
      labData: [], ngsLabSamples: [],
      deleteSampleId: [],
      toRemove: [],
      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      steps: [
        {
          element: "#pagetitle",
          title: 'Laboratory List',
          intro: "This page is for adding, deleting, or editing Laboratories to the Portal.",
          tooltipClass: "cssClassName1",
        }, {
          element: "#addpatient",
          title: 'Add New Laboratory',
          intro: "Add new Laboratory by clicking on this button.",
          tooltipClass: "cssClassName1",
        },
        {
          element: "#activeinactive",

          title: 'Select Status',
          tooltipClass: "cssClassName1",
          intro: "This will filter Laboratory list to either active/inactive."
        },
        {
          element: "#searchbar",
          title: 'Search Laboratory',

          tooltipClass: "cssClassName1",
          intro: "Search for a Laboratory."
        },
        {
          element: "#viewcontact",
          title: "Contact Person(s)",
          intro: 'Lists all Contact Person(s) for this Laboratory.',

          tooltipClass: "cssClassName1",
        },
        {
          element: "#editdetails ",
          title: 'Edit Laboratory Details',

          tooltipClass: "cssClassName1",
          intro: "You can edit Practitioner details using this button"
        },
        {
          element: "#assignspecimen",
          title: 'Assign Specimen',

          tooltipClass: "cssClassName1",
          intro: "You can assign samples to the Laboratory using this button."
        },
        {
          element: "#viewpatient",
          title: 'View Specimen List',

          tooltipClass: "cssClassName1",
          intro: "This will show the list of specimens assigned to this laboratory."
        }, {
          element: "#statusoflab ",
          title: 'Status of Laboratory',

          tooltipClass: "cssClassName1",
          intro: "Current status of the Practitioner."
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
    this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 9 }));
    // localStorage.setItem("isFirstLogin", false);
    // this.sendCurrentStep()

  };

  onAfterChange = newStepIndex => {
    if (newStepIndex === 1) {
      const element = document.querySelector('#addpatient')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 4) {
      const element = document.querySelector('#viewcontact')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 5) {
      const element = document.querySelector('#editdetails')

      if (!element) this.myRef.current.introJs.nextStep()
    }

    if (newStepIndex === 6) {
      const element = document.querySelector('#assignspecimen')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 7) {
      const element = document.querySelector('#viewpatient')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 8) {
      const element = document.querySelector('#statusoflab')

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
    //console.log(rights);
    if (rights?.length > 0) {
      let currentrights = rights.filter((role) =>
        role.moduleId == 6
      );
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited,
        });
        if (currentrights[0].isViewed) {
          this.getListData(0);
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
  getListData(pageNo) {
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId == null ? 0 : userToken.userId;
    let isFirstLogin = JSON.parse(localStorage.getItem("isFirstLogin"));

    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_NGSLaboratory/GetAllPaging";
    const url = apiroute + BE_NGSLaboratory_GetAllPaging

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
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
          //console.log(result.data.outdata);

          this.setState({
            labData: result?.data?.outdata?.ngsLaboratoryData,
            pagesCount: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            pageCountNew: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            ngslaboratorys: result.data.outdata.ngsLaboratoryData,
            AllDiseaseCategory: result.data.outdata.diseaseCategoryData,
            diseaseCategoryId: result.data.outdata.diseaseCategoryData[0]?.diseaseCategoryId,
            loading: false,
            stepsEnabled: isFirstLogin
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

  //pagination
  handleClick(e, index, currIndex) {
    this.setState({ loading: true });
    e.preventDefault();
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
          searchString: value.trim()
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
        this.getListData(0);
      }
    );
  };

  //delete(active/inactive) button click
  deleteRow(e, id) {
    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      // apiroute + '/api/BE_NGSLaboratory/Delete' + id + "&userId=" + userId + "";
      apiroute + BE_NGSLaboratory_Delete(id, userId)

    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          // this.setState({
          //   modal: !this.state.modal,
          //   modalTitle: 'Success',
          //   modalBody: result.data.message
          // });
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
          this.getListData(0);
        } else {
          this.setState({ loading: false });
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
  }

  //welcome mail button click
  sendMail(e, id) {
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
  deleteSelectedSample() {
    let url = 'api/BE_NGSLabSample/Delete'
  }
  //add Sample
  handleCloseSample = () => {
    this.setState({
      showSample: false,
      aviableSample: [], toRemove: [], deleteUncheked: [], ngsLabSamples: [],
      selectedCheckBox: [], selectedSamples: [],
      checkbox: [],
    });
  };

  handleShowSample = (e, lid, dcid, sids, i) => {
    // console.log(lid + " " + dcid + " " + sids);
    let labData = this.state.labData[i];
    // console.log(lid);
    this.setState(
      {
        ngsLabSamples: labData?.ngsLabSamples,
        ngsLabId: lid,
        diseaseCategoryId: dcid,
        showSample: true,
        loading: dcid != 0 ? true : false,
        checkbox: sids != "" && sids != null ? sids.split(",") : [],
      },
      () => {
        if (dcid != 0) {
          this.getSampleByDiseaseCategory(dcid);
        }
      }
    );
  };

  handleSampleInputCheckboxChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // console.log(event.target.checked);
    // console.log(target, "jnbjjjnj");
    // console.log(value, "jnbjjjnj");
    // console.log(name, "jnbjjjnj");


    let deletedata = this.state.deleteUncheked
    let index = value
    let filter = [...deletedata]
    if (deletedata.includes(String(value))) {
      filter = filter.filter((i) => i != index);
    } else {
      filter = [
        ...filter,
        value
      ]
    }
    // console.log(newDaata);
    this.setState({
      deleteUncheked: filter,

    })
    // console.log(this.state.deleteUncheked);


  }

  handleselectedCheckBox = (e) => {
    let target = e.target;
    let value = target.value;

    let state = this.state.toRemove;

    let newArr = [...state]
    if (state.includes(value)) {
      newArr = newArr.filter((ele) => ele != value)
    } else {
      newArr = [
        ...newArr,
        value
      ]
    }
    this.setState({ toRemove: newArr })
    // console.log(newArr, "bvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
  }

  removeSelected = () => {
    let state = this.state.toRemove;
    let aviableSample = this.state.aviableSample
    let selected = this.state.selectedCheckBox
    let newArr = aviableSample.filter((ele) => !state.includes(String(ele.sampleTypeId)))

    this.setState({
      aviableSample: newArr, loading: true,
      toRemove: [],
      checkbox: this.state.checkbox.filter(ele => !state.includes(ele)),
      selectedCheckBox: selected.filter(ele => !state.includes(ele))

    }, this.getSampleByDiseaseCategory(this.state.diseaseCategoryId))

  }

  deleteAssignedSamples = (cateId) => {

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    let samplesToDelete = this.state.deleteUncheked;
    let selectedCheckBox = this.state.selectedCheckBox
    let filterSelected = selectedCheckBox.filter(ele => !samplesToDelete.includes(ele));
    let ngsLabSamples = this.state.ngsLabSamples;
    // console.log({ cateId })
    let filterNGSsamples = ngsLabSamples.filter(ele => {
      // console.log({
      //   ca: ele.diseaseCategoryId, cateId,
      //   incl: samplesToDelete.includes(String(ele.ngsLabSampleId)) && ele.diseaseCategoryId == cateId,
      // })

      return !(samplesToDelete.includes(String(ele.ngsLabSampleId)) && ele.diseaseCategoryId == cateId)

    })
    let data = ngsLabSamples.filter(ele => samplesToDelete.includes(String(ele.ngsLabSampleId)) && ele.diseaseCategoryId == cateId).map((ele) => {
      return {
        "ngsLabSampleId": Number(ele.ngsLabSampleId),
        "userId": uid,
      }
    })
    // console.log({ filterNGSsamples, samplesToDelete, selectedCheckBox, filterSelected, ngsLabSamples })
    const apiroute = window.$APIPath;
    const url =
      // apiroute + "/api/BE_NGSLabSample/BulkDelete";
      apiroute + BE_NGSLabSample_BulkDelete

    // return;
    axiosInstance.post(url, data, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }).then(res => {
      // console.log(res)
      let { flag, message } = res.data
      if (flag) {
        toast.success(message)
      } else {
        toast.error(message)
      }
      this.setState({ selectedCheckBox: filterSelected, checkbox: [], selectedCheckBox: [], ngsLabSamples: filterNGSsamples }, () => {
        this.getListData()
        this.getSampleByDiseaseCategory(this.state.diseaseCategoryId)
      })
    })



  }
  handleSampleInputChange(event) {

    if (event != null) {
      const target = event.target;
      const value = target.value;
      const name = target.name;

      if (name == "diseaseCategoryId") {
        this.setState({

          [name]: value,
        });

        let errors = this.state.errors;

        switch (name) {
          case "diseaseCategoryId":
            errors.diseaseCategoryId = !value ? "Please select category." : "";
            break;
          default:
            //(!value) ? '' :'This standard is required.'
            break;
        }

        this.setState({ errors, [name]: value }, () => {
          if (value != "") {

            this.getSampleByDiseaseCategory(value);
          }
        });
      } else {
        let nCheckbox = this.state.checkbox.slice(); // create a new copy of state value
        if (this.isValueExist(nCheckbox, event.target.value)) {
          // check if the same value is preexisted in the array
          const index = nCheckbox.indexOf(event.target.value);
          nCheckbox.splice(index, 1); // removing the preexciting value
        } else {
          nCheckbox.push(event.target.value); // inserting the value of checkbox in the array
        }
        this.setState({
          checkbox: nCheckbox,
          // AllSamples: this.state.AllSamples.filter((cat) => !nCheckbox.includes(String(cat.sampleTypeId))),
          ngsLabSampleTypeId: nCheckbox.join(","),
        });
      }
    }
  }

  //edit time set checkbox selected
  setCheckbox(id) {
    let nCheckbox = this.state.checkbox.slice(); // create a new copy of state value
    if (this.isValueExist(nCheckbox, id)) {
      // check if the same value is preexisted in the array
      return true;
    } else {
      return false; // inserting the value of checkbox in the array
    }
  }

  isValueExist(data, event) {
    if (data.length == 0) {
      return false;
    }
    for (let i = 0; i <= data.length; i++) {
      if (event == data[i]) {
        return true;
      }
    }
    return false;
  }

  getSampleByDiseaseCategory = (id) => {

    const apiroute = window.$APIPath;
    const url =
      // apiroute + "/api/BE_SampleType/GetSampleTypebyCatId?id=" + id + ""; 
      apiroute + BE_SampleType_GetSampleTypebyCatId(id)

    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {

        if (result.data.flag) {
          var rData = result.data.outdata;
          let selectedSamples = this.state.selectedSamples
          let aviableSample = this.state.aviableSample
          let ngsLabSamples = this.state.ngsLabSamples
          let selectedCheckBox = this.state.selectedCheckBox


          // console.log("ngsLabSamples", ngsLabSamples);





          // filter((cat) => cat.diseaseCategoryId == ele && this.state.selectedCheckBox(String(cat.sampleTypeId)))
          // console.log(rData.filter((cat) => !selectedCheckBox.includes(String(cat.sampleTypeId))));
          // let deleteData = this.state.deleteUncheked
          // this.setState({
          //   deleteUncheked: [
          //     ...deleteData,
          //     value,]
          // }
          // )
          // console.log(this.state.deleteUncheked);
          this.setState({
            AllSamples: rData.filter((cat) => {
              let index = ngsLabSamples.findIndex(e => Number(e.sampleTypeId) == Number(cat.sampleTypeId))
              // console.log({ index, cid: cat.sampleTypeId, inch: !selectedCheckBox.includes(String(cat.sampleTypeId)) })
              return !selectedCheckBox.includes(String(cat.sampleTypeId)) && index === -1;
            }),
            aviableSample: [
              ...aviableSample, ...rData, ...ngsLabSamples
            ]
              .filter((item, i, ar) => ar.findIndex(obj => obj.sampleTypeId === item.sampleTypeId) === i),

            loading: false,
            selectedSamples: [
              ...selectedSamples, id
            ].filter((item, i, ar) => ar.indexOf(item) === i),

            deleteUncheked: [],
            checkbox: [],
          });

          // this.setState({
          //   selectedSamples: [
          //     ...this.state.selectedSamples
          //   ]
          // })
          //console.log(this.state);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
  };
  addSelectedSamples() {
    // let currentSamples = this.state.selectedSamples;
    let diseaseCategoryId = this.state.diseaseCategoryId
    let AllSamples = this.state.AllSamples.filter((cat) => diseaseCategoryId == cat.diseaseCategoryId && !this.setCheckbox(String(cat.sampleTypeId)))
    let checkbox = this.state.checkbox;
    this.setState({
      AllSamples,
      selectedCheckBox: [...checkbox, ...this.state.selectedCheckBox.filter((item, i, ar) => ar.indexOf(item) === i)],
      checkbox: []
    })
  }
  AddSample(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      uid = userToken.userId == null ? 0 : userToken.userId;
    }

    if (
      this.state.selectedCheckBox.length >= 0
      // this.state.ngsLabSampleTypeId != undefined
    ) {
      const apiroute = window.$APIPath;
      // let url = apiroute + "/api/BE_NGSLabSample/Save";      // let url = apiroute + "/api/BE_NGSLabSample/Save";
      let url = apiroute + BE_NGSLabSample_Save      // let url = apiroute + "/api/BE_NGSLabSample/Save";

      let filteredSamples = this.state.aviableSample.filter(obje => this.state.selectedCheckBox.includes(String(obje.sampleTypeId))) //.map(ele=>String(ele.diseaseCategoryId))
      let dataToParse = filteredSamples.map((ele) => {
        return {
          ngsLaboratoryId: parseInt(this.state.ngsLabId),
          ngsLabSampleId: 0,
          diseaseCategoryId: ele.diseaseCategoryId,
          sampleTypeId: ele.sampleTypeId,
          sampleTypeName: ele.sampleTypeName,
          createdByFlag: "A",
          createdBy: uid
        }
      })

      // [
      //   {
      //     "ngsLabSampleId": 0,
      //     "ngsLaboratoryId": 0,
      //     "diseaseCategoryId": 0,
      //     "sampleTypeId": 0,
      //     "sampleTypeName": "string",
      //     "createdByFlag": "string",
      //     "createdBy": 0
      //   }
      // ]

      // let selectedSamples = this.state.selectedSamples.filter(())
      let data = JSON.stringify(dataToParse)
      // let data = JSON.stringify({
      //   NGSLaboratoryId: parseInt(this.state.ngsLabId),
      //   SampleTypeIds: this.state.ngsLabSampleTypeId,
      //   NGSLabSampleId: 0,
      //   DiseaseCategoryId: parseInt(this.state.diseaseCategoryId),
      //   SampleTypeId: 0,
      //   createdBy: uid,
      //   createdByFlag: "A",
      // });

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
                authError: true,
                errorType: "success",
                error: result.data.message,
                loading: false,
                showSample: false,
                ngsLabId: "",
                ngsLabSampleTypeId: "",
                diseaseCategoryId: "",
                checkbox: [],
                AllSamples: [],
                selectedCheckBox: []
              },
              this.getListData(0)
            );

            toast.success(result.data.message);
          } else {
            toast.error(result.data.message);
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          this.setState({
            authError: true,
            errorType: "danger",
            error: error.message,
            loading: false,
            showSample: false,
          });
          toast.error(error.message);
        });

    } else {
      errors.ngsLabSampleTypeId = "Please select Sample.";
      this.setState({ loading: false });
    }
  }
  //end add Sample

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
  }
  handlePageClick = (e) => {
    console.log("datra", e.selected)
    let currentPage = e.selected;
    this.getListData(currentPage)

  }

  render() {
    if (localStorage.getItem("AUserToken") == null) {
      return <Redirect to="/Login" />;
    }

    const {
      loading,
      ngslaboratorys,
      currentPage,
      currentIndex,
      pagesCount,
      pageSize,
      authError,
      error,
      AllDiseaseCategory,
      AllSamples,
      errors,
      showSample,
      diseaseCategoryId, selectedSamples, aviableSample, selectedCheckBox
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

        />
        <button className="help" id="help" type="btn" onClick={() => { this.toggleSteps() }}>
          <i class="fa fa-question" aria-hidden="true"></i>
        </button>
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2" id="pagetitle" style={{ width: "fit-content" }}>
              <i className="fa fa-align-justify"></i> Laboratory List
            </h5>
          </Col>
          <Col xs="2" lg="2">
            {this.state.isEdit ? (
              <Link to="/ngslaboratory/details" id="addpatient">
                <button className="btn btn-primary btn-block">
                  Add Laboratory
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
                  <Col xs="2">
                    <Input
                      type="select"
                      name="slDelete"
                      onChange={this.handleChange}
                      id="activeinactive"

                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Input>
                  </Col>
                  <Col xs="4"></Col>
                  <Col xs="6">
                    {this.state.openSearch ? (
                      <div className="searchBox">
                        <input
                          type="text"
                          placeholder="Search..."
                          onKeyPress={this.filter}
                          id="searchbar"
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
                <Table responsive bordered key="tblngslaboratorys">
                  <thead>
                    <tr>
                      <th>Laboratory Name</th>
                      <th>Contact</th>
                      {/* {this.state.isEdit && this.state.isView ? ( */}
                      <th>Action</th>
                      {/* ) : null} */}
                      {/* {this.state.isView ?  */}
                      <th>View</th>
                      {/* : null} */}
                      <th> Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // !loading ? (
                      //employees.map(function (data,i) {
                      ngslaboratorys.length > 0 ? (
                        ngslaboratorys
                          //.slice(
                          //  currentPage * pageSize,
                          //  (currentPage + 1) * pageSize
                          //)
                          .map((data, i) => {
                            return (
                              <tr key={i}>
                                <td>
                                  {data.ngsLabName}
                                  {/*<br /> {"(" + data.accessionNo + ")"}*/}{" "}
                                </td>
                                <td>
                                  <i className="fa fa-envelope fa-lg" />
                                  &nbsp;
                                  <a
                                    className='text-dark'
                                    href={`mailto: ${data.email}`}
                                  >
                                    {data.email}
                                  </a>
                                  <br />

                                  {data.mobileNo != "" &&
                                    data.mobileNo != null ? (
                                    <React.Fragment>
                                      <i className="fa fa-mobile fa-2x" />
                                      &nbsp;
                                      <a
                                        className='text-dark'
                                        href={`phoneto: ${data.mobileNo}`}
                                      >{data.mobileNo}</a>
                                    </React.Fragment>
                                  ) : (
                                    ""
                                  )}
                                  {Array.isArray(data.ngsContactPersons) && data.ngsContactPersons.length > 0 && <><br /><a id="viewcontact" href="#"
                                    onClick={
                                      () => { this.setState({ cperson: true, labIndex: i }) }
                                    }
                                  >View contact person(s)</a></>
                                  }
                                </td>
                                {/* {this.state.isEdit && this.state.isView ? ( */}
                                <td>
                                  {/* {this.state.isEdit ? ( */}
                                  <React.Fragment>
                                    <Link
                                      className="btn btn-primary btn-sm btn-pill"
                                      id="editdetails"
                                      to={
                                        "/ngslaboratory/modify/" +
                                        data.ngsLaboratoryId
                                      }
                                    >
                                      <b>Edit</b>
                                    </Link>{" "}
                                    <Link
                                      id="assignspecimen"
                                      className="btn btn-info btn-sm btn-pill"
                                      to={'/ngslaboratory/samples/' + data.ngsLaboratoryId}
                                    // to="#"
                                    // onClick={(e) =>
                                    //   this.handleShowSample(
                                    //     e,
                                    //     data.ngsLaboratoryId,
                                    //     diseaseCategoryId,
                                    //     data.sampleTypeIds, i
                                    //   )
                                    // }
                                    >
                                      <b>Assign Specimen</b>
                                    </Link>
                                    {/*<Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={e => this.deleteRow(e, data.ngsLaboratoryId)}><b>Delete</b></Link>*/}
                                  </React.Fragment>
                                  {/* ) : null} */}
                                </td>
                                {/* ) : null} */}
                                {this.state.isView ? (
                                  <td>
                                    <Link
                                      id="viewpatient"
                                      className="btn btn-dark btn-sm btn-pill"
                                      to={
                                        "/ngslaboratory/patients/" +
                                        data.ngsLaboratoryId
                                      }
                                    >
                                      Patients
                                    </Link>
                                  </td>
                                ) : null}
                                <td id="statusoflab">
                                  {data.isCognito ? (
                                    data.isConfirm ? (
                                      data.isActivate ? (
                                        <span
                                          className="badge badge-success btn-pill"
                                          style={{
                                            padding: "8px",
                                            color: "#fff",
                                          }}
                                        >
                                          Active
                                        </span>
                                      ) : (
                                        <span
                                          className="badge badge-danger btn-pill"
                                          style={{
                                            padding: "8px",
                                            color: "#fff",
                                          }}
                                        >
                                          Inactive
                                        </span>
                                      )
                                    ) : (
                                      <span
                                        className="badge badge-warning btn-pill"
                                        style={{
                                          padding: "8px",
                                          color: "#fff",
                                        }}
                                      >
                                        Confirmation Pending
                                      </span>
                                    )
                                  ) : this.state.isEdit ? (
                                    <Link

                                      className="btn btn-info btn-sm btn-pill"
                                      to="#"
                                      onClick={(e) =>
                                        this.sendMail(e, data.userId)
                                      }
                                    >
                                      <b>Activate Account</b>
                                    </Link>
                                  ) : (
                                    <span
                                      className="badge badge-danger btn-pill"
                                      style={{ padding: "8px", color: "#fff" }}
                                    >
                                      Inactive
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td colSpan="6" className="tdCenter">
                            No laboratories found.
                          </td>
                        </tr>
                        // )) : (
                        // <tr>
                        //   <td colSpan="5" className="tdCenter">Loading...</td></tr>
                      )
                    }
                  </tbody>
                </Table>

                {/* <Pagination
                  aria-label="Page navigation example"
                  className="customPagination"
                >
                  <PaginationItem disabled={currentIndex - 4 <= 0}>
                    <PaginationLink
                      onClick={(e) =>
                        this.handleClick(e, currentPage - 5, currentIndex - 5)
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
                  <PaginationItem disabled={currentIndex + 5 >= pagesCount}>
                    <PaginationLink
                      onClick={(e) =>
                        this.handleClick(e, currentPage + 5, currentIndex + 5)
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
        <Modal toggle={() => { this.setState({ cperson: false, labIndex: null }) }} isOpen={this.state.cperson} className="modal-dialog modal-md ">
          <ModalHeader>{this.state.labData[this.state.labIndex]?.ngsLabName} </ModalHeader>
          <ModalBody style={{ overflowY: "auto", overflowX: "hidden" }}>
            {this.state.labData[this.state.labIndex]?.ngsContactPersons.map((e, i) => {

              return <>
                {i + 1}. {e.name}
                <hr />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly"
                  }}
                >
                  <div >
                    <i className="fa fa-envelope fa-lg" />
                    &nbsp;
                    {e.email ? <a
                      className='text-dark'
                      href={`mailto: ${e.email}`}
                    >{e.email}</a> : "N/A"}
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i className="fa fa-mobile fa-2x" />
                    &nbsp;
                    {e.mobile ? <a
                      className='text-dark'
                      href={`phoneto: ${e.mobile}`}
                    >{e.mobile}</a> : "N/A"}
                  </div>
                </div>
              </>

            })}

          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => { this.setState({ cperson: false, labIndex: null }) }}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={showSample} className="modal-dialog modal-md left-modal">
          <ModalHeader>Assign Specimen</ModalHeader>
          <ModalBody style={{ overflowY: "auto", overflowX: "hidden" }}>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                <b>
                  Category
                </b>

              </label>
              <Input
                type="select"
                className="custom-select mb-3"
                name="diseaseCategoryId"
                value={diseaseCategoryId}
                onChange={this.handleSampleInputChange.bind(this)}
              >
                <option value="">Select Category</option>
                {AllDiseaseCategory.map((data, i) => {
                  return (
                    <option key={i} value={data.diseaseCategoryId}>
                      {data.diseaseCategoryName + " (" + data.productName + ")"}
                    </option>
                  );
                })}
              </Input>
              {errors.diseaseCategoryId.length > 0 && (
                <span className="error">{errors.diseaseCategoryId}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">
                <b>
                  Specimen Collection
                </b>
              </label>
              {AllSamples.length > 0
                ? AllSamples.map((data, i) => {
                  return (
                    <FormGroup check row key={i}>
                      <Row style={{ marginBottom: "3px" }}>
                        <Col xs="1"></Col>
                        <Col xs="1">
                          {/*this.setCheckbox(data.sampleTypeId) ? (*/}
                          {/* {this.setCheckbox(data.sampleTypeId) ? (

                            <Input
                              className="form-check-input ml-0"
                              type="checkbox"
                              id={"chk" + data.sampleTypeId}
                              checked
                              name="inline-checkbox1"
                              value={data.sampleTypeId}
                              onChange={this.handleSampleInputChange.bind(
                                this
                              )}
                            />
                          ) : ( */}

                          <Input
                            className="form-check-input ml-0"
                            type="checkbox"
                            checked={this.state.checkbox.includes(String(data.sampleTypeId))}
                            id={"chkMain" + data.sampleTypeId}
                            name="inline-checkbox1"
                            value={data.sampleTypeId}
                            onChange={this.handleSampleInputChange.bind(
                              this
                            )}
                          />
                          {/* )} */}
                        </Col>
                        <Col xs="10">
                          <Label
                            className="form-check-label"
                            check
                            htmlFor={"chkMain" + data.sampleTypeId}
                          >
                            {data.sampleTypeName}
                          </Label>
                        </Col>



                      </Row>
                    </FormGroup>
                  );
                })
                : null}
              {AllSamples.length ? <button disabled={this.state.checkbox.length > 0 ? false : true} className="btn btn-md btn-primary mb-3 float-right" onClick={() => this.addSelectedSamples()}>Add Samples</button> : null}
              <br />
              <b>

                Selected Samples:
              </b>
              <br />
              <div style={{ maxHeight: "180px", overflowY: "auto", overflowX: "hidden" }} className="mt-3">
                {Array.isArray(selectedSamples) && selectedSamples.map((ele) => {
                  let index = AllDiseaseCategory.findIndex(cat => cat.diseaseCategoryId == ele)
                  let name = AllDiseaseCategory[index]?.diseaseCategoryName + " (" + AllDiseaseCategory[index]?.productName + ")"
                  let samples = aviableSample.filter((cat) => cat.diseaseCategoryId == ele && this.state.selectedCheckBox.includes(String(cat.sampleTypeId)))
                  let toRemove = this.state.toRemove
                  // let samples = this.getFilteredSamples(ele)
                  // console.log({ samples })
                  return <>
                    {Array.isArray(samples) == true && samples.length > 0 ? <>
                      <div>{name}:</div>
                      <hr />
                      <FormGroup check row >
                        <Row style={{ marginBottom: "3px" }}>
                          {/* <Col xs="1"></Col> */}
                          {samples.map((sample) => <>
                            <Col xs="1"></Col>
                            <Col xs="1">
                              <Input
                                className="form-check-input ml-0 "
                                type="checkbox"
                                checked={this.state.toRemove.includes(String(sample.sampleTypeId))}
                                // checked
                                // disabled
                                id={"sele" + sample.sampleTypeId}
                                name="inline-checkbox1"
                                value={sample.sampleTypeId}
                                onChange={this.handleselectedCheckBox.bind(
                                  this
                                )}
                              />
                            </Col>
                            <Col xs="10">

                              <Label className="form-check-label " check htmlFor={"sele" + sample.sampleTypeId}>{sample.sampleTypeName}</Label>
                            </Col>
                          </>

                          )}

                          <Col xs="12">

                            <button className="btn btn-primary btn-md mt-3 float-right mr-4" onClick={this.removeSelected}
                              disabled={
                                samples.filter(e => {
                                  return toRemove.includes(String(e.sampleTypeId)) && e.diseaseCategoryId == ele
                                }).length == 0
                              }

                            >Remove Selected</button>
                          </Col>
                        </Row>
                      </FormGroup>
                      <hr />
                      <br />
                    </> : null}
                  </>
                })}
              </div>
              <b> Assigned Samples: </b>
              <br />
              <div style={{ maxHeight: "180px", overflowY: "auto", overflowX: "hidden" }} className="mt-3">
                {Array.isArray(AllDiseaseCategory) && AllDiseaseCategory.map((data) => {
                  let ele = data.diseaseCategoryId
                  let index = AllDiseaseCategory.findIndex(cat => cat.diseaseCategoryId == ele)
                  let name = AllDiseaseCategory[index]?.diseaseCategoryName + " (" + AllDiseaseCategory[index]?.productName + ")"
                  let samples = this.state.ngsLabSamples.filter((cat) => cat.diseaseCategoryId == ele)
                  let deleteUncheked = this.state.deleteUncheked
                  // let samples = this.getFilteredSamples(ele)
                  // console.log({ samples })
                  return <>
                    {Array.isArray(samples) == true && samples.length > 0 ? <>
                      <div>{name}:</div>
                      <hr />
                      <FormGroup check row >

                        <Row style={{ marginBottom: "3px" }}>
                          {/* <Col xs="1"></Col> */}
                          {samples.map((sample) => <>
                            <Col xs="1"></Col>
                            <Col xs="1">
                              <Input
                                className="form-check-input ml-0 "
                                type="checkbox"
                                checked={this.state.deleteUncheked.includes(String(sample.ngsLabSampleId))}
                                id={"selecAssign" + sample.ngsLabSampleId}
                                name="inline-checkbox1"
                                value={sample.ngsLabSampleId}
                                onChange={this.handleSampleInputCheckboxChange.bind(
                                  this
                                )}
                              />
                            </Col>
                            <Col xs="10">

                              <Label className="form-check-label " check htmlFor={"selecAssign" + sample.ngsLabSampleId}>{sample.sampleTypeName} </Label>
                            </Col>
                          </>

                          )}

                          <Col xs="12">

                            <button
                              disabled={
                                samples.filter(e => {
                                  return deleteUncheked.includes(String(e.ngsLabSampleId)) && e.diseaseCategoryId == ele
                                }).length == 0
                              }


                              className="btn btn-warning btn-md mt-3 mr-4 float-right" onClick={() => this.deleteAssignedSamples(ele)} >Delete selected</button>
                          </Col>
                        </Row>
                      </FormGroup>
                      <hr />
                      <br />
                    </> : null}
                  </>
                })}
              </div>

              {
                errors.ngsLabSampleTypeId.length > 0 && (
                  <span className="error" style={{ marginLeft: "15px" }}>
                    {errors.ngsLabSampleTypeId}
                  </span>
                )
              }
            </div >
          </ModalBody >
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseSample}>
              Close
            </Button>
            <Button color="primary" onClick={this.AddSample.bind(this)} disabled={this.state.selectedCheckBox.length == 0}>
              Add
            </Button>
          </ModalFooter>
        </Modal >

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

export default List;
