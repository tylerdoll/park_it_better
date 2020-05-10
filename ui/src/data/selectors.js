export const getVisitors = (store) => store.visitors;

export const getVisitorsToSubmit = createSelector([getVisitors], (visitors) =>
  visitors.filter((visitor) => visitor.submit)
);

export const getInvalidVisitors = createSelector([getVisitors], (visitors) =>
  visitors.filter((visitor) => visitor.isInvalid)
);
