import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Icon, Root } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import appReducer from './reducers/app-reducer';
import Upload from './components/upload';
import Files from './components/files';
import Settings from './components/settings';
import { colors, localStorageKeys } from './constants';
import { handleError } from './util';
import { setCredentials, setUploads } from './actions/app-actions';
import PermissionsController from './modules/permissions';
import UploadType from './types/upload';
import SplashScreen from 'react-native-splash-screen';

const combinedReducers = combineReducers({
  appState: appReducer
});

const store = createStore(combinedReducers);
// store.subscribe(() => {
//   const state = store.getState();
//   console.log('state', state.appState);
// });

const Tab = createBottomTabNavigator();


const App = () => {

  useEffect(() => {
    (async function() {
      try {

        await PermissionsController.checkAndRequestPermissions();

        const s3Bucket = await AsyncStorage.getItem(localStorageKeys.S3_BUCKET) || '';
        const accessKeyId = await AsyncStorage.getItem(localStorageKeys.ACCESS_KEY_ID) || '';
        const secretAccessKey = await AsyncStorage.getItem(localStorageKeys.SECRET_ACCESS_KEY) || '';
        const region = await AsyncStorage.getItem(localStorageKeys.REGION) || '';
        const uploads = await AsyncStorage.getItem(localStorageKeys.UPLOADS) || '[]';

        store.dispatch(setCredentials({
          s3Bucket,
          accessKeyId,
          secretAccessKey,
          region
        }));

        store.dispatch(setUploads(JSON.parse(uploads).map(u => new UploadType(u))));

        SplashScreen.hide();

      } catch(err) {
        handleError(err);
      }
    })();
  }, []);

  return (
    <Root>
      <Provider store={store}>
        <NavigationContainer>
          <Tab.Navigator
            style={{backgroundColor: colors.BACKGROUND}}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Upload') {
                  iconName = 'cloud-upload';
                } else if (route.name === 'Settings') {
                  iconName = 'settings';
                } else {
                  iconName = 'list';
                }
                return <Icon name={iconName} size={size} style={{color}} />;
              }
            })}
            tabBarOptions={{
              activeTintColor: colors.TEXT,
              inactiveTintColor: colors.PRIMARY,
              activeBackgroundColor: colors.PRIMARY,
              inactiveBackgroundColor: colors.BACKGROUND
            }}
          >
            <Tab.Screen name="Upload" component={Upload} />
            <Tab.Screen name="Files" component={Files} />
            <Tab.Screen name="Settings" component={Settings} />
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>
    </Root>
  );
};
export default App;
