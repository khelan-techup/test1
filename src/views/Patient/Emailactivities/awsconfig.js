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

class awsconfig extends Component {
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
                            <i className="fa fa-align-justify"></i> AWS Configurations
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
                                        <Col xs="12">

                                            <h5 className="mt-2">AWS Configurations </h5>

                                            < hr />
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

export default awsconfig;
