import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { Button, Content, Form, Icon, Item, Label, Input, Text, Toast } from 'native-base';
import Color from 'color';
import omit from 'lodash/omit';
import AsyncStorage from '@react-native-community/async-storage';
import Container from '../shared/container';
import PageHeading from '../shared/page-heading';
import { colors, localStorageKeys } from '../../constants';
import { handleError } from '../../util';
import Platform from '../../modules/platform';

const TextInput = forwardRef((props,ref)  => {
  const { label, onChangeText = () => {} } = props;
  const inputProps = omit(props, ['style', 'label']);

  if(Platform.isIOS()) { // on iOS
    return (
      <Item stackedLabel>
        <Label style={styles.iosLabel}>{label}</Label>
        <Input ref={ref} style={styles.iosInput} {...inputProps} />
      </Item>
    );
  } else { // on Android
    const onPastePress = async function() {
      try {
        const res = await Clipboard.getString();
        onChangeText(res || '');
      } catch(err) {
        handleError(err);
      }
    };
    return (
      <View>
        <View style={styles.androidLabelView}>
          <Text style={styles.androidLabel}>{label}</Text>
          <View style={styles.pasteIconContainer}>
            <TouchableOpacity onPress={onPastePress}><Icon style={styles.pasteIcon} name={'clipboard'} /></TouchableOpacity>
          </View>
        </View>
        <Item>
          <Input ref={ref} style={styles.androidInput} {...inputProps} />
        </Item>
      </View>
    );
  }
});
TextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func
};

const Settings = ({ savedS3Bucket, savedAccessKeyId, savedSecretAccessKey, savedRegion, setCredentials }) => {

  const [ s3Bucket, setS3Bucket ] = useState(savedS3Bucket);
  const [ accessKeyId, setAccessKeyId ] = useState(savedAccessKeyId);
  const [ secretAccessKey, setSecretAccessKey ] = useState(savedSecretAccessKey);
  const [ region, setRegion ] = useState(savedRegion);

  const inputs = {};
  const setFocus = id => {
    inputs[id]._root.focus();
  };

  const onSave = async function() {
    try {
      await AsyncStorage.multiSet([
        [localStorageKeys.S3_BUCKET, s3Bucket.trim()],
        [localStorageKeys.ACCESS_KEY_ID, accessKeyId.trim()],
        [localStorageKeys.SECRET_ACCESS_KEY, secretAccessKey.trim()],
        [localStorageKeys.REGION, region.trim()]
      ]);
      Toast.show({
        text: 'Credentials successfully saved!',
        duration: 1500,
        position: 'top',
        type: 'success'
      });
    } catch(err) {
      handleError(err);
    }
    setCredentials({
      s3Bucket,
      accessKeyId,
      secretAccessKey,
      region
    });
  };

  // const disableSave = !s3Bucket || !accessKeyId || !secretAccessKey || !region;

  return (
    <Container>
      <PageHeading />
      <View style={styles.main}>
        <Content style={styles.content}>
          <Form>
            <TextInput
              ref={input => inputs.s3Bucket = input}
              blurOnSubmit={true}
              returnKeyType={'next'}
              onSubmitEditing={ () => setFocus('accessKeyId')}
              label={'S3 Bucket'} value={s3Bucket} onChangeText={val => setS3Bucket(val)} />
            <TextInput
              ref={input => inputs.accessKeyId = input}
              blurOnSubmit={true}
              returnKeyType={'next'}
              onSubmitEditing={ () => setFocus('secretAccessKey')}
              label={'Access Key ID'} value={accessKeyId} onChangeText={val => setAccessKeyId(val)} />
            <TextInput
              ref={input => inputs.secretAccessKey = input}
              blurOnSubmit={true}
              returnKeyType={'next'}
              secureTextEntry={true}
              onSubmitEditing={ () => setFocus('region')}
              label={'Secret Access Key'} value={secretAccessKey} onChangeText={val => setSecretAccessKey(val)} />
            <TextInput
              ref={input => inputs.region = input}
              blurOnSubmit={true}
              returnKeyType={'done'}
              label={'Region'} value={region} onChangeText={val => setRegion(val)} />
          </Form>
        </Content>
        <Button style={styles.button} onPress={onSave} full>
          <Text style={styles.buttonText}>Save Credentials</Text>
        </Button>
        {/*<Button disabled={disableSave} style={[styles.button, disableSave ? {opacity: .6} : {}]} onPress={onSave}>*/}
        {/*  <Text style={styles.buttonText}>Save Credentials</Text>*/}
        {/*</Button>*/}
      </View>
    </Container>
  );
};
Settings.propTypes = {
  savedS3Bucket: PropTypes.string,
  savedAccessKeyId: PropTypes.string,
  savedSecretAccessKey: PropTypes.string,
  savedRegion: PropTypes.string,
  setCredentials: PropTypes.func
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column'
  },
  content: {
    flex: 1,
    paddingRight: 16
  },
  iosLabel: {
    color: colors.TEXT
  },
  iosInput: {
    color: Color(colors.TEXT).darken(0.4)
  },
  androidLabel: {
    color: colors.TEXT
  },
  androidInput: {
    color: Color(colors.TEXT).darken(0.4),
    height: 40
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
    marginLeft: 8,
    marginRight: 8,
    justifyContent: 'center',
    backgroundColor: colors.PRIMARY
  },
  buttonText: {
    color: '#fff'
  },
  androidLabelView: {
    marginTop: 8,
    paddingLeft: 16,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  pasteIcon: {
    color: colors.PRIMARY,
    fontSize: 22
  },
  pasteIconContainer: {
    paddingLeft: 10
  }
});

export default Settings;
