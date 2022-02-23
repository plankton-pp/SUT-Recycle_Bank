import React, { useState, useEffect } from 'react'
import { Row, Col, Spin } from 'antd'
import { Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import BoxCard from '../components/BoxCard'
import InputText from '../components/InputText'
import { Button } from '../components/styles/globalStyles'
import * as API from '../utils/apis'
import * as helper from '../utils/helper'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function Proportion() {
    const history = useHistory()
    const username = JSON.parse(helper.sessionGet('login')).Username

    const initForm = {
        fee: '',
        bankFee: '',
        memberFee: '',
        updateDate: '',
        updateDate: '',
    }

    const [form, setForm] = useState(initForm)
    const [isLoad, setIsLoad] = useState(false)

    useEffect(() => {
        if (form.bankFee.length === 0) {
            getLastFee()
        }
    }, [form])


    const getLastFee = async () => {
        try {
            setIsLoad(true)
            const response = await API.getLastFee()
            const data = await response?.data.data[0]
            if (response.status === 200 && !response?.data.error) {
                setForm({
                    ...form,
                    memberFee: Number(100 - Number(data.fee)).toFixed(2),
                    bankFee: data.fee,
                    updateDate: helper.momentDate(data.Update_Date.length > 0 ? Number(data.Update_Date) * 1000 : Number(data.Create_Date) * 1000, "th", "short"),
                    updateBy: data.Update_By,
                })
            } else {
                MySwal.fire({
                    text: `ไม่พบข้อมูลสัดส่วน `,
                    icon: "error",
                    showConfirmButton: true,
                    confirmButtonText: "ตกลง",
                }).then((value) => {
                    if (value.isConfirmed) {
                        history.push("/index")
                    }
                })
            }
            setIsLoad(false)
        } catch (error) {
            setIsLoad(false)
            console.log(error);
        }
    }

    const toSaveFee = async () => {
        MySwal.fire({
            text: `ยืนยันการบันทึกรายการ `,
            icon: "question",
            confirmButtonColor: '#96CC39',
            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setIsLoad(true)
                    const data = {
                        fee: form.fee,
                        createby: username
                    }
                    const response = await API.addFee(data)
                    if (response.status === 200 && !response?.data.error) {
                        MySwal.fire({
                            text: `บันทึกข้อมูลสำเร็จ`,
                            icon: "success",

                            confirmButtonColor: '#96CC39',
                            confirmButtonText: "ตกลง",
                        }).then((value) => {
                            if (value.isConfirmed) {
                                setForm(initForm)
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
                    setIsLoad(false)
                } catch (error) {
                    setIsLoad(false)
                    console.log(error);
                }
            }
        })
    }
    return (
        <Spin tip="Loading..." spinning={isLoad}>
            <div>
                <BoxCard title={"สัดส่วนค่าฝากวัสดุ"}>
                    <div className='p-4'>
                        <h5>สัดส่วนปัจจุบัน</h5>
                        <div className='mx-3 my-3'>

                            <Table hover style={{ width: '50%' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '40px' }}><h6 className='pt-2' >{`ธนาคารรีไซเคิล: `}</h6></td>
                                        <td style={{ width: '100px' }}>
                                            <div>
                                                <InputText
                                                    disabled={true}
                                                    type="text"
                                                    idName="bank-fee" value={form.bankFee}
                                                    placeholder="-"
                                                />
                                            </div>
                                        </td>
                                        <td style={{ width: '20px' }}><h6 className='pt-2' >{`%`}</h6></td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '40px' }}><h6 className='pt-2' >{`สมาชิกธนาคาร: `}</h6></td>
                                        <td>
                                            <div className={'pt-2'}>
                                                <InputText
                                                    disabled={true}
                                                    type="text"
                                                    idName="member-fee"
                                                    value={form.memberFee}
                                                    placeholder="-"
                                                />
                                            </div>
                                        </td>
                                        <td style={{ width: '20px' }}><h6 className='pt-2' >{`%`}</h6></td>
                                    </tr>
                                    <tr>
                                        <td><h6 className='pt-2' >{`แก้ไขล่าสุดเมื่อ: `}</h6></td>
                                        <td>
                                            <div className={'pt-2'}>
                                                <InputText
                                                    disabled={true}
                                                    type="text"
                                                    idName="fee-update-date"
                                                    value={form.updateDate}
                                                    placeholder="-"
                                                />
                                            </div>
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td><h6 className='pt-2' >{`ผู้แก้ไข: `}</h6></td>
                                        <td>
                                            <div className={'pt-2'}>
                                                <InputText
                                                    disabled={true}
                                                    type="text"
                                                    idName="fee-update-by"
                                                    value={form.updateBy}
                                                    placeholder="-"
                                                />
                                            </div>
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <hr />
                    </div>
                    <div style={{ height: '200px' }} className='px-5'>
                        <Row gutter={[10, 0]}>
                            <Col>
                                <InputText
                                    title="แก้ไขสัดส่วน" type="number"
                                    idName="fee" value={form.fee}
                                    max={100}
                                    placeholder="fee"
                                    handleChange={(value) => {
                                        if (value < 0) {
                                            setForm({ ...form, fee: 0 })
                                        } else {
                                            if (value > 100) {
                                                setForm({ ...form, fee: value })
                                            }
                                        }
                                    }}
                                />
                            </Col>
                            <Col className='pt-4 mt-1'>
                                <Button bg={'#96CC39'} width={'80px'} color={'#fff'} onClick={() => { toSaveFee() }}>อัพเดท</Button>
                            </Col>
                            <Col className='pt-4 mt-1'>
                                <Button bg={'#3C3C3C'} width={'80px'} color={'#fff'} onClick={() => { setForm({ ...form, fee: '' }) }}>ล้าง</Button>
                            </Col>
                        </Row>


                    </div>

                </BoxCard>
            </div>
        </Spin>
    )
}

export default Proportion