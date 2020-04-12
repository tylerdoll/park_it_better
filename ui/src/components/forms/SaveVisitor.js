import React from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field} from 'formik';
import {Button, FormControl, FormLabel, Input} from '@chakra-ui/core';
import {saveVisitor} from '../../data/actions';

const SaveVisitorForm = (props) => {
  const {onFormSubmit, savingVisitor, initalValues} = props;
  return (
    <Formik initialValues={initalValues} onSubmit={(vals, actions) => onFormSubmit(vals)}>
      {(props) => (
        <Form>
          <Field name="visitor-first-name">
            {({field, form}) => (
              <FormControl>
                <FormLabel htmlFor="visitor-first-name">First name</FormLabel>
                <Input {...field} placeholder="Alex" />
              </FormControl>
            )}
          </Field>
          <Field name="visitor-last-name">
            {({field, form}) => (
              <FormControl>
                <FormLabel htmlFor="visitor-last-name">Last name</FormLabel>
                <Input {...field} placeholder="Jones" />
              </FormControl>
            )}
          </Field>
          <Field name="visitor-phone" type="tel">
            {({field, form}) => (
              <FormControl>
                <FormLabel htmlFor="visitor-phone">Phone</FormLabel>
                <Input {...field} placeholder="555-555-5555" />
              </FormControl>
            )}
          </Field>
          <Field name="visitor-year" type="number">
            {({field, form}) => (
              <FormControl>
                <FormLabel htmlFor="visitor-year">Vehicle year</FormLabel>
                <Input {...field} placeholder="1337" />
              </FormControl>
            )}
          </Field>
          <Field name="visitor-make">
            {({field, form}) => (
              <FormControl>
                <FormLabel htmlFor="visitor-make">Vehicle make</FormLabel>
                <Input {...field} placeholder="Rolls Royce" />
              </FormControl>
            )}
          </Field>
          <Field name="visitor-model">
            {({field, form}) => (
              <FormControl>
                <FormLabel htmlFor="visitor-model">Vehicle model</FormLabel>
                <Input {...field} placeholder="Phantom" />
              </FormControl>
            )}
          </Field>
          <Field name="visitor-color">
            {({field, form}) => (
              <FormControl>
                <FormLabel htmlFor="visitor-color">Vehicle color</FormLabel>
                <Input {...field} placeholder="Mother of pearl" />
              </FormControl>
            )}
          </Field>
          <Field name="visitor-license-plate-number">
            {({field, form}) => (
              <FormControl>
                <FormLabel htmlFor="visitor-license-plate-number">Vehicle license plate number (no spaces or dashes)</FormLabel>
                <Input {...field} placeholder="MONEYBAGS" />
              </FormControl>
            )}
          </Field>
          <Field name="visitor-state-of-issuance">
            {({field, form}) => (
              <FormControl>
                <FormLabel htmlFor="visitor-state-of-issuance">Vehicle state of issuance</FormLabel>
                <Input {...field} placeholder="CA" />
              </FormControl>
            )}
          </Field>
          <Field name="visitor-email" type="hidden"></Field>
          <Field name="visitor-address" type="hidden"></Field>
          <Field name="visitor-apt-number" type="hidden"></Field>
          <Field name="visitor-city" type="hidden"></Field>
          <Field name="visitor-zip" type="hidden"></Field>
          <Button mt={3} variantColor="green" type="submit" loadingText="Saving" isLoading={savingVisitor}>Save</Button>
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = (state) => ({
  savingVisitor: state.visitors.savingVisitor,
  initalValues: state.visitors.visitorFormInitialValues,
  mode: state.visitors.visitorFormMode,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onFormSubmit: (visitor) => dispatch(saveVisitor(visitor, ownProps.onClose)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveVisitorForm);
