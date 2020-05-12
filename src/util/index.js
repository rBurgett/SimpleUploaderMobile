import { Alert } from 'react-native';

export const handleError = err => {
  console.error(err);
  Alert.alert(
    'Oops!',
    err.message
  );
};

export const getDownloadLink = (bucket, key) => `https://s3.amazonaws.com/${bucket}/${encodeURI(key)}`;
