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
import MyModal from "../CustomModal/CustomModal";
import { toast } from "react-toastify";
import axiosInstance from "../../common/axiosInstance";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      organizationUserId: 0,
      userId: 0,
      email: "",
      userName: "",
      fullName: "",
      userPassword: "",
      OldPassword: "",
      password: "",
      confirmPassword: "",
      errors: {
        email: "",
        userName: "",
        fullName: "",
        OldPassword: "",
        password: "",
        confirmPassword: "",
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
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
  };

  //get detail
  componentDidMount() {
    this.getData();
  }

  //get detail(for update)
  getData = () => {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    var id = userToken.organizationUserId;

    const apiroute = window.$APIPath;
    const url = apiroute + "/api/BE_OrganizationUser/GetById?id=" + id + "";

    axiosInstance
      .get(url, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((result) => {
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState({
            organizationUserId: rData.organizationUserId,
            userId: rData.userId,
            email: rData.email,
            fullName: rData.fullName,
            userPassword: rData.password,
            userName: rData.userName,
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
      loading: false,
      email: "",
      userName: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      errors: {
        email: "",
        userName: "",
        fullName: "",
        password: "",
        confirmPassword: "",
      },
      redirect: false,
      modal: false,
      modalTitle: "",
      modalBody: "",
    });
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

    switch (name) {
      case "email":
        errors.email = !value ? "This field is required." : "";
        break;
      case "userName":
        errors.userName = !value ? "This field is required." : "";
        break;
      case "fullName":
        errors.fullName = !value ? "This field is required." : "";
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

    if (this.state.email == undefined || this.state.email == "") {
      errors.email = "This field is required.";
    }

    if (this.state.userName == undefined || this.state.userName == "") {
      errors.userName = "This field is required.";
    }

    if (this.state.fullName == undefined || this.state.fullName == "") {
      errors.fullName = "This field is required.";
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
    //console.log('Submit');
    //console.log(this.state);
    let url = "";

    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      url = apiroute + "/api/BE_OrganizationUser/Update";

      let data = JSON.stringify({
        userId: parseInt(this.state.userId),
        organizationUserId: parseInt(this.state.organizationUserId),
        UserType: 5,
        email: this.state.email,
        userName: this.state.userName,
        fullName: this.state.fullName,
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
            this.setState(
              {
                // modal: !this.state.modal,
                // modalTitle: 'Success',
                // modalBody: result.data.message
              },
              this.getData()
            );
            toast.success(result.data.message);
          } else {
            this.setState({
              // modal: !this.state.modal,
              // modalTitle: 'Error',
              // modalBody: result.data.message
            });
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

  //input handle input change and validation
  handleInputChangePassword(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    let errors = this.state.errors;

    switch (name) {
      case "OldPassword":
        errors.OldPassword = !value ? "This field is required." : "";
        break;
      case "password":
        errors.password = !value ? "This field is required." : "";
        break;
      case "confirmPassword":
        errors.confirmPassword = !value ? "This field is required." : "";
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
  validateFormPassword = (errors) => {
    let valid = true;

    if (this.state.OldPassword == undefined || this.state.OldPassword == "") {
      errors.OldPassword = "This field is required.";
    } else if (this.state.userPassword != this.state.OldPassword) {
      errors.OldPassword = "Wrong old password.";
    }

    if (this.state.password == undefined || this.state.password == "") {
      errors.password = "This field is required.";
    }

    if (
      this.state.confirmPassword == undefined ||
      this.state.confirmPassword == ""
    ) {
      errors.confirmPassword = "This field is required.";
    } else if (
      this.state.password != "" &&
      this.state.password != this.state.confirmPassword
    ) {
      errors.confirmPassword = "Password and confirm password does not match.";
    }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  };

  //form submit
  handleSubmitPassword(e) {
    e.preventDefault();
    this.setState({ loading: true });
    //console.log('Submit');
    //console.log(this.state);
    let url = "";

    if (this.validateFormPassword(this.state.errors)) {
      const apiroute = window.$APIPath;
      url = apiroute + "/api/BE_OrganizationUser/UpdatePassword";

      let data = JSON.stringify({
        userId: parseInt(this.state.userId),
        organizationUserId: parseInt(this.state.organizationUserId),
        password: this.state.password,
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
            this.setState(
              {
                // modal: !this.state.modal,
                // modalTitle: 'Success',
                // modalBody: result.data.message,
                OldPassword: "",
                password: "",
                confirmPassword: "",
              },
              this.getData()
            );
            toast.success(result.data.message);
            localStorage.removeItem("AUserToken")
            // this.props.history.push("/login")
          } else {
            this.setState({
              // modal: !this.state.modal,
              // modalTitle: 'Error',
              // modalBody: result.data.message
            });
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

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
  }

  //renderRedirect() {
  //  if (this.state.redirect) {
  //    return <Redirect from="/" to="/master/role/list" />
  //  }
  //}

  render() {
    if (localStorage.getItem("AUserToken") == null) {
      return <Redirect to="/login" />;
    }

    const {
      loading,
      organizationUserId,
      email,
      userName,
      fullName,
      OldPassword,
      confirmPassword,
      password,
      errors,
    } = this.state;

    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Profile
            </h5>
          </Col>
          <Col xs="1" lg="1"></Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            {/* {!loading ? (*/}
            <Card>
              <CardBody>
                <Form className="form-horizontal">
                  <Row>

                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Name <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.fullName ? "is-invalid" : "is-valid"
                          }
                          name="fullName"
                          value={fullName}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter name"
                          maxLength="200"
                        />
                        {errors.fullName.length > 0 && (
                          <span className="error">{errors.fullName}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Email <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="text"
                          className={errors.email ? "is-invalid" : "is-valid"}
                          name="email"
                          value={email}
                          onChange={this.handleInputChange.bind(this)}
                          placeholder="Enter email"
                          maxLength="200"
                        />
                        {errors.email.length > 0 && (
                          <span className="error">{errors.email}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          User Name
                        </Label>
                        <Input
                          type="text"
                          className={
                            errors.userName ? "is-invalid" : "is-valid"
                          }
                          name="userName"
                          value={userName}
                          // onChange={this.handleInputChange.bind(this)}
                          disabled={true}
                          placeholder="Enter username"
                          maxLength="200"
                        />
                        {errors.userName.length > 0 && (
                          <span className="error">{errors.userName}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs="6"></Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input
                          type="hidden"
                          name="organizationUserId"
                          value={organizationUserId}
                        />
                        <Button
                          type="button"
                          onClick={this.handleSubmit.bind(this)}
                          disabled={loading}
                          color="primary"
                        >
                          <i className="fa fa-dot-circle-o"></i> Submit
                        </Button>{" "}
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2">
              <i className="fa fa-align-justify"></i> Change Password
            </h5>
          </Col>
          <Col xs="1" lg="1"></Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardBody>
                <Form className="form-horizontal">
                  <Row>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Old Password <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="password"
                          className={
                            errors.OldPassword ? "is-invalid" : "is-valid"
                          }
                          name="OldPassword"
                          value={OldPassword}
                          onChange={this.handleInputChangePassword.bind(this)}
                          placeholder="Enter old password"
                          maxLength="20"
                        />
                        {errors.OldPassword.length > 0 && (
                          <span className="error">{errors.OldPassword}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          New Password <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="password"
                          className={
                            errors.password ? "is-invalid" : "is-valid"
                          }
                          name="password"
                          value={password}
                          onChange={this.handleInputChangePassword.bind(this)}
                          placeholder="Enter new password"
                          maxLength="20"
                        />
                        {errors.password.length > 0 && (
                          <span className="error">{errors.password}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup>
                        <Label>
                          Confirm Password{" "}
                          <span className="requiredField">*</span>
                        </Label>
                        <Input
                          type="password"
                          className={
                            errors.confirmPassword ? "is-invalid" : "is-valid"
                          }
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={this.handleInputChangePassword.bind(this)}
                          placeholder="Enter confirm new password"
                          maxLength="20"
                        />
                        {errors.confirmPassword.length > 0 && (
                          <span className="error">
                            {errors.confirmPassword}
                          </span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col xs="6"></Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input
                          type="hidden"
                          name="organizationUserId"
                          value={organizationUserId}
                        />
                        <Button
                          type="button"
                          onClick={this.handleSubmitPassword.bind(this)}
                          disabled={loading}
                          color="primary"
                        >
                          <i className="fa fa-dot-circle-o"></i> Submit
                        </Button>{" "}
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

export default Profile;
