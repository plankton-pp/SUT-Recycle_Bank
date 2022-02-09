import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { Button } from './styles/globalStyles'
import { Row, Col } from 'antd'
import DataTable from './DataTable';
const { TabPane } = Tabs;

function TabPaneMenu({ content, type, onSet, optional }) {
    const [tabPosition, setTabPosition] = useState('left');
    const [onActiveObject, setOnActiveObject] = useState('');

    useEffect(() => {
        console.disableYellowBox = true;
        // console.log('TabPane', optional);
    }, []);

    const setData = (data, elementId) => {
        setOnActiveObject(elementId)
        onSet(data)
    }

    const renderTabPane = (item) => {
        console.disableYellowBox = true;
        if (typeof item !== undefined) {
            const tabName = Object.keys(item)
            const data = item[tabName].data;
            const typeId = item[tabName].typeId;
            return (
                <TabPane tab={tabName} key={tabName} id={tabName}>
                    <Row gutter={[5, 10]}>
                        {type === 'button' &&
                            data.map((element, i) => {
                                let objectDeposit = {
                                    type: tabName,
                                    typeId: typeId,
                                    id: element.Material_ID,
                                    name: element.Name,
                                    pricePerUnit: element.Price_per_unit,
                                }
                                return (
                                    <Col sm={12} md={24} lg={6} key={`col-${tabName}-${typeId}-${element.Name}-${element.Material_ID}`}>
                                        <Button
                                            key={`button-${tabName}-${element.Material_ID}`}
                                            color="white"
                                            bg={element.Material_ID === onActiveObject ? "#90d890" : "#189078"}
                                            id={element.Material_ID}
                                            className="cursor-p mb-2"
                                            width='100%' height='100%'
                                            onClick={() => { setData(objectDeposit, element.Material_ID) }}
                                        >
                                            {element.Name}
                                        </Button>
                                    </Col>
                                )
                            })
                        }
                    </Row>

                    {type === 'data-table' &&
                        <DataTable
                            key={`data-table-${tabName}`}
                            columns={optional.columns}
                            data={data}
                            limitPositionLeft={true}
                            height={optional.height}
                        >
                        </DataTable>
                    }
                </TabPane>
            );
        } else {
            return null
        }

    }

    return <div>
        <Tabs tabPosition={tabPosition} size='large'>
            {content &&
                content.map((item) => {
                    return renderTabPane(item)
                })
            }
        </Tabs>
    </div>;
}

export default TabPaneMenu;
