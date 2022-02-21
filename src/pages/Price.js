import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/logoutAction';

import BoxCard from '../components/BoxCard';
import TabPaneMenu from '../components/TabPaneMenu';

import * as API from '../utils/apis'
import * as helper from '../utils/helper'

import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
const MySwal = withReactContent(swal)

function Price() {

    const dispatch = useDispatch();
    const history = useHistory();

    const [contentTab, setContentTab] = useState([]);
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
            let checkDataAmount = 0
            //loop
            contentTab.forEach((item) => {
                let key = Object.keys(item)
                checkDataAmount += item[key].data.length
            })
            if (checkDataAmount === 0) {
                getProducts()
            }
        }
    }, [contentTab]);

    const getTypeAPI = async () => {
        try {
            const response = await API.getTypes();
            const data = await response?.data.data;
            if (response.status === 200) {
                // console.log('dataAPI:', data);

                let tabList = []
                let filteredDataType = []
                let optionList = []
                //loop
                if (data) {
                    data.forEach((item, index) => {
                        let typeTab = {}
                        let bodyTab = {
                            typeId: item.Type_ID,
                            data: [],
                        }
                        typeTab[item.Name] = bodyTab
                        tabList.push(typeTab)
                        optionList.push({
                            value: item.Type_ID,
                            label: item.Name,
                        })
                        filteredDataType.push({
                            key: index + 1,
                            id: item.Type_ID,
                            name: item.Name,
                            disabled: true,
                            createDate: helper.dateElement(item.Create_Date),
                            updateDate: helper.dateElement(item.Update_Date.length > 0 ? item.Update_Date : item.Create_Date),
                            createBy: String(item.Create_By),
                            updateBy: String(item.Update_By).length > 4 ? String(item.Update_By) : String(item.Create_By),
                            status: 'query',
                        })
                    })
                    setContentTab(tabList)
                }

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
                            item['unit'] = item.Unit_Detail
                        })
                    }
                    item[itemKey].data = dataList

                })
                setContentTab(tabList)
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                dispatch(logout({ history }))
            }
            console.log(error)
        }
    }

    return (
        <BoxCard title={"ภาพรวม"}>
            <div className='w-100'>
                <TabPaneMenu
                    content={contentTab}
                    type={'data-table'}
                    optional={{ columns: columns }}
                ></TabPaneMenu>
            </div>
        </BoxCard>
    );
}

export default Price;
