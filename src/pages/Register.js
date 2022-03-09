import React, { useState } from 'react';

import { Row, Col, } from 'antd'

import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/loginAction';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';

import { Button } from '../components/styles/globalStyles';
import InputText from '../components/InputText';
import BoxCard from '../components/BoxCard';
import Gellery from '../components/Gellery';

import SUTLogo from '../components/SUTLogo';

import * as API from '../utils/apis'
import * as helper from '../utils/helper'

const MySwal = withReactContent(swal)

function Register() {

    const dispatch = useDispatch();
    const history = useHistory();


    const initInvalidMsg = {
        username: "",
        empId: "",
        phone: "",
        firstname: "",
        email: "",
        password: "",
        confirmPassword: "",
    }
    const [invalid, setInvalid] = useState(initInvalidMsg);

    const initForm = {
        username: "",
        empId: "",
        phone: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    }
    const [form, setForm] = useState(initForm);

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
        if (form.phone === '') {
            addInvalid('phone', "กรุณากรอกข้อมูลติดต่อ");
            validated = false;
        }
        if (form.email === '') {
            addInvalid('email', "กรุณาระบุอีเมล");
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

    const checkIsEmployee = () => {
        MySwal.fire({
            text: `ยืนยันการสมัครบัญชีผู้ใช้สำหรับเจ้าหน้าที่ `,
            icon: "question",

            confirmButtonColor: '#96CC39',
            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (value) => {
            if (value.isConfirmed) {
                try {
                    const response = await API.getEmployeeByEmpId(form.empId)
                    const data = await response?.data.data
                    if (response.status === 200 && !response?.data.error) {
                        if (data && data.length === 1) {
                            if (data[0].Email === form.email && data[0].Employee_ID === form.empId && String(data[0].Firstname).length === 1) {
                                toRegister()
                            } else {
                                console.log(data, form);
                                throw "not match";
                            }
                        } else {
                            throw "lenght > 1";
                        }
                    } else {
                        throw response.status
                    }
                } catch (error) {
                    MySwal.fire({
                        text: `ข้อมูลเจ้าหน้าที่ไม่ถูกต้อง \nระบบไม่สามารถบันทึกข้อมูลได้\n` + error,
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

    const toLogin = async () => {
        let dataUser = {
            username: form.username,
            password: form.password
        }
        try {
            const response = await API.login(dataUser);
            const data = await response?.data;
            if (response.status === 200) {
                if (data.auth) {
                    dispatch(login({ data, history }))
                }
                setForm(initForm);
            }
        } catch (error) {
            history.push("/login")
        }
    }

    const toRegister = async () => {
        if (validate()) {
            try {
                const responseCheckUser = await API.checkDuplicate({ username: form.username, email: form.email });
                const dataCheckUser = await responseCheckUser?.data;
                if (responseCheckUser.status === 200) {
                    if (dataCheckUser.resultsEmail.length > 1) {
                        if (dataCheckUser.duplicateUsername) {
                            addInvalid('username', "ชื่อผู้ใช้งานนี้มีคนใช้งานแล้ว");
                        }

                        if (dataCheckUser.duplicateEmail) {
                            addInvalid('email', "อีเมลนี้มีคนใช้งานแล้ว");
                        }
                    }
                    if (!(dataCheckUser.duplicateUsername && dataCheckUser.duplicateEmail)) {
                        //register
                        const response = await API.register({ ...form })
                        if (response.status === 200) {
                            MySwal.fire({
                                text: "ทำการสมัครสมาชิกเรียบร้อย",
                                icon: 'success',
                                confirmButtonColor: '#96CC39',
                                confirmButtonText: 'ตกลง'
                            }).then(toLogin())
                        } else {
                            MySwal.fire({
                                text: "ระบบไม่สามารถทำการสมัครสมาชิกได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
                                icon: 'warning',
                                confirmButtonText: 'ตกลง'
                            })
                        }
                    }
                } else {
                    MySwal.fire({
                        text: "ระบบไม่สามารถทำการสมัครสมาชิกได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    })
                }
            } catch (error) {

            }
        } else {
            MySwal.fire({
                text: "ไม่สามารถบันทึกข้อมูลได้ในขณะนี้ \nกรุณาลองใหม่อีกครั้ง",
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                history.push('/login')
            })
        }

    }
    return (
        <div className='container' style={{ paddingTop: '2%' }}>
            <BoxCard>
                <Row>
                    <Col span={12}>
                        <div className='m-5'>
                            <SUTLogo style={{ fontSize: '52px' }} />
                            <h1 className='logo mt-3'>สมัครสมาชิก</h1>
                            <Row gutter={[10, 0]} className='mb-3'>
                                <Col span={12}>
                                    <InputText title="รหัสเจ้าหน้าที่" type="text" idName="empId" value={form.empId} star={true} classFormGroup="w-100"
                                        placeholder="staff-id" handleChange={(value) => setForm({ ...form, empId: value })}
                                        handleInvalid={() => removeInvalid("empId")} invalid={invalid.empId}
                                    />
                                </Col>
                                <Col span={12}>
                                    <InputText title="ชื่อบัญชีผู้ใช้" type="text" idName="username" value={form.username} star={true} classFormGroup="w-100"
                                        placeholder="username" handleChange={(value) => setForm({ ...form, username: value })}
                                        handleInvalid={() => {
                                            removeInvalid("username")
                                            removeInvalid("email")
                                        }} invalid={invalid.username}
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
                                    <InputText title="นามสกุล" type="text" idName="lastname" value={form.lastname} star={false} classFormGroup="w-100"
                                        placeholder="lastname" handleChange={(value) => setForm({ ...form, lastname: value })}
                                    />
                                </Col>
                            </Row>
                            <div className='mb-3'>
                                <InputText title="โทรศัพท์มือถือ" type="text" idName="phone" value={form.phone} star={true} classFormGroup="w-100"
                                    placeholder="phone" handleChange={(value) => setForm({ ...form, phone: value })}
                                    handleInvalid={() => removeInvalid("phone")} invalid={invalid.phone}
                                />
                            </div>
                            <div className='mb-3'>
                                <InputText title="อีเมล" type="text" idName="email" value={form.email} star={true} classFormGroup="w-100"
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
                            <div className='mb-4'>
                                <Row gutter={[20, 0]}>
                                    <Col>
                                        <Button bg={'#96CC39'} color={'#fff'} onClick={() => { checkIsEmployee() }}>สมัครสมาชิก</Button>
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Row gutter={[10, 0]}>
                                    <Col>
                                        <span>
                                            มีบัญชีผู้ใช้งานแล้ว ?
                                        </span>
                                    </Col>
                                    <Col>
                                        <Link to={`/login`} style={{ fontWeight: 'bolder', fontSize: '16px' }}>
                                            เข้าสู่ระบบ
                                        </Link>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className='m-5 pt-5'>
                            <Gellery style={{ widht: '80%', borderRadius: '10px' }}></Gellery>
                        </div>
                    </Col>
                </Row>
            </BoxCard>
        </div>
    );
}

export default Register;
