import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import { toast } from "react-toastify";
import { LOGIN } from "../../../common/allApiEndPoints";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      submitted: false,
      loading: false,
      authError: false,
      error: "",
      redirect: false,
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePwdChange = this.handlePwdChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //modal close button event
  handleModalClose = () => {
    this.setState({
      modal: false,
      modalTitle: "",
      modalBody: "",
    });
  };

  handleEmailChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePwdChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    // debugger;
    //console.log('You are logged in');
    //console.log(this.state);
    this.setState({ loading: true });
    //var apiroute = process.env.REACT_APP_API_PATH;
    const apiroute = window.$APIPath;
    // const url = apiroute + "/api/BE_OrganizationUser/signin";
    const url = apiroute + LOGIN;
    const username = this.state.username;
    const password = this.state.password;

    let data = JSON.stringify({
      password: password,
      username: username,
    });

    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          //'Access-Control-Allow-Origin': '*',
          //'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
          //'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
        },
      })
      .then((result) => {

        // console.log(result);
        if (result.data.flag) {
          localStorage.setItem(
            "OnlyToken",
            JSON.stringify(result.data.token)
          );
          //localStorage.setItem('token', JSON.stringify(result.data.token));
          localStorage.setItem(
            "AUserToken",
            JSON.stringify(result.data.outdata)
          );
          localStorage.setItem("isLoggedIn", true);
          let isFirstLogin = localStorage.getItem("isFirstLogin")
          let isSkip = result.data?.outdata?.isSkip
          let isComplete = result.data?.outdata?.isComplete
          if (isSkip == false && isComplete == false) {
            localStorage.setItem("isFirstLogin", true);
          } else {
            localStorage.setItem("isFirstLogin", false);

          }
          var myHour = new Date();
          myHour.setHours(new Date().getHours() + 12); //12 hour from now
          localStorage.setItem("expiry", myHour);

          this.setState({ redirect: true, loading: false });
          // toast.success(result.data.message);
        } else {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false,
          });
          toast.error(result.data.message);
        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: error.message,
          authError: true,
          loading: false,
        });
        toast.error(error.message);
      });
  }

  renderRedirect() {
    if (this.state.redirect) {
      if (localStorage.getItem("redirectPath") != null) {
        var path = localStorage.getItem("redirectPath");
        return <Redirect from="/" to={path} />;
      } else {
        return <Redirect from="/" to="/patients/list" />;
      }
    }
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin"></div>;
    }
  }

  render() {
    // if (localStorage.getItem('token') != null) {
    //   return <Redirect to="/dashboard" />
    // }
    const { username, password, submitted, loading } = this.state;
    return (
      <div className="app flex-row align-items-center">
        {this.loader()}

        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Username"
                          name="username"
                          onChange={this.handleEmailChange}
                          required
                          autoComplete="username"
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          name="password"
                          onChange={this.handlePwdChange}
                          required
                          autoComplete="current-password"
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            disabled={loading}
                            className="px-4"
                          >
                            Login
                          </Button>
                        </Col>
                        {/*<Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>*/}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CardBody className="text-center">
                    <h2 style={{ marginTop: "25%" }}>Neo7Bioscience, Inc</h2>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>

        <MyModal
          handleModal={this.handleModalClose.bind(this)}
          //modalAction={this.state.modalAction}
          isOpen={this.state.modal}
          modalBody={this.state.modalBody}
          modalTitle={this.state.modalTitle}
          modalOptions={this.state.modalOptions}
        />

        {this.renderRedirect()}
      </div>
    );
  }
}

export default Login;
