import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  FormGroup,
  Form,
  Input,
  Row,
  Label,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import { toast } from "react-toastify";
import axiosInstance from "./../../../common/axiosInstance"
import { BE_OrganizationUser_GetById, BE_OrganizationUser_Save, BE_OrganizationUser_Update, BE_Role_GetAll } from "../../../common/allApiEndPoints";

class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      isEdit: false,
      isView: false,
      organizationUserId: 0,
      fullName: "",
      fullName2: "",
      email: "",
      email2: "",
      userName: "",
      userName2: "",
      password: "",
      password2: "",
      roles: [],
      roleId: "",
      roleId2: "",
      errors: {
        fullName: "",
        email: "",
        userName: "",
        password: "",
        roleId: "",
        cpassword: ""
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
      cpassword: ""
      //modalAction: '',
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
      this.props.history.push("/master/organizationuser/list");
    }
  };

  //get detail
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    var rights = userToken.roleModule;
    if (rights.length > 0) {
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

    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_Role/GetAll";
    const url = apiroute + BE_Role_GetAll

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
        if (result.data.flag) {
          this.setState(
            () => ({ roles: result.data.outdata }),
            function () {
              const param = this.props.match.params;
              if (param.id != undefined) {
                this.getData(param.id);
              } else {
                this.setState({ loading: false });
              }
            }
          );
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });


  }

  //get detail(for update)
  getData = (id) => {
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_OrganizationUser/GetById?id=" + id + "";
    const url = apiroute + BE_OrganizationUser_GetById(id)
    this.setState({
      loading: true
    })
    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        // console.log("RData::", result.data.outdata)
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState({
            organizationUserId: rData.organizationUserId,
            userName: rData.userName,
            email: rData.email,
            password: rData.password,
            roleId: rData.roleId,
            fullName: rData.fullName,
            userName2: rData.userName,
            email2: rData.email,
            password2: rData.password,
            cpassword: rData.password,
            roleId2: rData.roleId,
            fullName2: rData.fullName,
            loading: false,
          });
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

  //form reset button click
  onResetClick(e) {
    e.preventDefault();
    this.setState({
      email: this.state.email2,
      fullName: this.state.fullName2,
      userName: this.state.userName2,
      password: this.state.password2,
      cpassword: "",
      roleId: this.state.roleId2,
      errors: {
        roleId: "",
        email: "",
        fullName: "",
        userName: "",
        password: "",
        cpassword: ""
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
      loading: false,

    },
      () => {
        const param = this.props.match.params;
        if (param.id != undefined) {
          this.getData(param.id);
        }
      }
    );
    // console.log("User::", this.state.userName)
  }

  //input handle input change and validation
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;
    // const validMobileRegex = RegExp(/^[0-9+() -]+$/);
    // const validNumberRegex = RegExp(/^[0-9]+$/);
    // const validAlphaRegex = RegExp(/^[a-zA-Z \b]+$/);
    const validAlphaNoRegex = RegExp(/^[a-zA-Z \b]+$/);
    const validEmailRegex = RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    switch (name) {
      case "fullName":
        errors.fullName = (!value)
          ? "This field is required."
          : validAlphaNoRegex.test(value)
            ? ""
            : "Only alphabet allowed.";
        this.setState({ fullName: value.replace(/[^a-zA-Z \b]+$/, "") });
        break;
      case "userName":
        errors.userName = (!value)
          ? "This field is required."
          : validAlphaNoRegex.test(value)
            ? ""
            : "Only alphabet allowed.";
        this.setState({ userName: value.replace(/[^a-zA-Z \b]+$/, "") });
        break;
      // case "email":
      //   errors.email = !value ? "This field is required." : "";
      //   break;
      case "email":
        errors.email = !value
          ? "This field is required."
          : validEmailRegex.test(value)
            ? ""
            : "Invalid Email.";
        break;
      case "password":
        errors.password = !value ? "This field is required." : "";
        break;
      case "cpassword":
        if (value == this.state.password) {
          errors.cpassword = "";
        }
        if (value != this.state.password) {
          errors.cpassword = "Password does not match.";
        }
        break;
      case "roleId":
        errors.roleId = !value ? "Please select role." : "";
        break;
      default:
        //(!value) ? '' :'This field is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => {
      //console.log(errors)
    });
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.userName == undefined || this.state.userName == "") {
      errors.userName = "This field is required.";
    }
    if (this.state.email == undefined || this.state.email == "") {
      errors.email = "This field is required.";
    }
    if (this.state.fullName == undefined || this.state.fullName == "") {
      errors.fullName = "This field is required.";
    }
    if (this.state.password == undefined || this.state.password == "") {
      errors.password = "This field is required.";
    }
    if (this.state.cpassword == undefined || this.state.cpassword == "") {
      errors.cpassword = "This field is required.";
    }
    if (this.state.roleId == undefined || this.state.roleId == "") {
      errors.roleId = "Please select role.";
    }
    if (this.state.password != this.state.cpassword) {
      errors.cpassword = "Password does not match.";
    }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  };

  //form submit
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));

    let url = "";

    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      if (this.state.organizationUserId == 0) {
        // url = apiroute + "/api/BE_OrganizationUser/Save";
        url = apiroute + BE_OrganizationUser_Save
      } else {
        // url = apiroute + "/api/BE_OrganizationUser/Update";
        url = apiroute + BE_OrganizationUser_Update
      }

      let data = JSON.stringify({
        organizationUserId: this.state.organizationUserId,
        userName: this.state.userName,
        email: this.state.email,
        fullName: this.state.fullName,
        password: this.state.password,
        roleId: parseInt(this.state.roleId),
        createdBy: userToken.userId == null ? 0 : userToken.userId,
      });

      axiosInstance
        .post(url, data, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {
          this.setState({ loading: false });

          if (result.data.flag) {
            // this.setState({
            //   modal: !this.state.modal,
            //   modalTitle: 'Success',
            //   modalBody: result.data.message
            // });
            toast.success(result.data.message);
            this.setState({ redirect: true });
            this.props.history.push("/master/organizationuser/list");
          } else {
            // this.setState({
            //   modal: !this.state.modal,
            //   modalTitle: 'Error',
            //   modalBody: result.data.message
            // });
            toast.error(result.data.message);
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
          //this.setState({ authError: true, error: error });
        });
    } else {
      this.setState({ loading: false });
    }
  }

  //renderRedirect() {
  //  if (this.state.redirect) {
  //    return <Redirect from="/" to="/master/role/list" />
  //  }
  //}
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
      roleId,
      roles,
      organizationUserId,
      userName,
      fullName,
      password,
      email,
      errors,
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Organization User Detail
            </h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/master/organizationuser/list">
              <button className="btn btn-primary btn-block">List</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            {/* {!loading ? (*/}
            <Card>
              <CardBody>
                <Form
                  className="form-horizontal"
                  onSubmit={this.handleSubmit.bind(this)}
                >
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label>
                          Role <span className="requiredField">*</span>
                        </Label>
                        <Input
                          className={errors.roleId ? "error" : ""}
                          type="select"
                          name="roleId"
                          value={roleId}
                          onChange={this.handleInputChange.bind(this)}
                          tabIndex="1"
                        >
                          <option value="">Select role</option>
                          {roles.map((data, i) => {
                            return (
                              <option key={i} value={data.roleId}>
                                {data.roleName}
                              </option>
                            );
                          })}
                        </Input>
                        {errors.roleId.length > 0 && (
                          <span className="error">{errors.roleId}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>
                          Name <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={errors.fullName ? "error" : ""}
                          name="fullName"
                          value={fullName}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter name"
                          maxLength="200"
                          tabIndex="2"
                          autocomplete="off"

                        />
                        {errors.fullName.length > 0 && (
                          <span className="error">{errors.fullName}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>
                          Email <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={errors.email ? "error" : ""}
                          name="email"
                          value={email}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter email"
                          maxLength="200"
                          tabIndex="3"
                          autocomplete="off"


                        />
                        {errors.email.length > 0 && (
                          <span className="error">{errors.email}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>
                          User Name <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={errors.userName ? "error" : ""}
                          name="userName"
                          value={userName}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter user name"
                          maxLength="200"
                          tabIndex="4"
                          autocomplete="off"


                        />
                        {errors.userName.length > 0 && (
                          <span className="error">{errors.userName}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>
                          Password <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="password"
                          className={errors.password ? "error" : ""}
                          name="password"
                          value={password}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter password"
                          maxLength="20"
                          tabIndex="5"
                          autocomplete="off"

                        />
                        {errors.password.length > 0 && (
                          <span className="error">{errors.password}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>
                          Confirm Password <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="password"
                          className={errors.cpassword ? "error" : ""}
                          name="cpassword"
                          value={this.state.cpassword}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter password"
                          maxLength="20"
                          tabIndex="5"
                          autocomplete="off"

                        />
                        {errors.cpassword.length > 0 && (
                          <span className="error">{errors.cpassword}</span>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12" className="mt-3">
                      <FormGroup className="formButton">
                        <Input
                          type="hidden"
                          name="organizationUserId"
                          value={organizationUserId}
                        />
                        {
                          this.state.isEdit ? <>
                            <Button
                              type="submit"
                              disabled={loading}
                              size="sm"
                              color="primary"
                            >
                              <i className="fa fa-dot-circle-o"></i> Submit
                            </Button><span>{" "}</span>
                          </> : null
                        }
                        {
                          this.state.isEdit ? <>
                            <Button
                              type="reset"
                              size="sm"
                              color="danger"
                              onClick={this.onResetClick.bind(this)}
                            >
                              <i className="fa fa-ban"></i> Reset
                            </Button>
                          </> : null
                        }


                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
            {/*) : (
                <div className="animated fadeIn pt-1 text-center">Loading...</div>
              )}*/}
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

export default Details;
