import React from "react";

import Visitor from "../components/Visitor";

const VisitorsList = (props) => {
  const {
    allVisitors,
    visitorsToSubmit,
    onVisitorClick,
    invalidVisitors,
    onVisitorEditClick,
    onVisitorDeleteClick,
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
    return "No visitors found";
  }
};

export default VisitorsList;
