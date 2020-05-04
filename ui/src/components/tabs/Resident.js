import React from 'react';

import {Heading} from '@chakra-ui/core';
import SaveResidentForm from '../forms/SaveVisitor';

const ResidentTab = () => (
  <div>
    <Heading size="2xl" mb={2}>Resident</Heading>
    <SaveResidentForm />
  </div>
);

export default ResidentTab;
