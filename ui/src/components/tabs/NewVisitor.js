import React from "react";

import { Heading, Stack } from "@chakra-ui/core";
import SaveVisitorForm from "../forms/SaveVisitor";

const NewVisitorTab = () => (
  <Stack spacing={4}>
    <Heading size="2xl">New Visitor</Heading>
    <SaveVisitorForm />
  </Stack>
);

export default NewVisitorTab;
