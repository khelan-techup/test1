import { Badge, Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import React, { Component } from 'react';

import Confirm from "../../CustomModal/Confirm";
import MyModal from '../../CustomModal/CustomModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from "../../../common/axiosInstance"
import { BE_DiseaseCategory_GetAllDRP, BE_DiseaseCategory_GetSubAllDRP, BE_NGSLabSample_BulkDelete, BE_NGSLabSample_Save, BE_NGSLaboratory_GetAllPaging, BE_SampleType_GetSampleTypebyCatId } from '../../../common/allApiEndPoints';

class AssignSample extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            isView: false,
            isEdit: false,
            labNames: {},
            loading: false,
            ngslaboratorys: [],
            pagesCount: 0,
            diseaseCategoryId: 0,
            diseasecategories: [],
            labSampleData: [],
            diseasesubCat: [],
            labDrpId: 0,
            checkbox: [],
            ngsLabId: 0,
            drpLabId: 0,

        }
        this.state = this.initialState;
    }
    componentDidMount() {

        const param = this.props.match.params;
        this.setState({
            ngsLabId: param.labId,
            loading: true,
        }, () => { this.getListData(0); })
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        var rights = userToken.roleModule;

        if (rights.length > 0) {
            let currentrights = rights.filter((role) =>
                role.moduleName.toLowerCase().includes("laboratory")
            );
            //console.log(currentrights);
            if (currentrights.length > 0) {
                this.setState({
                    isView: currentrights[0].isViewed,
                    isEdit: currentrights[0].isEdited,
                });
                if (currentrights[0].isViewed) {
                    // this.getListData(0);
                } else {
                    this.setState({ loading: false });
                }
            } else {
                this.setState({ loading: false });
            }
        } else {
            this.setState({ loading: false });
        }

        const apiroute = window.$APIPath;
        // const url = apiroute + '/api/BE_DiseaseCategory/GetAllDRP';
        const url = apiroute + BE_DiseaseCategory_GetAllDRP
        axiosInstance
            .get(url, {

                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
            .then(result => {
                if (result.data.flag) {



                    //let diseaseCatObj = result
                    //  .data
                    //  .outdata.diseaseCatData
                    //  .filter(category => category.diseaseCategoryName.toLowerCase() == 'cancer' || category.diseaseCategoryName.toLowerCase() == 'complete health score');

                    this.setState({
                        diseasecategories: result.data.outdata,
                        diseaseCategoryId: result.data.outdata != null ? result.data?.outdata[0]?.diseaseCategoryId : 0
                    }, function () {
                        this.getsubDrpData(result.data.outdata[0].diseaseCategoryId);
                        // this.getListData(0);
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

                diseaseCategoryId: value,
            }),
            function () {
                this.getSampleByDiseaseCategory(this.state.diseaseCategoryId)

                // this.getListData(0);

            }
        );
    };
    getSampleByDiseaseCategory = (id) => {
        this.setState({ loading: true })
        const apiroute = window.$APIPath;
        const url =
            // apiroute + "/api/BE_SampleType/GetSampleTypebyCatId?id=" + id + ""; //apiroute + "/api/BE_SampleType/GetSampleTypebyCatId?id=" + id + "";
            apiroute + BE_SampleType_GetSampleTypebyCatId(id)

        axiosInstance
            .get(url, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((result) => {

                if (result.data.flag) {
                    // var rData = result.data.outdata;
                    // let selectedSamples = this.state.selectedSamples
                    // let aviableSample = this.state.aviableSample
                    // let ngsLabSamples = this.state.ngsLabSamples
                    // let selectedCheckBox = this.state.selectedCheckBox


                    this.setState({
                        labSampleData: result.data.outdata,
                        loading: false
                    })
                    // console.log("ngsLabSamples", this.state.labSampleData);




                    // filter((cat) => cat.diseaseCategoryId == ele && this.state.selectedCheckBox(String(cat.sampleTypeId)))
                    // console.log(rData.filter((cat) => !selectedCheckBox.includes(String(cat.sampleTypeId))));
                    // let deleteData = this.state.deleteUncheked
                    // this.setState({
                    //   deleteUncheked: [
                    //     ...deleteData,
                    //     value,]
                    // }
                    // )
                    // console.log(this.state.deleteUncheked);
                    // this.setState({
                    //     AllSamples: rData.filter((cat) => {
                    //         let index = ngsLabSamples.findIndex(e => Number(e.sampleTypeId) == Number(cat.sampleTypeId))
                    //         console.log({ index, cid: cat.sampleTypeId, inch: !selectedCheckBox.includes(String(cat.sampleTypeId)) })
                    //         return !selectedCheckBox.includes(String(cat.sampleTypeId)) && index === -1;
                    //     }),
                    //     aviableSample: [
                    //         ...aviableSample, ...rData, ...ngsLabSamples
                    //     ]
                    //         .filter((item, i, ar) => ar.findIndex(obj => obj.sampleTypeId === item.sampleTypeId) === i),

                    //     loading: false,
                    //     selectedSamples: [
                    //         ...selectedSamples, id
                    //     ].filter((item, i, ar) => ar.indexOf(item) === i),

                    //     deleteUncheked: [],
                    //     checkbox: [],
                    // });

                    // this.setState({
                    //   selectedSamples: [
                    //     ...this.state.selectedSamples
                    //   ]
                    // })
                    //console.log(this.state);
                } else {

                }
                this.setState({ loading: false });
            })
            .catch((error) => {
                // console.log(error);
                this.setState({ loading: false });
            });
    };
    getListData(pageNo) {
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        let userId = userToken.userId == null ? 0 : userToken.userId;

        const apiroute = window.$APIPath;
        const url = apiroute + BE_NGSLaboratory_GetAllPaging
        this.setState({ loading: true })
        let data = JSON.stringify({
            isDeleted: true,
            // isDeleted: this.state.slDelete,
            searchString: this.state.searchString,
            Id: userId,
            pageNo: pageNo,
            totalNo: window.$TotalRecord,
        });

        axiosInstance
            .post(url, data, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((result) => {
                if (result.data.flag) {
                    // console.log(result.data.outdata);
                    let labs = result?.data?.outdata?.ngsLaboratoryData || [];
                    let labNames = labs.reduce((obj, item) => (obj[item.ngsLaboratoryId] = item.ngsLabName, obj), {});
                    let index = labs.findIndex((obj) => obj.ngsLaboratoryId == this.state.ngsLabId)
                    // labs.map((e)=>{
                    //     return {[e.ngsLaboratoryId]:e.ngsLabName}
                    // })
                    // alert(this.state.ngsLabId)
                    let seletectedSamples = labs.filter(obj => obj.ngsLaboratoryId == this.state.ngsLabId)?.[0]?.ngsLabSamples?.map?.((obj) => obj.sampleTypeId)
                    // console.log({ seletectedSamples })
                    this.setState({
                        pagesCount: Math.ceil(
                            result.data.totalRecord / window.$TotalRecord
                        ),
                        labNames,
                        labDrpId: index,
                        ngslaboratorys: labs,
                        checkbox: seletectedSamples || [],
                        loading: false,
                    });

                    // console.log(this.state.diseasecategories);
                } else {
                    // console.log(result.data.message);
                    this.setState({ loading: false });
                }

            })
            .catch((error) => {
                // console.log(error);
                this.setState({ authError: true, error: error, loading: false });
            }).finally(() => {
                this.getSampleByDiseaseCategory(this.state.diseaseCategoryId)
            })
    }
    filterOnSelect = (e) => {
        const target = e.target;
        const value = target.value;
        // console.log(value);
        // console.log("value", this.state.diseaseCategoryId);
        this.setState(() => ({
            loading: true, currentPage: 0, currentIndex: 0, pagesCount: 0,
            diseasesubCat: [],
            //pageSize: 10,
            diseaseCategoryId: value
        }), function () {
            this.getsubDrpData(value);
        })
    }
    getsubDrpData(id) {

        const apiroute = window.$APIPath;
        // console.log(id);
        // if (id != "") {
        this.setState({ loading: true })
        // const url = apiroute + "/api/BE_DiseaseCategory/GetSubAllDRP?id=" + id + "";
        const url = apiroute + BE_DiseaseCategory_GetSubAllDRP(id)

        axiosInstance
            .get(url, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            })
            .then((result) => {
                // console.log(result.data.outdata[0].diseaseCategoryId);
                if (result.data.flag) {

                    if (result.data.outdata.length != 0) {
                        // alert(0)
                        this.setState(() => ({
                            currentPage: 0,
                            currentIndex: 0,
                            pagesCount: 0,
                            diseasesubCat: result.data.outdata,
                            diseaseCategoryId: String(result.data.outdata[0].diseaseCategoryId),
                            diseaseName: String(result.data.outdata[0].diseaseCategoryId),
                            loading: false,
                        }), function () {
                            // alert(1)
                            this.getSampleByDiseaseCategory(this.state.diseaseCategoryId)
                        });
                    }
                    else {
                        this.getSampleByDiseaseCategory(this.state.diseaseCategoryId)
                    }

                    // console.log(this.state.diseasesubCat[0].diseaseCategoryId);
                } else {
                    this.setState({ loading: false });
                    this.getSampleByDiseaseCategory(this.state.diseaseCategoryId)
                }
            })
            .catch((error) => {
                // console.log(error);
                this.setState({ loading: false });
            });

    }
    handleCheckbox = (e) => {
        const target = e.target;
        const value = Number(target.value);

        // console.log(`value`, value, typeof value);
        let checkbox = [...this.state.checkbox]
        let index = checkbox.indexOf(value);
        if (index === -1) {
            checkbox.push(value)
            this.setState({
                checkbox
            })
        } else {
            checkbox.splice(index, 1)
            this.setState({
                checkbox
            })
        }


    }
    handleLabChange = (e) => {
        this.setState({ loading: true })
        const target = e.target;
        const value = target.value;
        // const id = target.id;

        // const index = e.target.selectedIndex;
        // const el = e.target.childNodes[index]
        // const option = el.getAttribute('id');
        // const param = this.props.match.params;
        // console.log(`param`, param);
        // this.setState({
        //     drpLabId: option
        // })

        // alert(String(id)) 
        let index = this.state.ngslaboratorys.findIndex((obj) => obj.ngsLaboratoryId == value)
        let lab = this.state.ngslaboratorys[index]//.ngsLabSamples.map((data) => data.sampleTypeId)
        let ngsLabId = lab.ngsLaboratoryId
        let checkbox = lab.ngsLabSamples.map((data) => data.sampleTypeId)
        this.setState({
            labDrpId: index, //value, checkbox: this.state.ngslaboratorys[value].ngsLabSamples.map((data) => data.sampleTypeId),
            checkbox,
            ngsLabId,
            loading: false
        }, () => {
            if (window.history.pushState) {
                var newurl = window.location.protocol + "//" + window.location.host + '/ngslaboratory/samples/' + ngsLabId;
                window.history.pushState({ path: newurl }, '', newurl);
            }
        })
        // console.log(`labSampleTypeId`, this.state.ngsLabId);
        // let data = this.state.labSampleTypeId
        // console.log(data.map((data, i) => {
        //     return data?.ngsLabSamples?.sampleTypeId
        // }));



    }

    AddSample(e) {

        e.preventDefault();
        this.setState({ loading: true });
        let errors = this.state.errors;

        let uid = 0;
        var userToken = JSON.parse(localStorage.getItem("AUserToken"));
        if (userToken != null) {
            uid = userToken.userId == null ? 0 : userToken.userId;
        }

        // if (
        //     this.state.selectedCheckBox.length >= 0
        //     // this.state.ngsLabSampleTypeId != undefined
        // ) {
        const apiroute = window.$APIPath;
        // let url = apiroute + "/api/BE_NGSLabSample/Save";      // let url = apiroute + "/api/BE_NGSLabSample/Save";
        let url = apiroute + BE_NGSLabSample_Save     // let url = apiroute + "/api/BE_NGSLabSample/Save";
        let index = this.state.labDrpId
        let assigned = this.state.ngslaboratorys[index].ngsLabSamples.map(obj => obj.sampleTypeId)
        let filteredSamples = this.state.labSampleData.filter(obje => this.state.checkbox.includes(Number(obje.sampleTypeId)) && obje.diseaseCategoryId == this.state.diseaseCategoryId && !assigned.includes(obje.sampleTypeId)) //.map(ele=>String(ele.diseaseCategoryId))
        // console.log({ filteredSamples })
        let dataToParse = filteredSamples.map((ele) => {
            return {
                ngsLaboratoryId: parseInt(this.state.ngsLabId),
                ngsLabSampleId: 0,
                diseaseCategoryId: ele.diseaseCategoryId,
                sampleTypeId: ele.sampleTypeId,
                sampleTypeName: ele.sampleTypeName,
                createdByFlag: "A",
                createdBy: uid
            }
        })

        if (filteredSamples.length) {

            let data = JSON.stringify(dataToParse)

            // console.log(data);
            axiosInstance
                .post(url, data, {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                })
                .then((result) => {
                    if (result.data.flag) {
                        // this.setState(
                        //     {
                        //         authError: true,
                        //         errorType: "success",
                        //         error: result.data.message,
                        //         loading: false,
                        //         showSample: false,
                        //         ngsLabId: "",
                        //         ngsLabSampleTypeId: "",
                        //         diseaseCategoryId: "",
                        //         checkbox: [],
                        //         AllSamples: [],
                        //         selectedCheckBox: []
                        //     },
                        //     this.getListData(0)
                        //     );
                        // let deleteUncheckedSamples = this.state.labSampleData.filter(obje => !this.state.checkbox.includes(Number(obje.sampleTypeId)))


                        this.setState({ loading: false });
                        this.getListData()


                        toast.success("Specimen collections assigned successfully");
                    } else {
                        toast.error(result.data.message);
                        this.setState({ loading: false });
                    }
                })
                .catch((error) => {
                    this.setState({
                        authError: true,
                        errorType: "danger",
                        error: error.message,
                        loading: false,
                        showSample: false,
                    });
                    toast.error(error.message);
                })
            // .finally(() => {
            //     this.getSampleByDiseaseCategory(this.state.diseaseCategoryId)
            // });
        } else {
            this.setState({ loading: false })
            this.getListData()

            toast.success("Specimen collections assigned successfully.")

        }
        this.setState({ loading: true })
        let ind = this.state.labDrpId
        let samplesToDelete = this.state.ngslaboratorys[ind].ngsLabSamples.filter(obje => !this.state.checkbox.includes(Number(obje.sampleTypeId)) && obje.diseaseCategoryId == this.state.diseaseCategoryId)
        // console.log({ samplesToDelete })
        if (samplesToDelete.length > 0) {
            let data = samplesToDelete.map((ele) => {
                return {
                    "ngsLabSampleId": Number(ele.ngsLabSampleId),
                    "userId": uid,
                }
            })
            // console.log(data, "kjnjjjjnjnjnjnjnjnjnjnjnjn")
            const apiroute = window.$APIPath;
            const url =
                // apiroute + "/api/BE_NGSLabSample/BulkDelete";
                apiroute + BE_NGSLabSample_BulkDelete

            axiosInstance.post(url, data, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            }).then(res => {
                // console.log(res)
                // let { flag, message } = res.data
                // if (flag) {
                //     toast.success(message)
                // } else {
                //     toast.error(message)
                // }
                this.setState({ loading: false }, () => {

                    this.getListData()
                    // this.getSampleByDiseaseCategory(this.state.diseaseCategoryId)
                    // this.getSampleByDiseaseCategory(this.state.diseaseCategoryId)
                })
            }).catch(() => {
                this.setState({ loading: false })
            })


        } else {
            // console.log("less<0")

            this.setState({ loading: false })
            this.getListData()

            // this.getSampleByDiseaseCategory(this.state.diseaseCategoryId)
        }
        // } else {
        //     errors.ngsLabSampleTypeId = "Please select Sample.";
        //     this.setState({ loading: false });
        // }
        // alert(1)

    }

    loader() {
        if (this.state.loading) {
            return <div className="cover-spin"></div>;
        }
    }
    render() {
        const { ngslaboratorys, diseasecategories, labSampleData, checkbox, drpLabId, ngsLabId } = this.state;
        return (
            <div className="animated fadeIn" >
                {this.loader()}
                <Row className="mb-3">
                    <Col xs="10" lg="10">
                        <h5 className="mt-2"><i className="fa fa-align-justify"></i> Assign Samples</h5>
                    </Col>
                    <Col xs="2" lg="2">
                        <Link to="/ngslaboratory/list">
                            <button className="btn btn-primary btn-block">Laboratory</button>
                        </Link>
                    </Col>

                </Row>
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <Row>
                                    <Col xs="4">
                                        <Input type="select" onChange={this.handleLabChange}>
                                            {ngslaboratorys.map((data, i) => {
                                                return (
                                                    <option selected={data.ngsLaboratoryId == this.state.ngsLabId} key={i} value={data.ngsLaboratoryId} id={data.ngsLaboratoryId}  >{data.ngsLabName}</option>
                                                );
                                            })}

                                        </Input>
                                    </Col>
                                    <Col xs="4">
                                        <FormGroup>
                                            <Input type="select" name="diseaseCategoryId" onChange={this.filterOnSelect} >
                                                {diseasecategories.map((data, i) => {

                                                    return (

                                                        <option key={i} value={data.diseaseCategoryId}>{data.diseaseCategoryName}</option>
                                                    );
                                                })}
                                            </Input>


                                        </FormGroup>
                                    </Col>
                                    <Col xs="4">
                                        <Input
                                            type="select"
                                            name="diseaseName"
                                            style={{ display: this?.state?.diseasesubCat?.length > 0 ? 'block' : 'none' }}
                                            onChange={this.dsubhandleChange}
                                        >
                                            <option value="" disabled={this.state?.diseaseCategoryId}>Select sub Category</option>
                                            {
                                                this?.state?.diseasesubCat?.map((data, i) => {
                                                    return (
                                                        <option key={i} value={data.diseaseCategoryId} selected={this.state?.diseaseName == data.diseaseCategoryId}>
                                                            {data.diseaseCategoryName}
                                                        </option>
                                                    );
                                                })
                                            }
                                        </Input>
                                    </Col>


                                </Row>


                            </CardHeader>
                            <CardBody>


                                <Table responsive bordered key="tblTissues">
                                    <thead>
                                        <tr>
                                            <th>Assigned</th>
                                            <th>Sample type</th>
                                            <th>Sample Assigned to Lab</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {labSampleData.map((data, i) => {
                                            return (
                                                <tr key={i} >

                                                    <td style={{ width: "15%" }}>
                                                        <Input type="checkbox" className="ml-0"
                                                            disabled={
                                                                data?.labIds && data?.labIds != ngsLabId}


                                                            value={data.sampleTypeId}
                                                            checked={this.state.checkbox.includes(data.sampleTypeId)} onChange={this.handleCheckbox} />
                                                    </td>

                                                    <td >
                                                        {data.sampleTypeName}
                                                    </td>
                                                    <td>
                                                        {this.state.labNames[data.labIds] || "N/A"}
                                                    </td>

                                                </tr>
                                            );
                                        })}


                                    </tbody>
                                </Table>
                                <Row className="justify-content-end">

                                    <Col xs="2" className="float-right" >
                                        {this.state.isEdit ?
                                            <Link >
                                                <button className="btn btn-primary btn-block" onClick={this.AddSample.bind(this)}>
                                                    <i className="fa fa-dot-circle-o"></i> Submit</button>
                                            </Link> : null
                                        }

                                    </Col>
                                </Row>
                            </CardBody>

                        </Card>
                    </Col>
                </Row>


            </div>
        )
    }
}
export default AssignSample;