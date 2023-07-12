import React, { Component } from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Col,
    FormGroup,
    Form,
    Input,
    Row,
    Label,
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import MyModal from "../../CustomModal/CustomModal";
import { Multiselect } from "multiselect-react-dropdown";
import Moment from "moment";
import { toast } from "react-toastify";
import { browserHistory } from 'react-router-dom'

class emaildata extends Component {
    constructor(props) {
        super(props);

        this.initialState = {
            loading: false,

        };
        this.state = this.initialState;
    }

    loader() {
        if (this.state.loading) {
            return <div className="cover-spin"></div>;
        }
    }

    render() {
        if (localStorage.getItem("AUserToken") == null) {
            return <Redirect to="/login" />;
        }

        const {
            loading,

        } = this.state;

        return (
            <div className="animated fadeIn">
                {this.loader()}
                <Row className="mb-3">
                    <Col xs="11" lg="11">
                        <h5 className="mt-2">
                            <i className="fa fa-align-justify"></i> Email Settings
                        </h5>
                    </Col>
                    {/* <Col xs="1" lg="1">
                        <Link to="/patients/list">
                            <button className="btn btn-primary btn-block">List</button>
                        </Link>
                    </Col> */}
                </Row>
                <Row>
                    <Col xs="12" md="12">
                        <Card>
                            <CardBody>
                                <Form
                                    className="form-horizontal"
                                >
                                    <Row>


                                    </Row>
                                    <Row>
                                        <Col xs="12">

                                            <h5 className="mt-2">Email Settings </h5>

                                            < hr />
                                        </Col>
                                        <Col xs="6">
                                            <FormGroup>
                                                <Label>
                                                    Host
                                                </Label>
                                                <Input
                                                    type="text"
                                                    // className="is-invalid"

                                                    name="firstName"
                                                    placeholder=""
                                                    maxLength="200"
                                                    autoComplete="off"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col xs="6">
                                            <FormGroup>
                                                <Label>Port</Label>

                                                <Input
                                                    type="text"
                                                    name="middleName"
                                                    placeholder=""
                                                    maxLength="200"
                                                    autoComplete="off"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col xs="6">
                                            <FormGroup>
                                                <Label>From Mail</Label>

                                                <Input
                                                    type="text"
                                                    name="middleName"
                                                    placeholder=""
                                                    maxLength="200"
                                                    autoComplete="off"
                                                />
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

            </div>
        );
    }
}

export default emaildata;
