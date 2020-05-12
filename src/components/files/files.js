import React from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Body, Content, Icon, List, ListItem, Right, Text, Toast } from 'native-base';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import Clipboard from '@react-native-community/clipboard';
import Container from '../shared/container';
import PageHeading from '../shared/page-heading';
import { colors, localStorageKeys } from '../../constants';
import UploadType from '../../types/upload';
import path from '../../modules/path';
import { getDownloadLink, handleError } from '../../util';

const Files = ({ accessKeyId, secretAccessKey, region, s3Bucket, uploads, setUploads }) => {

  const onDelete = key => {
    const filename = path.basename(key);
    Alert.alert(
      'Confirm Delete',
      `Do you want to delete ${filename} from the S3 bucket?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          async onPress() {
            try {
              const s3 = new AWS.S3({
                accessKeyId,
                secretAccessKey,
                region
              });
              await new Promise((resolve, reject) => {
                const params = {
                  Bucket: s3Bucket,
                  Key: key
                };
                s3.deleteObject(params, (err, data) => {
                  if(err) reject(err);
                  else resolve(data);
                });
              });
              const newUploads = uploads
                .filter(u => u.key !== key);
              await AsyncStorage.setItem(localStorageKeys.UPLOADS, JSON.stringify(newUploads));
              setUploads(newUploads);
            } catch(err) {
              handleError(err);
            }
          }
        }
      ],
      {cancelable: true}
    );
  };

  const onCopy = key => {
    Clipboard.setString(getDownloadLink(s3Bucket, key));
    const filename = path.basename(key);
    Toast.show({
      text: `${filename} download link copied to clipboard.`,
      duration: 2500,
      position: 'top',
      type: 'success'
    });
  };

  return (
    <Container>
        <PageHeading />
        <View style={styles.main}>
          {uploads.length === 0 ?
            <View style={styles.noFilesContainer}>
              <Text style={styles.text}>You have not uploaded any files yet.</Text>
            </View>
            :
            <Content>
              <List style={styles.list}>
                {uploads
                  .sort((a, b) => a.date === b.date ? 0 : a.date > b.date ? -1 : 1)
                  .map(({ date, key }) => {
                    return (
                      <ListItem key={key}>
                        <Body><Text style={styles.bodyText}>{path.basename(key)}</Text></Body>
                        <Right>
                          <TouchableOpacity onPress={() => onDelete(key)}>
                            <Icon style={styles.trashIcon} name={'trash'} />
                          </TouchableOpacity>
                        </Right>
                        <Right>
                          <TouchableOpacity onPress={() => onCopy(key)}>
                            <Icon style={styles.copyIcon} name={'copy'} />
                          </TouchableOpacity>
                        </Right>
                      </ListItem>
                    );
                  })
                }
              </List>
            </Content>
          }
        </View>
    </Container>
  );
};
Files.propTypes = {
  accessKeyId: PropTypes.string,
  secretAccessKey: PropTypes.string,
  region: PropTypes.string,
  s3Bucket: PropTypes.string,
  uploads: PropTypes.arrayOf(PropTypes.instanceOf(UploadType)),
  setUploads: PropTypes.func
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column'
  },
  noFilesContainer: {
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: colors.TEXT
  },
  list: {
    paddingRight: 16
  },
  bodyText: {
    color: colors.TEXT
  },
  copyIcon: {
    color: colors.PRIMARY
  },
  trashIcon: {
    color: colors.DANGER
  }
});

export default Files;
