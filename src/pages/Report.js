import React, { useState } from 'react';
import BoxCard from '../components/BoxCard';
import { Card, Row, Col } from 'antd'
import DataTable from '../components/DataTable';
import InputText from '../components/InputText';
import { Button } from '../components/styles/globalStyles';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';

const MySwal = withReactContent(swal)

function Report() {
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            width: '50px'
        },

        {
            title: 'รหัสเอกสาร',
            dataIndex: 'ID',
            width: '150px',
            align: 'center',
        },
        {
            title: 'ชื่อเอกสาร',
            dataIndex: 'Firstname',
            align: 'center',

        },
        {
            title: 'หมวดหมู่',
            dataIndex: 'Lastname',
            align: 'center',
        },
        {
            title: 'การจัดการ',
            dataIndex: 'Total_price',
            align: 'center',
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

    const filterReport = () => {
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
                <BoxCard title={"หมวดหมู่เอกสาร"}>
                    <div className='m-5'>
                        <Row gutter={[10, 20]}>
                            <Col span={8}>
                                <Card title={<h4>{`เอกสารหมวด 1`}</h4>} bordered={true}>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title={<h4>{`เอกสารหมวด 2`}</h4>} bordered={true}>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title={<h4>{`เอกสารหมวด 3`}</h4>} bordered={true}>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title={<h4>{`เอกสารหมวด 4`}</h4>} bordered={true}>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title={<h4>{`เอกสารหมวด 5`}</h4>} bordered={true}>
                                    
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </BoxCard>
            </div>
            <div>
                <BoxCard title={"รายการเอกสาร"}>
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
                                <Button className={'mr-2 mt-4'} bg={'#96CC39'} color={'#fff'} onClick={() => { filterReport() }}>ค้นหา</Button>
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
                    // option={
                    //     {
                    //         "selectionType": "checkbox",
                    //         "type": 'selection',
                    //         "clearSelectedRow": clearSelectedRow,
                    //         "select": (data) => { setSelectedData(data) }
                    //     }
                    // }
                    ></DataTable>
                </BoxCard>
            </div>
        </div>);
}

export default Report;
