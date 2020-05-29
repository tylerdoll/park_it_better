import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Heading, Stack, Text } from "@chakra-ui/core";
import { List, ListItem } from "@chakra-ui/core";

const renderHistory = (history) => {
  if (history && history.length > 0) {
    return (
      <Stack spacing={6} shouldWrapChildren={true}>
        {history.map((day, i) => (
          <div key={i}>
            <Heading as="h2" size="md" my={6} color="gray.500">
              {day.date}
            </Heading>
            <List spacing={2} fontSize="2xl">
              {day.visitors.map((visitor, i) => (
                <ListItem key={i}>
                  {`${visitor["visitor-first-name"]} ${visitor["visitor-last-name"]}`}
                </ListItem>
              ))}
            </List>
          </div>
        ))}
      </Stack>
    );
  } else {
    return <Text>No history to display</Text>;
  }
};

const HistoryTab = (props) => (
  <Stack spacing={4}>
    <Heading size="2xl">History</Heading>
    {renderHistory(props.history)}
  </Stack>
);

HistoryTab.propTypes = {
  history: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  history: state.permitHistory.permitHistory,
});

export default connect(mapStateToProps, null)(HistoryTab);
