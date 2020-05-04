import React from 'react';
import {connect} from 'react-redux';

import {CSSTransition} from 'react-transition-group';
import "../../styles.css";

import {useDisclosure} from '@chakra-ui/core';
import {Flex} from '@chakra-ui/core';
import {Heading} from '@chakra-ui/core';

import Visitors from '../../containers/VisitorsList';
import FormModal from '../modals/Form';
import RoundedButton from '../RoundedButton';
import {postVisitorsForPermit, setVisitorFormInitialValues} from '../../data/actions';

const getVisitorsToSubmit = (allVisitors, visitorsToSubmit) => {
    return allVisitors.filter((_, i) => visitorsToSubmit.includes(i))
};

const VisitorsTab = (props) => {
  const {
    allVisitors,
    visitorsToSubmit,
    submitVisitorsForPermit,
    postingVisitorsForPermit,
    results,
    setFormInitialValues,
  } = props;

  const handleEditVisitorClick = (visitor) => {
    setFormInitialValues(visitor);
    onOpen();
  };

  const {isOpen, onOpen, onClose} = useDisclosure();

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
          onClick={() => submitVisitorsForPermit(getVisitorsToSubmit(allVisitors, visitorsToSubmit))}
          isLoading={postingVisitorsForPermit}
          _disabled={{opacity: 1.0, bg: "gray.700", color: "gray.600"}}
        >
            Submit for permit
        </RoundedButton>
      </CSSTransition>

      <Visitors
        allVisitors={allVisitors}
        visitorsToSubmit={visitorsToSubmit}
        results={results}
        onVisitorEditClick={handleEditVisitorClick}
      />

      <FormModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
};

const mapStateToProps = (state) => ({
  allVisitors: state.visitors.allVisitors,
  visitorsToSubmit: state.visitors.visitorsToSubmit,
  postingVisitorsForPermit: state.visitors.postingVisitorsForPermit,
  results: state.visitors.results,
});

const mapDispatchToProps = (dispatch) => ({
  setFormInitialValues: (values) => dispatch(setVisitorFormInitialValues(values)),
  submitVisitorsForPermit: (visitors) => visitors && dispatch(postVisitorsForPermit(visitors)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisitorsTab);
