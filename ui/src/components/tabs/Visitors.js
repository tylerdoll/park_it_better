import React, {useEffect} from 'react';
import {connect} from 'react-redux';

import {CSSTransition} from 'react-transition-group';
import "../../styles.css";

import {useDisclosure} from '@chakra-ui/core';
import {Flex} from '@chakra-ui/core';
import {Heading} from '@chakra-ui/core';
import {AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogBody, AlertDialogHeader, AlertDialogOverlay, Button} from '@chakra-ui/core';
import {useToast} from '@chakra-ui/core';

import Visitors from '../../containers/VisitorsList';
import FormModal from '../modals/Form';
import RoundedButton from '../RoundedButton';
import {
  postVisitorsForPermit,
  setVisitorFormInitialValues,
  deleteVisitor,
  toggleForSubmit,
  clearSubmission,
  removeToast,
} from '../../data/actions/visitors';

const getVisitorsToSubmit = (allVisitors, visitorsToSubmit) => {
    return allVisitors.filter((_, i) => visitorsToSubmit.includes(i))
};

const VisitorsTab = (props) => {
  const {
    allVisitors,
    invalidVisitors,
    visitorsToSubmit,
    postingVisitorsForPermit,
    toasts,
    dispatchClearSubmission,
    dispatchDeleteVisitor,
    dispatchPostVisitorsForPermit,
    dispatchRemoveToast,
    dispatchSetVisitorFormInitialValues,
    dispatchToggleForSubmit,
  } = props;

  const handleEditVisitorClick = (visitor) => {
    dispatchSetVisitorFormInitialValues(visitor);
    onOpen();
  };

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [isDeleteVisitorDialogOpen, setIsDeleteVisitorDialogOpen] = React.useState(false);
  const onDeleteVisitorDialogClose = () => setIsDeleteVisitorDialogOpen(false);
  const cancelRef = React.useRef();

  const toast = useToast();
  useEffect(() => {
    if (toasts.length === 0) return;

    const t = toasts.pop();
    toast({
      title: t.title,
      description: t.description,
      status: t.status,
      isClosable: true,
      duration: 5000, // ms
    });
    dispatchRemoveToast(t.id);
  });

  const handleVisitorClick =  (id) => {
    dispatchToggleForSubmit(id);
  };

  const handleDeleteVisitorClick = (visitor) => {
    setIsDeleteVisitorDialogOpen(true);
  };

  const handleConfirmDeleteVisitorClick = (visitor) => {
    console.log(visitor);
    dispatchDeleteVisitor(visitor["_id"]);
    setIsDeleteVisitorDialogOpen(false);
  };

  const handleSubmitVisitorsForPermitClick = () => {
    const visitors = getVisitorsToSubmit(allVisitors, visitorsToSubmit);
    if (visitors) {
      dispatchPostVisitorsForPermit(visitors);
    }
  };

  return (
    <Flex direction="column">
      <Heading size="2xl" mb={2}>Visitors</Heading>

      <CSSTransition in={visitorsToSubmit.length > 0} timeout={200} classNames="fade-up" unmountOnExit>
        <RoundedButton
          mt="auto"
          mx="auto"
          mb={4}
          size="lg"
          position="fixed"
          bottom="80px"
          alignSelf="center"
          loadingText="Submitting..."
          bg="gray.600"
          onClick={handleSubmitVisitorsForPermitClick}
          isLoading={postingVisitorsForPermit}
          _disabled={{opacity: 1.0, bg: "gray.700", color: "gray.600"}}
        >
            Submit for permit
        </RoundedButton>
      </CSSTransition>

      <Visitors
        allVisitors={allVisitors}
        invalidVisitors={invalidVisitors}
        visitorsToSubmit={visitorsToSubmit}
        onVisitorClick={handleVisitorClick}
        onVisitorEditClick={handleEditVisitorClick}
        onVisitorDeleteClick={handleDeleteVisitorClick}
      />

      <FormModal
        isOpen={isOpen}
        onClose={onClose}
      />

      <AlertDialog
        isOpen={isDeleteVisitorDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteVisitorDialogClose}
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
            <Button ref={cancelRef} onClick={onDeleteVisitorDialogClose}>
              Cancel
            </Button>
            <Button variantColor="red" onClick={handleConfirmDeleteVisitorClick} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
};

const mapStateToProps = (state) => ({
  allVisitors: state.visitors.allVisitors,
  invalidVisitors: state.visitors.invalidVisitors,
  visitorsToSubmit: state.visitors.visitorsToSubmit,
  postingVisitorsForPermit: state.visitors.postingVisitorsForPermit,
  toasts: state.visitors.toasts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetVisitorFormInitialValues: (values) => dispatch(setVisitorFormInitialValues(values)),
  dispatchPostVisitorsForPermit: (visitors) => dispatch(postVisitorsForPermit(visitors)),
  dispatchDeleteVisitor: (id) => dispatch(deleteVisitor(id)),
  dispatchClearSubmission: () => dispatch(clearSubmission()),
  dispatchRemoveToast: (id) => dispatch(removeToast(id)),
  dispatchToggleForSubmit: (id) => dispatch(toggleForSubmit(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisitorsTab);
