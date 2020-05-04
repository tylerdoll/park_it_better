import React from 'react';

import {Heading} from '@chakra-ui/core';
import SaveVisitorForm from '../forms/SaveVisitor';

const NewVisitorTab = () => (
  <div>
    <Heading size="2xl" mb={2}>Add Visitor</Heading>
    <SaveVisitorForm />
  </div>
);

export default NewVisitorTab;
