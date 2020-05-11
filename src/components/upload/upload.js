import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { H2, Icon, Text } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { RNS3 } from 'react-native-aws3';
import uuid from 'uuid';
import RNFetchBlob from 'rn-fetch-blob';
import { zip, subscribe } from 'react-native-zip-archive';
import Container from '../shared/container';
import PageHeading from '../shared/page-heading';
import { colors, localStorageKeys } from '../../constants';
import { getDownloadLink, handleError } from '../../util';
import path from '../../modules/path';
import UploadType from '../../types/upload';
import Platform from '../../modules/platform';
// import AWS from 'aws-sdk/dist/aws-sdk-react-native';

const { fs } = RNFetchBlob;

const Upload = ({ s3Bucket, accessKeyId, secretAccessKey, region, uploading, compressing, uploadPercent, compressPercent, uploads, setUploads, setUploading, setCompressing, setUploadPercent, setCompressPercent }) => {

  useEffect(() => {
    const zipProgressListener = subscribe(({ progress }) => {
      setCompressPercent(progress);
    });
    return () => {
      zipProgressListener.remove();
    };
  });

  const disabled = !s3Bucket || !accessKeyId || !secretAccessKey || !region;

  const uploadFiles = async function(files) {
    try {
      let fileToUpload, name, type;
      if(files.length === 1) {
        const f = files[0];
        const { uri } = f;
        fileToUpload = uri;
        type = f.type;
        const ext = path.extname(uri);
        const initialExt = path.extname(f.name);
        const initialExtPatt = new RegExp(initialExt.replace('.', '\\.') + '$');
        name = path.basename(f.name).replace(initialExtPatt, ext);
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
            ],
            {cancelable: true}
          );
        });
        if(!confirmed) return;
        setUploading(true);
        // const prefix = uuid.v4() + '/';
        // const params = {
        //   keyPrefix: prefix,
        //   bucket: s3Bucket,
        //   region,
        //   accessKey: accessKeyId,
        //   secretKey: secretAccessKey,
        //   acl: 'public-read'
        // };
        // const promise =  RNS3.put({
        //   uri: fileToUpload,
        //   type,
        //   name
        // }, params);
        // promise.progress(({ loaded, total }) => {
        //   setUploadPercent(loaded / total);
        // });
        // await promise;
        // const key = prefix + name;
        // const upload = new UploadType({
        //   key,
        //   date: new Date().getTime()
        // });
        // const newUploads = [
        //   ...uploads,
        //   upload
        // ];
        // await AsyncStorage.setItem(localStorageKeys.UPLOADS, JSON.stringify(newUploads));
        // setUploads(newUploads);
        // const link = getDownloadLink(s3Bucket, key);
        // Clipboard.setString(link);
        // await Alert.alert(
        //   'Upload Complete!',
        //   'Download link copied to clipboard.'
        // );
        // setUploading(false);
        // setUploadPercent(0);
      } else {
        const confirmed = await new Promise(resolve => {
          Alert.alert(
            'Confirm Upload',
            `Would you like to zip and upload these ${files.length} files?`,
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
        const now = new Date().getTime();
        const tempDir = fs.dirs.CacheDir;
        const dirPath = tempDir + '/' + now;
        await fs.mkdir(dirPath);
        setCompressing(true);
        setUploading(true);
        for(let i = 0; i < files.length; i++) {
          const f = files[i];
          f.uri = f.uri.replace(/^file:\/\//, '');
          const { uri } = f;
          const ext = path.extname(uri);
          const initialExt = path.extname(f.name);
          const initialExtPatt = new RegExp(initialExt.replace('.', '\\.') + '$');
          const filename = path.basename(f.name).replace(initialExtPatt, ext);
          f.name = filename;
        }
        await Promise.all(files
          .map(f => fs.cp(f.uri, dirPath + '/' + f.name))
        );
        const zipPath = tempDir + '/' + now + '.zip';
        await zip(dirPath, zipPath);
        fileToUpload = zipPath;
        type = 'application/zip';
        name = path.basename(zipPath);
        setCompressing(false);
        setCompressPercent(0);
      }
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
      setUploadPercent(0);
    } catch(err) {
      setUploading(false);
      setCompressing(false);
      setUploadPercent(0);
      setCompressPercent(0);
      handleError(err);
    }
  };

  const onDocumentsPress = async function() {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles]
      });
      // console.log(JSON.stringify(results, null, '  '));
      uploadFiles(results.map(f => ({name: f.name, uri: f.uri, type: f.type})));
    } catch(err) {
      // handleError(err);
    }
  };

  const onPhotosPress = async function() {
    try {
      const results = await ImagePicker.openPicker({
        multiple: true,
        maxFiles: 200,
        compressImageQuality: 1
        // writeTempFile: false
      });
      // console.log(JSON.stringify(results, null, '  '));
      uploadFiles(results.map(f => {
        const uri = f.sourceURL || f.path;
        return {
          name: f.filename || path.basename(uri),
          uri,
          type: f.mime
        };
      }));
    } catch(err) {
      // handleError(err);
    }
  };

  const onPress = () => {
    if(Platform.isAndroid()) { // Android
      onDocumentsPress();
    } else { //iOS
      Alert.alert(
        'Select File Type',
        'Would you like to upload documents or photos/videos?',
        [
          {text: 'Documents', onPress: onDocumentsPress},
          {text: 'Photos', onPress: onPhotosPress}
        ],
        {cancelable: true}
      );
    }
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
          compressing ?
            <View style={styles.staticTextContainer}>
              <H2 style={styles.staticText}>Compressing</H2>
              <H2 style={styles.staticText}>{`${(compressPercent * 100).toFixed()}%`}</H2>
            </View>
            :
            uploading ?
              <View style={styles.staticTextContainer}>
                <H2 style={styles.staticText}>Uploading</H2>
                <H2 style={styles.staticText}>{`${(uploadPercent * 100).toFixed()}%`}</H2>
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
  compressPercent: PropTypes.number,
  uploads: PropTypes.arrayOf(PropTypes.instanceOf(UploadType)),
  setUploads: PropTypes.func,
  setUploading: PropTypes.func,
  setCompressing: PropTypes.func,
  setUploadPercent: PropTypes.func,
  setCompressPercent: PropTypes.func
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
    color: colors.TEXT,
    textAlign: 'center'
  }
});

export default Upload;
