import React from 'react';
import {connect} from 'react-redux';
import {SlideIn, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody} from '@chakra-ui/core';
import SaveVisitorForm from '../forms/SaveVisitor';

const FormModal = (props) => {
  const {isOpen, onClose, btnRef, initalValues} = props;

  return (
    <SlideIn in={isOpen}>
      {(styles) => (
        <Modal finalFocusRef={btnRef} onClose={onClose} isOpen={true}>
          <ModalOverlay opacity={styles.opacity} />
          <ModalContent pb={5} {...styles} rounded="md">
            <ModalHeader>Edit Visitor</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SaveVisitorForm onClose={onClose} initalValues={initalValues}/>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </SlideIn>
  );
};

const mapStateToProps = (state) => ({
  initalValues: state.visitors.visitorFormInitialValues,
});

export default connect(mapStateToProps, null)(FormModal);
