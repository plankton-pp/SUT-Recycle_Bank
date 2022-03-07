import React, { useState, useEffect } from 'react'
import { Row, Col, Spin } from 'antd'
import { Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import DataTable from '../components/DataTable'
import BoxCard from '../components/BoxCard'
import InputText from '../components/InputText'
import { Button } from '../components/styles/globalStyles'
import * as API from '../utils/apis'
import * as helper from '../utils/helper'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function MemberManagement() {
    const history = useHistory()

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            width: '50px'
        },
    ]

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
                        if (response.status === 200) {
                            setForm(initForm)
                            setIsLoad(false)
                            MySwal.fire({
                                text: `บันทึกข้อมูลสำเร็จ`,
                                icon: "success",
                                confirmButtonColor: '#96CC39',
                                confirmButtonText: "ตกลง",
                            })
                        } else if (response.duplicate) {
                            setIsLoad(false)
                            MySwal.fire({
                                text: `ระบบไม่สามารถบันทึกข้อมูลได้ \n Email หรือ Employee ID ถูกใข้งานแล้ว`,
                                icon: "error",
                                showConfirmButton: true,
                                confirmButtonText: "ตกลง",
                            }).then((value) => {
                                if (value.isConfirmed) {
                                    history.push("/index")
                                }
                            })
                        } else {
                            throw response.status
                        }
                    } catch (error) {
                        setIsLoad(false)
                        console.log(error);
                        MySwal.fire({
                            text: `ระบบไม่สามารถบันทึกข้อมูลได้`,
                            icon: "error",
                            showConfirmButton: true,
                            confirmButtonText: "ตกลง",
                        }).then((value) => {
                            if (value.isConfirmed) {
                                history.push("/index")
                            }
                        })
                    }
                }
            })

        }
    }
    return (
        <div>
            <Spin tip="Loading..." spinning={isLoad}>
                <BoxCard title={"เพิ่มข้อมูลผู้ใช้งาน"}>
                    <div className='p-4'>
                        <h5>ข้อมูลเจ้าหน้าที่</h5>
                        <div className='mx-3 my-3'>

                            <Table hover style={{ width: '50%' }}>
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
                    </div>
                    <div style={{ height: '200px' }} className='px-5'>
                        <Row gutter={[10, 0]}>
                            <Col className='pt-4 mt-1'>
                                <Button bg={'#96CC39'} width={'120px'} color={'#fff'} onClick={() => { toAddNewEmp() }}>เพิ่มเจ้าหน้าที่</Button>
                            </Col>
                            <Col className='pt-4 mt-1'>
                                <Button bg={'#3C3C3C'} width={'80px'} color={'#fff'} onClick={() => { setForm({ ...form, empId: '', email: '' }) }}>ล้าง</Button>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <DataTable
                            columns={columns}
                            data={[]}
                            limitPositionLeft={true}
                            option={{
                                "showLimitPage": true,
                                "rowClassname": "editable-row"
                            }}>
                        </DataTable>
                    </div>
                </BoxCard>
            </Spin>
        </div>
    )
}

export default MemberManagement