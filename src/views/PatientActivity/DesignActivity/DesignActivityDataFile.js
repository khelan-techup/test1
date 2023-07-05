import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row,
  Table, Button, Input, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import FilePreview from "react-file-preview-latest";
import downloadIcon from '../../../assets/download.svg';
import closeIcon from '../../../assets/x.svg';
import axiosInstance from "../../../common/axiosInstance"

class DesignActivityDataFile extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      openSearch: true,
      patients: [],
      searchString: '',
      slDelete: true,
      //currentPage: 0,
      //currentIndex: 0,
      //pagesCount: 0,
      //pageSize: window.$TotalRecord,
      authError: false,
      error: '',
      modal: false,
      modalTitle: '',
      modalBody: '',
      isView: false,
      isEdit: false,
      pAccessionNo: '',
      breadcrums: [],
      preview: false,
      url: "",
      fileName: ""
    };
    this.state = this.initialState;
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
        //currentPage: 0,
        //currentIndex: 0,
        //pagesCount: 0,
        //pageSize: 10,
        searchString: ''
      }), function () { this.getDesignActivityData(0); });
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
    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleName.toLowerCase().includes("design activity"));
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          this.getDesignActivityData(0);
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
  getDesignActivityData(pageNo) {
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);
    const param = this.props.match.params;
    if (param.id != undefined) {

      let pid = param.id;
      let lid = param.lid;
      const apiroute = window.$APIPath;
      //const url = apiroute + '/api/NGSLaboratoryPatientDataFile/GetByPatientIdPaging';
      //const url = apiroute + '/api/DesignPatientActivityFile/GetDataFileByPatientIdPaging';
      const url = apiroute + '/api/DesignPatientActivityFile/GetDataFileByPatientId';

      let data = JSON.stringify({
        isDeleted: this.state.slDelete,
        searchString: this.state.searchString,
        Id: parseInt(pid),
        //pageNo: pageNo,
        //totalNo: window.$TotalRecord,
      });

      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(result => {
          if (result.data.flag) {
            // console.log(result.data.outdata);
            debugger;
            this.CreateBreadcrums(result.data.outdata.accessionNo, 0);
            this.setState({
              //pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              patients: result.data.outdata.patientDataFileData,
              pAccessionNo: result.data.outdata.accessionNo,
              loading: false
            })
          }
          else {
            this.CreateBreadcrums(result.data.outdata.accessionNo, 0);
            this.setState({
              //pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              patients: [],
              pAccessionNo: result.data.outdata.accessionNo,
              loading: false
            })
            // console.log(result.data.message);
          }
        })
        .catch(error => {
          // console.log(error);
          this.setState({ authError: true, error: error, loading: false });
        });
    }
  }

  ////pagination
  //handleClick(e, index, currIndex) {
  //  e.preventDefault();
  //  var pgcount = this.state.pagesCount - 1;
  //  var pgCurr = (index >= pgcount ? pgcount : index);
  //  this.setState({
  //    currentPage: pgCurr,
  //    currentIndex: currIndex
  //  }, function () { this.getDesignActivityData(pgCurr); });
  //}

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
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      this.setState({ loading: false });
    }).catch(error => {
      // console.log(error);
      this.setState({ loading: false });
    });

  }

  //file preview
  previewToggle(e, path, name) {
    this.setState({
      preview: !this.state.preview,
      url: window.$FileUrl + path,
      fileName: name
    })
  }

  //SyncedData
  SyncedData(e) {
    //alert(filename);
    this.setState({ loading: true });

    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    let userId = (userToken.userId == null ? 0 : userToken.userId);

    const param = this.props.match.params;
    let pid = param.id;

    const apiroute = window.$APIPath;
    let url = apiroute + '/api/DesignPatientActivityFile/SyncDataFile?id=' + pid + '&userId=' + userId + '';

    axiosInstance.get(url, {
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
          }), function () { this.getDesignActivityData(0); });
          toast.success(result.data.message)
          //this.setState({
          //  employees: curremployees.filter(employee => employee.org_Id !== id)
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

  //get data folder wise
  getDesignActivityDataById(e, id, name) {
    //alert(filename);
    this.setState({ loading: true });

    const param = this.props.match.params;
    let pid = param.id;

    const apiroute = window.$APIPath;
    let url = apiroute + '/api/DesignPatientActivityFile/GetDataFileByPatientIdAndId?id=' + id + '&pid=' + pid + '';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          //console.log(result.data.outdata);
          this.CreateBreadcrums(name, id);

          this.setState({
            //pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
            patients: result.data.outdata.patientDataFileData,
            pAccessionNo: result.data.outdata.accessionNo,
            loading: false
          })
        }
        else {

          this.CreateBreadcrums(name, id);

          this.setState({
            //pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
            patients: [],
            pAccessionNo: result.data.outdata.accessionNo,
            loading: false
          })
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ authError: true, error: error, loading: false });
      });
  }

  //get data folder wise
  getByIdForBread(e, id, index) {
    //alert(filename);
    this.setState({ loading: true });

    if (id == 0) {
      this.setState({ breadcrums: [] });
      this.getDesignActivityData(0);
    } else {
      const param = this.props.match.params;
      let pid = param.id;

      const apiroute = window.$APIPath;
      let url = apiroute + '/api/DesignPatientActivityFile/GetDataFileByPatientIdAndId?id=' + id + '&pid=' + pid + '';

      axiosInstance.get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(result => {
          if (result.data.flag) {
            //console.log(result.data.outdata);

            this.RemoveBreadcrums();

            this.setState({
              //pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              patients: result.data.outdata.patientDataFileData,
              pAccessionNo: result.data.outdata.accessionNo,
              loading: false
            })
          }
          else {

            this.RemoveBreadcrums();

            this.setState({
              //pagesCount: Math.ceil(result.data.totalRecord / window.$TotalRecord),
              patients: [],
              pAccessionNo: result.data.outdata.accessionNo,
              loading: false
            })
            // console.log(result.data.message);
          }
        })
        .catch(error => {
          // console.log(error);
          this.setState({ authError: true, error: error, loading: false });
        });
    }

  }

  CreateBreadcrums(name, id) {
    debugger;
    let tmpArray = this.state.breadcrums;
    if (tmpArray.length > 0) {
      let tempbd = {
        "index": 0,
        "name": name,
        "id": id,
      };

      tmpArray.push(tempbd);
      this.setState({ breadcrums: tmpArray });

    } else {
      let tempbd = {
        "index": tmpArray.length - 1,
        "name": name,
        "id": id,
      };

      tmpArray.push(tempbd);

      debugger;
      this.setState({ breadcrums: tmpArray });
    }

  }

  RemoveBreadcrums(index) {
    let tmpArray = this.state.breadcrums;
    tmpArray.length = index;
    this.setState({ breadcrums: tmpArray });
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

    const { loading, patients, //currentPage, currentIndex, pagesCount, pageSize,
      authError, error, pAccessionNo, breadcrums, preview, url, fileName } = this.state;
    return (
      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Analysis Data Files</h5>
            <h5 className="mt-2">{pAccessionNo != "" && pAccessionNo != null ? "(" + pAccessionNo.replace(/-/g, "") + ")" : ""}</h5>
          </Col>
          <Col xs="1" lg="1">
            {this.state.isEdit ?
              <button onClick={e => this.SyncedData(e)} className="btn btn-primary btn-block">Sync</button>
              : null}
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col xs="12">
                    <ol class="breadcrumb" style={{ "backgroundColor": "unset", "marginBottom": "0px", "borderBottom": "unset" }}>
                      <li class="breadcrumb-item">
                        <Link to={"/patientactivity/designactivity"}>Home</Link>
                      </li>
                      {/* {breadcrums.length > 0 ? (
                        breadcrums
                          .map((data, i) => {
                            return (
                              i == (breadcrums.length - 1) ?
                                <li class="active breadcrumb-item" aria-current="page">
                                  {data.name.replace(/-/g, "")}
                                </li>
                                :
                                <li class="breadcrumb-item">
                                  <a href="#" onClick={e => this.getByIdForBread(e, data.id, data.index)}>{data.name.replace(/-/g, "")}</a>
                                </li>
                            )
                          })) : null} */}
                    </ol>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {authError ? <p>{error.message}</p> : null}
                <Table responsive bordered key="tblpatients">
                  <thead>
                    <tr>
                      {/*<th>Accession No</th>
                      <th>Patient Name</th>
                      <th>Sample<br />Ref No</th>
                      <th>Laboratory Name</th>*/}
                      <th>File Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // !loading ? (
                      //employees.map(function (data,i) {
                      patients.length > 0 ? (
                        patients
                          //.slice(
                          //  currentPage * pageSize,
                          //  (currentPage + 1) * pageSize
                          //)
                          .map((data, i) => {
                            return (<tr key={i}>
                              {/*<td><b>{data.patientAccessionNo == "" || data.patientAccessionNo == null ? "Not Avaialable" : data.patientAccessionNo}</b></td>
                              <td>{data.patientName} </td>
                              <td>{data.sampleTypeName}<br /> {data.patientRefNo} </td>
                              <td>{data.ngsLabName}</td>*/}
                              <td>
                                {!data.isFolder ?
                                  data.fileName
                                  :
                                  <span className="btn btn-outline-warning disabled" style={{ "padding": "5px" }}>{data.fileName}</span>
                                }</td>
                              <td>
                                {!data.isFolder ?
                                  <a style={{ "cursor": "pointer", color: "#000000" }} className="btn btn-info btn-sm btn-pill" onClick={e => this.previewToggle(e, data.filePath, data.fileName)}>Preview</a>
                                  :
                                  <a style={{ "cursor": "pointer", color: "#FFFFFF" }} className="btn btn-primary btn-sm btn-pill" onClick={e => this.getDesignActivityDataById(e, data.patientDataFileBucketId, data.fileName)}>View</a>
                                }
                              </td>
                            </tr>);
                          })
                      ) : (
                        <tr>
                          <td colSpan="2" className="tdCenter">No data files...</td></tr>
                        // )) : (
                        // <tr>
                        //   <td colSpan="2" className="tdCenter">Loading...</td></tr>
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
        {preview &&
          <>
            <div className='preview-popup'>
              <div className='preview-popup-modal'>
                <div className='preview-popup-header'>
                  {url.split(".").splice(-1)[0] === "pdf" ? null :
                    // <a href={url} download target={`_blank`}>
                    <img src={downloadIcon} style={{ margin: "0 12px", cursor: "pointer" }} alt='download' onClick={e => this.DownloadFile(e, url, fileName)} />
                    // </a>
                  }
                  <img src={closeIcon} style={{ cursor: "pointer" }} alt='close' onClick={e => this.previewToggle(e, "", "")} />
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
      </div>
    );
  }
}

export default DesignActivityDataFile;
