import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import * as router from "react-router-dom";
import { Container, NavLink } from "reactstrap";
import axios from "axios";

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from "@coreui/react";
// sidebar nav config
import navigation from "../../_nav";
//import navigationuser from '../../_navuser';
// routes config
import routes from "../../routes";
import { object } from "prop-types";
import axiosInstance from "./../../common/axiosInstance"
import { Link } from "react-router-dom/cjs/react-router-dom";
const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      isAdmin: false,
      nav: "",
      loading: true,
    };
    this.state = this.initialState;
  }

  loading = () => <div className="cover-spin"></div>;

  checkPath() {
    var path = this.props.location.pathname;
    if (path.includes("/pmrapprove/")) {
      localStorage.setItem("redirectPath", path);
    } else if (path.includes("/pmrverify/")) {
      localStorage.setItem("redirectPath", path);
    }
  }

  checkExpiration() {
    // this.checkPath();
    //alert(new Date());
    //check if past expiration date
    // var values = localStorage.getItem("expiry");
    // //check "my hour" index here
    // //alert(new Date(values) < new Date());
    // if (new Date(values) < new Date()) {
    //   localStorage.removeItem("AUserToken");
    //   localStorage.removeItem("expiry");
    //   localStorage.setItem("isLoggedIn", false);
    //   this.props.history.push("/login");
    // }
  }

  signOut(e) {
    e.preventDefault();
    this.setState({ logout: true });
    localStorage.removeItem("AUserToken");
    // localStorage.removeItem("isLoggedIn");
    // localStorage.removeItem("expiry");
    // localStorage.removeItem("isFirstLogin");
    // localStorage.removeItem("OnlyToken");

    this.props.history.push("/login");
  }

  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    if (userToken != null) {
      if (userToken.roleId) {
        let rid = userToken.roleId;
        const apiroute = window.$APIPath;
        const url =
          apiroute + "/api/BE_OrganizationUser/allmenu?id=" + rid + "";

        axiosInstance
          .post(url, {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          })
          .then((result) => {
            //console.log(result.data.outdata);
            if (result.data.flag) {
              this.setState({ nav: result.data.outdata, loading: false });
              //this.setState({ patients: result.data.outdata })
            } else {
              this.setState({ loading: false });
            }
          })
          .catch((error) => {
            // console.log(error);
            this.setState({ authError: true, error: error, loading: false });
          });
      }
    } else {
      this.props.history.push("/login");
    }
    //if (userToken.roleName == "Neo Admin") {
    //  this.setState({
    //    isAdmin: true
    //  });
    //}
    //else {
    //  this.setState({
    //    isAdmin: false
    //  });
    //}
  }

  handleNavigation = (getPath, getName) => {
    // debugger
    switch (getPath) {
      case "/":
        return <Link to="/dashboard" style={{ textDecoration: "none", PointerEvent: "" }}>Dashboard</Link>
      // case "/patients/patientinfo":

      //   // return <Link to={this.props?.location?.state?.redirectTo ? this.props?.location?.state?.redirectTo : "/patients/list"} style={{ textDecoration: "none", PointerEvent: "" }}>{this.props?.location?.state?.redirectTo ? getName : "Patients List"}</Link>
      //   // return <Link to={this.props?.location?.state?.redirectTo} style={{ textDecoration: "none", PointerEvent: "" }}>{getName}</Link>
      //   return <Link to={this.props?.history?.location?.state?.redirectTo} >{getName}</Link>
      case "/patients":
        return <Link to="/patients/list" >Patients List</Link>
      case "/practitioners":
        return <Link to="/practitioners/list" >Practitioners List</Link>
      case "/ngslaboratory":
        return <Link to="/ngslaboratory/list" >Laboratory List</Link>

      default:
        return getName
    }

  }

  render() {
    if (localStorage.getItem("AUserToken") == null) {
      this.checkPath();
      return <Redirect to="/login" />;
    } else {
      this.checkExpiration();
    }
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={(e) => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        {!this.state.loading ? (
          <div className="app-body">
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <Suspense>
                {/*this.state.isAdmin ?
                <AppSidebarNav navConfig={navigation} {...this.props} router={router} />
                :
                <AppSidebarNav navConfig={navigationuser} {...this.props} router={router} />
              */}
                {this.state.nav != "" ? (
                  <AppSidebarNav
                    navConfig={this.state.nav}
                    {...this.props}
                    router={router}

                  />
                ) : null}
              </Suspense>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <AppBreadcrumb appRoutes={routes.map(m => { return { ...m, name: this.handleNavigation(m.path, m.name) } })} router={router} />
              <Container fluid>
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={(props) => <route.component {...props} />}
                        />
                      ) : null;
                    })}
                    <Redirect from="/" to="/patients/list" />
                  </Switch>
                </Suspense>
              </Container>
            </main>
            <AppAside fixed>
              <Suspense fallback={this.loading()}>
                <DefaultAside />
              </Suspense>
            </AppAside>
          </div>
        ) : (
          <div className="cover-spin"></div>
        )}
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
