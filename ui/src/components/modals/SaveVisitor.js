import React from 'react';
import {SlideIn, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody} from '@chakra-ui/core';
import SaveVisitorForm from '../forms/SaveVisitor';

const SaveVisitorModal = (props) => {
  const {isOpen, onClose, btnRef} = props;

  return (
    <SlideIn in={isOpen}>
      {(styles) => (
        <Modal finalFocusRef={btnRef} onClose={onClose} isOpen={true}>
          <ModalOverlay opacity={styles.opacity} />
          <ModalContent pb={5} {...styles} rounded="md">
            <ModalHeader>New visitor</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SaveVisitorForm onClose={onClose}/>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </SlideIn>
  );
};

export default SaveVisitorModal;
