import React from 'react';
import {connect} from 'react-redux';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/core';

import {deleteVisitor, closeDeleteVisitorDialog} from '../../data/actions/visitors';

const DeleteVisitorDialog = React.forwardRef((props, ref) => {
  const {
    isOpen,
    visitorId,
    dispatchCloseDeleteVisitorDialog,
    dispatchDeleteVisitor,
  } = props;

  const handleOnClose = () => dispatchCloseDeleteVisitorDialog();
  const handleOnDeleteClick = () => dispatchDeleteVisitor(visitorId);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={ref}
      onClose={handleOnClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Delete Visitor
        </AlertDialogHeader>

        <AlertDialogBody>
          Are you sure? You can't undo this action afterwards.
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={ref} onClick={handleOnClose}>
            Cancel
          </Button>
          <Button variantColor="red" onClick={handleOnDeleteClick} ml={3}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

const mapStateToProps = (state) => ({
  isOpen: state.visitors.deleteVisitorDialog.isOpen,
  visitorId: state.visitors.deleteVisitorDialog.visitorId,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchCloseDeleteVisitorDialog: () => dispatch(closeDeleteVisitorDialog()),
  dispatchDeleteVisitor: (id) => dispatch(deleteVisitor(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteVisitorDialog);
