import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Button, Input, FormGroup } from 'reactstrap';
import { Link, Redirect, useParams } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import Confirm from "../../CustomModal/Confirm";
import { Steps } from "intro.js-react";
import axiosInstance from "./../../../common/axiosInstance"
import { BE_DiseaseCategory_GetAllDRP, BE_DiseaseCategory_GetSubAllDRP, BE_OrganizationUser_UpdateTooltipSteps, BE_SampleType_Delete, BE_SampleType_GetAll } from '../../../common/allApiEndPoints';

class List extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.initialState = {
      loading: true,
      isEdit: false,
      isView: false,
      openSearch: true,
      sampletypes: [],
      searchString: '',
      diseaseCategoryId: 0,
      diseasecategories: [],
      diseasesubCat: [],
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
      allData: [],
      activeCountTrue: '',
      activeCountFalse: '',
      tempCount: true,

      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      steps: [{
        element: "#pagetitle",
        title: 'Sample Type',
        intro: "Used to add or update a Sample and assign it to on Order Type.",
        tooltipClass: "cssClassName1",
      },

      {
        element: "#Add",
        title: 'Add New Sample Type',
        tooltipClass: "cssClassName1",
        intro: "You can add new sample type by clicking on this Add button."
      },
      {
        element: "#activeInactiveFilter",
        title: 'Active/Inactive filter for Sample Type list',
        intro: "You can filter sample type list by selecting active or inactive option from the dropdown.",
        tooltipClass: "cssClassName1",
      },
      {
        element: "#AnalysisTypeCategory",
        title: 'Filter Sample Type List by Analysis type',
        tooltipClass: "cssClassName1",
        intro: "You can filter sample type list by selecting analysis type category from the dropdown."
      },
      {
        element: "#AnalysisTypeSubCategory",
        title: 'Filter Sample Type List by sub category',
        tooltipClass: "cssClassName1",
        intro: "You can filter sample type list by selecting sub category from the dropdown."
      },

      {
        element: "#searchbar ",
        title: 'Search Sample Type',
        tooltipClass: "cssClassName1",
        intro: "This Search Bar allows the User to search in the sample type list."
      },

      {
        element: "#Edit",
        title: 'Edit Sample Type',
        tooltipClass: "cssClassName1",
        intro: "You can edit or update sample type details by clicking on this Edit button."
      },
      {
        element: "#Delete",
        title: 'Delete or Recover Sample Type',
        tooltipClass: "cssClassName1",
        intro: "You can delete/Recover sample type by clicking on Delete/Recover button."
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
      let currentrights = rights.filter(role => role.moduleId.toString() == "27");
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
    //  this.getListData(0);
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
  // filterData(id) {
  //   const updatedItems = this.state.sampletypes.filter((curElem) => {

  //     return curElem.diseaseCategoryId == id;

  //   });
  //   console.log("A", updatedItems);
  //   this.setState({ allData: updatedItems })
  // }

  //get data
  getListData(pageNo) {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);
    // this.getsubDrpData(this.state.diseaseCategoryId)
    const apiroute = window.$APIPath;
    //const url = apiroute + '/api/BE_SampleType/GetAllPaging';
    // const url = apiroute + '/api/BE_SampleType/GetAll';
    const url = apiroute + BE_SampleType_GetAll

    //let data = JSON.stringify({
    //  isDeleted: this.state.slDelete,
    //  searchString: this.state.searchString,
    //  Id: userId,
    //  pageNo: pageNo,
    //  totalNo: window.$TotalRecord,
    //});
    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      id: userId,
      diseaseCatId: parseInt(this.state.diseaseCategoryId)
    });

    // console.log("Data", data)
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {

          // console.log(result.data.outdata);
          var rdata = result.data.outdata;
          // const fill = rdata.filter(i => i.diseaseCategoryId === this.state.diseaseCategoryId)
          // console.log("Fill",fill)
          this.setState({
            pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
            sampletypes: rdata, loading: false,
          });
          this.temp();
          // this.filterData(parseInt(this.state.diseaseCategoryId));
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ authError: true, error: error, loading: false });
      });

  }


  ////pagination
  //handleClick(e, index, currIndex) {
  //  e.preventDefault();
  //  var pgcount = this.state.pagesCount - 1;
  //  var pgCurr = (index >= pgcount ? pgcount : index);
  //  this.setState({
  //    currentPage: pgCurr,
  //    currentIndex: currIndex
  //  }, function () { this.getListData(pgCurr); });
  //}

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

  //select

  filterOnSelect = (e) => {
    const target = e.target;
    const value = target.value;
    // console.log(value);
    // console.log("value", this.state.diseaseCategoryId);
    this.setState(() => ({
      loading: true, currentPage: 0, currentIndex: 0, pagesCount: 0,
      diseasesubCat: [],
      //pageSize: 10,
      diseaseCategoryId: value
    }), function () {
      this.getsubDrpData(value);
    })
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

        diseaseCategoryId: value,
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
    // if (id != "") {
    // const url = apiroute + "/api/BE_DiseaseCategory/GetSubAllDRP?id=" + id + "";
    const url = apiroute + BE_DiseaseCategory_GetSubAllDRP(id)

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


  // if (this.state.diseaseCategoryId == null) {
  // this.setState({ allData : this.state.sampletypes})

  //   return 0;

  // }




  //delete(active/inactive) button click
  deleteRow(e, id) {
    //e.preventDefault();
    //const currroles = this.state.roles;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_SampleType/Delete?id=' + id + '&userId=' + userId + '';
    const url = apiroute + BE_SampleType_Delete(id, userId)

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
    let countT = this.state.sampletypes.filter((data, i) => {
      return data.isActive == true
    })
    let countF = this.state.sampletypes.filter((data, i) => {
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

  render() {
    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const { loading, sampletypes, currentPage, currentIndex, pagesCount, pageSize, authError, error,
      diseasecategories, diseaseCategoryId } = this.state;
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
            <h5 className="mt-2" id="pagetitle" style={{ width: "fit-content" }} ><i className="fa fa-align-justify"></i> Sample Type List</h5>
          </Col>
          <Col xs="1" lg="1">
            {
              this.state.isEdit ? <>
                <Link to="/master/sampletype/details">
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
                      <option value="true">Active {this.state.tempCount == true ? `(${this.state.activeCountTrue})` : ''}</option>
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
                        <div className="searchBox pl-0">
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
                      <th>Sample Type</th>
                      <th>Description</th>
                      {/*<th>Disease Category</th>*/}
                      <th>Status</th>
                      <th className="thNone">SampleType Id</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log("sampletypes",sampletypes[1])} */}

                    {


                      // !loading ? (
                      //roles.map(function (data,i) {
                      sampletypes.length > 0 ? (
                        sampletypes
                          //.slice(
                          //  currentPage * pageSize,
                          //  (currentPage + 1) * pageSize
                          //)
                          .map((data, i) => {
                            return (<tr key={i}>
                              <td>{data.sampleTypeName}</td>
                              <td>{data.sampleTypeDescription}</td>
                              {/*<td>{data.diseaseCategory}</td>*/}
                              <td>
                                {data.isActive ? (<Badge color="success">Active</Badge>) : (<Badge color="danger">Inactive</Badge>)}
                              </td>
                              <td className="thNone">{data.sampleTypeId}</td>

                              <td>
                                <div className='d-flex'>
                                  <Link id="Edit" className="btn btn-primary btn-sm btn-pill ml-1" to={'/master/sampletype/modify/' + data.sampleTypeId}>Edit</Link>{" "}
                                  {
                                    this.state.isEdit ? <>
                                      <Confirm title="Confirm"
                                        description={`${data.isActive ? 'Are you sure you want to delete this Sample Type?' : 'Are you sure you want to recover this Sample Type?'}`}
                                      >
                                        {confirm => (
                                          <Link id="Delete" className="btn btn-danger btn-sm btn-pill ml-1" to="#" onClick={confirm(e => this.deleteRow(e, data.sampleTypeId))}>
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





                      ) :
                        (
                          (<tr>
                            <td colSpan="5" className="tdCenter">No sample types.</td></tr>
                          )
                          // )) : (
                          // <tr>
                          //   <td colSpan="4" className="tdCenter">Loading...</td></tr>
                        )






                    }



                  </tbody>
                </Table>

                {/*<Pagination aria-label="Page navigation example" className="customPagination">*/}
                {/*  <PaginationItem disabled={currentIndex - 4 <= 0}>*/}
                {/*    <PaginationLink onClick={e => this.handleClick(e, currentPage - 5, currentIndex - 5)} previous href="#">*/}
                {/*      Prev*/}
                {/*    </PaginationLink>*/}
                {/*  </PaginationItem>*/}
                {/*  {[...Array(pagesCount)].slice(currentIndex, currentIndex + 5).map((page, i) =>*/}
                {/*    <PaginationItem active={currentIndex + i === currentPage} key={currentIndex + i}>*/}
                {/*      <PaginationLink onClick={e => this.handleClick(e, currentIndex + i, currentIndex)} href="#">*/}
                {/*        {currentIndex + i + 1}*/}
                {/*      </PaginationLink>*/}
                {/*    </PaginationItem>*/}
                {/*  )}*/}
                {/*  <PaginationItem disabled={currentIndex + 5 >= pagesCount}>*/}
                {/*    <PaginationLink onClick={e => this.handleClick(e, currentPage + 5, currentIndex + 5)} next href="#">*/}
                {/*      Next*/}
                {/*    </PaginationLink>*/}
                {/*  </PaginationItem>*/}
                {/*</Pagination>*/}
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

export default List;
