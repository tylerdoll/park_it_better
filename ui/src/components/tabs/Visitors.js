import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { CSSTransition } from "react-transition-group";
import "../../styles.css";

import { useDisclosure } from "@chakra-ui/core";
import { Flex, Heading } from "@chakra-ui/core";

import VisitorsList from "../VisitorsList";
import FormModal from "../modals/Form";
import RoundedButton from "../RoundedButton";
import DeleteVisitorDialog from "../dialogs/DeleteVisitor";
import {
  postVisitorsForPermit,
  setVisitorFormInitialValues,
  toggleForSubmit,
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
    dispatchPostVisitorsForPermit,
    dispatchSetVisitorFormInitialValues,
    dispatchToggleForSubmit,
    dispatchOpenDeleteVisitorDialog,
  } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

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
        <Flex
          direction="column"
          alignItems="center"
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          my="0"
          mx="auto"
          p={4}
        >
          <RoundedButton
            size="lg"
            alignSelf="center"
            loadingText="Submitting..."
            bg="gray.600"
            onClick={handleSubmitVisitorsForPermitClick}
            isLoading={postingForPermit}
            _disabled={{ opacity: 1.0, bg: "gray.700", color: "gray.600" }}
          >
            Submit for permit
          </RoundedButton>
        </Flex>
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
  dispatchToggleForSubmit: PropTypes.func.isRequired,
  dispatchPostVisitorsForPermit: PropTypes.func.isRequired,
  dispatchSetVisitorFormInitialValues: PropTypes.func.isRequired,
  dispatchOpenDeleteVisitorDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  allVisitors: state.visitors.allVisitors,
  invalidVisitors: state.visitors.invalidVisitors,
  visitorsToSubmit: state.visitors.visitorsToSubmit,
  postingForPermit: state.visitors.postingForPermit,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetVisitorFormInitialValues: (values) =>
    dispatch(setVisitorFormInitialValues(values)),
  dispatchPostVisitorsForPermit: (visitors) =>
    dispatch(postVisitorsForPermit(visitors)),
  dispatchOpenDeleteVisitorDialog: (id) =>
    dispatch(openDeleteVisitorDialog(id)),
  dispatchToggleForSubmit: (id) => dispatch(toggleForSubmit(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisitorsTab);
