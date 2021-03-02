import React from 'react';
import {motion} from 'framer-motion';

const Index = () => {
    return(
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
        <p>Home</p>
        </motion.div>
    )
}

export default Index
