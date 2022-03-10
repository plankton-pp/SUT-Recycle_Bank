import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import ModalHeader from '../ModalHeader';
import { Row, Col } from 'antd';
import { Button } from '../styles/globalStyles';

function ModalConfirm({ show, close, confirm, size, text, textBody, mode }) {

    const toConfrim = async () => {
        await confirm();
    };

    const handleClose = () => {
        close()
    }

    return (
        <Modal
            show={show}
            size={size}
            // onHide={() => handleClose()}
            centered
        >
            <ModalHeader closeButton className="pb-4">
            </ModalHeader>
            <Modal.Body className="p-4">
                <div className='d-flex justify-content-center'>
                    {text ? <p className="mb-5 bold">{text}</p> : ""}
                </div>
                <div className="py-2 d-flex justify-content-center">
                    <Row gutter={[10, 0]}>
                        <Col>
                            <Button color="white" bg="#96CC39" width={'auto'} className="cursor-p" onClick={() => { handleClose() }}>ยืนยัน</Button>
                        </Col>
                        <Col>
                            <Button color="white" bg="#E72525" width={'auto'} className="cursor-p" onClick={() => { toConfrim() }}>ยกเลิก</Button>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalConfirm;
