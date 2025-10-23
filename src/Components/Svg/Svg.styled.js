import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion"

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const ImageElement = styled(motion.img)`
    width: 100px;
    //animation: ${rotate} 20s linear infinite;
    height: 100px;
    border: 1px dashed #fff;
`
export const StyledMotionDiv = styled(motion.div)`
    background-color: tomato;
    color: white;
    width: 200px;
    height: 200px;
    text-align: center;
`