import React from 'react';
import {connect} from 'react-redux';

import {ThemeProvider, Button, CSSReset, ColorModeProvider, Flex, Heading, useColorMode, useDisclosure} from '@chakra-ui/core';

import Topbar from './components/Topbar';
import Visitors from './containers/VisitorsList';
import SaveVisitorModal from './components/modals/SaveVisitor';

import {postVisitorsForPermit, setVisitorFormInitialValues} from './data/actions';

const getVisitorsToSubmit = (allVisitors, visitorsToSubmit) => allVisitors.filter((_, i) => visitorsToSubmit.includes(i));


const App = (props) => {
  const {toggleColorMode} = useColorMode();
  toggleColorMode('dark');

  const {isOpen, onOpen, onClose} = useDisclosure();
  const openSaveVisitorBtnRef = React.useRef();

  const {
    allVisitors,
    visitorsToSubmit,
    submitVisitorsForPermit,
    postingVisitorsForPermit,
    results,
    setFormInitialValues,
  } = props;


  const handleAddVisitorClick = () => {
    const initalValues = {
      'visitor-first-name': '',
      'visitor-last-name': '',
      'visitor-phone': '',
      'visitor-year': '',
      'visitor-make': '',
      'visitor-model': '',
      'visitor-color': '',
      'visitor-license-plate-number': '',
      'visitor-state-of-issuance': '',
      'visitor-email': 'email@address.com',
      'visitor-address': 'n/a',
      'visitor-apt-number': 'n/a',
      'visitor-city': 'n/a',
      'visitor-zip': 'n/a',
    };
    setFormInitialValues(initalValues);
    onOpen();
  };

  const handleEditVisitorClick = (visitor) => {
    setFormInitialValues(visitor);
    onOpen();
  };

  return (
    <ThemeProvider>
      <ColorModeProvider>
        <CSSReset />
        <Flex direction="column" minHeight="-webkit-fill-available">
          <Topbar openSaveVisitorModal={handleAddVisitorClick} btnRef={openSaveVisitorBtnRef}/>
          <Flex p={4} direction="column" flexGrow={1} height="100%">
            <Heading size="2xl" mb={2}>Visitors</Heading>
            <Visitors
              allVisitors={allVisitors}
              visitorsToSubmit={visitorsToSubmit}
              results={results}
              onVisitorEditClick={handleEditVisitorClick}
            />
            <Button
              width="100%"
              mt="auto"
              size="lg"
              alignSelf="flex-end"
              loadingText="Submitting..."
              onClick={() => submitVisitorsForPermit(getVisitorsToSubmit(allVisitors, visitorsToSubmit))}
              isLoading={postingVisitorsForPermit}
            >
                Submit for permit
            </Button>
          </Flex>
        </Flex>

        <SaveVisitorModal isOpen={isOpen} onClose={onClose} btnRef={openSaveVisitorBtnRef}/>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  allVisitors: state.visitors.allVisitors,
  visitorsToSubmit: state.visitors.visitorsToSubmit,
  postingVisitorsForPermit: state.visitors.postingVisitorsForPermit,
  results: state.visitors.results,
});

const mapDispatchToProps = (dispatch) => ({
  submitVisitorsForPermit: (visitors) => visitors && dispatch(postVisitorsForPermit(visitors)),
  setFormInitialValues: (values) => dispatch(setVisitorFormInitialValues(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
