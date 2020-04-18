import React from 'react';
import {connect} from 'react-redux';
import {Formik, Form, Field} from 'formik';
import {Button, FormControl, FormLabel, Input, SimpleGrid} from '@chakra-ui/core';
import {saveResident} from '../../data/actions';

const SaveResidentForm = (props) => {
  const {onFormSubmit, savingResident, initalValues} = props;
    console.log("initalValues", initalValues)
  return (
    <Formik enableReinitialize initialValues={initalValues} onSubmit={(vals, actions) => onFormSubmit(vals)}>
      {(props) => (
        <Form>
          <SimpleGrid columns={{sm: 1, md: 2}} spacing={4}>
              <Field name="property-name">
                {({field, form}) => (
                  <FormControl>
                    <FormLabel htmlFor="property-name">Property name</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="first-name-of-resident">
                {({field, form}) => (
                  <FormControl>
                    <FormLabel htmlFor="first-name-of-resident">First name</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="last-name-of-resident">
                {({field, form}) => (
                  <FormControl>
                    <FormLabel htmlFor="last-name-of-resident">Last name</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="resident-address">
                {({field, form}) => (
                  <FormControl>
                    <FormLabel htmlFor="resident-address">Address</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="resident-apartment">
                {({field, form}) => (
                  <FormControl>
                    <FormLabel htmlFor="resident-apartment">Unit</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="resident-city">
                {({field, form}) => (
                  <FormControl>
                    <FormLabel htmlFor="resident-city">City</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="resident-state">
                {({field, form}) => (
                  <FormControl>
                    <FormLabel htmlFor="resident-state">State</FormLabel>
                    <Input {...field} />
                  </FormControl>
                )}
              </Field>
              <Field name="resident-zip">
                {({field, form}) => (
                  <FormControl>
                    <FormLabel htmlFor="resident-zip">Zip</FormLabel>
                    <Input {...field} placeholder="" />
                  </FormControl>
                )}
              </Field>
          </SimpleGrid>
              <Button
                mt={4}
                variantColor="green"
                type="submit"
                loadingText="Saving"
                isLoading={savingResident}
              >
                Save
              </Button>
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = (state) => ({
  savingResident: state.visitors.savingResident,
  initalValues: state.visitors.resident,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onFormSubmit: (resident) => dispatch(saveResident(resident, ownProps.onClose)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveResidentForm);
