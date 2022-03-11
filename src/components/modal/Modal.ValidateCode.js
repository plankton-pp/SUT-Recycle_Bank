import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Row, Col, Statistic, Spin } from 'antd';
import { Button } from '../styles/globalStyles';
import OTPInput from "react-otp-input";
import { useHistory } from 'react-router-dom'

function ModalValidateCode({ show, close, save, mode, idEdit, data }) {

    const history = useHistory();
    const [otp, setOTP] = useState("");
    const [checkInvalide, setCheckInvalid] = useState(false);
    const [isLoad, setIsLoad] = useState(false)
    const { Countdown } = Statistic;
    const [deadline, setDeadline] = useState(Date.now() + 1000 * 60 * 15)
    const handleClose = () => {
        close()
    }

    const getWithExpiry = (key) => {
        const itemStr = localStorage.getItem(key)
        // if the item doesn't exist, return null
        if (!itemStr) {
            console.log('yes');
            return null
        }
        const item = JSON.parse(itemStr)
        const now = new Date()
        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            localStorage.removeItem(key)
            return null
        }
        return item.value
    }
    const checkValidateCodeViaInput = (value) => {
        setCheckInvalid(false)
        setOTP(value)
        const validateCode = getWithExpiry('validateCode')
    }

    const checkValidateCode = () => {
        setIsLoad(true)
        const validateCode = getWithExpiry('validateCode')
        if (String(otp) === String(validateCode)) {
            let redirectTo = '/resetpassword?email=' + data
            setTimeout(() => { history.push(redirectTo) }, 2000);
        } else {
            setIsLoad(false)
            setCheckInvalid(true)
        }

    }

    return (
        <Modal
            show={show}
            size="m"
            onHide={() => { handleClose() }}
            centered
        >
            <Modal.Body>
                <Spin tip="Loading..." spinning={isLoad}>
                    <Row>
                        <Col span={24}>
                            <div className="d-flex justify-content-center mb-3 mt-5" >
                                <h3>ยืนยัน Validate Code</h3>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <div className="d-flex justify-content-center mb-2" >
                                <div className='pt-2 px-2'>
                                    <h5>รหัสจะหมดอายุใน</h5>
                                </div>
                                <div>
                                    <h6>
                                        <Countdown value={deadline} onFinish={() => { handleClose() }} />
                                    </h6>
                                </div>
                                <div className='pt-2 px-2'>
                                    <h5>นาที</h5>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        <Col span={24}>
                            <div className="d-flex justify-content-center" >
                                <div className='otp'>
                                    <OTPInput
                                        onChange={(value) => { checkValidateCodeViaInput(value) }}
                                        value={otp}
                                        inputStyle="otp-input-style"
                                        numInputs={6}
                                        separator={<span></span>}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {!checkInvalide &&
                        <div>
                            <Row className='mt-5 mb-5'>
                                <Col span={24}>
                                    <div className="d-flex justify-content-center" >
                                        <Button bg={'#96CC39'} color={'#fff'} onClick={() => { checkValidateCode() }}>ยืนยัน</Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    }

                    {checkInvalide &&
                        <div>
                            <Row className='mb-5'>
                                <Col span={24}>
                                    <div className="d-flex justify-content-center" >
                                        <span style={{ color: 'red' }}>{'รหัสไม่ถูกต้อง'}</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-5'>
                                <Col span={24}>
                                    <div className="d-flex justify-content-center" >
                                        <Button color="white" bg="#3C3C3C" className="cursor-p" onClick={() => { handleClose() }}>ส่งรหัสใหม่</Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    }
                </Spin>
            </Modal.Body>

        </Modal>
    );
}

export default ModalValidateCode;
