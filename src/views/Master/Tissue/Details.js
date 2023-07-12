import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Table, Col, FormGroup, Form, Input, Row, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import MyModal from '../../CustomModal/CustomModal';
import { Multiselect } from 'multiselect-react-dropdown';
import { toast } from 'react-toastify';
import _ from "lodash";
import axiosInstance from "./../../../common/axiosInstance"
import { BE_DiseaseCategory_GetAllDRP, BE_DiseaseCategory_GetSubAllDRP, BE_Disease_GetDRPAll, BE_Tissue_GetById, BE_Tissue_Save, BE_Tissue_Update } from '../../../common/allApiEndPoints';

class Details extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: false,
      isEdit: false,
      isView: false,
      tissueId: 0,
      diseaseId: "",
      tissueName: "",
      tissueName2: "",
      Alldisease: [],
      diseasedetails: [],
      diseasedetails2: [],
      diseaseids: [],
      errors: {
        tissueName: '',
        diseaseId: '',
      },
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: '',
      //modalAction: '',
      diseasecategories: [],
      diseasesubCat: [],
      diseaseCategoryId: '',
      diseaseCategoryId2: '',
      diseaseName: '',
      selected: '',
      isFirstMount: true,
      categoryWiseDieseases: [],
      diesisDataTable: [],
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
      this.props.history.push('/master/tissues/list');
    }
  }


  //get detail
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    var rights = userToken.roleModule;
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleId.toString() == "21");
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

    const { parentDid, childDid, id } = this.props.match.params;
    // alert(`${childDid}`)
    if (id != null || id != undefined) {
      const did = childDid == 0 ? parentDid : childDid
      // alert(did)
      this.getData(id, did)
    } else {
      this.diseaseCategoryall(1, 2)
    }
    // this.getDisease(childDid || parentDid || 1)


  }

  getData = (id, did) => {
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Tissue/GetById?id=' + id + '&did=' + did;
    const url = apiroute + BE_Tissue_GetById(id, did)
    this.setState({ loading: true })
    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          // console.log(result.data);
          var rData = result.data.outdata;
          let dids = rData.diseaseIds.split(',');
          // console.log(dids);
          // var dData = this.state.Alldisease.slice();
          // dData = dData.filter(s => dids.includes(s.id.toString()));
          //console.log(dData);

          this.setState({
            tissueId: rData.tissueId, tissueName: rData.tissueName, tissueName2: rData.tissueName,
            diseaseId: rData.diseaseIds,
            categoryWiseDieseases: rData?.categoryWiseDieseases,
            // diseaseCategoryId: rData.parentDiseaseCategoryId || rData.diseaseCategoryId,
            // selected: rData.diseaseCategoryId,
            diseaseids: dids,
            loading: false
          }, () => {
            // this.getDisease(did);
            // console.log(this.state.categoryWiseDieseases, "gggggggggggggggggg")
            this.diseaseCategoryall(rData.parentDiseaseCategoryId == 0 ? rData.diseaseCategoryId : rData.parentDiseaseCategoryId, rData.diseaseCategoryId, true)
            this.dataDieseas(rData?.categoryWiseDieseases || [])
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
  diseaseCategoryall(parent, child,) {
    // alert(`${parent} ${child}`)
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_DiseaseCategory/GetAllDRP';
    const url = apiroute + BE_DiseaseCategory_GetAllDRP
    this.setState({ loading: true })
    // let data = JSON.stringify({ isDeleted: true, searchString: '', id: 0 });

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
          let parentDiseaseCategoryId = result.data.outdata != null ? result.data?.outdata[0]?.diseaseCategoryId : 0;
          let childDiseaseCategoryId = result.data.outdata != null ? result.data?.outdata[0]?.diseaseCategoryId : 0;
          if (parent) {
            parentDiseaseCategoryId = parent
          }
          if (child) {
            childDiseaseCategoryId = child
          }
          const { parentDid, childDid, id } = this.props.match.params;
          if (id != null || id != undefined) {
            // this.getData(id, childDid || parentDid);
            if (childDid == 0) {
              childDiseaseCategoryId = ""

            }
            // alert(` childDiseaseCategoryId ${childDiseaseCategoryId} child ${child}`)

          }
          this.setState({
            diseasecategories: result.data.outdata,
            diseaseCategoryId: parentDiseaseCategoryId,
            selected: childDiseaseCategoryId,
            diseaseCategoryId: parentDiseaseCategoryId,
            // diseaseCategoryId2: result.data.outdata != null ? result.data?.outdata[0]?.diseaseCategoryId : 0,
            loading: false
          }, () => {
            this.getsubDrpData(parentDiseaseCategoryId,);
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
  getsubDrpData(id, isOnMount = false) {

    const apiroute = window.$APIPath;
    // alert(`${id}`)
    this.setState({ loading: true })
    // if (id != "") {
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
              //loading: true,
              currentPage: 0,
              currentIndex: 0,
              pagesCount: 0,
              diseasesubCat: result.data.outdata,
              loading: false,
              selected: this.state.selected == '' ? String(result.data.outdata[0].diseaseCategoryId) : this.state.selected,
              // diseaseName: String(result.data.outdata[0].diseaseCategoryId),
            }), () => {
              // alert(`${this.state.diseasesubCat}`)

              this.getDisease();
            });
          }
          else {

            this.getDisease(id,);
          }


          // console.log(this.state.diseasesubCat[0].diseaseCategoryId);
        } else {
          this.setState({ loading: false });

        }
      })
      .catch((error) => {
        // console.log(error);
        this.setState({ loading: false });
      });
    this.setState({ loading: false });
  }
  getDisease() {
    // alert(`${diseaseCatId}`)
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_Disease/GetDRPAll';
    const url = apiroute + BE_Disease_GetDRPAll
    let data = JSON.stringify({
      isDeleted: true,
      searchString: '',
      Id: 0,
      diseaseCatId: Number(this.state.selected || this.state.diseaseCategoryId)
    });
    this.setState({ loading: true })
    axiosInstance.post(url, data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(result => {
      // console.log("Hir", result);
      if (result.data.flag) {
        const Alldisease = result.data.outdata;
        // console.log(Alldisease.map(e => e.id))
        const dids = this.state.diseaseId.split(",")
        // console.log(dids)
        const diseasedetails = Alldisease.filter(s => dids.find((e) => e == s.id) !== undefined);
        // alert(`dids ${dids} len ${dids.length} diseasedetails len ${diseasedetails.length}`)
        this.setState({
          Alldisease,
          diseasedetails: diseasedetails,
          loading: false
        }, () => {
          // const param = this.props.match.params;

          // if (param.id != undefined) {
          //   this.getData(param.id);
          // } else {
          //   this.setState({ loading: false });
          // }
        });
      } else {
        this.setState({ loading: false });
      }
    }).catch(error => {
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
        loading: false,
        currentPage: 0,
        currentIndex: 0,
        pagesCount: 0,
        //pageSize: 10,
        // diseasedetails: [],
        // diseaseids: [],
        // diseaseId: '',
        selected: value,
      }),
      () => {
        this.getDisease(value);
        // debugger;
      }
    );
  };
  dataDieseas(categoryWiseDieseases) {

    // const _ = require("lodash")
    categoryWiseDieseases = _.cloneDeep(categoryWiseDieseases)
    // let categoryWiseDieseases = this.state.categoryWiseDieseases
    let keys = _.map(categoryWiseDieseases, (e) => {
      return {
        "diseaseCategoryName": e.diseaseCategoryName, "diseaseCategoryId": e.diseaseCategoryId
      }
    })
    let categoryNames = _.uniqBy(keys, (e) => {
      return e.diseaseCategoryId
    })

    categoryWiseDieseases = _.uniqBy(categoryWiseDieseases, (e) => {
      return e.diseaseId
    })
    let table = categoryNames.map((e) => {
      return {
        name: e.diseaseCategoryName, diseaseCategoryId: e.diseaseCategoryId,
        disease: categoryWiseDieseases.filter(j => e.diseaseCategoryName === j.diseaseCategoryName)
      }
    })

    // categoryWiseDieseases.map((e,i) => {
    // let tableData = _.uniqBy(table, "diseaseId");
    // let tableData = _.uniqBy(table, "diseaseId");
    // const tableData = [...new Set(table)];
    this.setState({
      diesisDataTable: table

    })
    // console.log(this.state.diesisDataTable)
    // })
  }
  filterOnSelect = (e) => {
    const target = e.target;
    const value = target.value;
    // console.log(value);
    // console.log("value", this.state.diseaseCategoryId);
    this.setState(() => ({
      // loading: true,
      currentPage: 0, currentIndex: 0, pagesCount: 0,
      diseasesubCat: [],
      // diseasedetails: [],
      // diseaseids: [],
      Alldisease: [],
      // diseaseId: '',
      //pageSize: 10,
      diseaseCategoryId: value,
      selected: ""
    }), () => {
      this.getsubDrpData(value);
      // this.getDisease(value)

    })
  }
  onSelect(selectedList, selectedItem) {
    debugger
    let categoryWiseDieseases = _.cloneDeep(this.state.categoryWiseDieseases)
    console.log(selectedItem)

    // this.setState({
    //   diseasedetails: [],
    //   diseaseids: []
    // });
    //console.log(this.state.diseasedetails);
    let dlist = this.state.diseaseids.slice();
    //console.log(selectedList);
    //console.log(selectedItem);
    dlist.push(selectedItem.id);
    //console.log(dlist);
    this.setState({
      diseasedetails: selectedList,
      diseaseids: dlist,
      diseaseId: dlist.join(',')
    });
    let allDiseas = this.state.Alldisease
    let activeIds = dlist

    // let arr = allDiseas.filter(function (item) {
    //   return activeIds.indexOf(Number(item.id)) !== -1;
    // });
    let arr = allDiseas.filter(function (item) {
      return Number(item.id) == selectedItem.id;
    });
    const dcid = this.state.selected || this.state.diseaseCategoryId
    let dcName = ""
    if (this?.state?.diseasesubCat?.length > 0) {
      let obj = _.find(this?.state?.diseasesubCat, (e) => {
        return e.diseaseCategoryId == Number(dcid)
      })
      dcName = obj.diseaseCategoryName
    } else {
      let arr = this.state?.diseasecategories
      let obj = _.find(arr, (e) => {
        return e.diseaseCategoryId == Number(dcid)
      })
      dcName = obj.diseaseCategoryName

    }
    arr = arr.map(e => {
      return {
        diseaseName: e.name,
        diseaseId: e.id,
        diseaseCategoryId: Number(dcid),
        diseaseCategoryName: dcName

      }
    })
    // console.log(`arr`, arr);
    categoryWiseDieseases.push(...arr)
    this.setState({ categoryWiseDieseases }, () => {

      this.dataDieseas(categoryWiseDieseases || [])
    })
    // console.log(`categoryWiseDieseases`, categoryWiseDieseases);
    let errors = this.state.errors;
    if (this.state.diseasedetails) {
      errors.diseaseId = (!this.state.diseasedetails) ? 'Please select disease.' : ''
    }
  }
  // onRemove(selectedList, removedItem) {
  //   // debugger
  //   this.setState({
  //     diseasedetails: [],
  //     diseaseids: []
  //   });
  //   //console.log(this.state.diseasedetails);
  //   // let dlist = this.state.diseaseids.slice();
  //   console.log("diseaseids", this.state.diseaseids)
  //   let dlist = this.state.diseaseids.map((d) => d.trim()).slice();
  //   //console.log(selectedList);
  //   //console.log(removedItem);
  //   dlist = dlist.map((d) => d.trim())
  //   const index = dlist.indexOf(removedItem.id.toString());
  //   dlist.splice(index, 1); // removing the preexciting value
  //   // console.log(dlist);
  //   let categoryWiseDieseases = _.cloneDeep(this.state.categoryWiseDieseases)
  //   _.remove(categoryWiseDieseases, (e) => {
  //     return e.diseaseId == Number(removedItem.id)
  //   })
  //   this.state.errors.diseaseId = (dlist.length == 0) ? 'Please select disease.' : ''
  //   this.setState({
  //     diseasedetails: selectedList,
  //     diseaseids: dlist,
  //     categoryWiseDieseases,
  //     diseaseId: dlist.join(',')
  //   }, () => {
  //     this.dataDieseas(categoryWiseDieseases)
  //   });

  // }

  onRemove(selectedList, removedItem) {
    // debugger
    this.setState({
      diseasedetails: [],
      diseaseids: []
    });
    //console.log(this.state.diseasedetails);
    // let dlist = this.state.diseaseids.slice();
    console.log("diseaseids to be removed", this.state.diseaseids, "and name", this.state.diseasedetails);
    let dlist = this.state.diseaseids.map((d) => d.toString().trim()).slice();
    // let dlist = this.state.diseaseids.map((d) => d).slice();
    dlist = dlist.map((d) => d.trim())
    const index = dlist.indexOf(removedItem.id.toString());

    dlist.splice(index, 1); // removing the preexciting value

    let categoryWiseDieseases = _.cloneDeep(this.state.categoryWiseDieseases)
    _.remove(categoryWiseDieseases, (e) => {
      return e.diseaseId == Number(removedItem.id)
    })
    this.state.errors.diseaseId = (dlist.length == 0) ? 'Please select disease.' : ''
    this.setState({
      diseasedetails: selectedList,
      diseaseids: dlist,
      categoryWiseDieseases,
      diseaseId: dlist.join(',')
    }, () => {
      this.dataDieseas(categoryWiseDieseases)
    });

  }





  //form reset button click
  onResetClick(e) {
    e.preventDefault();
    this.setState({
      loading: false,
      tissueName: this.state.tissueName2,
      // diseasedetails: this.state.diseasedetails2,
      // diseaseCategoryId: this.state.diseaseCategoryId2,
      // diseaseId: "",
      diseasesubCat: [],
      errors: {
        tissueName: '',
        diseaseId: '',
      },
      redirect: false,
      modal: false,
      modalTitle: '',
      modalBody: ''
    }, function () {
      const { parentDid, childDid, id } = this.props.match.params;
      if (id != null || id != undefined) {
        // this.getData(id, childDid || parentDid);
        if (childDid == 0) {
          this.getData(id, parentDid);
        } else {
          this.getData(id, childDid || parentDid);
        }

      } else {

        this.diseaseCategoryall(1, 2)
      }
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

    // console.log("value:::", value)
    let errors = this.state.errors;


    switch (name) {
      case 'tissueName':
        errors.tissueName = (!value) ? 'This field is required.' : ''
        break;
      // case 'diseaseId':
      //   errors.diseaseId = (!value) ? 'Please select disease.' : ''
      //   break;
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

    if (this.state.tissueName == undefined || this.state.tissueName == '') {
      errors.tissueName = 'This field is required.';
    }
    if (this.state.diseaseids == undefined || this.state.diseaseids == '' || this.state.diseaseids?.length == 0) {
      errors.diseaseId = 'Please select disease.';
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
      if (this.state.tissueId == 0) {
        // url = apiroute + '/api/BE_Tissue/Save';
        url = apiroute + BE_Tissue_Save
      }
      else {
        // url = apiroute + '/api/BE_Tissue/Update';
        url = apiroute + BE_Tissue_Update
      }

      let data = JSON.stringify({
        tissueId: this.state.tissueId,
        tissueName: this.state.tissueName,
        //diseaseId: parseInt(this.state.diseaseId),
        diseaseIds: this.state.diseaseids.join(","),
        createdBy: (userToken.userId == null ? 0 : userToken.userId),
        createdByFlag: 'A',
        // parentDiseaseCategoryId: Number(this.state.diseaseCategoryId),
        diseaseCategoryId: Number(this.state.selected || this.state.diseaseCategoryId),
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
            this.props.history.push('/master/tissues/list');
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

    const { loading, tissueId, tissueName, Alldisease, diseaseId, errors, diseasecategories, diseasedetails, diesisDataTable } = this.state;

    return (

      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Tissue Detail</h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/master/tissues/list">
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
                    <Col xs="12">
                      <FormGroup>
                        <Label>Tissue Name <span className="requiredField">*</span></Label>
                        <Input type="text" autoComplete="off" className={errors.tissueName ? "is-invalid" : "is-valid"} name="tissueName" value={tissueName} onChange={this.handleInputChange.bind(this)} placeholder="Enter tissue name" tabIndex="1" maxLength="100" />
                        {<span className='error'>{errors.tissueName}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Input type="select" name="diseaseCategoryId" onChange={this.filterOnSelect} tabIndex="2">
                          {diseasecategories.map((data, i) => {
                            // console.log("id-cat", data.diseaseCategoryName);
                            return (
                              <option key={i} value={data.diseaseCategoryId} selected={data.diseaseCategoryId == this.state.diseaseCategoryId} >{data.diseaseCategoryName}</option>
                            );
                          })}
                        </Input>


                      </FormGroup>
                    </Col>

                    <Col xs="6">
                      {this.state.diseasesubCat.length > 0 ?
                        <Input
                          type="select"
                          name="diseaseName"
                          style={{ display: this?.state?.diseasesubCat?.length > 0 ? 'block' : 'none' }}
                          onChange={this.dsubhandleChange}
                          tabIndex="3"

                        >
                          <option value="" disabled={this.state?.diseaseCategoryId}>Select sub Category</option>
                          {/* {console.log("diseasecategories", diseasecategories)} */}
                          {
                            (


                              this?.state?.diseasesubCat?.map((data, i) => {
                                return (
                                  <option key={i} value={data.diseaseCategoryId} selected={this.state?.selected == data.diseaseCategoryId}>
                                    {data.diseaseCategoryName}
                                  </option>
                                );
                              })
                            )

                          }
                        </Input>
                        : null}
                    </Col>
                    <Col xs="6">
                      <FormGroup>
                        <Label>Disease <span className="requiredField">*</span></Label>
                        {/* {console.log("AllDisease:",Alldisease)} */}
                        {/* <Input type="select" required className={errors.diseaseId ? "custom-select is-invalid" : "custom-select is-valid"} name="diseaseId" value={diseaseId} onChange={this.handleInputChange.bind(this)}>
                          <option value="">Select Disease</option>
                          {Alldisease
                            .map((data, i) => {
                              return (<option key={i} value={data.id}>{data.name}</option>);
                            })}
                        </Input> */}
                        <Multiselect
                          options={Alldisease} // Options to display in the dropdown
                          selectedValues={this.state.diseasedetails} // Preselected value to persist in dropdown
                          onSelect={this.onSelect.bind(this)}   // Function will trigger on select event
                          onRemove={this.onRemove.bind(this)} // Function will trigger on remove event
                          displayValue="name" // Property name to display in the dropdown options
                          placeholder="Select Disease"
                          tabIndex="4"
                          name="diseaseId"
                        />
                        {<span className='error'>{errors.diseaseId}</span>}
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col xs="12">
                      <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "600", color: "#1C3A84" }} className="mb-2" >Current Selected Tissues</div>
                      <Table responsive bordered key="tblTissues">
                        <thead>
                          <tr>
                            <th>Catagory</th>
                            <th>Disease</th>

                          </tr>
                        </thead>
                        <tbody>

                          {diesisDataTable.map(ds => {

                            return <tr>
                              <td>{ds.name}</td>
                              <td>
                                {ds.disease.map(ds => {

                                  return <span className="badge badge-info btn-pill" style={{ "padding": "8px", "color": "#fff", "margin": "0px 0px 5px 2px", "fontWeight": "unset", "fontSize": "12px" }}>{ds.diseaseName}</span>
                                })}
                              </td>

                            </tr>
                          })}

                        </tbody>
                      </Table>
                    </Col>
                  </Row> */}
                  <Row>
                    <Col xs="12" >
                      <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "600", color: "#1C3A84" }} className="mb-2">Current Selected Tissues</div>
                    </Col>

                    {diesisDataTable.map(ds => {

                      return <Col xs="4" className='mb-5'>
                        <Card style={{ height: "100%" }}>
                          <CardHeader style={{ textAlign: "center", fontSize: "16px", fontWeight: "600", color: "#1C3A84" }} className='text-center'>
                            {ds.name}


                          </CardHeader>

                          <CardBody>
                            {ds.disease.map(ds => {

                              return <span className="badge badge-info btn-pill" style={{ "padding": "8px", "color": "#fff", "margin": "0px 0px 5px 2px", "fontWeight": "unset", "fontSize": "12px" }}>{ds.diseaseName}</span>
                            })}


                          </CardBody>
                        </Card>
                      </Col>
                    })}
                  </Row>
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input type="hidden" name="tissueId" value={tissueId} />
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



        </Row >
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
