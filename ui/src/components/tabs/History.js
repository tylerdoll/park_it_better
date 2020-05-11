import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Heading, Stack } from "@chakra-ui/core";
import { List, ListItem } from "@chakra-ui/core";

const HistoryTab = (props) => {
  const { history } = props;

  return (
    <Stack spacing={4}>
      <Heading size="2xl">History</Heading>
      <Stack spacing={6} shouldWrapChildren={true}>
        {history.map((day, i) => (
          <div key={i}>
            <Heading as="h2" size="md" my={6} color="gray.500">
              {day.date}
            </Heading>
            <List spacing={2} fontSize="2xl">
              {day.visitors.map((visitor, i) => (
                <ListItem key={i}>{visitor}</ListItem>
              ))}
            </List>
          </div>
        ))}
      </Stack>
    </Stack>
  );
};

HistoryTab.propTypes = {
  history: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  history: state.visitors.history,
});

export default connect(mapStateToProps, null)(HistoryTab);
