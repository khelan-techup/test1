//login.js file
export const LOGIN = "/api/BE_OrganizationUser/signin"

//dashboard.ja file
export const BE_Dashboard_GetMainAllcount = "/api/BE_Dashboard/GetMainAllcount"
export const BE_Dashboard_GetAll = "/api/BE_Dashboard/GetAll"
export const BE_OrganizationUser_UpdateTooltipSteps = "/api/BE_OrganizationUser/UpdateTooltipSteps"
//PatientProfile.js file
export const BE_Patient_GetProfile = "/api/BE_Patient/GetProfile"
//Role.js File
export const BE_Role_GetAllPaging = '/api/BE_Role/GetAllPaging';
export const BE_Role_Delete = (id, userId) => {
    return '/api/BE_Role/Delete?id=' + id + '&userId=' + userId + '';
}
//RoleModule Details.js
export const BE_RoleModule_GetDropdownEdit = (paramId) => {
    return '/api/BE_RoleModule/GetDropdownEdit?id=' + paramId;
}

export const BE_RoleModule_GetDropdown = '/api/BE_RoleModule/GetDropdown';

export const BE_RoleModule_Save = '/api/BE_RoleModule/Save';
export const BE_RoleModule_Update = '/api/BE_RoleModule/Update';
//RoleModule.js
export const BE_RoleModule_GetAllPaging = '/api/BE_RoleModule/GetAllPaging';
export const BE_RoleModule_Delete = (id) => {
    return '/api/BE_RoleModule/Delete?id=' + id + '';
}

//OrganizationUser.js
export const BE_OrganizationUser_GetAllPaging = "/api/BE_OrganizationUser/GetAllPaging";
export const BE_OrganizationUser_Delete = (id, userId) => {
    return "/api/BE_OrganizationUser/Delete?id=" + id + "&userId=" + userId + '';
}

// OrganizationUser > Details.js
export const BE_Role_GetAll = "/api/BE_Role/GetAll";
export const BE_OrganizationUser_GetById = (id) => {
    return "/api/BE_OrganizationUser/GetById?id=" + id + "";
}
export const BE_OrganizationUser_Save = "/api/BE_OrganizationUser/Save";
export const BE_OrganizationUser_Update = "/api/BE_OrganizationUser/Update";

// Disease.js
export const BE_DiseaseCategory_GetAllDRP = "/api/BE_DiseaseCategory/GetAllDRP";
export const BE_Disease_GetAllPaging = "/api/BE_Disease/GetAllPaging";
export const BE_Disease_Delete = (id, userId) => {
    return "/api/BE_Disease/Delete?id=" + id + "&userId=" + userId + "";
}
export const BE_Disease_VerifyDisease = "/api/BE_Disease/VerifyDisease";
export const BE_Common_GetPatientDropdownEntity = "/api/BE_Common/GetPatientDropdownEntity";
export const BE_DiseaseCategory_GetSubAllDRP = (id) => {
    return "/api/BE_DiseaseCategory/GetSubAllDRP?id=" + id + "";
}

//Disease Details.js
export const BE_Disease_GetById = (id) => {
    return '/api/BE_Disease/GetById?id=' + id + '';
}
export const BE_Disease_Save = '/api/BE_Disease/Save';
export const BE_Disease_Update = '/api/BE_Disease/Update';

//Tissue > Tissue.js
export const BE_Tissue_GetAllPaging = '/api/BE_Tissue/GetAllPaging';
export const BE_Tissue_Delete = (id, userId) => {
    return '/api/BE_Tissue/Delete?id=' + id + '&userId=' + userId + '';
}
export const BE_Tissue_VerifyDisease = "/api/BE_Tissue/VerifyDisease";

//Tissue > Details.js
export const BE_Tissue_GetById = (id, did) => {
    return '/api/BE_Tissue/GetById?id=' + id + '&did=' + did;
}
export const BE_Disease_GetDRPAll = '/api/BE_Disease/GetDRPAll';
export const BE_Tissue_Save = '/api/BE_Tissue/Save';
export const BE_Tissue_Update = '/api/BE_Tissue/Update';

// Neoantegen Neoantigen.js
export const BE_Patient_GetAll = '/api/BE_Patient/GetAll';
export const BE_Neoantigen_GetAllPaging = '/api/BE_Neoantigen/GetAllPaging';
export const BE_Neoantigen_Delete = (id, userId) => {
    return '/api/BE_Neoantigen/Delete?id=' + id + '&userId=' + userId + '';
}
export const BE_Neoantigen_GetById = (NeoantigenId) => {
    return '/api/BE_Neoantigen/GetById?id=' + NeoantigenId + '';
}
export const BE_Neoantigen_Save = '/api/BE_Neoantigen/Save';
export const BE_Neoantigen_Update = '/api/BE_Neoantigen/Update';
export const BE_Neoantigen_ImportData = '/api/BE_Neoantigen/ImportData';
export const BE_SampleType_GetAll = '/api/BE_SampleType/GetAll';
export const BE_SampleType_Delete = (id, userId) => {
    return '/api/BE_SampleType/Delete?id=' + id + '&userId=' + userId + '';
}

// Report > Report.js
export const BE_DiseaseCategory_GetAll = '/api/BE_DiseaseCategory/GetAll';
export const BE_ReportBuilder_GetAll = '/api/BE_ReportBuilder/GetAll';
export const BE_ReportBuilder_Delete = (id, userId) => {
    return '/api/BE_ReportBuilder/Delete?id=' + id + '&userId=' + userId + '';
}
export const BE_ReportBuilder_UpdateSequence = '/api/BE_ReportBuilder/UpdateSequence';

//Report > Details.js
export const BE_ReportBuilder_GetById = (id) => {
    return '/api/BE_ReportBuilder/GetById?id=' + id + '';
}

export const BE_ReportBuilder_Save = '/api/BE_ReportBuilder/Save';
export const BE_ReportBuilder_Update = '/api/BE_ReportBuilder/Update';

export const BE_ReportBuilder_UploadReportBuilderImage = '/api/BE_ReportBuilder/UploadReportBuilderImage';

export const BE_ReportBuilder_DeleteReportBuilderImage = (id, userId) => {
    return '/api/BE_ReportBuilder/DeleteReportBuilderImage?id=' + id + '&userId=' + userId + '';
}

export const BE_ReportBuilder_UploadRportBuilderCkeditorImage = '/api/BE_ReportBuilder/UploadRportBuilderCkeditorImage'


//ReportAdmiTox > Report.js
export const AdmeToxBuilder_GetAll = '/api/AdmeToxBuilder/GetAll';
export const AdmeToxBuilder_Delete = (id, userId) => {
    return '/api/AdmeToxBuilder/Delete?id=' + id + '&userId=' + userId + '';
}
export const AdmeToxBuilder_UpdateSequence = '/api/AdmeToxBuilder/UpdateSequence';

//ReportAdmiTox > Details.js

export const AdmeToxBuilder_GetById = (id) => {
    return '/api/AdmeToxBuilder/GetById?id=' + id + '';
}

export const AdmeToxBuilder_Save = '/api/AdmeToxBuilder/Save';
export const AdmeToxBuilder_Update = '/api/AdmeToxBuilder/Update';

// GeneProtien > GeneProtien.js
export const BE_Common_GetPatientDropdown = "/api/BE_Common/GetPatientDropdown";
export const BE_PatientAccessionMapping_GetAllPaging = "/api/BE_PatientAccessionMapping/GetAllPaging";


export const BE_GeneProtienData_GetAllPaging = '/api/BE_GeneProtienData/GetAllPaging';

export const BE_GeneProtienData_DeleteGeneProtien = (id, userId) => {
    return '/api/BE_GeneProtienData/DeleteGeneProtien?id=' + id + '&userId=' + userId + '';
}
export const BE_GeneProtienData_GetGeneProtienById = (geneProtienDataId) => {
    return '/api/BE_GeneProtienData/GetGeneProtienById?id=' + geneProtienDataId + '';
}

export const BE_GeneProtienData_SaveGeneProtien = '/api/BE_GeneProtienData/SaveGeneProtien';
export const BE_GeneProtienData_UpdateGeneProtien = '/api/BE_GeneProtienData/UpdateGeneProtien';


//Hallmark > Hallmark.js

export const BE_GeneHallmarkMaster_GetCancerHallMarkNos = '/api/BE_GeneHallmarkMaster/GetCancerHallMarkNos';
export const BE_GeneProtienHallmark_GetAllPaging = '/api/BE_GeneProtienHallmark/GetAllPaging';


export const BE_GeneProtienHallmark_DeleteGeneHallmark = (id, userId) => {
    return '/api/BE_GeneProtienHallmark/DeleteGeneHallmark?id=' + id + '&userId=' + userId + '';
}

export const BE_GeneProtienHallmark_GetGeneHallmarkById = (GeneHallmarkReferenceId) => {
    return '/api/BE_GeneProtienHallmark/GetGeneHallmarkById?id=' + GeneHallmarkReferenceId + '';
}

export const BE_GeneProtienHallmark_SaveGeneHallmark = '/api/BE_GeneProtienHallmark/SaveGeneHallmark';

export const BE_GeneProtienHallmark_UpdateGeneHallmark = '/api/BE_GeneProtienHallmark/UpdateGeneHallmark';

export const BE_GeneHallmarkMaster_GetHallmarkTitleByNo = (choiceValueForMulti) => {
    return '/api/BE_GeneHallmarkMaster/GetHallmarkTitleByNo?nos=' + choiceValueForMulti;
}

export const BE_GeneHallmarkMaster_GetAllPaging = '/api/BE_GeneHallmarkMaster/GetAllPaging';

//CancelHallmark > CancerHallmark.js
export const BE_GeneHallmarkMaster_DeleteCancerHallmarks = (id, userId) => {
    return '/api/BE_GeneHallmarkMaster/DeleteCancerHallmarks?id=' + id + '&userId=' + userId + '';
}
export const BE_GeneHallmarkMaster_GetCancerHallmarksById = (Hid) => {
    return '/api/BE_GeneHallmarkMaster/GetCancerHallmarksById?id=' + Hid + '';
}
export const BE_GeneHallmarkMaster_SaveCancerHallmarks = '/api/BE_GeneHallmarkMaster/SaveCancerHallmarks';
export const BE_GeneHallmarkMaster_UpdateCancerHallmarks = '/api/BE_GeneHallmarkMaster/UpdateCancerHallmarks';

//Doctor > DoctorDetails > Doctor.js

export const BE_Practitioner_GetAllPaging = '/api/BE_Practitioner/GetAllPaging'; // const url = apiroute + '/api/BE_Practitioner/GetAllPaging';

export const BE_Practitioner_Delete = (id, userId) => {
    return '/api/BE_Practitioner/Delete?id=' + id + '&userId=' + userId + '';
}

export const BE_CognitoMail_RegisterUser = (id, userId) => {
    return '/api/BE_CognitoMail/RegisterUser?id=' + id + '&uid=' + userId + '';
}
export const BE_Practitioner_ApproveIRBNo = (id) => {
    return '/api/BE_Practitioner/ApproveIRBNo?id=' + id + '';
}
export const BE_Practitioner_RejectIRBNo = (id) => {
    return '/api/BE_Practitioner/RejectIRBNo?id=' + id + '';
}
export const BE_Practitioner_SetDiscount = (id, isDiscount) => {
    return '/api/BE_Practitioner/SetDiscount?id=' + id + '&discount=' + isDiscount + '';
}
//Doctor > DoctorDetails > Details.js
export const BE_Common_GetAllCountry = "/api/BE_Common/GetAllCountry";
export const BE_Practitioner_GetById = (id) => {
    return "/api/BE_Practitioner/GetById?id=" + id + "";
}

export const BE_Common_GetStateByCountryId = (countryId) => {
    return "/api/BE_Common/GetStateByCountryId?Id=" + countryId
}

export const BE_Practitioner_DeletePractitionerContactPerson = (id) => {
    return "/api/BE_Practitioner/DeletePractitionerContactPerson?id=" + id + "";
}
export const BE_Practitioner_DeletePractitionerMedical = (id) => {
    return "/api/BE_Practitioner/DeletePractitionerMedical?id=" + id + "";
}

export const BE_Practitioner_Save = "/api/BE_Practitioner/Save";

export const BE_Practitioner_Update = "/api/BE_Practitioner/Update";

export const BE_Common_GetCityByStateId = (ResidentStateId) => {
    return "/api/BE_Common/GetCityByStateId?Id=" + ResidentStateId;
}

//Doctor > DoctorPatient > DoctorPatient.js

export const BE_PractitionerPatient_GetPatientsByPractitionerIdPaging = '/api/BE_PractitionerPatient/GetPatientsByPractitionerIdPaging';

export const BE_PractitionerPatient_DeletePatient = (patientId, id) => {
    return '/api/BE_PractitionerPatient/DeletePatient?id=' + patientId + '&userId=' + id + '';
}

//Doctor > DoctorPatient > Details.js
export const BE_Patient_GetById = (id) => {
    return '/api/BE_Patient/GetById?id=' + id + '';
}

//NGSLaboratory > NGSLaboratoryDetails > NGSLaboratoryDetails.js
export const BE_NGSLaboratory_GetAllPaging = "/api/BE_NGSLaboratory/GetAllPaging";

export const BE_NGSLaboratory_Delete = (id, userId) => {
    return '/api/BE_NGSLaboratory/Delete?id=' + id + "&userId=" + userId + "";
}
export const BE_NGSLabSample_BulkDelete = "/api/BE_NGSLabSample/BulkDelete";
export const BE_SampleType_GetSampleTypebyCatId = (id) => {
    return "/api/BE_SampleType/GetSampleTypebyCatId?id=" + id + "";
}
export const BE_NGSLabSample_Save = "/api/BE_NGSLabSample/Save";

//NGSLaboratory > NGSLaboratoryDetails > Details.js
export const BE_NGSLaboratory_GetById = (id) => {
    return "/api/BE_NGSLaboratory/GetById?id=" + id + "";
}
export const BE_NGSLaboratory_Save = "/api/BE_NGSLaboratory/Save";
export const BE_NGSLaboratory_Update = "/api/BE_NGSLaboratory/Update";
export const BE_NGSLaboratory_DeleteNGSLabContactPerson = (id) => {
    return "/api/BE_NGSLaboratory/DeleteNGSLabContactPerson?id=" + id + "";
}

//NGSLaboratory > NGSLaboratoryPatient > NGSLaboratoryPatient.js

export const BE_NGSLaboratoryPatient_getNGSLaboratoryPatientsPaging = '/api/BE_NGSLaboratoryPatient/getNGSLaboratoryPatientsPaging';


export const BE_NGSLaboratoryPatient_DeletePatient = (id, userId) => {
    return '/api/BE_NGSLaboratoryPatient/DeletePatient?id=' + id + '&userId=' + userId + '';
}


export const NGSLabPayment_DoPayment = '/api/NGSLabPayment/DoPayment';
export const NGSLabPayment_InsertPONew = '/api/NGSLabPayment/InsertPONew'
export const NGSLabPayment_DeletePOFile = (id) => {
    return '/api/NGSLabPayment/DeletePOFile?id=' + id + '';
}

export let BE_NGSLaboratorySample_Save = '/api/BE_NGSLaboratorySample/Save';

export const CognitoUserStore_downloadFile = (filepath) => {
    return '/api/CognitoUserStore/downloadFile?fileName=' + filepath + ''
}

//Reports > PatientReports.js
export const BE_OrganizationUser_GetByRoleId = (id) => {
    return "/api/BE_OrganizationUser/GetByRoleId?id=" + id
}

export const BE_Patient_GetAllPatientLogs = '/api/BE_Patient/GetAllPatientLogs';

//Inquiry > Inquiry
export const BE_OrganizationUser_GetLeadAssignees = "/api/BE_OrganizationUser/GetLeadAssignees";
export const BE_NeoInquiry_GetAllcount = '/api/BE_NeoInquiry/GetAllcount';

export const BE_NeoInquiry_GetAllPaging = '/api/BE_NeoInquiry/GetAllPaging';

export const BE_NeoInquiry_DeleteNeoContactInquiry = "/api/BE_NeoInquiry/DeleteNeoContactInquiry"

export const BE_NeoInquiry_DeleteNeoProviderContactInquiry = "/api/BE_NeoInquiry/DeleteNeoProviderContactInquiry"

export const BE_NeoInquiry_DeleteNeoSignupInquiry = "/api/BE_NeoInquiry/DeleteNeoSignupInquiry"

export const BE_NeoInquiry_AssignLead = "/api/BE_NeoInquiry/AssignLead";

//Patient > Patient Details > Patient.js
export const BE_Patient_GetAllPaging = "/api/BE_Patient/GetAllPaging";

export const BE_Patient_Delete = (id, PuserId, userId) => {
    return "/api/BE_Patient/Delete?id=" + id + "&userId=" + PuserId + "&deletedBy=" + userId + "";
}

export const BE_PatientAccessionMapping_Delete = (patientId, pAcceId, userId) => {
    return "/api/BE_PatientAccessionMapping/Delete?patientId=" + patientId + "&pAcceId=" + pAcceId + "&deletedBy=" + userId + "";
}


export const BE_Tissue_GetDRPAllByDiseaseId = "/api/BE_Tissue/GetDRPAllByDiseaseId";

export const BE_Patient_SaveAccessionNo = "/api/BE_Patient/SaveAccessionNo";


