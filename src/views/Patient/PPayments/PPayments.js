import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Form, Row, Table, Button, Input, FormGroup, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import Moment from 'moment';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import FilePreview from "react-file-preview-latest";
import downloadIcon from '../../../assets/download.svg';
import closeIcon from '../../../assets/x.svg';
//import SelectSearch from 'react-select-search';
import axiosInstance from "../../../common/axiosInstance"

class PPayments extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      patients: [],
      drpPatients: [],
      patientPayments: [],

      milestones: [],
      PatientId: 0,
      PatientPaymentId: 0,
      patientMilestoneId: "",
      TransactionId: "",
      TransactionAmount: "",
      TransactionDate: Moment(new Date())._d,
      TransactionType: "",
      PaymentReceipt: "",
      PaymentReceiptFile: "",
      Remark: "",
      AccountHolderName: '',
      RoutingNumber: '',
      AccountNumber: '',

      preview: false,
      drpReadOnly: true,
      url: "",

      modal: false,
      modalBody: '',
      modal: false,
      modalTitle: '',
      modalBody: '',
      isView: false,
      isEdit: false,
      roleName: '',
      showPaymentDetail: false,
      DiseasCategoryId: '',
      DiseaseCategory: [],
      practionerAssignMessage: '',
      pracStatus: false,
      pracDisStatus: false,
      isSubmit: false,
      errors: {
        patientMilestoneId: '',
        TransactionId: '',
        TransactionAmount: '',
        Remark: '',
        PatientId: '',
        TransactionDate: '',
        TransactionType: '',
        PaymentReceiptFile: '',
        AccountHolderName: '',
        RoutingNumber: '',
        AccountNumber: '',
        DiseasCategoryId: ''
      },
    };
    this.state = this.initialState;
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
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("patients"));
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          this.getListData();

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

  ////Start Payment Details add
  //getMilestone() {
  //  var userToken = JSON.parse(localStorage.getItem('AUserToken'));
  //  let userId = (userToken.userId == null ? 0 : userToken.userId);

  //  const apiroute = window.$APIPath;
  //  const url = apiroute + '/api/PaymentMilestone/GetAll';

  //  let data = JSON.stringify({
  //    isDeleted: true,
  //    searchString: '',
  //    id: userId
  //  });

  //  axiosInstance.post(url, data, {
  //    headers: {
  //      'Content-Type': 'application/json; charset=utf-8'
  //    }
  //  })
  //    .then(result => {
  //      if (result.data.flag) {
  //        var rData = result.data.outdata;

  //        this.setState({
  //          milestones: rData
  //        });
  //      }
  //      else {
  //        this.setState({
  //          modal: !this.state.modal, modalTitle: 'Error', modalBody: result.data.message, loading: false
  //        });
  //      }
  //    })
  //    .catch(modalBody => {
  //      this.setState({
  //        modal: !this.state.modal, modalTitle: 'Error', modalBody: modalBody.message, loading: false
  //      });
  //    });
  //}


  //GetDiseaseCategopry
  GetDiseasCategory() {

    debugger;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/PaymentMilestone/GetDiseaseCategory';
    let data = [];
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {
      if (result.data.flag) {
        var rData = result.data.outdata;

        debugger;
        const param = this.props.match.params;
        if (param.id != undefined) {
          this.setState({
            DiseaseCategory: rData,
            PatientId: param.id,
            drpReadOnly: true
          }, () => {
            this.getData(param.id);
          });
        } else {
          this.setState({
            DiseaseCategory: rData,
            loading: false,
            drpReadOnly: false
          });
        }
      }
      else {
        this.setState({
          // modal: !this.state.modal, modalTitle: 'Error', modalBody: result.data.message, 
          loading: false
        });
        toast.error(result.data.message)
      }
    })
      .catch(modalBody => {
        this.setState({
          // modal: !this.state.modal, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
      });
  }

  //GetMilestoneByDiseaseCategory
  GetMilestoneByDisease(catid) {
    debugger;
    //const target = event.target;
    //const value = target.value;
    //const name = target.name;
    //let errors = this.state.errors;
    //errors.DiseasCategoryId = (!value) ? 'Please select disease category.' : '';
    //this.setState({
    //  [name]: value
    //});
    // var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    // let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/PaymentMilestone/GetMilestoneByDiseseCategory';

    let data = JSON.stringify({

      Id: (catid != '') ? parseInt(catid) : 0,
    });

    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState({
            milestones: rData,
            loading: false
          });

          var milestoneLength = result.data.outdata.length;

          var rdata = this.state.patientPayments;
          if (rdata != null && rdata.length > 0) {
            if (rdata.length == milestoneLength) {
              this.setState({
                showPaymentDetail: false
              });
            }
            else {
              this.setState({
                showPaymentDetail: true
              });
            }
          }
          else {
            this.setState({
              showPaymentDetail: true
            });
          }

        }
        else {
          this.setState({
            // modal: !this.state.modal, modalTitle: 'Error', modalBody: result.data.message, 
            loading: false
          });
          toast.error(result.data.message)
        }
      })
      .catch(modalBody => {
        this.setState({
          // modal: !this.state.modal, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
      });
  }

  handleFileInputChange(event) {
    const target = event.target;
    const value = target.files[0];
    const name = target.name;
    //alert(target.files[0]);
    this.setState({
      PaymentReceiptFile: value
    });

    let errors = this.state.errors;

    switch (name) {
      case 'PaymentReceiptFile':
        errors.PaymentReceiptFile = this.state.transactionType == "Cash" ? ((!value) ? 'Please select receipt file to upload.' : '') : '';
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }


    this.setState({ errors, [name]: value }, () => {

    })
  }

  handleTransactionDateChange(date) {
    let errors = this.state.errors;
    errors.TransactionDate = this.state.TransactionType == "Cash" ? ((!date) ? 'Please enter transaction date.' : '') : '';
    this.setState({ TransactionDate: date })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    if (name == "patientMilestoneId") {
      if (value != "0") {
        let milstoneamount = this.state.milestones.filter(ml => ml.paymentMilestoneId === parseInt(value));
        if (milstoneamount != '') {
          if (this.state.pracDisStatus) {
            this.setState({
              TransactionAmount: milstoneamount[0].discountAmount
            });
          } else {
            this.setState({
              TransactionAmount: milstoneamount[0].amount
            });
          }
        }
        else {
          this.setState({
            TransactionAmount: ''
          });
        }
      }
      else {
        if (this.state.pracDisStatus) {
          let milstoneamount = this.state.milestones.reduce(function (sum, tax) {
            return sum + parseFloat(tax.discountAmount);
          }, 0);
          this.setState({
            TransactionAmount: milstoneamount
          });
        } else {
          let milstoneamount = this.state.milestones.reduce(function (sum, tax) {
            return sum + parseFloat(tax.amount);
          }, 0);
          this.setState({
            TransactionAmount: milstoneamount
          });
        }
      }
    }
    let errors = this.state.errors;

    switch (name) {
      case 'TransactionId':
        errors.TransactionId = this.state.transactionType == "Cash" ? ((!value) ? 'Please enter transaction id.' : '') : '';
        break;
      case 'patientMilestoneId':
        errors.patientMilestoneId = (!value) ? 'Please select milestone.' : '';
        errors.TransactionAmount = '';

        break;
      case 'TransactionAmount':
        errors.TransactionAmount = (!value) ? 'Please enter transaction amount.' : '';
        break;
      case 'TransactionDate':
        errors.TransactionDate = this.state.TransactionType == "Cash" ? ((!value) ? 'Please enter transaction date.' : '') : '';
        break;
      case 'TransactionType':
        errors.TransactionType = (!value) ? 'Please select transaction type.' : '';
        break;
      //case 'Remark':
      //  errors.Remark = (!value) ? 'Please enter remark.' : '';
      //  break;
      case 'PatientId':
        errors.PatientId = (!value) ? 'Please select patient.' : '';
        break;
      case 'AccountHolderName':
        errors.AccountHolderName = this.state.transactionType == "Online Payment" ? ((!value) ? 'Please enter account holder name.' : '') : '';
        break;
      case 'AccountNumber':
        errors.AccountNumber = this.state.transactionType == "Online Payment" ? ((!value) ? 'Please enter account number.' : '') : '';
        break;
      case 'RoutingNumber':
        errors.RoutingNumber = this.state.transactionType == "Online Payment" ? ((!value) ? 'Please enter routing number.' : '') : '';
        break;

      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }


    this.setState({ errors, [name]: value }, () => {

    })
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.patientMilestoneId == undefined || this.state.patientMilestoneId == '') {
      errors.patientMilestoneId = 'Please select milestone.';
    }
    if (this.state.TransactionAmount == undefined || this.state.TransactionAmount == '') {
      errors.TransactionAmount = 'Please enter transaction amount.';
    }
    //if (this.state.Remark == undefined || this.state.Remark == '') {
    //  errors.Remark = 'Please enter remark.';
    //}
    if (this.state.PatientId == undefined || this.state.PatientId == '') {
      errors.PatientId = 'Please select patient.';
    }
    if (this.state.TransactionType == undefined || this.state.TransactionType == '') {
      errors.TransactionType = 'Please select transaction type.';
    }
    if (this.state.TransactionType == "Online Payment") {
      if (this.state.AccountHolderName == undefined || this.state.AccountHolderName == '') {
        errors.AccountHolderName = 'Please enter account holder name.';
      }
      if (this.state.AccountNumber == undefined || this.state.AccountNumber == '') {
        errors.AccountNumber = 'Please enter account number.';
      }
      if (this.state.RoutingNumber == undefined || this.state.RoutingNumber == '') {
        errors.RoutingNumber = 'Please enter routing number.';
      }
    }
    else if (this.state.TransactionType == "Cash") {
      if (this.state.TransactionId == undefined || this.state.TransactionId == '') {
        errors.TransactionId = 'Please enter transaction id.';
      }
      if (this.state.TransactionDate == undefined || this.state.TransactionDate == '') {
        errors.TransactionDate = 'Please enter transaction date.';
      }
      //if (this.state.PaymentReceiptFile == undefined || this.state.PaymentReceiptFile == '') {
      //  errors.PaymentReceiptFile = 'Please select receipt file to upload.';
      //}
    }

    if (this.state.DiseasCategoryId == undefined || this.state.DiseasCategoryId == '') {
      errors.DiseasCategoryId = 'Please select disease category.';
    }

    Object.values(errors).forEach(
      // if we have an modalBody string set valid to false
      (val) => val.length > 0 && (valid = false)
    );

    if (!valid) {
      this.scrollToTop();

    }
    return valid;
  }

  uploadFile(accessionNo, msg) {
    const apiroute = window.$APIPath;

    if (this.state.PaymentReceiptFile != "") {
      //upload
      let rurl = apiroute + '/api/BE_PaymentHistory/UploadFile';
      let files = this.state.PaymentReceiptFile;
      const data = new FormData();
      data.append(`file`, files);
      data.append(`AccessionNo`, accessionNo);
      axiosInstance.post(rurl, data, {
        // receive two    parameter endpoint url ,form data
      }).then(result => {
        // console.log(result);
        this.setState(() => ({
          PaymentReceipt: "",
          PaymentReceiptFile: "",
          showPaymentDetail: false,
          isSubmit: true,
        }), function () {
          this.getListData();
          //this.getData(this.state.PatientId);
        });
        toast.success(msg)
      });
    }
  }
  //end upload


  handleSubmit(e) {
    e.preventDefault();
    debugger;
    this.setState({ loading: true });

    const apiroute = window.$APIPath;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = userToken.userId;
    let url = "";
    let data = [];
    //insert or update
    if (this.state.PatientPaymentId == 0) {
      url = apiroute + '/api/BE_PaymentHistory/Save';
    }
    else {
      url = apiroute + '/api/BE_PaymentHistory/Update';
    }

    let patientList = this.state.patients.filter(dl => dl.patientId == this.state.PatientId);
    let aid = patientList[0].patientAccessionId;

    if (this.validateForm(this.state.errors)) {

      if (parseInt(this.state.patientMilestoneId) == 0) {
        let milestonesData = this.state.milestones;
        for (let i = 0; i < milestonesData.length; i++) {
          let dt = {
            PatientId: parseInt(this.state.PatientId),
            PatientAccessionId: (aid == 0 ? null : aid),
            PaymentMilestoneId: parseInt(milestonesData[i].paymentMilestoneId),
            TransactionAmount: parseFloat(this.state.pracDisStatus ? milestonesData[i].discountAmount : milestonesData[i].amount),
            TransactionId: this.state.TransactionId,
            TransactionDate: (this.state.TransactionDate == '' ? '1999-01-01' : this.state.TransactionDate),
            TransactionType: this.state.TransactionType,
            TransactionStatus: "Paid",
            PaymentReceipt: "",
            Remark: this.state.Remark,
            AccountHolderName: this.state.AccountHolderName,
            AccountNumber: this.state.AccountNumber,
            RoutingNumber: this.state.RoutingNumber,
            CreatedBy: parseInt(userId)
          }
          data.push(dt);
        }
        // console.log(data);
        axiosInstance.post(url, data, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
          .then(result => {
            //tcount = tcount + 1;
            if (result.data.flag) {
              //eType = 'success';
              //msg = result.data.message;
              this.setState(() => ({
                // modal: !this.state.modal,
                // modalTitle: 'Success',
                // modalBody: result.data.message,
                patientMilestoneId: "",
                DiseasCategoryId: "",
                TransactionId: "",
                TransactionAmount: "",
                TransactionDate: "",
                TransactionType: "",
                Remark: "",
                //showPaymentDetail: false,
                //isSubmit: true
              }), function () {
                if (this.state.PaymentReceiptFile != "") {
                  this.uploadFile(result.data.outdata, result.data.message);
                } else {
                  this.setState({
                    loading: false,
                    showPaymentDetail: false,
                    isSubmit: true,
                  }, () => { this.getListData(); });
                }
              });
            }
            else {
              //eType = 'danger';
              //msg = result.data.message;
              this.setState({
                // modal: !this.state.modal,
                // modalTitle: 'Error',
                // modalBody: result.data.message,
                loading: false
              });
              toast.error(result.data.message)
            }
          })
          .catch(modalBody => {
            //eType = 'danger';
            //msg = modalBody.message;
            this.setState({
              // modal: !this.state.modal, modalTitle: 'Error', modalBody: modalBody.message, 
              loading: false
            });
            toast.error(modalBody.message)
            // this.setState({ modal: !this.state.modal, modalBody: modalBody });
          });
      }

      else {
        let dt = {
          PatientId: parseInt(this.state.PatientId),
          PatientAccessionId: (aid == 0 ? null : aid),
          PaymentMilestoneId: parseInt(this.state.patientMilestoneId),
          TransactionAmount: parseFloat(this.state.TransactionAmount),
          TransactionId: this.state.TransactionId,
          TransactionDate: (this.state.TransactionDate == '' ? '1999-01-01' : this.state.TransactionDate),
          TransactionType: this.state.TransactionType,
          TransactionStatus: "Paid",
          PaymentReceipt: "",
          Remark: this.state.Remark,
          AccountHolderName: this.state.AccountHolderName,
          AccountNumber: this.state.AccountNumber,
          RoutingNumber: this.state.RoutingNumber,
          CreatedBy: parseInt(userId)
        };

        data.push(dt);

        // console.log(data);
        axiosInstance.post(url, data, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
          .then(result => {
            if (result.data.flag) {
              this.setState(() => ({
                // modal: !this.state.modal,
                // modalTitle: 'Success',
                // modalBody: result.data.message,
                patientMilestoneId: "",
                DiseasCategoryId: "",
                TransactionId: "",
                TransactionAmount: "",
                TransactionDate: "",
                TransactionType: "",
                Remark: "",
                //showPaymentDetail: false,
                //isSubmit: true
              }), function () {
                if (this.state.PaymentReceiptFile != "") {
                  this.uploadFile(result.data.outdata, result.data.message);
                } else {
                  this.setState({
                    loading: false,
                    showPaymentDetail: false,
                    isSubmit: true,
                  }, () => { this.getListData(); });
                }
              });
            }
            else {
              this.setState({
                // modal: !this.state.modal,
                // modalTitle: 'Error',
                // modalBody: result.data.message,
                loading: false
              });
              toast.error(result.data.message)
            }
          })
          .catch(modalBody => {
            this.setState({
              // modal: !this.state.modal, modalTitle: 'Error', modalBody: modalBody.message, 
              loading: false
            });
            toast.error(modalBody.message)
            //this.setState({ modal: !this.state.modal, modalBody: modalBody });
          });
      }
      //end insert or update
    } else {
      this.setState({ loading: false });
    }
  }
  //End Payment Details add

  //get patient list 
  getListData() {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_Patient/getPatientsProfileCompleted';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          // console.log(result.data.outdata);
          this.setState({
            patients: result.data.outdata,
            //drpPatients: result.data.outdata.patientDRPData,
            //loading: false
          }, () => {
            //this.getMilestone();
            this.GetDiseasCategory();
          });

          if (this.state.isSubmit) {
            this.setState({
              isSubmit: false
            });
            this.getData(this.state.PatientId);
          }
        }
        //else {
        //  console.log(result.data.message);
        //},
        else {
          this.setState({ loading: false });
        }
      })
      .catch(modalBody => {
        // console.log(modalBody);
        this.setState({ modal: !this.state.modal, modalBody: modalBody, loading: false });
      });
  }

  handlePatientInputChange(event) {
    debugger;
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    if (value != "") {
      this.getData(value);
    }
    else {
      this.setState({
        patientPayments: []
      });
    }
  }

  //get patient payment details
  getData(pid) {
    debugger;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    let patientList = this.state.patients.filter(dl => dl.patientId == pid);
    // console.log(patientList);
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PaymentHistory/GetByPatientId';

    let data = JSON.stringify({
      isDeleted: true,
      searchString: '',
      Id: parseInt(pid),
      AccessionId: parseInt(patientList[0].patientAccessionId == null ? 0 : patientList[0].patientAccessionId)
    });

    // console.log(data);

    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          // console.log(result.data.outdata);
          //var rdata = result.data.outdata;
          /*var milestoneLength = this.state.milestones.length;*/
          this.setState(() => ({
            patientPayments: result.data.outdata.patientPaymentData,
            pracDisStatus: result.data.outdata.pracIsDiscount,
            DiseasCategoryId: result.data.outdata.patientDiseaseCatId,
            //loading: false
          }), function () { this.GetMilestoneByDisease(result.data.outdata.patientDiseaseCatId) });

          //if (rdata != null && rdata.length > 0) {
          //  if (rdata.length == milestoneLength) {
          //    this.setState({
          //      showPaymentDetail: false
          //    });
          //  }
          //  else {
          //    this.setState({
          //      showPaymentDetail: true
          //    });
          //  }
          //}
          //else {
          //  this.setState({
          //    showPaymentDetail: true
          //  });
          //}
        }
        else {
          // console.log(result.data.message);
          if (result.data.message == 'Please assign practitioner first') {
            this.setState({ practionerAssignMessage: result.data.message, showPaymentDetail: false, patientPayments: [] });
          }
          this.setState({ loading: false });
        }
      })
      .catch(modalBody => {
        // console.log(modalBody);
        this.setState({ modal: !this.state.modal, modalBody: modalBody, loading: false, patientPayments: [] });
      });
  }

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin">
      </div>;
    }
  }

  //file preview
  previewToggle(e, filePath) {
    this.setState({
      preview: !this.state.preview,
      url: window.$FileUrl + filePath
    })
  }

  onError = (err) => console.log("Error:", err); // Write your own logic

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // for smoothly scrolling
    });
  }

  render() {
    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const { loading, patients, patientPayments, authError, modalBody, errors, roleName,
      PatientId, patientMilestoneId, milestones, TransactionId, RoutingNumber, preview, url,
      TransactionAmount, Remark, TransactionDate, AccountNumber, showPaymentDetail, drpReadOnly,
      PaymentReceiptFile, TransactionType, PaymentReceipt, AccountHolderName, DiseaseCategory, DiseasCategoryId, practionerAssignMessage, pracStatus
    } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Patient List</h5>
          </Col>
          <Col xs="2" lg="2">

          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col xs="6">
                  </Col>
                  <Col xs="6">
                    <Input type="select" disabled={drpReadOnly} name="PatientId" value={PatientId} onChange={this.handlePatientInputChange.bind(this)}>
                      <option value="">All Patient</option>
                      {patients
                        .map((data, i) => {
                          return (<option key={i} value={data.patientId}>{data.firstName + " " + data.lastName + (data.accessionNo != null ? " (" + data.accessionNo.replace(/-/g, "") + ")" : "")}</option>);
                        })}
                    </Input>

                    {/*<SelectSearch options={patients} value={PatientId} name="PatientId" placeholder="Select Patient" onChange={this.handlePatientInputChange.bind(this)}/>*/}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {authError ? <p>{modalBody.message}</p> : null}

                {preview &&
                  <>
                    <div className='preview-popup'>
                      <div className='preview-popup-modal'>
                        <div className='preview-popup-header'>
                          {url.split(".").splice(-1)[0] === "pdf" ? null :
                            <a href={url} download target={`_blank`}>
                              <img src={downloadIcon} style={{ margin: "0 12px", cursor: "pointer" }} alt='download' />
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

                {showPaymentDetail ?
                  <Form className="form-horizontal" style={{ "marginBottom": "5px" }} onSubmit={this.handleSubmit.bind(this)}>
                    <Row>
                      <Col xs="4">
                        <FormGroup>
                          <Label>Disease Category <span className="requiredField">*</span></Label>
                          <Input disabled type="select" name="DiseasCategoryId" value={DiseasCategoryId}>{/*onChange={this.GetMilestoneByDisease.bind(this)}*/}
                            <option value="">Select Disease Category</option>
                            {DiseaseCategory
                              .map((data, i) => {
                                return (<option key={i} value={data.diseaseCategoryId}>{data.diseaseCategoryName}</option>);
                              })}
                          </Input>
                          {errors.DiseasCategoryId.length > 0 && <span className='error'>{errors.DiseasCategoryId}</span>}
                        </FormGroup>
                      </Col>
                      <Col xs="4">
                        <FormGroup>
                          <Label>Purchase Option <span className="requiredField">*</span></Label>
                          <Input type="select" tabIndex="1" name="patientMilestoneId" value={patientMilestoneId} onChange={this.handleInputChange.bind(this)}>
                            <option value="">Select Purchase Option</option>
                            {DiseasCategoryId != '' && DiseasCategoryId != "" && DiseasCategoryId != 0 && milestones.length > 0 ?
                              <option value="0">All</option>
                              : null}
                            {milestones
                              .map((data, i) => {
                                return (<option key={i} value={data.paymentMilestoneId}>{data.paymentMilestoneName}</option>); //{ data.paymentMilestoneName + " ($ " + data.amount + ")" }
                              })}
                          </Input>
                          {errors.patientMilestoneId.length > 0 && <span className='error'>{errors.patientMilestoneId}</span>}
                        </FormGroup>

                      </Col>
                      <Col xs="4">
                        <FormGroup>
                          <Label>Transaction Type <span className="requiredField">*</span></Label>
                          <Input type="select" tabIndex="2" name="TransactionType" value={TransactionType} onChange={this.handleInputChange.bind(this)}>
                            <option value="">Select Transaction Type</option>
                            {/*<option value="Online Payment">Online Payment</option>*/}
                            <option value="Cash">A Cheque</option>
                          </Input>
                          {errors.TransactionType.length > 0 && <span className='error'>{errors.TransactionType}</span>}
                        </FormGroup>
                      </Col>
                      <Col xs="4">
                        <FormGroup>
                          <Label>Transaction Amount <span className="requiredField">*</span></Label>
                          <Input type="number" className="form-control here" maxLength="50" tabIndex="3" name="TransactionAmount" placeholder="Enter a transaction amount" value={TransactionAmount} onChange={this.handleInputChange.bind(this)} />
                          {errors.TransactionAmount.length > 0 && <span className='error'>{errors.TransactionAmount}</span>}
                        </FormGroup>
                      </Col>
                      {TransactionType == "Cash" ? (
                        <React.Fragment>
                          <Col xs="4">
                            <FormGroup>
                              <Label>Transaction Id <span className="requiredField">*</span></Label>
                              <Input type="text" name="TransactionId" tabIndex="4" maxLength="50" className="form-control" value={TransactionId} onChange={this.handleInputChange.bind(this)} placeholder="Enter a transaction id" />
                              {errors.TransactionId.length > 0 && <span className='error'>{errors.TransactionId}</span>}
                            </FormGroup>
                          </Col>
                          <Col xs="4">
                            <FormGroup>
                              <Label>Transaction Date <span className="requiredField">*</span></Label>
                              {/* <Input type="date" className="form-control here" max="9999-12-31" maxLength="50" tabIndex="5" name="TransactionDate" placeholder="Enter a transaction date" value={TransactionDate} onChange={this.handleInputChange.bind(this)} /> */}
                              <div className="cus-date-picker">
                                <DatePicker
                                  selected={TransactionDate}
                                  onChange={this.handleTransactionDateChange.bind(this)}
                                  dateFormat="MM/dd/yyyy"
                                  placeholderText="mm/dd/yyyy"
                                  className="form-control"
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  fixedHeight
                                />
                              </div>
                              {errors.TransactionDate.length > 0 && <span className='error'>{errors.TransactionDate}</span>}
                            </FormGroup>
                          </Col>
                        </React.Fragment>
                      ) : TransactionType == "Online Payment" ? (
                        <React.Fragment>
                          <Col xs="4">
                            <FormGroup>
                              <Label>Account Holder Name <span className="requiredField">*</span></Label>
                              <Input type="text" name="AccountHolderName" tabIndex="6" maxLength="150" className="form-control" value={AccountHolderName} onChange={this.handleInputChange.bind(this)} placeholder="Enter a account holder name" />
                              {errors.AccountHolderName.length > 0 && <span className='error'>{errors.AccountHolderName}</span>}
                            </FormGroup>
                          </Col>
                          <Col xs="4">
                            <FormGroup>
                              <Label>Routing Number <span className="requiredField">*</span></Label>
                              <Input type="number" className="form-control here" maxLength="20" tabIndex="7" name="RoutingNumber" placeholder="Enter a routing number" value={RoutingNumber} onChange={this.handleInputChange.bind(this)} />
                              {errors.RoutingNumber.length > 0 && <span className='error'>{errors.RoutingNumber}</span>}
                            </FormGroup>
                          </Col>
                          <Col xs="4">
                            <FormGroup>
                              <Label>Account Number <span className="requiredField">*</span></Label>
                              <Input type="number" className="form-control here" maxLength="20" tabIndex="8" name="AccountNumber" placeholder="Enter a account number" value={AccountNumber} onChange={this.handleInputChange.bind(this)} />
                              {errors.AccountNumber.length > 0 && <span className='error'>{errors.AccountNumber}</span>}
                            </FormGroup>
                          </Col>
                        </React.Fragment>
                      ) : null}
                      <Col xs="6">
                        <FormGroup>
                          <Label>Remark</Label>{/*<span className="requiredField">*</span>*/}
                          <Input type="textarea" className="form-control here" maxLength="250" tabIndex="9" name="Remark" placeholder="Enter a remark" value={Remark} onChange={this.handleInputChange.bind(this)} />
                          {errors.Remark.length > 0 && <span className='error'>{errors.Remark}</span>}
                        </FormGroup>
                      </Col>
                      {TransactionType == "Cash" ? (
                        <Col xs="6">
                          <FormGroup>
                            <Label>Receipt</Label>{/*<span className="requiredField">*</span>*/}
                            <Input type="file" name="PaymentReceiptFile" tabIndex="10" id="File" className="form-control" onChange={this.handleFileInputChange.bind(this)} />
                            {errors.PaymentReceiptFile.length > 0 && <span className='error'>{errors.PaymentReceiptFile}</span>}
                          </FormGroup>

                          {PaymentReceipt != null && PaymentReceipt != "" ?
                            <div className="col-md-6">
                              <a href={PaymentReceipt} download>
                                <i className="flaticon2-download"></i>
                              </a>
                            </div>
                            : null}
                        </Col>
                      )
                        : null}
                    </Row>

                    <Row>
                      <Col xs="12">
                        <FormGroup className="formButton">
                          <Button type="submit" disabled={loading} color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>{" "}
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                  :
                  !pracStatus ?
                    (practionerAssignMessage != null && practionerAssignMessage != '' ?
                      <div>
                        <div className="alert alert-danger alert-dismissible" role="alert">
                          <div className="alert-text" style={{ "textAlign": "Center" }}><b> {practionerAssignMessage}</b></div>
                        </div>
                      </div>
                      :
                      null
                    ) :
                    null
                }

                <Table responsive bordered key="tblpatients">
                  <thead class="thead-light">
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
                      //employees.map(function (data,i) {
                      patientPayments.length > 0 ? (
                        patientPayments
                          //.slice(
                          //  currentPage * pageSize,
                          //  (currentPage + 1) * pageSize
                          //)
                          .map((data, i) => {
                            return (<tr key={i}>
                              <td>{data.paymentMilestone}</td>
                              <td>{Moment(data.transactionDate).format('DD MMM YYYY')}<br />{data.transactionId}
                                <br />
                                {data.paymentReceipt != "" && data.paymentReceipt != null ?
                                  <a style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, data.paymentReceipt)}>
                                    <i className="flaticon2-download"></i> <b>Receipt</b>
                                  </a>
                                  : null}                              </td>
                              <td>${data.transactionAmount}</td>
                              <td>{data.remark}</td>
                              <td>{data.userType != 1 ? data.userType != 2 ? "Institution" : "Practitioner" : "Patient"}</td>
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
                              <td><span className="badge badge-success" style={{ "padding": "8px", "color": "#fff" }}>Verified</span></td>
                            </tr>);
                          })
                      ) : (
                        PatientId == null || PatientId == ''
                          ?
                          <tr>
                            <td colSpan="7" className="tdCenter">Please select patient.</td></tr>
                          :
                          <tr>
                            <td colSpan="7" className="tdCenter">No payment transactions.</td></tr>
                      )}
                  </tbody>
                </Table>



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

export default PPayments;
