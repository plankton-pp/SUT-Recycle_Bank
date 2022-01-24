import React, { useState, useEffect } from 'react';

import { Row, Col, Image } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import DataTable from '../components/DataTable';
import BoxCard from '../components/BoxCard';
import InputText from '../components/InputText';
import { Button } from '../components/styles/globalStyles';
import { Button as ButtonIcon } from 'antd';
import ModalDeposit from '../components/modal/Modal.Deposit';
import ModalSearchMember from '../components/modal/Modal.SearchMember'

function Deposit() {
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            width: '50px'
        },
        {
            title: 'ชื่อวัสดุ',
            dataIndex: 'name',

        },
        {
            title: 'ประเภท',
            dataIndex: 'type',
        },
        {
            title: 'จำนวน',
            dataIndex: 'amount',
            sorter: {
                compare: (a, b) => a.english - b.english,
                multiple: 1,
            },
            width: '150px',
            align: 'right',
        },
        {
            title: 'Management',
            dataIndex: 'management',
            align: 'center'
        },
    ];

    const initForm = {
        memberId: "",
        memberName: "test",
        memberLastname: "",
        memberTel: "",

        mode: "",
        idEdit: "",
        data: [],
    }
    const [form, setForm] = useState(initForm);
    const [showModalSearch, setShowModalSearch] = useState(false)
    const [showModalAdd, setShowModalAdd] = useState(false)
    const [memberId, setMemberId] = useState('');
    // const [objectList, setObjectList] = useState([]);
    let objectList = []

    // useEffect(() => {
    //     // console.log(objectList);
    //     setObjectList(objectList)
    // }, [objectList]);


    const toSearchMember = () => {
        setShowModalSearch(true)
    }

    const clearSearch = () => {
        setMemberId('')
    }

    const toAddList = () => {
        setForm({ ...form, mode: "add", idEdit: "" })
        setShowModalAdd(true)
    }

    const buttonAdd = () => {
        return (<Button onClick={() => toAddList()} disabled={form.memberName === ''}>เพิ่มรายการ</Button>)
    }

    const removeItemFromList = (index) => {
        console.log('remove',index,objectList[index]);
        console.log(objectList);
    }

    const addItemToList = (data) => {
        let filteredData = {
            id: data.id,
            index: form.data.length,
            key: form.data.length + 1,
            name: data.name,
            type: data.type,
            amount: data.amount,
            management: <ButtonIcon type="primary" icon={<DeleteOutlined></DeleteOutlined>} onClick={() => { removeItemFromList(filteredData.index) }} danger></ButtonIcon>,
        }
        // setObjectList([...form.data, filteredData])
        objectList = [...form.data, filteredData]
        // setObjectList
        setForm({ ...form, data: [...form.data, filteredData] })
    }



    return <div className='container'>
        <div className="pt-3 mb-4">
            <BoxCard title="ข้อมูลผู้ฝาก">
                <Row gutter={[10, 10]} className='mb-4'>
                    <Col >
                        <InputText title="รหัสสมาชิก" type="text" idName="update-date"
                            placeholder="Text" classLabel="bold"
                            value={memberId}
                            handleChange={(value) => {
                                setMemberId(value)
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
                            <Button className={'mr-2 mt-4'} bg={'#E72525'} color={'#fff'} onClick={() => { clearSearch() }}>ล้าง</Button>
                        </div>
                    </Col>

                </Row>
                <Row gutter={[30, 10]} className='mb-4'>
                    <Col >
                        <InputText title="ชื่อ" type="text" idName="user-name"
                            placeholder="Text" classLabel="bold"
                            disabled={true}
                            value={form.memberName}
                            handleChange={(value) => {
                                //
                            }}
                        />
                    </Col>
                    <Col >
                        <InputText title="สกุล" type="text" idName="user-lastname"
                            placeholder="Text" classLabel="bold"
                            disabled={true}
                            value={form.memberLastname}
                            handleChange={(value) => {
                                //
                            }}
                        />
                    </Col>
                    <Col >
                        <InputText title="โทรศัพท์มือถือ" type="text" idName="user-tel"
                            placeholder="Text" classLabel="bold"
                            disabled={true}
                            value={form.memberTel}
                            handleChange={(value) => {
                                //
                            }}
                        />
                    </Col>
                </Row>
            </BoxCard>
        </div>
        <div>
            <BoxCard title="รายการวัสดุที่ต้องการฝาก" headRight={buttonAdd()}>
                <DataTable columns={columns} data={form.data}></DataTable>
            </BoxCard>
        </div>

        {showModalSearch &&
            <ModalSearchMember
                show={showModalSearch}
                close={() => setShowModalSearch(false)}
                mode={form.mode} idEdit={form.idEdit}
            />
        }

        {showModalAdd &&
            <ModalDeposit
                show={showModalAdd}
                close={() => setShowModalAdd(false)}
                mode={form.mode} idEdit={form.idEdit}
                save={(value) => addItemToList(value)}
            />
        }


    </div>;
}

export default Deposit
    ;
