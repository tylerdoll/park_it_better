import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { CSSTransition } from "react-transition-group";
import "../../styles.css";

import { useDisclosure } from "@chakra-ui/core";
import { Flex } from "@chakra-ui/core";
import { Heading } from "@chakra-ui/core";
import { useToast } from "@chakra-ui/core";

import VisitorsList from "../VisitorsList";
import FormModal from "../modals/Form";
import RoundedButton from "../RoundedButton";
import DeleteVisitorDialog from "../dialogs/DeleteVisitor";
import {
  postVisitorsForPermit,
  setVisitorFormInitialValues,
  toggleForSubmit,
  removeToast,
  openDeleteVisitorDialog,
} from "../../data/actions/visitors";

const getVisitorsToSubmit = (allVisitors, visitorsToSubmit) => {
  return allVisitors.filter((_, i) => visitorsToSubmit.includes(i));
};

const VisitorsTab = (props) => {
  const {
    allVisitors,
    invalidVisitors,
    visitorsToSubmit,
    postingForPermit,
    toasts,
    dispatchPostVisitorsForPermit,
    dispatchRemoveToast,
    dispatchSetVisitorFormInitialValues,
    dispatchToggleForSubmit,
    dispatchOpenDeleteVisitorDialog,
  } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const handleDeleteVisitorClick = (id) => dispatchOpenDeleteVisitorDialog(id);
  const handleEditVisitorClick = (visitor) => {
    dispatchSetVisitorFormInitialValues(visitor);
    onOpen();
  };
  const handleSubmitVisitorsForPermitClick = () => {
    const visitors = getVisitorsToSubmit(allVisitors, visitorsToSubmit);
    if (visitors) {
      dispatchPostVisitorsForPermit(visitors);
    }
  };
  const handleVisitorClick = (id) => dispatchToggleForSubmit(id);

  return (
    <Flex direction="column">
      <Heading size="2xl" mb={4}>
        Visitors
      </Heading>

      <CSSTransition
        in={visitorsToSubmit.length > 0}
        timeout={200}
        classNames="fade-up"
        unmountOnExit
      >
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
          isLoading={postingForPermit}
          _disabled={{ opacity: 1.0, bg: "gray.700", color: "gray.600" }}
        >
          Submit for permit
        </RoundedButton>
      </CSSTransition>

      <VisitorsList
        allVisitors={allVisitors}
        invalidVisitors={invalidVisitors}
        visitorsToSubmit={visitorsToSubmit}
        onVisitorClick={handleVisitorClick}
        onVisitorEditClick={handleEditVisitorClick}
        onVisitorDeleteClick={handleDeleteVisitorClick}
      />

      <FormModal isOpen={isOpen} onClose={onClose} />

      <DeleteVisitorDialog cancelRef={cancelRef} />
    </Flex>
  );
};

VisitorsTab.propTypes = {
  allVisitors: PropTypes.array.isRequired,
  invalidVisitors: PropTypes.array.isRequired,
  visitorsToSubmit: PropTypes.array.isRequired,
  postingForPermit: PropTypes.bool.isRequired,
  toasts: PropTypes.array.isRequired,
  dispatchToggleForSubmit: PropTypes.func.isRequired,
  dispatchPostVisitorsForPermit: PropTypes.func.isRequired,
  dispatchSetVisitorFormInitialValues: PropTypes.func.isRequired,
  dispatchOpenDeleteVisitorDialog: PropTypes.func.isRequired,
  dispatchRemoveToast: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  allVisitors: state.visitors.allVisitors,
  invalidVisitors: state.visitors.invalidVisitors,
  visitorsToSubmit: state.visitors.visitorsToSubmit,
  postingForPermit: state.visitors.postingForPermit,
  toasts: state.visitors.toasts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetVisitorFormInitialValues: (values) =>
    dispatch(setVisitorFormInitialValues(values)),
  dispatchPostVisitorsForPermit: (visitors) =>
    dispatch(postVisitorsForPermit(visitors)),
  dispatchOpenDeleteVisitorDialog: (id) =>
    dispatch(openDeleteVisitorDialog(id)),
  dispatchRemoveToast: (id) => dispatch(removeToast(id)),
  dispatchToggleForSubmit: (id) => dispatch(toggleForSubmit(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisitorsTab);
