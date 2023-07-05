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
  ModalBody,
  ModalHeader,
  ModalFooter,
  Collapse,
  Fade,
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

class DesignActivity extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      openSearch: true,
      patients: [],
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
      isView: false,
      isEdit: false,
      roleName: "",
      collapseId: 0,

      preview: false,
      url: "",
    };
    this.state = this.initialState;
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
          //pageSize: 10,
          searchString: "",
        }),
        function () {
          this.getDesignActivityData(0);
        }
      );
    }
  };

  //setcollapse
  setCollapse(cid) {
    let currentCid = this.state.collapseId;
    if (currentCid == cid) {
      this.setState({ collapseId: -1 });
    } else {
      this.setState({ collapseId: cid });
    }
  }

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

    this.setState({ roleName: userToken.roleName });

    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter((role) =>
        role.moduleName.toLowerCase().includes("design activity")
      );
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited,
        });
        if (currentrights[0].isViewed) {
          this.getDesignActivityData(0);
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
  getDesignActivityData(pageNo) {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId == null ? 0 : userToken.userId;

    const apiroute = window.$APIPath;
    const url = apiroute + "/api/DesignActivity/GetAllPaging";

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: 0,
      pageNo: pageNo,
      totalNo: window.$TotalRecord,
    });

    axios
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
            patients: result.data.outdata,
            loading: false,
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
    e.preventDefault();
    var pgcount = this.state.pagesCount - 1;
    var pgCurr = index >= pgcount ? pgcount : index;
    this.setState(
      {
        currentPage: pgCurr,
        currentIndex: currIndex,
      },
      function () {
        this.getDesignActivityData(pgCurr);
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
          searchString: value,
        }),
        function () {
          this.getDesignActivityData(0);
        }
      );
    }
  };

  //active/inactive filter
  //handleChange = (e) => {
  //  const target = e.target;
  //  const value = target.value;

  //  this.setState(() => ({
  //    loading: true,
  //    currentPage: 0,
  //    currentIndex: 0,
  //    pagesCount: 0,
  //    pageSize: 10,
  //    slDelete: JSON.parse(value)
  //  }), function () { this.getDesignActivityData(0); });
  //}

  //Update Design Activity Design Started
  UpdateDesignActivityDesignStarted = (e, id) => {
    //e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      apiroute +
      "/api/DesignActivity/UpdateDesignActivityDesignStarted?id=" +
      id +
      "";

    axios
      .get(url, {
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
              // modalBody: result.data.message,
              loading: false,
            },
            this.getDesignActivityData(0)
          );
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
        } else {
          this.setState({
            loading: false,
          });
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: error.message,
          authError: true,
          error: error,
          loading: false,
        });
        toast.error(error.message);
      });
  };

  //Update Design Activity Design Completed
  UpdateDesignActivityDesignCompleted(e, id) {
    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url =
      apiroute +
      "/api/DesignActivity/UpdateDesignActivityDesignCompleted?id=" +
      id +
      "";

    axios
      .get(url, {
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
              // modalBody: result.data.message,
              loading: false,
            },
            this.getDesignActivityData(0)
          );
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
        } else {
          this.setState({
            loading: false,
          });
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: error.message,
          authError: true,
          error: error,
          loading: false,
        });
        toast.error(error.message);
      });
  }

  //Update Design Activity Design Delivered
  UpdateDesignActivityDesignDelivered = (e, id, pid) => {
    //e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    //const url = apiroute + '/api/DesignActivity/UpdateDesignActivityDesignDelivered?id=' + id + '&userId=' + userId + '';
    const url = apiroute + "/api/BE_PatientReport/generatepatientreport";

    let data = JSON.stringify({
      patientId: parseInt(pid),
      patientId: parseInt(pid),
      designActivityId: parseInt(id),
      userId: parseInt(userId),
    });

    // console.log("data", data);
    //axios.get(url, {
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log("result", result);
        if (result.data.flag) {
          this.setState(
            {
              // modal: !this.state.modal,
              // modalTitle: 'Success',
              // modalBody: result.data.message,
              loading: false,
            },
            this.getDesignActivityData(0)
          );
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
        } else {
          this.setState({
            loading: false,
          });
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: error.message,
          authError: true,
          error: error,
          loading: false,
        });
        toast.error(error.message);
      });
  };

  //Update Design Activity Design Started
  RecallPipeline = (e, id) => {
    //e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + "/api/DesignActivity/RecallPipeline?id=" + id + "";

    axios
      .get(url, {
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
              // modalBody: result.data.message,
              loading: false,
            },
            this.getDesignActivityData(0)
          );
          toast.success(result.data.message);
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
          //});
        } else {
          this.setState({
            loading: false,
          });
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: error.message,
          authError: true,
          error: error,
          loading: false,
        });
        toast.error(error.message);
      });
  };

  handleDesignInputChange(event, id) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (value == "Design Started") {
      return (
        <Confirm
          title="Confirm"
          description="Are you sure want to start the design?"
        >
          {(confirm) =>
            confirm((e) => this.UpdateDesignActivityDesignStarted(e, id))
          }
        </Confirm>
      );
    } else if (value == "Design Completed") {
      return (
        <Confirm
          title="Confirm"
          description="Are you sure want to complete the design?"
        >
          {(confirm) =>
            confirm((e) => this.UpdateDesignActivityDesignCompleted(e, id))
          }
        </Confirm>
      );
      //if (window.confirm('Are you sure want to complete the design?')) {
      //  this.UpdateDesignActivityDesignCompleted(event, id)
      //}
    }
    //else if (value == "Design Delivered") {
    //  if (window.confirm('Are you sure want to delivered the design?')) {
    //    this.UpdateDesignActivityDesignDelivered(event, id)
    //  }
    //}
    else if (value == "Generate Report") {
      return (
        <Confirm
          title="Confirm"
          description="Are you sure want to generate report?"
        >
          {(confirm) =>
            confirm((e) => this.UpdateDesignActivityDesignDelivered(e, id))
          }
        </Confirm>
      );
      //if (window.confirm('Are you sure want to generate report?')) {
      //  this.UpdateDesignActivityDesignDelivered(event, id)
      //}
    }
  }

  //download
  DownloadFile(e, filepath) {
    //alert(filename);
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    axios({
      url:
        apiroute +
        "/api/CognitoUserStore/downloadFile?fileName=" +
        filepath +
        "",
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

  // onError = (err) => console.log("Error:", err); // Write your own logic
  onError = (err) => console.log(""); // Write your own logic
  newpatients = {
    "Specimen  collection": [
      {
        patientName: "PMR Sent to Clinic",
        date: "",
        patientAccessionId: 1,
        patientId: 23,
        designActivites: 1,
      },

      {
        patientName: "Clinic sent PMR to Pharmacy",
        date: "",
        patientAccessionId: 2,
        patientId: 24,
        designActivites: 2,
      },
      {
        patientName: "Peptides Received by Clinic",
        date: "",
        patientAccessionId: 3,
        patientId: 25,
        designActivites: 3,
      },
      {
        patientName: "Treatment Started",
        date: "",
        patientAccessionId: 4,
        patientId: 26,
      },
    ],
  };
  //file preview
  previewToggle(e, filePath) {
    this.setState({
      preview: !this.state.preview,
      url: window.$FileUrl + filePath,
    });
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
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
      collapseId,
      error,
      roleName,
      preview,
      url,
    } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Design Activity View{" "}
            </h5>
          </Col>
          <Col xs="2" lg="2"></Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col xs="2"></Col>
                  <Col xs="4"></Col>
                  <Col xs="6">
                    {this.state.openSearch ? (
                      <div className="searchBox">
                        <input
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

                {preview && (
                  <>
                    <div className="preview-popup">
                      <div className="preview-popup-modal">
                        <div className="preview-popup-header">
                          {url.split(".").splice(-1)[0] === "pdf" ? null : (
                            <a href={url} download target={`_blank`}>
                              <img
                                src={downloadIcon}
                                style={{ margin: "0 12px", cursor: "pointer" }}
                                alt="download"
                                onClick={(e) => this.DownloadFile(e, url)}
                              />
                            </a>
                          )}
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
                )}

                {
                  // !loading ? (
                  patients.length > 0 ? (
                    patients.map((data, i) => {
                      return (
                        <Col
                          xs="12"
                          sm="12"
                          md="12"
                          style={{ fontSize: "0.72rem", "margin-top": "20px " }}
                        >
                          <Card style={{ border: "1px solid #1C3A84" }}>
                            <CardHeader
                              style={{
                                backgroundColor: "#1C3A84",
                                color: "white",
                              }}
                            >
                              <Row
                                style={{ fontSize: "16px" }}
                                key={i}
                                onClick={() => this.setCollapse(i)}
                              >
                                <Col md="10">
                                  <b>
                                    {
                                      <React.Fragment>
                                        <span>{data.patientName}</span>
                                      </React.Fragment>
                                    }
                                  </b>
                                </Col>
                                {/*{this.state.isEdit || this.state.isView ?*/}
                                {/*  <Col md="2">*/}
                                {/*    <React.Fragment>*/}
                                {/*      {this.state.isView ?*/}
                                {/*        <Link className="btn btn-info btn-sm btn-pill" to={'/patientactivity/analysis/datafiles/' + data.patientId}><b>View Data Files</b></Link>*/}
                                {/*        : null}*/}
                                {/*    </React.Fragment>*/}
                                {/*  </Col>*/}
                                {/*: null}*/}
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
                                      <thead>
                                        <tr>
                                          <th>Accession No</th>
                                          {/*<th>Patient Name</th>
                                          <th>Laboratory Name</th>
                                          <th>Practitioner<br />Institution</th>
                                          <th>Diesease</th>*/}
                                          {this.state.isEdit ||
                                          this.state.isView ? (
                                            <React.Fragment>
                                              <th>Status</th>
                                              <th>Design Activity</th>
                                              <th>Data Files</th>
                                            </React.Fragment>
                                          ) : null}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {data.patientAccessionMappings.map(
                                          (adata, index) => (
                                            <tr>
                                              <td>
                                                {/*{adata.accessionNo}*/}
                                                <Link
                                                  className="anchorAccessNo"
                                                  to={
                                                    "/patientprofile/" +
                                                    data.patientId +
                                                    "/" +
                                                    adata.patientAccessionId
                                                  }
                                                >
                                                  <b>
                                                    {adata.accessionNo.replace(
                                                      /-/g,
                                                      ""
                                                    )}
                                                  </b>
                                                </Link>
                                              </td>
                                              {this.state.isEdit ||
                                              this.state.isView ? (
                                                <React.Fragment>
                                                  <td>
                                                    {this.state.isEdit ? (
                                                      adata.designActivites !=
                                                      null ? (
                                                        adata.designActivites
                                                          .currentStatus ==
                                                        "Data File Delivered" ? (
                                                          <Confirm
                                                            title="Confirm"
                                                            description="Are you sure want to call the pipeline?"
                                                          >
                                                            {(confirm) => (
                                                              <a
                                                                className="btn btn-info btn-sm btn-pill"
                                                                onClick={confirm(
                                                                  (e) =>
                                                                    this.UpdateDesignActivityDesignStarted(
                                                                      e,
                                                                      adata
                                                                        .designActivites
                                                                        .designActivityId
                                                                    )
                                                                )}
                                                              >
                                                                Call Pipeline
                                                              </a>
                                                            )}
                                                          </Confirm>
                                                        ) : adata
                                                            .designActivites
                                                            .currentStatus ==
                                                          "Design Started" ? (
                                                          <span
                                                            className="badge badge-info"
                                                            style={{
                                                              padding: "8px",
                                                              color: "#fff",
                                                            }}
                                                          >
                                                            Processing...
                                                          </span>
                                                        ) : adata
                                                            .designActivites
                                                            .currentStatus ==
                                                          "Design Completed" ? (
                                                          <React.Fragment>
                                                            {/*<a className="btn btn-info btn-sm btn-pill" onClick={e => { if (window.confirm('Are you sure want to deliver the design?')) this.UpdateDesignActivityDesignDelivered(e, data.designActivityId) }}>Deliver Design</a>*/}
                                                            <span
                                                              className="badge badge-success"
                                                              style={{
                                                                padding: "8px",
                                                                color: "#fff",
                                                                marginBottom:
                                                                  "5px",
                                                              }}
                                                            >
                                                              Completed
                                                            </span>
                                                            <br />
                                                            {/*<Confirm title="Confirm" description="Are you sure want to generate report?">
                                                {confirm => (
                                                  <a className="btn btn-info btn-sm btn-pill" style={{ "marginRight": "5px" }} onClick={confirm(e => this.UpdateDesignActivityDesignDelivered(e, data.designActivityId, data.patientId))}>Generate Report</a>*/}
                                                            <Link
                                                              to={
                                                                adata?.diseaseName ===
                                                                "HealthIndex"
                                                                  ? "/patientactivity/designactivities/patienthealthindexreportdetail/" +
                                                                    adata
                                                                      .designActivites
                                                                      .patientId +
                                                                    "/" +
                                                                    adata
                                                                      .designActivites
                                                                      .patientAccessionId +
                                                                    "/" +
                                                                    adata
                                                                      .designActivites
                                                                      .designActivityId
                                                                  : "/patientactivity/designactivities/report/" +
                                                                    adata
                                                                      .designActivites
                                                                      .patientId +
                                                                    "/" +
                                                                    adata
                                                                      .designActivites
                                                                      .patientAccessionId +
                                                                    "/" +
                                                                    adata
                                                                      .designActivites
                                                                      .designActivityId
                                                              }
                                                              className="btn btn-info btn-sm btn-pill"
                                                              style={{
                                                                marginRight:
                                                                  "5px",
                                                              }}
                                                            >
                                                              Generate Report
                                                            </Link>
                                                            {/*)}
                                              </Confirm> */}
                                                            <Confirm
                                                              title="Confirm"
                                                              description="Are you sure want to recall the pipeline?"
                                                            >
                                                              {(confirm) => (
                                                                <a
                                                                  className="btn btn-info btn-sm btn-pill"
                                                                  onClick={confirm(
                                                                    (e) =>
                                                                      this.RecallPipeline(
                                                                        e,
                                                                        adata
                                                                          .designActivites
                                                                          .designActivityId
                                                                      )
                                                                  )}
                                                                >
                                                                  Re-Run
                                                                  Pipeline
                                                                </a>
                                                              )}
                                                            </Confirm>
                                                            {adata
                                                              .designActivites
                                                              .healthIndexReportPath !=
                                                              "" &&
                                                            adata
                                                              .designActivites
                                                              .healthIndexReportPath !=
                                                              null ? (
                                                              <React.Fragment>
                                                                <br />
                                                                <br />
                                                                <a
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                    color:
                                                                      "#1C3A84",
                                                                  }}
                                                                  onClick={(
                                                                    e
                                                                  ) =>
                                                                    this.previewToggle(
                                                                      e,
                                                                      adata
                                                                        .designActivites
                                                                        .healthIndexReportPath
                                                                    )
                                                                  }
                                                                >
                                                                  <i class="fa fa-download"></i>{" "}
                                                                  Report
                                                                </a>
                                                              </React.Fragment>
                                                            ) : null}
                                                            {(adata
                                                              .designActivites
                                                              .patientReport !=
                                                              "" &&
                                                              adata
                                                                .designActivites
                                                                .patientReport !=
                                                                null) ||
                                                            (adata
                                                              .designActivites
                                                              .pmrFilePath !=
                                                              "" &&
                                                              adata
                                                                .designActivites
                                                                .pmrFilePath !=
                                                                null) ? (
                                                              <React.Fragment>
                                                                <br />
                                                                <br />
                                                                {adata
                                                                  .designActivites
                                                                  .patientReport !=
                                                                "" ? (
                                                                  <a
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      color:
                                                                        "#1C3A84",
                                                                      marginRight:
                                                                        "8px",
                                                                    }}
                                                                    onClick={(
                                                                      e
                                                                    ) =>
                                                                      this.previewToggle(
                                                                        e,
                                                                        adata
                                                                          .designActivites
                                                                          .patientReport
                                                                      )
                                                                    }
                                                                  >
                                                                    <i class="fa fa-download"></i>{" "}
                                                                    Patient
                                                                    Report
                                                                  </a>
                                                                ) : null}
                                                                {adata
                                                                  .designActivites
                                                                  .pmrFilePath !=
                                                                "" ? (
                                                                  <a
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      color:
                                                                        "#1C3A84",
                                                                    }}
                                                                    onClick={(
                                                                      e
                                                                    ) =>
                                                                      this.previewToggle(
                                                                        e,
                                                                        adata
                                                                          .designActivites
                                                                          .pmrFilePath
                                                                      )
                                                                    }
                                                                  >
                                                                    <i class="fa fa-download"></i>{" "}
                                                                    PMR
                                                                  </a>
                                                                ) : null}
                                                              </React.Fragment>
                                                            ) : null}
                                                          </React.Fragment>
                                                        ) : adata
                                                            .designActivites
                                                            .currentStatus ==
                                                          "Design Failed" ? (
                                                          <React.Fragment>
                                                            <span
                                                              className="badge badge-danger"
                                                              style={{
                                                                padding: "8px",
                                                                color: "#fff",
                                                              }}
                                                            >
                                                              Failed
                                                            </span>
                                                            <br />
                                                            <span>
                                                              {
                                                                adata
                                                                  .designActivites
                                                                  .reason
                                                              }
                                                            </span>
                                                            <br />
                                                            <Confirm
                                                              title="Confirm"
                                                              description="Are you sure want to recall the pipeline?"
                                                            >
                                                              {(confirm) => (
                                                                <a
                                                                  className="btn btn-info btn-sm btn-pill"
                                                                  onClick={confirm(
                                                                    (e) =>
                                                                      this.RecallPipeline(
                                                                        e,
                                                                        adata
                                                                          .designActivites
                                                                          .designActivityId
                                                                      )
                                                                  )}
                                                                >
                                                                  Recall
                                                                  Pipeline
                                                                </a>
                                                              )}
                                                            </Confirm>
                                                          </React.Fragment>
                                                        ) : adata
                                                            .designActivites
                                                            .currentStatus ==
                                                          "Design Delivered" ? (
                                                          <span
                                                            className="badge badge-info"
                                                            style={{
                                                              padding: "8px",
                                                              color: "#fff",
                                                            }}
                                                          >
                                                            Design Delivered to
                                                            Manufacturer
                                                          </span>
                                                        ) : (
                                                          <span
                                                            className="badge badge-info"
                                                            style={{
                                                              padding: "8px",
                                                              color: "#fff",
                                                            }}
                                                          >
                                                            Data File Pending
                                                          </span>
                                                        )
                                                      ) : (
                                                        <span
                                                          className="badge badge-info"
                                                          style={{
                                                            padding: "8px",
                                                            color: "#fff",
                                                          }}
                                                        >
                                                          Pending
                                                        </span>
                                                      )
                                                    ) : (
                                                      <span
                                                        className="badge badge-info"
                                                        style={{
                                                          padding: "8px",
                                                          color: "#fff",
                                                        }}
                                                      >
                                                        {adata.designActivites !=
                                                        null
                                                          ? adata
                                                              .designActivites
                                                              .currentStatus
                                                          : "Pending"}
                                                      </span>
                                                    )}
                                                    {/*(data.currentStatus == "Data File Delivered" ?
                                        <select className="form-control" onChange={e => this.handleDesignInputChange(e, data.designActivityId)}>
                                          <option value="">Select Activity</option>
                                          <option value="Design Started">Design Started</option>
                                          <option disabled value="Design Completed">Design Completed</option>
                                          <option disabled value="Design Delivered">Design Delivered</option>
                                        </select>
                                        //<a className="btn btn-info btn-sm btn-pill" onClick={e => { if (window.confirm('Are you sure want to start the design?')) this.UpdateDesignActivityDesignStarted(e, data.designActivityId) }}>Start Design</a>
                                        :
                                        (data.currentStatus == "Design Started" ?
                                          <select className="form-control" onChange={e => this.handleDesignInputChange(e, data.designActivityId)}>
                                            <option value="">Select Activity</option>
                                            <option disabled value="Design Started" selected>Design Started</option>
                                            <option value="Design Completed">Design Completed</option>
                                            <option disabled value="Design Delivered">Design Delivered</option>
                                          </select>
                                          //<a className="btn btn-info btn-sm btn-pill" onClick={e => { if (window.confirm('Are you sure want to complete the design?')) this.UpdateDesignActivityDesignCompleted(e, data.designActivityId) }}>Complete Design</a>
                                          :
                                          (data.currentStatus == "Design Completed" ?
                                            <select className="form-control" onChange={e => this.handleDesignInputChange(e, data.designActivityId)}>
                                              <option value="">Select Activity</option>
                                              <option disabled value="Design Started">Design Started</option>
                                              <option disabled value="Design Completed" selected>Design Completed</option>
                                              <option value="Design Delivered">Design Delivered</option>
                                            </select>
                                            //<a className="btn btn-info btn-sm btn-pill" onClick={e => { if (window.confirm('Are you sure want to deliver the design?')) this.UpdateDesignActivityDesignDelivered(e, data.designActivityId) }}>Deliver Design</a>
                                            :
                                            (data.currentStatus == "Design Delivered" ?
                                              <span className="badge badge-info" style={{ "padding": "8px", "color": "#fff" }}>Design Delivered to Manufacturer</span>
                                              :
                                              <span className="badge badge-info" style={{ "padding": "8px", "color": "#fff" }}>Data File Pending</span>
                                            )
                                          )
                                        )
                                        ) * /}
                                      
                                    {/*
                                      this.state.isEdit ?
                                        (data.currentStatus == "Data File Delivered" ?
                                          <a className="btn btn-info btn-sm btn-pill" onClick={e => { if (window.confirm('Are you sure want to start the design?')) this.UpdateDesignActivityDesignStarted(e, data.designActivityId) }}>Start Design</a>
                                          :
                                          (data.currentStatus == "Design Started" ?
                                            <a className="btn btn-info btn-sm btn-pill" onClick={e => { if (window.confirm('Are you sure want to complete the design?')) this.UpdateDesignActivityDesignCompleted(e, data.designActivityId) }}>Complete Design</a>
                                            :
                                            (data.currentStatus == "Design Completed" ?
                                              <a className="btn btn-info btn-sm btn-pill" onClick={e => { if (window.confirm('Are you sure want to deliver the design?')) this.UpdateDesignActivityDesignDelivered(e, data.designActivityId) }}>Deliver Design</a>
                                              :
                                              (data.currentStatus == "Design Delivered" ?
                                                <span className="badge badge-info" style={{ "padding": "8px", "color": "#fff" }}>Design Delivered to Manufacturer</span>
                                                :
                                                <span className="badge badge-info" style={{ "padding": "8px", "color": "#fff" }}>Data File Pending</span>
                                              )
                                            )
                                          )
                                        ) :
                                        <span className="badge badge-info" style={{ "padding": "8px", "color": "#fff" }}>{data.currentStatus}</span>
                                    */}
                                                  </td>
                                                  {this.state.isView ? (
                                                    <td>
                                                      <Link
                                                        className="btn btn-info btn-sm btn-pill"
                                                        to={
                                                          "/patientactivity/designactivities/list/" +
                                                          adata.patientAccessionId
                                                        }
                                                      >
                                                        <b>View</b>
                                                      </Link>
                                                    </td>
                                                  ) : null}
                                                  {this.state.isEdit ||
                                                  this.state.isView ? (
                                                    <td>
                                                      <Link
                                                        className="btn btn-info btn-sm btn-pill"
                                                        to={
                                                          "/patientactivity/analysis/datafiles/" +
                                                          adata.patientAccessionId
                                                        }
                                                      >
                                                        <b>View</b>
                                                      </Link>
                                                    </td>
                                                  ) : null}
                                                </React.Fragment>
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
                    <Table>
                      <tr>
                        <td colSpan="4" className="tdCenter">
                          No activities...
                        </td>
                      </tr>
                    </Table>
                    // )) : (

                    //   <Table><tr><td colSpan="4" className="tdCenter">Loading...</td></tr></Table>
                  )
                }
                {/*newdesignends*/}

                <Pagination
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
                </Pagination>
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
      </div>
    );
  }
}

export default DesignActivity;
