import React from 'react';
import {connect} from 'react-redux';

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
    <div>
        <Flex direction="column" flexGrow={1} height="100%">
          <Heading size="2xl" mb={2}>Visitors</Heading>
          <Visitors
            allVisitors={allVisitors}
            visitorsToSubmit={visitorsToSubmit}
            results={results}
            onVisitorEditClick={handleEditVisitorClick}
          />
          <RoundedButton
            mt="auto"
            mb={4}
            size="lg"
            alignSelf="center"
            loadingText="Submitting..."
            onClick={() => submitVisitorsForPermit(getVisitorsToSubmit(allVisitors, visitorsToSubmit))}
            isLoading={postingVisitorsForPermit}
          >
              Submit for permit
          </RoundedButton>
        </Flex>

        <FormModal
          isOpen={isOpen}
          onClose={onClose}
        />
    </div>
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
