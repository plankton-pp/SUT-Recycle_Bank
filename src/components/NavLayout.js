import { Layout, Menu, Row, Col, Avatar, Image } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { logout } from '../redux/actions/logoutAction'
import { Link, useLocation } from "react-router-dom";
import SUTLogo from './SUTLogo';
import * as helper from '../utils/helper'

function NavLayout(props) {
    const { Header } = Layout;
    const location = useLocation().pathname;
    const dispatch = useDispatch();
    const history = useHistory();
    
    const [activeNav, setActiveNav] = useState(() => {
        const activeTab = Object.keys(props.content).filter((item, index) => { return item === location.slice(1, location.length) })[0]
        const indexOfActiveTab = Object.keys(props.content).indexOf(activeTab)
        return (`navtab-${activeTab}-${indexOfActiveTab}`)
    })

    useEffect(() => {
    }, []);

    const toLogout = () => {
        dispatch(logout({ history }))
    }

    const changeNav = (key) => {
        setActiveNav(key)
    }

    const getUsername = () => {
        try {
            return String(JSON.parse(helper.sessionGet('login'))['Username']).toUpperCase()
        } catch (error) {

        }
    }

    const renderNavMenu = (item, index) => {
        let change = Object.keys(props.content)[index]
        let tabName = Object.values(props.content)[index].name
        return <React.Fragment key={`fragment-navtab-${tabName}-${index}`}>
            <Menu.Item key={`navtab-${change}-${index}`} id={`navtab-${change}-${index}`} onClick={() => changeNav(`navtab-${tabName}-${index}`)}>
                <Link to={`/${change}`} style={{ textDecoration: 'none', fontWeight: 'bolder', fontSize: '16px' }}>
                    {tabName}
                </Link>
            </Menu.Item>

        </React.Fragment>
    }

    return (
        <Layout style={{ marginBottom: '80px' }}>
            {/* Header Tag:
                Logo
                NavTabs */}
            <Header className="header" style={{ position: 'fixed', zIndex: 1, width: '100%', backgroundColor: '#fff', }}>
                <Row gutter={[0, 0]} className='d-flex justify-content-end'>
                    <Col>
                        <SUTLogo />
                    </Col>
                    {/* Rendering NavMenu */}
                    {Object.keys(props.content).length > 0 ?
                        <Col span={14}>
                            <Menu mode="horizontal" defaultSelectedKeys={[activeNav]} style={{ lineHeight: '64px', }}>
                                {Object.keys(props.content).map((item, index) => {
                                    return renderNavMenu(item, index)
                                })}
                            </Menu>
                        </Col>
                        :
                        null
                    }
                    <Col>
                        <Link to={`/profile`} style={{ textDecoration: 'none', fontWeight: 'bolder', fontSize: '16px', color: '#000' }}>
                            <div className='profile'>
                                <Row gutter={[10, 0]}>
                                    <Col style={{ paddingLeft: '20px' }}>
                                        <Avatar src={<Image src="https://joeschmoe.io/api/v1/random" style={{ width: 32 }} />} />
                                    </Col>
                                    <Col style={{ paddingRight: '30px' }}>{getUsername()}</Col>
                                </Row>
                            </div>
                        </Link>
                    </Col>
                    <Col>
                        <div className='profile bold' onClick={() => { toLogout() }}>
                            <Row gutter={[0, 0]}>
                                <Col style={{ paddingLeft: '30px', paddingRight: '30px', }}><span>ออกจากระบบ</span></Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Header>
        </Layout>
    )
}

export default NavLayout