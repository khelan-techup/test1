import React, { Component, lazy, Suspense } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import {
  Button, Card, CardBody, CardHeader, Col, Row, Table, Input, Modal, ModalBody, ModalHeader,
  ModalFooter
} from 'reactstrap';
import MyModal from '../../CustomModal/CustomModal';
import Confirm from "../../CustomModal/Confirm";
import ConfirmWithInput from "../../CustomModal/ConfirmWithInput";
import "@reach/dialog/styles.css";
import { toast } from 'react-toastify';
import downloadIcon from '../../../assets/download.svg';
import closeIcon from '../../../assets/x.svg';
import DatePicker from "react-datepicker";
import Moment from 'moment';
import axiosInstance from "../../../common/axiosInstance"

class LabActivity extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      showpatientactivities: [],
      sampleTypeId: "",
      ngsLaboratoryPatientActivityId: "",
      patientId: "",
      patientAccessionId: 0,
      ngsLaboratoryId: "",
      patientAccessionNo: "",
      title: "",
      description: "",
      modal: false,
      modalBody: '',
      modalTitle: '',
      show: false,
      showErr: '',
      analysisdatafile: "",
      analysisdatafileDate: "",
      url: "",
      username: "",
      password: "",
      filedescription: "",
      showFile: false,
      showFileErr: '',
      isView: false,
      isEdit: false,
      PatientAccessionId: '',
      preview: false,
      fileUrl: "",
      fileName: "",

      StatusType: "",
      ngsLaboratoryPatientActivityId: "",
      ngsLaboratoryId: "",
      sampleTypeId: ""
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
    const param = this.props.match.params;
    if (param.id != undefined) {
      this.setState({ patientAccessionId: param.id });
      this.getListData(param.id);
    }
  }

  //get data
  getListData(pid) {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_LabManuActivity/GetLabActivityByPatientId?id=' + pid;

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          // console.log(result.data.outdata);
          this.setState({
            patientId: result.data.outdata.patientId,
            showpatientactivities: result.data.outdata.patientanalysisdata,
            patientAccessionNo: result.data.outdata.accessionNo,
            loading: false
          })
        }
        else {
          // console.log(result.data.message);
          this.setState({
            showpatientactivities: [],
            patientAccessionNo: result.data.outdata.accessionNo,
            loading: false
          });
        }
      })
      .catch(modalBody => {
        // console.log(modalBody);
        this.setState({ modal: true, modalBody: modalBody, loading: false });
      });
  }

  handleClose = () => {
    this.setState({
      sampleTypeId: "",
      ngsLaboratoryPatientActivityId: "",
      ngsLaboratoryId: "",
      show: false
    });
  }

  handleShow = (id, aid, lid) => {
    this.setState({
      sampleTypeId: id,
      ngsLaboratoryPatientActivityId: aid,
      ngsLaboratoryId: lid,
      show: true,
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  //update title and description
  AddDetail(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    if (this.state.title != "" && this.state.description != "") {
      let pid = this.state.ngsLaboratoryId;

      const apiroute = window.$APIPath;
      url = apiroute + '/api/NGSLaboratoryPatientActivity/UpdateDetail';
      // console.log(this.state.showpatientactivities);
      //let ngsactivityId = this.state.showpatientactivities[0].ngsLaboratoryPatientActivityId;
      let ngsactivityId = this.state.ngsLaboratoryPatientActivityId;

      let data = JSON.stringify({
        ngsLaboratoryId: parseInt(pid),
        title: this.state.title,
        description: this.state.description,
        sampleTypeId: parseInt(this.state.sampleTypeId),
        patientId: parseInt(this.state.patientId),
        patientAccessionId: parseInt(this.state.patientAccessionId),
        ngsLaboratoryPatientActivityId: parseInt(ngsactivityId),
      })

      // console.log(data);
      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(result => {
          if (result.data.flag) {
            this.setState({
              // modal: true,
              // modalTitle: 'Success',
              // modalBody: result.data.message,
              loading: false,
              title: '',
              description: '',
              sampleTypeId: '',
              ngsLaboratoryPatientActivityId: '',
              show: false
            }, this.getListData(this.state.patientAccessionId));
            toast.success(result.data.message)
          }
          else {
            this.setState({
              loading: false,
              showErr: result.data.message
            });
          }
        })
        .catch(modalBody => {
          //this.setState({
          //    modal: true, modalTitle: 'Error', modalBody: modalBody.message, loading: false
          //});
          this.setState({ loading: false, showErr: modalBody.message });
        });
    } else {
      this.setState({
        loading: false,
        show: false
      });
    }
  }

  handleFileClose = () => {
    this.setState({
      sampleTypeId: "",
      ngsLaboratoryPatientActivityId: "",
      ngsLaboratoryId: "",
      showFile: false
    });
  }

  handleFileShow = (lid) => {
    this.setState({
      //sampleTypeId: id,
      //ngsLaboratoryPatientActivityId: aid,
      ngsLaboratoryId: lid,
      showFile: true,
    });
  }

  //data file input change
  handleFileInputChange(event) {
    const target = event.target;
    const value = target.files[0];
    //alert(target.files[0]);
    this.setState({
      analysisdatafile: value
    });
  }

  handleFiledDateInputChange(date) {
    this.setState({ analysisdatafileDate: date })
  }

  //upload data file
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    //alert(this.state.analysisdatafile)
    if (this.state.analysisdatafile != "") {

      const apiroute = window.$APIPath;
      let lid = parseInt(this.state.ngsLaboratoryId);
      let pid = this.state.patientId;
      let aid = this.state.patientAccessionId;
      let dt = this.state.analysisdatafileDate;
      let aids = '';
      let currentlab = this.state.showpatientactivities.filter(lab => lab.ngsLaboratoryId == lid);
      // console.log(currentlab);
      if (currentlab.length > 0) {
        aids = Array.prototype.map.call(currentlab[0].labActivityModel, s => s.ngsLaboratoryPatientActivityId).toString();
      }
      //alert(aids);
      //let aids = this.state.ngsLaboratoryPatientActivityId;
      //let aids = Array.prototype.map.call(this.state.patientactivities, s => s.ngsLaboratoryPatientActivityId).toString();

      //if (this.state.ngsLaboratoryPatientDataFileId == 0) {
      //url = apiroute + '/api/NGSLaboratoryPatientDataFile/Save?id=' + pid + '&lid=' + lid + '&aids=' + aids + '';
      url = apiroute + '/api/NGSLaboratoryPatientDataFile/AdminSave';
      //}
      //else {
      //  let id = this.state.ngsLaboratoryPatientDataFileId;
      //  url = apiroute + '/api/NGSLaboratoryPatientDataFile/Update?id=' + id + '&pid=' + pid + '';
      //}
      let files = this.state.analysisdatafile;
      const data = new FormData();
      data.append(`PatientId`, pid);
      data.append(`PatientAccessionId`, aid);
      data.append(`NGSLaboratoryId`, lid);
      data.append(`NGSLaboratoryPatientActivityId`, aids);
      data.append(`AnalysisDataFileDate`, Moment(dt, "DD-MM-YYYY").format('DD-MM-YYYY'));
      data.append(`file`, files);
      //for (let i = 0; i < files.length; i++) {
      //    data.append(`files[${i}]`, files[i])
      //}
      axiosInstance.post(url, data, {
        // receive two    parameter endpoint url ,form data
      }).then(result => {
        // console.log(result);
        if (result.data.flag) {

          if (this.state.url == '' && this.state.username == '' && this.state.password == '') {
            this.setState({
              // modal: true,
              // modalTitle: 'Success',
              // modalBody: result.data.message,
              showFile: false,
              loading: false
            }, this.getListData(this.state.patientAccessionId));
            toast.success(result.data.message)
          } else {
            this.setState({
              analysisdatafile: ""
            });
            var rdata = result.data.outdata;
            this.updateDetail(rdata.ngsLaboratoryPatientDataFileId, result.data.message);
          }

        }
        else {
          this.setState({
            showFileErr: result.data.message,
            loading: false
          });
        }
      }).catch(error => {
        // console.log(error);
        this.setState({
          showFileErr: error.message, loading: false
        });
      });
    }
    else {
      this.setState({
        showFileErr: "Please select data file to upload.",
        loading: false
      });
    }
  }

  //upload data file details
  updateDetail(id, msg) {
    let url = "";

    //let uid = (userToken.userId == null ? 0 : userToken.userId);
    let lid = this.state.ngsLaboratoryId;

    const apiroute = window.$APIPath;
    url = apiroute + '/api/NGSLaboratoryPatientDataFile/UpdateDetails';
    //let aids = Array.prototype.map.call(this.state.patientactivities, s => s.ngsLaboratoryPatientActivityId).toString();
    //let aids = this.state.ngsLaboratoryPatientActivityId;

    let jdata = JSON.stringify({
      ngsLaboratoryPatientDataFileId: parseInt(id),
      ngsLaboratoryId: parseInt(lid),
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      //ngsLaboratoryPatientActivityId: parseInt(aids),
      ngsLaboratoryPatientActivityId: 0,
      url: this.state.url,
      username: this.state.username,
      password: this.state.password,
      description: this.state.filedescription,
      CreatedBy: parseInt(0)
    })

    // console.log(jdata);
    axiosInstance.post(url, jdata, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: true,
            // modalTitle: 'Success',
            // modalBody: msg,
            loading: false,
            ngsLaboratoryPatientDataFileId: "",
            url: "",
            password: "",
            username: "",
            filedescription: "",
            analysisdatafile: "",
            showFile: false
          }, this.getListData(this.state.patientAccessionId));
          toast.success(msg)
        }
        else {
          this.setState({
            showFileErr: result.data.message,
            loading: false
          });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({
          showFileErr: error.message, loading: false
        });
        //this.setState({ modal: true, error: error });
      });
  }

  //delete(active/inactive) data file button click
  deleteRow(e, id) {
    e.preventDefault();

    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem('Usertoken'));
    let uid = (userToken.userId == null ? 0 : userToken.userId);

    const apiroute = window.$APIPath;
    const url = apiroute + '/api/NGSLaboratoryPatientDataFile/Delete?id=' + id + '&userId=' + uid + '';

    axiosInstance.delete(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            // modal: true,
            // modalTitle: 'Success',
            // modalBody: result.data.message,
            loading: false
          }, this.getListData(this.state.patientAccessionId));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: true,
            // modalTitle: 'danger',
            // modalBody: result.data.message,
            loading: false
          });
          toast.error(result.data.message)
        }
      })
      .catch(error => {
        //console.log(error);
        this.setState({
          // modal: true, modalTitle: 'Error', modalBody: error.message, 
          loading: false
        });
        toast.error(error.message)
      });
  }

  //download
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

  //update status
  //SR
  UpdateSampleReceive = (id, lid, stid, dt) => {
    //e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/NGSLaboratoryPatientActivity/UpdateNGSLaboratoryPatientActivitySampleReceived';

    let data = JSON.stringify({
      ngsLaboratoryId: parseInt(lid),
      SampleReceived: true,
      SampleReceivedDate: dt,
      sampleTypeId: parseInt(stid),
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      ngsLaboratoryPatientActivityId: parseInt(id),
    })

    // console.log(data);
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            modal: false,
            modalTitle: "",
            modalBody: "",

            StatusType: "",

            ngsLaboratoryPatientActivityId: "",
            ngsLaboratoryId: "",
            sampleTypeId: "",
            loading: false
          }, this.getListData(this.state.patientAccessionId));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: true,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false
          });
          toast.error(result.data.message)
        }
      })
      .catch(modalBody => {
        this.setState({
          // modal: true, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
        //this.setState({ modal: true, modalBody: modalBody });
      });
  }

  //QP
  UpdateQCPass = (id, lid, stid, dt) => {
    //e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/NGSLaboratoryPatientActivity/UpdateNGSLaboratoryPatientActivitySampleQCPassed';

    let data = JSON.stringify({
      ngsLaboratoryId: parseInt(lid),
      SampleQCPassed: true,
      SampleQCPassedDate: dt,
      sampleTypeId: parseInt(stid),
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      ngsLaboratoryPatientActivityId: parseInt(id),
    })

    // console.log(data);
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            modal: false,
            modalTitle: "",
            modalBody: "",

            StatusType: "",

            ngsLaboratoryPatientActivityId: "",
            ngsLaboratoryId: "",
            sampleTypeId: "",
            loading: false
          }, this.getListData(this.state.patientAccessionId));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: true,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false
          });
          toast.error(result.data.message)
        }
      })
      .catch(modalBody => {
        this.setState({
          // modal: true, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
        //this.setState({ modal: true, modalBody: modalBody });
      });
  }

  //QF
  UpdateQCFail = (id, lid, stid, dt) => {
    //e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/NGSLaboratoryPatientActivity/UpdateNGSLaboratoryPatientActivitySampleQCFailed';

    let data = JSON.stringify({
      ngsLaboratoryId: parseInt(lid),
      SampleQCFailed: true,
      SampleQCFailedDate: dt,
      sampleTypeId: parseInt(stid),
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      ngsLaboratoryPatientActivityId: parseInt(id),
    })

    // console.log(data);
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            modal: false,
            modalTitle: "",
            modalBody: "",

            StatusType: "",

            ngsLaboratoryPatientActivityId: "",
            ngsLaboratoryId: "",
            sampleTypeId: "",
            loading: false
          }, this.getListData(this.state.patientAccessionId));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: true,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false
          });
          toast.error(result.data.message)
        }
      })
      .catch(modalBody => {
        this.setState({
          // modal: true, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
        //this.setState({ modal: true, modalBody: modalBody });
      });
  }

  //SA
  UpdateStartAnalysis = (id, lid, stid, dt) => {
    //e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/NGSLaboratoryPatientActivity/UpdateNGSLaboratoryPatientActivityAnalysisStarted';

    let data = JSON.stringify({
      ngsLaboratoryId: parseInt(lid),
      AnalysisStarted: true,
      AnalysisStartedDate: dt,
      sampleTypeId: parseInt(stid),
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      ngsLaboratoryPatientActivityId: parseInt(id),
    })

    // console.log(data);
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            modal: false,
            modalTitle: "",
            modalBody: "",

            StatusType: "",

            ngsLaboratoryPatientActivityId: "",
            ngsLaboratoryId: "",
            sampleTypeId: "",
            loading: false
          }, this.getListData(this.state.patientAccessionId));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: true,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false
          });
          toast.error(result.data.message)
        }
      })
      .catch(modalBody => {
        this.setState({
          // modal: true, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
        //this.setState({ modal: true, modalBody: modalBody });
      });
  }

  //NR
  UpdateNewRequest = (id, lid, stid, dt) => {
    //e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/NGSLaboratoryPatientActivity/UpdateNGSLaboratoryPatientActivityNewSampleRequested';

    let data = JSON.stringify({
      ngsLaboratoryId: parseInt(lid),
      NewSampleRequested: true,
      NewSampleRequestedDate: dt,
      sampleTypeId: parseInt(stid),
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      ngsLaboratoryPatientActivityId: parseInt(id),
    })

    // console.log(data);
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            modal: false,
            modalTitle: "",
            modalBody: "",

            StatusType: "",

            ngsLaboratoryPatientActivityId: "",
            ngsLaboratoryId: "",
            sampleTypeId: "",
            loading: false
          }, this.getListData(this.state.patientAccessionId));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: true,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false
          });
          toast.error(result.data.message)
        }
      })
      .catch(modalBody => {
        this.setState({
          // modal: true, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
        //this.setState({ modal: true, modalBody: modalBody });
      });
  }

  //CA
  UpdateCompleteAnalysis = (id, lid, stid, dt) => {
    //e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/NGSLaboratoryPatientActivity/UpdateNGSLaboratoryPatientActivityAnalysisCompleted';

    let data = JSON.stringify({
      ngsLaboratoryId: parseInt(lid),
      AnalysisCompleted: true,
      AnalysisCompletedDate: dt,
      sampleTypeId: parseInt(stid),
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      ngsLaboratoryPatientActivityId: parseInt(id),
    })

    // console.log(data);
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            modal: false,
            modalTitle: "",
            modalBody: "",

            StatusType: "",

            ngsLaboratoryPatientActivityId: "",
            ngsLaboratoryId: "",
            sampleTypeId: "",
            loading: false
          }, this.getListData(this.state.patientAccessionId));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: true,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false
          });
          toast.error(result.data.message)
        }
      })
      .catch(modalBody => {
        this.setState({
          // modal: true, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
        //this.setState({ modal: true, modalBody: modalBody });
      });
  }

  //AQP
  UpdateAnalysisQCPass = (id, lid, stid, dt) => {
    //e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/NGSLaboratoryPatientActivity/UpdateNGSLaboratoryPatientActivityAnalysisQCPassed';

    let data = JSON.stringify({
      ngsLaboratoryId: parseInt(lid),
      AnalysisQCPassed: true,
      AnalysisQCPassedDate: dt,
      sampleTypeId: parseInt(stid),
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      ngsLaboratoryPatientActivityId: parseInt(id),
    })

    // console.log(data);
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            modal: false,
            modalTitle: "",
            modalBody: "",

            StatusType: "",

            ngsLaboratoryPatientActivityId: "",
            ngsLaboratoryId: "",
            sampleTypeId: "",
            loading: false
          }, this.getListData(this.state.patientAccessionId));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: true,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false
          });
          toast.error(result.data.message)
        }
      })
      .catch(modalBody => {
        this.setState({
          // modal: true, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
        //this.setState({ modal: true, modalBody: modalBody });
      });
  }

  //DFR
  UpdateDataFileReady = (id, lid, stid, dt) => {
    //e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/NGSLaboratoryPatientActivity/UpdateNGSLaboratoryPatientActivityDataFileReady';

    let data = JSON.stringify({
      ngsLaboratoryId: parseInt(lid),
      DataFileReady: true,
      DataFileReadyDate: dt,
      sampleTypeId: parseInt(stid),
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      ngsLaboratoryPatientActivityId: parseInt(id),
    })

    // console.log(data);
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState({
            modal: false,
            modalTitle: "",
            modalBody: "",

            StatusType: "",

            ngsLaboratoryPatientActivityId: "",
            ngsLaboratoryId: "",
            sampleTypeId: "",
            loading: false
          }, this.getListData(this.state.patientAccessionId));
          toast.success(result.data.message)
        }
        else {
          this.setState({
            // modal: true,
            // modalTitle: 'Error',
            // modalBody: result.data.message,
            loading: false
          });
          toast.error(result.data.message)
        }
      })
      .catch(modalBody => {
        this.setState({
          // modal: true, modalTitle: 'Error', modalBody: modalBody.message, 
          loading: false
        });
        toast.error(modalBody.message)
        //this.setState({ modal: true, modalBody: modalBody });
      });
  }

  //file preview
  previewToggle(e, path, name) {
    this.setState({
      preview: !this.state.preview,
      fileUrl: window.$FileUrl + path,
      fileName: name
    })
  }


  register = (statusDate) => {
    // console.log(statusDate);

    var result = new Date(statusDate);
    result.setDate(result.getDate() + 1);

    let statusType = this.state.StatusType;
    if (statusType == "SR") {
      this.UpdateSampleReceive(this.state.ngsLaboratoryPatientActivityId, this.state.ngsLaboratoryId, this.state.sampleTypeId, result)
    }
    if (statusType == "QP") {
      this.UpdateQCPass(this.state.ngsLaboratoryPatientActivityId, this.state.ngsLaboratoryId, this.state.sampleTypeId, result)
    }
    if (statusType == "QF") {
      this.UpdateQCFail(this.state.ngsLaboratoryPatientActivityId, this.state.ngsLaboratoryId, this.state.sampleTypeId, result)
    }
    if (statusType == "SA") {
      this.UpdateStartAnalysis(this.state.ngsLaboratoryPatientActivityId, this.state.ngsLaboratoryId, this.state.sampleTypeId, result)
    }
    if (statusType == "NR") {
      this.UpdateNewRequest(this.state.ngsLaboratoryPatientActivityId, this.state.ngsLaboratoryId, this.state.sampleTypeId, result)
    }
    if (statusType == "CA") {
      this.UpdateCompleteAnalysis(this.state.ngsLaboratoryPatientActivityId, this.state.ngsLaboratoryId, this.state.sampleTypeId, result)
    }
    if (statusType == "AQP") {
      this.UpdateAnalysisQCPass(this.state.ngsLaboratoryPatientActivityId, this.state.ngsLaboratoryId, this.state.sampleTypeId, result)
    }
    if (statusType == "DFR") {
      this.UpdateDataFileReady(this.state.ngsLaboratoryPatientActivityId, this.state.ngsLaboratoryId, this.state.sampleTypeId, result)
    }
  }

  getStatusDate(tite, body, statusType, id, ngsId, smpTpId) {
    this.setState({
      modal: true,
      modalTitle: tite,
      modalBody: body,

      StatusType: statusType,

      ngsLaboratoryPatientActivityId: id,
      ngsLaboratoryId: ngsId,
      sampleTypeId: smpTpId
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
    const { loading,
      showpatientactivities, patientAccessionNo, title, description, modal,
      modalBody, modalTitle, show, showErr, showFile, showFileErr, url, username, analysisdatafile,
      password, filedescription, preview, fileUrl, fileName, analysisdatafileDate } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="10" lg="10">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Laboratory Analysis Activity</h5>
            <h5 className="mt-2">{patientAccessionNo != "" && patientAccessionNo != null ? "(" + patientAccessionNo.replace(/-/g, "") + ")" : ""}</h5>
          </Col>
          <Col xs="2" lg="2">

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
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {showpatientactivities.length > 0 ? (
                  showpatientactivities.map((ldata, l) => {
                    return (
                      <React.Fragment>
                        <Row>
                          <Col xs="10">
                            <h4>{l + 1 + ") " + ldata.ngsLaboratoryName}</h4>
                          </Col>
                          <Col xs="2" style={{ "marginBottom": "5px", "textAlign": "right" }}>
                            {ldata.dataFileStatus ?
                              <a className="btn btn-info" onClick={() => this.handleFileShow(ldata.ngsLaboratoryId)}><i className="fa fa-upload"></i> Upload Data File</a>
                              : null}
                          </Col>
                        </Row>
                        <Table responsive bordered key="tblpatients">
                          <thead>
                            <tr>
                              <th>Sample Run</th>
                              {/*<th>Analysis Description</th>*/}
                              <th>Change Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              ldata.labActivityModel.length > 0 ? (
                                ldata.labActivityModel
                                  .map((data, i) => {
                                    return (<tr key={i}>
                                      <td>{data.sampleTypeName}</td>
                                      {/*<td>*/}
                                      {/*  {data.title != null ?*/}
                                      {/*    <React.Fragment>*/}
                                      {/*      <span>{data.title}</span>*/}
                                      {/*      <br />*/}
                                      {/*      <span>{data.description}</span>*/}
                                      {/*    </React.Fragment>*/}
                                      {/*    :*/}
                                      {/*    <a className="btn btn-info btn-sm btn-pill" onClick={() => this.handleShow(data.sampleTypeId, data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId)}>Add</a>*/}
                                      {/*  }*/}

                                      {/*</td>*/}
                                      <td>
                                        {data.currentStatus.includes("Pending") || data.currentStatus.includes("Failed") || data.currentStatus.includes("Not Delivered") ?
                                          <span className="badge badge-danger" style={{ "padding": "8px", "color": "#fff", "marginBottom": "3px" }}>{data.currentStatus}</span>
                                          :
                                          data.currentStatus.includes("Transferred") || data.currentStatus.includes("Passed") || data.currentStatus.includes("Completed") || data.currentStatus.includes("Delivered") || data.currentStatus.includes("Shipped") ?
                                            <span className="badge badge-success" style={{ "padding": "8px", "color": "#fff", "marginBottom": "3px" }}>{data.currentStatus}</span>
                                            :
                                            <span className="badge badge-warning" style={{ "padding": "8px", "color": "#fff", "marginBottom": "3px" }}>{data.currentStatus}</span>
                                        }
                                        <br />
                                        {(data.currentStatus == "Not Available" || data.currentStatus == "New Sample Requested" ?
                                          //<Confirm title="Confirm" description="Are you sure want to receive sample?">
                                          //  {confirm => (
                                          //    <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.UpdateSampleReceive(e, data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId))}>Receive Sample</a>)}
                                          //</Confirm>
                                          <a className="btn btn-info btn-sm btn-pill" onClick={() => this.getStatusDate("Are you sure want to receive sample?", "Receive Sample Date", "SR", data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId)}>Receive Sample</a>
                                          :
                                          (data.currentStatus == "Sample Received" ?
                                            <React.Fragment>
                                              {/*<Confirm title="Confirm" description="Are you sure want to pass QC?">*/}
                                              {/*  {confirm => (*/}
                                              {/*    <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.UpdateQCPass(e, data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId))}>QC Pass</a>*/}
                                              {/*  )}*/}
                                              {/*</Confirm>*/}
                                              <a className="btn btn-info btn-sm btn-pill" onClick={() => this.getStatusDate("Are you sure want to pass QC?", "QC Pass Date", "QP", data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId)}>QC Pass</a>
                                              {" "}
                                              {/*<Confirm title="Confirm" description="Are you sure want to Fail QC?">*/}
                                              {/*  {confirm => (*/}
                                              {/*    <a className="btn btn-warning btn-sm btn-pill" onClick={confirm(e => this.UpdateQCFail(e, data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId))}>QC Fail</a>*/}
                                              {/*  )}*/}
                                              {/*</Confirm>*/}
                                              <a className="btn btn-info btn-sm btn-pill" onClick={() => this.getStatusDate("Are you sure want to fail QC?", "QC Fail Date", "QF", data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId)}>QC Fail</a>

                                            </React.Fragment>
                                            :
                                            (data.currentStatus == "Sample QC Passed" ?
                                              //<Confirm title="Confirm" description="Are you sure want to start analysis?">
                                              //  {confirm => (
                                              //    <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.UpdateStartAnalysis(e, data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId))}>Start Analysis</a>
                                              //  )}
                                              //</Confirm>
                                              <a className="btn btn-info btn-sm btn-pill" onClick={() => this.getStatusDate("Are you sure want to start analysis?", "Analysis Start Date", "SA", data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId)}>Start Analysis</a>

                                              :
                                              (data.currentStatus == "QC Failed" ?
                                                //<Confirm title="Confirm" description="Are you sure want to send new sample request?">
                                                //  {confirm => (
                                                //    <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.UpdateNewRequest(e, data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId))}>Request New Sample</a>
                                                //  )}
                                                //</Confirm>
                                                <a className="btn btn-info btn-sm btn-pill" onClick={() => this.getStatusDate("Are you sure want to send new sample request?", "New Sample Request Date", "NR", data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId)}>Request New Sample</a>

                                                :
                                                (data.currentStatus == "Analysis Started" ?
                                                  //<Confirm title="Confirm" description="Are you sure want to complete analysis?">
                                                  //  {confirm => (
                                                  //    <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.UpdateCompleteAnalysis(e, data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId))}>Complete Analysis</a>
                                                  //  )}
                                                  //</Confirm>
                                                  <a className="btn btn-info btn-sm btn-pill" onClick={() => this.getStatusDate("Are you sure want to complete analysis?", "Analysis Complete Date", "CA", data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId)}>Complete Analysis</a>

                                                  :
                                                  (data.currentStatus == "Analysis Completed" ?
                                                    //<Confirm title="Confirm" description="Are you sure want to pass QC for analysis?">
                                                    //  {confirm => (
                                                    //    <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.UpdateAnalysisQCPass(e, data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId))}>Analysis QC Pass</a>
                                                    //  )}
                                                    //</Confirm>
                                                    <a className="btn btn-info btn-sm btn-pill" onClick={() => this.getStatusDate("Are you sure want to pass QC for analysis?", "Analysis QC Pass Date", "AQP", data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId)}>Analysis QC Pass</a>

                                                    :
                                                    (data.currentStatus == "Analysis QC Passed" ?
                                                      //<Confirm title="Confirm" description="Are you sure that data file is ready?">
                                                      //  {confirm => (
                                                      //    <a className="btn btn-info btn-sm btn-pill" onClick={confirm(e => this.UpdateDataFileReady(e, data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId))}>Data File Ready</a>
                                                      //  )}
                                                      //</Confirm>
                                                      <a className="btn btn-info btn-sm btn-pill" onClick={() => this.getStatusDate("Are you sure that data file is ready?", "Data File Ready Date", "DFR", data.ngsLaboratoryPatientActivityId, data.ngsLaboratoryId, data.sampleTypeId)}>Data File Ready</a>

                                                      :
                                                      (null)
                                                    )
                                                  )
                                                )
                                              )
                                            )
                                          )
                                        )}
                                      </td>
                                    </tr>);
                                  })
                              ) : (
                                <tr>
                                  <td colSpan="3" className="tdCenter">No analysis found...</td></tr>
                              )}
                          </tbody>
                        </Table>

                        {ldata.dataFileUploadStatus ?
                          <React.Fragment>
                            <h5>Data Files</h5>
                            <Table responsive bordered key="tbldatafile">
                              <thead>
                                <tr>
                                  <th>URL</th>
                                  <th>File Credentials</th>
                                  <th>Description</th>
                                  <th>File</th>
                                  {/*<th>Action</th>*/}
                                </tr>
                              </thead>
                              <tbody>
                                {ldata.labDataFileModel.length > 0 ? (
                                  ldata.labDataFileModel
                                    .map((fdata, i) => {
                                      return (<tr key={i}>
                                        <td>{fdata.url ? fdata.url : "-"}</td>
                                        <td>{fdata.username ?
                                          <i className="flaticon2-user"></i> : "-"} &nbsp; {fdata.username} <br />
                                          {fdata.password ?
                                            <i className="flaticon2-lock"></i> : null} &nbsp;{fdata.password}</td>
                                        <td>{fdata.description ? fdata.description : "-"}</td>
                                        <td>
                                          <div className="kt-widget4">
                                            <div className="kt-widget4__item" key={i}>
                                              <Link style={{ "cursor": "pointer", "color": "#1C3A84" }} onClick={e => this.previewToggle(e, fdata.filePath, fdata.fileName)}><i className="fa fa-download"></i></Link>
                                              {/*<a href={fdata.filePath} download>
                                                                                        <i className="flaticon2-download"></i>
                                                                                    </a>*/}
                                            </div>
                                          </div>
                                        </td>
                                        {/*<td>
                                          <Link onClick={e => this.deleteRow(e, fdata.ngsLaboratoryPatientDataFileId)}>
                                            <i className="fa fa-delete"></i>
                                          </Link>
                                        </td>*/}
                                      </tr>);
                                    })
                                ) : (
                                  <tr>
                                    <td colSpan="5" className="tdCenter">No data files found...</td></tr>
                                )}
                              </tbody>
                            </Table>
                          </React.Fragment>
                          : null}

                        <hr />
                      </React.Fragment>
                    )
                  })) : null}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal isOpen={show} className="modal-dialog modal-lg">
          <ModalHeader>
            Analysis Details
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">Title</label>
                <Input className="form-control here" type="text" maxLength="100" tabIndex="1" placeholder="Enter title" name="title" value={title} onChange={this.handleInputChange.bind(this)} />
              </div>
              <label htmlFor="recipient-name" className="form-control-label">Description</label>
              <Input className="form-control here" type="textarea" tabIndex="2" placeholder="Enter description" name="description" value={description} onChange={this.handleInputChange.bind(this)} />
            </div>
            {showErr != "" &&
              <div>
                <span className='modalBody'>{showErr}</span>
              </div>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button color="primary" onClick={this.AddDetail.bind(this)}>
              Add
            </Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={showFile} className="modal-dialog modal-lg">
          <ModalHeader>
            Upload Data File
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">Analysis File</label>
                <Input type="file" name="analysisdatafile" id="File" tabIndex="1" className="form-control" onChange={this.handleFileInputChange.bind(this)} />
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">Date</label>
                <DatePicker
                  selected={analysisdatafileDate}
                  onChange={this.handleFiledDateInputChange.bind(this)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="mm/dd/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  className="form-control"
                  dropdownMode="select"
                  fixedHeight
                />
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">URL</label>
                <Input type="text" name="url" id="url" maxLength="300" tabIndex="2" value={url} className="form-control" onChange={this.handleInputChange.bind(this)} />
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">Username</label>
                <Input type="text" name="username" id="username" tabIndex="3" maxLength="20" value={username} className="form-control" onChange={this.handleInputChange.bind(this)} />
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">Password</label>
                <Input type="password" name="password" id="password" tabIndex="4" maxLength="20" value={password} className="form-control" onChange={this.handleInputChange.bind(this)} />
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">Description</label>
                <Input type="textarea" name="filedescription" id="filedescription" tabIndex="5" value={filedescription} className="form-control" onChange={this.handleInputChange.bind(this)} />
              </div>
            </div>
            {showFileErr != "" &&
              <div>
                <span className='modalBody' style={{ 'color': 'red' }}>{showFileErr}</span>
              </div>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleFileClose}>
              Close
            </Button>
            <Button disabled={loading} color="primary" onClick={this.handleSubmit.bind(this)}>
              Upload
            </Button>
          </ModalFooter>
        </Modal>

        <ConfirmWithInput isOpen={this.state.modal}
          modalBody={this.state.modalBody}
          modalTitle={this.state.modalTitle}
          onRegister={this.register} />

        {/*<MyModal*/}
        {/*  handleModal={this.handleModalClose.bind(this)}*/}
        {/*  //modalAction={this.state.modalAction}*/}
        {/*  isOpen={this.state.modal}*/}
        {/*  modalBody={this.state.modalBody}*/}
        {/*  modalTitle={this.state.modalTitle}*/}
        {/*  modalOptions={this.state.modalOptions}*/}
        {/*/>*/}
        {preview &&
          <>
            <div className='preview-popup'>
              <div className='preview-popup-modal'>
                <div className='preview-popup-header'>
                  {url.split(".").splice(-1)[0] === "pdf" ? null :
                    // <a href={url} download target={`_blank`}>
                    <img src={downloadIcon} style={{ margin: "0 12px", cursor: "pointer" }} alt='download' onClick={e => this.DownloadFile(e, fileUrl, fileName)} />
                    // </a>
                  }
                  <img src={closeIcon} style={{ cursor: "pointer" }} alt='close' onClick={e => this.previewToggle(e, "", "")} />
                </div>
                <iframe src={url} title="previewFile" width="100%" height="90%" />
              </div>
            </div>
          </>
        }
      </div>
    );
  }
}

export default LabActivity;
