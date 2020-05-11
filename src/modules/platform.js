import { Platform as RNPlatform } from 'react-native';

class Platform {

  static isAndroid() {
    return RNPlatform.OS === 'android';
  }

  static isIOS() {
    return RNPlatform.OS === 'ios';
  }

}

export default Platform;
