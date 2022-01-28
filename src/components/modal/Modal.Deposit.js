import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Row, Col } from 'antd';
import { Button } from '../styles/globalStyles';
import ModalHeader from '../ModalHeader';
import TabPaneMenu from '../TabPaneMenu';
import { VerticalLine } from '../styles/veriticalLine';
import InputText from '../InputText';
import * as API from '../../utils/apis'

function ModalDeposit({ show, close, save, mode, idEdit, data }) {

    const [objectId, setObjectId] = useState('');
    const [objectName, setObjectName] = useState('');
    const [objectType, setObjectType] = useState('');
    const [objectTypeId, setObjectTypeId] = useState('');
    const [objectAmount, setObjectAmount] = useState('');
    const [pricePerUnit, setPricePerUnit] = useState('');
    const [sumPrice, setSumPrice] = useState(0);
    const [contentTab, setContentTab] = useState([]);

    const initForm = {
        type: '',
        typeId: '',
        id: '',
        name: '',
        pricePerUnit: '',
        sumPrice: '',
    }
    const [form, setForm] = useState(initForm);

    useEffect(() => {
        getTypeAPI()
    }, []);

    useEffect(() => {
        if(contentTab.length>0){
            getProducts()
        }
    }, [contentTab]);

    // useEffect(() => {
    //     console.log('contentTab: ', contentTab);
    // }, [contentTab]);

    useEffect(() => {
        setObjectAmount(0)
    }, [objectName, objectType]);


    useEffect(() => {
        setSumPrice(Number(objectAmount) * Number(pricePerUnit))
        setForm({
            ...form,
            type: objectType,
            typeId: objectTypeId,
            id: objectId,
            name: objectName,
            amount: objectAmount,
            pricePerUnit: pricePerUnit,
            sumPrice: Number(objectAmount) * Number(pricePerUnit),
        })
    }, [objectAmount]);

    const addItem = () => {
        save(form)
        handleClose()
    }

    const setDataDetail = (data) => {
        setObjectId(data['id'])
        setObjectName(data['name'])
        setObjectType(data['type'])
        setObjectTypeId(data['typeId'])
        setPricePerUnit(data['pricePerUnit'])
    }

    const handleClose = () => {
        close()
    }

    const getTypeAPI = async () => {
        try {
            const response = await API.getTypes();
            const data = await response?.data.data;
            if (response.status === 200) {
                // console.log('dataAPI:', data);

                let tabList = []
                //loop
                if (data) {
                    data.forEach((item) => {
                        let typeTab = {}
                        let bodyTab = {
                            typeId: item.Type_ID,
                            data: [],
                        }
                        typeTab[item.Name] = bodyTab
                        tabList.push(typeTab)
                    })
                }
                setContentTab(tabList)
            }
        } catch (error) {
            // if (error.response && error.response.status === 401) {
            //     dispatch(logout({ history }))

            // }
            console.log(error)
        }
    }

    const getProducts = async () => {
        try {
            const response = await API.getProducts();
            const data = await response?.data.data;
            if (response.status === 200) {

                let tabList = [...contentTab]
                tabList.forEach((item) => {
                    let itemKey = Object.keys(item)
                    let dataList = []
                    if (data) {
                        dataList = data.filter((dataItem) => { return dataItem.Type_ID == item[itemKey].typeId })
                    }
                    item[itemKey].data = dataList
                })
                setContentTab(tabList)
            }
        } catch (error) {
            // if (error.response && error.response.status === 401) {
            //     dispatch(logout({ history }))

            // }
            console.log(error)
        }
    }

    return (
        <Modal
            show={show}
            size="xl"
            onHide={() => { handleClose() }}
            centered
        >
            <ModalHeader handleClose={() => { handleClose() }} BgColor={'#96CC39'}>
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="bold mt-4">{'เพิ่มรายการ'}</h4>
                </div>
            </ModalHeader>
            <Modal.Body className="p-4">
                <div className='mb-3'>
                    <Row gutter={[5, 5]}>
                        <Col span={14}>
                            <div style={{ width: '100%' }} className='mb-3'>
                                <Row gutter={[0, 0]}>
                                    <Col span={12} className='bold' style={{ backgroundColor: '#ddd' }}>
                                        <h5>ประเภทวัสดุ</h5>
                                    </Col>
                                    <Col span={12} className='bold' style={{ backgroundColor: '#ddd' }}>
                                        <h5>ชื่อวัสดุ</h5>
                                    </Col>
                                </Row>
                            </div>
                            <div style={{ width: '100%' }}>
                                <TabPaneMenu
                                    content={contentTab}
                                    type={'button'}
                                    onSet={(data) => { setDataDetail(data) }}
                                ></TabPaneMenu>
                            </div>
                        </Col>
                        <Col span={1}>
                            <VerticalLine height={'100%'} color='#666'></VerticalLine>
                        </Col>
                        <Col>
                            <div style={{ width: '100%' }} className='mb-3'>
                                <Row gutter={[0, 0]} style={{ backgroundColor: '#ddd' }}>
                                    <Col className='bold'>
                                        <h5>รายละเอียด</h5>
                                    </Col>
                                </Row>
                            </div>
                            <Row>
                                <Col>
                                    <Row gutter={[60, 0]} className='mb-2'>
                                        <Col className='pt-2'>ชื่อวัสดุ:</Col>
                                        <Col>
                                            <InputText type="text" idName="object-name"
                                                placeholder="-" classLabel="normal"
                                                disabled={true}
                                                value={objectName}
                                                handleChange={(value) => {
                                                    //
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={[56, 0]} className='mb-2'>
                                        <Col className='pt-2'>ประเภท:</Col>
                                        <Col>
                                            <InputText type="text" idName="object-name"
                                                placeholder="-" classLabel="normal"
                                                disabled={true}
                                                value={objectType}
                                                handleChange={(value) => {
                                                    //
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={[18, 0]} className='mb-2'>
                                        <Col className='pt-2'>ราคาต่อหน่วย:</Col>
                                        <Col>
                                            <InputText type="text" idName="object-name"
                                                placeholder="-" classLabel="normal"
                                                disabled={true}
                                                value={pricePerUnit}
                                                handleChange={(value) => {
                                                    //
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={[65, 0]} className='mb-2'>
                                        <Col className='pt-2'>จำนวน:</Col>
                                        <Col>
                                            <InputText type="number" idName="object-name"
                                                placeholder="0" classLabel="normal"
                                                value={objectAmount}
                                                max={9999}
                                                handleChange={(value) => {
                                                    if (value < 0) {
                                                        setObjectAmount(0)
                                                    } else {
                                                        setObjectAmount(value)
                                                    }

                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={[48, 0]} className='mb-2'>
                                        <Col className='pt-2'>
                                            <h5>มูลค่ารวม:</h5>
                                        </Col>
                                        <Col>
                                            <div className='mt-2 pt-1'>
                                                <h5>
                                                    {sumPrice} บาท
                                                </h5>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col style={{ paddingTop: '25%', paddingLeft: '10px' }}>
                                    <div className='pt-2 pb-2'>บาท</div>
                                    <div className='pt-2'>กิโลกรัม</div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className="d-flex justify-content-end">
                    <Row gutter={[10, 0]}>
                        <Col>
                            <Button color="white" bg="#96CC39" width={'80px'} className="cursor-p" disabled={(objectId === '' || objectAmount <= 0)} onClick={() => { addItem() }}>เพิ่ม</Button>
                        </Col>
                        <Col>
                            <Button color="white" bg="#E72525" width={'80px'} className="cursor-p" onClick={() => { handleClose() }}>ยกเลิก</Button>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>

        </Modal>
    );
}

export default ModalDeposit;
