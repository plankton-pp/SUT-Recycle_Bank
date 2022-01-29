import React, { useState, useEffect } from 'react';
import '../../assets/css/index.css'
import { Modal } from 'react-bootstrap';
import { Row, Col, Table } from 'antd';
import { Button } from '../styles/globalStyles';
import ModalHeader from '../ModalHeader'
import InputText from '../InputText';
import DataTable from '../DataTable';
import BoxCard from '../BoxCard';
import * as API from '../../utils/apis';

function ModalSearchMember({ show, close, save, mode, idEdit, data }) {
    const initMember = [
        {
            key: '1',
            Acc_number: "ktb-1234",
            Bank: "กรุงไทย",
            Email: "planktonplnt@gmail.com",
            Firstname: "นายพชรพล",
            ID: 92,
            Lastname: "แก้วกัลยา",
            No_members: "15",
            Password: "81dc9bdb52d04dc20036dbd8313ed055",
            Phone_number: "011-1111111",
            Phone_number2: "022-2222222",
            Remark: "test",
            Role: "นักศึกษา",
            Username: "planktonplnt",
        },

    ]

    const [searchKeyword, setSearchKeyword] = useState(data);
    const [clearSelectedRow, setClearSelectedRow] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [onChangeSearch, setOnChangeSearch] = useState(false)
    const [memberData, setMemberData] = useState(initMember);
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            width: '50px'
        },
        {
            title: 'รหัสสมาชิก',
            dataIndex: 'ID',
        },
        {
            title: 'ชื่อ',
            dataIndex: 'Firstname',
        },
        {
            title: 'นามสกุล',
            dataIndex: 'Lastname',

        },
        {
            title: 'เบอร์โทร',
            dataIndex: 'Phone_number',

        },
        {
            title: 'อีเมล',
            dataIndex: 'Email',

        },
    ];

    useEffect(() => {
        searchMember(searchKeyword)
    }, []);


    useEffect(() => {
        if (selectedData.length <= 0) {
            data = ''
        }
    }, [selectedData]);

    useEffect(() => {
        if (clearSelectedRow === true) {
            setSearchKeyword('')
            setClearSelectedRow(false)
        } else {
            if (!onChangeSearch) {
                setSearchKeyword(data)
            }
        }
        searchMember(searchKeyword)
    }, [clearSelectedRow, searchKeyword, onChangeSearch]);

    const getMemberData = () => {
        let filteredMember = memberData.filter((item, index) => {
            let textSearch = String(searchKeyword).toLowerCase();
            let checkMemId = String(item.ID).toLowerCase().includes(textSearch)
            let checkName = String(item.Firstname).toLowerCase().includes(textSearch)
            let checkLastname = String(item.Lastname).toLowerCase().includes(textSearch)
            let checkTel = String(item.Phone_number).toLowerCase().includes(textSearch)
            let checkEmail = String(item.Email).toLowerCase().includes(textSearch)

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

    const searchMember = async (keyword) => {
        try {
            const response = searchKeyword.length > 0 ? await API.searchMember(searchKeyword) : await API.getMember();
            const data = await response?.data.data;
            if (response.status === 200) {
                if (data.length > 0) {
                    data.forEach((item, index) => {
                        item['key'] = index
                    });
                    setMemberData(data)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const buttonAdd = () => {
        return (<Button onClick={() => toAddMember()} >เพิ่มสมาชิก</Button>)
    }

    return (
        <Modal
            show={show}
            size="xl"
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
                            <InputText type="text" idName="search-keyword"
                                placeholder="รหัสสมาชิก, ชื่อ, นามสกุล, เบอร์โทร, อีเมลล์" classLabel="bold"
                                value={searchKeyword}
                                handleChange={(value) => {
                                    setOnChangeSearch(true)
                                    setSearchKeyword(value)
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
                                            "selectionType":"radio",
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
