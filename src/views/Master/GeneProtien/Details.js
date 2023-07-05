import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, FormGroup, Form, Input, Row, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import axiosInstance from "../../../common/axiosInstance"

class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      diseaseId: 0,
      diseaseName: "",
      diseaseCode: "",
      category: "",
      description: "",
      diseasecategories: [],
      accessionDigit: 0,
      errors: {
        diseaseName: '',
        diseaseCode: '',
        category: '',
        description: ''
      },
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',

      geneName: "",
      description: "",
      age: "",
      gender: "",
      dob: "",
      country: "",
      diseaseName: "",

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
      this.props.history.push('/master/diseases/list');
    }
  }

  //get detail
  componentDidMount() {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_DiseaseCategory/GetAll';

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
          this.setState(() => ({ diseasecategories: result.data.outdata }), function () {
            const param = this.props.match.params;
            if (param.id != undefined) {
              this.getData(param.id);
            } else {
              this.setState({ loading: false });
            }
          });
        } else {
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
    const url = apiroute + '/api/BE_Disease/GetById?id=' + id + '';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState({
            diseaseId: rData.diseaseId, diseaseName: rData.diseaseName,
            diseaseCode: rData.diseaseCode, category: rData.category, accessionDigit: rData.accessionDigit,
            description: rData.description, loading: false
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
      diseaseName: "",
      diseaseCode: "",
      category: "",
      description: "",
      accessionDigit: 0,
      errors: {
        diseaseName: '',
        diseaseCode: '',
        category: "",
        description: ''
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

    if (name == "category") {
      if (value) {
        let diseaseCatAccessionDigit = this.state.diseasecategories.filter(ml => ml.diseaseCategoryName === value);
        this.setState({
          accessionDigit: diseaseCatAccessionDigit[0].accessionDigit
        });
      } else {
        this.setState({
          accessionDigit: 0
        });
      }
    }

    switch (name) {
      case 'diseaseName':
        errors.diseaseName = (!value) ? 'This field is required.' : ''
        break;
      case 'category':
        errors.category = (!value) ? 'Please select category.' : ''
        break;
      case 'diseaseCode':
        errors.diseaseCode = (!value) ? 'This field is required.' : ''
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

    if (this.state.diseaseName == undefined || this.state.diseaseName == '') {
      errors.diseaseName = 'This field is required.';
    }

    if (this.state.diseaseCode == undefined || this.state.diseaseCode == '') {
      errors.diseaseCode = 'This field is required.';
    }

    if (this.state.category == undefined || this.state.category == '') {
      errors.category = 'Please select category.';
    }

    //if (this.state.description == undefined || this.state.description == '') {
    //  errors.description = 'This field is required.';
    //}

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
      if (this.state.diseaseId == 0) {
        url = apiroute + '/api/BE_Disease/Save';
      }
      else {
        url = apiroute + '/api/BE_Disease/Update';
      }

      if (this.state.accessionDigit == 0) {
        let diseaseCatAccessionDigit = this.state.diseasecategories.filter(ml => ml.diseaseCategoryName === this.state.category);
        this.setState({
          accessionDigit: diseaseCatAccessionDigit[0].accessionDigit
        });
      }

      let data = JSON.stringify({
        diseaseId: this.state.diseaseId,
        diseaseName: this.state.diseaseName,
        diseaseCode: this.state.diseaseCode,
        category: this.state.category,
        description: this.state.description,
        accessionDigit: this.state.accessionDigit,
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
            this.props.history.push('/master/diseases/list');
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

    const { loading, diseaseId, diseaseName, diseasecategories, diseaseCode, category, description, errors } = this.state;

    return (

      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Disease Detail</h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/master/diseases/list">
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
                        <Label>Disease Code <span className="requiredField">*</span></Label>
                        <Input type="text" className={errors.diseaseCode ? "is-invalid" : "is-valid"} name="diseaseCode" value={diseaseCode} onChange={this.handleInputChange.bind(this)} placeholder="Enter disease code" tabIndex="1" maxLength="100" />
                        {<span className='error'>{errors.diseaseCode}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>
                    <Col xs="6"></Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Disease Name <span className="requiredField">*</span></Label>
                        <Input type="text" className={errors.diseaseName ? "is-invalid" : "is-valid"} name="diseaseName" value={diseaseName} onChange={this.handleInputChange.bind(this)} placeholder="Enter disease name" tabIndex="2" maxLength="100" />
                        {<span className='error'>{errors.diseaseName}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6"></Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Category <span className="requiredField">*</span></Label>
                        <Input className={errors.category ? "error" : ""} type="select" name="category" value={category} onChange={this.handleInputChange.bind(this)}>
                          <option value="">Select category</option>
                          {diseasecategories
                            .map((data, i) => {
                              return (<option key={i} value={data.diseaseCategoryName}>{data.diseaseCategoryName}</option>);
                            })}
                        </Input>
                        {<span className='error'>{errors.category}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>
                    <Col xs="6"></Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Description </Label>
                        <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" tabIndex="4" maxLength="300" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input type="hidden" name="diseaseId" value={diseaseId} />
                        <Button type="submit" disabled={loading} color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>{" "}
                        <Button type="reset" color="danger" onClick={this.onResetClick.bind(this)}><i className="fa fa-ban"></i> Reset</Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
            {/* ) : (
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
