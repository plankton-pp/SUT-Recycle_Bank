import styled from 'styled-components'

export const BoxCardHead = styled.div`
    background: #30a878;
    border-radius: 5px 5px 0px 0px;
    padding: 0.5rem 1rem;

    h4 {
        color: #FFFF;
        margin-bottom: 0;
    }
`
export const BoxCardBody = styled.div`
    background: #FFFFFF;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25), 0px 3px 4px rgba(0, 0, 0, 0.14), 0px 1px 8px rgba(0, 0, 0, 0.1);
    border-radius: ${({ props }) => props ? "5px 5px 5px 5px" : "0px 0px 5px 5px"};
    padding: 0.5rem 1rem;
`
export const CardBody = styled.div`
    background: #FFFFFF;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25), 0px 3px 4px rgba(0, 0, 0, 0.14), 0px 1px 8px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 0.8rem 1rem;
`
