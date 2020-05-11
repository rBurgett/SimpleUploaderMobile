import { appActions } from '../constants';

const getInitialState = () => ({
  s3Bucket: '',
  accessKeyId: '',
  secretAccessKey: '',
  region: '',
  uploads: [],
  uploading: false,
  compressing: false,
  uploadPercent: 0,
  compressPercent: 0
});

export default (state = getInitialState(), { type, payload }) => {
  switch(type) {
    case appActions.SET_CREDENTIALS:
      return {
        ...state,
        s3Bucket: payload.s3Bucket,
        accessKeyId: payload.accessKeyId,
        secretAccessKey: payload.secretAccessKey,
        region: payload.region
      };
    case appActions.SET_UPLOADS:
      return {
        ...state,
        uploads: payload
      };
    case appActions.SET_UPLOADING:
      return {
        ...state,
        uploading: payload
      };
    case appActions.SET_COMPRESSING:
      return {
        ...state,
        compressing: payload
      };
    case appActions.SET_UPLOAD_PERCENT:
      return {
        ...state,
        uploadPercent: payload
      };
    case appActions.SET_COMPRESS_PERCENT:
      return {
        ...state,
        compressPercent: payload
      };
    default:
      return state;
  }
};
