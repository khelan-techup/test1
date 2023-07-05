import React, { Component, lazy, Suspense } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import {
  Button, Card, CardBody, CardHeader, Col, Row, Table, Input, Modal, ModalBody, ModalHeader,
  ModalFooter
} from 'reactstrap';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import axiosInstance from "../../../common/axiosInstance"

class ManuActivity extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      patientactivities: [],
      manufacturingActivityId: "",
      patientId: "",
      patientAccessionId: 0,
      manufacturerId: "",
      patientAccessionNo: "",
      title: "",
      description: "",
      modal: false,
      modalBody: '',
      modalTitle: '',
      show: false,
      showErr: '',
      isView: false,
      isEdit: false
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
    const url = apiroute + '/api/BE_LabManuActivity/GetManuActivityByPatientId?id=' + pid;

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
            patientactivities: result.data.outdata.patientanalysisdata,
            patientAccessionNo: result.data.outdata.accessionNo,
            loading: false
          })
        }
        else {
          // console.log(result.data.message);
          this.setState({
            patientId: result.data.outdata.patientId,
            patientactivities: [],
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
      manufacturingActivityId: "",
      manufacturerId: "",
      show: false
    });
  }

  handleShow = (aid, mid) => {
    this.setState({
      manufacturingActivityId: aid,
      manufacturerId: mid,
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

      const apiroute = window.$APIPath;
      url = apiroute + '/api/ManufacturerActivity/UpdateDetail';
      let menufactureactivityId = this.state.manufacturingActivityId;

      let data = JSON.stringify({
        manufacturerId: parseInt(this.state.manufacturerId),
        title: this.state.title,
        description: this.state.description,
        patientId: parseInt(this.state.patientId),
        patientAccessionId: parseInt(this.state.patientAccessionId),
        manufacturingActivityId: parseInt(menufactureactivityId),
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
              manufacturingActivityId: '',
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

  //update status
  UpdateReadyToMfg(e, id, mid) {
    e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/ManufacturerActivity/UpdateManufacturerActivityReadyToMfg';

    let data = JSON.stringify({
      manufacturerId: parseInt(mid),
      ReadyToMfg: true,
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      manufacturingActivityId: parseInt(id),
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

  UpdateMfgStart(e, id, mid) {
    e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/ManufacturerActivity/UpdateManufacturerActivityMfgStarted';

    let data = JSON.stringify({
      manufacturerId: parseInt(mid),
      MfgStarted: true,
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      manufacturingActivityId: parseInt(id),
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

  UpdateMfgQCPass(e, id, mid) {
    e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/ManufacturerActivity/UpdateManufacturerActivityMfgQcPassed';

    let data = JSON.stringify({
      manufacturerId: parseInt(mid),
      MfgQcPassed: true,
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      manufacturingActivityId: parseInt(id),
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

  UpdateMfgComplete(e, id, mid) {
    e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/ManufacturerActivity/UpdateManufacturerActivityMfgCompleted';

    let data = JSON.stringify({
      manufacturerId: parseInt(mid),
      MfgCompleted: true,
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      manufacturingActivityId: parseInt(id),
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

  UpdateMfgShipped(e, id, mid) {
    e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/ManufacturerActivity/UpdateManufacturerActivityMfgShipped';

    let data = JSON.stringify({
      manufacturerId: parseInt(mid),
      MfgShipped: true,
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      manufacturingActivityId: parseInt(id),
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

  UpdateMfgDelivered(e, id, mid) {
    e.preventDefault();
    this.setState({ loading: true });
    let url = "";

    const apiroute = window.$APIPath;
    url = apiroute + '/api/ManufacturerActivity/UpdateManufacturerActivityMfgDelivered';

    let data = JSON.stringify({
      manufacturerId: parseInt(mid),
      MfgDelivered: true,
      patientId: parseInt(this.state.patientId),
      patientAccessionId: parseInt(this.state.patientAccessionId),
      manufacturingActivityId: parseInt(id),
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
      patientactivities, patientAccessionNo, title, description, modal,
      modalBody, modalTitle, show, showErr } = this.state;
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
                <Table responsive bordered key="tblpatients">
                  <thead>
                    <tr>
                      <th>Analysis Description</th>
                      <th>Change Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // !loading ? (
                      //standards.map(function (data,i) {
                      patientactivities.length > 0 ? (
                        patientactivities
                          .map((data, i) => {
                            return (<tr key={i}>
                              <td>
                                {data.title != null ?
                                  <React.Fragment>
                                    <span>{data.title}</span>
                                    <br />
                                    <span>{data.description}</span>
                                  </React.Fragment>
                                  :
                                  <a className="btn btn-info btn-sm btn-pill" onClick={() => this.handleShow(data.manufacturingActivityId, data.manufacturerId)}>Add</a>
                                }

                              </td>
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
                                {(data.currentStatus == "Design delivered" ?
                                  <a className="btn btn-outline-info btn-pd-mt" onClick={e => this.UpdateReadyToMfg(e, data.manufacturingActivityId, data.manufacturerId)}>Ready to Manufacture</a>
                                  :
                                  (data.currentStatus == "Ready to Manufacture" ?
                                    <React.Fragment>
                                      <a className="btn btn-outline-info btn-pd-mt" onClick={e => this.UpdateMfgStart(e, data.manufacturingActivityId, data.manufacturerId)}>Manufacturing Started</a>
                                    </React.Fragment>
                                    :
                                    (data.currentStatus == "Manufacturing Started" ?
                                      <a className="btn btn-outline-info btn-pd-mt" onClick={e => this.UpdateMfgQCPass(e, data.manufacturingActivityId, data.manufacturerId)}>Manufacturing QC Passed</a>
                                      :
                                      (data.currentStatus == "Manufacturing QC Passed" ?
                                        <a className="btn btn-outline-info btn-pd-mt" onClick={e => this.UpdateMfgComplete(e, data.manufacturingActivityId, data.manufacturerId)}>Manufacturing Completed</a>
                                        :
                                        (data.currentStatus == "Manufacturing Completed" ?
                                          <a className="btn btn-outline-info btn-pd-mt" onClick={e => this.UpdateMfgShipped(e, data.manufacturingActivityId, data.manufacturerId)}>Shipped</a>
                                          :
                                          (data.currentStatus == "Shipped" ?
                                            <a className="btn btn-outline-info btn-pd-mt" onClick={e => this.UpdateMfgDelivered(e, data.manufacturingActivityId, data.manufacturerId)}>Delivered</a>
                                            :
                                            (null)
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
                        // )) : (
                        // <tr>
                        //   <td colSpan="3" className="tdCenter">Loading...</td></tr>
                      )}
                  </tbody>
                </Table>
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

export default ManuActivity;
