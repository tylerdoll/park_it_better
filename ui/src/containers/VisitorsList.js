import React, {useEffect} from 'react';
import {connect} from 'react-redux';

import {useToast} from '@chakra-ui/core';

import {toggleForSubmit, clearSubmission} from '../data/actions';
import Visitor from '../components/Visitor';

const VisitorsList = (props) => {
  const {
    allVisitors, visitorsToSubmit, onVisitorClick, results, onVisitorEditClick,
  } = props;

  const toast = useToast();
  useEffect(() => {
    results.forEach((r, i) => {
      const {visitor} = r;
      const name = `${visitor['visitor-first-name']} ${visitor['visitor-last-name']}`;
      const title = r.succeeded ? `Successfully submit ${name}` : `Failed to submit ${name}`;

      toast({
        title,
        description: r.response,
        status: r.succeeded ? 'success' : 'error',
        isClosable: true,
        duration: 5000, // ms
      });
    });
  });

  if (allVisitors && allVisitors.length) {
    return allVisitors.map((v, i) => {
      const key = `${v['visitor-first-name']} ${v['visitor-last-name']}`;
      const isInvalid = () => {
        const result = results.find((r) => {
          return r.visitor['visitor-first-name'] === v['visitor-first-name'] &&
              r.visitor['visitor-last-name'] === v['visitor-last-name'];
        });
        return result ? !result.succeeded : false;
      };

      return <Visitor
        key={i}
        id={i}
        label={key}
        onChange={onVisitorClick}
        onEditClick={() => onVisitorEditClick(v)}
        isInvalid={isInvalid()}
        markedForSubmit={visitorsToSubmit.includes(i)}
      />;
    });
  } else {
    return 'No visitors found';
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    ...ownProps,
    onVisitorClick: (id) => {
      if (ownProps.results.length) {
        console.log('clearing');
        dispatch(clearSubmission());
      }
      dispatch(toggleForSubmit(id));
    },
  };
};

export default connect(null, mapDispatchToProps)(VisitorsList);
