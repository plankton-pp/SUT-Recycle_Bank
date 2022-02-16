import React, { useState, useEffect } from 'react'
import { Row, Col, Button as ButtonIcon } from 'antd'
import { Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import BoxCard from '../components/BoxCard'
import InputText from '../components/InputText'
import { Button } from '../components/styles/globalStyles'
import { EditOutlined } from '@ant-design/icons'
import * as API from '../utils/apis'
import * as helper from '../utils/helper'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function Profile() {
    const history = useHistory()
    const { ID } = JSON.parse(helper.sessionGet('login'))

    const initForm = {
        username: "",
        empId: "",
        phone: "",
        firstname: "",
        lastname: "",
        email: "",
    }

    const [form, setForm] = useState(initForm)
    const [oldForm, setOldForm] = useState(initForm)

    useEffect(() => {
        if (form.firstname.length === 0) {
            getEmployeeById()
        }
    }, [form])


    const getEmployeeById = async () => {
        try {
            const  response = await API.getEmployeeById(ID)
            const data = await  response?.data.data[0]
            if ( response.status === 200 && ! response?.data.error) {
                setForm({
                    ...form,
                    username: data.Username,
                    empId: data.ID,
                    phone: data.Phone,
                    firstname: data.Firstname,
                    lastname: data.Lastname,
                    email: data.Email,
                })
                setOldForm({
                    ...oldForm,
                    username: data.Username,
                    empId: data.ID,
                    phone: data.Phone,
                    firstname: data.Firstname,
                    lastname: data.Lastname,
                    email: data.Email,
                })
            } else {
                MySwal.fire({
                    text: `ไม่พบข้อมูลผู้ใช้งาน`,
                    icon: "error",
                    showConfirmButton: true,
                    confirmButtonText: "ตกลง",
                }).then((value) => {
                    if (value.isConfirmed) {
                        history.push("/index")
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const toUpdateEmpolyee = () => {
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
                    const data = {
                        id: form.empId,
                        firstname: form.firstname,
                        lastname: form.lastname,
                        username: form.username,
                        phone: form.phone,
                        email: form.email,
                    }
                    const  response = await API.updateEmployee(data)
                    if ( response.status === 200 && ! response?.data.error) {
                        MySwal.fire({
                            text: `บันทึกข้อมูลสำเร็จ`,
                            icon: "success",
                             
                            confirmButtonColor: '#96CC39',
                            showCancelButton: true,
                            confirmButtonText: "ตกลง",
                        }).then((value) => {
                            if (value.isConfirmed) {
                                setForm(initForm)
                                setOldForm(initForm)
                            }
                        })
                    } else {
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
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    return (
        <div>
            <BoxCard title={"จัดการข้อมูลส่วนตัว"}>
                <div className='p-4'>
                    <h5>ข้อมูลปัจจุบัน</h5>
                    <div className='mx-3 my-3'>

                        <Table hover style={{ width: '70%' }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: '100px' }}><h6 className='pt-2' >{`ชื่อผู้ใช้: `}</h6></td>
                                    <td style={{ width: '200px' }}>
                                        <div>
                                            <InputText
                                                type="text"
                                                idName="update-username"
                                                value={form.username}
                                                placeholder="-"
                                                handleChange={(value) => {
                                                    setForm({ ...form, username: value })
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ width: '100px' }}><h6 className='pt-2' >{`ชื่อ: `}</h6></td>
                                    <td style={{ width: '200px' }}>
                                        <div>
                                            <InputText
                                                type="text"
                                                idName="update-firstname"
                                                value={form.firstname}
                                                placeholder="-"
                                                handleChange={(value) => {
                                                    setForm({ ...form, firstname: value })
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td ><h6 className='pt-2' >{`นามสกุล: `}</h6></td>
                                    <td>
                                        <div className={'pt-2'}>
                                            <InputText
                                                type="text"
                                                idName="update-lastname"
                                                value={form.lastname}
                                                placeholder="-"
                                                handleChange={(value) => {
                                                    setForm({ ...form, lastname: value })
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><h6 className='pt-2' >{`หมายเลขโทรศัพท์: `}</h6></td>
                                    <td>
                                        <div className={'pt-2'}>
                                            <InputText
                                                type="text"
                                                idName="update-phone"
                                                value={form.phone}
                                                placeholder="-"
                                                handleChange={(value) => {
                                                    setForm({ ...form, phone: value })
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><h6 className='pt-2' >{`Email: `}</h6></td>
                                    <td>
                                        <div className={'pt-2'}>
                                            <InputText
                                                type="text"
                                                idName="update-email"
                                                value={form.email}
                                                placeholder="-"
                                                handleChange={(value) => {
                                                    setForm({ ...form, email: value })
                                                }}
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
                            <Button
                                bg={'#E72525'}
                                color={'#fff'}
                                width={'80px'}
                                onClick={() => { toUpdateEmpolyee() }}>อัพเดท</Button>
                        </Col>
                        <Col className='pt-4 mt-1'>
                            <Button
                                bg={'#3C3C3C'}
                                color={'#fff'}
                                onClick={() => { setForm({ ...form, firstname: '' }) }}>
                                ยกเลิกการเปลี่ยนแปลง
                            </Button>
                        </Col>
                    </Row>


                </div>

            </BoxCard>
        </div>
    )
}

export default Profile