import React from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { H2, Icon, Text } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { RNS3 } from 'react-native-aws3';
import uuid from 'uuid';
import Container from '../shared/container';
import PageHeading from '../shared/page-heading';
import { colors, localStorageKeys } from '../../constants';
import { getDownloadLink, handleError } from '../../util';
import path from '../../modules/path';
import UploadType from '../../types/upload';
// import AWS from 'aws-sdk/dist/aws-sdk-react-native';
// import RNFetchBlob from 'rn-fetch-blob';

const Upload = ({ s3Bucket, accessKeyId, secretAccessKey, region, uploading, compressing, uploadPercent, uploads, setUploads, setUploading, setCompressing, setUploadPercent }) => {

  const disabled = !s3Bucket || !accessKeyId || !secretAccessKey || !region;

  const uploadFiles = async function(files) {
    try {
      if(files.length === 1) {
        const f = files[0];
        const { uri, type } = f;
        const ext = path.extname(uri);
        const initialExt = path.extname(f.name);
        const initialExtPatt = new RegExp(initialExt.replace('.', '\\.') + '$');
        const name = path.basename(f.name).replace(initialExtPatt, ext);
        const confirmed = await new Promise(resolve => {
          Alert.alert(
            'Confirm Upload',
            `Would you like to upload ${name}?`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => resolve(false)
              },
              {
                text: 'Upload',
                onPress: () => resolve(true)
              }
            ]
          );
        });
        if(!confirmed) return;
        setUploading(true);
        const fileToUpload = uri;
        const prefix = uuid.v4() + '/';
        const params = {
          keyPrefix: prefix,
          bucket: s3Bucket,
          region,
          accessKey: accessKeyId,
          secretKey: secretAccessKey,
          acl: 'public-read'
        };
        const promise =  RNS3.put({
          uri: fileToUpload,
          type,
          name
        }, params);
        promise.progress(({ loaded, total }) => {
          setUploadPercent(loaded / total);
        });
        await promise;
        const key = prefix + name;
        const upload = new UploadType({
          key,
          date: new Date().getTime()
        });
        const newUploads = [
          ...uploads,
          upload
        ];
        await AsyncStorage.setItem(localStorageKeys.UPLOADS, JSON.stringify(newUploads));
        setUploads(newUploads);
        const link = getDownloadLink(s3Bucket, key);
        Clipboard.setString(link);
        await Alert.alert(
          'Upload Complete!',
          'Download link copied to clipboard.'
        );
        setUploading(false);
      } else {
        const confirmed = await new Promise(resolve => {
          Alert.alert(
            'Confirm Upload',
            `Would you like to upload these ${files.length} files?`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => resolve(false)
              },
              {
                text: 'Upload',
                onPress: () => resolve(true)
              }
            ]
          );
        });
        // console.log('Confirmed', confirmed);
        // for(let i = 0; i < files.length; i++) {
        //   const { uri } = files[i];
        //   const name = path.basename(uri);
        //   console.log(name);
        // }
      }
    } catch(err) {
      setUploading(false);
      setCompressing(false);
      setUploadPercent(0);
      handleError(err);
    }
  };

  const onPress = () => {
    Alert.alert(
      'Select File Type',
      'Would you like to upload documents or photos/videos?',
      [
        {
          text: 'Documents',
          async onPress() {
            try {
              const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles]
              });
              // console.log(JSON.stringify(results, null, '  '));
              uploadFiles(results.map(f => ({name: f.name, uri: f.uri, type: f.type})));
            } catch(err) {
              // handleError(err);
            }
          }
        },
        {
          text: 'Photos',
          async onPress() {
            try {
              const results = await ImagePicker.openPicker({
                multiple: true,
                maxFiles: 200
                // writeTempFile: false
              });
              // console.log(JSON.stringify(results, null, '  '));
              uploadFiles(results.map(f => ({name: f.filename, uri: f.path, type: f.mime})));
            } catch(err) {
              // handleError(err);
            }
          }
        }
      ],
      {cancelable: true}
    );
    // try {
    //   const images = await ImagePicker.openPicker({
    //     multiple: true,
    //     maxFiles: 200
    //   });
    //   console.log(JSON.stringify(images, null, '  '));
    // } catch(err) {
    //   // handleError(err);
    // }
    // try {
    //   const results = await DocumentPicker.pickMultiple({
    //     type: [DocumentPicker.types.allFiles]
    //   });
    //   console.log(JSON.stringify(results, null, '  '));
    // } catch(err) {
    //   if(!DocumentPicker.isCancel(err)) handleError(err);
    // }
  };

  return (
    <Container>
      <PageHeading />
      <View style={styles.main}>
        {disabled ?
          <View style={styles.staticTextContainer}>
            <Text style={styles.staticText}>You must go to settings and add credentials before you can upload.</Text>
          </View>
          :
          uploading ?
            <View style={styles.staticTextContainer}>
              <H2 style={styles.staticText}>Uploading</H2>
              <H2 style={styles.staticText}>{`${(uploadPercent * 100).toFixed()}%`}</H2>
            </View>
            :
            compressing ?
              <View style={styles.staticTextContainer}>
                <Text style={styles.staticText}>You must go to settings and add credentials before you can upload.</Text>
              </View>
              :
              <TouchableOpacity style={styles.touchableOpacity} onPress={onPress}>
                <Icon name={'folder-open'} style={styles.icon} />
                <Text style={styles.text}>Select one or more files to upload</Text>
              </TouchableOpacity>
        }
      </View>
    </Container>
  );
};
Upload.propTypes = {
  s3Bucket: PropTypes.string,
  accessKeyId: PropTypes.string,
  secretAccessKey: PropTypes.string,
  region: PropTypes.string,
  uploading: PropTypes.bool,
  compressing: PropTypes.bool,
  uploadPercent: PropTypes.number,
  uploads: PropTypes.arrayOf(PropTypes.instanceOf(UploadType)),
  setUploads: PropTypes.func,
  setUploading: PropTypes.func,
  setCompressing: PropTypes.func,
  setUploadPercent: PropTypes.func
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
  },
  staticTextContainer: {
    maxWidth: '75%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  staticText: {
    color: colors.TEXT
  }
});

export default Upload;
