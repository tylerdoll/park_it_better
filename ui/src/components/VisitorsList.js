import React from "react";
import { connect } from "react-redux";

import { Button, Text, Heading, Flex, Box } from "@chakra-ui/core";
import { FaPoo } from "react-icons/fa";

import Visitor from "../components/Visitor";

import { setTabIndex } from "../data/actions/app";

const VisitorsList = (props) => {
  const {
    allVisitors,
    visitorsToSubmit,
    onVisitorClick,
    invalidVisitors,
    onVisitorEditClick,
    onVisitorDeleteClick,
    dispatchSetTabIndex,
  } = props;

  if (allVisitors && allVisitors.length) {
    return allVisitors.map((v, i) => {
      const key = v["fullName"];

      return (
        <Visitor
          key={i}
          id={i}
          label={key}
          onChange={onVisitorClick}
          onEditClick={() => onVisitorEditClick(v)}
          onDeleteClick={() => onVisitorDeleteClick(v["_id"])}
          isInvalid={invalidVisitors.includes(v["_id"])}
          markedForSubmit={visitorsToSubmit.includes(i)}
        />
      );
    });
  } else {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center">
        <Heading as="h1" s="lg" mt={24}>
          Oh, poop
        </Heading>
        <Text textAlign="center" mt={4}>
          {"It looks like you haven't added any visitors yet."}
        </Text>
        <Text textAlign="center" mt={1}>
          {"Tap below to add a visitor."}
        </Text>
        <Button onClick={() => dispatchSetTabIndex(1)} mt={6}>
          Add a Visitor
        </Button>
        <Box as={FaPoo} size={48} color="gray.700" mt={12} />
      </Flex>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  dispatchSetTabIndex: (index) => dispatch(setTabIndex(index)),
});

export default connect(null, mapDispatchToProps)(VisitorsList);
