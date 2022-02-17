import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import BoxCard from '../components/BoxCard';
import { Card, Row, Col } from 'antd'
import DataTable from '../components/DataTable';
import InputText from '../components/InputText';
import { Button } from '../components/styles/globalStyles';

import * as API from '../utils/apis'
import * as helper from '../utils/helper'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function Audit() {
    const history = useHistory()
    const { ID } = JSON.parse(helper.sessionGet('login'))

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            width: '50px'
        },

        {
            title: 'รหัสสมาชิก',
            dataIndex: 'id',
            width: '150px',
            align: 'center',
        },
        {
            title: 'ยอดคงค้าง (บาท)',
            dataIndex: 'balance',
            sorter: {
                compare: (a, b) => a.balance - b.balance,
                multiple: 1,
            },
            width: '200px',
            align: 'right',
            render: ((_, record) => {
                return (<h5 style={{ color: 'orange' }}>{record.balance}</h5>)
            })
        },
        {
            title: 'ชื่อ',
            dataIndex: 'firstname',
            align: 'left',
            width: '300px',

        },
        {
            title: 'นามสกุล',
            dataIndex: 'lastname',
            align: 'left',
            width: '300px',
        },
        {
            title: 'วันที่ทำรายการฝาก',
            dataIndex: 'createDate',
            align: 'center',
        },
    ];
    const initForm = {
        searchKeyword: "",
        key: "",
        Acc_number: "",
        Bank: "",
        Email: "",
        Firstname: "",
        ID: "",
        Lastname: "",
        No_members: "",
        Phone_number: "",
        Phone_number2: "",
        Remark: "",
        Role: "",
        Username: "",

        mode: "",
        idEdit: "",
        data: [],
    }
    const [form, setForm] = useState(initForm);
    const [totalPrice, setTotalPrice] = useState(0);
    const [bankPrice, setBankPrice] = useState(0);
    const [memberPrice, setMemberPrice] = useState(0);
    const [waitingPrice, setWaitingPrice] = useState(0);
    const [contentTab, setContentTab] = useState([]);
    const [clearSelectedRow, setClearSelectedRow] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState("กุมภาพันธ์");

    useEffect(() => {
        if (contentTab && contentTab.length <= 0) {
            getLastFee()
            getBalance()
            getToWithDraw(form.searchKeyword)
            getToWithDraw("")
        }
    }, [contentTab])

    useEffect(() => {
        getToWithDraw(form.searchKeyword)
    }, [form.searchKeyword])

    useEffect(() => {
        if (clearSelectedRow) {
            setClearSelectedRow(!clearSelectedRow)
        }
    }, [clearSelectedRow])

    const clearSearch = () => {
        if (form.data.length > 0) {
            MySwal.fire({
                text: `ยืนยันการล้างข้อมูลสมาชิก `,
                icon: "question",

                confirmButtonColor: '#E72525',
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
            }).then(async (result) => {
                if (result.value) {
                    setForm(initForm)
                    //if success
                    MySwal.fire({
                        text: `ลบสำเร็จ`,
                        icon: "success",
                        confirmButtonText: "ตกลง",
                        confirmButtonColor: '#96CC39',
                    })
                }
            })
        } else {
            setForm(initForm)
        }
    }

    const getBalance = async () => {
        const date = new Date()
        const now = date.getFullYear() + 543
        const month = date.toLocaleString('en-us', { month: 'short' });
        const monthENArray = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        const monthTHArray = [
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม",
        ]
        let indexMonth = monthENArray.indexOf(date.toLocaleString('en-us', { month: 'long' }));
        let name = monthTHArray[indexMonth]
        try {
            const response = await API.getReport5_1(now)
            const data = await response?.data.data
            if (response.status === 200 && !response?.data.error) {
                data.forEach((item) => {
                    if (String(item.Month).includes(String(month))) {
                        setTotalPrice(Number(item.Total_Price).toFixed(2))
                        setBankPrice(Number(item.Bank_Price).toFixed(2))
                        setMemberPrice(Number(item.Member_Price).toFixed(2))
                        setCurrentMonth(name + " " + now)
                    }
                })
                // console.log(data);
            } else {
                MySwal.fire({
                    text: `ไม่พบข้อมูลยอดเงิน \nกรุณาทำรายการอีกครั้ง `,
                    icon: "error",
                    showConfirmButton: true,
                    confirmButtonText: "ตกลง",
                }).then((value) => {
                    if (value.isConfirmed) {
                        history.push("/index")
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getLastFee = async () => {
        try {
            const response = await API.getLastFee()
            const data = await response?.data.data[0]
            if (response.status === 200 && !response?.data.error) {
                setForm({
                    ...form,
                    memberFee: Number(100 - Number(data.fee)).toFixed(2),
                    bankFee: data.fee,
                    updateDate: helper.momentDate(data.Update_Date.length > 0 ? Number(data.Update_Date) * 1000 : Number(data.Create_Date) * 1000, "th", "short"),
                    updateBy: data.Update_By,
                })
            } else {
                MySwal.fire({
                    text: `ไม่พบข้อมูลสัดส่วน \nกรุณาทำรายการอีกครั้ง `,
                    icon: "error",
                    showConfirmButton: true,
                    confirmButtonText: "ตกลง",
                }).then((value) => {
                    if (value.isConfirmed) {
                        history.push("/index")
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getToWithDraw = async (search) => {
        try {
            const response = await API.getWallets()
            const data = response?.data.data
            if (response.status === 200 && !data.error) {
                if (data && data.length > 0) {
                    let filteredData = []
                    let sumBalance = 0
                    data.forEach((item, index) => {
                        sumBalance += Number(item.Balance)
                        filteredData.push({
                            key: index + 1,
                            id: item.ID,
                            firstname: item.Firstname,
                            lastname: item.Lastname,
                            createDate: item.Create_Date,
                            balance: Number(item.Balance).toFixed(2),
                        })
                    })
                    setWaitingPrice(Number(sumBalance).toFixed(2))
                    if (search !== "") {
                        let filter = filteredData.filter((item) => String(item.firstname).includes(search) || String(item.lastname).includes(search))
                        setContentTab(filter)
                    } else {
                        setContentTab(filteredData)
                    }

                }
            } else {
                MySwal.fire({
                    text: `ไม่สามารถโหลดข้อมูลได้ \nกรุณาทำรายการอีกครั้ง`,
                    icon: "error",
                    showConfirmButton: true,
                    confirmButtonText: "ยกเลิก",
                })
            }
        } catch (error) {
            MySwal.fire({
                text: `ไม่สามารถโหลดข้อมูลได้ \nกรุณาทำรายการอีกครั้ง`,
                icon: "error",
                showConfirmButton: true,
                confirmButtonText: "ยกเลิก",
            })
            console.log(error);
        }
    }

    const toWithDrawBalance = () => {
        MySwal.fire({
            text: `ยืนยันการบันทึกรายการ `,
            icon: "question",

            confirmButtonColor: '#96CC39',
            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (selectedData && selectedData[1].length > 0) {
                    try {
                        selectedData[1].forEach(async (item) => {
                            let dataToWithdraw = {
                                memid: item.id,
                                empid: ID,
                                netprice: item.balance
                            }
                            console.log(dataToWithdraw);
                            const response = await API.withdrawBalance(dataToWithdraw)
                        })
                        MySwal.fire({
                            text: `บันทึกข้อมูลสำเร็จ`,
                            icon: "success",

                            confirmButtonColor: '#96CC39',
                            confirmButtonText: "ตกลง",
                        }).then((value) => {
                            if (value.isConfirmed) {
                                setForm(initForm)
                                setClearSelectedRow(true)
                                setSelectedData([])
                                setTotalPrice(0)
                                setWaitingPrice(0)
                                getLastFee()
                                getBalance()
                                setContentTab([])
                            }
                        })

                    } catch (error) {
                        MySwal.fire({
                            text: `ไม่สามารถโหลดข้อมูลได้ \nกรุณาทำรายการอีกครั้ง`,
                            icon: "error",
                            showConfirmButton: true,
                            confirmButtonText: "ยกเลิก",
                        })
                        console.log(error);
                    }
                }
            }
        })


    }

    return (
        <div className='container'>
            <div className='mb-3'>
                <BoxCard title={"รายการบัญชีออมทรัพย์"}>
                    <div className='m-5'>
                        <h4 className='mb-3 bold'>{`บันทึกรายการปัจจุบัน เดือน: ${currentMonth}`}</h4>
                        <Row gutter={[10, 0]}>
                            <Col span={8}>
                                <Card title={<h4>{`ยอดฝากทั้งหมด (บาท)`}</h4>} bordered={true}>
                                    <h3>{totalPrice}</h3>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title={<h4>{`ยอดเงินสมาชิก (บาท)`}</h4>} bordered={true}>
                                    <h3>{memberPrice}</h3>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title={<h4>{`ยอดเงินธนาคารวัสดุ (บาท)`}</h4>} bordered={true}>
                                    <h3>{bankPrice}</h3>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </BoxCard>
            </div>
            <div>
                <BoxCard title={"รายการที่มียอดคงค้าง"}>
                    <Row gutter={[10, 10]} className='mb-4'>
                        <Col span={8}>
                            <InputText title="กรองรายการ" type="text" idName="update-date"
                                placeholder="ชื่อ, นามสกุล" classLabel="bold"
                                value={form.searchKeyword}
                                handleChange={(value) => {
                                    setForm({ ...form, searchKeyword: value })
                                }}
                            />
                        </Col>
                        <Col>
                            <div className='mt-1'>
                                <Button className={'mr-2 mt-4'} bg={'#3C3C3C'} color={'#fff'} onClick={() => { clearSearch() }}>ล้าง</Button>
                            </div>
                        </Col>
                    </Row>
                    <div className='d-flex justify-content-end my-3'>
                        <h2>{`ยอดคงค้างทั้งหมด: ${waitingPrice} บาท`}</h2>
                    </div>
                    <DataTable
                        columns={columns}
                        data={contentTab}
                        option={
                            {
                                "selectionType": "checkbox",
                                "type": 'selection',
                                "clearSelectedRow": clearSelectedRow,
                                "select": (data) => { setSelectedData(data) }
                            }
                        }
                    ></DataTable>
                    <div>
                        <div className="my-5 d-flex justify-content-end">
                            <Row gutter={[10, 0]}>
                                <Col>
                                    <Button color="white" bg="#96CC39" width={'auto'} className="cursor-p" onClick={() => { toWithDrawBalance() }}>ถอนเงินให้กับสมาชิก</Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </BoxCard>
            </div>
        </div>);
}

export default Audit;
