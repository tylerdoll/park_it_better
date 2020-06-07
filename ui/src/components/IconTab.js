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
      _focus={{ borderColor: null }}
      _active={{ background: null }}
    >
      <Box
        as={icon}
        aria-label={label}
        size="32px"
        color={isSelected ? color : "white"}
      />
    </Tab>
  );
});

IconTab.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  color: PropTypes.string,
};

IconTab.defaultProps = { color: "green.200" };

IconTab.displayName = "IconTab";

export default IconTab;
