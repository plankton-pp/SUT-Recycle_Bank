import React from 'react';
import DataTable from '../components/DataTable';
import BoxCard from '../components/BoxCard';
import InputText from '../components/InputText';
import { Row, Col, Image } from 'antd'
import { Button } from '../components/styles/globalStyles';

function Deposit() {

    const addList = () => {
        return <Button onClick={() => { }}>เพิ่มรายการ</Button>
    }
    return <div className='container'>
        <div className="pt-3 mb-4">
            <BoxCard title="ข้อมูลผู้ฝาก">
                <Row gutter={[10, 10]} className='mb-4'>
                    <Col >
                        <InputText title="รหัสสมาชิก" type="text" idName="update-date"
                            placeholder="Text" classLabel="bold"
                            handleChange={(value) => {
                                //
                            }}
                        />
                    </Col>
                    <Col>
                        <div className='mt-1'>
                            <Button className={'mr-2 mt-4'} bg={'#96CC39'} color={'#fff'} onClick={() => { }}>ค้นหา</Button>
                        </div>
                    </Col>
                    <Col>
                        <div className='mt-1'>
                            <Button className={'mr-2 mt-4'} bg={'#E72525'} color={'#fff'} onClick={() => { }}>Search</Button>
                        </div>
                    </Col>

                </Row>
                <Row gutter={[30,10]} className='mb-4'>
                    <Col >
                        <InputText title="ชื่อ" type="text" idName="update-date"
                            placeholder="Text" classLabel="bold"
                            disabled={true}
                            handleChange={(value) => {
                                //
                            }}
                        />
                    </Col>
                    <Col >
                        <InputText title="สกุล" type="text" idName="update-date"
                            placeholder="Text" classLabel="bold"
                            disabled={true}
                            handleChange={(value) => {
                                //
                            }}
                        />
                    </Col>
                    <Col >
                        <InputText title="โทรศัพท์มือถือ" type="text" idName="update-date"
                            placeholder="Text" classLabel="bold"
                            disabled={true}
                            handleChange={(value) => {
                                //
                            }}
                        />
                    </Col>
                </Row>
            </BoxCard>
        </div>
        {/* <div className="pt-3 mb-4">
            <BoxCard title="ฝากวัสดุ">
                <Image.PreviewGroup>
                    <Image width={200} src={logo} />
                </Image.PreviewGroup>
            </BoxCard>
        </div> */}
        <div>
            <BoxCard title="รายการวัสดุที่ต้องการฝาก" headRight={addList()}>
                <DataTable></DataTable>
            </BoxCard>
        </div>


    </div>;
}

export default Deposit
    ;
