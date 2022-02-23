import React, { useState } from 'react';

import { Row, Col, Spin } from 'antd'

import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
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

function ForgetPass() {

    const dispatch = useDispatch();
    const history = useHistory();


    const initInvalidMsg = {
        email: "",
    }
    const [invalid, setInvalid] = useState(initInvalidMsg);

    const initForm = {
        email: "",
    }
    const [form, setForm] = useState(initForm);

    const [showModalValidateCode, setShowModalValidateCode] = useState(false);
    const [isLoad, setIsLoad] = useState(false)

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

        //check complicate data

        if (form.email && !helper.checkEmailFormat(form.email.trim())) {
            addInvalid('email', "กรุณาระบุอีเมลให้ถูกต้อง");
            validated = false;
        }

        return validated;
    }

    const setWithExpiry = (key, value, ttl) => {
        const minsToUnix = ttl * 60 * 1000
        const now = new Date().getTime()
        const expireTime = now + minsToUnix

        // `item` is an object which contains the original value
        // as well as the time when it's supposed to expire
        const item = {
            value: value,
            expiry: expireTime
        }
        localStorage.setItem(key, JSON.stringify(item))
    }

    const randomValidateCode = () => {
        return String(Math.floor(100000 + Math.random() * 900000))
    }

    const checkExistEmail = async () => {
        if (validate()) {
            try {
                const response = await API.getEmployeeByEmpIdViaEmail(form.email)
                const data = await response?.data.data
                if (response.status === 200) {
                    if (data.length === 1) {
                        sendValidateCode()
                    } else {
                        throw "ไม่พบ Email นี้ในระบบ"
                    }
                } else {
                    throw "ไม่สามารถตรวจสอบข้อมูลได้ในขณะนี้"
                }
            } catch (error) {
                MySwal.fire({
                    text: `${error}\nกรุณาทำรายการอีกครั้ง`,
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                })
            }
        }
    }

    const sendValidateCode = async () => {
        setIsLoad(true)
        let randCode = randomValidateCode()
        setWithExpiry("validateCode", String(randCode), 15)
        //send randCode to email
        try {
            const response = await API.sendValidateCode({ sendto: form.email, validateCode: randCode })
            if (response.status === 200) {
                setIsLoad(false)
                setShowModalValidateCode(true)
            }
        } catch (error) {
            MySwal.fire({
                text: "ไม่สามารถส่งรหัสยืนยันได้",
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                history.push('/login')
            })
        }
    }


    return (
        <div className='container' style={{ paddingTop: '2%' }}>
            <Spin tip="Loading..." spinning={isLoad}>
                <BoxCard>
                    <Row>
                        <Col span={12}>
                            <div className='m-5'>
                                <SUTLogo style={{ fontSize: '52px' }} />
                                <h1 className='logo mt-3'>ลืมรหัสผ่าน</h1>
                                <div className='mb-3'>
                                    <InputText title="อีเมลล์" type="text" idName="email" value={form.email} star={true} classFormGroup="w-100"
                                        placeholder="email" handleChange={(value) => setForm({ ...form, email: value })}
                                        handleInvalid={() => removeInvalid("email")} invalid={invalid.email}
                                    />
                                </div>
                                <div className='mb-4'>
                                    <Row gutter={[20, 0]}>
                                        <Col>
                                            <Button bg={'#96CC39'} color={'#fff'} onClick={() => { checkExistEmail() }}>ส่งรหัสยืนยัน</Button>
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
            </Spin>
        </div>
    );
}

export default ForgetPass;
