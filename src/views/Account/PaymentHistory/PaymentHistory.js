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
  Pagination, PaginationItem, PaginationLink, Input, FormGroup
} from 'reactstrap';
import axiosInstance from "../../../common/axiosInstance"

class PaymentHistory extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      patients: [],
      history: [],
      filterhistory: [],
      patientId: '',
      paymentReceived: 0,
      paymentSend: 0,
      slDelete: true,
      currentPage: 0,
      currentIndex: 0,
      searchString: '',
      pagesCount: 0,
      pageSize: window.$TotalRecord,
      authError: false,
      error: '',
      modal: false,
      modalTitle: '',
      modalBody: '',
      isView: false,
      isEdit: false,
      paymentType: '',
      roleName: ''
    };
    this.state = this.initialState;

  }

  //load event
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    var rights = userToken.roleModule;

    this.setState({ roleName: userToken.roleName });

    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("payment transaction"));
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          this.getListData();
          this.getData(0);
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
    const url = apiroute + '/api/BE_Patient/GetAll';

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: userId
    });

    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          //console.log(result.data.outdata);
          this.setState({ patients: result.data.outdata, loading: false })
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
  getData(pageNo) {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PaymentHistory/GetAllPaging';

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: userId,
      pageNo: pageNo,
      totalNo: window.$TotalRecord,
    });

    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          //console.log(result.data.outdata);
          var rdata = result.data.outdata;
          this.setState({
            pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
            history: result.data.outdata, filterhistory: result.data.outdata, loading: false
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
          if (rdata.length > 0) {
            let totalReceived = rdata.reduce(function (sum, tax) {
              return sum + parseFloat(tax.patientAmount);
            }, 0);
            let totalSend = rdata.reduce(function (sum, tax) {
              return sum + parseFloat(tax.laboratoryAmount) + parseFloat(tax.manufacturerAmount) + parseFloat(tax.shippingAmount);
            }, 0);
            this.setState({ paymentReceived: Math.round(totalReceived, 2), paymentSend: Math.round(totalSend, 2) });
          }

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

    let errors = this.state.errors;
    if (value != "") {
      var ptype = this.state.paymentType;
      let filterhistorynew;
      if (ptype == "") {
        filterhistorynew = this.state.history.filter(
          ml => ml.patientId == value
        );
      }
      else {
        filterhistorynew = this.state.history.filter(
          ml => ml.paymentType == ptype && ml.patientId == value
        );
      }
      this.setState({
        filterhistory: filterhistorynew,
        pagesCount: Math.ceil(filterhistorynew.length / 10),
        currentPage: 0,
        currentIndex: 0
      });
    }
    else {
      var ptype = this.state.paymentType;
      let filterhistorynew;
      if (ptype == "") {
        this.setState({
          filterhistory: this.state.history,
          pagesCount: Math.ceil(this.state.history.length / 10),
          currentPage: 0,
          currentIndex: 0
        });
      }
      else {
        filterhistorynew = this.state.history.filter(
          ml => ml.paymentType == ptype
        );

        this.setState({
          filterhistory: filterhistorynew,
          pagesCount: Math.ceil(filterhistorynew.length / 10),
          currentPage: 0,
          currentIndex: 0
        });
      }
    }
  }

  handlePaymentTypeInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    let errors = this.state.errors;
    if (value != "") {
      var pid = this.state.patientId;
      let filterhistorynew;
      if (pid == "") {
        filterhistorynew = this.state.history.filter(
          ml => ml.paymentType == value
        );
      }
      else {
        filterhistorynew = this.state.history.filter(
          ml => ml.paymentType == value && ml.patientId == pid
        );
      }

      this.setState({
        filterhistory: filterhistorynew,
        pagesCount: Math.ceil(filterhistorynew.length / 10),
        currentPage: 0,
        currentIndex: 0
      });
    }
    else {
      var pid = this.state.patientId;
      let filterhistorynew;
      if (pid == "") {
        this.setState({
          filterhistory: this.state.history,
          pagesCount: Math.ceil(this.state.history.length / 10),
          currentPage: 0,
          currentIndex: 0
        });
      }
      else {
        filterhistorynew = this.state.history.filter(
          ml => ml.patientId == pid
        );
        this.setState({
          filterhistory: filterhistorynew,
          pagesCount: Math.ceil(filterhistorynew.length / 10),
          currentPage: 0,
          currentIndex: 0
        });
      }
    }
  }

  //pagination
  handleClick(e, index, currIndex) {
    e.preventDefault();
    var pgcount = this.state.pagesCount - 1;
    var pgCurr = (index >= pgcount ? pgcount : index);
    this.setState({
      currentPage: pgCurr,
      currentIndex: currIndex
    }, function () { this.getData(pgCurr); });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
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
    const { loading, patients, paymentReceived, paymentSend, currentPage, currentIndex, pagesCount,
      pageSize, history, filterhistory, patientId, authError, error, roleName, paymentType } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <div className="text-value">$ {paymentReceived}</div>
                <div>Payment Received</div>
              </CardBody>
              <br />
              {/*<div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                <Line data={cardChartData2} options={cardChartOpts2} height={70} />
              </div>*/}
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="6">
            <Card className="text-white bg-primary">
              <CardBody className="pb-0">
                <div className="text-value">$ {paymentSend}</div>
                <div>Payment Sent</div>
              </CardBody>
              <br />
              {/*<div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                <Line data={cardChartData1} options={cardChartOpts1} height={70} />
              </div>*/}
            </Card>
          </Col>
        </Row>

        <Row>

        </Row>
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
                          return (<option key={i} value={data.patientId}>{data.firstName + " " + data.lastName + (data.accessionNo != null ? " (" + data.accessionNo.replace(/-/g, "") + ")" : "")}</option>);
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
                        <th>Accession No</th>
                        {/*<th>Name</th>*/}
                        <th>Patient Payment</th>
                        <th>Laboratory Payment</th>
                        <th>Manufacturing Payment</th>
                        {/*<th>Shipping Payment</th>*/}
                      </tr>
                    </thead>
                    <tbody>
                      {
                        // !loading ? (
                        //employees.map(function (data,i) {
                        filterhistory.length > 0 ? (
                          filterhistory
                            .slice(
                              currentPage * pageSize,
                              (currentPage + 1) * pageSize
                            )
                            .map((data, i) => {
                              return (<tr key={i}>
                                <td> {roleName == 'Neo Admin' || roleName == 'Admin' ?
                                  <React.Fragment>
                                    <span>{data.name}</span>
                                    <br />
                                    <span className="anchorAccessNo"><b>{data.accessionNo}</b></span>
                                  </React.Fragment>
                                  :
                                  <span className="anchorAccessNo"><b>{data.accessionNo}</b></span>
                                }
                                </td>
                                {/*<td>{data.name} </td>*/}
                                <td><b>${Math.round(data.patientAmount, 2)} </b></td>
                                <td>
                                  {data.laboratoryAmount == 0 ?
                                    <span className="badge badge-danger" style={{ "padding": "8px", "color": "#fff" }}>Pending</span>
                                    : <b><span>${Math.round(data.laboratoryAmount, 2)} </span></b>
                                  }
                                </td>
                                <td>
                                  {data.manufacturerAmount == 0 ?
                                    <span className="badge badge-danger" style={{ "padding": "8px", "color": "#fff" }}>Pending</span>
                                    : <b><span>${Math.round(data.manufacturerAmount, 2)} </span></b>
                                  }
                                </td>
                                {/*<td><b>$ {Math.round(data.shippingAmount, 2)} </b></td>
                                <td>{Moment(data.transactionDate).format('DD MMM YYYY')} </td>
                                <td>{data.paymentType == "Paid" ?
                                  <span className="badge badge-warning" style={{ "padding": "8px", "color": "#fff" }}>Paid</span>
                                  :
                                  <span className="badge badge-success" style={{ "padding": "8px", "color": "#fff" }}>Received</span>} </td>
                                  */}
                              </tr>);
                            })
                        ) : (
                          <tr>
                            <td colSpan="4" className="tdCenter">No payment transactions.</td></tr>
                          // )) : (
                          // <tr>
                          //   <td colSpan="4" className="tdCenter">Loading...</td></tr>
                        )}
                    </tbody>
                  </Table>

                  <Pagination aria-label="Page navigation example" className="customPagination">
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
                  </Pagination>
                </CardBody>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PaymentHistory;
