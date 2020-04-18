import React, {useState, useRef, forwardRef} from 'react';
import {connect} from 'react-redux';

import {ThemeProvider, Button, CSSReset, ColorModeProvider, Flex, Heading, useColorMode, useDisclosure} from '@chakra-ui/core';
import {Tabs, TabList, Tab, TabPanels, TabPanel} from '@chakra-ui/core';
import {Icon} from '@chakra-ui/core';

import Visitors from './containers/VisitorsList';
import FormModal from './components/modals/Form';
import RoundedButton from './components/RoundedButton';
import SaveVisitorForm from './components/forms/SaveVisitor';
import SaveResidentForm from './components/forms/SaveResident';

import {postVisitorsForPermit, setVisitorFormInitialValues, setTabIndex} from './data/actions';

const getVisitorsToSubmit = (allVisitors, visitorsToSubmit) => {
    return allVisitors.filter((_, i) => visitorsToSubmit.includes(i))
};


const App = (props) => {
  const {toggleColorMode} = useColorMode();
  toggleColorMode('dark');

  const {isOpen, onOpen, onClose} = useDisclosure();

  const {
    allVisitors,
    visitorsToSubmit,
    submitVisitorsForPermit,
    postingVisitorsForPermit,
    results,
    setFormInitialValues,
    tabIndex,
    setTabIndex,
  } = props;

  const handleEditVisitorClick = (visitor) => {
    setFormInitialValues(visitor);
    onOpen();
  };

  const handleTabsChange = (index) => setTabIndex(index);

  const IconTab = forwardRef((props, ref) => {
      const {label, icon, color} = props;
      return (
        <Tab ref={ref} isSelected={props.isSelected} flex={1} {...props} _selected={{}}>
          <Icon aria-label={label} name={icon} color={props.isSelected ? color : "white"}/>
        </Tab>
      );
  });

  return (
    <ThemeProvider>
      <ColorModeProvider>
        <CSSReset />
          <Tabs
            variant="soft-rounded"
            align="center"
            height="-webkit-fill-available"
            display="flex"
            flexDirection="column"
            flexGrow={1}
            index={tabIndex}
            onChange={handleTabsChange}
          >
                <TabPanels flex={1} display="flex" flexDirection="column" p={4} pb="80px" overflow="auto">
                  <TabPanel flexGrow={1} display="flex" flexDirection="column" >
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
                  </TabPanel>
                  <TabPanel>
                    <Heading size="2xl" mb={2}>Add Visitor</Heading>
                    <SaveVisitorForm />
                  </TabPanel>
                  <TabPanel>
                    <Heading size="2xl" mb={2}>Resident</Heading>
                    <SaveResidentForm />
                  </TabPanel>
                </TabPanels>

                <TabList bg="gray.700" height="64px" display="flex" position="fixed" p={4} bottom={0} left={0} right={0}>
                  <IconTab label="Visitors" icon="check-circle" color="green.200"/>
                  <IconTab label="Add visitor" icon="add" color="blue.200"/>
                  <IconTab label="Resident" icon="settings" color="red.200" />
                </TabList>
          </Tabs>

        <FormModal
          isOpen={isOpen}
          onClose={onClose}
        />
      </ColorModeProvider>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  allVisitors: state.visitors.allVisitors,
  visitorsToSubmit: state.visitors.visitorsToSubmit,
  postingVisitorsForPermit: state.visitors.postingVisitorsForPermit,
  results: state.visitors.results,
  tabIndex: state.visitors.tabIndex,
});

const mapDispatchToProps = (dispatch) => ({
  submitVisitorsForPermit: (visitors) => visitors && dispatch(postVisitorsForPermit(visitors)),
  setFormInitialValues: (values) => dispatch(setVisitorFormInitialValues(values)),
  setTabIndex: (index) => dispatch(setTabIndex(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
