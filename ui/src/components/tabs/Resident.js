import React from "react";

import { Heading, Stack } from "@chakra-ui/core";
import SaveResidentForm from "../forms/SaveResident";

const ResidentTab = () => (
  <Stack spacing={4}>
    <Heading size="2xl">Resident</Heading>
    <SaveResidentForm />
  </Stack>
);

export default ResidentTab;
