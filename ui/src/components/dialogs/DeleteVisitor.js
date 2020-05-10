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
          Are you sure? You cannot undo this action afterwards.
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
DeleteVisitorDialog.displayName = "DeleteVisitorDialog";

DeleteVisitorDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  visitorId: PropTypes.string.isRequired,
  dispatchCloseDeleteVisitorDialog: PropTypes.func.isRequired,
  dispatchDeleteVisitor: PropTypes.func.isRequired,
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
