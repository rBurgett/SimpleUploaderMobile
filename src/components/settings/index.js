import { connect } from 'react-redux';
import Settings from './settings';
import { setCredentials } from '../../actions/app-actions';

export default connect(
  ({ appState }) => ({
    savedS3Bucket: appState.s3Bucket,
    savedAccessKeyId: appState.accessKeyId,
    savedSecretAccessKey: appState.secretAccessKey,
    savedRegion: appState.region
  }),
  dispatch => ({
    setCredentials: data => dispatch(setCredentials(data))
  })
)(Settings);
