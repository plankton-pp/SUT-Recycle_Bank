import styled from 'styled-components'

export const VerticalLine = styled.div`
  border-left: 1px solid ${props => props.color ? props.color : "black"};
  padding-top: 5%;
  height: ${props => props.height ? props.height : "50%"};
  position: ${props => props.position ? props.position : 'static'};
  opacity: ${props => props.opacity ? props.opacity : "1.0"};
  left: ${props => props.positionLeft ? props.positionLeft : "50%"};
  top: ${props => props.positionTop ? props.positionTop : "50%"};

  @media (max-width: 992px) {
    border-left: none;
  }
`