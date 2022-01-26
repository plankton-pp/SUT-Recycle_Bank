import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import {Row, Col } from 'antd';
import { Button } from '../styles/globalStyles';
import ModalHeader from '../ModalHeader'

function ModalSearchMember({ show, close, save, mode, idEdit, data }) {

    const handleClose = () => {
        close()
    }
    return (
        <Modal
            show={show}
            size="m"
            onHide={() => { handleClose() }}
            centered
        >
            <ModalHeader handleClose={() => { handleClose() }}>
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="bold mt-5">{'Header'}</h5>
                </div>
            </ModalHeader>
            <Modal.Body>
Search Member
                <Row>
                    <Col lg={12} md={12} sm={12}>
                        <div className="d-flex justify-content-end" >
                            <Button color="white" bg="#3C3C3C" className="cursor-p" onClick={() => { handleClose() }}>Close</Button>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>

        </Modal>
    );
}

export default ModalSearchMember;
