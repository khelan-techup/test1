import React, { Component } from 'react';
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
  FormGroup
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Confirm from "../../CustomModal/Confirm";
import { Droppable, DragDropContext, Draggable } from 'react-beautiful-dnd';
import { Steps } from "intro.js-react";
import axiosInstance from "./../../../common/axiosInstance"
import { BE_DiseaseCategory_GetAll, BE_OrganizationUser_UpdateTooltipSteps, BE_ReportBuilder_Delete, BE_ReportBuilder_GetAll, BE_ReportBuilder_UpdateSequence } from '../../../common/allApiEndPoints';


class List extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.initialState = {
      loading: true,
      isEdit: false,
      isView: false,
      openSearch: true,
      diseases: [],
      searchString: '',
      diseaseCategoryId: 0,
      diseasecategories: [],
      slDelete: true,
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      pageSize: window.$TotalRecord,
      authError: false,
      error: '',
      activeCountTrue: '',
      activeCountFalse: '',
      tempCount: true,

      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      steps: [{
        element: "#pagetitle",
        title: 'Report Builder',
        intro: "Used to add or update static and dynamic sections in the Final Report.",
        tooltipClass: "cssClassName1",
      },

      {
        element: "#Add",
        title: 'Add New Report Section',
        tooltipClass: "cssClassName1",
        intro: "You can add new report section by clicking on this Add button."
      },
      {
        element: "#activeInactiveFilter",
        title: 'Active/Inactive filter for Report Builder list',
        intro: "You can filter report builder list by selecting active or inactive option from the dropdown.",
        tooltipClass: "cssClassName1",
      },
      {
        element: "#AnalysisTypeCategory",
        title: 'Filter Report Builder List by Analysis type',
        tooltipClass: "cssClassName1",
        intro: "You can filter report builder list by selecting analysis type category from the dropdown."
      },
      // {
      //   element: "#AnalysisTypeSubCategory",
      //   title: 'Filter Sample Type List by sub category',
      //   tooltipClass: "cssClassName1",
      //   intro: "You can filter sample type list by selecting sub category from the dropdown."
      // },

      {
        element: "#searchbar ",
        title: 'Search Report Builder',
        tooltipClass: "cssClassName1",
        intro: "This Search Bar allows the User to search in the Report Builder list."
      },
      {
        element: "#draganddrop ",
        title: 'Drag and Drop Report Builder Rows',
        tooltipClass: "cssClassName1",
        intro: "By using this, You can change the order of section in your finnal report."
      },

      {
        element: "#Edit",
        title: 'Edit Report Builder Section',
        tooltipClass: "cssClassName1",
        intro: "You can edit or update report section details by clicking on this Edit button."
      },
      {
        element: "#Delete",
        title: 'Active or Inactive Report Section',
        tooltipClass: "cssClassName1",
        intro: "You can active/inactive report section by clicking on active/inactive button."
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
      const element = document.querySelector('#searchbar')

      if (!element) this.myRef.current.introJs.nextStep()
    }
    if (newStepIndex === 4) {
      const element = document.querySelector('#draganddrop')

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
      this.setState({ openSearch: false });
    } else {
      this
        .setState(() => ({
          openSearch: false,
          loading: true,
          currentPage: 0,
          currentIndex: 0,
          pagesCount: 0,
          //pageSize: 10,
          searchString: ''
        }), function () {
          this.getListData(0);
        });
    }
  }

  //load event
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    var rights = userToken.roleModule;
    if (rights?.length > 0) {
      let currentrights = rights.filter(role => role.moduleId.toString() == "28");
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
    // const url = apiroute + '/api/BE_DiseaseCategory/GetAll';
    const url = apiroute + BE_DiseaseCategory_GetAll

    let data = JSON.stringify({ isDeleted: true, searchString: '', id: 0 });

    axiosInstance
      .post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      .then(result => {
        if (result.data.flag) {
          // let diseaseCat = []; let cancerObj = result.data.outdata.filter(category =>
          // category.diseaseCategoryName.toLowerCase() == 'pbima-iti-pes');
          // diseaseCat.push(cancerObj); let healthObj =
          // result.data.outdata.filter(category =>
          // category.diseaseCategoryName.toLowerCase() == 'healthindex');
          // diseaseCat.push(healthObj);


          // let dataaaa = result.data.outdata
          // console.log(`dataaaa`, dataaaa);
          let diseaseCatObj = result
            .data
            .outdata
            .filter(category => category.diseaseCategoryId == 2 || category.diseaseCategoryId == 3 || category.diseaseCategoryId == 4 || category.diseaseCategoryId == 11 || category.diseaseCategoryId == 12);

          // .filter(category => category.diseaseCategoryName.toLowerCase() == 'With ctDNA & cfDNA testing'.toLowerCase() || category.diseaseCategoryName.toLowerCase() == 'No ctDNA & cfDNA testing'.toLowerCase() || category.diseaseCategoryName.toLowerCase() == 'Cancer - No Tumor'.toLowerCase() || category.diseaseCategoryName.toLowerCase() == 'Prevention'.toLowerCase());
          this.setState({
            diseasecategories: diseaseCatObj,
            diseaseCategoryId: diseaseCatObj[0].diseaseCategoryId,

          }, function () {
            this.getListData(0);
            // console.log(`diseasecategories`, this.state.diseasecategories);
            // console.log(`diseasecategories`, this.state.diseaseCategoryId);

          }


          );

          // console.log("final", this.state.diseasecategories);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
      });

  }

  //get data
  getListData(pageNo) {
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null
      ? 0
      : userToken.userId);

    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_ReportBuilder/GetAll';
    const url = apiroute + BE_ReportBuilder_GetAll

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      id: userId,
      diseaseCatId: parseInt(this.state.diseaseCategoryId)
    });

    axiosInstance
      .post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      .then(result => {
        if (result.data.flag) {

          // console.log(result.data.outdata);
          //   var rdata = result.data.outdata.filter(dl => dl.category.toLowerCase() !=
          // 'healthindex');
          this.setState({
            pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
            diseases: result.data.outdata,
            loading: false
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
    e.preventDefault();
    var pgcount = this.state.pagesCount - 1;
    var pgCurr = (index >= pgcount
      ? pgcount
      : index);
    this.setState({
      currentPage: pgCurr,
      currentIndex: currIndex
    }, function () {
      this.getListData(pgCurr);
    });
  }

  //search
  filter = (e) => {
    if (e.key == 'Enter') {
      const target = e.target;
      const value = target.value;
      // this.setState({
      //   tempCount: JSON.parse(value)
      // })

      this.setState(() => ({
        loading: true, currentPage: 0, currentIndex: 0, pagesCount: 0,
        //pageSize: 10,
        searchString: value.trim()
      }), function () {
        this.getListData(0);
      });
    }
  }

  //select
  filterOnSelect = (e) => {
    const target = e.target;
    const value = target.value;

    this.setState(() => ({
      loading: true, currentPage: 0, currentIndex: 0, pagesCount: 0,
      //pageSize: 10,
      diseaseCategoryId: value
    }), function () {
      this.getListData(0);
    });
  }

  //active/inactive filter
  handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    this.setState({
      tempCount: JSON.parse(value)
    })
    this.setState(() => ({
      loading: true, currentPage: 0, currentIndex: 0, pagesCount: 0,
      //pageSize: 10,
      slDelete: JSON.parse(value)
    }), function () {
      this.getListData(0);
    });
  }

  //delete(active/inactive) button click
  deleteRow(e, id) {
    // e.preventDefault();
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_ReportBuilder/Delete?id=' + id + '&userId=' + userId + '';
    const url = apiroute + BE_ReportBuilder_Delete(id, userId)

    axiosInstance
      .delete(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      .then(result => {
        if (result.data.flag) {
          toast.success(result.data.message)
          this.getListData(0);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        //console.log(error);
        toast.error(error.message)
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  handleDragEnd = (e) => {
    if (!e.destination)
      return;
    // debugger;

    this.setState({ loading: true });
    let tempData = Array.from(this.state.diseases);
    let [source_data] = tempData.splice(e.source.index, 1);

    tempData.splice(e.destination.index, 0, source_data);

    if (this.state.diseases) {
      var reportBuilders = this.state.diseases;

      let sourceIndex = e.source.index;
      let destinationIndex = e.destination.index;

      var sourceData = reportBuilders[sourceIndex];

      //database update    
      const apiroute = window.$APIPath;
      let data = [];
      let dt = {
        reportBuilderId: sourceData.reportBuilderId,
        sequence: destinationIndex + 1
      }
      data.push(dt);

      if (destinationIndex > sourceIndex) {
        let startI = (destinationIndex - 1);
        for (let i = startI; i <= destinationIndex; i++) {
          let DestinationData = reportBuilders[i];

          // console.log(DestinationData);
          let dtd = {
            reportBuilderId: DestinationData.reportBuilderId,
            sequence: i
          }
          data.push(dtd);
        }
      } if (destinationIndex < sourceIndex) {
        let startI = destinationIndex;
        for (let i = startI; i < sourceIndex; i++) {
          let DestinationData = reportBuilders[i];

          // console.log(DestinationData);
          let dtd = {
            reportBuilderId: DestinationData.reportBuilderId,
            sequence: i + 2
          }
          data.push(dtd);
        }
      }

      // console.log(data);
      // let url = apiroute + '/api/BE_ReportBuilder/UpdateSequence';
      let url = apiroute + BE_ReportBuilder_UpdateSequence
      axiosInstance.post(url, data, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }).then(result => {
        if (result.data.flag) {
          //reportBuilders[e.source.index].sequence = e.destination.index + 1;
          //reportBuilders[e.destination.index].sequence = e.source.index + 1;
          //console.log('Data', reportBuilders)
          this.setState({ diseases: tempData, loading: false });

          toast.success(result.data.message)
        }
        else {
          toast.error(result.data.message)
        }
      })
    }


    // console.log(this.state.diseases);
  };

  temp() {
    let countT = this.state.diseases.filter((data, i) => {
      return data.isActive == true
    })
    let countF = this.state.diseases.filter((data, i) => {
      return data.isActive == false
    })
    this.setState({
      activeCountTrue: countT.length,
      activeCountFalse: countF.length,

    })
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
  }

  render() {
    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const {
      loading,
      diseases,
      currentPage,
      currentIndex,
      diseasecategories,
      diseaseCategoryId,
      pagesCount,
      pageSize,
      authError,
      error
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
          <Col xs="11" lg="11">
            <h5 className="mt-2" id="pagetitle" style={{ width: "fit-content" }}>
              <i className="fa fa-align-justify"></i>
              &nbsp;Report Builder
            </h5>
          </Col>
          <Col xs="1" lg="1">
            {
              this.state.isEdit ? <>
                <Link to="/master/report/details">
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
                          return (
                            <option key={i} value={data.diseaseCategoryId}>{data.diseaseCategoryName}</option>
                          );
                        })}
                      </Input>
                    </FormGroup>
                  </Col>
                  {/* <Col xs="3">
                    <FormGroup>
                      <Input type="select" name="diseaseCategoryId" onChange={this.filterOnSelect}>
                        {diseasecategories.map((data, i) => {
                          return (
                            <option key={i} value={data.diseaseCategoryId}>{data.diseaseCategoryName + " (" + data.productName + ")"}</option>
                          );
                        })}
                      </Input>
                    </FormGroup>
                  </Col> */}
                  <Col xs="6">
                    {this.state.openSearch
                      ? (
                        <div className="searchBox">
                          <input id="searchbar" type="text" placeholder="Search..." onKeyPress={this.filter} />
                          <Link className="closeSearch" to="#" onClick={this.closeSearch}><i className="fa fa-close" /></Link>
                        </div>
                      )
                      : (
                        <div className="search" onClick={() => this.setState({ openSearch: true })}>
                          <i className="fa fa-search" />
                        </div>
                      )}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <DragDropContext onDragEnd={this.handleDragEnd}>
                  {authError
                    ? <p>{error.message}</p>
                    : null}
                  <Table responsive bordered key="tblDiseases">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Title</th>
                        {/*<th>Report Type</th>*/}
                        <th>Type</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <Droppable droppableId="droppable-1">
                      {(provider) => (
                        <tbody
                          className="text-capitalize"
                          ref={provider.innerRef}
                          {...provider.droppableProps}>
                          {diseases
                            ?.map((data, i) => {
                              return (
                                <Draggable
                                  key={data
                                    .reportBuilderId
                                    .toString()}
                                  draggableId={data
                                    .reportBuilderId
                                    .toString()}
                                  index={i}>
                                  {(provider) => (
                                    <tr {...provider.draggableProps} ref={provider.innerRef}>
                                      <td id="draganddrop" {...provider.dragHandleProps}>
                                        =
                                      </td>

                                      <td>{data.title}</td>
                                      {/*<td>{data.diseaseCategory}</td>*/}
                                      <td>
                                        {data.type == 'D'
                                          ? "Dynamic"
                                          : "Static"}
                                      </td>
                                      <td>
                                        {data.isActive
                                          ? (
                                            <Badge color="success">Active</Badge>
                                          )
                                          : (
                                            <Badge color="danger">Inactive</Badge>
                                          )}
                                      </td>
                                      <td>
                                        <div className='d-flex'>
                                          <Link
                                            id="Edit"
                                            className="btn btn-primary btn-sm btn-pill"
                                            to={`/master/report/modify/${data.reportBuilderId}`}>Edit</Link>{" "}

                                          {
                                            this.state.isEdit ? <>

                                              {data.isActive
                                                ? <Confirm
                                                  title="Confirm"
                                                  description="Are you sure you want to inactive this Report Data ?">
                                                  {confirm => (
                                                    <Link
                                                      id="Delete"
                                                      className="btn btn-warning btn-sm btn-pill ml-1"
                                                      to="#"
                                                      onClick={confirm(e => this.deleteRow(e, data.reportBuilderId))}>
                                                      <b>Inactive</b>
                                                    </Link>
                                                  )}
                                                </Confirm>
                                                : <Confirm
                                                  title="Confirm"
                                                  description="Are you sure you want to active this Report Data ?">
                                                  {confirm => (
                                                    <Link
                                                      id="Delete"

                                                      className="btn btn-info btn-sm btn-pill ml-1"
                                                      to="#"
                                                      onClick={confirm(e => this.deleteRow(e, data.reportBuilderId))}>
                                                      <b>Active</b>
                                                    </Link>
                                                  )}
                                                </Confirm>}
                                            </> : null
                                          }

                                        </div>
                                      </td>

                                    </tr>
                                  )}
                                </Draggable>
                              )
                            })}{provider.placeholder}
                        </tbody>
                      )}
                    </Droppable>
                  </Table>
                </DragDropContext>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default List;
