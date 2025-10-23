import React, { useEffect, useRef } from 'react';
import {motion} from 'framer-motion';
import { gsap } from 'gsap';

import logo from '../assets/images/logo.svg';
import circleResume from '../assets/images/circle-resume.svg';
import { StyledLogo } from '../Logo.styled';
import MockupViewer from '../Components/Three/MockupViewer';

const Index = () => {
  const resumeRef = useRef(null);

  useEffect(() => {
    if (resumeRef.current) {
      gsap.to(resumeRef.current, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: 'linear'
      });
    }
  }, []);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <StyledLogo><img src={logo} /></StyledLogo>
      <MockupViewer />
      <img
        ref={resumeRef}
        src={circleResume}
        alt="Resume"
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          width: '100px',
          height: '100px',
          zIndex: 1
        }}
      />
    </motion.div>
  )
}

export default Index
