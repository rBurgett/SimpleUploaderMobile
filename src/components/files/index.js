import { connect } from 'react-redux';
import Files from './files';
import { setUploads } from '../../actions/app-actions';

export default connect(
  ({ appState }) => ({
    accessKeyId: appState.accessKeyId,
    secretAccessKey: appState.secretAccessKey,
    region: appState.region,
    s3Bucket: appState.s3Bucket,
    uploads: appState.uploads
  }),
  dispatch => ({
    setUploads: uploads => dispatch(setUploads(uploads))
  })
)(Files);
