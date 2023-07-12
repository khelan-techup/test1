import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Collapse,
  Fade,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { Steps } from "intro.js-react";
import axiosInstance from "./../../common/axiosInstance";
import updateTooltip from "./../../common/updateTooltip";
import ReactHtmlParser from "react-html-parser";
import { BE_Dashboard_GetAll, BE_Dashboard_GetMainAllcount, BE_OrganizationUser_UpdateTooltipSteps } from "../../common/allApiEndPoints";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.initialState = {
      loading: true,
      openSearch: true,
      //patients: [],
      searchString: "",
      slDelete: true,
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
      searchString: "",
      cardData: [],
      mainData: [],
      // allPatient: [],
      analysisList: [],
      anaDesignCount: 0,
      designCount: 0,
      anaDesign: [],
      manuCount: 0,
      manu: [],
      treatmentList: [],
      treatmentCount: 0,
      filterType: "",
      isView: false,
      isEdit: false,
      roleName: "",
      collapse: false,
      fadeIn: true,
      timeout: 300,
      collapseId: 0,
      SampleCollectionCount: 0,
      SampleList: "",
      allPatientSort: { accessionNo: "", patientName: "" },
      CardNumber: 5,
      role_Id: null,
      IssueList: [],
      onHoldCount: 0,
      issueCount: 0,
      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      sort: "asc",
      steps: [
        {
          element: "#dashboard",
          title: "Dashboard",
          intro:
            "The Dashboard is a high level overview of Orders, location in our process, health, and status. ",
          tooltipClass: "cssClassName1",
        },
        {
          element: "#activeOrders",
          title: "All Open Orders",
          intro:
            "These are the total number of orders that are currently in Active or On Hold status. ",
          tooltipClass: "cssClassName1",
        },
        {
          element: "#issues",

          title: "Orders with an Issue",
          tooltipClass: "cssClassName1",
          intro:
            "These are the total number of Active orders that are currently past an SLA and need to have immediate intervention to ensure they are not delaying the delivery of peptides for our patients.",
        },
        {
          element: "#analysisDesign",
          title: "Orders in Analysis & Design",

          tooltipClass: "cssClassName1",
          intro:
            "These are the total number of orders that are currently in Active or On Hold status and are in the Analysis & Design phase prior to going to manufacturing and treatment.          ",
        },
        {
          element: "#manufacturing",
          title: "Orders in Manufacturing & Delivery          ",
          intro:
            "These are the total number of orders that are currently in Active or On Hold status and are having the peptides manufactured or have not had treatments start yet.          ",

          tooltipClass: "cssClassName1",
        },
        {
          element: "#completedStopped ",
          title: "Orders Completed or Stopped",

          tooltipClass: "cssClassName1",
          intro:
            "These are the total number of orders that are currently in Completed, Cancelled or Deceased status.          ",
        },
        {
          element: "#searchbar ",
          title: "Search Patient",

          tooltipClass: "cssClassName1",
          intro:
            "This Search Bar allows the User to search in the various sections of the Dashboard.",
        },
        {
          element: "#viewpatient",
          tooltipClass: "cssClassName1",
          title: "View Patient Details",
          intro:
            "This is the unique patient number and a hyperlink to the patient and order details.",
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
    };
    this.state = this.initialState;
  }

  onExit = (e) => {
    console.log(e);
    this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 8 }));
    localStorage.setItem("isFirstLogin", false);
    this.sendCurrentStep();
  };
  onAfterChange = (newStepIndex) => {
    if (newStepIndex === 7) {
      const element = document.querySelector("#viewpatient");

      if (!element) this.myRef.current.introJs.nextStep();
    }
  };
  sendCurrentStep = () => {
    updateTooltip(this.state.currentStep, this.state.isSkipped);

    return;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken?.userId == null ? 0 : userToken?.userId;
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Dashboard/GetAll";

    // const url = apiroute + "/api/BE_OrganizationUser/UpdateTooltipSteps";
    const url = apiroute + BE_OrganizationUser_UpdateTooltipSteps;
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

    this.setState({ roleName: userToken.roleName, role_Id: userToken.roleId });

    //console.log(rights);
    if (rights?.length > 0) {
      let currentrights = rights.filter((role) => role.moduleId == 14);
      //console.log(currentrights);
      if (currentrights?.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited,
        });
        if (currentrights[0].isViewed) {
          // this.getListData(0);
          this.getDashboardListData(0);
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
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId == null ? 0 : userToken.userId;
    let isFirstLogin = JSON.parse(localStorage.getItem("isFirstLogin"));
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Dashboard/GetMainAllcount";
    const url = apiroute + BE_Dashboard_GetMainAllcount;
    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: userId,
      pageNo: pageNo,
      totalNo: 5, //window.$TotalRecord,
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
          var rData = result.data.outdata;

          this.setState({
            issueCount: rData?.patintData?.issueCount,
            anaDesignCount: rData.patintData.analysisDesignCount,
            manuCount: rData.patintData.manufacturingCount,
            treatmentCount: rData.patintData.completeCount,
            onHoldCount: rData.patintData.onHoldCount,
            allPatientCount: rData.patintData.registeredCount || 0,
            stepsEnabled: isFirstLogin,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
          // console.log(result.data.message);
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ authError: true, error: error, loading: false });
      });
  }
  // handleSortDate() {
  //   console.log(sortOrder);
  //   const sortedData =
  //     sortOrder === "asc"
  //       ? this.state.cardData.sort(
  //           (a, b) => new Date(a.orderDate) - new Date(b.orderDate)
  //         )
  //       : this.state.cardData.sort(
  //           (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  //         );
  //   console.log(sortedData);
  //   this.setState(sortedData);
  // }

  // sortOrder() {
  //   return 
  //   );
  // }
  getDashboardListData(PageNo) {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId == null ? 0 : userToken.userId;
    this.setState({ loading: true, cardData: [] });
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Dashboard/GetAll";
    const url = apiroute + BE_Dashboard_GetAll;
    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: userId,
      pageNo: PageNo,
      totalNo: 5, //window.$TotalRecord,
      stageType: this.state.CardNumber,
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
          var rData = result.data.outdata;

          const data = {
            IssueList: rData?.patintData?.issueList || [],
            analysisList: rData?.patintData?.analysisDesignList || [],
            // anaDesign: anaDesignDec,
            manu: rData?.patintData?.manuList || [],
            treatmentList: rData?.patintData?.completeList || [],
            allPatientsList: rData?.patintData?.allPatientsList || [],
            allHoldPatientsList: rData?.patintData?.allHoldPatientsList || [],
          };
          const mainData = [
            ...data.IssueList,
            ...data.analysisList,
            ...data.manu,
            ...data.treatmentList,
            ...data.allPatientsList,
            ...data.allHoldPatientsList,
          ];
          mainData.map((data) => {
            console.log(data.orderCreateDate);
          });
          this.setState(
            {
              // SampleList: sampleDecending,
              // IssueList: rData?.patintData?.issueList,
              // analysisList: rData?.patintData?.analysisDesignList,
              // // anaDesign: anaDesignDec,
              // manu: rData?.patintData?.manuList,
              // treatmentList: rData?.patintData?.completeList,

              mainData,
              cardData: mainData,

              searchString: "",
            },
            this.getListData(0)
          );
          // this.setState({
          //   //pagesCount: Math.ceil(result.data.totalRecord / 5),//window.$TotalRecord
          //   //patients: rData.patintData,
          //   analysisList: rData.patintData.analysisList,
          //   anaDesign: rData.patintData.designList,
          //   manu: rData.patintData.manufacturingList,
          //   // allPatientCount: rData.patintData.registeredCount,
          //   // SampleCollectionCount: rData.patintData.sampleCollectionCount,
          //   // anaDesignCount: rData.patintData.analysisCount,
          //   // designCount: rData.patintData.designCount,
          //   SampleList: rData.patintData.sampleList,
          //   treatmentList: rData.patintData.treatmentList,
          //   // anaDesignCount: rData.patintData.anaDesignCount,
          //   // manuCount: rData.patintData.manuCount,
          //   // treatmentCount: rData.patintData.treatmentCount,
          //   // pcount: rData.pcount,
          //   // prcount: rData.prcount,
          //   // icount: rData.icount,
          //   // lcount: rData.lcount,
          //   // mcount: rData.mcount,
          //   loading: false,
          // });
        } else {
          this.setState({ loading: false });
          // console.log(result.data.message);
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ authError: true, error: error, loading: false });
      });
  }

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

  // //search
  // filter = (e) => {
  //   if (e.key == "Enter") {
  //     const target = e.target;
  //     const value = target.value;

  //     this.setState(
  //       () => ({
  //         loading: true,
  //         currentPage: 0,
  //         currentIndex: 0,
  //         pagesCount: 0,
  //         //pageSize: window.$TotalRecord,
  //         searchString: value.trim(),
  //       }),
  //       function () {
  //         this.getListData(0);
  //       }
  //     );
  //   }
  // };

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
  // alphaDecending = (name) => {
  //   if (name == "accesionno") {
  //     const strAscending = [...this.state.SampleList].sort((a, b) =>
  //       a?.accessionNo > b?.accessionNo ? -1 : 1,
  //     );
  //     // console.log(strAscending);
  //     this.setState({
  //       SampleList: [...strAscending],
  //       // contactArrow: false,
  //       // accesionArrow: false
  //       // PractitionerArrow: true,
  //       // analysisArrow: true
  //     })
  //   }

  // }

  filter = (e) => {
    debugger
    if (e.key == "Enter" || 1) {
      this.setState({ loading: true });
      let target = e.target;
      let value = target?.value;
      let filteredData = this.state.mainData;

      if (value.trim() !== "") {
        const find = (value, search) =>
          String(value).toLowerCase().search(search.toLowerCase()) > -1;
        filteredData = filteredData.filter((e) => {
          return (
            find(e.accessionNo, value) ||
            find(e.patientName, value) ||
            find(e.diseaseName, value) ||
            find(e?.email, value)
          );
        });
      }
      this.setState({
        cardData: filteredData,
        loading: false,
        searchString: value,
      });
    }
  };

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
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5
              className="mt-2"
              id="dashboard"
              style={{ width: "fit-content" }}
            >
              <i className="fa fa-align-justify"></i> Dashboard
            </h5>
          </Col>
          <Col xs="2" lg="2"></Col>
        </Row>
        {/* <Row>
          <Col
            xs="6"
            sm="4"
            lg="2"
            style={{ cursor: "pointer" }}
            onClick={() => this.setState({ filterType: "" })}
          >
            <Card className="text-white bg-primary">
              <CardBody>
                <div className="text-value">
                  {pcount === undefined ? 0 : pcount}
                </div>
                <div>Patients</div>
              </CardBody>
            </Card>
          </Col>

          <Col xs="6" sm="4" lg="2">
            <Card className="text-white bg-info">
              <CardBody>
                <div className="text-value">
                  {prcount === undefined ? 0 : prcount}
                </div>
                <div>Practitioners</div>
              </CardBody>
            </Card>
          </Col>

          <Col xs="6" sm="4" lg="2">
            <Card className="text-white bg-secondary">
              <CardBody>
                <div className="text-value">
                  {icount === undefined ? 0 : icount}
                </div>
                <div>Institutions</div>
              </CardBody>
            </Card>
          </Col>

          <Col xs="6" sm="4" lg="2">
            <Card className="text-white bg-warning">
              <CardBody>
                <div className="text-value">
                  {lcount === undefined ? 0 : lcount}
                </div>
                <div>Laboratories</div>
              </CardBody>
            </Card>
          </Col>

          <Col xs="6" sm="4" lg="2">
            <Card className="text-white bg-danger">
              <CardBody>
                <div className="text-value">
                  {mcount === undefined ? 0 : mcount}
                </div>
                <div>Manufacturers</div>
              </CardBody>
            </Card>
          </Col>

          <Col xs="6" sm="4" lg="2">
            <Card className="text-white bg-success">
              <CardBody>
                <div className="text-value">0</div>
                <div>Shippers</div>
              </CardBody>
            </Card>
          </Col>
        </Row> */}

        {/* <Row></Row> */}
        {/* <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Patients
            </h5>
          </Col>
          <Col xs="2" lg="2">
            {this.state.isEdit ? (
              <Link to="/patients/details">
                <button className="btn btn-primary btn-block">
                  Add New Patient
                </button>
              </Link>
            ) : null}
          </Col>
        </Row> */}
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
          <i className="fa fa-question" aria-hidden="true"></i>
        </button>

        {/* <div className="controls">
          <div>
            <button onClick={this.toggleSteps}>Toggle Steps</button>
            <button onClick={this.addStep}>Add Step</button>
          </div>
          <div>
            <button onClick={this.toggleHints}>Toggle Hints</button>
            <button onClick={this.addHint}>Add Hint</button>
          </div>
        </div> */}

        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                {/* <p className="  ">
                  <span className="h5 font-weight-bold ">Total Registered: <span style={{ cursor: "auto" }} className="btn btn-primary btn-sm btn-pill">
                    <span className="h5">
                      {
                        allPatientCount > 0 ?
                          allPatientCount
                          : 0
                      }
                    </span>
                  </span>
                  </span>
                </p> */}

                <Row>
                  <Col xs="2">
                    {/*<Input type="select" name="slDelete" onChange={this.handleChange}>*/}
                    {/*  <option value="true">Active</option>*/}
                    {/*  <option value="false">Inactive</option>*/}
                    {/*</Input>*/}
                  </Col>
                  <Col xs="4"></Col>

                  {/* <Col xs="6">
                    {this.state.openSearch ? (
                      <div className="searchBox">
                        <input
                          type="text"
                          placeholder="Search by Accession No."
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
                  </Col> */}
                </Row>
                <br />
                <Row
                  className=" justify-content-between"
                  style={{ paddingLeft: 20, paddingRight: 20 }}
                >
                  {/* Registered */}
                  {/* <Col
                    xs="6"
                    sm="4"
                    lg="2"
                    // onClick={() => this.setState({ filterType: "A" })}
                    style={{ cursor: "pointer" }}
                  > */}
                  {/* <Card
                    onClick={() => this.setState({ filterType: "E" })}

                    style={{
                      backgroundColor: "#E2F0D9",
                      width: 150,
                    }}
                  >
                    <CardBody>
                      <div className="text-value text-center">{this.state.SampleCollectionCount}</div>
                      <div className="text-center">In Samples</div>
                    </CardBody>
                   
                  </Card> */}
                  <Card
                    aria-disabled
                    className="bg-success"
                    onClick={() =>
                      this.setState({ filterType: "E", CardNumber: 5 }, () => {
                        this.getDashboardListData(0);
                      })
                    }
                    style={{
                      // backgroundColor: "#E2F0D9",
                      width: 150,
                      cursor: "pointer",
                    }}
                  >
                    <CardBody id="activeOrders">
                      <div className="text-value text-center">
                        {allPatientCount}
                      </div>
                      <div className="text-center">All Open Orders</div>
                    </CardBody>
                  </Card>

                  <Card
                    className="bg-danger"
                    onClick={() =>
                      this.setState({ filterType: "A", CardNumber: 1 }, () => {
                        this.getDashboardListData(0);
                      })
                    }
                    style={{
                      // backgroundColor: "#E2F0D9",
                      width: 150,
                      cursor: "pointer",
                    }}
                  >
                    <CardBody id="issues">
                      <div className="text-value text-center">
                        {this.state.issueCount ?? 0}
                      </div>
                      <div className="text-center">Orders with an Issue</div>
                    </CardBody>
                  </Card>
                  <Card
                    onClick={() =>
                      this.setState({ filterType: "F", CardNumber: 6 }, () => {
                        this.getDashboardListData(0);
                      })
                    }
                    style={{
                      backgroundColor: "#FFCCCC",
                      width: 150,
                      cursor: "pointer",
                    }}
                  >
                    <CardBody id="issues">
                      <div className="text-value text-center">
                        {this.state.onHoldCount ?? 0}
                      </div>
                      <div className="text-center">On Hold Orders</div>
                    </CardBody>
                  </Card>
                  {/* 
                  <Card
                    onClick={() => {
                      this.setState({ filterType: "B", CardNumber: 2 }, () => {
                        this.getDashboardListData(0);
                      });
                    }}
                    style={{
                      backgroundColor: "#DAE3F3",
                      width: 150,
                      cursor: "pointer",
                    }}
                  >
                    <CardBody id="analysisDesign">
                      <div className="text-value text-center">
                        {anaDesignCount ?? 0}
                      </div>
                      <div className="text-center">
                        Orders in Analysis & Design
                      </div>
                    </CardBody>
                  </Card> */}

                  {/* <Card
                    style={{
                      backgroundColor: "#FBE5D6",
                      width: 150,
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      this.setState({ filterType: "C", CardNumber: 3 }, () => {
                        this.getDashboardListData(0);
                      })
                    }
                  >
                    <CardBody id="manufacturing">
                      <div className="text-value text-center">
                        {manuCount ?? 0}
                      </div>
                      <div className="text-center">
                        Orders in Manufacturing & Delivery
                      </div>
                    </CardBody>
                  </Card> */}

                  <Card
                    onClick={() =>
                      this.setState({ filterType: "D", CardNumber: 4 }, () => {
                        this.getDashboardListData(0);
                      })
                    }
                    style={{
                      backgroundColor: "#F4F7DB",
                      width: 150,
                      cursor: "pointer",
                    }}
                  >
                    <CardBody id="completedStopped">
                      <div className="text-value text-center">
                        {treatmentCount ?? 0}
                      </div>
                      <div className="text-center">
                        Orders Completed or Stopped
                      </div>
                    </CardBody>
                  </Card>
                </Row>
              </CardHeader>
              <CardBody>
                {authError ? <p>{error.message}</p> : null}

                {filterType == "E" || filterType == "" ? (
                  <Col
                    xs="12"
                    sm="12"
                    md="12"
                    key="6"
                    style={{ fontSize: "0.72rem" }}
                  >
                    <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                      <Card style={{ border: "1px solid #379457" }}>
                        <CardHeader
                          className="bg-success"
                          style={{
                            color: "#fff",
                            // backgroundColor: "#379457",
                            cursor: "",
                          }}
                          onClick={() => this.setCollapse(5)}
                        >
                          <Row style={{ fontSize: "16px" }}>
                            <Col md="7">All Open Orders</Col>
                            <Col md="5">
                              {this.state?.openSearch ? (
                                <div className="searchBox">
                                  <input
                                    id="searchbar"
                                    type="text"
                                    placeholder="Search in All Open Orders..."
                                    // onKeyPress={this.filter}
                                    onChange={this.filter}
                                  />
                                  <Link
                                    className="closeSearch"
                                    to="#"
                                    onClick={() =>
                                      this.setState({ openSearch: false })
                                    }
                                  >
                                    <i className="fa fa-close" />
                                  </Link>
                                </div>
                              ) : (
                                <div
                                  className="search"
                                  onClick={() =>
                                    this.setState({ openSearch: true })
                                  }
                                >
                                  <i className="fa fa-search" />
                                </div>
                              )}
                            </Col>
                          </Row>
                        </CardHeader>
                        <Collapse
                          isOpen={
                            filterType == "E" || filterType == ""
                              ? true
                              : 5 == collapseId
                          }
                          id="collapseExample"
                        >
                          <CardBody>
                            <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                              <thead
                                style={{
                                  backgroundColor: "#1C3A84",
                                  color: "white",
                                  fontSize: "16px",
                                }}
                              >
                                <tr>
                                  <th className="w-25">Patient Orders</th>

                                  <th className="w-35">Neo7 Analysis Type</th>
                                  <th className="w-25">
                                    Order Date
                                    {this.state.sort === "asc" ? (
                                      <i
                                        className="fa ml-2 fa-arrow-down"
                                        onClick={() =>
                                          this.setState({
                                            cardData: this.state.cardData.sort(
                                              (a, b) => new Date(a.orderDate) - new Date(b.orderDate)
                                            ),
                                            sort: "desc",
                                          })
                                        }
                                      ></i>
                                    ) : (
                                      <i
                                        className="fa ml-2 fa-arrow-up"
                                        onClick={() =>
                                          this.setState({
                                            cardData: this.state.cardData.sort(
                                              (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                                            ),
                                            sort: "asc",
                                          })
                                        }
                                      ></i>)}
                                  </th>

                                  <th style={{ width: "11%" }}>CC. Rep</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.cardData?.length > 0 ? (
                                  this.state.cardData.map((mdata, p) => {
                                    return (
                                      <tr key={p}>
                                        <td>
                                          <div className="d-flex flex-column">
                                            <span>
                                              {mdata.accessionNo != "" &&
                                                mdata.accessionNo != null ? (
                                                // roleName == "Neo Admin" ||
                                                //   roleName == "Admin" || this.state.role_Id==5
                                                this.state.role_Id == 5 ||
                                                  this.state.role_Id == 1 ||
                                                  this.state.role_Id == 4 ? (
                                                  <>
                                                    <Link
                                                      id="viewpatient"
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/admininfo/" +
                                                        mdata.patientId +
                                                        "/" +
                                                        mdata.patientAccessionId
                                                      }
                                                    >
                                                      {mdata?.accessionNo}
                                                      {/* {mdata.accessionNo.replace(
                                                            /-/g,
                                                            ""
                                                          )} */}
                                                    </Link>
                                                    <br />
                                                    <span>
                                                      <b>
                                                        {mdata.accessionNo !=
                                                          null
                                                          ? !!mdata?.accessionStatus
                                                            ? ` (${mdata?.accessionStatus})`
                                                            : ""
                                                          : ""}
                                                      </b>
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Link
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/info/" +
                                                        mdata.patientId +
                                                        "/" +
                                                        mdata.patientAccessionId
                                                      }
                                                    >
                                                      {mdata?.accessionNo}
                                                      {/* {mdata.accessionNo.replace(
                                                          /-/g,
                                                          ""
                                                        )} */}
                                                    </Link>
                                                    <br />
                                                    <span>
                                                      <b>
                                                        {mdata.accessionNo !=
                                                          null
                                                          ? ` (${mdata?.accessionStatus})`
                                                          : ""}
                                                      </b>
                                                    </span>
                                                  </>
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </span>
                                            {/* <span>
                                                {mdata.patientName}

                                              </span> */}
                                          </div>
                                        </td>

                                        <td>
                                          <div className="text-start">
                                            <span className="my-1">
                                              {mdata?.diseaseCategory}
                                            </span>
                                            {mdata?.diseaseName == "" ||
                                              mdata?.diseaseName == undefined ||
                                              mdata?.diseaseName ==
                                              null ? null : mdata?.diseaseCategory !==
                                                mdata?.diseaseName ? (
                                              <span className="border btn btn-sm mx-1 my-1 px-2 rounded-pill">
                                                {!mdata?.diseaseName
                                                  ? null
                                                  : mdata?.diseaseName}
                                              </span>
                                            ) : null}

                                            {mdata?.isMetastasis == true ? (
                                              <span className="my-1 ">
                                                {mdata?.isMetastasis == true ? (
                                                  <span className="text-danger font-weight-bold">
                                                    - Metastasis
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                              </span>
                                            ) : null}
                                          </div>
                                        </td>
                                        <td>{mdata?.orderCreateDate}</td>
                                        <td>{mdata?.ccName}</td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="tdCenter">
                                      No record(s) to show !!!
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </CardBody>
                        </Collapse>
                      </Card>
                    </Fade>
                  </Col>
                ) : null}

                {filterType == "F" ? (
                  <Col
                    xs="12"
                    sm="12"
                    md="12"
                    key="6"
                    style={{ fontSize: "0.72rem" }}
                  >
                    <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                      <Card style={{ border: "1px solid #F4F7DB" }}>
                        <CardHeader
                          // className="bg-danger"
                          style={{
                            // backgroundColor: "#E2F0D9",
                            backgroundColor: "#FFCCCC",
                            cursor: "",
                          }}
                          onClick={() => this.setCollapse(6)}
                        >
                          <Row style={{ fontSize: "16px" }}>
                            <Col md="7">On Hold Orders</Col>
                            <Col md="5">
                              {this.state?.openSearch ? (
                                <div className="searchBox">
                                  <input
                                    type="text"
                                    placeholder="Search in On Hold Orders..."
                                    // onKeyPress={this.filter}
                                    onChange={this.filter}
                                  // onKeyDown={this.filter}
                                  />
                                  <Link
                                    className="closeSearch"
                                    to="#"
                                    onClick={() =>
                                      this.setState({ openSearch: false })
                                    }
                                  >
                                    <i className="fa fa-close" />
                                  </Link>
                                </div>
                              ) : (
                                <div
                                  className="search"
                                  onClick={() =>
                                    this.setState({ openSearch: true })
                                  }
                                >
                                  <i className="fa fa-search" />
                                </div>
                              )}
                            </Col>
                          </Row>
                        </CardHeader>
                        <Collapse
                          isOpen={filterType == "F" ? true : 6 == collapseId}
                          id="collapseExample"
                        >
                          <CardBody>
                            <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                              <thead
                                style={{
                                  backgroundColor: "#1C3A84",
                                  color: "white",
                                  fontSize: "16px",
                                }}
                              >
                                <tr>
                                  <th style={{ width: "20%" }}>
                                    Patient Orders
                                  </th>

                                  <th style={{ width: "20%" }}>
                                    Neo7 Analysis Type
                                  </th>
                                  <th style={{ width: "20%" }}>Order Date  {this.state.sort === "asc" ? (
                                    <i
                                      className="fa fa-arrow-down"
                                      onClick={() =>
                                        this.setState({
                                          cardData: this.state.cardData.sort(
                                            (a, b) => new Date(a.orderDate) - new Date(b.orderDate)
                                          ),
                                          sort: "desc",
                                        })
                                      }
                                    ></i>
                                  ) : (
                                    <i
                                      className="fa fa-arrow-up"
                                      onClick={() =>
                                        this.setState({
                                          cardData: this.state.cardData.sort(
                                            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                                          ),
                                          sort: "asc",
                                        })
                                      }
                                    ></i>)}</th>
                                  <th style={{ width: "20%" }}>CC. Rep</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.cardData?.length > 0 ? (
                                  this.state.cardData.map((mdata, p) => {
                                    return (
                                      <tr key={p}>
                                        <td>
                                          <div className="d-flex flex-column">
                                            <span>
                                              {mdata.accessionNo != "" &&
                                                mdata.accessionNo != null ? (
                                                // roleName == "Neo Admin" ||
                                                //   roleName == "Admin" || this.state.role_Id==5
                                                this.state.role_Id == 5 ||
                                                  this.state.role_Id == 1 ||
                                                  this.state.role_Id == 4 ? (
                                                  <>
                                                    <Link
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/admininfo/" +
                                                        mdata.patientId +
                                                        "/" +
                                                        mdata.patientAccessionId
                                                      }
                                                    >
                                                      {mdata?.accessionNo}
                                                      {/* {mdata.accessionNo.replace(
                                                            /-/g,
                                                            ""
                                                          )} */}
                                                    </Link>
                                                    <br />
                                                    <span>
                                                      <b>
                                                        {mdata.accessionNo !=
                                                          null
                                                          ? !!mdata?.accessionStatus
                                                            ? ` (${mdata?.accessionStatus})`
                                                            : ""
                                                          : ""}
                                                      </b>
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Link
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/info/" +
                                                        mdata.patientId +
                                                        "/" +
                                                        mdata.patientAccessionId
                                                      }
                                                    >
                                                      {mdata?.accessionNo}
                                                      {/* {mdata.accessionNo.replace(
                                                          /-/g,
                                                          ""
                                                        )} */}
                                                    </Link>
                                                    <br />
                                                    <span>
                                                      <b>
                                                        {mdata.accessionNo !=
                                                          null
                                                          ? ` (${mdata?.accessionStatus})`
                                                          : ""}
                                                      </b>
                                                    </span>
                                                  </>
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </span>
                                            {/* <span>
                                                {mdata.patientName}

                                              </span> */}
                                          </div>
                                        </td>

                                        <td>
                                          <div className="text-start">
                                            <span className="my-1">
                                              {mdata?.diseaseCategory}
                                            </span>
                                            {mdata?.diseaseName == "" ||
                                              mdata?.diseaseName == undefined ||
                                              mdata?.diseaseName ==
                                              null ? null : mdata?.diseaseCategory !==
                                                mdata?.diseaseName ? (
                                              <div className="border btn btn-sm mx-1 my-1 px-2 rounded-pill">
                                                {!mdata?.diseaseName
                                                  ? null
                                                  : mdata?.diseaseName}
                                              </div>
                                            ) : null}

                                            {mdata?.isMetastasis == true ? (
                                              <span className="my-1 ">
                                                {mdata?.isMetastasis == true ? (
                                                  <span className="text-danger font-weight-bold">
                                                    - Metastasis
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                              </span>
                                            ) : null}
                                          </div>

                                          {/* {mdata.diseaseCategory
                                              // + " " + mdata.DiseaseName + " " + mdata.IsMetastasis == true ? <span className="text-danger">- Metastasis</span> : ""

                                            } */}
                                        </td>
                                        <td>{mdata?.orderCreateDate}</td>
                                        <td>{mdata?.ccName}</td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="tdCenter">
                                      No record(s) to show !!!
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </CardBody>
                        </Collapse>
                      </Card>
                    </Fade>
                  </Col>
                ) : null}

                {filterType == "A" ? (
                  <Col
                    xs="12"
                    sm="12"
                    md="12"
                    key="6"
                    style={{ fontSize: "0.72rem" }}
                  >
                    <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                      <Card style={{ border: "1px solid #F4F7DB" }}>
                        <CardHeader
                          className="bg-danger"
                          style={{
                            // backgroundColor: "#E2F0D9",
                            cursor: "",
                          }}
                          onClick={() => this.setCollapse(1)}
                        >
                          <Row style={{ fontSize: "16px" }}>
                            <Col md="7">Orders with an Issue</Col>
                            <Col md="5">
                              {this.state?.openSearch ? (
                                <div className="searchBox">
                                  <input
                                    type="text"
                                    placeholder="Search in Issue..."
                                    // onKeyPress={this.filter}
                                    onChange={this.filter}
                                  />
                                  <Link
                                    className="closeSearch"
                                    to="#"
                                    onClick={() =>
                                      this.setState({ openSearch: false })
                                    }
                                  >
                                    <i className="fa fa-close" />
                                  </Link>
                                </div>
                              ) : (
                                <div
                                  className="search"
                                  onClick={() =>
                                    this.setState({ openSearch: true })
                                  }
                                >
                                  <i className="fa fa-search" />
                                </div>
                              )}
                            </Col>
                          </Row>
                        </CardHeader>
                        <Collapse
                          isOpen={filterType == "A" ? true : 1 == collapseId}
                          id="collapseExample"
                        >
                          <CardBody>
                            <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                              <thead
                                style={{
                                  backgroundColor: "#1C3A84",
                                  color: "white",
                                  fontSize: "16px",
                                }}
                              >
                                <tr>
                                  <th style={{ width: "20%" }}>
                                    Patient Orders
                                  </th>
                                  <th style={{ width: "20%" }}>Issue</th>
                                  <th style={{ width: "20%" }}>
                                    Neo7 Analysis Type
                                  </th>
                                  <th style={{ width: "20%" }}>Order Date  {this.state.sort === "asc" ? (
                                    <i
                                      className="fa fa-arrow-down"
                                      onClick={() =>
                                        this.setState({
                                          cardData: this.state.cardData.sort(
                                            (a, b) => new Date(a.orderDate) - new Date(b.orderDate)
                                          ),
                                          sort: "desc",
                                        })
                                      }
                                    ></i>
                                  ) : (
                                    <i
                                      className="fa fa-arrow-up"
                                      onClick={() =>
                                        this.setState({
                                          cardData: this.state.cardData.sort(
                                            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                                          ),
                                          sort: "asc",
                                        })
                                      }
                                    ></i>)}</th>
                                  <th style={{ width: "20%" }}>CC. Rep</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.cardData?.length > 0 ? (
                                  this.state.cardData.map((mdata, p) => {
                                    return (
                                      <tr key={p}>
                                        <td>
                                          <div className="d-flex flex-column">
                                            <span>
                                              {mdata.accessionNo != "" &&
                                                mdata.accessionNo != null ? (
                                                // roleName == "Neo Admin" ||
                                                //   roleName == "Admin" || this.state.role_Id==5
                                                this.state.role_Id == 5 ||
                                                  this.state.role_Id == 1 ||
                                                  this.state.role_Id == 4 ? (
                                                  <>
                                                    <Link
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/admininfo/" +
                                                        mdata.patientId +
                                                        "/" +
                                                        mdata.patientAccessionId
                                                      }
                                                    >
                                                      {mdata?.accessionNo}
                                                      {/* {mdata.accessionNo.replace(
                                                            /-/g,
                                                            ""
                                                          )} */}
                                                    </Link>
                                                    <br />
                                                    <span>
                                                      <b>
                                                        {mdata.accessionNo !=
                                                          null
                                                          ? !!mdata?.accessionStatus
                                                            ? ` (${mdata?.accessionStatus})`
                                                            : ""
                                                          : ""}
                                                      </b>
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Link
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/info/" +
                                                        mdata.patientId +
                                                        "/" +
                                                        mdata.patientAccessionId
                                                      }
                                                    >
                                                      {mdata?.accessionNo}
                                                      {/* {mdata.accessionNo.replace(
                                                          /-/g,
                                                          ""
                                                        )} */}
                                                    </Link>
                                                    <br />
                                                    <span>
                                                      <b>
                                                        {mdata.accessionNo !=
                                                          null
                                                          ? ` (${mdata?.accessionStatus})`
                                                          : ""}
                                                      </b>
                                                    </span>
                                                  </>
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </span>
                                            {/* <span>
                                                {mdata.patientName}

                                              </span> */}
                                          </div>
                                        </td>

                                        <td>
                                          <div className="text-start ">
                                            {/* <span className=" border btn btn-sm mx-1 my-1 px-2  rounded-pill" style={{ background: "#e6a7b2", fontWeight: "700" }} > */}
                                            {ReactHtmlParser(
                                              mdata?.redMessage || "<p></p>"
                                            )}
                                            {/* </span> */}
                                            {/* <span className=" border btn btn-sm mx-1 my-1 px-2  rounded-pill" style={{ background: "#7F00BE ", fontWeight: "700" }} > */}
                                            {/* {(mdata?.redMessage)?.split?.(",").map((msg) => {
                                              let color = "#7F00BE"

                                              if (msg == "Analysis Payment Not Received") {
                                                color = "#e6a7b2"
                                              }
                                              return <span className=" border btn btn-sm mx-1 my-1 px-2  rounded-pill" style={{ background: color, fontWeight: "700", fontSize: "10px" }} >{msg}</span>


                                            })} */}
                                            {/* {mdata?.redMessage} */}
                                            {/* </span> */}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="text-start">
                                            <span className="my-1">
                                              {mdata?.diseaseCategory}
                                            </span>
                                            {mdata?.diseaseName == "" ||
                                              mdata?.diseaseName == undefined ||
                                              mdata?.diseaseName ==
                                              null ? null : mdata?.diseaseCategory !==
                                                mdata?.diseaseName ? (
                                              <div className="border btn btn-sm mx-1 my-1 px-2 rounded-pill">
                                                {!mdata?.diseaseName
                                                  ? null
                                                  : mdata?.diseaseName}
                                              </div>
                                            ) : null}

                                            {mdata?.isMetastasis == true ? (
                                              <span className="my-1 ">
                                                {mdata?.isMetastasis == true ? (
                                                  <span className="text-danger font-weight-bold">
                                                    - Metastasis
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                              </span>
                                            ) : null}
                                          </div>

                                          {/* {mdata.diseaseCategory
                                              // + " " + mdata.DiseaseName + " " + mdata.IsMetastasis == true ? <span className="text-danger">- Metastasis</span> : ""

                                            } */}
                                        </td>
                                        <td>{mdata?.orderCreateDate}</td>
                                        <td>{mdata?.ccName}</td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="tdCenter">
                                      No record(s) to show !!!
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </CardBody>
                        </Collapse>
                      </Card>
                    </Fade>
                  </Col>
                ) : null}

                {/* Analysis */}
                {/* {filterType == "B" ? (
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
                          onClick={() => this.setCollapse(2)}
                        >
                          <Row style={{ fontSize: "16px" }}>
                            <Col md="7">Orders in Analysis & Design</Col>
                            <Col md="5">
                              {this.state?.openSearch ? (
                                <div className="searchBox">
                                  <input
                                    type="text"
                                    placeholder="Search in Analysis and Design..."
                                    onKeyPress={this.filter}
                                  />
                                  <Link
                                    className="closeSearch"
                                    to="#"
                                    onClick={() =>
                                      this.setState({ openSearch: false })
                                    }
                                  >
                                    <i className="fa fa-close" />
                                  </Link>
                                </div>
                              ) : (
                                <div
                                  className="search"
                                  onClick={() =>
                                    this.setState({ openSearch: true })
                                  }
                                >
                                  <i className="fa fa-search" />
                                </div>
                              )}
                            </Col>
                          </Row>
                        </CardHeader>
                        <Collapse
                          isOpen={filterType == "B" ? true : 2 == collapseId}
                          id="collapseExample"
                        >
                          <CardBody>
                            <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                              <thead
                                style={{
                                  backgroundColor: "#1C3A84",
                                  color: "white",
                                  fontSize: "16px",
                                }}
                              >
                                <tr>
                                  <th className="w-25">Patient Orders</th>
                                  <th className="w-35">Neo7 Analysis Type</th>
                                  <th className="w-25">Order Date</th>
                                  <th style={{ width: "11%" }}>CC. Rep</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.cardData?.length > 0 ? (
                                  this.state.cardData.map((adata, p) => {
                                    return (
                                      <tr key={p}>
                                        <td>
                                          <div className="d-flex flex-column">
                                            <span>
                                              {adata.accessionNo != "" &&
                                                adata.accessionNo != null ? (
                                                // roleName == "Neo Admin" ||
                                                //   roleName == "Admin" || this.state.role_Id==5
                                                this.state.role_Id == 5 ||
                                                  this.state.role_Id == 1 ||
                                                  this.state.role_Id == 4 ? (
                                                  <>
                                                    <Link
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/admininfo/" +
                                                        adata.patientId +
                                                        "/" +
                                                        adata.patientAccessionId
                                                      }
                                                    >
                                                      {adata.accessionNo.replace(
                                                        /-/g,
                                                        ""
                                                      )}
                                                    </Link>
                                                    <br />
                                                    <span>
                                                      <b>
                                                        {adata.accessionNo !=
                                                          null
                                                          ? !!adata?.accessionStatus
                                                            ? ` (${adata?.accessionStatus})`
                                                            : ""
                                                          : ""}
                                                      </b>
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Link
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/info/" +
                                                        adata.patientId +
                                                        "/" +
                                                        adata.patientAccessionId
                                                      }
                                                    >
                                                      {adata.accessionNo.replace(
                                                        /-/g,
                                                        ""
                                                      )}
                                                    </Link>
                                                    <br />
                                                    <span>
                                                      <b>
                                                        {adata.accessionNo !=
                                                          null
                                                          ? !!adata?.accessionStatus
                                                            ? ` (${adata?.accessionStatus})`
                                                            : ""
                                                          : ""}
                                                      </b>
                                                    </span>
                                                  </>
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </span>
                                          </div>
                                        </td>

                                        <td className="">
                                          <div className="text-start">
                                            <span className="my-1">
                                              {adata?.diseaseCategory}
                                            </span>
                                            {adata?.diseaseName == "" ||
                                              adata?.diseaseName == undefined ||
                                              adata?.diseaseName ==
                                              null ? null : adata?.diseaseCategory !==
                                                adata?.diseaseName ? (
                                              <span className="border btn btn-sm mx-1 my-1 px-2 rounded-pill">

                                                {!adata?.diseaseName
                                                  ? null
                                                  : adata?.diseaseName}
                                              </span>
                                            ) : null}
                                            {adata?.isMetastasis == true ? (
                                              <span className=" my-1">
                                                {adata?.isMetastasis == true ? (
                                                  <span className="text-danger font-weight-bold">
                                                    - Metastasis
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                              </span>
                                            ) : null}

                                          </div>

                               
                                        </td>
                                        <td>{adata?.orderCreateDate}</td>
                                        <td>{adata?.ccName}</td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="tdCenter">
                                      No record(s) to show !!!
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </CardBody>
                        </Collapse>
                      </Card>
                    </Fade>
                  </Col>
                ) : null} */}

                {/* Design */}

                {/* Manufacturing */}
                {/* {filterType == "C" ? (
                  <Col
                    xs="12"
                    sm="12"
                    md="12"
                    key="3"
                    style={{ fontSize: "0.72rem" }}
                  >
                    <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                      <Card style={{ border: "1px solid #FBE5D6" }}>
                        <CardHeader
                          style={{
                            backgroundColor: "#FBE5D6",
                            cursor: "pointer",
                          }}
                          onClick={() => this.setCollapse(3)}
                        >
                          <Row style={{ fontSize: "16px" }}>
                            <Col md="7">Orders in Manufacturing & Delivery</Col>
                            <Col md="5">
                              {this.state?.openSearch ? (
                                <div className="searchBox">
                                  <input
                                    type="text"
                                    placeholder="Search in Manufacturing..."
                                    onKeyPress={this.filter}
                                  />
                                  <Link
                                    className="closeSearch"
                                    to="#"
                                    onClick={() =>
                                      this.setState({ openSearch: false })
                                    }
                                  >
                                    <i className="fa fa-close" />
                                  </Link>
                                </div>
                              ) : (
                                <div
                                  className="search"
                                  onClick={() =>
                                    this.setState({ openSearch: true })
                                  }
                                >
                                  <i className="fa fa-search" />
                                </div>
                              )}
                            </Col>
                          </Row>
                        </CardHeader>
                        <Collapse
                          isOpen={filterType == "C" ? true : 3 == collapseId}
                          id="collapseExample"
                        >
                          <CardBody>
                            <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                              <thead
                                style={{
                                  backgroundColor: "#1C3A84",
                                  color: "white",
                                  fontSize: "16px",
                                }}
                              >
                                <tr>
                                  <th className="w-25">Patient Orders</th>
                                  <th className="w-35">Neo7 Analysis Type</th>
                                  <th className="w-25">Order Date</th>
                                  <th style={{ width: "11%" }}>CC. Rep</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.cardData?.length > 0 ? (
                                  this.state.cardData.map((mdata, p) => {
                                    return (
                                      <tr key={p}>
                                        <td>
                                          <div className="d-flex flex-column">
                                            <span>
                                              {mdata.accessionNo != "" &&
                                                mdata.accessionNo != null ? (
                                         
                                                this.state.role_Id == 5 ||
                                                  this.state.role_Id == 1 ||
                                                  this.state.role_Id == 4 ? (
                                                  <>
                                                    <Link
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/admininfo/" +
                                                        mdata.patientId +
                                                        "/" +
                                                        mdata.patientAccessionId
                                                      }
                                                    >
                                                      {mdata.accessionNo.replace(
                                                        /-/g,
                                                        ""
                                                      )}
                                                    </Link>
                                                    <br />
                                                    <span>
                                                      <b>
                                                        {mdata.accessionNo !=
                                                          null
                                                          ? !!mdata?.accessionStatus
                                                            ? ` (${mdata?.accessionStatus})`
                                                            : ""
                                                          : ""}
                                                      </b>
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Link
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/info/" +
                                                        mdata.patientId +
                                                        "/" +
                                                        mdata.patientAccessionId
                                                      }
                                                    >
                                                      {mdata.accessionNo.replace(
                                                        /-/g,
                                                        ""
                                                      )}
                                                    </Link>
                                                    <br />
                                                    <span>
                                                      <b>
                                                        {mdata.accessionNo !=
                                                          null
                                                          ? !!mdata?.accessionStatus
                                                            ? ` (${mdata?.accessionStatus})`
                                                            : ""
                                                          : ""}
                                                      </b>
                                                    </span>
                                                  </>
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </span>
                                          </div>
                                        </td>

                                        <td>
                                          <div className="text-start">
                                            <span className="my-1">
                                              {mdata?.diseaseCategory}
                                            </span>
                                            {mdata?.diseaseName == "" ||
                                              mdata?.diseaseName == undefined ||
                                              mdata?.diseaseName ==
                                              null ? null : mdata?.diseaseCategory !==
                                                mdata?.diseaseName ? (
                                              <span className="border btn btn-sm mx-1 my-1 px-2 rounded-pill">
                                                {
                                                  // mdata?.diseaseName
                                                  !mdata?.diseaseName
                                                    ? null
                                                    : mdata?.diseaseName
                                                }
                                              </span>
                                            ) : null}

                                            {mdata?.isMetastasis == true ? (
                                              <span className="my-1">
                                                {mdata?.isMetastasis == true ? (
                                                  <span className="text-danger font-weight-bold">
                                                    - Metastasis
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                              </span>
                                            ) : null}
                                          </div>
                                        </td>
                                        <td>{mdata?.orderCreateDate}</td>
                                        <td>{mdata?.ccName}</td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="tdCenter">
                                      No record(s) to show !!!
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </CardBody>
                        </Collapse>
                      </Card>
                    </Fade>
                  </Col>
                ) : null} */}
                {/* Treatment */}
                {filterType == "D" ? (
                  <Col
                    xs="12"
                    sm="12"
                    md="12"
                    key="4"
                    style={{ fontSize: "0.72rem" }}
                  >
                    <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                      <Card style={{ border: "1px solid #F4F7DB" }}>
                        <CardHeader
                          style={{
                            backgroundColor: "#F4F7DB",
                            cursor: "",
                          }}
                          onClick={() => this.setCollapse(4)}
                        >
                          <Row style={{ fontSize: "16px" }}>
                            <Col md="7">Orders Completed or Stopped</Col>
                            <Col md="5">
                              {this.state?.openSearch ? (
                                <div className="searchBox">
                                  <input
                                    type="text"
                                    placeholder="Search in Completed..."
                                    // onKeyPress={this.filter}
                                    onChange={this.filter}
                                  />
                                  <Link
                                    className="closeSearch"
                                    to="#"
                                    onClick={() =>
                                      this.setState({ openSearch: false })
                                    }
                                  >
                                    <i className="fa fa-close" />
                                  </Link>
                                </div>
                              ) : (
                                <div
                                  className="search"
                                  onClick={() =>
                                    this.setState({ openSearch: true })
                                  }
                                >
                                  <i className="fa fa-search" />
                                </div>
                              )}
                            </Col>
                          </Row>
                        </CardHeader>
                        <Collapse
                          isOpen={filterType == "D" ? true : 4 == collapseId}
                          id="collapseExample"
                        >
                          <CardBody>
                            <Table className="table table-hover table-outline mb-0 d-none d-sm-table">
                              <thead
                                style={{
                                  backgroundColor: "#1C3A84",
                                  color: "white",
                                  fontSize: "16px",
                                }}
                              >
                                <tr>
                                  <th className="w-25">Patient Orders</th>
                                  <th className="w-35">Neo7 Analysis Type</th>
                                  <th className="w-25">Order Date  {this.state.sort === "asc" ? (
                                    <i
                                      className="fa fa-arrow-down"
                                      onClick={() =>
                                        this.setState({
                                          cardData: this.state.cardData.sort(
                                            (a, b) => new Date(a.orderDate) - new Date(b.orderDate)
                                          ),
                                          sort: "desc",
                                        })
                                      }
                                    ></i>
                                  ) : (
                                    <i
                                      className="fa fa-arrow-up"
                                      onClick={() =>
                                        this.setState({
                                          cardData: this.state.cardData.sort(
                                            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                                          ),
                                          sort: "asc",
                                        })
                                      }
                                    ></i>)}</th>
                                  <th style={{ width: "11%" }}>CC. Rep</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.cardData?.length > 0 ? (
                                  this.state.cardData.map((mdata, p) => {
                                    return (
                                      <tr key={p}>
                                        <td>
                                          <div className="d-flex flex-column">
                                            <span>
                                              {mdata.accessionNo != "" &&
                                                mdata.accessionNo != null ? (
                                                this.state.role_Id == 5 ||
                                                  this.state.role_Id == 1 ||
                                                  this.state.role_Id == 4 ? (
                                                  <>
                                                    <Link
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/admininfo/" +
                                                        mdata.patientId +
                                                        "/" +
                                                        mdata.patientAccessionId
                                                      }
                                                    >
                                                      {mdata.accessionNo.replace(
                                                        /-/g,
                                                        ""
                                                      )}
                                                    </Link>
                                                    <br />
                                                    <span className="font-weight-bold">
                                                      {mdata.accessionNo != null
                                                        ? !!mdata?.accessionStatus
                                                          ? ` (${mdata?.accessionStatus})`
                                                          : ""
                                                        : ""}
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Link
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                      to={
                                                        "/patients/info/" +
                                                        mdata.patientId +
                                                        "/" +
                                                        mdata.patientAccessionId
                                                      }
                                                    >
                                                      {mdata.accessionNo.replace(
                                                        /-/g,
                                                        ""
                                                      )}
                                                    </Link>
                                                    <br />
                                                    <span>
                                                      {mdata.accessionNo != null
                                                        ? !!mdata?.accessionStatus
                                                          ? ` (${mdata?.accessionStatus})`
                                                          : ""
                                                        : ""}
                                                    </span>
                                                  </>
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </span>
                                          </div>
                                        </td>

                                        <td>
                                          <div className="text-start">
                                            <span className="my-1">
                                              {mdata?.diseaseCategory}
                                            </span>
                                            {mdata?.diseaseName == "" ||
                                              mdata?.diseaseName == undefined ||
                                              mdata?.diseaseName ==
                                              null ? null : mdata?.diseaseCategory !==
                                                mdata?.diseaseName ? (
                                              <span className="border btn btn-sm mx-1 my-1 px-2 rounded-pill">
                                                {
                                                  // mdata?.diseaseName
                                                  !mdata?.diseaseName
                                                    ? null
                                                    : mdata?.diseaseName
                                                }
                                              </span>
                                            ) : null}

                                            {mdata?.isMetastasis == true ? (
                                              <span className="my-1">
                                                {mdata?.isMetastasis == true ? (
                                                  <span className="text-danger font-weight-bold">
                                                    - Metastasis
                                                  </span>
                                                ) : (
                                                  ""
                                                )}
                                              </span>
                                            ) : null}
                                          </div>
                                        </td>
                                        <td>{mdata?.orderCreateDate}</td>
                                        <td>{mdata?.ccName}</td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="tdCenter">
                                      No record(s) to show !!!
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </CardBody>
                        </Collapse>
                      </Card>
                    </Fade>
                  </Col>
                ) : null}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
