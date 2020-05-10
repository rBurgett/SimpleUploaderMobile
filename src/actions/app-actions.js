import { appActions } from '../constants';

export const setCredentials = payload => ({
  type: appActions.SET_CREDENTIALS,
  payload
});
