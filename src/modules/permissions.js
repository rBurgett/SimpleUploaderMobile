import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

class PermissionsController {

  static iosPermissions = [
    [PERMISSIONS.IOS.PHOTO_LIBRARY]
  ];

  static androidPermissions = [
    [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE],
    [PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]
  ];

  static async checkAndRequestPermissions() {

    const permissionsToRequest = Platform.OS === 'ios' ? PermissionsController.iosPermissions : PermissionsController.androidPermissions;

    for(const [ permission ] of permissionsToRequest) {
      const res = await check(permission);
      if(res === RESULTS.BLOCKED) {
        console.log(`${permission} permission blocked.`);
      } else if(res === RESULTS.DENIED) {
        await request(permission);
      }
    }

  }

}

export default PermissionsController;
