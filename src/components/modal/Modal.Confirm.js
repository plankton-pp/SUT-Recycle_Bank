import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';

function ModalConfirm({ show, close, confirm, size, text, textBody, }) {

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
            onHide={() => handleClose(false)}
            centered
        >
            <Modal.Header closeButton className="pb-4">
            </Modal.Header>
            <Modal.Body className="p-4">
                <div className="mb-2 text-center">
                    {text ? <p className="mb-5 bold">{text}</p> : ""}

                    <div className="py-2">
                        <button className="btn btn-danger px-4 mr-2" onClick={() => handleClose()}>ยกเลิก</button>
                        <button className="btn btn-success px-4" onClick={() => toConfrim()}>ตกลง</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalConfirm;
