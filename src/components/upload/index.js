import { connect } from 'react-redux';
import Upload from './upload';
import {
  setCompressing,
  setCompressPercent,
  setUploading,
  setUploadPercent,
  setUploads
} from '../../actions/app-actions';

export default connect(
  ({ appState }) => ({
    s3Bucket: appState.s3Bucket,
    accessKeyId: appState.accessKeyId,
    secretAccessKey: appState.secretAccessKey,
    region: appState.region,
    uploads: appState.uploads,
    uploading: appState.uploading,
    compressing: appState.compressing,
    uploadPercent: appState.uploadPercent,
    compressPercent: appState.compressPercent
  }),
  dispatch => ({
    setUploads: uploads => dispatch(setUploads(uploads)),
    setUploading: uploading => dispatch(setUploading(uploading)),
    setCompressing: compressing => dispatch(setCompressing(compressing)),
    setUploadPercent: uploadPercent => dispatch(setUploadPercent(uploadPercent)),
    setCompressPercent: compressPercent => dispatch(setCompressPercent(compressPercent))
  })
)(Upload);
