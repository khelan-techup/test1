import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row,
  Table, Button, Input, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter, Label, Collapse, Fade
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
import axiosInstance from "./../../../common/axiosInstance"
import ReactPaginate from 'react-paginate';
import { BE_NGSLaboratoryPatient_DeletePatient, BE_NGSLaboratoryPatient_getNGSLaboratoryPatientsPaging, BE_NGSLaboratorySample_Save, CognitoUserStore_downloadFile, NGSLabPayment_DeletePOFile, NGSLabPayment_DoPayment, NGSLabPayment_InsertPONew } from '../../../common/allApiEndPoints';

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
      pageSize: window.$TotalRecord,
      authError: false,
      error: '',
      modal: false,
      modalTitle: '',
      modalBody: '',
      patientId: 0,
      patientAccessionId: '',
      TransactionId: '',
      TransactionAmount: '',
      Remark: '',
      patientPaymentId: 0,
      showpayment: false,
      errors: {
        TransactionId: '',
        TransactionAmount: '',
        SampleId: '',
      },

      showPO: false,
      pofile: '',
      poNo: '',
      ngsLabPaymentId: '',
      collapseId: 0,
      checkbox: [],
      ngsLabId: '',
      patientId: "",
      AllSamples: [],
      showSample: false,

      preview: false,
      url: "",
      poNumber: "",

      isView: false,
      isEdit: false,
      roleName: '',
      role_Id: null,
      PatientName: "",
      pageCountNew: 0
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

    this.setState({ roleName: userToken.roleName, role_Id: userToken.roleId });

    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("laboratory"));
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
    this.setState({ loading: true });

    const param = this.props.match.params;

    if (param.id != undefined) {
      var userToken = JSON.parse(localStorage.getItem('AUserToken'));
      let userId = (userToken.userId == null ? 0 : userToken.userId);
      this.setState({ ngsLabId: param.id });
      const apiroute = window.$APIPath;
      // const url = apiroute + '/api/BE_NGSLaboratoryPatient/getNGSLaboratoryPatientsPaging';      // const url = apiroute + '/api/BE_NGSLaboratoryPatient/getNGSLaboratoryPatientsPaging';
      const url = apiroute + BE_NGSLaboratoryPatient_getNGSLaboratoryPatientsPaging     // const url = apiroute + '/api/BE_NGSLaboratoryPatient/getNGSLaboratoryPatientsPaging';

      let data = JSON.stringify({
        isDeleted: this.state.slDelete,
        searchString: this.state.searchString,
        id: parseInt(param.id),
        pageNo: pageNo,
        totalNo: window.$TotalRecord,
      });

      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(result => {
          this.setState({
            PatientName: result.data
          })
          if (result.data.flag) {
            // console.log(result.data.outdata);
            this.setState({
              pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              pageCountNew: Math.ceil(
                result.data.totalRecord / window.$TotalRecord
              ),
              patients: result.data.outdata, loading: false
            });
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
      this.props.history.push('/ngslaboratory/list');
    }
  }

  //pagination
  handleClick(e, index, currIndex) {
    this.setState({ loading: true })
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
    // const url = apiroute + '/api/BE_NGSLaboratoryPatient/DeletePatient?id=' + id + '&userId=' + userId + '';    // const url = apiroute + '/api/BE_NGSLaboratoryPatient/DeletePatient?id=' + id + '&userId=' + userId + '';
    const url = apiroute + BE_NGSLaboratoryPatient_DeletePatient(id, userId)   // const url = apiroute + '/api/BE_NGSLaboratoryPatient/DeletePatient?id=' + id + '&userId=' + userId + '';

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

  handleShowPayment = (patientId, paid, lPaymentId, Amount) => {
    //alert(Math.round(Amount,2))
    this.setState({
      showpayment: true,
      TransactionAmount: Math.round(Amount, 2),
      ngsLabPaymentId: lPaymentId,
      patientId: patientId,
      patientAccessionId: paid
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
      // let url = apiroute + '/api/NGSLabPayment/DoPayment';
      let url = apiroute + NGSLabPayment_DoPayment;


      let data = JSON.stringify({
        PatientId: parseInt(this.state.patientId),
        patientAccessionId: parseInt(this.state.patientAccessionId),
        patientPaymentId: 0,
        NGSLabPaymentId: parseInt(this.state.ngsLabPaymentId),
        NGSLaboratoryId: parseInt(param.id),
        TransactionAmount: this.state.TransactionAmount,
        TransactionId: this.state.TransactionId,
        TransactionStatus: "Paid",
        Remark: this.state.Remark,
        PaymentByUserId: uid,
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
            patientAccessionId: '',

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

  handlePOShow = (e, id, pid, aid, ppid) => {
    this.setState({
      ngsLabPaymentId: id,
      patientId: pid,
      patientAccessionId: aid,
      patientPaymentId: ppid,
      showPO: true,
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

  handleFileInputChange(event) {
    const target = event.target;
    const value = target.files[0];
    //alert(target.files[0]);
    this.setState({
      pofile: value
    });
  }

  UpdatePO(e) {
    e.preventDefault();
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let uid = (userToken.userId == null ? 0 : userToken.userId);
    let nid = this.state.ngsLabPaymentId;
    let lid = this.state.ngsLabId;
    let pid = this.state.patientId;
    let ppid = this.state.patientPaymentId;
    let paid = this.state.patientAccessionId;

    //alert(this.state.analysisdatafile)
    if (this.state.pofile != "" && this.state.poNo != "") {

      const apiroute = window.$APIPath;
      //let url = apiroute + '/api/NGSLabPayment/InsertPO?id=' + nid + '&uid=' + uid + '';
      // let url = apiroute + '/api/NGSLabPayment/InsertPONew'
      let url = apiroute + NGSLabPayment_InsertPONew
      let files = this.state.pofile;
      const data = new FormData();
      data.append(`PatientId`, pid);
      data.append(`PatientAccessionId`, paid);
      data.append(`NGSLaboratoryId`, lid);
      data.append(`PatientPaymentId`, ppid);
      data.append(`NGSLabPaymentId`, nid);
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
            ngsLabPaymentId: "",
            pofile: "",
            patientId: "",
            patientPaymentId: "",
            showPO: false,
            patientAccessionId: "",
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
    // const url = apiroute + '/api/NGSLabPayment/DeletePOFile?id=' + id + '';
    const url = apiroute + NGSLabPayment_DeletePOFile(id)

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


  //add Sample
  handleCloseSample = () => {
    this.setState({
      showSample: false
    });
  }

  handleShowSample = (e, pid, samples, sids) => {
    // console.log(samples);
    //alert(sids);
    this.setState({
      patientId: pid,
      showSample: true,
      AllSamples: samples,
      checkbox: (sids != "" && sids != null ? sids.split(",") : [])
    });
  }

  handleSampleInputChange(event, id) {
    if (event != null) {
      //let nCheckbox = this.state.checkbox.slice(); // create a new copy of state value
      //if (this.isValueExist(nCheckbox, event.target.value)) { // check if the same value is preexisted in the array
      //  const index = nCheckbox.indexOf(event.target.value);
      //  nCheckbox.splice(index, 1); // removing the preexciting value 
      //} else {
      //  nCheckbox.push(event.target.value); // inserting the value of checkbox in the array
      //}
      //this.setState({
      //  checkbox: nCheckbox,
      //  SampleId: nCheckbox.join(',')
      //});
      //console.log(this.state.AllSamples);
      let data = this.state.AllSamples;
      this.setState({
        AllSamples: []
      });
      const elementsIndex = data.findIndex(element => element.sampleTypeId == id)
      //alert(elementsIndex);
      data[elementsIndex].isCheck = (event.target.checked ? true : false);
      //console.log(data);
      this.setState({
        AllSamples: data
      });
    }
  }

  handleSampleInputChangeText(event, id) {
    if (event != null) {
      //let nCheckbox = this.state.checkbox.slice(); // create a new copy of state value
      //if (this.isValueExist(nCheckbox, event.target.value)) { // check if the same value is preexisted in the array
      //  const index = nCheckbox.indexOf(event.target.value);
      //  nCheckbox.splice(index, 1); // removing the preexciting value 
      //} else {
      //  nCheckbox.push(event.target.value); // inserting the value of checkbox in the array
      //}
      //this.setState({
      //  checkbox: nCheckbox,
      //  SampleId: nCheckbox.join(',')
      //});

      let data = this.state.AllSamples;
      this.setState({
        AllSamples: []
      });
      const elementsIndex = data.findIndex(element => element.sampleTypeId == id)
      //alert(elementsIndex);
      data[elementsIndex].sampleRefNo = (event.target.value);
      if (event.target.value) {
        data[elementsIndex].isCheck = true;
      }
      //console.log(data);
      this.setState({
        AllSamples: data
      });
    }
  }

  ////edit time set checkbox selected
  //setCheckbox(id) {
  //  let nCheckbox = this.state.checkbox.slice(); // create a new copy of state value 
  //  if (this.isValueExist(nCheckbox, id)) { // check if the same value is preexisted in the array
  //    return true;
  //  } else {
  //    return false; // inserting the value of checkbox in the array
  //  }
  //}

  //isValueExist(data, event) {
  //  if (data.length == 0) {
  //    return false;
  //  }
  //  for (let i = 0; i <= data.length; i++) {
  //    if (event == data[i]) {
  //      return true;
  //    }
  //  }
  //  return false;
  //}

  AddPatientSample(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let errors = this.state.errors;

    let uid = 0;
    var userToken = JSON.parse(localStorage.getItem('Usertoken'));
    if (userToken != null) {
      uid = (userToken.userId == null ? 0 : userToken.userId);
    }

    const elementsIndex = this.state.AllSamples.findIndex(element => element.isCheck === true)
    if (elementsIndex != -1) {
      const apiroute = window.$APIPath;
      // let url = apiroute + '/api/BE_NGSLaboratorySample/Save';
      let url = apiroute + BE_NGSLaboratorySample_Save

      //let data = JSON.stringify({
      //  PatientId: parseInt(this.state.patientId),
      //  SampleTypeIds: this.state.SampleId,
      //  PatientSampleId: 0,
      //  SampleTypeId: 0,
      //  createdBy: uid,
      //  createdByFlag: "A"
      //})

      let data = this.state.AllSamples;

      //if (this.state.flag == 'I') {
      for (let i = 0; i < data.length; i++) {
        data[i].PatientSampleId = 0;
        data[i].createdBy = uid;
        data[i].NGSLaboratoryId = parseInt(this.state.ngsLabId);
        data[i].createdByFlag = "A";
      }
      //}
      //else {
      //  url = apiroute + '/api/BE_RoleModule/Update';
      //  for (let i = 0; i < data.length; i++) {
      //    data[i].roleId = parseInt(this.state.roleId);
      //    //data[i].roleModuleId = parseInt(this.state.RoleModuleId);
      //  }
      //}
      // console.log(data);
      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(result => {
        if (result.data.flag) {
          this.setState({
            authError: true,
            errorType: 'success',
            error: result.data.message,
            loading: false,
            showSample: false,
            patientId: '',
            AllSamples: []
          }, this.getListData(0));
        }
        else {
          errors.SampleId = result.data.message;
          this.setState({ loading: false });
        }
      })
        .catch(error => {
          this.setState({
            authError: true, errorType: 'danger', error: error.message, loading: false,
            showSample: false
          });
        });
    }
    else {
      errors.SampleId = "Please select Sample.";
      this.setState({ loading: false });
    }
  }
  //end add Sample

  //download PO/Invoice
  DownloadFile(e, filepath, filename) {
    //alert(filename);
    this.setState({ loading: true });
    const apiroute = window.$APIPath;
    axiosInstance({
      // url: apiroute + '/api/CognitoUserStore/downloadFile?fileName=' + filepath + '',
      url: apiroute + CognitoUserStore_downloadFile(filepath),
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
  handlePageClick = (e) => {
    console.log("datra", e.selected)
    let currentPage = e.selected;
    this.getListData(currentPage)

  }

  render() {
    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const { loading, patients, currentPage, currentIndex, pagesCount, pageSize, authError, preview, url, poNumber,
      error, showpayment, TransactionAmount, TransactionId, Remark, errors, showPO, pofile,
      ngsLabPaymentId, AllSamples, showSample, roleName, collapseId } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Laboratory Patient List</h5>
          </Col>
          <Col xs="2" lg="2">
            <Link to="/ngslaboratory/list">
              <button className="btn btn-primary btn-block">Laboratory</button>
            </Link>
          </Col>
        </Row>


        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>

                  <Col xs="6" >
                    <h5 className='mt-2'>Laboratory: <b>{this.state.PatientName.flag == true ? (this.state?.PatientName.message) : ""}</b></h5>
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
                {
                  // !loading ? (
                  patients.length > 0 ? (
                    patients.map((data, i) => {
                      return (<Col key={i} xs="12" sm="12" md="12" style={{ "fontSize": "0.72rem", "margin-top": "20px " }}>
                        <Card style={{ "border": "1px solid #1C3A84" }}>
                          <CardHeader style={{ "backgroundColor": "#1C3A84", "color": "white" }} >
                            <Row style={{ "fontSize": "16px" }} key={i} onClick={() => this.setCollapse(i)}>
                              <Col md="12">
                                <b>
                                  {this.state.isView ?
                                    <React.Fragment>


                                      <span>
                                        {
                                          (!!(data?.displayName))
                                            ? (data?.displayName) : (data.firstName +
                                              " " +
                                              (data.middleName != null &&
                                                data.middleName != ""
                                                ? data.middleName + " "
                                                : "") +
                                              data.lastName)
                                        }
                                        {
                                          (
                                            data.displayStatus == "Open" ||
                                            data.displayStatus == "On Hold" ||
                                            data.displayStatus == "Complete" ||
                                            data.displayStatus == "Cancelled" ||
                                            data.displayStatus == "Deceased"
                                          )
                                            ? <span className="ml-2 h6"
                                              style={
                                                {
                                                  color: data.displayStatus == "Open" ? "white" :
                                                    (data.displayStatus == "On Hold" ? "white" :
                                                      (data.displayStatus == "Complete" ? "white" :
                                                        (data.displayStatus == "Cancelled" ? "white" :
                                                          (data.displayStatus == "Deceased" ? "white" : ""))))
                                                }
                                              }
                                            >
                                              {/* {
                                                console.log(data?.patientAccessionMappings?.filter((fData) => {
                                                  return fData?.accessionStatus == "Active"
                                                })[0]
                                                )
                                              } */}
                                              {
                                                // data?.patientAccessionMappings.filter((d) => d.accessionStatus != "Active").length > 0 ?
                                                false ?
                                                  <>
                                                    {"( "}

                                                    {
                                                      Array.from(new Set(data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus != "Open"
                                                      }).map((d) => d.accessionStatus))).map((s, i) => {
                                                        return <span>{s}{
                                                          Array.from(new Set(data?.patientAccessionMappings?.filter((fData) => {
                                                            return fData?.accessionStatus != "Open"
                                                          }).map((d) => d.accessionStatus))).length - 1 == i
                                                            ? "" : ", "}</span>
                                                      })

                                                    }
                                                    {" )"}



                                                    {/* {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Active"
                                                      })[0]?.accessionStatus
                                                    }
                                                    {" "}
                                                    {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Complete"
                                                      })[0]?.accessionStatus}
                                                    {" "}
                                                    {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "On Hold"
                                                      })[0]?.accessionStatus
                                                    }
                                                    {" "}
                                                    {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Cancelled"
                                                      })[0]?.accessionStatus
                                                    }
                                                    {" "}
                                                    {
                                                      data?.patientAccessionMappings?.filter((fData) => {
                                                        return fData?.accessionStatus == "Deceased"
                                                      })[0]?.accessionStatus
                                                    }
                                                    {" "} */}
                                                  </>
                                                  : ""
                                              }

                                            </span> : ""
                                        }
                                      </span>
                                      <br />
                                      <div>
                                        <small>
                                          {data?.isRedFlag && data?.redMessage}
                                        </small>
                                      </div>
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
                                        <th>Neo7 Analysis Type</th>
                                        {/* {this.state.isEdit ?
                                          <th>Action</th> : null} */}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        data.patientAccessionMappings.map((adata, index) => (
                                          <tr key={index}>
                                            <td>
                                              <b>
                                                {this.state.isView ?
                                                  <React.Fragment>
                                                    {adata.accessionNo == "" || adata.accessionNo == null ?
                                                      "Not Available"
                                                      : (
                                                        <span>
                                                          <Link className="anchorAccessNo" to={((this.state.role_Id == 5 || this.state.role_Id == 1 || this.state.role_Id == 4) ? '/patients/admininfo/' : '/patients/info/') + data.patientId + '/' + adata.patientAccessionId}><b>{adata.accessionNo.replace(/-/g, "")}</b></Link>
                                                          <br />
                                                          {adata?.accessionNo != null
                                                            ? ` (${adata?.accessionStatus})`
                                                            : "55"}
                                                        </span>

                                                      )
                                                    }

                                                  </React.Fragment>
                                                  : (adata.accessionNo == "" || adata.accessionNo == null ?
                                                    "Not Available"
                                                    : <span className="anchorAccessNo"><b>{adata.accessionNo.replace(/-/g, "")}</b></span>
                                                  )

                                                }
                                              </b>
                                            </td>
                                            <td>
                                              {
                                                adata?.diseaseCategory != null && adata.diseaseCategory != "" ?
                                                  adata.diseaseCategory : ""
                                              }
                                              {adata.diseaseName != null && adata.diseaseName != "" ?
                                                " - " + adata.diseaseName
                                                : ""
                                              }

                                            </td>
                                            {/* {this.state.isEdit ?
                                              <td>
                                                {this.state.isEdit ?
                                                  <Confirm title="Confirm" description="Are you sure want to delete this patient ?">
                                                    {confirm => (
                                                      <Link className="btn btn-danger btn-sm btn-pill" to="#" 
                                                      onClick={confirm(e => this.deleteRow(e, adata.patientId, adata.patientAccessionId))}
                                                      ><b>Delete</b></Link>
                                                    )}
                                                  </Confirm>
                                                  : null}
                                                <br />
                                        
                                              </td>
                                              : null} */}
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
                      <td className="tdCenter">No patients.</td></tr></Table>)

                }
                {/* <Pagination aria-label="Page navigation example" className="customPagination">
                  <PaginationItem disabled={currentIndex - 4 <= 0}>
                    <PaginationLink onClick={e =>
                      this.handleClick(e,
                        Math.floor((currentPage - 5) / 5) * 5,
                        Math.floor((currentIndex - 5) / 5) * 5
                      )
                    } previous href="#">
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
                    <PaginationLink onClick={e =>
                      this.handleClick(e,
                        Math.floor((currentPage + 5) / 5) * 5,
                        Math.floor((currentIndex + 5) / 5) * 5
                      )
                    } next href="#">
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



















        {/* <Row>
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
                       
                      </div>
                    </div>
                  </>
                }


                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Accession No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.length > 0 ? (
                      patients.map((data, i) => {
                        return (<tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{data.firstName + " " + (data.middleName != null && data.middleName != "" ? "(" + data.middleName + ")" : "") + data.lastName}</td>
                          <td style={{ fontWeight: "bold" }}>
                            {
                              data.patientAccessionMappings.map((adata, index) => (
                                <tr key={index}>
                                  <td className='border-0'>
                                    <b>
                                      {this.state.isView ?
                                        <React.Fragment>
                                          {adata.accessionNo == "" || adata.accessionNo == null ?
                                            "Not Available"
                                            :
                                            <Link to={((this.state.role_Id == 5 || this.state.role_Id == 1 || this.state.role_Id == 4) ? '/patients/admininfo/' : '/patients/info/') + data.patientId + '/' + adata.patientAccessionId}><b>{adata.accessionNo.replace(/-/g, "")}</b></Link>
                                          }
                                        </React.Fragment>
                                        : (adata.accessionNo == "" || adata.accessionNo == null ?
                                          "Not Available"
                                          : <span className="anchorAccessNo"><b>{adata.accessionNo.replace(/-/g, "")}</b></span>
                                        )
                                      }
                                    </b>
                                  </td>

                                  {this.state.isEdit || this.state.isView ?
                                    <React.Fragment>
                                     
                                    </React.Fragment>
                                    : null}

                                </tr>
                              ))
                            }
                          </td>
                        </tr>)
                      })) : null}
                    <tr>
                      <th scope="row">1</th>
                      <td>Dara Henry</td>
                      <td style={{ fontWeight: "bold" }}>NB2100158P01</td>
                    </tr>
              
                  </tbody>
                </table>



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
        </Row> */}



        <Modal isOpen={showpayment} className="modal-dialog modal-sm">
          <ModalHeader>
            Payment to Laboratory
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="recipient-name" className="form-control-label">Milestone</label>
              <Input type="text" className="form-control" value="Design" disabled />
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

        <Modal isOpen={showSample} className="modal-dialog modal-md">
          <ModalHeader>
            Add Sample
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              {
                AllSamples.length > 0 ?
                  AllSamples.map((data, i) => {
                    return (
                      <FormGroup check row key={i}>
                        <Row style={{ "marginBottom": "3px" }}>
                          <Col xs="1">
                          </Col>
                          <Col xs="4">
                            {/*this.setCheckbox(data.sampleTypeId) ? (*/}
                            {data.isCheck ? (
                              <Input className="form-check-input" type="checkbox" id={"chk" + data.sampleTypeId} checked name="sampleTypeId" value={data.sampleTypeId} onChange={e => this.handleSampleInputChange(e, data.sampleTypeId)} />
                            ) : (
                              <Input className="form-check-input" type="checkbox" id={"chk" + data.sampleTypeId} name="sampleTypeId" value={data.sampleTypeId} onChange={e => this.handleSampleInputChange(e, data.sampleTypeId)} />
                            )
                            }
                            <Label className="form-check-label" check htmlFor={" chk" + data.sampleTypeId}>{data.sampleTypeName}</Label>
                          </Col>
                          <Col xs="6">
                            <Input type="text" placeholder="Reference No" htmlFor={" chk" + data.sampleTypeId} name="sampleRefNo" value={data.sampleRefNo} onChange={e => this.handleSampleInputChangeText(e, data.sampleTypeId)} ></Input>
                          </Col>
                          <Col xs="1">
                          </Col>
                        </Row>
                      </FormGroup>
                    )
                  }) :
                  <React.Fragment>
                    <br />
                    <span className='error'>Please assign sample to patient.</span>
                  </React.Fragment>
              }
              {errors.SampleId.length > 0 && <span className='error'>{errors.SampleId}</span>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseSample}>
              Close
            </Button>
            <Button color="primary" onClick={this.AddPatientSample.bind(this)}>
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
