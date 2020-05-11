import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  ThemeProvider,
  CSSReset,
  ColorModeProvider,
  useColorMode,
} from "@chakra-ui/core";
import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/core";

import { FaList, FaPlus, FaHome } from "react-icons/fa";

import IconTab from "./components/IconTab";
import VisitorsTab from "./components/tabs/Visitors";
import NewVisitorTab from "./components/tabs/NewVisitor";
import ResidentTab from "./components/tabs/Resident";

import { setTabIndex } from "./data/actions/app";

const App = (props) => {
  const { toggleColorMode } = useColorMode();
  toggleColorMode("dark");

  const { tabIndex, setTabIndex } = props;

  const handleTabsChange = (index) => setTabIndex(index);

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
          <TabPanels
            flex={1}
            display="flex"
            flexDirection="column"
            p={4}
            pb="80px"
          >
            <TabPanel>
              <VisitorsTab />
            </TabPanel>
            <TabPanel>
              <NewVisitorTab />
            </TabPanel>
            <TabPanel>
              <ResidentTab />
            </TabPanel>
          </TabPanels>

          <TabList
            bg="gray.700"
            height="64px"
            display="flex"
            position="fixed"
            p={4}
            bottom={0}
            left={0}
            right={0}
          >
            <IconTab label="Visitors" icon={FaList} color="green.200" />
            <IconTab label="Add visitor" icon={FaPlus} color="blue.200" />
            <IconTab label="Resident" icon={FaHome} color="red.200" />
          </TabList>
        </Tabs>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

App.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  setTabIndex: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tabIndex: state.app.tabIndex,
});

const mapDispatchToProps = (dispatch) => ({
  setTabIndex: (index) => dispatch(setTabIndex(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
