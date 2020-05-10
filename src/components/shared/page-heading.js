import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { H1 } from './headings';

const PageHeading = () => {
  return (
    <View style={styles.container}>
      <H1>Simple S3 Uploader</H1>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8
  }
});

export default PageHeading;
