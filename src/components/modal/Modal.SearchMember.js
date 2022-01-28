import React, { useState, useEffect } from 'react';
import '../../assets/css/index.css'
import { Modal } from 'react-bootstrap';
import { Row, Col, Table } from 'antd';
import { Button } from '../styles/globalStyles';
import ModalHeader from '../ModalHeader'
import InputText from '../InputText';
import DataTable from '../DataTable';
import BoxCard from '../BoxCard';

function ModalSearchMember({ show, close, save, mode, idEdit, data }) {

    const [searchId, setSearchId] = useState(data);
    const [clearSelectedRow, setClearSelectedRow] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [onChangeSearch, setOnChangeSearch] = useState(false)
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            width: '50px'
        },
        {
            title: 'รหัสสมาชิก',
            dataIndex: 'memberId',
        },
        {
            title: 'ชื่อ',
            dataIndex: 'name',
        },
        {
            title: 'นามสกุล',
            dataIndex: 'lastname',

        },
        {
            title: 'เบอร์โทร',
            dataIndex: 'tel',

        },
        {
            title: 'อีเมล',
            dataIndex: 'email',

        },
    ];
    const memberData = [
        {
            key: '1',
            index: '1',
            memberId: 'm01',
            name: 'A',
            lastname: 'L',
            tel: 'test',
            email: 'test',
        },
        {
            key: '2',
            index: '2',
            memberId: 'm02',
            name: 'b',
            lastname: 'l',
            tel: 'test',
            email: 'test',
        },
        {
            key: '3',
            index: '3',
            memberId: 'm03',
            name: 'c',
            lastname: 'j',
            tel: 'test',
            email: 'test',
        },
        {
            key: '4',
            index: '4',
            memberId: 'm04',
            name: 'd',
            lastname: 'I',
            tel: 'test',
            email: 'test',
        },
        {
            key: '5',
            index: '5',
            memberId: 'm061',
            name: 'E',
            lastname: 'H',
            tel: 'test',
            email: 'test',
        },
        {
            key: '6',
            index: '6',
            memberId: 'm062',
            name: 'F',
            lastname: 'test',
            tel: 'G',
            email: 'test',
        },

    ]

    useEffect(() => {
        if (selectedData.length <= 0) {
            data = ''
        }
    }, [selectedData]);

    useEffect(() => {
        if (clearSelectedRow === true) {
            setSearchId('')
            setClearSelectedRow(false)
        } else {
            if (!onChangeSearch) {
                setSearchId(data)
            }
        }
    }, [clearSelectedRow, searchId, onChangeSearch]);

    const getMemberData = () => {
        let filteredMember = memberData.filter((item, index) => {
            let textSearch = String(searchId).toLowerCase();
            let checkMemId = String(item.memberId).toLowerCase().includes(textSearch)
            let checkName = String(item.name).toLowerCase().includes(textSearch)
            let checkLastname = String(item.lastname).toLowerCase().includes(textSearch)
            let checkTel = String(item.tel).toLowerCase().includes(textSearch)
            let checkEmail = String(item.email).toLowerCase().includes(textSearch)

            let checkTrue = (checkMemId || checkName || checkLastname || checkTel || checkEmail)

            return checkTrue
        })
        return filteredMember
    }

    const refreshRowMember = () => {
        setClearSelectedRow(!clearSelectedRow)
    }

    const handleClose = () => {
        close()
    }

    const onSelected = () => {
        save(selectedData[1][0])
        handleClose()
    }

    const toAddMember = () => {

    }

    const buttonAdd = () => {
        return (<Button onClick={() => toAddMember()} >เพิ่มสมาชิก</Button>)
    }

    return (
        <Modal
            show={show}
            size="lg"
            onHide={() => { handleClose() }}
            centered
        >
            <ModalHeader handleClose={() => { handleClose() }}>
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="bold mt-5">{'ค้นหาสมาชิก'}</h4>
                </div>
            </ModalHeader>
            <Modal.Body>
                <div>
                    <Row gutter={[10, 10]} className='mb-4'>
                        <Col>
                            <div className='pt-2'>
                                <h5>{`คำค้นหา:`}</h5>
                            </div>
                        </Col>
                        <Col span={12}>
                            <InputText type="text" idName="update-date"
                                placeholder="รหัสสมาชิก, ชื่อ, นามสกุล, เบอร์โทร, อีเมลล์" classLabel="bold"
                                value={searchId}
                                handleChange={(value) => {
                                    setOnChangeSearch(true)
                                    setSearchId(value)
                                }}
                            />
                        </Col>
                        <Col>
                            <Button className={'mr-2'} bg={'#3C3C3C'} width={'80px'} color={'#fff'} onClick={() => { refreshRowMember() }}>ล้าง</Button>
                        </Col>
                    </Row>
                </div>

                <BoxCard title={'รายชื่อสมาชิก'} headRight={buttonAdd()}>
                    <div>
                        <Row>
                            <Col className='w-100'>
                                <DataTable
                                    columns={columns}
                                    data={getMemberData()}
                                    option={
                                        {
                                            "type": 'selection',
                                            "clearSelectedRow": clearSelectedRow,
                                            "select": (data) => { setSelectedData(data) }
                                        }
                                    }
                                >
                                </DataTable>
                            </Col>
                        </Row>
                    </div>
                </BoxCard>
                <Row className="mt-3 d-flex justify-content-end" gutter={[10, 0]}>
                    <Col>
                        <Button
                            className={'mr-2'}
                            bg={'#96CC39'}
                            width={'80px'}
                            color={'#fff'}
                            disabled={(selectedData.length <= 0)}
                            onClick={() => { onSelected() }}>เลือก</Button>
                    </Col>
                    <Col>
                        <Button
                            color="white"
                            bg={'#3C3C3C'}
                            width={'80px'}
                            className="cursor-p"
                            onClick={() => { handleClose() }}>ยกเลิก</Button>
                    </Col>
                </Row>
            </Modal.Body>

        </Modal>
    );
}

export default ModalSearchMember;
