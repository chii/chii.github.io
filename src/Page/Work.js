import React from 'react';
import {motion} from 'framer-motion';

const Work = () => {
    return(
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
        <p>Work</p>
        </motion.div>
    )
}

export default Work
