import React, { Component } from 'react';
import { Button, Card, CardBody, Col, FormGroup, Form, Input, Row, Label, Table } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ClassicEditor from 'ckeditor5-custom-build'
import Confirm from "../../CustomModal/Confirm";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import "react-tooltip/dist/react-tooltip.css";
import axiosInstance from "./../../../common/axiosInstance"
import { GrammarlyEditorPlugin, Grammarly } from '@grammarly/editor-sdk-react'
import { AdmeToxBuilder_GetById, AdmeToxBuilder_Save, AdmeToxBuilder_Update, BE_ReportBuilder_UploadRportBuilderCkeditorImage } from '../../../common/allApiEndPoints';


// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
class AdmeDetails extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      loading: true,
      isEdit: false,
      isView: false,
      reportBuilderId: 0,
      reportBuilderId2: 0,
      title: "",
      title2: "",
      // headingTitle: "",
      // headingTitle2: "",
      description: "",
      description2: "",
      // diseaseCategory: "",
      // diseaseCategory2: "",
      // diseasecategories: [],
      // diseaseCategoryId: 0,
      // diseaseCategoryId2: 0,
      // imagePath: [],
      // imagePath2: [],
      // type: 'S',
      fileKey: "",
      // type2: 'S',
      // imageTag: '',
      // imageTag2: '',
      // imageFile: '',
      // isNewPage: false,
      // isNewPage2: false,
      errors: {
        title: '',
        // headingTitle: '',
        description: '',
        // diseaseCategory: '',
        // diseaseCategoryId: 0,
        // imageTag: '',
        // imageFile: '',
      },
      // imageName: "",
      redirect: false,
    };
    this.state = this.initialState;
  }

  //get detail
  componentDidMount() {
    var userToken = JSON.parse(localStorage.getItem("AUserToken"));
    var rights = userToken.roleModule;
    if (rights.length > 0) {
      let currentrights = rights.filter(role => role.moduleId.toString() == "32");
      //console.log(currentrights);
      if (currentrights.length > 0) {
        this.setState({
          isView: currentrights[0].isViewed,
          isEdit: currentrights[0].isEdited
        })
        if (currentrights[0].isViewed) {
          // this.getListData(0);
          const param = this.props.match.params;
          if (param.id != undefined) {
            this.getData(param.id);
          } else {
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
    }
    else {
      this.setState({ loading: false });
    }
    // const apiroute = window.$APIPath;
    // const url = apiroute + '/api/BE_DiseaseCategory/GetAll';

    // let data = JSON.stringify({
    //   isDeleted: true,
    //   searchString: '',
    //   id: 0
    // });

    // axiosInstance.post(url, data, {
    //   headers: {
    //     'Content-Type': 'application/json; charset=utf-8'
    //   }
    // })

    //   .then(result => {
    //     if (result.data.flag) {
    //       let diseaseCatObj = result.data.outdata
    //         .filter(category => category.diseaseCategoryId == 2 || category.diseaseCategoryId == 3 || category.diseaseCategoryId == 4 || category.diseaseCategoryId == 6);


    //       this.setState(() => ({ diseasecategories: diseaseCatObj }), function () {
    //         const param = this.props.match.params;
    //         if (param.id != undefined) {
    //           this.getData(param.id);
    //         } else {
    //           this.setState({ loading: false });
    //         }
    //       });
    //     } else {
    //       this.setState({ loading: false });
    //     }
    //   })
    //   .catch(error => {
    //     this.setState({ loading: false });
    //   });


  }

  // getFeedItems(queryText) {
  //   const items = [
  //     { id: '@abc', userId: '1', name: 'Barney Stinson', link: 'https://www.imdb.com/title/tt0460649/characters/nm0000439' },
  //     { id: '@test', userId: '2', name: 'Lily Aldrin', link: 'https://www.imdb.com/title/tt0460649/characters/nm0004989' },
  //     { id: '@practitioner', userId: '4', name: 'Marshall Eriksen', link: 'https://www.imdb.com/title/tt0460649/characters/nm0781981' },
  //     { id: '@lab', userId: '3', name: 'Marry Ann Lewis', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
  //     { id: '@report', userId: '5', name: 'Robin Scherbatsky', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
  //     { id: '@something', userId: '6', name: 'Ted Mosby', link: 'https://www.imdb.com/title/tt0460649/characters/nm1102140' }
  //   ];
  //   // As an example of an asynchronous action, return a promise
  //   // that resolves after a 100ms timeout.
  //   // This can be a server request or any sort of delayed action.
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       const itemsToDisplay = items
  //         // Filter out the full list of all items to only those matching the query text.
  //         .filter(isItemMatching)
  //         // Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
  //         .slice(0, 10);

  //       resolve(itemsToDisplay);
  //     }, 100);
  //   });

  //   // Filtering function - it uses the `name` and `username` properties of an item to find a match.
  //   function isItemMatching(item) {
  //     // Make the search case-insensitive.
  //     const searchString = queryText.toLowerCase();

  //     // Include an item in the search results if the name or username includes the current user input.
  //     return (
  //       item.name.toLowerCase().includes(searchString) ||
  //       item.id.toLowerCase().includes(searchString)
  //     );
  //   }
  // }
  //get detail(for update)
  getData = (id) => {
    const apiroute = window.$APIPath;
    // const url = apiroute + '/api/AdmeToxBuilder/GetById?id=' + id + '';
    const url = apiroute + AdmeToxBuilder_GetById(id)
    this.setState({
      loading: true
    })
    axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(result => {
        if (result.data.flag) {
          var rData = result.data.outdata;
          // console.log("Hiii", rData);
          // console.log(rData);
          this.setState({
            title: rData.title,
            title2: rData.title,
            reportBuilderId: rData.admeToxBuilderId,
            reportBuilderId2: rData.admeToxBuilderId,
            // diseaseCategory: rData.diseaseCategory,
            // diseaseCategory2: rData.diseaseCategory,
            // diseaseCategoryId: rData.diseaseCategoryId,
            // diseaseCategoryId2: rData.diseaseCategoryId,
            description: rData.description ?? '',
            description2: rData.description ?? '',
            // type: rData.type,
            // type2: rData.type,
            // headingTitle: rData.headingTitle,
            // headingTitle2: rData.headingTitle,
            // isNewPage: rData.isNewPage,
            // isNewPage2: rData.isNewPage,
            // imagePath: rData.imagePath,
            // imagePath2: rData.imagePath,
            // imageTag: rData.imageTag,
            loading: false,
            // diseaseId: rData.diseaseId, 
            // diseaseName: rData.diseaseName,
            // diseaseCode: rData.diseaseCode, 
            // accessionDigit: rData.accessionDigit,
            // EfoDiseasCode: rData.efoDiseasCode, 
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
      reportBuilderId: this.state.reportBuilderId2,
      title: this.state.title2,
      description: this.state.description2,
      // diseaseCategory: this.state.diseaseCategory2,
      // diseaseCategoryId: this.state.diseaseCategoryId2,
      // type: this.state.type2,
      // imageTag: '',
      // headingTitle: this.state.headingTitle2,
      // isNewPage: this.state.isNewPage2,
      // imagePath: this.state.imagePath2,
      // imageTag: this.state.imageTag2,
      errors: {
        title: '',
        description: '',
        // diseaseCategory: '',
        // diseaseCategoryId: 0,

      },
      redirect: false,
    },
      () => {
        const param = this.props.match.params;
        if (param.id != undefined) {
          this.getData(param.id);
        }
      }


    );
  }

  //input handle input change and validation
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let errors = this.state.errors;
    // alert(`${name}- ${value}`)
    this.setState({
      [name]: value
    });
    // console.log("Name:", name, value);
    // if (name === "imageTag") {
    //   let index = this.state.imagePath.findIndex((ele)=>ele.imageTag ==value)
    // }
    // if (name === "diseaseCategoryId") {
    //   // debugger;
    //   if (value) {
    //     let diseaseCatAccessionDigit = this.state.diseasecategories.filter(ml => ml.diseaseCategoryId == value);
    //     if (diseaseCatAccessionDigit.length > 0) {
    //       this.setState({
    //         diseaseCategory: diseaseCatAccessionDigit[0].diseaseCategoryName,
    //         //diseaseCategoryId: diseaseCatAccessionDigit[0].diseaseCategoryId,
    //       });
    //     } else {
    //       this.setState({
    //         // accessionDigit: 0,
    //         diseaseCategory: "",
    //         //diseaseCategoryId: 0
    //       });
    //     }
    //   } else {
    //     this.setState({
    //       //   accessionDigit: 0,
    //       diseaseCategory: "",
    //       //diseaseCategoryId: 0
    //     });
    //   }
    // }
    switch (name) {
      // case 'diseaseCategoryId':
      //   errors.diseaseCategory = (!value) ? 'Please select report type.' : '';
      //   break;
      // case 'headingTitle':
      //   errors.headingTitle = (!value) ? 'Please enter heading title.' : '';
      //   break;
      case 'title':
        errors.title = (!value) ? 'Please enter title.' : '';
        break;
      // case 'diseaseCategory':
      //   errors.diseaseCategory = (!value) ? 'Please select disease type.' : '';
      //   break;
      // case 'imageTag': {
      //   let index = this.state.imagePath.findIndex((ele) => {

      //     let a = ele.imageTag == `<${value}>`;
      //     // console.log({
      //     //   a, ele, imgtag: ele.imageTag,
      //     //   value
      //     // })
      //     return a
      //   })
      //   errors.imageTag = (!value) ? 'Please enter image tag.' : '';
      //   if (index !== -1) {
      //     errors.imageTag = "Please use a diffrent tag name "
      //   }
      //   break;
      // }
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

    if (this.state.title == undefined || this.state.title == '') {
      errors.title = 'Please enter title.';
    }

    // if (this.state.diseaseCategory == undefined || this.state.diseaseCategory == '') {
    //   errors.diseaseCategory = 'Please select report type.';
    // }
    // if (this.state.headingTitle === undefined || this.state.headingTitle == '') {
    //   errors.headingTitle = 'Please enter heading title';
    // }
    // if (this.state.imageTag == undefined || this.state.imageTag == '') {
    //   errors.imageTag = 'Please enter image tag.';
    // }
    // if (this.state.imageFile == undefined || this.state.imageFile == '') {
    //   errors.imageFile = 'Please select file to upload.';
    // }
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
      if (this.state.reportBuilderId == 0) {
        // url = apiroute + '/api/AdmeToxBuilder/Save';
        url = apiroute + AdmeToxBuilder_Save
      }
      else {
        // url = apiroute + '/api/AdmeToxBuilder/Update';
        url = apiroute + AdmeToxBuilder_Update
      }

      //   if (this.state.accessionDigit == 0) {
      //     let diseaseCatAccessionDigit = this.state.diseasecategories.filter(ml => ml.diseaseCategoryName === this.state.category);
      //     this.setState({
      //       accessionDigit: diseaseCatAccessionDigit[0].accessionDigit
      //     });
      //   }

      let data = JSON.stringify({
        admeToxBuilderId: this.state.reportBuilderId,
        // ImagePath: this.state.imagePath,
        // diseaseCategoryId: parseInt(this.state.diseaseCategoryId),
        // diseaseCategory: this.state.diseaseCategory,
        title: this.state.title,
        // headingTitle: this.state.headingTitle,
        description: this.state.description,
        // Type: this.state.type,
        // IsNewPage: this.state.isNewPage,
        createdBy: (userToken.userId == null ? 0 : userToken.userId)
      })


      axiosInstance.post(url, data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(result => {

          this.setState({ loading: false });
          // console.log(result.data.message)
          if (result.data.flag) {
            toast.success(result.data.message)
            this.setState({ redirect: true });
            this.props.history.push('/master/Admereport/list');
          }
          else {
            toast.error(result.data.message)
          }
        })
        .catch(error => {
          //console.log(error);
          this.setState({
            loading: false
          });
          toast.error(error.message)
        });
    }
    else {
      this.setState({ loading: false });
    }
  }

  //input handle input change checkbox
  // handleInputChangeChk(event) {
  //   let val = (event.target.checked ? true : false);
  //   //console.log(data);
  //   this.setState({
  //     isNewPage: val
  //   });
  // }

  // handleFileInputChange(event) {
  //   const target = event.target;
  //   const value = target.files[0];
  //   const name = target.name;
  //   //alert(target.files[0]);

  //   this.setState({
  //     imageFile: value,

  //   });
  //   // console.log(`dddddddddddd`, value.name);
  //   let errors = this.state.errors;

  //   switch (name) {
  //     case 'imageFile':
  //       errors.imageFile = (!value) ? 'Please select file to upload.' : '';
  //       break;
  //     default:
  //       //(!value) ? '' :'This standard is required.'
  //       break;
  //   }


  //   this.setState({ errors, [name]: value }, () => {

  //   })
  // }

  // handleAddImage(e) {
  //   // console.log(`valuuueeeee`, e.target.file);
  //   // debugger;
  //   this.setState({ loading: true });
  //   let imgData = this.state.imagePath;
  //   let errors = this.state.errors;
  //   errors.imageFile = '';
  //   errors.imageTag = '';
  //   let imgTag = this.state.imageTag;
  //   let imgfile = this.state.imageFile;
  //   let index = this.state.imagePath.findIndex((ele) => {

  //     let a = ele.imageTag == `<${imgTag}>`;

  //     return a
  //   })
  //   // console.log(`imageFile`, this.state.imageFile.name);
  //   if (imgTag != undefined && imgTag != "" && imgfile != undefined && imgfile != "" && index === -1) {
  //     // if (true) {
  //     //upload
  //     const apiroute = window.$APIPath;
  //     let rurl = apiroute + '/api/BE_ReportBuilder/UploadReportBuilderImage';
  //     let files = imgfile;
  //     const data = new FormData();
  //     data.append(`file`, files);
  //     axiosInstance.post(rurl, data, {
  //       // receive two    parameter endpoint url ,form data
  //     }).then(result => {
  //       // console.log(result);
  //       // console.log(imgTag);
  //       imgData.push({ id: 0, reportBuilderId: this?.state?.reportBuilderId, imageFile: result.data?.outdata?.dbPath, imageTag: ("<" + imgTag + ">") });
  //       this.setState({
  //         imageTag: "",
  //         imageFile: undefined,
  //         imagePath: imgData,
  //         loading: false,
  //         fileKey: this.state.fileKey ? "" : "1",
  //       });
  //       toast.success("Image uploaded successfully.")
  //     }).finally(() => {
  //       this.setState({
  //         loading: false,
  //       });
  //     })


  //     //upload
  //   } else {
  //     if (imgTag == undefined || imgTag == "") {
  //       errors.imageTag = "Please enter image tag.";
  //     }

  //     if (index !== -1) {
  //       errors.imageTag = "Please use a diffrent tag name "
  //     }
  //     if (imgfile == undefined || imgfile == "") {
  //       errors.imageFile = "Please select file.";
  //     }
  //     this.setState({
  //       loading: false
  //     });
  //   }



  // }

  // deleteImage(e, id, index) {
  //   // e.preventDefault();
  //   // debugger;
  //   //const curremployees = this.state.employees;
  //   this.setState({ loading: true });
  //   let imgArr = this.state.imagePath;
  //   // console.log("imagePathimaagePath")

  //   if (id == 0) {
  //     this.setState({
  //       imagePath: imgArr.splice(index + 1, 1),
  //       loading: false
  //     });
  //   }
  //   else {
  //     var userToken = JSON.parse(localStorage.getItem('AUserToken'));
  //     let userId = userToken.userId;
  //     const apiroute = window.$APIPath;
  //     const url = apiroute + '/api/BE_ReportBuilder/DeleteReportBuilderImage?id=' + id + '&userId=' + userId + '';

  //     axiosInstance.delete(url, {
  //       headers: {
  //         'Content-Type': 'application/json; charset=utf-8'
  //       }
  //     }).then(result => {
  //       // console.log("Hii", result.data)
  //       if (result.data.flag) {
  //         this.setState({
  //           imagePath: imgArr.filter(d => d.id !== id),
  //           loading: false
  //         });
  //         // console.log("imagePat", this.state.imagePath)
  //         // toast.success(result.data.message);
  //         toast.error("Record removed successfully.")
  //       }
  //     })
  //       .catch(error => {
  //         toast.error(error.message)
  //         this.setState({ authError: true, error: error.message, loading: false });
  //       });
  //   }
  // }

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

    const { loading, diseasecategories, diseaseCategoryId, reportBuilderId, title, headingTitle, description, errors, type,
      isNewPage, imagePath, imageTag, imageFile, imageName, fileKey } = this.state;

    return (

      <div className="animated fadeIn">
        {this.loader()}
        <Row className="mb-3">
          <Col xs="11" lg="11">
            <h5 className="mt-2"><i className="fa fa-align-justify"></i> Report Detail </h5>
          </Col>
          <Col xs="1" lg="1">
            <Link to="/master/Admereport/list">
              <button className="btn btn-primary btn-block">List</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="12">
            {/* {!loading ? (*/}
            <Card>
              {/* {
                console.log("imagePath:::", this.state.imagePath)

              } */}
              <CardBody>
                <Form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                  <Row>
                    {/* <Col xs="6">
                      <FormGroup>
                        <Label>Report Type <span className="requiredField">*</span></Label>
                        <Input className={errors.diseaseCategory ? "is-invalid" : "is-valid"} type="select" name="diseaseCategoryId" tabIndex="1" value={diseaseCategoryId} onChange={this.handleInputChange.bind(this)}>
                          <option value="">Select report type  </option>
                          {diseasecategories
                            .map((data, i) => {
                              return (<option key={i} value={data.diseaseCategoryId}>{data.diseaseCategoryName}</option>);
                            })}
                        </Input>
                        {<span className='error'>{errors.diseaseCategory}</span>}
                      </FormGroup>
                    </Col> */}
                    {/* <Col xs="3">
                      <FormGroup>
                        <Label>Type</Label>
                        <Row>
                          <Col xs="5" lg="5" xl="3">
                            <div className="custom-control custom-radio">
                              {type == "S" ?
                                <Input type="radio" className="custom-control-input" value="S" onClick={this.handleInputChange.bind(this)} checked id="Male" name="type" tabIndex="2" />
                                : <Input type="radio" className="custom-control-input" value="S" onClick={this.handleInputChange.bind(this)} id="Male" name="type" tabIndex="2" />
                              }
                              <Label className="custom-control-label" htmlFor="Male">Static</Label>
                            </div>
                          </Col>
                          <Col xs="5" lg="5" xl="4">
                            <div className="custom-control custom-radio">
                              {type == "D" ?
                                <Input type="radio" checked className="custom-control-input" value="D" onClick={this.handleInputChange.bind(this)} id="Female" name="type" tabIndex="3" />
                                :
                                <Input type="radio" className="custom-control-input" value="D" onClick={this.handleInputChange.bind(this)} id="Female" name="type" tabIndex="3" />
                              }
                              <Label className="custom-control-label" htmlFor="Female">Dynamic</Label>
                            </div>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col> */}
                    {/* <Col xs="3">
                      <FormGroup>
                        <Label>Title on New Page</Label>
                        <div className="custom-control custom-radio">
                          {isNewPage == true ?
                            <Input className="form-check-input" type="checkbox" tabIndex="4" id="chk" checked name="isNewPage" onChange={this.handleInputChangeChk.bind(this)} />
                            :
                            <Input className="form-check-input" type="checkbox" tabIndex="4" id="chk" name="isNewPage" onChange={this.handleInputChangeChk.bind(this)} />
                          }
                        </div>
                      </FormGroup>
                    </Col> */}
                    {/* <Col xs="12">
                      <ReactTooltip
                        anchorId="Summary Title"
                        place="right"
                        variant="info"
                        content={"This is summary title for index page."}

                      />
                      <FormGroup>
                        <Label id="Summary Title">Summary Title</Label>
                        <Input autoComplete="off" type="text" className={errors.headingTitle ? "is-invalid" : "is-valid"} name="headingTitle" value={headingTitle} onChange={this.handleInputChange.bind(this)} placeholder="Please enter summary title" tabIndex="3" maxLength="100" />
                        {<span className='error'>{errors.headingTitle}</span>}
                      </FormGroup>
                    </Col> */}
                    <Col xs="12">
                      <FormGroup>
                        <Label>Title<span className="requiredField">*</span></Label>
                        <Input type="text" autoComplete="off" className={errors.title ? "is-invalid" : "is-valid"} name="title" value={title} onChange={this.handleInputChange.bind(this)} placeholder="Please enter title" tabIndex="3" maxLength="100" />
                        {<span className='error'>{errors.title}</span>}
                      </FormGroup>
                    </Col>


                    <Col xs="12">
                      <FormGroup>
                        <Label>Description </Label>
                        <Grammarly clientId="client_Mygif7MAqrmjKVPfFwatyC">
                          <GrammarlyEditorPlugin>
                            <CKEditor
                              editor={ClassicEditor}
                              spellcheck={true}
                              config={{
                                placeholder: "Please enter description",
                                // mention: {
                                //   feeds: [
                                //     {
                                //       marker: '@',
                                //       feed: this.getFeedItems
                                //     }]
                                // },
                                simpleUpload: {
                                  // The URL that the images are uploaded to.
                                  // uploadUrl: window.$APIPath + '/api/BE_ReportBuilder/UploadRportBuilderCkeditorImage',
                                  uploadUrl: window.$APIPath + BE_ReportBuilder_UploadRportBuilderCkeditorImage,

                                  // Enable the XMLHttpRequest.withCredentials property.
                                  // withCredentials: true,

                                  // Headers sent along with the XMLHttpRequest to the upload server.
                                  headers: {
                                    'X-CSRF-TOKEN': 'CSRF-Token',
                                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('OnlyToken'))}`

                                  }
                                }
                              }}
                              data={description ?? ""}
                              //onReady={editor => {
                              // You can store the "editor" and use when it is needed.
                              //console.log('Editor is ready to use!', editor);
                              //}}
                              onChange={(event, editor) => {
                                const data = editor?.getData();
                                this.setState({ description: data });
                                errors.description = '';
                              }}
                            />
                          </GrammarlyEditorPlugin>
                        </Grammarly>
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr />

                  {/* <Row>
                    <Col xs="11">
                      <FormGroup>
                        <h5 className="mt-2">Upoad Image (If Any)</h5>
                      </FormGroup>
                    </Col>
                    <Col xs="5">
                      <FormGroup>
                        <Label>Image Tag</Label>
                        <Input type="text" className={errors.imageTag ? "is-invalid" : "is-valid"} name="imageTag" value={imageTag} onChange={this.handleInputChange.bind(this)} placeholder="Please enter image tag" tabIndex="6" maxLength="150" />
                        {<span className='error'>{errors.imageTag}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="5">
                      <FormGroup>
                        <Label>File<span className="requiredField">*</span></Label>
                        <Input type="file" className={`${errors.imageFile ? "is-invalid" : "is-valid"} form-control`} name="" tabIndex="6" id="File" onChange={this.handleFileInputChange.bind(this)} key={fileKey} />
                        {<span className='error'>{errors.imageFile}</span>}
                      </FormGroup>
                    </Col>
                    <Col xs="2">
                      {
                        this.state.isEdit ? <>
                          <FormGroup>
                            <Button style={{ "marginTop": "28px" }} type="button" tabIndex="7" disabled={loading} onClick={this.handleAddImage.bind(this)} color="primary"><i className="fa fa-dot-circle-o"></i> Add</Button>
                          </FormGroup>
                        </> : null
                      }

                    </Col>
                  </Row>  */}
                  {/* {imagePath.length > 0 ? (
                    <Row>
                      <Col xs="12">
                        <span className='error'><b>Note: Use below tags in the "Description" where you want to show your selected image.</b></span>
                        <Table responsive bordered key="tblImage">
                          <thead className="thead-light">
                            <tr>
                              <th>Image Tag</th>
                              {
                                this.state.isEdit ? <>
                                  <th>Delete</th>
                                </> : null
                              }
                            </tr>
                          </thead>
                          {
                            console.log("DataIddd::", imagePath)
                          }
                          <tbody>
                            {imagePath
                              .map((data, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{data.imageTag}</td>
                                    {
                                      this.state.isEdit ? <>
                                        <td>
                                          <Confirm title="Confirm" description="Are you sure want to delete this tag?">
                                            {confirm => (
                                              <Link className="card-header-action btn btn-close" to="#" onClick={confirm(e => this.deleteImage(e, data.id, i))}><i className="icon-trash"></i></Link>
                                            )}
                                          </Confirm>
                                        </td>
                                      </> : null
                                    }

                                  </tr>
                                )
                              })}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  ) : null} */}
                  <Row>
                    <Col xs="12">
                      <FormGroup className="formButton">
                        <Input type="hidden" name="reportBuilderId" value={reportBuilderId} />
                        {
                          this.state.isEdit ? <>
                            <Button type="submit" disabled={loading} color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button><span>{" "}</span>
                          </> : null}

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
      </div>
    );
  }
}

export default AdmeDetails;
