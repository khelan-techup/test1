import React, { Component, lazy, Suspense } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Input
} from 'reactstrap';
import Moment from 'moment';
import { toast } from 'react-toastify';
import axiosInstance from "../../../common/axiosInstance"

class PatientPayment extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      patients: [],
      history: [],
      patientId: '',
      slDelete: true,
      //currentPage: 0,
      //currentIndex: 0,
      //searchString: '',
      //pagesCount: 0,
      //pageSize: window.$TotalRecord,
      authError: false,
      error: '',
      modal: false,
      modalTitle: '',
      modalBody: '',
      isView: false,
      isEdit: false
    };
    this.state = this.initialState;

  }

  //load event
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    var rights = userToken.roleModule;
    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("patient payment"));
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          this.getListData();
          //this.getData(0);
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
  }

  //get data
  getListData() {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    //const url = apiroute + '/api/BE_Patient/GetAll';

    //let data = JSON.stringify({
    //  isDeleted: this.state.slDelete,
    //  searchString: '',
    //  Id: userId
    //});

    //axiosInstance.post(url, data, {
    const url = apiroute + '/api/BE_Patient/getPatientsProfileCompleted';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          // console.log(result.data.outdata);
          this.setState({ patients: result.data.outdata, loading: false }, () => {
            if (this.state.patientId != null && this.state.patientId != '') {
              let paid = result.data.outdata.filter(p => p.patientId == parseInt(this.state.patientId) && p.patientAccessionId != 0);
              if (paid.length > 0) {
                let pid = this.state.patientId.split(',')[0] + "," + paid[0].patientAccessionId;
                this.setState({ patientId: pid });
                this.getData(pid);
              }
            }
          })
        }
        else {
          // console.log(result.data.message);
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  //get data
  getData(pid) {
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PaymentHistory/GetByPatientId';

    let splitVal = pid.split(',');
    let data = JSON.stringify({
      isDeleted: true,
      searchString: '',
      Id: parseInt(splitVal[0]),
      AccessionId: parseInt(splitVal[1])
    });
    // console.log(data);
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          // console.log(result.data.outdata.patientPaymentData);
          var rdata = result.data.outdata.patientPaymentData;
          this.setState({
            pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
            history: result.data.outdata.patientPaymentData, loading: false
          });
          //let totalReceivedJson = rdata.filter(
          //  ml => ml.paymentType.includes("Received")
          //);
          //let totalReceived = totalReceivedJson.reduce(function (sum, tax) {
          //  return sum + parseFloat(tax.amount);
          //}, 0);

          //let totalSendJson = rdata.filter(
          //  ml => ml.paymentType.includes("Paid")
          //);
          //let totalSend = totalSendJson.reduce(function (sum, tax) {
          //  return sum + parseFloat(tax.amount);
          //}, 0);
          //if (rdata.length > 0) {
          //  let totalReceived = rdata.reduce(function (sum, tax) {
          //    return sum + parseFloat(tax.patientAmount);
          //  }, 0);
          //  let totalSend = rdata.reduce(function (sum, tax) {
          //    return sum + parseFloat(tax.laboratoryAmount) + parseFloat(tax.manufacturerAmount) + parseFloat(tax.shippingAmount);
          //  }, 0);
          //  this.setState({ paymentReceived: Math.round(totalReceived, 2), paymentSend: Math.round(totalSend, 2) });
          //}

        }
        else {
          // console.log(result.data.message);
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    if (value != "") {
      this.getData(value)
    }
    else {
      this.setState({
        history: []
      });
    }
  }


  VerifyPayment(e, id) {
    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PaymentHistory/VerifyPayment?id=' + parseInt(id) + '&uid=' + parseInt(userId);

    axiosInstance.post(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {
      // console.log(result);
      if (result.data.flag) {
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Success',
          // modalBody: result.data.message,
          loading: false
        }, this.getListData());
        toast.success(result.data.message)
        //this.setState({
        //  employees: curremployees.filter(employee => employee.org_Id !== id)
        //});
      }
      else {
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Success',
          // modalBody: result.data.message,
          loading: false
        });
        toast.success(result.data.message)
      }
    })
      .catch(error => {
        //console.log(error);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: error.message,
          loading: false
        });
        toast.error(error.message)
        this.setState({ authError: true, error: error });
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
  //  }, function () { this.getData(pgCurr); });
  //}

  //toggle() {
  //  this.setState({
  //    dropdownOpen: !this.state.dropdownOpen,
  //  });
  //}

  //onRadioBtnClick(radioSelected) {
  //  this.setState({
  //    radioSelected: radioSelected,
  //  });
  //}

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
    const { loading, patients, history, patientId, authError, error } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs="6">
                    {/*<Input type="select" name="paymentType" value={paymentType} onChange={this.handlePaymentTypeInputChange.bind(this)}>
                      <option value="">All Payment Type</option>
                      <option value="Paid">Paid</option>
                      <option value="Received">Received</option>
                    </Input>*/}
                  </Col>
                  <Col xs="6">
                    <Input type="select" name="patientId" value={patientId} onChange={this.handleInputChange.bind(this)}>
                      <option value="">All Patient</option>
                      {patients
                        .map((data, i) => {
                          return (<option key={i} value={data.patientId + "," + data.patientAccessionId}>{data.firstName + " " + data.lastName + (data.accessionNo != null ? " (" + data.accessionNo.replace(/-/g, "") + ")" : "")}</option>);
                        })}
                    </Input>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <CardBody>
                  {authError ? <p>{error.message}</p> : null}
                  <Table responsive bordered key="tblpatients">
                    <thead className="thead-light">
                      <tr>
                        <th>Milestone</th>
                        <th>Transaction</th>
                        <th>Amount</th>
                        <th>Remark</th>
                        <th>Payment By</th>
                        <th>Status</th>
                        <th>Verify Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        // !loading ? (
                        //employees.map(function (data,i) {
                        history.length > 0 ? (
                          history
                            //.slice(
                            //  currentPage * pageSize,
                            //  (currentPage + 1) * pageSize
                            //)
                            .map((data, i) => {
                              return (<tr key={i}>
                                <td>{data.paymentMilestone}</td>
                                <td>{Moment(data.transactionDate).format('DD MMM YYYY')}<br />{data.transactionId}</td>
                                <td>${data.transactionAmount}</td>
                                <td>{data.remark}</td>
                                <td>{data.userType != 5 ? data.userType != 1 ? data.userType != 2 ? "Institution" : "Practitioner" : "Patient" : "Admin"}</td>
                                <td>
                                  {
                                    data.transactionStatus == "Paid" ?
                                      <span className="badge badge-success" style={{ "padding": "8px", "color": "#fff" }}>{data.transactionStatus}</span>
                                      :
                                      data.transactionStatus == "In Verification" ?
                                        <span className="badge badge-warning" style={{ "padding": "8px", "color": "#fff" }}>{data.transactionStatus}</span>
                                        :
                                        <span className="badge badge-danger" style={{ "padding": "8px", "color": "#fff" }}>{data.transactionStatus}</span>
                                  }
                                </td>
                                {this.state.isEdit ?
                                  data.isAdminApprove == "P" ?
                                    <td><Link className="btn btn-info btn-sm btn-pill" to="#" onClick={e => this.VerifyPayment(e, data.patientPaymentId)} ><b>Verify Payment</b></Link></td>
                                    :
                                    <td><span className="badge badge-success" style={{ "padding": "8px", "color": "#fff" }}>Verified</span></td>
                                  : null}
                              </tr>);
                            })
                        ) : (
                          patientId == null || patientId == ''
                            ?
                            <tr>
                              <td colSpan="7" className="tdCenter">Please select patient.</td></tr>
                            :
                            <tr>
                              <td colSpan="7" className="tdCenter">No payment transactions.</td></tr>
                          // )) : (
                          // <tr>
                          //   <td colSpan="7" className="tdCenter">Loading...</td></tr>
                        )}
                    </tbody>
                  </Table>

                  {/*<Pagination aria-label="Page navigation example" className="customPagination">
                    <PaginationItem disabled={currentIndex - 4 <= 0}>
                      <PaginationLink onClick={e => this.handleClick(e, currentPage - 5, currentIndex - 5)} previous href="#">
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
                      <PaginationLink onClick={e => this.handleClick(e, currentPage + 5, currentIndex + 5)} next href="#">
                        Next
                    </PaginationLink>
                    </PaginationItem>
                  </Pagination>*/}
                </CardBody>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PatientPayment;
