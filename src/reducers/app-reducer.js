import { appActions } from '../constants';

const getInitialState = () => ({
  s3Bucket: '',
  accessKeyId: '',
  secretAccessKey: '',
  region: ''
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
    default:
      return state;
  }
};
