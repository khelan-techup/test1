import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row,
  Table, Button, Input, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter, Collapse, Fade
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import Confirm from "../../CustomModal/Confirm";
import "@reach/dialog/styles.css";
import { toast } from 'react-toastify';
import pdfFile from '../../../assets/pdf-svgrepo-com.svg';
import docFile from '../../../assets/icons8-google-docs.svg';
import FilePreview from "react-file-preview-latest";
import downloadIcon from '../../../assets/download.svg';
import closeIcon from '../../../assets/x.svg';
import axiosInstance from "../../../common/axiosInstance"

class List extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      openSearch: true,
      patients: [],
      searchString: '',
      slDelete: true,
      currentPage: 0,
      currentIndex: 0,
      pagesCount: 0,
      collapseId: 0,
      pageSize: window.$TotalRecord,
      authError: false,
      error: '',
      modal: false,
      modalTitle: '',
      modalBody: '',
      patientId: 0,
      TransactionId: '',
      TransactionAmount: '',
      Remark: '',
      patientPaymentId: 0,
      showpayment: false,
      errors: {
        TransactionId: '',
        TransactionAmount: ''
      },
      showPO: false,
      pofile: '',
      poNo: '',
      manufacturerPaymentId: '',
      isView: false,
      isEdit: false,
      roleName: '',

      preview: false,
      url: "",
      poNumber: "",
    };
    this.state = this.initialState;
  }


  setCollapse(cid) {
    let currentCid = this.state.collapseId;
    if (currentCid == cid) {
      this.setState({ collapseId: -1 });
    }
    else {
      this.setState({ collapseId: cid });
    }
  }

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
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    var rights = userToken.roleModule;

    this.setState({ roleName: userToken.roleName });

    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("manufacturer"));
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          this.getListData(0);
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
  getListData(pageNo) {
    debugger;
    const param = this.props.match.params;

    if (param.id != undefined) {
      var userToken = JSON.parse(localStorage.getItem('AUserToken'));
      let userId = (userToken.userId == null ? 0 : userToken.userId);

      this.setState({ manufacturerId: param.id });
      const apiroute = window.$APIPath;
      const url = apiroute + '/api/BE_ManufacturerPatient/getManufacturerPatientsPaging';

      let data = JSON.stringify({
        isDeleted: this.state.slDelete,
        searchString: this.state.searchString,
        Id: parseInt(param.id),
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
            // console.log(result.data.outdata);
            this.setState({ pagesCount: Math.ceil(result.data.outdata.length / 10) });
            this.setState({
              pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              patients: result.data.outdata, loading: false
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
    else {
      this.props.history.push('/manufacturer/list');
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
        searchString: value
      }), function () { this.getListData(0); });
    }
  }

  //active/inactive filter
  //handleChange = (e) => {
  //  const target = e.target;
  //  const value = target.value;

  //  this.setState(() => ({
  //    loading: true,
  //    currentPage: 0,
  //    currentIndex: 0,
  //    pagesCount: 0,
  //    pageSize: 10,
  //    slDelete: JSON.parse(value)
  //  }), function () { this.getListData(0); });
  //}

  //delete(active/inactive) button click
  deleteRow(e, id) {

    e.preventDefault();
    //const curremployees = this.state.employees;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;

    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_ManufacturerPatient/DeletePatient?id=' + id + '&userId=' + userId + '';

    axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {
      if (result.data.flag) {
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Success',
        //   modalBody: result.data.message
        // });
        toast.success(result.data.message)
        //this.setState({
        //  employees: curremployees.filter(employee => employee.org_Id !== id)
        //});
        this.getListData(0);
      } else {
        this.setState({ loading: false });
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

  //add payment
  handleClosePayment = () => {
    this.setState({
      showpayment: false
    });
  }

  handleShowPayment = (patientId, pPaymentId, Amount) => {
    //alert(Math.round(Amount,2))
    this.setState({
      showpayment: true,
      TransactionAmount: Math.round(Amount, 2),
      manufacturerPaymentId: pPaymentId,
      patientId: patientId
    });
  }

  handlePaymentInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    let errors = this.state.errors;

    switch (name) {
      case 'TransactionId':
        errors.TransactionId = (!value) ? "Please enter transaction id." : '';
        break;
      case 'TransactionAmount':
        errors.TransactionAmount = (!value) ? "Please enter transaction amount." : '';
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }


    this.setState({ errors, [name]: value }, () => {

    })
  }

  AddPatientPayment(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;
    const param = this.props.match.params;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    if (userToken != null) {
      uid = (userToken.userId == null ? 0 : userToken.userId);
    }

    if (this.state.TransactionId != null && this.state.TransactionId != "" && this.state.TransactionAmount != null && this.state.TransactionAmount != "") {
      const apiroute = window.$APIPath;
      let url = apiroute + '/api/ManufacturerPayment/DoPayment';

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        patientPaymentId: 0,
        ManufacturerPaymentId: parseInt(this.state.manufacturerPaymentId),
        ManufacturerId: parseInt(param.id),
        TransactionAmount: this.state.TransactionAmount,
        TransactionId: this.state.TransactionId,
        TransactionStatus: "Paid",
        Remark: this.state.Remark,
        createdBy: uid,
      })

      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            loading: false,
            showpayment: false,
            patientpaymentId: 0,
            TransactionId: '',
            TransactionAmount: '',
            PatientId: 0,

          }, this.getListData(0));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false,
          });
          toast.error(result.data.message)
        }
      })
        .catch(error => {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: error.message,
            loading: false,
          });
          toast.error(error.message)
        });
    }
    else {
      if (this.state.TransactionId == null || this.state.TransactionId == "") {
        errors.TransactionId = "Please enter transaction id.";
      }
      if (this.state.TransactionAmount == null || this.state.TransactionAmount == "") {
        errors.TransactionAmount = "Please enter transaction amount.";
      }

      this.setState({ loading: false });
    }
  }
  //end add payment



  handlePOClose = () => {
    this.setState({
      showPO: false
    });
  }

  //handlePOShow = (e, id) => {
  //  this.setState({
  //    manufacturerPaymentId: id,
  //    showPO: true,
  //  });
  //}
  handlePOShow = (e, id, pid, ppid) => {
    this.setState({
      manufacturerPaymentId: id,
      patientId: pid,
      patientPaymentId: ppid,
      showPO: true,
    });
  }

  handleFileInputChange(event) {
    const target = event.target;
    const value = target.files[0];
    //alert(target.files[0]);
    this.setState({
      pofile: value
    });
  }

  handlePOInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  UpdatePO(e) {
    e.preventDefault();
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let uid = (userToken.userId == null ? 0 : userToken.userId);
    let nid = this.state.manufacturerPaymentId;
    let mid = this.state.manufacturerId;
    let pid = this.state.patientId;
    let ppid = this.state.patientPaymentId;

    //alert(this.state.analysisdatafile)
    if (this.state.pofile != "" && this.state.poNo != "") {

      const apiroute = window.$APIPath;
      //let url = apiroute + '/api/ManufacturerPayment/InsertPO?id=' + nid + '&uid=' + uid + '';
      let url = apiroute + '/api/ManufacturerPayment/InsertPONew'
      let files = this.state.pofile;
      const data = new FormData();
      data.append(`PatientId`, pid);
      data.append(`ManufacturerId`, mid);
      data.append(`PatientPaymentId`, ppid);
      data.append(`ManufacturerPaymentId`, nid);
      data.append(`POFileSendByUserId`, uid);
      data.append(`poNo`, this.state.poNo);
      data.append(`file`, files);
      //for (let i = 0; i < files.length; i++) {
      //    data.append(`files[${i}]`, files[i])
      //}
      axiosInstance.post(url, data, {
        // receive two    parameter endpoint url ,form data
      }).then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            loading: false,
            manufacturerPaymentId: "",
            pofile: "",
            patientId: "",
            patientPaymentId: "",
            showPO: false,
          }, this.getListData(0));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false,
          });
          toast.error(result.data.message)
        }
      }).catch(error => {
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: error.message,
          loading: false,
        });
        toast.error(error.message)
      });
    }
    else {
      if (this.state.poNo == "") {
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Success',
        //   modalBody: "Please enter po no."
        // });
        toast.success("Please enter po no.")
      } else {
        // this.setState({
        //   modal: !this.state.modal,
        //   modalTitle: 'Success',
        //   modalBody: "Please select po file to upload."
        // });
        toast.success("Please select po file to upload.")
      }
    }
  }

  //delete po file
  DeletePO = (e, id) => {
    //e.preventDefault();

    this.setState({ loading: true });

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/ManufacturerPayment/DeletePOFile?id=' + id + '';

    axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            loading: false
          }, this.getListData(0));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false,
          });
          toast.error(result.data.message)
        }
      })
      .catch(error => {
        //console.log(error);
        this.setState({
          // modal: !this.state.modal,
          // modalTitle: 'Error',
          // modalBody: error.message,
          loading: false,
        });
        toast.error(error.message)
      });
  }

  //download PO/Invoice
  DownloadFile(e, filepath, filename) {
    //alert(filename);
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    axiosInstance({
      url: apiroute + '/api/CognitoUserStore/downloadFile?fileName=' + filepath + '',
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      // console.log(response);
      var fname = filepath.substring(filepath.lastIndexOf('/') + 1);
      //alert(fname);
      var fext = fname.substring(fname.lastIndexOf('.'));
      //alert(fext);
      filename = filename + fext;
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      //const blob = new Blob([response.data], { type: 'application/pdf' });
      //const url = window.URL.createObjectURL(blob);
      //const link = document.createElement('a');
      //link.href = url;
      //link.setAttribute('download', filename);
      //document.body.appendChild(link);
      //link.click();
      //link.remove();
      //window.URL.revokeObjectURL(url);
      this.setState({ loading: false });
    }).catch(error => {
      // console.log(error);
      this.setState({ loading: false });
    });
  }

  //file preview
  previewToggle(e, filePath, no) {
    this.setState({
      preview: !this.state.preview,
      url: window.$FileUrl + filePath,
      poNumber: no
    })
  }

  // onError = (err) => console.log("Error:", err); // Write your own logic
  onError = (err) => console.log(""); // Write your own logic

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

    const { loading, patients, currentPage, currentIndex, pagesCount, pageSize, authError, preview, url, poNumber,
      error, showpayment, TransactionAmount, TransactionId, Remark, errors, showPO, pofile, manufacturerPaymentId, roleName, collapseId } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Manufacturer Patient List</h5>
          </Col>
          <Col xs="2" lg="2">
            <Link to="/manufacturer/list">
              <button className="btn btn-primary btn-block">Manufacturer</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col xs="2">

                  </Col>
                  <Col xs="4">
                  </Col>
                  <Col xs="6">
                    {
                      this.state.openSearch ? (
                        <div className="searchBox">
                          <input type="text" placeholder="Search..." onKeyPress={this.filter} />
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

                {preview &&
                  <>
                    <div className='preview-popup'>
                      <div className='preview-popup-modal'>
                        <div className='preview-popup-header'>
                          {url.split(".").splice(-1)[0] === "pdf" ? null :
                            <a href={url} download target={`_blank`}>
                              <img src={downloadIcon} style={{ margin: "0 12px", cursor: "pointer" }} alt='download' onClick={e => this.DownloadFile(e, url, poNumber)} />
                            </a>
                          }
                          <img src={closeIcon} style={{ cursor: "pointer" }} alt='close' onClick={e => this.previewToggle(e, "")} />
                        </div>
                        <iframe src={url} title="previewFile" width="100%" height="90%" />
                        {/* <FilePreview
                          type={"url"}
                          width="100%"
                          url={url}
                          onError={this.onError}
                          style={{ borderRadius: 0 }}
                        /> */}
                      </div>
                    </div>
                  </>
                }

                {
                  // !loading ? (
                  patients.length > 0 ? (
                    patients.map((data, i) => {
                      return (<Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem", "margin-top": "20px " }}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white" }} >
                            <Row style={{ "fontSize": "16px" }} key={i} onClick={() => this.setCollapse(i)}>
                              <Col md="12">
                                <b>
                                  {this.state.isView && (roleName == 'Neo Admin' || roleName == 'Admin') ?
                                    <React.Fragment>
                                      <span>{data.firstName + " " + (data.middleName != null && data.middleName != "" ? "(" + data.middleName + ")" : "") + data.lastName}</span>
                                      <br />
                                    </React.Fragment>
                                    : null
                                  }
                                </b>
                              </Col>
                            </Row>
                          </CardHeader>
                          <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                            <Collapse isOpen={i == collapseId} id="collapseExample">
                              <CardBody>
                                <Row>
                                  <Table responsive bordered >
                                    <thead class="thead-light">
                                      <tr>
                                        <th>Accession No</th>
                                        {this.state.isEdit ?
                                          <th>Action</th> : null}
                                        <th>Payment</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        data.patientAccessionMappings.map((adata, index) => (
                                          <tr>
                                            <td><b>
                                              {this.state.isView && (roleName == 'Neo Admin' || roleName == 'Admin') ?
                                                <React.Fragment>
                                                  {adata.accessionNo == "" || adata.accessionNo == null ?
                                                    "Not Available"
                                                    :
                                                    /* <span >{data.accessionNo}</span>*/
                                                    <Link className="anchorAccessNo" to={'/patientprofile/' + data.patientId + '/' + adata.patientAccessionId}><b>{adata.accessionNo.replace(/-/g, "")}</b></Link>
                                                  }
                                                </React.Fragment>
                                                : (adata.accessionNo == "" || adata.accessionNo == null ?
                                                  "Not Available"
                                                  : <span className="anchorAccessNo"><b>{adata.accessionNo.replace(/-/g, "")}</b></span>
                                                )
                                              }
                                            </b> </td>
                                            {
                                              this.state.isEdit || this.state.isView ?
                                                <React.Fragment>
                                                  <td>
                                                    {this.state.isEdit ?
                                                      <React.Fragment>
                                                        <Confirm title="Confirm" description="Are you sure want to delete this patient ?">
                                                          {confirm => (
                                                            <Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={confirm(e => this.deleteRow(e, data.manufacturerPatientId))}><b>Delete</b></Link>
                                                          )}
                                                        </Confirm>
                                                      </React.Fragment>
                                                      : null}
                                                    {/*this.state.isView ?
                                      <Link className="btn btn-info btn-sm btn-pill" to={'/ngslaboratory/patientsinfo/' + data.patientId}>View Details</Link>
                                      : null*/}
                                                  </td>

                                                  <td>
                                                    {this.state.isEdit ?
                                                      (data.invoiceFile ?
                                                        <React.Fragment>
                                                          <a className="btn btn-info btn-sm btn-pill" onClick={e => this.previewToggle(e, data.invoiceFile, data.invoiceNo)}>{data.invoiceNo ? "Invoice - " + data.invoiceNo : "Invoice"}</a>
                                                          {" "}
                                                        </React.Fragment>
                                                        : null)
                                                      : null
                                                    }
                                                    {this.state.isEdit ?
                                                      (data.paymentStatus == "Patient Paid" ?
                                                        <Confirm title="Confirm" description="Are you sure want to send PO?">
                                                          {confirm => (
                                                            <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handlePOShow(e, data.ngsLabPaymentId, data.patientId, data.patientPaymentId))}>Send PO</a>
                                                          )}
                                                        </Confirm>
                                                        :
                                                        //(data.paymentStatus == "Invoice Send" ?
                                                        //  <React.Fragment>
                                                        //    <a href={data.invoiceFile} download>{"Invoice - " + data.invoiceNo}</a>
                                                        //    <br />
                                                        //    <a className="btn btn-info btn-sm btn-pill" onClick={e => { if (window.confirm('Are you sure want to send PO?')) this.handlePOShow(e, data.ngsLabPaymentId) }}>Send PO</a>
                                                        //  </React.Fragment>
                                                        //:
                                                        (data.paymentStatus == "PO Send" ?
                                                          <React.Fragment>
                                                            <a className="btn btn-info btn-sm btn-pill" onClick={e => this.previewToggle(e, data.poFile, data.poNo)}>{data.poNo ? "PO - " + data.poNo : "PO"}</a>
                                                            {" "}
                                                            <Confirm title="Confirm" description="Are you sure want to delete PO?">
                                                              {confirm => (
                                                                <a className="btn btn-danger btn-sm btn-pill" onClick={confirm(e => this.DeletePO(e, data.ngsLabPaymentId))}>Delete PO</a>
                                                              )}
                                                            </Confirm>
                                                          </React.Fragment>
                                                          :
                                                          (data.paymentStatus == "Payment Requested" ?
                                                            <Confirm title="Confirm" description="Are you sure want to do the payment?">
                                                              {confirm => (
                                                                <Button className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handleShowPayment(data.patientId, data.ngsLabPaymentId, data.paymentAmount))}>
                                                                  Pay
                                                                </Button>
                                                              )}
                                                            </Confirm>
                                                            :
                                                            //(data.paymentStatus == "Paid" ?
                                                            data.paymentStatus == "Paid" ? (
                                                              <React.Fragment>
                                                                <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, data.poFile, data.poNo)}>{data.poNo ? "PO - " + data.poNo : "PO"}</a>
                                                                {" "}
                                                                <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, data.poFile, data.poNo)}>
                                                                  {data.poFile.split(".").splice(-1)[0] === "pdf" ?
                                                                    <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                  }
                                                                </div>{" "}
                                                                <span className="badge badge-success btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Paid</span>
                                                                {/*<a href={data.invoiceFile} download>{"Invoice - " + data.invoiceNo}</a>
                                                    <br />*/}

                                                              </React.Fragment>
                                                            )
                                                              : (<span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{data.paymentStatus}</span>
                                                              )
                                                            /*:
                                                            (null)
                                                          )*/
                                                          )
                                                        )
                                                        /*)*/
                                                      ) : <span className="badge badge-info btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{data.paymentStatus}</span>}
                                                  </td>

                                                </React.Fragment>
                                                : null}
                                          </tr>
                                        ))
                                      }
                                    </tbody>
                                  </Table>
                                </Row>
                              </CardBody>
                            </Collapse>
                          </Fade>
                        </Card>
                      </Col>
                      );
                    })
                  ) : (<Table>
                    <tr>
                      <td className="tdCenter">No patients.</td></tr></Table>
                    // )) : (<Table>                  <tr>
                    //   <td colSpan="6" className="tdCenter">Loading...</td></tr></Table>
                  )}
                {/*new design ends*/}

                {/*{authError ? <p>{error.message}</p> : null}*/}
                {/*<Table responsive bordered key="tblpatients">*/}
                {/*  <thead>*/}
                {/*    <tr>*/}
                {/*      <th>Accession No</th>*/}
                {/*      */}{/*<th>Patient Name<br />Reference No</th>*/}{/*
                */}{/*      <th>Contact</th>*/}{/*
                */}{/*      <th>Diesease</th>*/}
                {/*      {this.state.isEdit || this.state.isView ?*/}
                {/*        <React.Fragment>*/}
                {/*          <th>Action</th>*/}
                {/*          <th>Payment</th>*/}
                {/*        </React.Fragment>*/}
                {/*        : null}*/}
                {/*    </tr>*/}
                {/*  </thead>*/}
                {/*  <tbody>*/}
                {/*    {!loading ? (*/}
                {/*      //employees.map(function (data,i) {*/}
                {/*      patients.length > 0 ? (*/}
                {/*        patients*/}
                {/*          //.slice(*/}
                {/*          //  currentPage * pageSize,*/}
                {/*          //  (currentPage + 1) * pageSize*/}
                {/*          //)*/}
                {/*          .map((data, i) => {*/}
                {/*            return (<tr key={i}>*/}
                {/*              <td>*/}
                {/*                <b>*/}
                {/*                  {this.state.isView && (roleName == 'Neo Admin' || roleName == 'Admin') ?*/}
                {/*                    <React.Fragment>*/}
                {/*                      <span>{data.firstName + " " + (data.middleName != null && data.middleName != "" ? "(" + data.middleName + ")" : "") + data.lastName}</span>*/}
                {/*                      <br />*/}
                {/*                      {data.accessionNo == "" || data.accessionNo == null ?*/}
                {/*                        "Not Available"*/}
                {/*                        :*/}
                {/*                        //<Link to={'/manufacturer/patientsinfo/' + data.patientId}>{data.accessionNo}</Link>*/}
                {/*                        <Link className="anchorAccessNo" to={'/patients/info/' + data.patientId}>{data.accessionNo}</Link>*/}
                {/*                      }*/}
                {/*                    </React.Fragment>*/}
                {/*                    : (data.accessionNo == "" || data.accessionNo == null ?*/}
                {/*                      "Not Available"*/}
                {/*                      : <span className="anchorAccessNo"><b>{data.accessionNo}</b></span>*/}
                {/*                    )*/}
                {/*                  }*/}
                {/*                </b>*/}
                {/*              </td>*/}
                {/*              */}{/*<td><b>{data.accessionNo == "" || data.accessionNo == null ? "Not Avaialable" : data.accessionNo}</b></td>*/}{/*
                */}{/*              <td>{data.firstName} {data.middleName != "" && data.middleName != null ? "(" + data.middleName + ")" : ""}  {"(" + data.lastName + ")"} <br /><b>{data.patientRefNo}</b> </td>*/}{/*
                */}{/*              <td><i className="fa fa-envelope fa-lg" />&nbsp;{data.email}*/}{/*
                */}{/*                <br />*/}{/*
                */}{/*                {data.mobile != "" && data.mobile != null ?*/}{/*
                */}{/*                  <React.Fragment>*/}{/*
                */}{/*                    <i className="fa fa-mobile fa-2x" />&nbsp;*/}{/*
                */}{/*                    {data.mobile}*/}{/*
                */}{/*                  </React.Fragment>*/}{/*
                */}{/*                  :*/}{/*
                */}{/*                  ""*/}{/*
                */}{/*                }*/}{/*
                */}{/*              </td>*/}{/*
                */}{/*              <td>*/}{/*
                */}{/*                {data.diseaseName != null && data.diseaseName != "" ?*/}{/*
                */}{/*                  data.diseaseName*/}{/*
                */}{/*                  : "-"*/}{/*
                */}{/*                }*/}{/*
                */}{/*                <br />*/}{/*
                */}{/*                {data.diseaseCode != null && data.diseaseCode != "" ?*/}{/*
                */}{/*                  "(" + data.diseaseCode + ")"*/}{/*
                */}{/*                  : ""*/}{/*
                */}{/*                }</td>*/}
                {/*              {this.state.isEdit || this.state.isView ?*/}
                {/*                <React.Fragment>*/}
                {/*                  <td>*/}
                {/*                    {this.state.isEdit ?*/}
                {/*                      <React.Fragment>*/}
                {/*                        <Link className="btn btn-danger btn-sm btn-pill" to="#" onClick={e => this.deleteRow(e, data.institutePatientId)}><b>Delete</b></Link>{" "}*/}
                {/*                      </React.Fragment>*/}
                {/*                      : null}*/}
                {/*                    */}{/*this.state.isView ?*/}{/*
                */}{/*                      <Link className="btn btn-info btn-sm btn-pill" to={'/manufacturer/patientsinfo/' + data.patientId}>View Details</Link>*/}{/*
                */}{/*                      : null*/}
                {/*                  </td>*/}
                {/*                  */}{/*<td>*/}{/*
                */}{/*                    {this.state.isEdit ?*/}{/*
                */}{/*                      (data.paymentStatus == "Patient Paid" ?*/}{/*
                */}{/*                        <span className="badge badge-warning" style={{ "padding": "8px", "color": "#fff" }}>Invoice Pending</span>*/}{/*
                */}{/*                        :*/}{/*
                */}{/*                        (data.paymentStatus == "Invoice Send" ?*/}{/*
                */}{/*                          <React.Fragment>*/}{/*
                */}{/*                            <a href={data.invoiceFile} target="_blank">{"Invoice - " + data.invoiceNo}</a>*/}{/*
                */}{/*                            <br />*/}{/*
                */}{/*                            <a className="btn btn-info btn-sm btn-pill" onClick={e => this.handlePOShow(e, data.manufacturerPaymentId)}>Send PO</a>*/}{/*
                */}{/*                          </React.Fragment>*/}{/*
                */}{/*                          :*/}{/*
                */}{/*                          (data.paymentStatus == "PO Send" ?*/}{/*
                */}{/*                            <React.Fragment>*/}{/*
                */}{/*                              <a href={data.poFile} target="_blank">{"PO - " + data.poNo}</a>*/}{/*
                */}{/*                              <br />*/}{/*
                */}{/*                              <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DeletePO(e, data.manufacturerPaymentId)}>Delete PO</a>*/}{/*
                */}{/*                            </React.Fragment>*/}{/*
                */}{/*                            :*/}{/*
                */}{/*                            (data.paymentStatus == "Payment Requested" ?*/}{/*
                */}{/*                              <Button className="btn btn-info btn-sm btn-pill" onClick={() => this.handleShowPayment(data.patientId, data.manufacturerPaymentId, data.paymentAmount)}>*/}{/*
                */}{/*                                Pay*/}{/*
                */}{/*              </Button>*/}{/*
                */}{/*                              :*/}{/*
                */}{/*                              (data.paymentStatus == "Paid" ?*/}{/*
                */}{/*                                data.paymentStatus == "Paid" ? (*/}{/*
                */}{/*                                  <React.Fragment>*/}{/*
                */}{/*                                    <span className="badge badge-success" style={{ "padding": "8px", "color": "#fff" }}>Paid</span>*/}{/*
                */}{/*                                    <br />*/}{/*
                */}{/*                                    <a href={data.invoiceFile} download>{"Invoice - " + data.invoiceNo}</a>*/}{/*
                */}{/*                                    <br />*/}{/*
                */}{/*                                    <a href={data.poFile} download>{"PO - " + data.poNo}</a>*/}{/*
                */}{/*                                  </React.Fragment>*/}{/*
                */}{/*                                )*/}{/*
                */}{/*                                  : (<span className="badge badge-danger" style={{ "padding": "8px", "color": "#fff" }}>{data.paymentStatus}</span>)*/}{/*
                */}{/*                                :*/}{/*
                */}{/*                                (null)*/}{/*
                */}{/*                              )*/}{/*
                */}{/*                            )*/}{/*
                */}{/*                          )*/}{/*
                */}{/*                        )*/}{/*
                */}{/*                      ) : <span className="badge badge-info" style={{ "padding": "8px", "color": "#fff" }}>{data.paymentStatus}</span>}*/}{/*
                */}{/*                  </td>*/}
                {/*                  <td>*/}
                {/*                    {this.state.isEdit ?*/}
                {/*                      (data.invoiceFile ?*/}
                {/*                        <React.Fragment>*/}
                {/*                          <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, data.invoiceFile, data.invoiceNo)}>{data.invoiceNo ? "Invoice - " + data.invoiceNo : "Invoice"}</a>*/}
                {/*                          {" "}*/}
                {/*                        </React.Fragment>*/}
                {/*                        : null)*/}
                {/*                      : null*/}
                {/*                    }*/}
                {/*                    {this.state.isEdit ?*/}
                {/*                      (data.paymentStatus == "Patient Paid" ?*/}
                {/*                        <Confirm title="Confirm" description="Are you sure want to send PO?">*/}
                {/*                          {confirm => (*/}
                {/*                            <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handlePOShow(e, data.manufacturerPaymentId, data.patientId, data.patientPaymentId))}>Send PO</a>*/}
                {/*                          )}*/}
                {/*                        </Confirm>*/}
                {/*                        :*/}
                {/*                        //(data.paymentStatus == "Invoice Send" ?*/}
                {/*                        //  <React.Fragment>*/}
                {/*                        //    <a href={data.invoiceFile} download>{"Invoice - " + data.invoiceNo}</a>*/}
                {/*                        //    <br />*/}
                {/*                        //    <a className="btn btn-info btn-sm btn-pill" onClick={e => { if (window.confirm('Are you sure want to send PO?')) this.handlePOShow(e, data.manufacturerPaymentId) }}>Send PO</a>*/}
                {/*                        //  </React.Fragment>*/}
                {/*                        //:*/}
                {/*                        (data.paymentStatus == "PO Send" ?*/}
                {/*                          <React.Fragment>*/}
                {/*                            <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, data.poFile, data.poNo)}>{data.poNo ? "PO - " + data.poNo : "PO"}</a>*/}
                {/*                            {" "}*/}
                {/*                            <Confirm title="Confirm" description="Are you sure want to delete PO?">*/}
                {/*                              {confirm => (*/}
                {/*                                <a className="btn btn-danger btn-sm btn-pill" onClick={confirm(e => this.DeletePO(e, data.manufacturerPaymentId) )}>Delete PO</a>*/}
                {/*                              )}*/}
                {/*                            </Confirm>*/}
                {/*                          </React.Fragment>*/}
                {/*                          :*/}
                {/*                          (data.paymentStatus == "Payment Requested" ?*/}
                {/*                            <Confirm title="Confirm" description="Are you sure want to do the payment?">*/}
                {/*                              {confirm => (*/}
                {/*                                <Button className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handleShowPayment(data.patientId, data.manufacturerPaymentId, data.paymentAmount) )}>*/}
                {/*                                  Pay*/}
                {/*                                </Button>*/}
                {/*                              )}*/}
                {/*                            </Confirm>*/}
                {/*                            :*/}
                {/*                            //(data.paymentStatus == "Paid" ?*/}
                {/*                            data.paymentStatus == "Paid" ? (*/}
                {/*                              <React.Fragment>*/}
                {/*                                <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, data.poFile, data.poNo)}>{data.poNo ? "PO - " + data.poNo : "PO"}</a>*/}
                {/*                                {" "} <span className="badge badge-success btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Paid</span>*/}
                {/*                                */}{/*<a href={data.invoiceFile} download>{"Invoice - " + data.invoiceNo}</a>*/}{/*
                */}{/*                                    <br />*/}

                {/*                              </React.Fragment>*/}
                {/*                            )*/}
                {/*                              : (<span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{data.paymentStatus}</span>*/}
                {/*                              )*/}
                {/*                           {/*{*/}{/*                               (nu*/}{/*ll)
                */}{/*                     */}
                {/*                          )*/}
                {/*                        )*/}
                {/*                        /*)}
                {/*                      ) : <span className="badge badge-info btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{data.paymentStatus}</span>}*/}
                {/*                  </td>*/}
                {/*                </React.Fragment>*/}
                {/*                : null}*/}
                {/*            </tr>);*/}
                {/*          })*/}
                {/*      ) : (*/}
                {/*        <tr>*/}
                {/*          <td colSpan="6" className="tdCenter">No patients.</td></tr>*/}
                {/*      )) : (*/}
                {/*      <tr>*/}
                {/*        <td colSpan="6" className="tdCenter">Loading...</td></tr>*/}
                {/*    )}*/}
                {/*  </tbody>*/}
                {/*</Table>*/}

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
            </Card>
          </Col>
        </Row>
        <Modal isOpen={showpayment} className="modal-dialog modal-sm">
          <ModalHeader>
            Payment to Manufacturer
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Milestone</label>
              <Input type="text" className="form-control" value="Manufacturing" disabled />
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Transaction Id</label>
              <Input type="text" name="TransactionId" tabIndex="2" maxLength="50" className="form-control" value={TransactionId} onChange={this.handlePaymentInputChange.bind(this)} placeholder="Enter a transaction id" />
              {errors.TransactionId.length > 0 && <span className='error'>{errors.TransactionId}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Amount</label>
              <Input type="number" className="form-control here" maxLength="50" tabIndex="3" name="TransactionAmount" placeholder="Enter a transaction amount" value={TransactionAmount} onChange={this.handlePaymentInputChange.bind(this)} />
              {errors.TransactionAmount.length > 0 && <span className='error'>{errors.TransactionAmount}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Remark</label>
              <Input type="textarea" className="form-control here" maxLength="50" tabIndex="4" name="Remark" placeholder="Enter a remark" value={Remark} onChange={this.handlePaymentInputChange.bind(this)} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClosePayment}>
              Close
            </Button>
            <Button color="primary" onClick={this.AddPatientPayment.bind(this)}>
              Add
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={showPO} className="modal-dialog modal-lg">
          <ModalHeader>
            Upload PO
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">PO No</label>
              <Input type="text" name="poNo" id="poNo" className="form-control" tabIndex="1" onChange={this.handlePOInputChange.bind(this)} />
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">PO File</label>
              <Input type="file" name="pofile" id="File" className="form-control" multiple="multiple" tabIndex="2" onChange={this.handleFileInputChange.bind(this)} accept=".pdf, .docx,.doc" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handlePOClose}>
              Close
            </Button>
            <Button color="primary" onClick={this.UpdatePO.bind(this)}>
              Add
            </Button>
          </ModalFooter>
        </Modal>

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
