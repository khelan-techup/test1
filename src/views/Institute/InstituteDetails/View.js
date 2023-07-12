import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, FormGroup, Table, Input, Row, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { Multiselect } from 'multiselect-react-dropdown';
import axiosInstance from "./../../../common/axiosInstance"

class View extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      instituteId: 0,
      basicInfo: "",
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      //options: [{name: 'Srigar', id: 1},{name: 'Sam', id: 2}]
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
      this.props.history.push('/institutes/list');
    }
  }

  //get detail
  componentDidMount() {
    const param = this.props.match.params;

    if (param.id != undefined) {
      this.getData(param.id);
    }
    else {
      this.setState({ loading: false });
    }
  }

  //get detail(for update)
  getData = (id) => {
    const apiroute = window.$APIPath;
    const url = apiroute + '/api/BE_Institute/GetById?id=' + id + '';

    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        // console.log(result);
        if (result.data.flag) {
          var rData = result.data.outdata;
          this.setState({
            instituteId: rData.instituteId,
            basicInfo: rData,
            loading: false
          });
          // console.log(this.state);
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        // console.log(error);
        this.setState({ loading: false });
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

    const { loading, instituteId,
      basicInfo,
      errors } = this.state;

    return (

      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Institution Details</h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/institutes/list">
              <button className="btn btn-primary btn-block">Institution</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardBody>
                <Row>
                  {/*<Col xs="6">
                      <FormGroup>
                        <Label>Accession No </Label>
                        <Input type="text" className="txtReadOnly" disabled name="accessionNo" value={basicInfo.accessionNo} />
                      </FormGroup>
                    </Col>*/}
                  <Col xs="6">
                    <FormGroup>
                      <Label>Name </Label>
                      <Input type="text" className="txtReadOnly" disabled name="instituteName" value={basicInfo.instituteName != null ? basicInfo.instituteName : ""} />
                    </FormGroup>
                  </Col>
                  <Col xs="6">
                    <FormGroup>
                      <Label>Website </Label>
                      <Input type="text" className="txtReadOnly" disabled name="dob" value={basicInfo.website == null ? "" : basicInfo.website} />
                    </FormGroup>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col xs="12">
                    <h5 className="mt-2">Institution Personal</h5>
                    <Table responsive bordered key="tblinstitutes">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Fax</th>
                          <th>Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {basicInfo != null && basicInfo != "" ? (
                          <tr >
                            <td>{basicInfo.email}</td>
                            <td>{basicInfo.mobile} <br />{basicInfo.phoneNumber}</td>
                            <td>{basicInfo.fax}</td>
                            <td>{basicInfo.address != null ? basicInfo.address + " - " + basicInfo.postalCode : ""}</td>
                          </tr>
                        ) : (
                          <tr>
                            <td colSpan="4" className="tdCenter">No records...</td></tr>
                        )
                        }
                      </tbody>
                    </Table>
                  </Col>
                </Row>
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
      </div >
    );
  }
}

export default View;
