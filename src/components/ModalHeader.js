import React from 'react'
import { CloseButton } from './styles/modalStyles';
import { Icon } from './styles/globalStyles';

function ModalHeader({handleClose, children}) {
    return (
        <div className="d-flex justify-content-end flex-column px-3">
            <CloseButton><Icon className="fa fa-times-circle" color="#8F8F8F" onClick={() => { handleClose() }} /></CloseButton>
            {children}
            
            <style jsx="true" global="true">{`
                display: flex;
                justify-content: space-between;
                padding: 1rem 1rem;    
                border-bottom: 0px solid #dee2e6;
                border-top-left-radius: calc(0.3rem - 1px);
                border-top-right-radius: calc(0.3rem - 1px);
                
            `}
            </style>
        </div>
    )
}

export default ModalHeader
