class Path {

  static extPatt = /^.+(\.[^/]+)$/;
  static finalSlashPatt = /\/$/;

  dirname(filePath) {
    const { finalSlashPatt } = Path;
    filePath = filePath.trim();
    if(finalSlashPatt.test(filePath)) filePath = filePath.replace(finalSlashPatt, '');
    const dirPath = filePath.replace(/^(.*?)\/[^/]*$/, '$1');
    return dirPath ? dirPath : '/';
  }

  basename(filePath = '') {
    if(Path.finalSlashPatt.test(filePath)) filePath = filePath.replace(Path.finalSlashPatt, '');
    if(!filePath) return filePath;
    if(/^\//.test(filePath)) {
      return filePath.match(/\/([^/]+?)$/)[1];
    } else {
      return filePath.match(/([^/]+?)$/)[1];
    }
  }

  extname(filePath) {
    const { extPatt } = Path;
    filePath = filePath.trim();
    return extPatt.test(filePath) ? filePath.match(extPatt)[1] : '';
  }

}

const path = new Path();

export default path;
