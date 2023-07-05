import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, FormGroup, Form, Input, Row, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import axiosInstance from "./../../../common/axiosInstance"

class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      isEdit: false,
      isView: false,
      sampleTypeId: 0,
      sampleTypeId2: 0,
      sampleTypeName: "",
      sampleTypeName2: "",
      sampleTypeDescription: "",
      sampleTypeDescription2: "",
      diseasecategories: [],
      diseaseCategoryId: 0,
      diseaseCategoryId2: 0,
      errors: {
        sampleTypeName: '',
        sampleTypeDescription: '',
        diseaseCategoryId: ''
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
      this.props.history.push('/master/sampletype/list');
    }
  }

  getsubDrpData(id, selected) {
    this.setState({ loading: true })
    const apiroute = window.$APIPath;
    // console.log(id);
    if (id != "") {
      const url = apiroute + "/api/BE_DiseaseCategory/GetSubAllDRP?id=" + id + "";

      axiosInstance
        .get(url, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then((result) => {


          if (result.data.flag) {
            if (result.data.outdata.length != 0) {
              this.setState(() => ({
                loading: false,
                currentPage: 0,
                currentIndex: 0,
                pagesCount: 0,
                diseasesubCat: result.data.outdata,
                // diseaseName: String(result.data.outdata[0].diseaseCategoryId),
                // diseaseCategoryId: String(result.data.outdata[0].diseaseCategoryId),
                selected: selected || String(result.data.outdata[0].diseaseCategoryId)
              }), function () {

                // alert("aaaa")
                // return this.getListData(0);
              })

            } else {
              // this.getListData(0)
              this.setState({ loading: false })
            }
            // console.log(this.state.diseasesubCat[0].diseaseCategoryId);
          } else {
            this.setState({ loading: false })
            // alert("bccc")
            // this.setState({ loading: false });
          }
        })
        .catch((error) => {
          // console.log(error);
          this.setState({ loading: false });
        });
    } else {
      this.setState({
        loading: false
      })
    }
  }
  onMount = () => {
    this.setState({ loading: true })
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    var rights = userToken.roleModule;
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleId.toString() == "27");
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          // this.getListData(0);
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
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_DiseaseCategory/GetAll';
    const url = apiroute + '/api/BE_DiseaseCategory/GetAllDRP';


    let data = JSON.stringify({
      isDeleted: true,
      searchString: '',
      id: 0
    });

    // axios.post(url, data, {
    //   headers: {
    //     'Content-Type': 'application/json; charset=utf-8'
    //   }
    // })
    axiosInstance.get(url)

      .then(result => {
        if (result.data.flag) {
          this.setState(() => ({ diseasecategories: result.data.outdata }), function () {

            // console.log(this.state.diseasecategories);
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
  //get detail
  componentDidMount() {
    this.onMount()
  }

  //get detail(for update)
  getData = (id) => {
    debugger
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_SampleType/GetById?id=' + id + '';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          var rData = result.data.outdata;
          // console.log(rData);
          this.setState({
            sampleTypeId: rData.sampleTypeId,
            sampleTypeName: rData.sampleTypeName,
            sampleTypeName2: rData.sampleTypeName,
            sampleTypeDescription: rData.sampleTypeDescription,
            sampleTypeDescription2: rData.sampleTypeDescription,
            loading: false,
            diseaseCategoryId: rData.parentDiseaseCategoryId != 0 ? rData.parentDiseaseCategoryId : rData.diseaseCategoryId,
            diseaseCategoryId2: rData.diseaseCategoryId,
            selected: rData.diseaseCategoryId,
          }, function () {

            if (rData.ParentDiseaseCategoryId != 0) {
              // alert(rData.parentDiseaseCategoryId)
              this.getsubDrpData(rData.parentDiseaseCategoryId, rData.diseaseCategoryId)
            }

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
    // console.log("diseaseCAtId::", this.state.diseaseCategoryId)
    // console.log("diseaseCategoryId2::", this.state.diseaseCategoryId2)
    this.setState({
      loading: false,
      sampleTypeName: this.state.sampleTypeName2,
      sampleTypeDescription: this.state.sampleTypeDescription2,
      diseaseCategoryId: parseInt(this.state.diseaseCategoryId2),
      errors: {
        sampleTypeName: '',
        sampleTypeDescription: '',
        diseaseCategoryId: ''
      },
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      diseasesubCat: []
    }, function () {
      this.onMount()
      // this.getsubDrpData(Number(this.state.diseaseCategoryId))
    });
  }

  //input handle input change and validation
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let errors = this.state.errors;

    this.setState({
      [name]: value
    });
    if ("diseaseCategoryId" == name) {
      if (!value == '') {
        this.getsubDrpData(value);
        let diseaseCatAccessionDigit = this.state.diseasecategories.filter(ml => ml.diseaseCategoryId == value);
        if (diseaseCatAccessionDigit.length > 0) {
          this.setState({
            diseaseCategoryId: value,
            selected: '', diseasesubCat: [],
          });
        } else {
          this.setState({
            diseaseCategoryId: 0
          });
        }
      } else {
        this.setState({
          diseaseCategoryId: 0
        });
      }
    }


    switch (name) {
      case 'sampleTypeName':
        errors.sampleTypeName = (!value) ? 'Please enter sample type name.' : ''
        break;
      case 'diseaseCategoryId':
        errors.diseaseCategoryId = (!value) ? 'Please select category.' : ''
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

    if (this.state.sampleTypeName == undefined || this.state.sampleTypeName == '') {
      errors.sampleTypeName = 'Please enter sample type name.';
    }

    if (this.state.diseaseCategoryId == undefined || this.state.diseaseCategoryId == '' || this.state.diseaseCategoryId == 0) {
      errors.diseaseCategoryId = 'Please select category.';
    }

    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }

  //form submit
  handleSubmit(e) {
    // debugger;
    e.preventDefault();
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    //console.log('Submit');
    //console.log(this.state);
    let url = "";

    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      if (this.state.sampleTypeId == 0) {
        url = apiroute + '/api/BE_SampleType/Save';
      }
      else {
        url = apiroute + '/api/BE_SampleType/Update';
      }

      let data = JSON.stringify({
        sampleTypeId: this.state.sampleTypeId,
        sampleTypeName: this.state.sampleTypeName,
        sampleTypeDescription: this.state.sampleTypeDescription,
        // diseaseCategoryId: parseInt(this.state.diseaseCategoryId),
        diseaseCategoryId: this.state?.selected ? Number(this.state.selected) : parseInt(this.state.diseaseCategoryId),
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
            this.props.history.push('/master/sampletype/list');
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

    const { loading, sampleTypeId, sampleTypeName, diseasecategories, diseaseCategoryId, sampleTypeDescription, errors } = this.state;

    return (

      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Sample Type Detail</h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/master/sampletype/list">
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
                        <Label>Sample Type Name <span className="requiredField">*</span></Label>
                        <Input autoComplete="off" type="text" className={errors.sampleTypeName ? "is-invalid" : "is-valid"} name="sampleTypeName" value={sampleTypeName} onChange={this.handleInputChange.bind(this)} placeholder="Enter sample type name" tabIndex="1" maxLength="100" />
                        {<span className='error'>{errors.sampleTypeName}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6"></Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Category <span className="requiredField">*</span></Label>
                        <Input className={errors.diseaseCategoryId ? "error" : ""} type="select" name="diseaseCategoryId" tabIndex="4" value={diseaseCategoryId} onChange={this.handleInputChange.bind(this)}>
                          <option value={""}>Select category</option>
                          {diseasecategories
                            .map((data, i) => {

                              return (<option key={i} selected={this.state.diseaseCategoryId == data.diseaseCategoryId} value={data.diseaseCategoryId}>{data.diseaseCategoryName}</option>);
                            })}
                        </Input>
                        {<span className='error'>{errors.diseaseCategoryId}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup style={{ display: this.state?.diseasesubCat?.length > 0 ? "block" : "none" }}>
                        <Label>Sub Category </Label>
                        <Input type="select" name="subdiseaseCategoryId" onChange={(e) => {

                          this.setState({
                            selected: e.target.value,
                          })

                        }}>
                          {this.state?.diseasesubCat?.map?.((data, i) => {
                            return (
                              <option key={i} value={data.diseaseCategoryId}
                                selected={this.state?.selected == data.diseaseCategoryId}
                              >{data.diseaseCategoryName}</option>
                            );
                          })}
                        </Input>
                      </FormGroup>
                    </Col>


                    <Col xs="6">
                      {/* <FormGroup>
                        <Label>Category <span className="requiredField">*</span></Label>
                        <Input className={errors.diseaseCategoryId ? "error" : ""} type="select" name="diseaseCategoryId" tabIndex="2" value={diseaseCategoryId} onChange={this.handleInputChange.bind(this)}>
                          <option value="">Select category</option>
                          {diseasecategories
                            .map((data, i) => {

                              return (<option key={i} value={data.diseaseCategoryId}>{data.diseaseCategoryName + " (" + data.productName + ")"}</option>);
                            })}
                        </Input>
                        {<span className='error'>{errors.diseaseCategoryId}</span>}
                      </FormGroup> */}
                    </Col>
                    <Col xs="6"></Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Description </Label>
                        <Input autoComplete="off" type="textarea" name="sampleTypeDescription" value={sampleTypeDescription} onChange={this.handleInputChange.bind(this)} placeholder="Enter sample type description" tabIndex="3" maxLength="300" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input type="hidden" name="sampleTypeId" value={sampleTypeId} />
                        {
                          this.state.isEdit ? <>
                            <Button type="submit" disabled={loading} color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button><span>{" "}</span>
                          </> : null
                        }
                        {
                          this.state.isEdit ? <>
                            <Button type="reset" color="danger" onClick={this.onResetClick.bind(this)}><i className="fa fa-ban"></i> Reset</Button>
                          </> : null
                        }
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
