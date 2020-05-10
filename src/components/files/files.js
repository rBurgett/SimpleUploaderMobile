import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Content, Text } from 'native-base';
import Container from '../shared/container';
import PageHeading from '../shared/page-heading';
import { colors } from '../../constants';

const Files = () => {
  return (
    <Container>
      <Content>
        <PageHeading />
        <View style={styles.noFilesContainer}>
          <Text style={styles.text}>You have not uploaded any files yet.</Text>
        </View>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  noFilesContainer: {
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: colors.TEXT
  }
});

export default Files;
