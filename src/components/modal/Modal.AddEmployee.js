import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Spin } from 'antd'
import { Table } from 'react-bootstrap'
import InputText from '../InputText'
import { Button } from '../styles/globalStyles'
import { Modal } from 'react-bootstrap';
import ModalHeader from '../ModalHeader';
import * as API from '../../utils/apis'
import * as helper from '../../utils/helper'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal);

function ModalAddEmployee({ show, close, save, data }) {
    const history = useHistory()

    const initInvalidMsg = {
        empId: "",
        email: "",
    }

    const [invalid, setInvalid] = useState(initInvalidMsg);
    const initForm = {
        empId: "",
        email: "",
    }

    const [form, setForm] = useState(initForm)
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

    const validate = () => {
        let validated = true;

        if (form.empId === "") {
            addInvalid('empId', "กรุณาระบุรหัสเจ้าหน้าที่");
            validated = false;
        }

        if (form.email === "") {
            addInvalid('email', "กรุณาระบุอีเมล");
            validated = false;
        }

        //check complicate data
        if (form.email && !helper.checkEmailFormat(form.email.trim())) {
            addInvalid('email', "กรุณาระบุอีเมลให้ถูกต้อง");
            validated = false;
        }

        return validated;
    }

    const toAddNewEmp = () => {
        if (validate()) {
            MySwal.fire({
                text: `ยืนยันการบันทึกรายการ `,
                icon: "question",

                confirmButtonColor: '#96CC39',
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
            }).then(async (value) => {
                if (value.isConfirmed) {
                    try {
                        setIsLoad(true)
                        const data = {
                            Email: form.email,
                            Empid: form.empId
                        }
                        const response = await API.addNewEmp(data)
                        if (response?.data.duplicate) {
                            throw 'error duplicate'
                        } else if (response.status === 200) {
                            setForm(initForm)
                            setIsLoad(false)
                            MySwal.fire({
                                text: `บันทึกข้อมูลสำเร็จ` + response.message,
                                icon: "success",
                                confirmButtonColor: '#96CC39',
                                confirmButtonText: "ตกลง",
                            }).then(() => { handleClose() })
                        } else {
                            throw `ระบบไม่สามารถบันทึกข้อมูลได้\n${response.status}`
                        }
                    } catch (error) {
                        setIsLoad(false)
                        console.log(error);
                        MySwal.fire({
                            html: error === 'error duplicate' ? `<h6>ระบบไม่สามารถบันทึกข้อมูลได้ <br />Email หรือ Employee ID <br />ถูกใข้งานแล้ว</h6>` : '<h6>ระบบไม่สามารถบันทึกข้อมูลได้<br />กรุณาทำรายการอีกครั้ง<h6>',
                            icon: "error",
                            showConfirmButton: true,
                            confirmButtonText: "ตกลง",
                        }).then((value) => {
                            if (value.isConfirmed && error !== 'error duplicate') {
                                history.push("/index")
                            }
                        })
                    }
                }
            })
        }
    }

    return (<Modal
        show={show}
        size="m"
        // onHide={() => { handleClose() }}
        centered
    >
        <ModalHeader handleClose={() => { handleClose() }} BgColor={'#96CC39'}>
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="bold mt-4">{'เพิ่มรายการ'}</h4>
            </div>
        </ModalHeader>
        <Modal.Body>
            <div className='my-3'>
                <Table hover style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '25%' }}><h6 className='pt-2' >{`ID สมาชิก: `}</h6></td>
                            <td >
                                <div>
                                    <InputText
                                        type="text"
                                        idName="emp-id" value={form.empId}
                                        placeholder="employee id"
                                        handleChange={(value) => {
                                            setForm({ ...form, empId: value })
                                        }}
                                        handleInvalid={() => removeInvalid("empId")} invalid={invalid.empId}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '20%' }}><h6 className='pt-2' >{`E-mail: `}</h6></td>
                            <td>
                                <div className={'pt-2'}>
                                    <InputText
                                        type="text"
                                        idName="emp-email"
                                        value={form.email}
                                        placeholder="email"
                                        handleChange={(value) => {
                                            setForm({ ...form, email: value })
                                        }}
                                        handleInvalid={() => removeInvalid("email")} invalid={invalid.email}
                                    />
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </Table>
            </div>
            {/* <div className='px-5 mb-5'>
                <Row gutter={[10, 0]}>
                    <Col className='pt-1 mt-1'>
                        <Button bg={'#96CC39'} width={'120px'} color={'#fff'} onClick={() => { toAddNewEmp() }}>เพิ่มเจ้าหน้าที่</Button>
                    </Col>
                    <Col className='pt-1 mt-1'>
                        <Button bg={'#3C3C3C'} width={'80px'} color={'#fff'} onClick={() => { setForm({ ...form, empId: '', email: '' }) }}>ล้าง</Button>
                    </Col>
                </Row>
            </div> */}
            <div className="d-flex justify-content-end">
                <Row gutter={[10, 0]}>
                    <Col>
                        <Button color="white" bg="#96CC39" width={'auto'} className="cursor-p" onClick={() => { toAddNewEmp() }}>ยืนยัน</Button>
                    </Col>
                    <Col>
                        <Button color="white" bg="#E72525" width={'auto'} className="cursor-p" onClick={() => { handleClose() }}>ยกเลิก</Button>
                    </Col>
                </Row>
            </div>
        </Modal.Body>
    </Modal>
    )
}

export default ModalAddEmployee