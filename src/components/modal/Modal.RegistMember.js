import React, { useState } from 'react';

import { Row, Col, Spin } from 'antd'

import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/loginAction';

import { Modal } from 'react-bootstrap';
import { Button } from '../styles/globalStyles';
import InputText from '../InputText';
import InputSelect from '../InputSelect';

import * as API from '../../utils/apis'
import * as helper from '../../utils/helper'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function ModalRegisterMember({ show, close, save, data }) {

    const dispatch = useDispatch();
    const history = useHistory();


    const initInvalidMsg = {
        username: "",
        bankaccount: "",
        phone: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    }
    const [invalid, setInvalid] = useState(initInvalidMsg);

    const initForm = {
        username: "",
        bankaccount: "",
        phone: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    }
    const [form, setForm] = useState(initForm);

    const roleList = [
        { value: 0, label: "แม่บ้าน" },
        { value: 1, label: "อาคารทำการ" },
        { value: 2, label: "บุคคลากร" },
        { value: 3, label: "นักศึกษา" },
    ]
    const [roleOptionList, setRoleOptionlist] = useState(roleList)
    const [isLoad, setIsLoad] = useState(false)

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

    const validate = async () => {
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
        if (form.firstname === '') {
            addInvalid('firstname', "กรุณาระบุชื่อจริงผู้ใช้งาน");
            validated = false;
        }
        if (form.bankaccount === '') {
            addInvalid('bankaccount', "กรุณากรอกหมายเลขธนาคาร");
            validated = false;
        }
        if (form.phone === '') {
            addInvalid('phone', "กรุณากรอกข้อมูลติดต่อ");
            validated = false;
        }
        if (form.email === '') {
            addInvalid('email', "กรุณาระบุอีเมลล์");
            validated = false;
        }
        if (form.password === '') {
            addInvalid('password', "กรุณากรอกรหัสผ่าน");
            validated = false;
        }
        if (form.confirmPassword === '') {
            addInvalid('confirmPassword', "กรุณากรอกรหัสผ่านให้ตรงกัน");
            validated = false;
        }

        //check complicate data

        if (form.email && !helper.checkEmailFormat(form.email.trim())) {
            addInvalid('email', "กรุณาระบุอีเมลให้ถูกต้อง");
            validated = false;
        }

        return validated;
    }

    const checkMember = () => {
        MySwal.fire({
            text: `ยืนยันการสมัครบัญชีผู้ใช้สำหรับสมาชิก `,
            icon: "question",
            confirmButtonColor: '#96CC39',
            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (value) => {
            if (value.isConfirmed) {
                try {
                    const response = await API.searchMember(form.firstname)
                    const data = await response?.data.data
                    if (response.status === 200) {
                        if (data && data.length >= 1) {
                            //find match lastname
                            let check = data.filter((item) => item.Firstname === form.firstname && item.Lastname === form.lastname)
                            if (check.length > 0) {
                                addInvalid('username', "ชื่อผู้ใช้งานนี้มีคนใช้แล้ว");
                            } else {
                                toRegister()
                            }
                        } else {
                            throw "data-lenght error"
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

    const toRegister = async () => {
        try {
            if (validate()) {
                setIsLoad(true)
                //register
                const response = await API.registerMember({ ...form, role: form.role.label, accnumber: form.bankaccount, remark: "" })
                //status 200
                if (response.status === 200) {
                    setIsLoad(false)
                    MySwal.fire({
                        text: "ทำการเพิ่มสมาชิกเรียบร้อย",
                        icon: 'success',
                        confirmButtonColor: '#96CC39',
                        confirmButtonText: 'ตกลง'
                    }).then((value) => {

                    })
                } else {
                    // throw response.status
                }
            } else {
                throw 'error'
            }
        } catch (error) {
            setIsLoad(false)
            MySwal.fire({
                text: "ระบบไม่สามารถทำการเพิ่มสมาชิกได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            })
        }

    }
    return (
        <Spin tip="Loading..." spinning={isLoad}>
            <Modal
                show={show}
                size="l"
                onHide={() => { handleClose() }}
                centered
            >
                <Modal.Body>
                    <Row>
                        <Col span={24}>
                            <div className='m-3'>
                                <div className=" mb-3 d-flex justify-content-between align-items-center">
                                    <h1 className='logo mt-3'>เพิ่มสมาชิก</h1>
                                </div>
                                <Row gutter={[10, 0]} className='mb-3'>
                                    <Col span={12}>
                                        <InputText title="ชื่อบัญชีผู้ใช้" type="text" idName="username" value={form.username} star={true} classFormGroup="w-100"
                                            placeholder="username" handleChange={(value) => setForm({ ...form, username: value })}
                                            handleInvalid={() => {
                                                removeInvalid("username")
                                                removeInvalid("email")
                                            }} invalid={invalid.username}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <InputSelect
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
                                            placeholder="firstname" handleChange={(value) => setForm({ ...form, firstname: value })}
                                            handleInvalid={() => removeInvalid("firstname")} invalid={invalid.firstname}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <InputText title="นามสกุล" type="text" idName="lastname" value={form.lastname} star={true} classFormGroup="w-100"
                                            placeholder="lastname" handleChange={(value) => setForm({ ...form, lastname: value })}
                                            handleInvalid={() => removeInvalid("lastname")} invalid={invalid.lastname}
                                        />
                                    </Col>
                                </Row>
                                <div className='mb-3'>
                                    <InputText title="เลขบัญชีธนาคาร" type="text" idName="bank-account" value={form.bankaccount} star={true} classFormGroup="w-100"
                                        placeholder="bank account" handleChange={(value) => setForm({ ...form, bankaccount: value })}
                                        handleInvalid={() => removeInvalid("bankaccount")} invalid={invalid.bankaccount}
                                    />
                                </div>
                                <div className='mb-3'>
                                    <InputText title="โทรศัพท์มือถือ" type="text" idName="phone" value={form.phone} star={true} classFormGroup="w-100"
                                        placeholder="phone" handleChange={(value) => setForm({ ...form, phone: value })}
                                        handleInvalid={() => removeInvalid("phone")} invalid={invalid.phone}
                                    />
                                </div>
                                <div className='mb-3'>
                                    <InputText title="อีเมลล์" type="text" idName="email" value={form.email} star={true} classFormGroup="w-100"
                                        placeholder="email" handleChange={(value) => setForm({ ...form, email: value })}
                                        handleInvalid={() => {
                                            removeInvalid("username")
                                        }} invalid={invalid.email}
                                    />
                                </div>
                                <div className='mb-4'>
                                    <InputText title="รหัสผ่าน" type="password" idName="password" value={form.password} star={true} classFormGroup="w-100"
                                        placeholder="password" handleChange={(value) => setForm({ ...form, password: value })}
                                        handleInvalid={() => removeInvalid("password")} invalid={invalid.password}
                                    />
                                </div>
                                <div className='mb-4'>
                                    <InputText title="ยืนยันรหัสผ่าน" type="password" idName="confirmPassword" value={form.confirmPassword} star={true} classFormGroup="w-100"
                                        placeholder="confirm password" handleChange={(value) => setForm({ ...form, confirmPassword: value })}
                                        handleInvalid={() => removeInvalid("confirmPassword")} invalid={invalid.confirmPassword}
                                    />
                                </div>
                                <div className='mb-4 d-flex justify-content-end'>
                                    <Row gutter={[20, 0]}>
                                        <Col>
                                            <Button bg={'#96CC39'} color={'#fff'} onClick={() => { checkMember() }}>เพิ่มสมาชิก</Button>
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
