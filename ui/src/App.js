import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ThemeProvider, CSSReset, DarkMode } from "@chakra-ui/core";
import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/core";

import { FaList, FaPlus, FaHome, FaHistory } from "react-icons/fa";

import IconTab from "./components/IconTab";
import VisitorsTab from "./components/tabs/Visitors";
import NewVisitorTab from "./components/tabs/NewVisitor";
import ResidentTab from "./components/tabs/Resident";
import HistoryTab from "./components/tabs/History";

import { setTabIndex } from "./data/actions/app";

const App = (props) => {
  const { tabIndex, dispatchSetTabIndex } = props;

  const handleTabsChange = (index) => dispatchSetTabIndex(index);

  return (
    <ThemeProvider>
      <DarkMode>
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
          <TabList
            bg="gray.700"
            height="64px"
            display="flex"
            position="fixed"
            p={4}
            top={0}
            left={0}
            right={0}
            zIndex={100}
          >
            <IconTab label="Visitors" icon={FaList} />
            <IconTab label="Add visitor" icon={FaPlus} />
            <IconTab label="Resident" icon={FaHome} />
            <IconTab label="History" icon={FaHistory} />
          </TabList>

          <TabPanels
            flex={1}
            display="flex"
            flexDirection="column"
            p={4}
            pt="80px"
          >
            <TabPanel py={4}>
              <VisitorsTab />
            </TabPanel>
            <TabPanel py={4}>
              <NewVisitorTab />
            </TabPanel>
            <TabPanel py={4}>
              <ResidentTab />
            </TabPanel>
            <TabPanel py={4}>
              <HistoryTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DarkMode>
    </ThemeProvider>
  );
};

App.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  dispatchSetTabIndex: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tabIndex: state.app.tabIndex,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetTabIndex: (index) => dispatch(setTabIndex(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
