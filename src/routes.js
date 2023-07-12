import React from 'react';
import { Login } from './views/Pages';



const PractitionerIRB = React.lazy(() => import('./views/Pages/PractitionerIRB'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Inquiry = React.lazy(() => import("./views/Inquiry/InquieryList"))
const InquiryDetails = React.lazy(() => import("./views/Inquiry/Details"))
const OldDashboard = React.lazy(() => import('./views/Dashboard/OldDashboard'));
const Profile = React.lazy(() => import('./views/Profile'));
const PatientProfile = React.lazy(() => import('./views/Dashboard/PatientProfile'));
const CustomModal = React.lazy(() => import('./views/CustomModal/CustomModal'));

//const Role = React.lazy(() => import('./views/Role/CustomModal'));
const Role = React.lazy(() => import('./views/Master/Role/Role'));
const RoleDetails = React.lazy(() => import('./views/Master/Role/Details'));

const Disease = React.lazy(() => import('./views/Master/Disease/Disease'));
const DiseaseDetails = React.lazy(() => import('./views/Master/Disease/Details'));

const SampleType = React.lazy(() => import('./views/Master/SampleType/SampleType'));
const SampleTypeDetails = React.lazy(() => import('./views/Master/SampleType/Details'));

const Report = React.lazy(() => import('./views/Master/Report/Report'));
const ReportDetails = React.lazy(() => import('./views/Master/Report/Details'));
const AdmeToxReportDetails = React.lazy(() => import('./views/Master/ReportAdmiTox/Details'));

const Tissue = React.lazy(() => import('./views/Master/Tissue/Tissue'));
const TissueDetails = React.lazy(() => import('./views/Master/Tissue/Details'));

const PortalModule = React.lazy(() => import('./views/Master/PortalModule/PortalModule'));
const PortalModuleDetails = React.lazy(() => import('./views/Master/PortalModule/Details'));

const RoleModule = React.lazy(() => import('./views/Master/RoleModule/RoleModule'));
const RoleModuleDetails = React.lazy(() => import('./views/Master/RoleModule/Details'));

const OrganizationUser = React.lazy(() => import('./views/Master/OrganizationUser/OrganizationUser'));
const OrganizationUserDetails = React.lazy(() => import('./views/Master/OrganizationUser/Details'));

const Neoantigen = React.lazy(() => import('./views/Master/Neoantigen/Neoantigen'));
const GeneProtien = React.lazy(() => import('./views/Master/GeneProtien/GeneProtien'));
const Hallmark = React.lazy(() => import('./views/Master/Hallmark/Hallmark'));
const CancerHallmark = React.lazy(() => import('./views/Master/CancerHallmark/CancerHallmark'));

const Patient = React.lazy(() => import('./views/Patient/PatientDetails/Patient'));
const PatientDetails = React.lazy(() => import('./views/Patient/PatientDetails/Details'));
const DetailsUpdated = React.lazy(() => import('./views/Patient/PatientDetails/DetailsUpdated'));

const PatientUpdatedDetails = React.lazy(() => import('./views/Patient/PatientDetails/UpdatedDetails'));
const PatientViews = React.lazy(() => import('./views/Patient/PatientDetails/View'));

const PPayments = React.lazy(() => import('./views/Patient/PPayments/PPayments'));
const PSamples = React.lazy(() => import('./views/Patient/PSamples/PSamples'));

const DiagnosticDetails = React.lazy(() => import('./views/Patient/PatientDiagnostic/DiagnosticDetail'));
const EmergencyDetails = React.lazy(() => import('./views/Patient/PatientEmergency/EmergencyDetail'));
const InsuranceDetails = React.lazy(() => import('./views/Patient/PatientInsurance/InsuranceDetail'));
const MedicationDetails = React.lazy(() => import('./views/Patient/PatientMedication/MedicationDetail'));

const Doctor = React.lazy(() => import('./views/Doctor/DoctorDetails/Doctor'));
const DoctorDetails = React.lazy(() => import('./views/Doctor/DoctorDetails/Details'));
const DoctorViews = React.lazy(() => import('./views/Doctor/DoctorDetails/View'));
const DoctorPatient = React.lazy(() => import('./views/Doctor/DoctorPatient/DoctorPatient'));
const DoctorPatienDetails = React.lazy(() => import('./views/Doctor/DoctorPatient/Details'));

const Institute = React.lazy(() => import('./views/Institute/InstituteDetails/Institute'));
const InstituteDetails = React.lazy(() => import('./views/Institute/InstituteDetails/Details'));
const InstituteViews = React.lazy(() => import('./views/Institute/InstituteDetails/View'));
const InstitutePatient = React.lazy(() => import('./views/Institute/InstitutePatient/InstitutePatient'));
const InstitutePatienDetails = React.lazy(() => import('./views/Institute/InstitutePatient/Details'));
const InstituteDoctor = React.lazy(() => import('./views/Institute/InstituteDoctor/InstituteDoctor'));
const InstituteDoctorDetails = React.lazy(() => import('./views/Institute/InstituteDoctor/Details'));

const NGSLaboratory = React.lazy(() => import('./views/NGSLaboratory/NGSLaboratoryDetails/NGSLaboratory'));
const NGSLaboratoryAssignSample = React.lazy(() => import('./views/NGSLaboratory/NGSLaboratoryDetails/AssignSample'));
const NGSLaboratoryDetails = React.lazy(() => import('./views/NGSLaboratory/NGSLaboratoryDetails/Details'));
const NGSLaboratoryPatient = React.lazy(() => import('./views/NGSLaboratory/NGSLaboratoryPatient/NGSLaboratoryPatient'));
const NGSLaboratoryPatientDetails = React.lazy(() => import('./views/NGSLaboratory/NGSLaboratoryPatient/Details'));

const Manufacturer = React.lazy(() => import('./views/Manufacturer/ManufacturerDetails/Manufacturer'));
const ManufacturerDetails = React.lazy(() => import('./views/Manufacturer/ManufacturerDetails/Details'));
const ManufacturerPatient = React.lazy(() => import('./views/Manufacturer/ManufacturerPatient/ManufacturerPatient'));
const ManufacturerPatientDetails = React.lazy(() => import('./views/Manufacturer/ManufacturerPatient/Details'));

const PaymentHistory = React.lazy(() => import('./views/Account/PaymentHistory/PaymentHistory'));
const PatientPayment = React.lazy(() => import('./views/Account/PatientPayment/PatientPayment'));
const AccountActivity = React.lazy(() => import('./views/Account/AccountActivity/AccountActivity'));

const DesignActivity = React.lazy(() => import('./views/PatientActivity/DesignActivity/DesignActivity'));
const DesignPatientActivity = React.lazy(() => import('./views/PatientActivity/DesignActivity/DesignPatientActivity'));
const DesignPatientActivityDetail = React.lazy(() => import('./views/PatientActivity/DesignActivity/DesignPatientActivityDetail'));
const DesignActivityDataFile = React.lazy(() => import('./views/PatientActivity/DesignActivity/DesignActivityDataFile'));
const PatientReportDetail = React.lazy(() => import('./views/PatientActivity/DesignActivity/PatientReportDetail'));
const AdmePatientReportDetail = React.lazy(() => import('./views/PatientActivity/DesignActivity/PatientAdmeReportDetail'));
// const AdmeToxReportDetails = React.lazy(() => import('./views/master/ReportAdmiTox/Details'));
const PMRVerfied = React.lazy(() => import('./views/PatientActivity/DesignActivity/PMRVerfied'));
const PMRApprove = React.lazy(() => import('./views/PatientActivity/DesignActivity/PMRApprove'));
const PatientHealthIndexReportDetail = React.lazy(() => import('./views/PatientActivity/DesignActivity/PatientHealthIndexReportDetail'));

const LabManuActivity = React.lazy(() => import('./views/PatientActivity/LabManuActivity/LabManuActivity'));
const LabActivity = React.lazy(() => import('./views/PatientActivity/LabActivity/LabActivity'));
const ManuActivity = React.lazy(() => import('./views/PatientActivity/ManuActivity/ManuActivity'));
// const Users = React.lazy(() => import('./views/Users/Users'));
// const User = React.lazy(() => import('./views/Users/User'));
const PmrReport = React.lazy(() => import("./views/pmrReport/generatePmrReport"))
const TissueTest = React.lazy(() => import("./views/Master/Tissue/1.js"))
const patientReports = React.lazy(() => import("./views/Reports/patientReports"))
const ListAdmi = React.lazy(() => import("./views/Master/ReportAdmiTox/Report"))
const emailData = React.lazy(() => import("./views/Patient/Emailactivities/emailData"))
const emailcontent = React.lazy(() => import("./views/Patient/Emailactivities/emailcontent"))
const awsconfig = React.lazy(() => import("./views/Patient/Emailactivities/awsconfig"))
// const HandleNavigation = React.lazy(() => import("./views/handleNavigation/HandleNavigation.js"))


const routes = [
  { path: '/master/tissues/test/:id/:parentDid/:childDid', name: 'Tissue Details', component: TissueTest },
  { path: '/', exact: true, name: 'Dashboard' },
  { path: "/inquiry", exact: true, name: "Inquiry", component: Inquiry },
  { path: "/inquiry/details/:type/:id", exact: true, name: "Details", component: InquiryDetails },
  { path: '/practitioner/irb/approval/:id', exact: true, name: 'Home', component: PractitionerIRB },
  { path: '/dashboard', name: '', component: Dashboard },
  { path: '/olddashboard', name: 'OldDashboard', component: OldDashboard },
  { path: '/master/Admereport/list', name: 'AdmeTox', component: ListAdmi },
  { path: '/master/Admereport/AdmeDetails', name: 'Adme Tox Report Details', component: AdmeToxReportDetails },
  { path: '/master/Admereport/modify/:id', name: 'Adme Tox Report Details', component: AdmeToxReportDetails },

  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/patientprofile/:id/:aid', name: 'Patient Detail', component: PatientProfile },
  { path: '/master', exact: true, name: 'Master', component: Role },
  { path: '/account', exact: true, name: 'Account', component: PatientPayment },
  { path: '/patientactivity', exact: true, name: 'PatientActivity', component: DesignActivity },
  { path: '/report/list', exact: true, name: 'Patient Tracker', component: patientReports },
  { path: '/master/role/list', name: 'Role', component: Role },
  { path: '/master/role/details', name: 'Role Details', component: RoleDetails },
  { path: '/master/role/modify/:id', name: 'Role Details', component: RoleDetails },

  { path: '/master/diseases/list', name: 'Disease', component: Disease },
  { path: '/master/diseases/details', name: 'Disease Details', component: DiseaseDetails },
  { path: '/master/diseases/modify/:id', name: 'Disease Details', component: DiseaseDetails },

  { path: '/master/sampletype/list', name: 'Sample Type', component: SampleType },
  { path: '/master/sampletype/details', name: 'Sample Type Details', component: SampleTypeDetails },
  { path: '/master/sampletype/modify/:id', name: 'Sample Type Details', component: SampleTypeDetails },

  { path: '/master/report/list', name: 'Report Builder', component: Report },
  { path: '/master/report/details', name: 'Report Details', component: ReportDetails },
  { path: '/master/report/modify/:id', name: 'Report Details', component: ReportDetails },

  { path: '/master/tissues/list', name: 'Tissue', component: Tissue },
  { path: '/master/tissues/details', name: 'Tissue Details', component: TissueDetails },
  { path: '/master/tissues/modify/:id/:parentDid/:childDid', name: 'Tissue Details', component: TissueDetails },

  { path: '/master/portalmodule/list', name: 'Portal Module', component: PortalModule },
  { path: '/master/portalmodule/details', name: 'Portal Module Details', component: PortalModuleDetails },
  { path: '/master/portalmodule/modify/:id', name: 'Portal Module Details', component: PortalModuleDetails },

  { path: '/master/rolemodule/list', name: 'Role Module Mapping', component: RoleModule },
  { path: '/master/rolemodule/details', name: 'Role Module Mapping Details', component: RoleModuleDetails },
  { path: '/master/rolemodule/modify/:id', name: 'Role Module Mapping Details', component: RoleModuleDetails },

  { path: '/master/organizationuser/list', name: 'Organization User', component: OrganizationUser },
  { path: '/master/organizationuser/details', name: 'Organization User Details', component: OrganizationUserDetails },
  { path: '/master/organizationuser/modify/:id', name: 'Organization User Details', component: OrganizationUserDetails },

  { path: '/master/neoantigen', name: 'Neoantigen', component: Neoantigen },
  { path: '/master/geneprotiens/list', name: 'Gene/Protein Description', component: GeneProtien },
  { path: '/master/genehallmark/list', name: 'Gene Hallmarks', component: Hallmark },
  { path: '/master/cancerhallmark/list', name: 'Cancer Hallmarks', component: CancerHallmark },

  // { path: '/patients/list', name: 'Patient', component: Patient },
  { path: '/patients/list', name: '', component: Patient },
  { path: '/patients/details', name: 'Patient Details', component: PatientDetails },

  { path: '/settings/emaildata', name: 'Email Details', component: emailData },
  { path: '/settings/emailcontent', name: 'Email Details', component: emailcontent },
  { path: '/settings/awsconfig', name: 'Email Details', component: awsconfig },

  { path: '/patientsDetails/addaccesion/:id/:aid', name: 'Patient Details add', component: PatientDetails },

  { path: '/patients/info/:id/:aid', name: 'Patient Info', component: PatientViews },
  { path: '/patients/admininfo/:id/:aid', name: 'Patient Info', component: DetailsUpdated },
  { path: '/patients', exact: true, name: 'Patients List', component: "" },

  { path: '/patients/diagnostic', name: 'Diagnostic Details', component: DiagnosticDetails },
  { path: '/patients/emergencycontact', name: 'Emergency Contact', component: EmergencyDetails },
  { path: '/patients/insurance', name: 'Insurance Details', component: InsuranceDetails },
  { path: '/patients/medication', name: 'Medication Details', component: MedicationDetails },

  /*{ path: '/patients/modify/:id', name: 'Patient Details', component: PatientDetails },*/
  { path: '/patients/modify/:id', name: 'Patient Details', component: PatientUpdatedDetails },
  { path: '/patients/payment', name: 'Patient Payment', component: PPayments },
  { path: '/patients/paymentDetail/:id', name: 'Patient Payment', component: PPayments },
  { path: '/patients/specimen', name: 'Patient Specimen Collection', component: PSamples },

  // { path: '/practitioners/list', name: 'Practitioner', component: Doctor },
  { path: '/practitioners/list', name: '', component: Doctor },
  { path: '/practitioners', exact: true, name: 'Practitioner', component: "" },
  { path: '/practitioners/details', name: 'Practitioner Details', component: DoctorDetails },
  { path: '/practitioners/modify/:id', name: 'Practitioner Details', component: DoctorDetails },
  { path: '/practitioners/info/:id', name: 'Practitioner Info', component: DoctorViews },
  { path: '/practitioners/patients/:id', name: 'Practitioner Patient', component: DoctorPatient },
  { path: '/practitioners/patientsInfo/:id', name: 'Patient Info', component: DoctorPatienDetails },

  { path: '/institutes/list', name: 'institution', component: Institute },
  { path: '/institutes/details', name: 'institution Details', component: InstituteDetails },
  { path: '/institutes/modify/:id', name: 'institution Details', component: InstituteDetails },
  { path: '/institutes/info/:id', name: 'institution Info', component: InstituteViews },
  { path: '/institutes/patients/:id', name: 'institution Patient', component: InstitutePatient },
  { path: '/institutes/patientsinfo/:id', name: 'Patient Info', component: InstitutePatienDetails },
  { path: '/institutes/practitioners/:id', name: 'institution Practitioner', component: InstituteDoctor },
  { path: '/institutes/practitionerinfo/:id', name: 'Practitioner Info', component: InstituteDoctorDetails },
  // NGSLaboratoryAssignSample
  { path: '/ngslaboratory/list', name: '', component: NGSLaboratory },
  // { path: '/ngslaboratory/list', name: 'Laboratory', component: NGSLaboratory },
  { path: '/ngslaboratory', exact: true, name: 'Laboratory List', component: "" },
  { path: '/ngslaboratory/samples/:labId', name: 'Laboratory', component: NGSLaboratoryAssignSample },
  { path: '/ngslaboratory/details', name: 'Laboratory Details', component: NGSLaboratoryDetails },
  { path: '/ngslaboratory/modify/:id', name: 'Laboratory Details', component: NGSLaboratoryDetails },
  { path: '/ngslaboratory/patients/:id', name: 'Laboratory Patient', component: NGSLaboratoryPatient },
  { path: '/ngslaboratory/patientsinfo/:id', name: 'Patient Info', component: NGSLaboratoryPatientDetails },

  { path: '/manufacturer/list', name: 'Manufacturer', component: Manufacturer },
  { path: '/manufacturer/details', name: 'Manufacturer Details', component: ManufacturerDetails },
  { path: '/manufacturer/modify/:id', name: 'Manufacturer Details', component: ManufacturerDetails },
  { path: '/manufacturer/patients/:id', name: 'Manufacturer Patient', component: ManufacturerPatient },
  { path: '/manufacturer/patientsinfo/:id', name: 'Patient Info', component: ManufacturerPatientDetails },

  { path: '/account/paymenthistory', name: 'Payment Transaction', component: PaymentHistory },
  { path: '/account/patientpayment', name: 'Patient Payments', component: PatientPayment },
  { path: '/account/activity', name: 'Account Activity', component: AccountActivity },

  { path: '/patientactivity/designactivity', name: 'Patient Design Activity', component: DesignActivity },
  { path: '/patientactivity/designactivities/list/:id', name: 'Patient Design Activities', component: DesignPatientActivity },
  { path: '/patientactivity/designactivities/detail/:id', name: 'Patient Design Activity Detail', component: DesignPatientActivityDetail },
  { path: '/patientactivity/designactivities/modify/:id/:pid', name: 'Patient Design Activity Detail', component: DesignPatientActivityDetail },
  { path: '/pmrverify/:id', name: 'PMR Verification', component: PMRVerfied },
  { path: '/pmrapprove/:id', name: 'PMR Approve', component: PMRApprove },
  { path: '/patientactivity/analysis/datafiles/:id', name: 'Patient Analysis Data Files', component: DesignActivityDataFile },
  // { path: '/patientactivity/designactivities/report/:id/:aid/', name: 'Patient Report Detail', component: PatientReportDetail },
  // { path: '/patients/patientinfo', exact: true, name: 'Patient Info', component: HandleNavigation },
  { path: '/patients/patientinfo/patientReport/:id/:aid', exact: true, name: 'Patient Report Detail', component: PatientReportDetail },

  { path: '/patientactivity/designactivities/admereport/:id/:aid', name: 'Adme Tox Report Detail', component: AdmePatientReportDetail },
  // { path: '/patientactivity/designactivities/patienthealthindexreportdetail/:id/:aid/:did', name: 'Patient health index Report Detail', component: PatientHealthIndexReportDetail },
  { path: '/patients/patienthealthindexreportdetail/:id/:aid/:did', name: 'Patient health index Report Detail', component: PatientHealthIndexReportDetail },
  // { path: "/patientactivity/designactivities/pmr/:id/:aid", name: "Pmr Report", component: PmrReport },
  { path: "/patients/pmr/:id/:aid", name: "Pmr Report", component: PmrReport },
  { path: '/patientactivity/labmanuactivity', name: 'Laboratory and Manufacturer Activity', component: LabManuActivity },
  { path: '/patientactivity/ngslaboratory/activity/:id', name: 'Laboratory Analysis Activity', component: LabActivity },
  { path: '/patientactivity/manufacturer/activity/:id', name: 'Manufacturer Activity', component: ManuActivity },

  { path: '/customModal', name: 'CustomModal', component: CustomModal },
  // { path: '/users', exact: true,  name: 'Users', component: Users },
  // { path: '/users/:id', exact: true, name: 'User Details', component: User },

];

export default routes;
