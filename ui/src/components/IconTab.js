import React, { forwardRef } from "react";
import PropTypes from "prop-types";

import { Tab, Box } from "@chakra-ui/core";

const IconTab = forwardRef((props, ref) => {
  const { label, icon, color, isSelected } = props;
  return (
    <Tab
      ref={ref}
      isSelected={isSelected}
      flex={1}
      p={0}
      {...props}
      _selected={{}}
    >
      <Box
        as={icon}
        aria-label={label}
        color={isSelected ? color : "white"}
        size="32px"
      />
    </Tab>
  );
});
IconTab.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
};
IconTab.displayName = "IconTab";

export default IconTab;
