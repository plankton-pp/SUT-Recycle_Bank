import React, { useState, useEffect } from 'react';

import { Row, Col } from 'antd'

import { Button } from '../components/styles/globalStyles'
import BoxCard from '../components/BoxCard';
import TabPaneMenu from '../components/TabPaneMenu';
import ModalManageTypes from '../components/modal/Modal.ManageType';
import ModalManageProducts from '../components/modal/Modal.ManageProducts';
import ModalManagePrices from '../components/modal/Modal.ManagePrice';

import * as API from '../utils/apis'

function Price() {
    const [contentTab, setContentTab] = useState([]);
    const [showModalManageTypes, setShowModalManageTypes] = useState(false);
    const [showModalManageProducts, setShowModalManageProducts] = useState(false);
    const [showModalManagePrices, setShowModalManagePrices] = useState(false);
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            width: '50px'
        },
        {
            title: 'ชื่อวัสดุ',
            dataIndex: 'Name',
            width: '30%'

        },
        {
            title: 'หน่วย',
            dataIndex: 'unit',
            align: 'center',
            width: '30%'
        },
        {
            title: 'มูลค่ารับซื้อต่อหน่วย (บาท)',
            dataIndex: 'Price_per_unit',
            sorter: {
                compare: (a, b) => a.Price_per_unit - b.Price_per_unit,
                multiple: 1,
            },
            width: '200px',
            align: 'right',
        },
    ];
    useEffect(() => {
        getTypeAPI()
    }, []);

    useEffect(() => {
        if (contentTab.length > 0) {
            getProducts()
        }
    }, [contentTab]);

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
                        dataList = data.filter((dataItem) => {
                            return dataItem.Type_ID === item[itemKey].typeId
                        })
                        dataList.forEach((item, index) => {
                            item['Price_per_unit'] = item.Price_per_unit.toFixed(2)
                            item['key'] = index + 1
                        })
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

    const renderButtonManager = () => {
        return (
            <Row gutter={[10, 0]}>
                <Col>
                    <Button color={'#FF5677'} width={'auto'} className="cursor-p" onClick={() => { setShowModalManageTypes(true) }}>จัดการประเภทวัสดุ</Button>
                </Col>
                <Col>
                    <Button color={'#064663'} width={'auto'} className="cursor-p" onClick={() => { setShowModalManageProducts(true) }}>จัดการรายการวัสดุ</Button>
                </Col>
                <Col>
                    <Button color={'#E79E4F'} width={'auto'} className="cursor-p" onClick={() => { setShowModalManagePrices(true) }}>แก้ไขมูลค่าวัสดุ</Button>
                </Col>
            </Row>
        )
    }

    return (
        <div className='container'>
            <BoxCard title="มูลค่าวัสดุ" headRight={renderButtonManager()}>
                <div className='w-100'>
                    {/* {console.log(contentTab)} */}
                    <TabPaneMenu
                        content={contentTab}
                        type={'data-table'}
                        optional={{ columns: columns, height: '450px' }}
                    ></TabPaneMenu>
                </div>
            </BoxCard>
            {
                showModalManageTypes &&
                <ModalManageTypes
                    show={showModalManageTypes}
                    close={() => setShowModalManageTypes(false)}
                // save={(value) => addItemToList(value)}
                />
            }

            {
                showModalManageProducts &&
                <ModalManageProducts
                    show={showModalManageProducts}
                    close={() => setShowModalManageProducts(false)}
                // save={(value) => addItemToList(value)}
                />
            }

            {
                showModalManagePrices &&
                <ModalManagePrices
                    show={showModalManagePrices}
                    close={() => setShowModalManagePrices(false)}
                // save={(value) => addItemToList(value)}
                />
            }
        </div>
    );
}

export default Price;
