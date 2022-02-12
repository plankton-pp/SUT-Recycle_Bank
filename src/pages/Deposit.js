import React, { useState, useEffect } from 'react';

import { Row, Col } from 'antd'
import { Button as ButtonIcon } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'

import DataTable from '../components/DataTable';
import BoxCard from '../components/BoxCard';
import InputText from '../components/InputText';
import { Button } from '../components/styles/globalStyles';
import ModalDeposit from '../components/modal/Modal.Deposit';
import ModalSearchMember from '../components/modal/Modal.SearchMember';

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';

import * as converter from '../utils/converter'
import * as API from '../utils/apis'
import * as helper from '../utils/helper'

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

        mode: "",
        idEdit: "",
        data: [],
    }
    const [form, setForm] = useState(initForm);
    const [showModalSearch, setShowModalSearch] = useState(false)
    const [showModalAdd, setShowModalAdd] = useState(false)
    const [objectList, setObjectList] = useState([]);
    const [netPrice, setNetPrice] = useState(0);
    const [countTransaction, setCountTransaction] = useState(0);
    const [removeItem, setRemoveItem] = useState('');

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

    // useEffect(() => {
    //     console.log(ID);
    // }, []);


    const toSearchMember = () => {
        setShowModalSearch(true)
    }

    const clearSearch = () => {
        if (form.data.length > 0) {
            MySwal.fire({
                text: `ยืนยันการล้างข้อมูลสมาชิก `,
                icon: "question",
                showCloseButton: true,
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
            //เอาออก
            "feeid": "1",
            "fee": "10",
            management: <ButtonIcon type="primary" icon={<DeleteOutlined></DeleteOutlined>} onClick={() => { removeItemFromList(filteredData.index) }} danger></ButtonIcon>,
        }
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
            showCloseButton: true,
            confirmButtonColor: '#96CC39',
            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (result) => {
            if (result.value) {
                const dataToSave = {
                    memid: form.ID,
                    placeby: `${form.Firstname} ${form.Lastname}`,
                    status: "unpaid",
                    empid: `${ID}`,
                    netprice: String(netPrice),
                    product: form.data,
                }
                try {
                    const response = await API.addDeposit(dataToSave);
                    if (response.status === 200) {
                        //if success
                        MySwal.fire({
                            text: `บันทึกสำเร็จ`,
                            icon: "success",
                            confirmButtonText: "ตกลง",
                            confirmButtonColor: '#96CC39',
                        }).then((value) => {
                            if (value.isConfirmed) {
                                setForm(initForm)
                                clearDataTable()
                            }
                        })
                    } else {
                        //if success
                        MySwal.fire({
                            text: `บันทึกไม่สำเร็จ`,
                            icon: "error",
                            confirmButtonText: "ตกลง",
                            confirmButtonColor: '#96CC39',
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
            showCloseButton: true,
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
        <div className="pt-3 mb-4">
            <BoxCard title="ข้อมูลผู้ฝาก">
                <Row gutter={[10, 10]} className='mb-4'>
                    <Col span={8}>
                        <InputText title="ค้นหาสมาชิก" type="text" idName="update-date"
                            placeholder="รหัสสมาชิก, ชื่อ, นามสกุล, เบอร์โทร, อีเมลล์" classLabel="bold"
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
                                    <Button color="white" bg="#96CC39" width={'auto'} className="cursor-p" onClick={() => { toSaveList() }}>บันทึกรายการ</Button>
                                </Col>
                                <Col>
                                    <Button color="white" bg="#E72525" width={'auto'} className="cursor-p" onClick={() => { toClearList() }}>ล้างรายการ</Button>
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


    </div>;
}

export default Deposit
    ;
