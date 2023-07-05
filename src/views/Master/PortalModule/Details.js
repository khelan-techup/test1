import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, FormGroup, Form, Input, Row, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import axiosInstance from "../../../common/axiosInstance"

class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      moduleId: 0,
      moduleName: "",
      displayOrder: "",
      moduleLink: "",
      parentId: "",
      modules: [],
      errors: {
        moduleName: '',
        displayOrder: ''
      },
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: ''
      //modalAction: '',
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
    if (this.state.redirect) {
      this.props.history.push('/master/portalmodule/list');
    }
  }

  //get detail
  componentDidMount() {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PortalModule/GetAll';

    let data = JSON.stringify({
      isDeleted: true,
      searchString: '',
      id: 0
    });

    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          this.setState(() => ({ modules: result.data.outdata }), function () {
            const param = this.props.match.params;

            if (param.id != undefined) {
              this.getData(param.id);
            } else {
              this.setState({ loading: false });
            }
          });
        }
        else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
      });
  }

  //get detail(for update)
  getData = (id) => {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_PortalModule/GetById?id=' + id + '';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState({
            moduleId: rData.moduleId, moduleName: rData.moduleName,
            displayOrder: rData.displayOrder, moduleLink: rData.moduleLink, parentId: rData.parentId, loading: false
          });
          //console.log(this.state);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
      });
  }

  //form reset button click
  onResetClick(e) {
    e.preventDefault();
    this.setState({
      loading: false,
      moduleName: "",
      displayOrder: "",
      moduleLink: "",
      parentId: "",
      errors: {
        moduleName: '',
        displayOrder: ''
      },
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: ''
    });
  }

  //input handle input change and validation
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    let errors = this.state.errors;

    switch (name) {
      case 'moduleName':
        errors.moduleName = (!value) ? 'This field is required.' : ''
        break;
      case 'displayOrder':
        errors.displayOrder = (!value) ? 'This field is required.' : ''
        break;
      default:
        //(!value) ? '' :'This field is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => {
      //console.log(errors)
    })
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.moduleName == undefined || this.state.moduleName == '') {
      errors.moduleName = 'This field is required.';
    }

    if (this.state.displayOrder == undefined || this.state.displayOrder == '') {
      errors.displayOrder = 'This field is required.';
    }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

  //form submit
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    //console.log('Submit');
    //console.log(this.state);
    let url = "";

    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      if (this.state.moduleId == 0) {
        url = apiroute + '/api/BE_PortalModule/Save';
      }
      else {
        url = apiroute + '/api/BE_PortalModule/Update';
      }

      let data = JSON.stringify({
        moduleId: this.state.moduleId,
        moduleName: this.state.moduleName,
        displayOrder: parseInt(this.state.displayOrder),
        moduleLink: this.state.moduleLink,
        parentId: parseInt(this.state.parentId == "" ? 0 : this.state.parentId),
        createdBy: (userToken.userId == null ? 0 : userToken.userId)
      })

      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(result => {
          this.setState({ loading: false });

          if (result.data.flag) {
            // this.setState({
            //   modal: !this.state.modal,
            //   modalTitle: 'Success',
            //   modalBody: result.data.message
            // });
            toast.success(result.data.message)
            this.setState({ redirect: true });
            this.props.history.push('/master/portalmodule/list');
          }
          else {
            // this.setState({
            //   modal: !this.state.modal,
            //   modalTitle: 'Error',
            //   modalBody: result.data.message
            // });
            toast.error(result.data.message)
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
          //this.setState({ authError: true, error: error });
        });
    }
    else {
      this.setState({ loading: false });
    }
  }

  //renderRedirect() {
  //  if (this.state.redirect) {
  //    return <Redirect from="/" to="/master/role/list" />
  //  }
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

    const { loading, modules, moduleId, moduleName, displayOrder, moduleLink, parentId, errors } = this.state;

    return (

      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Portal Module Detail</h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/master/portalmodule/list">
              <button className="btn btn-primary btn-block">List</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            {/* {!loading ? (*/}
            <Card>
              <CardBody>
                <Form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                  <Row>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Parent Module </Label>
                        <Input type="select" name="parentId" value={parentId} onChange={this.handleInputChange.bind(this)}>
                          <option value="">Select Parent Module</option>
                          {modules
                            .map((data, i) => {
                              return (<option key={i} value={data.moduleId}>{data.moduleName}</option>);
                            })}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col xs="6"></Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Module Name <span className="requiredField">*</span></Label>
                        <Input type="text" className={errors.moduleName ? "is-invalid" : "is-valid"} name="moduleName" value={moduleName} onChange={this.handleInputChange.bind(this)} placeholder="Enter module name" />
                        <span className='error'>{errors.moduleName}</span>
                      </FormGroup>
                    </Col>
                    <Col xs="6"></Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Display Order <span className="requiredField">*</span></Label>
                        <Input type="number" className={errors.displayOrder ? "is-invalid" : "is-valid"} name="displayOrder" value={displayOrder} onChange={this.handleInputChange.bind(this)} placeholder="Enter display order" />
                        <span className='error'>{errors.displayOrder}</span>
                      </FormGroup>
                    </Col>
                    <Col xs="6"></Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Module Link </Label>
                        <Input type="text" name="moduleLink" value={moduleLink} onChange={this.handleInputChange.bind(this)} placeholder="Enter module link" maxLength="300" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input type="hidden" name="moduleId" value={moduleId} />
                        <Button type="submit" disabled={loading} color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>{" "}
                        <Button type="reset" color="danger" onClick={this.onResetClick.bind(this)}><i className="fa fa-ban"></i> Reset</Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
            {/*) : (
                <div className="animated fadeIn pt-1 text-center">Loading...</div>
              )}*/}
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

export default Details;
