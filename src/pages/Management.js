import React from 'react';
import BoxCard from '../components/BoxCard';
import Price from './Price';
import SideMenu from '../components/SideMenu';
import ManageTypes from './ManageTypes';
import ManageProducts from './ManageProducts';
import ManagePrice from './ManagePrice'
import Proportion from './Proportion';
import TransactionHistory from './TransactionHistory';
import {
    HomeOutlined,
    SnippetsOutlined,
    FileDoneOutlined,
    DollarOutlined,
    PercentageOutlined,
    HistoryOutlined
} from '@ant-design/icons';

function Management() {

    return (
        <div className='mx-2'>
            <BoxCard>
                <SideMenu
                    className={'py-3 d-flex'}
                    content={[
                        <Price />,
                        <ManageTypes />,
                        <ManageProducts />,
                        <ManagePrice />,
                        <Proportion />,
                        <TransactionHistory />
                    ]}
                    mainIcon={<HomeOutlined />}
                    icon={[
                        <SnippetsOutlined />,
                        <FileDoneOutlined />,
                        <DollarOutlined />,
                        <PercentageOutlined />,
                        <HistoryOutlined />]}
                    mainTitle={"ภาพรวม"}
                    title={["จัดการรายการประเภท", "จัดการรายการวัสดุ", "ปรับเปลี่ยนราคารับซื้อ", "ปรับสัดส่วนค่าฝากวัสดุ", "ประวัติการทำรายการ"]}
                />
            </BoxCard>
        </div >
    );
}

export default Management;
