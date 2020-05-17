import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/core";

import {
  deleteVisitor,
  closeDeleteVisitorDialog,
} from "../../data/actions/visitors";

const DeleteVisitorDialog = (props) => {
  const {
    isOpen,
    visitorId,
    dispatchCloseDeleteVisitorDialog,
    dispatchDeleteVisitor,
    cancelRef,
  } = props;

  const handleOnClose = () => dispatchCloseDeleteVisitorDialog();
  const handleOnDeleteClick = () => dispatchDeleteVisitor(visitorId);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={handleOnClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Delete Visitor
        </AlertDialogHeader>

        <AlertDialogBody>
          Are you sure? You cannot undo this action afterwards.
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={handleOnClose}>
            Cancel
          </Button>
          <Button variantColor="red" onClick={handleOnDeleteClick} ml={3}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
DeleteVisitorDialog.displayName = "DeleteVisitorDialog";

DeleteVisitorDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  visitorId: PropTypes.string,
  dispatchCloseDeleteVisitorDialog: PropTypes.func.isRequired,
  dispatchDeleteVisitor: PropTypes.func.isRequired,
  cancelRef: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isOpen: state.visitors.deleteVisitorDialog.isOpen,
  visitorId: state.visitors.deleteVisitorDialog.visitorId,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchCloseDeleteVisitorDialog: () => dispatch(closeDeleteVisitorDialog()),
  dispatchDeleteVisitor: (id) => dispatch(deleteVisitor(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteVisitorDialog);
