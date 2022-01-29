import React, { useState } from 'react';
import BoxCard from '../components/BoxCard';
import { Card, Row, Col } from 'antd'
import DataTable from '../components/DataTable';
import InputText from '../components/InputText';
import { Button } from '../components/styles/globalStyles';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';

const MySwal = withReactContent(swal)

function Audit() {
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            width: '50px'
        },

        {
            title: 'รหัสสมาชิก',
            dataIndex: 'ID',
            width: '150px',
            align: 'center',
        },
        {
            title: 'ชื่อ',
            dataIndex: 'Firstname',
            align: 'center',

        },
        {
            title: 'นามสกุล',
            dataIndex: 'Lastname',
            align: 'center',
        },
        {
            title: 'วันที่ทำรายการฝาก',
            dataIndex: 'Date',
            align: 'center',
        },
        {
            title: 'ยอดคงค้าง (บาท)',
            dataIndex: 'Total_price',
            sorter: {
                compare: (a, b) => a.Total_price - b.Total_price,
                multiple: 1,
            },
            width: '200px',
            align: 'right',
        },
    ];
    const initForm = {
        searchKeyword: "",
        key: "",
        Acc_number: "",
        Bank: "",
        Email: "",
        Firstname: "",
        ID: "",
        Lastname: "",
        No_members: "",
        Phone_number: "",
        Phone_number2: "",
        Remark: "",
        Role: "",
        Username: "",

        mode: "",
        idEdit: "",
        data: [],
    }
    const [form, setForm] = useState(initForm);

    const toSearchMember = () => {
    }

    const clearSearch = () => {
        if (form.data.length > 0) {
            MySwal.fire({
                text: `ยืนยันการล้างข้อมูลสมาชิก `,
                icon: "question",
                showCloseButton: true,
                confirmButtonColor: '#E72525',
                showCancelButton: true,
                cancelButtonText: "ยกเลิก",
                confirmButtonText: "ตกลง",
            }).then(async (result) => {
                if (result.value) {
                    setForm(initForm)
                    //if success
                    MySwal.fire({
                        text: `ลบสำเร็จ`,
                        icon: "success",
                        confirmButtonText: "ตกลง",
                        confirmButtonColor: '#96CC39',
                    })
                }
            })
        } else {
            setForm(initForm)
        }
    }

    return (
        <div className='container'>
            <div className='mb-3'>
                <BoxCard title={"รายการบัญชีออมทรัพย์"}>
                    <div className='m-5'>
                        <Row gutter={[10, 0]}>
                            <Col span={8}>
                                <Card title={<h4>{`ยอดเงินคงเหลือ`}</h4>} bordered={true}>
                                    <h3>0.00</h3>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title={<h4>{`ยอดเงินสมาชิกคงค้าง`}</h4>} bordered={true}>
                                    <h3>0.00</h3>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title={<h4>{`ยอดเงินสุทธิ`}</h4>} bordered={true}>
                                    <h3>0.00</h3>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </BoxCard>
            </div>
            <div>
                <BoxCard title={"รายการที่มียอดคงค้าง"}>
                    <Row gutter={[10, 10]} className='mb-4'>
                        <Col span={8}>
                            <InputText title="กรองรายการ" type="text" idName="update-date"
                                placeholder="รหัสสมาชิก, ชื่อ, นามสกุล, เบอร์โทร, อีเมลล์" classLabel="bold"
                                value={form.searchKeyword}
                                handleChange={(value) => {
                                    setForm({ ...form, searchKeyword: value })
                                }}
                            />
                        </Col>
                        <Col>
                            <div className='mt-1'>
                                <Button className={'mr-2 mt-4'} bg={'#96CC39'} color={'#fff'} onClick={() => { toSearchMember() }}>ค้นหา</Button>
                            </div>
                        </Col>
                        <Col>
                            <div className='mt-1'>
                                <Button className={'mr-2 mt-4'} bg={'#3C3C3C'} color={'#fff'} onClick={() => { clearSearch() }}>ล้าง</Button>
                            </div>
                        </Col>

                    </Row>
                    <DataTable
                        columns={columns}
                        option={
                            {
                                "selectionType": "checkbox",
                                "type": 'selection',
                                // "clearSelectedRow": clearSelectedRow,
                                // "select": (data) => { setSelectedData(data) }
                            }
                        }
                    ></DataTable>
                    <div>
                        <div className="my-5 d-flex justify-content-end">
                            <Row gutter={[10, 0]}>
                                <Col>
                                    <Button color="white" bg="#96CC39" width={'auto'} className="cursor-p" onClick={() => {  }}>ถอนเงินให้กับสมาชิก</Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </BoxCard>
            </div>
        </div>);
}

export default Audit;
