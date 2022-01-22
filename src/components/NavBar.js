import { Layout, Menu, Row, Col } from 'antd';
import React, { useState } from 'react'
import { Link, Redirect } from "react-router-dom";
import SUTLogo from './SUTLogo';
// import logoEternal from '../assets/img/logo-eternal.png'

function SiderLayout(props) {
    const { Header } = Layout;
    const [activeNav, setActiveNav] = useState('navtab-Home-0')

    const changeNav = (key) => {
        setActiveNav(key)
    }

    const renderNavMenu = (item, index) => {
        let change = Object.keys(props.content)[index]
        let tabName = Object.values(props.content)[index].name
        return <React.Fragment key={`fragment-navtab-${tabName}-${index}`}>
            <Menu.Item key={`navtab-${tabName}-${index}`} onClick={() => changeNav(`navtab-${tabName}-${index}`)} style={{}}>
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
                <Row gutter={[30, 0]}>
                    <Col>
                        <Row>
                            <Col>
                                <SUTLogo />
                            </Col>
                        </Row>
                    </Col>
                    {/* Rendering NavMenu */}
                    {Object.keys(props.content).length > 0 ?
                        <Col lg={16} md={16} sm={10}>
                            <Menu mode="horizontal" defaultSelectedKeys={['navtab-Home-0']} style={{ lineHeight: '64px',}} activeKey={activeNav}>
                                {Object.keys(props.content).map((item, index) => {
                                    return renderNavMenu(item, index)
                                })}
                            </Menu>
                        </Col>
                        :
                        null
                    }
                </Row>
            </Header>
        </Layout>
    )
}

export default SiderLayout