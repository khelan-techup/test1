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
      roleId: 0,
      roleName: "",
      roleName2: "",
      description: "",
      description2: "",
      errors: {
        roleName: ''
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
      this.props.history.push('/master/role/list');
    }
  }

  //get detail
  componentDidMount() {
    const param = this.props.match.params;
    // console.log(param);
    var userToken = JSON.parse(localStorage.getItem('AUserToken'));
    var rights = userToken.roleModule;
    //console.log(rights);
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleId.toString() == "2");
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

    if (param.id != undefined) {

      this.getData(param.id);
    } else {
      this.setState({ loading: false });
    }
  }

  //get detail(for update)
  getData = (id) => {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_Role/GetById?id=' + id + '';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          var rData = result.data.outdata;
          // console.log('rData:::::', rData);
          this.setState({
            roleId: rData.roleId, roleName: rData.roleName,
            description: rData.description, loading: false, roleName2: rData.roleName, description2: rData.description
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
      roleName: this.state.roleName2,
      description: this.state.description2,
      errors: {
        roleName: ''
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
    const validAlphaNoRegex = RegExp(/^[a-zA-Z \b]+$/);

    switch (name) {
      case 'roleName':
        errors.roleName = (!value)
          ? "This field is required."
          : validAlphaNoRegex.test(value)
            ? ""
            : "Only alphabet allowed.";
        this.setState({ roleName: value.replace(/[^a-zA-Z \b]+$/, "") });
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

    if (this.state.roleName == undefined || this.state.roleName == '') {
      errors.roleName = 'This field is required.';
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
      if (this.state.roleId == 0) {
        url = apiroute + '/api/BE_Role/Save';
      }
      else {
        url = apiroute + '/api/BE_Role/Update';
      }
      // alert(this.state.roleId)
      let data = JSON.stringify({
        roleId: this.state.roleId,
        roleName: this.state.roleName,
        description: this.state.description,
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
            this.props.history.push('/master/role/list');
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

  loader() {
    if (this.state.loading) {
      return <div className="cover-spin">
      </div>;
    }
  }

  //renderRedirect() {
  //  if (this.state.redirect) {
  //    return <Redirect from="/" to="/master/role/list" />
  //  }
  //}

  render() {
    if (localStorage.getItem('AUserToken') == null) {
      return <Redirect to="/login" />
    }

    const { loading, roleId, roleName, description, errors } = this.state;

    return (

      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Role Detail</h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/master/role/list">
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
                        <Label>Role Name <span className="requiredField">*</span></Label>
                        <Input type="text" autocomplete="off" tabIndex="1" className={errors.roleName ? "is-invalid" : "is-valid"} name="roleName" value={roleName} onChange={this.handleInputChange.bind(this)} placeholder="Enter role name" maxLength="50" />
                        {errors.roleName.length > 0 && <span className='error'>{errors.roleName}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6"></Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Description </Label>
                        <Input type="textarea" tabIndex="2" autocomplete="off" name="description" value={description} onChange={this.handleInputChange.bind(this)} placeholder="Enter description" maxLength="300" />
                      </FormGroup>
                    </Col>
                    <Col xs="6"></Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input type="hidden" name="roleId" value={roleId} />
                        {
                          this.state.isEdit ? <>
                            <Button type="submit" disabled={loading} color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button><span>{" "}</span>
                          </>
                            : null
                        }
                        {
                          this.state.isEdit ? <>
                            <Button type="reset" color="danger" onClick={this.onResetClick.bind(this)}><i className="fa fa-ban"></i> Reset</Button>
                          </> : null}
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
