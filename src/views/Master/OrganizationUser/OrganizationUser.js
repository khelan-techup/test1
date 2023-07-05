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
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import { toast } from "react-toastify";
import Confirm from "../../CustomModal/Confirm";
import { Steps } from "intro.js-react";
import axiosInstance from "./../../../common/axiosInstance"
import ReactPaginate from "react-paginate";
import { BE_OrganizationUser_Delete, BE_OrganizationUser_GetAllPaging, BE_OrganizationUser_UpdateTooltipSteps } from "../../../common/allApiEndPoints";


class List extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.initialState = {
      loading: true,
      openSearch: true,
      organizationusers: [],
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
      roleName: "",
      activeCountTrue: '',
      activeCountFalse: '',
      tempCount: true,

      isSkipped: false,
      stepsEnabled: false, // stepsEnabled starts the tutorial
      initialStep: 0,
      currentStep: 0,
      steps: [{
        element: "#pagetitle",
        title: 'Organization User',
        intro: "Used to add a new User to the Portal or change roles of a Current User.",
        tooltipClass: "cssClassName1",
      },
      {
        element: "#Add",
        title: 'Add New Organization User',
        tooltipClass: "cssClassName1",
        intro: "You can add new organization user by clicking on this Add button."
      },
      {
        element: "#activeInactiveFilter",
        title: 'Active/Inactive filter for Organization User list',
        intro: "You can filter organization user list by selecting active or inactive option.",
        tooltipClass: "cssClassName1",
      },
      {
        element: "#searchbar ",
        title: 'Search Organization User',
        tooltipClass: "cssClassName1",
        intro: "This Search Bar allows the User to search in Organization User List."
      },

      {
        element: "#Edit",
        title: 'Edit Organization User',
        tooltipClass: "cssClassName1",
        intro: "You can edit or update organization user details by clicking on this Edit button."
      },
      {
        element: "#Delete",
        title: 'Delete or Recover Organization User',
        tooltipClass: "cssClassName1",
        intro: "You can delete/recover organization user by clicking on this Delete/Recover button."
      },
      {
        element: "#help",
        tooltipClass: "cssClassName1",
        title: "Tour",
        intro: "Highlights key page features and functions."
      },

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
    if (rights?.length > 0) {
      let currentrights = rights.filter(role => role.moduleId.toString() == "11");
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

    this.setState({ roleName: userToken.roleName });

    this.getListData(0);
  }

  //get data
  getListData(pageNo) {
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId == null ? 0 : userToken.userId;

    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_OrganizationUser/GetAllPaging";
    const url = apiroute + BE_OrganizationUser_GetAllPaging

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
          var rdata = result.data.outdata;
          //var finaldata = rdata.filter(organizationuser => organizationuser.organizationuserName !== "SuperAdmin");
          var finaldata = rdata;
          this.setState({
            pagesCount: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            pageCountNew: Math.ceil(
              result.data.totalRecord / window.$TotalRecord
            ),
            organizationusers: finaldata,
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
      tempCount: JSON.parse(value)
    })
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
    // e.preventDefault();
    //const currorganizationusers = this.state.organizationusers;
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_OrganizationUser/Delete?id=" + id + "&userId=" + userId + '';
    const url = apiroute + BE_OrganizationUser_Delete(id, userId)
    // console.log("url",url)

    axiosInstance
      .delete(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log("result",result)

        if (result.data.flag) {
          // this.setState({
          //   modal: !this.state.modal,
          //   modalTitle: 'Success',
          //   modalBody: result.data.message
          // });
          toast.success(result.data.message);
          //this.setState({
          //  organizationusers: currorganizationusers.filter(organizationuser => organizationuser.organizationUserId !== id)
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
    let countT = this.state.organizationusers.filter((data, i) => {
      return data.isActive == true
    })
    let countF = this.state.organizationusers.filter((data, i) => {
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

  handlePageClick = (e) => {
    console.log("datra", e.selected)
    let currentPage = e.selected;
    this.getListData(currentPage)

  }

  render() {
    if (localStorage.getItem("AUserToken") == null) {
      return <Redirect to="/login" />;
    }

    const {
      loading,
      organizationusers,
      currentPage,
      currentIndex,
      pagesCount,
      pageSize,
      roleName,
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
              <i className="fa fa-align-justify"></i> Organization User List
            </h5>
          </Col>
          <Col xs="1" lg="1">
            {
              this.state.isEdit ? <>
                <Link to="/master/organizationuser/details">
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
                    <Input
                      id="activeInactiveFilter"
                      type="select"
                      name="slDelete"
                      onChange={this.handleChange}
                    >
                      <option value="true">Active {this.state.tempCount == true ? `(${this.state.activeCountTrue})` : ''}</option>
                      <option value="false">Inactive {this.state.tempCount == false ? `(${this.state.activeCountFalse})` : ''}</option>
                    </Input>
                  </Col>
                  <Col xs="4"></Col>
                  <Col xs="6">
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
                <Table responsive bordered key="tblRoles">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>User Name</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="thNone">Role Id</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // !loading ? (
                      //organizationusers.map(function (data,i) {
                      organizationusers.length > 0 ? (
                        organizationusers
                          //.slice(
                          //  currentPage * pageSize,
                          //  (currentPage + 1) * pageSize
                          //)
                          .map((data, i) => {
                            return (
                              <tr key={i}>
                                <td>{data.fullName}</td>
                                <td>{data.email}</td>
                                <td>{data.userName}</td>
                                <td>{data.roleName}</td>
                                <td>
                                  {data.isActive ? (
                                    <Badge color="success">Active</Badge>
                                  ) : (
                                    <Badge color="danger">Inactive</Badge>
                                  )}
                                </td>
                                <td className="thNone">
                                  {data.organizationUserId}
                                </td>

                                <td>
                                  <div className='d-flex'>
                                    <Link
                                      id="Edit"
                                      className="btn btn-primary btn-sm btn-pill"
                                      to={
                                        "/master/organizationuser/modify/" +
                                        data.organizationUserId
                                      }
                                    >
                                      Edit
                                    </Link>{" "}
                                    {/* {roleName == "Neo Admin" ? ( */}
                                    {this.state.isEdit ? (
                                      <Confirm
                                        title="Confirm"
                                        description={`${data.isActive ? 'Are you sure you want to delete this User?' : 'Are you sure you want to recover this User?'}`}
                                      >
                                        {(confirm) => (
                                          <Link
                                            id="Delete"
                                            className="btn btn-danger btn-sm btn-pill ml-2"
                                            to="#"
                                            onClick={confirm((e) =>
                                              this.deleteRow(
                                                e,
                                                data.organizationUserId
                                              )
                                            )}
                                          >
                                            {data.isActive ? ("Delete") : ("Recover")}

                                          </Link>
                                        )}
                                      </Confirm>
                                    ) : null}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td colSpan="6" className="tdCenter">
                            No organization users.
                          </td>
                        </tr>
                        // )) : (
                        // <tr>
                        //   <td colSpan="6" className="tdCenter">Loading...</td></tr>
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
                  <PaginationItem disabled={currentIndex + 5 >= pagesCount}>
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
      </div>
    );
  }
}

export default List;
