import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { Button } from './styles/globalStyles'
import { Row, Col } from 'antd'
const { TabPane } = Tabs;

function TabPaneMenu({ content, type, onSet }) {
    const [tabPosition, setTabPosition] = useState('left');

    useEffect(() => {
        // console.log('TabPane', content);
    }, []);

    const setData = (data) => {
        onSet(data)
    }

    const renderTabPane = (item, index) => {
        const data = content[0][item].data;
        const typeId = content[0][item].typeId;
        return (
            <TabPane tab={item} key={'tabpane-' + (index + 1)} id={'tabpane-' + (index + 1)}>
                <Row gutter={5, 10}>
                    {type === 'button'
                        ?
                        data.map((element, i) => {
                            let objectDeposit = {
                                type:item,
                                typeId: typeId,
                                id: element.id,
                                name: element.name,
                                pricePerUnit: 5,
                            }
                            return (
                                <Col sm={12} md={24} lg={6}>
                                    <Button color="white" bg="#189078" className="cursor-p mb-2" width='100%' height='80%' onClick={() => { setData(objectDeposit) }}>{element.name}
                                    </Button>
                                </Col>
                            )
                        })
                        :
                        <div> undefined </div>
                    }
                </Row>
            </TabPane>
        );
    }

    return <div>
        <Tabs tabPosition={tabPosition} size='large'>
            {content.length > 0 ?
                Object.keys(content[0]).map((item, index) => {
                    return renderTabPane(item, index)
                })
                :
                null
            }
        </Tabs>
    </div>;
}

export default TabPaneMenu;
