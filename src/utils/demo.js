// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from "react-router-dom";
// import { useTranslation } from 'react-i18next';
// import { loading } from "../../redux/actions/loadingAction";
// import * as helper from "../../utils/helper";
// import { Row, Col, Form } from "react-bootstrap";

// import pdfMake from "pdfmake-thai/build/pdfmake";
// import pdfFonts from "pdfmake-thai/build/vfs_fonts";

// import BoxCard from "../../components/BoxCard";
// import InputSelect from "../../components/InputSelect";
// import InputDatePicker from "../../components/InputDatePicker";
// import DataTableNodata from "../../components/DataTableNodata";
// import Breadcrumb from '../../components/Breadcrumb';
// import DataTable from '../../components/DataTable';
// import * as API from "../../utils/apis";

// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// function Prevalence() {
//     const user = useSelector(state => state.login.result);
//     const ref = React.createRef();
//     const dispatch = useDispatch();
//     const { t } = useTranslation(["common", "footer"]);

//     const initialForm = {
//         projectName: "",
//         dateBegin: "",
//         dateEnd: "",
//         provinceId: "",
//         diseaseTypeId: "",
//         sendSampleMethodId: "",
//         zoneId: "",
//         zoneName: "",
//         amphurId: "",
//         amphurName: "",
//         provinceName: "",
//         animalTypeId: "",
//         animalTypeName: "",
//         immunity: "",
//         sampleAmt: "",
//         resulltPlus: "",
//         resultMinus: "",
//         resultUnknown: "",
//         farmAmt: "",
//         foundDiseaseAmt: "",
//         notFoundDiseaseAmt: "",
//         unknownDiseaseAmt: "",

//         limit: 10,
//         page: 1,
//         totalPages: 1,
//         sortDir: "DESC",
//         sortBy: "id",
//         totalElements: 0,
//         numberOfElements: 0,
//         headTitle: [
//             {
//                 name: "ลำดับ",
//                 sortFlg: false,
//                 width: "50px",
//                 rowSpan: 2
//             },
//             {
//                 sortBy: "zoneId",
//                 name: "เขตปศุสัตว์",
//                 sortFlg: true,
//                 rowSpan: 2
//             },
//             {
//                 sortBy: "sampleAmt",
//                 name: "จำนวนตัวอย่าง (ตัว)",
//                 sortFlg: true,
//                 rowSpan: 2
//             },
//             {
//                 name: "ผลตรวจทางห้องปฏิบัติการ",
//                 sortFlg: false,
//                 colSpan: 3,
//                 childHead: [
//                     {
//                         sortBy: "resultMinus",
//                         name: "ผลลบ(-) (ตัว)",
//                         sortFlg: true,
//                     },
//                     {
//                         sortBy: "resultUnknown",
//                         name: "ตรวจไม่ได้ (ตัว)",
//                         sortFlg: true,
//                     },
//                     {
//                         sortBy: "resulltPlus",
//                         name: "ผลบวก (+) (ตัว)",
//                         sortFlg: true,
//                     },
//                 ]
//             },

//             {
//                 sortBy: "farmAmt",
//                 name: "จำนวนฟาร์ม",
//                 sortFlg: true,
//                 rowSpan: 2
//             },
//             {
//                 name: "ผลตรวจทางห้องปฏิบัติการ",
//                 sortFlg: false,
//                 colSpan: 3,
//                 childHead: [
//                     {
//                         sortBy: "notFoundDiseaseAmt",
//                         name: "ไม่พบโรค (ราย)",
//                         sortFlg: true,
//                     },
//                     {
//                         sortBy: "unknownDiseaseAmt",
//                         name: "ตรวจไม่ได้ (ราย)",
//                         sortFlg: true,
//                     },
//                     {
//                         sortBy: "foundDiseaseAmt",
//                         name: "พบโรค (ตัว)",
//                         sortFlg: true,
//                     },
//                 ]
//             },
//         ]
//     };
//     const [form, setForm] = useState(initialForm);

//     const [isClearSearch, setIsClearSearch] = useState(false);

//     const [listPrevalence, setListPrevalence] = useState([]);


//     // select จังหวัด ตำบล อำเภอ หมู่บ้าน
//     const [provinceSelectValue, setProvinceSelectValue] = useState([])
//     const [provinceList, setProvinceList] = useState([])

//     const [districtSelectValue, setDistrictSelectValue] = useState([])
//     const [districtList, setDistrictList] = useState([])

//     // =================

//     // select  ปีงบประมาณ  โครงการ   ชนิดสัตว์  ชนิดโรค วิธีการทดสอบ ชนิดระดับภูมิคุ้มกัน
//     const [actionPlanYearSelectValue, setActionPlanYearSelectValue] = useState([])
//     const [actionPlanYearList, setActionPlanYearList] = useState([])

//     const [zoneSelectValue, setZoneSelectValue] = useState([])
//     const [zoneList, setZoneList] = useState([])

//     const [projectSelectValue, setProjectSelectValue] = useState([])
//     const [projectList, setProjectList] = useState([])

//     const [animalSelectValue, setAnimalSelectValue] = useState([])
//     const [animalList, setAnimalList] = useState([])

//     const [diseaseSelectValue, setDiseaseSelectValue] = useState([])
//     const [diseaseList, setDiseaseList] = useState([])

//     const [testSelectValue, setTestSelectValue] = useState([])
//     const [testList, setTestList] = useState([])

//     const [fileType, setFileType] = useState("excel")
//     const fileName = 'C03RPT04-PrevalenceReport_' + helper.getDate(new Date())

//     // =================


//     pdfMake.fonts = {
//         THSarabunNew: {
//             normal: 'THSarabunNew.ttf',
//             bold: 'THSarabunNew-Bold.ttf',
//             italics: 'THSarabunNew-Italic.ttf',
//             bolditalics: 'THSarabunNew-BoldItalic.ttf'
//         },
//     }

//     useEffect(() => {
//         getProvince()
//         getAnimal()
//         getActionProject()
//         getActionPlanYear()
//         getZoneLivestock()
//         getTestMethod()
//         getDiseaseType()
//         getPrevalenceLevelReport()
//     }, [form.limit, form.page, form.sortBy, form.sortDir, isClearSearch])

//     const getPrevalenceLevelReport = async () => {
//         dispatch(loading(true))
//         try {
//             const response = await API.getPrevalenceLevelReport(form.dateBegin ? helper.getDate(form.dateBegin) : "", form.dateEnd ? helper.getDate(form.dateEnd) : "", form.zoneId, form.provinceId, form.amphurId, form.year, form.projectName, form.animalTypeId, form.diseaseTypeId, form.sendSampleMethodId, form.sortBy, form.sortDir, form.page, form.limit);
//             const data = await response?.data;
//             if (response.status == 200) {
//                 setListPrevalence(data.content);
//                 setForm({ ...form, totalPages: data.totalPages, totalElements: data.totalElements, numberOfElements: data.numberOfElements })
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getPrevalenceLevelToExport = async () => {
//         dispatch(loading(true))
//         try {
//             const response = await API.getPrevalenceLevelReport(form.dateBegin ? helper.getDate(form.dateBegin) : "", form.dateEnd ? helper.getDate(form.dateEnd) : "", form.zoneId, form.provinceId, form.amphurId, form.year, form.projectName, form.animalTypeId, form.diseaseTypeId, form.sendSampleMethodId, form.sortBy, form.sortDir, form.page, form.totalElements);
//             const data = await response?.data;
//             if (response.status == 200) {
//                 let prevalenceArray = [];
//                 data.content.forEach(element => {
//                     prevalenceArray.push({
//                         id: element.id,
//                         year: element.year,
//                         projectName: element.projectName,
//                         provinceId: element.provinceId,
//                         amphurId: element.amphurId,
//                         tambonId: element.tambonId,
//                         zoneName: element.zoneName,
//                         provinceName: element.provinceName,
//                         amphurName: element.amphurName,
//                         animalTypeId: element.animalTypeId,
//                         animalTypeName: element.animalTypeName,
//                         sampleAmt: element.sampleAmt,
//                         resultPlus: element.resultPlus,
//                         resultMinus: element.resultMinus,
//                         resultUnknown: element.resultUnknown,
//                         farmAmt: element.farmAmt,
//                         foundDiseaseAmt: element.foundDiseaseAmt,
//                         notFoundDiseaseAmt: element.notFoundDiseaseAmt,
//                         unknownDiseaseAmt: element.unknownDiseaseAmt,
//                         diseaseTypeId: element.diseaseTypeId,
//                         sendSampleMethodId: element.sendSampleMethodId,
//                         dateBegin: element.dateBegin,
//                         dateEnd: element.dateEnd,

//                     });
//                 });
//                 downloadRecord(prevalenceArray, data.content)
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }


//     const getDiseaseType = async () => {
//         try {
//             const response = await API.getDiseaseType("", "", "1", "100", 1);
//             const data = await response?.data;
//             if (response.status == 200) {
//                 let diseaseType = [];
//                 data.content.forEach(element => {
//                     diseaseType.push({
//                         value: element.id, label: element.name,
//                     });
//                 });
//                 setDiseaseList(diseaseType);
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getTestMethod = async () => {
//         try {
//             const response = await API.getTestMethod(1, "");
//             const data = await response?.data;
//             if (response.status == 200) {
//                 let testArray = [];
//                 data.content.forEach(element => {
//                     testArray.push({
//                         value: element.id, label: element.name,
//                     });
//                 });
//                 setTestList(testArray);
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getZoneLivestock = async () => {
//         try {
//             const response = await API.getZoneLivestock("", 1);
//             const data = await response?.data;
//             if (response.status == 200) {
//                 let zoneArray = [];
//                 data.content.forEach(element => {
//                     zoneArray.push({
//                         value: element.id, label: element.name,
//                     });
//                 });
//                 setZoneList(zoneArray);
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getActionPlanYear = async () => {
//         try {
//             const response = await API.getActionPlanYear();
//             const data = await response?.data;
//             if (response.status == 200) {
//                 let actionArray = [];
//                 data.forEach(element => {
//                     actionArray.push({
//                         value: element, label: element,
//                     });
//                 });
//                 setActionPlanYearList(actionArray);
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getActionProject = async () => {
//         try {
//             const response = await API.getActionProject();
//             const data = await response?.data;
//             if (response.status == 200) {
//                 let projectArray = [];
//                 data.forEach(element => {
//                     projectArray.push({
//                         value: element, label: element,
//                     });
//                 });
//                 setProjectList(projectArray);
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getAnimal = async () => {
//         try {
//             const response = await API.getAnimal("", 1);
//             const data = await response?.data;
//             if (response.status == 200) {
//                 let animalArray = [];
//                 data.content.forEach(element => {
//                     animalArray.push({
//                         value: element.id, label: element.name,
//                     });
//                 });
//                 setAnimalList(animalArray);
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getProvince = async () => {
//         try {
//             const response = await API.getProvince("", 1);
//             const data = await response?.data;
//             if (response.status == 200) {
//                 let provincesArray = [];
//                 data.content.forEach(element => {
//                     provincesArray.push({
//                         value: element.id, label: element.name,
//                     });
//                 });
//                 setProvinceList(provincesArray);
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const getDistricts = async (id) => {
//         try {
//             const response = await API.getDistricts("", id, 1);
//             const data = await response?.data;
//             if (response.status == 200) {
//                 let districtArray = [];
//                 data.content.forEach(element => {
//                     districtArray.push({
//                         value: element.id, label: element.name,
//                     });
//                 });
//                 setDistrictList(districtArray);
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const breadcrumbPath = [
//         { path: '/home', name: "หน้าหลัก" },
//         { path: '/active_surv/action_plan', name: "การเฝ้าระวังเชิงรุก" },
//         { path: 'title', name: "รายงาน" },
//         { path: 'active', name: "C03RPT04-ความชุกตามชนิดสัตว์และพื้นที่" }
//     ]

//     const getFilter = (type, isChange1, isChange2) => {
//         if (type === "page") {
//             setForm({
//                 ...form,
//                 page: isChange1,
//             })
//         }
//         else if (type === "limit") {
//             setForm({
//                 ...form,
//                 limit: isChange1,
//                 page: 1
//             })
//         } else {
//             setForm({
//                 ...form,
//                 sortBy: isChange1,
//                 sortDir: isChange2,
//                 page: 1
//             })
//         }
//     }

//     const toSearch = () => {
//         setForm({...form, page: 1})
//         setIsClearSearch(!isClearSearch)
//     };

//     const clearSearch = () => {
//         setForm(initialForm)
//         setActionPlanYearSelectValue([])
//         setProjectSelectValue([])
//         setAnimalSelectValue([])
//         setZoneSelectValue([])
//         setDistrictList([])
//         setProvinceSelectValue([])
//         setDistrictSelectValue([])
//         setDiseaseSelectValue([])
//         setTestSelectValue([])
//         setFileType("excel")
//         setIsClearSearch(!isClearSearch)
//     }

//     const buttonSearch = () => {
//         return (
//             <>
//                 <button className="btn btn-danger mr-2" onClick={() => clearSearch()}>
//                     ล้างข้อมูล
//                 </button>

//                 <button className="btn btn-success" onClick={() => toSearch()}>
//                     ค้นหา
//                 </button>
//             </>
//         );
//     }

//     const buttonExport = () => {
//         return (
//             <>
//                 <button className="btn btn-report" onClick={() =>getPrevalenceLevelToExport()} disabled={user?.userGroup.mexport === "n"}>
//                     <a className="text-white">
//                         <img
//                             className="nav-icon"
//                             src={"/svg/report.svg"}
//                             alt="export-icon"
//                         /> ออกรายงาน
//                     </a>
//                 </button>
//             </>
//         );
//     };

//     const convertListToExcelTable = (objArray) => {
//         let excelTable = [];
//         let zone = "เขตปศุสัตว์";
//         let dataNum1 = " จำนวนตัวอย่าง(ตัว)";
//         let dataNum2 = " ผลบวก (+)(ตัว)";
//         let dataNum3 = " ผลลบ (-)(ตัว)";
//         let dataNum4 = " ตรวจไม่ได้(ตัว)";
//         let farm = " จำนวนฟาร์ม";
//         let amt1 = "ไม่พบโรค (ราย)";
//         let amt2 = "ตรวจไม่ได้ (ราย)";
//         let amt3 = "พบโรค (ราย)";
//         objArray.map((element, index) => {
//             excelTable.push({
//                 ลำดับ: index + 1,

//             })
//             excelTable[index][zone] = element.zoneName;
//             excelTable[index][dataNum1] = element.sampleAmt;
//             excelTable[index][dataNum3] = element.resultMinus;
//             excelTable[index][dataNum4] = element.resultUnknown;
//             excelTable[index][dataNum2] = element.resultPlus;
//             excelTable[index][farm] = element.farmAmt;
//             excelTable[index][amt1] = element.notFoundDiseaseAmt;
//             excelTable[index][amt2] = element.unknownDiseaseAmt;
//             excelTable[index][amt3] = element.foundDiseaseAmt;

//         })
//         return excelTable;
//     }

//     const convertToCSV = (objArray) => {
//         let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
//         let headCol = '';
//         let dataRow = '';
//         let key = Object.keys(array[0])
//         key.forEach(item => {
//             if (headCol === '') {
//                 headCol = item;
//             } else {
//                 if (item != '') {
//                     headCol += ','
//                     headCol += item;
//                 }
//             }
//         })
//         for (let i = 0; i < array.length; i++) {
//             let line = '';
//             for (let index in array[i]) {
//                 if (line != '') {
//                     line += ','
//                 }
//                 line += array[i][index];
//             }
//             dataRow += line + '\r\n';
//         }
//         return headCol + '\r\n' + dataRow;
//     }

//     const convertToExcel = (objArray) => {
//         const workSheet = XLSX.utils.json_to_sheet(objArray);
//         const workBook = { Sheets: { 'data': workSheet }, SheetNames: ['data'] };
//         return XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
//     }

//     const printPDF = (fileName, dataListPDf) => {
//         let listPrevalencePdf = []
//         if (dataListPDf && dataListPDf.length > 0) {
//             dataListPDf.map((item, i) => {
//                 listPrevalencePdf.push([
//                     i + 1,
//                     item.zoneName || '-',
//                     item.sampleAmt ? item.sampleAmt : 0,
//                     item.resultMinus ? item.resultMinus : 0,
//                     item.resultUnknown ? item.resultUnknown : 0,
//                     item.resultPlus ? item.resultPlus : 0,
//                     item.farmAmt ? item.farmAmt : 0,
//                     item.notFoundDiseaseAmt ? item.notFoundDiseaseAmt : 0,
//                     item.unknownDiseaseAmt ? item.unknownDiseaseAmt : 0,
//                     item.foundDiseaseAmt ? item.foundDiseaseAmt : 0,

//                 ])
//             })
//         }

//         let bodyArray = [[
//             { text: 'ลำดับ', style: 'tableHeader', alignment: 'center', rowSpan: 2, },
//             { text: 'เขตปศุสัตว์', style: 'tableHeader', alignment: 'center', rowSpan: 2 },
//             { text: 'จำนวนตัวอย่าง (ตัว)', style: 'tableHeader', alignment: 'center', rowSpan: 2 },
//             { text: 'ผลตรวจทางห้องปฏิบัติการ', style: 'tableHeader', colSpan: 3, alignment: 'center' }, {},{},
//             { text: 'จำนวนฟาร์ม', style: 'tableHeader', alignment: 'center', rowSpan: 2 },
//             { text: 'ผลตรวจทางห้องปฏิบัติการ', style: 'tableHeader', colSpan: 3, alignment: 'center' }, {},{},
//         ],
//         [
//             {}, {}, {}, 
//             { text: 'ผลลบ(-) (ตัว)', style: 'tableHeader', alignment: 'center' },
//             { text: 'ตรวจไม่ได้ (ตัว)', style: 'tableHeader', alignment: 'center' },
//             { text: 'ผลบวก (+) (ตัว)', style: 'tableHeader', alignment: 'center' },
//             {}, 
//             { text: 'ไม่พบโรค (ราย)', style: 'tableHeader', alignment: 'center' },
//             { text: 'ตรวจไม่ได้ (ราย)', style: 'tableHeader', alignment: 'center' },
//             { text: 'พบโรค (ราย)', style: 'tableHeader', alignment: 'center' },
//         ]]

//         listPrevalencePdf.map((item, i) => {
//             bodyArray.push(listPrevalencePdf[i])
//         })

//         console.log("listPrevalencePdf", listPrevalencePdf);

//         let docDefinition = {
//             content: [
//                 {
//                     style: 'tableExample',
//                     table: {
//                         widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
//                         headerRows: 2,
//                         body: bodyArray

//                     }
//                 }
//             ],
//             defaultStyle: {
//                 fontSize: 14,
//                 font: 'THSarabunNew',
//             },
//         }
//         pdfMake.createPdf(docDefinition).download(fileName + '.pdf');
//     }

//     const downloadRecord = (dataList, dataListPDf) => {
//         let type = "";
//         if (fileType === "excel") {
//             type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//             const excelBuffer = convertToExcel(convertListToExcelTable(dataList))
//             const data = new Blob([excelBuffer], { type: type });
//             FileSaver.saveAs(data, fileName + '.xlsx');
//         }
//         if (fileType === "csv") {

//             type = 'text/csv;charset=utf-8';
//             const csv = convertToCSV(convertListToExcelTable(dataList))
//             const csvData = new Blob([csv], { type: type });
//             FileSaver.saveAs(csvData, fileName + '.csv');
//         }
//         if (fileType === "pdf") {
//             printPDF(fileName, dataListPDf)
//         }
//     }

//     const checkExport = (value) => {
//         if (fileType === value) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     const renderTable = (data) => {
//         if (data.length > 0) {
//             return data.map((item, i) => (
//                 <tr key={i} className="font14 fitwidth">
//                     <td className="text-center">{i + 1}</td>
//                     <td className="text-center">{item.zoneName || "-"}</td>
//                     <td className="text-center">{item.sampleAmt}</td>
//                     <td className="text-center">{item.resultMinus}</td>
//                     <td className="text-center">{item.resultUnknown}</td>
//                     <td className="text-center">{item.resultPlus}</td>
//                     <td className="text-center">{item.farmAmt}</td>
//                     <td className="text-center">{item.notFoundDiseaseAmt}</td>
//                     <td className="text-center">{item.unknownDiseaseAmt}</td>
//                     <td className="text-center">{item.foundDiseaseAmt}</td>

//                 </tr >
//             ))
//         } else {
//             return (<DataTableNodata colSpan="10" />)
//         }
//     }




//     const selectValueProvince = (value) => {
//         setProvinceSelectValue([{ value: value.value, label: value.label }])
//         setDistrictSelectValue([])
//         setForm({ ...form, provinceId: value.value, chooseSelect: true })
//         getDistricts(value.value);
//     }

//     const selectValueDistrict = (value) => {
//         setDistrictSelectValue([{ value: value.value, label: value.label }])
//         setForm({ ...form, amphurId: value.value, chooseSelect: true })
//     }

//     return (

//         <div className="">
//             <div className="pl-4 bg-white">
//                 <Breadcrumb data={breadcrumbPath} />
//             </div>

//             <div className="bg-gray-light">
//                 <div className="px-4 pt-3 container-fixed-footer">
//                     <BoxCard title="ตัวกรอง" classLabel="" headRight={buttonSearch()}>
//                         <div className=" ">

//                             <Row className="mb-2 pl-2 ">
//                                 <Col lg={2} md={6} sm={12} xs={12}>
//                                     <InputDatePicker
//                                         title="วันที่บันทึกข้อมูล"
//                                         classLabel="normal"
//                                         placeholder="วัน/เดือน/ปี"
//                                         value={form.dateBegin}
//                                         star={false}
//                                         handleChange={(value) =>
//                                             setForm({ ...form, dateBegin: value })
//                                         }

//                                     />
//                                 </Col>
//                                 <Col lg={2} md={6} sm={12} xs={12}>
//                                     <InputDatePicker
//                                         title="ถึงวันที่"
//                                         classLabel="normal"
//                                         placeholder="วัน/เดือน/ปี"
//                                         value={form.dateEnd}
//                                         star={false}
//                                         handleChange={(value) =>
//                                             setForm({ ...form, dateEnd: value })
//                                         }

//                                     />
//                                 </Col>
//                                 <Col lg={2} md={6} sm={12} xs={12}>
//                                     <InputSelect
//                                         title="ปีงบประมาณ"
//                                         star={false}
//                                         placeholder="กรุณาเลือก"
//                                         idName="title"
//                                         classLabel="normal"
//                                         selectValue={actionPlanYearSelectValue}
//                                         optionsList={actionPlanYearList}
//                                         handleChange={(value) => {
//                                             setActionPlanYearSelectValue(value)
//                                             setForm({ ...form, year: value.value })
//                                         }}
//                                     />
//                                 </Col>

//                                 <Col lg={2} md={6} sm={12} xs={12}>
//                                     <InputSelect
//                                         title="โครงการ"
//                                         star={false}
//                                         placeholder="กรุณาเลือก"
//                                         idName="title"
//                                         classLabel="normal"
//                                         selectValue={projectSelectValue}
//                                         optionsList={projectList}
//                                         handleChange={(value) => {
//                                             setProjectSelectValue(value)
//                                             setForm({ ...form, projectName: value.value })
//                                         }}
//                                     />
//                                 </Col>


//                                 <Col lg={2} md={6} sm={12} xs={12}>
//                                     <InputSelect
//                                         title="ชนิดสัตว์"
//                                         star={false}
//                                         placeholder="กรุณาเลือก"
//                                         idName="title"
//                                         classLabel="normal"
//                                         selectValue={animalSelectValue}
//                                         optionsList={animalList}
//                                         handleChange={(value) => {
//                                             setAnimalSelectValue(value)
//                                             setForm({ ...form, animalTypeId: value.value })
//                                         }}

//                                     />
//                                 </Col>

//                             </Row>

//                             <Row className="mb-2 pl-2">
//                                 <Col lg={2} md={6} sm={12} xs={12}>
//                                     <InputSelect
//                                         title="เขต"
//                                         star={false}
//                                         placeholder="กรุณาเลือก"
//                                         idName="title"
//                                         classLabel="normal"
//                                         selectValue={zoneSelectValue}
//                                         optionsList={zoneList}
//                                         handleChange={(value) => {
//                                             setZoneSelectValue(value)
//                                             setForm({ ...form, zoneId: value.value })
//                                         }}

//                                     />
//                                 </Col>
//                                 <Col lg={2} md={6} sm={12} xs={12}>
//                                     <InputSelect
//                                         title="จังหวัด"
//                                         star={false}
//                                         placeholder="กรุณาเลือก"
//                                         idName="province"
//                                         classLabel="normal"
//                                         selectValue={provinceSelectValue}
//                                         optionsList={provinceList}
//                                         handleChange={(value) => {
//                                             selectValueProvince(value)
//                                             setForm({ ...form, provinceId: value.value })
//                                         }}

//                                     />
//                                 </Col>

//                                 <Col lg={2} md={6} sm={12} xs={12}>
//                                     <InputSelect
//                                         title="อำเภอ"
//                                         star={false}
//                                         placeholder="กรุณาเลือก"
//                                         idName="title"
//                                         classLabel="normal"
//                                         selectValue={districtSelectValue}
//                                         optionsList={districtList}
//                                         handleChange={(value) => {
//                                             selectValueDistrict(value)
//                                             setForm({ ...form, amphurId: value.value })
//                                         }}

//                                     />
//                                 </Col>

//                                 <Col lg={2} md={6} sm={12} xs={12}>
//                                     <InputSelect
//                                         title="ชนิดโรค"
//                                         star={false}
//                                         placeholder="กรุณาเลือก"
//                                         idName="diseaseTypeId"
//                                         classLabel="normal"
//                                         selectValue={diseaseSelectValue}
//                                         optionsList={diseaseList}
//                                         handleChange={(value) => {
//                                             setDiseaseSelectValue(value)
//                                             setForm({ ...form, diseaseTypeId: value.value })
//                                         }}

//                                     />
//                                 </Col>

//                                 <Col lg={2} md={6} sm={12} xs={12}>
//                                     <InputSelect
//                                         title="วิธีการทดสอบ"
//                                         star={false}
//                                         placeholder="กรุณาเลือก"
//                                         idName="sendSampleMethodId"
//                                         classLabel="normal"
//                                         selectValue={testSelectValue}
//                                         optionsList={testList}
//                                         handleChange={(value) => {
//                                             setTestSelectValue(value)
//                                             setForm({ ...form, sendSampleMethodId: value.value })
//                                         }}

//                                     />
//                                 </Col>
//                             </Row>
//                             <Row className="mb-2 pl-2">
//                                 <Col>
//                                     <Col lg={3} md={6} sm={12}>
//                                         <label style={{ fontWeight: 'normal' }}>เลือกรูปแบบ</label>
//                                     </Col>
//                                     <Col lg={9} md={9} sm={12} className="w-100">
//                                         <div className="d-flex mt-1 ">
//                                             <label style={{ fontWeight: 'normal' }}>
//                                                 <input type="radio" value="excel" name="data-export" checked={checkExport("excel")} onChange={() => setFileType("excel")} /> EXCEL
//                                             </label>
//                                             <div className="ml-3">
//                                                 <label style={{ fontWeight: 'normal' }}>
//                                                     <input type="radio" value="pdf" name="data-export" checked={checkExport("pdf")} onChange={() => setFileType("pdf")} /> PDF
//                                                 </label>

//                                             </div>

//                                             <div className="ml-3">
//                                                 <label style={{ fontWeight: 'normal' }}>
//                                                     <input type="radio" value="csv" name="data-export" checked={checkExport("csv")} onChange={() => setFileType("csv")} /> CSV
//                                                 </label>

//                                             </div>
//                                         </div>

//                                     </Col>
//                                 </Col>

//                             </Row>
//                         </div>
//                     </BoxCard>

//                     <BoxCard classNameBox="mt-3" title="รายการสรุปผลการเฝ้าระวังพีพีอาร์ในแพะแกะภายในประเทศ" headRight={buttonExport()}>
//                         <DataTable typeTable="colSpan" headColumns={form.headTitle}
//                             totalPages={form.totalPages} page={form.page} limit={form.limit} sortDir={form.sortDir} sortBy={form.sortBy}
//                             getLimit={(limit) => getFilter("limit", limit)} getFilter={(sortBy, sortDir) => getFilter("filter", sortBy, sortDir)}
//                             getPage={(page) => getFilter("page", page)} totalItems={form.totalElements} numberOfItems={form.numberOfElements}
//                             isClear={isClearSearch}  id={"render-data-table"} reference={ref}
//                         >
//                             {renderTable(listPrevalence)}
//                         </DataTable>
//                     </BoxCard>
//                 </div>
//             </div>
//         </div >
//     );
// }


// export default Prevalence
