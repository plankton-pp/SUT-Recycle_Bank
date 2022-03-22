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
import DataTable from '../components/DataTable';
const MySwal = withReactContent(swal)

function TransactionHistory() {

    const dispatch = useDispatch();
    const history = useHistory();

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            width: '50px'
        },
        {
            title: 'วันที่บันทึก',
            dataIndex: 'createDate',
            align: 'center',
            sorter: {
                compare: (a, b) => a.createDate - b.createDate,
                multiple: 1,
            },
            render: (_, record) => {
                return helper.dateElement(record.createDate)
            },
        },
        {
            title: 'สถานะ',
            dataIndex: 'type',
        },
        {
            title: 'ผู้ทำรายการ',
            dataIndex: 'user',
            align: 'left',
        },
        {
            title: 'จำนวนเงิน (บาท)',
            dataIndex: 'amount',
            align: 'right',
        },
        {
            title: 'ผู้บันทึกรายการ',
            dataIndex: 'createBy',
            align: 'left',
        },
    ];
    const [contentTab, setContentTab] = useState([]);

    useEffect(() => {
        getTransaction()
    }, []);

    const getStatusColor = (status) => {
        if (status === "withdraw") {
            return "red"
        } else if (status === "deposit") {
            return "#96CC39"
        } else if (status === "sum") {
            return "#395B64"
        } else {
            return "orange"
        }
    }

    const getTypeStatus = (status) => {
        if (status === "withdraw") {
            return "ถอน"
        } else if (status === "deposit") {
            return "ฝาก"
        } else if (status === "sum") {
            return "อัพเดทยอดเงินธนาคาร"
        } else {
            return "รอดำเนินการ"
        }
    }

    const getSign = (status) => {
        if (status === "withdraw") {
            return "- "
        } else if (status === "deposit") {
            return "+ "
        } else {
            return " "
        }
    }

    const getTransaction = async () => {
        try {
            const response = await API.getTransaction();
            const data = await response?.data.data;
            if (response.status === 200) {
                let filteredData = []
                //loop
                if (data) {
                    data.forEach((item, index) => {
                        if (item.Type !== "sum") {
                            filteredData.push({
                                key: index + 1,
                                user: item.Firstname + " " + item.Lastname,
                                type: <h6 style={{ color: getStatusColor(item.Type) }}>{getTypeStatus(item.Type)}</h6>,
                                amount: <h6 style={{ color: getStatusColor(item.Type) }}>{getSign(item.Type)}{Number(item.Amount).toFixed(2)}</h6>,
                                createDate: item.Create_Date,
                                createBy: item.Create_By,
                            })
                        }
                    });
                    setContentTab(filteredData)
                }
            }
        } catch (error) {
            // if (error.response && error.response.status === 401) {
            //     dispatch(logout({ history }))

            // }
            console.log(error)
        }
    }

    return (
        <BoxCard title={"ประวัติการทำรายการ"}>
            <div className='w-100'>
                <DataTable
                    columns={columns}
                    data={contentTab}
                    limitPositionLeft={true}
                    option={{ "showLimitPage": true }}>

                </DataTable>
            </div>
        </BoxCard>
    );
}

export default TransactionHistory;