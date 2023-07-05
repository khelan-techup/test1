import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button, Input, FormGroup, Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import Confirm from "../../CustomModal/Confirm";
import { Steps } from "intro.js-react";
import axiosInstance from "./../../../common/axiosInstance"
import ReactPaginate from 'react-paginate';
import { BE_DiseaseCategory_GetAllDRP, BE_DiseaseCategory_GetSubAllDRP, BE_OrganizationUser_UpdateTooltipSteps, BE_Tissue_Delete, BE_Tissue_GetAllPaging, BE_Tissue_VerifyDisease } from '../../../common/allApiEndPoints';

class List extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.initialState = {
      loading: true,
      isEdit: false,
      isView: false,
      openSearch: true,
      tissues: [],
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
      activeCountTrue: '',
      activeCountFalse: '',
      tempCount: true,
      diseasecategories: [],
      diseasesubCat: [],
      diseaseCategoryId: '',
      diseaseName: '',
      showVerifyModal: false,
      tissueName: "",
      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      currentTissueId: null,
      isVerified: true,
      isTissueUnverify: true,
      steps: [{
        element: "#pagetitle",
        title: 'Tissue',
        intro: "Used to add or update a Tissue Type for Diseases.",
        tooltipClass: "cssClassName1",
      },

      {
        element: "#Add",
        title: 'Add New Tissue',
        tooltipClass: "cssClassName1",
        intro: "You can add new tissue by clicking on this Add button."
      },
      {
        element: "#activeInactiveFilter",
        title: 'Active/Inactive filter for tissue list',
        intro: "You can filter tissue list by selecting active or inactive option from the dropdown.",
        tooltipClass: "cssClassName1",
      },
      {
        element: "#AnalysisTypeCategory",
        title: 'Filter Tissue List by Analysis type',
        tooltipClass: "cssClassName1",
        intro: "You can filter tissue list by selecting analysis type category from the dropdown."
      },
      {
        element: "#AnalysisTypeSubCategory",
        title: 'Filter Tissue List by sub category',
        tooltipClass: "cssClassName1",
        intro: "You can filter tissue list by selecting sub category from the dropdown."
      },

      {
        element: "#searchbar ",
        title: 'Search Tissue',
        tooltipClass: "cssClassName1",
        intro: "This Search Bar allows the User to search in the tissue list."
      },

      {
        element: "#Edit",
        title: 'Edit Tissue',
        tooltipClass: "cssClassName1",
        intro: "You can edit or update tissue details by clicking on this Edit button."
      },
      {
        element: "#Delete",
        title: 'Delete or Recover Tissue',
        tooltipClass: "cssClassName1",
        intro: "You can delete/Recover tissue by clicking on Delete/Recover button."
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
    this.setState(() => ({ stepsEnabled: false, isSkipped: e !== 8 }));
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
      const element = document.querySelector('#AnalysisTypeCategory')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 3) {
      const element = document.querySelector('#AnalysisTypeSubCategory')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 4) {
      const element = document.querySelector('#searchbar')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 5) {
      const element = document.querySelector('#Edit')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 6) {
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
      }), function () { this.getListData(0); });
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
      let currentrights = rights.filter(role => role.moduleId.toString() == "21");
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          // this.getListData(0);
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


    // this.getListData(0);
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_DiseaseCategory/GetAllDRP';
    const url = apiroute + BE_DiseaseCategory_GetAllDRP

    // let data = JSON.stringify({ isDeleted: true, searchString: '', id: 0 });

    axiosInstance
      .get(url, {

        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      .then(result => {
        if (result.data.flag) {



          //let diseaseCatObj = result
          //  .data
          //  .outdata.diseaseCatData
          //  .filter(category => category.diseaseCategoryName.toLowerCase() == 'cancer' || category.diseaseCategoryName.toLowerCase() == 'complete health score');

          this.setState({
            diseasecategories: result.data.outdata,
            diseaseCategoryId: result.data.outdata != null ? result.data?.outdata[0]?.diseaseCategoryId : 0
          }, function () {
            // this.getListData(0);
            this.getsubDrpData(result.data.outdata[0].diseaseCategoryId);
          });

        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
      });

  }

  filterOnSelect = (e) => {
    const target = e.target;
    const value = target.value;
    // console.log(value);
    // console.log("value", this.state.diseaseCategoryId);
    this.setState(() => ({
      loading: true, currentPage: 0, currentIndex: 0, pagesCount: 0,
      diseasesubCat: [],
      //pageSize: 10,
      selected: 0,
      diseaseCategoryId: value,

    }), function () {
      this.getsubDrpData(value);
    })
  }
  getsubDrpData(id) {

    const apiroute = window.$APIPath;
    // console.log(id);
    // if (id != "") {
    // const url = apiroute + "/api/BE_DiseaseCategory/GetSubAllDRP?id=" + id + "";
    const url = apiroute + BE_DiseaseCategory_GetSubAllDRP(id)
    this.setState({ loading: true, parent: id, })
    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log(result.data.outdata[0].diseaseCategoryId);
        if (result.data.flag) {

          if (result.data.outdata.length != 0) {
            // alert(0)
            this.setState(() => ({
              loading: true,
              currentPage: 0,
              currentIndex: 0,
              pagesCount: 0,
              diseasesubCat: result.data.outdata,
              diseaseCategoryId: String(result.data.outdata[0].diseaseCategoryId),
              selected: String(result.data.outdata[0].diseaseCategoryId),

              diseaseName: String(result.data.outdata[0].diseaseCategoryId),
            }), function () {
              // alert(1)
              this.getListData(0)
            });
          }
          else {
            this.getListData(0)
          }

          // console.log(this.state.diseasesubCat[0].diseaseCategoryId);
        } else {
          this.setState({ loading: false });
          this.getListData(0)
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });

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
        selected: value,
        diseaseCategoryId: value,
      }),
      () => {
        // debugger;

        this.getListData(0);

      }
    );
  };
  //get data
  getListData(pageNo) {
    this.setState({ loading: true })

    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    // https://devapi.neo7logix.com//api/BE_Tissue/GetAllPaging
    // const url = apiroute + '/api/BE_Tissue/GetAllPaging';
    const url = apiroute + BE_Tissue_GetAllPaging

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: userId,
      pageNo: pageNo,
      totalNo: window.$TotalRecord,
      diseaseCatId: Number(this.state.diseaseCategoryId),
      isVerified: this.state.isVerified,
    });

    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          var rdata = result.data.outdata;
          // console.log("fdsfdsa", rdata);
          this.setState({
            pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
            pageCountNew: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            tissues: rdata, loading: false
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
    }, function () { this.getListData(pgCurr); });
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
      }), function () { this.getListData(0); });
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
    }), function () { this.getListData(0); });
  }

  //delete(active/inactive) button click
  deleteRow(e, id) {
    // e.preventDefault();
    //const currroles = this.state.roles;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Tissue/Delete?id=' + id + '&userId=' + userId + '';
    const url = apiroute + BE_Tissue_Delete

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
          this.getListData(0);
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

  temp() {
    let countT = this.state.tissues.filter((data, i) => {
      return data.isActive == true
    })
    let countF = this.state.tissues.filter((data, i) => {
      return data.isActive == false
    })
    this.setState({
      activeCountTrue: countT.length,
      activeCountFalse: countF.length,
    })
  }
  handleVerifyTissue() {
    const apiroute = window.$APIPath;
    // const url = apiroute + "api/CognitoUserStore/getPatientDropdownEntity";
    let userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken?.userId == null ? 0 : userToken?.userId;
    // const url = apiroute + "/api/BE_Tissue/VerifyDisease";
    const url = apiroute + BE_Tissue_VerifyDisease
    let data = JSON.stringify({
      tissueId: Number(this.state.currentTissueId),
      userId: userId,
      isVerified: this.state.isTissueUnverify,
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
            tissueName: "",
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

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin">
      </div>;
    }
  }
  handlePageClick = (e) => {
    console.log("datra", e.selected)
    let currentPage = e.selected;
    this.getListData(currentPage)

  }


  render() {
    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const { loading, tissues, currentPage, currentIndex, pagesCount, pageSize, authError, error, diseasecategories } = this.state;
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
          <Col xs="11" lg="11">
            <h5 className="mt-2" id="pagetitle" style={{ width: "fit-content" }}><i className="fa fa-align-justify"></i> Tissue List</h5>
          </Col>
          <Col xs="1" lg="1">
            {
              this.state.isEdit ? <>
                <Link to="/master/tissues/details">
                  <button id="Add" className="btn btn-primary btn-block">Add</button>
                </Link>
              </> : null
            }

          </Col>
        </Row>

        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col xs="2">
                    <Input id="activeInactiveFilter" type="select" name="slDelete" onChange={this.handleChange}>
                      <option value="true">Active  {this.state.tempCount == true ? `(${this.state.activeCountTrue})` : ''}</option>
                      <option value="false">Inactive {this.state.tempCount == false ? `(${this.state.activeCountFalse})` : ''}</option>
                    </Input>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Input id="AnalysisTypeCategory" type="select" name="diseaseCategoryId" onChange={this.filterOnSelect}>
                        {diseasecategories.map((data, i) => {

                          // console.log("id-cat", data.diseaseCategoryName);
                          return (

                            <option key={i} value={data.diseaseCategoryId}>{data.diseaseCategoryName}</option>
                          );
                        })}
                      </Input>


                    </FormGroup>
                  </Col>
                  <Col xs="3">
                    <Input
                      id="AnalysisTypeSubCategory"
                      type="select"
                      name="diseaseName"
                      style={{ display: this?.state?.diseasesubCat?.length > 0 ? 'block' : 'none' }}
                      onChange={this.dsubhandleChange}
                    >
                      <option value="" disabled={this.state?.diseaseCategoryId}>Select sub Category</option>
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
                <Table responsive bordered key="tblTissues">
                  <thead>
                    <tr>
                      <th>Tissue Name</th>
                      <th>Disease</th>
                      <th>Verification Status </th>
                      <th>Verified By</th>
                      <th>Created By</th>
                      <th>Status</th>
                      <th className="thNone">Tissue Id</th>
                      <th style={{ width: "10%" }}>Action</th>
                    </tr>
                  </thead>
                  {/* {console.log("tissues::::", tissues)} */}
                  <tbody>
                    {
                      // !loading ? (
                      //roles.map(function (data,i) {
                      tissues.length > 0 ? (
                        tissues
                          //.slice(
                          //  currentPage * pageSize,
                          //  (currentPage + 1) * pageSize
                          //)
                          .map((data, i) => {
                            return (<tr key={i}>
                              <td>{data.tissueName}</td>
                              <td>{data.diseaseNames.split(",").map((ds, i2) => {
                                return (<span key={i2} className="badge badge-info btn-pill" style={{ "padding": "8px", "color": "#fff", "margin": "0px 0px 5px 2px", "fontWeight": "unset", "fontSize": "12px" }}>{ds}</span>)
                              })}
                              </td>
                              <td><Button
                                className={`btn btn-${!data.isVerified ? "secondary" : "danger"
                                  }`}
                                // disabled={!data.isVerified}
                                onClick={() => {
                                  if (data.isVerified) {
                                    this.setState({
                                      showVerifyModal:
                                        !this.state.showVerifyModal,
                                      currentTissueId: data.tissueId,
                                      tissueName: data.tissueName,
                                      isTissueUnverify: false
                                    });
                                  } else {
                                    this.setState({
                                      showVerifyModal:
                                        !this.state.showVerifyModal,
                                      currentTissueId: data.tissueId,
                                      tissueName: data.tissueName,
                                      isTissueUnverify: true
                                    });
                                  }
                                }}
                              >
                                {!data.isVerified ? "Verify" : "Unverify"}
                              </Button></td>
                              <td>{data.verifiedByUser}</td>
                              <td>{data.createdByUser}
                                <br />
                                {data.createdByFlag == 'A' ? "(Admin)" : "(Practitioner)"}
                              </td>
                              <td>
                                {data.isActive ? (<Badge color="success">Active</Badge>) : (<Badge color="danger">Inactive</Badge>)}
                              </td>
                              <td className="thNone">{data.tissueId}</td>

                              <td>
                                <div className='d-flex'>
                                  <Link id="Edit" className="btn btn-primary btn-sm btn-pill" to={'/master/tissues/modify/' + data.tissueId + "/" + this.state.parent + "/" + this.state.selected}>Edit</Link>{" "}
                                  {
                                    this.state.isEdit ? <>
                                      <Confirm title="Confirm"
                                        description={`${data.isActive ? 'Are you sure you want to delete this Tissue?' : 'Are you sure you want to recover this Tissue?'}`}
                                      >
                                        {confirm => (
                                          <Link id="Delete" className="btn btn-danger btn-sm btn-pill ml-1" to="#" onClick={confirm(e => this.deleteRow(e, data.tissueId))}>
                                            {data.isActive ? ("Delete") : ("Recover")}

                                          </Link>
                                        )}
                                      </Confirm>
                                    </> : null
                                  }

                                </div>
                              </td>

                            </tr>);
                          })
                      ) : (
                        <tr>
                          <td colSpan="7" className="tdCenter">No tissues.</td></tr>
                        // )) : (
                        // <tr>
                        //   <td colSpan="4" className="tdCenter">Loading...</td></tr>
                      )}
                  </tbody>
                </Table>
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
                        Math.floor((currentPage - 5) / 5) * 5,
                        Math.floor((currentIndex - 5) / 5) * 5
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
            Are sure you want to {this.state.isTissueUnverify ? "verify" : "Unverify"} <b>{this.state?.tissueName}</b>?
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() =>
                this.setState({
                  showVerifyModal: !this.state.showVerifyModal,
                  tissueName: "",
                })
              }
            >
              Cancel
            </Button>
            <Button color="primary" onClick={() => this.handleVerifyTissue()}>
              Yes
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default List;
