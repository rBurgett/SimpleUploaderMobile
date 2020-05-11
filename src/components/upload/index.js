import { connect } from 'react-redux';
import Upload from './upload';

export default connect(
  ({ appState }) => ({
    s3Bucket: appState.s3Bucket,
    accessKeyId: appState.accessKeyId,
    secretAccessKey: appState.secretAccessKey,
    region: appState.region
  })
)(Upload);
