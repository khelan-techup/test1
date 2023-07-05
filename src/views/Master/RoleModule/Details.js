import React, { Component } from 'react';
import { Collapse, Fade, Button, Card, CardBody, CardFooter, Table, Col, FormGroup, Form, Input, Row, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { toast } from 'react-toastify';
import axiosInstance from "./../../../common/axiosInstance"
import { BE_RoleModule_GetDropdown, BE_RoleModule_GetDropdownEdit, BE_RoleModule_Save, BE_RoleModule_Update } from '../../../common/allApiEndPoints';

class Details extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      loading: true,
      isEdit: false,
      isView: false,
      moduleId: 0,
      roleId: 0,
      roleId2: [],
      roles: [],
      roles_2: [],
      roleModules: [],
      roleModules_2: [],
      roleModulesForReset: [],
      RoleModuleId: 0,
      errors: {
        roleId: ''
      },
      disableSelect: false,
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      flag: 'I',
      collapseId: 0,
      param2: '',
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
      this.props.history.push('/master/rolemodule/list');
    }
  }

  apiCall() {
    // console.log("Call")
    const apiroute = window.$APIPath;
    const param = this.props.match.params;
    // console.log("paramIDDD::",param.id)
    if (!param.id) {
      this.setState({
        param2: undefined
      })
    } else {
      this.setState({
        param2: param.id
      })
    }
    let url = "";
    if (param.id != undefined) {
      this.setState({ flag: 'U', roleId: param.id, roleId2: param.id, disableSelect: true });
      // url = apiroute + '/api/BE_RoleModule/GetDropdownEdit?id=' + param.id;
      url = apiroute + BE_RoleModule_GetDropdownEdit(param.id)
    }
    else {
      // url = apiroute + '/api/BE_RoleModule/GetDropdown';
      url = apiroute + BE_RoleModule_GetDropdown
    }


    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        // console.log("original", result.data.outdata);
        if (result.data.flag) {
          let roles = result.data.outdata.roleData.filter(role => role.roleName.toLowerCase() != "neo admin");
          this.setState(() => ({
            roles: roles,
            roles_2: roles,
            roleModules: result.data.outdata.roleModuleData,
            roleModules_2: result.data.outdata.roleModuleData,
            loading: false
          }))
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

  //get detail
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    var rights = userToken.roleModule;
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleId.toString() == "10");
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
    this.apiCall()

  }


  //form reset button click
  onResetClick(e) {
    this.setState({
      roleId: '',
      errors: {
        roleId: '',
      }
    })
    this.apiCall()

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
      case 'roleId':
        errors.roleId = (!value) ? 'This field is required.' : ''
        break;
      default:
        //(!value) ? '' :'This field is required.'
        break;
    }

    this.setState({ errors, [name]: value }, () => {
      //console.log(errors)
    })
  }


  //input handle input change checkbox
  handleInputChangeChkView(event, id, pid) {
    let data = this.state.roleModules;
    // console.log("data::::", data)
    this.setState({
      roleModules: []
    });
    if (pid == id) {
      const elementsIndex = data.findIndex(element => element.moduleId == id)
      //alert(elementsIndex);
      data[elementsIndex].isViewed = (event.target.checked ? true : false);
      //console.log(data);
      data[elementsIndex].beChildRoleModuleModel = data[elementsIndex].beChildRoleModuleModel.map(el => (
        { ...el, isViewed: (event.target.checked ? true : false) }
      ));
    } else {
      const parentIndex = data.findIndex(element => element.moduleId == id);
      // console.log("parentIndex",parentIndex)
      const elementsIndex = data[parentIndex].beChildRoleModuleModel.findIndex(element => element.moduleId == pid)
      // console.log("elementsIndex",elementsIndex)
      data[parentIndex].beChildRoleModuleModel[elementsIndex].isViewed = (event.target.checked ? true : false);
    }
    this.setState({
      roleModules: data
    });
  }

  handleInputChangeChkEdit(event, id, pid) {
    let data = this.state.roleModules;
    this.setState({
      roleModules: []
    });
    if (pid == id) {
      const elementsIndex = data.findIndex(element => element.moduleId == id)
      //alert(elementsIndex);
      data[elementsIndex].isEdited = (event.target.checked ? true : false);
      //console.log(data);
      data[elementsIndex].beChildRoleModuleModel = data[elementsIndex].beChildRoleModuleModel.map(el => (
        { ...el, isEdited: (event.target.checked ? true : false) }
      ));
    } else {
      const parentIndex = data.findIndex(element => element.moduleId == id);
      // console.log("parentIndex", parentIndex)

      const elementsIndex = data[parentIndex].beChildRoleModuleModel.findIndex(element => element.moduleId == pid)
      // console.log("elementsIndex", elementsIndex)

      data[parentIndex].beChildRoleModuleModel[elementsIndex].isEdited = (event.target.checked ? true : false);
    }
    this.setState({
      roleModules: data
    });
  }

  //form validation
  validateForm = (errors) => {
    let valid = true;

    if (this.state.roleId == undefined || this.state.roleId == '') {
      errors.roleId = 'This field is required.';
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

      let data = this.state.roleModules;

      if (this.state.flag == 'I') {
        // url = apiroute + '/api/BE_RoleModule/Save';
        url = apiroute + BE_RoleModule_Save
        for (let i = 0; i < data.length; i++) {
          data[i].roleId = parseInt(this.state.roleId);
          data[i].roleModuleId = parseInt(this.state.RoleModuleId);
          if (data[i].moduleName === "Dashboard") {
            data[i].isViewed = true
          }
        }
      }
      else {
        // url = apiroute + '/api/BE_RoleModule/Update';
        url = apiroute + BE_RoleModule_Update
        for (let i = 0; i < data.length; i++) {
          data[i].roleId = parseInt(this.state.roleId);
          //data[i].roleModuleId = parseInt(this.state.RoleModuleId);
          if (data[i].moduleName === "Dashboard") {
            data[i].isViewed = true
          }
        }
      }

      //console.log(data);
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
            this.props.history.push('/master/rolemodule/list');
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
  setCollapse(cid) {
    let currentCid = this.state.collapseId;
    if (currentCid == cid) {
      this.setState({ collapseId: -1 });
    } else {
      this.setState({ collapseId: cid });
    }
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

    const { loading, roleModules, moduleId, roleId, roles, errors } = this.state;

    return (

      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Role Module Mapping Detail</h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/master/rolemodule/list">
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
                        <Label>Role </Label>
                        <Input type="select" name="roleId" disabled={this.state.disableSelect} className={errors.roleId ? "is-invalid" : "is-valid"} value={roleId} onChange={this.handleInputChange.bind(this)}>
                          <option disabled={!this.state.param2 ? (false) : (true)} value="">Select Role</option>
                          {roles
                            .map((data, i) => {
                              return (<option key={i}
                                disabled={this.state.param2 == undefined ? (false) : (this.state.param2 == data.roleId ? (false) : true)}
                                value={data.roleId}>{data.roleName}</option>);
                            })}
                        </Input>
                        {<span className='error'>{errors.roleId}</span>}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Table responsive bordered key="tblparent">
                    <thead>
                      <tr>
                        <th style={{ "width": "20%" }}>Module Name</th>
                        <th style={{ "width": "10%", "textAlign": "center" }}>Is View</th>
                        <th style={{ "width": "10%", "textAlign": "center" }}>Is Edit</th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* {console.log("roleModules::", roleModules)} */}
                      {roleModules.length > 0 ?
                        roleModules
                          .map((data, i1) => {
                            return (
                              <React.Fragment key={i1}>
                                <tr onClick={() => this.setCollapse(i1)} style={{ "backgroundColor": "#1C3A84", "color": "white" }} key={i1}>
                                  <td style={{ "width": "20%" }}><b>{data.moduleName}</b>
                                    {
                                      (data.beChildRoleModuleModel?.length > 0) ? (<span className='ml-2'><i className="fa fa-arrow-down" aria-hidden="true"></i></span>) : ''
                                    }
                                  </td>

                                  <td style={{ "width": "10%", "textAlign": "center" }}>
                                    {data.isViewed ?
                                      <Input type="checkbox" id="inline-checkbox1" disabled={data.moduleName === 'Dashboard'} name="IsViewed" checked onChange={e => this.handleInputChangeChkView(e, data.moduleId, data.moduleId)} />
                                      :
                                      <Input type="checkbox" id="inline-checkbox1" name="IsViewed" disabled={data.moduleName === 'Dashboard'} checked={data.moduleName === 'Dashboard'} onChange={e => this.handleInputChangeChkView(e, data.moduleId, data.moduleId)} />
                                    }
                                  </td>
                                  <td style={{ "width": "10%", "textAlign": "center" }}>
                                    {data.isEdited ?
                                      <Input type="checkbox" id="inline-checkbox1" name="IsEdited" checked onChange={e => this.handleInputChangeChkEdit(e, data.moduleId, data.moduleId)} />
                                      :
                                      <Input type="checkbox" id="inline-checkbox1" name="IsEdited" onChange={e => this.handleInputChangeChkEdit(e, data.moduleId, data.moduleId)} />
                                    }
                                  </td>
                                </tr>
                                {/* <Fade
                                            timeout={this.state.timeout}
                                            in={this.state.fadeIn}
                                          >
                                            <Collapse
                                              isOpen={i == this.state.collapseId}
                                              id="collapseExample"
                                            > */}
                                <tr >

                                  <td colSpan="3">
                                    {data.beChildRoleModuleModel?.length > 0 ? (
                                      data.beChildRoleModuleModel
                                        .map((datac, i) => {
                                          return (
                                            <Fade
                                              timeout={this.state.timeout}
                                              in={this.state.fadeIn}
                                              key={i}
                                            >
                                              <Collapse
                                                isOpen={i1 == this.state.collapseId}
                                                id="collapseExample"
                                              >

                                                <Table style={{ "marginBottom": "0" }} responsive key="tblChild">
                                                  <tr key={i}>
                                                    <td style={{ "width": "20%" }}><b>{datac.moduleName}</b></td>
                                                    <td style={{ "width": "10%", "textAlign": "center" }}>
                                                      {datac.isViewed ?
                                                        <Input type="checkbox" id="inline-checkbox1" name="IsViewed" checked onChange={e => this.handleInputChangeChkView(e, data.moduleId, datac.moduleId)} />
                                                        :
                                                        <Input type="checkbox" id="inline-checkbox1" name="IsViewed" onChange={e => this.handleInputChangeChkView(e, data.moduleId, datac.moduleId)} />
                                                      }
                                                    </td>
                                                    <td style={{ "width": "10%", "textAlign": "center" }}>
                                                      {datac.isEdited ?
                                                        <Input type="checkbox" id="inline-checkbox1" name="IsEdited" checked onChange={e => this.handleInputChangeChkEdit(e, data.moduleId, datac.moduleId)} />
                                                        :
                                                        <Input type="checkbox" id="inline-checkbox1" name="IsEdited" onChange={e => this.handleInputChangeChkEdit(e, data.moduleId, datac.moduleId)} />
                                                      }
                                                    </td>
                                                  </tr>
                                                </Table>
                                              </Collapse>
                                            </Fade>

                                          )
                                        })) : null}
                                  </td>


                                </tr>

                                {/* </Collapse>
                                </Fade> */}

                              </React.Fragment>
                            )
                          }) : null}
                      {
                              /*data.children.length > 0 ? (
                                      data.children
                                        .map((datac, j) => {
                                          return (
                                            <tr className="collapse">
                                                  <td style={{ "width": "5%" }}><b>{datac.moduleName}</b></td>
                                                  <td style={{ "width": "5%", "textAlign": "center" }}>
                                                    {datac.isViewed ?
                                                      <Input type="checkbox" id="inline-checkbox1" name="IsViewed" checked onChange={e => this.handleInputChangeChkView(e, datac.moduleId)} />
                                                      :
                                                      <Input type="checkbox" id="inline-checkbox1" name="IsViewed" onChange={e => this.handleInputChangeChkView(e, datac.moduleId)} />
                                                    }
                                                  </td>
                                                  <td style={{ "width": "5%", "textAlign": "center" }}>
                                                    {datac.isEdited ?
                                                      <Input type="checkbox" id="inline-checkbox1" name="IsEdited" checked onChange={e => this.handleInputChangeChkEdit(e, datac.moduleId)} />
                                                      :
                                                      <Input type="checkbox" id="inline-checkbox1" name="IsEdited" onChange={e => this.handleInputChangeChkEdit(e, datac.moduleId)} />
                                                    }
                                                  </td>
                                                </tr>
                                          )
                                        })) : ("...")}
                              </React.Fragment>*/}

                      { /*
                      //<Row>
                              //  <Col xs="3">
                              //    <div role="checkbox"
                              //      className="group_checkbox"
                              //      aria-checked="false"
                              //      tabindex="0">
                              //      <b>{data.moduleName}</b>
                              //    </div>
                              //  </Col>
                              //  <Col md="9">
                              //    <FormGroup check inline>
                              //      {data.isViewed ?
                              //        <Input className="form-check-input" type="checkbox" id="inline-checkbox1" name="IsViewed" checked onChange={e => this.handleInputChangeChkView(e, data.moduleId)} />
                              //        :
                              //        <Input className="form-check-input" type="checkbox" id="inline-checkbox1" name="IsViewed" onChange={e => this.handleInputChangeChkView(e, data.moduleId)} />
                              //      }
                              //      <Label className="form-check-label" check htmlFor="inline-checkbox1">Is View</Label>
                              //    </FormGroup>
                              //    <FormGroup check inline>
                              //      {data.isEdited ?
                              //        <Input className="form-check-input" type="checkbox" id="inline-checkbox1" name="IsEdited" checked onChange={e => this.handleInputChangeChkEdit(e, data.moduleId)} />
                              //        :
                              //        <Input className="form-check-input" type="checkbox" id="inline-checkbox1" name="IsEdited" onChange={e => this.handleInputChangeChkEdit(e, data.moduleId)} />
                              //      }
                              //      <Label className="form-check-label" check htmlFor="inline-checkbox2">Is Edit</Label>
                              //    </FormGroup>
                              //  </Col>
                              //</Row>*/}

                    </tbody>

                  </Table>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input type="hidden" name="moduleId" value={moduleId} />
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