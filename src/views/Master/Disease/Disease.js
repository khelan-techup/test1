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
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import { toast } from "react-toastify";
import Confirm from "../../CustomModal/Confirm";
import { Steps } from "intro.js-react";
import axiosInstance from "./../../../common/axiosInstance";
import ReactPaginate from "react-paginate";
import { BE_Common_GetPatientDropdownEntity, BE_DiseaseCategory_GetAllDRP, BE_DiseaseCategory_GetSubAllDRP, BE_Disease_Delete, BE_Disease_GetAllPaging, BE_Disease_VerifyDisease, BE_OrganizationUser_UpdateTooltipSteps } from "../../../common/allApiEndPoints";
class List extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.initialState = {
      currentDiseaseId: null,
      showVerifyModal: false,
      loading: true,
      isEdit: false,
      isView: false,
      openSearch: true,
      isVerified: true,
      diseases: [],
      diseaseCatId: "",
      diseaseCategoryId: "",
      diseasecategories: [],
      searchString: "",
      slDelete: true,
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      pageSize: window.$TotalRecord,
      authError: false,
      error: "",
      modal: false,
      modalTitle: "",
      modalBody: "",
      activeCountTrue: "",
      activeCountFalse: "",
      tempCount: true,
      isdiseaseUnverify: true,
      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      steps: [
        {
          element: "#pagetitle",
          title: "Disease",
          intro:
            "Used to add or update a Disease Name and Disease Code for various Pipelines.",
          tooltipClass: "cssClassName1",
        },

        {
          element: "#Add",
          title: "Add New Disease",
          tooltipClass: "cssClassName1",
          intro: "You can add new disease by clicking on this Add button.",
        },
        {
          element: "#activeInactiveFilter",
          title: "Active/Inactive filter for Disease list",
          intro:
            "You can filter disease list by selecting active or inactive option from the dropdown.",
          tooltipClass: "cssClassName1",
        },
        {
          element: "#AnalysisTypeCategory",
          title: "Filter Disease List by Analysis type",
          tooltipClass: "cssClassName1",
          intro:
            "You can filter disease list by selecting analysis type category from the dropdown.",
        },
        {
          element: "#AnalysisTypeSubCategory",
          title: "Filter Disease List by sub category",
          tooltipClass: "cssClassName1",
          intro:
            "You can filter disease list by selecting sub category from the dropdown.",
        },

        {
          element: "#searchbar ",
          title: "Search Disease",
          tooltipClass: "cssClassName1",
          intro:
            "This Search Bar allows the User to search in the disease list.",
        },

        {
          element: "#Edit",
          title: "Edit Disease",
          tooltipClass: "cssClassName1",
          intro:
            "You can edit or update disease details by clicking on this Edit button.",
        },
        {
          element: "#Delete",
          title: "Delete or Recover Disease",
          tooltipClass: "cssClassName1",
          intro:
            "You can delete/Recover disease by clicking on Delete/Recover button.",
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
      pageCountNew: 0,
    };
    this.state = this.initialState;
  }

  //Help tooltip
  onExit = (e) => {
    console.log(e);
    this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 8 }));
    // localStorage.setItem("isFirstLogin", false);
    // this.sendCurrentStep();
  };
  onAfterChange = (newStepIndex) => {
    if (newStepIndex === 0) {
      const element = document.querySelector("#Add");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 1) {
      const element = document.querySelector("#activeInactiveFilter");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 2) {
      const element = document.querySelector("#AnalysisTypeCategory");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 3) {
      const element = document.querySelector("#AnalysisTypeSubCategory");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 4) {
      const element = document.querySelector("#searchbar");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 5) {
      const element = document.querySelector("#Edit");

      if (!element) this.myRef.current.introJs.nextStep();
    }
    if (newStepIndex === 6) {
      const element = document.querySelector("#Delete");

      if (!element) this.myRef.current.introJs.nextStep();
    }
  };
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
      let currentrights = rights.filter(
        (role) => role.moduleId.toString() == "8"
      );
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited,
        });
        if (currentrights[0].isViewed) {
          // this.getListData(0);
        } else {
          this.setState({ loading: false });
        }
      } else {
        this.setState({ loading: false });
      }
    } else {
      this.setState({ loading: false });
    }
    // this.getListData();
    this.getDisease();
  }
  getDisease() {
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_DiseaseCategory/GetAllDRP";
    const url = apiroute + BE_DiseaseCategory_GetAllDRP
    axiosInstance.get(url).then((res) => {
      if (res.data?.flag) {
        let disease = res.data.outdata;

        this.setState(
          {
            diseasecategories: disease,
            loading: false,
          },
          () => {
            this.getsubDrpData(res.data.outdata[0].diseaseCategoryId);
          }
        );
      }
    });
  }
  //get data
  getListData(pageNo) {
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId == null ? 0 : userToken.userId;

    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Disease/GetAllPaging";
    const url = apiroute + BE_Disease_GetAllPaging
    // alert(String(this.state.diseaseCatId))
    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: userId,
      pageNo: pageNo,
      totalNo: window.$TotalRecord,
      diseaseCatId: Number(this.state.diseaseCatId || 1),
      isVerified: this.state.isVerified,
    });

    axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          // console.log("result", result);
          var rdata = result.data.outdata.filter(
            (dl) =>
              dl.category.toLowerCase() != "complete health score" &&
              dl.category.toLowerCase() != "autoimmunity" &&
              dl.category.toLowerCase() != "neurodegenerative"
          );
          this.setState({
            pagesCount: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            pageCountNew: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            diseases: rdata,
            loading: false,
          });
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
    this.setState({
      tempCount: JSON.parse(value),
    });
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
    //e.preventDefault();
    //const currroles = this.state.roles;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Disease/Delete?id=" + id + "&userId=" + userId + "";
    const url = apiroute + BE_Disease_Delete(id, userId)

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
          //  roles: currroles.filter(role => role.role_Id !== id)
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
  temp() {
    let countT = this.state.diseases.filter((data, i) => {
      return data.isActive == true;
    });
    let countF = this.state.diseases.filter((data, i) => {
      return data.isActive == false;
    });
    this.setState({
      activeCountTrue: countT.length,
      activeCountFalse: countF.length,
    });
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
  }
  handleVerified() {
    this.setState(
      {
        isVerified: !this.state.isVerified,
      },
      () => {
        this.getListData();
      }
    );
  }
  handleCategoryChange(e) {
    let target = e.target;
    let value = target.value;
    this.setState(
      {
        selectedCategory: value,
        diseasesubCat: [],
        diseaseName: value,
        diseaseCategoryId: value,
        diseaseCatId: value,
      },
      () => {
        this.getsubDrpData(value);
      }
    );
  }

  handleVerifyDisease() {
    const apiroute = window.$APIPath;
    // const url = apiroute + "api/CognitoUserStore/getPatientDropdownEntity";
    let userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken?.userId == null ? 0 : userToken?.userId;
    // const url = apiroute + "/api/BE_Disease/VerifyDisease";
    const url = apiroute + BE_Disease_VerifyDisease
    let data = JSON.stringify({
      diseaseId: Number(this.state.currentDiseaseId),
      userId: userId,
      isVerified: this.state.isdiseaseUnverify,
      // isDeleted: true,
      // searchString: "",
      // id: 0,
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
          this.setState({
            diseseName: "",
            showVerifyModal: false,
          });
          this.getListData(0)
          toast.success(result.data.message);
        } else {
          this.setState({ loading: false, showVerifyModal: false });
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        // console.log(error);
        toast.error(error?.message || error);
        this.setState({ loading: false, showVerifyModal: false });
      });
  }

  getDrpData() {
    const apiroute = window.$APIPath;
    // const url = apiroute + "api/CognitoUserStore/getPatientDropdownEntity";
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
        diseaseCategoryId: value,
        diseaseCatId: value,
      }),
      function () {
        // debugger;

        this.getListData(0);
      }
    );
  };

  getsubDrpData(id) {
    // alert(id)
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // console.log(id);
    if (id != "") {
      // const url = apiroute + "/api/BE_DiseaseCategory/GetSubAllDRP?id=" + id + "";
      const url = apiroute + BE_DiseaseCategory_GetSubAllDRP(id)

      axiosInstance
        .get(url, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          if (result.data.flag) {
            if (result.data.outdata.length != 0) {
              this.setState(
                () => ({
                  loading: true,
                  currentPage: 0,
                  currentIndex: 0,
                  pagesCount: 0,
                  diseasesubCat: result.data.outdata,
                  diseaseName: String(result.data.outdata[0].diseaseCategoryId),
                  diseaseCategoryId: String(
                    result.data.outdata[0].diseaseCategoryId
                  ),
                  diseaseCatId: String(
                    result.data.outdata[0].diseaseCategoryId
                  ),
                }),
                function () {
                  // alert("aaaa")
                  return this.getListData(0);
                }
              );
            } else {
              this.getListData(0);
            }
            // console.log(this.state.diseasesubCat[0].diseaseCategoryId);
          } else {
            // alert("bccc")
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          // console.log(error);
          this.setState({ loading: false });
        });
    }
  }
  handlePageClick = (e) => {
    console.log("datra", e.selected);
    let currentPage = e.selected;
    this.getListData(currentPage);
  };
  render() {
    if (localStorage.getItem("AUserToken") == null) {
      return <Redirect to="/login" />;
    }

    const {
      loading,
      diseases,
      diseasecategories,
      currentPage,
      currentIndex,
      pagesCount,
      pageSize,
      authError,
      error,
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
            hideNext: false,
            exitOnOverlayClick: false,
            skipLabel: "Skip",
            disableInteraction: true,
          }}
          // onChange={function (e) { console.log(this.currentStep) }}
          onChange={(e) => {
            this.setState({ currentStep: e });
            console.log({ id: e?.id, e });
          }}
        // onComplete={(e) => {
        //   this.setState({
        //     isSkipped: false
        //   })
        //   console.log("Complete", { e })
        // }}
        />
        <button
          className="help"
          id="help"
          type="btn"
          onClick={() => {
            this.toggleSteps();
          }}
        >
          <i class="fa fa-question" aria-hidden="true"></i>
        </button>

        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5
              className="mt-2"
              id="pagetitle"
              style={{ width: "fit-content" }}
            >
              <i className="fa fa-align-justify"></i> Disease List
            </h5>
          </Col>
          <Col xs="1" lg="1">
            {this.state.isEdit ? (
              <Link to="/master/diseases/details">
                <button id="Add" className="btn btn-primary btn-block">
                  Add
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
                  <Col xs="3">
                    <Input
                      id="activeInactiveFilter"
                      type="select"
                      name="slDelete"
                      onChange={this.handleChange}
                    >
                      <option value="true">
                        Active{" "}
                        {this.state.tempCount == true
                          ? `(${this.state.activeCountTrue})`
                          : ""}
                      </option>
                      <option value="false">
                        Inactive{" "}
                        {this.state.tempCount == false
                          ? `(${this.state.activeCountFalse})`
                          : ""}
                      </option>
                    </Input>
                  </Col>

                  <Col xs="2">
                    <FormGroup>
                      <Input
                        id="AnalysisTypeCategory"
                        type="select"
                        name="diseaseCategoryId"
                        onChange={this.handleCategoryChange.bind(this)}
                      >
                        {this.state?.diseasecategories?.map((data, i) => {
                          return (
                            <option key={i} value={data.diseaseCategoryId}>
                              {data.diseaseCategoryName}
                            </option>
                          );
                        })}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col xs="2">
                    <FormGroup>
                      <Input
                        id="AnalysisTypeSubCategory"
                        type="select"
                        name="diseaseCategoryId"
                        style={{
                          display:
                            this.state?.diseasesubCat?.length > 0
                              ? "block"
                              : "none",
                        }}
                        onChange={this.dsubhandleChange.bind(this)}
                      >
                        <option disabled={this.state?.diseaseCategoryId}>
                          Select sub category
                        </option>
                        {this.state?.diseasesubCat?.map?.((data, i) => {
                          return (
                            <option
                              key={i}
                              value={data.diseaseCategoryId}
                              selected={
                                this.state?.diseaseCategoryId ==
                                data.diseaseCategoryId
                              }
                            >
                              {data.diseaseCategoryName}
                            </option>
                          );
                        })}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col xs="5">
                    {this.state.openSearch ? (
                      <div className="searchBox">
                        <input
                          id="searchbar"
                          type="text"
                          placeholder="Search by Disease Name"
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
                <Row>
                  <Col>
                    Verification Status:
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        // width: "17%",
                        float: ""
                      }}
                      className="switch-res"
                    >
                      Pending
                      <div
                        style={{
                          cursor: "pointer",
                          // position: "absolute",
                          // left: "-35px",
                          marginLeft: "28%"
                        }}
                        className="custom-control custom-switch"
                        onClick={() => {
                          // console.log("HEEEERe")
                          this.handleVerified();
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={this.state.isVerified}
                          className="custom-control-input "
                          id="customSwitch1"
                        />
                        <label
                          style={{ cursor: "pointer" }}
                          className="custom-control-label "
                        >
                          {" "}
                        </label>
                      </div>
                      <span>Verified</span>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {authError ? <p>{error.message}</p> : null}
                <Table responsive bordered key="tblDiseases">
                  <thead>
                    <tr>
                      <th>Disease Name</th>
                      <th>EFO Disease Code</th>
                      <th>Disease Code</th>
                      <th>Verification Status </th>
                      <th>Verified By</th>
                      <th>Created By</th>
                      {/* <th>Status</th> */}
                      <th className="thNone">Disease Id</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diseases.length > 0 ? (
                      diseases.map((data, i) => {
                        return (
                          <tr key={i}>
                            <td>{data.diseaseName}</td>
                            <td>{data.efoDiseasCode}</td>
                            <td>{data.diseaseCode}</td>
                            <td align="center">
                              <Button
                                className={`btn btn-${data.isOther ? "secondary" : "danger"
                                  }`}
                                // disabled={!data.isOther}
                                onClick={() => {
                                  if (data.isOther) {
                                    this.setState({
                                      showVerifyModal:
                                        !this.state.showVerifyModal,
                                      currentDiseaseId: data.diseaseId,
                                      diseseName: data.diseaseName,
                                      isdiseaseUnverify: true
                                    });
                                  } else {
                                    this.setState({
                                      showVerifyModal:
                                        !this.state.showVerifyModal,
                                      currentDiseaseId: data.diseaseId,
                                      diseseName: data.diseaseName,
                                      isdiseaseUnverify: false
                                    });
                                  }
                                }}
                              >
                                {data.isOther ? "Verify" : "Unverify"}
                              </Button>
                            </td>
                            <td>{data.verifiedByUser}</td>
                            <td>
                              {data.createdByUser}
                              <br />
                              {data.createdByFlag == "A"
                                ? "(Admin)"
                                : "(Practitioner)"}
                            </td>
                            {/* <td>
                                {data.isActive ? (<Badge color="success">Active</Badge>) : (<Badge color="danger">Inactive</Badge>)}
                              </td> */}
                            <td className="thNone">{data.diseaseId}</td>

                            <td className="">
                              <div className="d-flex">
                                <Link
                                  id="Edit"
                                  className="btn btn-primary btn-sm btn-pill"
                                  to={
                                    "/master/diseases/modify/" + data.diseaseId
                                  }
                                >
                                  Edit
                                </Link>
                                {this.state.isEdit ? (
                                  <>
                                    <Confirm
                                      title="Confirm"
                                      description={`${data.isActive
                                        ? "Are you sure you want to delete this Disease?"
                                        : "Are you sure you want to recover this Disease?"
                                        }`}
                                    >
                                      {(confirm) => (
                                        <Link
                                          id="Delete"
                                          className="btn btn-danger btn-sm btn-pill ml-2"
                                          to="#"
                                          onClick={confirm((e) =>
                                            this.deleteRow(e, data.diseaseId)
                                          )}
                                        >
                                          {data.isActive ? "Delete" : "Recover"}
                                        </Link>
                                      )}
                                    </Confirm>
                                  </>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="tdCenter">
                          No diseases.
                        </td>
                      </tr>
                      // )) : (
                      // <tr>
                      //   <td colSpan="4" className="tdCenter">Loading...</td></tr>
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
        <MyModal
          handleModal={this.handleModalClose.bind(this)}
          //modalAction={this.state.modalAction}
          isOpen={this.state.modal}
          modalBody={this.state.modalBody}
          modalTitle={this.state.modalTitle}
          modalOptions={this.state.modalOptions}
        />
        <Modal isOpen={this.state.showVerifyModal}>
          <ModalHeader>Confirm Verification</ModalHeader>
          <ModalBody>
            Are sure you want to {this.state.isdiseaseUnverify ? "verify" : "Unverify"} <b>{this.state?.diseseName}</b>?
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() =>
                this.setState({
                  showVerifyModal: !this.state.showVerifyModal,
                  diseseName: "",
                })
              }
            >
              Cancel
            </Button>
            <Button color="primary" onClick={() => this.handleVerifyDisease()}>
              Yes
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default List;
