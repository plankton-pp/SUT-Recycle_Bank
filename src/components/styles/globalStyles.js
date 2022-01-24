import styled from 'styled-components'

export const ContainerFixed = styled.div`
    background: #F0F2F5;
    min-height: calc(100vh - 0px);
    font-family: "Kanit", serif;
`
export const ContainerFixedLogin = styled.div`
    background: #F0F2F5;
    min-height: calc(100vh - 70px);
`
export const DivLogin = styled.div`
    width: 40%;
    background: #FFFFFF;
    box-shadow: 0px 1px 14px rgba(0, 0, 0, 0.1), 0px 5px 8px rgba(0, 0, 0, 0.14), 0px 3px 5px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
`
export const NavHeader = styled.nav`
    background: #E72525;
`
export const Button = styled.button`
    background: ${({ bg,disabled }) => disabled? "#ddd": bg || "#fff"};
    color: ${({ color,disabled }) => disabled? "#666":color || "#000"};
    width: ${({width})=> width|| "auto"};
    height: ${({height})=> height|| "auto"};
    ${({ padding }) => `padding: ${padding}`};
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;    
    border: 1px solid transparent;
    padding: ${({ small, meduim, large }) => small ? "0.25rem 0.5rem" : meduim ? "0.375rem 0.75rem" : large ? "0.5rem 1rem" : "0.375rem 0.75rem"};
    font-size: ${({ small, meduim, large }) => small ? "0.875rem" : meduim ? "1rem" : large ? "1.25rem" : "1rem"};
    line-height: 1.5;
    border-radius: 0.25rem;

    &:hover {
        opacity: 0.9;
        transform: scale(0.99)
    }
    &:focus {
        box-shadow: 0 0 0 0.1rem ${({ bg }) => bg || "#fff"};
        outline: 5px auto ${({ bg }) => bg || "#fff"};
    }
`
export const Icon = styled.i`
    font-size: ${({ size }) => size || "16px"};
    color: ${({ color }) => color || "#000"};
    cursor: ${({ pointer }) => pointer ? "pointer" : ""} ;
    background-color: ${({ bg }) => bg ? bg : "transparent"};
    &:hover {
        opacity: ${({ pointer }) => pointer ? "0.9" : "1"};
    }
`