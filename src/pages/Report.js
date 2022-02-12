import React, { useState, useEffect } from 'react';
import BoxCard from '../components/BoxCard';
import { Card, Row, Col } from 'antd'
import DataTable from '../components/DataTable';
import InputText from '../components/InputText';
import { Button } from '../components/styles/globalStyles';
import FileSaver, { saveAs } from 'file-saver';
import * as XLSX from 'sheetjs-style';
import * as helper from '../utils/helper';
import * as Docs from '../utils/report';
import * as API from '../utils/apis';
import * as converter from '../utils/converter'
import JSZip from 'jszip';
import {
    DollarOutlined,
    UserOutlined,
    AuditOutlined,
    ReconciliationOutlined,
    FundProjectionScreenOutlined,
    EyeOutlined
} from '@ant-design/icons';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function Report() {
    const zip = new JSZip()
    const [clearSelectedRow, setClearSelectedRow] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [disableDownloadBtn, setDisableDownloadBtn] = useState(true)
    const [showReportTable, setShowReportTable] = useState(false)
    // const [onActiveType, setOnActiveType] = useState('')
    const [docType, setDocType] = useState('')
    const type = [1, 2, 3, 4, 5]
    const docTypeIcon = [
        <DollarOutlined />,
        <UserOutlined />,
        <AuditOutlined />,
        <ReconciliationOutlined />,
        <FundProjectionScreenOutlined />


    ]
    const fileName = 'ReportGroup_' + helper.getDate(new Date())

    const initForm = {
        data: [],
    }
    const [form, setForm] = useState(initForm);

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            width: '50px'
        },

        {
            title: 'รหัสเอกสาร',
            dataIndex: 'docId',
            width: '150px',
            align: 'center',
        },
        {
            title: 'ชื่อเอกสาร',
            dataIndex: 'name',
            align: 'left',

        },
        {
            title: 'หมวดหมู่',
            dataIndex: 'catagory',
            align: 'center',
        },
        {
            title: 'การจัดการ',
            dataIndex: 'management',
            align: 'center',
            render: ((_, record) => {
                return (<div className='d-flex justify-content-center'>
                    <Button
                        color="white"
                        bg={"#1890ff"}
                        className="cursor-p"
                        onClick={() => { setShowReportTable(true) }}
                    >
                        <div style={{ color: '#fff', fontWeight: 'bold' }}><EyeOutlined /></div>
                    </Button>
                </div>)
            })
        },
    ];

    // useEffect(() => {
    //     if (form && form.data.length <= 0) {
    //         getDocsData()
    //     }
    // }, [])

    useEffect(async () => {
        if (docType !== "") {
            getDocsData(docType)
        }
    }, [docType])

    useEffect(() => {
        if (selectedData && selectedData.length > 0) {
            if (selectedData[0].length <= 0) {
                setDisableDownloadBtn(true)
            } else {
                setDisableDownloadBtn(false)
            }
        } else {
            setDisableDownloadBtn(true)
        }
    }, [selectedData])

    const filterReport = () => {
    }

    const clearSearch = () => {
        setClearSelectedRow(true)
        // setForm(initForm)
    }

    const getDocsData = async (catagory) => {

        if (catagory == 5) {
            try {
                const report = await Docs.getReportType5(2022)
                setForm({ ...form, data: report })
            } catch (error) {

            }
        }
    }

    const convertListToExcelTable = (docId, objArray) => {
        let excelTable = [];
        if (docId === "doc_5-2") {
            //columns width
            let wscols = [
                { wch: 7 },
                { wch: 10 },
                { wch: 30 },
                { wch: 30 },
                { wch: 30 }
            ];

            //merge
            const merge = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
            ];
            //header
            let SUTIncome = "รายได้ธนาคารวัสดุรีไซเคิล มทส. (บาท)";
            let employeeIncome = "ค่าตอบแทนเจ้าหน้าที่ (25%)";
            let enviIncome = "รายได้เข้ากองทุนสิ่งแวดล้อมฯ (75%)";
            let month = "เดือน";
            //loop get body
            objArray.map((element, index) => {
                excelTable.push({
                    "ลำดับ ที่": index + 1,
                })
                excelTable[index][month] = 'Feb 65';
                excelTable[index][SUTIncome] = element.Bank;
                excelTable[index][employeeIncome] = element.Emp;
                excelTable[index][enviIncome] = element.Fund;
            })
            return [excelTable, ["ลำดับ ที่"], wscols, merge];
        }
    }

    const convertToExcel = (objArray) => {
        const workSheet = XLSX.utils.json_to_sheet(objArray[0], { skipHeader: false, origin: "A3" });
        workSheet['!cols'] = objArray[2];
        workSheet["!merges"] = objArray[3];
        // then add ur txt
        XLSX.utils.sheet_add_json(workSheet,
            [
                { note: "สรุปค่าตอบแทนเจ้าหน้าที่ธนาคารวัสดุรีไซเคิล มทส. และรายได้เข้ากองทุนสิ่งแวดล้อม" },
            ],
            {
                header: ["note"], skipHeader: true, origin: "A1"
            }
        );

        XLSX.utils.sheet_add_json(workSheet,
            [
                { year: "ประจำปี" },
            ],
            {
                header: ["year"], skipHeader: true, origin: "A2",
            }
        );
        workSheet["A1"].s = {									// set the style for target cell
            font: {
                name: 'TH SarabunPSK',
                sz: 16,
                bold: true,
            },
            alignment: {
                vertical: "center",
                horizontal: "center"
            }
        };
        workSheet["A2"].s = {									// set the style for target cell
            font: {
                name: 'TH SarabunPSK',
                sz: 16,
                bold: true,
            },
            alignment: {
                vertical: "center",
                horizontal: "center"
            }
        };

        const workBook = { Sheets: { 'data': workSheet }, SheetNames: ['data'], Title: ['ลำดับ ที่'] };
        return XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
    }

    const saveDocs = async (report) => {
        let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        //convert data to file
        report.table.forEach((item) => {
            const excelBuffer = convertToExcel(convertListToExcelTable(report.docId, [item]))
            const data = new Blob([excelBuffer], { type: type });
            zip.file(fileName + "_" + report.name + ".xlsx", data);
        })

        // zipping
        zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, fileName + ".zip")
        });
    }

    const downloadReport = () => {
        if (selectedData && selectedData[0].length > 0) {
            let report = selectedData[1][0]
            if (report) {
                console.log("Report", report);
                saveDocs(report)
            }
        }
    }

    const renderColsType = (item) => {
        let cardColor = String(docType) === String(item) ? "#90d890" : "#189078"
        return (<Col span={8} key={`col-doc-type-${item}`}>
            <Card
                bordered={true}
                hoverable={true}
                style={{ backgroundColor: cardColor, borderRadius: '10px' }}
                onClick={() => { setDocType(item) }}>
                <div className='d-flex justify-content-center'>
                    <h1 style={{ color: '#fff' }}>{docTypeIcon[item - 1]}</h1>
                </div>
                <div className='d-flex justify-content-center'>
                    <h4 style={{ color: '#fff' }}>{`เอกสารหมวด ${item}`}</h4>
                </div>

            </Card>
        </Col>)
    }

    return (
        <div className='container'>
            <div className='mb-3'>
                <BoxCard title={"หมวดหมู่เอกสาร"}>
                    <div className='m-5'>
                        <Row gutter={[10, 20]}>
                            {type ? type.map(item => renderColsType(item)) : null}
                        </Row>
                    </div>
                </BoxCard>
            </div>
            <div>
                <BoxCard title={"รายการเอกสาร"}>
                    <Row gutter={[10, 10]} className='mb-4'>
                        <Col span={8}>
                            <InputText title="กรองรายการ" type="text" idName="update-date"
                                placeholder="รหัสสมาชิก, ชื่อ, นามสกุล, เบอร์โทร, อีเมลล์" classLabel="bold"
                                value={form.searchKeyword}
                                handleChange={(value) => {
                                    setForm({ ...form, searchKeyword: value })
                                }}
                            />
                        </Col>
                        <Col>
                            <div className='mt-1'>
                                <Button className={'mr-2 mt-4'} bg={'#96CC39'} color={'#fff'} onClick={() => { filterReport() }}>ค้นหา</Button>
                            </div>
                        </Col>
                        <Col>
                            <div className='mt-1'>
                                <Button className={'mr-2 mt-4'} bg={'#3C3C3C'} color={'#fff'} onClick={() => { clearSearch() }}>ล้าง</Button>
                            </div>
                        </Col>
                    </Row>
                    <div className='mb-2 d-flex justify-content-end'>
                        <Button
                            className={'mr-2'}
                            bg={'#96CC39'}
                            color={'#fff'}
                            disabled={disableDownloadBtn}
                            onClick={() => { downloadReport() }}>
                            {"Download"}
                        </Button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={form.data}
                        option={
                            {
                                "selectionType": "checkbox",
                                "type": 'selection',
                                "clearSelectedRow": clearSelectedRow,
                                "select": (data) => { setSelectedData(data) }
                            }
                        }
                    ></DataTable>
                </BoxCard>
            </div>
        </div>);
}

export default Report;
