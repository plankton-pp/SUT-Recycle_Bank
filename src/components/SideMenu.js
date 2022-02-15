import React, { useState } from 'react';
import { Menu, Layout } from 'antd';

function SideMenu({ style, className, content, icon, mainIcon, mainTitle, title }) {
    const { Content } = Layout;
    const [onActiveKey, setOnActiveKey] = useState(0);

    const handleClick = (event) => {
        setOnActiveKey(event.key)
    };

    const renderMenu = () => {
        return (
            title.map((item, index) => {
                return (<Menu.Item key={index + 1} icon={icon[index]}>{item}</Menu.Item>)
            })
        )
    }

    return (
        <div className={className} style={style}>
            <Menu
                style={{ width: 200 }}
                defaultSelectedKeys={['0']}
                selectedKeys={[String(onActiveKey)]}
                mode="inline"
                onClick={handleClick}
            >
                <Menu.Item key="0"
                    icon={mainIcon}
                    onClick={() => {
                        setOnActiveKey(0)
                    }}>{mainTitle}
                </Menu.Item>
                {renderMenu()}
            </Menu>
            <Layout className='mx-2 my-2'>
                <Content>
                    {content[onActiveKey]}
                </Content>
            </Layout>
        </div>
    );
}

export default SideMenu;
