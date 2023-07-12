import React, { Component, lazy, Suspense } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table, Fade, Collapse,
  Pagination, PaginationItem, PaginationLink, Input, Modal, ModalBody, ModalHeader, ModalFooter
} from 'reactstrap';
import Moment from 'moment';
import MyModal from '../../CustomModal/CustomModal';
import Confirm from "../../CustomModal/Confirm";
import "@reach/dialog/styles.css";
import { toast } from 'react-toastify';
import pdfFile from '../../../assets/pdf-svgrepo-com.svg';
import docFile from '../../../assets/icons8-google-docs.svg';
import FilePreview from "react-file-preview-latest";
import downloadIcon from '../../../assets/download.svg';
import closeIcon from '../../../assets/x.svg';
import axiosInstance from "./../../../common/axiosInstance"

class AccountActivity extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      patients: [],
      history: [],
      patientId: '',
      patientAccessionId: '',
      ppatientId: '',
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
      labcount: 0,
      colcount: 2,
      preview: false,
      url: "",
      poNo: "",

      ManuTransactionId: '',
      ManuTransactionAmount: '',
      ManuRemark: '',
      ManuPatientPaymentId: 0,
      ManuShowpayment: false,
      errors: {
        ManuTransactionId: '',
        ManuTransactionAmount: '',
        NGSTransactionId: '',
        NGSTransactionAmount: ''
      },
      ManushowPO: false,
      Manupofile: '',
      ManupoNo: '',
      manufacturerId: '',
      manufacturerPaymentId: '',

      NGSTransactionId: '',
      NGSTransactionAmount: '',
      NGSRemark: '',
      NGSPatientPaymentId: 0,
      NGSShowpayment: false,
      NGSshowPO: false,
      NGSpofile: '',
      NGSpoNo: '',
      ngsLabId: '',
      ngsLabPaymentId: '',
      roleName: '',
      collapseId: 0
    };
    this.state = this.initialState;
    this.previewToggle = this.previewToggle.bind(this);
    // this.escFunction = this.escFunction.bind(this);
  }

  //setcollapse
  setCollapse(cid) {
    let currentCid = this.state.collapseId;
    if (currentCid == cid) {
      this.setState({ collapseId: -1 });
    }
    else {
      this.setState({ collapseId: cid });
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
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("account activity"));
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
    // document.addEventListener("keydown", this.escFunction, false);
  }

  //get data
  getListData() {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_Patient/GetDRPAll';

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
    const url = apiroute + '/api/BE_PaymentHistory/GetAccountActivity';

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
          // console.log(result.data.outdata);
          let lc = 0;
          if (result.data.outdata != null && result.data.outdata.length > 0) {
            //lc = Math.max.apply(Math, result.data.outdata.map(function (o) { return o.labcount; }));
            lc = 2;
            this.setState({
              pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              history: result.data.outdata, loading: false,
              labcount: lc, colcount: (lc == 0 ? 3 : (2 + lc))
            });
          } else {
            this.setState({
              pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              history: [], loading: false,
              labcount: lc, colcount: 3
            });
          }
          //if (result.data.outdata != null) {
          //  lc = Math.max.apply(Math, result.data.outdata.map(function (o) { return o.labcount; }));
          //}

          //this.setState({
          //  pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
          //  history: result.data.outdata, loading: false,
          //  labcount: lc, colcount: (parseInt(this.state.colcount) + lc)
          //});

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
  getDataByPatient(pid) {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PaymentHistory/GetAccountActivityByPatient';

    let data = JSON.stringify({
      isDeleted: this.state.slDelete,
      searchString: this.state.searchString,
      Id: parseInt(pid),
      pageNo: 0,
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
          var rdata = result.data.outdata;
          let lc = 0;

          if (result.data.outdata != null && result.data.outdata.length > 0) {
            //lc = Math.max.apply(Math, result.data.outdata.map(function (o) { return o.labcount; }));
            lc = 2;
            this.setState({
              pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              history: result.data.outdata, loading: false,
              labcount: lc, colcount: (lc == 0 ? 3 : (2 + lc))
            });
          } else {
            this.setState({
              pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              history: [], loading: false,
              labcount: lc, colcount: 3
            });
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
      this.getDataByPatient(value);
    }
    else {
      this.getData(0);
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

  //Manufacture Start
  //add payment
  handleClosePaymentManu = () => {
    this.setState({
      ManuShowpayment: false
    });
  }

  handleShowPaymentManu = (patientId, pPaymentId, Amount, manuid) => {
    //alert(Math.round(Amount,2))
    this.setState({
      ManuTransactionAmount: Math.round(Amount, 2),
      manufacturerPaymentId: pPaymentId,
      ManuShowpayment: true,
      patientId: patientId,
      manufacturerId: manuid
    });
    // console.log(this.state.ManuShowpayment);
  }

  handlePaymentInputChangeManu(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    let errors = this.state.errors;

    switch (name) {
      case 'ManuTransactionId':
        errors.ManuTransactionId = (!value) ? "Please enter transaction id." : '';
        break;
      case 'ManuTransactionAmount':
        errors.ManuTransactionAmount = (!value) ? "Please enter transaction amount." : '';
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }


    this.setState({ errors, [name]: value }, () => {

    })
  }

  AddPatientPaymentManu(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;
    debugger;
    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    if (userToken != null) {
      uid = (userToken.userId == null ? 0 : userToken.userId);
    }

    if (this.state.ManuTransactionId != null && this.state.ManuTransactionId != "" && this.state.ManuTransactionAmount != null && this.state.ManuTransactionAmount != "") {
      const apiroute = window.$APIPath;
      let url = apiroute + '/api/ManufacturerPayment/DoPayment';

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        patientPaymentId: 0,
        ManufacturerPaymentId: parseInt(this.state.manufacturerPaymentId),
        ManufacturerId: parseInt(this.state.manufacturerId),
        TransactionAmount: parseFloat(this.state.ManuTransactionAmount),
        TransactionId: this.state.ManuTransactionId,
        TransactionStatus: "Paid",
        Remark: this.state.ManuRemark,
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
            ManuShowpayment: false,
            ManuPatientPaymentId: 0,
            ManuTransactionId: '',
            ManuTransactionAmount: '',
            PatientId: 0,
            manufacturerId: ''

          }, this.getData(0));
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
      if (this.state.ManuTransactionId == null || this.state.ManuTransactionId == "") {
        errors.ManuTransactionId = "Please enter transaction id.";
      }
      if (this.state.ManuTransactionAmount == null || this.state.ManuTransactionAmount == "") {
        errors.ManuTransactionAmount = "Please enter transaction amount.";
      }

      this.setState({ loading: false });
    }
  }
  //end add payment

  handlePOCloseManu = () => {
    this.setState({
      ManushowPO: false
    });
  }

  //handlePOShow = (e, id) => {
  //  this.setState({
  //    manufacturerPaymentId: id,
  //    showPO: true,
  //  });
  //}
  handlePOShowManu = (e, id, pid, ppid, mid) => {
    this.setState({
      manufacturerPaymentId: id,
      patientId: pid,
      ManuPatientPaymentId: ppid,
      ManushowPO: true,
      manufacturerId: mid
    });
  }

  handleFileInputChangeManu(event) {
    const target = event.target;
    const value = target.files[0];
    //alert(target.files[0]);
    this.setState({
      Manupofile: value
    });
  }

  handlePOInputChangeManu(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  UpdatePOManu(e) {
    e.preventDefault();
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let uid = (userToken.userId == null ? 0 : userToken.userId);
    let nid = this.state.manufacturerPaymentId;
    let mid = this.state.manufacturerId;
    let pid = this.state.patientId;
    let ppid = this.state.ManuPatientPaymentId;

    //alert(this.state.analysisdatafile)
    if (this.state.Manupofile != "" && this.state.ManupoNo != "") {

      const apiroute = window.$APIPath;
      //let url = apiroute + '/api/ManufacturerPayment/InsertPO?id=' + nid + '&uid=' + uid + '';
      let url = apiroute + '/api/ManufacturerPayment/InsertPONew'
      let files = this.state.Manupofile;
      const data = new FormData();
      data.append(`PatientId`, pid);
      data.append(`ManufacturerId`, mid);
      data.append(`PatientPaymentId`, ppid);
      data.append(`ManufacturerPaymentId`, nid);
      data.append(`POFileSendByUserId`, uid);
      data.append(`poNo`, this.state.ManupoNo);
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
            Manupofile: "",
            patientId: "",
            ManuPatientPaymentId: "",
            ManushowPO: false,
            manufacturerId: ''
          }, this.getData(0));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            ManushowPO: false,
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
      if (this.state.ManupoNo == "") {
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
  DeletePOManu = (e, id) => {
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
          }, this.getData(0));
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
  //Manufacture End


  //Lab Start
  //add payment
  handleClosePaymentNGS = () => {
    this.setState({
      NGSShowpayment: false
    });
  }

  handleShowPaymentNGS = (patientId, paid, pPaymentId, Amount, manuid) => {
    //alert(Math.round(Amount,2))
    this.setState({
      NGSTransactionAmount: Math.round(Amount, 2),
      ngsLabPaymentId: pPaymentId,
      NGSShowpayment: true,
      patientId: patientId,
      patientAccessionId: paid,
      ngsLabId: manuid
    });
    // console.log(this.state.NGSShowpayment);
  }

  handlePaymentInputChangeNGS(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    let errors = this.state.errors;

    switch (name) {
      case 'NGSTransactionId':
        errors.NGSTransactionId = (!value) ? "Please enter transaction id." : '';
        break;
      case 'NGSTransactionAmount':
        errors.NGSTransactionAmount = (!value) ? "Please enter transaction amount." : '';
        break;
      default:
        //(!value) ? '' :'This standard is required.'
        break;
    }


    this.setState({ errors, [name]: value }, () => {

    })
  }

  AddPatientPaymentNGS(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;
    debugger;
    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    if (userToken != null) {
      uid = (userToken.userId == null ? 0 : userToken.userId);
    }

    if (this.state.NGSTransactionId != null && this.state.NGSTransactionId != "" && this.state.NGSTransactionAmount != null && this.state.NGSTransactionAmount != "") {
      const apiroute = window.$APIPath;
      let url = apiroute + '/api/NGSLabPayment/DoPayment';

      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        patientAccessionId: parseInt(this.state.patientAccessionId),
        patientPaymentId: 0,
        NGSLabPaymentId: parseInt(this.state.ngsLabPaymentId),
        NGSLaboratoryId: parseInt(this.state.ngsLabId),
        TransactionAmount: parseFloat(this.state.NGSTransactionAmount),
        TransactionId: this.state.NGSTransactionId,
        TransactionStatus: "Paid",
        Remark: this.state.NGSRemark,
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
            NGSShowpayment: false,
            NGSPatientPaymentId: 0,
            NGSTransactionId: '',
            NGSTransactionAmount: '',
            PatientId: 0,
            patientAccessionId: '',
            ngsLabId: ''

          }, this.getData(0));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false,
            NGSShowpayment: false
          });
          toast.error(result.data.message)
        }
      })
        .catch(error => {
          this.setState({
            // modal: !this.state.modal,
            // modalTitle: 'Error',
            // modalBody: error.message,
            loading: false
          });
          toast.error(error.message)
        });
    }
    else {
      if (this.state.NGSTransactionId == null || this.state.NGSTransactionId == "") {
        errors.NGSTransactionId = "Please enter transaction id.";
      }
      if (this.state.NGSTransactionAmount == null || this.state.NGSTransactionAmount == "") {
        errors.NGSTransactionAmount = "Please enter transaction amount.";
      }

      this.setState({ loading: false });
    }
  }
  //end add payment

  handlePOCloseNGS = () => {
    this.setState({
      NGSshowPO: false
    });
  }

  //handlePOShow = (e, id) => {
  //  this.setState({
  //    ngsLabPaymentId: id,
  //    showPO: true,
  //  });
  //}
  handlePOShowNGS = (e, id, pid, aid, ppid, mid) => {
    debugger;
    this.setState({
      ngsLabPaymentId: id,
      patientId: pid,
      patientAccessionId: aid,
      NGSPatientPaymentId: ppid,
      NGSshowPO: true,
      ngsLabId: mid
    });
  }

  handleFileInputChangeNGS(event) {
    const target = event.target;
    const value = target.files[0];
    //alert(target.files[0]);
    this.setState({
      NGSpofile: value
    });
  }

  handlePOInputChangeNGS(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  UpdatePONGS(e) {
    e.preventDefault();
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let uid = (userToken.userId == null ? 0 : userToken.userId);
    debugger;
    let nid = this.state.ngsLabPaymentId;
    let mid = this.state.ngsLabId;
    let pid = this.state.patientId;
    let ppid = this.state.NGSPatientPaymentId;
    let paid = this.state.patientAccessionId;

    //alert(this.state.analysisdatafile)
    if (this.state.NGSpofile != "" && this.state.NGSpoNo != "") {

      const apiroute = window.$APIPath;
      //let url = apiroute + '/api/NGSfacturerPayment/InsertPO?id=' + nid + '&uid=' + uid + '';
      let url = apiroute + '/api/NGSLabPayment/InsertPONew'
      let files = this.state.NGSpofile;
      const data = new FormData();
      data.append(`PatientId`, pid);
      data.append(`PatientAccessionId`, paid);
      data.append(`NGSLaboratoryId`, mid);
      data.append(`PatientPaymentId`, ppid);
      data.append(`NGSLabPaymentId`, nid);
      data.append(`POFileSendByUserId`, uid);
      data.append(`poNo`, this.state.NGSpoNo);
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
            ngsLabPaymentId: "",
            NGSpofile: "",
            patientId: "",
            patientAccessionId: "",
            NGSPatientPaymentId: "",
            NGSshowPO: false,
            ngsLabId: ''
          }, this.getData(0));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            NGSshowPO: false,
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
      if (this.state.NGSpoNo == "") {
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
  DeletePONGS = (e, id) => {
    //e.preventDefault();

    this.setState({ loading: true });

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/NGSLabPayment/DeletePOFile?id=' + id + '';

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
          }, this.getData(0));
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
  //Lab End

  //download PO/Invoice
  DownloadFile(e, filepath, filename) {
    //alert(filename);
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    axiosInstance({
      url: apiroute + '/api/CognitoUserStore/downloadFile?fileName=' + filepath,
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
  previewToggle(e, file, no) {
    this.setState({
      preview: !this.state.preview,
      url: window.$FileUrl + file,
      poNo: no
    })
  }

  // onError = (err) => console.log("Error:", err); // Write your own logic
  onError = (err) => console.log(""); // Write your own logic

  //close preview popup on escape key-press
  // escFunction(event){
  //   if (event.key === "Escape") {
  //     this.setState({
  //       preview: false,
  //       url: "",
  //       poNo: ""
  //     })
  //   }
  // }

  // componentWillUnmount(){
  //   document.removeEventListener("keydown", this.escFunction, false);
  // }

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
    const { loading, patients, currentPage, currentIndex, pagesCount, ppatientId, preview, url, poNo,
      pageSize, history, patientId, authError, error, labcount, colcount, errors, roleName,

      ManuTransactionId, ManuTransactionAmount, ManuRemark, ManuPatientPaymentId, ManuShowpayment, ManushowPO,
      Manupofile, ManupoNo, manufacturerId, manufacturerPaymentId,

      NGSTransactionId, NGSTransactionAmount, NGSRemark, NGSPatientPaymentId, NGSShowpayment, NGSshowPO,
      NGSpofile, NGSpoNo, ngsLabId, ngsLabPaymentId, collapseId, } = this.state;
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
                    <Input type="select" name="ppatientId" value={ppatientId} onChange={this.handleInputChange.bind(this)}>
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

                  {preview &&
                    <>
                      <div className='preview-popup'>
                        <div className='preview-popup-modal'>
                          <div className='preview-popup-header'>
                            {url.split(".").splice(-1)[0] === "pdf" ? null :
                              <a href={url} download target={`_blank`}>
                                <img src={downloadIcon} style={{ margin: "0 12px", cursor: "pointer" }} alt='download' onClick={e => this.DownloadFile(e, url, poNo)} />
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
                    // !loading ?
                    (history.length > 0 ? (
                      history.map((mdata, i) => {
                        return (
                          <Col xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem", "margin-top": "20px " }}>
                            <Card style={{ "border": "1px solid #1C3A84" }}>
                              <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white" }} >
                                <Row style={{ "fontSize": "16px" }} key={i} onClick={() => this.setCollapse(i)}>
                                  <Col md="10">
                                    <b>
                                      {
                                        <React.Fragment>
                                          <span>{mdata.patientName}</span>
                                        </React.Fragment>
                                      }
                                    </b>
                                  </Col>
                                </Row>
                              </CardHeader>
                              <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                                <Collapse isOpen={i == collapseId} id="collapseExample">
                                  <CardBody>
                                    <Row>
                                      <Table responsive bordered key="tblpatients">
                                        <thead className="thead-light">
                                          <tr>
                                            <th>Accession No</th>
                                            <th>Manufacturing Payment</th>
                                            {labcount != 0 ? [...Array(labcount)].map((x, i) =>
                                              <th>Laboratory Payment</th>
                                            ) : <th>Laboratory Payment</th>}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {!loading ? (
                                            //employees.map(function (data,i) {
                                            mdata.patientAccessionMappings.length > 0 ? (
                                              mdata.patientAccessionMappings
                                                .slice(
                                                  currentPage * pageSize,
                                                  (currentPage + 1) * pageSize
                                                )
                                                .map((data, i) => {
                                                  return (<tr key={i}>
                                                    <td>{roleName == 'Neo Admin' || roleName == 'Admin' ?
                                                      <React.Fragment>
                                                        <span className="anchorAccessNo"><b>{data.accessionNo.replace(/-/g, "")}</b></span>
                                                      </React.Fragment>
                                                      :
                                                      <span className="anchorAccessNo"><b>{data.accessionNo.replace(/-/g, "")}</b></span>
                                                    }</td>

                                                    <td>
                                                      {
                                                        this.state.isEdit ?
                                                          (data.manufactureData != null ?

                                                            (data.manufactureData.manuInvoiceFile ?
                                                              <React.Fragment>
                                                                <a className="btn btn-info btn-sm btn-pill" onClick={e => this.previewToggle(e, data.manufactureData.manuInvoiceFile, data.manufactureData.manuInvoiceNo)}>{data.manufactureData.manuInvoiceNo ? "Invoice - " + data.manufactureData.manuInvoiceNo : "Invoice"}</a>
                                                                {" "}

                                                                {(data.manufactureData.manuPaymentStatus == "Patient Paid" ?
                                                                  <Confirm title="Confirm" description="Are you sure want to send PO?">
                                                                    {confirm => (
                                                                      <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handlePOShowManu(e, data.manufactureData.manufacturerPaymentId, data.patientId, data.manufactureData.manuPatientPaymentId, data.manufactureData.manufacturerId))}>Send PO</a>
                                                                    )}
                                                                  </Confirm>
                                                                  :
                                                                  (data.manufactureData.manuPaymentStatus == "PO Send" ?
                                                                    <React.Fragment>
                                                                      <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, window.$FileUrl + data.manufactureData.manuPoFile, data.manufactureData.manuPONo)}>{data.manufactureData.manuPONo ? "PO - " + data.manufactureData.manuPONo : "PO"}</a>
                                                                      {" "}
                                                                      <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, data.manufactureData.manuPoFile, data.manufactureData.manuPONo)}>
                                                                        {data.manufactureData.manuPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                          <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                        }
                                                                      </div>{" "}
                                                                      <Confirm title="Confirm" description="Are you sure want to delete PO?">
                                                                        {confirm => (
                                                                          <a className="btn btn-danger btn-sm btn-pill" onClick={confirm(e => this.DeletePOManu(e, data.manufactureData.manufacturerPaymentId))}>Delete PO</a>
                                                                        )}
                                                                      </Confirm>
                                                                    </React.Fragment>
                                                                    :
                                                                    (data.manufactureData.manuPaymentStatus == "Payment Requested" ?
                                                                      <Confirm title="Confirm" description="Are you sure want to do the payment?">
                                                                        {confirm => (
                                                                          <Button className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handleShowPaymentManu(data.patientId, data.manufactureData.manufacturerPaymentId, data.manufactureData.manuTransactionAmount, data.manufactureData.manufacturerId))}>
                                                                            Pay
                                                                          </Button>
                                                                        )}
                                                                      </Confirm>
                                                                      :
                                                                      data.manufactureData.manuPaymentStatus == "Paid" ? (
                                                                        <React.Fragment>
                                                                          <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, window.$FileUrl + data.manufactureData.manuPoFile, data.manufactureData.manuPONo)}><span>{data.manufactureData.manuPONo ? "PO - " + data.manufactureData.manuPONo : "PO"}</span></a>
                                                                          {" "}
                                                                          <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, data.manufactureData.manuPoFile, data.manufactureData.manuPONo)}>
                                                                            {data.manufactureData.manuPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                              <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                            }
                                                                          </div>{" "}
                                                                          <span className="badge badge-success btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Paid</span>
                                                                        </React.Fragment>
                                                                      )
                                                                        : (<span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{data.manufactureData.manuPaymentStatus}</span>
                                                                        )
                                                                    )
                                                                  )
                                                                )}
                                                              </React.Fragment>
                                                              :
                                                              (data.manufactureData.manuPaymentStatus == "Patient Paid" ?
                                                                <Confirm title="Confirm" description="Are you sure want to send PO?">
                                                                  {confirm => (
                                                                    <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handlePOShowManu(e, data.manufactureData.manufacturerPaymentId, data.patientId, data.manufactureData.manuPatientPaymentId, data.manufactureData.manufacturerId))}>Send PO</a>
                                                                  )}
                                                                </Confirm>
                                                                :
                                                                (data.manufactureData.manuPaymentStatus == "PO Send" ?
                                                                  <React.Fragment>
                                                                    <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, window.$FileUrl + data.manufactureData.manuPoFile, data.manufactureData.manuPoNo)}>{data.manufactureData.manuPoNo ? "PO - " + data.manufactureData.manuPoNo : "PO"}</a>
                                                                    {" "}
                                                                    <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, data.manufactureData.manuPoFile, data.manufactureData.manuPoNo)}>
                                                                      {data.manufactureData.manuPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                        <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                      }
                                                                    </div>{" "}
                                                                    <Confirm title="Confirm" description="Are you sure want to delete PO?">
                                                                      {confirm => (
                                                                        <a className="btn btn-danger btn-sm btn-pill" onClick={confirm(e => this.DeletePOManu(e, data.manufactureData.manufacturerPaymentId))}>Delete PO</a>
                                                                      )}
                                                                    </Confirm>
                                                                  </React.Fragment>
                                                                  :
                                                                  (data.manufactureData.manuPaymentStatus == "Payment Requested" ?
                                                                    <Confirm title="Confirm" description="Are you sure want to do the payment?">
                                                                      {confirm => (
                                                                        <Button className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handleShowPaymentManu(data.patientId, data.manufactureData.manufacturerPaymentId, data.manufactureData.manuTransactionAmount, data.manufactureData.manufacturerId))}>
                                                                          Pay
                                                                        </Button>
                                                                      )}
                                                                    </Confirm>
                                                                    :
                                                                    data.manufactureData.manuPaymentStatus == "Paid" ? (
                                                                      <React.Fragment>
                                                                        <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, window.$FileUrl + data.manufactureData.manuPoFile, data.manufactureData.manuPoNo)}>{data.manufactureData.manuPoNo ? "PO - " + data.manufactureData.manuPoNo : "PO"}</a>
                                                                        {" "}
                                                                        <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, data.manufactureData.manuPoFile, data.manufactureData.manuPoNo)}>
                                                                          {data.manufactureData.manuPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                            <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                          }
                                                                        </div>{" "}
                                                                        <span className="badge badge-success btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Paid</span>
                                                                      </React.Fragment>
                                                                    )
                                                                      : (<span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{data.manufactureData.manuPaymentStatus}</span>
                                                                      )
                                                                  )
                                                                )
                                                              )
                                                            )



                                                            : "NA")
                                                          : <span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{data.manufactureData.manuPaymentStatus}</span>
                                                      }
                                                    </td>

                                                    {data.laboratoryData.length > 0 ? (
                                                      (data.laboratoryData.length != labcount ?
                                                        <React.Fragment>
                                                          {data.laboratoryData.map((ldata, j) => {
                                                            return (
                                                              <td>
                                                                {this.state.isEdit ?
                                                                  (ldata.ngsInvoiceFile ?
                                                                    <React.Fragment>
                                                                      <h5>{ldata.ngsLaboratoryName}</h5>
                                                                      <br />
                                                                      <a className="btn btn-info btn-sm btn-pill" onClick={e => this.previewToggle(e, ldata.ngsInvoiceFile, ldata.ngsInvoiceNo)}>{ldata.ngsInvoiceNo ? "Invoice - " + ldata.ngsInvoiceNo : "Invoice"}</a>
                                                                      {" "}

                                                                      {(ldata.ngsPaymentStatus == "Patient Paid" ?
                                                                        <Confirm title="Confirm" description="Are you sure want to send PO?">
                                                                          {confirm => (
                                                                            <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handlePOShowNGS(e, ldata.ngsLabPaymentId, data.patientId, data.patientAccessionId, ldata.ngsPatientPaymentId, ldata.ngsLaboratoryId))}>Send PO</a>
                                                                          )}
                                                                        </Confirm>
                                                                        :
                                                                        (ldata.ngsPaymentStatus == "PO Send" ?
                                                                          <React.Fragment>
                                                                            <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, window.$FileUrl + ldata.ngsPoFile, ldata.ngsPONo)}>{ldata.ngsPONo ? "PO - " + ldata.ngsPONo : "PO"}</a>
                                                                            {" "}
                                                                            <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, ldata.ngsPoFile, ldata.ngsPONo)}>
                                                                              {ldata.ngsPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                                <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                              }
                                                                            </div>{" "}
                                                                            <Confirm title="Confirm" description="Are you sure want to delete PO?">
                                                                              {confirm => (
                                                                                <a className="btn btn-danger btn-sm btn-pill" onClick={confirm(e => this.DeletePONGS(e, ldata.ngsLabPaymentId))}>Delete PO</a>
                                                                              )}
                                                                            </Confirm>
                                                                          </React.Fragment>
                                                                          :
                                                                          (ldata.ngsPaymentStatus == "Payment Requested" ?
                                                                            <Confirm title="Confirm" description="Are you sure want to do the payment?">
                                                                              {confirm => (
                                                                                <Button className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handleShowPaymentNGS(data.patientId, data.patientAccessionId, ldata.ngsLabPaymentId, ldata.ngsLabTransactionAmount, ldata.ngsLaboratoryId))}>
                                                                                  Pay
                                                                                </Button>
                                                                              )}
                                                                            </Confirm>
                                                                            :
                                                                            ldata.ngsPaymentStatus == "Paid" ? (
                                                                              <React.Fragment>
                                                                                <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, window.$FileUrl + ldata.ngsPoFile, ldata.ngsPONo)}><span>{ldata.ngsPONo ? "PO - " + ldata.ngsPONo : "PO"}</span></a>
                                                                                {" "}
                                                                                <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, ldata.ngsPoFile, ldata.ngsPONo)}>
                                                                                  {ldata.ngsPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                                    <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                                  }
                                                                                </div>{" "}
                                                                                <span className="badge badge-success btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Paid</span>
                                                                              </React.Fragment>
                                                                            )
                                                                              : (
                                                                                <span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{ldata.ngsPaymentStatus}</span>
                                                                              )
                                                                          )
                                                                        )
                                                                      )}
                                                                    </React.Fragment>

                                                                    :
                                                                    <React.Fragment>
                                                                      <h5>{ldata.ngsLaboratoryName}</h5>
                                                                      <br />
                                                                      {(ldata.ngsPaymentStatus == "Patient Paid" ?
                                                                        <Confirm title="Confirm" description="Are you sure want to send PO?">
                                                                          {confirm => (
                                                                            <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handlePOShowNGS(e, ldata.ngsLabPaymentId, data.patientId, data.patientAccessionId, ldata.ngsPatientPaymentId, ldata.ngsLaboratoryId))}>Send PO</a>
                                                                          )}
                                                                        </Confirm>
                                                                        :
                                                                        (ldata.ngsPaymentStatus == "PO Send" ?
                                                                          <React.Fragment>
                                                                            <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, window.$FileUrl + ldata.ngsPoFile, ldata.ngsPoNo)}>{ldata.ngsPoNo ? "PO - " + ldata.ngsPoNo : "PO"}</a>
                                                                            {" "}
                                                                            <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, ldata.ngsPoFile, ldata.ngsPoNo)}>
                                                                              {ldata.ngsPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                                <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                              }
                                                                            </div>{" "}
                                                                            <Confirm title="Confirm" description="Are you sure want to delete PO?">
                                                                              {confirm => (
                                                                                <a className="btn btn-danger btn-sm btn-pill" onClick={confirm(e => this.DeletePONGS(e, ldata.ngsLabPaymentId))}>Delete PO</a>
                                                                              )}
                                                                            </Confirm>
                                                                          </React.Fragment>
                                                                          :
                                                                          (ldata.ngsPaymentStatus == "Payment Requested" ?
                                                                            <Confirm title="Confirm" description="Are you sure want to do the payment?">
                                                                              {confirm => (
                                                                                <Button className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handleShowPaymentNGS(data.patientId, data.patientAccessionId, ldata.ngsLabPaymentId, ldata.ngsLabTransactionAmount, ldata.ngsLaboratoryId))}>
                                                                                  Pay
                                                                                </Button>
                                                                              )}
                                                                            </Confirm>
                                                                            :
                                                                            ldata.ngsPaymentStatus == "Paid" ? (
                                                                              <React.Fragment>
                                                                                <a className="btn btn-info btn-sm btn-pill" style={{ cursor: "pointer" }} onClick={e => this.DownloadFile(e, window.$FileUrl + ldata.ngsPoFile, ldata.ngsPoNo)}>{ldata.ngsPoNo ? "PO - " + ldata.ngsPoNo : "PO"}</a>{" "}
                                                                                <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, ldata.ngsPoFile, ldata.ngsPoNo)}>
                                                                                  {ldata.ngsPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                                    <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                                  }
                                                                                </div>{" "}
                                                                                <span className="badge badge-success btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Paid</span>
                                                                              </React.Fragment>
                                                                            )
                                                                              : (
                                                                                <span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{ldata.ngsPaymentStatus}</span>
                                                                              )
                                                                          )
                                                                        )
                                                                      )}
                                                                    </React.Fragment>
                                                                  )
                                                                  : <span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{ldata.ngsPaymentStatus}</span>
                                                                }
                                                              </td>
                                                            )
                                                          })
                                                          }

                                                          {
                                                            ([...Array(labcount - data.laboratoryData.length)].map((x, n) =>
                                                              <td>NA</td>
                                                            ))
                                                          }
                                                        </React.Fragment>

                                                        : (
                                                          data.laboratoryData.map((ldata, j) => {
                                                            return (
                                                              <td>
                                                                {this.state.isEdit ?
                                                                  (ldata.ngsInvoiceFile ?

                                                                    <React.Fragment>
                                                                      <h5>{ldata.ngsLaboratoryName}</h5>
                                                                      <a className="btn btn-info btn-sm btn-pill" onClick={e => this.previewToggle(e, ldata.ngsInvoiceFile, ldata.ngsInvoiceNo)}>{ldata.ngsInvoiceNo ? "Invoice - " + ldata.ngsInvoiceNo : "Invoice"}</a>
                                                                      {" "}

                                                                      {(ldata.ngsPaymentStatus == "Patient Paid" ?
                                                                        <Confirm title="Confirm" description="Are you sure want to send PO?">
                                                                          {confirm => (
                                                                            <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handlePOShowNGS(e, ldata.ngsLabPaymentId, data.patientId, data.patientAccessionId, ldata.ngsPatientPaymentId, ldata.ngsLaboratoryId))}>Send PO</a>
                                                                          )}
                                                                        </Confirm>
                                                                        :
                                                                        (ldata.ngsPaymentStatus == "PO Send" ?
                                                                          <React.Fragment>
                                                                            <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, window.$FileUrl + ldata.ngsPoFile, ldata.ngsPONo)}>{ldata.ngsPONo ? "PO - " + ldata.ngsPONo : "PO"}</a>
                                                                            {" "}
                                                                            <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, ldata.ngsPoFile, ldata.ngsPONo)}>
                                                                              {ldata.ngsPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                                <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                              }
                                                                            </div>{" "}
                                                                            <Confirm title="Confirm" description="Are you sure want to delete PO?">
                                                                              {confirm => (
                                                                                <a className="btn btn-danger btn-sm btn-pill" onClick={confirm(e => this.DeletePONGS(e, ldata.ngsLabPaymentId))}>Delete PO</a>
                                                                              )}
                                                                            </Confirm>
                                                                          </React.Fragment>
                                                                          :
                                                                          (ldata.ngsPaymentStatus == "Payment Requested" ?
                                                                            <Confirm title="Confirm" description="Are you sure want to do the payment?">
                                                                              {confirm => (
                                                                                <Button className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handleShowPaymentNGS(data.patientId, data.patientAccessionId, ldata.ngsLabPaymentId, ldata.ngsLabTransactionAmount, ldata.ngsLaboratoryId))}>
                                                                                  Pay
                                                                                </Button>
                                                                              )}
                                                                            </Confirm>
                                                                            :
                                                                            ldata.ngsPaymentStatus == "Paid" ? (
                                                                              <React.Fragment>
                                                                                <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, window.$FileUrl + ldata.ngsPoFile, ldata.ngsPONo)}><span>{ldata.ngsPONo ? "PO - " + ldata.ngsPONo : "PO"}</span></a>
                                                                                {" "}
                                                                                <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, ldata.ngsPoFile, ldata.ngsPONo)}>
                                                                                  {ldata.ngsPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                                    <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                                  }
                                                                                </div>{" "}
                                                                                <span className="badge badge-success btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Paid</span>
                                                                              </React.Fragment>
                                                                            )
                                                                              : (<span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{ldata.ngsPaymentStatus}</span>
                                                                              )
                                                                          )
                                                                        )
                                                                      )}
                                                                    </React.Fragment>

                                                                    :
                                                                    <React.Fragment>
                                                                      <h5>{ldata.ngsLaboratoryName}</h5>
                                                                      {(ldata.ngsPaymentStatus == "Patient Paid" ?
                                                                        <Confirm title="Confirm" description="Are you sure want to send PO?">
                                                                          {confirm => (
                                                                            <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handlePOShowNGS(e, ldata.ngsLabPaymentId, data.patientId, data.patientAccessionId, ldata.ngsPatientPaymentId, ldata.ngsLaboratoryId))}>Send PO</a>
                                                                          )}
                                                                        </Confirm>
                                                                        :
                                                                        (ldata.ngsPaymentStatus == "PO Send" ?
                                                                          <React.Fragment>
                                                                            <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, window.$FileUrl + ldata.ngsPoFile, ldata.ngsPoNo)}>{ldata.ngsPoNo ? "PO - " + ldata.ngsPoNo : "PO"}</a>
                                                                            {" "}
                                                                            <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, ldata.ngsPoFile, ldata.ngsPoNo)}>
                                                                              {ldata.ngsPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                                <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                              }
                                                                            </div>{" "}
                                                                            <Confirm title="Confirm" description="Are you sure want to delete PO?">
                                                                              {confirm => (
                                                                                <a className="btn btn-danger btn-sm btn-pill" onClick={confirm(e => this.DeletePONGS(e, ldata.ngsLabPaymentId))}>Delete PO</a>
                                                                              )}
                                                                            </Confirm>
                                                                          </React.Fragment>
                                                                          :
                                                                          (ldata.ngsPaymentStatus == "Payment Requested" ?
                                                                            <Confirm title="Confirm" description="Are you sure want to do the payment?">
                                                                              {confirm => (
                                                                                <Button className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.handleShowPaymentNGS(data.patientId, data.patientAccessionId, ldata.ngsLabPaymentId, ldata.ngsLabTransactionAmount, ldata.ngsLaboratoryId))}>
                                                                                  Pay
                                                                                </Button>
                                                                              )}
                                                                            </Confirm>
                                                                            :
                                                                            ldata.ngsPaymentStatus == "Paid" ? (
                                                                              <React.Fragment>
                                                                                <a className="btn btn-info btn-sm btn-pill" onClick={e => this.DownloadFile(e, window.$FileUrl + ldata.ngsPoFile, ldata.ngsPoNo)}>{ldata.ngsPoNo ? "PO - " + ldata.ngsPoNo : "PO"}</a>
                                                                                {" "}
                                                                                <div className="btn" style={{ cursor: "pointer" }} onClick={e => this.previewToggle(e, ldata.ngsPoFile, ldata.ngsPoNo)}>
                                                                                  {ldata.ngsPoFile.split(".").splice(-1)[0] === "pdf" ?
                                                                                    <img src={pdfFile} alt='pdf' width="30px" /> : <img src={docFile} alt='doc' width="30px" />
                                                                                  }
                                                                                </div>{" "}
                                                                                <span className="badge badge-success btn-pill" style={{ "padding": "8px", "color": "#fff" }}>Paid</span>
                                                                              </React.Fragment>
                                                                            )
                                                                              : (<span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{ldata.ngsPaymentStatus}</span>
                                                                              )
                                                                          )
                                                                        )
                                                                      )}
                                                                    </React.Fragment>
                                                                  )
                                                                  : <span className="badge badge-danger btn-pill" style={{ "padding": "8px", "color": "#fff" }}>{ldata.ngsPaymentStatus}</span>
                                                                }
                                                              </td>
                                                            )
                                                          }))
                                                      )) :
                                                      (labcount != 0 ? [...Array(labcount)].map((x, i) =>
                                                        <td>NA</td>
                                                      ) : <td>NA</td>)
                                                    }
                                                  </tr>);
                                                })
                                            ) : (
                                              <tr>
                                                <td colSpan={colcount} className="tdCenter">No payment transactions.</td></tr>
                                            )) : (
                                            <tr>
                                              <td colSpan={colcount} className="tdCenter">Loading...</td></tr>
                                          )}
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
                    ) : (
                      <Table><tr><td colSpan="4" className="tdCenter">No activities...</td></tr></Table>
                    )
                      // ) : (

                      //   <Table><tr><td colSpan="4" className="tdCenter">Loading...</td></tr></Table>
                    )}


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

        <Modal isOpen={ManuShowpayment} className="modal-dialog modal-sm">
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
              <Input type="text" name="ManuTransactionId" tabIndex="2" maxLength="50" className="form-control" value={ManuTransactionId} onChange={this.handlePaymentInputChangeManu.bind(this)} placeholder="Enter a transaction id" />
              {errors.ManuTransactionId.length > 0 && <span className='error'>{errors.ManuTransactionId}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Amount</label>
              <Input type="number" className="form-control here" maxLength="50" tabIndex="3" name="ManuTransactionAmount" placeholder="Enter a transaction amount" value={ManuTransactionAmount} onChange={this.handlePaymentInputChangeManu.bind(this)} />
              {errors.ManuTransactionAmount.length > 0 && <span className='error'>{errors.ManuTransactionAmount}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Remark</label>
              <Input type="textarea" className="form-control here" maxLength="50" tabIndex="4" name="ManuRemark" placeholder="Enter a remark" value={ManuRemark} onChange={this.handlePaymentInputChangeManu.bind(this)} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClosePaymentManu}>
              Close
            </Button>
            <Button color="primary" onClick={this.AddPatientPaymentManu.bind(this)}>
              Add
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={ManushowPO} className="modal-dialog modal-lg">
          <ModalHeader>
            Upload PO
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">PO No</label>
              <Input type="text" name="ManupoNo" id="ManupoNo" className="form-control" tabIndex="1" onChange={this.handlePOInputChangeManu.bind(this)} />
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">PO File</label>
              <Input type="file" name="Manupofile" id="ManuFile" className="form-control" multiple="multiple" tabIndex="2" onChange={this.handleFileInputChangeManu.bind(this)} accept=".pdf, .docx,.doc" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handlePOCloseManu}>
              Close
            </Button>
            <Button color="primary" onClick={this.UpdatePOManu.bind(this)}>
              Add
            </Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={NGSShowpayment} className="modal-dialog modal-sm">
          <ModalHeader>
            Payment to Laboratory
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Milestone</label>
              <Input type="text" className="form-control" value="Analysis" disabled />
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Transaction Id</label>
              <Input type="text" name="NGSTransactionId" tabIndex="2" maxLength="50" className="form-control" value={NGSTransactionId} onChange={this.handlePaymentInputChangeNGS.bind(this)} placeholder="Enter a transaction id" />
              {errors.NGSTransactionId.length > 0 && <span className='error'>{errors.NGSTransactionId}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Amount</label>
              <Input type="number" className="form-control here" maxLength="50" tabIndex="3" name="NGSTransactionAmount" placeholder="Enter a transaction amount" value={NGSTransactionAmount} onChange={this.handlePaymentInputChangeNGS.bind(this)} />
              {errors.NGSTransactionAmount.length > 0 && <span className='error'>{errors.NGSTransactionAmount}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Remark</label>
              <Input type="textarea" className="form-control here" maxLength="50" tabIndex="4" name="NGSRemark" placeholder="Enter a remark" value={NGSRemark} onChange={this.handlePaymentInputChangeNGS.bind(this)} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClosePaymentNGS}>
              Close
            </Button>
            <Button color="primary" onClick={this.AddPatientPaymentNGS.bind(this)}>
              Add
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={NGSshowPO} className="modal-dialog modal-lg">
          <ModalHeader>
            Upload PO
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">PO No</label>
              <Input type="text" name="NGSpoNo" id="NGSpoNo" className="form-control" tabIndex="1" onChange={this.handlePOInputChangeNGS.bind(this)} />
            </div>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">PO File</label>
              <Input type="file" name="NGSpofile" id="NGSFile" className="form-control" multiple="multiple" tabIndex="2" onChange={this.handleFileInputChangeNGS.bind(this)} accept=".pdf, .docx,.doc" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handlePOCloseNGS}>
              Close
            </Button>
            <Button color="primary" onClick={this.UpdatePONGS.bind(this)}>
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
      </div >
    );
  }
}

export default AccountActivity;
