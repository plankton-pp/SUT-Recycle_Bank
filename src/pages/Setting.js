import React from 'react';
import BoxCard from '../components/BoxCard';
import SideMenu from '../components/SideMenu';
import Profile from './Profile';
import PasswordSetting from './PasswordSetting';
import {
    UserOutlined,
    LockOutlined
} from '@ant-design/icons';

function Setting() {

    return (
        <div className='mx-2'>
            <BoxCard>
                <SideMenu
                    className={'py-3 d-flex'}
                    content={[
                        <Profile />,
                        <PasswordSetting />
                    ]}
                    mainIcon={<UserOutlined />}
                    icon={[<LockOutlined />]}
                    mainTitle={"ข้อมูลส่วนตัว"}
                    title={["รหัสผ่าน"]}
                />
            </BoxCard>
        </div >
    );
}

export default Setting;
