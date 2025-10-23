import React from 'react';
import {motion} from 'framer-motion';
import { withTheme } from 'styled-components';

const test = {
  border: '5px solid #ef74b8'
};

const About = () => {
    return(
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
        <p>About</p>
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ ease: "easeOut", duration: 2 }}
          style={test}
        />
      </motion.div>
    )
}

export default About
