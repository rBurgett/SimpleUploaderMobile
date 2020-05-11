import React from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Container from '../shared/container';
import PageHeading from '../shared/page-heading';
import { colors } from '../../constants';
import { handleError } from '../../util';
import path from '../../modules/path';

const Upload = ({ s3Bucket, accessKeyId, secretAccessKey, region }) => {

  const disabled = !s3Bucket || !accessKeyId || !secretAccessKey || !region;

  const uploadFiles = async function(files) {
    try {
      if(files.length === 1) {
        const { uri } = files[0];
        const name = path.basename(uri);
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
        console.log('Confirmed', confirmed);
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
        console.log('Confirmed', confirmed);
        // for(let i = 0; i < files.length; i++) {
        //   const { uri } = files[i];
        //   const name = path.basename(uri);
        //   console.log(name);
        // }
      }
    } catch(err) {
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
              uploadFiles(results.map(f => ({ uri: f.uri })));
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
              });
              uploadFiles(results.map(f => ({ uri: f.path })));
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
  region: PropTypes.string
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
