import React from "react";
import PropTypes from "prop-types";

import {
  SlideIn,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/core";

import SaveVisitorForm from "../forms/SaveVisitor";

const FormModal = (props) => {
  const { isOpen, onClose } = props;

  return (
    <SlideIn in={isOpen}>
      {(styles) => (
        <Modal onClose={onClose} isOpen={true}>
          <ModalOverlay opacity={styles.opacity} />
          <ModalContent pb={5} {...styles} rounded="md">
            <ModalHeader>Edit Visitor</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SaveVisitorForm onClose={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </SlideIn>
  );
};

FormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FormModal;
