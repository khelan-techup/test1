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
import { toast } from "react-toastify";
import { browserHistory } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-custom-build'
class emailcontent extends Component {
    constructor(props) {
        super(props);

        this.initialState = {
            loading: false,
            inputTextforNotes: ""

        };
        this.state = this.initialState;
    }


    // getFeedItems = (queryText) => {
    //     // console.log(this.state.organizationusersforNotes, "gggggggggggggggggggggggggggg")
    //     let organs = this.state.organizationusersforNotes
    //     let dataorg = 



    //         organs.map(data => {

    //         return { id: `@${data.fullName}`, userId: data.userId, name: data.roleName, link: '' }


    //     })
    //     // console.log([dataorg], "jhhhhhhhhhhhhhhhhhhhh")

    //     const items = [...dataorg]

    //     // const items = [
    //     //   { id: '@abc', userId: '1', name: 'Barney Stinson', link: 'https://www.imdb.com/title/tt0460649/characters/nm0000439' },
    //     //   { id: '@test', userId: '2', name: 'Lily Aldrin', link: 'https://www.imdb.com/title/tt0460649/characters/nm0004989' },
    //     //   { id: '@practitioner', userId: '4', name: 'Marshall Eriksen', link: 'https://www.imdb.com/title/tt0460649/characters/nm0781981' },
    //     //   { id: '@lab', userId: '3', name: 'Marry Ann Lewis', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
    //     //   { id: '@report', userId: '5', name: 'Robin Scherbatsky', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
    //     //   { id: '@something', userId: '6', name: 'Ted Mosby', link: 'https://www.imdb.com/title/tt0460649/characters/nm1102140' }
    //     // ];
    //     // As an example of an asynchronous action, return a promise
    //     // that resolves after a 100ms timeout.
    //     // This can be a server request or any sort of delayed action.
    //     return new Promise(resolve => {
    //         // alert(queryText)
    //         setTimeout(() => {
    //             const itemsToDisplay = items
    //                 // Filter out the full list of all items to only those matching the query text.
    //                 .filter(isItemMatching)
    //                 // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
    //                 .slice(0, 10);
    //             // console.log({ itemsToDisplay })
    //             resolve(itemsToDisplay);
    //         }, 100);
    //     });

    //     // Filtering function - it uses the `name` and `username` properties of an item to find a match.
    //     function isItemMatching(item) {
    //         // Make the search case-insensitive.
    //         const searchString = queryText.toLowerCase();

    //         // Include an item in the search results if the name or username includes the current user input.
    //         return (
    //             item.name.toLowerCase().includes(searchString) ||
    //             item.id.toLowerCase().includes(searchString)
    //         );
    //     }
    // }





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
                            <i className="fa fa-align-justify"></i> Email Content
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

                                            <h5 className="mt-2">Email Content </h5>

                                            < hr />
                                        </Col>
                                        <Col xs="6">
                                            <FormGroup>
                                                <Label>
                                                    EmailType
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
                                                <Label>Repeat Conditions</Label>

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
                                                <Label>Email Content</Label>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    name="inputTextforNotes"
                                                    // cols="89"
                                                    style={{ width: "auto" }}

                                                    // rows="7"
                                                    config={{
                                                        placeholder: "Write Something ....",
                                                        mention: {
                                                            feeds: [
                                                                {
                                                                    marker: '@',
                                                                    feed: ['@accessionNo', '@patientName']
                                                                }]
                                                        },

                                                    }}
                                                    // maxLength="500"
                                                    onChange={
                                                        (event, editor) => {
                                                            const data = editor?.getData();
                                                            this.setState({ inputTextforNotes: data });


                                                            // this.handleNoteInput.bind(this)
                                                        }
                                                    }
                                                    data={this.state.inputTextforNotes || ""}
                                                ></CKEditor>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="6">
                                            <FormGroup>
                                                <Label>Receiver(Individual or Group)</Label>

                                                <div className=" custom-control custom-radio">
                                                    <Input className="custom-control-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked />
                                                    <Label className="custom-control-label" for="flexRadioDefault1">
                                                        Individual
                                                    </Label>
                                                </div>
                                                <div className=" custom-control custom-radio">
                                                    <Input className="custom-control-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                    <Label className="custom-control-label" for="flexRadioDefault2">
                                                        Group
                                                    </Label>
                                                </div>

                                            </FormGroup>
                                        </Col>


                                    </Row>


                                </Form>
                            </CardBody>
                        </Card>

                    </Col>
                </Row>

            </div>
        );
    }
}

export default emailcontent;
