import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, FormGroup, Form, Input, Row, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import axiosInstance from "./../../../common/axiosInstance"
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react'
import { BE_DiseaseCategory_GetAllDRP, BE_DiseaseCategory_GetSubAllDRP, BE_Disease_GetById, BE_Disease_Save, BE_Disease_Update } from '../../../common/allApiEndPoints';
class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      isEdit: false,
      isView: false,
      diseaseId: 0,
      diseaseName: "",
      diseaseName2: "",
      EfoDiseasCode: "",
      EfoDiseasCode2: "",
      diseaseCode: "",
      diseaseCode2: "",
      category: "",
      category2: "",
      description: "",
      description2: "",
      diseasecategories: [],
      diseaseCategoryId: 0,
      diseaseCategoryId2: 0,
      accessionDigit: 0,
      diseasesubCat: [],
      errors: {
        diseaseName: '',
        EfoDiseasCode: '',
        diseaseCode: '',
        category: '',
        description: '',
        diseaseCategoryId: ''
      },
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      isOther: false,
      selected: "",
      diseaseNameforReportUse: "",
      diseaseNameforReportUse2: ""
      //modalAction: '',

    };
    this.state = this.initialState;
  }

  getDisease() {
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_DiseaseCategory/GetAllDRP'
    const url = apiroute + BE_DiseaseCategory_GetAllDRP
    axiosInstance.get(url,).then((res) => {

      if (res.data?.flag) {
        let disease = res.data.outdata

        this.setState({
          diseasecategories: disease,
          loading: false
        },)
      }
    })
  }
  getsubDrpData(id, diseaseCategoryId) {
    debugger
    const apiroute = window.$APIPath;
    // console.log(id);
    if (id != "") {
      // const url = apiroute + "/api/BE_DiseaseCategory/GetSubAllDRP?id=" + id + "";
      const url = apiroute + BE_DiseaseCategory_GetSubAllDRP(id)

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
                // selected: diseaseCategoryId || String(result.data.outdata[0].diseaseCategoryId)
                selected: diseaseCategoryId || (this.state.diseaseId == 0 ? result.data.outdata.map((d) => d.diseaseCategoryId).toString() : String(result.data.outdata[0].diseaseCategoryId))
              }), function () {

                // alert("selected",this.state.selected)
                // return this.getListData(0);
              })

            } else {

              // this.getListData(0)
            }
            // console.log(this.state.diseasesubCat[0].diseaseCategoryId);
          } else {
            // alert("bccc")
            // this.setState({ loading: false });
          }
        })
        .catch((error) => {
          // console.log(error);
          this.setState({ loading: false });
        });
    }
  }
  dsubhandleChange = (e) => {
    const target = e.target;
    const value = target.value;

    // console.log(value);
    this.setState(
      () => ({
        loading: true,
        currentPage: 0,
        currentIndex: 0,
        pagesCount: 0,
        //pageSize: 10,
        diseaseName: value,
        diseaseCategoryId: value,
        diseaseCatId: value
      }),

    );
  };
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
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    var rights = userToken.roleModule;
    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleId.toString() == "8");
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
    // const url = apiroute + "/api/BE_DiseaseCategory/GetAllDRP"
    const url = apiroute + BE_DiseaseCategory_GetAllDRP

    // let data = JSON.stringify({
    //   isDeleted: true,
    //   searchString: '',
    //   id: 0
    // });

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })

      .then(result => {
        if (result.data.flag) {
          let dcat = result.data.outdata
          // let dcat = result.data.outdata.filter(category => category.diseaseCategoryName.toLowerCase() != 'complete health score'
          //   && category.diseaseCategoryName.toLowerCase() != 'autoimmunity'
          //   && category.diseaseCategoryName.toLowerCase() != 'neurodegenerative');
          this.setState(() => ({
            diseasecategories: dcat,

          }), function () {

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

  //get detail(for update)
  getData = (id) => {
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Disease/GetById?id=' + id + '';
    const url = apiroute + BE_Disease_GetById(id)

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          var rData = result.data.outdata;
          // console.log("eData:::", rData);
          this.setState({
            diseaseId: rData.diseaseId,
            diseaseName: rData.diseaseName,
            diseaseName2: rData.diseaseName,
            diseaseNameforReportUse: rData.diseaseDisplayName,
            diseaseNameforReportUse2: rData.diseaseDisplayName,
            diseaseCode: rData.diseaseCode,
            diseaseCode2: rData.diseaseCode,
            category: rData.category,
            category2: rData.category,
            accessionDigit: rData.accessionDigit,
            description: rData.description,
            description2: rData.description,
            EfoDiseasCode: rData.efoDiseasCode,
            EfoDiseasCode2: rData.efoDiseasCode,
            loading: false,
            diseaseCategoryId: rData.parentDiseaseCategoryId != 0 ? rData.parentDiseaseCategoryId : rData.diseaseCategoryId,
            diseaseCategoryId2: rData.diseaseCategoryId,
            selected: rData.diseaseCategoryId,
            parentDiseaseCategoryId: rData.parentDiseaseCategoryId != 0 ? rData.parentDiseaseCategoryId : rData.diseaseCategoryId,
            // isOther: rData.isOther
          }, function () {
            // alert(rData.parentDiseaseCategoryId != 0 ? rData.parentDiseaseCategoryId : rData.diseaseCategoryId)
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
    this.setState({
      loading: false,
      diseaseName: this.state.diseaseName2,
      diseaseNameforReportUse: this.state.diseaseNameforReportUse2,
      diseaseCode: this.state.diseaseCode2 || '',
      EfoDiseasCode: this.state.EfoDiseasCode2,
      category: this.state.category2,
      description: this.state.description2,
      accessionDigit: 0,
      diseaseCategoryId: isNaN(parseInt(this.state.parentDiseaseCategoryId)) ? 0 : parseInt(this.state.parentDiseaseCategoryId),
      // diseaseCategoryId: "",
      errors: {
        diseaseName: '',
        EfoDiseasCode: '',
        diseaseCode: '',
        category: "",
        description: '',
        diseaseCategoryId: ''
      }, loading: true,
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      diseasesubCat: []
    }, function () {
      const param = this.props.match.params;
      if (param.id != undefined) {
        this.setState({ loading: false });
        this.getData(param.id);
      } else {
        this.getsubDrpData(Number(this.state.diseaseCategoryId))
        this.setState({ loading: false });
      }
    });
  }

  //input handle input change and validation
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // alert(name)

    let errors = this.state.errors;

    if (name == "diseaseCategoryId") {
      // debugger;

      if (value != '') {

        this.getsubDrpData(value);
        let diseaseCatAccessionDigit = this.state.diseasecategories.filter(ml => ml.diseaseCategoryId == value);
        // console.log("diseaseCatAccessionDigit", diseaseCatAccessionDigit)
        if (diseaseCatAccessionDigit.length > 0) {
          this.setState({
            diseaseCategoryId: value,
            selected: '', diseasesubCat: [],
            accessionDigit: diseaseCatAccessionDigit[0].accessionDigit,
            category: diseaseCatAccessionDigit[0].diseaseCategoryName,
          });
        } else {
          this.setState({
            accessionDigit: 0,
            category: "",
            diseaseCategoryId: 0,
          });
        }
      } else {
        this.setState({
          accessionDigit: 0,
          category: "",
          diseaseCategoryId: 0,
          diseasesubCat: [],
          selected: ""

        });
      }
    } else if (name == 'EfoDiseasCode') {

      this.setState({
        [name]: value,
        diseaseCode: value,
      })
      let err = this.state.errors;
      err.diseaseCode = ""

    } else if (name == "diseaseName") {
      this.setState({
        [name]: value,
        diseaseNameforReportUse: value,
      })
      let err = this.state.errors;
      err.diseaseName = ""
    }
    else {
      this.setState({
        [name]: value
      });
    }


    switch (name) {
      case 'diseaseName':
        errors.diseaseName = (!value) ? 'This field is required.' : ''
        break;
      case 'diseaseCategoryId':
        errors.diseaseCategoryId = (!value || NaN) ? 'Please select category.' : ''
        break;
      case 'diseaseCode':
        errors.diseaseCode = (!value) ? 'This field is required.' : ''
        break;
      case 'EfoDiseasCode':
        errors.EfoDiseasCode = (!value) ? 'This field is required.' : ''
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

    if (this.state.diseaseCategoryId == undefined || this.state.diseaseCategoryId == '' || this.state.diseaseCategoryId == 0) {
      errors.diseaseCategoryId = 'Please select category.';
    }

    if (this.state.EfoDiseasCode == undefined || this.state.EfoDiseasCode == '') {
      errors.EfoDiseasCode = 'This field is required.';
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
    // debugger;
    e.preventDefault();
    this.setState({ loading: true });
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    //console.log('Submit');
    //console.log(this.state);
    let url = "";

    if (this.validateForm(this.state.errors)) {
      const apiroute = window.$APIPath;
      if (this.state.diseaseId == 0) {
        // url = apiroute + '/api/BE_Disease/Save';
        url = apiroute + BE_Disease_Save
      }
      else {
        // url = apiroute + '/api/BE_Disease/Update';
        url = apiroute + BE_Disease_Update
      }

      if (this.state.accessionDigit == 0) {
        let diseaseCatAccessionDigit = this.state.diseasecategories.filter(ml => ml.diseaseCategoryId == this.state.diseaseCategoryId);
        if (diseaseCatAccessionDigit.length > 0) {
          this.setState({
            accessionDigit: diseaseCatAccessionDigit[0].accessionDigit
          });
        }
      }

      let data = JSON.stringify({
        diseaseId: this.state.diseaseId,
        diseaseName: this.state.diseaseName,
        EfoDiseasCode: this.state.EfoDiseasCode,
        diseaseCode: this.state.diseaseCode,
        category: this.state.category,
        description: this.state.description,
        accessionDigit: this.state.accessionDigit,
        diseaseCategoryId: this.state?.selected ? (this.state.selected).toString() : (this.state.diseaseCategoryId).toString(),
        createdBy: (userToken.userId == null ? 0 : userToken.userId),
        createdByFlag: 'A',
        isOther: false,
        diseaseDisplayName: this.state.diseaseNameforReportUse

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

    const { loading, diseaseId, diseaseName, EfoDiseasCode, diseasecategories, diseaseCode, category, diseaseCategoryId, description, errors } = this.state;

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
                        <Label>Disease Name <span className="requiredField">*</span></Label>
                        <Input type="text" autocomplete="off" className={errors.diseaseName ? "is-invalid" : "is-valid"} name="diseaseName" value={diseaseName} onChange={this.handleInputChange.bind(this)} placeholder="Enter disease name" tabIndex="2" maxLength="100" />
                        {<span className='error'>{errors.diseaseName}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Disease Name </Label>
                        <span className="mx-lg-2"
                          data-toggle="tooltip" data-placement="top" title="This disease name will only be used in patient's report, Please make it more readable by adding space."

                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                          </svg>
                        </span>
                        <GrammarlyEditorPlugin clientId="client_Mygif7MAqrmjKVPfFwatyC">

                          <Input type="text" autocomplete="off" name="diseaseNameforReportUse" value={this.state.diseaseNameforReportUse} onChange={this.handleInputChange.bind(this)} placeholder="Enter disease name" tabIndex="2" maxLength="100" />
                        </GrammarlyEditorPlugin>
                        {/* {<span className='error'>{errors.diseaseName}</span>} */}
                      </FormGroup>
                    </Col>
                    {/* <Col xs="6"></Col> */}
                    <Col xs="6">
                      <FormGroup>
                        <Label>EFO Disease Code <span className="requiredField">*</span></Label>
                        <Input type="text" autocomplete="off" className={errors.EfoDiseasCode ? "is-invalid" : "is-valid"} name="EfoDiseasCode" value={EfoDiseasCode} onChange={this.handleInputChange.bind(this)} placeholder="Enter EFO disease code" tabIndex="3" maxLength="50" />
                        {<span className='error'>{errors.EfoDiseasCode}</span>}
                      </FormGroup>

                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Disease Code <span className="requiredField">*</span></Label>
                        <Input type="text" autocomplete="off" name="diseaseCode" value={diseaseCode} onChange={this.handleInputChange.bind(this)} placeholder="Enter disease code" tabIndex="5" maxLength="50" />

                        {/* <Input type="text" className={errors.diseaseCode ? "is-invalid" : "is-valid"} name="diseaseCode" value={diseaseCode} onChange={this.handleInputChange.bind(this)} placeholder="Enter disease code" tabIndex="1" maxLength="100" /> */}
                        {<span className='error'>{errors.diseaseCode}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>
                    {/* <Col xs="6"></Col> */}
                    <Col xs="6">
                      <FormGroup>
                        <Label>Category <span className="requiredField">*</span></Label>
                        <Input className={errors.diseaseCategoryId ? "error" : ""} type="select" name="diseaseCategoryId" tabIndex="4" value={diseaseCategoryId} onChange={this.handleInputChange.bind(this)}>
                          <option value="">Select category</option>
                          {diseasecategories
                            .map((data, i) => {

                              return (<option key={i} selected={this.state.diseaseCategoryId == data.diseaseCategoryId} value={data.diseaseCategoryId}>{data.diseaseCategoryName}</option>);
                            })}
                        </Input>
                        {<span className='error'>{errors.diseaseCategoryId}</span>}
                        {/* <Input type="textarea" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" /> */}
                      </FormGroup>
                    </Col>
                    <Col xs="6">



                      <FormGroup style={{ display: this.state?.diseasesubCat?.length > 0 ? "block" : "none" }}>
                        <Label>Sub Category </Label>
                        <Input type="select" name="subdiseaseCategoryId" onChange={(e) => {

                          this.setState({
                            selected: e.target.value,
                          })

                        }}>{
                            diseaseId == 0 ? <option value={this.state.diseasesubCat.map((d) => d.diseaseCategoryId).toString()} selected={this.state?.selected == this.state.diseasesubCat.map((d) => d.diseaseCategoryId).toString()}>All</option> : null
                          }

                          {/* {
                            console.log("this.state.diseasesubCat,", this.state.diseasesubCat)
                          } */}
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
                    {/* <Col xs="6"></Col> */}

                    {/* <Col xs="6"></Col> */}
                    <Col xs="12">
                      <FormGroup>
                        <Label>Description </Label>
                        <Input type="textarea" autocomplete="off" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" tabIndex="6" maxLength="300" rows="10" />
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input type="hidden" name="diseaseId" value={diseaseId} />
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
      </div >
    );
  }
}

export default Details;
