import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Row, Col } from 'antd';
import { Button } from '../styles/globalStyles';
import ModalHeader from '../ModalHeader'
import BoxCard from '../BoxCard';
import DataTable from '../DataTable';

function ModalManageTypes({ show, close, save, mode, idEdit, data }) {

    const handleClose = () => {
        close()
    }
    return (
        <Modal
            show={show}
            size="xl"
            onHide={() => { handleClose() }}
            centered
        >
            <ModalHeader handleClose={() => { handleClose() }}>
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="bold mt-5">{'แก้ไขประเภทวัสดุ'}</h5>
                </div>
            </ModalHeader>
            <Modal.Body>
                <div className='pd-3'>
                    <div className='mb-3'>
                        <BoxCard title={"ประเภทวัสดุ"}>
                            <DataTable

                            >
                            </DataTable>
                        </BoxCard>
                    </div>
                    <div className="d-flex justify-content-end" >
                        <Button color="white" bg="#3C3C3C" className="cursor-p" onClick={() => { handleClose() }}>Close</Button>
                    </div>
                </div>
            </Modal.Body>

        </Modal>
    );
}

export default ModalManageTypes;
