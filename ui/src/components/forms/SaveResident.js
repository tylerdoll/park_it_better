import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Formik, Form, Field } from "formik";
import { Button, FormControl, FormLabel, Input, Stack } from "@chakra-ui/core";
import { saveResident } from "../../data/actions/resident";

const SaveResidentForm = (props) => {
  const { onFormSubmit, savingResident, initialValues } = props;
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(vals, actions) => onFormSubmit(vals)}
    >
      {(props) => (
        <Form>
          <Stack spacing={6} shouldWrapChildren={true}>
            <Stack spacing={3} shouldWrapChildren={true}>
              <Field name="property">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="property">Property Name</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="fullName">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="fullName">Full Name</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="address">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="unit">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="unit">Unit</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="city">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="city">City</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="state">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="state">State</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="zip">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="zip">Zip</FormLabel>
                    <Input {...field} placeholder="" />
                  </FormControl>
                )}
              </Field>
            </Stack>
            <Button
              variantColor="green"
              type="submit"
              loadingText="Saving"
              isLoading={savingResident}
              width="100%"
            >
              Save
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

SaveResidentForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  savingResident: PropTypes.bool.isRequired,
  initialValues: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  savingResident: state.resident.saving,
  initialValues: state.resident.fields,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onFormSubmit: (resident) =>
      dispatch(saveResident(resident, ownProps.onClose)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveResidentForm);
