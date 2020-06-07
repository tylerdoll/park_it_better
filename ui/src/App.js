import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/core";
import { useToast } from "@chakra-ui/core";

import { FaList, FaPlus, FaHome, FaHistory } from "react-icons/fa";

import IconTab from "./components/IconTab";
import VisitorsTab from "./components/tabs/Visitors";
import NewVisitorTab from "./components/tabs/NewVisitor";
import ResidentTab from "./components/tabs/Resident";
import HistoryTab from "./components/tabs/History";

import { setTabIndex, removeToast } from "./data/actions/app";

const App = (props) => {
  const { tabIndex, dispatchSetTabIndex, toasts, dispatchRemoveToast } = props;

  const handleTabsChange = (index) => dispatchSetTabIndex(index);

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

  return (
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
        display="flex"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
      >
        <IconTab label="Visitors" icon={FaList} />
        <IconTab label="Add visitor" icon={FaPlus} />
        <IconTab label="History" icon={FaHistory} />
        <IconTab label="Resident" icon={FaHome} />
      </TabList>

      <TabPanels flex={1} display="flex" flexDirection="column" p={4} pt="80px">
        <TabPanel py={4}>
          <VisitorsTab />
        </TabPanel>
        <TabPanel py={4}>
          <NewVisitorTab />
        </TabPanel>
        <TabPanel py={4}>
          <HistoryTab />
        </TabPanel>
        <TabPanel py={4}>
          <ResidentTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

App.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  toasts: PropTypes.array.isRequired,
  dispatchSetTabIndex: PropTypes.func.isRequired,
  dispatchRemoveToast: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  tabIndex: state.app.tabIndex,
  toasts: state.app.toasts,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetTabIndex: (index) => dispatch(setTabIndex(index)),
  dispatchRemoveToast: (id) => dispatch(removeToast(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
