import React, { useState, useEffect } from 'react';

import { Row, Col, } from 'antd'

import { useLocation, useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/loginAction';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';

import { Button } from '../components/styles/globalStyles';
import InputText from '../components/InputText';
import BoxCard from '../components/BoxCard';
import Gellery from '../components/Gellery';
import ModalValidateCode from '../components/modal/Modal.ValidateCode';

import SUTLogo from '../components/SUTLogo';

import * as API from '../utils/apis'
import * as helper from '../utils/helper'

const MySwal = withReactContent(swal)

function ResetPass() {

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();


    const initInvalidMsg = {
        password: "",
        confirmPassword: "",
    }
    const [invalid, setInvalid] = useState(initInvalidMsg);

    const initForm = {
        password: "",
        confirmPassword: "",
    }
    const [form, setForm] = useState(initForm);

    const [showModalValidateCode, setShowModalValidateCode] = useState(false);

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
        if (form.confirmPassword !== form.password) {
            if (form.password === '') {
                addInvalid('password', "กรุณากรอกรหัสผ่าน");
            } else if (form.confirmPassword === '') {
                addInvalid('confirmPassword', "กรุณายืนยันรหัสผ่าน");
            } else {
                addInvalid('password', "กรุณากรอกรหัสผ่านให้ตรงกัน");
                addInvalid('confirmPassword', "กรุณากรอกรหัสผ่านให้ตรงกัน");
            }
            validated = false;
        } else {
            if (form.password === '') {
                addInvalid('password', "กรุณากรอกรหัสผ่าน");
                validated = false;
            }
        }
        return validated;
    }

    const resetNewPassword = async () => {
        if (validate()) {
            let param = String(location.search)
            let mail = param.substring(7, param.length)
            //reset pass api
            try {
                const response = await API.resetPassword({ email: mail, newpassword: form.password })
                if (response.status === 200) {
                    MySwal.fire({
                        text: "เปลี่ยนรหัสผ่านสำเร็จ",
                        icon: 'success',
                        confirmButtonColor: '#96CC39',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        history.push('/login')
                    })
                } else {
                    MySwal.fire({
                        text: "ระบบไม่สามารถทำการเปลี่ยนรหัสผ่านได้",
                        icon: 'error',
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        history.push('/login')
                    })
                }
            } catch (error) {

            }
        }
    }

    // const toLogin = async () => {
    //     let dataUser = {
    //         username: form.username,
    //         password: form.password
    //     }
    //     try {
    //         const response = await API.login(dataUser);
    //         const data = await response?.data;
    //         console.log("response", response);
    //         if (response.status === 200) {
    //             if (data.auth) {
    //                 dispatch(login({ data, history }))
    //             }
    //             setForm(initForm);
    //         }
    //     } catch (error) {
    //         history.push("/login")
    //     }
    // }

    return (
        <div className='container' style={{ paddingTop: '2%' }}>
            <BoxCard>
                <Row>
                    <Col span={12}>
                        <div className='m-5'>
                            <SUTLogo style={{ fontSize: '52px' }} />
                            <h1 className='logo mt-3'>เปลี่ยนรหัสผ่าน</h1>
                            <div className='mb-4'>
                                <InputText title="รหัสผ่านใหม่" type="password" idName="password" value={form.password} star={true} classFormGroup="w-100"
                                    placeholder="password" handleChange={(value) => setForm({ ...form, password: value })}
                                    handleInvalid={() => removeInvalid("password")} invalid={invalid.password}
                                />
                            </div>
                            <div className='mb-4'>
                                <InputText title="ยืนยันรหัสผ่านใหม่" type="password" idName="confirmPassword" value={form.confirmPassword} star={true} classFormGroup="w-100"
                                    placeholder="confirm password" handleChange={(value) => setForm({ ...form, confirmPassword: value })}
                                    handleInvalid={() => {
                                        removeInvalid("password")
                                        removeInvalid("confirmPassword")
                                    }} invalid={invalid.confirmPassword}
                                />
                            </div>
                            <div className='mb-4'>
                                <Row gutter={[20, 0]}>
                                    <Col>
                                        <Button bg={'#96CC39'} color={'#fff'} onClick={() => { resetNewPassword() }}>เปลี่ยนรหัสผ่าน</Button>
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

            {showModalValidateCode &&
                <ModalValidateCode
                    show={showModalValidateCode}
                    close={() => setShowModalValidateCode(false)}
                    data={form.email}
                />
            }
        </div>
    );
}

export default ResetPass;
