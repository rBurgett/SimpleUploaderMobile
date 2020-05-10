import React from 'react';
import { StyleSheet } from 'react-native';
import { H1 as NBH1, H2 as NBH2, H3 as NBH3 } from 'native-base';
import { colors } from '../../constants';

export const H1 = ({ children }) => {
  return (
    <NBH1 style={styles.heading}>{children}</NBH1>
  );
};
export const H2 = ({ children }) => {
  return (
    <NBH2 style={styles.heading}>{children}</NBH2>
  );
};
export const H3 = ({ children }) => {
  return (
    <NBH3 style={styles.heading}>{children}</NBH3>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: colors.TEXT
  }
});
