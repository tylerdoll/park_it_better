import React from 'react';
import {Box, useColorMode, IconButton} from '@chakra-ui/core';

const Topbar = (props) => {
  const {openSaveVisitorModal, btnRef} = props;
  const {colorMode, toggleColorMode} = useColorMode();

  return (
    <Box textAlign="right" p="4">
      <IconButton aria-label="Toggle color mode" icon={colorMode === 'light' ? 'moon' : 'sun'} variant="ghost" onClick={toggleColorMode}/>
      <IconButton aria-label="Add visitor" icon="add" variant="ghost" onClick={openSaveVisitorModal} btnRef={btnRef}/>
    </Box>
  );
};

export default Topbar;
