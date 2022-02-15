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

function PasswordSetting() {
    const { Email } = JSON.parse(helper.sessionGet('login'))
    const history = useHistory();


    const initInvalidMsg = {
        password: "",
        currentPassword: "",
        confirmPassword: "",
    }
    const [invalid, setInvalid] = useState(initInvalidMsg);

    const initForm = {
        password: "",
        currentPassword: "",
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
            if (form.currentPassword === '') {
                addInvalid('currentPassword', "กรุณากรอกรหัสผ่าน");
            } else if (form.password === '') {
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

    const checkEmailAndPassword = async () => {
        try {
            const response = await API.login({ username: Email, password: form.currentPassword })
            const data = await response?.data
            if (response.status === 200 && data.auth) {
                resetNewPassword()
            } else {
                MySwal.fire({
                    text: "รหัสผ่านปัจจุบันไม่ถูกต้อง",
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                })
            }
        } catch (error) {

        }
    }

    const resetNewPassword = async () => {
        if (validate()) {
            //reset pass api
            try {
                const response = await API.resetPassword({ email: Email, newpassword: form.password })
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
    return (
        <div className='container'>
            <BoxCard title={"จัดการรหัสผ่าน"}>
                <Row>
                    <Col span={12}>
                        <div className='m-5'>
                            <div className='mb-4'>
                                <InputText title="รหัสผ่านปัจจุบัน" type="password" idName="old-password" value={form.currentPassword} star={true} classFormGroup="w-100"
                                    placeholder="current password" handleChange={(value) => setForm({ ...form, currentPassword: value })}
                                    handleInvalid={() => removeInvalid("currentPassword")} invalid={invalid.currentPassword}
                                />
                            </div>
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
                                        <Button bg={'#96CC39'} color={'#fff'} onClick={() => { checkEmailAndPassword() }}>เปลี่ยนรหัสผ่าน</Button>
                                    </Col>
                                </Row>
                            </div>
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

export default PasswordSetting;
