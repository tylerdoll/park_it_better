import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Formik, Form, Field } from "formik";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
} from "@chakra-ui/core";

import { saveVisitor } from "../../data/actions/visitors";

const SaveVisitorForm = (props) => {
  const { onFormSubmit, savingVisitor, initalValues } = props;
  const formSectionSpacing = 3;

  const handlePhoneChange = (event, next) => {
    const val = event.target.value;
    const phone = val.replace(/\D/g, "");
    const match = phone.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
    let formatted = "";
    if (match) {
      formatted = `(${match[1]})`;
      formatted += `${match[2] ? " " : ""}${match[2]}`;
      formatted += `${match[3] ? "-" : ""}${match[3]}`;
    }
    event.target.value = formatted;

    next(event);
  };

  return (
    <Formik
      initialValues={initalValues}
      onSubmit={(vals, actions) => onFormSubmit(vals)}
    >
      {(props) => (
        <Form>
          <Stack spacing={6} shouldWrapChildren={true}>
            <Stack spacing={formSectionSpacing} shouldWrapChildren={true}>
              <Heading as="h2" size="md" color="gray.500">
                Personal
              </Heading>

              <Field name="fullName">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="fullName">Full Name</FormLabel>
                    <Input {...field} placeholder="John Smith" />
                  </FormControl>
                )}
              </Field>
              <Field name="phone">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="phone">Phone</FormLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        handlePhoneChange(e, field.onChange);
                      }}
                      placeholder="(555) 555-5555"
                      type="tel"
                    />
                  </FormControl>
                )}
              </Field>
            </Stack>

            <Stack spacing={formSectionSpacing} shouldWrapChildren={true}>
              <Heading as="h2" size="md" color="gray.500">
                Vehicle
              </Heading>

              <Field name="vehicleColor">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="vehicleColor">Color</FormLabel>
                    <Input {...field} placeholder="Mother of pearl" />
                  </FormControl>
                )}
              </Field>
              <Field name="vehicleYear">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="vehicleYear">Year</FormLabel>
                    <Input {...field} placeholder="1337" type="number" />
                  </FormControl>
                )}
              </Field>
              <Field name="vehicleMake">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="vehicleMake">Make</FormLabel>
                    <Input {...field} placeholder="Rolls Royce" />
                  </FormControl>
                )}
              </Field>
              <Field name="vehicleModel">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="vehicleModel">Model</FormLabel>
                    <Input {...field} placeholder="Phantom" />
                  </FormControl>
                )}
              </Field>
              <Field name="vehicleState">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="vehicleState">
                      State of issuance
                    </FormLabel>
                    <Input {...field} placeholder="CA" />
                  </FormControl>
                )}
              </Field>
              <Field name="vehiclePlate">
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel htmlFor="vehiclePlate">
                      License plate number
                    </FormLabel>
                    <Input {...field} placeholder="MONEYBAGS" />
                  </FormControl>
                )}
              </Field>
            </Stack>

            <Button
              variantColor="green"
              type="submit"
              loadingText="Saving"
              isLoading={savingVisitor}
              width="100%"
            >
              Save
            </Button>
          </Stack>
          <Field name="email" type="hidden"></Field>
          <Field name="address" type="hidden"></Field>
          <Field name="unit" type="hidden"></Field>
          <Field name="city" type="hidden"></Field>
          <Field name="zip" type="hidden"></Field>
        </Form>
      )}
    </Formik>
  );
};

SaveVisitorForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  savingVisitor: PropTypes.bool.isRequired,
  initalValues: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  savingVisitor: state.visitors.saving,
  mode: state.visitors.visitorFormMode,
  initalValues: state.visitors.visitorFormInitialValues,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onFormSubmit: (visitor) => dispatch(saveVisitor(visitor, ownProps.onClose)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveVisitorForm);
