import styled from 'styled-components'

export const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;    
    border-bottom: 0px solid #dee2e6;
    border-top-left-radius: calc(0.3rem - 1px);
    border-top-right-radius: calc(0.3rem - 1px);
    
    h6 {
        margin-top: 0.5rem;
        margin-right: 0.5rem;
    }

    h5 {
        margin-top: 0.5rem;
    }
`
export const CloseButton = styled.div`
    padding: 1.25rem 0.5rem 0.2rem 0.5rem;
    margin: -1rem -1rem -1rem -1rem;
    justify-content: end;
    display: flez;
    cursor: pointer;
`
