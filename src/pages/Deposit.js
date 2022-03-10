import React, { useState, useEffect } from 'react';

import { Row, Col, Spin } from 'antd'
import { Button as ButtonIcon } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'

import DataTable from '../components/DataTable';
import BoxCard from '../components/BoxCard';
import InputText from '../components/InputText';
import { Button } from '../components/styles/globalStyles';
import ModalDeposit from '../components/modal/Modal.Deposit';
import ModalSearchMember from '../components/modal/Modal.SearchMember';
import ModalRegisterMember from '../components/modal/Modal.RegistMember';

import * as converter from '../utils/converter'
import * as API from '../utils/apis'
import * as helper from '../utils/helper'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)
function Deposit() {
    const { ID } = JSON.parse(helper.sessionGet('login'))
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            width: '50px'
        },
        {
            title: 'ชื่อวัสดุ',
            dataIndex: 'productname',

        },
        {
            title: 'ประเภท',
            dataIndex: 'typename',
        },
        {
            title: 'จำนวน',
            dataIndex: 'unit',
            sorter: {
                compare: (a, b) => a.amount - b.amount,
                multiple: 3,
            },
            width: '100px',
            align: 'right',
        },
        {
            title: 'หน่วย',
            dataIndex: 'unitdetail',
            align: 'center'
        },
        {
            title: 'มูลค่าต่อหน่วย (บาท)',
            dataIndex: 'productprice',
            sorter: {
                compare: (a, b) => a.pricePerUnit - b.pricePerUnit,
                multiple: 2,
            },
            width: '200px',
            align: 'right',
        },
        {
            title: 'ยอดฝาก (บาท)',
            dataIndex: 'totalprice',
            sorter: {
                compare: (a, b) => a.sumPrice - b.sumPrice,
                multiple: 1,
            },
            width: '200px',
            align: 'right',
        },
        {
            title: 'การจัดการ',
            dataIndex: 'management',
            align: 'center'
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
        LastFee: 0,

        mode: "",
        idEdit: "",
        data: [],
    }
    const [form, setForm] = useState(initForm);
    const [showModalSearch, setShowModalSearch] = useState(false)
    const [showModalAdd, setShowModalAdd] = useState(false)
    const [showRegisterMember, setShowRegisterMember] = useState(false)
    const [objectList, setObjectList] = useState([]);
    const [netPrice, setNetPrice] = useState(0);
    const [countTransaction, setCountTransaction] = useState(0);
    const [removeItem, setRemoveItem] = useState('');
    const [isLoad, setIsLoad] = useState(false)

    useEffect(() => {
        setForm({ ...form, data: [...objectList] })
        setCountTransaction(objectList.length)
        let sumPriceChanged = 0
        objectList.forEach((item) => {
            sumPriceChanged = Number(sumPriceChanged) + Number(item.totalprice)
        })
        setNetPrice(sumPriceChanged)

    }, [objectList]);

    useEffect(() => {
        let removedList = objectList.filter((item) => { return item.index !== removeItem }).map((item, i) => { return { ...item, index: i, key: i + 1 } })
        setObjectList(removedList)
    }, [removeItem]);

    const toSearchMember = () => {
        setShowModalSearch(true)
    }

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
                    clearDataTable()
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

    const toAddList = () => {
        setForm({ ...form, mode: "add", idEdit: "" })
        setShowModalAdd(true)
    }

    const removeItemFromList = (index) => {
        if (index > -1) {
            setRemoveItem(index)
        }
    }

    const clearDataTable = () => {
        setObjectList([])
        setForm({ ...form, data: [] })
    }

    const renderReceiptMessage = (item) => {
        return (`<tr >
            <td class="sub">`+ item.productname + `</td>
            <td class="sub">`+ item.typename + `</td>
            <td class="sub">`+ item.productprice + ` บาท</td>
            <td class="sub"> จำนวน `+ item.unit + `</td>
            <td class="sub">กิโลกรัม</td>
        </tr>`)
    }

    const sendReceipt = async () => {
        if (String(form.Email).includes('@')) {
            MySwal.fire({
                text: `บันทึกสำเร็จ`,
                icon: "success",
                confirmButtonText: "ตกลง",
                confirmButtonColor: '#96CC39',
            }).then(() => {
                setIsLoad(false)
                setForm(initForm)
                clearDataTable()
            })
        } else {
            try {
                const now = new Date().getTime()
                const today = helper.momentDateTh(now, "th", "short")
                let message = `
                <html  lang="th">
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <style>
                        table {width: 100%}
                        table, th,tr {border:1px solid black;font: 18px;Arial, sans-serif;}
                        td.sub {
                            font: 18px;Arial, sans-serif;
                        }
                    </style>
                    <body>
                        <h3>บัญชีของ ` + form.Firstname + " " + form.Lastname + ` ได้ทำรายการฝากวัสดุ</h3>
                        <h3>รายละเอียดวัสดุนำฝาก:<br /></h3>
                        <table>
                            <tr>
                                <th>ชื่อวัสดุ</th>
                                <th>ประเภทที่ฝาก</th>
                                <th>มูลค่าต่อหน่วย</th>
                                <th>ยอดฝาก</th>
                                <th>หน่วย</th>
                            </tr>`
                    + form.data.map((item) => { return renderReceiptMessage(item) }) +
                    `<tr>
                                <td colspan="3">ยอดรวม</td>
                                <td>`+ netPrice + ` บาท</td>
                            </tr>
                        </table>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <hr/>
                        <h3>ทำรายการเมื่อวันที่ ` + today + `</h3>
                        <h3>เจ้าหน้าที่</h3>
                        <h3>ธนาคารวัสดุรีไซเคิล มหาวิทยาลัยเทคโนโลยีสุรนารี</h3>
                        <h3>
                        ติดต่อส่วนอาคารสถานที่
                        สำนักงานส่วนอาคารสถานที่ 111 มหาวิทยาลัยเทคโนโลยีสุรนารี ถ.มหาวิทยาลัย ต.สุรนารี อ.เมือง จ.นครราชสีมา 30000
                            <h3>
                    </body>
                </html>`
                // console.log(String(message));
                const response = await API.sendReceipt({ sendto: form.Email, receipt: message })
                if (response.status === 200) {
                    MySwal.fire({
                        text: `บันทึกสำเร็จ`,
                        icon: "success",
                        confirmButtonText: "ตกลง",
                        confirmButtonColor: '#96CC39',
                    }).then(() => {
                        setIsLoad(false)
                        setForm(initForm)
                        clearDataTable()
                    })
                } else {
                    MySwal.fire({
                        text: `ไม่สามารถส่งข้อมูลใบเสร็จได้ `,
                        icon: "error",
                        showConfirmButton: true,
                        confirmButtonText: "ตกลง",
                    }).then(() => {
                        setIsLoad(false)
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const addItemToList = async (data) => {
        let filteredData = {
            index: form.data.length,
            key: form.data.length + 1,
            productid: String(data.id),
            productname: data.name,
            typeid: String(data.typeId),
            typename: data.type[0],
            unit: data.amount,
            productprice: Number(data.pricePerUnit).toFixed(2),
            totalprice: data.sumPrice.toFixed(2),
            unitdetail: data.unitDetail,
            management: <ButtonIcon type="primary" icon={<DeleteOutlined></DeleteOutlined>} onClick={() => { removeItemFromList(filteredData.index) }} danger></ButtonIcon>,
        }
        setForm({ ...form, LastFee: data.lastFee })
        setCountTransaction(countTransaction + 1)
        setNetPrice(Number(netPrice) + Number(filteredData.totalprice))
        setObjectList([...form.data, filteredData])
    }

    const setMemberData = (memberData) => {
        setForm({
            ...form,
            key: memberData.key,
            Acc_number: memberData.Acc_number,
            Bank: memberData.Bank,
            Email: memberData.Email,
            Firstname: memberData.Firstname,
            ID: memberData.ID,
            Lastname: memberData.Lastname,
            No_members: memberData.No_members,
            Phone_number: memberData.Phone_number,
            Phone_number2: memberData.Phone_number2,
            Remark: memberData.Remark,
            Role: memberData.Role,
            Username: memberData.Username,
        })
    }

    const toSaveList = () => {
        MySwal.fire({
            text: `ยืนยันการบันทึกรายการ `,
            icon: "question",

            confirmButtonColor: '#96CC39',
            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (result) => {
            if (result.value) {
                const dataToSave = {
                    memid: form.ID,
                    placeby: `${form.Firstname} ${form.Lastname}`,
                    empid: `${ID}`,
                    netprice: String(netPrice),
                    product: form.data,
                    lastFee: form.LastFee,
                    type: "deposit",
                    status: "unpaid",
                }
                try {
                    setIsLoad(true)
                    const response = await API.addDeposit(dataToSave);
                    if (response.status === 200) {
                        //if success
                        sendReceipt()
                    } else {
                        //if success
                        MySwal.fire({
                            text: `บันทึกไม่สำเร็จ`,
                            icon: "error",
                            confirmButtonText: "ตกลง",
                            confirmButtonColor: '#96CC39',
                        }).then(() => {
                            setIsLoad(false)
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    const toClearList = () => {
        MySwal.fire({
            text: `ยืนยันที่จะลบ `,
            icon: "question",

            confirmButtonColor: '#E72525',
            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (result) => {
            if (result.value) {
                clearDataTable()
                //if success
                MySwal.fire({
                    text: `ลบสำเร็จ`,
                    icon: "success",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: '#96CC39',
                })
            }
        })

    }

    const buttonAdd = () => {
        return (<Button onClick={() => toAddList()} disabled={form.Firstname === ''}>เพิ่มรายการ</Button>)
    }


    return <div className='container'>
        <Spin tip="Loading..." spinning={isLoad}>
            <div className="pt-3 mb-4">
                <BoxCard title="ข้อมูลผู้ฝาก">
                    <Row gutter={[10, 10]} className='mb-4'>
                        <Col span={8}>
                            <InputText title="ค้นหาสมาชิก" type="text" idName="update-date"
                                placeholder="รหัสสมาชิก, ชื่อ, นามสกุล, เบอร์โทร, อีเมล" classLabel="bold"
                                value={form.searchKeyword}
                                handleChange={(value) => {
                                    setForm({ ...form, searchKeyword: value })
                                }}
                            />
                        </Col>
                        <Col>
                            <div className='mt-1'>
                                <Button className={'mr-2 mt-4'} bg={'#96CC39'} color={'#fff'} onClick={() => { toSearchMember() }}>ค้นหา</Button>
                            </div>
                        </Col>
                        <Col>
                            <div className='mt-1'>
                                <Button className={'mr-2 mt-4'} bg={'#3C3C3C'} color={'#fff'} onClick={() => { clearSearch() }}>ล้าง</Button>
                            </div>
                        </Col>

                    </Row>
                    <Row gutter={[30, 10]} className='mb-4'>
                        <Col >
                            <InputText title="รหัสสมาชิก" type="text" idName="user-id"
                                placeholder="Text" classLabel="bold"
                                disabled={true}
                                value={form.ID}
                                handleChange={(value) => {
                                    //
                                }}
                            />
                        </Col>
                        <Col >
                            <InputText title="ชื่อ" type="text" idName="user-name"
                                placeholder="Text" classLabel="bold"
                                disabled={true}
                                value={form.Firstname}
                                handleChange={(value) => {
                                    //
                                }}
                            />
                        </Col>
                        <Col >
                            <InputText title="สกุล" type="text" idName="user-lastname"
                                placeholder="Text" classLabel="bold"
                                disabled={true}
                                value={form.Lastname}
                                handleChange={(value) => {
                                    //
                                }}
                            />
                        </Col>
                        <Col >
                            <InputText title="โทรศัพท์มือถือ" type="text" idName="user-tel"
                                placeholder="Text" classLabel="bold"
                                disabled={true}
                                value={form.Phone_number ? form.Phone_number : "-"}
                                handleChange={(value) => {
                                    //
                                }}
                            />
                        </Col>
                    </Row>
                </BoxCard>
            </div>
            <div>
                <BoxCard title="รายการวัสดุที่ต้องการฝาก" headRight={buttonAdd()}>
                    <DataTable columns={columns} data={form.data} limitPositionLeft={true} option={{ "showLimitPage": true }}></DataTable>
                    <div>
                        <hr />
                        <Row className='mx-2 pt-3 d-flex justify-content-end' gutter={[40, 0]}>
                            <Col>

                                <h6>{`ยอดทั้งหมด:`}</h6>
                                <hr />
                                <h6>{`ยอดฝากสุทธิ:`}</h6>
                            </Col>
                            <Col>
                                <div className='w-100 text-end'>
                                    <h6>{`${countTransaction}`}</h6>
                                </div>
                                <hr />
                                <div className='w-100 text-end'>
                                    <h6>{`${Number(netPrice).toFixed(2)}`}</h6>
                                </div>

                                <h6>{`(${converter.ArabicNumberToText(Number(netPrice).toFixed(2))})`}</h6>
                            </Col>
                            <Col>
                                <h6>{`รายการ`}</h6>
                                <hr />
                                <h6>{`บาท`}</h6>
                            </Col>
                        </Row>
                    </div>
                    {form.data && form.data.length ?
                        <div>
                            <div className="my-5 d-flex justify-content-end">
                                <Row gutter={[10, 0]}>
                                    <Col>
                                        <Button color="white" bg="#96CC39" width={'auto'} onClick={() => { toSaveList() }}>บันทึกรายการ</Button>
                                    </Col>
                                    <Col>
                                        <Button color="white" bg="#E72525" width={'auto'} onClick={() => { toClearList() }}>ล้างรายการ</Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>

                        :
                        null
                    }
                </BoxCard>
            </div>

            {showModalSearch &&
                <ModalSearchMember
                    show={showModalSearch}
                    close={() => setShowModalSearch(false)}
                    mode={form.mode} idEdit={form.idEdit}
                    data={form.searchKeyword}
                    save={(dataMember) => { setMemberData(dataMember) }}
                    showmodal={(bool) => { setShowRegisterMember(bool) }}
                />
            }

            {showModalAdd &&
                <ModalDeposit
                    show={showModalAdd}
                    close={() => setShowModalAdd(false)}
                    mode={form.mode} idEdit={form.idEdit}
                    save={(value) => addItemToList(value)}
                />
            }

            {showRegisterMember &&
                <ModalRegisterMember
                    show={showRegisterMember}
                    close={() => setShowRegisterMember(false)}
                    // data={form.searchKeyword}
                    save={() => { }}
                ></ModalRegisterMember>
            }

        </Spin>
    </div >;
}

export default Deposit
    ;
