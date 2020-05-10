import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'native-base';
import Container from '../shared/container';
import PageHeading from '../shared/page-heading';
import { colors } from '../../constants';

const Upload = () => {

  const onPress = () => {
    console.log('onPress!');
  };

  return (
    <Container>
      <PageHeading />
      <View style={styles.main}>
        <TouchableOpacity style={styles.touchableOpacity} onPress={onPress}>
          <Icon name={'folder-open'} style={styles.icon} />
          <Text style={styles.text}>Select one or more files to upload</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  touchableOpacity: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    color: colors.PRIMARY,
    fontSize: 70
  },
  text: {
    color: colors.PRIMARY
  }
});

export default Upload;
