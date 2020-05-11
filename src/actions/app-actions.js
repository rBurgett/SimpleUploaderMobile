import { appActions } from '../constants';

export const setCredentials = payload => ({
  type: appActions.SET_CREDENTIALS,
  payload
});

export const setUploads = payload => ({
  type: appActions.SET_UPLOADS,
  payload
});

export const setUploading = payload => ({
  type: appActions.SET_UPLOADING,
  payload
});

export const setCompressing = payload => ({
  type: appActions.SET_COMPRESSING,
  payload
});

export const setUploadPercent = payload => ({
  type: appActions.SET_UPLOAD_PERCENT,
  payload
});
