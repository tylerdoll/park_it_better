import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox, IconButton, Flex} from '@chakra-ui/core';

const Visitor = ({id, onChange, label, isInvalid, markedForSubmit, onEditClick}) => (
  <Flex align="center" py={3}>
    <Checkbox
      size="lg"
      isInvalid={isInvalid}
      isFullWidth={true}
      onChange={(e) => {
        onChange(parseInt(e.target.value));
      }}
      value={id}
      isChecked={markedForSubmit}
    >{label}</Checkbox>
    <IconButton icon="edit" variant="ghost" onClick={onEditClick}/>
  </Flex>
);

Visitor.propTypes = {
  onChange: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  isInvalid: PropTypes.bool,
};

Visitor.defaultProps = {
  isInvalid: false,
};

export default Visitor;
