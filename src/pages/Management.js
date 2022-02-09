import React from 'react';
import BoxCard from '../components/BoxCard';
import Price from './Price';
import SideMenu from '../components/SideMenu';
import ManageTypes from './ManageTypes';
import ManageProducts from './ManageProducts';
import ManagePrice from './ManagePrice'
import { SnippetsOutlined, FileDoneOutlined, DollarOutlined } from '@ant-design/icons';

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
                        <ManagePrice />
                    ]}
                    icon={[<SnippetsOutlined />, <FileDoneOutlined />, <DollarOutlined />]}
                    title={["จัดการรายการประเภท", "จัดการรายการวัสดุ", "ปรับเปลี่ยนราคารับซื้อ"]}
                />
            </BoxCard>
        </div >
    );
}

export default Management;
