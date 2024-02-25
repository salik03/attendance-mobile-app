import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox, Platform, View } from 'react-native';
import QRScannerScreen from '../src/screens/QRScannerScreen';
// import MyWebView from '../src/screens/msalConfig';


const Stack = createNativeStackNavigator();
const ios = Platform.OS == 'ios';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function AppNavigation() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          contentStyle: {backgroundColor: 'transparent'}
          
        }}>
        {/* <Stack.Screen name="Auth" options={{headerShown: false}} component={MyWebView} /> */}
        <Stack.Screen name="QR Scanner Screen" options={{headerShown: false}} component={QRScannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
    
  }