import React, { useState, useEffect } from 'react';

import { Row, Col, Spin } from 'antd'

import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import { Modal } from 'react-bootstrap';
import { Button } from '../styles/globalStyles';
import InputText from '../InputText';
import InputSelect from '../InputSelect';

import * as API from '../../utils/apis'
import * as helper from '../../utils/helper'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function ModalRegisterMember({ show, close, save, data, mode }) {

    const dispatch = useDispatch();
    const history = useHistory();


    const initInvalidMsg = {
        username: "",
        bankaccount: "",
        bank: "",
        phone1: "",
        phone2: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    }
    const [invalid, setInvalid] = useState(initInvalidMsg);

    const initForm = {
        username: "",
        bankaccount: "",
        bank: "",
        phone1: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "1234",
        remark: "",
    }
    const [form, setForm] = useState(initForm);
    const [memberInfo, setMemberInfo] = useState(initForm);
    const [roleOptionList, setRoleOptionlist] = useState([])
    const [isLoad, setIsLoad] = useState(false)
    const [waitForEdit, setWaitForEdit] = useState(true)
    const [remarkLenght, setRemarkLenght] = useState(50)

    useEffect(() => {
        getMemberType()
    }, [])

    useEffect(() => {
        if (mode === 'edit' && roleOptionList.length > 0) {
            getMemberById(data)
        }
    }, [roleOptionList])

    const handleClose = () => {
        close()
    }

    const addInvalid = (element, message) => {
        invalid[element] = message;
        setInvalid({ ...invalid });
    }

    const removeInvalid = (element) => {
        invalid[element] = "";
        setInvalid({ ...invalid });
    }

    const validate = () => {
        let validated = true;

        //check empty
        if (form.empId === '') {
            addInvalid('empId', "กรุณาระบุรหัสเจ้าหน้าที่");
            validated = false;
        }
        if (form.username === '') {
            addInvalid('username', "กรุณาระบุบัญชีผู้ใช้งาน");
            validated = false;
        }
        if (form.bank === '') {
            addInvalid('bank', "กรุณาระบุชื่อธนาคาร");
            validated = false;
        }
        if (form.firstname === '') {
            addInvalid('firstname', "กรุณาระบุชื่อจริงผู้ใช้งาน");
            validated = false;
        }
        if (form.bankaccount === '') {
            addInvalid('bankaccount', "กรุณากรอกหมายเลขธนาคาร");
            validated = false;
        }
        if (form.phone1 === '') {
            addInvalid('phone1', "กรุณากรอกข้อมูลติดต่อ");
            validated = false;
        }
        if (form.password === '') {
            addInvalid('password', "กรุณากรอกรหัสผ่าน");
            validated = false;
        }
        //check complicate data
        if (form.email && !helper.checkEmailFormat(form.email.trim())) {
            addInvalid('email', "กรุณาระบุอีเมลให้ถูกต้อง");
            validated = false;
        }

        return validated;
    }

    const getMemberType = async () => {
        try {
            setIsLoad(true)
            const response = await API.getMemberType()
            const data = response?.data.data
            if (response.status === 200) {
                if (data && data.length > 0) {
                    let typeArray = []
                    data.forEach((item) => {
                        typeArray.push({
                            value: item.Type_Short,
                            label: item.MemberType,
                        })
                    })
                    setRoleOptionlist(typeArray)
                }
            } else {
                throw response.status
            }
            setIsLoad(false)
        } catch (error) {
            setIsLoad(false)
            console.log(error);
            MySwal.fire({
                text: `ไม่สามารถแสดงข้อมูลประเภทสมาชิกได้\n${String(error)}`,
                icon: "error",
                showConfirmButton: true,
                confirmButtonText: "ตกลง",
            })
        }
    }

    const getMemberById = async (id) => {
        try {
            setIsLoad(true)
            const response = await API.getMemberById(id)
            const data = response?.data.data
            if (response.status === 200) {
                if (data && data.length > 0) {
                    let info = {
                        ...form,
                        id: id,
                        username: String(data[0].Username).length > 0 ? data[0].Username : "-",
                        bankaccount: String(data[0].Acc_number).length > 0 ? data[0].Acc_number : "-",
                        bank: String(data[0].Bank).length > 0 ? data[0].Bank : "-",
                        phone1: String(data[0].Phone_number).length > 0 ? data[0].Phone_number : "-",
                        phone2: String(data[0].Phone_number2).length > 0 ? data[0].Phone_number2 : "-",
                        firstname: String(data[0].Firstname).length > 0 ? data[0].Firstname : "-",
                        lastname: String(data[0].Lastname).length > 0 ? data[0].Lastname : "-",
                        email: String(data[0].Email).length > 0 ? data[0].Email : "-",
                        remark: String(data[0].Remark).length > 0 ? data[0].Remark : "-",
                        role: String(data[0].Role).length > 0 ? roleOptionList.filter((item) => { return item.label === data[0].Role })[0] : [{}]
                    }
                    setForm(info)
                    setMemberInfo(info)
                }
            } else {
                throw response.status
            }
            setIsLoad(false)
        } catch (error) {
            setIsLoad(false)
            console.log(error);
            MySwal.fire({
                text: `ไม่สามารถแสดงข้อมูลสมาชิกได้\n${String(error)}`,
                icon: "error",
                showConfirmButton: true,
                confirmButtonText: "ตกลง",
            })
        }
    }

    const checkMember = () => {
        MySwal.fire({
            text: mode == 'add' ? `ยืนยันการสมัครบัญชีผู้ใช้สำหรับสมาชิก` : `ยืนยันการแก้ไขข้อมูลผู้ใช้สำหรับสมาชิก`,
            icon: "question",
            confirmButtonColor: '#96CC39',
            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (value) => {
            if (value.isConfirmed && validate()) {
                try {
                    const response = await API.searchMember(mode === 'add' ? form.firstname : memberInfo.firstname)
                    const data = await response?.data.data
                    if (response.status === 200) {
                        //if user equal or more than 1 ==> duplicate
                        //else ==> no data duplicate -> register
                        //ตรวจสอบข้อมูลซ้ำ
                        if (data && data.length >= 1) {
                            //find match name -> check duplicate username
                            //ในกรณีที่มีสมาชิกที่มีชื่อสกุลเหมือนกัน ดังนั้นการตรวจสอบ username จะสามารถระบุได้ว่ามิใช่บุคคลเดียวกัน
                            let check = data.filter((item) => item.Firstname === form.firstname && item.Lastname === form.lastname)
                            if (check.length > 0) {
                                if (check.length === 1 && check[0].Username === form.username) {
                                    if (mode === 'add') {
                                        addInvalid('username', "ชื่อผู้ใช้งานนี้มีคนใช้แล้ว");
                                    } else {
                                        toRegister()
                                    }
                                } else {
                                    MySwal.fire({
                                        text: `ไม่สามารถเพิ่มสมาชิกได้เนื่องจากพบข้อมูลซ้ำในฐานข้อมูล \nกรุณาลองใหม่`,
                                        icon: "error",
                                        showConfirmButton: true,
                                        confirmButtonText: "ตกลง",
                                    })
                                }
                            } else {
                                toRegister()
                            }
                        } else {
                            toRegister()
                        }
                    } else {
                        throw "status error"
                    }
                } catch (error) {
                    MySwal.fire({
                        text: `ข้อมูลสมาชิกไม่ถูกต้อง \nระบบไม่สามารถบันทึกข้อมูลได้\n` + error,
                        icon: "error",
                        showConfirmButton: true,
                        confirmButtonText: "ตกลง",
                    }).then((value) => {
                        // if (value.isConfirmed) {
                        //     history.push("/login")
                        // }
                    })
                }
            }
        })
    }

    //รอเช็คว่า add หรือ update
    const toRegister = async () => {
        try {
            if (validate()) {
                setIsLoad(true)
                //register
                const response = mode === 'add' ?
                    await API.registerMember({ ...form, role: form.role.label, accnumber: form.bankaccount, email: String(form.email).length > 0 ? form.email : '-' })
                    :
                    await API.updateMemberById({ ...form, role: form.role.label, accnumber: form.bankaccount, email: String(form.email).length > 0 ? form.email : '-' })
                //status 200
                if (response.status === 200) {
                    setIsLoad(false)
                    MySwal.fire({
                        text: mode === 'add' ? "ทำการเพิ่มสมาชิกเรียบร้อย" : "แก้ไขข้อมูลสมาชิกเรียบร้อย",
                        icon: 'success',
                        confirmButtonColor: '#96CC39',
                        confirmButtonText: 'ตกลง'
                    }).then((value) => {
                        handleClose()
                    })
                } else {
                    throw response.status
                }
            } else {
                throw 'error'
            }
        } catch (error) {
            setIsLoad(false)
            MySwal.fire({
                html: <h6>ระบบไม่สามารถทำการ{mode === 'add' ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'}ได้ในขณะนี้<br /> กรุณาลองใหม่อีกครั้ง</h6>,
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            })
        }

    }

    const setOnEdit = () => {
        MySwal.fire({
            text: "ยืนยันการแก้ไขข้อมูล",
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#96CC39',
        }).then((value) => {
            if (value.isConfirmed) {
                setWaitForEdit(false)
            }
        })
    }

    return (
        <Spin tip="Loading..." spinning={isLoad}>
            <Modal
                show={show}
                size="lg"
                // onHide={() => { handleClose() }}
                centered
            >
                <Modal.Body>
                    <Row>
                        <Col span={24}>
                            <div className='m-3'>
                                <div className=" mb-3 d-flex justify-content-between align-items-center">
                                    <h1 className='logo mt-3'>{mode === 'add' ? 'เพิ่มสมาชิก' : waitForEdit ? 'รายละเอียดสมาชิก' : 'แก้ไขข้อมูลสมาชิก'}</h1>
                                </div>
                                <Row gutter={[10, 0]} className='mb-3'>
                                    <Col span={12}>
                                        <InputText title="ชื่อบัญชีผู้ใช้" type="text" idName="username" value={form.username} star={true} classFormGroup="w-100"
                                            placeholder="ชื่อบัญชีผู้ใช้" handleChange={(value) => setForm({ ...form, username: value })}
                                            handleInvalid={() => {
                                                removeInvalid("username")
                                                removeInvalid("email")
                                            }} invalid={invalid.username}
                                            disabled={waitForEdit}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <InputSelect
                                            disabled={waitForEdit}
                                            title="ประเภทผู้ใช้งาน"
                                            star={true}
                                            optionsList={roleOptionList}
                                            selectValue={form.role}
                                            handleChange={(value) => {
                                                setForm({ ...form, role: value })
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={[10, 0]} className='mb-3'>
                                    <Col span={12}>
                                        <InputText title="ชื่อ" type="text" idName="firstname" value={form.firstname} star={true} classFormGroup="w-100"
                                            placeholder="ชื่อ" handleChange={(value) => setForm({ ...form, firstname: value })}
                                            handleInvalid={() => removeInvalid("firstname")} invalid={invalid.firstname}
                                            disabled={waitForEdit}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <InputText title="นามสกุล" type="text" idName="lastname" value={form.lastname} star={true} classFormGroup="w-100"
                                            placeholder="นามสกุล" handleChange={(value) => setForm({ ...form, lastname: value })}
                                            handleInvalid={() => removeInvalid("lastname")} invalid={invalid.lastname}
                                            disabled={waitForEdit}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={[10, 0]} className='mb-3'>
                                    <Col span={12}>
                                        <InputText title="ธนาคาร" type="text" idName="bank" value={form.bank} star={true} classFormGroup="w-100"
                                            placeholder="ธนาคาร" handleChange={(value) => setForm({ ...form, bank: value })}
                                            handleInvalid={() => removeInvalid("bank")} invalid={invalid.bank}
                                            disabled={waitForEdit}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <InputText title="เลขบัญชีธนาคาร" type="text" idName="bank-account" value={form.bankaccount} star={true} classFormGroup="w-100"
                                            placeholder="เลขบัญชีธนาคาร" handleChange={(value) => setForm({ ...form, bankaccount: value })}
                                            handleInvalid={() => removeInvalid("bankaccount")} invalid={invalid.bankaccount}
                                            disabled={waitForEdit}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={[10, 0]} className='mb-3'>
                                    <Col span={12}>
                                        <InputText title="โทรศัพท์มือถือ" type="text" idName="phone1" value={form.phone1} star={true} classFormGroup="w-100"
                                            placeholder="โทรศัพท์มือถือ" handleChange={(value) => setForm({ ...form, phone1: value })}
                                            handleInvalid={() => removeInvalid("phone1")} invalid={invalid.phone1}
                                            disabled={waitForEdit}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <InputText title="โทรศัพท์มือถือ (สำรอง)" type="text" idName="phone2" value={form.phone2} classFormGroup="w-100"
                                            placeholder="โทรศัพท์มือถือ (สำรอง)" handleChange={(value) => setForm({ ...form, phone2: value })}
                                            disabled={waitForEdit}
                                        />
                                    </Col>
                                </Row>
                                <div className='mb-3'>
                                    <InputText title="อีเมล" type="text" idName="email" value={form.email} star={false} classFormGroup="w-100"
                                        placeholder="อีเมล" handleChange={(value) => setForm({ ...form, email: value })}
                                        handleInvalid={() => {
                                            removeInvalid("email")
                                        }} invalid={invalid.email}
                                        disabled={waitForEdit}
                                    />
                                </div>
                                <div className='mb-3'>
                                    < InputText
                                        disabled={waitForEdit}
                                        title={`หมายเหตุ (${form.remark.length}/${remarkLenght})`} idName="remark"
                                        type="text"
                                        as={"textarea"} rows={2}
                                        placeholder="หมายเหตุ" value={form.remark}
                                        handleChange={(value) => {
                                            setForm({ ...form, remark: String(value).slice(0, remarkLenght) })
                                        }}
                                    />
                                </div>
                                <div className='mb-4 d-flex justify-content-end'>
                                    <Row gutter={[10, 0]}>
                                        <Col>
                                            <Button style={{ width: '80px' }} bg={waitForEdit ? 'orange' : '#96CC39'} color={'#fff'} onClick={() => { waitForEdit ? setOnEdit() : checkMember() }}>{mode === 'add' ? "เพิ่มสมาชิก" : waitForEdit ? "แก้ไข" : "บันทึก"}</Button>
                                        </Col>
                                        <Col>
                                            <Button bg={'#E72525'} color={'#fff'} onClick={() => { handleClose() }}>ยกเลิก</Button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </Spin>
    );
}

export default ModalRegisterMember;
